// Lección 18: un relé electromecánico. La bobina (un electroimán con resistencia e inductancia) se
// energiza, la corriente crece con constante de tiempo L/R, y al pasar el umbral de cierre la
// armadura mueve el contacto de reposo (NC) al de trabajo (NA). El tiempo va en cámara lenta (×100).

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { drawBattery, drawCoil, drawLamp, drawLed, drawSwitch, drawGround, drawResistor, polyline, text, circle } = Elec;
  const { si, num } = Elec;

  const SLOW = 100; //            1 s real = 10 ms simulados
  const T_MECH = 0.003; //        la armadura tarda 3 ms en recorrer su camino
  const PULL = 0.75; //           cierra cuando la corriente llega al 75 % de la nominal
  const DROP = 0.2; //            abre cuando cae al 20 %
  const WINDOW = 0.03; //         ventana de la gráfica: 30 ms
  const RELAYS = {
    5: { v: 5, r: 70, label: '5 V · bobina de 70 Ω' },
    12: { v: 12, r: 400, label: '12 V · bobina de 400 Ω' },
  };
  const TAU = 0.002; //           L/R (2 ms) para ambos relés

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Relé: bobina, armadura y contactos',
    label: 'Relé dibujado con su bobina, la armadura que se mueve y los contactos común, normalmente abierto y normalmente cerrado, con una lámpara y un LED, y una gráfica de la corriente de la bobina',
    caption: 'Cámara lenta ×100: lo que dura 3 ms se ve en 0,3 s. Se supone un diodo en paralelo con la bobina que absorbe el pico al apagar (capítulo 19).',
    chart: true,
    controls: [
      { type: 'choice', key: 'enable', label: 'Interruptor del circuito de control', value: 'off', options: [{ value: 'off', label: 'Apagado' }, { value: 'on', label: 'Encendido' }] },
      { type: 'choice', key: 'relay', label: 'Relé', value: 12, options: [{ value: 5, label: '5 V' }, { value: 12, label: '12 V' }] },
      { key: 'vcoil', label: 'Tensión aplicada a la bobina', min: 0, max: 14, step: 0.5, value: 12, unit: 'V' },
    ],

    setup({ params, chart }) {
      const state = { i: 0, closed: false, a: 0, t: 0, enabled: false, tOn: 0, tOff: 0, tClose: null, tOpen: null, history: [] };
      let lastPush = 0;
      const rate = () => RELAYS[params.relay];
      const inom = () => rate().v / rate().r;

      return {
        reset() {
          Object.assign(state, { i: 0, closed: false, a: 0, t: 0, enabled: false, tOn: 0, tOff: 0, tClose: null, tOpen: null, history: [] });
          lastPush = 0;
        },

        step(dt) {
          const sdt = dt / SLOW;
          const on = params.enable === 'on';
          if (on && !state.enabled) { state.tOn = state.t; state.tClose = null; }
          if (!on && state.enabled) { state.tOff = state.t; state.tOpen = null; }
          state.enabled = on;
          state.t += sdt;

          const target = on ? params.vcoil / rate().r : 0;
          state.i += (target - state.i) * (1 - Math.exp(-sdt / TAU));

          if (!state.closed && state.i >= PULL * inom()) state.closed = true;
          if (state.closed && state.i <= DROP * inom()) state.closed = false;
          const goal = state.closed ? 1 : 0;
          const step = sdt / T_MECH;
          state.a += Math.sign(goal - state.a) * Math.min(step, Math.abs(goal - state.a));
          if (state.closed && state.a >= 1 && state.tClose === null && on) state.tClose = state.t - state.tOn;
          if (!state.closed && state.a <= 0 && state.tOpen === null && !on && state.tOff > 0) state.tOpen = state.t - state.tOff;

          if (state.t - lastPush >= 0.0002) {
            state.history.push([state.t, state.i, state.a]);
            lastPush = state.t;
            const cut = state.t - 0.05;
            while (state.history.length > 2 && state.history[0][0] < cut) state.history.shift();
          }
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const a = state.a;
          const inom_ = inom();

          // --- bobina y núcleo
          const xc = w * 0.2;
          const len = h * 0.36;
          const yc = h * 0.52;
          const yt = yc - len / 2;
          const yb = yc + len / 2;
          const coreTop = yt - 30;
          ctx.save();
          ctx.fillStyle = c.surface2 ?? c.surface;
          ctx.strokeStyle = c.muted;
          ctx.lineWidth = 1.5;
          ctx.fillRect(xc - 9, coreTop, 18, yb - coreTop - 6);
          ctx.strokeRect(xc - 9, coreTop, 18, yb - coreTop - 6);
          ctx.restore();
          drawCoil(ctx, xc, yc, { len, turns: 6, active: Math.min(1, state.i / inom_) });
          text(ctx, 'bobina', xc + 26, yc, { size: 12, color: c.muted });
        
          // --- circuito de control (abajo/izquierda)
          const x0 = w * 0.07;
          const ySw = yt;
          const on = params.enable === 'on';
          polyline(ctx, [[xc, yb], [xc, h * 0.88], [x0, h * 0.88], [x0, yc + 32]], { color: c.wire, width: 3 });
          polyline(ctx, [[x0, yc - 32], [x0, ySw], [xc - 32 - 30, ySw]], { color: c.wire, width: 3 });
          polyline(ctx, [[xc - 32 + 32, ySw], [xc, ySw], [xc, yt]], { color: c.wire, width: 3 });
          drawBattery(ctx, x0, yc, { orient: 'v' });
          drawSwitch(ctx, xc - 62, ySw, { len: 64, closed: on });
          text(ctx, si(params.vcoil, 'V'), x0 + 14, yc + 48, { size: 12, weight: 600, color: c.accent });
          text(ctx, on ? 'interruptor cerrado' : 'interruptor abierto', xc - 62, ySw - 18, { align: 'center', size: 11, color: on ? c.good : c.muted });

          // --- armadura y contactos
          const pivot = [xc + 40, coreTop - 28];
          const L1 = pivot[0] - (xc - 12);
          const L2 = w * 0.13;
          const thetaMax = Math.asin(20 / L1);
          const th = a * thetaMax;
          const leftTip = [pivot[0] - L1 * Math.cos(th), pivot[1] + L1 * Math.sin(th)];
          const rise = L2 * Math.sin(thetaMax);
          const rightTip = [pivot[0] + L2 * Math.cos(th), pivot[1] - L2 * Math.sin(th)];
          const pad = [pivot[0] + L2 * Math.cos(thetaMax * 0.2), pivot[1]];
          const noPad = [pad[0], pivot[1] - rise - 2];
          const ncPad = [pad[0], pivot[1] + 5];

          polyline(ctx, [leftTip, pivot, rightTip], { color: state.closed ? c.good : c.text, width: 5 });
          circle(ctx, pivot[0], pivot[1], 5, { fill: c.surface, stroke: c.wire, width: 2.5 });
          text(ctx, 'armadura', leftTip[0] - 6, leftTip[1] - 14, { align: 'right', size: 11, color: c.muted });

          // contactos
          const yTop = h * 0.09;
          polyline(ctx, [pivot, [pivot[0], yTop]], { color: c.wire, width: 3 });
          text(ctx, 'COM', pivot[0] + 8, yTop + 14, { size: 11, color: c.muted });
          text(ctx, '+12 V', pivot[0] - 10, yTop + 2, { align: 'right', size: 12, weight: 600, color: c.accent });
          circle(ctx, noPad[0], noPad[1], 5, { fill: c.wire });
          circle(ctx, ncPad[0], ncPad[1], 5, { fill: c.wire });
          text(ctx, 'NA', noPad[0] + 10, noPad[1] - 2, { size: 11, color: c.muted });
          text(ctx, 'NC', ncPad[0] + 10, ncPad[1] + 14, { size: 11, color: c.muted });

          // cargas: lámpara en NA, LED en NC
          const xl = w * 0.9;
          const xe = w * 0.78;
          const y1 = h * 0.88;
          const lampOn = a >= 0.98;
          const ledOn = a <= 0.02;
          polyline(ctx, [noPad, [xl, noPad[1]], [xl, h * 0.34]], { color: lampOn ? c.chargePos : c.wire, width: 3 });
          polyline(ctx, [[xl, h * 0.34 + 44], [xl, y1]], { color: c.wire, width: 3 });
          polyline(ctx, [ncPad, [xe, ncPad[1]], [xe, h * 0.5]], { color: ledOn ? c.chargePos : c.wire, width: 3 });
          polyline(ctx, [[xe, h * 0.5 + 40], [xe, y1]], { color: c.wire, width: 3 });
          drawLamp(ctx, xl, h * 0.34 + 22, { r: Math.min(22, h * 0.06), glow: lampOn ? 1 : 0 });
          drawLed(ctx, xe, h * 0.64, { orient: 'v', len: 64, glow: ledOn ? 1 : 0 });
          drawGround(ctx, xl, y1);
          drawGround(ctx, xe, y1);
          polyline(ctx, [[xe, h * 0.5], [xe, h * 0.64 - 32]], { color: c.wire, width: 3 });
          text(ctx, 'lámpara', xl + 34, h * 0.34 + 22, { size: 12, color: c.muted });
          text(ctx, 'LED', xe - 22, h * 0.64, { size: 12, color: c.muted, align: 'right' });
          text(ctx, lampOn ? 'contactos cerrados (NA)' : ledOn ? 'reposo (NC)' : 'en movimiento…', (pad[0] + xe) / 2, h * 0.95, { align: 'center', size: 13, weight: 700, color: lampOn ? c.good : c.muted });

          this.drawChart(c, inom_);
        },

        drawChart(c, inom_) {
          const x0 = Math.max(0, state.t - WINDOW);
          const pts = state.history.filter(([t]) => t >= x0).map(([t, i]) => [t * 1000, i * 1000]);
          const arm = state.history.filter(([t]) => t >= x0).map(([t, , a]) => [t * 1000, a * inom_ * 1.2 * 1000]);
          const yMax = Math.ceil(inom_ * 1.4 * 1000 / 10) * 10;
          const ticks = [0, 10, 20, 30].map((d) => ({ value: x0 * 1000 + d, label: `${num(x0 * 1000 + d, 3)} ms` }));
          chart.draw({
            xMin: x0 * 1000,
            xMax: x0 * 1000 + WINDOW * 1000,
            yMax,
            xTicks: ticks,
            yTicks: [0, 0.5, 1].map((f) => ({ value: f * yMax, label: `${num(f * yMax)} mA` })),
            series: [{ points: arm, color: c.good, width: 2 }, { points: pts, color: c.accent }],
            hlines: [
              { y: PULL * inom_ * 1000, label: 'umbral de cierre (75 %)', color: c.heat },
              { y: DROP * inom_ * 1000, label: 'umbral de apertura (20 %)', color: c.bad },
            ],
            legend: [{ label: 'corriente de la bobina', color: c.accent }, { label: 'posición de la armadura', color: c.good }],
            cursor: { x: state.t * 1000, y: state.i * 1000, color: c.chargePos },
            xLabel: 'tiempo',
            yLabel: 'corriente de la bobina',
          });
        },

        formulas() {
          const r = rate();
          const ic = state.i;
          const vOnCoil = params.enable === 'on' ? params.vcoil : 0;
          return [
            { name: 'Corriente nominal de la bobina', sym: 'I<sub>nom</sub> = V<sub>nom</sub> / R<sub>bobina</sub>', val: `Inom = ${si(r.v, 'V')} / ${si(r.r, 'Ω')} = ${si(r.v / r.r, 'A')}` },
            { name: 'Potencia de la bobina (en reposo, energizada)', sym: 'P = V² / R', val: `P = (${si(vOnCoil, 'V')})² / ${si(r.r, 'Ω')} = ${si((vOnCoil * vOnCoil) / r.r, 'W')}` },
            { name: 'Constante de tiempo de la bobina', sym: 'τ = L / R', val: `τ = ${si(TAU, 's')}` },
            { name: 'Corriente ahora', sym: 'i(t) = (V / R) · (1 − e<sup>−t/τ</sup>)', val: `i = ${si(ic, 'A')}  (${num((ic / (r.v / r.r)) * 100, 3)} % de la nominal)` },
            { name: 'Umbrales', sym: 'cierra a 0,75 · I<sub>nom</sub> · abre a 0,2 · I<sub>nom</sub>', val: `cierra a ${si(PULL * r.v / r.r, 'A')} · abre a ${si(DROP * r.v / r.r, 'A')}` },
            { name: 'Tiempo de cierre medido', sym: 't<sub>operación</sub>', val: state.tClose !== null ? `${si(state.tClose, 's')} desde que se energizó` : params.enable === 'on' && params.vcoil < PULL * r.v ? `no cierra: ${si(params.vcoil, 'V')} < ${si(PULL * r.v, 'V')} (75 % de la nominal)` : '—' },
          ];
        },
      };
    },
  });
})();
