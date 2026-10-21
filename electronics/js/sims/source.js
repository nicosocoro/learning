// Capítulo 30: una fuente real (fem E con resistencia interna r en serie) alimentando una carga R.
// Al variar R se recorre la curva V–I y la parábola de potencia; la máxima está en R = r.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawBattery, drawResistor, polyline, text, arrow, si, num } = Elec;

  // Valores típicos de fábrica o de banco (órdenes de magnitud, no de un modelo en particular)
  const SOURCES = {
    aa: { label: 'Pila alcalina AA nueva', e: 1.5, r: 0.25 },
    limon: { label: 'Pila de limón (Zn–Cu)', e: 0.95, r: 1000 },
    teg: { label: 'Módulo termoeléctrico (ΔT ≈ 60 K)', e: 3, r: 3 },
    auto: { label: 'Batería de auto', e: 12.6, r: 0.01 },
  };
  const RATIOS = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];
  const SAMPLES = 100;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Una fuente real y su carga',
    label: 'Una fuente con su resistencia interna conectada a una carga, con las curvas de tensión y de potencia según la corriente',
    caption: 'La carga se mide en múltiplos de la resistencia interna (R/r) para poder comparar fuentes muy distintas. Con R = r la potencia entregada es máxima y el rendimiento, 50 %.',
    chart: true,
    controls: [
      {
        type: 'choice', key: 'source', label: 'Fuente', value: 'aa',
        options: [{ value: 'aa', label: 'Pila AA' }, { value: 'limon', label: 'Limón' }, { value: 'teg', label: 'Termoeléctrico' }, { value: 'auto', label: 'Batería de auto' }],
      },
      { key: 'ratio', label: 'Carga relativa (R / r)', values: RATIOS, value: 1, format: (v) => `${num(v)} ×` },
    ],

    setup({ params, chart }) {
      const flow = new FlowPath([], { closed: true });
      const src = () => SOURCES[params.source];
      const load = () => params.ratio * src().r;
      const current = () => src().e / (load() + src().r);
      const shortCircuit = () => src().e / src().r;
      const pMax = () => src().e ** 2 / (4 * src().r);
      const pLoad = () => current() ** 2 * load();
      const pInternal = () => current() ** 2 * src().r;

      return {
        reset() { flow.phase = 0; },

        step(dt) {
          flow.advance(dt, -visualSpeed(current(), shortCircuit()));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const compact = w < 520;
          const x0 = w * 0.22;
          const x1 = w * 0.78;
          const y0 = h * 0.2;
          const y1 = h * 0.74;
          const ym = (y0 + y1) / 2;
          const span = y1 - y0;
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
          const part = Math.min(64, span * 0.38);

          polyline(ctx, corners, { color: c.wire, width: 3, close: true });
          // fuente real: recuadro punteado con la pila ideal y su resistencia interna
          ctx.save();
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = c.muted;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x0 - 40, y0 - 14, 80, span + 28);
          ctx.restore();
          drawResistor(ctx, x0, y0 + span * 0.2, { orient: 'v', len: part, heat: Math.min(1, pInternal() / pMax()) });
          drawBattery(ctx, x0, y1 - span * 0.2, { orient: 'v', len: part });
          drawResistor(ctx, x1, ym, { orient: 'v', len: Math.min(80, span * 0.5), heat: Math.min(1, pLoad() / pMax()) });

          flow.setPoints(corners);
          flow.draw(ctx, { radius: compact ? 3.6 : 4.5, spacing: 24 });

          text(ctx, src().label, w / 2, h * 0.07, { align: 'center', weight: 600, size: compact ? 12 : 14 });
          text(ctx, `E = ${si(src().e, 'V')}`, compact ? x0 + 46 : x0 - 46, y1 - span * 0.2, { align: compact ? 'left' : 'right', size: 12, color: c.accent });
          text(ctx, `r = ${si(src().r, 'Ω')}`, compact ? x0 + 46 : x0 - 46, y0 + span * 0.2, { align: compact ? 'left' : 'right', size: 12, color: c.accent });
          text(ctx, `R = ${si(load(), 'Ω')}`, compact ? x1 - 28 : x1 + 28, ym, { align: compact ? 'right' : 'left', size: 12, color: c.accent });
          text(ctx, `V en la carga = ${si(current() * load(), 'V')}`, x1 - 8, y1 + 22, { align: 'right', size: compact ? 11 : 12.5, color: c.chargeNeg });
          text(ctx, `I = ${si(current(), 'A')}`, (x0 + x1) / 2, y0 - 14, { align: 'center', size: 12.5, color: c.chargePos });
          arrow(ctx, (x0 + x1) / 2 - 22, y0 + 14, (x0 + x1) / 2 + 22, y0 + 14, { color: c.chargePos });
          text(ctx, `rendimiento ${num((100 * load()) / (load() + src().r), 3)} %`, w / 2, h * 0.93, { align: 'center', size: 12.5, color: c.muted });

          this.drawChart(c);
        },

        drawChart(c) {
          const vol = [];
          const pow = [];
          for (let n = 0; n <= SAMPLES; n++) {
            const x = n / SAMPLES;
            vol.push([x, 1 - x]);
            pow.push([x, 4 * x * (1 - x)]);
          }
          const x = current() / shortCircuit();
          const v = 1 - x;
          chart.draw({
            xMax: 1,
            yMin: 0,
            yMax: 1.1,
            xTicks: [0, 0.25, 0.5, 0.75, 1].map((k) => ({ value: k, label: k === 0 ? '0' : k === 1 ? 'Icc' : `${num(k)} Icc` })),
            yTicks: [0, 0.5, 1].map((k) => ({ value: k, label: num(k) })),
            series: [
              { points: vol, color: c.chargeNeg },
              { points: pow, color: c.chargePos, width: 2.5 },
              { points: [[x, v], [x + 0.001, v]], color: c.chargeNeg, width: 11 },
            ],
            cursor: { x, y: 4 * x * (1 - x), color: c.chargePos },
            legend: [
              { label: 'tensión V/E (= rendimiento)', color: c.chargeNeg },
              { label: `potencia P/Pmáx (Pmáx = ${si(pMax(), 'W')})`, color: c.chargePos },
            ],
            xLabel: 'corriente (en fracciones de la de cortocircuito)',
            yLabel: 'valor relativo',
          });
        },

        formulas() {
          const { e, r } = src();
          const R = load();
          const i = current();
          return [
            { name: 'Corriente', sym: 'I = E / (R + r)', val: `I = ${si(e, 'V')} / (${si(R, 'Ω')} + ${si(r, 'Ω')}) = ${si(i, 'A')}` },
            { name: 'Tensión en la carga', sym: 'V = E − I · r', val: `V = ${si(e, 'V')} − ${si(i, 'A')} · ${si(r, 'Ω')} = ${si(e - i * r, 'V')}` },
            { name: 'Potencia en la carga', sym: 'P = V · I', val: `P = ${si(i * R, 'V')} · ${si(i, 'A')} = ${si(pLoad(), 'W')}` },
            { name: 'Potencia perdida dentro de la fuente', sym: 'P<sub>int</sub> = I² · r', val: `Pint = (${si(i, 'A')})² · ${si(r, 'Ω')} = ${si(pInternal(), 'W')}` },
            { name: 'Máxima potencia posible (R = r)', sym: 'P<sub>máx</sub> = E² / (4r)', val: `Pmáx = ${num(e * e)} / ${num(4 * r)} = ${si(pMax(), 'W')}` },
            { name: 'Corriente de cortocircuito', sym: 'I<sub>cc</sub> = E / r', val: `Icc = ${si(e, 'V')} / ${si(r, 'Ω')} = ${si(shortCircuit(), 'A')}` },
          ];
        },
      };
    },
  });
})();
