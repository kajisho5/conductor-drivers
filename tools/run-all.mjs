/**
 * 全モジュールを host.mjs で動かして raw/<id>.json に記録する。
 *   node tools/run-all.mjs <モジュール一式のフォルダ> <出力フォルダ> [--shard i/n] [--jobs 8] [--only id,id]
 * 1 モジュールずつ別プロセスで動かし、固まったら打ち切る。
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HARD_LIMIT_MS = 35 * 60 * 1000;

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const [root, outDir] = process.argv.slice(2);
const [shard, shards] = String(arg('--shard', '0/1')).split('/').map(Number);
const jobs = Number(arg('--jobs', '8'));
const only = arg('--only', '');

mkdirSync(outDir, { recursive: true });
let dirs = readdirSync(root)
  .filter((d) => existsSync(path.join(root, d, 'companion', 'manifest.json')))
  .sort();
if (only) {
  const want = new Set(only.split(','));
  dirs = dirs.filter((d) => want.has(d));
}
dirs = dirs.filter((_d, i) => i % shards === shard);
console.log(`shard ${shard}/${shards}: ${dirs.length} modules, ${jobs} jobs`);

function runOne(dir) {
  return new Promise((resolve) => {
    const out = path.join(outDir, `${dir}.json`);
    const child = spawn(process.execPath, [path.join(HERE, 'host.mjs'), path.join(root, dir), out], { stdio: ['ignore', 'pipe', 'pipe'] });
    let text = '';
    child.stdout.on('data', (d) => (text += d));
    child.stderr.on('data', (d) => (text += d));
    const timer = setTimeout(() => child.kill('SIGKILL'), HARD_LIMIT_MS);
    child.on('exit', (code, signal) => {
      clearTimeout(timer);
      if (!existsSync(out)) {
        writeFileSync(
          out,
          JSON.stringify({ module: { id: dir }, status: 'crashed', errors: [`host exited ${code ?? signal}`, text.slice(-2000)], runs: [], actionDefs: [] }),
        );
      }
      console.log(text.trim().split('\n').pop());
      resolve();
    });
  });
}

const queue = [...dirs];
await Promise.all(
  Array.from({ length: jobs }, async () => {
    while (queue.length > 0) await runOne(queue.shift());
  }),
);
console.log('done');
