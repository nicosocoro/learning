// Preguntas del capítulo 02-ley-de-ohm.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '02-ley-de-ohm': [
  {
    "q": "Mantenés la misma pila y reemplazás una resistencia por otra del doble de valor. ¿Qué pasa con la corriente?",
    "correct": "Se reduce a la mitad.",
    "wrong": [
      "Se duplica.",
      "No cambia, porque la tensión es la misma.",
      "Se cuadruplica."
    ],
    "explain": "Con la misma tensión, más resistencia significa menos corriente: <em>I = V/R</em>. Doble R, mitad de I."
  },
  {
    "q": "Duplicás la tensión aplicada a un resistor. ¿Qué pasa con el calor que disipa?",
    "correct": "Se cuadruplica: la corriente se duplica y además cada carga cae el doble de tensión.",
    "wrong": [
      "Se duplica.",
      "No cambia, porque la resistencia es la misma.",
      "Se reduce a la mitad."
    ],
    "explain": "La potencia depende de la tensión y de la corriente a la vez (<em>P = V·I = V²/R</em>); si las dos se duplican, la potencia se multiplica por 4."
  },
  {
    "q": "Conectás un LED directamente a una fuente, sin resistor, y se quema. ¿Cuál es la causa?",
    "correct": "Nada limita la corriente: toda la tensión sobrante queda sin dónde “caer” y la corriente se dispara.",
    "wrong": [
      "El LED necesita corriente alterna.",
      "La fuente tenía poca tensión.",
      "El LED tiene resistencia infinita."
    ],
    "explain": "Un LED conduce muy bien una vez que enciende. El resistor en serie absorbe la tensión sobrante y fija la corriente a un valor seguro."
  },
  {
    "q": "Un cable “conduce muy bien”, pero se calienta cuando pasa mucha corriente. ¿Por qué?",
    "correct": "Tiene una resistencia pequeña pero no nula, y el calor crece con el cuadrado de la corriente.",
    "wrong": [
      "Los cables siempre se calientan, sin importar la corriente.",
      "Porque la corriente se frena en el cobre y deja de circular.",
      "Solo se calienta si la tensión es alterna."
    ],
    "explain": "Aunque R sea chica, el calor es <em>I²·R</em>: al duplicar la corriente, se pierde cuatro veces más calor en el cable."
  },
  {
    "q": "Un circuito disipa 1 W en un resistor. ¿Cuál de estos resistores de 100 Ω es seguro?",
    "correct": "El de 5 W: soporta más que el 1 W que tiene que disipar.",
    "wrong": [
      "El de ¼ W: es el más económico y alcanza.",
      "Cualquiera, porque la potencia solo depende del valor en ohms.",
      "Ninguno: los resistores no disipan potencia."
    ],
    "explain": "La potencia nominal indica cuánto calor aguanta el resistor. Un resistor de ¼ W sometido a 1 W se sobrecalienta y se daña."
  },
  {
    "q": "Dos cables de cobre tienen el mismo largo, pero uno es de 1 mm² y el otro de 4 mm² de sección. ¿Cuál tiene menos resistencia?",
    "correct": "El de 4 mm²: más sección ofrece más caminos paralelos para las cargas.",
    "wrong": [
      "El de 1 mm²: es más fino y concentra la corriente.",
      "Los dos tienen la misma, porque son del mismo material.",
      "Depende solo de la tensión aplicada."
    ],
    "explain": "La resistencia es R = ρ·L/A: a igual material y largo, duplicar la sección reduce la resistencia a la mitad."
  }
] };
