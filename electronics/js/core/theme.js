// Lee los tokens de color de CSS para que los canvas respeten el tema claro/oscuro.

(function () {
  const Elec = (window.Elec ??= {});

  const TOKENS = [
    'bg', 'surface', 'surface-2', 'text', 'muted', 'border', 'accent',
    'charge-pos', 'charge-neg', 'wire', 'heat', 'good', 'bad', 'grid',
  ];

  let cache = null;

  const camel = (token) => token.replace(/-(\w)/g, (_, ch) => ch.toUpperCase());

  function read() {
    const style = getComputedStyle(document.documentElement);
    return Object.fromEntries(
      TOKENS.map((token) => [camel(token), style.getPropertyValue(`--${token}`).trim()]),
    );
  }

  /** Colores actuales: { surface, text, accent, chargePos, chargeNeg, wire, ... } */
  function colors() {
    return (cache ??= read());
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => { cache = null; });

  Object.assign(Elec, { colors });
})();
