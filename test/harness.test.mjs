import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { convertModule } from '../tools/convert.mjs';
import { deriveBytesAction, renderSend } from '../tools/derive.mjs';
import { runModule } from '../tools/host.mjs';
import { renderTemplate } from '../tools/render.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const hex = (s) => Buffer.from(s).toString('hex');
const tcp = (s) => ({ t: 'tcp', host: '10.11.12.13', port: 7000, hex: typeof s === 'string' ? hex(s) : Buffer.from(s).toString('hex') });

test('フィルタ', () => {
  assert.equal(renderTemplate('{{option.a|pad3}}', { option: { a: 7 } }), '007');
  assert.equal(renderTemplate('{{option.a|u16be}}', { option: { a: 258 } }), '0102');
  assert.equal(renderTemplate('{{option.a|u16le}}', { option: { a: 258 } }), '0201');
  assert.equal(renderTemplate('{{option.a|pad2|hexstr}}', { option: { a: 5 } }), '3035');
  assert.equal(renderTemplate('{{option.m|map}}', { option: { m: 'b' }, maps: { m: { b: 'BYP' } } }), 'BYP');
  assert.equal(renderTemplate('{{option.on|map}}', { option: { on: true }, maps: { on: { true: '1', false: '0' } } }), '1');
});

test('数の位置を見つけてテンプレートにする（テキスト）', () => {
  const def = { id: 'route', options: [{ type: 'number', id: 'out', default: 1 }, { type: 'number', id: 'in', default: 2 }] };
  const runs = [
    { role: 'base', options: { out: 1, in: 2 }, sends: [tcp('X01:2\r\n')] },
    { role: 'variant', optionId: 'out', options: { out: 8, in: 2 }, sends: [tcp('X08:2\r\n')] },
    { role: 'variant', optionId: 'out', options: { out: 12, in: 2 }, sends: [tcp('X12:2\r\n')] },
    { role: 'variant', optionId: 'in', options: { out: 1, in: 9 }, sends: [tcp('X01:9\r\n')] },
    { role: 'variant', optionId: 'in', options: { out: 1, in: 16 }, sends: [tcp('X01:16\r\n')] },
    { role: 'combo', options: { out: 12, in: 16 }, sends: [tcp('X12:16\r\n')] },
  ];
  const r = deriveBytesAction(def, runs, 'tcp');
  assert.equal(r.ok, true, r.reason);
  assert.equal(r.send.data, 'X{{option.out|pad2}}:{{option.in}}\\r\\n');
  assert.equal(Buffer.from(renderSend(r.send, { out: 3, in: 4 }, r.maps)).toString(), 'X03:4\r\n');
});

test('選択肢ごとに違う中身は maps にする', () => {
  const def = { id: 'mode', options: [{ type: 'dropdown', id: 'm', default: 'a', choices: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] }] };
  const runs = [
    { role: 'base', options: { m: 'a' }, sends: [tcp('MODE AUTO\r\n')] },
    { role: 'variant', optionId: 'm', options: { m: 'b' }, sends: [tcp('MODE BYPASS\r\n')] },
    { role: 'variant', optionId: 'm', options: { m: 'c' }, sends: [tcp('MODE CUT\r\n')] },
  ];
  const r = deriveBytesAction(def, runs, 'tcp');
  assert.equal(r.ok, true, r.reason);
  assert.equal(r.send.data, 'MODE {{option.m|map}}\\r\\n');
  assert.deepEqual(r.maps.m, { a: 'AUTO', b: 'BYPASS', c: 'CUT' });
});

test('バイナリは 16 進のテンプレートにする', () => {
  const def = { id: 'bin', options: [{ type: 'number', id: 'lvl', default: 10 }] };
  const runs = [
    { role: 'base', options: { lvl: 10 }, sends: [tcp([2, 16, 10, 3])] },
    { role: 'variant', optionId: 'lvl', options: { lvl: 17 }, sends: [tcp([2, 16, 17, 3])] },
    { role: 'variant', optionId: 'lvl', options: { lvl: 30 }, sends: [tcp([2, 16, 30, 3])] },
  ];
  const r = deriveBytesAction(def, runs, 'tcp');
  assert.equal(r.ok, true, r.reason);
  assert.equal(r.send.encoding, 'hex');
  assert.equal(r.send.data, '0210{{option.lvl|u8}}03');
});

