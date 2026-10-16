// Preguntas del capítulo 14-transistor-bjt.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '14-transistor-bjt': [
  {
    "q": "Un transistor NPN tiene 0 V entre base y emisor. ¿En qué región está?",
    "correct": "En corte: no circula corriente de base, y casi no circula corriente de colector.",
    "wrong": [
      "En saturación: conduce todo lo que puede.",
      "En la zona activa, amplificando muy poco.",
      "Conduce solo si V<sub>CE</sub> es grande."
    ],
    "explain": "Sin unos 0,6–0,7 V entre base y emisor, la juntura base-emisor no conduce, no hay corriente de base y el transistor se comporta como un interruptor abierto."
  },
  {
    "q": "Un transistor de β = 100 recibe una corriente de base de 0,2 mA y está en la zona activa. ¿Cuánto vale la corriente de colector?",
    "correct": "20 mA.",
    "wrong": [
      "0,2 mA.",
      "2 mA.",
      "200 mA."
    ],
    "explain": "En zona activa I<sub>C</sub> = β · I<sub>B</sub> = 100 · 0,2 mA = 20 mA."
  },
  {
    "q": "Con V<sub>CC</sub> = 12 V y R<sub>C</sub> = 1,2 kΩ se le pide al transistor más corriente de base de la necesaria. ¿Qué pasa con la corriente de colector?",
    "correct": "Se queda en unos 9,8 mA, que es lo máximo que el circuito puede dar, y V<sub>CE</sub> cae a unos 0,2 V.",
    "wrong": [
      "Sigue creciendo en proporción a β · I<sub>B</sub>.",
      "Se anula, porque el transistor se bloquea.",
      "Se invierte y circula del emisor al colector."
    ],
    "explain": "Con I<sub>C,sat</sub> = (12 − 0,2) / 1,2 kΩ ≈ 9,8 mA no queda tensión para empujar más corriente: el transistor se satura y la base ya no manda."
  },
  {
    "q": "¿Por qué un buen diseño no debe depender del valor exacto de β?",
    "correct": "Porque β varía mucho entre ejemplares del mismo modelo y con la temperatura y la corriente.",
    "wrong": [
      "Porque β siempre vale exactamente 100.",
      "Porque β no existe en los transistores reales.",
      "Porque β cambia solo cuando se cambia R<sub>C</sub>."
    ],
    "explain": "La hoja de datos da un rango amplio (por ejemplo 100–300). Se diseña para que funcione con el peor caso, por ejemplo saturando el transistor con margen."
  },
  {
    "q": "¿Qué dispositivo del capítulo 7 se parece a la unión base-emisor de un transistor?",
    "correct": "Un diodo de silicio: conduce a partir de unos 0,7 V y no conduce en inverso.",
    "wrong": [
      "Un capacitor: se carga con la corriente de base.",
      "Un resistor: su caída es proporcional a la corriente.",
      "Un transformador: aísla la base del emisor."
    ],
    "explain": "La unión base-emisor es una juntura P-N como la de un diodo, y por eso exige alrededor de 0,7 V para empezar a conducir."
  },
  {
    "q": "¿Por qué casi todos los electrones que entran por el emisor llegan al colector y no salen por la base?",
    "correct": "Porque la base es muy fina y el colector tiene una tensión mayor que los atrae.",
    "wrong": [
      "Porque la base es de metal y los frena.",
      "Porque los electrones no pueden salir por la base ni aunque quieran.",
      "Porque la base está desconectada del circuito."
    ],
    "explain": "En una base finísima casi no hay tiempo para que los electrones se recombinen o salgan, y el campo del colector se los lleva. Esa pequeña fracción que sí sale por la base es I<sub>B</sub>."
  }
] };
