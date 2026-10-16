// Lección 17: MOSFET de canal N como interruptor de potencia. La tensión de compuerta (Vgs) abre el
// canal; la compuerta es un capacitor que se carga a través de Rg, y el calor depende de Rds(on).

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { FlowPath, visualSpeed } = Elec;
  const { drawBattery, drawResistor, drawMosfet, drawGround, polyline, text, arrow, circle } = Elec;
  const { si, num } = Elec;

  const VDD = 12;
  const CG = 2e-9; //          capacidad de compuerta (2 nF, típica de un MOSFET de potencia pequeño)
  const SLOW = 1e5; //         factor de cámara lenta para poder ver la carga de la compuerta
  const P_LIMIT = 2; //        potencia que aguanta sin disipador (TO-220 en aire libre)
  const DEVICES = {
    logic: { name: 'nivel lógico', vth: 1.8, vfull: 4.5, ron: 0.025, k: 2.0 },
    standard: { name: 'estándar', vth: 3.5, vfull: 10, ron: 0.044, k: 1.0 },
  };

  function solve(vgs, { device, rl }) {
    const d = DEVICES[device];
    const vov = vgs - d.vth;
    if (vov <= 0) return { id: 0, vds: VDD, ron: Infinity, region: 'corte', p: 0, d };
    const ron = d.ron * Math.max(1, (d.vfull - d.vth) / vov);
    const idLin = VDD / (rl + ron);
    const idSat = d.k * vov * vov;
    if (idLin <= idSat) return { id: idLin, vds: idLin * ron, ron, region: 'lineal', p: idLin * idLin * ron, d };
    const vds = VDD - idSat * rl;
    return { id: idSat, vds, ron: vds / idSat, region: 'saturación', p: vds * idSat, d };
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'MOSFET de canal N: la tensión de compuerta manda',
    label: 'Circuito con un MOSFET de canal N, una resistencia de compuerta, una carga de 12 voltios y una gráfica de la corriente de drenador según la tensión de compuerta',
    caption: 'La compuerta está aislada: casi no pasa corriente por ella, salvo un instante al cargarla. La carga de la compuerta se muestra en cámara lenta (×100 000).',
    chart: true,
    controls: [
      { type: 'choice', key: 'device', label: 'Tipo de MOSFET', value: 'logic', options: [{ value: 'logic', label: 'Nivel lógico (V<sub>th</sub> ≈ 1,8 V)' }, { value: 'standard', label: 'Estándar (V<sub>th</sub> ≈ 3,5 V)' }] },
      { type: 'choice', key: 'drive', label: 'Señal de control', value: 'on', options: [{ value: 'off', label: '0 V' }, { value: 'on', label: 'Encendida' }] },
      { key: 'vdrive', label: 'Tensión de la señal (V<sub>GS</sub> objetivo)', min: 0, max: 12, step: 0.5, value: 5, unit: 'V' },
      { key: 'rg', label: 'Resistor de compuerta (R<sub>G</sub>)', values: [10, 100, 1000, 10000], value: 100, unit: 'Ω' },
      { key: 'rl', label: 'Resistencia de la carga', min: 2, max: 30, step: 1, value: 6, unit: 'Ω' },
    ],

    setup({ params, chart }) {
      let vg = 0;
      const gate = new FlowPath();
      const loopIn = new FlowPath();
      const loopOut = new FlowPath();
      const target = () => (params.drive === 'on' ? params.vdrive : 0);

      return {
        reset() {
          vg = 0;
          for (const p of [gate, loopIn, loopOut]) p.phase = 0;
        },

        step(dt) {
          const tau = params.rg * CG * SLOW;
          vg += (target() - vg) * (1 - Math.exp(-dt / tau));
          const s = solve(vg, params);
          const ig = (target() - vg) / params.rg;
          gate.advance(dt, -Math.sign(ig) * visualSpeed(ig, 0.05));
          const coll = -visualSpeed(s.id, 3);
          loopIn.advance(dt, coll);
          loopOut.advance(dt, coll);
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const s = solve(vg, params);
          const x0 = w * 0.1;
          const xb = w * 0.3;
          const xt = w * 0.52;
          const x2 = w * 0.9;
          const y0 = h * 0.14;
          const y1 = h * 0.86;
          const ym = h * 0.5;
          const size = Math.min(72, h * 0.19);
          const n = { g: [xt - 0.62 * size, ym], d: [xt + 0.3 * size, ym - 0.75 * size], s: [xt + 0.3 * size, ym + 0.75 * size] };
          const xd = n.d[0];
          const lampY = (y0 + n.d[1]) / 2 + 2;
          const hot = Math.min(1, s.p / P_LIMIT);
          const boxR = x0 + 34;
          const ig = (target() - vg) / params.rg;

          polyline(ctx, [[boxR, ym], [xb - 45, ym]], { color: c.wire, width: 3 });
          polyline(ctx, [[xb + 45, ym], n.g], { color: c.wire, width: 3 });
          polyline(ctx, [[x2, ym - 32], [x2, y0], [xd, y0], n.d], { color: c.wire, width: 3 });
          polyline(ctx, [n.s, [n.s[0], y1], [x2, y1], [x2, ym + 32]], { color: c.wire, width: 3 });
          polyline(ctx, [[n.s[0], y1], [x0, y1], [x0, ym + 32]], { color: c.wire, width: 3 });

          const show = (p, pts, i, min) => {
            p.setPoints(pts);
            if (Math.abs(i) > min) p.draw(ctx, { spacing: 22, radius: 4.5 });
          };
          show(gate, [[boxR, ym], n.g], ig, 2e-6);
          show(loopIn, [[x2, ym - 32], [x2, y0], [xd, y0], n.d], s.id, 1e-4);
          show(loopOut, [n.s, [n.s[0], y1], [x2, y1], [x2, ym + 32]], s.id, 1e-4);

          // señal
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(x0 - 34, ym - 32, 68, 64, 6);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          text(ctx, 'Señal', x0, ym - 14, { align: 'center', size: 12, color: c.muted });
          text(ctx, si(target(), 'V'), x0, ym + 6, { align: 'center', weight: 700, color: target() > 0 ? c.accent : c.muted });
          text(ctx, 'objetivo', x0, ym + 22, { align: 'center', size: 11, color: c.muted });

          drawBattery(ctx, x2, ym, { orient: 'v' });
          text(ctx, si(VDD, 'V'), x2 + 32, ym, { weight: 600, color: c.accent });
          drawResistor(ctx, xb, ym, { len: 90, heat: 0 });
          drawResistor(ctx, xd, lampY, { orient: 'v', len: Math.min(100, (n.d[1] - y0) * 0.75), heat: Math.min(1, (s.id * s.id * params.rl) / 60) });
          drawMosfet(ctx, xt, ym, { size, on: s.region === 'corte' ? 0 : Math.min(1, s.id / Math.max(VDD / params.rl, 1e-9)), heat: hot > 0.4 ? hot : 0 });
          drawGround(ctx, x0, y1);

          // capacitor de compuerta (dibujado entre compuerta y fuente)
          const cx = n.g[0] - 24;
          const q = Math.min(1, vg / 12);
          polyline(ctx, [[cx, ym], [cx, ym + 24]], { color: c.muted, width: 2 });
          polyline(ctx, [[cx - 10, ym + 24], [cx + 10, ym + 24]], { color: c.text, width: 3 });
          polyline(ctx, [[cx - 10, ym + 32], [cx + 10, ym + 32]], { color: c.text, width: 3 });
          polyline(ctx, [[cx, ym + 32], [cx, ym + 44]], { color: c.muted, width: 2 });
          text(ctx, 'Cg', cx - 14, ym + 28, { align: 'right', size: 11, color: c.muted });
          ctx.save();
          ctx.globalAlpha = 0.5 * q;
          ctx.fillStyle = c.accent;
          ctx.fillRect(cx - 10, ym + 25, 20, 6);
          ctx.restore();

          text(ctx, `RG = ${si(params.rg, 'Ω')}`, xb, ym - 32, { align: 'center', weight: 600, size: 12 });
          text(ctx, `carga ${si(params.rl, 'Ω')}`, xd + 40, lampY, { weight: 600, size: 12 });
          text(ctx, `Vgs = ${si(vg, 'V')}`, n.g[0] - 4, ym - 22, { align: 'right', weight: 700, color: c.accent, size: 13 });
          arrow(ctx, xd + 44, lampY - 60, xd + 44, lampY - 32, { color: c.chargePos });
          text(ctx, `Id = ${si(s.id, 'A')}`, xd + 58, lampY - 46, { color: c.chargePos, size: 12, weight: 600 });

          const col = s.region === 'lineal' ? c.good : s.region === 'saturación' ? c.bad : c.muted;
          const label = s.region === 'saturación' ? 'saturación (limita la corriente: ¡caliente!)' : s.region;
          text(ctx, `Región: ${label}`, xt, h * 0.95, { align: 'center', weight: 700, color: col, size: 13 });
          text(ctx, `Vds = ${si(s.vds, 'V')}  ·  P = ${si(s.p, 'W')}${s.p > P_LIMIT ? '  ¡se quema!' : ''}`, xt, h * 0.95 - 20, { align: 'center', size: 12, color: s.p > P_LIMIT ? c.bad : c.muted, weight: s.p > P_LIMIT ? 700 : 400 });

          this.drawChart(c, s);
        },

        drawChart(c, s) {
          const pts = [];
          for (let k = 0; k <= 120; k++) {
            const v = (12 * k) / 120;
            pts.push([v, solve(v, params).id]);
          }
          const demand = VDD / params.rl;
          const yMax = Math.ceil(demand * 1.25 * 2) / 2;
          chart.draw({
            xMax: 12,
            yMax,
            xTicks: [0, 2, 4, 6, 8, 10, 12].map((v) => ({ value: v, label: `${v} V` })),
            yTicks: [0, 0.5, 1].map((f) => ({ value: f * yMax, label: `${num(f * yMax)} A` })),
            series: [{ points: pts, color: c.accent }],
            hlines: [{ y: demand, label: 'lo que pide la carga', color: c.good }],
            cursor: { x: Math.min(12, vg), y: s.id, color: c.chargePos },
            xLabel: 'tensión de compuerta Vgs',
            yLabel: 'corriente de drenador Id',
          });
        },

        formulas() {
          const s = solve(vg, params);
          const d = DEVICES[params.device];
          const rows = [
            { name: 'Tensión de compuerta (cargándose)', sym: 'v<sub>GS</sub>(t) → V<sub>señal</sub>', val: `Vgs = ${si(vg, 'V')}  (umbral Vth = ${num(d.vth)} V)` },
            { name: 'Constante de tiempo de la compuerta', sym: 'τ = R<sub>G</sub> · C<sub>G</sub>', val: `τ = ${si(params.rg, 'Ω')} · 2 nF = ${si(params.rg * CG, 's')}` },
          ];
          if (s.region === 'corte') {
            rows.push({ name: 'Canal', sym: 'V<sub>GS</sub> &lt; V<sub>th</sub>', val: `${si(vg, 'V')} < ${num(d.vth)} V: no hay canal, I<sub>D</sub> = 0` });
          } else {
            rows.push({ name: 'Resistencia del canal', sym: 'R<sub>DS(on)</sub> (baja al subir V<sub>GS</sub>)', val: `Rds(on) ≈ ${si(s.ron, 'Ω')}` });
            rows.push({
              name: 'Corriente de drenador',
              sym: s.region === 'lineal' ? 'I<sub>D</sub> = V<sub>DD</sub> / (R + R<sub>DS(on)</sub>)' : 'I<sub>D</sub> = K · (V<sub>GS</sub> − V<sub>th</sub>)²',
              val: s.region === 'lineal' ? `Id = 12 V / (${si(params.rl, 'Ω')} + ${si(s.ron, 'Ω')}) = ${si(s.id, 'A')}` : `Id = ${num(d.k)} · (${num(vg - d.vth)})² = ${si(s.id, 'A')}  (limitada: no llega a ${si(VDD / params.rl, 'A')})`,
            });
          }
          rows.push({ name: 'Potencia en el MOSFET', sym: 'P = V<sub>DS</sub> · I<sub>D</sub>', val: `P = ${si(s.vds, 'V')} · ${si(s.id, 'A')} = ${si(s.p, 'W')}` });
          return rows;
        },
      };
    },
  });
})();
