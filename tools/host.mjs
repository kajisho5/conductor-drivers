/**
 * 1 つのモジュールを動かして、定義と「動作を実行した時に送った内容」を記録する。
 *   node tools/host.mjs <モジュールのフォルダ> <出力 JSON>
 * モジュールは子プロセス（IPC）で動かし、外への通信は tools/capture.cjs で横取りする（実機には何も送らない）。
 * 通信の取り決めは公開 OSS の @companion-module/base（MIT）の IpcWrapper に合わせている：
 *   { direction: 'call', name, payload: EJSON 文字列, callbackId } / { direction: 'response', callbackId, success, payload }
 */
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createTcpServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import EJSON from './ejson.mjs';
import { planRuns } from './plan.mjs';
import { responderFor } from './responders.mjs';
import { parseUpgrade, readFrames, upgradeResponse } from './ws.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const MARKER_HOST = '10.11.12.13';
const LIMITS = {
  registerMs: 15000,
  callMs: 5000,
  idleMs: 2500,
  settleQuietMs: 120,
  settleMinMs: 60,
  settleMaxMs: 1500,
  moduleMs: Number(process.env.MODULE_TIME_LIMIT_MS || 15 * 60 * 1000),
  maxRuns: 4000,
  actionMs: 2500,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 初期化中に送っていたもの（定期的な問い合わせ）と同じかを見る鍵 */
function sendKey(e) {
  if (e.t === 'http') return `http|${e.method} ${e.url} ${e.body}`;
  if (e.t === 'ws') return `ws|${e.url}|${e.text ?? e.hex}`;
  return `${e.t}|${e.hex}`;
}

function listen(server) {
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
}

/** 受け皿（TCP は読み捨て、HTTP は 200 {} を返す） */
async function startSinks(onCapture, responder) {
  const sockets = new Set();
  const tcp = createTcpServer((s) => {
    sockets.add(s);
    let buf = '';
    if (responder?.onConnect) {
      const hello = responder.onConnect();
      if (hello) setTimeout(() => s.write(hello), 20);
    }
    let wsChecked = false;
    s.on('data', (d) => {
      if (!wsChecked) {
        wsChecked = true;
        const up = parseUpgrade(d.toString('latin1'));
        if (up) {
          // WebSocket の握手に応じる（中身の記録は capture.cjs の書き込み記録から読む）
          s.write(upgradeResponse(up.key));
          return;
        }
      }
      if (!responder?.onLine) return;
      buf += d.toString('latin1');
      const parts = buf.split(responder.split ?? /\r?\n/);
      buf = parts.pop() ?? '';
      for (const line of parts) {
        const r = responder.onLine(line);
        if (r) s.write(r);
      }
    });
    s.on('error', () => undefined);
    s.on('close', () => sockets.delete(s));
  });
  const httpServer = createHttpServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      const headers = {};
      for (const [k, v] of Object.entries(req.headers)) {
        if (k === 'x-capture-url' || k === 'host' || k === 'connection' || k === 'content-length') continue;
        headers[k] = Array.isArray(v) ? v.join(', ') : String(v);
      }
      onCapture({
        t: 'http',
        method: req.method,
        url: String(req.headers['x-capture-url'] ?? req.url),
        headers,
        body,
        at: Date.now(),
      });
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end('{}');
    });
  });
  // http.request 経由の WebSocket：握手に応じて、届いたフレームを記録する
  httpServer.on('upgrade', (req, socket, head) => {
    sockets.add(socket);
    const url = String(req.headers['x-capture-url'] ?? req.url);
    socket.write(upgradeResponse(String(req.headers['sec-websocket-key'] ?? '')));
    let buf = Buffer.from(head ?? []);
    const state = { parts: [], opcode: 0 };
    const take = () => {
      const r = readFrames(buf, state);
      buf = Buffer.from(r.rest);
      for (const m of r.messages) onCapture({ t: 'ws', url, ...m, at: Date.now() });
    };
    take();
    socket.on('data', (d) => {
      buf = Buffer.concat([buf, d]);
      take();
    });
    socket.on('error', () => undefined);
    socket.on('close', () => sockets.delete(socket));
  });
  const tcpPort = await listen(tcp);
  const httpPort = await listen(httpServer);
  return {
    tcpPort,
    httpPort,
    close() {
      for (const s of sockets) s.destroy();
      tcp.close();
      httpServer.closeAllConnections?.();
      httpServer.close();
    },
  };
}

/** 設定の既定値。IP らしい欄には目印の IP を入れる */
export function buildConfig(fields) {
  const config = {};
  let nextPort = 9000;
  for (const f of fields ?? []) {
    if (!f || !f.id) continue;
    const label = String(f.label ?? '');
    const looksHost =
      f.type === 'textinput' &&
      (/^(host|ip|ipaddress|address|ip_address|hostname|server)$/i.test(f.id) ||
        /\b(ip|host|hostname)\b/i.test(label) ||
        String(f.regex ?? '').includes('25[0-5]'));
    const looksPort = /port/i.test(f.id) || /\bport\b/i.test(label);
    const empty = f.default === undefined || f.default === '' || f.default === null;
    if (looksHost) config[f.id] = MARKER_HOST;
    else if (looksPort && empty && (f.type === 'textinput' || f.type === 'number')) {
      // 空のポート欄があると接続しないモジュールがあるので、仮の番号を入れる
      config[f.id] = f.type === 'number' ? nextPort : String(nextPort);
      nextPort += 1;
    } else if (!empty) config[f.id] = f.default;
    else if (f.type === 'checkbox') config[f.id] = false;
    else if (f.type === 'number') config[f.id] = f.min ?? 0;
    else if (f.type === 'dropdown') config[f.id] = f.choices?.[0]?.id;
    else if (f.type === 'textinput') config[f.id] = '';
  }
  return config;
}

