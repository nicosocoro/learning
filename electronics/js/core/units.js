// Formateo de números en español (coma decimal) y con prefijos del SI.

(function () {
  const Elec = (window.Elec ??= {});

  const PREFIXES = [
    [1e-12, 'p'],
    [1e-9, 'n'],
    [1e-6, 'µ'],
    [1e-3, 'm'],
    [1, ''],
    [1e3, 'k'],
    [1e6, 'M'],
  ];

  /** Número con `sig` cifras significativas y coma decimal. */
  function num(x, sig = 3) {
    if (!Number.isFinite(x)) return '∞';
    if (x === 0) return '0';
    return Number(x.toPrecision(sig)).toString().replace('.', ',');
  }

  /** Valor con prefijo SI: si(0.0123, 'A') → "12,3 mA". */
  function si(x, unit, sig = 3) {
    if (x === 0 || !Number.isFinite(x)) return `${num(x)} ${unit}`;
    const abs = Math.abs(x);
    let chosen = PREFIXES[0];
    for (const prefix of PREFIXES) {
      if (abs >= prefix[0] * 0.9995) chosen = prefix;
    }
    return `${num(x / chosen[0], sig)} ${chosen[1]}${unit}`;
  }

  Object.assign(Elec, { num, si });
})();
