// Lección 1: la diferencia de potencial como "altura" por la que caen las cargas.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { polyline, text, arrow, chargeDot, circle } = Elec;
  const { si, num } = Elec;

  const WINDOW = 2; // segundos usados para medir I = Q / t
  const MAX_VOLTS = 12;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Cargas que caen por una diferencia de potencial',
    label: 'Cargas positivas bajando por una rampa entre dos puntos con distinto potencial',
    caption: 'La altura de cada punto representa su potencial. Las cargas positivas “caen” del potencial alto al bajo y entregan energía en el camino.',
    controls: [
      { key: 'va', label: 'Potencial en A (V<sub>A</sub>)', min: 0, max: MAX_VOLTS, step: 0.5, value: 9, unit: 'V' },
      { key: 'vb', label: 'Potencial en B (V<sub>B</sub>)', min: 0, max: MAX_VOLTS, step: 0.5, value: 3, unit: 'V' },
      { key: 'q', label: 'Carga de cada partícula (q)', min: 1, max: 5, step: 1, value: 2, scale: 1e-3, unit: 'C' },
      { key: 'rate', label: 'Partículas lanzadas por segundo', min: 1, max: 10, step: 1, value: 4, unit: '/s' },
    ],

    setup({ params }) {
      let particles, arrivals, time, spawn, totalQ, totalW, lastDir;

      function reset() {
        particles = [];
        arrivals = [];
        time = 0;
        spawn = 0;
        totalQ = 0;
        totalW = 0;
        lastDir = null;
      }
      reset();

      const drop = () => Math.abs(params.va - params.vb);
      // Medición de corriente: carga que llegó a destino en la última ventana de tiempo.
      const windowSpan = () => Math.max(Math.min(time, WINDOW), 0.5);
      const windowCharge = () => arrivals.reduce((sum, a) => sum + a.q, 0);
      const current = () => windowCharge() / windowSpan();

      return {
        reset,

        step(dt) {
          const dv = drop();
          const dir = Math.sign(params.va - params.vb);
          if (dir !== lastDir) {
            particles = [];
            lastDir = dir;
          }
          time += dt;

          if (dir !== 0) {
            spawn += params.rate * dt;
            while (spawn >= 1) {
              particles.push({ s: 0, q: params.q });
              spawn -= 1;
            }
          }

          const speed = 0.12 + 0.05 * dv; // fracción del recorrido por segundo
          for (const p of particles) p.s += speed * dt;
          for (const p of particles) {
            if (p.s < 1) continue;
            arrivals.push({ t: time, q: p.q });
            totalQ += p.q;
            totalW += p.q * dv;
          }
          particles = particles.filter((p) => p.s < 1);
          arrivals = arrivals.filter((a) => time - a.t <= WINDOW);
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const padX = Math.max(46, w * 0.1);
          const xA = padX + 20;
          const xB = w - padX - 70;
          const xDim = w - 40;
          const baseY = h - 34;
          const topY = 38;
          const k = (baseY - topY) / MAX_VOLTS;
          const yA = baseY - params.va * k;
          const yB = baseY - params.vb * k;

          // Referencia de 0 V
          polyline(ctx, [[padX, baseY], [xDim, baseY]], { color: c.muted, width: 1, dash: [4, 4] });
          text(ctx, '0 V (referencia)', padX, baseY + 14, { color: c.muted, size: 11 });

          // Postes A y B
          polyline(ctx, [[xA, baseY], [xA, yA]], { color: c.wire, width: 5 });
          polyline(ctx, [[xB, baseY], [xB, yB]], { color: c.wire, width: 5 });
          circle(ctx, xA, yA, 6, { fill: c.accent });
          circle(ctx, xB, yB, 6, { fill: c.accent });
          text(ctx, `A · ${si(params.va, 'V')}`, xA, yA - 16, { align: 'center', weight: 600 });
          text(ctx, `B · ${si(params.vb, 'V')}`, xB, yB - 16, { align: 'center', weight: 600 });

          // Rampa
          polyline(ctx, [[xA, yA], [xB, yB]], { color: c.wire, width: 3 });

          // Cota de ΔV
          const dv = drop();
          if (dv > 0) {
            polyline(ctx, [[xA, yA], [xDim, yA]], { color: c.muted, width: 1, dash: [3, 4] });
            polyline(ctx, [[xB, yB], [xDim, yB]], { color: c.muted, width: 1, dash: [3, 4] });
            const hi = Math.min(yA, yB);
            const lo = Math.max(yA, yB);
            arrow(ctx, xDim, (hi + lo) / 2, xDim, hi, { color: c.accent, width: 1.5 });
            arrow(ctx, xDim, (hi + lo) / 2, xDim, lo, { color: c.accent, width: 1.5 });
            text(ctx, `ΔV = ${si(dv, 'V')}`, xDim - 8, (hi + lo) / 2, { color: c.accent, align: 'right', weight: 600 });
          } else {
            text(ctx, 'ΔV = 0: sin diferencia de potencial no hay movimiento', w / 2, topY - 12, { color: c.muted, align: 'center' });
          }

          // Cargas rodando de alto a bajo potencial
          const hiPoint = params.va >= params.vb ? [xA, yA] : [xB, yB];
          const loPoint = params.va >= params.vb ? [xB, yB] : [xA, yA];
          for (const p of particles) {
            const x = hiPoint[0] + (loPoint[0] - hiPoint[0]) * p.s;
            const y = hiPoint[1] + (loPoint[1] - hiPoint[1]) * p.s;
            chargeDot(ctx, x, y - 10, 7, c.chargePos, '+');
          }

          text(ctx, `Carga que pasó: ${si(totalQ, 'C')}`, w - 12, 14, { color: c.muted, size: 12, align: 'right' });
        },

        formulas() {
          const dv = drop();
          const hi = Math.max(params.va, params.vb);
          const lo = Math.min(params.va, params.vb);
          const i = current();
          return [
            {
              name: 'Diferencia de potencial',
              sym: 'ΔV = V<sub>alto</sub> − V<sub>bajo</sub>',
              val: `ΔV = ${si(hi, 'V')} − ${si(lo, 'V')} = ${si(dv, 'V')}`,
            },
            {
              name: 'Energía que entrega cada carga',
              sym: 'W = q · ΔV',
              val: `W = ${si(params.q, 'C')} · ${si(dv, 'V')} = ${si(params.q * dv, 'J')}`,
            },
            {
              name: 'Corriente (carga por segundo)',
              sym: 'I = Q / t',
              val: `I = ${si(windowCharge(), 'C')} / ${num(windowSpan())} s = ${si(i, 'A')}`,
            },
            {
              name: 'Potencia',
              sym: 'P = I · ΔV',
              val: `P = ${si(i, 'A')} · ${si(dv, 'V')} = ${si(i * dv, 'W')}`,
            },
            {
              name: 'Energía total entregada',
              sym: 'W<sub>total</sub> = Q · ΔV',
              val: `W = ${si(totalW, 'J')}`,
            },
          ];
        },
      };
    },
  });
})();
