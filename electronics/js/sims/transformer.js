// Capítulo 11: transformador monofásico. Relación de vueltas, corrientes y pérdidas.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, drawAcSource, drawResistor, polyline, text, arrow, si, num } = Elec;

  const FREQ = 0.5; // Hz mostrados (la red real es de 50 o 60 Hz)
  const SAMPLES = 160;
  const EFFICIENCY = 0.95;
  const I0_REF = 0.03; // A de magnetización a 230 V con 1000 vueltas
  const turnsToLoops = (n) => Math.max(3, Math.min(14, Math.round(n / 150)));

  function drawCoil(ctx, x, top, bottom, loops, color) {
    const pitch = (bottom - top) / loops;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    for (let n = 0; n < loops; n++) {
      ctx.beginPath();
      ctx.ellipse(x, top + (n + 0.5) * pitch, 17, pitch * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Transformador con carga',
    label: 'Transformador con dos bobinas sobre un núcleo de hierro, fuente alterna en el primario y una resistencia de carga en el secundario',
    caption: 'La corriente alterna del primario crea un flujo magnético variable en el núcleo, que induce tensión en el secundario. Las tres flechas del hueco del núcleo muestran, en cada instante, el flujo que crea el primario, el que crea el secundario (opuesto al del primario cuando hay carga) y el flujo neto que queda en el núcleo. Frecuencia reducida a 0,5 Hz para poder verla. En la vista de tensiones, la curva del secundario se dibuja a escala relativa.',
    chart: true,
    controls: [
      { key: 'vp', label: 'Tensión eficaz del primario (V<sub>p</sub>)', min: 10, max: 240, step: 5, value: 230, unit: 'V' },
      { key: 'np', label: 'Vueltas del primario (N<sub>p</sub>)', min: 200, max: 2000, step: 100, value: 1000, unit: '', format: (v) => `${v} vueltas` },
      { key: 'ns', label: 'Vueltas del secundario (N<sub>s</sub>)', min: 50, max: 500, step: 50, value: 50, unit: '', format: (v) => `${v} vueltas` },
      { key: 'r', label: 'Resistencia de la carga (R)', min: 10, max: 200, step: 10, value: 10, unit: 'Ω' },
      { type: 'choice', key: 'load', label: 'Secundario', value: 'on', options: [{ value: 'on', label: 'Con carga' }, { value: 'off', label: 'En vacío (abierto)' }] },
      { type: 'choice', key: 'view', label: 'Gráfica', value: 'volts', options: [{ value: 'volts', label: 'Tensiones' }, { value: 'flux', label: 'Flujos (A·vuelta)' }] },
      { type: 'choice', key: 'model', label: 'Modelo', value: 'ideal', options: [{ value: 'ideal', label: 'Ideal (sin pérdidas)' }, { value: 'real', label: 'Real (95 %)' }] },
    ],

    setup({ params, chart }) {
      const primary = new FlowPath([], { closed: true });
      const secondary = new FlowPath([], { closed: true });
      const flux = new FlowPath([], { closed: true });
      let time = 0;

      const ratio = () => params.ns / params.np;
      const vs = () => params.vp * ratio();
      const eta = () => (params.model === 'ideal' ? 1 : EFFICIENCY);
      const loaded = () => params.load === 'on';
      const isec = () => (loaded() ? vs() / params.r : 0);
      const pout = () => vs() * isec();
      const pin = () => pout() / eta();
      const ipri = () => pin() / params.vp; // componente que compensa a la carga
      const imag = () => I0_REF * (params.vp / 230) * (1000 / params.np) ** 2; // magnetiza el núcleo
      const itotal = () => Math.hypot(ipri(), imag());
      // Amperes-vuelta (valores pico): lo que cada bobina aporta al flujo del núcleo
      const mmfLoad = () => Math.SQRT2 * params.ns * isec();
      const mmfNet = () => Math.SQRT2 * params.np * imag();
      const mmfRef = () => Math.max(Math.hypot(mmfLoad(), mmfNet()), 1e-9);
      // Flujo neto ∝ −cos (la tensión es su derivada); la carga está en fase con la tensión
      const mmfs = (a) => {
        const net = -mmfNet() * Math.cos(a);
        const sec = -mmfLoad() * Math.sin(a);
        return { prim: net - sec, sec, net };
      };
      const angle = () => 2 * Math.PI * FREQ * time;
      const swing = (current, max) => 3 + 15 * Math.sqrt(Math.min(current / max, 1));

      return {
        reset() {
          time = 0;
        },

        step(dt) {
          time += dt;
          primary.phase = swing(itotal(), 1) * Math.cos(angle());
          secondary.phase = swing(isec(), 15) * Math.cos(angle());
          flux.phase = 22 * Math.sin(angle());
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const xl = w * 0.36;
          const xr = w * 0.64;
          const yt = h * 0.12;
          const yb = h * 0.84;
          const yc1 = h * 0.28;
          const yc2 = h * 0.68;
          const ym = (yc1 + yc2) / 2;
          const xs = w * 0.12;
          const xl2 = w * 0.88;
          const core = [[xl, yt], [xr, yt], [xr, yb], [xl, yb]];

          // Núcleo de hierro
          ctx.save();
          ctx.strokeStyle = c.muted;
          ctx.globalAlpha = 0.4;
          ctx.lineWidth = 26;
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(...core[0]);
          for (const p of core.slice(1)) ctx.lineTo(...p);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
          if (w >= 520) text(ctx, 'núcleo de hierro', (xl + xr) / 2, yt + 26, { align: 'center', size: 11, color: c.muted });
          flux.setPoints(core);
          flux.draw(ctx, { color: c.heat, radius: 3.5, sign: null, spacing: 26 });

          // Circuitos
          const pLoop = [[xl - 17, yc1], [xs, yc1], [xs, yc2], [xl - 17, yc2]];
          const sLoop = [[xr + 17, yc1], [xl2, yc1], [xl2, yc2], [xr + 17, yc2]];
          polyline(ctx, pLoop, { color: c.wire, width: 3, close: true });
          polyline(ctx, sLoop, { color: c.wire, width: 3, close: true });
          drawAcSource(ctx, xs, ym);
          drawResistor(ctx, xl2, ym, { orient: 'v', len: 80, heat: Math.min(1, pout() / 600) });
          primary.setPoints(pLoop);
          secondary.setPoints(sLoop);
          primary.draw(ctx, { radius: 4 });
          secondary.draw(ctx, { radius: 4 });

          // Bobinas encima de las patas del núcleo
          drawCoil(ctx, xl, yc1, yc2, turnsToLoops(params.np), c.accent);
          drawCoil(ctx, xr, yc1, yc2, turnsToLoops(params.ns), c.chargePos);

          // Flujos en el hueco del núcleo: primario, neto y secundario (positivo = hacia arriba)
          const m = mmfs(angle());
          const gap = (xr - xl) / 4;
          const reach = (yb - yt) * 0.3;
          const bars = [
            { v: m.prim, color: c.accent, name: 'primario', x: xl + gap },
            { v: m.net, color: c.good, name: 'neto', x: (xl + xr) / 2 },
            { v: m.sec, color: c.chargeNeg, name: 'secundario', x: xr - gap },
          ];
          for (const b of bars) {
            const len = (b.v / mmfRef()) * reach;
            polyline(ctx, [[b.x - 9, ym], [b.x + 9, ym]], { color: c.muted, width: 1 });
            if (Math.abs(len) > 2) arrow(ctx, b.x, ym, b.x, ym - len, { color: b.color, width: 4, head: 9 });
            if (w >= 520) text(ctx, b.name, b.x, ym + reach + 22, { align: 'center', size: 10, color: b.color, weight: 600 });
          }

          text(ctx, `N = ${params.np}`, xl, yb + 22, { align: 'center', size: 12, color: c.accent, weight: 600 });
          text(ctx, `N = ${params.ns}`, xr, yb + 22, { align: 'center', size: 12, color: c.chargePos, weight: 600 });
          text(ctx, 'primario', xl, yt - 14, { align: 'center', size: 12, color: c.muted });
          text(ctx, 'secundario', xr, yt - 14, { align: 'center', size: 12, color: c.muted });
          text(ctx, si(params.vp, 'V'), xs + 14, ym + 26, { size: 12, color: c.accent, weight: 600 });
          text(ctx, si(vs(), 'V'), xr + 26, ym + 26, { size: 12, color: c.chargePos, weight: 600 });

          this.drawChart(c);
        },

        drawFluxChart(c) {
          const span = 2 / FREQ;
          const ref = mmfRef();
          const curve = (pick) => Array.from({ length: SAMPLES + 1 }, (_, n) => {
            const t = (n / SAMPLES) * span;
            return [t, pick(mmfs(2 * Math.PI * FREQ * t)) / ref];
          });
          const now = mmfs(angle());
          chart.draw({
            xMax: span,
            yMin: -1.15,
            yMax: 1.15,
            xTicks: [0, 1, 2].map((k) => ({ value: (k * span) / 2, label: k === 0 ? '0' : `${k} ciclo${k > 1 ? 's' : ''}` })),
            yTicks: [{ value: -1, label: '−' }, { value: 0, label: '0' }, { value: 1, label: '+' }],
            series: [
              { points: curve((v) => v.prim), color: c.accent },
              { points: curve((v) => v.sec), color: c.chargeNeg },
              { points: curve((v) => v.net), color: c.good, width: 3.5 },
            ],
            cursor: { x: time % span, y: now.net / ref, color: c.good },
            legend: [
              { label: `primario (pico ${num(Math.hypot(mmfLoad(), mmfNet()), 3)} A·v)`, color: c.accent },
              { label: `secundario (pico ${num(mmfLoad(), 3)} A·v)`, color: c.chargeNeg },
              { label: `neto en el núcleo (pico ${num(mmfNet(), 3)} A·v)`, color: c.good },
            ],
            xLabel: 'tiempo',
            yLabel: 'amperes-vuelta',
          });
        },

        drawChart(c) {
          if (params.view === 'flux') return this.drawFluxChart(c);
          const span = 2 / FREQ;
          const peakP = params.vp * Math.SQRT2;
          const peakS = vs() * Math.SQRT2;
          const wave = (phase) => Array.from({ length: SAMPLES + 1 }, (_, n) => {
            const t = (n / SAMPLES) * span;
            return [t, Math.sin(2 * Math.PI * FREQ * t + phase)];
          });
          const now = time % span;
          chart.draw({
            xMax: span,
            yMin: -1.15,
            yMax: 1.15,
            xTicks: [0, 1, 2].map((k) => ({ value: (k * span) / 2, label: k === 0 ? '0' : `${k} ciclo${k > 1 ? 's' : ''}` })),
            yTicks: [{ value: -1, label: '−pico' }, { value: 0, label: '0' }, { value: 1, label: '+pico' }],
            series: [
              { points: wave(0), color: c.accent },
              { points: wave(0).map(([t, y]) => [t, y * Math.min(1, peakS / peakP)]), color: c.chargePos, width: 2 },
            ],
            cursor: { x: now, y: Math.sin(angle()), color: c.accent },
            legend: [
              { label: `primario (pico ${num(peakP, 3)} V)`, color: c.accent },
              { label: `secundario (pico ${num(peakS, 3)} V)`, color: c.chargePos },
            ],
            xLabel: 'tiempo',
            yLabel: 'tensión',
          });
        },

        formulas() {
          return [
            { name: 'Relación de transformación', sym: 'V<sub>s</sub> / V<sub>p</sub> = N<sub>s</sub> / N<sub>p</sub>', val: `Vs = ${si(params.vp, 'V')} · ${params.ns} / ${params.np} = ${si(vs(), 'V')}` },
            { name: 'Corriente en la carga', sym: 'I<sub>s</sub> = V<sub>s</sub> / R', val: `Is = ${si(vs(), 'V')} / ${si(params.r, 'Ω')} = ${si(isec(), 'A')}` },
            { name: 'Potencia entregada a la carga', sym: 'P<sub>sal</sub> = V<sub>s</sub> · I<sub>s</sub>', val: `P = ${si(vs(), 'V')} · ${si(isec(), 'A')} = ${si(pout(), 'W')}` },
            { name: 'Potencia que toma de la red', sym: 'P<sub>ent</sub> = P<sub>sal</sub> / η', val: `P = ${si(pout(), 'W')} / ${num(eta())} = ${si(pin(), 'W')}` },
            { name: 'Corriente del primario que atiende a la carga', sym: 'I<sub>carga</sub> = P<sub>ent</sub> / V<sub>p</sub>', val: `Icarga = ${si(pin(), 'W')} / ${si(params.vp, 'V')} = ${si(ipri(), 'A')}` },
            { name: 'Las corrientes van al revés que las tensiones', sym: 'I<sub>carga</sub> / I<sub>s</sub> ≈ N<sub>s</sub> / N<sub>p</sub>', val: loaded() ? `${si(ipri(), 'A')} / ${si(isec(), 'A')} = ${num(ipri() / isec())}  (ideal: ${num(ratio())})` : 'sin carga no hay corriente en el secundario' },
            { name: 'Resistencia de la carga vista desde el primario', sym: 'R<sub>vista</sub> = R · (N<sub>p</sub> / N<sub>s</sub>)²', val: loaded() ? `R = ${si(params.r, 'Ω')} · (${params.np}/${params.ns})² = ${si(params.r * (params.np / params.ns) ** 2, 'Ω')}` : 'secundario abierto: la fuente ve una bobina sola' },
            { name: 'Corriente de magnetización (la de vacío)', sym: 'I<sub>0</sub> ∝ V<sub>p</sub> / N<sub>p</sub>²', val: `I0 = ${si(imag(), 'A')}  (solo crea el flujo del núcleo)` },
            { name: 'Corriente total que toma el primario', sym: 'I<sub>p</sub> = √(I<sub>carga</sub>² + I<sub>0</sub>²)', val: `Ip = ${si(itotal(), 'A')}` },
            { name: 'Lo que el secundario resta, el primario lo repone', sym: 'N<sub>p</sub> · I<sub>carga</sub> ≈ N<sub>s</sub> · I<sub>s</sub>', val: `${num(params.np * ipri())} A·v ≈ ${num(params.ns * isec())} A·v` },
            { name: 'Flujo neto en el núcleo (no depende de la carga)', sym: 'Φ ∝ V<sub>p</sub> / N<sub>p</sub>', val: `Np · I0 =${num(params.np * imag())} A·v eficaces` },
            { name: 'Pérdidas (calor en núcleo y bobinas)', sym: 'P<sub>pérd</sub> = P<sub>ent</sub> − P<sub>sal</sub>', val: `P = ${si(pin(), 'W')} − ${si(pout(), 'W')} = ${si(pin() - pout(), 'W')}` },
          ];
        },
      };
    },
  });
})();
