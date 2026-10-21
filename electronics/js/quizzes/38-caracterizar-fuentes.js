// Preguntas del capítulo 38-caracterizar-fuentes.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '38-caracterizar-fuentes': [
  {
    "q": "Medís una pila en vacío (1,50 V) y con una carga de 10 Ω (1,43 V). ¿Cuánto vale su resistencia interna aproximadamente?",
    "correct": "0,5 Ω: la corriente es 0,143 A y la caída interna, 0,07 V.",
    "wrong": [
      "0,07 Ω, igual a la caída medida.",
      "10 Ω, igual a la carga.",
      "1,43 Ω, igual a la tensión con carga."
    ],
    "explain": "I = 1,43 / 10 = 0,143 A. La caída en r es 1,50 − 1,43 = 0,07 V, y r = 0,07 / 0,143 ≈ 0,5 Ω."
  },
  {
    "q": "Para estimar la resistencia interna de una pila AA de unos 0,3 Ω con un voltímetro de resolución de 10 mV, ¿qué carga conviene usar?",
    "correct": "Una carga chica (unos pocos ohms) que haga circular una corriente de cientos de mA, para que la caída sea bien mayor que la resolución del voltímetro.",
    "wrong": [
      "Una carga grande (100 kΩ) para no gastar la pila.",
      "Cualquiera, porque r no depende de la carga.",
      "Ninguna: r solo se puede medir con la pila en cortocircuito."
    ],
    "explain": "Con 10 mA la caída en 0,3 Ω es 3 mV, menor que la resolución: el cálculo da 0 o un valor absurdo. Con 300 mA la caída es 90 mV y el error es del orden del 10 %."
  },
  {
    "q": "Medís la tensión de un panel solar chico con carga de 22 Ω y de 100 Ω, y calculás r con la fórmula (Voc − V)/I en cada caso: obtenés valores muy distintos. ¿Por qué?",
    "correct": "Porque un panel no es una fuente lineal: su resistencia equivalente depende del punto de trabajo (casi corriente constante a un lado y un diodo al otro).",
    "wrong": [
      "Porque el panel cambió de temperatura entre las dos pruebas.",
      "Porque el voltímetro se descalibra cuando cambia la carga.",
      "Porque la fórmula solo vale para cargas de 100 Ω."
    ],
    "explain": "El modelo (E, r) vale solo para curvas rectas. En el panel la curva V–I tiene “codo”: la pendiente (y por lo tanto la r aparente) cambia según donde se mida."
  },
  {
    "q": "Una fuente da 5,00 V sin carga y 4,80 V a plena carga. ¿Cuál es su regulación de carga?",
    "correct": "≈ 4,2 %: (5,00 − 4,80) / 4,80.",
    "wrong": [
      "4 %: 0,20 V sobre 5 V, que es la tensión en vacío.",
      "0,20 %: la diferencia en volts dividida por 100.",
      "96 %: la relación entre 4,80 y 5,00."
    ],
    "explain": "La regulación se define como (V sin carga − V a plena carga) / V a plena carga: 0,20 / 4,80 ≈ 4,2 %. Cuanto menor, mejor: la fuente casi no “se cae” al cargarla."
  },
  {
    "q": "Medís la tensión de una fuente de 10 A con cables largos y delgados, conectando el voltímetro en los extremos de los cables lejos de la fuente. ¿Qué error cometés?",
    "correct": "Incluís la caída de tensión de los cables (I·R de los cables), así que la tensión leída es menor que la de los bornes de la fuente.",
    "wrong": [
      "Ninguno, porque los cables conducen sin caída.",
      "El voltímetro lee más que la fuente por la inductancia de los cables.",
      "Se mide la tensión en vacío en lugar de la tensión con carga."
    ],
    "explain": "Con 10 A y 0,05 Ω de cables se pierden 0,5 V. Para medir la tensión de la fuente se conecta el voltímetro con cables propios directamente a sus bornes (medición de cuatro hilos)."
  },
  {
    "q": "Un generador entrega 82 W a su carga y se lo gira con un motor que le da 100 W en el eje. ¿Cuánto vale su rendimiento?",
    "correct": "82 %: la potencia eléctrica útil dividida por la mecánica que recibe.",
    "wrong": [
      "18 %: es lo que se pierde.",
      "100 %: la energía se conserva.",
      "122 %: 100 W más lo que sale."
    ],
    "explain": "η = P_eléctrica / P_mecánica = 82 / 100. Los 18 W restantes se pierden en forma de calor (cobre, hierro, rozamiento)."
  },
  {
    "q": "Un alternador casero, ¿qué dos mediciones permiten saber a cuántas rpm gira, sin tacómetro?",
    "correct": "Su frecuencia (n = 60·f/p) y, si se conoce, el número de pares de polos.",
    "wrong": [
      "Su tensión en vacío y la resistencia de las bobinas.",
      "La temperatura de las bobinas y la corriente de carga.",
      "El factor de potencia y la tensión de línea."
    ],
    "explain": "La frecuencia de la tensión inducida es f = p·n/60, de modo que n = 60·f/p. Con un paso a paso de 50 pares de polos, 250 Hz equivalen a 300 rpm."
  }
] };
