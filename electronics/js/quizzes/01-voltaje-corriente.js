// Preguntas del capítulo 01-voltaje-corriente.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '01-voltaje-corriente': [
  {
    "q": "Un punto A está a 5 V y un punto B también está a 5 V. ¿Qué pasa con las cargas entre ellos?",
    "correct": "No hay movimiento neto: sin diferencia de potencial no hay “rampa” por la que caer.",
    "wrong": [
      "Fluyen de A hacia B, porque los dos puntos tienen tensión.",
      "Fluyen más rápido que si ambos estuvieran a 0 V.",
      "Se acumulan en B hasta que sube su tensión."
    ],
    "explain": "El voltaje es una <em>diferencia</em> entre dos puntos. Dos puntos al mismo potencial son como dos puntos a la misma altura: la bola no rueda."
  },
  {
    "q": "Dos cargas iguales caen, una por una diferencia de potencial de 2 V y otra por una de 6 V. ¿Cuál entrega más energía?",
    "correct": "La de 6 V: cada coulomb entrega más energía cuanto mayor es la diferencia de potencial.",
    "wrong": [
      "Las dos entregan lo mismo, porque la carga es igual.",
      "La de 2 V, porque cae más despacio.",
      "No se puede saber sin conocer el tiempo que tardan."
    ],
    "explain": "La energía por carga es <em>W = q·ΔV</em>: depende de la carga y de cuánto “cae” en potencial, no del tiempo."
  },
  {
    "q": "¿Qué describe la corriente eléctrica?",
    "correct": "Cuánta carga pasa por un punto del conductor cada segundo.",
    "wrong": [
      "Cuánta energía lleva cada carga.",
      "La diferencia de altura entre dos puntos.",
      "La fuerza con que se repelen las cargas."
    ],
    "explain": "La corriente es un <em>caudal</em> de carga (coulombs por segundo). La energía por carga es el voltaje, otra magnitud."
  },
  {
    "q": "En un cable de cobre, ¿en qué sentido se mueven los electrones respecto de la corriente convencional?",
    "correct": "En sentido contrario: la convención sigue el recorrido de cargas positivas imaginarias.",
    "wrong": [
      "En el mismo sentido, siempre.",
      "No se mueven; solo se mueven los protones.",
      "Depende de si la fuente es una pila o la red."
    ],
    "explain": "Los electrones tienen carga negativa, así que van al revés de la corriente convencional. La convención se fijó antes de conocer al electrón y sigue siendo útil."
  },
  {
    "q": "Duplicás la cantidad de cargas lanzadas por segundo, sin cambiar la diferencia de potencial. ¿Qué ocurre?",
    "correct": "La corriente y la potencia se duplican; la energía de cada carga no cambia.",
    "wrong": [
      "La energía de cada carga se duplica.",
      "La corriente no cambia, solo la tensión.",
      "La diferencia de potencial se duplica."
    ],
    "explain": "Pasan el doble de coulombs por segundo (corriente doble) y cada uno entrega lo mismo (<em>q·ΔV</em>), por eso la potencia <em>P = I·ΔV</em> también se duplica."
  }
] };
