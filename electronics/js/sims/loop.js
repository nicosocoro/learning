// Capítulo 33: una espira que gira dentro de un campo magnético uniforme. El flujo sigue a cos θ
// y la tensión inducida a sen θ. La rotación se anima en cámara lenta (una vuelta cada 4 s); los
// números y la gráfica corresponden a las revoluciones por minuto reales elegidas.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawPoles, drawEdgeLoop, drawAcSource, drawResistor, polyline, text, arrow, si, num } = Elec;

  const SLOW = 0.25; //   vueltas por segundo en pantalla (cámara lenta)
  const SAMPLES = 200;
  const TAU = Math.PI * 2;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Una espira que gira dentro de un campo magnético',
    label: 'Una espira vista de canto que gira entre los polos de un imán, con el circuito exterior y las gráficas del flujo y de la tensión inducida',
    caption: 'La espira gira en cámara lenta (una vuelta cada 4 s), pero los valores y las gráficas son los de las revoluciones por minuto elegidas. ⊙ marca corriente que sale de la hoja y ⊗ corriente que entra.',
    chart: true,
    controls: [
      { key: 'rpm', label: 'Velocidad de giro (n)', min: 600, max: 3600, step: 300, value: 3000, unit: 'rpm', format: (v) => `${v} rpm` },
      { key: 'n', label: 'Vueltas de la bobina (N)', min: 10, max: 200, step: 10, value: 100, unit: '', format: (v) => `${v} vueltas` },
      { key: 'b', label: 'Campo del imán (B)', min: 0.05, max: 0.5, step: 0.05, value: 0.2, unit: 'T' },
      { key: 'a', label: 'Área de la espira (A)', min: 25, max: 200, step: 25, value: 100, unit: 'cm²', format: (v) => `${v} cm²` },
    ],

    setup({ params, chart }) {
      const wire = new FlowPath([], { closed: true });
      let theta = 0;

      const area = () => params.a * 1e-4;
      const omega = () => (TAU * params.rpm) / 60;
      const phiMax = () => params.b * area();
      const peak = () => params.n * phiMax() * omega();
      const emf = (t) => peak() * Math.sin(t);
      const period = () => 60 / params.rpm;

      return {
        reset() {
          theta = 0;
          wire.phase = 0;
        },

        step(dt) {
          theta = (theta + TAU * SLOW * Math.max(0, dt)) % (2 * TAU);
          wire.advance(dt, visualSpeed(emf(theta), peak()) * Math.sign(emf(theta)) * -1);
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const compact = w < 520;
          const cx = compact ? w * 0.5 : w * 0.3;
          const cy = compact ? h * 0.27 : h * 0.46;
          const half = compact ? 42 : Math.min(72, h * 0.17);
          const span = half * (compact ? 3.1 : 3.4);
          const e = emf(theta);
          const dir = e / peak();

          drawPoles(ctx, cx, cy, { span, h: half * 2.3, w: compact ? 30 : 40 });
          const loop = drawEdgeLoop(ctx, cx, cy, { theta, half, dir });
          // flechas de velocidad en los lados activos
          for (const [p, v] of [[loop.a, loop.va], [loop.b, loop.vb]]) {
            arrow(ctx, p[0] + v[0] * 14, p[1] + v[1] * 14, p[0] + v[0] * 38, p[1] + v[1] * 38, { color: c.text, width: 1.8, head: 6 });
          }
          text(ctx, 'B →', cx, cy - half * 1.5, { align: 'center', size: 13, color: c.muted });
          text(ctx, `θ = ${Math.round(((theta * 180) / Math.PI) % 360)}°`, cx, cy + half * 1.55, { align: 'center', size: 13, color: c.accent });

          // circuito exterior: fuente (la espira) y una carga
          const x0 = compact ? w * 0.18 : w * 0.64;
          const x1 = compact ? w * 0.82 : w * 0.92;
          const y0 = compact ? h * 0.66 : h * 0.3;
          const y1 = compact ? h * 0.9 : h * 0.72;
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
          polyline(ctx, corners, { color: c.wire, width: 3, close: true });
          drawAcSource(ctx, x0, (y0 + y1) / 2, 16);
          drawResistor(ctx, x1, (y0 + y1) / 2, { orient: 'v', len: Math.min(70, (y1 - y0) * 0.55), heat: Math.min(1, (peak() / Math.SQRT2 / 150) ** 2) });
          wire.setPoints(corners);
          wire.draw(ctx, { radius: compact ? 3.2 : 4, spacing: 24 });
          text(ctx, 'carga', x1 - 26, (y0 + y1) / 2, { align: 'right', size: 12, color: c.muted });
          text(ctx, `ε = ${si(e, 'V')}`, (x0 + x1) / 2, y0 - 14, { align: 'center', size: 13, weight: 600, color: c.chargePos });

          this.drawChart(c);
        },

        drawChart(c) {
          const T = period();
          const span = 2 * T;
          const flux = [];
          const volt = [];
          for (let k = 0; k <= SAMPLES; k++) {
            const a = (k / SAMPLES) * 2 * TAU;
            flux.push([(a / TAU) * T, Math.cos(a)]);
            volt.push([(a / TAU) * T, Math.sin(a)]);
          }
          const now = theta % (2 * TAU);
          const ms = (v) => `${num(v * 1000)} ms`;
          chart.draw({
            xMax: span,
            yMin: -1.2,
            yMax: 1.2,
            xTicks: [0, 0.5, 1, 1.5, 2].map((k) => ({ value: k * T, label: k === 0 ? '0' : ms(k * T) })),
            yTicks: [{ value: -1, label: '−1' }, { value: 0, label: '0' }, { value: 1, label: '+1' }],
            series: [
              { points: flux, color: c.chargeNeg },
              { points: volt, color: c.chargePos, width: 2.5 },
            ],
            cursor: { x: (now / TAU) * T, y: Math.sin(now), color: c.chargePos },
            legend: [
              { label: `flujo Φ (máx. ${si(phiMax(), 'Wb')})`, color: c.chargeNeg },
              { label: `tensión ε (pico ${si(peak(), 'V')})`, color: c.chargePos },
            ],
            xLabel: 'tiempo real (ambas curvas relativas a su máximo)',
            yLabel: 'valor relativo',
          });
        },

        formulas() {
          const w = omega();
          const deg = ((theta * 180) / Math.PI) % 360;
          return [
            { name: 'Flujo máximo (espira de frente al campo)', sym: 'Φ<sub>máx</sub> = B · A', val: `Φmáx = ${num(params.b)} T · ${num(area() * 1e4)} cm² = ${si(phiMax(), 'Wb')}` },
            { name: 'Velocidad angular', sym: 'ω = 2π · n / 60', val: `ω = 2π · ${params.rpm} / 60 = ${num(w)} rad/s` },
            { name: 'Flujo ahora', sym: 'Φ = Φ<sub>máx</sub> · cos θ', val: `Φ = ${si(phiMax(), 'Wb')} · cos ${Math.round(deg)}° = ${si(phiMax() * Math.cos(theta), 'Wb')}` },
            { name: 'Tensión inducida ahora', sym: 'ε = N · B · A · ω · sen θ', val: `ε = ${si(peak(), 'V')} · sen ${Math.round(deg)}° = ${si(emf(theta), 'V')}` },
            { name: 'Tensión pico y eficaz', sym: 'V<sub>p</sub> = N·B·A·ω · V<sub>rms</sub> = V<sub>p</sub>/√2', val: `Vp = ${si(peak(), 'V')} · Vrms = ${si(peak() / Math.SQRT2, 'V')}` },
            { name: 'Frecuencia (una vuelta = un ciclo)', sym: 'f = n / 60 · T = 1/f', val: `f = ${params.rpm} / 60 = ${num(params.rpm / 60)} Hz · T = ${num(period() * 1000)} ms` },
          ];
        },
      };
    },
  });
})();
