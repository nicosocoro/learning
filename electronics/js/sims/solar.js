// Capítulo 31: un panel de 36 celdas (≈ 100 W) bajo distinta luz y temperatura, conectado a una
// resistencia, a una batería de 12 V directamente o a un seguidor MPPT.
// Modelo de un diodo sin resistencias parásitas: I = Isc − I0·(e^(V/(Ns·a)) − 1).

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawBattery, drawResistor, polyline, text, arrow, si, num } = Elec;

  const CELLS = 36; //          celdas en serie
  const ISC_REF = 5.9; //       A, a 1000 W/m² y 25 °C
  const VOC_CELL = 0.6; //      V por celda en esas condiciones
  const N_VT = 0.0334; //       V: factor de idealidad por tensión térmica a 25 °C
  const VOC_TEMP = -0.0021; //  V/°C por celda
  const ISC_TEMP = 0.0005; //   1/°C
  const BATT = { e: 12.6, r: 0.05 }; // batería de plomo-ácido casi cargada
  const MPPT_EFF = 0.95;
  const SAMPLES = 120;

  /** Curva del panel para una luz G (W/m²) y una temperatura T (°C). */
  function panelAt(G, T) {
    const a = (N_VT * (T + 273.15)) / 298.15;
    const vocCell = VOC_CELL + VOC_TEMP * (T - 25) + a * Math.log(G / 1000);
    const isc = ISC_REF * (G / 1000) * (1 + ISC_TEMP * (T - 25));
    const i0 = isc / (Math.exp(vocCell / a) - 1);
    const voc = CELLS * vocCell;
    const current = (v) => Math.max(0, isc - i0 * (Math.exp(v / (CELLS * a)) - 1));
    let mpp = { v: 0, i: 0, p: 0 };
    for (let k = 0; k <= 400; k++) {
      const v = (k / 400) * voc;
      const p = v * current(v);
      if (p > mpp.p) mpp = { v, i: current(v), p };
    }
    return { isc, voc, current, mpp };
  }

  /** Raíz de f (decreciente) en [0, hi] por bisección. */
  function root(f, hi) {
    let lo = 0;
    let top = hi;
    for (let n = 0; n < 50; n++) {
      const mid = (lo + top) / 2;
      if (f(mid) > 0) lo = mid; else top = mid;
    }
    return (lo + top) / 2;
  }

  const STC = panelAt(1000, 25);

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Un panel solar y su punto de trabajo',
    label: 'Un panel solar de 36 celdas conectado a una carga, con las curvas de corriente y de potencia según la tensión',
    caption: 'El punto de trabajo lo fija la carga: una resistencia, una batería de 12 V conectada directa o un convertidor MPPT que siempre busca el máximo. Los valores son los de un panel de unos 100 W.',
    chart: true,
    controls: [
      { type: 'choice', key: 'mode', label: 'Carga', value: 'res', options: [{ value: 'res', label: 'Resistencia' }, { value: 'batt', label: 'Batería directa' }, { value: 'mppt', label: 'Con MPPT' }] },
      { key: 'g', label: 'Luz recibida (G)', min: 100, max: 1000, step: 50, value: 1000, unit: 'W/m²', format: (v) => `${v} W/m²` },
      { key: 't', label: 'Temperatura de las celdas', min: 10, max: 75, step: 5, value: 25, unit: '°C', format: (v) => `${v} °C` },
      { key: 'r', label: 'Resistencia de carga (modo “Resistencia”)', values: [1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 50, 100], value: 3, unit: 'Ω' },
    ],

    setup({ params, chart }) {
      const flow = new FlowPath([], { closed: true });
      const panel = () => panelAt(params.g, params.t);

      /** Punto de trabajo { v, i } del panel y potencia entregada a la carga. */
      function operating() {
        const p = panel();
        if (params.mode === 'mppt') return { v: p.mpp.v, i: p.mpp.i, out: p.mpp.p * MPPT_EFF };
        const v = params.mode === 'res'
          ? root((x) => p.current(x) - x / params.r, p.voc)
          : root((x) => p.current(x) - Math.max(0, x - BATT.e) / BATT.r, p.voc);
        const i = p.current(v);
        return { v, i, out: v * i };
      }

      return {
        reset() { flow.phase = 0; },

        step(dt) {
          flow.advance(dt, -visualSpeed(operating().i, ISC_REF));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const compact = w < 520;
          const op = operating();
          const p = panel();
          const x0 = w * 0.3;
          const x1 = w * 0.78;
          const y0 = h * 0.2;
          const y1 = h * 0.76;
          const ym = (y0 + y1) / 2;
          const span = y1 - y0;
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
          polyline(ctx, corners, { color: c.wire, width: 3, close: true });

          // panel: grilla de celdas teñida según la luz
          const pw = compact ? 46 : 60;
          const ph = span * 0.72;
          ctx.fillStyle = c.surface;
          ctx.fillRect(x0 - pw / 2 - 4, ym - ph / 2 - 4, pw + 8, ph + 8);
          ctx.save();
          ctx.globalAlpha = 0.25 + 0.65 * (params.g / 1000);
          ctx.fillStyle = c.chargeNeg;
          const cols = 4;
          const rows = 6;
          for (let rr = 0; rr < rows; rr++) {
            for (let cc = 0; cc < cols; cc++) {
              ctx.fillRect(x0 - pw / 2 + (cc * pw) / cols + 1.5, ym - ph / 2 + (rr * ph) / rows + 1.5, pw / cols - 3, ph / rows - 3);
            }
          }
          ctx.restore();
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(x0 - pw / 2 - 4, ym - ph / 2 - 4, pw + 8, ph + 8);
          text(ctx, '+', x0 + pw / 2 + 14, y0 + 16, { color: c.chargePos, size: 16, weight: 700, align: 'center' });
          text(ctx, '−', x0 + pw / 2 + 14, y1 - 16, { color: c.chargeNeg, size: 16, weight: 700, align: 'center' });

          // sol y rayos (largo según la luz)
          const sx = w * 0.09;
          const sy = h * 0.3;
          ctx.fillStyle = c.heat;
          ctx.beginPath();
          ctx.arc(sx, sy, 15, 0, Math.PI * 2);
          ctx.fill();
          for (let k = 0; k < 8; k++) {
            const ang = (k / 8) * Math.PI * 2;
            const len = 6 + 14 * (params.g / 1000);
            polyline(ctx, [[sx + Math.cos(ang) * 21, sy + Math.sin(ang) * 21], [sx + Math.cos(ang) * (21 + len), sy + Math.sin(ang) * (21 + len)]], { color: c.heat, width: 2.5 });
          }
          arrow(ctx, sx + 46, sy + 8, x0 - pw / 2 - 12, ym - 10, { color: c.heat, width: 2.5 });
          text(ctx, `${params.g} W/m²`, sx, sy + 58, { align: 'center', size: 12, color: c.muted });

          // carga
          if (params.mode === 'res') {
            drawResistor(ctx, x1, ym, { orient: 'v', len: Math.min(80, span * 0.5), heat: Math.min(1, op.out / STC.mpp.p) });
            text(ctx, `R = ${si(params.r, 'Ω')}`, x1 + 28, ym, { size: 12, color: c.accent });
          } else if (params.mode === 'batt') {
            drawBattery(ctx, x1, ym, { orient: 'v', len: 64 });
            text(ctx, 'batería 12 V', x1 + 36, ym, { size: 12, color: c.accent });
          } else {
            ctx.fillStyle = c.surface;
            ctx.fillRect(x1 - 36, ym - 26, 72, 52);
            ctx.strokeStyle = c.wire;
            ctx.lineWidth = 2.5;
            ctx.strokeRect(x1 - 36, ym - 26, 72, 52);
            text(ctx, 'MPPT', x1, ym - 6, { align: 'center', weight: 700, size: 14 });
            text(ctx, 'convertidor', x1, ym + 12, { align: 'center', size: 11, color: c.muted });
          }

          flow.setPoints(corners);
          flow.draw(ctx, { radius: compact ? 3.6 : 4.5, spacing: 24 });

          text(ctx, `V = ${si(op.v, 'V')}`, w / 2 + 20, y0 - 16, { align: 'center', size: 12.5, color: c.chargeNeg });
          text(ctx, `I = ${si(op.i, 'A')}`, w / 2 + 20, y1 + 18, { align: 'center', size: 12.5, color: c.chargePos });
          text(ctx, `P = ${si(op.out, 'W')}  (${num((100 * op.out) / Math.max(p.mpp.p, 1e-9), 3)} % del máximo disponible)`, w / 2, h * 0.93, { align: 'center', size: compact ? 11 : 12.5, color: c.text });

          this.drawChart(c, op, p);
        },

        drawChart(c, op = operating(), p = panel()) {
          const cur = [];
          const pow = [];
          const vMax = 24;
          for (let n = 0; n <= SAMPLES; n++) {
            const v = (n / SAMPLES) * Math.min(p.voc, vMax);
            cur.push([v, p.current(v) / ISC_REF]);
            pow.push([v, (v * p.current(v)) / STC.mpp.p]);
          }
          const dot = (x, y, color) => ({ points: [[x, y], [x + 0.01, y]], color, width: 11 });
          chart.draw({
            xMax: vMax,
            yMin: 0,
            yMax: 1.25,
            xTicks: [0, 4, 8, 12, 16, 20, 24].map((v) => ({ value: v, label: `${v} V` })),
            yTicks: [0, 0.5, 1].map((k) => ({ value: k, label: num(k) })),
            series: [
              { points: cur, color: c.chargeNeg },
              { points: pow, color: c.chargePos, width: 2.5 },
              dot(p.mpp.v, p.mpp.p / STC.mpp.p, c.good),
            ],
            cursor: { x: op.v, y: (op.v * op.i) / STC.mpp.p, color: c.accent },
            legend: [
              { label: `corriente I/Isc (Isc = ${si(ISC_REF, 'A')})`, color: c.chargeNeg },
              { label: `potencia P/${si(STC.mpp.p, 'W')}`, color: c.chargePos },
              { label: `máximo: ${si(p.mpp.p, 'W')} a ${si(p.mpp.v, 'V')}`, color: c.good },
            ],
            xLabel: 'tensión del panel',
            yLabel: 'valor relativo al panel a pleno sol',
          });
        },

        formulas() {
          const p = panel();
          const op = operating();
          return [
            { name: 'Corriente de cortocircuito (crece con la luz)', sym: 'I<sub>sc</sub> ∝ G', val: `Isc = ${si(p.isc, 'A')}` },
            { name: 'Tensión en vacío (baja con el calor)', sym: 'V<sub>oc</sub> = 36 · (0,6 V − 2,1 mV/°C · ΔT + …)', val: `Voc = ${si(p.voc, 'V')}` },
            { name: 'Punto de máxima potencia', sym: 'P<sub>mp</sub> = V<sub>mp</sub> · I<sub>mp</sub>', val: `Pmp = ${si(p.mpp.v, 'V')} · ${si(p.mpp.i, 'A')} = ${si(p.mpp.p, 'W')}` },
            { name: 'Factor de llenado', sym: 'FF = P<sub>mp</sub> / (V<sub>oc</sub> · I<sub>sc</sub>)', val: `FF = ${num(p.mpp.p / (p.voc * p.isc))}` },
            { name: 'Punto de trabajo actual', sym: 'P = V · I', val: `P = ${si(op.v, 'V')} · ${si(op.i, 'A')} = ${si(op.v * op.i, 'W')}` },
            { name: 'Potencia aprovechada', sym: params.mode === 'mppt' ? 'P<sub>útil</sub> = η · P<sub>mp</sub>' : 'P<sub>útil</sub> = P', val: `Pútil = ${si(op.out, 'W')}` },
          ];
        },
      };
    },
  });
})();
