// Preguntas del capítulo 20-inductor-rl.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '20-inductor-rl': [
  {
    "q": "En el primer instante después de conectar una bobina sin corriente a una fuente, ¿cómo se comporta?",
    "correct": "Como un circuito abierto: cae toda la tensión en ella y la corriente todavía es cero.",
    "wrong": [
      "Como un cable: la corriente salta al valor máximo.",
      "Como un resistor de valor fijo.",
      "Como un capacitor descargado."
    ],
    "explain": "La bobina se opone a los cambios de corriente: la corriente parte de cero. Con el tiempo, la tensión en la bobina cae y todo el voltaje queda sobre R."
  },
  {
    "q": "Un circuito RL tiene R = 50 Ω y L = 100 mH. ¿Cuánto vale la constante de tiempo?",
    "correct": "2 ms: τ = L / R = 0,1 / 50.",
    "wrong": [
      "20 ms.",
      "0,5 ms.",
      "5 s."
    ],
    "explain": "En un RL la constante de tiempo es L dividido por R. A 5τ (10 ms) la corriente llegó a más del 99 % de su valor final."
  },
  {
    "q": "Se duplica la inductancia L de un circuito RL (con la misma R y la misma fuente). ¿Qué pasa con la corriente final?",
    "correct": "No cambia: la fija V/R. Solo tarda el doble en llegar.",
    "wrong": [
      "Se duplica.",
      "Se reduce a la mitad.",
      "Se hace cero."
    ],
    "explain": "En régimen permanente la bobina es un cable y la corriente es V/R. L solo determina cuánto tarda en llegar (τ = L/R)."
  },
  {
    "q": "¿Cómo cambia la reactancia de una bobina al aumentar la frecuencia?",
    "correct": "Aumenta: X<sub>L</sub> = 2πfL, así que a más frecuencia, más oposición.",
    "wrong": [
      "Disminuye, como la de un capacitor.",
      "No cambia.",
      "Se anula."
    ],
    "explain": "Es lo contrario del capacitor. Por eso una bobina deja pasar la continua y frena el ruido de alta frecuencia."
  },
  {
    "q": "Una bobina de 0,2 H por la que circulan 0,5 A almacena…",
    "correct": "25 mJ: E = ½ · 0,2 · 0,5².",
    "wrong": [
      "0,1 J.",
      "0,05 J.",
      "2,5 mJ."
    ],
    "explain": "La energía es ½·L·I². Con I = 0,5 A: 0,5 · 0,2 · 0,25 = 0,025 J."
  },
  {
    "q": "¿Qué comparación entre capacitor e inductor es correcta?",
    "correct": "El capacitor se opone a los cambios de tensión y el inductor, a los cambios de corriente.",
    "wrong": [
      "Los dos se oponen a los cambios de tensión.",
      "El inductor almacena energía en un campo eléctrico.",
      "Los dos se comportan como un cable en continua."
    ],
    "explain": "El capacitor guarda energía en el campo eléctrico y es un circuito abierto en continua; el inductor la guarda en el campo magnético y es un cable en continua."
  }
] };
