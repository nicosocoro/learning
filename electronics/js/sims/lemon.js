// Capítulo 32: un banco de pilas de limón (ns en serie × np ramas en paralelo) que alimenta un
// resistor o un LED rojo. La intersección de la recta de la fuente con la curva de la carga es
// el punto de trabajo.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawBattery, drawResistor, drawLed, polyline, text, arrow, si, num } = Elec;

  const E_CELL = 0.95; //      V por pila de limón (Zn–Cu)
  const R_CELL = 1000; //      Ω de resistencia interna de cada una
  const LED_IS = 1e-13; //     A: corriente de saturación equivalente de un LED rojo
  const LED_VC = 0.075; //     V: n·VT efectivo (da ≈ 1,75 V a 1 mA)
  const Y_MAX = 3.2; //        mA, tope de la gráfica
  const X_MAX = 6; //          V
  const SAMPLES = 120;

  const ledCurrent = (v) => LED_IS * (Math.exp(v / LED_VC) - 1);

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Un banco de pilas de limón',
    label: 'Un conjunto de pilas de limón en serie y en paralelo que alimenta un resistor o un LED, con la recta de la fuente y la curva de la carga',
    caption: 'Cada limón da 0,95 V con 1 kΩ de resistencia interna. Más limones en serie suben la tensión pero también la resistencia interna; las ramas en paralelo bajan la resistencia. Modelo simplificado de un LED rojo.',
    chart: true,
    controls: [
      { key: 'ns', label: 'Limones en serie (por rama)', min: 1, max: 6, step: 1, value: 3, unit: '', format: (v) => `${v}` },
      { key: 'np', label: 'Ramas en paralelo', min: 1, max: 3, step: 1, value: 1, unit: '', format: (v) => `${v}` },
      { type: 'choice', key: 'load', label: 'Carga', value: 'led', options: [{ value: 'led', label: 'LED rojo' }, { value: 'res', label: 'Resistor' }] },
      { key: 'r', label: 'Resistor de carga (si la carga es un resistor)', values: [100, 330, 1000, 3300, 10000, 33000, 100000], value: 1000, unit: 'Ω' },
    ],

    setup({ params, chart }) {
      const flow = new FlowPath([], { closed: true });
      const emf = () => params.ns * E_CELL;
      const rint = () => (params.ns * R_CELL) / params.np;

      /** Punto de trabajo { v, i } por bisección: (E − v)/r = i_carga(v). */
      function operating() {
        const e = emf();
        const r = rint();
        if (params.load === 'res') {
          const i = e / (r + params.r);
          return { v: i * params.r, i };
        }
        let lo = 0;
        let hi = e;
        for (let n = 0; n < 60; n++) {
          const mid = (lo + hi) / 2;
          if ((e - mid) / r - ledCurrent(mid) > 0) lo = mid; else hi = mid;
        }
        return { v: lo, i: ledCurrent(lo) };
      }
      const glow = (i) => Math.min(1, Math.sqrt(i / 0.004));

      return {
        reset() { flow.phase = 0; },

        step(dt) {
          flow.advance(dt, -visualSpeed(operating().i, 0.003));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const compact = w < 520;
          const op = operating();
          const x0 = w * 0.32;
          const x1 = w * 0.84;
          const y0 = h * 0.22;
          const y1 = h * 0.74;
          const ym = (y0 + y1) / 2;
          const span = y1 - y0;
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
          const part = Math.min(64, span * 0.38);

          polyline(ctx, corners, { color: c.wire, width: 3, close: true });
          ctx.save();
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = c.muted;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x0 - 40, y0 - 14, 80, span + 28);
          ctx.restore();
          drawResistor(ctx, x0, y0 + span * 0.2, { orient: 'v', len: part });
          drawBattery(ctx, x0, y1 - span * 0.2, { orient: 'v', len: part });

          if (params.load === 'led') drawLed(ctx, (x0 + x1) / 2 + 20, y0, { len: Math.min(80, (x1 - x0) * 0.3), glow: glow(op.i) });
          else drawResistor(ctx, (x0 + x1) / 2 + 20, y0, { len: Math.min(90, (x1 - x0) * 0.35), heat: 0 });

          // los limones: una grilla ns × np a la izquierda
          const cellW = Math.min(30, (x0 - 60) / params.ns - 4);
          const cellH = Math.min(22, (span * 0.9) / params.np - 6);
          const gx = 14;
          const gy = ym - ((params.np - 1) * (cellH + 8)) / 2;
          for (let rr = 0; rr < params.np; rr++) {
            for (let cc = 0; cc < params.ns; cc++) {
              const cx = gx + cellW / 2 + cc * (cellW + 4);
              const cy = gy + rr * (cellH + 8);
              ctx.fillStyle = c.heat;
              ctx.beginPath();
              ctx.ellipse(cx, cy, cellW / 2, cellH / 2, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = c.wire;
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }
          text(ctx, `${params.ns} × ${params.np}`, gx + (params.ns * (cellW + 4)) / 2, gy - cellH / 2 - 14, { align: 'center', size: 12, color: c.muted });

          flow.setPoints(corners);
          flow.draw(ctx, { radius: compact ? 3.4 : 4.2, spacing: 24 });

          text(ctx, `E = ${si(emf(), 'V')}`, x0 + 46, y1 - span * 0.2, { size: 12, color: c.accent });
          text(ctx, `r = ${si(rint(), 'Ω')}`, x0 + 46, y0 + span * 0.2, { size: 12, color: c.accent });
          text(ctx, `V = ${si(op.v, 'V')}`, x1 - 6, ym, { align: 'right', size: 12.5, color: c.chargeNeg });
          text(ctx, `I = ${si(op.i, 'A')}`, w / 2 + 20, y1 + 20, { align: 'center', size: 12.5, color: c.chargePos });
          const note = params.load === 'led' ? (op.i < 5e-5 ? 'el LED no enciende' : op.i < 4e-4 ? 'el LED enciende muy tenue' : op.i < 1e-3 ? 'el LED se ve, con poca luz' : 'el LED se ve bien en la penumbra') : `P en el resistor = ${si(op.i * op.v, 'W')}`;
          text(ctx, note, w / 2, h * 0.93, { align: 'center', size: 12.5, color: c.muted });

          this.drawChart(c, op);
        },

        drawChart(c, op = operating()) {
          const e = emf();
          const r = rint();
          const pack = [[0, (e / r) * 1000], [e, 0]];
          const loadCurve = [];
          for (let n = 0; n <= SAMPLES; n++) {
            const v = (n / SAMPLES) * X_MAX;
            const i = (params.load === 'led' ? ledCurrent(v) : v / params.r) * 1000;
            if (i <= Y_MAX) loadCurve.push([v, i]);
          }
          chart.draw({
            xMax: X_MAX,
            yMin: 0,
            yMax: Y_MAX,
            xTicks: [0, 1, 2, 3, 4, 5, 6].map((v) => ({ value: v, label: `${v} V` })),
            yTicks: [0, 1, 2, 3].map((v) => ({ value: v, label: `${v} mA` })),
            series: [
              { points: pack, color: c.chargeNeg },
              { points: loadCurve, color: c.chargePos },
            ],
            cursor: { x: op.v, y: op.i * 1000, color: c.accent },
            legend: [
              { label: `fuente: V = E − I·r  (Icc = ${si(e / r, 'A')})`, color: c.chargeNeg },
              { label: params.load === 'led' ? 'LED rojo: I(V)' : `resistor de ${si(params.r, 'Ω')}: I = V/R`, color: c.chargePos },
            ],
            xLabel: 'tensión',
            yLabel: 'corriente',
          });
        },

        formulas() {
          const e = emf();
          const r = rint();
          const op = operating();
          return [
            { name: 'Tensión en vacío', sym: 'E = n<sub>s</sub> · E<sub>limón</sub>', val: `E = ${params.ns} · ${si(E_CELL, 'V')} = ${si(e, 'V')}` },
            { name: 'Resistencia interna del banco', sym: 'r = n<sub>s</sub> · r<sub>limón</sub> / n<sub>p</sub>', val: `r = ${params.ns} · ${si(R_CELL, 'Ω')} / ${params.np} = ${si(r, 'Ω')}` },
            { name: 'Corriente de cortocircuito', sym: 'I<sub>cc</sub> = E / r', val: `Icc = ${si(e, 'V')} / ${si(r, 'Ω')} = ${si(e / r, 'A')}` },
            { name: 'Tensión en la carga', sym: 'V = E − I · r', val: `V = ${si(e, 'V')} − ${si(op.i, 'A')} · ${si(r, 'Ω')} = ${si(op.v, 'V')}` },
            { name: 'Potencia entregada', sym: 'P = V · I', val: `P = ${si(op.v, 'V')} · ${si(op.i, 'A')} = ${si(op.v * op.i, 'W')}` },
          ];
        },
      };
    },
  });
})();