export async function runModule(moduleDir, { log = () => undefined } = {}) {
  const started = Date.now();
  const manifestPath = path.join(moduleDir, 'companion', 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const entry = path.resolve(path.dirname(manifestPath), manifest.runtime?.entrypoint ?? '../main.js');
  const out = {
    module: {
      id: manifest.id,
      name: manifest.name,
      version: manifest.version,
      license: manifest.license,
      repository: manifest.repository,
      manufacturer: manifest.manufacturer,
      products: manifest.products,
      keywords: manifest.keywords,
      maintainers: (manifest.maintainers ?? []).map((m) => m.name).filter(Boolean),
      apiVersion: manifest.runtime?.apiVersion,
    },
    status: 'started',
    errors: [],
    configFields: [],
    config: {},
    connects: [],
    initSends: [],
    actionDefs: [],
    feedbackDefs: [],
    variableDefs: [],
    presetDefs: [],
    runs: [],
    truncated: false,
  };

  let bucket = [];
  /** TCP で直接 WebSocket を話すモジュール：握手を見つけたら、その接続の書き込みをフレームとして読む */
  const wsSockets = new Map();
  const capture = (ev) => {
    if (ev.t === 'tcp' && ev.sock !== undefined) {
      const known = wsSockets.get(ev.sock);
      const bytes = Buffer.from(ev.hex, 'hex');
      if (!known) {
        const up = parseUpgrade(bytes.toString('latin1'));
        if (up) {
          const st = { url: `ws://${ev.host}:${ev.port}${up.path}`, buf: bytes.subarray(up.headerLength), state: { parts: [], opcode: 0 } };
          wsSockets.set(ev.sock, st);
          bucket.push({ t: 'ws-open', url: st.url, at: ev.at });
          return;
        }
      } else {
        known.buf = Buffer.concat([known.buf, bytes]);
        const r = readFrames(known.buf, known.state);
        known.buf = Buffer.from(r.rest);
        for (const m of r.messages) bucket.push({ t: 'ws', url: known.url, ...m, at: ev.at });
        return;
      }
    }
    bucket.push(ev);
  };
  const sinks = await startSinks(capture, responderFor(manifest.id));

  const child = spawn(process.execPath, ['--require', path.join(HERE, 'capture.cjs'), entry], {
    cwd: moduleDir,
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    env: {
      PATH: process.env.PATH,
      NODE_ENV: 'production',
      MODULE_MANIFEST: manifestPath,
      CONNECTION_ID: 'conn1',
      VERIFICATION_TOKEN: 'token1',
      CAPTURE_TCP_PORT: String(sinks.tcpPort),
      CAPTURE_HTTP_PORT: String(sinks.httpPort),
    },
  });
  let stderr = '';
  child.stdout.on('data', () => undefined);
  child.stderr.on('data', (d) => {
    if (stderr.length < 4000) stderr += d.toString();
  });
  let exited = null;
  child.on('exit', (code, signal) => {
    exited = { code, signal };
  });

  let nextId = 1;
  const pending = new Map();
  let registered;
  const registeredP = new Promise((r) => (registered = r));

  const reply = (callbackId, payload, success = true) => {
    if (!callbackId || !child.connected) return;
    child.send({ direction: 'response', callbackId, success, payload: payload === undefined ? undefined : EJSON.stringify(payload) });
  };

  const call = (name, payload, timeoutMs = LIMITS.callMs) =>
    new Promise((resolve, reject) => {
      if (!child.connected) {
        reject(new Error('module exited'));
        return;
      }
      const callbackId = nextId++;
      const timer = setTimeout(() => {
        pending.delete(callbackId);
        reject(new Error(`${name} timed out`));
      }, timeoutMs);
      pending.set(callbackId, { resolve, reject, timer });
      child.send({ direction: 'call', name, payload: EJSON.stringify(payload), callbackId });
    });

  child.on('message', (msg) => {
    if (msg && msg.__capture) {
      capture(msg.__capture);
      return;
    }
    if (!msg || typeof msg !== 'object') return;
    if (msg.direction === 'response') {
      const p = pending.get(msg.callbackId);
      if (!p) return;
      pending.delete(msg.callbackId);
      clearTimeout(p.timer);
      let payload;
      try {
        payload = msg.payload ? EJSON.parse(msg.payload) : undefined;
      } catch {
        payload = undefined;
      }
      if (msg.success) p.resolve(payload);
      else p.reject(new Error(payload?.message ?? 'call failed'));
      return;
    }
    if (msg.direction !== 'call') return;
    let payload;
    try {
      payload = msg.payload ? EJSON.parse(msg.payload) : undefined;
    } catch {
      payload = undefined;
    }
    switch (msg.name) {
      case 'register':
        reply(msg.callbackId, {});
        registered(payload);
        return;
      case 'setActionDefinitions':
        out.actionDefs = payload?.actions ?? [];
        break;
      case 'setFeedbackDefinitions':
        out.feedbackDefs = payload?.feedbacks ?? [];
        break;
      case 'setVariableDefinitions':
        out.variableDefs = payload?.variables ?? [];
        break;
      case 'setPresetDefinitions':
        out.presetDefs = payload?.presets ?? [];
        break;
      case 'parseVariablesInString':
        reply(msg.callbackId, { text: payload?.text ?? '', variableIds: [] });
        return;
      case 'sharedUdpSocketJoin':
        reply(msg.callbackId, 'shared1');
        return;
      case 'sharedUdpSocketSend': {
        const bytes = payload?.message;
        const buf = bytes instanceof Uint8Array ? Buffer.from(bytes) : Buffer.from(String(bytes ?? ''));
        capture({ t: 'udp', host: String(payload?.address ?? ''), port: Number(payload?.port ?? 0), hex: buf.toString('hex'), at: Date.now() });
        break;
      }
      default:
        break;
    }
    reply(msg.callbackId, undefined);
  });

  const deadline = () => Date.now() - started > LIMITS.moduleMs;

  /** 最後の送信から quietMs 何も来なければ終わり */
  const settle = async () => {
    const t0 = Date.now();
    let lastLen = bucket.length;
    let lastChange = Date.now();
    for (;;) {
      await sleep(20);
      if (bucket.length !== lastLen) {
        lastLen = bucket.length;
        lastChange = Date.now();
      }
      const now = Date.now();
      if (now - t0 >= LIMITS.settleMinMs && now - lastChange >= LIMITS.settleQuietMs) return;
      if (now - t0 >= LIMITS.settleMaxMs) return;
    }
  };

  try {
    await Promise.race([
      registeredP,
      sleep(LIMITS.registerMs).then(() => {
        throw new Error('module did not register');
      }),
    ]);
    const cfg = await call('getConfigFields', {});
    out.configFields = cfg?.fields ?? [];
    out.config = buildConfig(out.configFields);
    bucket = [];
    await call('init', { label: 'conn1', isFirstInit: false, config: out.config, secrets: {}, lastUpgradeIndex: 9999, actions: {}, feedbacks: {} }, 20000);
    await sleep(LIMITS.idleMs);
    out.initSends = bucket.filter((e) => e.t !== 'tcp-connect' && e.t !== 'ws-open');
    out.connects = bucket.filter((e) => e.t === 'tcp-connect' || e.t === 'ws-open');
    const background = new Set(out.initSends.map(sendKey));

    const plan = planRuns(out.actionDefs, { maxRuns: LIMITS.maxRuns });
    out.truncated = plan.truncated;
    let n = 0;
    /** 基準の実行で何も送らない・失敗した動作は、値を変えても同じなので残りを飛ばす */
    let skipAction = null;
    for (const item of plan.runs) {
      if (deadline()) {
        out.truncated = true;
        break;
      }
      if (item.actionId === skipAction) continue;
      bucket = [];
      let error;
      try {
        const res = await call(
          'executeAction',
          {
            action: { id: `act${++n}`, controlId: 'bank:1-1', actionId: item.actionId, options: item.options },
            surfaceId: undefined,
          },
          LIMITS.actionMs,
        );
        if (res && res.success === false) error = res.errorMessage ?? 'failed';
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
      }
      await settle();
      const sends = bucket.filter((e) => e.t !== 'tcp-connect' && e.t !== 'ws-open' && !background.has(sendKey(e)));
      const connects = bucket.filter((e) => e.t === 'tcp-connect' || e.t === 'ws-open');
      out.runs.push({ actionId: item.actionId, role: item.role, optionId: item.optionId, options: item.options, sends, connects, error });
      if (item.role === 'base' && (error || sends.length === 0)) skipAction = item.actionId;
      if (exited) throw new Error(`module exited (${exited.code ?? exited.signal})`);
    }
    out.status = 'ok';
  } catch (e) {
    out.status = 'error';
    out.errors.push(e instanceof Error ? e.message : String(e));
  } finally {
    try {
      if (child.connected) await call('destroy', {}, 2000).catch(() => undefined);
    } catch {
      // 無視
    }
    child.kill('SIGKILL');
    sinks.close();
  }
  if (stderr) out.stderr = stderr.slice(0, 4000);
  out.elapsedMs = Date.now() - started;
  log(`${manifest.id}: ${out.status} actions=${out.actionDefs.length} runs=${out.runs.length} ${out.elapsedMs}ms`);
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const [moduleDir, outFile] = process.argv.slice(2);
  const res = await runModule(path.resolve(moduleDir), { log: (s) => console.log(s) });
  writeFileSync(outFile, JSON.stringify(res));
  process.exit(0);
}
