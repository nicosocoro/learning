// Preguntas del capítulo 34-carga-y-campo.

(window.Elec ??= {}).QUIZZES = { ...(window.Elec.QUIZZES ?? {}), '34-carga-y-campo': [
  {
    "q": "Un generador gira a velocidad constante con los bornes sin conectar. ¿Por qué cuesta tan poco hacerlo girar?",
    "correct": "Porque sin circuito cerrado no circula corriente, y sin corriente no hay fuerza magnética que frene a la espira.",
    "wrong": [
      "Porque sin carga el campo del imán desaparece.",
      "Porque la tensión inducida es cero si no hay carga.",
      "Porque el generador se calienta menos y eso reduce el rozamiento."
    ],
    "explain": "La tensión inducida existe (ε = N·B·A·ω), pero el frenado lo produce la corriente que circula por los lados activos. Sin corriente no hay par resistente: solo el rozamiento mecánico."
  },
  {
    "q": "Al conectar una carga a un generador que gira, la corriente que aparece tiende a…",
    "correct": "Frenar el giro: el campo del imán empuja los lados activos en sentido contrario a su movimiento (ley de Lenz).",
    "wrong": [
      "Acelerar el giro, porque la corriente aporta energía al rotor.",
      "No afectar al giro, porque la energía sale del imán.",
      "Hacer girar la espira en sentido contrario."
    ],
    "explain": "Si la corriente ayudara al movimiento se obtendría energía de la nada. La fuerza F = N·B·i·L sobre cada lado se opone a la velocidad: es la forma magnética de la conservación de la energía."
  },
  {
    "q": "Un generador entrega 90 W a su carga y pierde 10 W como calor en sus bobinas. ¿Qué potencia mecánica necesita en el eje, sin contar rozamientos?",
    "correct": "100 W: toda la potencia eléctrica generada, la útil más la que se pierde en el cobre, sale del trabajo contra el par de frenado.",
    "wrong": [
      "90 W, porque solo cuenta lo que llega a la carga.",
      "10 W, porque lo demás sale del campo del imán.",
      "Depende solo de las rpm, no de la carga."
    ],
    "explain": "P_mec = τ·ω = ε·i = P_carga + P_cobre. Toda la energía eléctrica sale de lo que se hace girar el eje."
  },
  {
    "q": "Pasás de una carga de 20 Ω a una de 2 Ω en el mismo generador, manteniendo las rpm. ¿Qué ocurre con el esfuerzo del eje?",
    "correct": "Aumenta mucho: circula más corriente, el par de frenado crece con la corriente y la potencia mecánica aumenta.",
    "wrong": [
      "Disminuye, porque una resistencia menor “molesta” menos.",
      "No cambia: la tensión inducida es la misma.",
      "Disminuye, porque la tensión en bornes baja."
    ],
    "explain": "La tensión inducida es la misma, pero I = ε/(R + r) sube y el par es proporcional a I. Una carga “pesada” (R baja) pide mucho esfuerzo al motor primario."
  },
  {
    "q": "Un generador accionado por un motor de potencia limitada se conecta a una carga que pide más de lo que el motor puede dar. ¿Qué pasa?",
    "correct": "El rotor frena: bajan las rpm y con ellas la tensión y la frecuencia, hasta que la potencia eléctrica iguala a la mecánica disponible.",
    "wrong": [
      "El generador entrega la potencia pedida usando energía del imán.",
      "Sube la tensión para compensar.",
      "No pasa nada: la frecuencia depende solo del número de polos."
    ],
    "explain": "La potencia eléctrica no puede superar la mecánica. Al exigirle más, el par de frenado gana, el rotor se enlentece, y como ε = N·B·A·ω y f = n/60, ambas bajan."
  },
  {
    "q": "En una red eléctrica, de repente se desconecta una central grande y la demanda supera la generación. ¿Qué le pasa a la frecuencia de la red?",
    "correct": "Baja: los generadores restantes frenan un poco porque la carga eléctrica supera la potencia mecánica que reciben.",
    "wrong": [
      "Sube, porque hay menos generadores compartiendo la carga.",
      "No cambia: la frecuencia la fija el transformador.",
      "Se vuelve continua."
    ],
    "explain": "La frecuencia de la red es una “medida” del balance entre potencia generada y consumida: es la velocidad de giro de los rotores sincronizados. Si falta generación, frenan y f baja."
  },
  {
    "q": "Con una carga inductiva (un motor), la corriente se atrasa respecto de la tensión. ¿Qué le pasa al par de frenado?",
    "correct": "Su valor medio baja respecto de una carga resistiva con la misma corriente, y por instantes se vuelve negativo: la energía va y viene entre el campo de la carga y el eje.",
    "wrong": [
      "Sube, porque el campo de la bobina se suma al del imán en todo momento.",
      "No cambia: solo importa el valor eficaz de la corriente.",
      "Se vuelve constante, igual a cero."
    ],
    "explain": "τ = N·B·A·i·sen θ. Si i está desfasada, a veces i y sen θ tienen signos opuestos y el par se invierte un rato. El promedio resulta proporcional a cos φ."
  }
] };
