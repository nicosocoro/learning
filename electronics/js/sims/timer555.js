// Lección 27: temporizador 555 en modo astable. El capacitor se carga a través de R1 + R2 hasta 2/3 de
// V_CC y se descarga a través de R2 hasta 1/3: la salida alterna entre alto y bajo.
// La gráfica muestra tres períodos; el cursor los recorre en unos 9 s sin importar la frecuencia real.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { drawResistor, drawLed, drawGround, polyline, text, circle } = Elec;
  const { si, num } = Elec;

  const PERIODS = 3;
  const LN2 = Math.LN2;

  function timing({ r1, r2, c, vcc }) {
    const th = LN2 * (r1 + r2) * c;
    const tl = LN2 * r2 * c;
    return { th, tl, t: th + tl, f: 1 / (th + tl), duty: th / (th + tl), tau1: (r1 + r2) * c, tau2: r2 * c, vcc };
  }
  function vcAt(tm, t) {
    // empieza en 1/3 V_CC, justo al comenzar la carga
    const T = tm.t;
    const tt = t % T;
    const lo = tm.vcc / 3;
    const hi = (2 * tm.vcc) / 3;
    if (tt < tm.th) return { v: tm.vcc - (tm.vcc - lo) * Math.exp(-tt / tm.tau1), out: 1 };
    return { v: hi * Math.exp(-(tt - tm.th) / tm.tau2), out: 0 };
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Temporizador 555 en modo astable',
    label: 'Esquema del circuito integrado 555 con sus comparadores, el biestable y el transistor de descarga, los resistores y el capacitor externos y un LED, con una gráfica de la tensión del capacitor y de la salida',
    caption: 'Tres períodos de la oscilación; el cursor los recorre en unos 9 s sin importar la frecuencia real (que se indica abajo). La salida alta dura más que la baja porque el capacitor se carga a través de R1 + R2 y se descarga solo por R2.',
    chart: true,
    controls: [
      { key: 'r1', label: 'Resistor R<sub>1</sub>', values: [1000, 2200, 4700, 10000], value: 1000, unit: 'Ω' },
      { key: 'r2', label: 'Resistor R<sub>2</sub>', values: [10000, 22000, 47000, 100000], value: 47000, unit: 'Ω' },
      { key: 'c', label: 'Capacitor C', values: [1e-7, 1e-6, 4.7e-6, 1e-5, 4.7e-5, 1e-4], value: 1e-5, unit: 'F' },
      { type: 'choice', key: 'vcc', label: 'Alimentación (V<sub>CC</sub>)', value: 9, options: [{ value: 5, label: '5 V' }, { value: 9, label: '9 V' }, { value: 12, label: '12 V' }] },
    ],

    setup({ params, chart }) {
      let phase = 0;
      return {
        reset() { phase = 0; },
        step(dt) { phase = (phase + Math.max(0, dt) / 9) % 1; },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const tm = timing(params);
          const s = vcAt(tm, phase * PERIODS * tm.t);
          const vcc = params.vcc;
          const wire = (pts, on) => polyline(ctx, pts, { color: on ? c.chargePos : c.wire, width: on ? 3.5 : 3 });

          // circuito externo
          const xr = w * 0.12;
          const y0 = h * 0.1;
          const ya = h * 0.12 + 1.4 * ((h * 0.88 - h * 0.12) / 10);
          const yb = h * 0.12 + 5.6 * ((h * 0.88 - h * 0.12) / 10);
          const y1 = h * 0.9;
          wire([[xr - 20, y0], [w * 0.76, y0]]);
          text(ctx, `+${vcc} V`, xr - 24, y0, { align: 'right', weight: 600, color: c.accent, size: 12 });
          wire([[xr, y0], [xr, ya - 36]]);
          drawResistor(ctx, xr, (y0 + ya) / 2, { orient: 'v', len: Math.min(70, (ya - y0) * 0.8), heat: 0 });
          wire([[xr, ya - 36 + 0], [xr, ya]]);
          wire([[xr, ya], [xr, yb]]);
          drawResistor(ctx, xr, (ya + yb) / 2, { orient: 'v', len: Math.min(70, (yb - ya) * 0.8), heat: 0 });
          wire([[xr, yb], [xr, y1 - 56]], s.out === 0);
          // capacitor
          const capY = y1 - 40;
          polyline(ctx, [[xr - 18, capY - 5], [xr + 18, capY - 5]], { color: c.text, width: 3 });
          polyline(ctx, [[xr - 18, capY + 5], [xr + 18, capY + 5]], { color: c.text, width: 3 });
          wire([[xr, yb], [xr, capY - 5]]);
          wire([[xr, capY + 5], [xr, y1]]);
          drawGround(ctx, xr, y1);
          circle(ctx, xr, ya, 3.5, { fill: c.wire });
          circle(ctx, xr, yb, 3.5, { fill: c.wire });
          text(ctx, `R1 = ${si(params.r1, 'Ω')}`, xr + 22, (y0 + ya) / 2, { weight: 600, size: 12 });
          text(ctx, `R2 = ${si(params.r2, 'Ω')}`, xr + 22, (ya + yb) / 2, { weight: 600, size: 12 });
          text(ctx, `C = ${si(params.c, 'F')}`, xr + 28, capY, { weight: 600, size: 12 });
          text(ctx, `vC = ${num(s.v, 3)} V`, xr + 28, capY + 18, { color: c.chargePos, weight: 700, size: 12 });

          // caja del 555 (esquema simplificado)
          const bx0 = w * 0.36;
          const bx1 = w * 0.76;
          const by0 = h * 0.12;
          const by1 = h * 0.88;
          const u = (by1 - by0) / 10;
          const y7 = by0 + 1.4 * u;
          const y6 = by0 + 4.2 * u;
          const y2 = by0 + 7 * u;
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.roundRect(bx0, by0, bx1 - bx0, by1 - by0, 8); ctx.fill(); ctx.stroke();
          ctx.restore();
          text(ctx, '555', (bx0 + bx1) / 2, by0 + 16, { align: 'center', weight: 700, size: 16 });
          // pines externos: 7 (descarga) en el nodo R1-R2, y 6 + 2 unidos al capacitor
          const nodeY = (y6 + y2) / 2;
          wire([[xr, ya], [xr, y7], [bx0, y7]]);
          wire([[xr, ya], [xr, nodeY]]);
          wire([[xr + 30, y6], [xr + 30, y2]]);
          wire([[xr + 30, y6], [bx0, y6]]);
          wire([[xr + 30, y2], [bx0, y2]]);
          wire([[xr, nodeY], [xr + 30, nodeY]]);
          circle(ctx, xr, nodeY, 3.5, { fill: c.wire });
          circle(ctx, xr + 30, nodeY, 3.5, { fill: c.wire });
          text(ctx, '7', bx0 + 8, y7 - 10, { size: 11, color: c.muted });
          text(ctx, '6', bx0 + 8, y6 - 10, { size: 11, color: c.muted });
          text(ctx, '2', bx0 + 8, y2 - 10, { size: 11, color: c.muted });
          wire([[w * 0.55, y0], [w * 0.55, by0]]);
          text(ctx, '8 (+V)', w * 0.55 + 8, by0 - 5, { size: 11, color: c.muted });
          wire([[w * 0.55, by1], [w * 0.55, y1 + 6]]);
          drawGround(ctx, w * 0.55, y1 + 6);
          text(ctx, '1 (masa)', w * 0.55 + 8, by1 + 12, { size: 11, color: c.muted });
          // comparadores
          const cx = bx0 + 22;
          const cw = 118;
          const ch = 40;
          const cmp = (y, l1, l2, active) => {
            ctx.save();
            ctx.fillStyle = active ? c.heat : c.surface2 ?? c.surface;
            ctx.globalAlpha = active ? 0.55 : 1;
            ctx.strokeStyle = c.wire;
            ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.roundRect(cx, y - ch / 2, cw, ch, 6); ctx.fill(); ctx.stroke();
            ctx.restore();
            text(ctx, l1, cx + cw / 2, y - 7, { align: 'center', size: 11.5, weight: 700 });
            text(ctx, l2, cx + cw / 2, y + 9, { align: 'center', size: 10.5, color: c.muted });
          };
          cmp(y6, 'comparador A', 'pin 6 vs ⅔ V', s.out === 0);
          cmp(y2, 'comparador B', 'pin 2 vs ⅓ V', s.out === 1);
          // biestable
          const fx = cx + cw + 36;
          const fy = (y6 + y2) / 2;
          ctx.save();
          ctx.fillStyle = c.surface2 ?? c.surface;
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.roundRect(fx, fy - 44, 62, 88, 6); ctx.fill(); ctx.stroke();
          ctx.restore();
          text(ctx, 'flip-flop', fx + 31, fy - 6, { align: 'center', size: 11.5, weight: 700 });
          text(ctx, 'R   S', fx + 31, fy + 12, { align: 'center', size: 11, color: c.muted });
          polyline(ctx, [[cx + cw, y6], [fx - 14, y6], [fx - 14, fy - 20], [fx, fy - 20]], { color: c.muted, width: 2 });
          polyline(ctx, [[cx + cw, y2], [fx - 14, y2], [fx - 14, fy + 20], [fx, fy + 20]], { color: c.muted, width: 2 });
          // salida (pin 3) y LED
          wire([[fx + 62, fy], [bx1, fy], [w * 0.84, fy]], s.out === 1);
          text(ctx, '3', bx1 - 10, fy - 10, { size: 11, color: c.muted });
          drawLed(ctx, w * 0.87, fy, { orient: 'h', len: 56, glow: s.out });
          wire([[w * 0.87 + 28, fy], [w * 0.95, fy], [w * 0.95, y1]], s.out === 1);
          drawGround(ctx, w * 0.95, y1);
          text(ctx, s.out ? 'salida ALTA' : 'salida BAJA', w * 0.87, fy + 46, { align: 'center', weight: 700, color: s.out ? c.good : c.muted, size: 13 });
          // transistor de descarga (pin 7), encendido cuando la salida está baja
          const tx = bx0 + 70;
          circle(ctx, tx, y7, 12, { fill: s.out === 0 ? c.good : c.surface, stroke: c.wire, width: 2.5 });
          text(ctx, 'T', tx, y7 + 1, { align: 'center', size: 12, weight: 700, color: s.out === 0 ? '#fff' : c.muted });
          wire([[bx0, y7], [tx - 12, y7]], s.out === 0);
          polyline(ctx, [[tx + 12, y7], [tx + 40, y7]], { color: c.wire, width: 2 });
          drawGround(ctx, tx + 40, y7);
          polyline(ctx, [[fx + 31, fy - 44], [fx + 31, y7], [tx + 56, y7]], { color: c.muted, width: 1.5, dash: [4, 3] });
          text(ctx, s.out === 0 ? 'descarga: ON' : 'descarga: off', tx + 18, y7 - 22, { size: 11, color: s.out === 0 ? c.good : c.muted, weight: 600 });
          text(ctx, `T = ${si(tm.t, 's')}  ·  f = ${si(tm.f, 'Hz')}  ·  ciclo de trabajo = ${num(tm.duty * 100, 3)} %`, w * 0.5, h * 0.965, { align: 'center', weight: 700, size: 12.5, color: c.accent });

          this.drawChart(c, tm, s);
        },

        drawChart(c, tm, s) {
          const total = PERIODS * tm.t;
          const n = 400;
          const vc = [];
          const out = [];
          let prev = null;
          for (let k = 0; k <= n; k++) {
            const t = (total * k) / n;
            const { v, out: o } = vcAt(tm, t);
            vc.push([t, v]);
            if (prev !== null && prev !== o) out.push([t, prev * params.vcc]);
            out.push([t, o * params.vcc]);
            prev = o;
          }
          const cur = vcAt(tm, phase * total);
          chart.draw({
            xMax: total,
            yMax: params.vcc * 1.1,
            xTicks: [0, 1, 2, 3].map((k) => ({ value: (k * total) / 3, label: k === 0 ? '0' : si((k * total) / 3, 's') })),
            yTicks: [0, 1 / 3, 2 / 3, 1].map((f) => ({ value: f * params.vcc, label: f === 0 ? '0' : f === 1 / 3 ? '⅓ V' : f === 2 / 3 ? '⅔ V' : 'V' })),
            series: [{ points: out, color: c.muted, width: 2 }, { points: vc, color: c.accent, width: 2.5 }],
            hlines: [{ y: (2 * params.vcc) / 3, label: 'umbral superior (2/3 V)', color: c.heat }, { y: params.vcc / 3, label: 'umbral inferior (1/3 V)', color: c.heat }],
            legend: [{ label: 'tensión del capacitor', color: c.accent }, { label: 'salida (pin 3)', color: c.muted }],
            cursor: { x: phase * total, y: cur.v, color: c.chargePos },
            xLabel: 'tiempo',
          });
        },

        formulas() {
          const tm = timing(params);
          return [
            { name: 'Tiempo en alto (carga por R1 + R2)', sym: 't<sub>alto</sub> = 0,693 · (R<sub>1</sub> + R<sub>2</sub>) · C', val: `t_alto = 0,693 · (${si(params.r1, 'Ω')} + ${si(params.r2, 'Ω')}) · ${si(params.c, 'F')} = ${si(tm.th, 's')}` },
            { name: 'Tiempo en bajo (descarga por R2)', sym: 't<sub>bajo</sub> = 0,693 · R<sub>2</sub> · C', val: `t_bajo = 0,693 · ${si(params.r2, 'Ω')} · ${si(params.c, 'F')} = ${si(tm.tl, 's')}` },
            { name: 'Frecuencia', sym: 'f = 1,44 / ((R<sub>1</sub> + 2 · R<sub>2</sub>) · C)', val: `f = 1,44 / ((${si(params.r1, 'Ω')} + 2 · ${si(params.r2, 'Ω')}) · ${si(params.c, 'F')}) = ${si(tm.f, 'Hz')}` },
            { name: 'Ciclo de trabajo', sym: 'D = (R<sub>1</sub> + R<sub>2</sub>) / (R<sub>1</sub> + 2 · R<sub>2</sub>)', val: `D = ${num(tm.duty * 100, 3)} %  (siempre mayor que 50 %)` },
            { name: 'Umbrales internos', sym: '⅓ V<sub>CC</sub> y ⅔ V<sub>CC</sub>', val: `${num(params.vcc / 3, 3)} V y ${num((2 * params.vcc) / 3, 3)} V  (no dependen de V_CC en la frecuencia)` },
          ];
        },
      };
    },
  });
})();
