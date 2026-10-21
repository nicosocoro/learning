// Preguntas del capítulo 31-solar.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '31-solar': [
  {
    "q": "En una celda solar, ¿qué separa los pares electrón-hueco que crea la luz?",
    "correct": "El campo eléctrico interno de la unión P-N.",
    "wrong": [
      "Un campo magnético que aparece al iluminarla.",
      "La resistencia del silicio, que frena a los huecos.",
      "El calor que produce la luz al absorberse."
    ],
    "explain": "La unión P-N tiene un campo interno que empuja electrones hacia el lado N y huecos hacia el P. Es el mismo campo que hace que un diodo conduzca en un solo sentido."
  },
  {
    "q": "Un panel de 36 celdas en serie, ¿cuánto da aproximadamente en vacío a pleno sol?",
    "correct": "Unos 21 V, porque las tensiones de las celdas (≈ 0,6 V cada una) se suman.",
    "wrong": [
      "Unos 0,6 V, porque la tensión depende de una sola celda.",
      "Unos 216 V, porque cada celda da 6 V.",
      "Unos 5 V, porque se promedian."
    ],
    "explain": "En serie las tensiones se suman: 36 · 0,6 V ≈ 21,6 V. Por eso un panel “de 12 V” rinde unos 18 V en su mejor punto y puede cargar una batería de 12 V."
  },
  {
    "q": "Si la luz que recibe un panel baja a la mitad, ¿qué pasa con su corriente de cortocircuito y con su tensión en vacío?",
    "correct": "La corriente baja casi a la mitad; la tensión cae muy poco.",
    "wrong": [
      "La tensión baja a la mitad; la corriente casi no cambia.",
      "Las dos bajan a la mitad.",
      "No cambia ninguna de las dos."
    ],
    "explain": "La corriente es proporcional al número de fotones que llegan. La tensión depende del logaritmo de la luz: se resiente poco. Por eso un panel sigue dando tensión con cielo nublado, pero mucha menos potencia."
  },
  {
    "q": "En un día muy caluroso el panel se calienta mucho. ¿Qué ocurre con su potencia máxima?",
    "correct": "Baja, porque la tensión de cada celda disminuye con la temperatura.",
    "wrong": [
      "Sube, porque hay más energía térmica disponible.",
      "No cambia, porque solo importa la luz.",
      "Sube la corriente tanto que compensa cualquier pérdida de tensión."
    ],
    "explain": "La tensión cae unos 2 mV por °C por celda mientras la corriente casi no sube: la potencia baja cerca de 0,4 % por cada grado. Un panel a 60 °C rinde un 15 % menos que a 25 °C."
  },
  {
    "q": "Conectás un panel de 100 W (Vmp ≈ 18 V) directo a una batería de 12,6 V. ¿Por qué entrega menos que 100 W?",
    "correct": "Porque la batería le impone ≈ 13 V, lejos de los 18 V del punto de máxima potencia, y trabaja con corriente casi máxima pero tensión baja.",
    "wrong": [
      "Porque la batería consume parte de la potencia como calor interno antes de cargarse.",
      "Porque los paneles solo pueden entregar el 75 % de su potencia nominal.",
      "Porque la corriente es demasiado alta y la tensión también."
    ],
    "explain": "El punto de trabajo lo fija la carga. A ≈ 13 V la corriente casi no cae (≈ 5,9 A) pero P = V·I ≈ 76 W. Un regulador MPPT adapta la tensión y recupera la diferencia."
  },
  {
    "q": "Una celda de una cadena en serie queda a la sombra. ¿Qué le pasa a la corriente de toda la cadena?",
    "correct": "Queda limitada por la celda sombreada, porque en serie circula la misma corriente por todas.",
    "wrong": [
      "No cambia: solo baja la tensión de esa celda.",
      "Aumenta, porque la celda sombreada compensa con más resistencia.",
      "Se reparte en partes iguales entre las celdas iluminadas."
    ],
    "explain": "En un circuito serie la corriente es única. Una celda con poca luz no puede dar más que su propia corriente y arrastra a las demás; por eso los paneles llevan diodos de paso (bypass)."
  }
] };
