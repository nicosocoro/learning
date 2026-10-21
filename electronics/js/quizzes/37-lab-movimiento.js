// Preguntas del capítulo 37-lab-movimiento.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '37-lab-movimiento': [
  {
    "q": "Dejás caer un imán de neodimio por un tubo con una bobina conectada a dos LED en antiparalelo (uno rojo y uno verde). ¿Qué ves?",
    "correct": "Un LED destella cuando el imán entra y el otro cuando sale, porque la tensión cambia de signo.",
    "wrong": [
      "Los dos se encienden a la vez, mientras el imán está dentro.",
      "Ninguno, porque la corriente inducida es demasiado pequeña.",
      "Uno se enciende y queda encendido hasta que sacás el imán."
    ],
    "explain": "ε = −N·ΔΦ/Δt cambia de signo cuando el flujo pasa de crecer a decrecer. Cada LED conduce en un solo sentido, así que se alternan. Si el imán se quedara quieto, no se encendería ninguno."
  },
  {
    "q": "Un motor paso a paso de 200 pasos por vuelta (50 pares de polos) se gira a 300 rpm como generador. ¿Qué frecuencia tiene la tensión de cada bobina?",
    "correct": "250 Hz, porque f = p·n/60 = 50 · 300 / 60.",
    "wrong": [
      "5 Hz, igual a las vueltas por segundo.",
      "50 Hz, igual a la red.",
      "1000 Hz, porque tiene 200 pasos."
    ],
    "explain": "Con p = 50 pares de polos, cada vuelta genera 50 ciclos: a 5 vueltas por segundo hay 250 ciclos por segundo. Por eso un paso a paso es un alternador de muchos polos."
  },
  {
    "q": "Si unís los dos cables de una bobina de un motor paso a paso y girás el eje con la mano, ¿qué notás?",
    "correct": "Cuesta mucho más girarlo: la corriente que se induce crea un campo que frena el rotor (frenado dinámico).",
    "wrong": [
      "Gira igual de fácil, porque no hay carga.",
      "Gira más fácil, porque se anula el campo del imán.",
      "Se traba del todo y no hay forma de girarlo."
    ],
    "explain": "Al cortocircuitar la bobina la corriente es máxima y con ella el par de frenado (capítulo 34). Gira, pero con un esfuerzo notable y creciente con la velocidad."
  },
  {
    "q": "Rectificás la salida de una bobina con un puente de diodos de silicio (0,7 V por diodo) y un capacitor. La bobina da un pico de 3 V. ¿Qué tensión continua podés esperar como máximo?",
    "correct": "Cerca de 1,6 V: se pierden dos diodos en conducción (2 · 0,7 V).",
    "wrong": [
      "3 V, el mismo valor del pico.",
      "2,1 V, que es un 70 % del pico.",
      "6 V, porque el puente duplica la tensión."
    ],
    "explain": "En un puente la corriente pasa siempre por dos diodos. Con 0,7 V cada uno, V ≈ 3 − 1,4 = 1,6 V. Con diodos Schottky (≈ 0,3 V) se obtienen unos 2,4 V: conviene usarlos con fuentes de baja tensión."
  },
  {
    "q": "Un disco con 8 imanes frente a una bobina gira a 600 rpm. ¿Qué frecuencia tiene la tensión inducida?",
    "correct": "40 Hz: hay 4 pares de polos, y 4 · 600 / 60 = 40.",
    "wrong": [
      "10 Hz, igual a las vueltas por segundo.",
      "80 Hz, uno por cada imán.",
      "600 Hz, igual a las rpm."
    ],
    "explain": "Cada par de imanes (N y S) completa un ciclo al pasar. Con 8 imanes hay 4 pares; a 10 vueltas por segundo son 40 ciclos por segundo."
  },
  {
    "q": "Alejás el imán de la bobina del doble de distancia. ¿Qué le pasa a la tensión inducida (en un montaje real)?",
    "correct": "Baja mucho, porque el campo cae rápidamente con la distancia y el flujo que atraviesa la bobina es menor.",
    "wrong": [
      "No cambia, porque la tensión depende solo de las rpm.",
      "Sube, porque el imán se mueve más libremente.",
      "Baja a la mitad exactamente."
    ],
    "explain": "ε = N·dΦ/dt y Φ depende de cuántas líneas de campo atraviesan la bobina: con el imán más lejos, menos. Por eso en los generadores caseros se busca el menor entrehierro posible."
  },
  {
    "q": "Una dínamo de bicicleta, a velocidades altas, entrega una corriente casi constante en lugar de una tensión constante. ¿Por qué?",
    "correct": "Porque a medida que aumenta la frecuencia aumenta la reactancia de su bobina, y I ≈ V/(ωL) deja de depender de la velocidad.",
    "wrong": [
      "Porque tiene un regulador electrónico de corriente.",
      "Porque la lámpara limita la corriente a un valor fijo.",
      "Porque el imán se debilita al girar rápido."
    ],
    "explain": "La tensión crece con ω, pero la reactancia de la bobina (ωL) crece igual, así que la corriente tiende a ke/L. Eso protege a la lámpara de 6 V de quemarse a alta velocidad."
  }
] };
