// Índice del libro: se usa para la portada, la barra de navegación y el "anterior/siguiente".
// El número de capítulo es la posición en LESSONS; el prefijo del id solo ordena los archivos.

(function () {
  const Elec = (window.Elec ??= {});

  Elec.PARTS = [
    { name: 'Parte I · Fundamentos', ids: ['01-voltaje-corriente', '02-ley-de-ohm', '03-resistencias'] },
    { name: 'Parte II · Fuentes de energía e instrumentos', ids: ['04-baterias', '05-multimetro'] },
    { name: 'Parte III · Componentes y señales', ids: ['06-capacitores-rc', '07-diodos-led', '08-cc-vs-ca', '09-onda-senoidal', '10-frecuencia', '11-osciloscopio'] },
    { name: 'Parte IV · Electromagnetismo y transformación', ids: ['12-induccion', '13-transformadores'] },
    { name: 'Parte V · Transistores y relés', ids: ['14-transistor-bjt', '15-transistor-interruptor', '16-transistor-amplificador', '17-mosfet', '18-rele', '19-cargas-inductivas'] },
    { name: 'Parte VI · Filtros y análisis de alterna', ids: ['20-inductor-rl', '21-impedancia-filtros', '22-resonancia'] },
    { name: 'Parte VII · Amplificadores operacionales', ids: ['23-amplificador-operacional', '24-aplicaciones-operacional'] },
    { name: 'Parte VIII · Electrónica digital', ids: ['25-logica', '26-entradas-adc', '27-temporizador-555'] },
    { name: 'Parte IX · Práctica de banco', ids: ['28-hoja-de-datos', '29-seguridad-masa-desacople'] },
    { name: 'Parte X · Generación de energía eléctrica', ids: ['30-fuentes-cc', '31-solar', '32-lab-cc-casero', '33-generador-ca', '34-carga-y-campo', '35-alternadores', '36-dinamo-cc', '37-lab-movimiento', '38-caracterizar-fuentes'] },
  ];

  Elec.LESSONS = [
    { id: '01-voltaje-corriente', title: 'Voltaje, corriente y carga', summary: 'Qué es la diferencia de potencial y cómo se mueven las cargas entre dos puntos.', tags: 'W = q·ΔV · I = Q/t' },
    { id: '02-ley-de-ohm', title: 'Ley de Ohm y potencia', summary: 'La relación entre tensión, corriente y resistencia, de qué depende y el calor que se disipa.', tags: 'V = I·R · P = V·I' },
    { id: '03-resistencias', title: 'Resistencias en serie y en paralelo', summary: 'Resistencia equivalente, divisor de tensión, cortocircuitos y las leyes de Kirchhoff.', tags: 'R₁+R₂ · R₁R₂/(R₁+R₂)' },
    { id: '04-baterias', title: 'Baterías y fuentes reales', summary: 'Resistencia interna, capacidad en mAh y por qué una pila “se cae” al exigirle corriente.', tags: 'V = E − I·r · t = C/I' },
    { id: '05-multimetro', title: 'El multímetro', summary: 'Cómo medir tensión, corriente y resistencia, cómo funciona por dentro y los errores que queman fusibles.', tags: 'V · A · Ω' },
    { id: '06-capacitores-rc', title: 'Capacitores y circuito RC', summary: 'Campo eléctrico, carga y descarga, constante de tiempo y comportamiento en corriente alterna.', tags: 'τ = R·C · E = ½CV²' },
    { id: '07-diodos-led', title: 'Diodos, LED y rectificación', summary: 'Un componente de una sola vía: cómo enciende un LED y cómo convierte alterna en continua.', tags: 'Vf ≈ 0,7 V · rectificador' },
    { id: '08-cc-vs-ca', title: 'Corriente continua y corriente alterna', summary: 'Dos formas de entregar energía y por qué la red eléctrica usa una y los celulares otra.', tags: 'CC · CA · Vrms' },
    { id: '09-onda-senoidal', title: 'La onda senoidal y el valor eficaz', summary: 'Valor pico, pico a pico y eficaz de una señal alterna, y por qué la red es senoidal.', tags: 'v(t) = Vp·sen(ωt)' },
    { id: '10-frecuencia', title: 'Frecuencia y período', summary: 'De los 50 Hz de la red a los GHz del WiFi, ondas electromagnéticas y cómo se oye una frecuencia.', tags: 'T = 1/f · λ = v/f' },
    { id: '11-osciloscopio', title: 'El osciloscopio', summary: 'Leer tensión y tiempo en una pantalla con divisiones, y entender las señales PWM.', tags: 'V/div · T/div' },
    { id: '12-induccion', title: 'Magnetismo e inducción electromagnética', summary: 'Cómo un imán en movimiento genera tensión: flujo magnético, ley de Faraday y ley de Lenz.', tags: 'ε = −N·ΔΦ/Δt' },
    { id: '13-transformadores', title: 'Transformadores', summary: 'Cómo subir y bajar tensiones alternas sin partes móviles, y por qué la red lo necesita.', tags: 'Vs/Vp = Ns/Np' },
    { id: '14-transistor-bjt', title: 'El transistor bipolar (BJT)', summary: 'Una corriente chica en la base gobierna una corriente grande de colector: regiones de corte, activa y saturación.', tags: 'Ic = β·Ib · Vbe ≈ 0,7 V' },
    { id: '15-transistor-interruptor', title: 'El transistor como interruptor', summary: 'Corte y saturación, cómo calcular el resistor de base y los errores típicos al manejar una carga.', tags: 'RB = (V − 0,7)/IB' },
    { id: '16-transistor-amplificador', title: 'El transistor como amplificador', summary: 'Punto de trabajo, ganancia del emisor común y el límite donde la señal se recorta.', tags: 'Av = −RC/(re + RE)' },
    { id: '17-mosfet', title: 'El MOSFET', summary: 'Un transistor controlado por tensión: umbral, resistencia del canal, la compuerta como capacitor y nivel lógico.', tags: 'P = I²·RDS(on)' },
    { id: '18-rele', title: 'El relé', summary: 'Un electroimán que mueve contactos: bobina, contactos NA y NC, capacidad y cómo manejarlo desde un microcontrolador.', tags: 'I = V/R · NA · NC' },
    { id: '19-cargas-inductivas', title: 'Cargas inductivas y elección del interruptor', summary: 'El pico al apagar una bobina, el diodo de rueda libre, el puente H y cómo elegir entre BJT, MOSFET y relé.', tags: 'V = L·ΔI/Δt' },
    { id: '20-inductor-rl', title: 'El inductor y el circuito RL', summary: 'La bobina en un circuito: constante de tiempo L/R, energía almacenada y reactancia inductiva.', tags: 'τ = L/R · XL = 2πfL' },
    { id: '21-impedancia-filtros', title: 'Impedancia y filtros', summary: 'Cómo se combinan resistencia y reactancia, y cómo un par RC o RL deja pasar unas frecuencias y frena otras.', tags: 'fc = 1/(2πRC) · dB' },
    { id: '22-resonancia', title: 'Resonancia y circuitos LC', summary: 'Cuando la bobina y el capacitor se compensan: frecuencia de resonancia, factor Q y sintonía de radio.', tags: 'f₀ = 1/(2π√LC) · Q' },
    { id: '23-amplificador-operacional', title: 'El amplificador operacional', summary: 'El amplificador de precisión: realimentación negativa, las reglas del operacional ideal y las tres configuraciones básicas.', tags: 'Av = 1 + Rf/Rg · −Rf/Rin' },
    { id: '24-aplicaciones-operacional', title: 'Aplicaciones del operacional', summary: 'Comparadores con histéresis, sumadores, filtros activos y acondicionamiento de sensores.', tags: 'Schmitt · sumador · filtro activo' },
    { id: '25-logica', title: 'Lógica digital y compuertas', summary: 'Ceros y unos: niveles lógicos, compuertas, tablas de verdad y cómo se construyen con transistores.', tags: 'AND · OR · NOT · NAND' },
    { id: '26-entradas-adc', title: 'Entradas reales y conversión analógico-digital', summary: 'Pull-up, rebote de pulsadores, resolución de un ADC, muestreo y el PWM como conversor.', tags: 'LSB = Vref/2ⁿ · fs > 2f' },
    { id: '27-temporizador-555', title: 'El temporizador 555', summary: 'Un circuito integrado clásico que combina un circuito RC, comparadores y un flip-flop: monoestable y astable.', tags: 'T = 1,1·RC · f = 1,44/((R1+2R2)C)' },
    { id: '28-hoja-de-datos', title: 'Hojas de datos y elección de componentes', summary: 'Valores comerciales, potencia de los resistores, tensión de los capacitores y cómo se calienta un semiconductor.', tags: 'E12 · Tj = Ta + P·θ' },
    { id: '29-seguridad-masa-desacople', title: 'Seguridad, masa y desacople', summary: 'Corrientes peligrosas, tierra y masa, descargas electrostáticas, capacitores de desacople y aislación galvánica.', tags: 'I = V/R · 100 nF · aislación' },
    { id: '30-fuentes-cc', title: 'De dónde sale la tensión: fuentes de continua', summary: 'Una fuente no crea cargas, las separa: química, luz, calor, presión y movimiento, y el modelo común de fem más resistencia interna.', tags: 'V = E − I·r · Pmáx = E²/4r' },
    { id: '31-solar', title: 'Energía solar fotovoltaica', summary: 'Cómo una celda convierte luz en corriente, su curva I–V, el punto de máxima potencia y qué pasa con la sombra y el calor.', tags: 'I = Isc − I₀(e^(V/nVt) − 1)' },
    { id: '32-lab-cc-casero', title: 'Laboratorio casero: generar continua', summary: 'Pilas de limón y de monedas, termopar y módulo termoeléctrico, panel solar: cómo armarlos y cómo medir tensión, corriente y resistencia interna.', tags: 'Voc · Isc · r = (E − V)/I' },
    { id: '33-generador-ca', title: 'Cómo se genera la alterna: la espira en el campo', summary: 'Una espira que gira dentro de un campo magnético: flujo, ley de Faraday y por qué sale una senoide.', tags: 'ε = N·B·A·ω·sen(ωt) · f = p·n/60' },
    { id: '34-carga-y-campo', title: 'La carga y el campo: la reacción del generador', summary: 'Qué corriente circula, cómo esa corriente frena el rotor, cómo deforma el campo y por qué la carga se siente en el eje.', tags: 'τ = N·B·A·i·sen θ · Pmec = ε·i' },
    { id: '35-alternadores', title: 'Alternadores, trifásica y fuentes primarias', summary: 'Campo giratorio, número de polos, tres fases a 120° y qué hace girar el eje en una central, un auto o una bicicleta.', tags: 'f = p·n/60 · VL = √3·VF' },
    { id: '36-dinamo-cc', title: 'Dínamo y generadores de continua', summary: 'El conmutador como rectificador mecánico, cómo se alisa la salida y por qué un motor de continua también es un generador.', tags: 'V = ke·ω − I·Ra' },
    { id: '37-lab-movimiento', title: 'Laboratorio casero: generar con movimiento', summary: 'Bobina e imán, linterna de agitar, motor paso a paso y motor de juguete como generadores, y cómo sentir y medir la reacción de la carga.', tags: 'imán + bobina · puente + capacitor' },
    { id: '38-caracterizar-fuentes', title: 'Medir y comparar fuentes: el banco de pruebas', summary: 'Curva tensión–corriente, resistencia interna, regulación, rendimiento y ondulación: un protocolo común para cualquier fuente.', tags: 'r = (V₁ − V₂)/(I₂ − I₁) · η = V/E' },
  ];
})();
