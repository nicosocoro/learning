// Preguntas del capítulo 32-lab-cc-casero.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '32-lab-cc-casero': [
  {
    "q": "Medís 0,92 V en una pila de limón con un multímetro y 0,35 V cuando le conectás una carga de 1 kΩ. ¿Cuánto vale aproximadamente su resistencia interna?",
    "correct": "Unos 1,6 kΩ: la corriente es 0,35 mA y la caída interna es 0,57 V.",
    "wrong": [
      "Unos 0,35 kΩ, igual a la tensión medida con carga.",
      "Unos 1 kΩ, igual a la carga conectada.",
      "Cero, porque el voltímetro mide la tensión real."
    ],
    "explain": "I = V/R = 0,35 mA. La parte de E que no llega a la carga se cae en r: r = (0,92 − 0,35) / 0,35 mA ≈ 1,6 kΩ."
  },
  {
    "q": "Querés encender un LED rojo con pilas de limón. ¿Cuál de estas armas funciona mejor?",
    "correct": "Tres limones en serie para llegar a unos 2,8 V, y varias de esas ramas en paralelo para bajar la resistencia interna.",
    "wrong": [
      "Un solo limón con electrodos muy grandes, porque la tensión sube con el área.",
      "Seis limones en paralelo, porque la tensión se suma.",
      "Muchos limones en serie: cuantos más, más corriente."
    ],
    "explain": "El LED necesita más de unos 1,7 V: hay que poner limones en serie. Pero la resistencia interna también se suma, así que para tener corriente conviene tener ramas en paralelo."
  },
  {
    "q": "Para medir la corriente de cortocircuito de una pila AA nueva con un multímetro, ¿qué pasa?",
    "correct": "Circulan varios amperes por el multímetro: puede quemarse el fusible y la pila se calienta. Esa prueba no se hace con pilas de baja resistencia interna.",
    "wrong": [
      "No pasa nada: el multímetro limita la corriente a unos mA.",
      "La pila mide su tensión de vacío y se descarga muy despacio.",
      "Es la mejor forma de medir la capacidad de la pila."
    ],
    "explain": "Una pila AA tiene r ≈ 0,25 Ω: en corto da unos 6 A. Se mide Icc solo en fuentes chicas (limón, panel pequeño, módulo termoeléctrico). En una pila se obtiene r con una carga conocida."
  },
  {
    "q": "En la prueba de un módulo termoeléctrico obtenés la máxima potencia con una carga de 3 Ω. ¿Qué podés concluir?",
    "correct": "Su resistencia interna es de unos 3 Ω, porque la potencia máxima se da cuando R = r.",
    "wrong": [
      "Su resistencia interna es de 6 Ω, el doble de la carga.",
      "Su resistencia interna es cercana a cero, porque entrega mucha potencia.",
      "Su tensión en vacío es de 3 V."
    ],
    "explain": "La máxima transferencia de potencia ocurre con R = r. Es una forma de encontrar r sin medir la corriente de cortocircuito."
  },
  {
    "q": "Medís un panel solar chico primero con luz tenue y después con diez veces más luz. ¿Qué esperás ver?",
    "correct": "La tensión en vacío sube solo un poco, pero la corriente de cortocircuito se multiplica casi por diez.",
    "wrong": [
      "La tensión en vacío se multiplica casi por diez y la corriente casi no cambia.",
      "La tensión y la corriente son proporcionales a la luz y se multiplican por diez.",
      "Con luz tenue el panel no tiene tensión: aparece recién con mucha luz."
    ],
    "explain": "La tensión de una celda depende del logaritmo de la luz (unos mV de diferencia por celda); la corriente es proporcional a la cantidad de fotones. Con una sola medida de tensión no se sabe cuánta potencia tiene el panel disponible."
  },
  {
    "q": "Un compañero dice que su pila de limón da 3 V porque “usó un limón más grande”. ¿Qué factor tiene en cuenta mal?",
    "correct": "La tensión depende de los metales de los electrodos y no del tamaño del limón; el tamaño o la distancia solo cambian la resistencia interna.",
    "wrong": [
      "La tensión depende del tamaño del limón, pero a 3 V lo explica mejor la acidez.",
      "La tensión crece con la cantidad de jugo, porque hay más iones.",
      "Hay que usar siempre electrodos del mismo metal."
    ],
    "explain": "Zinc con cobre da ≈ 0,9 V sin importar el fruto. Un limón grande, o electrodos más grandes y más cerca, bajan r y dejan pasar más corriente, pero no suben E."
  }
] };
