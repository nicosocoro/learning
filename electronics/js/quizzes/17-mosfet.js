// Preguntas del capítulo 17-mosfet.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '17-mosfet': [
  {
    "q": "¿Qué diferencia fundamental hay entre cómo se controla un BJT y un MOSFET?",
    "correct": "El BJT se controla con una corriente de base; el MOSFET, con una tensión de compuerta que casi no consume corriente.",
    "wrong": [
      "El BJT se controla con tensión y el MOSFET con corriente.",
      "Los dos se controlan con corriente, pero a distinta velocidad.",
      "El MOSFET no se puede controlar desde un microcontrolador."
    ],
    "explain": "La compuerta del MOSFET está aislada por un óxido. Su campo eléctrico abre el canal, así que en continua no circula corriente por ella."
  },
  {
    "q": "¿Qué quiere decir que un MOSFET sea «de nivel lógico»?",
    "correct": "Que alcanza su resistencia mínima con una tensión de compuerta baja (unos 4,5–5 V o menos), y se puede manejar directo desde un microcontrolador.",
    "wrong": [
      "Que solo se usa en circuitos digitales.",
      "Que tiene una tensión umbral de exactamente 5 V.",
      "Que no necesita masa."
    ],
    "explain": "Los MOSFET estándar necesitan unos 10 V para abrirse del todo. Para elegir, hay que mirar R<sub>DS(on)</sub> especificado con la V<sub>GS</sub> disponible."
  },
  {
    "q": "Un MOSFET con R<sub>DS(on)</sub> = 50 mΩ conduce 4 A. ¿Cuánto calor disipa?",
    "correct": "0,8 W: P = I² · R = 16 · 0,05.",
    "wrong": [
      "20 W: P = V · I con 5 V.",
      "0,2 W: P = I · R.",
      "Nada: los MOSFET no disipan potencia."
    ],
    "explain": "En la región lineal el MOSFET es un resistor de R<sub>DS(on)</sub>: P = I²·R = 4² · 0,05 = 0,8 W."
  },
  {
    "q": "¿Por qué conviene un resistor de unos 100 kΩ entre la compuerta y la masa?",
    "correct": "Para que el MOSFET quede apagado si el pin de control está desconectado o en alta impedancia, y la compuerta no flote.",
    "wrong": [
      "Para aumentar la corriente de compuerta.",
      "Para bajar la tensión umbral.",
      "Para que el MOSFET conduzca siempre."
    ],
    "explain": "Una compuerta flotante capta ruido y estática y el MOSFET puede conducir a medias y calentarse o activarse solo."
  },
  {
    "q": "Se aumenta mucho el resistor de compuerta (de 100 Ω a 10 kΩ). ¿Qué cambia?",
    "correct": "La compuerta se carga más despacio (τ = R<sub>G</sub> · C<sub>G</sub>) y el MOSFET pasa más tiempo en la zona intermedia, disipando más calor al conmutar.",
    "wrong": [
      "El MOSFET conduce más corriente.",
      "El MOSFET se abre antes.",
      "No cambia nada, porque la compuerta no consume corriente."
    ],
    "explain": "La compuerta se comporta como un capacitor: cuanto mayor es R, más tarda en cargarse. En PWM rápido eso es un problema."
  },
  {
    "q": "En un MOSFET, ¿qué significa que esté en «saturación»?",
    "correct": "Que la corriente de drenador queda limitada por V<sub>GS</sub> y V<sub>DS</sub> es grande: se comporta como fuente de corriente, no como interruptor cerrado.",
    "wrong": [
      "Que está completamente abierto, como un interruptor cerrado.",
      "Que está apagado.",
      "Que la compuerta se quemó."
    ],
    "explain": "Es lo opuesto al BJT. Para un interruptor se busca la región lineal, con V<sub>DS</sub> muy pequeña."
  }
] };
