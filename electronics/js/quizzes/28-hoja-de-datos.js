// Preguntas del capítulo 28-hoja-de-datos.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '28-hoja-de-datos': [
  {
    "q": "Se calcula que un resistor debe valer 480 Ω. ¿Qué valor comercial E12 conviene usar?",
    "correct": "470 Ω o 560 Ω: son los valores E12 más cercanos.",
    "wrong": [
      "480 Ω, el valor exacto.",
      "500 Ω.",
      "1 kΩ."
    ],
    "explain": "La serie E12 no tiene 480 Ω. Se elige el más cercano según el circuito tolere más o menos corriente."
  },
  {
    "q": "Un resistor de 100 Ω tiene 0,2 A circulando. ¿Qué potencia disipa y qué resistor conviene?",
    "correct": "4 W: P = I²·R = 0,04 · 100. Conviene un resistor de potencia de 10 W (al menos el doble).",
    "wrong": [
      "0,4 W: uno de ½ W alcanza.",
      "20 W.",
      "0,02 W: uno de ¼ W sobra."
    ],
    "explain": "P = I² · R = 0,2² · 100 = 4 W. Hay que elegir con margen, así que no basta uno de 5 W: se usa de 10 W."
  },
  {
    "q": "¿Qué tensión nominal mínima conviene para un capacitor electrolítico que se usa en una fuente de 12 V?",
    "correct": "25 V: al menos el doble de la tensión de trabajo.",
    "wrong": [
      "12 V exactos.",
      "6 V.",
      "Cualquiera, porque la tensión no importa."
    ],
    "explain": "Un capacitor al límite de su tensión se degrada o puede fallar. El doble es un margen habitual."
  },
  {
    "q": "Un transistor disipa 0,5 W, tiene θ<sub>JA</sub> = 200 °C/W y el ambiente es de 40 °C. ¿Cuánto vale T<sub>j</sub>?",
    "correct": "140 °C: 40 + 0,5 · 200. Está muy cerca del máximo de 150 °C.",
    "wrong": [
      "40,5 °C.",
      "100 °C.",
      "240 °C."
    ],
    "explain": "T<sub>j</sub> = T<sub>a</sub> + P·θ<sub>JA</sub> = 40 + 100 = 140 °C: sin margen, conviene reducir la potencia o usar disipador."
  },
  {
    "q": "¿Por qué se diseña con la β mínima de la hoja de datos y no con la típica?",
    "correct": "Porque hay que asegurar que el circuito funcione con cualquier unidad, incluso la peor.",
    "wrong": [
      "Porque la β típica es incorrecta.",
      "Porque el mínimo es más fácil de calcular.",
      "Porque la hoja de datos no incluye la típica."
    ],
    "explain": "El valor típico no está garantizado; el mínimo y el máximo sí. Se diseña para el peor caso."
  },
  {
    "q": "¿Cuál es la diferencia entre «valor máximo absoluto» y «condición de funcionamiento recomendada»?",
    "correct": "El máximo absoluto es el límite que no se debe cruzar nunca porque se daña; las condiciones recomendadas son el rango en el que el componente funciona como se promete.",
    "wrong": [
      "Son lo mismo con otro nombre.",
      "El máximo absoluto es el valor típico de trabajo.",
      "Las condiciones recomendadas son valores que se pueden superar un rato."
    ],
    "explain": "Trabajar entre los valores recomendados es seguro; acercarse al máximo absoluto, no."
  }
] };
