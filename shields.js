// GeoLearn route shields — the US analogue of the bollard swatch.
//
// A state highway marker is the fastest state-level tell there is, and what
// matters is the family the marker belongs to rather than the exact artwork:
// a silhouette-shaped sign cuts fifty states to seventeen at a glance, a plain
// circle cuts them to six. So these are drawn to the family, from the
// `shield` field in states.js, with named emblems where a state has one.
//
// Everything is expressed as a fraction of `S`, the same convention bollardSVG
// uses, so one definition renders at 34px and 64px alike. The colours are the
// real sign colours, not the site palette — a route marker is white on black
// out in the world and copying that is the whole point of the swatch.

const SHIELD_INK = "#1b1d21";
const SHIELD_FACE = "#f7f7f4";

// Named emblems. Each returns the artwork drawn inside a size-S box; the blank
// behind it is added by shieldSVG.
const SHIELD_EMBLEMS = {
  // California's cutout spade — the one marker in the country that is not a
  // square, rectangle or circle blank.
  spade: (S) => `<path d="M${0.5*S} ${0.12*S}
      C${0.30*S} ${0.34*S} ${0.16*S} ${0.52*S} ${0.16*S} ${0.66*S}
      C${0.16*S} ${0.82*S} ${0.34*S} ${0.90*S} ${0.5*S} ${0.90*S}
      C${0.66*S} ${0.90*S} ${0.84*S} ${0.82*S} ${0.84*S} ${0.66*S}
      C${0.84*S} ${0.52*S} ${0.70*S} ${0.34*S} ${0.5*S} ${0.12*S} Z"
      fill="${SHIELD_FACE}" stroke="${SHIELD_INK}" stroke-width="${0.045*S}"/>`,

  keystone: (S) => `<path d="M${0.30*S} ${0.16*S} L${0.70*S} ${0.16*S} L${0.86*S} ${0.86*S} L${0.14*S} ${0.86*S} Z"
      fill="${SHIELD_FACE}" stroke="${SHIELD_INK}" stroke-width="${0.045*S}" stroke-linejoin="round"/>`,

  beehive: (S) => `<g fill="${SHIELD_FACE}" stroke="${SHIELD_INK}" stroke-width="${0.035*S}">
      <path d="M${0.5*S} ${0.16*S} C${0.72*S} ${0.16*S} ${0.84*S} ${0.42*S} ${0.84*S} ${0.60*S}
               C${0.84*S} ${0.78*S} ${0.70*S} ${0.86*S} ${0.5*S} ${0.86*S}
               C${0.30*S} ${0.86*S} ${0.16*S} ${0.78*S} ${0.16*S} ${0.60*S}
               C${0.16*S} ${0.42*S} ${0.28*S} ${0.16*S} ${0.5*S} ${0.16*S} Z"/>
    </g>
    <g stroke="${SHIELD_INK}" stroke-width="${0.03*S}" fill="none">
      <path d="M${0.26*S} ${0.44*S} H${0.74*S}"/><path d="M${0.19*S} ${0.60*S} H${0.81*S}"/>
      <path d="M${0.20*S} ${0.74*S} H${0.80*S}"/>
    </g>`,

  sunflower: (S) => {
    const petals = Array.from({ length: 12 }, (unused, i) => {
      const a = (i / 12) * Math.PI * 2;
      return `<ellipse cx="${0.5*S + Math.cos(a)*0.27*S}" cy="${0.51*S + Math.sin(a)*0.27*S}"
        rx="${0.11*S}" ry="${0.062*S}" fill="${SHIELD_FACE}" stroke="${SHIELD_INK}" stroke-width="${0.022*S}"
        transform="rotate(${(a*180)/Math.PI} ${0.5*S + Math.cos(a)*0.27*S} ${0.51*S + Math.sin(a)*0.27*S})"/>`;
    }).join("");
    return `${petals}<circle cx="${0.5*S}" cy="${0.51*S}" r="${0.17*S}" fill="${SHIELD_FACE}" stroke="${SHIELD_INK}" stroke-width="${0.035*S}"/>`;
  },

  // Four groups of four rays around a ring: New Mexico's Zia sun.
  zia: (S) => {
    const rays = [0, 90, 180, 270].map(deg => {
      const bars = [-0.075, -0.025, 0.025, 0.075].map(off =>
        `<rect x="${(0.5+off)*S - 0.014*S}" y="${0.10*S}" width="${0.028*S}" height="${0.15*S}" fill="${SHIELD_INK}"/>`
      ).join("");
      return `<g transform="rotate(${deg} ${0.5*S} ${0.51*S})">${bars}</g>`;
    }).join("");
    return `<circle cx="${0.5*S}" cy="${0.51*S}" r="${0.36*S}" fill="${SHIELD_FACE}"/>
      ${rays}<circle cx="${0.5*S}" cy="${0.51*S}" r="${0.135*S}" fill="none" stroke="${SHIELD_INK}" stroke-width="${0.055*S}"/>`;
  },

  triangle: (S) => `<path d="M${0.5*S} ${0.15*S} L${0.87*S} ${0.83*S} L${0.13*S} ${0.83*S} Z"
      fill="${SHIELD_FACE}" stroke="${SHIELD_INK}" stroke-width="${0.04*S}" stroke-linejoin="round"/>`,

  // Colorado's marker carries the state flag: blue, white, blue, with the red C
  // and its gold disc.
  flag: (S) => `<rect x="${0.10*S}" y="${0.20*S}" width="${0.80*S}" height="${0.60*S}" fill="#2a4b8d"/>
    <rect x="${0.10*S}" y="${0.38*S}" width="${0.80*S}" height="${0.24*S}" fill="${SHIELD_FACE}"/>
    <path d="M${0.46*S} ${0.28*S} A${0.22*S} ${0.22*S} 0 1 0 ${0.46*S} ${0.72*S}"
      fill="none" stroke="#c1443c" stroke-width="${0.10*S}"/>
    <circle cx="${0.42*S}" cy="${0.50*S}" r="${0.085*S}" fill="#f2c14e"/>`,

  // A head in profile, for Washington's George Washington bust.
  bust: (S) => `<circle cx="${0.5*S}" cy="${0.51*S}" r="${0.36*S}" fill="${SHIELD_FACE}"/>
    <path d="M${0.60*S} ${0.82*S} C${0.60*S} ${0.66*S} ${0.68*S} ${0.62*S} ${0.66*S} ${0.48*S}
             C${0.64*S} ${0.32*S} ${0.52*S} ${0.24*S} ${0.42*S} ${0.28*S}
             C${0.32*S} ${0.32*S} ${0.30*S} ${0.44*S} ${0.34*S} ${0.52*S}
             C${0.37*S} ${0.58*S} ${0.33*S} ${0.62*S} ${0.35*S} ${0.68*S}
             C${0.36*S} ${0.74*S} ${0.34*S} ${0.78*S} ${0.36*S} ${0.82*S} Z" fill="${SHIELD_INK}"/>`,

  // A craggy profile looking left: the Old Man of the Mountain.
  oldman: (S) => `<rect x="${0.12*S}" y="${0.14*S}" width="${0.76*S}" height="${0.72*S}" rx="${0.06*S}" fill="${SHIELD_FACE}"/>
    <path d="M${0.72*S} ${0.78*S} L${0.66*S} ${0.60*S} L${0.72*S} ${0.56*S} L${0.60*S} ${0.50*S}
             L${0.64*S} ${0.44*S} L${0.52*S} ${0.40*S} L${0.56*S} ${0.32*S} L${0.34*S} ${0.26*S}
             L${0.26*S} ${0.44*S} L${0.30*S} ${0.62*S} L${0.26*S} ${0.78*S} Z" fill="${SHIELD_INK}"/>`,
};

