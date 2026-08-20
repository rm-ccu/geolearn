// GeoLearn flags — the real flags, as images.
//
// This file has been through three versions. Emoji came first and were dropped
// because Windows ships no flag glyphs at all. Hand-drawn SVG specs came second:
// they matched the drawn bollard and plate swatches, but a stylised approximation
// of a coat of arms is exactly the wrong thing in a reference you're using to
// learn what a country actually looks like. These are the real flags — public
// domain artwork from flagcdn.com, rasterised at 160px wide and checked into
// flags/ so the page still makes no third-party requests and works offline.
//
// Flags are sized by HEIGHT, not width. Every flag then sits on the same baseline
// while keeping its true proportions — Switzerland is square, the UK and Canada
// are 2:1, most of Europe is 3:2 — instead of being stretched into one box. The
// rounded corners and drop shadow live in `.flag` in style.css.

// width / height of the checked-in image for each country, so the <img> can carry
// both dimensions up front and nothing reflows as the flags decode.
const FLAG_RATIO = {
  AD: 1.429, AL: 1.404, AR: 1.6,   AT: 1.495, AU: 2,     BA: 2,     BE: 1.151,
  BG: 1.667, BR: 1.429, BY: 2,     CA: 2,     CH: 1,     CY: 1.495, CZ: 1.495,
  DE: 1.667, DK: 1.322, EE: 1.569, ES: 1.495, FI: 1.633, FR: 1.495, GB: 2,
  GR: 1.495, HR: 2,     HU: 2,     IE: 2,     IS: 1.391, IT: 1.495, JP: 1.495,
  KR: 1.495, KZ: 2,     LI: 1.667, LU: 1.667, MC: 1.25,  MD: 2,     ME: 2,
  MK: 2,     NL: 1.495, NO: 1.379, NZ: 2,     PL: 1.6,   PT: 1.495, RO: 1.495,
  RS: 1.495, RU: 1.495, SE: 1.6,   SI: 2,     SK: 1.495, SM: 1.333, TR: 1.495,
  TW: 1.495, UA: 1.495, US: 1.905, ZA: 1.495,
};

// Stand-in for a country added to data.js before its flag lands in flags/.
function flagPlaceholder(name, height) {
  const width = Math.round(height * 1.5);
  return `<svg class="flag" width="${width}" height="${height}" viewBox="0 0 60 40"
    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of ${name} (missing)">
    <rect width="60" height="40" rx="3.5" fill="#2c2f35"/>
    <text x="30" y="26" text-anchor="middle" font-size="16" fill="#a6a9b0">?</text>
  </svg>`;
}

// `height` is the rendered height in CSS pixels; the width follows from the flag's
// own proportions. The images are 160px wide, so anything up to ~100px tall stays
// sharp on a 2x display.
function flagImg(code, name, height = 26) {
  const ratio = FLAG_RATIO[code];
  if (!ratio) return flagPlaceholder(name, height);
  const width = Math.round(height * ratio);
  return `<img class="flag" src="flags/${code.toLowerCase()}.png" width="${width}"
    height="${height}" loading="lazy" decoding="async" alt="Flag of ${name}">`;
}
