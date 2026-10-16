// Cargas moviéndose por un camino (polilínea). Se usa para dibujar la corriente.

(function () {
  const Elec = (window.Elec ??= {});
  const { chargeDot } = Elec;
  const { colors } = Elec;

  /**
   * Velocidad visual (px/s) a partir de la corriente. No está a escala: la deriva real
   * de los electrones es de fracciones de mm/s. La curva comprime el rango para que
   * corrientes pequeñas se vean sin que las grandes sean ilegibles.
   */
  function visualSpeed(current, maxCurrent) {
    const fraction = Math.min(Math.abs(current) / maxCurrent, 1);
    return 130 * fraction ** 0.4;
  }

  const mod = (a, n) => ((a % n) + n) % n;

  class FlowPath {
    constructor(points = [], { closed = false } = {}) {
      this.closed = closed;
      this.phase = 0; // desplazamiento acumulado en px a lo largo del camino
      this.setPoints(points);
    }

    /** Recalcula la geometría (se llama en cada frame porque depende del tamaño del canvas). */
    setPoints(points) {
      this.points = this.closed && points.length ? [...points, points[0]] : points;
      this.cum = [0];
      for (let i = 1; i < this.points.length; i++) {
        const [x1, y1] = this.points[i - 1];
        const [x2, y2] = this.points[i];
        this.cum.push(this.cum[i - 1] + Math.hypot(x2 - x1, y2 - y1));
      }
      this.length = this.cum.at(-1);
    }

    /** speed en px/s: positivo avanza en el sentido en que se definieron los puntos. */
    advance(dt, speed) {
      this.phase += speed * dt;
    }

    pointAt(s) {
      let i = 1;
      while (i < this.cum.length - 1 && this.cum[i] < s) i++;
      const segLen = this.cum[i] - this.cum[i - 1] || 1;
      const t = (s - this.cum[i - 1]) / segLen;
      const [x1, y1] = this.points[i - 1];
      const [x2, y2] = this.points[i];
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
    }

    /** Dibuja electrones (azules, −) equiespaciados. */
    draw(ctx, { spacing = 24, radius = 5, color = colors().chargeNeg, sign = '−' } = {}) {
      if (this.length < spacing) return;
      const count = Math.round(this.length / spacing);
      const gap = this.length / count;
      for (let k = 0; k < count; k++) {
        const [x, y] = this.pointAt(mod(this.phase + k * gap, this.length));
        chargeDot(ctx, x, y, radius, color, sign);
      }
    }
  }

  Object.assign(Elec, { visualSpeed, FlowPath });
})();
