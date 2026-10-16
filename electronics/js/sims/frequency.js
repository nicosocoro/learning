// Capítulo 9: frecuencia y período. La onda se ve en una ventana de 10 ms y se puede escuchar.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, createTone, polyline, text, arrow, circle, si, num } = Elec;

  const WINDOW = 0.01; //  s visibles en la pantalla
  const SPEED_OF_SOUND = 343; // m/s en el aire a ~20 °C
  const NOTES = ['Do', 'Do♯', 'Re', 'Re♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'];

  const waveAt = {
    sine: (x) => Math.sin(x),
    square: (x) => (Math.sin(x) >= 0 ? 1 : -1),
    triangle: (x) => (2 / Math.PI) * Math.asin(Math.sin(x)),
  };

  function nearestNote(f) {
    const midi = Math.round(69 + 12 * Math.log2(f / 440));
    return {
      name: `${NOTES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`,
      freq: 440 * 2 ** ((midi - 69) / 12),
    };
  }

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Ver y escuchar una frecuencia',
    label: 'Onda en una ventana de 10 milisegundos y un altavoz que vibra',
    caption: 'La pantalla muestra 10 ms. El altavoz se dibuja en cámara lenta (÷100). Si activás el sonido, empezá con volumen bajo.',
    controls: [
      { key: 'f', label: 'Frecuencia (f)', min: 20, max: 2000, step: 10, value: 440, unit: 'Hz' },
      { type: 'choice', key: 'wave', label: 'Forma de onda', value: 'sine', options: [{ value: 'sine', label: 'Senoidal' }, { value: 'square', label: 'Cuadrada' }, { value: 'triangle', label: 'Triangular' }] },
      { key: 'volume', label: 'Volumen', min: 0.05, max: 1, step: 0.05, value: 0.3, unit: '', format: (v) => `${Math.round(v * 100)} %` },
      { type: 'choice', key: 'sound', label: 'Sonido', value: 'off', options: [{ value: 'off', label: 'Apagado' }, { value: 'on', label: '🔊 Encendido' }] },
    ],

    setup({ params }) {
      const tone = createTone();
      let time = 0;

      return {
        reset() {
          time = 0;
        },

        onChange(key) {
          if (params.sound === 'on') {
            if (key === 'sound') tone.start(params.f, params.wave, params.volume);
            else tone.update(params.f, params.wave, params.volume);
          } else {
            tone.stop();
          }
        },

        step(dt) {
          time += dt;
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const period = 1 / params.f;
          const wave = waveAt[params.wave];

          // ---- Altavoz en cámara lenta
          const sx = w * 0.06;
          const sy = h * 0.5;
          const push = 7 * wave(2 * Math.PI * (params.f / 100) * time);
          ctx.fillStyle = c.wire;
          ctx.fillRect(sx - 6, sy - 24, 22, 48);
          ctx.beginPath();
          ctx.moveTo(sx + 16, sy - 12);
          ctx.lineTo(sx + 42 + push, sy - 38);
          ctx.lineTo(sx + 42 + push, sy + 38);
          ctx.lineTo(sx + 16, sy + 12);
          ctx.closePath();
          ctx.fillStyle = c.surface;
          ctx.fill();
          ctx.strokeStyle = c.wire;
          ctx.lineWidth = 2.5;
          ctx.stroke();
          const gap = Math.min(60, Math.max(8, 8000 / params.f));
          for (let k = 0; k < 5; k++) {
            const r = (time * 50 + k * gap) % (gap * 5);
            ctx.globalAlpha = Math.max(0, 1 - r / (gap * 5));
            ctx.strokeStyle = c.accent;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(sx + 42 + push, sy, 8 + r, -0.9, 0.9);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;

          // ---- Pantalla de 10 ms
          const left = w * 0.26;
          const right = w * 0.97;
          const top = h * 0.14;
          const bottom = h * 0.86;
          const mid = (top + bottom) / 2;
          const half = (bottom - top) / 2;
          const px = (t) => left + (t / WINDOW) * (right - left);

          ctx.fillStyle = c.surface;
          ctx.fillRect(left, top, right - left, bottom - top);
          for (let d = 0; d <= 10; d++) {
            polyline(ctx, [[px((d * WINDOW) / 10), top], [px((d * WINDOW) / 10), bottom]], { color: c.grid, width: d % 5 === 0 ? 1.5 : 1 });
            if (d % 2 === 0) text(ctx, `${d} ms`, px((d * WINDOW) / 10), bottom + 13, { size: 10, align: 'center', color: c.muted });
          }
          for (let d = 0; d <= 4; d++) {
            const y = top + (d * (bottom - top)) / 4;
            polyline(ctx, [[left, y], [right, y]], { color: c.grid, width: d === 2 ? 1.5 : 1 });
          }
          ctx.strokeStyle = c.text;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(left, top, right - left, bottom - top);

          const points = [];
          const samples = 600;
          for (let n = 0; n <= samples; n++) {
            const t = (n / samples) * WINDOW;
            points.push([px(t), mid - half * 0.85 * wave(2 * Math.PI * params.f * t)]);
          }
          polyline(ctx, points, { color: c.accent, width: 2.5 });

          // Marca del período (si cabe en la pantalla)
          if (period <= WINDOW) {
            const yb = top - 12;
            arrow(ctx, px(0), yb, px(period), yb, { color: c.chargePos, width: 1.5 });
            arrow(ctx, px(period), yb, px(0), yb, { color: c.chargePos, width: 1.5 });
            polyline(ctx, [[px(period), top], [px(period), bottom]], { color: c.chargePos, width: 1, dash: [4, 4] });
            text(ctx, `T = ${si(period, 's')}`, px(period) + 8, yb, { size: 12, color: c.chargePos, weight: 600 });
          } else {
            text(ctx, `T = ${si(period, 's')} (un ciclo no cabe en la ventana)`, right, top - 12, { align: 'right', size: 12, color: c.chargePos, weight: 600 });
          }

          // Punto que recorre la onda
          const tc = ((time / 3) % 1) * WINDOW;
          circle(ctx, px(tc), mid - half * 0.85 * wave(2 * Math.PI * params.f * tc), 5, { fill: c.chargePos });
        },

        formulas() {
          const f = params.f;
          const period = 1 / f;
          const note = nearestNote(f);
          return [
            { name: 'Período', sym: 'T = 1 / f', val: `T = 1 / ${si(f, 'Hz')} = ${si(period, 's')}` },
            { name: 'Frecuencia angular', sym: 'ω = 2π · f', val: `ω = 2π · ${si(f, 'Hz')} = ${num(2 * Math.PI * f)} rad/s` },
            { name: 'Ciclos en la ventana de 10 ms', sym: 'N = f · t', val: `N = ${si(f, 'Hz')} · 10 ms = ${num(f * WINDOW)} ciclos` },
            { name: 'Longitud de onda del sonido en el aire', sym: 'λ = v / f', val: `λ = ${SPEED_OF_SOUND} m/s / ${si(f, 'Hz')} = ${si(SPEED_OF_SOUND / f, 'm')}` },
            { name: 'Nota musical más cercana', sym: 'nota', val: `${note.name} (${num(note.freq, 4)} Hz)` },
          ];
        },
      };
    },
  });
})();
