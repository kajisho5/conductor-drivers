/**
 * 記録した「動作ごとの実行結果」から、送る内容のテンプレートを作って検算する。
 * 1. 基準（base）の送信を土台にする
 * 2. 選択肢を 1 つ変えた結果（variant）と比べて、その選択肢が入る場所（slot）と書き方（フィルタ）を探す
 *    数は a×値＋b（例：100 − 速さ）も探す。文字の欄に数を入れて数として送るものも探す
 * 3. 土台に slot を当ててテンプレートにし、記録した全部の実行（組み合わせを含む）を描き直して一致するか確かめる
 * 一致したものだけを「送れる動作」として出す。UDP の OSC は宛先と引数ごとにテンプレートを作る。
 */
import { formatNumber, parseHex, renderTemplate, unescapeText } from './render.mjs';

export const MARKER_HOST = '10.11.12.13';

const enc = new TextEncoder();
const dec = new TextDecoder('utf-8', { fatal: true });
const loose = new TextDecoder();

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

function hexOf(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

const close = (x, y) => Math.abs(x - y) <= 1e-6 * Math.max(1, Math.abs(x), Math.abs(y));

/** 2 点から a・b を出し、残りの点でも合うか */
export function solveAffine(points, { integer = false } = {}) {
  if (points.length < 2) return null;
  const [p0, p1] = points;
  if (p1.x === p0.x) return null;
  const a = (p1.y - p0.y) / (p1.x - p0.x);
  const b = p0.y - a * p0.x;
  if (!Number.isFinite(a) || !Number.isFinite(b) || a === 0) return null;
  if (integer && (!Number.isInteger(a) || !Number.isInteger(b))) return null;
  for (const p of points) if (!close(a * p.x + b, p.y)) return null;
  return { a: Number(formatNumber(a)), b: Number(formatNumber(b)) };
}

function linFilter(fit) {
  return fit && (fit.a !== 1 || fit.b !== 0) ? [`lin:${fit.a}:${fit.b}`] : [];
}

/* ---------- 選択肢の入る場所を探す ---------- */

/** 文字（そのまま） */
function findTextSlot(B, baseValue, variants) {
  const rb = enc.encode(String(baseValue));
  const v0 = variants[0];
  const pre = commonPrefix(B, v0.bytes);
  for (let p = Math.max(0, pre - rb.length); p <= Math.min(pre, B.length); p++) {
    if (!startsAt(B, rb, p)) continue;
    let ok = true;
    for (const v of variants) {
      const rv = enc.encode(String(v.value));
      if (!startsAt(v.bytes, rv, p) || !eq(B.subarray(0, p), v.bytes.subarray(0, p)) || !eq(B.subarray(p + rb.length), v.bytes.subarray(p + rv.length))) {
        ok = false;
        break;
      }
    }
    if (ok) return { pos: p, len: rb.length, filters: [], text: true };
  }
  return null;
}

const CHARSETS = [
  { id: 'dec', radix: 10, re: /[0-9]/, filter: null },
  { id: 'hexu', radix: 16, re: /[0-9A-F]/, filter: 'hexu' },
  { id: 'hexl', radix: 16, re: /[0-9a-f]/, filter: 'hexl' },
];

/** 数（文字で書かれた数。a×値＋b、0 埋め、16 進の文字も） */
function findNumericTextSlot(B, baseValue, variants) {
  const diffs = variants.filter((v) => !eq(v.bytes, B));
  if (diffs.length === 0) return null;
  const p0 = Math.min(...diffs.map((v) => commonPrefix(B, v.bytes)));
  for (const cs of CHARSETS) {
    const isCh = (b) => b !== undefined && cs.re.test(String.fromCharCode(b));
    let left = p0;
    while (left > 0 && isCh(B[left - 1])) left--;
    const neg = cs.radix === 10 && left > 0 && B[left - 1] === 45;
    const start = neg ? left - 1 : left;
    const read = (bytes) => {
      if (!eq(bytes.subarray(0, start), B.subarray(0, start))) return null;
      let i = start;
      let sign = 1;
      if (cs.radix === 10 && bytes[i] === 45) {
        sign = -1;
        i++;
      }
      const s0 = i;
      while (i < bytes.length && isCh(bytes[i])) i++;
      if (i === s0) return null;
      const token = String.fromCharCode(...bytes.subarray(s0, i));
      return { n: sign * parseInt(token, cs.radix), digits: token.length, end: i, total: i - start };
    };
    const tb = read(B);
    if (!tb) continue;
    const points = [{ x: Number(baseValue), y: tb.n }];
    const reads = [tb];
    let ok = true;
    for (const v of variants) {
      const t = read(v.bytes);
      if (!t || !eq(v.bytes.subarray(t.end), B.subarray(tb.end))) {
        ok = false;
        break;
      }
      points.push({ x: Number(v.value), y: t.n });
      reads.push(t);
    }
    if (!ok) continue;
    if (points.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))) continue;
    const fit = solveAffine(points, { integer: true });
    if (!fit) continue;
    // 0 埋め：桁数がいつも同じで、先頭の 0 がある時
    const widths = new Set(reads.map((r) => r.digits));
    const naturalLen = (n) => Math.abs(n).toString(cs.radix).length;
    const padded = reads.some((r) => r.digits > naturalLen(r.n));
    if (padded && widths.size !== 1) continue;
    const filters = [...linFilter(fit)];
    if (cs.filter) filters.push(cs.filter);
    if (padded) filters.push(`pad${tb.digits}`);
    return { pos: start, len: tb.end - start, filters, text: true };
  }
  return null;
}

