// Capítulo 34: el generador con carga. La corriente que circula por la espira crea un par que se
// opone al giro (ley de Lenz): la potencia eléctrica entregada es exactamente la potencia
// mecánica que hay que aportar al eje. Con una carga inductiva la corriente se atrasa respecto de
// la tensión y el par llega a invertirse por instantes.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawPoles, drawEdgeLoop, drawAcSource, drawResistor, drawCoil, polyline, text, circle, arrow, si, num } = Elec;

  const K = 0.2; //          V·s = N·B·A (100 vueltas · 0,2 T · 0,01 m²)
  const R_INT = 2; //        Ω, resistencia del bobinado
  const L_LOAD = 0.03; //    H, inductancia de la carga inductiva (motor)
  const P_ENGINE = 100; //   W, potencia del motor primario en el modo de potencia limitada
  const SLOW = 0.25; //      vueltas por segundo en pantalla cuando el eje gira a su velocidad sin carga
  const SAMPLES = 200;
  const TAU = Math.PI * 2;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'La carga se siente en el eje',
    label: 'Un generador de espira con su carga: la corriente que circula crea un par de frenado en el eje, con las gráficas de tensión, corriente y par',
    caption: 'Las flechas rojas son la fuerza que el campo ejerce sobre la corriente de los lados activos: siempre se opone al movimiento (negras). Cuanta más corriente, más fuerte frena y más esfuerzo pide al motor primario. Rotación en cámara lenta.',
    chart: true,
    controls: [
      { type: 'choice', key: 'load', label: 'Carga', value: 'res', options: [{ value: 'open', label: 'Sin carga' }, { value: 'res', label: 'Resistiva' }, { value: 'ind', label: 'Inductiva (motor)' }] },
      { key: 'r', label: 'Resistencia de la carga (R)', values: [100, 50, 20, 10, 5, 2, 1], value: 20, unit: 'Ω' },
      { type: 'choice', key: 'drive', label: 'Motor primario', value: 'speed', options: [{ value: 'speed', label: 'Mantiene las rpm' }, { value: 'power', label: 'Potencia limitada (100 W)' }] },
      { key: 'rpm0', label: 'Velocidad sin carga', min: 1500, max: 3600, step: 300, value: 3000, unit: 'rpm', format: (v) => `${v} rpm` },
    ],

    setup({ params, chart }) {
      const wire = new FlowPath([], { closed: true });
      let theta = 0;

      const w0 = () => (TAU * params.rpm0) / 60;
      const inductance = () => (params.load === 'ind' ? L_LOAD : 0);
      const loadR = () => (params.load === 'open' ? Infinity : params.r);
      /** Potencia mecánica media a la velocidad angular w (la misma que la eléctrica total). */
      function powerAt(w) {
        if (params.load === 'open') return 0;
        const rt = loadR() + R_INT;
        return ((K * w) ** 2 / 2) * (rt / (rt ** 2 + (w * inductance()) ** 2));
      }
      /** Estado del generador: velocidad real, corrientes, par y potencias. */
      function state() {
        let w = w0();
        if (params.drive === 'power' && params.load !== 'open' && powerAt(w) > P_ENGINE) {
          let lo = 0;
          let hi = w;
          for (let n = 0; n < 50; n++) {
            const mid = (lo + hi) / 2;
            if (powerAt(mid) < P_ENGINE) lo = mid; else hi = mid;
          }
          w = (lo + hi) / 2;
        }
        const vp = K * w;
        if (params.load === 'open') return { w, vp, ip: 0, phi: 0, tau: 0, pMech: 0, pLoad: 0, pCu: 0, irms: 0, vLoad: vp / Math.SQRT2 };
        const rt = loadR() + R_INT;
        const x = w * inductance();
        const z = Math.hypot(rt, x);
        const ip = vp / z;
        const phi = Math.atan2(x, rt);
        const irms = ip / Math.SQRT2;
        return { w, vp, ip, phi, tau: (K * ip * Math.cos(phi)) / 2, pMech: powerAt(w), pLoad: irms ** 2 * loadR(), pCu: irms ** 2 * R_INT, irms, vLoad: irms * Math.hypot(loadR(), x) };
      }
      const emfAt = (s, t) => s.vp * Math.sin(t);
      const currentAt = (s, t) => s.ip * Math.sin(t - s.phi);
      const torqueAt = (s, t) => K * currentAt(s, t) * Math.sin(t);

      return {
        reset() {
          theta = 0;
          wire.phase = 0;
        },

        step(dt) {
          const s = state();
          theta = (theta + TAU * SLOW * (s.w / w0()) * Math.max(0, dt)) % (2 * TAU);
          wire.advance(dt, -visualSpeed(currentAt(s, theta), Math.max(s.ip, 1e-9)) * Math.sign(currentAt(s, theta)) * (s.ip > 0 ? 1 : 0));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const compact = w < 520;
          const s = state();
          const i = currentAt(s, theta);
          const cx = compact ? w * 0.5 : w * 0.27;
          const cy = compact ? h * 0.25 : h * 0.43;
          const half = compact ? 40 : Math.min(66, h * 0.16);
          const span = half * (compact ? 3.1 : 3.4);
          const maxI = Math.max(s.ip, 1e-9);

          drawPoles(ctx, cx, cy, { span, h: half * 2.3, w: compact ? 30 : 40 });
          const loop = drawEdgeLoop(ctx, cx, cy, { theta, half, dir: s.ip > 0 ? i / maxI : 0 });
          const brake = (K * i * Math.sin(theta)) / (K * maxI); // −1..1: positivo frena
          for (const [p, v] of [[loop.a, loop.va], [loop.b, loop.vb]]) {
            arrow(ctx, p[0] + v[0] * 13, p[1] + v[1] * 13, p[0] + v[0] * 36, p[1] + v[1] * 36, { color: c.text, width: 1.8, head: 6 });
            if (Math.abs(brake) > 0.06 && s.ip > 0) {
              const len = 14 + 36 * Math.abs(brake);
              const sgn = -Math.sign(brake); // brake > 0: la fuerza se opone a la velocidad
              arrow(ctx, p[0] + v[0] * sgn * 13, p[1] + v[1] * sgn * 13, p[0] + v[0] * sgn * len, p[1] + v[1] * sgn * len, { color: c.bad, width: 3.5, head: 8 });
            }
          }
          // campo propio de la espira: momento magnético m = N·i·A (a lo largo de la normal)
          if (s.ip > 0 && Math.abs(i / maxI) > 0.08) {
            const nx = Math.cos(theta) * Math.sign(i);
            const ny = -Math.sin(theta) * Math.sign(i);
            const len = 14 + 26 * Math.abs(i / maxI);
            arrow(ctx, cx - nx * len * 0.5, cy - ny * len * 0.5, cx + nx * len * 0.5, cy + ny * len * 0.5, { color: c.good, width: 3, head: 7 });
          }
          text(ctx, 'B →', cx, cy - half * 1.5, { align: 'center', size: 13, color: c.muted });
          if (!compact) text(ctx, s.ip > 0 ? 'rojo: fuerza de frenado · verde: campo propio de la espira' : 'sin corriente: nada frena', cx, cy + half * 1.55, { align: 'center', size: 12, color: c.muted });

          // eje y esfuerzo del motor primario
          const bx = compact ? w * 0.08 : w * 0.06;
          const by = compact ? h * 0.53 : h * 0.84;
          const bw = compact ? w * 0.84 : w * 0.42;
          ctx.fillStyle = c.surface;
          ctx.fillRect(bx, by, bw, 14);
          ctx.fillStyle = c.bad;
          ctx.globalAlpha = 0.8;
          ctx.fillRect(bx, by, bw * Math.min(1, s.pMech / 1000), 14);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, by, bw, 14);
          text(ctx, `esfuerzo en el eje: P = ${si(s.pMech, 'W')} · par medio ${num(s.tau)} N·m · ${num((s.w * 60) / TAU, 4)} rpm`, bx, by - 12, { size: compact ? 11 : 12.5, color: c.text });

          // circuito exterior
          const x0 = compact ? w * 0.18 : w * 0.64;
          const x1 = compact ? w * 0.82 : w * 0.93;
          const y0 = compact ? h * 0.64 : h * 0.24;
          const y1 = compact ? h * 0.87 : h * 0.7;
          const ym = (y0 + y1) / 2;
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
          if (params.load === 'open') {
            polyline(ctx, [[x1, ym - 24], [x1, y0], [x0, y0], [x0, y1], [x1, y1], [x1, ym + 24]], { color: c.wire, width: 3 });
            polyline(ctx, [[x1, ym + 24], [x1 + 16, ym - 12]], { color: c.wire, width: 3 });
            circle(ctx, x1, ym - 24, 3.5, { fill: c.wire });
            circle(ctx, x1, ym + 24, 3.5, { fill: c.wire });
            text(ctx, 'circuito abierto', x1 - 28, ym + 4, { align: 'right', size: 12, color: c.muted });
          } else {
            polyline(ctx, corners, { color: c.wire, width: 3, close: true });
          }
          drawAcSource(ctx, x0, ym, 16);
          if (params.load === 'res') {
            drawResistor(ctx, x1, ym, { orient: 'v', len: Math.min(70, (y1 - y0) * 0.55), heat: Math.min(1, s.pLoad / 600) });
            text(ctx, `R = ${si(params.r, 'Ω')}`, x1 - 28, ym, { align: 'right', size: 12, color: c.accent });
          } else if (params.load === 'ind') {
            drawCoil(ctx, x1, ym, { len: Math.min(76, (y1 - y0) * 0.6), turns: 4, active: Math.min(1, s.irms / 10) });
            text(ctx, `R = ${si(params.r, 'Ω')} + L`, x1 - 28, ym, { align: 'right', size: 12, color: c.accent });
          }
          wire.setPoints(corners);
          if (s.ip > 0) wire.draw(ctx, { radius: compact ? 3.2 : 4, spacing: 24 });
          text(ctx, `ε = ${si(emfAt(s, theta), 'V')}`, (x0 + x1) / 2, y0 - 14, { align: 'center', size: 13, weight: 600, color: c.chargePos });
          text(ctx, `i = ${si(i, 'A')}`, (x0 + x1) / 2, y1 + 16, { align: 'center', size: 13, weight: 600, color: c.chargeNeg });

          this.drawChart(c, s);
        },

        drawChart(c, s = state()) {
          const T = (TAU / s.w);
          const span = 2 * T;
          const emf = [];
          const cur = [];
          const tor = [];
          const tauRef = Math.max(K * s.ip, 1e-9);
          for (let k = 0; k <= SAMPLES; k++) {
            const a = (k / SAMPLES) * 2 * TAU;
            const t = (a / TAU) * T;
            emf.push([t, Math.sin(a)]);
            cur.push([t, s.ip > 0 ? Math.sin(a - s.phi) : 0]);
            tor.push([t, s.ip > 0 ? torqueAt(s, a) / tauRef : 0]);
          }
          const ms = (v) => `${num(v * 1000)} ms`;
          const now = theta % (2 * TAU);
          chart.draw({
            xMax: span,
            yMin: -1.2,
            yMax: 1.2,
            xTicks: [0, 0.5, 1, 1.5, 2].map((k) => ({ value: k * T, label: k === 0 ? '0' : ms(k * T) })),
            yTicks: [{ value: -1, label: '−1' }, { value: 0, label: '0' }, { value: 1, label: '+1' }],
            series: [
              { points: emf, color: c.chargePos },
              { points: cur, color: c.chargeNeg },
              { points: tor, color: c.bad, width: 3 },
            ],
            hlines: s.ip > 0 ? [{ y: Math.cos(s.phi) / 2, label: 'par medio', color: c.bad }] : [],
            cursor: { x: (now / TAU) * T, y: s.ip > 0 ? torqueAt(s, now) / tauRef : 0, color: c.bad },
            legend: [
              { label: `tensión ε (pico ${si(s.vp, 'V')})`, color: c.chargePos },
              { label: `corriente i (pico ${si(s.ip, 'A')})`, color: c.chargeNeg },
              { label: 'par de frenado τ', color: c.bad },
            ],
            xLabel: 'tiempo real (curvas relativas a su máximo)',
            yLabel: 'valor relativo',
          });
        },

        formulas() {
          const s = state();
          const rt = loadR() + R_INT;
          if (params.load === 'open') {
            return [
              { name: 'Tensión inducida (pico)', sym: 'V<sub>p</sub> = N·B·A·ω', val: `Vp = ${num(K)} · ${num(s.w)} = ${si(s.vp, 'V')}` },
              { name: 'Corriente', sym: 'I = ε / (R + r)', val: 'circuito abierto: I = 0' },
              { name: 'Par de frenado', sym: 'τ = N·B·A·i·sen θ', val: 'sin corriente no hay par: el eje gira “gratis”' },
              { name: 'Potencia mecánica', sym: 'P<sub>mec</sub> = ε · i', val: 'Pmec = 0 W (sin contar el rozamiento)' },
            ];
          }
          return [
            { name: 'Tensión inducida (pico)', sym: 'V<sub>p</sub> = N·B·A·ω', val: `Vp = ${num(K)} · ${num(s.w)} rad/s = ${si(s.vp, 'V')}` },
            { name: 'Corriente (pico)', sym: 'I<sub>p</sub> = V<sub>p</sub> / √((R+r)² + (ωL)²)', val: `Ip = ${si(s.vp, 'V')} / ${si(Math.hypot(rt, s.w * inductance()), 'Ω')} = ${si(s.ip, 'A')}` },
            { name: 'Atraso de la corriente', sym: 'φ = arctan(ωL / (R+r))', val: `φ = ${num((s.phi * 180) / Math.PI)}°` },
            { name: 'Par medio de frenado', sym: 'τ = N·B·A·I<sub>p</sub>·cos φ / 2', val: `τ = ${num(K)} · ${si(s.ip, 'A')} · ${num(Math.cos(s.phi))} / 2 = ${num(s.tau)} N·m` },
            { name: 'Potencia que pide el eje', sym: 'P<sub>mec</sub> = τ · ω', val: `Pmec = ${num(s.tau)} · ${num(s.w)} = ${si(s.pMech, 'W')}` },
            { name: 'Reparto de esa potencia', sym: 'P<sub>mec</sub> = I²<sub>rms</sub>·R + I²<sub>rms</sub>·r', val: `${si(s.pMech, 'W')} = ${si(s.pLoad, 'W')} (carga) + ${si(s.pCu, 'W')} (calor en el cobre)` },
            { name: 'Velocidad y frecuencia reales', sym: 'n = 60·ω / 2π · f = n / 60', val: `n = ${num((s.w * 60) / TAU, 4)} rpm · f = ${num(s.w / TAU, 3)} Hz` },
          ];
        },
      };
    },
  });
})();
