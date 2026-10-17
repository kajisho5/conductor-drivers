'use strict';
/**
 * モジュールのプロセスに --require で読み込ませ、外への通信を横取りする（実際の機器には何も送らない）。
 * - TCP：接続先を記録し、ホスト側の受け皿（127.0.0.1:CAPTURE_TCP_PORT）へつなぎ替える。書いた中身を記録する
 * - UDP：送った中身と宛先を記録し、実際には送らない。bind はポート 0 に置き換える（並列実行でぶつからないように）
 * - HTTP / HTTPS / fetch：元の URL をヘッダーに入れて、ホスト側の受け皿（CAPTURE_HTTP_PORT）へつなぎ替える
 * 記録は IPC で { __capture: {...} } としてホストへ送る。
 */
const net = require('net');
const dgram = require('dgram');
const http = require('http');
const https = require('https');

const SINK_TCP = Number(process.env.CAPTURE_TCP_PORT);
const SINK_HTTP = Number(process.env.CAPTURE_HTTP_PORT);

function report(ev) {
  try {
    if (process.send) process.send({ __capture: { ...ev, at: Date.now() } });
  } catch {
    // 送れなくても続ける
  }
}

function toBuffer(data, enc) {
  if (data == null) return Buffer.alloc(0);
  if (typeof data === 'string') return Buffer.from(data, typeof enc === 'string' ? enc : 'utf8');
  if (Buffer.isBuffer(data)) return data;
  if (ArrayBuffer.isView(data)) return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  if (data instanceof ArrayBuffer) return Buffer.from(data);
  if (Array.isArray(data)) return Buffer.concat(data.map((d) => toBuffer(d)));
  return Buffer.from(String(data));
}

/* ---------- TCP ---------- */

const origConnect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  let options;
  let cb;
  let normalized = null;
  if (Array.isArray(args[0])) {
    normalized = args[0];
    options = normalized[0];
    cb = normalized[1];
  } else if (args[0] !== null && typeof args[0] === 'object') {
    options = args[0];
    cb = args[1];
  } else {
    options = { port: args[0], host: typeof args[1] === 'string' ? args[1] : 'localhost' };
    cb = typeof args[1] === 'function' ? args[1] : args[2];
  }
  if (!options || options.path || (options.host === '127.0.0.1' && Number(options.port) === SINK_TCP)) {
    return origConnect.apply(this, args);
  }
  const host = String(options.host ?? 'localhost');
  const port = Number(options.port);
  this.__cap = { host, port };
  report({ t: 'tcp-connect', host, port });
  const redirected = { ...options, host: '127.0.0.1', port: SINK_TCP };
  delete redirected.lookup;
  delete redirected.localAddress;
  delete redirected.localPort;
  return origConnect.call(this, redirected, cb);
};

const origWrite = net.Socket.prototype.write;
net.Socket.prototype.write = function (data, enc, cb) {
  if (this.__cap) {
    const buf = toBuffer(data, enc);
    if (buf.length > 0) report({ t: 'tcp', host: this.__cap.host, port: this.__cap.port, hex: buf.toString('hex') });
  }
  return origWrite.call(this, data, enc, cb);
};

/* ---------- UDP ---------- */

const origBind = dgram.Socket.prototype.bind;
dgram.Socket.prototype.bind = function (...args) {
  if (args[0] !== null && typeof args[0] === 'object') {
    args[0] = { ...args[0], port: 0 };
  } else if (typeof args[0] === 'number' || typeof args[0] === 'string') {
    args[0] = 0;
  }
  return origBind.apply(this, args);
};

/** 実際にはつながず、宛先だけ覚える（送る時に使う） */
dgram.Socket.prototype.connect = function (port, address, cb) {
  const host = typeof address === 'string' ? address : '127.0.0.1';
  this.__udpTarget = { host, port: Number(port) };
  const done = typeof address === 'function' ? address : cb;
  setImmediate(() => {
    this.emit('connect');
    if (typeof done === 'function') done();
  });
};
dgram.Socket.prototype.remoteAddress = function () {
  const t = this.__udpTarget;
  return t ? { address: t.host, family: 'IPv4', port: t.port } : undefined;
};

dgram.Socket.prototype.send = function (buffer, offset, length, port, address, callback) {
  let msg = buffer;
  if (address || (port && typeof port !== 'function')) {
    msg = toBuffer(buffer).subarray(offset, offset + length);
  } else {
    callback = port;
    port = offset;
    address = length;
  }
  if (typeof port === 'function') {
    callback = port;
    port = undefined;
  }
  if (typeof address === 'function') {
    callback = address;
    address = undefined;
  }
  const buf = toBuffer(msg);
  const target = this.__udpTarget;
  const host = address != null ? String(address) : target ? target.host : '127.0.0.1';
  const p = port != null ? Number(port) : target ? target.port : 0;
  report({ t: 'udp', host, port: p, hex: buf.toString('hex') });
  if (typeof callback === 'function') setImmediate(() => callback(null, buf.length));
};

/* ---------- HTTP ---------- */

const origHttpRequest = http.request;

function fullUrl(isHttps, opts) {
  const proto = isHttps ? 'https:' : opts.protocol || 'http:';
  const host = opts.hostname || (opts.host ? String(opts.host).replace(/:\d+$/, '') : 'localhost');
  const port = opts.port ? `:${opts.port}` : '';
  const path = opts.path || '/';
  return `${proto}//${host}${port}${path}`;
}

function wrapRequest(isHttps) {
  return function (...args) {
    let url = null;
    let opts = {};
    let cb;
    if (typeof args[0] === 'string' || args[0] instanceof URL) {
      url = new URL(String(args[0]));
      if (typeof args[1] === 'object' && args[1] !== null) {
        opts = args[1];
        cb = args[2];
      } else {
        cb = args[1];
      }
    } else {
      opts = args[0] || {};
      cb = args[1];
    }
    const original = url ? url.toString() : fullUrl(isHttps, opts);
    const u = new URL(original);
    const headers = { ...(opts.headers || {}), 'x-capture-url': original };
    const redirected = {
      method: opts.method || 'GET',
      headers,
      protocol: 'http:',
      hostname: '127.0.0.1',
      port: SINK_HTTP,
      path: u.pathname + u.search,
      timeout: opts.timeout,
    };
    return origHttpRequest.call(http, redirected, cb);
  };
}

http.request = wrapRequest(false);
http.get = function (...args) {
  const req = http.request(...args);
  req.end();
  return req;
};
https.request = wrapRequest(true);
https.get = function (...args) {
  const req = https.request(...args);
  req.end();
  return req;
};

if (typeof globalThis.fetch === 'function') {
  const origFetch = globalThis.fetch;
  globalThis.fetch = async function (input, init) {
    const req = new Request(input, init);
    const headers = {};
    req.headers.forEach((v, k) => {
      headers[k] = v;
    });
    headers['x-capture-url'] = req.url;
    const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.text();
    return origFetch(`http://127.0.0.1:${SINK_HTTP}/`, { method: req.method, headers, body });
  };
}