const BIN = [
  { size: 1, little: false, signed: false, f: 'u8' },
  { size: 2, little: false, signed: false, f: 'u16be' },
  { size: 2, little: true, signed: false, f: 'u16le' },
  { size: 2, little: false, signed: true, f: 'i16be' },
  { size: 4, little: false, signed: false, f: 'u32be' },
  { size: 4, little: true, signed: false, f: 'u32le' },
];

function readInt(bytes, p, t) {
  if (p < 0 || p + t.size > bytes.length) return null;
  let v = 0;
  for (let i = 0; i < t.size; i++) v = v * 256 + bytes[p + (t.little ? t.size - 1 - i : i)];
  if (t.signed && v >= 2 ** (t.size * 8 - 1)) v -= 2 ** (t.size * 8);
  return v;
}

/** 数（バイナリ。a×値＋b） */
function findBinarySlot(B, baseValue, variants) {
  const diffs = variants.filter((v) => !eq(v.bytes, B));
  if (diffs.length === 0 || variants.some((v) => v.bytes.length !== B.length)) return null;
  const p0 = Math.min(...diffs.map((v) => commonPrefix(B, v.bytes)));
  for (const t of BIN) {
    for (let p = p0 - t.size + 1; p <= p0; p++) {
      const nb = readInt(B, p, t);
      if (nb === null) continue;
      const points = [{ x: Number(baseValue), y: nb }];
      let ok = true;
      for (const v of variants) {
        const n = readInt(v.bytes, p, t);
        if (n === null || !eq(v.bytes.subarray(0, p), B.subarray(0, p)) || !eq(v.bytes.subarray(p + t.size), B.subarray(p + t.size))) {
          ok = false;
          break;
        }
        points.push({ x: Number(v.value), y: n });
      }
      if (!ok) continue;
      const fit = solveAffine(points, { integer: true });
      if (!fit) continue;
      return { pos: p, len: t.size, filters: [...linFilter(fit), t.f], text: false };
    }
  }
  return null;
}

