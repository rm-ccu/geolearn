// GeoLearn flags — drawn, not emoji.
//
// Emoji flags looked out of place next to the generated bollard/plate swatches and
// don't exist at all on Windows. These are built the same way everything else in
// the project is: from a small declarative spec, in SVG, at runtime.
//
// Every flag is authored in a fixed 60x40 viewBox, so `flagSVG(code, name, w)` only
// has to set width/height. At the sizes used here (30-46px wide) fine heraldry is
// sub-pixel, so emblems are deliberately stylised down to the shape you'd actually
// recognise in a thumbnail.

const FLAG_W = 60, FLAG_H = 40;

// ---------- Primitives ----------

// Bands, either horizontal or vertical. An entry is a colour, or [colour, weight]
// when the stripes aren't equal (Spain's 1:2:1, Canada's 1:2:1).
function flagBands(list, vertical) {
  const total = list.reduce((sum, b) => sum + (Array.isArray(b) ? b[1] : 1), 0);
  const extent = vertical ? FLAG_W : FLAG_H;
  let pos = 0, out = "";
  for (const entry of list) {
    const [color, weight] = Array.isArray(entry) ? entry : [entry, 1];
    const size = extent * weight / total;
    // The half-pixel overlap hides hairline seams between adjacent bands.
    out += vertical
      ? `<rect x="${pos}" y="0" width="${size + 0.5}" height="${FLAG_H}" fill="${color}"/>`
      : `<rect x="0" y="${pos}" width="${FLAG_W}" height="${size + 0.5}" fill="${color}"/>`;
    pos += size;
  }
  return out;
}

// Off-centre Scandinavian cross, optionally with a second cross inside it.
function nordicCross(bg, cross, inner) {
  let out = `<rect width="${FLAG_W}" height="${FLAG_H}" fill="${bg}"/>` +
    `<rect x="15.5" y="0" width="9" height="40" fill="${cross}"/>` +
    `<rect x="0" y="15.5" width="60" height="9" fill="${cross}"/>`;
  if (inner) {
    out += `<rect x="18.25" y="0" width="3.5" height="40" fill="${inner}"/>` +
           `<rect x="0" y="18.25" width="60" height="3.5" fill="${inner}"/>`;
  }
  return out;
}

function star(cx, cy, r, points = 5, innerRatio = 0.42, rotation = -90) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const rad = (rotation + (180 / points) * i) * Math.PI / 180;
    const dist = i % 2 ? r * innerRatio : r;
    pts.push(`${(cx + Math.cos(rad) * dist).toFixed(2)},${(cy + Math.sin(rad) * dist).toFixed(2)}`);
  }
  return `<polygon points="${pts.join(" ")}"`;
}

const whiteStar = (cx, cy, r) => star(cx, cy, r) + ` fill="#ffffff"/>`;

// Sun disc with tapering rays — Macedonia, Kazakhstan, Argentina, Taiwan.
function sunburst(cx, cy, rInner, rOuter, rays, color, width = 0.16) {
  let out = "";
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const spread = width;
    const p = (ang, rad) => `${(cx + Math.cos(ang) * rad).toFixed(2)},${(cy + Math.sin(ang) * rad).toFixed(2)}`;
    out += `<polygon points="${p(a - spread, rInner)} ${p(a, rOuter)} ${p(a + spread, rInner)}" fill="${color}"/>`;
  }
  return out + `<circle cx="${cx}" cy="${cy}" r="${rInner}" fill="${color}"/>`;
}

