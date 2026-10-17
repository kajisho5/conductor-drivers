/**
 * host.mjs の記録（raw/<id>.json）から、アプリのドライバ定義（defs/m-<id>.json）を作る。
 * 送る内容が検算で一致した動作だけを入れる。状態表示（フィードバック）・変数は受信の解析がプログラムなので入れない。
 */
import { deriveBytesAction, deriveHttpAction, MARKER_HOST } from './derive.mjs';

/**
 * 1 つの動作のテンプレートを作る。UDP の複数の通・HTTP の複数のリクエストは、順番ごとに作って send と more に分ける。
 */
export function deriveAction(def, runs, transport) {
  const one = (rs) => (transport === 'http' ? deriveHttpAction(def, rs) : deriveBytesAction(def, rs, transport));
  const first = one(runs);
  if (first.ok || !/multi-(datagram|request)/.test(String(first.reason))) return first;
  const base = runs.find((r) => r.role === 'base');
  const n = base.sends.length;
  if (n < 2 || n > 8) return first;
  const parts = [];
  for (let i = 0; i < n; i++) {
    const sub = runs.map((r) => (r.sends.length === n ? { ...r, sends: [r.sends[i]] } : { ...r, sends: r.sends.length === 0 ? [] : r.sends }));
    const res = one(sub);
    if (!res.ok) return { ok: false, reason: `part${i}-${res.reason}` };
    parts.push(res);
  }
  const maps = {};
  for (const p of parts) {
    for (const [k, v] of Object.entries(p.maps)) {
      if (maps[k] && JSON.stringify(maps[k]) !== JSON.stringify(v)) return { ok: false, reason: 'parts-map-differs' };
      maps[k] = v;
    }
    if (transport !== 'http' && p.port !== parts[0].port) return { ok: false, reason: 'parts-port-differs' };
    if (transport === 'http' && p.origin !== parts[0].origin) return { ok: false, reason: 'parts-origin-differs' };
  }
  return { ...parts[0], send: parts[0].send, more: parts.slice(1).map((p) => p.send), maps };
}

export const ALLOWED_LICENSES = new Set(['MIT', 'ISC', 'BSD-2-Clause', 'BSD-3-Clause', 'Apache-2.0', '0BSD', 'Unlicense']);
export const APP_MIN_VERSION = '0.6.0';

/** アプリに組み込みの定義がある機器（取り込まない） */
export const BUILTIN_REPLACES = new Set(['bmd-atem', 'roland-v160hd', 'roland-v80hd', 'roland-vr120hd']);

function fieldType(t) {
  switch (t) {
    case 'textinput':
    case 'secret-text':
      return 'text';
    case 'number':
      return 'number';
    case 'dropdown':
      return 'select';
    case 'checkbox':
      return 'boolean';
    default:
      return null;
  }
}

function convertField(f, overrides = {}) {
  const type = fieldType(f.type);
  if (!type) return null;
  const choices = type === 'select' ? (f.choices ?? []).filter((c) => c && c.id !== undefined).map((c) => ({ id: String(c.id), label: String(c.label ?? c.id).slice(0, 80) })) : [];
  const t = type === 'select' && choices.length === 0 ? 'text' : type;
  const out = { id: String(f.id), label: String(f.label || f.id).slice(0, 80), type: t };
  if (f.default !== undefined && f.default !== null && typeof f.default !== 'object') out.default = t === 'select' || t === 'text' ? String(f.default) : f.default;
  if (t === 'select') out.choices = choices;
  if (t === 'number') {
    if (typeof f.min === 'number') out.min = f.min;
    if (typeof f.max === 'number') out.max = f.max;
  }
  if (f.tooltip) out.help = String(f.tooltip).slice(0, 200);
  return { ...out, ...overrides };
}

/** 同じ id の欄が 2 つあれば後のものを捨てる（アプリの検証で重複を通さないため） */
function uniqueFields(fields) {
  const seen = new Set();
  return fields.filter((f) => {
    if (!f || seen.has(f.id)) return false;
    seen.add(f.id);
    return true;
  });
}

/** アプリの定義 id に使える形（小文字・英数字・-_.） */
export function defId(moduleId) {
  return `m-${String(moduleId).toLowerCase().replace(/[^a-z0-9_.-]/g, '-')}`;
}

