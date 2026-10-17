/**
 * 記録した「動作ごとの実行結果」から、送る内容のテンプレートを作って検算する。
 * 1. 基準（base）の送信を土台にする
 * 2. 選択肢を 1 つ変えた結果（variant）と比べて、その選択肢が入る場所（slot）と書き方（renderer）を探す
 * 3. 土台に slot を当ててテンプレートにし、記録した全部の実行（組み合わせを含む）を描き直して一致するか確かめる
 * 一致したものだけを「送れる動作」として出す。
 */
import { parseHex, renderTemplate, unescapeText } from './render.mjs';

export const MARKER_HOST = '10.11.12.13';

const enc = new TextEncoder();
const dec = new TextDecoder('utf-8', { fatal: true });

export function fromHex(hex) {
  return Uint8Array.from(Buffer.from(hex, 'hex'));
}

function eq(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function startsAt(hay, needle, p) {
  if (p < 0 || p + needle.length > hay.length) return false;
  for (let i = 0; i < needle.length; i++) if (hay[p + i] !== needle[i]) return false;
  return true;
}

function commonPrefix(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

function commonSuffix(a, b, limit) {
  let i = 0;
  while (i < a.length - limit && i < b.length - limit && a[a.length - 1 - i] === b[b.length - 1 - i]) i++;
  return i;
}

/** 数・文字を書き表す方法（テキストとバイナリ） */
const NUMBER_RENDERERS = [
  { id: 'dec', filters: [], text: true, f: (v) => enc.encode(String(v)) },
  { id: 'pad2', filters: ['pad2'], text: true, f: (v) => enc.encode(String(v).padStart(2, '0')) },
  { id: 'pad3', filters: ['pad3'], text: true, f: (v) => enc.encode(String(v).padStart(3, '0')) },
  { id: 'pad4', filters: ['pad4'], text: true, f: (v) => enc.encode(String(v).padStart(4, '0')) },
  { id: 'u8', filters: ['u8'], text: false, f: (v) => parseHex(renderTemplate('{{option.v|u8}}', { option: { v } })) },
  { id: 'u16be', filters: ['u16be'], text: false, f: (v) => parseHex(renderTemplate('{{option.v|u16be}}', { option: { v } })) },
  { id: 'u16le', filters: ['u16le'], text: false, f: (v) => parseHex(renderTemplate('{{option.v|u16le}}', { option: { v } })) },
  { id: 'u32be', filters: ['u32be'], text: false, f: (v) => parseHex(renderTemplate('{{option.v|u32be}}', { option: { v } })) },
  { id: 'u32le', filters: ['u32le'], text: false, f: (v) => parseHex(renderTemplate('{{option.v|u32le}}', { option: { v } })) },
  { id: 'f32be', filters: ['f32be'], text: false, f: (v) => parseHex(renderTemplate('{{option.v|f32be}}', { option: { v } })) },
];
const TEXT_RENDERERS = [{ id: 'text', filters: [], text: true, f: (v) => enc.encode(String(v)) }];

/**
 * base と variant の差から、選択肢の入る場所を探す。
 * 戻り値 { pos, len（base での長さ）, renderer } または null
 */
export function findSlot(baseBytes, baseValue, variants, renderers) {
  for (const r of renderers) {
    const rb = r.f(baseValue);
    // 基準の値が入っていそうな位置の候補（差が出た位置を含むもの）
    const v0 = variants[0];
    const rv0 = r.f(v0.value);
    const pre = commonPrefix(baseBytes, v0.bytes);
    const candidates = [];
    for (let p = Math.max(0, pre - rb.length); p <= Math.min(pre, baseBytes.length); p++) candidates.push(p);
    for (const p of candidates) {
      if (!startsAt(baseBytes, rb, p)) continue;
      let ok = true;
      for (const v of variants) {
        const rv = r.f(v.value);
        if (!startsAt(v.bytes, rv, p)) {
          ok = false;
          break;
        }
        if (!eq(baseBytes.subarray(0, p), v.bytes.subarray(0, p))) {
          ok = false;
          break;
        }
        if (!eq(baseBytes.subarray(p + rb.length), v.bytes.subarray(p + rv.length))) {
          ok = false;
          break;
        }
      }
      if (ok && rv0) return { pos: p, len: rb.length, renderer: r };
    }
  }
  return null;
}

/** 選択肢（dropdown / checkbox）：選んだものごとに違う「区間」を切り出す */
export function findSegments(baseBytes, baseValue, variants) {
  let pre = Infinity;
  let suf = Infinity;
  const diffs = variants.filter((v) => !eq(v.bytes, baseBytes));
  if (diffs.length === 0) return null;
  for (const v of diffs) {
    const p = commonPrefix(baseBytes, v.bytes);
    pre = Math.min(pre, p);
  }
  for (const v of diffs) {
    const s = commonSuffix(baseBytes, v.bytes, pre);
    suf = Math.min(suf, s);
  }
  const map = { [String(baseValue)]: baseBytes.subarray(pre, baseBytes.length - suf) };
  for (const v of variants) {
    if (v.bytes.length - suf < pre) return null;
    if (!eq(v.bytes.subarray(0, pre), baseBytes.subarray(0, pre))) return null;
    if (!eq(v.bytes.subarray(v.bytes.length - suf), baseBytes.subarray(baseBytes.length - suf))) return null;
    map[String(v.value)] = v.bytes.subarray(pre, v.bytes.length - suf);
  }
  return { pos: pre, len: baseBytes.length - suf - pre, map };
}

function printable(bytes) {
  for (const b of bytes) {
    if (b === 9 || b === 10 || b === 13) continue;
    if (b < 32 || b === 127) return false;
  }
  try {
    dec.decode(bytes);
    return true;
  } catch {
    return false;
  }
}

function escapeText(bytes) {
  let s = dec.decode(bytes);
  s = s.replace(/\\/g, '\\\\').replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  return s;
}

function hexOf(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** 1 回の実行の送信を 1 つのバイト列にまとめる（TCP はつなげる、UDP は 1 通だけ） */
export function runBytes(run, proto) {
  const sends = run.sends.filter((s) => s.t === proto);
  if (sends.length !== run.sends.length) return { error: 'mixed' };
  if (sends.length === 0) return { error: 'no-send' };
  if (proto === 'udp' && sends.length > 1) return { error: 'multi-datagram' };
  const bytes = Buffer.concat(sends.map((s) => Buffer.from(s.hex, 'hex')));
  return { bytes: Uint8Array.from(bytes), port: sends[0].port, host: sends[0].host };
}

/**
 * 1 つの動作のテンプレートを作る。
 * 戻り値 { ok: true, send, maps, options（使った選択肢）, proto, port } または { ok: false, reason }
 */
export function deriveBytesAction(def, runs, proto) {
  const base = runs.find((r) => r.role === 'base');
  if (!base) return { ok: false, reason: 'no-base' };
  if (base.error) return { ok: false, reason: `error:${base.error}` };
  const b = runBytes(base, proto);
  if (b.error) return { ok: false, reason: b.error };
  const options = (def.options ?? []).filter((o) => o && o.id && o.type !== 'static-text');
  const slots = [];
  for (const o of options) {
    const vruns = runs.filter((r) => r.role === 'variant' && r.optionId === o.id);
    if (vruns.length === 0) continue;
    const variants = [];
    let bad = false;
    for (const r of vruns) {
      if (r.error) {
        bad = true;
        break;
      }
      const vb = runBytes(r, proto);
      if (vb.error) {
        bad = true;
        break;
      }
      variants.push({ value: r.options[o.id], bytes: vb.bytes });
    }
    if (bad) return { ok: false, reason: `option-breaks-send:${o.id}` };
    if (variants.every((v) => eq(v.bytes, b.bytes))) continue; // 送る内容に影響しない
    const baseVal = base.options[o.id];
    if (o.type === 'textinput') {
      const s = findSlot(b.bytes, baseVal, variants, TEXT_RENDERERS);
      if (!s) return { ok: false, reason: `text-slot:${o.id}` };
      slots.push({ ...s, id: o.id, kind: 'value' });
    } else if (o.type === 'number') {
      const s = findSlot(b.bytes, baseVal, variants, NUMBER_RENDERERS);
      if (s) {
        slots.push({ ...s, id: o.id, kind: 'value' });
        continue;
      }
      return { ok: false, reason: `number-slot:${o.id}` };
    } else if (o.type === 'dropdown' || o.type === 'checkbox') {
      const seg = findSegments(b.bytes, baseVal, variants);
      if (!seg) return { ok: false, reason: `segments:${o.id}` };
      slots.push({ pos: seg.pos, len: seg.len, id: o.id, kind: 'map', map: seg.map, complete: o.type === 'checkbox' || (o.choices ?? []).length <= variants.length + 1 });
    } else {
      return { ok: false, reason: `unsupported-option:${o.type}` };
    }
  }
  // 重なりがあれば諦める
  const sorted = [...slots].sort((x, y) => x.pos - y.pos);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].pos < sorted[i - 1].pos + sorted[i - 1].len) return { ok: false, reason: 'overlap' };
    if (sorted[i].pos === sorted[i - 1].pos && sorted[i].len === 0 && sorted[i - 1].len === 0) return { ok: false, reason: 'overlap' };
  }
  for (const s of slots) if (s.kind === 'map' && !s.complete) return { ok: false, reason: `too-many-choices:${s.id}` };

  // テキストで書けるか（土台と、選択肢の中身が全部表示できる文字なら）
  const literalParts = [];
  let cur = 0;
  for (const s of sorted) {
    literalParts.push(b.bytes.subarray(cur, s.pos));
    cur = s.pos + s.len;
  }
  literalParts.push(b.bytes.subarray(cur));
  const textMode =
    literalParts.every(printable) &&
    sorted.every((s) => (s.kind === 'map' ? Object.values(s.map).every(printable) : s.renderer.text));

  let tpl = '';
  cur = 0;
  const maps = {};
  for (const s of sorted) {
    const lit = b.bytes.subarray(cur, s.pos);
    tpl += textMode ? escapeText(lit) : hexOf(lit);
    if (s.kind === 'map') {
      maps[s.id] = Object.fromEntries(Object.entries(s.map).map(([k, v]) => [k, textMode ? escapeText(v) : hexOf(v)]));
      tpl += `{{option.${s.id}|map}}`;
    } else {
      const filters = [...s.renderer.filters];
      if (!textMode && s.renderer.text) filters.push('hexstr');
      tpl += `{{option.${s.id}${filters.map((f) => `|${f}`).join('')}}}`;
    }
    cur = s.pos + s.len;
  }
  tpl += textMode ? escapeText(b.bytes.subarray(cur)) : hexOf(b.bytes.subarray(cur));
  const send = { kind: 'bytes', data: tpl, encoding: textMode ? 'text' : 'hex' };

  // 検算：記録した全部の実行を描き直して一致するか
  for (const r of runs) {
    if (r.error) continue;
    const rb = runBytes(r, proto);
    if (rb.error) return { ok: false, reason: `verify-${rb.error}` };
    const rendered = renderSend(send, r.options, maps);
    if (!eq(rendered, rb.bytes)) return { ok: false, reason: `verify-mismatch:${r.role}` };
    if (rb.port !== b.port) return { ok: false, reason: 'port-varies' };
  }
  return { ok: true, send, maps, proto, port: b.port, host: b.host };
}

