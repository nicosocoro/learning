// Lección 23: amplificador operacional con realimentación negativa (seguidor, no inversor,
// inversor) y sin realimentación (comparador). La salida nunca supera la alimentación.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { drawResistor, drawOpAmp, drawAcSource, drawGround, polyline, text, circle } = Elec;
  const { si, num } = Elec;

  const SAT = 10.5; //     tensión de saturación de la salida con alimentación de ±12 V
  const RAIL = 12;
  const CYCLES = 2;

  function model({ cfg, rf, rg, vin }) {
    let gain;
    if (cfg === 'follower') gain = 1;
    else if (cfg === 'noninv') gain = 1 + rf / rg;
    else if (cfg === 'inv') gain = -rf / rg;
    else gain = 1e5;
    const out = (v) => Math.max(-SAT, Math.min(SAT, gain * v));
    const needed = Math.abs(gain) * vin;
    return { gain, out, needed, saturated: needed > SAT };
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Amplificador operacional: la realimentación fija la ganancia',
    label: 'Circuito con un amplificador operacional y sus resistencias, una pantalla con la señal de entrada y de salida, y la curva de transferencia de entrada contra salida',
    caption: 'Alimentación de ±12 V: la salida se satura a unos ±10,5 V. Sin realimentación (comparador), cualquier diferencia mínima entre las entradas satura la salida.',
    chart: true,
    controls: [
      {
        type: 'choice', key: 'cfg', label: 'Configuración', value: 'inv',
        options: [{ value: 'follower', label: 'Seguidor' }, { value: 'noninv', label: 'No inversor' }, { value: 'inv', label: 'Inversor' }, { value: 'comp', label: 'Sin realimentación' }],
      },
      { key: 'vin', label: 'Amplitud de la señal de entrada', min: 0.1, max: 5, step: 0.1, value: 0.5, unit: 'V' },
      { key: 'rf', label: 'Resistor de realimentación (R<sub>f</sub>)', values: [10000, 22000, 47000, 100000], value: 100000, unit: 'Ω' },
      { key: 'rg', label: 'Resistor de entrada / a masa (R<sub>g</sub>)', values: [1000, 2200, 4700, 10000], value: 10000, unit: 'Ω' },
    ],

    setup({ params, chart }) {
      let phase = 0;
      return {
        reset() { phase = 0; },
        step(dt) { phase = (phase + Math.max(0, dt) * 0.25) % 1; },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const m = model(params);
          const wide = w > 520;
          const xo = w * 0.31;
          const ym = h * 0.5;
          const sz = Math.min(80, h * 0.2);
          const n = drawOpAmp(ctx, xo, ym, { size: sz, sat: m.saturated ? 1 : 0 });
          const x0 = w * 0.06;
          const mx = n.minus[0] - 36;
          const yTop = ym - sz * 0.85;
          const y1 = h * 0.88;
          const wire = (pts) => polyline(ctx, pts, { color: c.wire, width: 3 });
          const dot = (x, y) => circle(ctx, x, y, 3.5, { fill: c.wire });

          // salida
          const xOut = n.out[0] + 28;
          wire([n.out, [xOut, n.out[1]]]);
          circle(ctx, xOut, n.out[1], 5, { fill: c.surface, stroke: c.wire, width: 2 });
          text(ctx, 'Vsal', xOut + 10, n.out[1], { size: 12, color: c.muted });

          const feedback = () => {
            wire([[xOut - 14, n.out[1]], [xOut - 14, yTop], [mx, yTop], [mx, n.minus[1]], n.minus]);
            dot(xOut - 14, n.out[1]);
            ctx.save();
            ctx.fillStyle = c.surface;
            ctx.fillRect((xOut - 14 + mx) / 2 - 45, yTop - 12, 90, 24);
            ctx.restore();
            drawResistor(ctx, (xOut - 14 + mx) / 2, yTop, { len: 80, heat: 0 });
            text(ctx, `Rf = ${si(params.rf, 'Ω')}`, (xOut - 14 + mx) / 2, yTop - 30, { align: 'center', weight: 600, size: 12 });
            dot(mx, n.minus[1]);
          };
          const vgnd = (x, y) => { wire([[x, y], [x, y1 - 12]]); drawGround(ctx, x, y1 - 12); };

          drawAcSource(ctx, x0, ym + sz * 0.5, 15);
          text(ctx, 'Vent', x0 - 22, ym + sz * 0.5, { align: 'right', size: 12, color: c.muted });
          wire([[x0, ym + sz * 0.5 + 15], [x0, y1 - 12]]);
          drawGround(ctx, x0, y1 - 12);

          if (params.cfg === 'inv') {
            wire([[x0, ym + sz * 0.5 - 15], [x0, n.minus[1]], [mx - 70, n.minus[1]]]);
            ctx.save(); ctx.fillStyle = c.surface; ctx.fillRect(x0 + (mx - 70 - x0) / 2 - 38, n.minus[1] - 12, 76, 24); ctx.restore();
            drawResistor(ctx, x0 + (mx - 70 - x0) / 2 + 35, n.minus[1], { len: 70, heat: 0 });
            wire([[mx - 70 + 2, n.minus[1]], [mx, n.minus[1]]]);
            text(ctx, `Rin = ${si(params.rg, 'Ω')}`, x0 + (mx - 70 - x0) / 2 + 35, n.minus[1] - 26, { align: 'center', weight: 600, size: 12 });
            feedback();
            wire([n.plus, [mx - 14, n.plus[1]], [mx - 14, y1 - 12]]);
            drawGround(ctx, mx - 14, y1 - 12);
          } else if (params.cfg === 'noninv') {
            wire([[x0, ym + sz * 0.5 - 15], [x0, n.plus[1]], n.plus]);
            feedback();
            wire([[mx, n.minus[1]], [mx, n.minus[1] + 28]]);
            drawResistor(ctx, mx, n.minus[1] + 28 + 36, { orient: 'v', len: 60, heat: 0 });
            wire([[mx, n.minus[1] + 28 + 66], [mx, y1 - 12]]);
            drawGround(ctx, mx, y1 - 12);
            text(ctx, `Rg = ${si(params.rg, 'Ω')}`, mx + 12, n.minus[1] + 64, { size: 12, weight: 600 });
          } else if (params.cfg === 'follower') {
            wire([[x0, ym + sz * 0.5 - 15], [x0, n.plus[1]], n.plus]);
            wire([[xOut - 14, n.out[1]], [xOut - 14, yTop], [mx, yTop], [mx, n.minus[1]], n.minus]);
            dot(xOut - 14, n.out[1]);
          } else {
            wire([[x0, ym + sz * 0.5 - 15], [x0, n.plus[1]], n.plus]);
            wire([n.minus, [mx, n.minus[1]], [mx, y1 - 12]]);
            drawGround(ctx, mx, y1 - 12);
            text(ctx, 'entrada − a masa (0 V)', mx - 4, n.minus[1] - 14, { align: 'right', size: 11, color: c.muted });
          }
          const name = { follower: 'Seguidor', noninv: 'No inversor', inv: 'Inversor', comp: 'Sin realimentación' }[params.cfg];
          text(ctx, `${name}: ganancia = ${params.cfg === 'comp' ? '≈ 100 000' : num(m.gain, 3)}`, (x0 + xOut) / 2, h * 0.05, { align: 'center', weight: 700, size: 13, color: m.saturated ? c.bad : c.good });
          if (m.saturated) text(ctx, '¡salida saturada!', (x0 + xOut) / 2, h * 0.95, { align: 'center', weight: 700, size: 13, color: c.bad });

          // pantalla
          const sx = w * 0.62;
          const sy = h * 0.12;
          const sw = w * 0.34;
          const sh = h * 0.72;
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.strokeStyle = c.border;
          ctx.fillRect(sx, sy, sw, sh);
          ctx.strokeRect(sx, sy, sw, sh);
          ctx.restore();
          const py = (v) => sy + sh / 2 - (v / RAIL) * (sh / 2);
          polyline(ctx, [[sx, py(0)], [sx + sw, py(0)]], { color: c.grid, width: 1 });
          for (const lv of [SAT, -SAT]) polyline(ctx, [[sx, py(lv)], [sx + sw, py(lv)]], { color: c.bad, width: 1, dash: [4, 4] });
          text(ctx, 'saturación', sx + sw - 4, py(SAT) - 7, { align: 'right', size: 10.5, color: c.bad });
          const pin = [];
          const pout = [];
          for (let k = 0; k <= 160; k++) {
            const t = k / 160;
            const v = params.vin * Math.sin(2 * Math.PI * CYCLES * t);
            pin.push([sx + t * sw, py(v)]);
            pout.push([sx + t * sw, py(m.out(v))]);
          }
          polyline(ctx, pin, { color: c.chargeNeg, width: 2.5 });
          polyline(ctx, pout, { color: m.saturated ? c.bad : c.accent, width: 2.5 });
          const vnow = params.vin * Math.sin(2 * Math.PI * CYCLES * phase);
          circle(ctx, sx + phase * sw, py(m.out(vnow)), 4.5, { fill: c.chargePos });
          text(ctx, wide ? 'entrada (azul) y salida (±12 V de escala)' : 'entrada y salida', sx, sy - 10, { size: 11.5, weight: 600 });

          this.drawChart(c, m, vnow);
        },

        drawChart(c, m, vnow) {
          const pts = [];
          for (let k = 0; k <= 200; k++) {
            const v = -5 + (10 * k) / 200;
            pts.push([v, m.out(v)]);
          }
          chart.draw({
            xMin: -5,
            xMax: 5,
            yMin: -12,
            yMax: 12,
            xTicks: [-5, -2.5, 0, 2.5, 5].map((v) => ({ value: v, label: `${v} V` })),
            yTicks: [-10, -5, 0, 5, 10].map((v) => ({ value: v, label: `${v} V` })),
            series: [{ points: pts, color: c.accent }],
            hlines: [{ y: SAT, label: 'saturación', color: c.bad }, { y: -SAT, label: '', color: c.bad }],
            cursor: { x: vnow, y: m.out(vnow), color: c.chargePos },
            xLabel: 'tensión de entrada',
            yLabel: 'tensión de salida',
          });
        },

        formulas() {
          const m = model(params);
          const rows = [];
          if (params.cfg === 'inv') rows.push({ name: 'Ganancia del inversor', sym: 'A<sub>v</sub> = −R<sub>f</sub> / R<sub>in</sub>', val: `Av = −${si(params.rf, 'Ω')} / ${si(params.rg, 'Ω')} = ${num(m.gain)}` });
          else if (params.cfg === 'noninv') rows.push({ name: 'Ganancia del no inversor', sym: 'A<sub>v</sub> = 1 + R<sub>f</sub> / R<sub>g</sub>', val: `Av = 1 + ${si(params.rf, 'Ω')} / ${si(params.rg, 'Ω')} = ${num(m.gain)}` });
          else if (params.cfg === 'follower') rows.push({ name: 'Ganancia del seguidor', sym: 'A<sub>v</sub> = 1', val: 'Av = 1: la salida copia a la entrada, pero con mucha más corriente' });
          else rows.push({ name: 'Sin realimentación', sym: 'V<sub>sal</sub> = A · (V<sub>+</sub> − V<sub>−</sub>)', val: 'A ≈ 100 000: con 0,1 mV de diferencia ya satura' });
          rows.push({ name: 'Amplitud que pide la salida', sym: '|A<sub>v</sub>| · V<sub>ent</sub>', val: `${num(Math.abs(params.cfg === 'comp' ? 1e5 : m.gain))} · ${si(params.vin, 'V')} = ${si(m.needed, 'V')}  ${m.saturated ? '→ ¡supera ±10,5 V! se recorta' : '→ cabe dentro de ±10,5 V'}` });
          if (params.cfg === 'inv') rows.push({ name: 'Regla del operacional', sym: 'V<sub>−</sub> ≈ V<sub>+</sub> = 0 V (tierra virtual)', val: 'La entrada − queda a 0 V aunque no esté conectada a masa' });
          if (params.cfg === 'noninv') rows.push({ name: 'Regla del operacional', sym: 'V<sub>−</sub> = V<sub>sal</sub> · R<sub>g</sub> / (R<sub>f</sub> + R<sub>g</sub>) = V<sub>+</sub>', val: 'La realimentación lleva V− hasta V+' });
          rows.push({ name: 'Impedancia de entrada', sym: params.cfg === 'inv' ? 'Z<sub>ent</sub> = R<sub>in</sub>' : 'Z<sub>ent</sub> ≈ ∞', val: params.cfg === 'inv' ? `Zent = ${si(params.rg, 'Ω')}` : 'Zent muy alta (MΩ o más): no carga la fuente de señal' });
          return rows;
        },
      };
    },
  });
})();
