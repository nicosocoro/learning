// Lección 4: carga y descarga de un capacitor a través de una resistencia (circuito RC).

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { FlowPath, visualSpeed } = Elec;
  const { drawBattery, drawResistor, polyline, text } = Elec;
  const { si, num } = Elec;

  const I_MAX = 12 / 100;
  const V_MAX = 12;
  const TAUS_SHOWN = 5; // la gráfica cubre 5τ (≈ 99 % del proceso)
  const MAX_POINTS = 300;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Carga y descarga de un capacitor',
    label: 'Circuito RC: batería, resistencia y capacitor con su gráfica de tensión',
    caption: 'Los electrones nunca cruzan el capacitor: se acumulan en una placa y se retiran de la otra, y el campo entre placas guarda la energía.',
    chart: true,
    controls: [
      {
        type: 'choice',
        key: 'mode',
        label: 'Proceso',
        value: 'charge',
        options: [{ value: 'charge', label: 'Cargar' }, { value: 'discharge', label: 'Descargar' }],
      },
      { key: 'v', label: 'Tensión de la fuente (V)', min: 1, max: V_MAX, step: 1, value: 9, unit: 'V' },
      { key: 'r', label: 'Resistencia (R)', min: 100, max: 5000, step: 100, value: 1000, unit: 'Ω' },
      { key: 'c', label: 'Capacidad (C)', min: 100, max: 2000, step: 100, value: 1000, scale: 1e-6, unit: 'F' },
    ],

    setup({ params, chart }) {
      const path = new FlowPath();
      let vc = 0; //         tensión actual del capacitor
      let vStart = 0; //     tensión al comenzar el proceso actual
      let elapsed = 0; //    tiempo desde que empezó el proceso actual
      let lastPush = 0;
      let points = [];

      const tau = () => params.r * params.c;
      const target = () => (params.mode === 'charge' ? params.v : 0);
      const current = () => (target() - vc) / params.r; // > 0 carga al capacitor

      function startPhase() {
        vStart = vc;
        elapsed = 0;
        lastPush = 0;
        points = [[0, vc]];
      }
      startPhase();

      return {
        onChange: startPhase,

        reset() {
          vc = params.mode === 'discharge' ? params.v : 0;
          path.phase = 0;
          startPhase();
        },

        step(dt) {
          vc += (target() - vc) * (1 - Math.exp(-dt / tau()));
          elapsed += dt;
          const window = TAUS_SHOWN * tau();
          if (elapsed <= window && elapsed - lastPush >= window / MAX_POINTS) {
            points.push([elapsed, vc]);
            lastPush = elapsed;
          }
          const i = current();
          path.advance(dt, -Math.sign(i) * visualSpeed(i, I_MAX));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const x0 = Math.max(w * 0.16, 70);
          const x1 = w * 0.66;
          const y0 = h * 0.2;
          const y1 = h * 0.8;
          const ym = (y0 + y1) / 2;
          const gap = 14;
          const half = Math.min(32, w * 0.07); // semiancho de las placas
          const route = [[x1, ym + gap / 2], [x1, y1], [x0, y1], [x0, y0], [x1, y0], [x1, ym - gap / 2]];
          const charged = Math.min(vc / V_MAX, 1);

          polyline(ctx, route, { color: c.wire, width: 3 });
          if (params.mode === 'charge') {
            drawBattery(ctx, x0, ym, { orient: 'v' });
            text(ctx, si(params.v, 'V'), x0 - 32, ym, { align: 'right', weight: 600, color: c.accent });
          } else {
            text(ctx, 'sin fuente', x0 - 12, ym, { align: 'right', color: c.muted, size: 12 });
          }
          drawResistor(ctx, (x0 + x1) / 2, y0, { len: Math.min(100, w * 0.22), heat: Math.sqrt(Math.abs(current()) / I_MAX) });
          text(ctx, `R = ${si(params.r, 'Ω')}`, (x0 + x1) / 2, y0 - 30, { align: 'center', weight: 600 });

          // Campo entre placas (más intenso cuanto más cargado)
          ctx.save();
          ctx.globalAlpha = 0.35 * charged;
          ctx.fillStyle = c.accent;
          ctx.fillRect(x1 - half, ym - gap / 2, half * 2, gap);
          ctx.restore();

          // Placas del capacitor
          polyline(ctx, [[x1 - half, ym - gap / 2], [x1 + half, ym - gap / 2]], { color: c.text, width: 4 });
          polyline(ctx, [[x1 - half, ym + gap / 2], [x1 + half, ym + gap / 2]], { color: c.text, width: 4 });

          // Signos acumulados en cada placa
          const signs = Math.round(charged * 7);
          for (let n = 0; n < signs; n++) {
            const x = x1 - half + 8 + (n * (half * 2 - 16)) / 6;
            text(ctx, '+', x, ym - gap / 2 - 10, { color: c.chargePos, align: 'center', weight: 700, size: 14 });
            text(ctx, '−', x, ym + gap / 2 + 10, { color: c.chargeNeg, align: 'center', weight: 700, size: 14 });
          }

          text(ctx, 'vC', x1 + half + 14, ym - 10, { color: c.muted, size: 12 });
          text(ctx, si(vc, 'V'), x1 + half + 14, ym + 8, { color: c.accent, weight: 600 });

          path.setPoints(route);
          path.draw(ctx);

          this.drawChart(c);
        },

        drawChart(c) {
          const span = TAUS_SHOWN * tau();
          const yMax = Math.max(1, Math.ceil(Math.max(params.v, vStart)));
          const finalV = target();
          const reference = [];
          if (Math.abs(finalV - vStart) > 1e-9) {
            reference.push({
              y: vStart + (finalV - vStart) * (1 - Math.exp(-1)),
              label: params.mode === 'charge' ? '63 % en 1τ' : '37 % en 1τ',
              color: c.heat,
            });
          }
          chart.draw({
            xMax: span,
            yMax,
            xTicks: Array.from({ length: TAUS_SHOWN + 1 }, (_, k) => ({ value: k * tau(), label: k === 0 ? '0' : `${k}τ` })),
            yTicks: [0, 0.5, 1].map((f) => ({ value: f * yMax, label: `${num(f * yMax)} V` })),
            series: [{ points, color: c.accent }],
            hlines: [{ y: finalV, label: `valor final ${num(finalV)} V`, color: c.good }, ...reference],
            cursor: elapsed <= span ? { x: elapsed, y: vc, color: c.chargePos } : null,
            xLabel: `tiempo (τ = ${si(tau(), 's')})`,
            yLabel: 'tensión del capacitor vC',
          });
        },

        formulas() {
          const t = tau();
          const finalV = target();
          const i = current();
          return [
            { name: 'Constante de tiempo', sym: 'τ = R · C', val: `τ = ${si(params.r, 'Ω')} · ${si(params.c, 'F')} = ${si(t, 's')}` },
            { name: 'Tiempo transcurrido', sym: 't', val: `t = ${si(elapsed, 's')} = ${num(elapsed / t)} τ` },
            {
              name: 'Tensión del capacitor',
              sym: 'v<sub>C</sub>(t) = V<sub>f</sub> + (V<sub>0</sub> − V<sub>f</sub>) · e<sup>−t/τ</sup>',
              val: `vC = ${si(finalV, 'V')} + (${si(vStart, 'V')} − ${si(finalV, 'V')}) · e^(−${num(elapsed / t)}) = ${si(vc, 'V')}`,
            },
            { name: 'Corriente en el circuito', sym: 'i = (V<sub>f</sub> − v<sub>C</sub>) / R', val: `i = (${si(finalV, 'V')} − ${si(vc, 'V')}) / ${si(params.r, 'Ω')} = ${si(i, 'A')}` },
            { name: 'Energía almacenada', sym: 'E = ½ · C · v<sub>C</sub>²', val: `E = ½ · ${si(params.c, 'F')} · (${si(vc, 'V')})² = ${si(0.5 * params.c * vc * vc, 'J')}` },
          ];
        },
      };
    },
  });
})();
