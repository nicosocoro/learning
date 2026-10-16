// Capítulo 5: laboratorio con un multímetro virtual sobre un circuito serie de dos resistencias.
//
//   A ──[ R1 ]── B
//   │            │
// batería       R2
//   │            │
//   └────────────C   (C es la referencia de 0 V)

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, FlowPath, visualSpeed, drawBattery, drawResistor, polyline, text, circle, si } = Elec;

  const I_MAX = 0.05;
  const LEAD_RED = '#c0392b';
  const MODE_ANGLE = { V: -50, A: 0, O: 50 }; // posición del selector, en grados
  const MODE_NAME = { V: 'V', A: 'A', O: 'Ω' };
  const nodeOptions = [{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'C', label: 'C' }];

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Multímetro virtual',
    label: 'Circuito de una batería y dos resistencias con un multímetro y sus puntas de prueba',
    caption: 'Elegí la función del multímetro y dónde apoyar las puntas. Probá también los errores típicos: medir corriente en paralelo o resistencia con la fuente conectada.',
    controls: [
      { type: 'choice', key: 'mode', label: 'Selector del multímetro', value: 'V', options: [{ value: 'V', label: 'Voltios' }, { value: 'A', label: 'Amperios' }, { value: 'O', label: 'Ohmios' }] },
      { type: 'choice', key: 'red', label: 'Punta roja en (modos V y Ω)', value: 'A', options: nodeOptions },
      { type: 'choice', key: 'black', label: 'Punta negra en (modos V y Ω)', value: 'C', options: nodeOptions },
      { type: 'choice', key: 'amp', label: 'Conexión del amperímetro (modo A)', value: 'series', options: [{ value: 'series', label: 'En serie' }, { value: 'par1', label: 'Paralelo a R₁' }, { value: 'par2', label: 'Paralelo a R₂' }] },
      { type: 'choice', key: 'source', label: 'Fuente', value: 'on', options: [{ value: 'on', label: 'Conectada' }, { value: 'off', label: 'Retirada' }] },
      { key: 'v', label: 'Tensión de la fuente', min: 1, max: 12, step: 1, value: 9, unit: 'V' },
      { key: 'r1', label: 'Resistencia R<sub>1</sub>', min: 100, max: 1000, step: 100, value: 300, unit: 'Ω' },
      { key: 'r2', label: 'Resistencia R<sub>2</sub>', min: 100, max: 1000, step: 100, value: 600, unit: 'Ω' },
    ],

    setup({ params }) {
      const loop = new FlowPath([], { closed: true });
      const powered = () => params.source === 'on';
      const circuitCurrent = () => (powered() ? params.v / (params.r1 + params.r2) : 0);

      /** Tensión de cada nodo respecto de C (la referencia). */
      function nodeVolts() {
        const i = circuitCurrent();
        return { A: powered() ? params.v : 0, B: powered() ? params.v - i * params.r1 : 0, C: 0 };
      }

      /** Resultado de la medición: lectura, aviso y fórmulas que explican el valor. */
      function measure() {
        const { mode, red, black, amp } = params;
        const volts = nodeVolts();
        const empty = { reading: '', unit: '', note: '', rows: [], current: circuitCurrent(), leads: [red, black] };

        if (mode === 'V') {
          const x = volts[red] - volts[black];
          return {
            ...empty,
            reading: si(x, 'V'),
            note: red === black
              ? 'Las dos puntas están en el mismo punto: no hay diferencia de potencial (0 V).'
              : x < 0
                ? 'Lectura negativa: la punta roja está en el punto de menor potencial. Las puntas están “al revés”.'
                : powered() ? 'Para medir tensión el multímetro va en paralelo con lo que se quiere medir.' : 'Sin fuente no hay diferencia de potencial en ningún punto.',
            rows: [{ name: 'Tensión medida', sym: `V<sub>${red}${black}</sub> = V<sub>${red}</sub> − V<sub>${black}</sub>`, val: `${si(volts[red], 'V')} − ${si(volts[black], 'V')} = ${si(x, 'V')}` }],
          };
        }

        if (mode === 'A') {
          const cases = {
            series: { i: circuitCurrent(), leads: ['A', 'P'], note: 'Bien: se abrió el circuito y el multímetro quedó en serie, así que toda la corriente pasa por él.', formula: 'I = V / (R₁ + R₂)', val: `I = ${si(params.v, 'V')} / ${si(params.r1 + params.r2, 'Ω')}` },
            par1: { i: powered() ? params.v / params.r2 : 0, leads: ['A', 'B'], note: '¡Error! Conectado en paralelo con R₁ el amperímetro (casi 0 Ω) la cortocircuita y cambia el circuito. Con fuentes potentes quema el fusible.', formula: 'I = V / R₂ (R₁ queda puenteada)', val: `I = ${si(params.v, 'V')} / ${si(params.r2, 'Ω')}` },
            par2: { i: powered() ? params.v / params.r1 : 0, leads: ['B', 'C'], note: '¡Error! Conectado en paralelo con R₂ el amperímetro la cortocircuita y cambia el circuito. Con fuentes potentes quema el fusible.', formula: 'I = V / R₁ (R₂ queda puenteada)', val: `I = ${si(params.v, 'V')} / ${si(params.r1, 'Ω')}` },
          };
          const chosen = cases[amp];
          return {
            ...empty,
            reading: si(chosen.i, 'A'),
            note: powered() ? chosen.note : 'Sin fuente no circula corriente.',
            current: chosen.i,
            leads: chosen.leads,
            rows: [{ name: 'Corriente medida', sym: chosen.formula, val: powered() ? `${chosen.val} = ${si(chosen.i, 'A')}` : '0 A (fuente retirada)' }],
          };
        }

        if (powered()) {
          return { ...empty, reading: 'ERR', note: 'La resistencia se mide siempre con el circuito sin energía: la tensión de la fuente falsea la lectura y puede dañar el multímetro. Retirá la fuente.', rows: [] };
        }
        const pair = [red, black].sort().join('');
        const ohms = { AB: params.r1, BC: params.r2, AC: params.r1 + params.r2 }[pair] ?? 0;
        const formula = { AB: 'R<sub>AB</sub> = R<sub>1</sub>', BC: 'R<sub>BC</sub> = R<sub>2</sub>', AC: 'R<sub>AC</sub> = R<sub>1</sub> + R<sub>2</sub>' }[pair];
        return {
          ...empty,
          reading: si(ohms, 'Ω'),
          note: red === black ? 'Las dos puntas en el mismo punto: 0 Ω (es un cable).' : 'Bien: sin fuente, el multímetro inyecta una corriente pequeña propia y mide la resistencia entre las puntas.',
          rows: formula ? [{ name: 'Resistencia medida', sym: formula, val: si(ohms, 'Ω') }] : [{ name: 'Resistencia medida', sym: 'R = 0', val: '0 Ω' }],
        };
      }

      const wrap = (str, width) => {
        const lines = [];
        let line = '';
        for (const word of str.split(' ')) {
          if ((line + word).length > width) {
            lines.push(line.trim());
            line = '';
          }
          line += `${word} `;
        }
        if (line.trim()) lines.push(line.trim());
        return lines;
      };

      return {
        reset() {
          loop.phase = 0;
        },

        step(dt) {
          loop.advance(dt, -visualSpeed(measure().current, I_MAX));
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const result = measure();

          // ---- Circuito
          const x0 = Math.max(w * 0.1, 56);
          const x1 = w * 0.5;
          const y0 = h * 0.17;
          const y1 = h * 0.6;
          const xm = (x0 + x1) / 2;
          const ym = (y0 + y1) / 2;
          const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
          const i = circuitCurrent();
          const nodes = { A: [x0, y0], B: [x1, y0], C: [x1, y1], P: [xm - 58, y0] };

          polyline(ctx, corners, { color: c.wire, width: 3, close: true });
          ctx.save();
          ctx.globalAlpha = powered() ? 1 : 0.3;
          drawBattery(ctx, x0, ym, { orient: 'v' });
          ctx.restore();
          drawResistor(ctx, xm, y0, { len: 90, heat: Math.min(1, (i * i * params.r1) / 0.05) });
          drawResistor(ctx, x1, ym, { orient: 'v', len: 80, heat: Math.min(1, (i * i * params.r2) / 0.05) });
          if (powered() && result.current > 0) {
            loop.setPoints(corners);
            loop.draw(ctx, { radius: 4.5 });
          }
          text(ctx, `R₁ = ${si(params.r1, 'Ω')}`, xm, y0 - 26, { align: 'center', size: 12, weight: 600 });
          text(ctx, `R₂ = ${si(params.r2, 'Ω')}`, x1 - 26, ym, { align: 'right', size: 12, weight: 600 });
          text(ctx, powered() ? si(params.v, 'V') : 'fuente retirada', x0 - 24, ym, { align: 'right', size: 12, color: c.accent, weight: 600 });
          for (const [name, [nx, ny]] of Object.entries(nodes)) {
            if (name === 'P') continue;
            circle(ctx, nx, ny, 5, { fill: c.accent });
          }
          text(ctx, 'A', x0 - 10, y0 - 14, { align: 'center', weight: 700 });
          text(ctx, 'B', x1 + 10, y0 - 14, { align: 'center', weight: 700 });
          text(ctx, 'C', x1 + 10, y1 + 16, { align: 'center', weight: 700 });
          wrap(result.note, Math.max(18, Math.floor((x1 - x0 + 60) / 6.4))).forEach((line, n) => {
            text(ctx, line, x0 - 30, y1 + 44 + n * 16, { size: 12, color: result.note.startsWith('¡') || result.note.startsWith('Lectura negativa') || result.reading === 'ERR' ? c.accent : c.muted });
          });

          // ---- Multímetro
          const bx = w * 0.62;
          const bw = w * 0.35;
          const by = h * 0.05;
          const bh = h * 0.9;
          ctx.fillStyle = c.surface2;
          ctx.strokeStyle = c.text;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 12);
          ctx.fill();
          ctx.stroke();

          // Pantalla LCD (siempre clara, como una real)
          const lx = bx + 12;
          const ly = by + 12;
          const lw = bw - 24;
          const lh = bh * 0.24;
          ctx.fillStyle = '#cfdcb8';
          ctx.fillRect(lx, ly, lw, lh);
          ctx.strokeStyle = c.text;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(lx, ly, lw, lh);
          ctx.fillStyle = '#1d2a14';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.font = `600 ${Math.min(30, lw / 5.5)}px ui-monospace, Menlo, monospace`;
          ctx.fillText(result.reading || '0', lx + lw - 10, ly + lh * 0.55);
          ctx.font = '600 11px ui-monospace, Menlo, monospace';
          ctx.textAlign = 'left';
          ctx.fillText(params.mode === 'V' ? 'DC V' : params.mode === 'A' ? 'DC A' : 'OHM', lx + 8, ly + 12);

          // Selector giratorio
          const dcx = bx + bw / 2;
          const dcy = by + bh * 0.56;
          const dr = Math.min(bw * 0.24, bh * 0.17);
          circle(ctx, dcx, dcy, dr, { fill: c.surface, stroke: c.text, width: 2.5 });
          for (const [mode, deg] of Object.entries(MODE_ANGLE)) {
            const rad = (deg * Math.PI) / 180;
            const on = mode === params.mode;
            text(ctx, MODE_NAME[mode], dcx + (dr + 14) * Math.sin(rad), dcy - (dr + 14) * Math.cos(rad), { align: 'center', weight: on ? 700 : 400, color: on ? c.accent : c.muted });
          }
          const angle = (MODE_ANGLE[params.mode] * Math.PI) / 180;
          polyline(ctx, [[dcx, dcy], [dcx + dr * 0.85 * Math.sin(angle), dcy - dr * 0.85 * Math.cos(angle)]], { color: c.accent, width: 4 });
          circle(ctx, dcx, dcy, 4, { fill: c.text });

          // Bornes
          const jy = by + bh * 0.9;
          const jacks = { COM: bx + bw * 0.2, VO: bx + bw * 0.5, A: bx + bw * 0.8 };
          for (const [name, jx] of Object.entries(jacks)) {
            circle(ctx, jx, jy, 7, { fill: c.surface, stroke: c.text, width: 2 });
            text(ctx, name === 'VO' ? 'VΩ' : name, jx, jy - 16, { align: 'center', size: 11, color: c.muted });
          }

          // Puntas
          const redJack = params.mode === 'A' ? jacks.A : jacks.VO;
          const [redNode, blackNode] = result.leads;
          const lead = (jx, [nx, ny], color) => {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(jx, jy + 7);
            ctx.bezierCurveTo(jx, Math.min(h - 2, jy + 60), nx + 50, ny + 70, nx, ny);
            ctx.stroke();
            ctx.restore();
            circle(ctx, nx, ny, 5.5, { fill: color });
          };
          lead(jacks.COM, nodes[blackNode], c.text);
          lead(redJack, nodes[redNode], LEAD_RED);
          if (params.mode === 'A' && params.amp === 'series') {
            text(ctx, 'circuito abierto aquí', nodes.P[0] - 30, y0 + 22, { size: 11, color: c.accent, align: 'center' });
          }
        },

        formulas() {
          const i = circuitCurrent();
          const volts = nodeVolts();
          const rows = [...measure().rows];
          rows.push(
            { name: 'Referencia del circuito', sym: 'I = V / (R₁ + R₂)', val: `I = ${si(params.v, 'V')} / ${si(params.r1 + params.r2, 'Ω')} = ${si(i, 'A')}` },
            { name: 'Tensión en el punto B', sym: 'V<sub>B</sub> = V − I · R<sub>1</sub>', val: `V_B = ${si(volts.A, 'V')} − ${si(i, 'A')} · ${si(params.r1, 'Ω')} = ${si(volts.B, 'V')}` },
          );
          return rows;
        },
      };
    },
  });
})();