export function renderSend(send, options, maps) {
  const data = renderTemplate(send.data, { option: options, maps });
  return send.encoding === 'hex' ? parseHex(data) : unescapeText(data);
}

/* ---------- HTTP ---------- */

function httpParts(run) {
  const sends = run.sends.filter((s) => s.t === 'http');
  if (sends.length !== run.sends.length) return { error: 'mixed' };
  if (sends.length !== 1) return { error: sends.length === 0 ? 'no-send' : 'multi-request' };
  const s = sends[0];
  let u;
  try {
    u = new URL(s.url);
  } catch {
    return { error: 'bad-url' };
  }
  return { method: s.method, origin: u.origin, path: u.pathname + u.search, body: s.body ?? '', contentType: s.headers?.['content-type'] };
}

/** 文字列ひとつ（URL のパス・本文）にテンプレートを当てる */
function deriveTextField(def, runs, pick) {
  const base = runs.find((r) => r.role === 'base');
  const bp = pick(base);
  const b = enc.encode(bp);
  const options = (def.options ?? []).filter((o) => o && o.id && o.type !== 'static-text');
  const slots = [];
  for (const o of options) {
    const vruns = runs.filter((r) => r.role === 'variant' && r.optionId === o.id && !r.error);
    const variants = vruns.map((r) => ({ value: r.options[o.id], bytes: enc.encode(pick(r)) }));
    if (variants.length === 0 || variants.every((v) => eq(v.bytes, b))) continue;
    const baseVal = base.options[o.id];
    if (o.type === 'textinput' || o.type === 'number') {
      const s = findSlot(b, baseVal, variants, o.type === 'number' ? NUMBER_RENDERERS.filter((r) => r.text) : TEXT_RENDERERS);
      if (!s) return { ok: false, reason: `slot:${o.id}` };
      slots.push({ ...s, id: o.id, kind: 'value' });
    } else if (o.type === 'dropdown' || o.type === 'checkbox') {
      const seg = findSegments(b, baseVal, variants);
      if (!seg) return { ok: false, reason: `segments:${o.id}` };
      if (o.type === 'dropdown' && (o.choices ?? []).length > variants.length + 1) return { ok: false, reason: `too-many-choices:${o.id}` };
      slots.push({ pos: seg.pos, len: seg.len, id: o.id, kind: 'map', map: seg.map });
    } else return { ok: false, reason: `unsupported-option:${o.type}` };
  }
  const sorted = [...slots].sort((x, y) => x.pos - y.pos);
  for (let i = 1; i < sorted.length; i++) if (sorted[i].pos < sorted[i - 1].pos + sorted[i - 1].len) return { ok: false, reason: 'overlap' };
  let tpl = '';
  let cur = 0;
  const maps = {};
  const td = new TextDecoder();
  for (const s of sorted) {
    tpl += td.decode(b.subarray(cur, s.pos));
    if (s.kind === 'map') {
      maps[s.id] = Object.fromEntries(Object.entries(s.map).map(([k, v]) => [k, td.decode(v)]));
      tpl += `{{option.${s.id}|map}}`;
    } else tpl += `{{option.${s.id}${s.renderer.filters.map((f) => `|${f}`).join('')}}}`;
    cur = s.pos + s.len;
  }
  tpl += td.decode(b.subarray(cur));
  return { ok: true, tpl, maps };
}

