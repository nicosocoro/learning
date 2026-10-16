// Capítulo 4: una batería real = fuente ideal (E) + resistencia interna (r) + capacidad finita.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawBattery, drawResistor, polyline, text, arrow, circle, si, num } = Elec;

  const CELL_FULL = 1.5; //   V por celda cargada (alcalina)
  const CELL_EMPTY = 1.0; //  V por celda casi agotada
  const CELL_CUTOFF = 0.8; // V por celda por debajo de los cuales el aparato deja de funcionar
  const TIME_SCALE = 900; //  1 s de pantalla = 15 min de descarga
  const I_MAX = 3;

  const hoursText = (h) => (h >= 1 ? `${num(h)} h` : `${num(h * 60)} min`);

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Una batería real que se descarga',
    label: 'Circuito con una batería real modelada como fuente ideal más resistencia interna, y gráfica de su tensión al descargarse',
    caption: 'El tiempo está acelerado: 1 segundo de pantalla equivale a 15 minutos de descarga. Cambiar un parámetro reinicia la descarga.',
    chart: true,
    controls: [
      { key: 'n', label: 'Celdas en serie', min: 1, max: 4, step: 1, value: 2, unit: '', format: (v) => `${v} en serie` },
      { key: 'p', label: 'Ramas en paralelo', min: 1, max: 3, step: 1, value: 1, unit: '', format: (v) => `${v} en paralelo` },
      { key: 'cap', label: 'Capacidad de cada celda', min: 500, max: 3000, step: 100, value: 2000, scale: 1e-3, unit: 'Ah' },
      { key: 'rcell', label: 'Resistencia interna de cada celda', min: 0.1, max: 2, step: 0.1, value: 0.3, unit: 'Ω' },
      { key: 'rload', label: 'Resistencia de la carga (R)', min: 1, max: 100, step: 1, value: 10, unit: 'Ω' },
    ],

    setup({ params, chart }) {
      const path = new FlowPath([], { closed: true });
      let soc, hours, points, lastPush, dead;

      function reset() {
        soc = 1;
        hours = 0;
        points = [];
        lastPush = -1;
        dead = false;
        path.phase = 0;
      }
      reset();

      const emf = () => params.n * (CELL_EMPTY + (CELL_FULL - CELL_EMPTY) * Math.sqrt(soc));
      const rint = () => (params.n * params.rcell * (1 + 2 * (1 - soc))) / params.p;
      const capacity = () => params.p * params.cap; // Ah
      const current = () => (dead ? 0 : emf() / (params.rload + rint()));
      const terminal = () => emf() - current() * rint();
      const remainingHours = () => (current() > 0 ? (soc * capacity()) / current() : 0);

      return {
        reset,
        onChange: reset,

        step(dt) {
          path.advance(dt, -visualSpeed(current(), I_MAX));
          if (dead) return;
          const i = current();
          const dh = (dt * TIME_SCALE) / 3600;
          hours += dh;
          soc -= (i * dh) / capacity();
          const vt = terminal();
          if (hours - lastPush >= remainingHours() / 150 || lastPush < 0) {
            points.push([hours, vt]);
            lastPush = hours;
          }
          if (soc <= 0 || vt < params.n * CELL_CUTOFF) {
            dead = true;
            points.push([hours, Math.max(vt, 0)]);
          }
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const x0 = w * 0.22;
          const x1 = w * 0.78;
          const y0 = h * 0.17;
          const y1 = h * 0.7;
          const span = y1 - y0;
          const ym = (y0 + y1) / 2;
          const i = current();
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

          polyline(ctx, corners, { color: c.wire, width: 3, close: true });

          // Recuadro de la batería real: fuente ideal E + resistencia interna r
          ctx.save();
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = c.muted;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x0 - 46, y0 + span * 0.07, 92, span * 0.86);
          ctx.restore();
          drawBattery(ctx, x0, y0 + span * 0.31, { orient: 'v', len: 44 });
          drawResistor(ctx, x0, y0 + span * 0.69, { orient: 'v', len: 56, heat: Math.min(1, (i * i * rint()) / 0.6) });
          text(ctx, 'E', x0 + 28, y0 + span * 0.31, { color: c.accent, weight: 600, style: 'italic' });
          text(ctx, 'r', x0 + 28, y0 + span * 0.69, { color: c.accent, weight: 600 });
          if (w >= 520) text(ctx, 'batería real', x0, y0 + span * 0.07 + 12, { align: 'center', size: 11, color: c.muted });

          drawResistor(ctx, x1, ym, { orient: 'v', len: 84, heat: Math.min(1, (i * i * params.rload) / 8) });
          text(ctx, `R = ${si(params.rload, 'Ω')}`, x1 - 28, ym, { align: 'right', weight: 600, size: 12 });

          path.setPoints(corners);
          path.draw(ctx);

          circle(ctx, x0, y0, 4.5, { fill: c.accent });
          circle(ctx, x0, y1, 4.5, { fill: c.accent });
          text(ctx, `V = ${si(terminal(), 'V')}`, x0 + 12, y0 - 12, { color: c.accent, weight: 600, size: 12 });

          arrow(ctx, (x0 + x1) / 2 + 24, y1 + 16, (x0 + x1) / 2 - 24, y1 + 16, { color: c.chargePos });
          text(ctx, dead ? 'Batería agotada' : `I = ${si(i, 'A')}`, (x0 + x1) / 2, y1 + 32, { align: 'center', size: 12, color: dead ? c.accent : c.chargePos, weight: dead ? 700 : 400 });

          // Barra de carga restante
          const barW = w * 0.42;
          const barX = w * 0.04;
          const barY = h - 16;
          ctx.strokeStyle = c.text;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(barX, barY, barW, 10);
          ctx.fillStyle = soc > 0.2 ? c.good : c.accent;
          ctx.fillRect(barX + 1, barY + 1, Math.max(0, (barW - 2) * soc), 8);
          text(ctx, `carga restante ${Math.round(Math.max(soc, 0) * 100)} %`, barX + barW + 8, barY + 5, { size: 11, color: c.muted });

          this.drawChart(c);
        },

        drawChart(c) {
          const xMax = Math.max(0.1, (hours + (dead ? 0 : remainingHours())) * 1.05);
          const yMax = Math.ceil(params.n * CELL_FULL);
          chart.draw({
            xMax,
            yMax,
            xTicks: [0, 0.25, 0.5, 0.75, 1].map((f) => ({ value: f * xMax, label: hoursText(f * xMax) })),
            yTicks: [0, 0.5, 1].map((f) => ({ value: f * yMax, label: `${num(f * yMax)} V` })),
            series: [{ points, color: c.accent }],
            hlines: [{ y: params.n * CELL_CUTOFF, label: 'tensión mínima de funcionamiento', color: c.heat }],
            cursor: points.length ? { x: hours, y: Math.max(terminal(), 0), color: c.chargePos } : null,
            xLabel: 'tiempo de uso',
            yLabel: 'tensión en los terminales',
          });
        },

        formulas() {
          const cellE = emf() / params.n;
          return [
            { name: 'Fuerza electromotriz', sym: 'E = n · E<sub>celda</sub>', val: `E = ${params.n} · ${si(cellE, 'V')} = ${si(emf(), 'V')}` },
            { name: 'Resistencia interna total', sym: 'r = n · r<sub>celda</sub> / p', val: `r = ${params.n} · ${si(rint() * params.p / params.n, 'Ω')} / ${params.p} = ${si(rint(), 'Ω')}` },
            { name: 'Corriente que circula', sym: 'I = E / (R + r)', val: `I = ${si(emf(), 'V')} / (${si(params.rload, 'Ω')} + ${si(rint(), 'Ω')}) = ${si(current(), 'A')}` },
            { name: 'Tensión en los terminales', sym: 'V = E − I · r', val: `V = ${si(emf(), 'V')} − ${si(current(), 'A')} · ${si(rint(), 'Ω')} = ${si(terminal(), 'V')}` },
            { name: 'Calor perdido dentro de la batería', sym: 'P<sub>int</sub> = I² · r', val: `P = (${si(current(), 'A')})² · ${si(rint(), 'Ω')} = ${si(current() ** 2 * rint(), 'W')}` },
            { name: 'Duración restante estimada', sym: 't = Q / I', val: `t = ${si(soc * capacity(), 'Ah')} / ${si(current(), 'A')} = ${current() > 0 ? hoursText(remainingHours()) : '0 h'}` },
            { name: 'Capacidad total del conjunto', sym: 'Q = p · Q<sub>celda</sub>', val: `Q = ${params.p} · ${si(params.cap, 'Ah')} = ${si(capacity(), 'Ah')}` },
          ];
        },
      };
    },
  });
})();
