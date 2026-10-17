/**
 * raw/*.json から defs/*.json・index.json・REPORT.md・CREDITS.md を作る。
 *   node tools/convert-all.mjs <raw のフォルダ> <リポのルート>
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { convertModule } from './convert.mjs';

const [rawDir, repoRoot] = process.argv.slice(2);
const defsDir = path.join(repoRoot, 'defs');
rmSync(defsDir, { recursive: true, force: true });
mkdirSync(defsDir, { recursive: true });

const reports = [];
const index = [];
const credits = [];
for (const f of readdirSync(rawDir).filter((x) => x.endsWith('.json')).sort()) {
  let raw;
  try {
    raw = JSON.parse(readFileSync(path.join(rawDir, f), 'utf8'));
  } catch (e) {
    reports.push({ id: f.replace(/\.json$/, ''), result: 'unreadable', errors: [String(e)] });
    continue;
  }
  if (!raw.module?.manufacturer) {
    reports.push({ id: raw.module?.id ?? f, result: 'crashed', errors: raw.errors ?? [] });
    continue;
  }
  const { def, report } = convertModule(raw);
  reports.push(report);
  if (!def) continue;
  const json = `${JSON.stringify(def, null, 1)}\n`;
  writeFileSync(path.join(defsDir, `${def.id}.json`), json);
  index.push({
    id: def.id,
    name: def.name,
    category: def.category,
    transport: def.transport,
    version: def.version,
    minAppVersion: def.minAppVersion,
    actions: def.actions.length,
    allActions: report.actions,
    bytes: Buffer.byteLength(json),
  });
  credits.push(raw.module);
}

const generatedAt = new Date().toISOString();
writeFileSync(path.join(repoRoot, 'index.json'), `${JSON.stringify({ format: 1, generatedAt, drivers: index }, null, 1)}\n`);
writeFileSync(path.join(repoRoot, 'report.json'), `${JSON.stringify(reports, null, 1)}\n`);

const count = (r) => reports.filter((x) => x.result === r).length;
const reasonTotals = {};
for (const r of reports) for (const [k, v] of Object.entries(r.reasons ?? {})) reasonTotals[k] = (reasonTotals[k] ?? 0) + v;
const lines = [
  '# 変換の結果',
  '',
  `作成：${generatedAt}`,
  '',
  '| 結果 | 数 | 意味 |',
  '|---|---|---|',
  `| full | ${count('full')} | 全部の動作を送れる |`,
  `| partial | ${count('partial')} | 一部の動作を送れる |`,
  `| list-only | ${count('list-only')} | 動作の一覧は取れたが、送る内容を作れなかった |`,
  `| no-send | ${count('no-send')} | 動作を実行しても何も送らなかった（返事待ち・独自の接続手順など） |`,
  `| failed / crashed | ${count('failed') + count('crashed') + count('unreadable')} | モジュールが起動しなかった |`,
  `| license | ${count('license')} | ライセンスが再利用を許していないので除外 |`,
  `| builtin | ${count('builtin')} | アプリに組み込みの定義がある |`,
  `| 合計 | ${reports.length} | |`,
  '',
  `送れる動作：${reports.reduce((s, r) => s + (r.converted ?? 0), 0)} / ${reports.reduce((s, r) => s + (r.actions ?? 0), 0)}`,
  '',
  '## 送れなかった理由（動作の数）',
  '',
  ...Object.entries(reasonTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `- ${k}: ${v}`),
  '',
  '## 機器ごと',
  '',
  '| モジュール | 名前 | 結果 | 送れる / 全部 | ライセンス |',
  '|---|---|---|---|---|',
  ...reports.map((r) => `| ${r.id} | ${r.name ?? ''} | ${r.result} | ${r.converted ?? 0} / ${r.actions ?? 0} | ${r.license ?? ''} |`),
  '',
];
writeFileSync(path.join(repoRoot, 'REPORT.md'), lines.join('\n'));

const creditLines = [
  '# 参考にした公開 OSS',
  '',
  'defs/ の定義は、次の公開モジュールの動作を自動で記録して作ったものです。各モジュールの著作権は作者にあり、それぞれのライセンスに従います。',
  '',
  '| モジュール | 版 | ライセンス | 作者 | リポジトリ |',
  '|---|---|---|---|---|',
  ...credits.map((m) => `| ${m.id} | ${m.version} | ${m.license} | ${(m.maintainers ?? []).join(', ')} | ${String(m.repository ?? '').replace(/^git\+/, '')} |`),
  '',
  '## MIT License',
  '',
  'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:',
  '',
  'The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.',
  '',
  'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
  '',
  'MIT 以外（ISC・BSD・Apache-2.0 など）のモジュールは、上の表のライセンス欄のとおり、それぞれのリポジトリにある条文に従います。',
  '',
];
writeFileSync(path.join(repoRoot, 'CREDITS.md'), creditLines.join('\n'));
console.log(`full=${count('full')} partial=${count('partial')} list-only=${count('list-only')} no-send=${count('no-send')} license=${count('license')} total=${reports.length}`);
