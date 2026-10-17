/**
 * host.mjs の記録（raw/<id>.json）から、アプリのドライバ定義（defs/m-<id>.json）を作る。
 * 送る内容が検算で一致した動作だけを入れる。状態表示（フィードバック）・変数は受信の解析がプログラムなので入れない。
 */
import { deriveBytesAction, deriveHttpAction, MARKER_HOST } from './derive.mjs';

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
  const out = { id: String(f.id), label: String(f.label ?? f.id).slice(0, 80), type };
  if (f.default !== undefined && typeof f.default !== 'object') out.default = type === 'select' ? String(f.default) : f.default;
  if (type === 'select') out.choices = (f.choices ?? []).map((c) => ({ id: String(c.id), label: String(c.label ?? c.id).slice(0, 80) }));
  if (type === 'number') {
    if (typeof f.min === 'number') out.min = f.min;
    if (typeof f.max === 'number') out.max = f.max;
  }
  if (f.tooltip) out.help = String(f.tooltip).slice(0, 200);
  return { ...out, ...overrides };
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
 * @returns {{ def: object|null, report: object }}
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
  if (BUILTIN_REPLACES.has(m.id)) {
    report.result = 'builtin';
    return { def: null, report };
  }
  if (!ALLOWED_LICENSES.has(m.license)) {
    report.result = 'license';
    return { def: null, report };
  }
  if (raw.status !== 'ok' && raw.runs.length === 0) {
    report.result = 'failed';
    return { def: null, report };
  }

  // どの通信で送っているか（基準の実行で一番多いもの）
  const counts = { tcp: 0, udp: 0, http: 0 };
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
    const res = transport === 'http' ? deriveHttpAction(def, runs) : deriveBytesAction(def, runs, transport);
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
    const options = (def.options ?? []).map((o) => convertField(o)).filter(Boolean);
    const action = { id: String(def.id), name: String(def.name ?? def.id).slice(0, 80), options, send: res.send };
    if (Object.keys(res.maps).length > 0) action.maps = res.maps;
    actions.push(action);
  }
  report.converted = actions.length;
  if (actions.length === 0) {
    report.result = 'list-only';
    return { def: null, report };
  }

  // 接続の設定：目印の IP が入った欄を host、送り先のポートと同じ値の欄を port にする
  const configFields = [];
  let hostId = null;
  let portId = null;
  for (const f of raw.configFields) {
    if (raw.config[f.id] === MARKER_HOST && !hostId) hostId = f.id;
    else if (port !== null && f.type === 'number' && Number(raw.config[f.id]) === port && !portId) portId = f.id;
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
    configFields.push({ id: 'host', label: 'IP アドレス', type: 'text', placeholder: '192.168.0.10', pattern: '^[A-Za-z0-9.:\\-]+$', mono: true });
    configFields.push({ id: 'port', label: 'ポート', type: 'number', default: port, min: 1, max: 65535 });
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

  const def = {
    format: 1,
    id: `m-${m.id}`,
    name: report.name,
    category: m.manufacturer || 'その他',
    version: String(m.version ?? '0.0.0'),
    minAppVersion: APP_MIN_VERSION,
    transport,
    configFields,
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
  return { def, report };
}
