// Lección 16: amplificador de emisor común. Una señal pequeña en la base aparece grande e
// invertida en el colector, siempre que el transistor siga en la zona activa (si no, se recorta).

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { drawResistor, drawBjt, drawAcSource, drawGround, polyline, text, circle } = Elec;
  const { si, num } = Elec;

  const VCC = 12;
  const VT = 0.025; //      tensión térmica: 25 mV a temperatura ambiente
  const VE = 1; //          tensión continua en el emisor (la fija el divisor de polarización)
  const V_MIN = VE + 0.2; // por debajo de esto el transistor se satura
  const CYCLES = 2;
  const IN_SCALE = 0.3; //  la pantalla de entrada muestra ±300 mV

  function model({ ic, rc, re, vin }) {
    const reDyn = VT / ic; //                  resistencia dinámica del emisor
    const gain = -rc / (reDyn + re);
    const vq = VCC - ic * rc; //               tensión de reposo en el colector
    const swingNeed = Math.abs(gain) * vin; // amplitud pedida a la salida
    const clipTop = vq + swingNeed > VCC;
    const clipBottom = vq - swingNeed < V_MIN;
    return { reDyn, gain, vq, swingNeed, clipTop, clipBottom, clipped: clipTop || clipBottom };
  }

  const vout = (m, v) => Math.min(VCC, Math.max(V_MIN, m.vq + m.gain * v));

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Amplificador de emisor común',
    label: 'Circuito amplificador con un transistor NPN y, a la derecha, dos pantallas con la señal de entrada y la señal de salida amplificada e invertida',
    caption: 'La señal de salida está invertida (180°) y mucho más grande. Si no cabe entre los límites de la fuente y la saturación, se recorta.',
    controls: [
      { key: 'vin', label: 'Amplitud de la señal de entrada', min: 5, max: 300, step: 5, value: 20, scale: 1e-3, unit: 'V' },
      { key: 'ic', label: 'Corriente de reposo (I<sub>C</sub>)', min: 0.5, max: 4, step: 0.1, value: 2, scale: 1e-3, unit: 'A' },
      { key: 'rc', label: 'Resistencia de colector (R<sub>C</sub>)', min: 1000, max: 4700, step: 100, value: 2200, unit: 'Ω' },
      {
        type: 'choice', key: 're', label: 'Resistor de emisor sin desacoplar (R<sub>E</sub>)', value: 0,
        options: [{ value: 0, label: 'Ninguno' }, { value: 100, label: '100 Ω' }, { value: 470, label: '470 Ω' }],
      },
    ],

    setup({ params }) {
      let phase = 0; // 0..1 dentro del tramo mostrado

      return {
        reset() {
          phase = 0;
        },

        step(dt) {
          phase = (phase + dt * 0.12) % 1;
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const m = model(params);
          const x0 = w * 0.09;
          const xt = w * 0.34;
          const xo = w * 0.5;
          const y0 = h * 0.13;
          const y1 = h * 0.87;
          const ym = h * 0.5;
          const r = Math.min(32, h * 0.085);
          const dx = 0.42 * r;
          const hh = Math.sqrt(r * r - dx * dx);
          const n = { b: [xt - r, ym], c: [xt + dx, ym - hh], e: [xt + dx, ym + hh] };
          const xc = n.c[0];

          // cables
          polyline(ctx, [[x0, ym - 15], [x0, ym], n.b], { color: c.wire, width: 3 });
          polyline(ctx, [[xc, y0], [xc, n.c[1]]], { color: c.wire, width: 3 });
          polyline(ctx, [[x0, ym + 15], [x0, y1], [xc, y1], [xc, n.e[1]]], { color: c.wire, width: 3 });
          polyline(ctx, [[xc - 40, y0], [xc + 40, y0]], { color: c.wire, width: 3 });
          polyline(ctx, [[xc, (y0 + n.c[1]) / 2], [xo, (y0 + n.c[1]) / 2]], { color: c.wire, width: 3 });

          drawResistor(ctx, xc, (y0 + n.c[1]) / 2 - 18, { orient: 'v', len: Math.min(90, (n.c[1] - y0) * 0.55), heat: 0 });
          drawAcSource(ctx, x0, ym, 16);
          drawBjt(ctx, xt, ym, { r, on: 0.5 });
          drawGround(ctx, xc, y1);
          if (params.re > 0) {
            polyline(ctx, [[xc, n.e[1]], [xc, y1 - 80]], { color: c.wire, width: 3 });
            drawResistor(ctx, xc, (n.e[1] + y1) / 2 + 2, { orient: 'v', len: Math.min(80, (y1 - n.e[1]) * 0.6), heat: 0 });
            text(ctx, `RE = ${si(params.re, 'Ω')}`, xc + 28, (n.e[1] + y1) / 2, { size: 12, weight: 600 });
          } else {
            polyline(ctx, [[xc, n.e[1]], [xc, y1]], { color: c.wire, width: 3 });
          }
          circle(ctx, xo, (y0 + n.c[1]) / 2, 5, { fill: c.surface, stroke: c.wire, width: 2 });
          text(ctx, 'Vout', xo + 10, (y0 + n.c[1]) / 2 - 12, { size: 12, color: c.muted });
          text(ctx, `+${VCC} V`, xc + 46, y0 - 2, { weight: 600, color: c.accent, size: 12 });
          text(ctx, `RC = ${si(params.rc, 'Ω')}`, xc - 28, (y0 + n.c[1]) / 2 - 18, { align: 'right', size: 12, weight: 600 });
          text(ctx, 'Vin', x0 - 26, ym, { align: 'right', size: 12, color: c.muted });
          text(ctx, `Av = ${num(m.gain, 3)}`, (x0 + xo) / 2 - 10, h * 0.95, { align: 'center', weight: 700, color: m.clipped ? c.bad : c.good, size: 14 });

          this.scope(ctx, c, w * 0.6, h * 0.07, w * 0.37, h * 0.38, w < 560 ? 'Entrada' : 'Entrada (±300 mV)', (t) => params.vin * Math.sin(2 * Math.PI * CYCLES * t), -IN_SCALE, IN_SCALE, [{ y: 0, label: '0 V' }], m);
          this.scope(ctx, c, w * 0.6, h * 0.55, w * 0.37, h * 0.38, w < 560 ? 'Salida' : 'Salida (colector)', (t) => vout(m, params.vin * Math.sin(2 * Math.PI * CYCLES * t)), 0, VCC, [
            { y: m.vq, label: `reposo ${num(m.vq, 3)} V`, color: c.muted },
            { y: V_MIN, label: 'saturación', color: c.bad },
            { y: VCC, label: 'fuente 12 V', color: c.bad },
          ], m);
        },

        scope(ctx, c, x, y, w, h, title, fn, lo, hi, marks, m) {
          const px = (t) => x + t * w;
          const py = (v) => y + h - ((v - lo) / (hi - lo)) * h;
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.strokeStyle = c.border;
          ctx.lineWidth = 1;
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
          ctx.restore();
          for (let k = 1; k < 4; k++) {
            polyline(ctx, [[x, y + (h * k) / 4], [x + w, y + (h * k) / 4]], { color: c.grid, width: 1 });
            polyline(ctx, [[x + (w * k) / 4, y], [x + (w * k) / 4, y + h]], { color: c.grid, width: 1 });
          }
          for (const mk of marks) {
            polyline(ctx, [[x, py(mk.y)], [x + w, py(mk.y)]], { color: mk.color ?? c.muted, width: 1, dash: [4, 4] });
            text(ctx, mk.label, x + w - 4, py(mk.y) - 7, { align: 'right', size: 10.5, color: mk.color ?? c.muted });
          }
          const pts = [];
          for (let i = 0; i <= 160; i++) pts.push([px(i / 160), py(fn(i / 160))]);
          polyline(ctx, pts, { color: m.clipped && title.startsWith('Salida') ? c.bad : c.accent, width: 2.5 });
          circle(ctx, px(phase), py(fn(phase)), 4.5, { fill: c.chargePos });
          text(ctx, title, x + 6, y - 9, { size: 12, weight: 600 });
        },

        formulas() {
          const m = model(params);
          const ie = params.ic;
          return [
            { name: 'Resistencia dinámica del emisor', sym: 'r<sub>e</sub> = 25 mV / I<sub>C</sub>', val: `re = 25 mV / ${si(ie, 'A')} = ${si(m.reDyn, 'Ω')}` },
            { name: 'Ganancia de tensión', sym: 'A<sub>v</sub> = −R<sub>C</sub> / (r<sub>e</sub> + R<sub>E</sub>)', val: `Av = −${si(params.rc, 'Ω')} / (${si(m.reDyn, 'Ω')} + ${si(params.re, 'Ω')}) = ${num(m.gain)}` },
            { name: 'Tensión de reposo en el colector', sym: 'V<sub>C</sub> = V<sub>CC</sub> − I<sub>C</sub> · R<sub>C</sub>', val: `Vc = 12 V − ${si(ie, 'A')} · ${si(params.rc, 'Ω')} = ${si(m.vq, 'V')}` },
            { name: 'Amplitud de salida pedida', sym: '|A<sub>v</sub>| · V<sub>in</sub>', val: `${num(Math.abs(m.gain))} · ${si(params.vin, 'V')} = ${si(m.swingNeed, 'V')}` },
            {
              name: 'Margen disponible en la salida',
              sym: 'entre 1,2 V y V<sub>CC</sub>',
              val: m.clipped ? `¡recorte! (${m.clipTop ? 'arriba' : ''}${m.clipTop && m.clipBottom ? ' y ' : ''}${m.clipBottom ? 'abajo' : ''}): la salida no cabe` : `sube hasta ${si(m.vq + m.swingNeed, 'V')} y baja hasta ${si(m.vq - m.swingNeed, 'V')}: cabe`,
            },
          ];
        },
      };
    },
  });
})();
