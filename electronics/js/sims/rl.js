// Lección 20: circuito RL. Al conectar una fuente, la corriente de la bobina crece con τ = L / R;
// al desconectarla (con un camino por donde circular), decae con la misma constante.
// El tiempo va en cámara lenta, escalado para que un τ dure unos 0,8 s en pantalla.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { FlowPath, visualSpeed } = Elec;
  const { drawBattery, drawResistor, drawCoil, polyline, text, arrow } = Elec;
  const { si, num } = Elec;

  const TAUS = 5; //            la gráfica cubre 5τ
  const POINTS = 300;
  const SLOW = 1.25; //         segundos simulados por segundo real, en unidades de τ

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Circuito RL: la corriente no cambia de golpe',
    label: 'Circuito con una batería, un resistor y una bobina, con una gráfica de la corriente y de la tensión de la bobina en el tiempo',
    caption: 'Cámara lenta: el tiempo simulado se ajusta para que una constante de tiempo dure unos 0,8 s, sea cual sea el valor de L y R. Al desconectar, se supone un camino (un diodo) por donde la corriente sigue circulando.',
    chart: true,
    controls: [
      { type: 'choice', key: 'mode', label: 'Proceso', value: 'charge', options: [{ value: 'charge', label: 'Conectar la fuente' }, { value: 'discharge', label: 'Desconectar' }] },
      { key: 'v', label: 'Tensión de la fuente', min: 1, max: 12, step: 1, value: 9, unit: 'V' },
      { key: 'r', label: 'Resistencia (R)', min: 10, max: 200, step: 10, value: 100, unit: 'Ω' },
      { key: 'l', label: 'Inductancia (L)', values: [0.01, 0.05, 0.1, 0.5, 1], value: 0.1, unit: 'H' },
    ],

    setup({ params, chart }) {
      const loop = new FlowPath([], { closed: true });
      let i = 0; //          corriente de la bobina
      let t = 0; //          tiempo simulado desde que empezó el proceso
      let i0 = 0; //         corriente al empezar el proceso
      let points = [];
      let lastPush = 0;
      const tau = () => params.l / params.r;
      const target = () => (params.mode === 'charge' ? params.v / params.r : 0);
      const vL = () => (params.mode === 'charge' ? params.v - i * params.r : -i * params.r);

      function start() {
        i0 = i;
        t = 0;
        lastPush = 0;
        points = [];
      }
      start();

      return {
        onChange(key) {
          if (key === 'mode') start();
          else { i = Math.min(i, params.v / params.r); start(); }
        },
        reset() {
          i = params.mode === 'discharge' ? params.v / params.r : 0;
          loop.phase = 0;
          start();
        },
        step(dt) {
          const sdt = dt * tau() * SLOW;
          i += (target() - i) * (1 - Math.exp(-sdt / tau()));
          t += sdt;
          const span = TAUS * tau();
          if (t <= span && t - lastPush >= span / POINTS) {
            points.push([t, i, vL()]);
            lastPush = t;
          }
          loop.advance(dt, -visualSpeed(i, 0.2));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const x0 = w * 0.18;
          const x1 = w * 0.72;
          const y0 = h * 0.22;
          const y1 = h * 0.78;
          const ym = (y0 + y1) / 2;
          const len = Math.min(120, (y1 - y0) * 0.55);
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
          polyline(ctx, corners, { color: c.wire, width: 3, close: true });
          if (i > 1e-5) {
            loop.setPoints(corners);
            loop.draw(ctx, { spacing: 24, radius: 4.5 });
          }
          if (params.mode === 'charge') {
            drawBattery(ctx, x0, ym, { orient: 'v' });
            text(ctx, si(params.v, 'V'), x0 - 32, ym, { align: 'right', weight: 600, color: c.accent });
          } else {
            polyline(ctx, [[x0 - 20, ym - 30], [x0 + 20, ym - 30]], { color: c.surface, width: 8 });
            text(ctx, 'sin fuente', x0 - 14, ym, { align: 'right', color: c.muted, size: 12 });
          }
          drawResistor(ctx, (x0 + x1) / 2, y0, { len: Math.min(100, w * 0.2), heat: Math.min(1, (i * i * params.r) / 1.5) });
          text(ctx, `R = ${si(params.r, 'Ω')}`, (x0 + x1) / 2, y0 - 30, { align: 'center', weight: 600 });
          // el fondo de la bobina tapa el cable para que se vean las vueltas
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.fillRect(x1 - 14, ym - len / 2, 28, len);
          ctx.restore();
          drawCoil(ctx, x1, ym, { len, turns: 6, active: Math.min(1, i / Math.max(params.v / params.r, 1e-9)) });
          text(ctx, `L = ${si(params.l, 'H')}`, x1 + 28, ym - 14, { weight: 600 });
          text(ctx, `i = ${si(i, 'A')}`, x1 + 28, ym + 6, { color: c.chargePos, weight: 700 });
          text(ctx, `vL = ${si(vL(), 'V')}`, x1 + 28, ym + 26, { color: c.accent, size: 12 });
          arrow(ctx, (x0 + x1) / 2 - 30, y1 + 22, (x0 + x1) / 2 + 30, y1 + 22, { color: c.chargePos });
          text(ctx, 'corriente convencional', (x0 + x1) / 2, y1 + 42, { align: 'center', size: 11, color: c.muted });
          this.drawChart(c);
        },

        drawChart(c) {
          const span = TAUS * tau();
          const final = params.mode === 'charge' ? params.v / params.r : 0;
          const iMax = params.mode === 'charge' ? params.v / params.r : Math.max(i0, 1e-9);
          const norm = (x) => (x / Math.max(iMax, 1e-9)) * 100;
          const vMax = Math.max(params.v, 1e-9);
          chart.draw({
            xMax: span,
            yMax: 100,
            yMin: params.mode === 'charge' ? 0 : -100,
            xTicks: Array.from({ length: TAUS + 1 }, (_, k) => ({ value: k * tau(), label: k === 0 ? '0' : `${k}τ` })),
            yTicks: (params.mode === 'charge' ? [0, 50, 100] : [-100, -50, 0, 50, 100]).map((v) => ({ value: v, label: `${v} %` })),
            series: [
              { points: points.map(([x, ii]) => [x, norm(ii)]), color: c.chargePos },
              { points: points.map(([x, , v]) => [x, (v / vMax) * 100]), color: c.accent, width: 2 },
            ],
            hlines: params.mode === 'charge'
              ? [{ y: 63.2, label: 'i = 63 % en 1τ', color: c.heat }]
              : [{ y: 36.8, label: 'i = 37 % en 1τ', color: c.heat }],
            legend: [{ label: 'corriente i (% de la final)', color: c.chargePos }, { label: 'tensión en la bobina vL (% de V)', color: c.accent }],
            cursor: t <= span ? { x: t, y: norm(i), color: c.chargePos } : null,
            xLabel: `tiempo (τ = ${si(tau(), 's')})`,
          });
        },

        formulas() {
          const ta = tau();
          const final = params.mode === 'charge' ? params.v / params.r : 0;
          return [
            { name: 'Constante de tiempo', sym: 'τ = L / R', val: `τ = ${si(params.l, 'H')} / ${si(params.r, 'Ω')} = ${si(ta, 's')}` },
            { name: 'Tiempo transcurrido', sym: 't', val: `t = ${si(t, 's')} = ${num(t / ta)} τ` },
            { name: 'Corriente', sym: 'i(t) = I<sub>f</sub> + (I<sub>0</sub> − I<sub>f</sub>) · e<sup>−t/τ</sup>', val: `i = ${si(final, 'A')} + (${si(i0, 'A')} − ${si(final, 'A')}) · e^(−${num(t / ta)}) = ${si(i, 'A')}` },
            { name: 'Tensión en la bobina', sym: 'v<sub>L</sub> = L · Δi / Δt', val: `vL = ${si(vL(), 'V')}  ${Math.abs(vL()) > 0.9 * params.v ? '(al inicio: toda la tensión cae en la bobina)' : ''}` },
            { name: 'Energía almacenada', sym: 'E = ½ · L · i²', val: `E = ½ · ${si(params.l, 'H')} · (${si(i, 'A')})² = ${si(0.5 * params.l * i * i, 'J')}` },
          ];
        },
      };
    },
  });
})();
