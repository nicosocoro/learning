// Capítulo 7: la misma resistencia alimentada con corriente continua y con corriente alterna.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawBattery, drawResistor, drawAcSource, polyline, text, arrow, si, num } = Elec;

  const I_MAX = 12 / 10;
  const SAMPLES = 160;
  const heatOf = (power) => Math.min(1, Math.sqrt(power / 1.5));

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Corriente continua frente a corriente alterna',
    label: 'Dos circuitos con la misma resistencia, uno con una batería de corriente continua y otro con una fuente alterna',
    caption: 'En CC los electrones avanzan siempre hacia el mismo lado; en CA van y vienen. Con V<sub>p</sub> = V·√2 la resistencia se calienta, en promedio, igual en los dos casos.',
    chart: true,
    controls: [
      { key: 'vdc', label: 'Tensión de la fuente CC', min: 1, max: 12, step: 1, value: 6, unit: 'V' },
      { key: 'vp', label: 'Tensión pico de la fuente CA (V<sub>p</sub>)', min: 1, max: 17, step: 0.5, value: 8.5, unit: 'V' },
      { key: 'f', label: 'Frecuencia de la CA (f)', min: 0.5, max: 3, step: 0.5, value: 1, unit: 'Hz' },
      { key: 'r', label: 'Resistencia de cada carga (R)', min: 10, max: 500, step: 10, value: 100, unit: 'Ω' },
    ],

    setup({ params, chart }) {
      const dc = new FlowPath([], { closed: true });
      const ac = new FlowPath([], { closed: true });
      let time = 0;

      const omega = () => 2 * Math.PI * params.f;
      const vac = () => params.vp * Math.sin(omega() * time);
      const vrms = () => params.vp / Math.SQRT2;

      function drawLoop(ctx, c, path, x0, x1, y0, y1, source, resistorHeat) {
        const xm = (x0 + x1) / 2;
        const ym = (y0 + y1) / 2;
        const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
        polyline(ctx, corners, { color: c.wire, width: 3, close: true });
        if (source === 'dc') drawBattery(ctx, x0, ym, { orient: 'v' });
        else drawAcSource(ctx, x0, ym);
        drawResistor(ctx, xm, y0, { len: Math.min(90, (x1 - x0) * 0.4), heat: resistorHeat });
        path.setPoints(corners);
        path.draw(ctx, { radius: 4.5 });
        return { xm, ym };
      }

      return {
        reset() {
          time = 0;
          dc.phase = 0;
        },

        step(dt) {
          time += dt;
          dc.advance(dt, -visualSpeed(params.vdc / params.r, I_MAX));
          ac.phase = (6 + 14 * (params.vp / 17)) * Math.cos(omega() * time);
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const y0 = h * 0.3;
          const y1 = h * 0.76;

          polyline(ctx, [[w / 2, h * 0.05], [w / 2, h * 0.95]], { color: c.grid, width: 1.5, dash: [4, 5] });

          const left = drawLoop(ctx, c, dc, w * 0.16, w * 0.4, y0, y1, 'dc', heatOf(params.vdc ** 2 / params.r));
          text(ctx, 'Corriente continua (CC)', w * 0.26, h * 0.1, { align: 'center', weight: 600 });
          text(ctx, si(params.vdc, 'V'), w * 0.16 - 22, left.ym, { align: 'right', size: 12, color: c.accent });
          arrow(ctx, left.xm + 22, y1 + 18, left.xm - 22, y1 + 18, { color: c.chargePos });
          text(ctx, `I = ${si(params.vdc / params.r, 'A')} siempre igual`, left.xm, y1 + 38, { align: 'center', size: 12, color: c.chargePos });

          const v = vac();
          const right = drawLoop(ctx, c, ac, w * 0.62, w * 0.9, y0, y1, 'ac', heatOf(v * v / params.r));
          text(ctx, 'Corriente alterna (CA)', w * 0.76, h * 0.1, { align: 'center', weight: 600 });
          text(ctx, si(v, 'V'), w * 0.62 - 22, right.ym, { align: 'right', size: 12, color: c.accent });
          const shift = (v / params.vp) * 22;
          if (Math.abs(shift) > 3) arrow(ctx, right.xm - shift, y1 + 18, right.xm + shift, y1 + 18, { color: c.chargePos });
          text(ctx, `i = ${si(v / params.r, 'A')} cambia`, right.xm, y1 + 38, { align: 'center', size: 12, color: c.chargePos });

          this.drawChart(c);
        },

        drawChart(c) {
          const span = 2 / params.f;
          const yMax = Math.ceil(Math.max(params.vdc, params.vp) * 1.15);
          const wave = Array.from({ length: SAMPLES + 1 }, (_, n) => {
            const t = (n / SAMPLES) * span;
            return [t, params.vp * Math.sin(omega() * t)];
          });
          chart.draw({
            xMax: span,
            yMin: -yMax,
            yMax,
            xTicks: [0, 0.5, 1, 1.5, 2].map((k) => ({ value: (k * span) / 2, label: k === 0 ? '0' : `${num((k * span) / 2)} s` })),
            yTicks: [-yMax, -yMax / 2, 0, yMax / 2, yMax].map((y) => ({ value: y, label: `${num(y)} V` })),
            series: [
              { points: wave, color: c.accent },
              { points: [[0, params.vdc], [span, params.vdc]], color: c.chargePos, width: 3 },
            ],
            hlines: [{ y: vrms(), label: 'V eficaz de la CA', color: c.good }],
            cursor: { x: time % span, y: vac(), color: c.accent },
            legend: [{ label: 'CC', color: c.chargePos }, { label: 'CA', color: c.accent }],
            xLabel: 'tiempo',
            yLabel: 'tensión (V)',
          });
        },

        formulas() {
          const v = vac();
          return [
            { name: 'CC · corriente (constante)', sym: 'I = V / R', val: `I = ${si(params.vdc, 'V')} / ${si(params.r, 'Ω')} = ${si(params.vdc / params.r, 'A')}` },
            { name: 'CC · potencia', sym: 'P = V² / R', val: `P = (${si(params.vdc, 'V')})² / ${si(params.r, 'Ω')} = ${si(params.vdc ** 2 / params.r, 'W')}` },
            { name: 'CA · tensión eficaz', sym: 'V<sub>rms</sub> = V<sub>p</sub> / √2', val: `Vrms = ${si(params.vp, 'V')} / 1,414 = ${si(vrms(), 'V')}` },
            { name: 'CA · potencia promedio', sym: 'P = V<sub>rms</sub>² / R', val: `P = (${si(vrms(), 'V')})² / ${si(params.r, 'Ω')} = ${si(vrms() ** 2 / params.r, 'W')}` },
            { name: 'CA · potencia en este instante', sym: 'p(t) = v(t)² / R', val: `p = (${si(v, 'V')})² / ${si(params.r, 'Ω')} = ${si(v * v / params.r, 'W')}` },
            { name: 'V<sub>p</sub> que iguala la potencia de la CC', sym: 'V<sub>p</sub> = V<sub>cc</sub> · √2', val: `Vp = ${si(params.vdc, 'V')} · 1,414 = ${si(params.vdc * Math.SQRT2, 'V')}` },
          ];
        },
      };
    },
  });
})();
