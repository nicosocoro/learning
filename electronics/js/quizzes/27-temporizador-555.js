// Preguntas del capítulo 27-temporizador-555.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '27-temporizador-555': [
  {
    "q": "¿Cuánto vale la tensión de los umbrales internos del 555?",
    "correct": "⅓ y ⅔ de la tensión de alimentación.",
    "wrong": [
      "1 V y 2 V siempre.",
      "½ y ¼ de la alimentación.",
      "0 V y V<sub>CC</sub>."
    ],
    "explain": "El divisor de tres resistores iguales (de 5 kΩ, de ahí el «555») fija esas referencias."
  },
  {
    "q": "Un 555 monoestable con R = 100 kΩ y C = 10 µF produce un pulso de…",
    "correct": "Unos 1,1 s: T = 1,1 · R · C.",
    "wrong": [
      "0,1 s.",
      "10 s.",
      "1,1 ms."
    ],
    "explain": "R·C = 100 000 · 0,00001 = 1 s, y T = 1,1 · 1 s."
  },
  {
    "q": "¿Por qué el ciclo de trabajo de un 555 astable simple es siempre mayor que 50 %?",
    "correct": "Porque el capacitor se carga a través de R1 + R2 y se descarga solo por R2: el tiempo en alto es mayor que el tiempo en bajo.",
    "wrong": [
      "Porque la salida nunca llega a cero.",
      "Porque el LED consume corriente.",
      "Porque la frecuencia es demasiado baja."
    ],
    "explain": "t<sub>alto</sub> = 0,693·(R1 + R2)·C y t<sub>bajo</sub> = 0,693·R2·C: el primero es siempre mayor."
  },
  {
    "q": "Se duplica el capacitor de un 555 astable. ¿Qué pasa con la frecuencia?",
    "correct": "Se reduce a la mitad, porque f es inversamente proporcional a C.",
    "wrong": [
      "Se duplica.",
      "No cambia.",
      "Se hace cero."
    ],
    "explain": "Con C el doble, el capacitor tarda el doble en cargarse y descargarse, y el período se duplica."
  },
  {
    "q": "Un 555 astable se alimenta primero con 5 V y luego con 12 V. ¿Cómo cambia la frecuencia?",
    "correct": "Casi no cambia: los umbrales (⅓ y ⅔ V) y la carga escalan juntos con la alimentación.",
    "wrong": [
      "Aumenta más del doble.",
      "Baja a la mitad.",
      "Se anula."
    ],
    "explain": "El tiempo de carga entre ⅓ V y ⅔ V depende de la relación entre ellos, no de V. Por eso el 555 es tan estable frente a la alimentación."
  },
  {
    "q": "Se necesita un tono de unos 1 kHz con un 555 astable y C = 10 nF. ¿Qué valor aproximado tiene R<sub>1</sub> + 2·R<sub>2</sub>?",
    "correct": "Unos 144 kΩ: 1,44 / (1000 · 10⁻⁸).",
    "wrong": [
      "Unos 14,4 kΩ.",
      "Unos 1,44 MΩ.",
      "Unos 144 Ω."
    ],
    "explain": "Se despeja de f = 1,44 / ((R1 + 2R2)·C): R1 + 2R2 = 1,44 / (f·C) = 144 kΩ."
  }
] };
