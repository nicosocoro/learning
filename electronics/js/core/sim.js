// Monta un simulador completo dentro de un contenedor: canvas, gráfica opcional,
// botones, controles y panel de fórmulas, y conecta todo con el bucle de animación.
//
// mountSim(root, {
//   title,      // título de la figura (barra superior)
//   label,      // descripción accesible del canvas
//   caption,    // texto bajo el canvas (HTML)
//   controls,   // definiciones para createControls
//   chart,      // true → agrega una segunda zona con gráfica
//   setup({ params, view, chart }) → {
//     step(dt), draw(view, colors), formulas() → filas, reset?(), onChange?(key)
//   }
// })

(function () {
  const Elec = (window.Elec ??= {});
  const { setupCanvas } = Elec;
  const { colors } = Elec;
  const { createChart } = Elec;
  const { createControls } = Elec;
  const { createFormulaPanel } = Elec;
  const { createLoop } = Elec;

  const SPEEDS = [0.25, 0.5, 1, 2];

  function mountSim(root, { title = 'Simulación', label, caption, controls = [], chart = false, setup }) {
    root.classList.add('sim');
    root.innerHTML = `
      <div class="sim-head"><span>Laboratorio</span><span>${title}</span></div>
      <div class="sim-stage"><canvas class="sim-canvas" role="img" aria-label="${label ?? 'Simulación'}"></canvas></div>
      ${chart ? '<div class="sim-stage sim-stage--chart"><canvas class="chart-canvas" role="img" aria-label="Gráfica"></canvas></div>' : ''}
      ${caption ? `<p class="sim-caption">${caption}</p>` : ''}
      <div class="sim-toolbar">
        <button type="button" class="btn" data-action="toggle"></button>
        <button type="button" class="btn" data-action="reset">↺ Reiniciar</button>
        <span class="spacer"></span>
        <span class="speed-label">Velocidad</span>
        <div class="segmented" role="group" data-speeds>
          ${SPEEDS.map((s) => `<button type="button" data-speed="${s}" aria-pressed="${s === 1}">${s}×</button>`).join('')}
        </div>
      </div>
      <div class="sim-panels">
        <div class="controls"><h3 class="panel-title">Parámetros</h3></div>
        <div class="formulas"></div>
      </div>`;

    let sim = null;
    const render = () => {
      if (!sim) return;
      sim.draw(view, colors());
      updateFormulas(sim.formulas());
    };

    const view = setupCanvas(root.querySelector('.sim-canvas'), render);
    const chartApi = chart ? createChart(root.querySelector('.chart-canvas')) : null;
    const updateFormulas = createFormulaPanel(root.querySelector('.formulas'));
    const params = createControls(root.querySelector('.controls'), controls, (key) => {
      sim?.onChange?.(key);
      if (!loop.running) render();
    });

    sim = setup({ params, view, chart: chartApi });
    const loop = createLoop({ step: (dt) => sim.step(dt), render });

    const toggle = root.querySelector('[data-action="toggle"]');
    const syncToggle = () => { toggle.textContent = loop.running ? '⏸ Pausar' : '▶ Reproducir'; };

    toggle.addEventListener('click', () => {
      if (loop.running) loop.pause(); else loop.play();
      syncToggle();
    });
    root.querySelector('[data-action="reset"]').addEventListener('click', () => {
      sim.reset?.();
      render();
    });
    root.querySelector('[data-speeds]').addEventListener('click', (event) => {
      const button = event.target.closest('button[data-speed]');
      if (!button) return;
      loop.setSpeed(Number(button.dataset.speed));
      for (const b of root.querySelectorAll('[data-speeds] button')) {
        b.setAttribute('aria-pressed', String(b === button));
      }
    });

    loop.play();
    syncToggle();
    render();
  }

  Object.assign(Elec, { mountSim });
})();
