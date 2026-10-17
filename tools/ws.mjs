/**
 * WebSocket（RFC 6455）の最小限：受け皿での握手（101）と、クライアントが送ったフレームの読み取り。
 * クライアントのフレームはマスクされている。テキスト（opcode 1）とバイナリ（2）だけ取り出す。
 */
import { createHash } from 'node:crypto';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

export function acceptKey(key) {
  return createHash('sha1').update(`${key}${GUID}`).digest('base64');
}

/** 握手のリクエスト（文字列）なら { path, key } */
export function parseUpgrade(text) {
  if (!/^GET /.test(text) || !/\r\n\r\n/.test(text)) return null;
  const head = text.slice(0, text.indexOf('\r\n\r\n'));
  if (!/^upgrade:\s*websocket/im.test(head)) return null;
  const path = head.split('\r\n')[0].split(' ')[1] ?? '/';
  const key = /^sec-websocket-key:\s*(.+)$/im.exec(head)?.[1]?.trim() ?? '';
  return { path, key, headerLength: text.indexOf('\r\n\r\n') + 4 };
}

export function upgradeResponse(key) {
  return `HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${acceptKey(key)}\r\n\r\n`;
}

/**
 * バッファからフレームを読めるだけ読む。戻り値 { messages: [{ text } | { hex }], rest }
 * 分割（continuation）はつなぐ。ping / pong / close は捨てる。
 */
export function readFrames(buf, state = { parts: [], opcode: 0 }) {
  const messages = [];
  let p = 0;
  for (;;) {
    if (buf.length - p < 2) break;
    const b0 = buf[p];
    const b1 = buf[p + 1];
    const fin = (b0 & 0x80) !== 0;
    const opcode = b0 & 0x0f;
    const masked = (b1 & 0x80) !== 0;
    let len = b1 & 0x7f;
    let q = p + 2;
    if (len === 126) {
      if (buf.length - q < 2) break;
      len = buf.readUInt16BE(q);
      q += 2;
    } else if (len === 127) {
      if (buf.length - q < 8) break;
      len = Number(buf.readBigUInt64BE(q));
      q += 8;
    }
    const maskLen = masked ? 4 : 0;
    if (buf.length - q < maskLen + len) break;
    const mask = masked ? buf.subarray(q, q + 4) : null;
    q += maskLen;
    const payload = Buffer.from(buf.subarray(q, q + len));
    if (mask) for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i % 4];
    p = q + len;
    if (opcode === 1 || opcode === 2) {
      state.opcode = opcode;
      state.parts = [payload];
    } else if (opcode === 0) {
      state.parts.push(payload);
    } else {
      continue;
    }
    if (fin) {
      const data = Buffer.concat(state.parts);
      messages.push(state.opcode === 1 ? { text: data.toString('utf8') } : { hex: data.toString('hex') });
      state.parts = [];
    }
  }
  return { messages, rest: buf.subarray(p) };
}
