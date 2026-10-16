// Preguntas del capítulo 24-aplicaciones-operacional.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '24-aplicaciones-operacional': [
  {
    "q": "Un operacional sin realimentación y con V₊ = 2 V y V₋ = 1,9 V (alimentación de ±12 V) tiene a la salida…",
    "correct": "Una tensión positiva cerca de la saturación (≈ +10,5 V), porque V₊ es mayor que V₋.",
    "wrong": [
      "0,1 V, la diferencia entre las entradas.",
      "−10,5 V, porque V₋ es mayor.",
      "Cero, porque las entradas son casi iguales."
    ],
    "explain": "Con ganancia de lazo abierto de 100 000, aun 0,1 V de diferencia satura la salida: es un comparador."
  },
  {
    "q": "¿Para qué se agrega histéresis a un comparador?",
    "correct": "Para evitar que el ruido haga conmutar la salida varias veces cuando la señal pasa lentamente por el umbral.",
    "wrong": [
      "Para aumentar la ganancia.",
      "Para invertir la salida.",
      "Para reducir el consumo."
    ],
    "explain": "Con dos umbrales distintos, el ruido no alcanza a cruzar el umbral opuesto y la salida cambia una sola vez."
  },
  {
    "q": "Un disparador de Schmitt tiene R₁ = 1 kΩ, R₂ = 10 kΩ y saturación de ±10 V. ¿Cuáles son los umbrales?",
    "correct": "±1 V: V<sub>sat</sub> · R₁/R₂ = 10 · 0,1.",
    "wrong": [
      "±10 V.",
      "±0,1 V.",
      "±100 V."
    ],
    "explain": "El umbral es ±V<sub>sat</sub>·R₁/R₂ y la histéresis total es el doble: 2 V."
  },
  {
    "q": "Un sumador inversor con R<sub>f</sub> = R₁ = R₂ = 10 kΩ recibe 1 V y 2 V. ¿Qué sale?",
    "correct": "−3 V: es la suma de las entradas, invertida.",
    "wrong": [
      "+3 V.",
      "−1,5 V.",
      "+1 V."
    ],
    "explain": "V<sub>sal</sub> = −R<sub>f</sub>·(V₁/R₁ + V₂/R₂) = −(1 + 2) = −3 V."
  },
  {
    "q": "¿Qué ventaja tiene un filtro activo respecto de uno pasivo RC?",
    "correct": "No se carga con lo que se le conecta, puede tener ganancia y permite filtros de orden superior sin bobinas.",
    "wrong": [
      "Funciona sin alimentación.",
      "Tiene menos ruido siempre.",
      "No tiene frecuencia de corte."
    ],
    "explain": "El operacional aísla las etapas (entrada de alta impedancia, salida de baja) y aporta ganancia."
  },
  {
    "q": "Un integrador (R = 100 kΩ, C = 10 nF) recibe una entrada constante de +2 V. ¿Qué hace la salida?",
    "correct": "Baja con una rampa de −2 V cada milisegundo (hasta saturarse).",
    "wrong": [
      "Se queda fija en −2 V.",
      "Sube con una rampa positiva.",
      "Oscila con una senoide."
    ],
    "explain": "La pendiente es −V/RC: RC = 1 ms, así que −2 V/ms. La salida acumula la entrada con el tiempo."
  }
] };
