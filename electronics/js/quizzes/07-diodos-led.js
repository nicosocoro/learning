// Preguntas del capítulo 07-diodos-led.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '07-diodos-led': [
  {
    "q": "Conectás un diodo en serie con una pila y una lamparita, pero con el ánodo hacia el negativo de la pila. ¿Qué pasa?",
    "correct": "No circula corriente: el diodo está en polarización inversa y bloquea.",
    "wrong": [
      "La lamparita enciende con más brillo.",
      "El diodo se calienta y se funde de inmediato.",
      "Circula la mitad de la corriente."
    ],
    "explain": "Un diodo deja pasar la corriente solo del ánodo al cátodo. En el sentido contrario actúa como un interruptor abierto (salvo una corriente minúscula)."
  },
  {
    "q": "¿Por qué un LED nunca se conecta directamente a una pila o fuente, sin resistor?",
    "correct": "Porque una vez que conduce, su tensión queda casi fija y nada limita la corriente, que se dispara hasta quemarlo.",
    "wrong": [
      "Porque el LED necesita corriente alterna para encender.",
      "Porque el resistor es lo que produce la luz.",
      "Porque la pila no tiene la tensión suficiente."
    ],
    "explain": "El diodo conduce muy bien por encima de su tensión directa. El resistor en serie absorbe la tensión sobrante y fija la corriente, como en la ley de Ohm."
  },
  {
    "q": "Dos LED, uno rojo (≈ 2 V) y uno azul (≈ 3,2 V), se alimentan desde la misma fuente de 5 V y con el mismo resistor. ¿Cuál recibe más corriente?",
    "correct": "El rojo: como su tensión directa es menor, queda más tensión sobre el resistor.",
    "wrong": [
      "El azul, porque su tensión es mayor.",
      "Los dos igual, porque el resistor es el mismo.",
      "Ninguno: el resistor corta la corriente."
    ],
    "explain": "La corriente la fija el resistor: I = (V<sub>fuente</sub> − V<sub>f</sub>)/R. Con menor V<sub>f</sub>, la diferencia es mayor y también la corriente."
  },
  {
    "q": "¿Qué ventaja tiene el rectificador de onda completa frente al de media onda?",
    "correct": "Aprovecha los dos semiciclos: hay el doble de pulsos por segundo, un valor medio mayor y es más fácil filtrar el rizado.",
    "wrong": [
      "Necesita un solo diodo en lugar de cuatro.",
      "Entrega alterna a la salida.",
      "No tiene caída de tensión en los diodos."
    ],
    "explain": "El puente invierte el semiciclo negativo en vez de descartarlo. Con pulsos al doble de frecuencia, el capacitor tiene menos tiempo para descargarse entre pico y pico."
  },
  {
    "q": "Agregás un capacitor de filtro más grande a la salida de un rectificador. ¿Qué cambia?",
    "correct": "El rizado disminuye: el capacitor entrega energía a la carga durante más tiempo entre pico y pico.",
    "wrong": [
      "El rizado aumenta.",
      "Los diodos dejan de conducir.",
      "La salida se vuelve alterna."
    ],
    "explain": "Con más capacidad, la tensión cae menos mientras los diodos están bloqueados: ΔV ≈ I/(f·C)."
  },
  {
    "q": "La salida de un rectificador de puente con capacitor, ¿por qué es algo menor que el pico de la señal de entrada?",
    "correct": "Porque en cada semiciclo conducen dos diodos y cada uno “se queda” con unos 0,7 V.",
    "wrong": [
      "Porque el capacitor consume tensión.",
      "Porque la corriente alterna pierde energía al rectificarse.",
      "No es menor: son exactamente iguales."
    ],
    "explain": "Un diodo que conduce tiene una caída cercana a 0,7 V. En el puente atraviesan la corriente dos diodos a la vez, por eso se pierden unos 1,4 V."
  }
] };
