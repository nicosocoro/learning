// Lección 14: transistor bipolar NPN en emisor común. Una pequeña corriente de base (Ib)
// controla la corriente de colector (Ic), hasta que el circuito externo la limita (saturación).

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { FlowPath, visualSpeed } = Elec;
  const { drawBattery, drawResistor, drawBjt, drawGround, polyline, text, arrow } = Elec;
  const { si, num } = Elec;

  const VBE = 0.7; //      tensión base-emisor cuando conduce
  const VCE_SAT = 0.2; //  tensión colector-emisor en saturación
  const VIN_MAX = 5;
  const I_MAX = 0.02; //   para escalar la velocidad dibujada

  function solve({ vin, rb, rc, beta, vcc }) {
    const ib = Math.max(0, (vin - VBE) / rb);
    const icActive = beta * ib;
    const icSat = Math.max(0, (vcc - VCE_SAT) / rc);
    const saturated = icActive >= icSat && ib > 0;
    const ic = saturated ? icSat : icActive;
    const vce = vcc - ic * rc;
    let region = 'corte';
    if (ib > 0) region = saturated ? 'saturación' : 'activa';
    return { ib, ic, icSat, vce, region };
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Transistor NPN: la base controla el colector',
    label: 'Circuito con un transistor NPN, una resistencia de base, una de colector y dos fuentes, con una gráfica de la corriente de colector según la tensión de entrada',
    caption: 'La corriente de base (pequeña, arriba a la izquierda) abre el paso a una corriente de colector mucho mayor. Las velocidades dibujadas no están a escala.',
    chart: true,
    controls: [
      { key: 'vin', label: 'Tensión de entrada en la base (V<sub>in</sub>)', min: 0, max: VIN_MAX, step: 0.1, value: 1.5, unit: 'V' },
      { key: 'rb', label: 'Resistencia de base (R<sub>B</sub>)', values: [1000, 2200, 4700, 10000, 22000, 47000, 100000], value: 10000, unit: 'Ω' },
      { key: 'rc', label: 'Resistencia de colector (R<sub>C</sub>)', min: 100, max: 2000, step: 100, value: 1000, unit: 'Ω' },
      { key: 'beta', label: 'Ganancia de corriente (β)', min: 50, max: 300, step: 10, value: 100, format: (v) => String(v) },
      { key: 'vcc', label: 'Fuente del colector (V<sub>CC</sub>)', min: 5, max: 12, step: 1, value: 9, unit: 'V' },
    ],

    setup({ params, chart }) {
      const baseIn = new FlowPath();
      const baseOut = new FlowPath();
      const collIn = new FlowPath();
      const collOut = new FlowPath();

      return {
        reset() {
          for (const p of [baseIn, baseOut, collIn, collOut]) p.phase = 0;
        },

        step(dt) {
          const s = solve(params);
          const base = -visualSpeed(s.ib * 8, I_MAX); // la base se exagera para que se note
          const coll = -visualSpeed(s.ic, I_MAX);
          baseIn.advance(dt, base);
          baseOut.advance(dt, base);
          collIn.advance(dt, coll);
          collOut.advance(dt, coll);
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const s = solve(params);
          const x0 = w * 0.1; //   fuente de entrada
          const xb = w * 0.3; //   resistencia de base
          const xt = w * 0.5; //   transistor
          const x2 = w * 0.9; //   fuente de colector
          const y0 = h * 0.14;
          const y1 = h * 0.86;
          const ym = h * 0.5;
          const r = Math.min(34, h * 0.09);

          const n = drawBjtNodes(xt, ym, r);
          const xc = n.c[0];

          // cables
          polyline(ctx, [[x0, ym - 32], [x0, ym], [xb - 45, ym]], { color: c.wire, width: 3 });
          polyline(ctx, [[xb + 45, ym], n.b], { color: c.wire, width: 3 });
          polyline(ctx, [[n.e[0], n.e[1]], [n.e[0], y1], [x0, y1], [x0, ym + 32]], { color: c.wire, width: 3 });
          polyline(ctx, [[x2, ym - 32], [x2, y0], [xc, y0], [xc, n.c[1]]], { color: c.wire, width: 3 });
          polyline(ctx, [[n.e[0], y1], [x2, y1], [x2, ym + 32]], { color: c.wire, width: 3 });

          // electrones
          const show = (p, pts, i) => {
            p.setPoints(pts);
            if (i > 1e-7) p.draw(ctx, { spacing: 22, radius: 4.5 });
          };
          show(baseIn, [[x0, ym - 32], [x0, ym], n.b], s.ib);
          show(collIn, [[x2, ym - 32], [x2, y0], [xc, y0], n.c], s.ic);
          show(baseOut, [[n.e[0], y1], [x0, y1], [x0, ym + 32]], s.ib);
          show(collOut, [n.e, [n.e[0], y1], [x2, y1], [x2, ym + 32]], s.ic);

          // componentes
          drawBattery(ctx, x0, ym, { orient: 'v' });
          drawBattery(ctx, x2, ym, { orient: 'v' });
          drawResistor(ctx, xb, ym, { len: 90, heat: Math.min(1, (s.ib * s.ib * params.rb) / 0.0005) });
          drawResistor(ctx, xc, (y0 + n.c[1]) / 2 + 2, { orient: 'v', len: Math.min(100, (n.c[1] - y0) * 0.8), heat: Math.min(1, (s.ic * s.ic * params.rc) / 0.1) });
          drawBjt(ctx, xt, ym, { r, on: s.region === 'corte' ? 0 : s.ic / Math.max(s.icSat, 1e-9), heat: 0 });
          drawGround(ctx, x0 - 0, y1);

          // etiquetas
          text(ctx, si(params.vin, 'V'), x0 - 32, ym, { align: 'right', weight: 600, color: c.accent });
          text(ctx, 'Vin', x0 - 32, ym - 18, { align: 'right', color: c.muted, size: 12 });
          text(ctx, `RB = ${si(params.rb, 'Ω')}`, xb, ym - 32, { align: 'center', weight: 600, size: 12 });
          text(ctx, `RC = ${si(params.rc, 'Ω')}`, xc + 34, (y0 + n.c[1]) / 2, { weight: 600, size: 12 });
          text(ctx, si(params.vcc, 'V'), x2 + 32, ym, { weight: 600, color: c.accent });
          text(ctx, 'VCC', x2 + 32, ym - 18, { color: c.muted, size: 12 });
          text(ctx, 'B', n.b[0] - 8, n.b[1] - 12, { color: c.muted, size: 12, align: 'center' });
          text(ctx, 'C', n.c[0] + 12, n.c[1] + 4, { color: c.muted, size: 12 });
          text(ctx, 'E', n.e[0] + 12, n.e[1] - 4, { color: c.muted, size: 12 });

          // corrientes
          arrow(ctx, xb - 24, ym + 30, xb + 24, ym + 30, { color: c.chargePos });
          text(ctx, `Ib = ${si(s.ib, 'A')}`, xb, ym + 48, { align: 'center', color: c.chargePos, size: 12, weight: 600 });
          arrow(ctx, xc + 40, ym - h * 0.17, xc + 40, ym - h * 0.17 + 30, { color: c.chargePos });
          text(ctx, `Ic = ${si(s.ic, 'A')}`, xc + 52, ym - h * 0.17 + 14, { color: c.chargePos, size: 12, weight: 600 });

          const col = s.region === 'activa' ? c.good : s.region === 'saturación' ? c.heat : c.muted;
          text(ctx, `Región: ${s.region}`, xt, h * 0.95, { align: 'center', weight: 700, color: col, size: 14 });

          this.drawChart(c, s);
        },

        drawChart(c, s) {
          const pts = [];
          for (let k = 0; k <= 100; k++) {
            const vin = (VIN_MAX * k) / 100;
            pts.push([vin, solve({ ...params, vin }).ic * 1000]);
          }
          const yMax = Math.max(5, Math.ceil((solve({ ...params, vin: VIN_MAX }).ic * 1000 * 1.15) / 5) * 5);
          chart.draw({
            xMax: VIN_MAX,
            yMax,
            xTicks: [0, 1, 2, 3, 4, 5].map((v) => ({ value: v, label: `${v} V` })),
            yTicks: [0, 0.5, 1].map((f) => ({ value: f * yMax, label: `${num(f * yMax)} mA` })),
            series: [{ points: pts, color: c.accent }],
            hlines: [{ y: s.icSat * 1000, label: 'límite del circuito (saturación)', color: c.heat }],
            cursor: { x: params.vin, y: s.ic * 1000, color: c.chargePos },
            xLabel: 'tensión de entrada Vin',
            yLabel: 'corriente de colector Ic',
          });
        },

        formulas() {
          const s = solve(params);
          return [
            { name: 'Corriente de base', sym: 'I<sub>B</sub> = (V<sub>in</sub> − V<sub>BE</sub>) / R<sub>B</sub>', val: `Ib = (${si(params.vin, 'V')} − 0,7 V) / ${si(params.rb, 'Ω')} = ${si(s.ib, 'A')}` },
            { name: 'Corriente de colector (zona activa)', sym: 'I<sub>C</sub> = β · I<sub>B</sub>', val: `β·Ib = ${params.beta} · ${si(s.ib, 'A')} = ${si(params.beta * s.ib, 'A')}` },
            { name: 'Máximo que permite el circuito', sym: 'I<sub>C,sat</sub> = (V<sub>CC</sub> − V<sub>CE,sat</sub>) / R<sub>C</sub>', val: `Ic,sat = (${si(params.vcc, 'V')} − 0,2 V) / ${si(params.rc, 'Ω')} = ${si(s.icSat, 'A')}` },
            { name: 'Corriente de colector real', sym: 'I<sub>C</sub> = mín(β · I<sub>B</sub>, I<sub>C,sat</sub>)', val: `Ic = ${si(s.ic, 'A')}  (${s.region})` },
            { name: 'Tensión colector-emisor', sym: 'V<sub>CE</sub> = V<sub>CC</sub> − I<sub>C</sub> · R<sub>C</sub>', val: `Vce = ${si(params.vcc, 'V')} − ${si(s.ic, 'A')} · ${si(params.rc, 'Ω')} = ${si(s.vce, 'V')}` },
            { name: 'Potencia en el transistor', sym: 'P = V<sub>CE</sub> · I<sub>C</sub>', val: `P = ${si(s.vce, 'V')} · ${si(s.ic, 'A')} = ${si(s.vce * s.ic, 'W')}` },
          ];
        },
      };

      function drawBjtNodes(x, y, r) {
        // mismos terminales que devuelve drawBjt, calculados sin dibujar (se necesitan antes de los cables)
        const dx = 0.42 * r;
        const hh = Math.sqrt(r * r - dx * dx);
        return { b: [x - r, y], c: [x + dx, y - hh], e: [x + dx, y + hh] };
      }
    },
  });
})();
