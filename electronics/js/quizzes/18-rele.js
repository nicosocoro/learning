// Preguntas del capítulo 18-rele.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '18-rele': [
  {
    "q": "¿Qué ventaja principal tiene un relé electromecánico sobre un transistor?",
    "correct": "Aísla eléctricamente el circuito de control del circuito de la carga y sirve para corriente alterna o continua.",
    "wrong": [
      "Conmuta mucho más rápido.",
      "Consume menos corriente de control.",
      "No se desgasta nunca."
    ],
    "explain": "Los contactos están separados de la bobina: no hay conexión eléctrica entre control y carga. A cambio es lento, se desgasta y consume más."
  },
  {
    "q": "La lámpara está conectada entre COM y NA. ¿Cuándo se enciende?",
    "correct": "Cuando la bobina está energizada: ahí COM se une con NA.",
    "wrong": [
      "Cuando la bobina no tiene corriente.",
      "Siempre.",
      "Nunca, NA significa «no conectado»."
    ],
    "explain": "NA significa «normalmente abierto»: está abierto en reposo y se cierra al energizar la bobina."
  },
  {
    "q": "Un relé de 5 V tiene bobina de 100 Ω. ¿Cuánta corriente consume la bobina?",
    "correct": "50 mA: I = V / R = 5 / 100.",
    "wrong": [
      "5 mA.",
      "500 mA.",
      "20 mA."
    ],
    "explain": "Es la ley de Ohm aplicada a la bobina. 50 mA es demasiado para un pin de microcontrolador, por eso se usa un transistor."
  },
  {
    "q": "Un relé de 12 V cierra con 9 V (75 %). Una vez cerrado, la tensión baja a 4 V. ¿Qué pasa?",
    "correct": "Se mantiene cerrado, porque la tensión de apertura es bastante menor (histéresis).",
    "wrong": [
      "Se abre inmediatamente, porque 4 V es menos de 9 V.",
      "Se quema la bobina.",
      "Se abre y vuelve a cerrar sin parar."
    ],
    "explain": "Con el relé cerrado, el entrehierro es menor y hace falta menos fuerza magnética para sostenerlo. Solo abre al bajar del umbral de apertura (≈ 10–20 %)."
  },
  {
    "q": "¿Por qué un relé que aguanta 10 A en 250 V de alterna soporta mucho menos tensión en continua?",
    "correct": "Porque en alterna el arco se apaga solo al pasar la corriente por cero; en continua el arco persiste y quema los contactos.",
    "wrong": [
      "Porque la continua tiene menos energía.",
      "Porque la alterna tiene más frecuencia.",
      "Porque los contactos no distinguen entre las dos."
    ],
    "explain": "Al abrir los contactos con corriente se forma un arco. En CA se extingue 100 veces por segundo; en CC no, y la capacidad nominal en CC es mucho menor."
  },
  {
    "q": "¿Por qué no se conecta la bobina de un relé directamente al pin de un microcontrolador?",
    "correct": "Porque la bobina pide más corriente de la que entrega un pin y, al apagarse, genera un pico de tensión que puede dañarlo.",
    "wrong": [
      "Porque la bobina funciona solo con alterna.",
      "Porque el pin no tiene suficiente tensión para cerrar los contactos mecánicos.",
      "No hay ningún problema: se puede conectar directo."
    ],
    "explain": "Se usa un transistor que maneje la corriente de la bobina y un diodo en paralelo para absorber el pico de la autoinducción."
  }
] };
