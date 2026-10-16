// Gráfica simple sin estado: el simulador le pasa la configuración completa en cada frame.
//
// cfg: {
//   xMin?, xMax, yMin?, yMax,
//   xTicks?: [{ value, label }], yTicks?: [{ value, label }],
//   series: [{ points: [[x, y], ...], color, width? }],
//   hlines?: [{ y, label, color? }],
//   cursor?: { x, y, color },
//   xLabel?, yLabel?,
//   legend?: [{ label, color }]
// }

(function () {
  const Elec = (window.Elec ??= {});
  const { setupCanvas, polyline, text, circle } = Elec;
  const { colors } = Elec;

  const MARGIN = { left: 50, right: 14, top: 14, bottom: 38 };

  /** Reparte la leyenda en filas sobre el área de la gráfica (sin tapar las curvas). */
  function layoutLegend(entries, left, right) {
    let x = left;
    let row = 0;
    const items = entries.map((entry) => {
      const width = 36 + entry.label.length * 5.8;
      if (x + width > right && x > left) {
        row += 1;
        x = left;
      }
      const placed = { ...entry, x, row };
      x += width + 14;
      return placed;
    });
    return { items, rows: entries.length ? row + 1 : 0 };
  }

  function createChart(canvas) {
    let last = null;
    const view = setupCanvas(canvas, () => last && draw(last));

    function draw(cfg) {
      last = cfg;
      if (!view.w) return;
      const ctx = view.begin();
      const c = colors();
      const { xMin = 0, xMax, yMin = 0, yMax } = cfg;

      const left = MARGIN.left;
      const right = view.w - MARGIN.right;
      const legend = layoutLegend(cfg.legend ?? [], left, right);
      const top = legend.rows ? 8 + legend.rows * 16 : MARGIN.top;
      const bottom = view.h - MARGIN.bottom;
      const px = (x) => left + ((x - xMin) / (xMax - xMin)) * (right - left);
      const py = (y) => bottom - ((y - yMin) / (yMax - yMin)) * (bottom - top);

      for (const tick of cfg.xTicks ?? []) {
        polyline(ctx, [[px(tick.value), top], [px(tick.value), bottom]], { color: c.grid, width: 1 });
        text(ctx, tick.label, px(tick.value), bottom + 14, { color: c.muted, size: 11, align: px(tick.value) > right - 26 ? 'right' : 'center' });
      }
      for (const tick of cfg.yTicks ?? []) {
        polyline(ctx, [[left, py(tick.value)], [right, py(tick.value)]], { color: c.grid, width: 1 });
        text(ctx, tick.label, left - 6, py(tick.value), { color: c.muted, size: 11, align: 'right' });
      }
      polyline(ctx, [[left, top], [left, bottom], [right, bottom]], { color: c.wire, width: 1.5 });

      ctx.save();
      ctx.beginPath();
      ctx.rect(left, top, right - left, bottom - top);
      ctx.clip();
      for (const line of cfg.hlines ?? []) {
        polyline(ctx, [[left, py(line.y)], [right, py(line.y)]], { color: line.color ?? c.muted, width: 1.2, dash: [5, 4] });
      }
      for (const s of cfg.series) {
        polyline(ctx, s.points.map(([x, y]) => [px(x), py(y)]), { color: s.color, width: s.width ?? 2.5 });
      }
      ctx.restore();

      for (const line of cfg.hlines ?? []) {
        text(ctx, line.label, right - 4, py(line.y) - 8, { color: line.color ?? c.muted, size: 11, align: 'right' });
      }
      if (cfg.cursor) {
        circle(ctx, px(cfg.cursor.x), py(cfg.cursor.y), 5, { fill: cfg.cursor.color });
      }
      if (cfg.xLabel) text(ctx, cfg.xLabel, right, view.h - 6, { color: c.muted, size: 11, align: 'right' });
      if (cfg.yLabel) text(ctx, cfg.yLabel, left + 6, top + 8, { color: c.muted, size: 11 });
      for (const item of legend.items) {
        const y = 14 + item.row * 16;
        polyline(ctx, [[item.x, y], [item.x + 22, y]], { color: item.color, width: 3 });
        text(ctx, item.label, item.x + 28, y, { color: c.text, size: 11 });
      }
    }

    return { draw };
  }

  Object.assign(Elec, { createChart });
})();
