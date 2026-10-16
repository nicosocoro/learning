// Preguntas del capítulo 13-transformadores.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '13-transformadores': [
  {
    "q": "¿Funciona un transformador conectado a una batería (corriente continua)?",
    "correct": "No: el flujo magnético constante no induce tensión en el secundario.",
    "wrong": [
      "Sí, con la misma relación de tensión.",
      "Sí, pero con la mitad de potencia.",
      "Solo si se invierte la polaridad cada tanto con la mano."
    ],
    "explain": "Hace falta un flujo que <em>cambie</em> en el tiempo para inducir tensión. Con CC solo habría un breve pulso al conectar o desconectar."
  },
  {
    "q": "El secundario tiene la mitad de vueltas que el primario. En un transformador ideal, ¿qué ocurre?",
    "correct": "La tensión se reduce a la mitad y la corriente se duplica.",
    "wrong": [
      "La tensión se duplica y la corriente se reduce a la mitad.",
      "Se reducen a la mitad la tensión y la corriente.",
      "Tanto la tensión como la corriente se mantienen iguales."
    ],
    "explain": "La relación de tensiones es la de las vueltas, y la potencia se conserva: si la tensión baja a la mitad, la corriente debe subir al doble."
  },
  {
    "q": "¿Por qué la energía eléctrica se transporta a muy alta tensión?",
    "correct": "Porque con tensión alta la corriente es menor para la misma potencia, y las pérdidas por calor en los cables bajan mucho.",
    "wrong": [
      "Porque la alta tensión hace que los cables resistan más.",
      "Porque así se genera más energía.",
      "Porque los electrones viajan más rápido."
    ],
    "explain": "Las pérdidas son <em>I²·R</em>. Con una tensión 10 veces mayor, la corriente es 10 veces menor y las pérdidas son 100 veces menores."
  },
  {
    "q": "En un transformador real, ¿cómo se compara la potencia de salida con la de entrada?",
    "correct": "La de salida es algo menor: parte se pierde como calor en el núcleo y en los bobinados.",
    "wrong": [
      "Es mayor, porque el transformador amplifica.",
      "Son exactamente iguales siempre.",
      "No hay relación entre ambas."
    ],
    "explain": "El transformador no crea energía y tiene pérdidas; por eso el rendimiento es alto pero inferior al 100 %."
  },
  {
    "q": "Bajás la resistencia de la carga del secundario, de modo que pide más corriente. ¿Qué pasa en el primario?",
    "correct": "Toma más corriente de la red, aunque nadie lo haya tocado.",
    "wrong": [
      "Nada: el primario no se entera de lo que pasa en el secundario.",
      "Toma menos corriente de la red.",
      "Se desconecta automáticamente."
    ],
    "explain": "Las dos bobinas están acopladas por el flujo magnético: si el secundario entrega más potencia, el primario tiene que absorber más."
  },
  {
    "q": "¿Por qué el núcleo de un transformador se arma con láminas finas aisladas entre sí, en lugar de un bloque macizo de hierro?",
    "correct": "Para cortar los caminos de las corrientes parásitas inducidas en el núcleo, que lo calentarían y desperdiciarían energía.",
    "wrong": [
      "Para que el núcleo pese menos.",
      "Porque el hierro macizo no conduce el flujo magnético.",
      "Para que el secundario quede conectado eléctricamente al primario."
    ],
    "explain": "El flujo variable induce corrientes también en el hierro (ley de Faraday). Las láminas aisladas las obligan a circular por trayectos muy pequeños y se pierde mucho menos energía."
  },
  {
    "q": "Un transformador pensado para 220 V alterna se conecta por error a una batería de continua de 220 V. ¿Qué es lo más probable que pase?",
    "correct": "El primario se recalienta y puede quemarse: sin variación de flujo no hay tensión opuesta que limite la corriente, y solo lo limita la resistencia del alambre.",
    "wrong": [
      "Funciona normalmente, pero con menos potencia.",
      "El secundario entrega una tensión continua mayor.",
      "No pasa nada: la continua y la alterna se comportan igual."
    ],
    "explain": "En alterna, la tensión inducida en el propio primario limita la corriente a unas decenas de mA. Con continua esa tensión no aparece y la corriente es enorme."
  }
] };
