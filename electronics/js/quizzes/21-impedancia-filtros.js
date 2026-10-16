// Preguntas del capítulo 21-impedancia-filtros.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '21-impedancia-filtros': [
  {
    "q": "¿Por qué la resistencia y la reactancia de un capacitor no se suman directamente?",
    "correct": "Porque están desfasadas 90°: se combinan como los lados de un triángulo rectángulo, |Z| = √(R² + X²).",
    "wrong": [
      "Porque el capacitor no tiene resistencia.",
      "Porque la reactancia es siempre mucho mayor que R.",
      "Porque se miden en unidades distintas."
    ],
    "explain": "En el resistor tensión y corriente están en fase; en el capacitor, desfasadas 90°. Eso da el triángulo de impedancia."
  },
  {
    "q": "Un circuito con R = 400 Ω en serie con una reactancia de 300 Ω tiene una impedancia de…",
    "correct": "500 Ω: √(400² + 300²).",
    "wrong": [
      "700 Ω.",
      "100 Ω.",
      "350 Ω."
    ],
    "explain": "Es el triángulo 3-4-5 por 100: Z = √(160 000 + 90 000) = 500 Ω."
  },
  {
    "q": "En un filtro RC pasa-bajos, ¿qué ocurre con las frecuencias muy altas?",
    "correct": "Se atenúan mucho, porque la reactancia del capacitor es muy pequeña y deriva la señal a masa.",
    "wrong": [
      "Pasan sin cambio.",
      "Se amplifican.",
      "Se convierten en continua."
    ],
    "explain": "A frecuencias altas X<sub>C</sub> se hace pequeña: el capacitor funciona casi como un cable a masa y casi nada llega a la salida."
  },
  {
    "q": "¿Cuánto vale la frecuencia de corte de un filtro con R = 10 kΩ y C = 16 nF (aproximadamente)?",
    "correct": "Unos 1 kHz: f<sub>c</sub> = 1 / (2π · 10 000 · 16·10⁻⁹) ≈ 995 Hz.",
    "wrong": [
      "Unos 100 Hz.",
      "Unos 10 kHz.",
      "Unos 50 Hz."
    ],
    "explain": "Se aplica f<sub>c</sub> = 1/(2πRC). 2π · 10⁴ · 1,6·10⁻⁸ ≈ 1,0·10⁻³, y la inversa es ≈ 1 kHz."
  },
  {
    "q": "A la frecuencia de corte de un filtro RC, ¿cuánto vale la ganancia?",
    "correct": "0,707 (−3 dB): la potencia cae a la mitad.",
    "wrong": [
      "0,5 (−6 dB).",
      "0 (se corta del todo).",
      "1 (0 dB)."
    ],
    "explain": "La frecuencia de corte se define justo ahí: X<sub>C</sub> = R, y la salida cae a 1/√2 de la entrada."
  },
  {
    "q": "Un filtro RC simple frena 20 dB por década. Si a 1 kHz la salida es 1 V, ¿cuánto será (aproximadamente) a 10 veces esa frecuencia, bien por encima de f<sub>c</sub>?",
    "correct": "Cerca de 0,1 V.",
    "wrong": [
      "Cerca de 0,5 V.",
      "Cerca de 1 V.",
      "Cerca de 10 V."
    ],
    "explain": "−20 dB es un factor 10 en tensión: cada multiplicación de la frecuencia por 10 divide la amplitud por 10."
  }
] };
