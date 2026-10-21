// Capítulo 36: salida de una espira con anillos (alterna) frente a la de un conmutador (continua
// pulsante). Con más bobinas desfasadas la salida se alisa: la tensión mínima es cos(π/2n) del pico.
// Modelo: en cada instante las escobillas toman la bobina de mayor tensión.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawResistor, polyline, text, circle, arrow, si, num } = Elec;

  const K = 0.02; //       V·s por bobina (N·B·A)
  const R_ARM = 1; //      Ω, resistencia del inducido
  const SLOW = 0.25; //    vueltas por segundo en pantalla
  const SAMPLES = 240;
  const TAU = Math.PI * 2;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Anillos y conmutador',
    label: 'Un rotor con una o más bobinas que alimenta una carga mediante anillos o mediante un conmutador, con la tensión de salida y su promedio',
    caption: 'Con anillos cada escobilla toca siempre el mismo extremo y la salida es alterna. Con conmutador las conexiones se invierten cada vez que la tensión de la bobina cambia de signo, y la salida es continua con ondulación. Rotación en cámara lenta.',
    chart: true,
    controls: [
      { type: 'choice', key: 'out', label: 'Salida', value: 'comm', options: [{ value: 'rings', label: 'Anillos (alterna)' }, { value: 'comm', label: 'Conmutador (continua)' }] },
      { key: 'n', label: 'Bobinas en el rotor', values: [1, 2, 4, 8, 16], value: 1, unit: '', format: (v) => `${v} (${2 * v} delgas)` },
      { key: 'rpm', label: 'Velocidad de giro', min: 600, max: 3000, step: 300, value: 1800, unit: 'rpm', format: (v) => `${v} rpm` },
      { key: 'r', label: 'Resistencia de la carga (R)', values: [1, 2, 5, 10, 20, 50], value: 5, unit: 'Ω' },
    ],

    setup({ params, chart }) {
      const wire = new FlowPath([], { closed: true });
      let theta = 0;
      const omega = () => (TAU * params.rpm) / 60;
      const peak = () => K * omega();
      /** fem de salida en función del ángulo del rotor */
      function eOut(a) {
        if (params.out === 'rings') return Math.sin(a);
        let best = 0;
        for (let k = 0; k < params.n; k++) best = Math.max(best, Math.abs(Math.sin(a - (k * Math.PI) / params.n)));
        return best;
      }
      const loadFactor = () => params.r / (params.r + R_ARM);
      function stats() {
        let sum = 0;
        let sumSq = 0;
        let min = Infinity;
        let max = -Infinity;
        for (let k = 0; k < 400; k++) {
          const v = eOut((k / 400) * TAU);
          sum += v;
          sumSq += v * v;
          min = Math.min(min, v);
          max = Math.max(max, v);
        }
        const avg = (sum / 400) * peak();
        return { avg, rms: Math.sqrt(sumSq / 400) * peak(), ripple: params.out === 'rings' ? null : (max - min) / max };
      }

      return {
        reset() {
          theta = 0;
          wire.phase = 0;
        },

        step(dt) {
          theta = (theta + TAU * SLOW * Math.max(0, dt)) % (2 * TAU);
          const e = eOut(theta) * (params.out === 'rings' ? 1 : 1);
          wire.advance(dt, -visualSpeed(e, 1) * (params.out === 'rings' ? Math.sign(e) : 1));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const compact = w < 520;
          const cx = compact ? w * 0.5 : w * 0.27;
          const cy = compact ? h * 0.27 : h * 0.5;
          const rr = Math.min(h * (compact ? 0.19 : 0.4), compact ? w * 0.28 : w * 0.2);
          const ringR = rr * 0.5;
          const segs = 2 * params.n;
          const e = eOut(theta) * peak();

          // bobinas del rotor (la de mayor tensión resaltada)
          const eachAngle = Math.PI / params.n;
          let active = 0;
          let activeVal = -1;
          for (let k = 0; k < params.n; k++) {
            const a = theta - k * eachAngle;
            if (Math.abs(Math.sin(a)) > activeVal) { activeVal = Math.abs(Math.sin(a)); active = k; }
          }
          for (let k = 0; k < params.n; k++) {
            const a = theta - k * eachAngle;
            const dx = -Math.sin(a) * rr;
            const dy = -Math.cos(a) * rr;
            const on = params.out === 'rings' ? k === 0 : k === active;
            polyline(ctx, [[cx - dx, cy - dy], [cx + dx, cy + dy]], { color: on ? c.accent : c.muted, width: on ? 5 : 2.5 });
          }

          // conmutador o anillos
          if (params.out === 'comm') {
            for (let k = 0; k < segs; k++) {
              const a0 = (k * TAU) / segs + theta - Math.PI / 2 - TAU / segs / 2 + 0.04;
              const a1 = a0 + TAU / segs - 0.08;
              ctx.beginPath();
              ctx.arc(cx, cy, ringR, a0, a1);
              ctx.strokeStyle = k % 2 ? c.chargeNeg : c.accent;
              ctx.lineWidth = Math.max(6, ringR * 0.3);
              ctx.lineCap = 'butt';
              ctx.stroke();
            }
          } else {
            circle(ctx, cx, cy, ringR, { stroke: c.accent, width: 7 });
            circle(ctx, cx, cy, ringR * 0.6, { stroke: c.chargeNeg, width: 7 });
          }
          circle(ctx, cx, cy, 3.5, { fill: c.wire });
          // escobillas fijas a las 9 y a las 3
          const bw = 16;
          const bh = 12;
          ctx.fillStyle = c.surface;
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 2.5;
          for (const sgn of [-1, 1]) {
            const bx = cx + sgn * (ringR + 6) - (sgn > 0 ? 0 : bw);
            ctx.fillRect(bx, cy - bh / 2, bw, bh);
            ctx.strokeRect(bx, cy - bh / 2, bw, bh);
          }
          text(ctx, params.out === 'comm' ? '+' : 'A', cx - ringR - 22, cy - 16, { align: 'center', size: 15, weight: 700, color: c.chargePos });
          text(ctx, params.out === 'comm' ? '−' : 'B', cx + ringR + 22, cy - 16, { align: 'center', size: 15, weight: 700, color: c.chargeNeg });
          text(ctx, params.out === 'comm' ? `conmutador de ${segs} delgas` : 'dos anillos', cx, cy + rr + 22, { align: 'center', size: 12, color: c.muted });

          // circuito exterior
          const x0 = compact ? w * 0.12 : w * 0.56;
          const x1 = compact ? w * 0.88 : w * 0.94;
          const y0 = compact ? h * 0.7 : h * 0.22;
          const y1 = compact ? h * 0.86 : h * 0.7;
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
          polyline(ctx, corners, { color: c.wire, width: 3, close: true });
          drawResistor(ctx, x1, (y0 + y1) / 2, { orient: 'v', len: Math.min(70, (y1 - y0) * 0.55), heat: Math.min(1, ((e * loadFactor()) ** 2 / params.r) / 4) });
          text(ctx, `R = ${si(params.r, 'Ω')}`, x1 - 26, (y0 + y1) / 2, { align: 'right', size: 12, color: c.accent });
          wire.setPoints(corners);
          wire.draw(ctx, { radius: compact ? 3.2 : 4, spacing: 24 });
          text(ctx, `${params.out === 'rings' ? 'v' : 'V'} = ${si(e * loadFactor(), 'V')} en la carga`, (x0 + x1) / 2, y0 - 14, { align: 'center', size: 13, weight: 600, color: c.chargePos });
          text(ctx, params.out === 'rings' ? 'la corriente cambia de sentido' : 'la corriente siempre en el mismo sentido', (x0 + x1) / 2, y1 + 18, { align: 'center', size: 12, color: c.muted });

          this.drawChart(c);
        },

        drawChart(c) {
          const T = 60 / params.rpm;
          const span = 2 * T;
          const single = [];
          const out = [];
          for (let k = 0; k <= SAMPLES; k++) {
            const a = (k / SAMPLES) * 2 * TAU;
            const t = (a / TAU) * T;
            single.push([t, Math.sin(a) * peak()]);
            out.push([t, eOut(a) * peak()]);
          }
          const st = stats();
          const ms = (v) => `${num(v * 1000, 3)} ms`;
          const now = theta % (2 * TAU);
          const top = Math.ceil(peak() * 1.2 * 10) / 10;
          chart.draw({
            xMax: span,
            yMin: -top,
            yMax: top,
            xTicks: [0, 0.5, 1, 1.5, 2].map((k) => ({ value: k * T, label: k === 0 ? '0' : ms(k * T) })),
            yTicks: [-top, 0, top].map((v) => ({ value: v, label: `${num(v)} V` })),
            series: [
              { points: single, color: c.muted, width: 1.5 },
              { points: out, color: c.accent, width: 3 },
            ],
            hlines: params.out === 'comm' ? [{ y: st.avg, label: `promedio ${si(st.avg, 'V')}`, color: c.good }] : [],
            cursor: { x: (now / TAU) * T, y: eOut(now) * peak(), color: c.accent },
            legend: [
              { label: `fem de una bobina (pico ${si(peak(), 'V')})`, color: c.muted },
              { label: params.out === 'rings' ? 'salida por anillos' : 'salida por conmutador', color: c.accent },
            ],
            xLabel: 'tiempo real',
            yLabel: 'fem (V)',
          });
        },

        formulas() {
          const st = stats();
          const lf = loadFactor();
          const rows = [
            { name: 'Tensión pico de una bobina', sym: 'V<sub>p</sub> = N·B·A·ω', val: `Vp = ${num(K)} · ${num(omega())} rad/s = ${si(peak(), 'V')}` },
          ];
          if (params.out === 'rings') {
            rows.push(
              { name: 'Valor medio de la salida', sym: '⟨v⟩ = 0', val: `⟨v⟩ = ${si(st.avg, 'V')} (alterna pura)` },
              { name: 'Valor eficaz', sym: 'V<sub>rms</sub> = V<sub>p</sub> / √2', val: `Vrms = ${si(peak() / Math.SQRT2, 'V')}` },
              { name: 'Potencia media en la carga', sym: 'P = V<sub>rms</sub>² · R / (R + r)² ', val: `P = ${si(((peak() / Math.SQRT2) * lf) ** 2 / params.r, 'W')}` },
            );
          } else {
            rows.push(
              { name: 'Tensión mínima respecto del pico', sym: 'V<sub>mín</sub> / V<sub>p</sub> = cos(π / 2n)', val: `cos(π / ${2 * params.n}) = ${num(params.n === 1 ? 0 : Math.cos(Math.PI / (2 * params.n)), 3)}` },
              { name: 'Ondulación', sym: '(V<sub>máx</sub> − V<sub>mín</sub>) / V<sub>máx</sub>', val: `${num(100 * st.ripple, 3)} %` },
              { name: 'Valor medio (la “continua”)', sym: '⟨v⟩ ≈ (2/π)·V<sub>p</sub> para n = 1', val: `⟨v⟩ = ${si(st.avg, 'V')}  (${num((100 * st.avg) / peak(), 3)} % del pico)` },
              { name: 'Corriente y potencia medias en la carga', sym: 'I = ⟨v⟩ / (R + r) · P = I² · R', val: `I = ${si(st.avg / (params.r + R_ARM), 'A')} · P ≈ ${si((st.avg * lf) ** 2 / params.r, 'W')}` },
            );
          }
          return rows;
        },
      };
    },
  });
})();
