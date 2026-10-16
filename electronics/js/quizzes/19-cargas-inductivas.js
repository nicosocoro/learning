// Preguntas del capítulo 19-cargas-inductivas.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '19-cargas-inductivas': [
  {
    "q": "¿Por qué aparece un pico de tensión al apagar un transistor que alimenta la bobina de un relé?",
    "correct": "Porque la bobina se opone al cambio brusco de corriente y genera la tensión necesaria (V = L·ΔI/Δt) para mantenerla.",
    "wrong": [
      "Porque el transistor se sobrecalienta.",
      "Porque la fuente tiene un defecto.",
      "Porque el diodo del transistor se invierte."
    ],
    "explain": "La energía almacenada en el campo magnético tiene que descargarse. Con una variación de corriente muy rápida, la autoinducción produce tensiones enormes."
  },
  {
    "q": "¿Cómo se conecta el diodo de protección de una bobina?",
    "correct": "En paralelo con la bobina, con el cátodo (la barra) del lado de +V.",
    "wrong": [
      "En serie con la bobina, con el ánodo hacia +V.",
      "En paralelo, con el ánodo hacia +V (al derecho).",
      "Entre la base del transistor y masa."
    ],
    "explain": "Hacia +V el diodo queda en inverso mientras el transistor conduce (no molesta) y conduce solo cuando la bobina invierte su tensión al apagarse."
  },
  {
    "q": "Un diodo de protección tiene un inconveniente en un relé. ¿Cuál?",
    "correct": "Retrasa la apertura del relé, porque la corriente de la bobina decae más lentamente.",
    "wrong": [
      "Impide que el relé cierre.",
      "Consume mucha corriente cuando el relé está cerrado.",
      "Aumenta el pico de tensión."
    ],
    "explain": "La corriente que circula por el lazo bobina-diodo decae con τ = L/R. El relé suelta recién cuando cae por debajo de su umbral de apertura."
  },
  {
    "q": "Se coloca el diodo de protección con los terminales al revés (ánodo hacia +V). ¿Qué ocurre al encender el transistor?",
    "correct": "Queda un cortocircuito de +V a masa a través del diodo y el transistor: el diodo o el transistor se queman.",
    "wrong": [
      "No pasa nada: el diodo es simétrico.",
      "El relé cierra más rápido.",
      "Solo cambia el sentido de giro del motor."
    ],
    "explain": "Un diodo al derecho entre +V y el colector conduce apenas el transistor tira de ese punto a masa: la corriente solo la limita el cable."
  },
  {
    "q": "Un puente H se usa para…",
    "correct": "Invertir el sentido de giro de un motor de corriente continua.",
    "wrong": [
      "Convertir alterna en continua.",
      "Amplificar una señal de audio.",
      "Aumentar la corriente de una batería."
    ],
    "explain": "Cerrando las dos diagonales del puente se alimenta al motor en un sentido o en el contrario. No se deben cerrar nunca los dos transistores de un mismo lado."
  },
  {
    "q": "Se quiere encender una lámpara de 220 V desde un microcontrolador, con aislación total entre ambos. ¿Qué conviene?",
    "correct": "Un relé (o un relé de estado sólido) manejado por el microcontrolador mediante un transistor.",
    "wrong": [
      "Un único BJT conectado directamente a los 220 V.",
      "Un MOSFET en la salida de la red de 220 V alterna.",
      "Un diodo en serie con la lámpara."
    ],
    "explain": "Los contactos del relé están aislados de la bobina y soportan la red. Los transistores comunes no aguantan 220 V alterna y no aíslan."
  }
] };
