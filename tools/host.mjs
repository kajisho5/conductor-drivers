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

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const MARKER_HOST = '10.11.12.13';
const LIMITS = {
  registerMs: 15000,
  callMs: 5000,
  idleMs: 2500,
  settleQuietMs: 120,
  settleMinMs: 60,
  settleMaxMs: 1500,
  moduleMs: Number(process.env.MODULE_TIME_LIMIT_MS || 8 * 60 * 1000),
  maxRuns: 1500,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function listen(server) {
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
}

/** 受け皿（TCP は読み捨て、HTTP は 200 {} を返す） */
async function startSinks(onCapture) {
  const sockets = new Set();
  const tcp = createTcpServer((s) => {
    sockets.add(s);
    s.on('data', () => undefined);
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
  for (const f of fields ?? []) {
    if (!f || !f.id) continue;
    const looksHost =
      f.type === 'textinput' &&
      (/^(host|ip|ipaddress|address|ip_address|hostname|server)$/i.test(f.id) ||
        /ip|host/i.test(f.label ?? '') ||
        String(f.regex ?? '').includes('25[0-5]'));
    if (looksHost) config[f.id] = MARKER_HOST;
    else if (f.default !== undefined) config[f.id] = f.default;
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
  const capture = (ev) => bucket.push(ev);
  const sinks = await startSinks(capture);

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
    await call('init', { label: 'conn1', isFirstInit: false, config: out.config, secrets: {}, lastUpgradeIndex: 9999 }, 20000);
    await sleep(LIMITS.idleMs);
    out.initSends = bucket.filter((e) => e.t !== 'tcp-connect');
    out.connects = bucket.filter((e) => e.t === 'tcp-connect');
    const background = new Set(out.initSends.map((e) => `${e.t}|${e.hex ?? `${e.method} ${e.url} ${e.body}`}`));

    const plan = planRuns(out.actionDefs, { maxRuns: LIMITS.maxRuns });
    out.truncated = plan.truncated;
    let n = 0;
    for (const item of plan.runs) {
      if (deadline()) {
        out.truncated = true;
        break;
      }
      bucket = [];
      let error;
      try {
        const res = await call('executeAction', {
          action: { id: `act${++n}`, controlId: 'bank:1-1', actionId: item.actionId, options: item.options },
          surfaceId: undefined,
        });
        if (res && res.success === false) error = res.errorMessage ?? 'failed';
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
      }
      await settle();
      const sends = bucket.filter((e) => e.t !== 'tcp-connect' && !background.has(`${e.t}|${e.hex ?? `${e.method} ${e.url} ${e.body}`}`));
      const connects = bucket.filter((e) => e.t === 'tcp-connect');
      out.runs.push({ actionId: item.actionId, role: item.role, optionId: item.optionId, options: item.options, sends, connects, error });
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
