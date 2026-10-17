'use strict';
/* テスト用の模擬モジュール（ホストとの IPC の取り決めだけを真似た自作のもの）。DEMO-SW-A 風の TCP 機器を操作する想定 */
const net = require('net');
const dgram = require('dgram');
const http = require('http');

let socket = null;
let udp = null;
let config = {};
let nextId = 1;
const pending = new Map();

function send(msg) {
  process.send(msg);
}
function call(name, payload) {
  const callbackId = nextId++;
  send({ direction: 'call', name, payload: JSON.stringify(payload), callbackId });
  return new Promise((resolve) => pending.set(callbackId, resolve));
}
function noCb(name, payload) {
  send({ direction: 'call', name, payload: JSON.stringify(payload) });
}

const actions = [
  {
    id: 'route',
    name: 'Route input',
    options: [
      { type: 'number', id: 'out', label: 'Output', default: 1, min: 1, max: 16 },
      { type: 'number', id: 'in', label: 'Input', default: 2, min: 1, max: 16 },
    ],
  },
  {
    id: 'mode',
    name: 'Mode',
    options: [
      {
        type: 'dropdown',
        id: 'm',
        label: 'Mode',
        default: 'a',
        choices: [
          { id: 'a', label: 'Auto' },
          { id: 'b', label: 'Bypass' },
          { id: 'c', label: 'Cut' },
        ],
      },
    ],
  },
  { id: 'name', name: 'Set name', options: [{ type: 'textinput', id: 'text', label: 'Name', default: '' }] },
  { id: 'bin', name: 'Binary level', options: [{ type: 'number', id: 'lvl', label: 'Level', default: 10, min: 0, max: 255 }] },
  { id: 'udp', name: 'UDP trigger', options: [{ type: 'checkbox', id: 'on', label: 'On', default: false }] },
  { id: 'web', name: 'HTTP recall', options: [{ type: 'number', id: 'preset', label: 'Preset', default: 1, min: 1, max: 99 }] },
  { id: 'silent', name: 'Needs reply', options: [] },
];

const handlers = {
  async getConfigFields() {
    return {
      fields: [
        { type: 'textinput', id: 'host', label: 'Target IP', default: '' },
        { type: 'number', id: 'port', label: 'Port', default: 7000, min: 1, max: 65535 },
      ],
    };
  },
  async init(p) {
    config = p.config;
    noCb('setActionDefinitions', { actions });
    noCb('setPresetDefinitions', {
      presets: [{ id: 'p1', type: 'button', category: 'Mode', name: 'Bypass', style: { text: 'BYP', bgcolor: 0xff0000 }, steps: [{ down: [{ actionId: 'mode', options: { m: 'b' } }], up: [] }], feedbacks: [] }],
    });
    socket = net.connect(config.port, config.host, () => socket.write('HELLO\r\n'));
    socket.on('error', () => undefined);
    udp = dgram.createSocket('udp4');
    udp.bind(9999);
    return {};
  },
  async executeAction({ action }) {
    const o = action.options;
    switch (action.actionId) {
      case 'route':
        socket.write(`X${String(o.out).padStart(2, '0')}:${o.in}\r\n`);
        break;
      case 'mode':
        socket.write({ a: 'MODE AUTO', b: 'MODE BYPASS', c: 'MODE CUT' }[o.m] + '\r\n');
        break;
      case 'name': {
        const t = await call('parseVariablesInString', { text: o.text });
        socket.write(`NAME "${t.text}"\r\n`);
        break;
      }
      case 'bin':
        socket.write(Buffer.from([0x02, 0x10, o.lvl, 0x03]));
        break;
      case 'udp':
        udp.send(Buffer.from(o.on ? 'TRIG 1' : 'TRIG 0'), 7001, config.host);
        break;
      case 'web':
        http.get(`http://${config.host}:8080/api/recall?preset=${o.preset}`, (res) => res.resume());
        break;
      default:
        break;
    }
    return { success: true };
  },
  async destroy() {
    if (socket) socket.destroy();
    return {};
  },
};

process.on('message', async (msg) => {
  if (msg.direction === 'response') {
    const r = pending.get(msg.callbackId);
    if (r) {
      pending.delete(msg.callbackId);
      r(msg.payload ? JSON.parse(msg.payload) : undefined);
    }
    return;
  }
  if (msg.direction !== 'call') return;
  const h = handlers[msg.name];
  const payload = msg.payload ? JSON.parse(msg.payload) : undefined;
  if (!h) {
    if (msg.callbackId) send({ direction: 'response', callbackId: msg.callbackId, success: true });
    return;
  }
  try {
    const res = await h(payload);
    if (msg.callbackId) send({ direction: 'response', callbackId: msg.callbackId, success: true, payload: JSON.stringify(res) });
  } catch (e) {
    if (msg.callbackId) send({ direction: 'response', callbackId: msg.callbackId, success: false, payload: JSON.stringify({ message: String(e) }) });
  }
});

call('register', { apiVersion: '1.0.0', connectionId: process.env.CONNECTION_ID, verificationToken: process.env.VERIFICATION_TOKEN });
