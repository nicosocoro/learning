// Capítulo 37: un disco con imanes de polos alternados que pasan frente a una bobina fija, con la
// salida directa (alterna) o rectificada por un puente con capacitor. Las tensiones y la gráfica
// son las de las rpm reales; el giro se anima en cámara lenta.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawResistor, polyline, text, circle, arrow, si, num } = Elec;

  const PHI0 = 4e-5; //        Wb por polo con el imán pegado a la bobina (imán de 10 mm)
  const GAP_DECAY = 5; //      mm: el campo cae a 1/e cada 5 mm de separación
  const R_PER_TURN = 0.03; //  Ω por vuelta (alambre esmaltado de 0,2 mm)
  const R_LOAD = 100; //       Ω
  const V_DIODE = 0.3; //      V por diodo (Schottky)
  const SLOW = 0.25; //        vueltas por segundo en pantalla
  const SAMPLES = 360;
  const TAU = Math.PI * 2;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Un disco con imanes frente a una bobina',
    label: 'Un disco con imanes alternados que gira frente a una bobina fija, con la salida directa o rectificada y las gráficas de tensión',
    caption: 'Cada vez que pasa un imán el flujo de la bobina cambia: pasan dos imanes (un N y un S) por ciclo. El giro está en cámara lenta; los valores son los de las rpm elegidas. La carga es un resistor de 100 Ω y los diodos son Schottky (0,3 V).',
    chart: true,
    controls: [
      { key: 'rpm', label: 'Velocidad del disco', values: [60, 120, 300, 600, 900, 1200], value: 600, unit: 'rpm', format: (v) => `${v} rpm` },
      { key: 'm', label: 'Imanes en el disco', values: [2, 4, 6, 8, 12], value: 8, unit: '', format: (v) => `${v} imanes` },
      { key: 'n', label: 'Vueltas de la bobina', values: [200, 500, 1000, 2000], value: 1000, unit: '', format: (v) => `${v} vueltas` },
      { key: 'gap', label: 'Separación imán–bobina', min: 1, max: 10, step: 1, value: 2, unit: 'mm', format: (v) => `${v} mm` },
      { type: 'choice', key: 'out', label: 'Salida', value: 'ac', options: [{ value: 'ac', label: 'Directa (alterna)' }, { value: 'dc', label: 'Puente + capacitor' }] },
      { key: 'cap', label: 'Capacitor del filtro', values: [100, 470, 2200], value: 470, unit: 'µF', format: (v) => `${v} µF` },
    ],

    setup({ params, chart }) {
      const wire = new FlowPath([], { closed: true });
      let theta = 0;
      let cache = null;
      let key = '';

      const pairs = () => params.m / 2;
      const freq = () => (pairs() * params.rpm) / 60;
      const omega = () => (TAU * params.rpm) / 60;
      const flux = () => PHI0 * Math.exp(-params.gap / GAP_DECAY);
      const peak = () => params.n * flux() * pairs() * omega();
      const rCoil = () => R_PER_TURN * params.n;
      /** fem de la bobina en función del ángulo eléctrico a (rad) */
      const emfAt = (a) => peak() * Math.sin(a);

      /** Simula la salida en régimen y devuelve dos ciclos de e(t) y v_carga(t). */
      function solve() {
        const k = [params.rpm, params.m, params.n, params.gap, params.out, params.cap].join('|');
        if (cache && k === key) return cache;
        key = k;
        const T = 1 / freq();
        const rc = rCoil();
        const C = params.cap * 1e-6;
        const dt = Math.min(T / 400, 1e-4);
        const steps = Math.round(T / dt);
        let vc = 0;
        const run = (cycles, record) => {
          const out = [];
          for (let cycle = 0; cycle < cycles; cycle++) {
            for (let s = 0; s < steps; s++) {
              const a = (s / steps) * TAU;
              const e = emfAt(a);
              let v;
              if (params.out === 'ac') {
                v = (e * R_LOAD) / (R_LOAD + rc);
              } else {
                const drive = Math.abs(e) - 2 * V_DIODE - vc;
                const i = drive > 0 ? drive / rc : 0;
                vc = Math.max(0, vc + (dt / C) * (i - vc / R_LOAD));
                v = vc;
              }
              if (record) out.push([((cycle * steps + s) * dt), e, v]);
            }
          }
          return out;
        };
        run(params.out === 'dc' ? Math.max(8, Math.ceil(0.4 / T)) : 0, false);
        const rec = run(2, true);
        let vmin = Infinity;
        let vmax = -Infinity;
        let sum = 0;
        for (const [, , v] of rec) {
          vmin = Math.min(vmin, v);
          vmax = Math.max(vmax, v);
          sum += v;
        }
        cache = { T, rec, vmin, vmax, avg: sum / rec.length, dt, steps };
        return cache;
      }

      return {
        reset() {
          theta = 0;
          wire.phase = 0;
        },
        onChange() { cache = null; },

        step(dt) {
          theta = (theta + TAU * SLOW * Math.max(0, dt)) % TAU;
          const a = theta * pairs();
          const e = emfAt(a);
          wire.advance(dt, -visualSpeed(e, peak() || 1) * (params.out === 'ac' ? Math.sign(e) : 1));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const compact = w < 520;
          const data = solve();
          const cx = compact ? w * 0.5 : w * 0.27;
          const cy = compact ? h * 0.4 : h * 0.55;
          const R = Math.min(compact ? w * 0.2 : w * 0.19, h * (compact ? 0.16 : 0.36));
          // disco con imanes alternados
          circle(ctx, cx, cy, R, { fill: c.surface, stroke: c.wire, width: 3 });
          const m = params.m;
          for (let k = 0; k < m; k++) {
            const a = theta + (k * TAU) / m - Math.PI / 2;
            const px = cx + Math.cos(a) * R * 0.76;
            const py = cy + Math.sin(a) * R * 0.76;
            circle(ctx, px, py, Math.max(5, Math.min(14, (R * 0.5 * Math.PI) / m)), { fill: k % 2 ? c.chargeNeg : c.chargePos, stroke: c.text, width: 1.5 });
          }
          circle(ctx, cx, cy, 4, { fill: c.wire });
          // bobina arriba, separada por el entrehierro
          const gapPx = 4 + params.gap * 3;
          const coilW = Math.min(70, R * 1.1);
          const coilH = 30;
          const coilY = cy - R - gapPx - coilH / 2 - 6;
          ctx.fillStyle = c.surface;
          ctx.fillRect(cx - coilW / 2, coilY - coilH / 2, coilW, coilH);
          ctx.strokeStyle = c.accent;
          ctx.lineWidth = 2.5;
          const turns = 5;
          for (let k = 0; k < turns; k++) {
            ctx.beginPath();
            ctx.ellipse(cx - coilW / 2 + ((k + 0.5) * coilW) / turns, coilY, 5, coilH / 2 - 2, 0, 0, TAU);
            ctx.stroke();
          }
          text(ctx, `${params.n} vueltas`, cx + coilW / 2 + 8, coilY, { size: 12, color: c.accent });
          text(ctx, `${params.gap} mm`, cx + R * 0.45, cy - R - gapPx / 2 - 3, { size: 11, color: c.muted });
          text(ctx, `${m} imanes · ${m} polos alternados`, cx, cy + R + 20, { align: 'center', size: 12, color: c.muted });

          // circuito
          const x0 = compact ? w * 0.1 : w * 0.56;
          const x1 = compact ? w * 0.9 : w * 0.94;
          const y0 = compact ? h * 0.72 : h * 0.24;
          const y1 = compact ? h * 0.9 : h * 0.72;
          const ym = (y0 + y1) / 2;
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
          polyline(ctx, corners, { color: c.wire, width: 3, close: true });
          // la bobina como fuente
          circle(ctx, x0, ym, 16, { fill: c.surface, stroke: c.wire, width: 2.5 });
          text(ctx, '~', x0, ym - 2, { align: 'center', size: 20, weight: 700, color: c.accent });
          drawResistor(ctx, x1, ym, { orient: 'v', len: Math.min(70, (y1 - y0) * 0.55), heat: Math.min(1, ((data.avg ** 2) / R_LOAD) * 4) });
          text(ctx, `R = ${si(R_LOAD, 'Ω')}`, x1 - 26, ym, { align: 'right', size: 12, color: c.accent });
          if (params.out === 'dc') {
            const bx = (x0 + x1) / 2;
            ctx.fillStyle = c.surface;
            ctx.fillRect(bx - 56, y0 - 18, 112, 36);
            ctx.strokeStyle = c.wire;
            ctx.lineWidth = 2.5;
            ctx.strokeRect(bx - 56, y0 - 18, 112, 36);
            text(ctx, `puente + ${params.cap} µF`, bx, y0, { align: 'center', size: 12, weight: 600 });
          }
          wire.setPoints(corners);
          wire.draw(ctx, { radius: compact ? 3.2 : 4, spacing: 24 });
          const a = theta * pairs();
          const vNow = data.rec[Math.floor(((a % TAU) / TAU) * data.steps)]?.[2] ?? 0;
          text(ctx, `${params.out === 'ac' ? 'v' : 'V'} en la carga = ${si(vNow, 'V')}`, (x0 + x1) / 2, y1 + 18, { align: 'center', size: 13, weight: 600, color: c.chargePos });

          this.drawChart(c, data, a);
        },

        drawChart(c, data, a) {
          const span = data.rec.at(-1)[0] + data.dt;
          const e = [];
          const v = [];
          const stride = Math.max(1, Math.floor(data.rec.length / 400));
          for (let k = 0; k < data.rec.length; k += stride) {
            e.push([data.rec[k][0], data.rec[k][1]]);
            v.push([data.rec[k][0], data.rec[k][2]]);
          }
          const top = Math.max(peak(), 0.05) * 1.2;
          const T = data.T;
          const ms = (t) => `${num(t * 1000, 3)} ms`;
          const idx = Math.floor((((a % TAU) + TAU) % TAU / TAU) * data.steps);
          chart.draw({
            xMax: span,
            yMin: -top,
            yMax: top,
            xTicks: [0, 0.5, 1, 1.5, 2].map((k) => ({ value: k * T, label: k === 0 ? '0' : ms(k * T) })),
            yTicks: [-top, 0, top].map((val) => ({ value: val, label: si(val, 'V', 2) })),
            series: [
              { points: e, color: c.muted, width: 1.5 },
              { points: v, color: c.accent, width: 3 },
            ],
            hlines: params.out === 'dc' ? [{ y: data.avg, label: `promedio ${si(data.avg, 'V')}`, color: c.good }] : [],
            cursor: { x: data.rec[idx][0], y: data.rec[idx][2], color: c.accent },
            legend: [
              { label: `fem de la bobina (pico ${si(peak(), 'V')})`, color: c.muted },
              { label: params.out === 'ac' ? 'tensión en la carga' : 'tensión de salida rectificada y filtrada', color: c.accent },
            ],
            xLabel: 'tiempo real',
            yLabel: 'tensión (V)',
          });
        },

        formulas() {
          const data = solve();
          const rows = [
            { name: 'Pares de polos y frecuencia', sym: 'f = (imanes/2) · n / 60', val: `f = ${pairs()} · ${params.rpm} / 60 = ${num(freq(), 3)} Hz` },
            { name: 'Flujo por imán (cae con la separación)', sym: 'Φ<sub>pico</sub> ≈ Φ<sub>0</sub> · e<sup>−d/5 mm</sup>', val: `Φ = ${si(flux(), 'Wb')}` },
            { name: 'Tensión pico de la bobina', sym: 'V<sub>p</sub> = N · Φ · p · ω', val: `Vp = ${params.n} · ${si(flux(), 'Wb')} · ${pairs()} · ${num(omega())} = ${si(peak(), 'V')}` },
            { name: 'Resistencia de la bobina', sym: 'r ≈ 0,03 Ω · N', val: `r = ${si(rCoil(), 'Ω')}` },
          ];
          if (params.out === 'ac') {
            rows.push({ name: 'Tensión eficaz en la carga', sym: 'V<sub>rms</sub> = V<sub>p</sub>/√2 · R / (R + r)', val: `Vrms = ${si((peak() / Math.SQRT2) * (R_LOAD / (R_LOAD + rCoil())), 'V')}` });
          } else {
            rows.push(
              { name: 'Tensión continua máxima posible', sym: 'V<sub>cc</sub> ≈ V<sub>p</sub> − 2 · V<sub>diodo</sub>', val: `Vcc ≈ ${si(Math.max(0, peak() - 2 * V_DIODE), 'V')}` },
              { name: 'Tensión promedio y ondulación', sym: '⟨V⟩ y (V<sub>máx</sub> − V<sub>mín</sub>)', val: `⟨V⟩ = ${si(data.avg, 'V')} · ondulación = ${si(data.vmax - data.vmin, 'V')}` },
            );
          }
          return rows;
        },
      };
    },
  });
})();
