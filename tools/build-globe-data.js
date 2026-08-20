// Regenerates ../globe-data.js from Natural Earth 1:110m country boundaries.
//
//   node tools/build-globe-data.js
//
// Needs a network connection and nothing else — no npm install, no dependencies.
// Run it whenever you add a country to data.js, otherwise the new country will be
// in the list but not clickable on the globe.
//
// What it does: downloads the world-atlas TopoJSON, decodes the quantised arcs to
// absolute lon/lat, keeps outer rings only, drops specks, simplifies, rounds to 2
// decimals, and tags each country with the matching COUNTRIES id from data.js.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const TOL = 0.28;        // simplification tolerance, degrees
const MIN_DIAG = 1.1;    // drop rings smaller than this (degrees of bbox diagonal)

// Atlas names that differ from the names used in data.js.
const ALIAS = {
  "united states": "United States of America",
  "bosnia and herzegovina": "Bosnia and Herz.",
  "north macedonia": "Macedonia",
  "dominican republic": "Dominican Rep.",
  "eswatini": "eSwatini",
  "central african republic": "Central African Rep.",
  "republic of the congo": "Congo",
  "dr congo": "Dem. Rep. Congo",
  "equatorial guinea": "Eq. Guinea",
  "south sudan": "S. Sudan",
  "solomon islands": "Solomon Is.",
  "côte d'ivoire": "Côte d'Ivoire",
};

// Countries too small to survive 110m generalisation — they get marker dots.
const DOTS = {
  liechtenstein: [9.55, 47.16],
  monaco: [7.42, 43.74],
  "san marino": [12.46, 43.94],
  andorra: [1.52, 42.51],
  malta: [14.44, 35.9],
  "åland islands": [19.95, 60.18],
  "faroe islands": [-6.91, 62.01],
  gibraltar: [-5.35, 36.14],
  "isle of man": [-4.55, 54.24],
  jersey: [-2.11, 49.21],
  "svalbard and jan mayen": [15.65, 78.22],
  singapore: [103.82, 1.35],
  "hong kong": [114.17, 22.32],
  macau: [113.55, 22.2],
  "akrotiri and dhekelia": [33, 34.62],
  "christmas island": [105.68, -10.45],
  "cocos (keeling) islands": [96.87, -12.17],
  "são tomé and príncipe": [6.73, 0.34],
  réunion: [55.54, -21.11],
  "united states virgin islands": [-64.9, 18.34],
  curaçao: [-68.99, 12.17],
  bermuda: [-64.75, 32.31],
  guam: [144.79, 13.44],
  "northern mariana islands": [145.75, 15.19],
  "american samoa": [-170.7, -14.31],
  "pitcairn islands": [-130.1, -25.07],
  bahrain: [50.55, 26.07],
  maldives: [73.51, 4.18],
  "vatican city": [12.45, 41.9],
  "cape verde": [-23.6, 15.5],
  mauritius: [57.55, -20.28],
  seychelles: [55.45, -4.62],
  comoros: [43.33, -11.7],
  barbados: [-59.54, 13.19],
  "antigua and barbuda": [-61.8, 17.12],
  "saint kitts and nevis": [-62.73, 17.3],
  "saint lucia": [-60.98, 13.9],
  "saint vincent and the grenadines": [-61.2, 13.25],
  grenada: [-61.68, 12.11],
  dominica: [-61.37, 15.41],
  samoa: [-172.1, -13.76],
  tonga: [-175.2, -21.14],
  kiribati: [172.98, 1.35],
  tuvalu: [179.2, -8.52],
  nauru: [166.93, -0.53],
  palau: [134.58, 7.5],
  "marshall islands": [171.19, 7.09],
  micronesia: [158.21, 6.92],
};

function decodeArcs(topo) {
  const { scale: [sx, sy], translate: [tx, ty] } = topo.transform;
  return topo.arcs.map(arc => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * sx + tx, y * sy + ty];
    });
  });
}

let arcs = [];
const arcPoints = (i) => i < 0 ? arcs[~i].slice().reverse() : arcs[i];

function ringToPoints(ring) {
  const out = [];
  for (const idx of ring) {
    const pts = arcPoints(idx);
    for (let k = (out.length ? 1 : 0); k < pts.length; k++) out.push(pts[k]);
  }
  return out;
}

// Ring "size" as the diagonal of its bounding box in degrees — used to drop
// specks (tiny islands) that would only add bytes at globe scale.
function bbox(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return [x0, y0, x1, y1];
}
const bboxDiag = (b) => Math.hypot(b[2] - b[0], b[3] - b[1]);

