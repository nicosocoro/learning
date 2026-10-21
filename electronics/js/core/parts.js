// Símbolos de componentes activos y electromecánicos para los canvas: transistor bipolar,
// MOSFET, lámpara, LED, bobina, interruptor, tierra y las piezas de un generador (polos y espira). Cada símbolo devuelve las coordenadas de
// sus terminales para que la simulación conecte los cables ahí.

(function () {
  const Elec = (window.Elec ??= {});
  const { polyline, text, circle, arrow, drawDiode } = Elec;
  const { colors } = Elec;

  const line = (ctx, x1, y1, x2, y2) => polyline(ctx, [[x1, y1], [x2, y2]], { color: ctx.strokeStyle, width: ctx.lineWidth });

  function headAt(ctx, x, y, angle, size = 8) {
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size * 0.45);
    ctx.lineTo(-size, size * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * Transistor bipolar. NPN: colector arriba, emisor abajo con la flecha saliendo.
   * PNP: emisor arriba con la flecha entrando. `on` (0..1) lo ilumina según cuánto conduce;
   * `heat` (0..1) lo tiñe de calor. Devuelve { b, c, e } con los terminales.
   */
  function drawBjt(ctx, x, y, { type = 'npn', r = 32, on = 0, heat = 0 } = {}) {
    const c = colors();
    const dx = 0.42 * r;
    const h = Math.sqrt(r * r - dx * dx);
    const flip = type === 'pnp' ? -1 : 1; // PNP: el emisor va arriba
    const barX = x - 0.3 * r;

    circle(ctx, x, y, r, { fill: c.surface, stroke: c.wire, width: 2.5 });
    if (on > 0 || heat > 0) {
      ctx.save();
      ctx.globalAlpha = 0.5 * Math.max(on, heat);
      circle(ctx, x, y, r - 3, { fill: heat > on ? c.heat : c.good });
      ctx.restore();
    }
    ctx.save();
    ctx.strokeStyle = c.wire;
    ctx.fillStyle = c.wire;
    ctx.lineCap = 'round';
    ctx.lineWidth = 2.5;
    line(ctx, x - r, y, barX, y); // base
    ctx.lineWidth = 4.5;
    line(ctx, barX, y - 0.5 * r, barX, y + 0.5 * r); // placa de base
    ctx.lineWidth = 2.5;
    const cy = y - flip * h; //   colector
    const ey = y + flip * h; //   emisor
    line(ctx, barX, y - flip * 0.22 * r, x + dx, cy);
    line(ctx, barX, y + flip * 0.22 * r, x + dx, ey);
    // flecha del emisor: sale en NPN, entra en PNP
    const sx = barX;
    const sy = y + flip * 0.22 * r;
    const ang = Math.atan2(ey - sy, x + dx - sx);
    if (type === 'npn') headAt(ctx, x + dx - (x + dx - sx) * 0.12, ey - (ey - sy) * 0.12, ang, 9);
    else headAt(ctx, sx + (x + dx - sx) * 0.38, sy + (ey - sy) * 0.38, ang + Math.PI, 9);
    ctx.restore();

    return { b: [x - r, y], c: [x + dx, cy], e: [x + dx, ey] };
  }

  /**
   * MOSFET de canal N (de enriquecimiento). Compuerta a la izquierda, drenador arriba y
   * fuente abajo. `on` (0..1) ilumina el canal. Devuelve { g, d, s }.
   */
  function drawMosfet(ctx, x, y, { size = 64, on = 0, heat = 0 } = {}) {
    const c = colors();
    const s = size;
    const gateX = x - 0.28 * s;
    const chanX = x - 0.1 * s;
    const outX = x + 0.3 * s;
    const dY = y - 0.38 * s;
    const sY = y + 0.38 * s;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = c.wire;
    ctx.fillStyle = c.wire;
    ctx.lineWidth = 2.5;
    line(ctx, x - 0.62 * s, y, gateX, y); //                       terminal de compuerta
    ctx.lineWidth = 4;
    line(ctx, gateX, y - 0.5 * s, gateX, y + 0.5 * s); //          placa de la compuerta (aislada)
    ctx.lineWidth = 4;
    ctx.strokeStyle = on > 0 || heat > 0 ? (heat > on ? c.heat : c.good) : c.wire;
    ctx.globalAlpha = on > 0 || heat > 0 ? 0.35 + 0.65 * Math.max(on, heat) : 1;
    line(ctx, chanX, y - 0.5 * s, chanX, y - 0.26 * s); //         canal en tres tramos
    line(ctx, chanX, y - 0.14 * s, chanX, y + 0.14 * s);
    line(ctx, chanX, y + 0.26 * s, chanX, y + 0.5 * s);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c.wire;
    ctx.lineWidth = 2.5;
    polyline(ctx, [[chanX, dY], [outX, dY], [outX, y - 0.75 * s]], { color: c.wire, width: 2.5 }); // drenador
    polyline(ctx, [[chanX, sY], [outX, sY], [outX, y + 0.75 * s]], { color: c.wire, width: 2.5 }); // fuente
    line(ctx, chanX, y, outX, y); //                               sustrato unido a la fuente
    line(ctx, outX, y, outX, sY);
    headAt(ctx, chanX + 1, y, Math.PI, 9); //                      flecha: canal N
    ctx.restore();

    return { g: [x - 0.62 * s, y], d: [outX, y - 0.75 * s], s: [outX, y + 0.75 * s] };
  }

  /** Lámpara de filamento: glow 0..1 la ilumina. */
  function drawLamp(ctx, x, y, { r = 20, glow = 0 } = {}) {
    const c = colors();
    if (glow > 0) {
      const g = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 2.6);
      g.addColorStop(0, c.heat);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.globalAlpha = Math.min(1, glow) * 0.8;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    circle(ctx, x, y, r, { fill: glow > 0 ? mix(c.surface, c.heat, Math.min(1, glow)) : c.surface, stroke: c.wire, width: 2.5 });
    const k = r * 0.68;
    polyline(ctx, [[x - k, y - k], [x + k, y + k]], { color: c.wire, width: 2 });
    polyline(ctx, [[x - k, y + k], [x + k, y - k]], { color: c.wire, width: 2 });
  }

  function mix(a, b, t) {
    const pa = parse(a);
    const pb = parse(b);
    return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
  }
  function parse(color) {
    const probe = document.createElement('canvas').getContext('2d');
    probe.fillStyle = color;
    const hex = probe.fillStyle; // normaliza a #rrggbb
    return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }

  /** LED: diodo con flechitas de luz. glow 0..1. */
  function drawLed(ctx, x, y, { orient = 'h', len = 64, glow = 0 } = {}) {
    const c = colors();
    drawDiode(ctx, x, y, { orient, len, on: glow > 0.05 });
    const [ox, oy] = orient === 'v' ? [x + 20, y - 4] : [x + 4, y - 22];
    ctx.save();
    ctx.globalAlpha = 0.35 + 0.65 * Math.min(glow, 1);
    for (const d of [0, 10]) {
      arrow(ctx, ox + d, oy + d * 0.0 + 4, ox + d + 12, oy - 10, { color: glow > 0.05 ? c.heat : c.muted, width: 2, head: 6 });
    }
    ctx.restore();
  }

  /** Bobina (inductor / bobina de relé). Siempre vertical; `active` (0..1) la ilumina. */
  function drawCoil(ctx, x, y, { len = 90, turns = 5, active = 0 } = {}) {
    const c = colors();
    const top = y - len / 2;
    const step = (len * 0.7) / turns;
    const start = y - (turns * step) / 2;
    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = active > 0 ? c.heat : c.wire;
    ctx.globalAlpha = active > 0 ? 0.55 + 0.45 * Math.min(active, 1) : 1;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, start);
    for (let i = 0; i < turns; i++) ctx.arc(x, start + step * (i + 0.5), step / 2, -Math.PI / 2, Math.PI / 2, false);
    ctx.moveTo(x, start + turns * step);
    ctx.lineTo(x, y + len / 2);
    ctx.stroke();
    ctx.restore();
  }

  /** Interruptor simple (dos terminales a izquierda y derecha). */
  function drawSwitch(ctx, x, y, { len = 64, closed = false } = {}) {
    const c = colors();
    const a = x - len / 2;
    const b = x + len / 2;
    circle(ctx, a + 6, y, 3.5, { fill: c.wire });
    circle(ctx, b - 6, y, 3.5, { fill: c.wire });
    polyline(ctx, [[a, y], [a + 6, y]], { color: c.wire, width: 2.5 });
    polyline(ctx, [[b - 6, y], [b, y]], { color: c.wire, width: 2.5 });
    const tip = closed ? [b - 6, y] : [b - 12, y - 22];
    polyline(ctx, [[a + 6, y], tip], { color: closed ? c.good : c.wire, width: 3 });
  }

  /** Símbolo de tierra (0 V). */
  function drawGround(ctx, x, y) {
    const c = colors();
    polyline(ctx, [[x, y], [x, y + 8]], { color: c.wire, width: 2.5 });
    for (let i = 0; i < 3; i++) {
      const half = 14 - i * 4.5;
      polyline(ctx, [[x - half, y + 8 + i * 5], [x + half, y + 8 + i * 5]], { color: c.wire, width: 2.5 });
    }
  }


  /**
   * Amplificador operacional (triángulo). Entrada inversora (−) arriba y no inversora (+) abajo
   * (con flip: al revés).
   * `sat` (−1..1) tiñe el cuerpo si la salida está saturada. Devuelve { minus, plus, out }.
   */
  function drawOpAmp(ctx, x, y, { size = 70, sat = 0, flip = false } = {}) {
    const c = colors();
    const h = size * 0.5;
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = c.wire;
    ctx.fillStyle = Math.abs(sat) >= 1 ? c.heat : c.surface;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.5, y - h);
    ctx.lineTo(x - size * 0.5, y + h);
    ctx.lineTo(x + size * 0.6, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    const top = flip ? '+' : '−';
    const bottom = flip ? '−' : '+';
    text(ctx, top, x - size * 0.4, y - h * 0.5, { size: 18, weight: 700, align: 'center', color: flip ? c.chargePos : c.chargeNeg });
    text(ctx, bottom, x - size * 0.4, y + h * 0.5, { size: 18, weight: 700, align: 'center', color: flip ? c.chargeNeg : c.chargePos });
    const upper = [x - size * 0.5, y - h * 0.5];
    const lower = [x - size * 0.5, y + h * 0.5];
    return { minus: flip ? lower : upper, plus: flip ? upper : lower, out: [x + size * 0.6, y] };
  }

  /**
   * Compuerta lógica. type: AND, OR, XOR, NAND, NOR, XNOR, NOT. `on` (0..1) tiñe la salida.
   * Devuelve { a, b, out } (b no existe en NOT).
   */
  function drawGate(ctx, x, y, { type = 'AND', size = 64, high = false } = {}) {
    const c = colors();
    const w = size;
    const h = size * 0.8;
    const left = x - w / 2;
    const right = x + w / 2;
    const inverted = ['NAND', 'NOR', 'XNOR', 'NOT'].includes(type);
    const base = type.replace(/^N(?=AND|OR)/, '').replace('XNOR', 'XOR');
    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = c.wire;
    ctx.fillStyle = c.surface;
    ctx.beginPath();
    if (type === 'NOT') {
      ctx.moveTo(left, y - h / 2);
      ctx.lineTo(left, y + h / 2);
      ctx.lineTo(right - 8, y);
      ctx.closePath();
    } else if (base === 'AND') {
      ctx.moveTo(left, y - h / 2);
      ctx.lineTo(x, y - h / 2);
      ctx.arc(x, y, h / 2, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(left, y + h / 2);
      ctx.closePath();
    } else {
      const off = base === 'XOR' ? 8 : 0;
      ctx.moveTo(left + off, y - h / 2);
      ctx.quadraticCurveTo(x + w * 0.1, y - h / 2, right, y);
      ctx.quadraticCurveTo(x + w * 0.1, y + h / 2, left + off, y + h / 2);
      ctx.quadraticCurveTo(left + off + w * 0.22, y, left + off, y - h / 2);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
    if (base === 'XOR') {
      ctx.beginPath();
      ctx.moveTo(left, y - h / 2);
      ctx.quadraticCurveTo(left + w * 0.22, y, left, y + h / 2);
      ctx.stroke();
    }
    ctx.restore();
    let outX = right;
    if (inverted) {
      circle(ctx, right + (type === 'NOT' ? -2 : 5), y, 5, { fill: high ? c.heat : c.surface, stroke: c.wire, width: 2.5 });
      outX = right + (type === 'NOT' ? 3 : 10);
    }
    const inset = base === 'XOR' || base === 'OR' ? 0 : 0;
    const nodes = { out: [outX, y] };
    if (type === 'NOT') nodes.a = [left, y];
    else {
      nodes.a = [left + inset, y - h * 0.22];
      nodes.b = [left + inset, y + h * 0.22];
    }
    text(ctx, type === 'NOT' ? '' : '', x, y);
    return nodes;
  }

  /**
   * Polos de un imán vistos desde arriba: N a la izquierda y S a la derecha, con las líneas del
   * campo B (de N a S) en el hueco. `span` es la distancia entre las caras enfrentadas.
   */
  function drawPoles(ctx, cx, cy, { span = 160, h = 120, w = 40 } = {}) {
    const c = colors();
    const left = cx - span / 2;
    const right = cx + span / 2;
    for (const [x0, fill, letter] of [[left - w, c.chargePos, 'N'], [right, c.chargeNeg, 'S']]) {
      ctx.fillStyle = fill;
      ctx.fillRect(x0, cy - h / 2, w, h);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 2;
      ctx.strokeRect(x0, cy - h / 2, w, h);
      text(ctx, letter, x0 + w / 2, cy, { align: 'center', size: 20, weight: 700, color: '#fff' });
    }
    for (const k of [-0.36, -0.18, 0, 0.18, 0.36]) {
      const y = cy + k * h;
      polyline(ctx, [[left + 4, y], [right - 12, y]], { color: c.grid, width: 1.5, dash: [5, 5] });
      arrow(ctx, right - 22, y, right - 4, y, { color: c.grid, width: 1.5, head: 6 });
    }
    return { left, right };
  }

  /**
   * Espira vista de canto, girando en el plano de la pantalla dentro de un campo B horizontal (→).
   * `theta` es el ángulo entre B y la normal de la espira: con 0 la espira queda perpendicular al
   * campo (flujo máximo) y con 90° paralela (flujo nulo). `dir` (−1..1) marca el sentido de la
   * corriente en los dos lados activos: ⊙ sale de la hoja y ⊗ entra (positivo: sale en el lado A).
   * Devuelve los extremos { a, b } y el versor de la velocidad de cada uno { va, vb }.
   */
  function drawEdgeLoop(ctx, cx, cy, { theta, half = 60, dir = 0 } = {}) {
    const c = colors();
    const a = [cx - half * Math.sin(theta), cy - half * Math.cos(theta)];
    const b = [cx + half * Math.sin(theta), cy + half * Math.cos(theta)];
    const va = [-Math.cos(theta), Math.sin(theta)];
    const vb = [-va[0], -va[1]];
    polyline(ctx, [a, b], { color: c.accent, width: 5 });
    circle(ctx, cx, cy, 4, { fill: c.wire });
    [[a, 1], [b, -1]].forEach(([p, side]) => {
      circle(ctx, p[0], p[1], 9, { fill: c.surface, stroke: c.wire, width: 2 });
      if (Math.abs(dir) < 0.04) return;
      const out = dir * side > 0;
      ctx.save();
      ctx.globalAlpha = Math.min(1, 0.35 + Math.abs(dir));
      if (out) circle(ctx, p[0], p[1], 3.5, { fill: c.text });
      else polyline(ctx, [[p[0] - 4.5, p[1] - 4.5], [p[0] + 4.5, p[1] + 4.5]], { color: c.text, width: 2 });
      if (!out) polyline(ctx, [[p[0] - 4.5, p[1] + 4.5], [p[0] + 4.5, p[1] - 4.5]], { color: c.text, width: 2 });
      ctx.restore();
    });
    return { a, b, va, vb };
  }

  Object.assign(Elec, { drawPoles, drawEdgeLoop, drawOpAmp, drawGate, drawBjt, drawMosfet, drawLamp, drawLed, drawCoil, drawSwitch, drawGround, headAt });
})();
