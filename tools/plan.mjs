/**
 * 動作ごとに「どの値で実行してみるか」を決める。
 * base（基準）を 1 回、選択肢を 1 つずつ変えたもの（variant）、全部をまとめて変えたもの（combo、検算用）。
 * 文字の欄は目印の文字（QB…／QV…）、数の欄は基準と違う 2 つの値、選択肢は全部（多すぎる時は先頭から）。
 */

export const MAX_CHOICES = 48;
export const MAX_RUNS_PER_ACTION = 120;

export function baseValue(opt, index) {
  switch (opt.type) {
    case 'textinput': {
      const d = opt.default;
      if (typeof d === 'string' && d !== '' && !d.includes('$(')) return d;
      if (typeof d === 'number') return String(d);
      return `QB${index}x`;
    }
    case 'number': {
      if (typeof opt.default === 'number') return opt.default;
      if (typeof opt.min === 'number') return opt.min;
      return 0;
    }
    case 'dropdown':
      return opt.default !== undefined ? opt.default : opt.choices?.[0]?.id;
    case 'checkbox':
      return opt.default === true;
    case 'multidropdown':
      return Array.isArray(opt.default) ? opt.default : [];
    default:
      return opt.default;
  }
}

/** 数の欄：基準と違う 2 つの値（範囲内・整数） */
export function numberVariants(opt, base) {
  const min = typeof opt.min === 'number' ? opt.min : -1e9;
  const max = typeof opt.max === 'number' ? opt.max : 1e9;
  const step = typeof opt.step === 'number' && opt.step > 0 && opt.step < 1 ? opt.step : 1;
  const out = [];
  const tryAdd = (v) => {
    const r = step < 1 ? Math.round(v / step) * step : Math.round(v);
    const c = Math.min(max, Math.max(min, r));
    if (c !== base && !out.includes(c) && Number.isFinite(c)) out.push(c);
  };
  for (const d of [7, 20, 3, 1, -1, -7]) {
    if (out.length >= 2) break;
    tryAdd(base + d);
  }
  if (out.length < 2 && min > -1e9) tryAdd(min);
  if (out.length < 2 && max < 1e9) tryAdd(max);
  return out;
}

export function variantValues(opt, base, index) {
  switch (opt.type) {
    case 'textinput':
      return [`QV${index}yz`];
    case 'number':
      return numberVariants(opt, Number(base));
    case 'dropdown':
      return (opt.choices ?? [])
        .map((c) => c.id)
        .filter((id) => id !== base)
        .slice(0, MAX_CHOICES);
    case 'checkbox':
      return [!base];
    default:
      return [];
  }
}

/** 決まった順の疑似乱数（検算の組み合わせを毎回同じにする） */
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

export function planAction(def) {
  const options = (def.options ?? []).filter((o) => o && o.id && o.type !== 'static-text');
  const base = {};
  options.forEach((o, i) => {
    base[o.id] = baseValue(o, i);
  });
  const runs = [{ actionId: def.id, role: 'base', options: { ...base } }];
  const variantsById = {};
  options.forEach((o, i) => {
    const vs = variantValues(o, base[o.id], i);
    variantsById[o.id] = vs;
    for (const v of vs) runs.push({ actionId: def.id, role: 'variant', optionId: o.id, options: { ...base, [o.id]: v } });
  });
  const changeable = options.filter((o) => (variantsById[o.id] ?? []).length > 0);
  if (changeable.length >= 2) {
    const r = rng(def.id.length * 7919 + changeable.length);
    for (let k = 0; k < 2; k++) {
      const combo = { ...base };
      for (const o of changeable) {
        const vs = variantsById[o.id];
        combo[o.id] = vs[Math.floor(r() * vs.length)];
      }
      runs.push({ actionId: def.id, role: 'combo', options: combo });
    }
  }
  return runs.slice(0, MAX_RUNS_PER_ACTION);
}

export function planRuns(actionDefs, { maxRuns = 1500 } = {}) {
  const runs = [];
  let truncated = false;
  for (const def of actionDefs ?? []) {
    const r = planAction(def);
    if (runs.length + r.length > maxRuns) {
      truncated = true;
      break;
    }
    runs.push(...r);
  }
  return { runs, truncated };
}