// The real silhouette, from state-outlines.js. The paths are authored in a 0..1
// box, so one transform drops any state into the sign at any size — and a
// generic blob would have taught the wrong shape, which is the entire clue.
function outlineArt(state, S) {
  const d = STATE_OUTLINES[state.id];
  if (!d) return "";
  const inset = 0.14, span = 0.72;
  return `<g transform="translate(${inset*S} ${inset*S}) scale(${span*S})">
    <path d="${d}" fill="${SHIELD_FACE}" stroke="${SHIELD_INK}" stroke-width="${0.006}"
      stroke-linejoin="round" vector-effect="non-scaling-stroke"/></g>`;
}

function shieldSVG(state, size = 64) {
  const S = size;
  const sh = state.shield;
  const blank = `<rect x="1" y="1" width="${S-2}" height="${S-2}" rx="${0.08*S}" fill="${SHIELD_INK}" stroke="#00000033"/>`;
  const label = (fill, y = 0.60) =>
    `<text x="${0.5*S}" y="${y*S}" text-anchor="middle" fill="${fill}"
      font-family="'Barlow Condensed', Haettenschweiler, sans-serif" font-weight="700"
      font-size="${0.26*S}" letter-spacing="${0.01*S}">${state.code}</text>`;

  let art;
  if (sh.symbol && SHIELD_EMBLEMS[sh.symbol]) {
    art = SHIELD_EMBLEMS[sh.symbol](S);
  } else if (sh.family === "circle") {
    art = `<circle cx="${0.5*S}" cy="${0.51*S}" r="${0.36*S}" fill="${SHIELD_FACE}"/>` + label(SHIELD_INK);
  } else if (sh.family === "square") {
    art = `<rect x="${0.14*S}" y="${0.16*S}" width="${0.72*S}" height="${0.68*S}" rx="${0.04*S}"
      fill="${SHIELD_FACE}" stroke="${SHIELD_INK}" stroke-width="${0.03*S}"/>` + label(SHIELD_INK, 0.61);
  } else if (sh.family === "diamond") {
    art = `<path d="M${0.5*S} ${0.13*S} L${0.87*S} ${0.51*S} L${0.5*S} ${0.89*S} L${0.13*S} ${0.51*S} Z"
      fill="${SHIELD_FACE}" stroke="${SHIELD_INK}" stroke-width="${0.03*S}" stroke-linejoin="round"/>` + label(SHIELD_INK);
  } else if (sh.family === "outline") {
    // The silhouette carries the meaning, so the code is dropped underneath it
    // rather than over it, where it would sit on top of a panhandle.
    art = outlineArt(state, S);
  } else {
    // `other` with no recorded emblem: a plain blank, honestly unadorned.
    art = `<rect x="${0.14*S}" y="${0.16*S}" width="${0.72*S}" height="${0.68*S}" rx="${0.04*S}"
      fill="none" stroke="${SHIELD_FACE}" stroke-width="${0.03*S}" stroke-dasharray="${0.06*S} ${0.05*S}"/>`
      + label(SHIELD_FACE, 0.61);
  }

  return `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg"
    role="img" aria-label="${state.name} route marker: ${sh.symbol || sh.family}">${blank}${art}</svg>`;
}
