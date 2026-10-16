// Elementos comunes del sitio: cabecera, panel lateral con el índice, "anterior/siguiente",
// pie, índice de la portada y seguimiento de dónde quedó el estudiante.
// Todo sale de lessons-data.js y progress.js, así no se repite HTML en cada página.

(function () {
  const Elec = (window.Elec ??= {});
  const { LESSONS, PARTS, progress } = Elec;

  const { base = '', lesson: current } = document.body.dataset;
  const hrefOf = (id) => `${base}lessons/${id}.html`;
  const numberOf = (id) => LESSONS.findIndex((l) => l.id === id) + 1;
  const titleOf = (id) => LESSONS.find((l) => l.id === id).title;
  const wide = window.matchMedia('(min-width: 1100px)');
  const DRAWER_KEY = 'elec-drawer';

  const mark = (id) => (progress.isCompleted(id) ? '<span class="mark done" title="Completado">✓</span>' : '<span class="mark"></span>');
  const bestText = (id) => {
    const best = progress.best(id);
    return best ? `mejor resultado ${best.score}/${best.total}` : '';
  };

  /* ---------- Cabecera ---------- */
  const masthead = document.querySelector('[data-masthead]');
  let navEl;
  if (masthead) {
    masthead.className = 'masthead';
    masthead.innerHTML = `
      <div class="masthead-inner">
        <div class="masthead-left">
          <button type="button" class="drawer-toggle" aria-controls="drawer" aria-expanded="false"><span aria-hidden="true">☰</span> Índice</button>
          <a class="masthead-title" href="${base}index.html">
            <span class="masthead-mark">Ω</span>
            <span>Elementos de Electrónica<em>Apuntes con laboratorio interactivo</em></span>
          </a>
        </div>
        <nav class="masthead-nav" aria-label="Capítulos"></nav>
      </div>`;
    navEl = masthead.querySelector('.masthead-nav');
  }

  /* ---------- Panel lateral colapsable ---------- */
  const drawer = document.createElement('aside');
  drawer.className = 'drawer';
  drawer.id = 'drawer';
  drawer.setAttribute('aria-label', 'Índice de capítulos');
  drawer.innerHTML = `
    <div class="drawer-head">
      <strong>Contenido</strong>
      <button type="button" class="drawer-close" aria-label="Cerrar índice">×</button>
    </div>
    <div class="drawer-progress"></div>
    <nav class="drawer-list"></nav>
    <button type="button" class="drawer-reset">Borrar mi progreso</button>`;
  const backdrop = document.createElement('div');
  backdrop.className = 'drawer-backdrop';
  document.body.append(drawer, backdrop);

  const toggle = document.querySelector('.drawer-toggle');

  function setOpen(open, remember = true) {
    document.body.classList.toggle('drawer-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    drawer.inert = !open;
    if (remember && wide.matches) {
      try { localStorage.setItem(DRAWER_KEY, open ? 'open' : 'closed'); } catch { /* sin almacenamiento */ }
    }
  }

  function initialOpen() {
    if (!wide.matches) return false; // en pantallas chicas empieza cerrado
    try { return localStorage.getItem(DRAWER_KEY) !== 'closed'; } catch { return true; }
  }

  setOpen(initialOpen(), false);
  toggle?.addEventListener('click', () => setOpen(!document.body.classList.contains('drawer-open')));
  drawer.querySelector('.drawer-close').addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !wide.matches) setOpen(false);
  });
  drawer.querySelector('.drawer-reset').addEventListener('click', () => {
    if (window.confirm('¿Borrar capítulos completados y resultados guardados en este navegador?')) progress.reset();
  });

  /* ---------- Partes que se actualizan con el progreso ---------- */
  const pager = document.querySelector('[data-pager]');
  const toc = document.querySelector('[data-toc]');
  const resume = document.querySelector('[data-resume]');
  const footer = document.querySelector('[data-footer]');
  const currentIndex = LESSONS.findIndex((l) => l.id === current);

  function renderNav() {
    if (!navEl) return;
    navEl.innerHTML = LESSONS.map((l, n) => {
      const done = progress.isCompleted(l.id) ? ' done' : '';
      const here = l.id === current ? ' aria-current="page"' : '';
      return `<a class="${done.trim()}" href="${hrefOf(l.id)}" title="${l.title}"${here}>${n + 1}</a>`;
    }).join('');
  }

  function renderDrawer() {
    const total = LESSONS.length;
    const count = progress.completedCount();
    drawer.querySelector('.drawer-progress').innerHTML = `
      <span>${count} de ${total} capítulos completados</span>
      <span class="bar"><span style="width:${(count / total) * 100}%"></span></span>`;
    drawer.querySelector('.drawer-list').innerHTML = PARTS.map((part) => `
      <h3>${part.name}</h3>
      <ol>${part.ids.map((id) => {
        const here = id === current ? ' aria-current="page"' : '';
        return `<li><a class="drawer-item" href="${hrefOf(id)}"${here}>${mark(id)}<span class="drawer-n">${numberOf(id)}.</span><span>${titleOf(id)}</span></a></li>`;
      }).join('')}</ol>`).join('');
  }

  function renderPager() {
    if (!pager) return;
    const prev = LESSONS[currentIndex - 1];
    const next = LESSONS[currentIndex + 1];
    pager.className = 'pager';
    pager.innerHTML = `
      ${prev ? `<a href="${hrefOf(prev.id)}"><small>← Capítulo anterior</small><strong>${prev.title}</strong></a>` : `<a href="${base}index.html"><small>← Inicio</small><strong>Índice</strong></a>`}
      ${next ? `<a class="next" href="${hrefOf(next.id)}"><small>Capítulo siguiente →</small><strong>${next.title}</strong></a>` : `<a class="next" href="${base}index.html"><small>Fin →</small><strong>Volver al índice</strong></a>`}`;
  }

  function renderToc() {
    if (!toc) return;
    toc.className = 'toc';
    toc.innerHTML = PARTS.map((part) => `
      <section class="toc-part">
        <h2>${part.name}</h2>
        <ol>${part.ids.map((id) => {
          const l = LESSONS.find((x) => x.id === id);
          return `<li><a href="${hrefOf(id)}">
            <span class="toc-line">${mark(id)}<span class="toc-num">${numberOf(id)}.</span><span class="toc-title">${l.title}</span><span class="toc-tags">${progress.isCompleted(id) ? bestText(id) : l.tags}</span></span>
            <span class="toc-summary">${l.summary}</span></a></li>`;
        }).join('')}</ol>
      </section>`).join('');
  }

  function renderResume() {
    if (!resume) return;
    const last = progress.last();
    const count = progress.completedCount();
    const progressText = `${count} de ${LESSONS.length} capítulos completados`;
    resume.className = 'resume';
    resume.innerHTML = last
      ? `<div><span class="box-title">Continuar donde quedaste</span><strong>Capítulo ${numberOf(last.id)} · ${titleOf(last.id)}</strong><small>${progressText}</small></div>
         <a class="btn" href="${hrefOf(last.id)}?continuar=1">Continuar →</a>`
      : `<div><span class="box-title">Primera vez por acá</span><strong>Empezá por el capítulo 1</strong><small>Tu avance se guarda en este navegador.</small></div>
         <a class="btn" href="${hrefOf(LESSONS[0].id)}">Empezar →</a>`;
  }

  function render() {
    renderNav();
    renderDrawer();
    renderPager();
    renderToc();
    renderResume();
  }

  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <section class="terms" aria-labelledby="terms-title">
        <h2 id="terms-title">Términos de uso</h2>
        <p>Este sitio es un proyecto personal con <strong>fines exclusivamente educativos</strong>. Su contenido no pretende reemplazar, sustituir ni complementar oficialmente ningún material universitario, curso, texto de cátedra, norma o documentación oficial.</p>
        <p>Los valores de las simulaciones son idealizados: sirven para entender los conceptos, no para dimensionar, diseñar ni construir instalaciones o circuitos reales. Trabajar con electricidad puede ser peligroso; ante cualquier duda, consultá fuentes oficiales y a un profesional calificado.</p>
        <p>El contenido se ofrece «tal cual», sin garantías de exactitud o completitud, y puede contener errores. Su uso es bajo tu propia responsabilidad.</p>
      </section>`;
  }

  progress.onChange(render);
  render();

  /* ---------- Dónde quedó el estudiante ---------- */
  if (current) {
    progress.visit(current);
    if (new URLSearchParams(location.search).has('continuar')) {
      const y = progress.last()?.scroll ?? 0;
      window.addEventListener('load', () => window.scrollTo(0, y));
    }
    let timer = 0;
    window.addEventListener('scroll', () => {
      clearTimeout(timer);
      timer = setTimeout(() => progress.saveScroll(current, window.scrollY), 300);
    }, { passive: true });
  }
})();
