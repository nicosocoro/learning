// Lección 2: Ley de Ohm en un circuito simple batería + resistencia.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { FlowPath, visualSpeed } = Elec;
  const { drawBattery, drawResistor, polyline, text, arrow } = Elec;
  const { si } = Elec;

  const I_MAX = 12 / 10; // corriente máxima posible con los rangos de los sliders
  const P_MAX = 12 ** 2 / 10;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Un circuito simple: batería y resistencia',
    label: 'Circuito con una batería y una resistencia con electrones circulando',
    caption: 'Los electrones (azules) se mueven al revés que la corriente convencional. La velocidad dibujada no está a escala.',
    controls: [
      { key: 'v', label: 'Tensión de la batería (V)', min: 1, max: 12, step: 1, value: 9, unit: 'V' },
      { key: 'r', label: 'Resistencia (R)', min: 10, max: 1000, step: 10, value: 100, unit: 'Ω' },
    ],

    setup({ params }) {
      const loop = new FlowPath([], { closed: true });
      const current = () => params.v / params.r;

      return {
        reset() {
          loop.phase = 0;
        },

        step(dt) {
          loop.advance(dt, -visualSpeed(current(), I_MAX));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const x0 = w * 0.2;
          const x1 = w * 0.8;
          const y0 = h * 0.25;
          const y1 = h * 0.72;
          const xm = (x0 + x1) / 2;
          const ym = (y0 + y1) / 2;
          // Sentido horario = sentido de la corriente convencional (sale del + de la batería).
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

          polyline(ctx, corners, { color: c.wire, width: 3, close: true });
          drawBattery(ctx, x0, ym, { orient: 'v' });
          drawResistor(ctx, xm, y0, { len: Math.min(110, w * 0.26), heat: Math.sqrt(params.v * current() / P_MAX) });

          loop.setPoints(corners);
          loop.draw(ctx);

          text(ctx, si(params.v, 'V'), x0 - 32, ym, { align: 'right', weight: 600, color: c.accent });
          text(ctx, `R = ${si(params.r, 'Ω')}`, xm, y0 - 30, { align: 'center', weight: 600 });
          arrow(ctx, xm + 30, y1 + 18, xm - 30, y1 + 18, { color: c.chargePos });
          text(ctx, `I = ${si(current(), 'A')} (sentido convencional)`, xm, y1 + 38, { align: 'center', color: c.chargePos, size: 12 });
        },

        formulas() {
          const i = current();
          const p = params.v * i;
          return [
            {
              name: 'Ley de Ohm',
              sym: 'I = V / R',
              val: `I = ${si(params.v, 'V')} / ${si(params.r, 'Ω')} = ${si(i, 'A')}`,
            },
            {
              name: 'Caída de tensión en R',
              sym: 'V = I · R',
              val: `V = ${si(i, 'A')} · ${si(params.r, 'Ω')} = ${si(i * params.r, 'V')}`,
            },
            {
              name: 'Potencia disipada (calor)',
              sym: 'P = V · I',
              val: `P = ${si(params.v, 'V')} · ${si(i, 'A')} = ${si(p, 'W')}`,
            },
            {
              name: 'Otras formas de la potencia',
              sym: 'P = I² · R = V² / R',
              val: `P = (${si(i, 'A')})² · ${si(params.r, 'Ω')} = ${si(i * i * params.r, 'W')}`,
            },
          ];
        },
      };
    },
  });
})();