/** 選択肢（dropdown / checkbox）：選んだものごとに違う「区間」を切り出す */
export function findSegments(B, baseValue, variants) {
  const diffs = variants.filter((v) => !eq(v.bytes, B));
  if (diffs.length === 0) return null;
  let pre = Infinity;
  for (const v of diffs) pre = Math.min(pre, commonPrefix(B, v.bytes));
  let suf = Infinity;
  for (const v of diffs) suf = Math.min(suf, commonSuffix(B, v.bytes, pre));
  const map = { [String(baseValue)]: B.subarray(pre, B.length - suf) };
  for (const v of variants) {
    if (v.bytes.length - suf < pre) return null;
    if (!eq(v.bytes.subarray(0, pre), B.subarray(0, pre))) return null;
    if (!eq(v.bytes.subarray(v.bytes.length - suf), B.subarray(B.length - suf))) return null;
    map[String(v.value)] = v.bytes.subarray(pre, v.bytes.length - suf);
  }
  return { pos: pre, len: B.length - suf - pre, map };
}

const isNumericText = (v) => typeof v === 'string' && /^-?\d+$/.test(v);

/**
 * 1 つの選択肢の slot を探す。
 * kind 'value'（値をフィルタで書く）か 'map'（選んだものごとの中身）。
 * allowBinary：バイナリの数（u8 など）も探すか
 */
function slotFor(o, B, baseValue, variants, allowBinary) {
  if (o.type === 'textinput') {
    const s = findTextSlot(B, baseValue, variants);
    if (s) return { ...s, kind: 'value' };
    // 数として使う文字の欄
    const nums = variants.filter((v) => isNumericText(v.value));
    if (isNumericText(String(baseValue)) && nums.length >= 1) {
      const n = findNumericTextSlot(B, baseValue, nums) ?? (allowBinary ? findBinarySlot(B, baseValue, nums) : null);
      if (n) {
        // 文字の目印の実行は、数に直せない値として送られる（検算で弾く）ので、数の実行だけで決める
        return { ...n, kind: 'value', numericText: true };
      }
    }
    return null;
  }
  if (o.type === 'number') {
    const s = findNumericTextSlot(B, baseValue, variants) ?? (allowBinary ? findBinarySlot(B, baseValue, variants) : null);
    return s ? { ...s, kind: 'value' } : null;
  }
  if (o.type === 'dropdown' || o.type === 'checkbox') {
    const complete = o.type === 'checkbox' || (o.choices ?? []).length <= variants.length + 1;
    if (o.type === 'dropdown' && !complete) {
      // 選択肢が多い時：選んだ値そのもの、または数として入っていれば、試していない選択肢も同じ書き方とみなす
      const t = findTextSlot(B, baseValue, variants);
      if (t) return { ...t, kind: 'value' };
      if (Number.isFinite(Number(baseValue)) && variants.every((v) => Number.isFinite(Number(v.value)))) {
        const n = findNumericTextSlot(B, baseValue, variants) ?? (allowBinary ? findBinarySlot(B, baseValue, variants) : null);
        if (n) return { ...n, kind: 'value' };
      }
    }
    const seg = findSegments(B, baseValue, variants);
    if (!seg) return null;
    return { pos: seg.pos, len: seg.len, kind: 'map', map: seg.map, complete };
  }
  return null;
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
  return dec
    .decode(bytes)
    .replace(/\\/g, '\\\\')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

function options(def) {
  return (def.options ?? []).filter((o) => o && o.id && o.type !== 'static-text');
}

/**
 * 共通：土台のバイト列と各選択肢の slot からテンプレートを組む。
 * getBytes(run) は実行ごとのバイト列（作れなければ { error }）。
 */
function buildTemplate(def, runs, getBytes, { allowBinary, forceText }) {
  const base = runs.find((r) => r.role === 'base');
  const B = getBytes(base);
  if (B.error) return { ok: false, reason: B.error };
  const slots = [];
  for (const o of options(def)) {
    const vruns = runs.filter((r) => r.role === 'variant' && r.optionId === o.id);
    const variants = [];
    for (const r of vruns) {
      if (r.error) continue;
      const vb = getBytes(r);
      if (vb.error) {
        if (o.type === 'textinput' && !isNumericText(r.options[o.id])) continue;
        return { ok: false, reason: `option-breaks-send:${o.id}` };
      }
      variants.push({ value: r.options[o.id], bytes: vb.bytes });
    }
    if (variants.length === 0 || variants.every((v) => eq(v.bytes, B.bytes))) continue;
    const s = slotFor(o, B.bytes, base.options[o.id], variants, allowBinary);
    if (!s) return { ok: false, reason: `${o.type === 'number' ? 'number' : o.type === 'textinput' ? 'text' : 'choice'}-slot:${o.id}` };
    if (s.kind === 'map' && !s.complete) return { ok: false, reason: `too-many-choices:${o.id}` };
    slots.push({ ...s, id: o.id });
  }
  const sorted = [...slots].sort((x, y) => x.pos - y.pos);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].pos < sorted[i - 1].pos + sorted[i - 1].len) return { ok: false, reason: 'overlap' };
    if (sorted[i].pos === sorted[i - 1].pos && (sorted[i].len === 0 || sorted[i - 1].len === 0)) return { ok: false, reason: 'overlap' };
  }
  const lits = [];
  let cur = 0;
  for (const s of sorted) {
    lits.push(B.bytes.subarray(cur, s.pos));
    cur = s.pos + s.len;
  }
  lits.push(B.bytes.subarray(cur));
  const textMode =
    forceText ||
    (lits.every(printable) && sorted.every((s) => (s.kind === 'map' ? Object.values(s.map).every(printable) : s.text)));
  if (forceText && !(lits.every(printable) && sorted.every((s) => s.kind === 'map' || s.text))) return { ok: false, reason: 'binary-in-text' };
  const lit = (b) => (forceText ? loose.decode(b) : textMode ? escapeText(b) : hexOf(b));
  let tpl = '';
  cur = 0;
  const maps = {};
  for (const s of sorted) {
    tpl += lit(B.bytes.subarray(cur, s.pos));
    if (s.kind === 'map') {
      maps[s.id] = Object.fromEntries(Object.entries(s.map).map(([k, v]) => [k, lit(v)]));
      tpl += `{{option.${s.id}|map}}`;
    } else {
      const filters = [...s.filters];
      if (!textMode && s.text) filters.push('hexstr');
      tpl += `{{option.${s.id}${filters.map((f) => `|${f}`).join('')}}}`;
    }
    cur = s.pos + s.len;
  }
  tpl += lit(B.bytes.subarray(cur));
  return { ok: true, tpl, maps, textMode };
}

