// Panel de fórmulas en vivo: nombre, fórmula simbólica y la misma fórmula con valores.
// Cada fila: { name, sym, val }. `sym` admite <sub>/<sup>.

(function () {
  const Elec = (window.Elec ??= {});

  function createRow(container) {
    const root = document.createElement('div');
    root.className = 'formula';
    root.innerHTML = '<div class="formula-name"></div><div class="formula-sym"></div><div class="formula-val"></div>';
    container.append(root);
    return {
      root,
      name: root.querySelector('.formula-name'),
      sym: root.querySelector('.formula-sym'),
      val: root.querySelector('.formula-val'),
    };
  }

  // Solo toca el DOM si el texto cambió, para no interferir con la selección del usuario.
  function setHtml(node, html) {
    if (node.dataset.html !== html) {
      node.innerHTML = html;
      node.dataset.html = html;
    }
  }

  function createFormulaPanel(container) {
    container.innerHTML = '<h3 class="panel-title">Fórmulas en vivo</h3>';
    const rows = [];

    return function update(data) {
      while (rows.length < data.length) rows.push(createRow(container));
      while (rows.length > data.length) rows.pop().root.remove();
      data.forEach((item, i) => {
        setHtml(rows[i].name, item.name);
        setHtml(rows[i].sym, item.sym);
        setHtml(rows[i].val, item.val);
      });
    };
  }

  Object.assign(Elec, { createFormulaPanel });
})();
