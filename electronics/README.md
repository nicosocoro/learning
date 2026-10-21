# Electrónica

Esta es la sección de **electrónica** del proyecto personal de aprendizaje de física. Es un libro interactivo de 38 capítulos, desde voltaje y corriente hasta seguridad, práctica de banco y generación de energía eléctrica.

## Secciones del libro

| Parte | Tema | Qué se aprende |
|---|---|---|
| I · Fundamentos | Voltaje, corriente, ley de Ohm, resistencias | Las magnitudes básicas y cómo se relacionan |
| II · Fuentes de energía e instrumentos | Baterías y multímetro | De dónde sale la energía y cómo medirla |
| III · Componentes y señales | Capacitores, diodos y LED, CC vs CA, onda senoidal, frecuencia, osciloscopio | Componentes básicos y cómo se comportan las señales en el tiempo |
| IV · Electromagnetismo y transformación | Inducción y transformadores | Cómo los campos magnéticos generan tensión |
| V · Transistores y relés | BJT, interruptor, amplificador, MOSFET, relé y cargas inductivas | Controlar y amplificar corriente |
| VI · Filtros y análisis de alterna | Inductor y RL, impedancia y filtros, resonancia | Cómo responden los circuitos según la frecuencia |
| VII · Amplificadores operacionales | Realimentación negativa y aplicaciones | El bloque analógico más versátil |
| VIII · Electrónica digital | Lógica, entradas reales y ADC, temporizador 555 | Pasar de lo analógico a lo digital |
| IX · Práctica de banco | Hojas de datos, calor, seguridad, masa y desacople | Lo necesario para armar circuitos reales |
| X · Generación de energía eléctrica | Fuentes de continua, solar, generador de alterna, reacción de la carga, alternadores, dínamo y laboratorios caseros | De dónde sale la tensión (continua y alterna) y cómo medirla |

Cada capítulo tiene teoría, figuras, un laboratorio con simulación interactiva y un cuestionario. Abrí `index.html` para empezar.

A continuación, la documentación técnica del sitio.

## Cómo está hecho

Sitio estático (HTML, CSS y JS vanilla, sin build ni dependencias) con teoría de electrónica básica y simulaciones animadas que muestran las fórmulas con valores en vivo.

## Cómo abrirlo

Hacer doble clic en `index.html`. No necesita servidor: los scripts son clásicos (no módulos ES), así que funcionan desde `file://`.

Cada archivo de `js/` es una función autoejecutable que lee y publica sus funciones en el objeto global `Elec`. Por eso **el orden de los `<script>` importa** (primero `core/` en el orden de las lecciones, al final la simulación).

## Estilo

Tipografía serif y papel crema (modo claro) o pizarra verde con tiza (modo oscuro, según el sistema). Los colores están como variables CSS en `css/base.css`; los canvas los leen desde `theme.js`.

## Estructura

```
index.html            portada con el índice del libro
lessons/              un capítulo por página (teoría + figuras + ejemplos reales + laboratorio + cuestionario)
css/                  base (tokens claro/oscuro), components, lesson
js/core/              piezas reutilizables
js/sims/              una simulación por capítulo (38 capítulos)
js/quizzes/           las preguntas de cada capítulo
.cursor/rules/        reglas para Cursor: qué debe tener cada lección y cómo escribirla
```

El libro tiene diez partes:

| Parte | Capítulos |
|---|---|
| I · Fundamentos | 1 a 3 |
| II · Fuentes de energía e instrumentos | 4 y 5 |
| III · Componentes y señales | 6 a 11 |
| IV · Electromagnetismo y transformación | 12 y 13 |
| V · Transistores y relés | 14 a 19: BJT, interruptor, amplificador, MOSFET, relé y cargas inductivas |
| VI · Filtros y análisis de alterna | 20 a 22: inductor y RL, impedancia y filtros, resonancia |
| VII · Amplificadores operacionales | 23 y 24: realimentación negativa y aplicaciones |
| VIII · Electrónica digital | 25 a 27: lógica, entradas reales y ADC, temporizador 555 |
| IX · Práctica de banco | 28 y 29: hojas de datos y calor, seguridad, masa y desacople |
| X · Generación de energía eléctrica | 30 a 38: fuentes de continua, energía solar, laboratorio de continua, la espira en el campo, la carga y el campo, alternadores y trifásica, dínamo, laboratorio de movimiento y banco de pruebas de fuentes |

## Qué tiene cada capítulo

Cuatro partes obligatorias, en este orden:

1. **Teoría**: secciones con ecuaciones, analogías, ejemplos de la vida real y ejemplos resueltos con números.
2. **Figuras**: al menos dos diagramas SVG en línea (`<figure class="figure">`), pegados al texto que ilustran.
3. **Laboratorio**: una simulación interactiva con controles, gráfica opcional y fórmulas en vivo, más 4 o 5 experimentos para probar.
4. **Cuestionario**: 5 a 7 preguntas conceptuales con explicación.