/* ---------- TCP / UDP のバイト列 ---------- */

/** 1 回の実行の送信を 1 つのバイト列にまとめる（TCP はつなげる、UDP は 1 通だけ） */
export function runBytes(run, proto) {
  const sends = run.sends.filter((s) => s.t === proto);
  if (sends.length !== run.sends.length) return { error: 'mixed' };
  if (sends.length === 0) return { error: 'no-send' };
  if (proto === 'udp' && sends.length > 1) return { error: 'multi-datagram' };
  const bytes = Buffer.concat(sends.map((s) => Buffer.from(s.hex, 'hex')));
  return { bytes: Uint8Array.from(bytes), port: sends[0].port, host: sends[0].host };
}

export function renderSend(send, opts, maps) {
  const data = renderTemplate(send.data, { option: opts, maps });
  return send.encoding === 'hex' ? parseHex(data) : unescapeText(data);
}

export function deriveBytesAction(def, runs, proto) {
  const base = runs.find((r) => r.role === 'base');
  if (!base) return { ok: false, reason: 'no-base' };
  if (base.error) return { ok: false, reason: `error:${base.error}` };
  const b = runBytes(base, proto);
  if (b.error) return { ok: false, reason: b.error };
  if (proto === 'udp') {
    const osc = deriveOscAction(def, runs);
    if (osc.ok || osc.reason !== 'not-osc') return osc;
  }
  const built = buildTemplate(def, runs, (r) => runBytes(r, proto), { allowBinary: true });
  if (!built.ok) return built;
  const send = { kind: 'bytes', data: built.tpl, encoding: built.textMode ? 'text' : 'hex' };
  for (const r of runs) {
    if (r.error) continue;
    const rb = runBytes(r, proto);
    if (rb.error) {
      if (r.role === 'variant' && r.optionId && !isNumericText(r.options[r.optionId])) continue;
      return { ok: false, reason: `verify-${rb.error}` };
    }
    let rendered;
    try {
      rendered = renderSend(send, r.options, built.maps);
    } catch {
      return { ok: false, reason: `verify-render:${r.role}` };
    }
    if (!eq(rendered, rb.bytes)) {
      if (isMarkerTextRun(def, r)) continue;
      return { ok: false, reason: `verify-mismatch:${r.role}` };
    }
    if (rb.port !== b.port) return { ok: false, reason: 'port-varies' };
  }
  return { ok: true, send, maps: built.maps, proto, port: b.port, host: b.host };
}

