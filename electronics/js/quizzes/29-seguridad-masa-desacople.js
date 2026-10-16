// Preguntas del capítulo 29-seguridad-masa-desacople.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '29-seguridad-masa-desacople': [
  {
    "q": "¿Qué es lo que causa el daño en una descarga eléctrica?",
    "correct": "La corriente que atraviesa el cuerpo, que depende de la tensión y de la resistencia de la piel.",
    "wrong": [
      "Solo la tensión, sin importar la corriente.",
      "La frecuencia de la red.",
      "El color del cable."
    ],
    "explain": "I = V/R. A partir de unos 10 mA no se puede soltar; entre 30 y 100 mA hay riesgo de fibrilación."
  },
  {
    "q": "Una persona con la piel mojada (1 kΩ) toca 220 V. ¿Qué corriente circula, aproximadamente?",
    "correct": "220 mA: I = V/R, suficiente para causar la muerte.",
    "wrong": [
      "2,2 mA.",
      "22 µA.",
      "1 A."
    ],
    "explain": "220 V / 1000 Ω = 0,22 A. Es unas siete veces la corriente que pone en riesgo el corazón."
  },
  {
    "q": "¿Cuál es la diferencia entre masa y tierra de protección?",
    "correct": "La masa es el 0 V de referencia de un circuito; la tierra de protección une el chasis metálico a una jabalina enterrada, para desviar fallas.",
    "wrong": [
      "Son lo mismo con otro nombre.",
      "La masa es el cable de la red y la tierra es el neutro.",
      "La tierra de protección solo existe en las baterías."
    ],
    "explain": "Una pila tiene masa, pero no está conectada a tierra. La tierra de protección es un conductor de seguridad."
  },
  {
    "q": "¿Dónde conviene colocar el capacitor de desacople de 100 nF de un circuito integrado?",
    "correct": "Lo más cerca posible de los pines de alimentación del chip.",
    "wrong": [
      "En la fuente, lejos del chip.",
      "En serie con la alimentación.",
      "En cualquier lugar: no importa la distancia."
    ],
    "explain": "Cuanto más corto el lazo entre el capacitor y el chip, menos inductancia y menos pico de tensión en cada pulso de corriente."
  },
  {
    "q": "Un cable de alimentación de 50 nH sufre un cambio de corriente de 2·10⁷ A/s. ¿Qué tensión se induce?",
    "correct": "1 V: V = L · Δi/Δt = 50·10⁻⁹ · 2·10⁷.",
    "wrong": [
      "0,001 V.",
      "100 V.",
      "10 mV."
    ],
    "explain": "Es la ley de la autoinducción. Por eso los cables largos alimentando chips rápidos necesitan desacople."
  },
  {
    "q": "¿Qué ventaja tiene un optoacoplador?",
    "correct": "Transmite una señal entre dos circuitos sin conexión eléctrica: la información viaja como luz dentro del encapsulado.",
    "wrong": [
      "Amplifica mucho la tensión.",
      "Convierte alterna en continua.",
      "Elimina la necesidad de masa."
    ],
    "explain": "Aísla galvánicamente un circuito de otro: útil con 220 V, para evitar lazos de masa o proteger un microcontrolador."
  }
] };
