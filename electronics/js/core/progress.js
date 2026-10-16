// Progreso del estudiante guardado en localStorage: capítulo donde quedó, posición de lectura,
// capítulos completados y mejor resultado de cada quiz. Si el almacenamiento no está
// disponible (modo privado, bloqueado), todo sigue funcionando pero sin recordar nada.

(function () {
  const Elec = (window.Elec ??= {});

  const KEY = 'elec-progress-v1';
  const listeners = [];
  const empty = () => ({ last: null, lessons: {} });

  // Capítulos que cambiaron de nombre al agregar otros: se migra el progreso ya guardado.
  const RENAMED = {
    '07-cc-vs-ca': '08-cc-vs-ca',
    '08-onda-senoidal': '09-onda-senoidal',
    '09-frecuencia': '10-frecuencia',
    '10-osciloscopio': '11-osciloscopio',
    '11-transformadores': '13-transformadores',
  };

  function migrate(saved) {
    const lessons = {};
    for (const [id, value] of Object.entries(saved.lessons ?? {})) lessons[RENAMED[id] ?? id] = value;
    const last = saved.last ? { ...saved.last, id: RENAMED[saved.last.id] ?? saved.last.id } : null;
    return { last, lessons };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return migrate(JSON.parse(raw));
    } catch { /* sin almacenamiento */ }
    return empty();
  }

  let state = load();

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch { /* sin almacenamiento */ }
  }

  function notify() {
    for (const fn of listeners) fn();
  }

  const entry = (id) => (state.lessons[id] ??= {});

  // Si el progreso cambia en otra pestaña, esta se actualiza sola.
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY) return;
    state = load();
    notify();
  });

  Elec.progress = {
    isCompleted: (id) => Boolean(state.lessons[id]?.completed),
    best: (id) => state.lessons[id]?.best ?? null,
    last: () => state.last,
    completedCount: () => Object.values(state.lessons).filter((l) => l.completed).length,

    visit(id) {
      state.last = { id, scroll: state.last?.id === id ? state.last.scroll : 0 };
      persist();
      notify();
    },

    /** Guarda dónde quedó leyendo (no dispara actualizaciones de pantalla). */
    saveScroll(id, y) {
      if (state.last?.id !== id) return;
      state.last.scroll = Math.round(y);
      persist();
    },

    recordQuiz(id, score, total, passed) {
      const e = entry(id);
      if (!e.best || score / total > e.best.score / e.best.total) e.best = { score, total };
      if (passed) e.completed = true;
      persist();
      notify();
    },

    reset() {
      state = empty();
      persist();
      notify();
    },

    onChange(fn) {
      listeners.push(fn);
    },
  };
})();
