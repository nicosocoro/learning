// Preguntas del capítulo 22-resonancia.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '22-resonancia': [
  {
    "q": "¿Qué ocurre con la impedancia de un circuito RLC en serie en su frecuencia de resonancia?",
    "correct": "Es mínima y vale R: las reactancias de la bobina y del capacitor se cancelan.",
    "wrong": [
      "Es máxima, porque la bobina y el capacitor se suman.",
      "Es cero, aunque haya resistencia.",
      "No cambia con la frecuencia."
    ],
    "explain": "Las reactancias son iguales y opuestas (una adelanta 90° y la otra retrasa 90°): se anulan, y solo queda R."
  },
  {
    "q": "¿Cuánto vale la frecuencia de resonancia de un circuito con L = 1 mH y C = 100 nF (aproximadamente)?",
    "correct": "Unos 15,9 kHz: f₀ = 1/(2π√(10⁻³ · 10⁻⁷)).",
    "wrong": [
      "Unos 1,59 kHz.",
      "Unos 159 kHz.",
      "Unos 50 Hz."
    ],
    "explain": "L·C = 10⁻¹⁰, su raíz es 10⁻⁵, y 1/(2π · 10⁻⁵) ≈ 15,9 kHz."
  },
  {
    "q": "Se disminuye la resistencia de un circuito RLC en serie. ¿Qué pasa con el pico de resonancia?",
    "correct": "Se vuelve más alto y angosto: aumenta el Q.",
    "wrong": [
      "Se vuelve más bajo y ancho.",
      "Se desplaza hacia frecuencias más altas.",
      "Desaparece."
    ],
    "explain": "Q = X<sub>L</sub>/R: a menor R, mayor Q y mayor selectividad. La frecuencia de resonancia no depende de R."
  },
  {
    "q": "Un circuito resonante de f₀ = 1 MHz tiene Q = 50. ¿Cuál es su ancho de banda?",
    "correct": "20 kHz: B = f₀ / Q = 1 000 000 / 50.",
    "wrong": [
      "50 kHz.",
      "1 MHz.",
      "200 kHz."
    ],
    "explain": "El ancho de banda es la frecuencia de resonancia dividida por el factor de calidad."
  },
  {
    "q": "En resonancia, la tensión en la bobina de un circuito con Q = 20 y una fuente de 2 V vale…",
    "correct": "Unos 40 V: V<sub>L</sub> = Q · V.",
    "wrong": [
      "2 V, igual que la fuente.",
      "0 V, porque se cancela.",
      "Unos 0,1 V."
    ],
    "explain": "La corriente es máxima y la reactancia es grande: V<sub>L</sub> = I·X<sub>L</sub> = Q·V. La tensión en L y C se cancela entre sí, pero cada una puede ser enorme."
  },
  {
    "q": "¿Cómo se sintoniza una emisora en una radio con un circuito LC?",
    "correct": "Se cambia la capacidad (o la inductancia) para mover la frecuencia de resonancia hasta la de la emisora.",
    "wrong": [
      "Se cambia la tensión de la fuente.",
      "Se aumenta la resistencia del circuito.",
      "Se acorta la antena."
    ],
    "explain": "El circuito resonante responde con fuerza solo a su f₀. Con un capacitor variable se barre f₀ hasta que coincide con la emisora deseada."
  }
] };
