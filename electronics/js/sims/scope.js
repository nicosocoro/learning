// Capítulo 10: un osciloscopio virtual. Se mide contando divisiones de la pantalla.

(function () {
  const Elec = (window.Elec ??= {});
  const { mountSim, polyline, text, arrow, si, num } = Elec;

  const COLS = 10;
  const ROWS = 8;
  const PHOSPHOR = '#7dff9b';
  const CURSOR = '#ffd166';

  const waveAt = {
    sine: (x) => Math.sin(x),
    square: (x) => (Math.sin(x) >= 0 ? 1 : -1),
    triangle: (x) => (2 / Math.PI) * Math.asin(Math.sin(x)),
  };
  // Valor eficaz de cada forma de onda, en función del valor pico
  const RMS_FACTOR = { sine: 1 / Math.SQRT2, square: 1, triangle: 1 / Math.sqrt(3) };
  const RMS_TEXT = { sine: 'V<sub>p</sub> / √2', square: 'V<sub>p</sub>', triangle: 'V<sub>p</sub> / √3' };

  mountSim(document.querySelector('[data-sim]'), {
    title: 'Osciloscopio virtual',
    label: 'Pantalla de osciloscopio con una señal y su cuadrícula de divisiones',
    caption: 'Cada cuadro de la pantalla es una división. Alto × V/div da la tensión; ancho × T/div da el tiempo. Activá los cursores para ver dónde medir.',
    controls: [
      { type: 'choice', key: 'wave', label: 'Forma de la señal', value: 'sine', options: [{ value: 'sine', label: 'Senoidal' }, { value: 'square', label: 'Cuadrada' }, { value: 'triangle', label: 'Triangular' }] },
      { key: 'f', label: 'Frecuencia de la señal', values: [50, 100, 200, 500, 1000, 2000, 5000], value: 200, unit: 'Hz' },
      { key: 'vp', label: 'Amplitud (V<sub>p</sub>)', min: 0.5, max: 8, step: 0.5, value: 3, unit: 'V' },
      { key: 'offset', label: 'Nivel de continua (offset)', min: -3, max: 3, step: 0.5, value: 0, unit: 'V' },
      { key: 'vdiv', label: 'Escala vertical', values: [0.5, 1, 2, 5], value: 1, unit: 'V', format: (v) => `${num(v)} V/div` },
      { key: 'tdiv', label: 'Base de tiempo', values: [0.0001, 0.0002, 0.0005, 0.001, 0.002, 0.005, 0.01], value: 0.001, unit: 's', format: (v) => `${si(v, 's')}/div` },
      { type: 'choice', key: 'coupling', label: 'Acoplamiento', value: 'dc', options: [{ value: 'dc', label: 'DC' }, { value: 'ac', label: 'AC' }] },
      { type: 'choice', key: 'cursors', label: 'Cursores', value: 'off', options: [{ value: 'off', label: 'No' }, { value: 'on', label: 'Sí' }] },
    ],

    setup({ params }) {
      let time = 0;
      const level = () => (params.coupling === 'dc' ? params.offset : 0);
      const period = () => 1 / params.f;

      return {
        reset() {
          time = 0;
        },

        step(dt) {
          time += dt;
        },

        draw(view, c) {
          const ctx = view.begin();
          const { w, h } = view;
          const screenH = h * 0.86;
          const screenW = Math.min(screenH * 1.25, w * (w < 520 ? 0.68 : 0.64));
          const left = w * 0.03;
          const top = (h - screenH) / 2;
          const divW = screenW / COLS;
          const divH = screenH / ROWS;
          const midY = top + screenH / 2;
          const wave = waveAt[params.wave];
          const volts = (v) => midY - (v / params.vdiv) * divH;
          const timeX = (t) => left + (t / (params.tdiv * COLS)) * screenW;

          // Marco y pantalla (la pantalla es oscura en cualquier tema, como un equipo real)
          ctx.fillStyle = c.text;
          ctx.fillRect(left - 8, top - 8, screenW + 16, screenH + 16);
          ctx.fillStyle = '#0b1a12';
          ctx.fillRect(left, top, screenW, screenH);
          for (let col = 0; col <= COLS; col++) {
            polyline(ctx, [[left + col * divW, top], [left + col * divW, top + screenH]], { color: '#2f5a3f', width: col === COLS / 2 ? 1.5 : 0.8 });
          }
          for (let row = 0; row <= ROWS; row++) {
            polyline(ctx, [[left, top + row * divH], [left + screenW, top + row * divH]], { color: '#2f5a3f', width: row === ROWS / 2 ? 1.5 : 0.8 });
          }
          // Marcas pequeñas sobre los ejes centrales (5 por división)
          for (let n = 0; n <= COLS * 5; n++) {
            const x = left + (n * divW) / 5;
            polyline(ctx, [[x, midY - 3], [x, midY + 3]], { color: '#2f5a3f', width: 1 });
          }
          for (let n = 0; n <= ROWS * 5; n++) {
            const y = top + (n * divH) / 5;
            polyline(ctx, [[left + screenW / 2 - 3, y], [left + screenW / 2 + 3, y]], { color: '#2f5a3f', width: 1 });
          }

          // Traza
          ctx.save();
          ctx.beginPath();
          ctx.rect(left, top, screenW, screenH);
          ctx.clip();
          const points = [];
          const samples = 500;
          for (let n = 0; n <= samples; n++) {
            const t = (n / samples) * params.tdiv * COLS;
            points.push([timeX(t), volts(level() + params.vp * wave(2 * Math.PI * params.f * t))]);
          }
          ctx.shadowColor = PHOSPHOR;
          ctx.shadowBlur = 8;
          polyline(ctx, points, { color: PHOSPHOR, width: 2 });
          ctx.shadowBlur = 0;

          if (params.cursors === 'on') {
            const hi = level() + params.vp;
            const lo = level() - params.vp;
            for (const v of [hi, lo]) polyline(ctx, [[left, volts(v)], [left + screenW, volts(v)]], { color: CURSOR, width: 1, dash: [5, 4] });
            if (period() <= params.tdiv * COLS) {
              for (const t of [0, period()]) polyline(ctx, [[timeX(t), top], [timeX(t), top + screenH]], { color: CURSOR, width: 1, dash: [5, 4] });
            }
          }
          ctx.restore();

          // Referencia de 0 V
          text(ctx, '▸', left - 4, volts(0), { align: 'right', color: PHOSPHOR, size: 12 });

          const overflow = Math.abs(level()) + params.vp > (ROWS / 2) * params.vdiv;
          if (overflow) text(ctx, 'señal fuera de pantalla: subí V/div', left + screenW / 2, top + 14, { align: 'center', size: 12, color: CURSOR });

          // Panel de lectura
          const px = left + screenW + 24;
          const compact = w < 520;
          const lines = [
            ['CH1', true],
            [`${num(params.vdiv)} V/div`, false],
            [`${si(params.tdiv, 's')}/div`, false],
            [compact ? params.coupling.toUpperCase() : `Acoplamiento ${params.coupling.toUpperCase()}`, false],
            [compact ? 'Trig ↑' : 'Disparo: flanco ↑', false],
          ];
          lines.forEach(([str, bold], n) => text(ctx, str, px, top + 14 + n * 24, { weight: bold ? 700 : 400, size: bold ? 15 : 13, color: bold ? c.accent : c.text }));

          if (params.cursors === 'on') {
            const nT = period() / params.tdiv;
            if (nT <= COLS) arrow(ctx, timeX(0), midY + divH * 3.2, timeX(period()), midY + divH * 3.2, { color: CURSOR, width: 1.5 });
          }
        },

        formulas() {
          const { vp, vdiv, tdiv, f, wave } = params;
          const nVpp = (2 * vp) / vdiv;
          const nT = period() / tdiv;
          const rows = [
            { name: 'Alto de la señal (cuadros)', sym: 'n<sub>V</sub>', val: `${num(nVpp)} div` },
            { name: 'Tensión pico a pico', sym: 'V<sub>pp</sub> = n<sub>V</sub> · (V/div)', val: `Vpp = ${num(nVpp)} div · ${num(vdiv)} V/div = ${si(nVpp * vdiv, 'V')}` },
            { name: 'Tensión pico', sym: 'V<sub>p</sub> = V<sub>pp</sub> / 2', val: `Vp = ${si(nVpp * vdiv, 'V')} / 2 = ${si((nVpp * vdiv) / 2, 'V')}` },
            { name: 'Ancho de un ciclo (cuadros)', sym: 'n<sub>T</sub>', val: `${num(nT)} div${nT > COLS ? ' (no entra en pantalla: bajá T/div)' : ''}` },
            { name: 'Período', sym: 'T = n<sub>T</sub> · (T/div)', val: `T = ${num(nT)} div · ${si(tdiv, 's')}/div = ${si(nT * tdiv, 's')}` },
            { name: 'Frecuencia', sym: 'f = 1 / T', val: `f = 1 / ${si(nT * tdiv, 's')} = ${si(f, 'Hz')}` },
            { name: 'Valor eficaz de esta forma de onda', sym: `V<sub>rms</sub> = ${RMS_TEXT[wave]}`, val: `Vrms = ${si(vp * RMS_FACTOR[wave], 'V')}` },
          ];
          if (params.coupling === 'dc') {
            rows.push({ name: 'Nivel de continua (promedio)', sym: 'V<sub>dc</sub>', val: `Vdc = ${si(params.offset, 'V')}` });
          }
          return rows;
        },
      };
    },
  });
})();
