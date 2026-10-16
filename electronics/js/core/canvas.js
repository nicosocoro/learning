// Preparación del canvas (HiDPI + resize) y primitivas de dibujo para circuitos.

(function () {
  const Elec = (window.Elec ??= {});
  const { colors } = Elec;

  const FONT = '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif';

  /**
   * Ajusta el canvas a su tamaño CSS y a la densidad de pantalla.
   * Devuelve una "vista" con w/h en píxeles CSS y begin() que limpia y devuelve el contexto.
   */
  function setupCanvas(canvas, onResize) {
    const ctx = canvas.getContext('2d');
    const view = { canvas, ctx, w: 0, h: 0, dpr: 1 };

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      Object.assign(view, { w, h, dpr });
      onResize?.();
    }

    new ResizeObserver(resize).observe(canvas);
    resize();

    view.begin = () => {
      ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
      ctx.clearRect(0, 0, view.w, view.h);
      return ctx;
    };
    return view;
  }

  /* ---------- Primitivas ---------- */

  function polyline(ctx, points, { color, width = 2, dash = [], close = false } = {}) {
    if (points.length < 2) return;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const point of points.slice(1)) ctx.lineTo(...point);
    if (close) ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function text(ctx, str, x, y, { color, size = 13, align = 'left', baseline = 'middle', weight = 400 } = {}) {
    ctx.save();
    ctx.fillStyle = color ?? colors().text;
    ctx.font = `${weight} ${size}px ${FONT}`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(str, x, y);
    ctx.restore();
  }

  function circle(ctx, x, y, r, { fill, stroke, width = 2 } = {}) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke();
    }
  }

  function arrow(ctx, x1, y1, x2, y2, { color, width = 2, head = 7 } = {}) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(angle - 0.45), y2 - head * Math.sin(angle - 0.45));
    ctx.lineTo(x2 - head * Math.cos(angle + 0.45), y2 - head * Math.sin(angle + 0.45));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /** Carga puntual con su signo dibujado adentro: sign = '+' o '−'. */
  function chargeDot(ctx, x, y, r, color, sign) {
    circle(ctx, x, y, r, { fill: color });
    if (!sign) return;
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = Math.max(1.2, r / 4);
    ctx.lineCap = 'round';
    const k = r * 0.5;
    ctx.beginPath();
    ctx.moveTo(x - k, y);
    ctx.lineTo(x + k, y);
    if (sign === '+') {
      ctx.moveTo(x, y - k);
      ctx.lineTo(x, y + k);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* ---------- Componentes ----------
     Se dibujan en un sistema local horizontal; orient 'v' los gira 90° (el + queda arriba). */

  function placed(ctx, x, y, orient, draw) {
    ctx.save();
    ctx.translate(x, y);
    if (orient === 'v') ctx.rotate(-Math.PI / 2);
    draw();
    ctx.restore();
  }

  /** Convierte coordenadas locales de un componente a coordenadas de pantalla. */
  function toScreen(x, y, orient, lx, ly) {
    return orient === 'v' ? [x + ly, y - lx] : [x + lx, y + ly];
  }

  function segment(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function drawBattery(ctx, x, y, { orient = 'h', len = 64 } = {}) {
    const c = colors();
    placed(ctx, x, y, orient, () => {
      ctx.fillStyle = c.surface;
      ctx.fillRect(-len / 2, -22, len, 44);
      ctx.strokeStyle = c.wire;
      ctx.lineCap = 'round';
      ctx.lineWidth = 2.5;
      segment(ctx, -len / 2, 0, -5, 0);
      segment(ctx, 5, 0, len / 2, 0);
      ctx.lineWidth = 5;
      segment(ctx, -5, -8, -5, 8); // placa corta: negativo
      ctx.lineWidth = 2.5;
      segment(ctx, 5, -15, 5, 15); // placa larga: positivo
    });
    const [px, py] = toScreen(x, y, orient, 18, -20);
    const [nx, ny] = toScreen(x, y, orient, -18, -20);
    text(ctx, '+', px, py, { color: c.chargePos, size: 16, weight: 700, align: 'center' });
    text(ctx, '−', nx, ny, { color: c.chargeNeg, size: 16, weight: 700, align: 'center' });
  }

  /** Diodo (triángulo + barra). La corriente va del ánodo (base) al cátodo (barra). on=true lo ilumina. */
  function drawDiode(ctx, x, y, { orient = 'h', len = 64, on = false } = {}) {
    const c = colors();
    placed(ctx, x, y, orient, () => {
      ctx.fillStyle = c.surface;
      ctx.fillRect(-len / 2, -20, len, 40);
      ctx.strokeStyle = c.wire;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      segment(ctx, -len / 2, 0, -10, 0);
      segment(ctx, 10, 0, len / 2, 0);
      ctx.beginPath();
      ctx.moveTo(-10, -13);
      ctx.lineTo(-10, 13);
      ctx.lineTo(10, 0);
      ctx.closePath();
      ctx.fillStyle = on ? c.heat : c.surface;
      ctx.fill();
      ctx.stroke();
      segment(ctx, 10, -13, 10, 13);
    });
  }

  /** Fuente de tensión alterna: círculo con una onda adentro. */
  function drawAcSource(ctx, x, y, r = 15) {
    const c = colors();
    circle(ctx, x, y, r, { fill: c.surface, stroke: c.wire, width: 2.5 });
    ctx.save();
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) {
      const px = x - r * 0.6 + (i / 20) * r * 1.2;
      const py = y - Math.sin((i / 20) * Math.PI * 2) * r * 0.35;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  /** heat 0..1 tiñe el resistor para mostrar el calor disipado. */
  function drawResistor(ctx, x, y, { orient = 'h', len = 90, heat = 0 } = {}) {
    const c = colors();
    placed(ctx, x, y, orient, () => {
      ctx.fillStyle = c.surface;
      ctx.fillRect(-len / 2, -20, len, 40);
      if (heat > 0) {
        ctx.globalAlpha = 0.65 * Math.min(heat, 1);
        ctx.fillStyle = c.heat;
        ctx.fillRect(-len * 0.3, -11, len * 0.6, 22);
        ctx.globalAlpha = 1;
      }
      ctx.strokeStyle = c.wire;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      const start = -len * 0.3;
      const zigs = 6;
      const step = (len * 0.6) / zigs;
      ctx.beginPath();
      ctx.moveTo(-len / 2, 0);
      ctx.lineTo(start, 0);
      for (let i = 0; i < zigs; i++) {
        ctx.lineTo(start + step * (i + 0.5), i % 2 ? 9 : -9);
      }
      ctx.lineTo(len * 0.3, 0);
      ctx.lineTo(len / 2, 0);
      ctx.stroke();
    });
  }

  Object.assign(Elec, { setupCanvas, polyline, text, circle, arrow, chargeDot, drawBattery, drawResistor, drawDiode, drawAcSource });
})();