/** 数として使う文字の欄に、文字の目印を入れた実行（数に直せないので比べない） */
function isMarkerTextRun(def, r) {
  if (r.role !== 'variant' || !r.optionId) return false;
  const o = options(def).find((x) => x.id === r.optionId);
  return !!o && o.type === 'textinput' && !isNumericText(String(r.options[r.optionId]));
}

/* ---------- OSC ---------- */

function oscString(b, p) {
  let e = p;
  while (e < b.length && b[e] !== 0) e++;
  if (e >= b.length) return null;
  const s = loose.decode(b.subarray(p, e));
  return { s, next: p + Math.ceil((e - p + 1) / 4) * 4 };
}

export function decodeOsc(bytes) {
  if (bytes.length < 4 || bytes[0] !== 47) return null;
  const a = oscString(bytes, 0);
  if (!a) return null;
  const t = oscString(bytes, a.next);
  if (!t || !t.s.startsWith(',')) return t === null && a.next === bytes.length ? { address: a.s, args: [] } : null;
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let p = t.next;
  const args = [];
  for (const ty of t.s.slice(1)) {
    if (ty === 'i') {
      if (p + 4 > bytes.length) return null;
      args.push({ type: 'i', value: dv.getInt32(p, false) });
      p += 4;
    } else if (ty === 'f') {
      if (p + 4 > bytes.length) return null;
      args.push({ type: 'f', value: dv.getFloat32(p, false) });
      p += 4;
    } else if (ty === 's') {
      const s = oscString(bytes, p);
      if (!s) return null;
      args.push({ type: 's', value: s.s });
      p = s.next;
    } else if (ty === 'T' || ty === 'F') {
      args.push({ type: ty, value: '' });
    } else return null;
  }
  if (p !== bytes.length) return null;
  return { address: a.s, args };
}

function oscRun(r) {
  const b = runBytes(r, 'udp');
  if (b.error) return { error: b.error };
  const m = decodeOsc(b.bytes);
  if (!m) return { error: 'not-osc' };
  return { msg: m, port: b.port };
}

/** 文字列ひとつに対して選択肢の slot を当てる（宛先・文字の引数・HTTP のパスや本文） */
function deriveStringField(def, runs, pick) {
  const getBytes = (r) => {
    const v = pick(r);
    return v === null || v === undefined ? { error: 'missing' } : { bytes: enc.encode(String(v)) };
  };
  return buildTemplate(def, runs, getBytes, { allowBinary: false, forceText: true });
}

