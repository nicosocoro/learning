// Capítulo 38: un banco de pruebas virtual con cinco fuentes “misteriosas”. Se mide la tensión en
// vacío, se conecta una carga variable y se calcula la resistencia interna con los valores leídos,
// con la resolución limitada del voltímetro, para comprobar qué tan bien se la estima.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawResistor, polyline, text, circle, arrow, si, num } = Elec;

  // Fuentes lineales (E, r) y un panel de 12 celdas (no lineal). La CA se da en valores eficaces.
  const PANEL = { cells: 12, isc: 0.2, a: 0.0334, voc: 0.6 };
  const PANEL_I0 = PANEL.isc / (Math.exp(PANEL.voc / PANEL.a) - 1);
  const panelCurrent = (v) => Math.max(0, PANEL.isc - PANEL_I0 * (Math.exp(v / (PANEL.cells * PANEL.a)) - 1));
  const panelVoltage = (i) => PANEL.cells * PANEL.a * Math.log((PANEL.isc - i) / PANEL_I0 + 1);
  const SOURCES = {
    s1: { name: 'Pila AA usada', kind: 'lin', e: 1.42, r: 1.2, unit: 'V' },
    s2: { name: 'Módulo termoeléctrico', kind: 'lin', e: 2.4, r: 3, unit: 'V' },
    s3: { name: 'Panel solar chico', kind: 'panel', e: PANEL.cells * PANEL.voc, r: null, unit: 'V' },
    s4: { name: 'Alternador casero (CA, valores eficaces)', kind: 'lin', e: 12, r: 8, unit: 'V' },
    s5: { name: 'Pila de limón', kind: 'lin', e: 0.95, r: 1000, unit: 'V' },
  };
  const LOADS = [1e9, 10000, 1000, 470, 220, 100, 47, 22, 10, 4.7, 2.2, 1, 0.47];
  const OPEN = 1e8;
  const SAMPLES = 120;

  const quant = (x, res) => Math.round(x / res) * res;

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Banco de pruebas: la fuente misteriosa',
    label: 'Una fuente desconocida con un amperímetro, un voltímetro y una carga variable, con la curva tensión–corriente y la estimación de la resistencia interna',
    caption: 'Medí primero la tensión con la carga abierta (∞). Después conectá cargas cada vez más chicas y estimá r = (V<sub>oc</sub> − V) / I con los valores que lee el voltímetro. La recta anaranjada es la que sale de tus mediciones; la azul, la fuente real.',
    chart: true,
    controls: [
      { type: 'choice', key: 'src', label: 'Fuente', value: 's1', options: [{ value: 's1', label: '1' }, { value: 's2', label: '2' }, { value: 's3', label: '3' }, { value: 's4', label: '4' }, { value: 's5', label: '5' }] },
      { key: 'load', label: 'Resistencia de la carga (R)', values: LOADS, value: LOADS[0], unit: 'Ω', format: (v) => (v >= OPEN ? '∞ (abierto)' : si(v, 'Ω')) },
      { type: 'choice', key: 'res', label: 'Resolución del voltímetro', value: 0.001, options: [{ value: 0.001, label: '1 mV' }, { value: 0.01, label: '10 mV' }, { value: 0.1, label: '100 mV' }] },
      { type: 'choice', key: 'reveal', label: '¿Mostrar los valores reales?', value: 'no', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Sí' }] },
    ],

    setup({ params, chart }) {
      const flow = new FlowPath([], { closed: true });
      const src = () => SOURCES[params.src];
      const open = () => params.load >= OPEN;

      /** Tensión e corriente reales sobre la carga. */
      function operating() {
        const s = src();
        if (s.kind === 'lin') {
          const i = open() ? 0 : s.e / (params.load + s.r);
          return { v: s.e - i * s.r, i: open() ? 0 : i };
        }
        let lo = 0;
        let hi = s.e;
        for (let n = 0; n < 60; n++) {
          const mid = (lo + hi) / 2;
          if (panelCurrent(mid) - mid / params.load > 0) lo = mid; else hi = mid;
        }
        return { v: lo, i: lo / params.load };
      }
      const iscTrue = () => (src().kind === 'lin' ? src().e / src().r : PANEL.isc);

      /** Lo que “leen” los instrumentos y lo que se calcula a partir de eso. */
      function readings() {
        const s = src();
        const op = operating();
        const voc = quant(s.e, params.res);
        const v = quant(op.v, params.res);
        const i = open() ? 0 : v / params.load;
        const rEst = open() || i <= 0 ? null : (voc - v) / i;
        return { op, voc, v, i, rEst, p: v * i };
      }

      return {
        reset() { flow.phase = 0; },

        step(dt) {
          flow.advance(dt, -visualSpeed(operating().i, iscTrue()));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const compact = w < 520;
          const rd = readings();
          const s = src();
          const reveal = params.reveal === 'yes';
          const x0 = w * 0.2;
          const x1 = w * (compact ? 0.62 : 0.66);
          const y0 = h * 0.2;
          const y1 = h * 0.72;
          const ym = (y0 + y1) / 2;
          const span = y1 - y0;
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
          polyline(ctx, corners, { color: c.wire, width: 3, close: true });
          flow.setPoints(corners);
          flow.draw(ctx, { radius: compact ? 3.2 : 4, spacing: 24 });

          // la fuente: un recuadro con interrogación (o con su nombre y su r, si se revela)
          ctx.fillStyle = c.surface;
          ctx.fillRect(x0 - 38, ym - 40, 76, 80);
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 2.5;
          ctx.setLineDash([5, 4]);
          ctx.strokeRect(x0 - 38, ym - 40, 76, 80);
          ctx.setLineDash([]);
          text(ctx, reveal ? 'fuente' : '?', x0, ym - 8, { align: 'center', size: reveal ? 13 : 28, weight: 700, color: c.accent });
          text(ctx, reveal ? (s.r ? `r = ${si(s.r, 'Ω')}` : 'no lineal') : 'E, r', x0, ym + 16, { align: 'center', size: 12, color: c.muted });
          text(ctx, reveal ? s.name : `Fuente ${params.src.slice(1)}`, x0, y0 - 24, { align: 'center', size: compact ? 11 : 12.5, weight: 600, color: c.text });

          // amperímetro en serie, arriba
          const ax = (x0 + x1) / 2;
          circle(ctx, ax, y0, 17, { fill: c.surface, stroke: c.wire, width: 2.5 });
          text(ctx, 'A', ax, y0, { align: 'center', size: 15, weight: 700 });
          text(ctx, open() ? '0 A' : si(rd.i, 'A'), ax, y0 - 30, { align: 'center', size: 12.5, weight: 600, color: c.chargePos });

          // carga a la derecha
          drawResistor(ctx, x1, ym, { orient: 'v', len: Math.min(70, span * 0.55), heat: 0 });
          text(ctx, open() ? 'abierto' : `R = ${si(params.load, 'Ω')}`, x1 - 24, ym, { align: 'right', size: 12, color: c.accent });

          // voltímetro en paralelo (con la carga)
          const vx = x1 + (compact ? 44 : 70);
          polyline(ctx, [[x1, y0], [vx, y0], [vx, ym - 17]], { color: c.wire, width: 3 });
          polyline(ctx, [[x1, y1], [vx, y1], [vx, ym + 17]], { color: c.wire, width: 3 });
          circle(ctx, vx, ym, 17, { fill: c.surface, stroke: c.wire, width: 2.5 });
          text(ctx, 'V', vx, ym, { align: 'center', size: 15, weight: 700 });
          text(ctx, si(rd.v, 'V', 4), vx, ym + 34, { align: 'center', size: 12.5, weight: 600, color: c.chargeNeg });

          const info = rd.rEst === null ? (open() ? 'carga abierta: esta lectura es la tensión en vacío' : 'la corriente medida es 0: no se puede calcular r') : `r estimada = (${si(rd.voc, 'V', 4)} − ${si(rd.v, 'V', 4)}) / ${si(rd.i, 'A')} = ${si(rd.rEst, 'Ω')}`;
          text(ctx, info, w / 2, h * 0.9, { align: 'center', size: compact ? 11 : 12.5, color: c.text });

          this.drawChart(c, rd);
        },

        drawChart(c, rd = readings()) {
          const s = src();
          const iMax = iscTrue() * 1.05;
          const vMax = s.e * 1.1;
          const real = [];
          for (let k = 0; k <= SAMPLES; k++) {
            const i = (k / SAMPLES) * iscTrue() * (s.kind === 'panel' ? 0.999 : 1);
            real.push([i, s.kind === 'lin' ? s.e - i * s.r : panelVoltage(i)]);
          }
          const series = [{ points: real, color: c.chargeNeg, width: 3 }];
          if (rd.rEst !== null && rd.rEst > 0) {
            const xEnd = Math.min(iMax, rd.voc / rd.rEst);
            series.push({ points: [[0, rd.voc], [xEnd, rd.voc - rd.rEst * xEnd]], color: c.chargePos, width: 2.5 });
          }
          const ticks = (max, unit) => [0, 0.25, 0.5, 0.75, 1].map((f) => ({ value: f * max, label: si(f * max, unit, 2) }));
          chart.draw({
            xMax: iMax,
            yMin: 0,
            yMax: vMax,
            xTicks: ticks(iMax, 'A'),
            yTicks: ticks(vMax, 'V'),
            series,
            cursor: open() ? { x: 0, y: rd.op.v, color: c.accent } : { x: rd.op.i, y: rd.op.v, color: c.accent },
            legend: [
              { label: 'fuente real (V en función de I)', color: c.chargeNeg },
              { label: 'recta con la r estimada de tus mediciones', color: c.chargePos },
            ],
            xLabel: 'corriente',
            yLabel: 'tensión en bornes',
          });
        },

        formulas() {
          const rd = readings();
          const s = src();
          const reveal = params.reveal === 'yes';
          const rows = [
            { name: 'Tensión en vacío leída', sym: 'V<sub>oc</sub>', val: `Voc = ${si(rd.voc, 'V', 4)}` },
            { name: 'Tensión leída con la carga', sym: 'V', val: open() ? 'conectá una carga' : `V = ${si(rd.v, 'V', 4)}` },
            { name: 'Corriente calculada', sym: 'I = V / R', val: open() ? 'I = 0' : `I = ${si(rd.v, 'V', 4)} / ${si(params.load, 'Ω')} = ${si(rd.i, 'A')}` },
            { name: 'Potencia en la carga', sym: 'P = V · I', val: `P = ${si(rd.p, 'W')}` },
            { name: 'Resistencia interna estimada', sym: 'r = (V<sub>oc</sub> − V) / I', val: rd.rEst === null ? '—' : `r = ${si(rd.rEst, 'Ω')}` },
            { name: 'Rendimiento eléctrico en este punto', sym: 'η = V / V<sub>oc</sub>', val: open() ? '—' : `η = ${num((100 * rd.v) / rd.voc, 3)} %` },
          ];
          if (reveal) {
            rows.push({
              name: 'Valor real (solo si lo revelás)',
              sym: s.kind === 'lin' ? 'r real' : 'r no constante',
              val: s.kind === 'lin' ? `r = ${si(s.r, 'Ω')}${rd.rEst ? ` → error de la estimación: ${num((100 * Math.abs(rd.rEst - s.r)) / s.r, 3)} %` : ''}` : 'la curva no es una recta: r cambia con el punto',
            });
          }
          return rows;
        },
      };
    },
  });
})();
