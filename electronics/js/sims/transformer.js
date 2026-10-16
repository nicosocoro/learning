// Capítulo 11: transformador monofásico. Relación de vueltas, corrientes y pérdidas.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, drawAcSource, drawResistor, polyline, text, si, num } = Elec;

  const FREQ = 0.5; // Hz mostrados (la red real es de 50 o 60 Hz)
  const SAMPLES = 160;
  const EFFICIENCY = 0.95;
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
    caption: 'La corriente alterna del primario crea un flujo magnético variable en el núcleo, que induce tensión en el secundario. Frecuencia reducida a 0,5 Hz para poder verla. Las dos curvas están en fase; la del secundario se dibuja a escala relativa.',
    chart: true,
    controls: [
      { key: 'vp', label: 'Tensión eficaz del primario (V<sub>p</sub>)', min: 10, max: 240, step: 5, value: 230, unit: 'V' },
      { key: 'np', label: 'Vueltas del primario (N<sub>p</sub>)', min: 200, max: 2000, step: 100, value: 1000, unit: '', format: (v) => `${v} vueltas` },
      { key: 'ns', label: 'Vueltas del secundario (N<sub>s</sub>)', min: 50, max: 500, step: 50, value: 50, unit: '', format: (v) => `${v} vueltas` },
      { key: 'r', label: 'Resistencia de la carga (R)', min: 10, max: 200, step: 10, value: 10, unit: 'Ω' },
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
      const isec = () => vs() / params.r;
      const pout = () => vs() * isec();
      const pin = () => pout() / eta();
      const ipri = () => pin() / params.vp;
      const angle = () => 2 * Math.PI * FREQ * time;
      const swing = (current, max) => 3 + 15 * Math.sqrt(Math.min(current / max, 1));

      return {
        reset() {
          time = 0;
        },

        step(dt) {
          time += dt;
          primary.phase = swing(ipri(), 1) * Math.cos(angle());
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
          if (w >= 520) text(ctx, 'núcleo de hierro', (xl + xr) / 2, (yt + yb) / 2, { align: 'center', size: 11, color: c.muted });
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

          text(ctx, `N = ${params.np}`, xl, yb + 22, { align: 'center', size: 12, color: c.accent, weight: 600 });
          text(ctx, `N = ${params.ns}`, xr, yb + 22, { align: 'center', size: 12, color: c.chargePos, weight: 600 });
          text(ctx, 'primario', xl, yt - 14, { align: 'center', size: 12, color: c.muted });
          text(ctx, 'secundario', xr, yt - 14, { align: 'center', size: 12, color: c.muted });
          text(ctx, si(params.vp, 'V'), xs + 14, ym + 26, { size: 12, color: c.accent, weight: 600 });
          text(ctx, si(vs(), 'V'), xr + 26, ym + 26, { size: 12, color: c.chargePos, weight: 600 });

          this.drawChart(c);
        },

        drawChart(c) {
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
            { name: 'Corriente del primario', sym: 'I<sub>p</sub> = P<sub>ent</sub> / V<sub>p</sub>', val: `Ip = ${si(pin(), 'W')} / ${si(params.vp, 'V')} = ${si(ipri(), 'A')}` },
            { name: 'Las corrientes van al revés que las tensiones', sym: 'I<sub>p</sub> / I<sub>s</sub> ≈ N<sub>s</sub> / N<sub>p</sub>', val: `${si(ipri(), 'A')} / ${si(isec(), 'A')} = ${num(ipri() / isec())}  (ideal: ${num(ratio())})` },
            { name: 'Resistencia de la carga vista desde el primario', sym: 'R<sub>vista</sub> = R · (N<sub>p</sub> / N<sub>s</sub>)²', val: `R = ${si(params.r, 'Ω')} · (${params.np}/${params.ns})² = ${si(params.r * (params.np / params.ns) ** 2, 'Ω')}` },
            { name: 'Pérdidas (calor en núcleo y bobinas)', sym: 'P<sub>pérd</sub> = P<sub>ent</sub> − P<sub>sal</sub>', val: `P = ${si(pin(), 'W')} − ${si(pout(), 'W')} = ${si(pin() - pout(), 'W')}` },
          ];
        },
      };
    },
  });
})();