/** 数の引数：選択肢 1 つから a×値＋b、選択肢なら map、変わらなければそのまま */
function deriveNumberArg(def, runs, pick) {
  const base = runs.find((r) => r.role === 'base');
  const vb = pick(base);
  let driver = null;
  for (const o of options(def)) {
    const vr = runs.filter((r) => r.role === 'variant' && r.optionId === o.id && !r.error && pick(r) !== null);
    if (vr.some((r) => !close(pick(r), vb))) {
      if (driver) return { ok: false, reason: 'two-options-one-arg' };
      driver = { o, vr };
    }
  }
  if (!driver) return { ok: true, tpl: formatNumber(vb), maps: {} };
  const { o, vr } = driver;
  if (o.type === 'number' || (o.type === 'textinput' && isNumericText(String(base.options[o.id])))) {
    const pts = [{ x: Number(base.options[o.id]), y: vb }, ...vr.filter((r) => Number.isFinite(Number(r.options[o.id]))).map((r) => ({ x: Number(r.options[o.id]), y: pick(r) }))];
    const fit = solveAffine(pts);
    if (!fit) return { ok: false, reason: `osc-number:${o.id}` };
    return { ok: true, tpl: `{{option.${o.id}${linFilter(fit).map((f) => `|${f}`).join('')}}}`, maps: {} };
  }
  if (o.type === 'dropdown' || o.type === 'checkbox') {
    if (o.type === 'dropdown' && (o.choices ?? []).length > vr.length + 1) return { ok: false, reason: `too-many-choices:${o.id}` };
    const map = { [String(base.options[o.id])]: formatNumber(vb) };
    for (const r of vr) map[String(r.options[o.id])] = formatNumber(pick(r));
    return { ok: true, tpl: `{{option.${o.id}|map}}`, maps: { [o.id]: map } };
  }
  return { ok: false, reason: `osc-number:${o.id}` };
}

