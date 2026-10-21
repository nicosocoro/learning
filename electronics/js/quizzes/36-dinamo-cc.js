// Preguntas del capítulo 36-dinamo-cc.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '36-dinamo-cc': [
  {
    "q": "En una espira que gira, ¿qué hace el conmutador (anillo partido) para que la carga reciba corriente continua?",
    "correct": "Invierte las conexiones con las escobillas justo cuando la tensión de la espira cambia de signo, de modo que la carga ve siempre la misma polaridad.",
    "wrong": [
      "Filtra la tensión como un capacitor.",
      "Impide que la espira gire en el sentido contrario.",
      "Reduce la tensión inducida a la mitad."
    ],
    "explain": "Es un rectificador mecánico: cada media vuelta, cuando ε pasa por cero, cada escobilla pasa a tocar el otro extremo de la espira. La tensión en la carga resulta |ε|: unidireccional, pero pulsante."
  },
  {
    "q": "Con una sola bobina y un conmutador de dos delgas, ¿cómo es la tensión de salida?",
    "correct": "Pulsante: llega a cero dos veces por vuelta y su valor medio es unas 0,64 veces el pico.",
    "wrong": [
      "Perfectamente constante, igual al pico.",
      "Alterna, con valor medio cero.",
      "Constante pero igual a la mitad del pico."
    ],
    "explain": "La salida es |V_p·sen θ|. Su promedio es 2/π ≈ 0,64 del pico y cae a cero cuando la bobina pasa por la posición perpendicular al campo."
  },
  {
    "q": "¿Por qué los motores y las dínamos tienen muchas bobinas y muchas delgas en vez de una sola?",
    "correct": "Porque con bobinas desfasadas la escobilla toma siempre la de mayor tensión y la ondulación baja mucho.",
    "wrong": [
      "Para que la tensión pico sea mayor a la que da una sola bobina.",
      "Para que el rotor pese más y gire con inercia.",
      "Para poder cambiar la frecuencia de la señal."
    ],
    "explain": "Con n bobinas, la tensión mínima es cos(π/2n) del pico: 71 % con 2, 92 % con 4, 98 % con 8. Es el equivalente mecánico de alisar con un capacitor."
  },
  {
    "q": "Un motor de juguete se hace girar a mano con un taladro y se mide una tensión continua en sus bornes. ¿Por qué funciona como generador?",
    "correct": "Porque un motor de continua es una máquina reversible: el mismo rotor con conmutador, al girar en el campo del imán, induce tensión.",
    "wrong": [
      "Porque los motores de juguete tienen una pila oculta.",
      "Porque la fricción de las escobillas genera cargas.",
      "Porque el taladro conduce corriente al motor."
    ],
    "explain": "Un motor aplica tensión para obtener giro; un generador usa giro para obtener tensión. La misma estructura de bobinas, imán y conmutador hace las dos cosas."
  },
  {
    "q": "Un motor de continua de 3 V gira a 6000 rpm sin carga (consume poca corriente). Usado como generador a 3000 rpm, ¿cuánto da aproximadamente en vacío?",
    "correct": "Cerca de 1,4 a 1,5 V: la tensión inducida es proporcional a las rpm.",
    "wrong": [
      "Cerca de 3 V, igual a la del motor.",
      "Cerca de 6 V, el doble.",
      "Cerca de 0,1 V, porque casi no hay carga."
    ],
    "explain": "En vacío, E = ke·ω. A 6000 rpm la fcem es casi 3 V (un poco menos por la caída del inducido); a la mitad de las rpm será la mitad: ≈ 1,4 V."
  },
  {
    "q": "Frenás un motor de continua que gira conectando sus bornes a una resistencia. ¿Qué pasa con su energía cinética?",
    "correct": "Se convierte en calor en el inducido y en la resistencia: la máquina actúa como generador y su corriente frena el rotor.",
    "wrong": [
      "Se almacena en el imán.",
      "Desaparece sin transformarse.",
      "Se convierte en un campo magnético más intenso que acelera el rotor."
    ],
    "explain": "Es el frenado dinámico: la corriente generada crea un par de oposición (capítulo 34). Si en lugar de una resistencia hay una batería que se carga, es frenado regenerativo."
  },
  {
    "q": "¿Por qué el alternador con diodos reemplazó a la dínamo con conmutador en los autos?",
    "correct": "Porque el conmutador y las escobillas con alta corriente se desgastan y hacen chispas, mientras que un puente de diodos rectifica sin partes móviles.",
    "wrong": [
      "Porque la dínamo no puede generar continua.",
      "Porque el alternador genera más tensión con menos rpm y no necesita campo.",
      "Porque los diodos aumentan la potencia disponible."
    ],
    "explain": "Rectificar con diodos es más robusto y permite que la corriente de potencia salga de bobinas fijas. La dínamo rectifica mecánicamente, con un contacto deslizante que sufre."
  }
] };
