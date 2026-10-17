/**
 * 返事を待ってから送るモジュールのための、受け皿（TCP）の返事。
 * 公開されている通信仕様のあいさつと「受け付けた」だけを返す（状態は返さない）。
 * キーはモジュールの id、またはそれに含まれる文字（pjlink など）。
 */

/** HyperDeck Ethernet Protocol（公開マニュアル）：接続すると 500、命令には 200 ok */
const hyperdeck = {
  onConnect: () => '500 connection info:\r\nprotocol version: 1.11\r\nmodel: DEMO-DECK\r\n\r\n',
  onLine: (line) => (line.trim() ? '200 ok\r\n' : null),
  split: /\r?\n/,
};

/** PJLink（JBMIA 公開仕様）：接続すると「PJLINK 0」（認証なし）、命令 %1XXXX には =OK */
const pjlink = {
  onConnect: () => 'PJLINK 0\r',
  onLine: (line) => {
    const m = /^%([12])([A-Z0-9]{4})/.exec(line.trim());
    return m ? `%${m[1]}${m[2]}=OK\r` : null;
  },
  split: /\r/,
};

const BY_ID = {
  'bmd-hyperdeck': hyperdeck,
};

export function responderFor(moduleId) {
  if (BY_ID[moduleId]) return BY_ID[moduleId];
  if (/pjlink/i.test(moduleId)) return pjlink;
  return null;
}
