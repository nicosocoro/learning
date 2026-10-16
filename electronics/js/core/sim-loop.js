// Bucle de animación con play/pausa y escala de tiempo.

(function () {
  const Elec = (window.Elec ??= {});

  const MAX_DT = 0.05; // evita saltos grandes al volver de otra pestaña

  function createLoop({ step, render }) {
    let running = false;
    let rafId = 0;
    let last = 0;
    let speed = 1;

    function frame(now) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, MAX_DT);
      last = now;
      step(dt * speed);
      render();
      rafId = requestAnimationFrame(frame);
    }

    return {
      get running() {
        return running;
      },
      play() {
        if (running) return;
        running = true;
        last = performance.now();
        rafId = requestAnimationFrame(frame);
      },
      pause() {
        running = false;
        cancelAnimationFrame(rafId);
      },
      setSpeed(value) {
        speed = value;
      },
    };
  }

  Object.assign(Elec, { createLoop });
})();