export function deriveOscAction(def, runs) {
  const base = runs.find((r) => r.role === 'base');
  const bo = oscRun(base);
  if (bo.error) return { ok: false, reason: bo.error === 'not-osc' ? 'not-osc' : bo.error };
  const all = runs.filter((r) => !r.error);
  const parsed = new Map();
  for (const r of all) {
    const o = oscRun(r);
    if (o.error) {
      if (isMarkerTextRun(def, r)) continue;
      return { ok: false, reason: `osc-${o.error}` };
    }
    if (o.port !== bo.port) return { ok: false, reason: 'port-varies' };
    parsed.set(r, o.msg);
  }
  const usable = all.filter((r) => parsed.has(r));
  const n = bo.msg.args.length;
  for (const r of usable) if (parsed.get(r).args.length !== n) return { ok: false, reason: 'osc-arg-count' };
  const maps = {};
  const merge = (m) => {
    for (const [k, v] of Object.entries(m)) {
      if (maps[k]) return false;
      maps[k] = v;
    }
    return true;
  };
  const addr = deriveStringField(def, usable, (r) => parsed.get(r)?.address ?? null);
  if (!addr.ok) return { ok: false, reason: `osc-address-${addr.reason}` };
  if (!merge(addr.maps)) return { ok: false, reason: 'map-twice' };
  const args = [];
  for (let i = 0; i < n; i++) {
    const types = new Set(usable.map((r) => parsed.get(r).args[i].type));
    let typeTpl;
    if (types.size === 1) typeTpl = [...types][0];
    else {
      const t = deriveStringField(def, usable, (r) => parsed.get(r).args[i].type);
      if (!t.ok) return { ok: false, reason: `osc-type-${t.reason}` };
      if (!merge(t.maps)) return { ok: false, reason: 'map-twice' };
      typeTpl = t.tpl;
    }
    const kind = [...types][0];
    let valueTpl;
    if (types.size === 1 && (kind === 'i' || kind === 'f')) {
      const v = deriveNumberArg(def, usable, (r) => parsed.get(r).args[i].value);
      if (!v.ok) return v;
      if (!merge(v.maps)) return { ok: false, reason: 'map-twice' };
      valueTpl = v.tpl;
    } else if (types.size === 1 && (kind === 'T' || kind === 'F')) {
      valueTpl = '';
    } else if (types.size === 1 && kind === 's') {
      const v = deriveStringField(def, usable, (r) => parsed.get(r).args[i].value);
      if (!v.ok) return { ok: false, reason: `osc-string-${v.reason}` };
      if (!merge(v.maps)) return { ok: false, reason: 'map-twice' };
      valueTpl = v.tpl;
    } else {
      valueTpl = '';
      if (![...types].every((t) => t === 'T' || t === 'F')) return { ok: false, reason: 'osc-type-varies' };
    }
    args.push({ type: typeTpl, value: valueTpl });
  }
  const send = { kind: 'osc', address: addr.tpl, args };
  // 検算
  for (const r of usable) {
    const m = parsed.get(r);
    const ctx = { option: r.options, maps };
    if (renderTemplate(send.address, ctx) !== m.address) return { ok: false, reason: `verify-osc-address:${r.role}` };
    for (let i = 0; i < n; i++) {
      const t = renderTemplate(args[i].type, ctx);
      const want = m.args[i];
      if (t !== want.type) return { ok: false, reason: `verify-osc-type:${r.role}` };
      const v = renderTemplate(args[i].value, ctx);
      if (want.type === 'i' && Math.trunc(Number(v)) !== want.value) return { ok: false, reason: `verify-osc-int:${r.role}` };
      if (want.type === 'f' && !close(Math.fround(Number(v)), want.value)) return { ok: false, reason: `verify-osc-float:${r.role}` };
      if (want.type === 's' && v !== want.value) return { ok: false, reason: `verify-osc-string:${r.role}` };
    }
  }
  return { ok: true, send, maps, proto: 'udp', port: bo.port, host: base.sends[0].host, osc: true };
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

export function deriveHttpAction(def, runs) {
  const base = runs.find((r) => r.role === 'base');
  if (!base) return { ok: false, reason: 'no-base' };
  if (base.error) return { ok: false, reason: `error:${base.error}` };
  const bp = httpParts(base);
  if (bp.error) return { ok: false, reason: bp.error };
  const all = runs.filter((r) => !r.error);
  const parts = new Map();
  for (const r of all) {
    const p = httpParts(r);
    if (p.error) {
      if (isMarkerTextRun(def, r)) continue;
      return { ok: false, reason: `verify-${p.error}` };
    }
    if (p.origin !== bp.origin) return { ok: false, reason: 'origin-varies' };
    if (p.method !== bp.method) return { ok: false, reason: 'method-varies' };
    parts.set(r, p);
  }
  const usable = all.filter((r) => parts.has(r));
  const path = deriveStringField(def, usable, (r) => parts.get(r)?.path ?? null);
  if (!path.ok) return { ok: false, reason: `path-${path.reason}` };
  const body = deriveStringField(def, usable, (r) => parts.get(r)?.body ?? null);
  if (!body.ok) return { ok: false, reason: `body-${body.reason}` };
  const maps = { ...path.maps };
  for (const [k, v] of Object.entries(body.maps)) {
    if (maps[k]) return { ok: false, reason: 'map-in-path-and-body' };
    maps[k] = v;
  }
  for (const r of usable) {
    const p = parts.get(r);
    if (renderTemplate(path.tpl, { option: r.options, maps }) !== p.path) {
      if (isMarkerTextRun(def, r)) continue;
      return { ok: false, reason: `verify-path:${r.role}` };
    }
    if (renderTemplate(body.tpl, { option: r.options, maps }) !== p.body) {
      if (isMarkerTextRun(def, r)) continue;
      return { ok: false, reason: `verify-body:${r.role}` };
    }
  }
  const send = { kind: 'http', method: bp.method, path: path.tpl };
  if (bp.method !== 'GET' && bp.method !== 'HEAD') {
    send.body = body.tpl;
    if (bp.contentType) send.contentType = bp.contentType;
  }
  return { ok: true, send, maps, proto: 'http', origin: bp.origin };
}
