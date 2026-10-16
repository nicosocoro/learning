// Lección 22: circuito RLC en serie. Se elige la frecuencia como múltiplo de la de resonancia: cerca
// de f₀ la corriente es máxima y está en fase con la tensión; lejos, la reactancia domina y la
// corriente cae. La gráfica muestra la curva de resonancia completa.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { drawResistor, drawCoil, drawAcSource, polyline, text, circle } = Elec;
  const { si, num } = Elec;

  const CYCLES = 2;
  const V = 1; // amplitud de la fuente (1 V de pico)

  function calc({ l, c, r, k }) {
    const f0 = 1 / (2 * Math.PI * Math.sqrt(l * c));
    const f = k * f0;
    const xl = 2 * Math.PI * f * l;
    const xc = 1 / (2 * Math.PI * f * c);
    const z = Math.hypot(r, xl - xc);
    const i = V / z;
    const phi = Math.atan2(xl - xc, r);
    const q = (2 * Math.PI * f0 * l) / r;
    return { f0, f, xl, xc, z, i, phi, q, bw: f0 / q };
  }

  function drawCap(ctx, x, y, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 20); ctx.lineTo(x - 6, y + 20);
    ctx.moveTo(x + 6, y - 20); ctx.lineTo(x + 6, y + 20);
    ctx.stroke();
    ctx.restore();
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Circuito RLC en serie: la resonancia',
    label: 'Circuito con una fuente alterna, un resistor, una bobina y un capacitor en serie, una pantalla con la tensión y la corriente, y la curva de resonancia',
    caption: 'La fuente es de 1 V de pico. Cerca de la frecuencia de resonancia (k = 1) la corriente se dispara; con poca resistencia, el pico es más agudo (mayor Q).',
    chart: true,
    controls: [
      { key: 'k', label: 'Frecuencia (múltiplo de f₀)', min: 0.2, max: 4, step: 0.05, value: 0.5, format: (v) => `${num(v, 3)} · f₀` },
      { key: 'l', label: 'Inductancia (L)', values: [0.001, 0.01, 0.1], value: 0.01, unit: 'H' },
      { key: 'c', label: 'Capacidad (C)', values: [1e-7, 1e-6, 1e-5], value: 1e-6, unit: 'F' },
      { key: 'r', label: 'Resistencia (R)', values: [5, 10, 20, 50, 100, 200], value: 10, unit: 'Ω' },
    ],

    setup({ params, chart }) {
      let phase = 0;
      return {
        reset() { phase = 0; },
        step(dt) { phase = (phase + Math.max(0, dt) * 0.25) % 1; },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const m = calc(params);
          const x0 = w * 0.08;
          const x1 = w * 0.5;
          const y0 = h * 0.2;
          const y1 = h * 0.82;
          const ym = (y0 + y1) / 2;
          const xm = (x0 + x1) / 2;
          const lenCoil = Math.min(100, (y1 - y0) * 0.55);
          polyline(ctx, [[x0, ym - 16], [x0, y0], [x1, y0], [x1, ym - lenCoil / 2]], { color: c.wire, width: 3 });
          polyline(ctx, [[x1, ym + lenCoil / 2], [x1, y1], [xm + 8, y1]], { color: c.wire, width: 3 });
          polyline(ctx, [[xm - 8, y1], [x0, y1], [x0, ym + 16]], { color: c.wire, width: 3 });
          drawAcSource(ctx, x0, ym, 16);
          drawResistor(ctx, xm, y0, { len: Math.min(100, w * 0.2), heat: Math.min(1, (m.i * m.i * params.r) / 0.2) });
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.fillRect(x1 - 14, ym - lenCoil / 2, 28, lenCoil);
          ctx.restore();
          drawCoil(ctx, x1, ym, { len: lenCoil, turns: 6, active: Math.min(1, m.i / (V / params.r)) });
          drawCap(ctx, xm, y1, c.text);
          text(ctx, `R = ${si(params.r, 'Ω')}`, xm, y0 - 28, { align: 'center', weight: 600, size: 12 });
          text(ctx, `L = ${si(params.l, 'H')}`, x1 + 24, ym - 12, { weight: 600, size: 12 });
          text(ctx, `X = ${si(m.xl, 'Ω')}`, x1 + 24, ym + 6, { size: 11.5, color: c.heat });
          text(ctx, `C = ${si(params.c, 'F')}`, xm, y1 + 34, { align: 'center', weight: 600, size: 12 });
          text(ctx, `X = ${si(m.xc, 'Ω')}`, xm, y1 + 50, { align: 'center', size: 11.5, color: c.chargeNeg });
          text(ctx, `f₀ = ${si(m.f0, 'Hz')}`, (x0 + x1) / 2, h * 0.07, { align: 'center', weight: 700, color: c.accent, size: 13 });
          const near = Math.abs(params.k - 1) < 0.12;
          text(ctx, near ? '¡RESONANCIA!' : params.k < 1 ? 'por debajo: manda el capacitor' : 'por encima: manda la bobina', (x0 + x1) / 2, h * 0.95, { align: 'center', weight: 700, size: 13, color: near ? c.good : c.muted });

          // pantalla
          const sx = w * 0.6;
          const sy = h * 0.12;
          const sw = w * 0.36;
          const sh = h * 0.72;
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.strokeStyle = c.border;
          ctx.fillRect(sx, sy, sw, sh);
          ctx.strokeRect(sx, sy, sw, sh);
          ctx.restore();
          polyline(ctx, [[sx, sy + sh / 2], [sx + sw, sy + sh / 2]], { color: c.grid, width: 1 });
          const ptsV = [];
          const ptsI = [];
          const iNorm = m.i / (V / params.r); // 1 en resonancia
          for (let n = 0; n <= 160; n++) {
            const t = n / 160;
            ptsV.push([sx + t * sw, sy + sh / 2 - Math.sin(2 * Math.PI * CYCLES * t) * sh * 0.36]);
            ptsI.push([sx + t * sw, sy + sh / 2 - Math.sin(2 * Math.PI * CYCLES * t - m.phi) * iNorm * sh * 0.36]);
          }
          polyline(ctx, ptsV, { color: c.chargeNeg, width: 2.5 });
          polyline(ctx, ptsI, { color: c.chargePos, width: 2.5 });
          circle(ctx, sx + phase * sw, sy + sh / 2 - Math.sin(2 * Math.PI * CYCLES * phase - m.phi) * iNorm * sh * 0.36, 4.5, { fill: c.chargePos });
          text(ctx, 'tensión de la fuente (azul) y corriente (naranja)', sx, sy - 10, { size: 11.5, weight: 600 });
          text(ctx, `φ = ${num((m.phi * 180) / Math.PI, 3)}°  ·  I = ${si(m.i, 'A')}`, sx + sw / 2, sy + sh + 20, { align: 'center', size: 12, color: c.muted });

          this.drawChart(c, m);
        },

        drawChart(c, m) {
          const pts = [];
          for (let n = 0; n <= 160; n++) {
            const lk = -0.7 + (1.4 * n) / 160;
            pts.push([lk, calc({ ...params, k: 10 ** lk }).i * 1000]);
          }
          const yMax = (V / params.r) * 1150;
          const ticks = [-0.699, -0.301, 0, 0.301, 0.699].map((v) => ({ value: v, label: v === 0 ? 'f₀' : `${num(10 ** v, 2)}·f₀` }));
          chart.draw({
            xMin: -0.7,
            xMax: 0.7,
            yMax,
            xTicks: ticks,
            yTicks: [0, 0.5, 1].map((f) => ({ value: f * yMax, label: `${num(f * yMax, 3)} mA` })),
            series: [{ points: pts, color: c.accent }],
            hlines: [{ y: ((V / params.r) * 1000) / Math.SQRT2, label: '0,707 · I máx (ancho de banda)', color: c.heat }],
            cursor: { x: Math.log10(params.k), y: m.i * 1000, color: c.chargePos },
            xLabel: 'frecuencia (escala logarítmica)',
            yLabel: 'corriente de pico',
          });
        },

        formulas() {
          const m = calc(params);
          return [
            { name: 'Frecuencia de resonancia', sym: 'f<sub>0</sub> = 1 / (2π · √(L · C))', val: `f0 = 1 / (2π · √(${si(params.l, 'H')} · ${si(params.c, 'F')})) = ${si(m.f0, 'Hz')}` },
            { name: 'Reactancias a esta frecuencia', sym: 'X<sub>L</sub> = 2πfL · X<sub>C</sub> = 1/(2πfC)', val: `XL = ${si(m.xl, 'Ω')}  ·  XC = ${si(m.xc, 'Ω')}` },
            { name: 'Impedancia del conjunto', sym: '|Z| = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²)', val: `|Z| = ${si(m.z, 'Ω')}  ${Math.abs(m.xl - m.xc) < params.r * 0.2 ? '(≈ R: resonancia)' : ''}` },
            { name: 'Corriente', sym: 'I = V / |Z|', val: `I = ${si(V, 'V')} / ${si(m.z, 'Ω')} = ${si(m.i, 'A')}` },
            { name: 'Factor de calidad y ancho de banda', sym: 'Q = X<sub>L</sub>(f<sub>0</sub>) / R · B = f<sub>0</sub> / Q', val: `Q = ${num(m.q, 3)}  ·  B = ${si(m.bw, 'Hz')}` },
            { name: 'Tensión en la bobina y en el capacitor', sym: 'V<sub>L</sub> = I · X<sub>L</sub> · V<sub>C</sub> = I · X<sub>C</sub>', val: `VL = ${si(m.i * m.xl, 'V')}  ·  VC = ${si(m.i * m.xc, 'V')}  (la fuente es de 1 V)` },
          ];
        },
      };
    },
  });
})();