// A shield outline, used as the base for the Balkan coats of arms.
const shield = (cx, cy, w, h, fill, stroke) =>
  `<path d="M${cx - w / 2} ${cy - h / 2} L${cx + w / 2} ${cy - h / 2} L${cx + w / 2} ${cy + h * 0.1}` +
  ` Q${cx + w / 2} ${cy + h / 2} ${cx} ${cy + h / 2}` +
  ` Q${cx - w / 2} ${cy + h / 2} ${cx - w / 2} ${cy + h * 0.1} Z"` +
  ` fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="0.8"` : ""}/>`;

// Stylised double-headed eagle (Albania, Montenegro, Moldova). The real heraldry
// is unreadable below about 60px, so this is built from the parts that still
// register at thumbnail size: two beaked heads, notched wings, a fanned tail.
const doubleEagle = (color, cx = 30, cy = 20, s = 1) => `
  <g fill="${color}" transform="translate(${cx} ${cy}) scale(${s}) translate(-30 -20)">
    <path d="M30 16 L17 14.5 L20 18 L15.5 18.6 L19 21 L15.8 22.4 L20.5 24.6 L30 23.2 Z"/>
    <path d="M30 16 L43 14.5 L40 18 L44.5 18.6 L41 21 L44.2 22.4 L39.5 24.6 L30 23.2 Z"/>
    <path d="M30 12.6 L33.2 16 L33.2 26 L30 29.6 L26.8 26 L26.8 16 Z"/>
    <circle cx="25.4" cy="11.6" r="2.7"/>
    <path d="M23 10.6 L19.4 12.1 L23.2 13 Z"/>
    <path d="M27.4 14.6 L24.6 12.2 L26.8 10.9 L29.6 13.8 Z"/>
    <circle cx="34.6" cy="11.6" r="2.7"/>
    <path d="M37 10.6 L40.6 12.1 L36.8 13 Z"/>
    <path d="M32.6 14.6 L35.4 12.2 L33.2 10.9 L30.4 13.8 Z"/>
    <path d="M26.8 25.6 L24 31.4 L30 29.6 L36 31.4 L33.2 25.6 Z"/>
  </g>`;

// Maple leaf: the 11-point outline, kept symmetrical about x=30 so it stays
// balanced inside the white band.
const mapleLeaf = `<polygon fill="#d52b1e" points="${[
  [0, -10], [1.5, -5.5], [5, -6.5], [4, -3], [8, -4.5], [7.5, -1.5], [10, 0],
  [7.5, 2], [8.5, 4.5], [4.5, 4], [4.5, 7], [1.5, 5.5], [1.2, 10],
  [-1.2, 10], [-1.5, 5.5], [-4.5, 7], [-4.5, 4], [-8.5, 4.5], [-7.5, 2], [-10, 0],
  [-7.5, -1.5], [-8, -4.5], [-4, -3], [-5, -6.5], [-1.5, -5.5],
].map(([x, y]) => `${(30 + x * 1.12).toFixed(2)},${(20 + y * 1.12).toFixed(2)}`).join(" ")}"/>`;

// Union Jack, authored in the same 60x40 box so it can be scaled into a canton.
const unionJack = `
  <rect width="60" height="40" fill="#012169"/>
  <path d="M0 0 L60 40 M60 0 L0 40" stroke="#ffffff" stroke-width="8"/>
  <path d="M0 0 L60 40 M60 0 L0 40" stroke="#c8102e" stroke-width="3.4"/>
  <path d="M30 0 V40 M0 20 H60" stroke="#ffffff" stroke-width="13"/>
  <path d="M30 0 V40 M0 20 H60" stroke="#c8102e" stroke-width="7.5"/>`;

const canton = (content, sx = 0.5, sy = 0.5) =>
  `<g transform="scale(${sx} ${sy})">${content}</g>`;

// ---------- Specs ----------
// `h` / `v` = horizontal / vertical bands, `nordic` = [bg, cross, inner?],
// `raw` = hand-drawn, `over` = drawn on top of the bands.

