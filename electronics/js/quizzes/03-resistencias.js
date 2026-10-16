// Preguntas del capítulo 03-resistencias.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '03-resistencias': [
  {
    "q": "Dos resistencias están en serie con una pila. ¿Qué magnitud es igual en las dos?",
    "correct": "La corriente: hay un solo camino, así que pasa la misma carga por ambas.",
    "wrong": [
      "La tensión entre sus extremos.",
      "La potencia que disipan.",
      "Nada: cada resistencia tiene su propia corriente."
    ],
    "explain": "En serie no hay dónde desviarse: lo que entra por una sale por la otra. La tensión de la pila, en cambio, se reparte."
  },
  {
    "q": "Dos resistencias están en paralelo con una pila. ¿Qué magnitud es igual en las dos?",
    "correct": "La tensión entre sus extremos.",
    "wrong": [
      "La corriente que las atraviesa.",
      "La potencia que disipan.",
      "La resistencia equivalente."
    ],
    "explain": "Ambas están conectadas entre los mismos dos nodos, así que ven la misma diferencia de potencial. La corriente total se reparte entre las ramas."
  },
  {
    "q": "¿Por qué los enchufes de una casa están conectados en paralelo y no en serie?",
    "correct": "Para que cada aparato reciba la tensión completa y funcione sin depender de los demás.",
    "wrong": [
      "Porque en paralelo circula menos corriente por el cable.",
      "Porque en serie los aparatos consumirían más.",
      "Porque el paralelo es más barato de instalar."
    ],
    "explain": "En serie la tensión se repartiría entre los aparatos y, si uno se apagara, se cortaría el circuito de todos."
  },
  {
    "q": "Agregás una resistencia más en paralelo con las que ya había. ¿Qué pasa con la resistencia equivalente?",
    "correct": "Disminuye: hay un camino adicional para la corriente.",
    "wrong": [
      "Aumenta, porque hay más resistencias.",
      "No cambia.",
      "Se vuelve infinita."
    ],
    "explain": "Cada rama nueva deja pasar más corriente con la misma tensión, lo que equivale a una resistencia total menor que cualquiera de las ramas."
  },
  {
    "q": "En un divisor de tensión de dos resistencias en serie, la de abajo es mucho mayor que la de arriba. ¿Dónde cae la mayor parte de la tensión?",
    "correct": "Sobre la resistencia mayor.",
    "wrong": [
      "Sobre la resistencia menor.",
      "Se reparte siempre en partes iguales.",
      "Sobre ninguna: la tensión se mantiene en la fuente."
    ],
    "explain": "Por ambas pasa la misma corriente, y la caída es <em>I·R</em>: la resistencia más grande se lleva la mayor parte de la tensión."
  },
  {
    "q": "Por un nodo entran 5 mA por un cable y salen 2 mA por otro. Hay un tercer cable conectado. ¿Qué ocurre en él?",
    "correct": "Salen 3 mA por el tercer cable: lo que entra tiene que salir, porque la carga no se acumula en la unión.",
    "wrong": [
      "Entran 3 mA por el tercer cable.",
      "No circula corriente por él.",
      "Se acumulan 3 mA en el nodo."
    ],
    "explain": "Es la ley de los nodos de Kirchhoff: la suma de corrientes que entran en un punto es igual a la suma de las que salen."
  },
  {
    "q": "¿Por qué un cortocircuito es peligroso, incluso con una fuente de baja tensión?",
    "correct": "La resistencia es casi nula, así que la corriente se vuelve enorme (solo la limita la fuente) y el calor I²·R recalienta cables y fuente.",
    "wrong": [
      "Porque la tensión se multiplica por cada cable.",
      "Porque los cables pelados atraen la corriente de otros circuitos.",
      "No es peligroso si la tensión es menor a 12 V."
    ],
    "explain": "Con I = V/R, cuando R tiende a cero la corriente se dispara. La energía no tiene a dónde ir más que a calentar los conductores y la propia fuente."
  }
] };
