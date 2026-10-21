// Preguntas del capítulo 30-fuentes-cc.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '30-fuentes-cc': [
  {
    "q": "¿Qué hace realmente una pila cuando se la conecta a un circuito?",
    "correct": "Mantiene separadas las cargas en sus terminales, usando energía química, para que haya una diferencia de potencial.",
    "wrong": [
      "Fabrica electrones nuevos que salen por el terminal negativo.",
      "Almacena electrones y los va soltando hasta quedarse vacía.",
      "Genera corriente aunque el circuito esté abierto."
    ],
    "explain": "Los electrones ya están en los conductores. La fuente aporta la energía (aquí, química) para mantener la tensión que los empuja por el circuito cerrado."
  },
  {
    "q": "Una celda solar de silicio, ¿cuántos volts da aproximadamente, y de qué depende su corriente?",
    "correct": "Unos 0,6 V sin importar su tamaño; la corriente crece con el área y con la luz recibida.",
    "wrong": [
      "Unos 12 V, y la corriente depende de la tensión.",
      "Una tensión proporcional al área; la corriente es siempre la misma.",
      "Unos 0,6 V por cada centímetro cuadrado de área."
    ],
    "explain": "La tensión de una celda la fija el material de la unión P-N (≈ 0,6 V). Más área recoge más fotones y da más corriente, pero no más tensión."
  },
  {
    "q": "Una fuente tiene E = 6 V y r = 2 Ω. Conectás una carga de 10 Ω. ¿Qué tensión llega a la carga?",
    "correct": "5 V, porque la corriente es 0,5 A y 1 V se cae en la resistencia interna.",
    "wrong": [
      "6 V, porque la fuente siempre entrega su fem.",
      "3 V, porque la tensión se reparte en partes iguales.",
      "1 V, que es la caída en la resistencia interna."
    ],
    "explain": "I = 6 / (10 + 2) = 0,5 A. La caída interna es 0,5 · 2 = 1 V, así que la carga recibe 6 − 1 = 5 V."
  },
  {
    "q": "¿Para qué valor de R la carga recibe la máxima potencia de una fuente con resistencia interna r?",
    "correct": "R = r: la tensión cae a la mitad de E y el rendimiento es del 50 %.",
    "wrong": [
      "R = 0, que da la mayor corriente.",
      "R muy grande, que da la mayor tensión.",
      "R = 2r, que equilibra corriente y tensión."
    ],
    "explain": "Con R = 0 la corriente es máxima pero la tensión en la carga es cero; con R muy grande ocurre lo contrario. El producto V·I es máximo a mitad de camino, en R = r."
  },
  {
    "q": "¿Por qué con una batería casi nunca se trabaja en la condición de máxima transferencia de potencia?",
    "correct": "Porque con R = r la mitad de la energía se disipa dentro de la propia batería.",
    "wrong": [
      "Porque la batería entregaría menos corriente que con otras cargas.",
      "Porque la tensión de la batería sube demasiado.",
      "Porque la batería solo puede alimentar cargas muy grandes."
    ],
    "explain": "En R = r el rendimiento es del 50 %. La energía almacenada es limitada, así que se prefiere R ≫ r para aprovechar casi toda en la carga."
  },
  {
    "q": "Una pila de limón da 0,9 V en vacío y 0,9 mA en cortocircuito. ¿Cuánto vale su resistencia interna?",
    "correct": "1 kΩ.",
    "wrong": [
      "1 Ω.",
      "0,81 Ω.",
      "10 Ω."
    ],
    "explain": "r = Voc / Icc = 0,9 V / 0,9 mA = 1000 Ω. Es una resistencia interna enorme comparada con la de una pila AA, por eso da tan poca corriente."
  },
  {
    "q": "Un encendedor piezoeléctrico logra miles de volts. ¿Por qué no sirve para encender una lámpara?",
    "correct": "Porque la energía que entrega en cada golpe es minúscula (microjoules) y su resistencia interna es enorme.",
    "wrong": [
      "Porque la tensión es demasiado baja.",
      "Porque produce corriente alterna.",
      "Porque el cristal se agota con el primer golpe."
    ],
    "explain": "Tensión alta no es lo mismo que potencia alta: P = V·I, y la corriente y la duración son tan pequeñas que la energía total es mínima."
  }
] };
