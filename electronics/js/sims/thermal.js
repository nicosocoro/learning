// Lección 28: temperatura de un semiconductor. La potencia que disipa se transforma en una subida de
// temperatura: Tj = Ta + P · θJA. Se compara con el máximo de la hoja de datos (150 °C) y se muestra
// la curva de reducción de potencia (derating) según la temperatura ambiente.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { polyline, text, circle } = Elec;
  const { si, num } = Elec;

  const TJ_MAX = 150; //   temperatura máxima de juntura (°C)
  const PACKAGES = {
    to92: { name: 'TO-92 (transistor chico)', theta: 200 },
    to220: { name: 'TO-220 sin disipador', theta: 62 },
    to220h: { name: 'TO-220 con disipador', theta: 8 },
  };
  const colorFor = (t) => (t < 85 ? 'good' : t < 125 ? 'heat' : 'bad');

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Potencia disipada y temperatura de la juntura',
    label: 'Dibujo de un transistor con un termómetro que indica la temperatura de la juntura, y una gráfica de la potencia máxima admisible según la temperatura ambiente',
    caption: 'Tj = Ta + P · θJA. La resistencia térmica θJA (en °C por watt) mide cuánto sube la temperatura por cada watt que se disipa: depende del encapsulado y del disipador.',
    chart: true,
    controls: [
      { type: 'choice', key: 'pkg', label: 'Encapsulado', value: 'to92', options: Object.entries(PACKAGES).map(([value, p]) => ({ value, label: p.name })) },
      { key: 'p', label: 'Potencia disipada (P)', min: 0.05, max: 10, step: 0.05, value: 0.36, unit: 'W' },
      { key: 'ta', label: 'Temperatura ambiente (T<sub>a</sub>)', min: 0, max: 80, step: 1, value: 25, format: (v) => `${v} °C` },
    ],

    setup({ params, chart }) {
      let t = 0;
      return {
        reset() { t = 0; },
        step(dt) { t += Math.max(0, dt); },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const pk = PACKAGES[params.pkg];
          const tj = params.ta + params.p * pk.theta;
          const col = c[colorFor(tj)];
          const cx = w * 0.3;
          const cy = h * 0.5;

          const bw = params.pkg === 'to92' ? 120 : 160;
          const bh = params.pkg === 'to92' ? 110 : 120;
          ctx.save();
          ctx.fillStyle = col;
          ctx.globalAlpha = Math.min(0.85, 0.2 + Math.max(0, (tj - params.ta) / 160));
          ctx.beginPath(); ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 12); ctx.fill();
          ctx.restore();
          ctx.save();
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 12); ctx.stroke();
          ctx.restore();
          for (let k = -1; k <= 1; k++) polyline(ctx, [[cx + k * 28, cy + bh / 2], [cx + k * 28, cy + bh / 2 + 36]], { color: c.wire, width: 3 });
          text(ctx, pk.name, cx, cy - bh / 2 - 18, { align: 'center', weight: 700, size: 13 });
          text(ctx, `P = ${si(params.p, 'W')}`, cx, cy - 8, { align: 'center', weight: 700, size: 15 });
          text(ctx, `θJA = ${pk.theta} °C/W`, cx, cy + 14, { align: 'center', size: 12, color: c.muted });
          if (params.pkg === 'to220h') {
            for (let k = 0; k < 6; k++) polyline(ctx, [[cx - bw / 2 - 6, cy - bh / 2 - 30 + k * 12], [cx + bw / 2 + 6, cy - bh / 2 - 30 + k * 12]], { color: c.muted, width: 3 });
          }
          const heat = Math.min(1, (tj - params.ta) / 120);
          for (let k = 0; k < 4; k++) {
            const x = cx - 45 + k * 30;
            const off = ((t * 30 + k * 20) % 40) * heat;
            ctx.save();
            ctx.globalAlpha = heat * (1 - off / 45);
            polyline(ctx, [[x, cy - bh / 2 - 36 - off], [x, cy - bh / 2 - 56 - off]], { color: c.heat, width: 3 });
            ctx.restore();
          }

          const tx = w * 0.62;
          const ty0 = h * 0.12;
          const ty1 = h * 0.86;
          const scale = (T) => ty1 - (T / 200) * (ty1 - ty0);
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.roundRect(tx - 14, ty0 - 10, 28, ty1 - ty0 + 30, 14); ctx.fill(); ctx.stroke();
          ctx.restore();
          const tTop = scale(Math.min(tj, 200));
          ctx.save();
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.roundRect(tx - 7, tTop, 14, ty1 - tTop + 12, 7); ctx.fill();
          ctx.restore();
          circle(ctx, tx, ty1 + 14, 12, { fill: col, stroke: c.wire, width: 2 });
          for (const T of [0, 50, 100, 150, 200]) {
            polyline(ctx, [[tx + 14, scale(T)], [tx + 24, scale(T)]], { color: c.muted, width: 2 });
            text(ctx, `${T} °C`, tx + 30, scale(T), { size: 11, color: c.muted });
          }
          polyline(ctx, [[tx - 24, scale(TJ_MAX)], [tx + 24, scale(TJ_MAX)]], { color: c.bad, width: 2, dash: [4, 3] });
          text(ctx, 'máximo de la juntura: 150 °C', tx - 30, scale(TJ_MAX), { align: 'right', size: 11.5, color: c.bad, weight: 600 });
          text(ctx, `Tj = ${num(tj, 3)} °C`, tx + 80, scale(Math.min(tj, 200)), { weight: 700, size: 14, color: col });

          const msg = tj >= TJ_MAX ? '¡SE DAÑA! supera el máximo de la hoja de datos' : tj >= 125 ? 'cerca del límite: conviene más margen' : tj >= 85 ? 'caliente: se puede tocar solo un instante' : 'temperatura segura';
          text(ctx, msg, w * 0.5, h * 0.95, { align: 'center', weight: 700, size: 13, color: col });
          this.drawChart(c, pk, tj);
        },

        drawChart(c, pk, tj) {
          const pts = [];
          for (let a = 0; a <= 150; a += 5) pts.push([a, Math.max(0, (TJ_MAX - a) / pk.theta)]);
          const pMax = TJ_MAX / pk.theta;
          const yMax = Math.max(pMax * 1.05, params.p * 1.2);
          chart.draw({
            xMax: 150,
            yMax,
            xTicks: [0, 25, 50, 75, 100, 125, 150].map((v) => ({ value: v, label: `${v} °C` })),
            yTicks: [0, 0.5, 1].map((f) => ({ value: f * yMax, label: `${num(f * yMax, 2)} W` })),
            series: [{ points: pts, color: c.accent }],
            hlines: [{ y: params.p, label: `potencia actual: ${si(params.p, 'W')}`, color: c.chargePos }],
            cursor: { x: params.ta, y: params.p, color: tj >= TJ_MAX ? c.bad : c.good },
            xLabel: 'temperatura ambiente',
            yLabel: 'potencia máxima admisible (curva de reducción)',
          });
        },

        formulas() {
          const pk = PACKAGES[params.pkg];
          const tj = params.ta + params.p * pk.theta;
          const pmax = Math.max(0, (TJ_MAX - params.ta) / pk.theta);
          return [
            { name: 'Aumento de temperatura', sym: 'ΔT = P · θ<sub>JA</sub>', val: `ΔT = ${si(params.p, 'W')} · ${pk.theta} °C/W = ${num(params.p * pk.theta, 3)} °C` },
            { name: 'Temperatura de la juntura', sym: 'T<sub>j</sub> = T<sub>a</sub> + P · θ<sub>JA</sub>', val: `Tj = ${params.ta} °C + ${num(params.p * pk.theta, 3)} °C = ${num(tj, 3)} °C` },
            { name: 'Potencia máxima con este ambiente', sym: 'P<sub>máx</sub> = (T<sub>j,máx</sub> − T<sub>a</sub>) / θ<sub>JA</sub>', val: `Pmáx = (150 − ${params.ta}) / ${pk.theta} = ${si(pmax, 'W')}` },
            { name: 'Margen', sym: 'P<sub>máx</sub> − P', val: params.p <= pmax ? `quedan ${si(pmax - params.p, 'W')} de margen` : `¡te pasás por ${si(params.p - pmax, 'W')}!` },
            { name: 'Resistencia térmica necesaria', sym: 'θ<sub>máx</sub> = (T<sub>j,máx</sub> − T<sub>a</sub>) / P', val: `θ ≤ ${num((TJ_MAX - params.ta) / params.p, 3)} °C/W para este caso` },
          ];
        },
      };
    },
  });
})();