function colorHex(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return undefined;
  return `#${(n & 0xffffff).toString(16).padStart(6, '0')}`;
}

function stripVariables(text) {
  return String(text ?? '')
    .replace(/\$\([^)]*\)/g, '')
    .replace(/\\n/g, '\n')
    .trim();
}

function displayName(m) {
  const products = (m.products ?? []).filter(Boolean);
  const maker = m.manufacturer && m.manufacturer !== 'Generic' ? m.manufacturer : '';
  const prod = products.length > 0 ? products.join(' / ') : m.name;
  const name = maker && !prod.toLowerCase().startsWith(maker.toLowerCase()) ? `${maker} ${prod}` : prod;
  return name.length > 80 ? `${name.slice(0, 77)}…` : name;
}

/**
 * @returns {{ def: object|null, builtin?: object, report: object }}
 */
export function convertModule(raw) {
  const m = raw.module;
  const report = {
    id: m.id,
    name: displayName(m),
    manufacturer: m.manufacturer,
    license: m.license,
    status: raw.status,
    actions: raw.actionDefs.length,
    converted: 0,
    reasons: {},
    errors: raw.errors,
    truncated: raw.truncated,
  };
  if (!ALLOWED_LICENSES.has(m.license)) {
    report.result = 'license';
    return { def: null, report };
  }
  if (raw.status !== 'ok' && raw.runs.length === 0) {
    report.result = 'failed';
    return { def: null, report };
  }

  // どの通信で送っているか（基準の実行で一番多いもの）
  const counts = { tcp: 0, udp: 0, http: 0, ws: 0 };
  for (const r of raw.runs) if (r.role === 'base') for (const s of r.sends) if (counts[s.t] !== undefined) counts[s.t]++;
  const proto = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!proto || proto[1] === 0) {
    report.result = 'no-send';
    return { def: null, report };
  }
  const transport = proto[0];

  const actions = [];
  const byAction = new Map();
  for (const r of raw.runs) {
    if (!byAction.has(r.actionId)) byAction.set(r.actionId, []);
    byAction.get(r.actionId).push(r);
  }
  let port = null;
  let origin = null;
  for (const def of raw.actionDefs) {
    const runs = byAction.get(def.id);
    if (!runs) {
      report.reasons['not-run'] = (report.reasons['not-run'] ?? 0) + 1;
      continue;
    }
    const res = deriveAction(def, runs, transport);
    if (!res.ok) {
      const key = String(res.reason).split(':')[0];
      report.reasons[key] = (report.reasons[key] ?? 0) + 1;
      continue;
    }
    if (transport !== 'http') {
      if (port === null) port = res.port;
      else if (port !== res.port) {
        report.reasons['port-differs'] = (report.reasons['port-differs'] ?? 0) + 1;
        continue;
      }
    } else {
      if (origin === null) origin = res.origin;
      else if (origin !== res.origin) {
        report.reasons['origin-differs'] = (report.reasons['origin-differs'] ?? 0) + 1;
        continue;
      }
    }
    const options = uniqueFields((def.options ?? []).map((o) => convertField(o)).filter(Boolean));
    const action = { id: String(def.id), name: String(def.name ?? def.id).slice(0, 80), options, send: res.send };
    if (res.more && res.more.length > 0) action.more = res.more;
    if (Object.keys(res.maps).length > 0) action.maps = res.maps;
    actions.push(action);
  }
  report.converted = actions.length;
  if (actions.length === 0) {
    report.result = 'list-only';
    return { def: null, report };
  }

  // 接続の設定：目印の IP が入った欄を host、送り先のポートと同じ値の欄を port にする
  // WebSocket：送り先の URL（ws://host:port/path）をホスト・ポート・パスに分ける
  let wsPath;
  let wsDefaultHost;
  if (transport === 'ws') {
    try {
      const u = new URL(String(port));
      wsPath = u.pathname + u.search;
      port = Number(u.port) || 80;
      if (u.hostname !== MARKER_HOST) wsDefaultHost = u.hostname;
    } catch {
      report.result = 'list-only';
      return { def: null, report };
    }
  }
  const configFields = [];
  let hostId = null;
  let portId = null;
  for (const f of raw.configFields) {
    if (raw.config[f.id] === MARKER_HOST && !hostId) hostId = f.id;
    else if (port !== null && (f.type === 'number' || f.type === 'textinput') && raw.config[f.id] !== '' && Number(raw.config[f.id]) === port && !portId) portId = f.id;
  }
  if (transport === 'http') {
    const sameHost = origin && new URL(origin).hostname === MARKER_HOST;
    configFields.push({
      id: 'baseUrl',
      label: 'URL の先頭',
      type: 'text',
      default: sameHost ? origin.replace(MARKER_HOST, '192.168.0.10') : origin,
      placeholder: 'http://192.168.0.10',
      mono: true,
    });
  } else {
    configFields.push({
      id: 'host',
      label: 'IP アドレス',
      type: 'text',
      placeholder: '192.168.0.10',
      pattern: '^[A-Za-z0-9.:\\-]+$',
      mono: true,
      ...(wsDefaultHost ? { default: wsDefaultHost } : {}),
    });
    // 元の設定でポートが空欄だった時は、記録用に入れた仮の番号なので既定値にしない
    const portField = raw.configFields.find((f) => f.id === portId);
    const portBlank = portField && (portField.default === undefined || portField.default === '' || portField.default === null);
    configFields.push({
      id: 'port',
      label: 'ポート',
      type: 'number',
      ...(portBlank ? { help: '機器の説明書にあるポート番号を入れてください' } : { default: port }),
      min: 1,
      max: 65535,
    });
  }
  for (const f of raw.configFields) {
    if (f.id === hostId || f.id === portId) continue;
    if (['host', 'port', 'baseUrl'].includes(String(f.id))) continue;
    const c = convertField(f);
    if (c) configFields.push(c);
  }

  // プリセット：押した時の動作が 1 つで、それを変換できたものだけ
  const presets = [];
  const known = new Set(actions.map((a) => a.id));
  for (const p of raw.presetDefs ?? []) {
    if (!p || p.type !== 'button') continue;
    const step = p.steps?.[0];
    const down = step?.down ?? [];
    if (down.length !== 1 || (step?.up ?? []).length > 0) continue;
    const a = down[0];
    if (!known.has(String(a.actionId))) continue;
    const text = stripVariables(p.style?.text) || String(p.name ?? '');
    presets.push({
      id: String(p.id),
      category: String(p.category ?? 'その他').slice(0, 60),
      name: String(p.name ?? text).slice(0, 80),
      text: text.slice(0, 40),
      ...(colorHex(p.style?.bgcolor) ? { backgroundColor: colorHex(p.style?.bgcolor) } : {}),
      action: { definitionId: String(a.actionId), options: a.options ?? {} },
    });
  }

  const finalConfig = uniqueFields(configFields);
  const def = {
    format: 1,
    id: defId(m.id),
    name: report.name,
    category: m.manufacturer || 'その他',
    version: String(m.version ?? '0.0.0'),
    minAppVersion: APP_MIN_VERSION,
    transport,
    ...(wsPath !== undefined ? { wsPath } : {}),
    configFields: finalConfig,
    actions,
    feedbacks: [],
    variables: [],
    ...(presets.length > 0 ? { presets } : {}),
    evidence: [
      {
        title: `公開 OSS のモジュールから自動変換（${m.license}）`,
        url: String(m.repository ?? '').replace(/^git\+/, '').replace(/\.git$/, ''),
        status: '推測',
        note: `送る内容だけを変換。実機では未確認。作者：${(m.maintainers ?? []).join(', ') || '不明'}`,
      },
    ],
    source: { module: m.id, version: m.version, license: m.license, maintainers: m.maintainers, repository: m.repository },
  };
  report.result = actions.length === raw.actionDefs.length ? 'full' : 'partial';
  // アプリに組み込みの定義がある機種：配信の一覧には入れず、組み込みの定義へ動作を足す材料として builtin/ に出す
  if (BUILTIN_REPLACES.has(m.id)) {
    report.result = 'builtin';
    return { def: null, builtin: def, report };
  }
  return { def, report };
}