const FLAG_SPECS = {
  // Plain band flags.
  DE: { h: ["#000000", "#dd0000", "#ffce00"] },
  AT: { h: ["#ed2939", "#ffffff", "#ed2939"] },
  NL: { h: ["#ae1c28", "#ffffff", "#21468b"] },
  RU: { h: ["#ffffff", "#0039a6", "#d52b1e"] },
  HU: { h: ["#ce2939", "#ffffff", "#477050"] },
  BG: { h: ["#ffffff", "#00966e", "#d62612"] },
  LU: { h: ["#ed2939", "#ffffff", "#00a1de"] },
  EE: { h: ["#4891d9", "#000000", "#ffffff"] },
  PL: { h: ["#ffffff", "#dc143c"] },
  MC: { h: ["#ce1126", "#ffffff"] },
  UA: { h: ["#0057b7", "#ffd700"] },
  LI: { h: ["#002b7f", "#ce1126"], over: `
    <path d="M13 6 L15.5 9 L18 6 L20.5 9 L23 6 L23 12 L13 12 Z" fill="#ffd83d"/>
    <circle cx="13" cy="5.4" r="1.2" fill="#ffd83d"/><circle cx="18" cy="5" r="1.3" fill="#ffd83d"/>
    <circle cx="23" cy="5.4" r="1.2" fill="#ffd83d"/>` },
  SM: { h: ["#ffffff", "#5eb6e4"], over: shield(30, 20, 11, 13, "#ffffff", "#c8a951") },

  FR: { v: ["#002654", "#ffffff", "#ce1126"] },
  IT: { v: ["#009246", "#ffffff", "#ce2b37"] },
  BE: { v: ["#000000", "#fae042", "#ed2939"] },
  IE: { v: ["#169b62", "#ffffff", "#ff883e"] },
  RO: { v: ["#002b7f", "#fcd116", "#ce1126"] },
  MD: { v: ["#0046ae", "#ffd200", "#cc092f"], over: `
    <circle cx="30" cy="20" r="6.5" fill="none" stroke="#a92b2b" stroke-width="1.2"/>
    ${doubleEagle("#a92b2b", 30, 20, 0.34)}` },
  AD: { v: ["#10069f", "#fedf00", "#d0103a"], over: shield(30, 20, 10, 12, "#fedf00", "#8a1a1a") },

  // Nordic crosses.
  DK: { nordic: ["#c8102e", "#ffffff"] },
  SE: { nordic: ["#006aa7", "#fecc00"] },
  NO: { nordic: ["#ef2b2d", "#ffffff", "#002868"] },
  FI: { nordic: ["#ffffff", "#003580"] },
  IS: { nordic: ["#02529c", "#ffffff", "#dc1e35"] },

  CH: { raw: `<rect width="60" height="40" fill="#d52b1e"/>
    <rect x="25.5" y="9" width="9" height="22" fill="#ffffff"/>
    <rect x="19" y="15.5" width="22" height="9" fill="#ffffff"/>` },

  GR: { raw: `${flagBands(["#0d5eaf", "#ffffff", "#0d5eaf", "#ffffff", "#0d5eaf", "#ffffff", "#0d5eaf", "#ffffff", "#0d5eaf"], false)}
    <rect width="22.2" height="22.2" fill="#0d5eaf"/>
    <rect x="8.6" y="0" width="5" height="22.2" fill="#ffffff"/>
    <rect x="0" y="8.6" width="22.2" height="5" fill="#ffffff"/>` },

  CZ: { raw: `<rect width="60" height="20" fill="#ffffff"/>
    <rect y="20" width="60" height="20" fill="#d7141a"/>
    <path d="M0 0 L28 20 L0 40 Z" fill="#11457e"/>` },

  JP: { raw: `<rect width="60" height="40" fill="#ffffff"/><circle cx="30" cy="20" r="11" fill="#bc002d"/>` },

  TR: { raw: `<rect width="60" height="40" fill="#e30a17"/>
    <circle cx="24" cy="20" r="9" fill="#ffffff"/>
    <circle cx="27.4" cy="20" r="7.2" fill="#e30a17"/>
    ${star(37.5, 20, 4.6)} fill="#ffffff"/>` },

  AL: { raw: `<rect width="60" height="40" fill="#e41e20"/>${doubleEagle("#000000", 30, 20, 1.02)}` },
  ME: { raw: `<rect width="60" height="40" fill="#c40308"/>
    <rect x="1.6" y="1.6" width="56.8" height="36.8" fill="none" stroke="#d4af37" stroke-width="2.6"/>
    ${doubleEagle("#d4af37", 30, 20, 0.78)}` },

  MK: { raw: `<rect width="60" height="40" fill="#d20000"/>
    ${sunburst(30, 20, 5.5, 34, 8, "#ffe600", 0.19)}` },

  CA: { raw: `${flagBands([["#d52b1e", 1], ["#ffffff", 2], ["#d52b1e", 1]], true)}${mapleLeaf}` },

  GB: { raw: unionJack },
  AU: { raw: `<rect width="60" height="40" fill="#012169"/>${canton(unionJack)}
    ${star(15, 30, 5, 7, 0.45)} fill="#ffffff"/>
    ${whiteStar(44, 8, 2.6)}${whiteStar(52, 19, 2.6)}${whiteStar(44, 32, 2.6)}
    ${whiteStar(37, 22, 2.2)}${whiteStar(47.5, 25, 1.5)}` },
  NZ: { raw: `<rect width="60" height="40" fill="#012169"/>${canton(unionJack)}
    ${star(46, 9, 3)} fill="#ffffff"/>${star(46, 9, 2)} fill="#c8102e"/>
    ${star(53, 20, 3)} fill="#ffffff"/>${star(53, 20, 2)} fill="#c8102e"/>
    ${star(46, 31, 3)} fill="#ffffff"/>${star(46, 31, 2)} fill="#c8102e"/>
    ${star(39, 20, 2.6)} fill="#ffffff"/>${star(39, 20, 1.7)} fill="#c8102e"/>` },

  US: { raw: `${flagBands(["#b22234", "#ffffff", "#b22234", "#ffffff", "#b22234", "#ffffff", "#b22234",
                            "#ffffff", "#b22234", "#ffffff", "#b22234", "#ffffff", "#b22234"], false)}
    <rect width="25" height="21.5" fill="#3c3b6e"/>
    ${(() => { let d = ""; for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++)
        d += `<circle cx="${3 + c * 5}" cy="${3.4 + r * 5}" r="1.15" fill="#ffffff"/>`; return d; })()}` },

  KR: { raw: `<rect width="60" height="40" fill="#ffffff"/>
    <path d="M30 11 a9 9 0 0 1 0 18 a4.5 4.5 0 0 1 0 -9 a4.5 4.5 0 0 0 0 -9" fill="#cd2e3a"/>
    <path d="M30 11 a9 9 0 0 0 0 18 a4.5 4.5 0 0 0 0 -9 a4.5 4.5 0 0 1 0 -9" fill="#0047a0"/>
    <circle cx="30" cy="15.5" r="4.5" fill="#cd2e3a"/><circle cx="30" cy="24.5" r="4.5" fill="#0047a0"/>
    <g fill="#000000">
      <rect x="8" y="7" width="8" height="1.5"/><rect x="8" y="9.6" width="8" height="1.5"/><rect x="8" y="12.2" width="8" height="1.5"/>
      <rect x="44" y="7" width="8" height="1.5"/><rect x="44" y="9.6" width="3.4" height="1.5"/><rect x="48.6" y="9.6" width="3.4" height="1.5"/><rect x="44" y="12.2" width="8" height="1.5"/>
      <rect x="8" y="26.3" width="3.4" height="1.5"/><rect x="12.6" y="26.3" width="3.4" height="1.5"/><rect x="8" y="28.9" width="8" height="1.5"/><rect x="8" y="31.5" width="3.4" height="1.5"/><rect x="12.6" y="31.5" width="3.4" height="1.5"/>
      <rect x="44" y="26.3" width="3.4" height="1.5"/><rect x="48.6" y="26.3" width="3.4" height="1.5"/><rect x="44" y="28.9" width="3.4" height="1.5"/><rect x="48.6" y="28.9" width="3.4" height="1.5"/><rect x="44" y="31.5" width="3.4" height="1.5"/><rect x="48.6" y="31.5" width="3.4" height="1.5"/>
    </g>` },

  TW: { raw: `<rect width="60" height="40" fill="#fe0000"/><rect width="30" height="20" fill="#000095"/>
    ${sunburst(15, 10, 3.4, 7.4, 12, "#ffffff", 0.1)}` },

  BR: { raw: `<rect width="60" height="40" fill="#009c3b"/>
    <polygon points="30,4 55,20 30,36 5,20" fill="#ffdf00"/>
    <circle cx="30" cy="20" r="8.4" fill="#002776"/>
    <path d="M22 17.6 Q30 25.4 38.2 17 L38.4 19.9 Q30 28.2 21.8 20.4 Z" fill="#ffffff"/>
    ${whiteStar(27, 16, 1)}${whiteStar(32, 15.4, 0.9)}${whiteStar(34.5, 18, 0.9)}${whiteStar(26, 24, 0.9)}` },

  PT: { raw: `${flagBands([["#046a38", 2], ["#da291c", 3]], true)}
    <circle cx="24" cy="20" r="7.4" fill="none" stroke="#ffe900" stroke-width="1.6"/>
    <circle cx="24" cy="20" r="4.4" fill="#ffffff" stroke="#da291c" stroke-width="1.2"/>` },

  ES: { raw: `${flagBands([["#aa151b", 1], ["#f1bf00", 2], ["#aa151b", 1]], false)}
    ${shield(17, 20, 8, 10, "#f1bf00", "#aa151b")}
    <rect x="14" y="16.5" width="6" height="4.6" fill="#aa151b" opacity="0.7"/>` },

  ZA: { raw: `<rect width="60" height="40" fill="#e03c31"/>
    <rect y="20" width="60" height="20" fill="#001489"/>
    <path d="M0 0 L26 20 L0 40 Z" fill="#000000"/>
    <path d="M0 0 L26 20 L0 40 Z" fill="none" stroke="#ffb81c" stroke-width="0"/>
    <path d="M-2 -4 L32 20 L-2 44 L-2 36 L21 20 L-2 4 Z" fill="#ffb81c"/>
    <path d="M-2 2 L27 20 L-2 38 L-2 32 L18 20 L-2 8 Z" fill="#007749"/>
    <path d="M60 14 L26 14 L26 26 L60 26 Z" fill="#007749"/>
    <path d="M60 11.5 L24 11.5 L24 14 L60 14 Z M60 26 L24 26 L24 28.5 L60 28.5 Z" fill="#ffffff"/>` },

  CY: { raw: `<rect width="60" height="40" fill="#ffffff"/>
    <path d="M21.5 15.5 L27 13.8 L34 14.6 L38.5 13.4 L44 15.8 L38 17.4 L33 19.6 L26.5 19.8 L22.5 18.2 Z"
          fill="#d57800"/>
    <path d="M25.5 23 Q30 28.6 34.5 23" fill="none" stroke="#4e5b31" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M28 23.4 Q30 27 32 23.4" fill="none" stroke="#4e5b31" stroke-width="1.2" stroke-linecap="round"/>` },

  KZ: { raw: `<rect width="60" height="40" fill="#00afca"/>
    ${sunburst(33, 17, 4.4, 9.4, 16, "#fec50c", 0.07)}
    <path d="M24 26 Q33 21.5 42 26 Q33 24.5 24 26 Z" fill="#fec50c"/>
    <g fill="#fec50c" opacity="0.9">
      <rect x="4" y="6" width="1.6" height="28"/><circle cx="7.6" cy="12" r="1.2"/>
      <circle cx="7.6" cy="20" r="1.2"/><circle cx="7.6" cy="28" r="1.2"/>
    </g>` },

  BY: { raw: `<rect width="60" height="40" fill="#c8313e"/>
    <rect y="26.7" width="60" height="13.3" fill="#4aa657"/>
    <rect width="9" height="40" fill="#ffffff"/>
    <g fill="#c8313e">
      <polygon points="4.5,5 6.8,8 4.5,11 2.2,8"/><polygon points="4.5,15 6.8,18 4.5,21 2.2,18"/>
      <polygon points="4.5,25 6.8,28 4.5,31 2.2,28"/><polygon points="4.5,34 6.4,36.4 4.5,38.8 2.6,36.4"/>
    </g>` },

  BA: { raw: `<rect width="60" height="40" fill="#002395"/>
    <polygon points="16,2 46,2 46,38" fill="#fecb00"/>
    <g fill="#ffffff">
      ${whiteStar(13.5, 6, 2.2)}${whiteStar(20, 12, 2.2)}${whiteStar(26.5, 18, 2.2)}
      ${whiteStar(33, 24, 2.2)}${whiteStar(39.5, 30, 2.2)}${whiteStar(46, 36, 2.2)}
    </g>` },

  HR: { h: ["#ff0000", "#ffffff", "#171796"], over: `
    ${shield(30, 19, 11, 13, "#ffffff", "#171796")}
    <g fill="#ff0000">
      <rect x="25" y="13.5" width="2.5" height="2.5"/><rect x="30" y="13.5" width="2.5" height="2.5"/>
      <rect x="27.5" y="16" width="2.5" height="2.5"/><rect x="32.5" y="16" width="2.5" height="2.5"/>
      <rect x="25" y="18.5" width="2.5" height="2.5"/><rect x="30" y="18.5" width="2.5" height="2.5"/>
      <rect x="27.5" y="21" width="2.5" height="2.5"/>
    </g>` },

  RS: { h: ["#c6363c", "#0c4076", "#ffffff"], over: `
    ${shield(20, 20, 10, 12, "#c6363c", "#ffffff")}
    <rect x="19.2" y="15" width="1.6" height="9" fill="#ffffff"/>
    <rect x="16" y="18" width="8" height="1.6" fill="#ffffff"/>` },

  SK: { h: ["#ffffff", "#0b4ea2", "#ee1c25"], over: `
    ${shield(19, 20, 10, 12, "#ee1c25", "#ffffff")}
    <rect x="18.2" y="14.6" width="1.7" height="10" fill="#ffffff"/>
    <rect x="15.4" y="17" width="7.3" height="1.7" fill="#ffffff"/>
    <rect x="14.4" y="20.4" width="9.3" height="1.7" fill="#ffffff"/>` },

  SI: { h: ["#ffffff", "#0b4ea2", "#ff0000"], over: `
    ${shield(19, 18, 10, 12, "#0b4ea2", "#ffffff")}
    <path d="M15 21 L19 15.5 L23 21 Z" fill="#ffffff"/>
    ${whiteStar(16.6, 13.6, 1.5)}${whiteStar(21.4, 13.6, 1.5)}${whiteStar(19, 11.4, 1.5)}` },

  AR: { h: ["#74acdf", "#ffffff", "#74acdf"], over: sunburst(30, 20, 3.2, 6.4, 16, "#f6b40e", 0.07) },

  _unknown: { raw: `<rect width="60" height="40" fill="#2c2f35"/>
    <text x="30" y="25" text-anchor="middle" font-size="14" fill="#a6a9b0">?</text>` },
};

// ---------- Renderer ----------

let _flagUid = 0;

function flagSVG(code, name, width = 34) {
  const spec = FLAG_SPECS[code] || FLAG_SPECS._unknown;
  const uid = "flag-" + (++_flagUid);

  let body;
  if (spec.raw) body = spec.raw;
  else if (spec.nordic) body = nordicCross(...spec.nordic);
  else if (spec.h) body = flagBands(spec.h, false);
  else if (spec.v) body = flagBands(spec.v, true);
  else body = FLAG_SPECS._unknown.raw;
  if (spec.over) body += spec.over;

  const height = +(width * FLAG_H / FLAG_W).toFixed(2);
  return `<svg class="flag" width="${width}" height="${height}" viewBox="0 0 ${FLAG_W} ${FLAG_H}"
    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of ${name}">
    <defs><clipPath id="${uid}"><rect width="${FLAG_W}" height="${FLAG_H}" rx="3.5"/></clipPath></defs>
    <g clip-path="url(#${uid})">${body}</g>
    <rect x="0.6" y="0.6" width="${FLAG_W - 1.2}" height="${FLAG_H - 1.2}" rx="3.2"
          fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="1.2"/>
  </svg>`;
}
