// Preguntas del capítulo 35-alternadores.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '35-alternadores': [
  {
    "q": "¿Por qué los alternadores grandes hacen girar el imán (el rotor) y dejan fijas las bobinas de potencia?",
    "correct": "Porque así la gran corriente y la alta tensión salen directo de bobinas fijas, y solo la pequeña corriente de campo pasa por anillos rozantes.",
    "wrong": [
      "Porque el imán genera más campo cuando gira que cuando está quieto.",
      "Porque una bobina fija induce más tensión que una bobina que gira.",
      "Porque las bobinas giratorias no pueden tener más de una vuelta."
    ],
    "explain": "Lo que importa es el movimiento relativo entre campo y bobina. Con las bobinas fijas se evita pasar la potencia por contactos deslizantes, que se desgastan y no soportan alta tensión."
  },
  {
    "q": "Un alternador tiene 3 pares de polos y gira a 1000 rpm. ¿Qué frecuencia genera?",
    "correct": "50 Hz, porque f = p·n/60 = 3 · 1000 / 60.",
    "wrong": [
      "16,7 Hz, porque f = n/60.",
      "150 Hz, porque f = p·n/20.",
      "1000 Hz, porque coincide con las rpm."
    ],
    "explain": "Cada vuelta del rotor pasa p pares de polos frente a cada bobina, es decir p ciclos. Con p = 3 y n = 1000 rpm: f = 3 · 1000 / 60 = 50 Hz."
  },
  {
    "q": "Una turbina hidráulica gira a 125 rpm y debe generar 50 Hz. ¿Cuántos pares de polos necesita el alternador?",
    "correct": "24 pares (48 polos), porque p = 60·f/n = 60 · 50 / 125.",
    "wrong": [
      "2 pares, como un turbogenerador de vapor.",
      "6 pares, porque 125 / 50 = 2,5 y se redondea.",
      "125 pares, uno por rpm."
    ],
    "explain": "Con p pares, f = p·n/60, así que p = 60·f/n = 3000 / 125 = 24. Las máquinas lentas necesitan muchos polos para generar 50 Hz."
  },
  {
    "q": "En un alternador trifásico, ¿cuánto vale la suma instantánea de las tres tensiones de fase?",
    "correct": "Cero en todo momento, porque están desfasadas 120° entre sí.",
    "wrong": [
      "El triple del pico, cuando coinciden las tres.",
      "Fluctúa entre cero y el pico de una fase.",
      "Es igual a la tensión de una fase."
    ],
    "explain": "sen θ + sen(θ − 120°) + sen(θ − 240°) = 0 para todo θ. Por eso un sistema equilibrado puede unir los tres retornos en un solo punto (el neutro) sin que circule corriente por él."
  },
  {
    "q": "En la red de 380 V entre fases en estrella, ¿cuánto vale la tensión entre una fase y el neutro?",
    "correct": "Unos 220 V, porque V_línea = √3 · V_fase.",
    "wrong": [
      "380 V, la misma que entre fases.",
      "190 V, la mitad de la de línea.",
      "660 V, el triple de la de línea."
    ],
    "explain": "380 / 1,732 ≈ 220 V. Con tres fases se obtienen dos tensiones a la vez: 220 V (monofásica, para una casa) y 380 V (trifásica, para motores)."
  },
  {
    "q": "¿Qué ventaja mecánica tiene un generador trifásico sobre uno monofásico de la misma potencia?",
    "correct": "La suma de la potencia de las tres fases es constante, así que el par de frenado en el eje no pulsa y la máquina vibra menos.",
    "wrong": [
      "Gira más rápido para la misma frecuencia.",
      "No necesita campo magnético en el rotor.",
      "La carga no puede frenar el eje."
    ],
    "explain": "En un generador monofásico el par pulsa al doble de la frecuencia (proporcional a sen²θ). Con tres fases a 120° los pulsos se compensan y el par total es constante."
  },
  {
    "q": "En un alternador de auto, ¿cómo se mantiene constante la tensión de salida (≈ 14 V) aunque cambien las rpm?",
    "correct": "Un regulador ajusta la corriente de campo del rotor: menos campo cuando las rpm suben, más campo cuando bajan.",
    "wrong": [
      "Un transformador baja la tensión cuando sube la velocidad.",
      "La tensión es siempre constante porque la fija la batería a través de los diodos.",
      "Una resistencia en serie quema el exceso de tensión."
    ],
    "explain": "ε ∝ B·ω: al subir ω hay que bajar B para que ε no cambie. El regulador mide la tensión y modifica la corriente de campo (excitación) del electroimán del rotor."
  }
] };