test('検算で合わなければ使わない', () => {
  const def = { id: 'x', options: [{ type: 'number', id: 'n', default: 1 }, { type: 'number', id: 'k', default: 1 }] };
  const runs = [
    { role: 'base', options: { n: 1, k: 1 }, sends: [tcp('A1B1')] },
    { role: 'variant', optionId: 'n', options: { n: 8, k: 1 }, sends: [tcp('A8B1')] },
    { role: 'variant', optionId: 'n', options: { n: 9, k: 1 }, sends: [tcp('A9B1')] },
    { role: 'variant', optionId: 'k', options: { n: 1, k: 8 }, sends: [tcp('A1B8')] },
    { role: 'variant', optionId: 'k', options: { n: 1, k: 9 }, sends: [tcp('A1B9')] },
    { role: 'combo', options: { n: 8, k: 9 }, sends: [tcp('A8B9C')] },
  ];
  const r = deriveBytesAction(def, runs, 'tcp');
  assert.equal(r.ok, false);
});

test('模擬モジュールを動かして定義を作る', { timeout: 120000 }, async () => {
  const raw = await runModule(path.join(HERE, 'fake-module'));
  assert.equal(raw.status, 'ok', raw.errors.join(';'));
  assert.equal(raw.actionDefs.length, 7);
  assert.ok(raw.initSends.some((s) => s.t === 'tcp' && Buffer.from(s.hex, 'hex').toString() === 'HELLO\r\n'));
  const { def, report } = convertModule(raw);
  assert.equal(report.result, 'partial');
  assert.equal(def.transport, 'tcp');
  const ids = def.actions.map((a) => a.id).sort();
  assert.deepEqual(ids, ['bin', 'mode', 'name', 'route']);
  const port = def.configFields.find((f) => f.id === 'port');
  assert.equal(port.default, 7000);
  const route = def.actions.find((a) => a.id === 'route');
  assert.equal(route.send.data, 'X{{option.out|pad2}}:{{option.in}}\\r\\n');
  const name = def.actions.find((a) => a.id === 'name');
  assert.equal(name.send.data, 'NAME "{{option.text}}"\\r\\n');
  assert.equal(def.presets.length, 1);
  assert.equal(def.presets[0].backgroundColor, '#ff0000');
  assert.equal(def.id, 'm-demo-sw-a');
});

test('a×値＋b と 0 埋め（100 − 速さ）', () => {
  const def = { id: 'pan', options: [{ type: 'number', id: 'speed', default: 30 }] };
  const runs = [
    { role: 'base', options: { speed: 30 }, sends: [tcp('#01P70\r')] },
    { role: 'variant', optionId: 'speed', options: { speed: 37 }, sends: [tcp('#01P63\r')] },
    { role: 'variant', optionId: 'speed', options: { speed: 49 }, sends: [tcp('#01P51\r')] },
  ];
  const r = deriveBytesAction(def, runs, 'tcp');
  assert.equal(r.ok, true, r.reason);
  assert.equal(r.send.data, '#01P{{option.speed|lin:-1:100}}\\r');
});

test('数として使う文字の欄（目印の文字は NaN になる）', () => {
  const def = { id: 'go', options: [{ type: 'textinput', id: 'pb', default: '1' }] };
  const runs = [
    { role: 'base', options: { pb: '1' }, sends: [tcp('GO 1\r')] },
    { role: 'variant', optionId: 'pb', options: { pb: 'QV0yz' }, sends: [tcp('GO NaN\r')] },
    { role: 'variant', optionId: 'pb', options: { pb: '37' }, sends: [tcp('GO 37\r')] },
    { role: 'variant', optionId: 'pb', options: { pb: '52' }, sends: [tcp('GO 52\r')] },
  ];
  const r = deriveBytesAction(def, runs, 'tcp');
  assert.equal(r.ok, true, r.reason);
  assert.equal(r.send.data, 'GO {{option.pb}}\\r');
});

