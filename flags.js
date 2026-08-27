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
  AD: 1.429,   AE: 2.0,     AF: 1.495,   AG: 1.495,   AL: 1.404,   AM: 2.0,
  AO: 1.495,   AR: 1.6,     AS: 2.0,     AT: 1.495,   AU: 2.0,     AX: 1.524,
  AZ: 2.0,     BA: 2.0,     BB: 1.495,   BD: 1.667,   BE: 1.151,   BF: 1.495,
  BG: 1.667,   BH: 1.667,   BI: 1.667,   BJ: 1.495,   BM: 2.0,     BN: 2.0,
  BO: 1.468,   BR: 1.429,   BS: 2.0,     BT: 1.495,   BW: 1.495,   BY: 2.0,
  BZ: 1.667,   CA: 2.0,     CC: 2.0,     CD: 1.333,   CF: 1.495,   CG: 1.495,
  CH: 1.0,     CI: 1.495,   CL: 1.495,   CM: 1.495,   CN: 1.495,   CO: 1.495,
  CR: 1.667,   CU: 2.0,     CV: 1.702,   CW: 1.495,   CX: 2.0,     CY: 1.495,
  CZ: 1.495,   DE: 1.667,   DJ: 1.495,   DK: 1.322,   DM: 2.0,     DO: 1.495,
  DZ: 1.495,   EC: 1.495,   EE: 1.569,   EG: 1.495,   ER: 2.0,     ES: 1.495,
  ET: 2.0,     FI: 1.633,   FJ: 2.0,     FM: 1.905,   FO: 1.379,   FR: 1.495,
  GA: 1.333,   GB: 2.0,     GD: 1.667,   GE: 1.495,   GH: 1.495,   GI: 2.0,
  GL: 1.495,   GM: 1.495,   GN: 1.495,   GQ: 1.495,   GR: 1.495,   GT: 1.6,
  GU: 1.86,    GW: 2.0,     GY: 1.667,   HK: 1.495,   HN: 2.0,     HR: 2.0,
  HT: 1.667,   HU: 2.0,     ID: 1.495,   IE: 2.0,     IM: 2.0,     IN: 1.495,
  IQ: 1.495,   IR: 1.758,   IS: 1.391,   IT: 1.495,   JE: 1.667,   JM: 2.0,
  JO: 2.0,     JP: 1.495,   KE: 1.495,   KG: 1.667,   KH: 1.569,   KI: 2.0,
  KM: 1.667,   KN: 1.495,   KP: 2.0,     KR: 1.495,   KW: 2.0,     KZ: 2.0,
  LA: 1.495,   LB: 1.495,   LC: 2.0,     LI: 1.667,   LK: 2.0,     LR: 1.905,
  LS: 1.495,   LT: 1.667,   LU: 1.667,   LV: 2.0,     LY: 2.0,     MA: 1.495,
  MC: 1.25,    MD: 2.0,     ME: 2.0,     MG: 1.495,   MH: 1.905,   MK: 2.0,
  ML: 1.495,   MM: 1.495,   MN: 2.0,     MO: 1.495,   MP: 2.0,     MR: 1.495,
  MT: 1.495,   MU: 1.495,   MV: 1.495,   MW: 1.495,   MX: 1.758,   MY: 2.0,
  MZ: 1.495,   NA: 1.495,   NE: 1.168,   NG: 2.0,     NI: 1.667,   NL: 1.495,
  NO: 1.379,   NP: 0.821,   NR: 2.0,     NZ: 2.0,     OM: 1.758,   PA: 1.495,
  PE: 1.495,   PG: 1.333,   PH: 2.0,     PK: 1.495,   PL: 1.6,     PN: 2.0,
  PR: 1.495,   PS: 2.0,     PT: 1.495,   PW: 1.6,     PY: 1.818,   QA: 2.54,
  RE: 1.495,   RO: 1.495,   RS: 1.495,   RU: 1.495,   RW: 1.495,   SA: 1.495,
  SB: 2.0,     SC: 2.0,     SD: 2.0,     SE: 1.6,     SG: 1.495,   SI: 2.0,
  SJ: 1.379,   SK: 1.495,   SL: 1.495,   SM: 1.333,   SN: 1.495,   SO: 1.495,
  SR: 1.495,   SS: 2.0,     ST: 2.0,     SV: 1.778,   SY: 1.495,   SZ: 1.495,
  TD: 1.495,   TG: 1.616,   TH: 1.495,   TJ: 2.0,     TL: 2.0,     TM: 1.495,
  TN: 1.495,   TO: 2.0,     TR: 1.495,   TT: 1.667,   TV: 2.0,     TW: 1.495,
  TZ: 1.495,   UA: 1.495,   UG: 1.495,   US: 1.905,   UY: 1.495,   UZ: 2.0,
  VA: 1.0,     VC: 1.495,   VE: 1.495,   VI: 1.495,   VN: 1.495,   VU: 1.667,
  WS: 2.0,     XK: 1.404,   YE: 1.495,   ZA: 1.495,   ZM: 1.495,   ZW: 2.0,
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
