/**
 * IPC の payload の読み書き（EJSON の一部だけ）。モジュール側はバイト列を { $binary: base64 }、日時を { $date: ms } で送る。
 * ホストからモジュールへはバイト列を送らないので、書く方は普通の JSON で足りる。
 */
function revive(v) {
  if (Array.isArray(v)) return v.map(revive);
  if (v && typeof v === 'object') {
    const keys = Object.keys(v);
    if (keys.length === 1 && keys[0] === '$binary' && typeof v.$binary === 'string') return Uint8Array.from(Buffer.from(v.$binary, 'base64'));
    if (keys.length === 1 && keys[0] === '$date') return new Date(v.$date);
    if (keys.length === 1 && keys[0] === '$InfNaN') return v.$InfNaN / 0;
    if (keys.length === 1 && keys[0] === '$escape' && v.$escape && typeof v.$escape === 'object') {
      const out = {};
      for (const [k, x] of Object.entries(v.$escape)) out[k] = revive(x);
      return out;
    }
    const out = {};
    for (const [k, x] of Object.entries(v)) out[k] = revive(x);
    return out;
  }
  return v;
}

export default {
  parse(text) {
    return revive(JSON.parse(text));
  },
  stringify(value) {
    return JSON.stringify(value === undefined ? null : value);
  },
};
