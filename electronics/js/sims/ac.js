// Lección 5: corriente alterna. Fasor giratorio, onda senoidal y cargas que oscilan.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { FlowPath } = Elec;
  const { drawResistor, polyline, text, arrow, circle } = Elec;
  const { si, num } = Elec;

  const V_MAX = 12;
  const SAMPLES = 160;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Fasor, onda y cargas que oscilan',
    label: 'Fasor giratorio, onda senoidal y cargas oscilando en un circuito de corriente alterna',
    caption: 'Frecuencias de 0,5 a 5 Hz para poder verlas; la red eléctrica real oscila a 50 o 60 Hz, demasiado rápido para el ojo.',
    chart: true,
    controls: [
      { key: 'f', label: 'Frecuencia (f)', min: 0.5, max: 5, step: 0.5, value: 1, unit: 'Hz' },
      { key: 'vp', label: 'Tensión pico (V<sub>p</sub>)', min: 1, max: V_MAX, step: 1, value: 9, unit: 'V' },
      { key: 'r', label: 'Resistencia de la carga (R)', min: 10, max: 500, step: 10, value: 100, unit: 'Ω' },
    ],

    setup({ params, chart }) {
      const loop = new FlowPath([], { closed: true });
      let time = 0;

      const omega = () => 2 * Math.PI * params.f;
      const angle = () => omega() * time;
      const voltage = () => params.vp * Math.sin(angle());
      const vrms = () => params.vp / Math.SQRT2;

      return {
        reset() {
          time = 0;
        },

        step(dt) {
          time += dt;
          // Los electrones oscilan alrededor de su posición; su velocidad es proporcional a v(t).
          const swing = 6 + 14 * (params.vp / V_MAX);
          loop.phase = swing * Math.cos(angle());
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const v = voltage();

          // Fasor
          const cx = w * 0.2;
          const cy = h * 0.5;
          const radius = Math.min(h * 0.34, w * 0.15);
          const tip = [cx + radius * Math.cos(angle()), cy - radius * Math.sin(angle())];
          const scaleX = cx + radius + 16;
          circle(ctx, cx, cy, radius, { stroke: c.grid, width: 1.5 });
          polyline(ctx, [[cx - radius - 8, cy], [cx + radius + 8, cy]], { color: c.grid, width: 1 });
          polyline(ctx, [[cx, cy - radius - 8], [cx, cy + radius + 8]], { color: c.grid, width: 1 });
          polyline(ctx, [tip, [scaleX, tip[1]]], { color: c.muted, width: 1, dash: [3, 4] });
          arrow(ctx, cx, cy, tip[0], tip[1], { color: c.accent, width: 3 });
          circle(ctx, scaleX, tip[1], 5, { fill: c.chargePos });
          text(ctx, 'Fasor: un giro = un período', cx, cy + radius + 22, { align: 'center', color: c.muted, size: 11 });
          text(ctx, `v = ${si(v, 'V')}`, cx, cy - radius - 16, { align: 'center', color: c.chargePos, weight: 600, size: 12 });

          // Circuito: fuente alterna a la izquierda, resistencia a la derecha
          const x0 = w * 0.52;
          const x1 = w * 0.93;
          const y0 = h * 0.28;
          const y1 = h * 0.72;
          const ym = (y0 + y1) / 2;
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
          polyline(ctx, corners, { color: c.wire, width: 3, close: true });
          circle(ctx, x0, ym, 15, { fill: c.surface, stroke: c.wire, width: 2.5 });
          text(ctx, '~', x0, ym - 1, { align: 'center', size: 20, weight: 700, color: c.accent });
          drawResistor(ctx, x1, ym, { orient: 'v', len: 80, heat: (v / V_MAX) ** 2 * 2 });

          loop.setPoints(corners);
          loop.draw(ctx);

          const shift = Math.sin(angle()) * 36;
          if (Math.abs(shift) > 4) {
            const xm = (x0 + x1) / 2;
            arrow(ctx, xm - shift / 2, y0 - 16, xm + shift / 2, y0 - 16, { color: c.chargePos });
          }
          text(ctx, 'sentido de i ahora', (x0 + x1) / 2, y0 - 32, { align: 'center', color: c.muted, size: 11 });
          text(ctx, `R = ${si(params.r, 'Ω')}`, x1 - 26, ym, { align: 'right', size: 12, weight: 600 });

          this.drawChart(c);
        },

        drawChart(c) {
          const period = 1 / params.f;
          const span = 2 * period;
          const points = Array.from({ length: SAMPLES + 1 }, (_, n) => {
            const t = (n / SAMPLES) * span;
            return [t, params.vp * Math.sin(omega() * t)];
          });
          const cursorT = time % span;
          chart.draw({
            xMax: span,
            yMin: -V_MAX,
            yMax: V_MAX,
            xTicks: [0, 0.5, 1, 1.5, 2].map((k) => ({ value: k * period, label: k === 0 ? '0' : `${num(k * period)} s` })),
            yTicks: [-V_MAX, -V_MAX / 2, 0, V_MAX / 2, V_MAX].map((y) => ({ value: y, label: `${y} V` })),
            series: [{ points, color: c.accent }],
            hlines: [
              { y: params.vp, label: 'V pico', color: c.muted },
              { y: vrms(), label: 'V eficaz (rms)', color: c.good },
            ],
            cursor: { x: cursorT, y: voltage(), color: c.chargePos },
            xLabel: 'tiempo (dos períodos)',
            yLabel: 'tensión v(t)',
          });
        },

        formulas() {
          const period = 1 / params.f;
          const rms = vrms();
          return [
            { name: 'Período', sym: 'T = 1 / f', val: `T = 1 / ${si(params.f, 'Hz')} = ${si(period, 's')}` },
            { name: 'Frecuencia angular', sym: 'ω = 2π · f', val: `ω = 2π · ${si(params.f, 'Hz')} = ${num(omega())} rad/s` },
            {
              name: 'Tensión instantánea',
              sym: 'v(t) = V<sub>p</sub> · sen(ω · t)',
              val: `v = ${si(params.vp, 'V')} · sen(${num(angle() % (2 * Math.PI))} rad) = ${si(voltage(), 'V')}`,
            },
            { name: 'Corriente instantánea', sym: 'i(t) = v(t) / R', val: `i = ${si(voltage(), 'V')} / ${si(params.r, 'Ω')} = ${si(voltage() / params.r, 'A')}` },
            { name: 'Valor eficaz (rms)', sym: 'V<sub>rms</sub> = V<sub>p</sub> / √2', val: `Vrms = ${si(params.vp, 'V')} / 1,414 = ${si(rms, 'V')}` },
            { name: 'Potencia promedio', sym: 'P = V<sub>rms</sub>² / R', val: `P = (${si(rms, 'V')})² / ${si(params.r, 'Ω')} = ${si(rms * rms / params.r, 'W')}` },
          ];
        },
      };
    },
  });
})();
