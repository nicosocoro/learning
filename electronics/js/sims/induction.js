// Capítulo 12: un imán que entra y sale de una bobina. La tensión inducida sigue la
// rapidez con que cambia el flujo (ley de Faraday), no el valor del flujo.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, polyline, text, circle, arrow, si, num } = Elec;

  const AREA = 5e-4; //       m² (una espira de unos 5 cm²)
  const REACH = 0.45; //      "alcance" del imán: qué tan lejos sigue enhebrando flujo
  const TRAVEL = 1; //        amplitud de la oscilación, en unidades de la pantalla
  const SAMPLES = 200;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Un imán que atraviesa una bobina',
    label: 'Un imán que se mueve dentro de una bobina conectada a un voltímetro, con las gráficas de flujo y tensión inducida',
    caption: 'Con el imán quieto dentro de la bobina el flujo es máximo, pero la tensión es cero: solo el <em>cambio</em> de flujo induce tensión. Frecuencias reducidas para poder verlo.',
    chart: true,
    controls: [
      { type: 'choice', key: 'motion', label: 'Movimiento del imán', value: 'moving', options: [{ value: 'moving', label: 'Va y viene' }, { value: 'still', label: 'Quieto, en el centro' }] },
      { key: 'f', label: 'Frecuencia del movimiento', min: 0.5, max: 3, step: 0.5, value: 1, unit: 'Hz' },
      { key: 'n', label: 'Vueltas de la bobina (N)', min: 50, max: 500, step: 50, value: 200, unit: '', format: (v) => `${v} vueltas` },
      { key: 'b', label: 'Intensidad del imán (B)', min: 0.1, max: 1, step: 0.1, value: 0.5, unit: 'T' },
    ],

    setup({ params, chart }) {
      const wire = new FlowPath();
      let time = 0;

      const omega = () => 2 * Math.PI * params.f;
      const phiMax = () => params.b * AREA;
      const shape = (x) => Math.exp(-((x / REACH) ** 2)); //             flujo relativo según la posición
      const position = (t) => (params.motion === 'moving' ? TRAVEL * Math.sin(omega() * t) : 0);
      const velocity = (t) => (params.motion === 'moving' ? TRAVEL * omega() * Math.cos(omega() * t) : 0);
      const flux = (t) => phiMax() * shape(position(t));
      /** dΦ/dt calculada derivando analíticamente Φ(x(t)). */
      const dFlux = (t) => {
        const x = position(t);
        return phiMax() * shape(x) * ((-2 * x) / REACH ** 2) * velocity(t);
      };
      const emf = (t) => -params.n * dFlux(t);

      // Valor máximo de la tensión en un ciclo, para escalar la gráfica y el voltímetro
      function emfPeak() {
        let peak = 1e-9;
        for (let n = 0; n <= SAMPLES; n++) peak = Math.max(peak, Math.abs(emf((n / SAMPLES) / params.f)));
        return peak;
      }

      return {
        reset() {
          time = 0;
          wire.phase = 0;
        },

        step(dt) {
          time += dt;
          wire.advance(dt, -Math.sign(emf(time)) * visualSpeed(Math.abs(emf(time)), emfPeak() || 1));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const compact = w < 520;
          const cx = w * 0.5;
          const cy = h * 0.34;
          const reach = w * 0.3; //          cuánto se mueve el imán a cada lado
          const loops = Math.max(4, Math.min(10, Math.round(params.n / 50)));
          const coilHalf = compact ? 34 : 46;
          const ry = h * 0.2;
          const x = position(time);
          const mx = cx + x * reach;
          const magW = compact ? 64 : 92;
          const magH = compact ? 22 : 30;

          // Líneas de campo del imán (esquema)
          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = c.grid;
          ctx.lineWidth = 1.5;
          for (const k of [1.5, 2.3]) {
            ctx.beginPath();
            ctx.ellipse(mx, cy, magW * 0.5 * k, magH * 0.5 * k + 14, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();

          // Bobina y cables hacia el voltímetro
          const my = h * 0.8;
          const meterR = Math.min(h * 0.13, 36);
          const leads = [[cx - coilHalf - 8, cy + ry], [cx - coilHalf - 8, my], [cx - meterR, my]];
          const leadsR = [[cx + coilHalf + 8, cy + ry], [cx + coilHalf + 8, my], [cx + meterR, my]];
          polyline(ctx, leads, { color: c.wire, width: 3 });
          polyline(ctx, leadsR, { color: c.wire, width: 3 });
          for (let n = 0; n < loops; n++) {
            const lx = cx - coilHalf + ((n + 0.5) * coilHalf * 2) / loops;
            ctx.save();
            ctx.strokeStyle = c.accent;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(lx, cy, 7, ry, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // Electrones por el circuito exterior
          wire.setPoints([[cx - coilHalf - 8, cy + ry], [cx - coilHalf - 8, my], [cx + coilHalf + 8, my], [cx + coilHalf + 8, cy + ry]]);
          wire.draw(ctx, { radius: 4, spacing: 22 });

          // Voltímetro (aguja proporcional a la tensión inducida)
          circle(ctx, cx, my, meterR, { fill: c.surface, stroke: c.text, width: 2.5 });
          const ratio = Math.max(-1, Math.min(1, emf(time) / emfPeak()));
          const angle = ratio * (Math.PI / 3);
          polyline(ctx, [[cx, my + meterR * 0.55], [cx + Math.sin(angle) * meterR * 0.9, my + meterR * 0.55 - Math.cos(angle) * meterR * 1.1]], { color: c.chargePos, width: 3 });
          circle(ctx, cx, my + meterR * 0.55, 3, { fill: c.text });
          text(ctx, 'V', cx, my - meterR * 0.45, { align: 'center', size: 13, weight: 700, color: c.muted });
          text(ctx, si(emf(time), 'V'), cx + meterR + 22, my, { size: 13, weight: 600, color: c.chargePos });

          // Imán: mitad norte (roja) y mitad sur (azul)
          ctx.fillStyle = c.chargePos;
          ctx.fillRect(mx - magW / 2, cy - magH / 2, magW / 2, magH);
          ctx.fillStyle = c.chargeNeg;
          ctx.fillRect(mx, cy - magH / 2, magW / 2, magH);
          ctx.strokeStyle = c.text;
          ctx.lineWidth = 2;
          ctx.strokeRect(mx - magW / 2, cy - magH / 2, magW, magH);
          text(ctx, 'N', mx - magW / 4, cy, { align: 'center', weight: 700, color: '#fff' });
          text(ctx, 'S', mx + magW / 4, cy, { align: 'center', weight: 700, color: '#fff' });

          // Flecha de movimiento
          const v = velocity(time);
          if (Math.abs(v) > 0.15) arrow(ctx, mx, cy - magH / 2 - 14, mx + Math.sign(v) * 30, cy - magH / 2 - 14, { color: c.text, width: 2 });
          text(ctx, 'bobina', cx, cy - ry - 10, { align: 'center', size: 12, color: c.muted });

          this.drawChart(c);
        },

        drawChart(c) {
          const span = 2 / params.f;
          const peak = emfPeak();
          const flux01 = [];
          const emf01 = [];
          for (let n = 0; n <= SAMPLES; n++) {
            const t = (n / SAMPLES) * span;
            flux01.push([t, flux(t) / phiMax()]);
            emf01.push([t, emf(t) / peak]);
          }
          const now = time % span;
          chart.draw({
            xMax: span,
            yMin: -1.15,
            yMax: 1.15,
            xTicks: [0, 0.5, 1, 1.5, 2].map((k) => ({ value: (k * span) / 2, label: k === 0 ? '0' : `${num((k * span) / 2)} s` })),
            yTicks: [{ value: -1, label: '−1' }, { value: 0, label: '0' }, { value: 1, label: '+1' }],
            series: [
              { points: flux01, color: c.chargeNeg },
              { points: emf01, color: c.chargePos, width: 2.5 },
            ],
            cursor: { x: now, y: emf(time) / peak, color: c.chargePos },
            legend: [
              { label: `flujo Φ (máx. ${si(phiMax(), 'Wb')})`, color: c.chargeNeg },
              { label: `tensión inducida (pico ${si(peak, 'V')})`, color: c.chargePos },
            ],
            xLabel: 'tiempo (ambas curvas relativas a su máximo)',
            yLabel: 'valor relativo',
          });
        },

        formulas() {
          const phi = flux(time);
          const rate = dFlux(time);
          const trend = Math.abs(rate) < phiMax() * 0.02 ? 'constante' : rate > 0 ? 'creciendo' : 'decreciendo';
          return [
            { name: 'Flujo magnético que atraviesa la bobina', sym: 'Φ = B · A (según la posición)', val: `Φ = ${si(phi, 'Wb')}  (${trend})` },
            { name: 'Rapidez con que cambia el flujo', sym: 'ΔΦ / Δt', val: `ΔΦ/Δt = ${si(rate, 'Wb/s')}` },
            { name: 'Ley de Faraday', sym: 'ε = −N · ΔΦ / Δt', val: `ε = −${params.n} · ${si(rate, 'Wb/s')} = ${si(emf(time), 'V')}` },
            {
              name: 'Ley de Lenz (sentido)',
              sym: 'el signo “−”',
              val: trend === 'constante' ? 'flujo constante: no hay corriente inducida' : trend === 'creciendo' ? 'el flujo aumenta → la corriente crea un campo que lo frena' : 'el flujo disminuye → la corriente crea un campo que lo sostiene',
            },
          ];
        },
      };
    },
  });
})();
