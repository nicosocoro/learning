// Tono de prueba con Web Audio. Los navegadores exigen un gesto del usuario para
// empezar a sonar, por eso start() se llama desde un clic en los controles.

(function () {
  const Elec = (window.Elec ??= {});

  const MAX_GAIN = 0.2; // tope para no lastimar los oídos ni los parlantes

  function createTone() {
    let ctx = null;
    let osc = null;
    let gain = null;

    return {
      start(frequency, type, volume) {
        ctx ??= new (window.AudioContext || window.webkitAudioContext)();
        ctx.resume();
        this.stop();
        osc = ctx.createOscillator();
        gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        gain.gain.value = volume * MAX_GAIN;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
      },
      update(frequency, type, volume) {
        if (!osc) return;
        osc.type = type;
        osc.frequency.setTargetAtTime(frequency, ctx.currentTime, 0.02);
        gain.gain.setTargetAtTime(volume * MAX_GAIN, ctx.currentTime, 0.02);
      },
      stop() {
        if (!osc) return;
        osc.stop();
        osc.disconnect();
        gain.disconnect();
        osc = null;
        gain = null;
      },
      get playing() {
        return osc !== null;
      },
    };
  }

  Object.assign(Elec, { createTone });
})();
