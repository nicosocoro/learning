// Preguntas del capítulo 15-transistor-interruptor.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '15-transistor-interruptor': [
  {
    "q": "Un transistor se usa como interruptor para encender una lámpara. ¿En qué dos regiones debe trabajar?",
    "correct": "En corte (apagado) y en saturación (encendido), evitando la zona intermedia.",
    "wrong": [
      "Siempre en la zona activa, a medio camino.",
      "En corte y en la zona activa.",
      "Solo en saturación, aunque la lámpara esté apagada."
    ],
    "explain": "En corte y saturación la potencia que disipa el transistor es pequeña. En la zona activa, con corriente y tensión a la vez, se calienta."
  },
  {
    "q": "¿Por qué se calcula la corriente de base con la β mínima de la hoja de datos y con un margen de 2 a 10 veces?",
    "correct": "Para que el transistor siga saturado aunque su β real sea menor o cambie con la temperatura.",
    "wrong": [
      "Porque la β mínima es la que siempre tiene el transistor.",
      "Porque más corriente de base hace brillar más la lámpara.",
      "Para protegerse de picos de la red."
    ],
    "explain": "La β real varía mucho. Con margen, el transistor se satura en cualquier ejemplar y la corriente de colector queda fijada por la carga, no por β."
  },
  {
    "q": "Con una señal de 5 V, ¿qué pasa si se conecta la base directamente al pin, sin resistor?",
    "correct": "La corriente de base solo la limita la fuente y puede quemar el pin o el transistor: la juntura base-emisor es un diodo.",
    "wrong": [
      "Nada: el transistor se protege solo.",
      "El transistor se satura mejor, sin riesgo.",
      "El transistor queda en corte."
    ],
    "explain": "Con unos 0,7 V entre base y emisor la juntura conduce. Todo el resto de la tensión debe caer sobre un resistor que fije la corriente."
  },
  {
    "q": "Una lámpara toma 100 mA; el transistor tiene β mínima de 100 y se usa un factor de saturación de 2, con señal de 5 V. ¿Qué resistor de base conviene?",
    "correct": "Unos 2 kΩ: I<sub>B</sub> = 2 mA y R<sub>B</sub> = (5 − 0,7) / 2 mA ≈ 2,1 kΩ, que se redondea a 2 kΩ.",
    "wrong": [
      "Unos 50 Ω.",
      "Unos 100 kΩ.",
      "No hace falta resistor."
    ],
    "explain": "La corriente de base mínima es 100 mA / 100 = 1 mA; con factor 2 son 2 mA. El resistor absorbe 4,3 V: 4,3 / 2 mA ≈ 2,1 kΩ."
  },
  {
    "q": "Si el resistor de base es demasiado grande, ¿qué ocurre con el transistor?",
    "correct": "Queda en la zona activa, entrega menos corriente de la esperada y se calienta.",
    "wrong": [
      "Se satura todavía más.",
      "Pasa al corte y se enfría.",
      "Se comporta como un interruptor perfecto."
    ],
    "explain": "Con poca corriente de base, I<sub>C</sub> = β · I<sub>B</sub> es menor que la que pide la carga: queda tensión entre colector y emisor, y esa tensión por la corriente es calor."
  },
  {
    "q": "El microcontrolador y la fuente de la lámpara no comparten el 0 V. ¿Qué pasa?",
    "correct": "No funciona: la corriente de base no tiene camino de retorno y el transistor no conduce de forma fiable.",
    "wrong": [
      "Funciona igual, con mayor rendimiento.",
      "Funciona pero la lámpara brilla menos.",
      "Se quema inmediatamente el transistor."
    ],
    "explain": "El emisor es el punto de referencia de la base. Las dos fuentes tienen que compartir la masa para que la tensión base-emisor tenga sentido."
  }
] };
