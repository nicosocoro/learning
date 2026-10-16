// Lección 26: conversión analógico-digital. Una senoide de 0 a 5 V se muestrea y se cuantiza con n
// bits. Se ve la señal original, las muestras, la reconstrucción en escalones y, si se muestrea
// con menos de 2 puntos por ciclo, el alias (una frecuencia falsa más baja).

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { polyline, text, circle } = Elec;
  const { si, num } = Elec;

  const VREF = 5;
  const CYCLES = 3;
  const mid = VREF / 2;

  const signal = (t) => mid + 0.98 * mid * Math.sin(2 * Math.PI * t);

  function convert({ bits, ratio }) {
    const levels = 2 ** bits;
    const lsb = VREF / levels;
    const count = Math.floor(CYCLES * ratio) + 1;
    const samples = [];
    for (let k = 0; k < count; k++) {
      const t = k / ratio;
      const v = signal(t);
      const code = Math.min(levels - 1, Math.floor(v / lsb));
      samples.push({ t, v, code, q: code * lsb + lsb / 2 });
    }
    return { levels, lsb, samples };
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Conversión analógico-digital: muestreo y cuantización',
    label: 'Gráfica de una señal senoidal de 0 a 5 voltios con sus muestras y su reconstrucción en escalones, y debajo una gráfica de la resolución del conversor en función del número de bits',
    caption: 'La línea azul es la señal real; los puntos son las muestras; los escalones naranja, lo que «ve» el conversor (se dibuja el centro de cada escalón). Con menos de 2 muestras por ciclo aparece un alias.',
    chart: true,
    controls: [
      { key: 'bits', label: 'Resolución del conversor', min: 1, max: 12, step: 1, value: 3, format: (v) => `${v} bits (${2 ** v} niveles)` },
      { key: 'ratio', label: 'Muestras por ciclo de la señal', values: [1.2, 1.5, 2, 3, 4, 8, 16, 32], value: 8, format: (v) => String(v).replace('.', ',') },
    ],

    setup({ params, chart }) {
      let t = 0;
      return {
        reset() { t = 0; },
        step(dt) { t = (t + Math.max(0, dt) * 0.5) % 1; },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const d = convert(params);
          const x0 = w * 0.1;
          const x1 = w * 0.96;
          const y0 = h * 0.08;
          const y1 = h * 0.84;
          const px = (cyc) => x0 + (cyc / CYCLES) * (x1 - x0);
          const py = (v) => y1 - (v / VREF) * (y1 - y0);

          // cuadrícula: un renglón por nivel si son pocos
          if (params.bits <= 5) {
            for (let k = 0; k <= d.levels; k++) polyline(ctx, [[x0, py(k * d.lsb)], [x1, py(k * d.lsb)]], { color: c.grid, width: 1 });
            for (let k = 0; k < d.levels; k++) text(ctx, k.toString(2).padStart(params.bits, '0'), x0 - 8, py(k * d.lsb + d.lsb / 2), { align: 'right', size: 10.5, color: c.muted });
          } else {
            for (const v of [0, 1.25, 2.5, 3.75, 5]) polyline(ctx, [[x0, py(v)], [x1, py(v)]], { color: c.grid, width: 1 });
          }
          for (const v of [0, 2.5, 5]) text(ctx, `${num(v)} V`, x0 - (params.bits <= 5 ? 44 : 8), py(v), { align: 'right', size: 11, color: c.muted, weight: 600 });
          polyline(ctx, [[x0, y0 - 6], [x0, y1], [x1, y1]], { color: c.wire, width: 1.5 });
          for (let k = 0; k <= CYCLES; k++) text(ctx, k === 0 ? '0' : `${k} ciclo${k > 1 ? 's' : ''}`, px(k), y1 + 16, { align: 'center', size: 11, color: c.muted });

          // señal real
          const real = [];
          for (let k = 0; k <= 300; k++) real.push([px((CYCLES * k) / 300), py(signal((CYCLES * k) / 300))]);
          polyline(ctx, real, { color: c.chargeNeg, width: 2.5 });

          // reconstrucción en escalones
          const stair = [];
          d.samples.forEach((s, i) => {
            const next = d.samples[i + 1]?.t ?? CYCLES;
            stair.push([px(s.t), py(s.q)], [px(Math.min(next, CYCLES)), py(s.q)]);
          });
          polyline(ctx, stair, { color: c.accent, width: 2.5 });
          const active = Math.floor(t * d.samples.length);
          d.samples.forEach((s, i) => {
            circle(ctx, px(s.t), py(s.v), i === active ? 5.5 : 3.5, { fill: i === active ? c.chargePos : c.chargeNeg });
          });
          const s = d.samples[active];
          if (s) {
            polyline(ctx, [[px(s.t), py(s.v)], [px(s.t), py(s.q)]], { color: c.chargePos, width: 1.5, dash: [3, 3] });
            text(ctx, `muestra ${active}: ${num(s.v, 3)} V → código ${s.code} = ${s.code.toString(2).padStart(params.bits, '0')}`, w * 0.5, h * 0.95, { align: 'center', weight: 700, size: 13 });
          }
          if (params.ratio < 2) text(ctx, '¡ALIAS! la señal reconstruida parece más lenta que la real', w * 0.5, h * 0.03, { align: 'center', weight: 700, size: 13, color: c.bad });
          this.drawChart(c);
        },

        drawChart(c) {
          const pts = [];
          for (let b = 1; b <= 12; b += 0.25) pts.push([b, Math.log10((VREF / 2 ** b) * 1000)]);
          const ticks = [1, 10, 100, 1000].map((mv) => ({ value: Math.log10(mv), label: si(mv / 1000, 'V') }));
          chart.draw({
            xMin: 1,
            xMax: 12,
            yMin: 0,
            yMax: 3.5,
            xTicks: [1, 2, 4, 6, 8, 10, 12].map((v) => ({ value: v, label: `${v} bits` })),
            yTicks: ticks,
            series: [{ points: pts, color: c.accent }],
            hlines: [{ y: Math.log10((VREF / 1024) * 1000), label: '10 bits (Arduino): 4,9 mV', color: c.heat }],
            cursor: { x: params.bits, y: Math.log10((VREF / 2 ** params.bits) * 1000), color: c.chargePos },
            xLabel: 'resolución del conversor',
            yLabel: 'tamaño del escalón (LSB), escala logarítmica',
          });
        },

        formulas() {
          const d = convert(params);
          const f = 1 / params.ratio; // en unidades de fs
          const alias = Math.abs(f - Math.round(f)) ;
          const rows = [
            { name: 'Niveles del conversor', sym: 'N = 2<sup>n</sup>', val: `N = 2^${params.bits} = ${d.levels} niveles` },
            { name: 'Tamaño de un escalón', sym: 'LSB = V<sub>ref</sub> / 2<sup>n</sup>', val: `LSB = 5 V / ${d.levels} = ${si(d.lsb, 'V')}` },
            { name: 'Error máximo de cuantización', sym: '± LSB / 2', val: `± ${si(d.lsb / 2, 'V')}` },
            { name: 'Condición de Nyquist', sym: 'f<sub>muestreo</sub> &gt; 2 · f<sub>señal</sub>', val: params.ratio >= 2 ? `${num(params.ratio)} muestras por ciclo ≥ 2: se puede reconstruir` : `${num(params.ratio)} muestras por ciclo < 2: ¡aparece un alias!` },
          ];
          if (params.ratio < 2) rows.push({ name: 'Frecuencia aparente (alias)', sym: '|f − fs| (aprox.)', val: `la señal parece de ${num(alias * params.ratio, 3)} · f en lugar de 1 · f` });
          return rows;
        },
      };
    },
  });
})();
