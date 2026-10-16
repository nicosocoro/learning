// Lección 29: capacitor de desacople. Un circuito digital toma pulsos rápidos de corriente de la fuente
// a través de un cable con inductancia. Sin capacitor cerca del chip, la tensión de alimentación
// oscila; con uno, el capacitor entrega esos picos y la tensión queda estable.
// El modelo se integra numéricamente (paso de 50 ps) sobre una ventana de 200 ns.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { drawBattery, drawCoil, drawGround, polyline, text, circle } = Elec;
  const { si, num } = Elec;

  const VCC = 5;
  const R_WIRE = 0.1; //     resistencia del cable (Ω)
  const C_PAR = 100e-12; //  capacidad parásita del nodo (100 pF)
  const T_WIN = 200e-9; //   ventana de tiempo
  const STEPS = 4000;
  const EDGE = 5e-9; //      tiempo de subida y bajada de la corriente
  const PULSES = [[20e-9, 50e-9], [90e-9, 120e-9], [150e-9, 180e-9]]; // [inicio, fin] de cada pulso
  const CAPS = { none: { name: 'Sin capacitor', c: 0 }, c100n: { name: '100 nF', c: 100e-9 }, c1u: { name: '1 µF', c: 1e-6 } };

  function iLoad(t, ipk) {
    let i = 0;
    for (const [a, b] of PULSES) {
      if (t >= a && t < a + EDGE) i = Math.max(i, ((t - a) / EDGE) * ipk);
      else if (t >= a + EDGE && t < b) i = Math.max(i, ipk);
      else if (t >= b && t < b + EDGE) i = Math.max(i, (1 - (t - b) / EDGE) * ipk);
    }
    return i;
  }

  function simulate({ cap, lwire, ipk }) {
    const l = lwire;
    const c = C_PAR + CAPS[cap].c;
    const dt = T_WIN / STEPS;
    let iL = 0;
    let vC = VCC;
    const out = [];
    let vmin = VCC;
    let vmax = VCC;
    for (let k = 0; k <= STEPS; k++) {
      const t = k * dt;
      iL += ((VCC - iL * R_WIRE - vC) / l) * dt;
      vC += ((iL - iLoad(t, ipk)) / c) * dt;
      if (k % 5 === 0) out.push([t, vC, iLoad(t, ipk)]);
      vmin = Math.min(vmin, vC);
      vmax = Math.max(vmax, vC);
    }
    return { out, vmin, vmax, c };
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Capacitor de desacople: la alimentación de un chip digital',
    label: 'Circuito con una fuente de 5 voltios, un cable con inductancia, un capacitor de desacople opcional y un chip que toma pulsos de corriente, y una gráfica de la tensión de alimentación del chip en 200 nanosegundos',
    caption: 'El cursor recorre los 200 ns de la ventana en unos 8 s. El chip tolera ±5 % (4,75 a 5,25 V): fuera de esa banda se reinicia o hace lecturas erróneas.',
    chart: true,
    controls: [
      { type: 'choice', key: 'cap', label: 'Capacitor de desacople junto al chip', value: 'none', options: Object.entries(CAPS).map(([value, v]) => ({ value, label: v.name })) },
      { key: 'lwire', label: 'Inductancia del cable de alimentación', values: [1e-8, 5e-8, 2e-7, 1e-6], value: 5e-8, unit: 'H' },
      { key: 'ipk', label: 'Pico de corriente del chip', min: 0.01, max: 0.2, step: 0.01, value: 0.1, unit: 'A' },
    ],

    setup({ params, chart }) {
      let phase = 0;
      let cache = { key: '', d: null };
      const data = () => {
        const key = `${params.cap}|${params.lwire}|${params.ipk}`;
        if (cache.key !== key) cache = { key, d: simulate(params) };
        return cache.d;
      };
      return {
        reset() { phase = 0; },
        step(dt) { phase = (phase + Math.max(0, dt) / 8) % 1; },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const d = data();
          const idx = Math.min(d.out.length - 1, Math.floor(phase * (d.out.length - 1)));
          const [tNow, vNow, iNow] = d.out[idx];
          const bad = vNow < 4.75 || vNow > 5.25;
          const x0 = w * 0.1;
          const x1 = w * 0.3;
          const x2 = w * 0.6;
          const y0 = h * 0.14;
          const y1 = h * 0.84;
          const lenCoil = Math.min(100, (y1 - y0) * 0.3);
          const yb = y0 + lenCoil + 36;

          polyline(ctx, [[x0, y0], [x1, y0], [x1, y0 + 30]], { color: c.wire, width: 3 });
          drawCoil(ctx, x1, y0 + 30 + lenCoil / 2, { len: lenCoil, turns: 5 });
          polyline(ctx, [[x1, y0 + 30 + lenCoil], [x1, yb], [x2, yb]], { color: c.wire, width: 3 });
          polyline(ctx, [[x0, h * 0.5 + 30], [x0, y1], [x2, y1]], { color: c.wire, width: 3 });
          polyline(ctx, [[x0, y0], [x0, h * 0.5 - 30]], { color: c.wire, width: 3 });
          drawBattery(ctx, x0, h * 0.5, { orient: 'v' });
          text(ctx, '5 V', x0 - 32, h * 0.5, { align: 'right', weight: 600, color: c.accent });
          text(ctx, `cable: L = ${si(params.lwire, 'H')}`, x1 + 28, y0 + 30 + lenCoil / 2, { weight: 600, size: 12 });
          text(ctx, 'unos 10 nH por cada cm', x1 + 28, y0 + 30 + lenCoil / 2 + 16, { size: 11, color: c.muted });
          circle(ctx, x1, yb, 3.5, { fill: c.wire });

          // capacitor de desacople
          if (params.cap !== 'none') {
            const cy = (yb + y1) / 2;
            polyline(ctx, [[x1, yb], [x1, cy - 6]], { color: c.wire, width: 3 });
            polyline(ctx, [[x1 - 20, cy - 5], [x1 + 20, cy - 5]], { color: c.text, width: 3 });
            polyline(ctx, [[x1 - 20, cy + 5], [x1 + 20, cy + 5]], { color: c.text, width: 3 });
            polyline(ctx, [[x1, cy + 5], [x1, y1]], { color: c.wire, width: 3 });
            circle(ctx, x1, y1, 3.5, { fill: c.wire });
            text(ctx, `C = ${si(CAPS[params.cap].c, 'F')}`, x1 + 28, cy, { weight: 600, size: 12 });
          }

          // chip
          const cw = Math.min(110, w * 0.2);
          polyline(ctx, [[x2, yb], [x2 + 10, yb]], { color: c.wire, width: 3 });
          ctx.save();
          ctx.fillStyle = bad ? c.heat : c.surface;
          ctx.globalAlpha = bad ? 0.5 : 1;
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.roundRect(x2 + 10, yb - 20, cw, y1 - yb + 40, 8); ctx.fill(); ctx.stroke();
          ctx.restore();
          polyline(ctx, [[x2, y1], [x2 + 10, y1]], { color: c.wire, width: 3 });
          text(ctx, 'chip digital', x2 + 10 + cw / 2, (yb + y1) / 2 - 12, { align: 'center', weight: 700 });
          text(ctx, `i = ${si(iNow, 'A')}`, x2 + 10 + cw / 2, (yb + y1) / 2 + 8, { align: 'center', color: c.chargePos, weight: 700, size: 13 });
          text(ctx, `Vdd = ${num(vNow, 3)} V`, x2 + 10 + cw / 2, (yb + y1) / 2 + 28, { align: 'center', color: bad ? c.bad : c.good, weight: 700, size: 13 });
          drawGround(ctx, x2 + 10 + cw / 2, y1 + 20);
          text(ctx, bad ? '¡la alimentación sale de la banda de ±5 %!' : 'alimentación estable', w * 0.5, h * 0.95, { align: 'center', weight: 700, size: 13, color: bad ? c.bad : c.good });

          // corriente del chip (mini gráfica a la derecha)
          const sx = w * 0.76;
          const sw = w * 0.2;
          const sy = h * 0.2;
          const sh = h * 0.5;
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.strokeStyle = c.border;
          ctx.fillRect(sx, sy, sw, sh);
          ctx.strokeRect(sx, sy, sw, sh);
          ctx.restore();
          const pts = d.out.map(([t, , i]) => [sx + (t / T_WIN) * sw, sy + sh - (i / (params.ipk * 1.2)) * sh]);
          polyline(ctx, pts, { color: c.chargePos, width: 2.5 });
          circle(ctx, sx + (tNow / T_WIN) * sw, sy + sh - (iNow / (params.ipk * 1.2)) * sh, 4.5, { fill: c.accent });
          text(ctx, 'corriente del chip', sx + sw / 2, sy - 10, { align: 'center', size: 11.5, weight: 600 });
          text(ctx, `${num(params.ipk * 1000)} mA`, sx + 4, sy + 12, { size: 10.5, color: c.muted });

          this.drawChart(c, d, vNow, tNow);
        },

        drawChart(c, d, vNow, tNow) {
          const lo = Math.min(d.vmin - 0.15, 4.6);
          const hi = Math.max(d.vmax + 0.15, 5.4);
          chart.draw({
            xMax: T_WIN * 1e9,
            yMin: lo,
            yMax: hi,
            xTicks: [0, 50, 100, 150, 200].map((v) => ({ value: v, label: `${v} ns` })),
            yTicks: [lo, 4.75, 5, 5.25, hi].filter((v, i, a) => i === 0 || Math.abs(v - a[i - 1]) > 0.12).map((v) => ({ value: v, label: `${num(v, 3)} V` })),
            series: [{ points: d.out.map(([t, v]) => [t * 1e9, v]), color: c.accent }],
            hlines: [{ y: 5.25, label: '+5 %', color: c.heat }, { y: 4.75, label: '−5 %', color: c.heat }],
            cursor: { x: tNow * 1e9, y: vNow, color: c.chargePos },
            xLabel: 'tiempo',
            yLabel: 'tensión de alimentación del chip (Vdd)',
          });
        },

        formulas() {
          const d = data();
          const z0 = Math.sqrt(params.lwire / d.c);
          const f0 = 1 / (2 * Math.PI * Math.sqrt(params.lwire * d.c));
          const spike = (params.lwire * params.ipk) / EDGE;
          const droop = (params.ipk * 30e-9) / d.c;
          return [
            { name: 'Cambio de corriente por unidad de tiempo', sym: 'Δi / Δt', val: `Δi/Δt = ${si(params.ipk, 'A')} / 5 ns = ${si(params.ipk / EDGE, 'A/s')}` },
            { name: 'Tensión inducida en el cable', sym: 'V<sub>L</sub> = L · Δi / Δt', val: `VL = ${si(params.lwire, 'H')} · ${si(params.ipk / EDGE, 'A/s')} = ${si(spike, 'V')}` },
            { name: 'Capacidad en el nodo', sym: 'C = C<sub>parásita</sub> + C<sub>desacople</sub>', val: `C = 100 pF + ${si(CAPS[params.cap].c, 'F')} = ${si(d.c, 'F')}` },
            { name: 'Caída por el pulso (si hay capacitor)', sym: 'ΔV ≈ I · Δt / C', val: params.cap === 'none' ? 'sin capacitor: la fórmula no aplica, el cable y los 100 pF parásitos oscilan' : `ΔV ≈ ${si(params.ipk, 'A')} · 30 ns / ${si(d.c, 'F')} = ${si(droop, 'V')}` },
            { name: 'Oscilación entre el cable y el capacitor', sym: 'f = 1 / (2π · √(L · C))', val: `f = ${si(f0, 'Hz')}  ·  Z = √(L/C) = ${si(z0, 'Ω')}` },
            { name: 'Variación pico a pico medida', sym: 'V<sub>máx</sub> − V<sub>mín</sub>', val: `${si(d.vmax, 'V')} − ${si(d.vmin, 'V')} = ${si(d.vmax - d.vmin, 'V')}` },
          ];
        },
      };
    },
  });
})();
