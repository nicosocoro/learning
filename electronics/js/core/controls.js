// Controles de la simulación: sliders y selectores segmentados.
//
// Definiciones:
//   { key, label, min, max, step, value, unit, scale?, format? }  → slider (el valor real = valor * scale)
//   { key, label, values: [..], value, unit, format? }            → slider sobre una lista de valores discretos
//   { type: 'choice', key, label, value, options: [{ value, label }] }
//
// createControls devuelve un objeto `params` que siempre tiene los valores actuales.

(function () {
  const Elec = (window.Elec ??= {});
  const { si } = Elec;

  let uid = 0;

  function createControls(container, defs, onChange) {
    const params = {};
    for (const def of defs) {
      params[def.key] = def.type === 'choice' || def.values ? def.value : def.value * (def.scale ?? 1);
      const build = def.type === 'choice' ? buildChoice : buildSlider;
      container.append(build(def, params, onChange));
    }
    return params;
  }

  function buildSlider(def, params, onChange) {
    const scale = def.scale ?? 1;
    const { values } = def;
    const min = values ? 0 : def.min;
    const max = values ? values.length - 1 : def.max;
    const step = values ? 1 : def.step;
    const start = values ? values.indexOf(def.value) : def.value;
    const id = `control-${def.key}-${uid++}`;
    const wrap = document.createElement('div');
    wrap.className = 'control';
    wrap.innerHTML = `
      <div class="control-head">
        <label for="${id}">${def.label}</label>
        <output for="${id}"></output>
      </div>
      <input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${start}">`;

    const input = wrap.querySelector('input');
    const output = wrap.querySelector('output');
    const show = () => { output.textContent = def.format ? def.format(params[def.key]) : si(params[def.key], def.unit); };

    input.addEventListener('input', () => {
      params[def.key] = values ? values[Number(input.value)] : Number(input.value) * scale;
      show();
      onChange?.(def.key);
    });
    show();
    return wrap;
  }

  function buildChoice(def, params, onChange) {
    const wrap = document.createElement('div');
    wrap.className = 'control';
    const buttons = def.options
      .map((o) => `<button type="button" data-value="${o.value}" aria-pressed="${o.value === def.value}">${o.label}</button>`)
      .join('');
    wrap.innerHTML = `
      <div class="control-head"><span>${def.label}</span></div>
      <div class="segmented" role="group">${buttons}</div>`;

    wrap.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-value]');
      if (!button) return;
      // se devuelve el valor original de la opción (número o texto), no el texto del atributo
      params[def.key] = def.options.find((o) => String(o.value) === button.dataset.value)?.value ?? button.dataset.value;
      for (const b of wrap.querySelectorAll('button')) {
        b.setAttribute('aria-pressed', String(b === button));
      }
      onChange?.(def.key);
    });
    return wrap;
  }

  Object.assign(Elec, { createControls });
})();
