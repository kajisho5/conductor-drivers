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