Esa estructura (y cómo escribir cada parte) está en `.cursor/rules/`: `project.mdc` (convenciones generales), `lesson-structure.mdc`, `svg-figures.mdc`, `sims-and-quizzes.mdc` y `new-chapter.mdc` (pasos para sumar un capítulo).

### `js/core`

| Archivo | Para qué sirve |
|---|---|
| `sim.js` | `mountSim()`: arma canvas, botones, controles y panel de fórmulas y arranca el bucle |
| `sim-loop.js` | Animación con play/pausa/velocidad |
| `canvas.js` | Canvas HiDPI y dibujo de batería, resistor, flechas, cargas |
| `parts.js` | Símbolos de transistor bipolar, MOSFET, amplificador operacional, compuertas lógicas, lámpara, LED, bobina, interruptor y tierra; polos de un imán y espira de canto para los generadores |
| `flow.js` | `FlowPath`: cargas que se mueven por un camino (corriente) |
| `controls.js` | Sliders y selectores segmentados |
| `formula-panel.js` | Fórmula simbólica + fórmula con valores sustituidos |
| `chart.js` | Gráfica de líneas simple en canvas |
| `units.js` | Formato con coma decimal y prefijos SI (`si(0.012, 'A')` → `12 mA`) |
| `theme.js` | Colores de CSS para el canvas (tema claro/oscuro automático) |
| `audio.js` | `createTone()`: tono de prueba con Web Audio (capítulo de frecuencia) |
| `lessons-data.js` | Índice del libro (títulos, partes, resúmenes) |
| `progress.js` | Progreso en `localStorage`: capítulo donde quedó, posición de lectura, capítulos completados y mejor resultado |
| `quiz.js` | Cuestionario de fin de capítulo con respuesta y explicación al instante |
| `site.js` | Arma cabecera, panel lateral de índice, navegación, pie y portada a partir de `lessons-data.js` y el progreso |

## Progreso y cuestionarios

Cada capítulo termina con 5 a 7 preguntas conceptuales (no de memorizar fórmulas). Cada respuesta dice al instante si fue correcta y por qué. Con al menos el 70 % de aciertos el capítulo queda **completado**.

Se guarda en `localStorage` del navegador: capítulos completados, mejor resultado y dónde quedaste (el botón *Continuar* de la portada vuelve a esa posición de lectura). El panel **Índice** se puede abrir y cerrar; el botón *Borrar mi progreso* lo reinicia.

Las preguntas viven en `js/quizzes/<capítulo>.js`: `{ q, correct, wrong: [...], explain }`. Las opciones se mezclan en cada intento.

## Referencias cruzadas

Cuando un capítulo nombra un concepto que se desarrolla en otro (por ejemplo la ley de Faraday o el diodo), lo enlaza con `<a class="xref" href="12-induccion.html#faraday">`. Los títulos de sección con ancla llevan `id` (`h2 id="faraday"`). Al agregar o renombrar capítulos, el progreso guardado se migra con el mapa `RENAMED` de `js/core/progress.js`.

## Figuras

Los diagramas de las lecciones son SVG en línea con las clases `fg-*` de `css/lesson.css`, que usan los mismos colores del tema (claro/oscuro). Los colores se pasan en `style="fill:var(--x)"`: Firefox no resuelve `var()` en atributos como `fill="..."`.

## Agregar una lección

Ver `.cursor/rules/new-chapter.mdc` para el procedimiento completo y `.cursor/rules/lesson-structure.mdc` para lo que no puede faltar. En resumen:

1. Copiar una página de `lessons/`, cambiar la teoría y agregar el capítulo en `js/core/lessons-data.js` (así aparece en el índice y en la navegación).
2. Crear `js/sims/mi-simulacion.js` con esta forma:

```js
(function () {
  const { mountSim } = window.Elec;

  mountSim(document.querySelector('[data-sim]'), {
    label: 'Descripción accesible del canvas',
    controls: [{ key: 'v', label: 'Tensión', min: 1, max: 12, step: 1, value: 9, unit: 'V' }],
    setup({ params }) {
      return {
        step(dt) { /* avanzar la física dt segundos */ },
        draw(view, colors) { const ctx = view.begin(); /* dibujar */ },
        formulas() { return [{ name: '...', sym: 'V = I · R', val: 'V = 9 V' }]; },
        reset() {},
      };
    },
  });
})();
```

3. Escribir las preguntas en `js/quizzes/<id>.js`, y en la lección incluir `<section data-quiz></section>` y cargar su archivo y `core/quiz.js`.
4. En la lección, cargar los mismos `<script src="../js/core/...">` que las demás (empezando por `lessons-data.js`, `progress.js` y `site.js`) y luego `<script src="../js/sims/mi-simulacion.js">`. Sumar la tarjeta en `index.html`.
