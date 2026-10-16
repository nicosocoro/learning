// Preguntas del capítulo 26-entradas-adc.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '26-entradas-adc': [
  {
    "q": "¿Qué problema tiene una entrada digital conectada solo a un pulsador, sin ningún resistor?",
    "correct": "Cuando el pulsador está suelto la entrada «flota» y la lectura es impredecible, porque capta ruido.",
    "wrong": [
      "El pulsador se quema.",
      "La entrada siempre vale 1.",
      "La entrada siempre vale 0."
    ],
    "explain": "Una entrada digital sin conexión definida toma cualquier valor. El resistor de pull-up o de pull-down fija el nivel."
  },
  {
    "q": "Con un pulsador y un resistor pull-up a +5 V, ¿qué lee la entrada cuando se aprieta el pulsador (conectado a masa)?",
    "correct": "0 (nivel bajo).",
    "wrong": [
      "1.",
      "Un valor indefinido.",
      "5 V."
    ],
    "explain": "Con el pulsador suelto el pull-up fija 1. Al apretarlo, el pulsador conecta la entrada a masa y lee 0: la lógica queda invertida."
  },
  {
    "q": "Un ADC de 12 bits con una referencia de 3,3 V, ¿qué tensión representa un escalón (LSB), aproximadamente?",
    "correct": "Unos 0,8 mV: 3,3 V / 4096.",
    "wrong": [
      "Unos 8 mV.",
      "Unos 80 mV.",
      "Unos 0,08 mV."
    ],
    "explain": "LSB = V<sub>ref</sub> / 2<sup>n</sup> = 3,3 / 4096 ≈ 0,81 mV."
  },
  {
    "q": "¿Qué frecuencia de muestreo mínima exige el teorema de Nyquist para una señal de 5 kHz?",
    "correct": "Más de 10 kHz.",
    "wrong": [
      "Más de 2,5 kHz.",
      "Exactamente 5 kHz.",
      "Más de 50 kHz."
    ],
    "explain": "Hay que muestrear a más del doble de la frecuencia más alta de la señal."
  },
  {
    "q": "Al muestrear una señal de 900 Hz a 1000 muestras por segundo, ¿qué ocurre?",
    "correct": "Aparece un alias: la señal reconstruida parece de 100 Hz, que no existe.",
    "wrong": [
      "Se reconstruye perfectamente.",
      "Se ve la mitad de la amplitud.",
      "El ADC se satura."
    ],
    "explain": "900 Hz supera la mitad de la frecuencia de muestreo (500 Hz). Sin un filtro antialias, ese contenido se «refleja» como 1000 − 900 = 100 Hz."
  },
  {
    "q": "Una señal PWM de 5 V con ciclo de trabajo del 60 % pasa por un filtro RC con frecuencia de corte muy baja. ¿Qué tensión se obtiene?",
    "correct": "Unos 3 V: el valor medio, D · V<sub>alto</sub> = 0,6 · 5.",
    "wrong": [
      "5 V.",
      "0,6 V.",
      "2 V."
    ],
    "explain": "El filtro promedia los pulsos y entrega el valor medio de la señal, que es el ciclo de trabajo por la tensión alta."
  }
] };
