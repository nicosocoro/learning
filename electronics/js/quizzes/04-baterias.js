// Preguntas del capítulo 04-baterias.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '04-baterias': [
  {
    "q": "Una pila marca 1,5 V sin carga, pero 1,0 V al conectarle un motorcito. ¿Cómo se explica?",
    "correct": "Al circular corriente, parte de la tensión se pierde en la resistencia interna de la pila.",
    "wrong": [
      "La pila se gastó por completo en ese instante.",
      "El motor genera su propia tensión opuesta de 0,5 V siempre.",
      "Los voltímetros miden mal cuando hay carga."
    ],
    "explain": "Una pila real es una fuente ideal con una resistencia interna en serie: <em>V = E − I·r</em>. Cuanta más corriente, más tensión se pierde adentro."
  },
  {
    "q": "Tenés dos pilas iguales y querés que el aparato funcione más tiempo con la misma tensión. ¿Cómo las conectás?",
    "correct": "En paralelo: la tensión se mantiene y las capacidades se suman.",
    "wrong": [
      "En serie: la tensión se mantiene y las capacidades se suman.",
      "En serie: se duplica la tensión y se duplica la duración.",
      "Da lo mismo: la duración no depende de la conexión."
    ],
    "explain": "En paralelo cada pila aporta la mitad de la corriente, así que el conjunto dura el doble a la misma tensión."
  },
  {
    "q": "Un aparato necesita 3 V y solo tenés pilas de 1,5 V. ¿Qué hacés?",
    "correct": "Conecto dos pilas en serie: las tensiones se suman.",
    "wrong": [
      "Conecto dos pilas en paralelo: las tensiones se suman.",
      "Conecto una sola pila: 1,5 V alcanza siempre.",
      "Conecto tres pilas en paralelo."
    ],
    "explain": "Serie suma tensiones (+ con −); paralelo suma capacidades y mantiene la tensión."
  },
  {
    "q": "¿Por qué la batería de un auto puede arrancar el motor, pero una pila AA no?",
    "correct": "La del auto tiene una resistencia interna muy pequeña y entrega cientos de amperes sin que su tensión caiga.",
    "wrong": [
      "La del auto tiene mucha más tensión que una pila AA.",
      "La pila AA no tiene resistencia interna.",
      "El motor de arranque funciona solo con corriente alterna."
    ],
    "explain": "Con una resistencia interna alta, al pedir mucha corriente casi toda la tensión se pierde adentro. Una pila AA, aun en cortocircuito, entrega apenas unos amperes."
  },
  {
    "q": "Un aparato pasa a consumir el doble de corriente con la misma batería. ¿Qué pasa con la duración?",
    "correct": "Se reduce aproximadamente a la mitad.",
    "wrong": [
      "Se duplica.",
      "No cambia, porque la capacidad es fija.",
      "Se reduce a un cuarto."
    ],
    "explain": "La duración es aproximadamente <em>capacidad / corriente</em>: con el doble de corriente se vacía el doble de rápido."
  },
  {
    "q": "¿Por qué no se deben mezclar pilas nuevas con pilas usadas en un mismo aparato?",
    "correct": "Las usadas tienen menos capacidad y más resistencia interna: se agotan primero y pueden recalentarse o perder líquido.",
    "wrong": [
      "Porque las nuevas cargan a las usadas y las dejan como nuevas.",
      "Porque la tensión de las pilas nuevas es muy distinta de la de las usadas.",
      "No hay ningún problema en mezclarlas."
    ],
    "explain": "En serie circula la misma corriente por todas, así que la pila más gastada limita al conjunto y sufre más: se calienta e incluso puede “descargar” a las otras al invertirse."
  }
] };
