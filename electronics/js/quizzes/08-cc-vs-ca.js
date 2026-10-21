// Preguntas del capítulo 08-cc-vs-ca.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '08-cc-vs-ca': [
  {
    "q": "Una resistencia se alimenta con corriente alterna. ¿Se calienta?",
    "correct": "Sí: el calor depende de la corriente al cuadrado, que nunca es negativa.",
    "wrong": [
      "No: la corriente promedio es cero, así que no entrega energía.",
      "Solo se calienta en los semiciclos positivos.",
      "Solo se calienta si la frecuencia es muy alta."
    ],
    "explain": "Aunque la corriente promedio sea cero, la potencia instantánea <em>i²·R</em> siempre es positiva: la CA calienta en ambos sentidos."
  },
  {
    "q": "¿Por qué la red eléctrica usa corriente alterna?",
    "correct": "Porque con transformadores se puede subir la tensión para transportar con poca pérdida y bajarla en destino.",
    "wrong": [
      "Porque la alterna no puede producir calor en los cables.",
      "Porque las pilas funcionan con alterna.",
      "Porque la continua no existe en la naturaleza."
    ],
    "explain": "Con tensión alta la corriente es baja para la misma potencia y se pierde menos en forma de calor. El transformador es el que permite cambiar la tensión fácilmente, pero solo funciona con alterna."
  },
  {
    "q": "Un celular funciona con corriente continua, pero lo enchufás a la red alterna. ¿Qué hace el cargador?",
    "correct": "Reduce la tensión, convierte la alterna en continua y la alisa con un filtro.",
    "wrong": [
      "Solo reduce la frecuencia de la red.",
      "Convierte la continua del celular en alterna.",
      "Nada: el celular acepta alterna directamente."
    ],
    "explain": "El cargador baja la tensión (transformador o conmutación), rectifica (un solo sentido) y filtra (capacitor) para entregar CC estable."
  },
  {
    "q": "Una fuente de CA de 10 V de pico y una de CC de 10 V alimentan una misma resistencia. ¿Entregan la misma potencia?",
    "correct": "No: la CA entrega menos, porque su valor eficaz es de unos 7 V.",
    "wrong": [
      "Sí, los 10 V son iguales en ambos casos.",
      "La CA entrega más, porque oscila.",
      "Depende solamente de la frecuencia."
    ],
    "explain": "La CA llega a 10 V solo en los picos; en promedio equivale a 10/√2 ≈ 7,1 V. Para igualar a la CC de 10 V haría falta un pico de unos 14 V."
  },
  {
    "q": "En un cable por el que circula corriente alterna, ¿qué hacen los electrones?",
    "correct": "Oscilan alrededor de su posición, y aun así transportan energía.",
    "wrong": [
      "Avanzan por el cable hasta llegar al aparato.",
      "Se quedan quietos y la energía viaja por el aire.",
      "Se detienen en cada pico de la onda y vuelven al generador."
    ],
    "explain": "La energía se transmite por el campo electromagnético a lo largo del cable; los electrones apenas se desplazan y van y vienen."
  },
  {
    "q": "Un regulador lineal baja de 12 V a 5 V con una carga de 1 A, y se calienta mucho. ¿Por qué?",
    "correct": "Disipa como calor la tensión sobrante: (12 − 5) V · 1 A = 7 W.",
    "wrong": [
      "Porque convierte la continua en alterna.",
      "Porque la carga consume 12 W.",
      "No debería calentarse: el regulador no consume energía."
    ],
    "explain": "Un regulador lineal se comporta como una resistencia en serie que absorbe la diferencia de tensión; con 1 A, esa diferencia se transforma íntegramente en calor."
  },
  {
    "q": "¿Cuál de estas fuentes entrega naturalmente corriente alterna sin necesidad de ningún circuito adicional?",
    "correct": "Una bobina que gira dentro de un campo magnético, porque el flujo que la atraviesa sube y baja.",
    "wrong": [
      "Una pila de zinc y cobre, porque sus electrodos se alternan.",
      "Un panel solar, porque la luz del sol oscila durante el día.",
      "Un módulo termoeléctrico, porque el calor fluye en ambos sentidos."
    ],
    "explain": "Las pilas, los paneles y los módulos termoeléctricos mantienen una polaridad fija: son de continua. La alterna aparece al cambiar el flujo magnético, por ejemplo girando una espira (capítulo 33)."
  }
] };