test('OSC は宛先と引数ごとのテンプレートにする', () => {
  const osc = (addr, f) => {
    const pad = (s) => {
      const b = Buffer.from(`${s}\0`);
      return Buffer.concat([b, Buffer.alloc((4 - (b.length % 4)) % 4)]);
    };
    const fb = Buffer.alloc(4);
    fb.writeFloatBE(f);
    return { t: 'udp', host: '10.11.12.13', port: 10024, hex: Buffer.concat([pad(addr), pad(',f'), fb]).toString('hex') };
  };
  const def = { id: 'fader', options: [{ type: 'number', id: 'ch', default: 1, min: 1, max: 32 }, { type: 'number', id: 'lvl', default: 50, min: 0, max: 100 }] };
  const runs = [
    { role: 'base', options: { ch: 1, lvl: 50 }, sends: [osc('/ch/01/mix/fader', 0.5)] },
    { role: 'variant', optionId: 'ch', options: { ch: 8, lvl: 50 }, sends: [osc('/ch/08/mix/fader', 0.5)] },
    { role: 'variant', optionId: 'ch', options: { ch: 21, lvl: 50 }, sends: [osc('/ch/21/mix/fader', 0.5)] },
    { role: 'variant', optionId: 'lvl', options: { ch: 1, lvl: 57 }, sends: [osc('/ch/01/mix/fader', 0.57)] },
    { role: 'variant', optionId: 'lvl', options: { ch: 1, lvl: 70 }, sends: [osc('/ch/01/mix/fader', 0.7)] },
    { role: 'combo', options: { ch: 21, lvl: 70 }, sends: [osc('/ch/21/mix/fader', 0.7)] },
  ];
  const r = deriveBytesAction(def, runs, 'udp');
  assert.equal(r.ok, true, r.reason);
  assert.equal(r.send.kind, 'osc');
  assert.equal(r.send.address, '/ch/{{option.ch|pad2}}/mix/fader');
  assert.deepEqual(r.send.args, [{ type: 'f', value: '{{option.lvl|lin:0.01:0}}' }]);
});

test('選択肢が多くても数として入っていれば使う', () => {
  const choices = Array.from({ length: 80 }, (_v, i) => ({ id: String(i + 1) }));
  const def = { id: 'key', options: [{ type: 'dropdown', id: 'k', default: '11', choices }] };
  const runs = [{ role: 'base', options: { k: '11' }, sends: [tcp('KEY(11)\r\n')] }];
  for (const c of choices.slice(0, 48)) if (c.id !== '11') runs.push({ role: 'variant', optionId: 'k', options: { k: c.id }, sends: [tcp(`KEY(${c.id})\r\n`)] });
  const r = deriveBytesAction(def, runs, 'tcp');
  assert.equal(r.ok, true, r.reason);
  assert.equal(r.send.data, 'KEY({{option.k}})\\r\\n');
});

test('WebSocket のフレームを読む・JSON の通し番号をそろえる', async () => {
  const { readFrames, parseUpgrade, acceptKey } = await import('../tools/ws.mjs');
  const { normalizeCounters } = await import('../tools/derive.mjs');
  assert.equal(acceptKey('dGhlIHNhbXBsZSBub25jZQ=='), 's3pPLMBiTxaQ9kYGzzhZRbK+xOo=');
  const up = parseUpgrade('GET /api/ws HTTP/1.1\r\nHost: x\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: abc\r\n\r\n');
  assert.equal(up.path, '/api/ws');
  const payload = Buffer.from('{"op":6,"d":{"requestId":"7","requestType":"SetScene"}}');
  const mask = Buffer.from([1, 2, 3, 4]);
  const masked = Buffer.from(payload.map((b, i) => b ^ mask[i % 4]));
  const frame = Buffer.concat([Buffer.from([0x81, 0x80 | payload.length]), mask, masked]);
  const r = readFrames(frame);
  assert.equal(r.messages[0].text, payload.toString());
  assert.equal(normalizeCounters(r.messages[0].text), '{"op":6,"d":{"requestId":"1","requestType":"SetScene"}}');
});

test('数の欄の基準の値が近いと離す（overlap を避ける）', async () => {
  const { planAction } = await import('../tools/plan.mjs');
  const runs = planAction({
    id: 'a',
    options: [
      { id: 'x', type: 'textinput', default: '1' },
      { id: 'y', type: 'textinput', default: '1' },
      { id: 'v', type: 'number', default: 0, min: 0, max: 1 },
    ],
  });
  const b = runs[0].options;
  assert.equal(b.x, '1');
  assert.equal(b.y, '6');
  assert.equal(b.v, 0);
});

test('選択肢の欄の数とも離す', async () => {
  const { planAction } = await import('../tools/plan.mjs');
  const runs = planAction({
    id: 'b',
    options: [
      { id: 'x', type: 'dropdown', default: '0', choices: [{ id: '0' }, { id: '1' }] },
      { id: 'v', type: 'number', default: 0, min: -100, max: 100 },
    ],
  });
  assert.equal(runs[0].options.v, 5);
});