// Douglas-Peucker on raw lon/lat. Tolerance is in degrees; at globe render
// sizes anything finer than this is sub-pixel.
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let maxD = -1, idx = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let d;
      if (len2 === 0) d = Math.hypot(px - ax, py - ay);
      else {
        let t = ((px - ax) * dx + (py - ay) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
      }
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

// Signed area in degrees^2 — only used to rank rings by size, so the planar
// approximation is fine.
function area(pts) {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
  }
  return Math.abs(a / 2);
}

function build(topo, COUNTRIES) {
  arcs = decodeArcs(topo);

  const out = [];
  for (const geom of topo.objects.countries.geometries) {
    const polys = geom.type === 'Polygon' ? [geom.arcs] : geom.arcs;
    let rings = polys.map(poly => ringToPoints(poly[0])); // outer ring only
    rings.sort((a, b) => area(b) - area(a));
    const biggest = rings[0];
    rings = rings.filter((r, i) => i === 0 || bboxDiag(bbox(r)) > MIN_DIAG);

    const simplified = rings.map(r => simplify(r, TOL)).filter(r => r.length >= 3);
    if (!simplified.length) continue;

    // Centroid + angular span come from the largest ring, so "fly to Russia"
    // lands on the Russian landmass rather than an Alaska-to-Kamchatka average.
    const b = bbox(biggest);
    out.push({
      n: geom.properties.name,
      c: [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2].map(v => +v.toFixed(2)),
      s: +Math.max(b[2] - b[0], b[3] - b[1]).toFixed(1),
      p: simplified.map(r => {
        const flat = [];
        let px = null, py = null;
        for (const [x, y] of r) {
          const rx = +x.toFixed(2), ry = +y.toFixed(2);
          if (rx === px && ry === py) continue;   // rounding can collapse neighbours
          flat.push(rx, ry);
          px = rx; py = ry;
        }
        return flat;
      }).filter(r => r.length >= 6),
    });
  }

  const byAtlasName = new Map(out.map(w => [w.n, w]));
  const dots = [];
  const unmatched = [];
  for (const c of COUNTRIES) {
    const key = c.name.toLowerCase();
    const hit = byAtlasName.get(ALIAS[key] || c.name);
    if (hit) hit.g = c.id;
    else if (DOTS[key]) dots.push({ g: c.id, c: DOTS[key] });
    else unmatched.push(c.name);
  }
  if (unmatched.length) {
    console.error('No 110m outline matches these entries in data.js:', unmatched.join(', '));
    console.error('Add an ALIAS for the Natural Earth spelling, or a DOTS entry if the country is tiny.');
    process.exit(1);
  }
  return { out, dots };
}

const line = (w) =>
  `{n:${JSON.stringify(w.n)}${w.g ? `,g:"${w.g}"` : ''},c:[${w.c}],s:${w.s},p:[${w.p.map(r => `[${r}]`).join(',')}]}`;

async function main() {
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`${SOURCE} returned ${res.status}`);
  const topo = await res.json();

  // data.js is a plain script declaring a const, so evaluate it and read it back.
  const COUNTRIES = (0, eval)(fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8') + ';COUNTRIES');

  const { out, dots } = build(topo, COUNTRIES);

  const file = `// Auto-generated globe geometry — do not hand-edit.
// Regenerate with: node tools/build-globe-data.js
//
// Source: Natural Earth 1:110m country boundaries (public domain) via the
// world-atlas package, decoded from TopoJSON, outer rings only, Douglas-Peucker
// simplified to ${TOL}° and rounded to 2 decimals.
//
// Each entry: n = display name, g = matching COUNTRIES id (absent when the country
// isn't in the guide), c = [lon,lat] centre of the largest ring, s = that ring's
// angular span in degrees, p = rings as flat [lon,lat,lon,lat,...] arrays.
const WORLD_LAND = [
${out.map(line).join(',\n')}
];

// Countries in the guide that are too small to draw at 1:110m. They render as
// clickable marker dots instead of polygons.
const WORLD_DOTS = [
${dots.map(d => `{g:"${d.g}",c:[${d.c}]}`).join(',\n')}
];
`;

  const dest = path.join(ROOT, 'globe-data.js');
  fs.writeFileSync(dest, file);
  const covered = out.filter(w => w.g).length + dots.length;
  console.log(`wrote ${path.relative(ROOT, dest)} — ${out.length} outlines, ` +
    `${covered}/${COUNTRIES.length} countries in the guide are clickable, ` +
    `${(fs.statSync(dest).size / 1024).toFixed(0)} KB`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
