// Cuestionario de fin de capítulo. Cada pregunta se responde con un clic: se marca al instante
// si fue correcta o no y se muestra la explicación. Las opciones se mezclan en cada intento
// para que no sirva memorizar la posición de la respuesta.
//
// Datos (js/quizzes/<capítulo>.js): Elec.QUIZZES[id] = [{ q, correct, wrong: [...], explain }]

(function () {
  const Elec = (window.Elec ??= {});
  const { QUIZZES, LESSONS, progress } = Elec;

  const root = document.querySelector('[data-quiz]');
  const id = document.body.dataset.lesson;
  const questions = QUIZZES?.[id];
  if (!root || !questions) return;

  const PASS_RATIO = 0.7;
  const needed = Math.ceil(questions.length * PASS_RATIO);
  const next = LESSONS[LESSONS.findIndex((l) => l.id === id) + 1];

  const shuffle = (list) => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  function start() {
    const results = new Array(questions.length).fill(null); // true / false / null (sin responder)
    const best = progress.best(id);

    root.innerHTML = `
      <h2>Comprobá lo que entendiste</h2>
      <p class="quiz-intro">Estas preguntas no piden recordar fórmulas: plantean situaciones para ver si entendiste <em>por qué</em> pasan las cosas. Después de cada respuesta vas a ver si acertaste y una explicación. Necesitás acertar al menos <strong>${needed} de ${questions.length}</strong> para completar el capítulo.</p>
      ${progress.isCompleted(id) ? `<p class="quiz-banner">✓ Capítulo completado${best ? ` · mejor resultado ${best.score}/${best.total}` : ''}</p>` : ''}
      <ol class="quiz-list"></ol>
      <div class="quiz-result" hidden aria-live="polite"></div>`;

    const list = root.querySelector('.quiz-list');
    const result = root.querySelector('.quiz-result');

    questions.forEach((item, index) => {
      const options = shuffle([{ html: item.correct, ok: true }, ...item.wrong.map((html) => ({ html, ok: false }))]);
      const li = document.createElement('li');
      li.className = 'q';
      li.innerHTML = `
        <p class="q-text">${item.q}</p>
        <div class="q-options">${options.map((o, k) => `<button type="button" class="opt" data-k="${k}">${o.html}</button>`).join('')}</div>
        <p class="feedback" hidden aria-live="polite"></p>`;
      list.append(li);

      li.querySelector('.q-options').addEventListener('click', (event) => {
        const button = event.target.closest('.opt');
        if (!button || results[index] !== null) return;
        const picked = options[Number(button.dataset.k)];
        results[index] = picked.ok;

        li.querySelectorAll('.opt').forEach((b, k) => {
          b.disabled = true;
          if (options[k].ok) b.classList.add('right');
          else if (b === button) b.classList.add('wrong');
        });
        const feedback = li.querySelector('.feedback');
        feedback.hidden = false;
        feedback.className = `feedback ${picked.ok ? 'right' : 'wrong'}`;
        feedback.innerHTML = `<strong>${picked.ok ? '✓ ¡Correcto!' : '✗ No es esa.'}</strong>${item.explain}`;

        if (results.every((r) => r !== null)) finish(results, result);
      });
    });
  }

  function finish(results, result) {
    const score = results.filter(Boolean).length;
    const passed = score >= needed;
    progress.recordQuiz(id, score, questions.length, passed);

    result.hidden = false;
    result.className = `quiz-result ${passed ? 'passed' : 'failed'}`;
    result.innerHTML = `
      <h3>${passed ? '¡Capítulo completado!' : 'Todavía no alcanza'} · ${score} de ${questions.length} correctas</h3>
      <ul>${results.map((ok, n) => `<li><span class="${ok ? 'ok' : 'ko'}">${ok ? '✓' : '✗'}</span> Pregunta ${n + 1}</li>`).join('')}</ul>
      <p>${passed
        ? 'Entendiste lo central de este capítulo. Tu avance quedó guardado.'
        : `Necesitás al menos ${needed} correctas. Releé las explicaciones de las que fallaste, probá la simulación y volvé a intentarlo.`}</p>
      <div class="quiz-actions">
        <button type="button" class="btn" data-retry>↺ Volver a intentar</button>
        ${passed && next ? `<a class="btn" href="${next.id}.html">Siguiente capítulo →</a>` : ''}
      </div>`;
    result.querySelector('[data-retry]').addEventListener('click', () => {
      start();
      root.scrollIntoView({ behavior: 'smooth' });
    });
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  start();
})();
