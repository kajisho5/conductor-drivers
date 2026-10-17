# conductor-drivers

iPhone / iPad アプリ conductor が読み込む機器のドライバ定義（JSON）。定義はデータだけで、プログラムは含まない。

## 中身

- `defs/m-<id>.json` … 機器ごとの定義（送る内容のテンプレート・設定の欄・プリセット）
- `index.json` … 定義の一覧（アプリはまずこれを読み、使う機器の定義だけを取りに来る）
- `REPORT.md` / `report.json` … 変換の結果（どの機器のどの動作が送れるか、送れない理由）
- `CREDITS.md` … 参考にした公開 OSS とライセンス

## 作り方

公開 OSS のモジュール一式を GitHub Actions（`.github/workflows/import.yml`）の使い捨て環境で動かし、
動作を 1 つずつ実行して「何を送ったか」を記録する。外への通信は `tools/capture.cjs` が横取りするので、実機や外部には何も送らない。

1. `tools/host.mjs` … モジュールを子プロセスで起動し、IPC で設定・初期化・動作の実行を行う
2. `tools/plan.mjs` … 動作ごとに試す値を決める（基準、選択肢を 1 つずつ変えたもの、組み合わせ）
3. `tools/derive.mjs` … 記録の差から送る内容のテンプレートを作り、全部の実行を描き直して一致したものだけ採用
4. `tools/convert.mjs` / `convert-all.mjs` … アプリの定義の形にして `defs/` に書き出す

状態表示（フィードバック）と変数は、受信の解析がプログラムなので変換しない。返事を待ってから送る機器や独自の接続手順がある機器は送る内容を作れない（REPORT.md の no-send / list-only）。

## テンプレートの書き方（アプリと共通）

`{{option.x}}` `{{config.x}}` に、フィルタ `|map`（選択肢ごとの中身）`|padN` `|hexstr` `|u8` `|u16be` `|u16le` `|u32be` `|u32le` `|i16be` `|f32be` を付けられる。

## 手元で確かめる

```
npm test
```
