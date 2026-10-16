// Lección 3: resistencias en serie y en paralelo.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { FlowPath, visualSpeed } = Elec;
  const { drawBattery, drawResistor, polyline, text, circle } = Elec;
  const { si } = Elec;

  const I_MAX = 12 / 10 + 12 / 10; // dos ramas de 10 Ω a 12 V

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Dos resistencias en serie o en paralelo',
    label: 'Dos resistencias conectadas en serie o en paralelo a una batería',
    caption: 'En serie hay un único camino: pasa la misma corriente por todas. En paralelo la corriente se reparte entre las ramas.',
    controls: [
      {
        type: 'choice',
        key: 'mode',
        label: 'Conexión',
        value: 'series',
        options: [{ value: 'series', label: 'Serie' }, { value: 'parallel', label: 'Paralelo' }],
      },
      { key: 'v', label: 'Tensión de la batería (V)', min: 1, max: 12, step: 1, value: 9, unit: 'V' },
      { key: 'r1', label: 'Resistencia R<sub>1</sub>', min: 10, max: 500, step: 10, value: 100, unit: 'Ω' },
      { key: 'r2', label: 'Resistencia R<sub>2</sub>', min: 10, max: 500, step: 10, value: 200, unit: 'Ω' },
    ],

    setup({ params }) {
      // Serie: un lazo cerrado. Paralelo: 7 tramos, cada uno con su propia corriente.
      const loop = new FlowPath([], { closed: true });
      const branches = Array.from({ length: 7 }, () => new FlowPath());

      const isSeries = () => params.mode === 'series';
      const currents = () => {
        if (isSeries()) {
          const i = params.v / (params.r1 + params.r2);
          return { total: i, i1: i, i2: i };
        }
        const i1 = params.v / params.r1;
        const i2 = params.v / params.r2;
        return { total: i1 + i2, i1, i2 };
      };

      return {
        reset() {
          loop.phase = 0;
          for (const b of branches) b.phase = 0;
        },

        step(dt) {
          const { total, i1, i2 } = currents();
          if (isSeries()) {
            loop.advance(dt, -visualSpeed(total, I_MAX));
            return;
          }
          // Orden de los tramos: ver draw(). Los electrones van contra la corriente convencional.
          const flows = [total, total, i2, i1, i2, i2, total];
          branches.forEach((b, n) => b.advance(dt, -visualSpeed(flows[n], I_MAX)));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const { total, i1, i2 } = currents();
          const heatOf = (r) => Math.sqrt(params.v ** 2 / r / 14.4);

          if (isSeries()) {
            const x0 = w * 0.2;
            const x1 = w * 0.8;
            const y0 = h * 0.25;
            const y1 = h * 0.75;
            const xm = (x0 + x1) / 2;
            const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
            const i = total;

            polyline(ctx, corners, { color: c.wire, width: 3, close: true });
            drawBattery(ctx, x0, (y0 + y1) / 2, { orient: 'v' });
            drawResistor(ctx, xm, y0, { len: Math.min(100, w * 0.24), heat: i * i * params.r1 / 14.4 * 4 });
            drawResistor(ctx, xm, y1, { len: Math.min(100, w * 0.24), heat: i * i * params.r2 / 14.4 * 4 });
            loop.setPoints(corners);
            loop.draw(ctx);

            text(ctx, `R₁ = ${si(params.r1, 'Ω')}`, xm, y0 - 30, { align: 'center', weight: 600 });
            text(ctx, `V₁ = ${si(i * params.r1, 'V')}`, xm, y0 + 30, { align: 'center', color: c.accent, size: 12 });
            text(ctx, `R₂ = ${si(params.r2, 'Ω')}`, xm, y1 + 30, { align: 'center', weight: 600 });
            text(ctx, `V₂ = ${si(i * params.r2, 'V')}`, xm, y1 - 30, { align: 'center', color: c.accent, size: 12 });
            text(ctx, si(params.v, 'V'), x0 - 32, (y0 + y1) / 2, { align: 'right', weight: 600, color: c.accent });
            return;
          }

          const xL = Math.max(w * 0.14, 60);
          const xa = w * 0.46;
          const xb = w * 0.78;
          const yT = h * 0.18;
          const yB = h * 0.82;
          const yM = (yT + yB) / 2;
          const paths = [
            [[xL, yB], [xL, yT]], //   0: batería (sube por el +)
            [[xL, yT], [xa, yT]], //   1: riel superior hasta la primera rama
            [[xa, yT], [xb, yT]], //   2: riel superior hacia la segunda rama
            [[xa, yT], [xa, yB]], //   3: rama R1
            [[xb, yT], [xb, yB]], //   4: rama R2
            [[xb, yB], [xa, yB]], //   5: riel inferior (solo corriente de R2)
            [[xa, yB], [xL, yB]], //   6: riel inferior de regreso
          ];

          for (const p of paths) polyline(ctx, p, { color: c.wire, width: 3 });
          drawBattery(ctx, xL, yM, { orient: 'v' });
          drawResistor(ctx, xa, yM, { orient: 'v', len: 90, heat: heatOf(params.r1) });
          drawResistor(ctx, xb, yM, { orient: 'v', len: 90, heat: heatOf(params.r2) });
          circle(ctx, xa, yT, 4, { fill: c.wire });
          circle(ctx, xa, yB, 4, { fill: c.wire });

          branches.forEach((b, n) => {
            b.setPoints(paths[n]);
            b.draw(ctx);
          });

          text(ctx, si(params.v, 'V'), xL - 32, yM, { align: 'right', weight: 600, color: c.accent });
          text(ctx, `R₁ = ${si(params.r1, 'Ω')}`, xa - 36, yM - 8, { align: 'right', weight: 600, size: 12 });
          text(ctx, `I₁ = ${si(i1, 'A')}`, xa - 36, yM + 10, { align: 'right', color: c.chargePos, size: 12 });
          text(ctx, `R₂ = ${si(params.r2, 'Ω')}`, xb - 36, yM - 8, { align: 'right', weight: 600, size: 12 });
          text(ctx, `I₂ = ${si(i2, 'A')}`, xb - 36, yM + 10, { align: 'right', color: c.chargePos, size: 12 });
          text(ctx, `I = ${si(total, 'A')}`, (xL + xa) / 2, yT - 12, { align: 'center', color: c.chargePos, size: 12, weight: 600 });
        },

        formulas() {
          const { total, i1, i2 } = currents();
          const { v, r1, r2 } = params;
          if (isSeries()) {
            const req = r1 + r2;
            return [
              { name: 'Resistencia equivalente', sym: 'R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub>', val: `Req = ${si(r1, 'Ω')} + ${si(r2, 'Ω')} = ${si(req, 'Ω')}` },
              { name: 'Corriente (la misma en todo el lazo)', sym: 'I = V / R<sub>eq</sub>', val: `I = ${si(v, 'V')} / ${si(req, 'Ω')} = ${si(total, 'A')}` },
              { name: 'Caída en R₁', sym: 'V<sub>1</sub> = I · R<sub>1</sub>', val: `V₁ = ${si(total, 'A')} · ${si(r1, 'Ω')} = ${si(total * r1, 'V')}` },
              { name: 'Divisor de tensión', sym: 'V<sub>2</sub> = V · R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>)', val: `V₂ = ${si(v, 'V')} · ${si(r2, 'Ω')} / ${si(req, 'Ω')} = ${si(v * r2 / req, 'V')}` },
            ];
          }
          const req = (r1 * r2) / (r1 + r2);
          return [
            { name: 'Resistencia equivalente', sym: 'R<sub>eq</sub> = R<sub>1</sub> · R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>)', val: `Req = ${si(r1, 'Ω')} · ${si(r2, 'Ω')} / ${si(r1 + r2, 'Ω')} = ${si(req, 'Ω')}` },
            { name: 'Corriente por cada rama (misma V)', sym: 'I<sub>1</sub> = V / R<sub>1</sub> ,  I<sub>2</sub> = V / R<sub>2</sub>', val: `I₁ = ${si(i1, 'A')} ,  I₂ = ${si(i2, 'A')}` },
            { name: 'Corriente total', sym: 'I = I<sub>1</sub> + I<sub>2</sub>', val: `I = ${si(i1, 'A')} + ${si(i2, 'A')} = ${si(total, 'A')}` },
            { name: 'Comprobación con R equivalente', sym: 'I = V / R<sub>eq</sub>', val: `I = ${si(v, 'V')} / ${si(req, 'Ω')} = ${si(v / req, 'A')}` },
          ];
        },
      };
    },
  });
})();
