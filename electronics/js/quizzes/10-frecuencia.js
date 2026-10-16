// Preguntas del capítulo 10-frecuencia.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '10-frecuencia': [
  {
    "q": "Duplicás la frecuencia de una nota musical. ¿Qué oís?",
    "correct": "La misma nota, una octava más aguda.",
    "wrong": [
      "La misma nota, una octava más grave.",
      "Una nota más fuerte.",
      "La misma nota, pero con otro timbre."
    ],
    "explain": "La altura del sonido está determinada por la frecuencia; cada duplicación sube una octava. El volumen depende de la amplitud."
  },
  {
    "q": "Si una señal tiene mayor frecuencia, ¿qué ocurre con su período?",
    "correct": "Se acorta: cada ciclo dura menos.",
    "wrong": [
      "Se alarga.",
      "No cambia.",
      "Se duplica siempre."
    ],
    "explain": "Período y frecuencia son inversos: cuantos más ciclos caben en un segundo, menos dura cada uno."
  },
  {
    "q": "La luz de una lámpara conectada a la red cambia de brillo 100 veces por segundo, pero no la vemos parpadear. ¿Por qué?",
    "correct": "Porque el cambio es demasiado rápido para que el ojo lo perciba.",
    "wrong": [
      "Porque la lámpara no depende de la tensión de la red.",
      "Porque la lámpara siempre recibe tensión continua.",
      "Porque el parpadeo solo existe en teoría."
    ],
    "explain": "Una señal de 50 Hz tiene dos picos de potencia por ciclo, es decir 100 variaciones por segundo; el ojo las promedia. Con una cámara de alta velocidad sí se nota."
  },
  {
    "q": "Una onda senoidal y otra cuadrada tienen la misma frecuencia. ¿Cómo suenan?",
    "correct": "Con la misma altura, pero con distinto timbre.",
    "wrong": [
      "Exactamente igual.",
      "Con distinta altura, pero igual timbre.",
      "La cuadrada no se puede escuchar."
    ],
    "explain": "La frecuencia fija la altura. La forma de la onda cambia el contenido de armónicos, y eso es lo que llamamos timbre."
  },
  {
    "q": "Si aumenta la frecuencia de una onda que viaja en el mismo medio, ¿qué pasa con su longitud de onda?",
    "correct": "Disminuye.",
    "wrong": [
      "Aumenta.",
      "No cambia.",
      "Se vuelve cero."
    ],
    "explain": "En un mismo medio la velocidad es fija: <em>λ = v/f</em>. A mayor frecuencia, más corta es la distancia entre cresta y cresta."
  },
  {
    "q": "Una guitarra y un piano tocan exactamente la misma nota. ¿Por qué suenan distinto?",
    "correct": "Tienen la misma frecuencia fundamental, pero distinta mezcla de armónicos: distinto timbre.",
    "wrong": [
      "Porque tocan frecuencias distintas.",
      "Porque el piano es más fuerte.",
      "Porque una es analógica y la otra digital."
    ],
    "explain": "La frecuencia fundamental determina la nota. Los armónicos (múltiplos de esa frecuencia, con amplitudes diferentes en cada instrumento) dan el timbre característico."
  },
  {
    "q": "Las ondas de radio FM y la luz visible, ¿qué tienen en común?",
    "correct": "Son ondas electromagnéticas que viajan a la misma velocidad en el vacío y solo se diferencian en su frecuencia.",
    "wrong": [
      "Nada: son fenómenos físicos completamente distintos.",
      "Las dos necesitan aire para propagarse.",
      "Tienen la misma frecuencia pero distinta amplitud."
    ],
    "explain": "La radio, el WiFi, la luz y los rayos X son todas ondas electromagnéticas. Se propagan a c ≈ 3 × 10<sup>8</sup> m/s y se clasifican según su frecuencia."
  }
] };
