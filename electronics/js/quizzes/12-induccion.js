// Preguntas del capítulo 12-induccion.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '12-induccion': [
  {
    "q": "Un imán potente está completamente quieto dentro de una bobina conectada a un voltímetro. ¿Qué marca el voltímetro?",
    "correct": "Cero: el flujo es grande pero no cambia, y solo el cambio de flujo induce tensión.",
    "wrong": [
      "Una tensión grande, porque el campo es intenso.",
      "Una tensión pequeña pero constante.",
      "Depende de la polaridad del imán."
    ],
    "explain": "La ley de Faraday relaciona la tensión con la <em>rapidez de variación</em> del flujo, no con su valor. Flujo constante significa tensión nula."
  },
  {
    "q": "Mover el imán el doble de rápido a través de la misma bobina, ¿qué efecto tiene sobre la tensión inducida?",
    "correct": "Se duplica, porque el flujo cambia el doble de rápido.",
    "wrong": [
      "No cambia: depende solo del imán.",
      "Se reduce a la mitad.",
      "Se cuadruplica siempre."
    ],
    "explain": "La tensión inducida es proporcional a ΔΦ/Δt. Si el mismo cambio de flujo ocurre en la mitad del tiempo, la tensión es el doble."
  },
  {
    "q": "¿Por qué una bobina de 400 vueltas induce más tensión que una de 100 vueltas en las mismas condiciones?",
    "correct": "Porque cada vuelta induce la misma tensión y las de todas las vueltas se suman.",
    "wrong": [
      "Porque tiene más resistencia.",
      "Porque el imán es más fuerte con más vueltas.",
      "No induce más: la tensión no depende de las vueltas."
    ],
    "explain": "En ε = −N·ΔΦ/Δt, N multiplica el resultado: cada vuelta es una espira atravesada por el mismo flujo y los efectos se acumulan en serie."
  },
  {
    "q": "Acercás el polo norte de un imán a una bobina cerrada. Según la ley de Lenz, ¿qué hace la corriente inducida?",
    "correct": "Crea un campo que se opone al acercamiento: la bobina “empuja” al imán hacia atrás.",
    "wrong": [
      "Crea un campo que atrae al imán y lo ayuda a entrar.",
      "No crea ningún campo.",
      "Crea un campo que acelera el imán."
    ],
    "explain": "Si la corriente inducida ayudara al movimiento se generaría energía de la nada. La oposición obliga a hacer trabajo, y ese trabajo se convierte en energía eléctrica."
  },
  {
    "q": "¿Por qué un imán de neodimio cae lentamente por un tubo de cobre y rápido por un tubo de plástico?",
    "correct": "En el cobre el imán induce corrientes en el tubo, y esas corrientes crean un campo que frena su caída.",
    "wrong": [
      "El cobre es más pesado y arrastra al imán.",
      "El plástico no tiene gravedad.",
      "El cobre atrae al imán como el hierro."
    ],
    "explain": "El cobre conduce, así que el flujo variable induce corrientes que, por la ley de Lenz, se oponen al movimiento. El plástico no conduce y no hay frenado."
  },
  {
    "q": "¿Cómo se relaciona la ley de Faraday con la forma de onda de la tensión de la red?",
    "correct": "En un generador una bobina gira dentro de un campo magnético; el ángulo del flujo cambia continuamente y la tensión resulta senoidal.",
    "wrong": [
      "La red usa pilas muy grandes que oscilan.",
      "El flujo es constante, por eso la tensión es continua.",
      "Es un acuerdo histórico sin relación con la física."
    ],
    "explain": "Al girar la espira, el flujo Φ = B·A·cos θ varía como un coseno, y su derivada (la tensión inducida) como un seno. De ahí la frecuencia de 50 o 60 Hz."
  }
] };
