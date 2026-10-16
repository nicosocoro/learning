// Preguntas del capítulo 25-logica.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '25-logica': [
  {
    "q": "¿Cuándo da 1 una compuerta AND de dos entradas?",
    "correct": "Solo cuando las dos entradas valen 1.",
    "wrong": [
      "Cuando alguna entrada vale 1.",
      "Cuando las dos entradas son distintas.",
      "Cuando las dos entradas valen 0."
    ],
    "explain": "AND significa «todas». Es como dos interruptores en serie: la corriente pasa solo si ambos están cerrados."
  },
  {
    "q": "Una compuerta XOR recibe A = 1 y B = 1. ¿Cuánto da la salida?",
    "correct": "0: la XOR vale 1 solo cuando las entradas son distintas.",
    "wrong": [
      "1.",
      "No se puede saber.",
      "Cambia continuamente."
    ],
    "explain": "XOR es el «o exclusivo». Con las dos entradas iguales (0 y 0, o 1 y 1) la salida es 0."
  },
  {
    "q": "¿Cómo se obtiene un NOT a partir de una NAND?",
    "correct": "Uniendo las dos entradas de la NAND entre sí.",
    "wrong": [
      "Dejando una entrada sin conectar.",
      "Conectando una entrada a masa.",
      "No se puede."
    ],
    "explain": "(A · A)‾ = Ā. Por eso NAND es una compuerta universal."
  },
  {
    "q": "¿Por qué una compuerta CMOS casi no consume cuando la salida está quieta?",
    "correct": "Porque de los dos MOSFET complementarios siempre conduce solo uno: nunca hay un camino directo de +V a masa.",
    "wrong": [
      "Porque trabaja con corriente alterna.",
      "Porque no tiene transistores.",
      "Porque la salida está desconectada."
    ],
    "explain": "Solo se consume potencia al conmutar, al cargar y descargar las capacidades de las compuertas."
  },
  {
    "q": "¿Cuántas combinaciones distintas se pueden representar con 4 bits?",
    "correct": "16 (2⁴).",
    "wrong": [
      "4.",
      "8.",
      "32."
    ],
    "explain": "Cada bit duplica el número de combinaciones: 2 · 2 · 2 · 2 = 16 (del 0 al 15)."
  },
  {
    "q": "En un semisumador, ¿qué compuerta calcula el acarreo?",
    "correct": "Una AND: solo 1 + 1 produce acarreo.",
    "wrong": [
      "Una XOR.",
      "Una OR.",
      "Una NOT."
    ],
    "explain": "La suma es la XOR (1+1 = 0 con acarreo) y el acarreo es la AND de las dos entradas."
  }
] };
