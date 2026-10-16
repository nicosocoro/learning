// Lección 15: el transistor NPN como interruptor. Un pin de microcontrolador, un resistor de base
// y una lámpara de 12 V. Muestra por qué conviene saturarlo y qué pasa en la zona activa.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { FlowPath, visualSpeed } = Elec;
  const { drawLamp, drawBjt, drawBattery, drawGround, polyline, text, arrow } = Elec;
  const { si, num } = Elec;

  const VBE = 0.7;
  const VCE_SAT = 0.2;
  const VCC = 12;
  const P_MAX = 0.5; //     potencia máxima de un transistor en cápsula TO-92
  const I_SCALE = 0.25; //  para escalar la velocidad dibujada

  function solve({ drive, vhigh, rb, rl, beta }) {
    const vin = drive === 'on' ? vhigh : 0;
    const ib = Math.max(0, (vin - VBE) / rb);
    const icSat = (VCC - VCE_SAT) / rl;
    const icActive = beta * ib;
    const saturated = ib > 0 && icActive >= icSat;
    const ic = saturated ? icSat : icActive;
    const vce = VCC - ic * rl;
    const region = ib <= 0 ? 'corte' : saturated ? 'saturación' : 'activa';
    return { vin, ib, ic, icSat, ibMin: icSat / beta, vce, p: vce * ic, region, factor: ib / (icSat / beta) };
  }

  const powerAt = (ib, { rl, beta }) => {
    const icSat = (VCC - VCE_SAT) / rl;
    const ic = Math.min(beta * ib, icSat);
    return (VCC - ic * rl) * ic;
  };

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Un pin de microcontrolador enciende una lámpara de 12 V',
    label: 'Circuito con un pin de microcontrolador, resistor de base, transistor NPN y lámpara alimentada con 12 V, y una gráfica de la potencia que disipa el transistor',
    caption: 'La lámpara brilla según la corriente de colector. El transistor se tiñe de naranja cuando disipa mucha potencia: es lo que ocurre en la zona activa.',
    chart: true,
    controls: [
      { type: 'choice', key: 'drive', label: 'Señal del microcontrolador', value: 'on', options: [{ value: 'off', label: '0 V (bajo)' }, { value: 'on', label: 'Alto' }] },
      { type: 'choice', key: 'vhigh', label: 'Nivel de la señal alta', value: 5, options: [{ value: 3.3, label: '3,3 V' }, { value: 5, label: '5 V' }] },
      { key: 'rb', label: 'Resistor de base (R<sub>B</sub>)', values: [220, 470, 1000, 1800, 4700, 10000, 22000, 47000], value: 1800, unit: 'Ω' },
      { key: 'rl', label: 'Resistencia de la lámpara', min: 50, max: 400, step: 10, value: 100, unit: 'Ω' },
      { key: 'beta', label: 'Ganancia del transistor (β)', min: 50, max: 300, step: 10, value: 100, format: (v) => String(v) },
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
          const base = -visualSpeed(s.ib * 30, 0.1);
          const coll = -visualSpeed(s.ic, 0.4 * I_SCALE * 4);
          baseIn.advance(dt, base);
          baseOut.advance(dt, base);
          collIn.advance(dt, coll);
          collOut.advance(dt, coll);
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const s = solve(params);
          const x0 = w * 0.1;
          const xb = w * 0.32;
          const xt = w * 0.52;
          const x2 = w * 0.9;
          const y0 = h * 0.14;
          const y1 = h * 0.86;
          const ym = h * 0.5;
          const r = Math.min(34, h * 0.09);
          const dx = 0.42 * r;
          const hh = Math.sqrt(r * r - dx * dx);
          const n = { b: [xt - r, ym], c: [xt + dx, ym - hh], e: [xt + dx, ym + hh] };
          const xc = n.c[0];
          const boxR = x0 + 34;
          const lampY = (y0 + n.c[1]) / 2 + 2;
          const hot = Math.min(1, s.p / P_MAX);

          polyline(ctx, [[boxR, ym], [xb - 45, ym]], { color: c.wire, width: 3 });
          polyline(ctx, [[xb + 45, ym], n.b], { color: c.wire, width: 3 });
          polyline(ctx, [n.e, [n.e[0], y1], [x0, y1], [x0, ym + 32]], { color: c.wire, width: 3 });
          polyline(ctx, [[x2, ym - 32], [x2, y0], [xc, y0], n.c], { color: c.wire, width: 3 });
          polyline(ctx, [[n.e[0], y1], [x2, y1], [x2, ym + 32]], { color: c.wire, width: 3 });

          const show = (p, pts, i) => {
            p.setPoints(pts);
            if (i > 1e-7) p.draw(ctx, { spacing: 22, radius: 4.5 });
          };
          show(baseIn, [[boxR, ym], n.b], s.ib);
          show(collIn, [[x2, ym - 32], [x2, y0], [xc, y0], n.c], s.ic);
          show(baseOut, [[n.e[0], y1], [x0, y1], [x0, ym + 32]], s.ib);
          show(collOut, [n.e, [n.e[0], y1], [x2, y1], [x2, ym + 32]], s.ic);

          // microcontrolador
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(x0 - 34, ym - 32, 68, 64, 6);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          text(ctx, 'Micro', x0, ym - 14, { align: 'center', size: 12, color: c.muted });
          text(ctx, si(s.vin, 'V'), x0, ym + 6, { align: 'center', weight: 700, color: s.vin > 0 ? c.accent : c.muted });
          text(ctx, 'pin', x0, ym + 22, { align: 'center', size: 11, color: c.muted });

          drawBattery(ctx, x2, ym, { orient: 'v' });
          text(ctx, si(VCC, 'V'), x2 + 32, ym, { weight: 600, color: c.accent });
          drawResistor2(ctx, xb, ym, s, c);
          drawLamp(ctx, xc, lampY, { r: Math.min(24, h * 0.065), glow: Math.min(1, (s.ic * s.ic * params.rl) / (VCC * VCC / params.rl)) });
          drawBjt(ctx, xt, ym, { r, on: s.region === 'saturación' ? 1 : 0, heat: hot });
          drawGround(ctx, x0, y1);

          text(ctx, `RB = ${si(params.rb, 'Ω')}`, xb, ym - 32, { align: 'center', weight: 600, size: 12 });
          text(ctx, `lámpara ${si(params.rl, 'Ω')}`, xc + 40, lampY, { weight: 600, size: 12 });
          arrow(ctx, xb - 24, ym + 30, xb + 24, ym + 30, { color: c.chargePos });
          text(ctx, `Ib = ${si(s.ib, 'A')}`, xb, ym + 48, { align: 'center', color: c.chargePos, size: 12, weight: 600 });
          arrow(ctx, xc + 44, lampY - 56, xc + 44, lampY - 56 + 28, { color: c.chargePos });
          text(ctx, `Ic = ${si(s.ic, 'A')}`, xc + 58, lampY - 42, { color: c.chargePos, size: 12, weight: 600 });

          const col = s.region === 'saturación' ? c.good : s.region === 'activa' ? c.bad : c.muted;
          text(ctx, `Región: ${s.region}`, xt, h * 0.94, { align: 'center', weight: 700, color: col, size: 14 });
          text(ctx, `Vce = ${si(s.vce, 'V')}  ·  P = ${si(s.p, 'W')}${s.p > P_MAX ? '  ¡se quema!' : ''}`, xt, h * 0.94 - 20, { align: 'center', size: 12, color: s.p > P_MAX ? c.bad : c.muted, weight: s.p > P_MAX ? 700 : 400 });

          this.drawChart(c, s);
        },

        drawChart(c, s) {
          const xMax = Math.max(3 * s.ibMin, s.ib * 1.1);
          const pts = [];
          for (let k = 0; k <= 200; k++) {
            const ib = (xMax * k) / 200;
            pts.push([ib * 1000, powerAt(ib, params)]);
          }
          const peak = (VCC * VCC) / (4 * params.rl);
          const yMax = Math.max(0.6, Math.ceil(peak * 1.15 * 10) / 10);
          chart.draw({
            xMax: xMax * 1000,
            yMax,
            xTicks: [0, 1, 2, 3].map((f) => ({ value: (xMax * 1000 * f) / 3, label: `${num((xMax * 1000 * f) / 3)} mA` })),
            yTicks: [0, 0.5, 1].map((f) => ({ value: f * yMax, label: `${num(f * yMax)} W` })),
            series: [{ points: pts, color: c.accent }],
            hlines: [
              { y: P_MAX, label: 'límite de un transistor TO-92', color: c.bad },
            ],
            cursor: { x: Math.min(s.ib, xMax) * 1000, y: s.p, color: c.chargePos },
            xLabel: 'corriente de base Ib',
            yLabel: 'potencia disipada por el transistor',
          });
        },

        formulas() {
          const s = solve(params);
          return [
            { name: 'Corriente que pide la lámpara', sym: 'I<sub>C,sat</sub> = (V<sub>CC</sub> − V<sub>CE,sat</sub>) / R', val: `Ic,sat = (12 V − 0,2 V) / ${si(params.rl, 'Ω')} = ${si(s.icSat, 'A')}` },
            { name: 'Base mínima para saturar', sym: 'I<sub>B,mín</sub> = I<sub>C,sat</sub> / β', val: `Ib,mín = ${si(s.icSat, 'A')} / ${params.beta} = ${si(s.ibMin, 'A')}` },
            { name: 'Corriente de base real', sym: 'I<sub>B</sub> = (V<sub>señal</sub> − V<sub>BE</sub>) / R<sub>B</sub>', val: `Ib = (${si(s.vin, 'V')} − 0,7 V) / ${si(params.rb, 'Ω')} = ${si(s.ib, 'A')}` },
            { name: 'Factor de saturación', sym: 'k = I<sub>B</sub> / I<sub>B,mín</sub>', val: s.ib > 0 ? `k = ${num(s.factor)}  ${s.factor >= 2 ? '(≥ 2: saturado con margen)' : s.factor >= 1 ? '(justo: poco margen)' : '(< 1: no satura)'}` : 'k = 0 (corte)' },
            { name: 'Tensión colector-emisor', sym: 'V<sub>CE</sub> = V<sub>CC</sub> − I<sub>C</sub> · R', val: `Vce = ${si(s.vce, 'V')}` },
            { name: 'Potencia en el transistor', sym: 'P = V<sub>CE</sub> · I<sub>C</sub>', val: `P = ${si(s.vce, 'V')} · ${si(s.ic, 'A')} = ${si(s.p, 'W')}` },
          ];
        },
      };

      function drawResistor2(ctx, x, y, s, c) {
        Elec.drawResistor(ctx, x, y, { len: 90, heat: Math.min(1, (s.ib * s.ib * params.rb) / 0.0005) });
      }
    },
  });
})();
