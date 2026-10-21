// Preguntas del capítulo 33-generador-ca.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '33-generador-ca': [
  {
    "q": "Una espira gira a velocidad constante en un campo magnético uniforme. ¿En qué posición es máxima la tensión inducida?",
    "correct": "Cuando la espira es paralela al campo (flujo nulo): es el momento en que el flujo cambia más rápido.",
    "wrong": [
      "Cuando la espira está de frente al campo (flujo máximo).",
      "Siempre es la misma: depende solo de la velocidad.",
      "Cuando la espira forma 45° con el campo, porque ahí el flujo y su variación son iguales."
    ],
    "explain": "ε = −N·dΦ/dt: la tensión sigue la pendiente del flujo, no su valor. Φ = B·A·cos θ es nulo a 90°, justo donde su curva es más empinada."
  },
  {
    "q": "Al duplicar las revoluciones por minuto del generador, ¿qué les pasa a la tensión pico y a la frecuencia?",
    "correct": "Ambas se duplican.",
    "wrong": [
      "Solo se duplica la tensión; la frecuencia no cambia.",
      "Solo se duplica la frecuencia; la tensión no cambia.",
      "Ambas se multiplican por cuatro."
    ],
    "explain": "Vp = N·B·A·ω es proporcional a ω, y la frecuencia es f = n/60. Girar más rápido cambia el flujo más rápido (más tensión) y completa más ciclos por segundo (más frecuencia)."
  },
  {
    "q": "Una bobina de 100 vueltas y 0,01 m² gira a 3000 rpm en un campo de 0,2 T. ¿Cuánto vale aproximadamente la tensión pico?",
    "correct": "62,8 V.",
    "wrong": [
      "0,2 V.",
      "6,28 V.",
      "314 V."
    ],
    "explain": "ω = 2π·3000/60 = 314 rad/s. Vp = N·B·A·ω = 100 · 0,2 · 0,01 · 314 = 62,8 V. La frecuencia es 3000/60 = 50 Hz."
  },
  {
    "q": "Un generador de dos polos gira a 1500 rpm. ¿Cuál es la frecuencia de la tensión que genera?",
    "correct": "25 Hz, porque da 25 vueltas por segundo y cada vuelta es un ciclo.",
    "wrong": [
      "50 Hz, que es la frecuencia de la red.",
      "1500 Hz, porque gira 1500 veces.",
      "12,5 Hz, porque cada vuelta tiene dos medios ciclos."
    ],
    "explain": "f = n/60 = 1500/60 = 25 Hz. Para generar 50 Hz con dos polos hay que girar a 3000 rpm; con más polos se baja la velocidad (capítulo 35)."
  },
  {
    "q": "¿Qué empuja a los electrones a lo largo del cable en los lados activos de la espira?",
    "correct": "La fuerza magnética sobre cargas que se mueven dentro del campo (q·v×B): es la “fuerza no eléctrica” del generador.",
    "wrong": [
      "Un campo eléctrico que crea el imán en reposo.",
      "El rozamiento de las escobillas con los anillos.",
      "El calor que genera el movimiento del eje."
    ],
    "explain": "Los electrones del cable se mueven con él a través del campo B, y esa velocidad produce una fuerza q·v×B a lo largo del conductor. El trabajo de esa fuerza por unidad de carga es la fem."
  },
  {
    "q": "Con la espira quieta y de frente a un campo muy intenso, ¿qué marca el voltímetro conectado a sus extremos?",
    "correct": "Cero: hay flujo grande pero no cambia, y solo el cambio de flujo induce tensión.",
    "wrong": [
      "Una tensión grande y constante.",
      "Una tensión pequeña que baja con el tiempo.",
      "Depende de la polaridad del imán."
    ],
    "explain": "Es la misma idea del capítulo 12: ε depende de ΔΦ/Δt. Un imán quieto con una espira quieta no genera nada, por intenso que sea el campo."
  },
  {
    "q": "¿Por qué la tensión que sale de un generador sencillo de espira tiene forma de senoide?",
    "correct": "Porque el flujo cambia como cos θ al girar con velocidad uniforme y su derivada es una senoide.",
    "wrong": [
      "Porque las escobillas suavizan la señal.",
      "Porque el campo magnético del imán oscila.",
      "Porque la carga conectada impone esa forma."
    ],
    "explain": "Φ = B·A·cos(ωt) y ε = −N·dΦ/dt = N·B·A·ω·sen(ωt). La forma sale del movimiento circular uniforme, no de la carga."
  }
] };
