// Preguntas del capítulo 23-amplificador-operacional.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '23-amplificador-operacional': [
  {
    "q": "En un amplificador inversor con R<sub>in</sub> = 2 kΩ y R<sub>f</sub> = 20 kΩ, una entrada de 0,3 V da una salida de…",
    "correct": "−3 V: la ganancia es −R<sub>f</sub>/R<sub>in</sub> = −10.",
    "wrong": [
      "+3 V.",
      "−0,03 V.",
      "+0,3 V."
    ],
    "explain": "El inversor invierte la señal y la multiplica por R<sub>f</sub>/R<sub>in</sub>."
  },
  {
    "q": "¿Cuál es la ganancia de un amplificador no inversor con R<sub>f</sub> = 9 kΩ y R<sub>g</sub> = 1 kΩ?",
    "correct": "10: A<sub>v</sub> = 1 + R<sub>f</sub>/R<sub>g</sub> = 1 + 9.",
    "wrong": [
      "9.",
      "−9.",
      "0,1."
    ],
    "explain": "La ganancia del no inversor es siempre 1 más la relación entre los resistores."
  },
  {
    "q": "Con realimentación negativa y la salida sin saturar, ¿qué cumplen las dos entradas del operacional?",
    "correct": "Están prácticamente a la misma tensión: V₊ ≈ V₋.",
    "wrong": [
      "Una está a la tensión de alimentación y la otra a 0 V.",
      "Entra mucha corriente por cada una.",
      "Tienen siempre polaridades opuestas."
    ],
    "explain": "Con una ganancia enorme, el operacional ajusta la salida hasta que la diferencia entre sus entradas es casi nula."
  },
  {
    "q": "¿Para qué sirve un seguidor de tensión si su ganancia es 1?",
    "correct": "Para copiar una señal con una impedancia de entrada muy alta y de salida baja, sin cargar la fuente.",
    "wrong": [
      "Para amplificar la señal 100 veces.",
      "Para invertir la señal.",
      "Para quitar la continua."
    ],
    "explain": "Es un «buffer»: aísla una fuente débil de una carga exigente."
  },
  {
    "q": "Un operacional de 1 MHz de producto ganancia-ancho de banda se usa con ganancia 50. ¿Qué ancho de banda tiene aproximadamente?",
    "correct": "20 kHz: GBW / A<sub>v</sub> = 1 MHz / 50.",
    "wrong": [
      "1 MHz.",
      "50 kHz.",
      "2 kHz."
    ],
    "explain": "Ganancia × ancho de banda es casi constante, así que a más ganancia, menos ancho de banda."
  },
  {
    "q": "Con alimentación de ±12 V, el amplificador de ganancia 20 recibe una señal de 1 V de pico. ¿Qué sale?",
    "correct": "Una onda recortada en unos ±10,5 V (la ganancia pediría 20 V).",
    "wrong": [
      "Una onda senoidal perfecta de 20 V.",
      "Una onda de 1 V.",
      "Nada: la salida es cero."
    ],
    "explain": "La salida no puede superar la alimentación: con ±12 V se satura cerca de ±10,5 V y la onda se recorta."
  }
] };