export function deriveHttpAction(def, runs) {
  const base = runs.find((r) => r.role === 'base');
  if (!base) return { ok: false, reason: 'no-base' };
  if (base.error) return { ok: false, reason: `error:${base.error}` };
  const bp = httpParts(base);
  if (bp.error) return { ok: false, reason: bp.error };
  const all = runs.filter((r) => !r.error);
  const parts = new Map(all.map((r) => [r, httpParts(r)]));
  for (const p of parts.values()) {
    if (p.error) return { ok: false, reason: `verify-${p.error}` };
    if (p.origin !== bp.origin) return { ok: false, reason: 'origin-varies' };
    if (p.method !== bp.method) return { ok: false, reason: 'method-varies' };
  }
  const path = deriveTextField(def, all, (r) => parts.get(r).path);
  if (!path.ok) return { ok: false, reason: `path-${path.reason}` };
  const body = deriveTextField(def, all, (r) => parts.get(r).body);
  if (!body.ok) return { ok: false, reason: `body-${body.reason}` };
  const maps = { ...path.maps };
  for (const [k, v] of Object.entries(body.maps)) {
    if (maps[k]) return { ok: false, reason: 'map-in-path-and-body' };
    maps[k] = v;
  }
  for (const r of all) {
    const p = parts.get(r);
    if (renderTemplate(path.tpl, { option: r.options, maps }) !== p.path) return { ok: false, reason: `verify-path:${r.role}` };
    if (renderTemplate(body.tpl, { option: r.options, maps }) !== p.body) return { ok: false, reason: `verify-body:${r.role}` };
  }
  const send = { kind: 'http', method: bp.method, path: path.tpl };
  if (bp.method !== 'GET' && bp.method !== 'HEAD') {
    send.body = body.tpl;
    if (bp.contentType) send.contentType = bp.contentType;
  }
  return { ok: true, send, maps, proto: 'http', origin: bp.origin };
}
