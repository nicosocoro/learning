// Preguntas del capítulo 16-transistor-amplificador.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '16-transistor-amplificador': [
  {
    "q": "En un amplificador de emisor común, cuando la tensión de entrada sube, ¿qué hace la tensión de salida (en el colector)?",
    "correct": "Baja: la salida está invertida respecto de la entrada.",
    "wrong": [
      "Sube en la misma proporción.",
      "Se queda fija.",
      "Sube y baja al azar."
    ],
    "explain": "Más tensión en la base significa más corriente de colector, más caída en R<sub>C</sub> y entonces menos tensión en el colector."
  },
  {
    "q": "Un amplificador tiene R<sub>C</sub> = 3,3 kΩ y r<sub>e</sub> = 11 Ω, con R<sub>E</sub> = 0. Más o menos, ¿cuánto vale la ganancia de tensión?",
    "correct": "Cerca de −300.",
    "wrong": [
      "Cerca de −3,3.",
      "Cerca de +11.",
      "Cerca de −1."
    ],
    "explain": "A<sub>v</sub> = −R<sub>C</sub> / r<sub>e</sub> = −3300 / 11 = −300. Es una ganancia grande pero poco estable."
  },
  {
    "q": "¿Para qué sirve polarizar el transistor con un divisor de tensión en la base?",
    "correct": "Para fijar una corriente continua de reposo que lo mantenga siempre en la zona activa mientras la señal sube y baja.",
    "wrong": [
      "Para multiplicar la tensión de la señal.",
      "Para que el transistor funcione como un interruptor.",
      "Para eliminar la inversión de fase."
    ],
    "explain": "Sin polarización, el transistor quedaría en corte durante una parte de la señal y se perdería medio ciclo."
  },
  {
    "q": "¿Por qué agregar un resistor de emisor sin desacoplar estabiliza la ganancia, aunque la reduzca?",
    "correct": "Porque la ganancia pasa a depender de los resistores (≈ −R<sub>C</sub>/R<sub>E</sub>) y no de r<sub>e</sub>, que varía con la corriente y la temperatura.",
    "wrong": [
      "Porque aumenta β.",
      "Porque elimina la corriente de base.",
      "Porque pone al transistor en corte."
    ],
    "explain": "r<sub>e</sub> cambia con I<sub>C</sub>, que cambia con la temperatura. Con R<sub>E</sub> grande, la ganancia ≈ R<sub>C</sub>/R<sub>E</sub> es casi constante."
  },
  {
    "q": "La tensión de reposo del colector es de 10 V con V<sub>CC</sub> = 12 V. ¿Qué problema tiene este amplificador?",
    "correct": "Hay poco margen hacia arriba (solo 2 V): las señales de salida de más de 2 V de amplitud se recortarán en el extremo superior.",
    "wrong": [
      "Ninguno: cuanto más cerca de V<sub>CC</sub>, mejor.",
      "Que está saturado y no conduce.",
      "Que no tiene ganancia."
    ],
    "explain": "La salida no puede superar la fuente. Con el reposo cerca de V<sub>CC</sub>, casi todo el recorrido disponible está hacia abajo y el punto de trabajo está mal centrado."
  },
  {
    "q": "¿Qué función cumplen los capacitores de acople de entrada y de salida?",
    "correct": "Dejan pasar la señal alterna y bloquean la continua, para que el punto de trabajo no se altere.",
    "wrong": [
      "Aumentan la ganancia de corriente.",
      "Convierten la señal alterna en continua.",
      "Reemplazan a la fuente de alimentación."
    ],
    "explain": "Un capacitor es un circuito abierto para la continua y casi un cable para la alterna (si la frecuencia es suficientemente alta)."
  }
] };
