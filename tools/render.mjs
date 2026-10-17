/**
 * テンプレートの描画（アプリの src/drivers/engine.ts の renderTemplate と同じ規則）。
 *   {{option.x}} {{config.x}}           … 値をそのまま
 *   {{option.x|map}}                     … 動作の maps[x][値] に置き換える（選択肢ごとに送る中身が違う時）
 *   {{option.x|padN}}                    … 0 埋めで N 桁
 *   {{option.x|hexstr}}                  … 文字列を UTF-8 の 16 進に
 *   {{option.x|u8}} |u16be |u16le |u32be |u32le |i16be |f32be … 数を 16 進のバイト列に
 *   {{option.x|lin:a:b}}                 … a×値＋b（例 100 − 速さ は lin:-1:100）
 *   {{option.x|hexu}} |hexl              … 数を 16 進の文字に（大文字・小文字）
 * フィルタは左から順にかける（例 {{option.x|lin:-1:100|pad3|hexstr}}）。
 */

const TOKEN = /\{\{\s*(option|config)\.([A-Za-z0-9_\-]+)((?:\|[a-z0-9]+(?::-?[0-9.e+-]+)*)*)\s*\}\}/g;

export function formatNumber(x) {
  if (!Number.isFinite(x)) return '0';
  const r = Math.round(x * 1e6) / 1e6;
  return Object.is(r, -0) ? '0' : String(r);
}

function hexOf(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function intBytes(n, size, little, signed) {
  let v = Math.trunc(Number(n));
  if (!Number.isFinite(v)) v = 0;
  const max = 2 ** (size * 8);
  if (signed && v < 0) v += max;
  v = ((v % max) + max) % max;
  const out = [];
  for (let i = size - 1; i >= 0; i--) out.push(Math.floor(v / 2 ** (i * 8)) & 0xff);
  return little ? out.reverse() : out;
}

export function applyFilter(value, filter, mapping) {
  const s = value === undefined || value === null ? '' : String(value);
  const lin = /^lin:(-?[0-9.e+-]+):(-?[0-9.e+-]+)$/.exec(filter);
  if (lin) return formatNumber(Number(s) * Number(lin[1]) + Number(lin[2]));
  if (filter === 'hexu' || filter === 'hexl') {
    const n = Math.trunc(Number(s));
    const h = (n < 0 ? 0 : n).toString(16);
    return filter === 'hexu' ? h.toUpperCase() : h;
  }
  if (filter === 'map') {
    if (mapping && Object.prototype.hasOwnProperty.call(mapping, s)) return mapping[s];
    return '';
  }
  const pad = /^pad(\d+)$/.exec(filter);
  if (pad) {
    const neg = s.startsWith('-');
    const body = neg ? s.slice(1) : s;
    return (neg ? '-' : '') + body.padStart(Number(pad[1]), '0');
  }
  switch (filter) {
    case 'hexstr':
      return hexOf(new TextEncoder().encode(s));
    case 'u8':
      return hexOf(intBytes(s, 1, false, false));
    case 'u16be':
      return hexOf(intBytes(s, 2, false, false));
    case 'u16le':
      return hexOf(intBytes(s, 2, true, false));
    case 'i16be':
      return hexOf(intBytes(s, 2, false, true));
    case 'u32be':
      return hexOf(intBytes(s, 4, false, false));
    case 'u32le':
      return hexOf(intBytes(s, 4, true, false));
    case 'f32be': {
      const b = new Uint8Array(4);
      new DataView(b.buffer).setFloat32(0, Number(s), false);
      return hexOf(b);
    }
    default:
      return s;
  }
}

export function renderTemplate(tpl, ctx) {
  return String(tpl).replace(TOKEN, (_m, scope, key, filters) => {
    const src = ctx[scope] ?? {};
    let v = src[key];
    if (v === undefined) v = '';
    if (typeof v === 'boolean') v = v ? 'true' : 'false';
    let s = String(v);
    for (const f of filters.split('|').filter(Boolean)) s = applyFilter(s, f, ctx.maps?.[key]);
    return s;
  });
}

/** \r \n \t \\ \xNN をバイトに（アプリの unescapeText と同じ） */
export function unescapeText(text) {
  const out = [];
  const enc = new TextEncoder();
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '\\' && i + 1 < text.length) {
      const n = text[i + 1];
      if (n === 'r') {
        out.push(13);
        i++;
        continue;
      }
      if (n === 'n') {
        out.push(10);
        i++;
        continue;
      }
      if (n === 't') {
        out.push(9);
        i++;
        continue;
      }
      if (n === '\\') {
        out.push(92);
        i++;
        continue;
      }
      if (n === 'x' && /^[0-9a-fA-F]{2}$/.test(text.slice(i + 2, i + 4))) {
        out.push(parseInt(text.slice(i + 2, i + 4), 16));
        i += 3;
        continue;
      }
    }
    out.push(...enc.encode(c));
  }
  return Uint8Array.from(out);
}

export function parseHex(text) {
  const clean = String(text).replace(/[\s:,]/g, '');
  if (clean.length % 2 !== 0 || /[^0-9a-fA-F]/.test(clean)) throw new Error(`bad hex: ${text}`);
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}
