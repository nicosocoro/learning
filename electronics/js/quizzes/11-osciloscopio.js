// Preguntas del capítulo 11-osciloscopio.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '11-osciloscopio': [
  {
    "q": "En el osciloscopio, una señal ocupa 4 divisiones de alto de pico a pico, con la escala en 2 V/div. ¿Cuánto vale la tensión pico a pico?",
    "correct": "8 V: se multiplica el alto en divisiones por la escala vertical.",
    "wrong": [
      "4 V.",
      "2 V.",
      "16 V."
    ],
    "explain": "La pantalla muestra cuadros; la escala dice cuántos volts vale cada uno. Contar y multiplicar es todo lo que hay que hacer."
  },
  {
    "q": "En la pantalla se ven muchísimos ciclos apretados e ilegibles. ¿Qué ajustás para verlos más estirados?",
    "correct": "Reduzco la base de tiempo (menos segundos por división).",
    "wrong": [
      "Aumento la base de tiempo.",
      "Subo la escala vertical (V/div).",
      "Cambio a acoplamiento AC."
    ],
    "explain": "Con menos tiempo por división entran menos ciclos en la pantalla, y cada uno se ve más ancho."
  },
  {
    "q": "Querés ver un pequeño rizado sobre una tensión continua de 5 V. ¿Qué acoplamiento usás?",
    "correct": "AC: bloquea la componente continua y permite ampliar la escala para ver el rizado.",
    "wrong": [
      "DC: muestra solo la parte alterna de la señal.",
      "Da lo mismo: los dos muestran idéntico resultado.",
      "Ninguno: el osciloscopio no puede medir rizados."
    ],
    "explain": "Con DC los 5 V ocuparían casi toda la pantalla. Con AC se quita esa continua y se puede subir mucho la sensibilidad."
  },
  {
    "q": "¿Qué hace el disparo (trigger)?",
    "correct": "Hace que la traza arranque siempre en el mismo punto de la onda, para que la imagen quede quieta.",
    "wrong": [
      "Dispara la señal desde el osciloscopio hacia el circuito.",
      "Cambia la frecuencia de la señal medida.",
      "Apaga la pantalla cuando la señal es muy grande."
    ],
    "explain": "Sin disparo, cada barrido empezaría en un punto distinto de la onda y la imagen “correría” por la pantalla."
  },
  {
    "q": "¿Qué ventaja tiene un osciloscopio frente a un multímetro?",
    "correct": "Muestra la forma de la señal en el tiempo, no solo un valor numérico.",
    "wrong": [
      "Es más preciso midiendo resistencias.",
      "Funciona sin conectarse al circuito.",
      "Mide la corriente sin abrir el circuito, siempre."
    ],
    "explain": "Un multímetro resume la señal en un número; el osciloscopio muestra picos, formas, frecuencias, rizado y cambios rápidos."
  },
  {
    "q": "Una señal PWM de 5 V tiene un ciclo de trabajo del 20 %. ¿Cuál es, aproximadamente, su tensión media?",
    "correct": "1 V: la señal está en nivel alto solo una quinta parte del tiempo.",
    "wrong": [
      "5 V, porque ese es su nivel alto.",
      "2,5 V, porque es la mitad.",
      "0,2 V."
    ],
    "explain": "La tensión media de una señal cuadrada es el ciclo de trabajo multiplicado por el nivel alto: 0,20 · 5 V = 1 V."
  }
] };
