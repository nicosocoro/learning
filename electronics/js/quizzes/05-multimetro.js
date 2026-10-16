// Preguntas del capítulo 05-multimetro.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '05-multimetro': [
  {
    "q": "Querés medir la tensión sobre un componente. ¿Cómo conectás el multímetro?",
    "correct": "En paralelo con el componente, sin abrir el circuito.",
    "wrong": [
      "En serie, abriendo el circuito.",
      "Solo con el circuito apagado.",
      "Entre la fuente y tierra, siempre."
    ],
    "explain": "El voltímetro compara el potencial entre dos puntos, y por eso se apoya en los dos extremos. Tiene una resistencia interna enorme y casi no altera el circuito."
  },
  {
    "q": "Conectás un amperímetro en paralelo con una resistencia. ¿Qué pasa?",
    "correct": "Como casi no tiene resistencia, la cortocircuita: circula mucha corriente y puede quemarse el fusible.",
    "wrong": [
      "Mide correctamente la corriente de esa resistencia.",
      "No pasa nada: solo marca cero.",
      "La resistencia se calienta menos."
    ],
    "explain": "Para medir corriente, el instrumento debe estar en <em>serie</em>, de modo que toda la corriente pase por él. En paralelo crea un camino casi sin resistencia."
  },
  {
    "q": "¿Por qué la resistencia se mide con el circuito sin energía?",
    "correct": "Porque el multímetro usa su propia corriente de prueba, y cualquier otra fuente falsea la lectura.",
    "wrong": [
      "Porque la resistencia cambia cuando hay corriente.",
      "Porque con tensión el multímetro marca siempre cero.",
      "Porque los resistores solo existen apagados."
    ],
    "explain": "El óhmetro mide aplicando una pequeña tensión propia y viendo cuánta corriente circula. Una fuente externa distorsiona esa medición y puede dañar el aparato."
  },
  {
    "q": "Medís una pila y el display marca −1,5 V. ¿Qué significa?",
    "correct": "Las puntas están invertidas: la roja está en el polo negativo.",
    "wrong": [
      "La pila está descargada.",
      "La pila está conectada al revés en el aparato.",
      "El multímetro está roto."
    ],
    "explain": "El signo indica la polaridad relativa de las puntas. La magnitud, 1,5 V, es correcta; solo cambió el orden de la punta roja y la negra."
  },
  {
    "q": "Querés saber cuánta corriente consume un LED. ¿Cómo lo medís?",
    "correct": "Abro el circuito e intercalo el multímetro en serie, en modo corriente.",
    "wrong": [
      "Apoyo las puntas en los dos extremos del LED, en modo corriente.",
      "Mido la tensión de la pila y la divido por 2.",
      "Lo desconecto y mido su resistencia."
    ],
    "explain": "La corriente se mide “por dentro” del circuito: hay que abrirlo y que toda la corriente atraviese el instrumento."
  },
  {
    "q": "Medís la tensión en el punto medio de un divisor de dos resistores de 1 MΩ con un multímetro de 10 MΩ de entrada. ¿Qué pasa con la lectura?",
    "correct": "Marca algo menos que el valor real: la resistencia interna del multímetro queda en paralelo con una de las resistencias y altera el divisor.",
    "wrong": [
      "Marca exactamente el valor real, porque un voltímetro no afecta al circuito.",
      "Marca algo más que el valor real.",
      "Marca siempre cero."
    ],
    "explain": "Un voltímetro real no tiene resistencia infinita. Cuando se mide sobre resistencias comparables a la suya, el instrumento “carga” el circuito y cambia lo que mide."
  }
] };
