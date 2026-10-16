// Preguntas del capítulo 06-capacitores-rc.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '06-capacitores-rc': [
  {
    "q": "Un capacitor descargado se conecta a una fuente a través de una resistencia. ¿Cuándo es máxima la corriente?",
    "correct": "Al inicio, cuando el capacitor está vacío y toda la tensión cae sobre la resistencia.",
    "wrong": [
      "Al final, cuando el capacitor está lleno.",
      "A la mitad del proceso.",
      "Es constante durante toda la carga."
    ],
    "explain": "A medida que el capacitor se carga, su propia tensión se opone a la de la fuente y deja menos tensión para la resistencia: la corriente decae."
  },
  {
    "q": "Duplicás el valor de R en un circuito RC. ¿Qué cambia?",
    "correct": "Se carga más lento (la constante de tiempo se duplica), pero termina en la misma tensión.",
    "wrong": [
      "Se carga más rápido y llega a una tensión mayor.",
      "Se carga a la misma velocidad pero con menos energía.",
      "No cambia nada."
    ],
    "explain": "La resistencia limita la corriente y por lo tanto la rapidez, pero el valor final lo fija la fuente."
  },
  {
    "q": "Pasaron cinco constantes de tiempo desde que se empezó a cargar el capacitor. ¿Cómo está?",
    "correct": "Prácticamente cargado: la corriente ya casi se anuló.",
    "wrong": [
      "A la mitad de su carga.",
      "Totalmente descargado otra vez.",
      "Recién empezando a cargarse."
    ],
    "explain": "A 5τ falta menos del 1 % para llegar al valor final. En la práctica se considera terminado el proceso."
  },
  {
    "q": "¿Por qué los electrones no cruzan un capacitor?",
    "correct": "Entre las placas hay un aislante: las cargas se acumulan en las placas y crean un campo eléctrico entre ellas.",
    "wrong": [
      "Porque los electrones son demasiado lentos.",
      "Porque el capacitor está hecho de un conductor perfecto.",
      "Sí cruzan, pero pierden energía."
    ],
    "explain": "El capacitor guarda energía en el campo entre las placas. En el circuito parece que “pasa” corriente porque una placa se llena y la otra se vacía."
  },
  {
    "q": "¿Por qué un flash de cámara usa un capacitor en lugar de alimentar la lámpara directamente con la pila?",
    "correct": "La pila no puede entregar de golpe tanta energía; el capacitor la acumula lentamente y la libera en un instante.",
    "wrong": [
      "Porque el capacitor aumenta la energía total almacenada.",
      "Porque la lámpara solo funciona con corriente alterna.",
      "Porque el capacitor no necesita cargarse."
    ],
    "explain": "Un capacitor desacopla “cuánto tarda en cargarse” de “cuán rápido se descarga”. Se carga de a poco y descarga mucha potencia en muy poco tiempo."
  },
  {
    "q": "¿Por qué un capacitor “bloquea” la corriente continua pero deja pasar la alterna?",
    "correct": "Con continua se carga una vez y deja de circular corriente; con alterna se carga y descarga continuamente, así que hay corriente de ida y vuelta.",
    "wrong": [
      "Porque los electrones atraviesan el aislante solo cuando la tensión cambia de signo.",
      "Porque con alterna la tensión es mayor.",
      "En realidad, bloquea las dos igual."
    ],
    "explain": "La corriente “a través” del capacitor es en realidad su carga y descarga. Cuanto más rápido cambia la tensión (mayor frecuencia), más corriente circula; con continua no hay cambio."
  },
  {
    "q": "Conectás dos capacitores en paralelo. ¿Qué pasa con la capacidad total?",
    "correct": "Se suma: equivale a placas de mayor área.",
    "wrong": [
      "Disminuye, como pasa con las resistencias en paralelo.",
      "No cambia.",
      "Se reduce a la mitad de la menor."
    ],
    "explain": "En paralelo cada capacitor se carga a la misma tensión y almacena su propia carga; la carga total es la suma. Por eso las capacidades suman (al revés que las resistencias)."
  }
] };
