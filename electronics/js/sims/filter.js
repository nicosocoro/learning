// Lección 21: filtro RC pasa-bajos / pasa-altos. Se elige la frecuencia de la señal y se ve cómo
// cambian la amplitud y la fase de la salida; la gráfica muestra la ganancia en dB para todas las
// frecuencias (escala logarítmica) con el punto de operación marcado.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { drawResistor, drawAcSource, drawGround, polyline, text, circle } = Elec;
  const { si, num } = Elec;

  const FREQS = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
  const CYCLES = 2;

  const fc = (r, c) => 1 / (2 * Math.PI * r * c);
  function response(type, f, r, c) {
    const x = f / fc(r, c);
    if (type === 'low') return { gain: 1 / Math.sqrt(1 + x * x), phase: -Math.atan(x) };
    return { gain: x / Math.sqrt(1 + x * x), phase: Math.atan(1 / x) };
  }
  const dB = (g) => 20 * Math.log10(Math.max(g, 1e-6));

  function drawCap(ctx, x, y, { orient = 'h', gap = 12, size = 22, color }) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (orient === 'h') {
      ctx.moveTo(x - gap / 2, y - size); ctx.lineTo(x - gap / 2, y + size);
      ctx.moveTo(x + gap / 2, y - size); ctx.lineTo(x + gap / 2, y + size);
    } else {
      ctx.moveTo(x - size, y - gap / 2); ctx.lineTo(x + size, y - gap / 2);
      ctx.moveTo(x - size, y + gap / 2); ctx.lineTo(x + size, y + gap / 2);
    }
    ctx.stroke();
    ctx.restore();
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Filtro RC: qué frecuencias pasan y cuáles se frenan',
    label: 'Circuito de un filtro RC con una fuente alterna, dos pantallas con la señal de entrada y de salida, y una gráfica de la ganancia en decibeles según la frecuencia',
    caption: 'La señal de entrada es siempre de 1 V de pico. Cambiá la frecuencia y mirá cómo cambia la salida. La escala de frecuencias de la gráfica es logarítmica.',
    chart: true,
    controls: [
      { type: 'choice', key: 'type', label: 'Tipo de filtro', value: 'low', options: [{ value: 'low', label: 'Pasa-bajos' }, { value: 'high', label: 'Pasa-altos' }] },
      { key: 'f', label: 'Frecuencia de la señal', values: FREQS, value: 1000, unit: 'Hz' },
      { key: 'r', label: 'Resistencia (R)', values: [100, 330, 1000, 3300, 10000], value: 1000, unit: 'Ω' },
      { key: 'c', label: 'Capacidad (C)', values: [1e-8, 4.7e-8, 1e-7, 4.7e-7, 1e-6], value: 1e-7, unit: 'F' },
    ],

    setup({ params, chart }) {
      let phase = 0;
      return {
        reset() { phase = 0; },
        step(dt) { phase = (phase + Math.max(0, dt) * 0.25) % 1; },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const rsp = response(params.type, params.f, params.r, params.c);
          const low = params.type === 'low';
          const x0 = w * 0.08;
          const x1 = w * 0.5;
          const y0 = h * 0.22;
          const y1 = h * 0.82;
          const ym = (y0 + y1) / 2;
          const xm = (x0 + x1) / 2;

          // circuito
          polyline(ctx, [[x0, ym - 16], [x0, y0], [x1, y0]], { color: c.wire, width: 3 });
          polyline(ctx, [[x0, ym + 16], [x0, y1], [x1, y1]], { color: c.wire, width: 3 });
          if (low) {
            polyline(ctx, [[x1 - 50, y0], [x1 - 50, ym - 22]], { color: c.wire, width: 3 });
            polyline(ctx, [[x1 - 50, ym + 22], [x1 - 50, y1]], { color: c.wire, width: 3 });
            polyline(ctx, [[x1 - 50, y0], [x1, y0]], { color: c.wire, width: 3 });
            drawResistor(ctx, x0 + (x1 - 50 - x0) / 2, y0, { len: Math.min(100, (x1 - x0) * 0.45), heat: 0 });
            drawCap(ctx, x1 - 50, ym, { orient: 'v', color: c.text });
            text(ctx, `R = ${si(params.r, 'Ω')}`, x0 + (x1 - 50 - x0) / 2, y0 - 28, { align: 'center', weight: 600, size: 12 });
            text(ctx, `C = ${si(params.c, 'F')}`, x1 - 72, ym, { align: 'right', weight: 600, size: 12 });
          } else {
            polyline(ctx, [[x0, y0], [xm - 14, y0]], { color: c.wire, width: 3 });
            drawCap(ctx, xm, y0, { orient: 'h', color: c.text });
            polyline(ctx, [[xm + 14, y0], [x1, y0]], { color: c.wire, width: 3 });
            polyline(ctx, [[x1 - 50, y0], [x1 - 50, ym - 30]], { color: c.wire, width: 3 });
            polyline(ctx, [[x1 - 50, ym + 30], [x1 - 50, y1]], { color: c.wire, width: 3 });
            drawResistor(ctx, x1 - 50, ym, { orient: 'v', len: 80, heat: 0 });
            text(ctx, `C = ${si(params.c, 'F')}`, xm, y0 - 30, { align: 'center', weight: 600, size: 12 });
            text(ctx, `R = ${si(params.r, 'Ω')}`, x1 - 72, ym, { align: 'right', weight: 600, size: 12 });
          }
          drawAcSource(ctx, x0, ym, 16);
          circle(ctx, x1, y0, 5, { fill: c.surface, stroke: c.wire, width: 2 });
          circle(ctx, x1, y1, 5, { fill: c.surface, stroke: c.wire, width: 2 });
          text(ctx, 'Vsal', x1 + 10, y0, { size: 12, color: c.muted });
          text(ctx, 'Ven', x0 - 20, ym, { size: 12, color: c.muted, align: 'right' });
          text(ctx, `fc = ${si(fc(params.r, params.c), 'Hz')}`, xm, h * 0.94, { align: 'center', weight: 700, color: c.accent, size: 13 });
          text(ctx, `f = ${si(params.f, 'Hz')}  →  ${params.f < fc(params.r, params.c) ? (low ? 'pasa' : 'se frena') : (low ? 'se frena' : 'pasa')}`, xm, h * 0.94 - 20, { align: 'center', size: 12, color: c.muted });

          // pantallas
          this.scope(ctx, c, w * 0.6, h * 0.1, w * 0.36, h * 0.36, 'Entrada (1 V de pico)', 1, 0, c.chargeNeg);
          this.scope(ctx, c, w * 0.6, h * 0.58, w * 0.36, h * 0.36, `Salida (${num(rsp.gain * 1000, 3)} mV de pico)`, rsp.gain, rsp.phase, c.accent);
          this.drawChart(c, rsp);
        },

        scope(ctx, c, x, y, w, h, title, amp, ph, color) {
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.strokeStyle = c.border;
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
          ctx.restore();
          polyline(ctx, [[x, y + h / 2], [x + w, y + h / 2]], { color: c.grid, width: 1 });
          polyline(ctx, [[x, y + h * 0.1], [x + w, y + h * 0.1]], { color: c.grid, width: 1, dash: [3, 4] });
          polyline(ctx, [[x, y + h * 0.9], [x + w, y + h * 0.9]], { color: c.grid, width: 1, dash: [3, 4] });
          const pts = [];
          for (let i = 0; i <= 160; i++) {
            const t = i / 160;
            pts.push([x + t * w, y + h / 2 - Math.sin(2 * Math.PI * CYCLES * t + ph) * amp * h * 0.4]);
          }
          polyline(ctx, pts, { color, width: 2.5 });
          const t = phase;
          circle(ctx, x + t * w, y + h / 2 - Math.sin(2 * Math.PI * CYCLES * t + ph) * amp * h * 0.4, 4.5, { fill: c.chargePos });
          text(ctx, title, x + 6, y - 9, { size: 12, weight: 600 });
        },

        drawChart(c, rsp) {
          const f0 = fc(params.r, params.c);
          const pts = [];
          for (let k = 0; k <= 120; k++) {
            const lf = 1 + (4 * k) / 120;
            pts.push([lf, Math.max(-40, dB(response(params.type, 10 ** lf, params.r, params.c).gain))]);
          }
          chart.draw({
            xMin: 1,
            xMax: 5,
            yMin: -40,
            yMax: 3,
            xTicks: [1, 2, 3, 4, 5].map((v) => ({ value: v, label: si(10 ** v, 'Hz') })),
            yTicks: [0, -10, -20, -30, -40].map((v) => ({ value: v, label: `${v} dB` })),
            series: [
              { points: [[Math.log10(f0), -40], [Math.log10(f0), 3]], color: c.muted, width: 1.5 },
              { points: pts, color: c.accent },
            ],
            hlines: [{ y: -3, label: '−3 dB (frecuencia de corte)', color: c.heat }],
            cursor: { x: Math.log10(params.f), y: Math.max(-40, dB(rsp.gain)), color: c.chargePos },
            xLabel: 'frecuencia (escala logarítmica)',
            yLabel: 'ganancia Vsal / Ven en decibeles',
          });
        },

        formulas() {
          const f0 = fc(params.r, params.c);
          const rsp = response(params.type, params.f, params.r, params.c);
          const xc = 1 / (2 * Math.PI * params.f * params.c);
          const z = Math.hypot(params.r, xc);
          return [
            { name: 'Frecuencia de corte', sym: 'f<sub>c</sub> = 1 / (2π · R · C)', val: `fc = 1 / (2π · ${si(params.r, 'Ω')} · ${si(params.c, 'F')}) = ${si(f0, 'Hz')}` },
            { name: 'Reactancia del capacitor a esta frecuencia', sym: 'X<sub>C</sub> = 1 / (2π · f · C)', val: `Xc = ${si(xc, 'Ω')}` },
            { name: 'Impedancia del conjunto R + C en serie', sym: '|Z| = √(R² + X<sub>C</sub>²)', val: `|Z| = √((${si(params.r, 'Ω')})² + (${si(xc, 'Ω')})²) = ${si(z, 'Ω')}` },
            { name: params.type === 'low' ? 'Ganancia (pasa-bajos)' : 'Ganancia (pasa-altos)', sym: params.type === 'low' ? '|V<sub>sal</sub>/V<sub>en</sub>| = 1 / √(1 + (f/f<sub>c</sub>)²)' : '|V<sub>sal</sub>/V<sub>en</sub>| = (f/f<sub>c</sub>) / √(1 + (f/f<sub>c</sub>)²)', val: `ganancia = ${num(rsp.gain, 3)}  =  ${num(dB(rsp.gain), 3)} dB` },
            { name: 'Fase de la salida', sym: 'φ = ∓ arctan(f / f<sub>c</sub>)', val: `φ = ${num((rsp.phase * 180) / Math.PI, 3)}°  (${rsp.phase < 0 ? 'se retrasa' : 'se adelanta'})` },
          ];
        },
      };
    },
  });
})();
