# conductor-drivers

kajisho5/conductor（iPhone / iPad の機器操作アプリ）が読むドライバ定義の置き場と、その変換の仕組み。

## 決まっていること
- 定義は JSON のデータだけ。プログラム（JS・Swift）は配らない（conductor の SPEC 7.1）
- 定義は公開 OSS のモジュールを GitHub Actions で動かして自動で作る。モジュールのプログラムをこのリポにも手元の作業環境にも置かない・動かさない（CI の中だけ）
- ライセンスが MIT・ISC・BSD・Apache-2.0 などのモジュールだけ使う。CREDITS.md に出典を残す
- 定義の表示文字列（name・evidence の title など）に、元のソフトの製品名・ロゴを使わない。メーカー名・機種名はよい
- `defs/` `builtin/` `index.json` `REPORT.md` `CREDITS.md` は Actions が作る（`builtin/` はアプリに組み込みの定義がある機種の変換結果。アプリ側の scripts/drivers が組み込みの定義へ動作を足す）。手で直さない（直すなら tools/ を直して作り直す）
- テスト・サンプルに実在の社名・人名・会場名を使わない（DEMO-SW-A 等）

## コマンド
- `npm test` … 変換の仕組みのテスト（自作の模擬モジュールを使う）
- Actions の `import` を手動実行 … 全モジュールを変換して defs/ を更新（入力 only でモジュールを絞れる。絞った時は保存しない）

## 返答
- 日本語で短く、結論から
