// Lección 19: un transistor corta la corriente de una carga inductiva (relé, solenoide, motor).
// Sin protección, la autoinducción genera un pico enorme en el colector; con un diodo (o un diodo
// y un zener) la corriente de la bobina encuentra un camino y el pico desaparece.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim } = Elec;
  const { FlowPath, visualSpeed } = Elec;
  const { drawCoil, drawDiode, drawBjt, drawBattery, drawGround, polyline, text, circle } = Elec;
  const { si, num } = Elec;

  const VF = 0.7; //           caída del diodo
  const VCE_SAT = 0.2;
  const VCEO = 40; //          tensión máxima de un transistor pequeño (2N2222, BC337…)
  const ARC = 400; //          tensión a la que el colector entra en avalancha / salta un arco
  const T_FAST = 1e-6; //      tiempo en que un transistor corta la corriente
  const LOADS = {
    relay: { name: 'Relé de 12 V', r: 400, l: 0.8 },
    solenoid: { name: 'Solenoide', r: 30, l: 0.15 },
    motor: { name: 'Motor pequeño', r: 12, l: 0.06 },
  };

  /** Simula la corriente en la bobina y la tensión en el colector. Devuelve las muestras. */
  function simulate({ load, vcc, prot }) {
    const { r, l } = LOADS[load];
    const tau = l / r;
    const tOn = 6 * tau;
    const tTotal = 12 * tau;
    const n = 600;
    const dt = tTotal / n;
    const iFinal = (vcc - VCE_SAT) / r;
    const clamp = prot === 'diode' ? VF : prot === 'zener' ? VF + 12 : 0;
    const samples = [];
    let i = 0;
    let freewheel = false;
    let release = null;
    let peak = 0;
    for (let k = 0; k <= n; k++) {
      const t = k * dt;
      let vce;
      if (t < tOn) {
        i += (iFinal - i) * (1 - Math.exp(-dt / tau));
        vce = VCE_SAT;
      } else {
        if (!freewheel) { freewheel = true; peak = i; }
        if (prot === 'none') {
          i = 0;
          vce = k * dt - tOn < dt ? Infinity : vcc;
        } else {
          // L di/dt = −(clamp + i R)  mientras i > 0 (el diodo conduce)
          const sub = 20;
          for (let s = 0; s < sub && i > 0; s++) i += (-(clamp + i * r) / l) * (dt / sub);
          if (i <= 0) { i = 0; vce = vcc; } else vce = vcc + clamp;
          if (release === null && i <= 0.2 * (vcc / r)) release = t - tOn;
        }
      }
      samples.push({ t, i, vce });
    }
    const spikeTheory = (l * peak) / T_FAST;
    return { samples, tau, tOn, tTotal, iFinal, peak, release, spikeTheory, clamp, r, l };
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Apagar una carga inductiva con un transistor',
    label: 'Circuito con una bobina, un diodo de protección opcional y un transistor NPN; a la derecha la corriente de la bobina y abajo la tensión del colector en el tiempo',
    caption: 'El tiempo va en cámara lenta: el recorrido completo (encendido y apagado) dura unos 12 s a velocidad 1×. Un transistor pequeño soporta unos 40 V entre colector y emisor.',
    chart: true,
    controls: [
      { type: 'choice', key: 'load', label: 'Carga inductiva', value: 'relay', options: Object.entries(LOADS).map(([value, v]) => ({ value, label: v.name })) },
      { type: 'choice', key: 'prot', label: 'Protección', value: 'none', options: [{ value: 'none', label: 'Sin protección' }, { value: 'diode', label: 'Diodo' }, { value: 'zener', label: 'Diodo + zener' }] },
      { key: 'vcc', label: 'Tensión de alimentación (V<sub>CC</sub>)', min: 5, max: 24, step: 1, value: 12, unit: 'V' },
    ],

    setup({ params, chart }) {
      let phase = 0; // 0..1 a lo largo del ciclo
      const loop = new FlowPath([], { closed: true });
      const run = new FlowPath();
      let cache = { key: '', data: null };
      const data = () => {
        const key = `${params.load}|${params.vcc}|${params.prot}`;
        if (cache.key !== key) cache = { key, data: simulate(params) };
        return cache.data;
      };
      const at = (d, ph) => d.samples[Math.min(d.samples.length - 1, Math.round(ph * (d.samples.length - 1)))];

      return {
        reset() {
          phase = 0;
        },

        step(dt) {
          phase = (phase + Math.max(0, dt) / 12) % 1;
          const d = data();
          const s = at(d, phase);
          const sp = visualSpeed(s.i, 0.5);
          loop.advance(dt, -sp);
          run.advance(dt, -sp);
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const d = data();
          const s = at(d, phase);
          const isOn = s.t < d.tOn;
          const x0 = w * 0.07;
          const xd = w * 0.2;
          const xt = w * 0.34;
          const r = Math.min(30, h * 0.08);
          const dx = 0.42 * r;
          const hh = Math.sqrt(r * r - dx * dx);
          const xc = xt + dx;
          const y0 = h * 0.12;
          const y1 = h * 0.88;
          const ym = h * 0.72;
          const yn = ym - hh - 26; //             nodo entre bobina y colector
          const yCoil = (y0 + yn) / 2;
          const lenCoil = Math.min(110, (yn - y0) * 0.72);

          polyline(ctx, [[x0, y0], [xc, y0]], { color: c.wire, width: 3 });
          polyline(ctx, [[xc, y0], [xc, yn], [xc, ym - hh]], { color: c.wire, width: 3 });
          polyline(ctx, [[xc, ym + hh], [xc, y1], [x0, y1]], { color: c.wire, width: 3 });
          polyline(ctx, [[x0, y0], [x0, h * 0.5 - 32]], { color: c.wire, width: 3 });
          polyline(ctx, [[x0, h * 0.5 + 32], [x0, y1]], { color: c.wire, width: 3 });
          polyline(ctx, [[xt - r, ym], [xt - r - 30, ym]], { color: c.wire, width: 3 });
          if (params.prot !== 'none') {
            polyline(ctx, [[xc, y0 + 6], [xd, y0 + 6], [xd, yCoil - 32]], { color: c.wire, width: 3 });
            polyline(ctx, [[xd, yCoil + 32], [xd, yn], [xc, yn]], { color: c.wire, width: 3 });
          }

          // flujo de cargas
          if (s.i > 1e-5) {
            if (isOn) {
              run.setPoints([[x0, y0], [xc, y0], [xc, yn], [xc, ym - hh]]);
              run.draw(ctx, { spacing: 22, radius: 4.5 });
            } else if (params.prot !== 'none') {
              loop.setPoints([[xc, y0 + 6], [xc, yn], [xd, yn], [xd, y0 + 6]]);
              loop.draw(ctx, { spacing: 22, radius: 4.5 });
            }
          }

          drawBattery(ctx, x0, h * 0.5, { orient: 'v' });
          drawCoil(ctx, xc, yCoil, { len: lenCoil, turns: 6, active: Math.min(1, s.i / Math.max(d.iFinal, 1e-9)) });
          if (params.prot !== 'none') {
            drawDiode(ctx, xd, yCoil, { orient: 'v', len: 64, on: !isOn && s.i > 1e-5 });
            text(ctx, 'diodo', xd - 14, yCoil, { align: 'right', size: 12, color: c.muted });
            if (params.prot === 'zener') text(ctx, '+ zener 12 V', xd - 14, yCoil + 16, { align: 'right', size: 12, color: c.muted });
          }
          drawBjt(ctx, xt, ym, { r, on: isOn ? 1 : 0 });
          drawGround(ctx, x0, y1);
          text(ctx, 'señal', xt - r - 34, ym - 14, { align: 'right', size: 12, color: c.muted });
          text(ctx, isOn ? 'ON' : 'OFF', xt - r - 34, ym + 4, { align: 'right', weight: 700, color: isOn ? c.good : c.bad, size: 14 });
          text(ctx, `${LOADS[params.load].name}: ${si(d.r, 'Ω')}, ${si(d.l, 'H')}`, xc + 26, yCoil, { size: 12, weight: 600 });
          text(ctx, si(params.vcc, 'V'), x0 + 14, h * 0.5 + 44, { size: 12, weight: 600, color: c.accent });

          const spikeNow = !isOn && params.prot === 'none' && s.t - d.tOn < d.tTotal * 0.04;
          if (spikeNow) {
            text(ctx, '¡CHISPA! ≈ 400 V', xc + 70, ym - 10, { weight: 700, color: c.bad, size: 15 });
            text(ctx, 'el colector se destruye', xc + 70, ym + 10, { color: c.bad, size: 12 });
          } else if (!isOn && params.prot !== 'none' && s.i > 1e-5) {
            text(ctx, 'la corriente sigue por el diodo', xd + 20, h * 0.95, { color: c.good, size: 12, weight: 600 });
          }

          this.scope(ctx, c, w * 0.6, h * 0.1, w * 0.36, h * 0.74, d);
          this.drawChart(c, d, s);
        },

        scope(ctx, c, x, y, w, h, d) {
          ctx.save();
          ctx.fillStyle = c.surface;
          ctx.strokeStyle = c.border;
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
          ctx.restore();
          const imax = Math.max(d.iFinal * 1.15, 1e-6);
          const px = (t) => x + (t / d.tTotal) * w;
          const py = (i) => y + h - (i / imax) * h;
          for (let k = 1; k < 4; k++) polyline(ctx, [[x, y + (h * k) / 4], [x + w, y + (h * k) / 4]], { color: c.grid, width: 1 });
          polyline(ctx, [[px(d.tOn), y], [px(d.tOn), y + h]], { color: c.muted, width: 1, dash: [4, 4] });
          text(ctx, 'se apaga', px(d.tOn) + 4, y + 12, { size: 10.5, color: c.muted });
          polyline(ctx, d.samples.map((p) => [px(p.t), py(p.i)]), { color: c.accent, width: 2.5 });
          const s = d.samples[Math.round(phase * (d.samples.length - 1))];
          circle(ctx, px(s.t), py(s.i), 4.5, { fill: c.chargePos });
          text(ctx, window.innerWidth < 560 ? 'corriente' : 'corriente en la bobina', x + 6, y - 10, { size: 12, weight: 600 });
          text(ctx, si(d.iFinal, 'A'), x + 4, py(d.iFinal) - 8, { size: 10.5, color: c.muted });
        },

        drawChart(c, d, s) {
          const yMax = Math.max(60, Math.ceil((params.vcc + (d.clamp || 0) + 15) / 10) * 10);
          const pts = d.samples.map((p) => [p.t * 1000, Math.min(p.vce, yMax * 2)]);
          const hl = [
            { y: VCEO, label: 'máximo del transistor (40 V)', color: c.bad },
            { y: params.vcc, label: `V CC = ${params.vcc} V`, color: c.muted },
          ];
          chart.draw({
            xMax: d.tTotal * 1000,
            yMax,
            xTicks: [0, 0.25, 0.5, 0.75, 1].map((f) => ({ value: f * d.tTotal * 1000, label: `${num(f * d.tTotal * 1000, 3)} ms` })),
            yTicks: [0, 0.5, 1].map((f) => ({ value: f * yMax, label: `${num(f * yMax)} V` })),
            series: [{ points: pts, color: c.accent }],
            hlines: hl,
            cursor: { x: s.t * 1000, y: Math.min(s.vce, yMax), color: c.chargePos },
            xLabel: 'tiempo',
            yLabel: 'tensión colector-emisor',
          });
        },

        formulas() {
          const d = data();
          const rows = [
            { name: 'Corriente de la bobina al apagar', sym: 'I<sub>0</sub> = (V<sub>CC</sub> − V<sub>CE,sat</sub>) / R', val: `I0 = (${params.vcc} V − 0,2 V) / ${si(d.r, 'Ω')} = ${si(d.iFinal, 'A')}` },
            { name: 'Constante de tiempo de la bobina', sym: 'τ = L / R', val: `τ = ${si(d.l, 'H')} / ${si(d.r, 'Ω')} = ${si(d.tau, 's')}` },
          ];
          if (params.prot === 'none') {
            rows.push({ name: 'Pico teórico al cortar en 1 µs', sym: 'V = L · ΔI / Δt', val: `V = ${si(d.l, 'H')} · ${si(d.peak, 'A')} / 1 µs = ${si(d.spikeTheory, 'V')}  → en la práctica ≈ 400 V (arco): ¡el transistor se destruye!` });
          } else {
            rows.push({ name: 'Tensión máxima en el colector', sym: 'V<sub>CE,pico</sub> = V<sub>CC</sub> + V<sub>clamp</sub>', val: `V = ${params.vcc} V + ${num(d.clamp)} V = ${num(params.vcc + d.clamp)} V  ${params.vcc + d.clamp > VCEO ? '(¡supera los 40 V del transistor!)' : '(dentro del límite)'}` });
            rows.push({ name: 'Tiempo hasta que la corriente cae al 20 %', sym: 't ≈ τ · ln(5) con diodo solo', val: d.release !== null ? `t = ${si(d.release, 's')}  ${params.prot === 'zener' ? '(el zener acelera la caída)' : '(el diodo retrasa la apertura del relé)'}` : '—' });
          }
          rows.push({ name: 'Energía almacenada en la bobina', sym: 'E = ½ · L · I<sub>0</sub>²', val: `E = ½ · ${si(d.l, 'H')} · (${si(d.peak, 'A')})² = ${si(0.5 * d.l * d.peak * d.peak, 'J')}` });
          return rows;
        },
      };
    },
  });
})();
