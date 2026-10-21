// Capítulo 35: un alternador trifásico visto en corte. El rotor (con 2p polos) gira dentro de un
// estator con tres devanados repartidos a 120° eléctricos. La frecuencia sale de las rpm y de los
// polos; la tensión, de la excitación y de la frecuencia. El giro se anima en cámara lenta.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, polyline, text, circle, arrow, si, num } = Elec;

  const V_REF = 311; //      V pico por fase con excitación 1 y 50 Hz (220 V eficaces)
  const F_REF = 50; //       Hz
  const SLOW = 0.25; //      ciclos eléctricos por segundo en pantalla a 50 Hz
  const SAMPLES = 220;
  const TAU = Math.PI * 2;
  const PHASES = 3;
  const SHIFT = TAU / PHASES;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Un alternador trifásico',
    label: 'Corte de un alternador con un rotor de polos alternados y tres devanados en el estator, con las tensiones de las tres fases',
    caption: 'Los tres devanados (A, B y C) se iluminan según la tensión de cada fase. La rotación está en cámara lenta y proporcional a la frecuencia; con más polos el eje gira más despacio para la misma frecuencia.',
    chart: true,
    controls: [
      { key: 'rpm', label: 'Velocidad del eje (n)', values: [100, 125, 250, 500, 750, 1000, 1500, 3000, 3600], value: 1500, unit: 'rpm', format: (v) => `${v} rpm` },
      { key: 'p', label: 'Pares de polos (p)', min: 1, max: 30, step: 1, value: 2, unit: '', format: (v) => `${v} pares (${2 * v} polos)` },
      { key: 'ie', label: 'Excitación (corriente de campo)', min: 0.2, max: 1.2, step: 0.1, value: 1, unit: '', format: (v) => `${num(v)} de la nominal` },
      { type: 'choice', key: 'view', label: 'Curvas', value: 'three', options: [{ value: 'one', label: 'Una fase' }, { value: 'three', label: 'Tres fases' }] },
    ],

    setup({ params, chart }) {
      let thetaE = 0; // ángulo eléctrico acumulado
      const freq = () => (params.p * params.rpm) / 60;
      const peak = () => V_REF * params.ie * (freq() / F_REF);
      const volt = (k, a) => peak() * Math.sin(a - k * SHIFT);

      return {
        reset() { thetaE = 0; },

        step(dt) {
          thetaE = (thetaE + TAU * SLOW * (freq() / F_REF) * Math.max(0, dt)) % (2 * TAU);
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const compact = w < 520;
          const cx = compact ? w * 0.5 : w * 0.28;
          const cy = compact ? h * 0.5 : h * 0.5;
          const rOut = Math.min(h * (compact ? 0.38 : 0.44), compact ? w * 0.4 : w * 0.24);
          const rIn = rOut * 0.66;
          const rRotor = rOut * 0.58;
          const thetaM = thetaE / params.p; // el rotor da una vuelta cada p ciclos eléctricos
          const poles = 2 * params.p;

          // estator
          circle(ctx, cx, cy, rOut, { fill: c.surface, stroke: c.wire, width: 3 });
          circle(ctx, cx, cy, rIn, { fill: c.bg, stroke: c.wire, width: 1.5 });
          // devanados: 3·p posiciones repartidas, fases A B C en orden
          const n = PHASES * params.p;
          const colors3 = [c.accent, c.chargePos, c.chargeNeg];
          const phaseNames = ['A', 'B', 'C'];
          for (let k = 0; k < n; k++) {
            const phase = k % PHASES;
            const ang = -Math.PI / 2 + (k * TAU) / n;
            const rm = (rOut + rIn) / 2;
            const px = cx + Math.cos(ang) * rm;
            const py = cy + Math.sin(ang) * rm;
            const v = volt(phase, thetaE) / (peak() || 1);
            const size = Math.max(2.5, Math.min(15, (rOut - rIn) * 0.42, ((TAU * rm) / n) * 0.42));
            ctx.save();
            ctx.globalAlpha = 0.18 + 0.82 * Math.abs(v);
            circle(ctx, px, py, size, { fill: colors3[phase] });
            ctx.restore();
            circle(ctx, px, py, size, { stroke: colors3[phase], width: 2 });
            if (params.p <= 4) text(ctx, phaseNames[phase], px, py, { align: 'center', size: Math.max(9, size * 0.9), weight: 700, color: c.text });
          }

          // rotor con polos alternados N / S
          for (let k = 0; k < poles; k++) {
            const a0 = thetaM + (k * TAU) / poles - Math.PI / 2 - Math.PI / poles * 0.8;
            const a1 = a0 + (TAU / poles) * 0.8;
            ctx.beginPath();
            ctx.arc(cx, cy, rRotor, a0, a1);
            ctx.arc(cx, cy, rRotor * 0.45, a1, a0, true);
            ctx.closePath();
            ctx.fillStyle = k % 2 ? c.chargeNeg : c.chargePos;
            ctx.globalAlpha = 0.45 + 0.5 * Math.min(1, params.ie);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = c.text;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            if (poles <= 8) {
              const am = (a0 + a1) / 2;
              text(ctx, k % 2 ? 'S' : 'N', cx + Math.cos(am) * rRotor * 0.74, cy + Math.sin(am) * rRotor * 0.74, { align: 'center', size: 13, weight: 700, color: '#fff' });
            }
          }
          circle(ctx, cx, cy, 4, { fill: c.wire });
          // marca para ver girar el eje
          polyline(ctx, [[cx, cy], [cx + Math.cos(thetaM - Math.PI / 2) * rRotor * 0.45, cy + Math.sin(thetaM - Math.PI / 2) * rRotor * 0.45]], { color: c.text, width: 3 });
          text(ctx, 'estator (fijo)', cx, cy - rOut - 12, { align: 'center', size: 12, color: c.muted });
          text(ctx, `rotor · ${poles} polos`, cx, cy + rOut + 14, { align: 'center', size: 12, color: c.muted });

          // lecturas
          const tx = compact ? w * 0.08 : w * 0.56;
          const ty = compact ? h * 0.06 : h * 0.2;
          const lines = [
            [`f = p · n / 60 = ${num(freq(), 4)} Hz`, c.accent],
            [`tensión de fase: ${si(peak() / Math.SQRT2, 'V')} eficaces`, c.text],
            [`tensión de línea: ${si((peak() / Math.SQRT2) * Math.sqrt(3), 'V')} eficaces`, c.text],
          ];
          if (!compact) {
            lines.forEach(([str, col], k) => text(ctx, str, tx, ty + k * 24, { size: 13.5, color: col, weight: k === 0 ? 700 : 400 }));
            // fasores
            const fx = w * 0.76;
            const fy = h * 0.66;
            const fr = Math.min(h * 0.22, w * 0.11);
            polyline(ctx, [[fx - fr * 1.15, fy], [fx + fr * 1.15, fy]], { color: c.grid, width: 1 });
            polyline(ctx, [[fx, fy - fr * 1.15], [fx, fy + fr * 1.15]], { color: c.grid, width: 1 });
            for (let k = 0; k < PHASES; k++) {
              const a = -(thetaE - k * SHIFT);
              arrow(ctx, fx, fy, fx + Math.cos(a) * fr, fy + Math.sin(a) * fr, { color: colors3[k], width: 3, head: 8 });
            }
            text(ctx, 'fasores de las tres fases (120° entre sí)', fx, fy + fr + 24, { align: 'center', size: 12, color: c.muted });
          }

          this.drawChart(c);
        },

        drawChart(c) {
          const T = 1 / freq();
          const span = 2 * T;
          const colors3 = [c.accent, c.chargePos, c.chargeNeg];
          const series = [];
          const count = params.view === 'one' ? 1 : PHASES;
          for (let k = 0; k < count; k++) {
            const pts = [];
            for (let s = 0; s <= SAMPLES; s++) {
              const a = (s / SAMPLES) * 2 * TAU;
              pts.push([(a / TAU) * T, Math.sin(a - k * SHIFT)]);
            }
            series.push({ points: pts, color: colors3[k], width: params.view === 'one' ? 3 : 2.5 });
          }
          const now = thetaE % (2 * TAU);
          const ms = (v) => `${num(v * 1000, 3)} ms`;
          chart.draw({
            xMax: span,
            yMin: -1.2,
            yMax: 1.2,
            xTicks: [0, 0.5, 1, 1.5, 2].map((k) => ({ value: k * T, label: k === 0 ? '0' : ms(k * T) })),
            yTicks: [{ value: -1, label: '−1' }, { value: 0, label: '0' }, { value: 1, label: '+1' }],
            series,
            cursor: { x: (now / TAU) * T, y: Math.sin(now), color: colors3[0] },
            legend: ['A', 'B', 'C'].slice(0, count).map((n, k) => ({ label: `fase ${n} (pico ${si(peak(), 'V')})`, color: colors3[k] })),
            xLabel: 'tiempo real (relativo al pico de cada fase)',
            yLabel: 'tensión relativa',
          });
        },

        formulas() {
          const f = freq();
          const vf = peak() / Math.SQRT2;
          return [
            { name: 'Frecuencia eléctrica', sym: 'f = p · n / 60', val: `f = ${params.p} · ${params.rpm} / 60 = ${num(f, 4)} Hz` },
            { name: 'Tensión pico por fase (crece con la excitación y con la frecuencia)', sym: 'V<sub>p</sub> ∝ I<sub>campo</sub> · f', val: `Vp = ${num(V_REF)} V · ${num(params.ie)} · ${num(f / F_REF)} = ${si(peak(), 'V')}` },
            { name: 'Tensión eficaz de fase', sym: 'V<sub>F</sub> = V<sub>p</sub> / √2', val: `VF = ${si(peak(), 'V')} / 1,414 = ${si(vf, 'V')}` },
            { name: 'Tensión eficaz de línea (conexión estrella)', sym: 'V<sub>L</sub> = √3 · V<sub>F</sub>', val: `VL = 1,732 · ${si(vf, 'V')} = ${si(vf * Math.sqrt(3), 'V')}` },
            { name: 'Suma de las tres fases', sym: 'v<sub>A</sub> + v<sub>B</sub> + v<sub>C</sub>', val: `${Math.abs(volt(0, thetaE) + volt(1, thetaE) + volt(2, thetaE)) < 1e-6 * peak() ? '0 V' : si(volt(0, thetaE) + volt(1, thetaE) + volt(2, thetaE), 'V')} (siempre 0)` },
            { name: 'Velocidad que necesitaría para 50 Hz con estos polos', sym: 'n = 60 · f / p', val: `n = 60 · 50 / ${params.p} = ${num((60 * F_REF) / params.p, 4)} rpm` },
          ];
        },
      };
    },
  });
})();
