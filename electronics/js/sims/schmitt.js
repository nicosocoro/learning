// Lección 24: comparador con y sin histéresis (disparador de Schmitt no inversor). Una señal lenta
// con ruido cruza el umbral: sin histéresis la salida «tartamudea»; con histéresis conmuta una sola
// vez por cruce, siempre que el ruido sea menor que el ancho de la banda.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { drawOpAmp, drawResistor, drawAcSource, drawGround, polyline, text, circle } = Elec;
  const { si, num } = Elec;

  const SAT = 10.5;
  const WINDOW = 8; //      segundos que muestra la gráfica
  const PERIOD = 6; //      período de la señal lenta (s)
  const AMP = 3; //         amplitud de la señal lenta (V)

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Comparador y disparador de Schmitt',
    label: 'Circuito con un amplificador operacional como comparador con realimentación positiva, un LED que indica el estado de la salida, y una gráfica de la señal de entrada con ruido y de la salida',
    caption: 'La señal de entrada es una senoide lenta de 3 V con ruido. Las líneas punteadas son los umbrales de conmutación. Cuenta cuántas veces conmuta la salida en la ventana.',
    chart: true,
    controls: [
      { type: 'choice', key: 'hist', label: 'Realimentación positiva (histéresis)', value: 'off', options: [{ value: 'off', label: 'Sin histéresis' }, { value: 'on', label: 'Con histéresis' }] },
      { key: 'noise', label: 'Ruido sobre la señal', min: 0, max: 2, step: 0.1, value: 0.6, unit: 'V' },
      { key: 'r1', label: 'Resistor de entrada (R<sub>1</sub>)', values: [1000, 2200, 4700, 10000], value: 4700, unit: 'Ω' },
      { key: 'r2', label: 'Resistor de realimentación (R<sub>2</sub>)', values: [10000, 22000, 47000, 100000], value: 47000, unit: 'Ω' },
    ],

    setup({ params, chart }) {
      const s = { t: 0, out: SAT, vin: 0, history: [], toggles: [] };
      const thr = () => (params.hist === 'on' ? (SAT * params.r1) / params.r2 : 0);
      const noise = (t) => (params.noise * (Math.sin(t * 53.1) + Math.sin(t * 127.3 + 1.7) + Math.sin(t * 311.9 + 0.3) + Math.sin(t * 701.7 + 2.9))) / 4 * 1.5;

      return {
        reset() {
          Object.assign(s, { t: 0, out: SAT, vin: 0, history: [], toggles: [] });
        },
        step(dt) {
          s.t += Math.max(0, dt);
          s.vin = AMP * Math.sin((2 * Math.PI * s.t) / PERIOD) + noise(s.t);
          const th = thr();
          let next = s.out;
          if (s.out > 0 && s.vin < -th) next = -SAT;
          else if (s.out < 0 && s.vin > th) next = SAT;
          if (next !== s.out) s.toggles.push(s.t);
          s.out = next;
          s.history.push([s.t, s.vin, s.out]);
          const cut = s.t - WINDOW - 1;
          while (s.history.length > 2 && s.history[0][0] < cut) s.history.shift();
          while (s.toggles.length && s.toggles[0] < s.t - WINDOW) s.toggles.shift();
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const xo = w * 0.5;
          const ym = h * 0.5;
          const sz = Math.min(80, h * 0.2);
          const n = drawOpAmp(ctx, xo, ym, { size: sz, flip: true }); // + arriba, − abajo
          const x0 = w * 0.08;
          const xp = n.plus[0] - 36;
          const wire = (pts) => polyline(ctx, pts, { color: c.wire, width: 3 });
          const dot = (x, y) => circle(ctx, x, y, 3.5, { fill: c.wire });
          const yTop = ym - sz * 0.9;
          const y1 = h * 0.88;
          const xOut = n.out[0] + 26;

          drawAcSource(ctx, x0, ym + 30, 15);
          text(ctx, 'Vent', x0 - 22, ym + 30, { align: 'right', size: 12, color: c.muted });
          wire([[x0, ym + 15], [x0, n.plus[1]], [x0 + 20, n.plus[1]]]);
          wire([[x0, ym + 45], [x0, y1 - 12]]);
          drawGround(ctx, x0, y1 - 12);
          // R1 en serie con la entrada +
          const rx = (x0 + 20 + xp - 14) / 2;
          ctx.save(); ctx.fillStyle = c.surface; ctx.fillRect(rx - 36, n.plus[1] - 12, 72, 24); ctx.restore();
          wire([[x0 + 20, n.plus[1]], [xp, n.plus[1]], n.plus]);
          drawResistor(ctx, rx, n.plus[1], { len: 66, heat: 0 });
          text(ctx, `R1 = ${si(params.r1, 'Ω')}`, rx, n.plus[1] + 24, { align: 'center', weight: 600, size: 11.5 });
          // salida y realimentación positiva (R2) hacia +
          wire([n.out, [xOut, n.out[1]]]);
          circle(ctx, xOut, n.out[1], 5, { fill: c.surface, stroke: c.wire, width: 2 });
          if (params.hist === 'on') {
            wire([[xOut - 14, n.out[1]], [xOut - 14, yTop], [xp, yTop], [xp, n.plus[1]]]);
            dot(xOut - 14, n.out[1]);
            dot(xp, n.plus[1]);
            const mx = (xOut - 14 + xp) / 2;
            ctx.save(); ctx.fillStyle = c.surface; ctx.fillRect(mx - 40, yTop - 12, 80, 24); ctx.restore();
            drawResistor(ctx, mx, yTop, { len: 70, heat: 0 });
            text(ctx, `R2 = ${si(params.r2, 'Ω')}`, mx, yTop - 26, { align: 'center', weight: 600, size: 11.5 });
          }
          // entrada − a masa
          wire([n.minus, [n.minus[0] - 26, n.minus[1]], [n.minus[0] - 26, y1 - 12]]);
          drawGround(ctx, n.minus[0] - 26, y1 - 12);
          // LED de la salida
          const lx = xOut + 36;
          polyline(ctx, [[xOut, n.out[1]], [lx - 18, n.out[1]]], { color: c.wire, width: 3 });
          const on = s.out > 0;
          circle(ctx, lx, n.out[1], 16, { fill: on ? c.good : c.bad, stroke: c.wire, width: 2.5 });
          text(ctx, on ? '+' : '−', lx, n.out[1] + 1, { align: 'center', weight: 700, size: 18, color: '#fff' });
          text(ctx, on ? 'salida alta' : 'salida baja', lx, n.out[1] + 34, { align: 'center', size: 12, color: on ? c.good : c.bad, weight: 600 });
          const th = thr();
          text(ctx, params.hist === 'on' ? `umbrales: ±${num(th)} V (histéresis de ${num(2 * th)} V)` : 'umbral único: 0 V', w * 0.5, h * 0.06, { align: 'center', weight: 700, size: 13, color: c.accent });
          text(ctx, `conmutaciones en ${WINDOW} s: ${s.toggles.length}`, w * 0.5, h * 0.95, { align: 'center', weight: 700, size: 13, color: s.toggles.length > 4 ? c.bad : c.good });

          this.drawChart(c);
        },

        drawChart(c) {
          const x0 = Math.max(0, s.t - WINDOW);
          const hist = s.history.filter(([t]) => t >= x0);
          const th = thr();
          const hl = th > 0
            ? [{ y: th, label: `umbral superior +${num(th)} V`, color: c.heat }, { y: -th, label: `umbral inferior −${num(th)} V`, color: c.heat }]
            : [{ y: 0, label: 'umbral 0 V', color: c.heat }];
          chart.draw({
            xMin: x0,
            xMax: x0 + WINDOW,
            yMin: -12,
            yMax: 12,
            xTicks: [0, 2, 4, 6, 8].map((d) => ({ value: x0 + d, label: `${num(x0 + d, 2)} s` })),
            yTicks: [-10, -5, 0, 5, 10].map((v) => ({ value: v, label: `${v} V` })),
            series: [{ points: hist.map(([t, v]) => [t, v]), color: c.chargeNeg, width: 2 }, { points: hist.map(([t, , o]) => [t, o]), color: c.accent, width: 2.5 }],
            hlines: hl,
            legend: [{ label: 'entrada (con ruido)', color: c.chargeNeg }, { label: 'salida', color: c.accent }],
            cursor: { x: s.t, y: s.vin, color: c.chargePos },
            xLabel: 'tiempo',
          });
        },

        formulas() {
          const th = thr();
          return [
            { name: 'Umbrales de conmutación', sym: 'V<sub>±</sub> = ± V<sub>sat</sub> · R<sub>1</sub> / R<sub>2</sub>', val: params.hist === 'on' ? `V± = ±10,5 V · ${si(params.r1, 'Ω')} / ${si(params.r2, 'Ω')} = ±${num(th)} V` : 'Sin realimentación: un único umbral en 0 V' },
            { name: 'Ancho de la histéresis', sym: 'ΔV = 2 · V<sub>sat</sub> · R<sub>1</sub> / R<sub>2</sub>', val: `ΔV = ${num(2 * th)} V` },
            { name: 'Pico de ruido sobre la entrada', sym: 'V<sub>ruido</sub> ≈ amplitud del ruido', val: `≈ ${num(params.noise * 1.5 * 0.85)} V  ${params.hist === 'on' ? (params.noise * 1.5 * 0.85 < th ? '< umbral: no hay falsos disparos' : '≥ umbral: puede disparar de más') : '(cruza el umbral de 0 V muchas veces)'}` },
            { name: 'Entrada y salida ahora', sym: 'V<sub>ent</sub> · V<sub>sal</sub>', val: `Vent = ${si(s.vin, 'V')}  ·  Vsal = ${si(s.out, 'V')}` },
            { name: 'Conmutaciones en la ventana', sym: 'N', val: `N = ${s.toggles.length}  (lo ideal: 2 por cada ciclo de la señal lenta)` },
          ];
        },
      };
    },
  });
})();
