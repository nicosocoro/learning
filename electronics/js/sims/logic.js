// Lección 25: explorador de compuertas lógicas. Se eligen las entradas (0 o 1) y se ve el estado de
// cada cable y de la salida, con la tabla de verdad y la fila activa resaltada. Incluye un semisumador.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { drawGate, polyline, text, circle } = Elec;

  const GATES = {
    AND: { fn: (a, b) => a & b, expr: 'Y = A · B' },
    OR: { fn: (a, b) => a | b, expr: 'Y = A + B' },
    NOT: { fn: (a) => 1 - a, expr: 'Y = Ā', single: true },
    NAND: { fn: (a, b) => 1 - (a & b), expr: 'Y = (A · B)‾' },
    NOR: { fn: (a, b) => 1 - (a | b), expr: 'Y = (A + B)‾' },
    XOR: { fn: (a, b) => a ^ b, expr: 'Y = A ⊕ B' },
    HALF: { fn: (a, b) => a ^ b, expr: 'S = A ⊕ B · C = A · B' },
  };

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Compuertas lógicas: entradas, salida y tabla de verdad',
    label: 'Una compuerta lógica con sus entradas A y B y su salida, y a la derecha su tabla de verdad con la fila actual resaltada',
    caption: 'Naranja = nivel alto (1); gris = nivel bajo (0). El semisumador suma dos bits: la salida S es el bit de la suma y C el acarreo.',
    controls: [
      {
        type: 'choice', key: 'gate', label: 'Compuerta', value: 'AND',
        options: Object.keys(GATES).map((k) => ({ value: k, label: k === 'HALF' ? 'Semisumador' : k })),
      },
      { type: 'choice', key: 'a', label: 'Entrada A', value: 0, options: [{ value: 0, label: '0 (bajo)' }, { value: 1, label: '1 (alto)' }] },
      { type: 'choice', key: 'b', label: 'Entrada B', value: 0, options: [{ value: 0, label: '0 (bajo)' }, { value: 1, label: '1 (alto)' }] },
      { type: 'choice', key: 'vcc', label: 'Familia lógica', value: 5, options: [{ value: 5, label: '5 V' }, { value: 3.3, label: '3,3 V' }] },
    ],

    setup({ params }) {
      const out = () => {
        const g = GATES[params.gate];
        return g.single ? g.fn(params.a) : g.fn(params.a, params.b);
      };
      return {
        step() {}, // sin dinámica: el circuito responde al instante
        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const a = params.a;
          const b = params.b;
          const g = GATES[params.gate];
          const half = params.gate === 'HALF';
          const hi = (v) => (v ? c.chargePos : c.muted);
          const wire = (pts, v) => polyline(ctx, pts, { color: hi(v), width: v ? 4 : 3 });
          const volt = (v) => (v ? `${String(params.vcc).replace('.', ',')} V` : '0 V');
          const x0 = w * 0.08;
          const xg = w * 0.3;
          const ym = h * 0.5;

          const led = (x, y, v, label) => {
            circle(ctx, x, y, 17, { fill: v ? c.good : c.surface, stroke: c.wire, width: 2.5 });
            text(ctx, String(v), x, y + 1, { align: 'center', weight: 700, size: 16, color: v ? '#fff' : c.muted });
            text(ctx, label, x, y + 34, { align: 'center', size: 12, weight: 600, color: v ? c.good : c.muted });
          };
          const input = (y, v, name) => {
            circle(ctx, x0, y, 14, { fill: v ? c.chargePos : c.surface, stroke: c.wire, width: 2.5 });
            text(ctx, String(v), x0, y + 1, { align: 'center', weight: 700, size: 14, color: v ? '#fff' : c.muted });
            text(ctx, name, x0 - 22, y - 7, { align: 'right', weight: 700, size: 14 });
            text(ctx, volt(v), x0 - 22, y + 9, { align: 'right', size: 11, color: c.muted });
          };

          if (!half) {
            const nodes = drawGate(ctx, xg, ym, { type: params.gate, size: Math.min(110, h * 0.3), high: out() === 1 });
            const ya = nodes.a[1];
            const yb = nodes.b ? nodes.b[1] : ya;
            input(ya, a, 'A');
            wire([[x0 + 14, ya], nodes.a], a);
            if (nodes.b) {
              input(yb, b, 'B');
              wire([[x0 + 14, yb], nodes.b], b);
            }
            const xe = w * 0.5;
            wire([nodes.out, [xe, nodes.out[1]]], out());
            led(xe + 28, nodes.out[1], out(), `Y = ${volt(out())}`);
          } else {
            const s1 = h * 0.28;
            const s2 = h * 0.72;
            const sz = Math.min(90, h * 0.22);
            const gx = drawGate(ctx, xg + 20, s1, { type: 'XOR', size: sz });
            const ga = drawGate(ctx, xg + 20, s2, { type: 'AND', size: sz });
            const xa = x0 + 56;
            const xb2 = x0 + 86;
            const ya = h * 0.46;
            const yb = h * 0.54;
            input(ya - 4, a, 'A');
            input(yb + 24, b, 'B');
            wire([[x0 + 14, ya - 4], [xa, ya - 4]], a);
            wire([[xa, ya - 4], [xa, gx.a[1]], gx.a], a);
            wire([[xa, ya - 4], [xa, ga.a[1]], ga.a], a);
            wire([[x0 + 14, yb + 24], [xb2, yb + 24]], b);
            wire([[xb2, yb + 24], [xb2, gx.b[1]], [gx.b[0] - 8, gx.b[1]], gx.b], b);
            wire([[xb2, yb + 24], [xb2, ga.b[1]], ga.b], b);
            circle(ctx, xa, ya - 4, 3.5, { fill: hi(a) });
            circle(ctx, xb2, yb + 24, 3.5, { fill: hi(b) });
            const sOut = a ^ b;
            const cOut = a & b;
            const xe = w * 0.5;
            wire([gx.out, [xe, gx.out[1]]], sOut);
            wire([ga.out, [xe, ga.out[1]]], cOut);
            led(xe + 28, gx.out[1], sOut, `S = ${volt(sOut)}`);
            led(xe + 28, ga.out[1], cOut, `C = ${volt(cOut)}`);
            text(ctx, 'XOR', xg + 20, s1 - sz * 0.62, { align: 'center', size: 11, color: c.muted });
            text(ctx, 'AND', xg + 20, s2 - sz * 0.62, { align: 'center', size: 11, color: c.muted });
          }

          // tabla de verdad
          const tx = w * 0.7;
          const rowH = Math.min(34, h * 0.12);
          const colW = Math.min(52, w * 0.07);
          const single = g.single;
          const cols = single ? ['A', 'Y'] : half ? ['A', 'B', 'S', 'C'] : ['A', 'B', 'Y'];
          const rows = single ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
          const ty = h * 0.5 - ((rows.length + 1) * rowH) / 2;
          text(ctx, 'Tabla de verdad', tx + (cols.length * colW) / 2, ty - 16, { align: 'center', weight: 700, size: 13 });
          cols.forEach((name, i) => text(ctx, name, tx + i * colW + colW / 2, ty + rowH / 2, { align: 'center', weight: 700, size: 14, color: c.accent }));
          polyline(ctx, [[tx, ty + rowH], [tx + cols.length * colW, ty + rowH]], { color: c.wire, width: 2 });
          rows.forEach((r, k) => {
            const y = ty + rowH * (k + 1) + rowH / 2;
            const active = single ? r[0] === a : r[0] === a && r[1] === b;
            if (active) {
              ctx.save();
              ctx.globalAlpha = 0.18;
              ctx.fillStyle = c.accent;
              ctx.fillRect(tx - 6, y - rowH / 2 + 2, cols.length * colW + 12, rowH - 4);
              ctx.restore();
            }
            const vals = single ? [r[0], g.fn(r[0])] : half ? [r[0], r[1], r[0] ^ r[1], r[0] & r[1]] : [r[0], r[1], g.fn(r[0], r[1])];
            vals.forEach((v, i) => text(ctx, String(v), tx + i * colW + colW / 2, y, { align: 'center', weight: active ? 700 : 400, size: 15, color: v ? c.chargePos : c.muted }));
          });
        },

        formulas() {
          const a = params.a;
          const b = params.b;
          const o = out();
          if (params.gate === 'HALF') {
            return [
              { name: 'Bit de suma', sym: 'S = A ⊕ B  (XOR)', val: `S = ${a} ⊕ ${b} = ${a ^ b}` },
              { name: 'Acarreo', sym: 'C = A · B  (AND)', val: `C = ${a} · ${b} = ${a & b}` },
              { name: 'En aritmética binaria', sym: 'A + B = C S', val: `${a} + ${b} = ${a & b}${a ^ b} (binario) = ${a + b} (decimal)` },
            ];
          }
          const rows = [{ name: 'Expresión booleana', sym: GATES[params.gate].expr, val: params.gate === 'NOT' ? `Y = no ${a} = ${o}` : `Y = ${a} y ${b} → ${o}` }];
          rows.push({ name: 'Tensión de la salida', sym: 'nivel alto = V<sub>CC</sub> · nivel bajo = 0 V', val: `Y = ${o ? String(params.vcc).replace('.', ',') + ' V (alto)' : '0 V (bajo)'}` });
          if (params.gate === 'NAND' || params.gate === 'NOR') rows.push({ name: 'Compuerta universal', sym: 'con NAND (o NOR) se arma cualquier otra', val: 'Uniendo las dos entradas, NAND se comporta como NOT' });
          return rows;
        },
      };
    },
  });
})();
