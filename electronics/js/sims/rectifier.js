// Capítulo 7: rectificador de media onda y de onda completa, con y sin capacitor de filtro.
// La red es de 50 Hz y la simulación corre en cámara lenta (÷50) para poder seguirla.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawDiode, drawResistor, drawAcSource, polyline, text, arrow, si, num } = Elec;

  const MAINS = 50; //          Hz
  const SLOWDOWN = 50;
  const DROP = 0.7; //          V por diodo conduciendo
  const WINDOW = 0.06; //       s mostrados (3 ciclos)
  const STEP = 0.0001; //       s por paso de cálculo
  const WARMUP = 0.6; //        s simulados antes de registrar, hasta llegar al régimen
  const I_MAX = 0.5;

  /** Simula el rectificador y devuelve las muestras de una ventana de 60 ms en régimen. */
  function simulate({ kind, vp, c, r }) {
    const farads = c * 1e-6;
    const drops = kind === 'half' ? DROP : 2 * DROP;
    const out = { t: [], vin: [], vout: [], diode: [] };
    let vc = 0;
    const total = Math.round((WARMUP + WINDOW) / STEP);
    for (let n = 0; n < total; n++) {
      const t = n * STEP;
      const vin = vp * Math.sin(2 * Math.PI * MAINS * t);
      const source = Math.max((kind === 'half' ? Math.max(vin, 0) : Math.abs(vin)) - drops, 0);
      let conducting = false;
      if (!farads) {
        vc = source;
        conducting = source > 0;
      } else if (source > vc) {
        vc = source;
        conducting = true;
      } else {
        vc *= Math.exp(-STEP / (r * farads));
      }
      if (t >= WARMUP) {
        out.t.push(t - WARMUP);
        out.vin.push(vin);
        out.vout.push(vc);
        out.diode.push(conducting);
      }
    }
    return out;
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Rectificador con filtro',
    label: 'Fuente alterna con diodo o puente rectificador, capacitor de filtro y carga, con las gráficas de tensión de entrada y salida',
    caption: 'La red es de 50 Hz y se muestra en cámara lenta (÷50). El diodo se ilumina cuando conduce.',
    chart: true,
    controls: [
      { type: 'choice', key: 'kind', label: 'Tipo de rectificador', value: 'full', options: [{ value: 'half', label: 'Media onda (1 diodo)' }, { value: 'full', label: 'Onda completa (puente)' }] },
      { key: 'vp', label: 'Tensión pico de la fuente (V<sub>p</sub>)', min: 5, max: 24, step: 1, value: 12, unit: 'V' },
      { key: 'c', label: 'Capacitor de filtro (C)', values: [0, 100, 470, 1000, 2200, 4700], value: 470, unit: 'F', format: (v) => (v === 0 ? 'sin capacitor' : `${v} µF`) },
      { key: 'r', label: 'Resistencia de la carga (R)', min: 20, max: 500, step: 10, value: 100, unit: 'Ω' },
    ],

    setup({ params, chart }) {
      const supply = new FlowPath();
      const load = new FlowPath();
      let time = 0; // segundos "reales" de la red (ya sin cámara lenta)
      let cache = { key: '', data: null };

      function data() {
        const key = `${params.kind}|${params.vp}|${params.c}|${params.r}`;
        if (cache.key !== key) {
          const d = simulate(params);
          const vmax = Math.max(...d.vout);
          const vmin = Math.min(...d.vout);
          const mean = d.vout.reduce((a, b) => a + b, 0) / d.vout.length;
          cache = { key, data: { ...d, vmax, vmin, mean, ripple: vmax - vmin } };
        }
        return cache.data;
      }
      const index = () => Math.min(data().t.length - 1, Math.floor((time % WINDOW) / STEP));

      return {
        reset() {
          time = 0;
        },

        step(dt) {
          time += dt / SLOWDOWN;
          const d = data();
          const i = index();
          const iLoad = d.vout[i] / params.r;
          load.advance(dt, -visualSpeed(iLoad, I_MAX));
          const sign = params.kind === 'full' ? Math.sign(d.vin[i]) || 1 : 1;
          supply.advance(dt, d.diode[i] ? -sign * visualSpeed(Math.max(iLoad * 2.5, 0.05), I_MAX) : 0);
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const d = data();
          const i = index();
          const x0 = Math.max(w * 0.1, 40);
          const xd = w * 0.3;
          const xc = w * 0.56;
          const xr = w * 0.86;
          const y0 = h * 0.2;
          const y1 = h * 0.72;
          const ym = (y0 + y1) / 2;
          const conducting = d.diode[i];

          // Cables
          polyline(ctx, [[x0, y1], [xr, y1], [xr, y0], [x0, y0], [x0, y1]], { color: c.wire, width: 3 });
          drawAcSource(ctx, x0, ym);

          // Diodo o puente
          if (params.kind === 'half') {
            drawDiode(ctx, xd, y0, { on: conducting });
            text(ctx, 'diodo', xd, y0 - 26, { align: 'center', size: 12, color: c.muted });
          } else {
            ctx.fillStyle = c.surface;
            ctx.fillRect(xd - 34, y0 - 20, 68, 40);
            ctx.strokeStyle = c.wire;
            ctx.lineWidth = 2.5;
            ctx.strokeRect(xd - 34, y0 - 20, 68, 40);
            ctx.save();
            ctx.translate(xd, y0);
            ctx.rotate(Math.PI / 4);
            ctx.strokeStyle = conducting ? c.heat : c.wire;
            ctx.lineWidth = 2.5;
            ctx.strokeRect(-12, -12, 24, 24);
            ctx.restore();
            text(ctx, 'puente de 4 diodos', xd, y0 - 26, { align: 'center', size: 12, color: c.muted });
          }

          // Capacitor (si hay) y carga
          if (params.c > 0) {
            const gap = 12;
            ctx.fillStyle = c.surface;
            ctx.fillRect(xc - 30, ym - 26, 60, 52);
            polyline(ctx, [[xc - 22, ym - gap / 2], [xc + 22, ym - gap / 2]], { color: c.text, width: 4 });
            polyline(ctx, [[xc - 22, ym + gap / 2], [xc + 22, ym + gap / 2]], { color: c.text, width: 4 });
            text(ctx, `${params.c} µF`, xc - 28, ym, { align: 'right', size: 12, color: c.muted });
            polyline(ctx, [[xc, y0], [xc, ym - gap / 2]], { color: c.wire, width: 3 });
            polyline(ctx, [[xc, ym + gap / 2], [xc, y1]], { color: c.wire, width: 3 });
          }
          drawResistor(ctx, xr, ym, { orient: 'v', len: 80, heat: Math.min(1, (d.vout[i] ** 2 / params.r) / 3) });
          text(ctx, `R = ${si(params.r, 'Ω')}`, xr, y0 - 18, { align: 'center', size: 12, weight: 600 });

          // Cargas en movimiento
          supply.setPoints([[xc, y1], [x0, y1], [x0, y0], [xc, y0]]);
          load.setPoints([[xc, y0], [xr, y0], [xr, y1], [xc, y1]]);
          supply.draw(ctx, { radius: 4, spacing: 22 });
          load.draw(ctx, { radius: 4, spacing: 22 });

          text(ctx, `v salida = ${si(d.vout[i], 'V')}`, xr, y1 + 24, { align: 'right', size: 12, weight: 600, color: c.accent });
          arrow(ctx, xr - 10, y1 + 44, xr - 60, y1 + 44, { color: c.chargePos, width: 1.5 });
          text(ctx, 'sentido de la corriente en la carga', xr, y1 + 58, { align: 'right', size: 11, color: c.muted });
          this.drawChart(c, d, i);
        },

        drawChart(c, d, i) {
          const peak = Math.ceil(params.vp);
          const narrow = (document.querySelector('.chart-canvas')?.clientWidth ?? 999) < 520;
          const pts = (arr) => d.t.map((t, n) => [t, arr[n]]).filter((_, n) => n % 2 === 0);
          chart.draw({
            xMax: WINDOW,
            yMin: -peak,
            yMax: peak,
            xTicks: [0, 1, 2, 3, 4, 5, 6].filter((k) => !narrow || k % 2 === 0).map((k) => ({ value: k * 0.01, label: `${k * 10} ms` })),
            yTicks: [-peak, -peak / 2, 0, peak / 2, peak].map((y) => ({ value: y, label: `${num(y)} V` })),
            series: [
              { points: pts(d.vin), color: c.grid, width: 2 },
              { points: pts(d.vout), color: c.accent, width: 3 },
            ],
            cursor: { x: d.t[i], y: d.vout[i], color: c.chargePos },
            legend: [{ label: 'entrada (alterna)', color: c.muted }, { label: 'salida rectificada', color: c.accent }],
            xLabel: 'tiempo (3 ciclos de 20 ms)',
            yLabel: 'tensión (V)',
          });
        },

        formulas() {
          const d = data();
          const drops = params.kind === 'half' ? DROP : 2 * DROP;
          const ripple = params.kind === 'half' ? MAINS : 2 * MAINS;
          const iAvg = d.mean / params.r;
          const estimate = params.c ? iAvg / (ripple * params.c * 1e-6) : null;
          return [
            { name: 'Caída en los diodos que conducen', sym: params.kind === 'half' ? 'V<sub>D</sub> = 0,7 V' : 'V<sub>D</sub> = 2 · 0,7 V', val: `Vd = ${si(drops, 'V')}` },
            { name: 'Pico a la salida', sym: 'V<sub>máx</sub> = V<sub>p</sub> − V<sub>D</sub>', val: `Vmáx = ${si(params.vp, 'V')} − ${si(drops, 'V')} = ${si(Math.max(params.vp - drops, 0), 'V')}` },
            { name: 'Frecuencia del rizado', sym: 'f<sub>r</sub>', val: `${ripple} Hz (${params.kind === 'half' ? '1 pulso por ciclo' : '2 pulsos por ciclo'})` },
            { name: 'Valor medio de la salida (medido)', sym: 'V<sub>dc</sub>', val: `Vdc = ${si(d.mean, 'V')}` },
            { name: 'Rizado pico a pico (medido)', sym: 'ΔV = V<sub>máx</sub> − V<sub>mín</sub>', val: `ΔV = ${si(d.vmax, 'V')} − ${si(d.vmin, 'V')} = ${si(d.ripple, 'V')}` },
            { name: 'Rizado estimado con el capacitor', sym: 'ΔV ≈ I / (f<sub>r</sub> · C)', val: estimate === null ? 'sin capacitor: la salida llega a 0 V entre pulsos' : `ΔV ≈ ${si(iAvg, 'A')} / (${ripple} Hz · ${params.c} µF) = ${si(estimate, 'V')}` },
          ];
        },
      };
    },
  });
})();
