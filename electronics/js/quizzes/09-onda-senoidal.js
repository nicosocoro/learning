// Preguntas del capítulo 09-onda-senoidal.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '09-onda-senoidal': [
  {
    "q": "Los “220 V” de un enchufe, ¿qué valor representan?",
    "correct": "El valor eficaz: equivale a una tensión continua de 220 V en potencia; el pico es mayor (unos 311 V).",
    "wrong": [
      "El valor pico de la onda.",
      "El valor promedio de la onda.",
      "El valor pico a pico."
    ],
    "explain": "El valor eficaz se define para comparar una señal alterna con una continua. El pico es √2 veces mayor."
  },
  {
    "q": "Aumentás la frecuencia de una señal senoidal sin tocar su amplitud. ¿Qué cambia?",
    "correct": "El período se acorta; la altura de la onda sigue igual.",
    "wrong": [
      "La onda se hace más alta.",
      "El valor eficaz aumenta.",
      "El período se alarga."
    ],
    "explain": "Frecuencia y amplitud son independientes: una dice <em>qué tan rápido</em> se repite y la otra <em>qué tan alta</em> llega."
  },
  {
    "q": "¿Para qué sirve el valor eficaz?",
    "correct": "Para comparar una señal alterna con una continua en términos de potencia entregada.",
    "wrong": [
      "Para saber cuánto dura un ciclo.",
      "Para medir la frecuencia de la señal.",
      "Para calcular el valor máximo que alcanza la tensión."
    ],
    "explain": "Es la tensión continua que calentaría una resistencia exactamente igual que la señal alterna."
  },
  {
    "q": "Un componente soporta como máximo 250 V. ¿Es seguro conectarlo a una red de 220 V eficaces?",
    "correct": "No necesariamente: la tensión pico llega a unos 311 V, por encima de lo que aguanta.",
    "wrong": [
      "Sí, porque 220 es menor que 250.",
      "Sí, porque la tensión promedio de la red es cero.",
      "No, porque la red es de corriente alterna y los componentes solo aceptan continua."
    ],
    "explain": "Los componentes sufren el valor instantáneo, y en los picos la tensión supera el valor eficaz en un 41 %."
  },
  {
    "q": "En un circuito con una resistencia y corriente alterna, ¿puede la potencia instantánea ser negativa?",
    "correct": "No: p = v²/R siempre es mayor o igual que cero.",
    "wrong": [
      "Sí, cuando la tensión es negativa.",
      "Sí, cuando la corriente cambia de sentido.",
      "Solo si la frecuencia es muy baja."
    ],
    "explain": "Si la tensión es negativa, la corriente también, y su producto es positivo. La resistencia siempre consume energía, nunca la devuelve."
  },
  {
    "q": "Un multímetro económico (no True RMS) mide una onda cuadrada. ¿Qué pasa con la lectura?",
    "correct": "Es incorrecta: el instrumento está calibrado suponiendo una onda senoidal.",
    "wrong": [
      "Es exacta: los multímetros siempre miden el valor eficaz verdadero.",
      "Marca siempre cero con ondas cuadradas.",
      "Marca el valor pico a pico."
    ],
    "explain": "Estos instrumentos miden el promedio rectificado y le aplican el factor de la senoide (1,11). Para otras formas, la relación entre promedio y valor eficaz es distinta y el resultado se desvía."
  }
] };
