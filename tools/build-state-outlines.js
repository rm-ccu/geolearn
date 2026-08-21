// Regenerates ../state-outlines.js from the us-atlas state boundaries.
//
//   node tools/build-state-outlines.js
//
// Needs a network connection and nothing else — no npm install, no dependencies,
// same as build-globe-data.js, and the same TopoJSON decoding.
//
// Seventeen states sign their highways with their own silhouette (see
// `shield.family` in states.js). Drawing those markers with a generic blob would
// teach the wrong shape, so the real outlines are generated here: decoded from
// TopoJSON, simplified, projected, and normalised into a 0..1 box so shieldSVG
// can drop each one into a sign at any size.
//
// Only outline-family states are emitted — nothing else is drawn from a
// silhouette, so nothing else needs the bytes.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const TOL = 0.09;        // simplification tolerance, degrees — finer than the globe's
const MIN_DIAG = 0.9;    // drop islands smaller than this (bbox diagonal, degrees)

let arcs = [];
const arcPoints = (i) => i < 0 ? arcs[~i].slice().reverse() : arcs[i];

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

function ringToPoints(ring) {
  const out = [];
  for (const idx of ring) {
    const pts = arcPoints(idx);
    for (let k = (out.length ? 1 : 0); k < pts.length; k++) out.push(pts[k]);
  }
  return out;
}

function bbox(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return [x0, y0, x1, y1];
}
const bboxDiag = (b) => Math.hypot(b[2] - b[0], b[3] - b[1]);

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

function area(pts) {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
  }
  return Math.abs(a / 2);
}

// Longitude degrees shrink with latitude, so raw lon/lat would draw every state
// too wide. Scaling x by cos(mean latitude) is enough at glyph size and keeps
// the tool dependency-free.
function toUnitPath(rings) {
  const all = rings.flat();
  const b = bbox(all);
  const k = Math.cos(((b[1] + b[3]) / 2) * Math.PI / 180);
  const proj = rings.map(r => r.map(([x, y]) => [x * k, y]));

  const pb = bbox(proj.flat());
  const w = pb[2] - pb[0], h = pb[3] - pb[1];
  const scale = 1 / Math.max(w, h);
  const ox = (1 - w * scale) / 2, oy = (1 - h * scale) / 2;

  return proj.map(r => {
    let d = "";
    let px = null, py = null;
    for (const [x, y] of r) {
      // y is flipped: latitude increases north, SVG's y increases down.
      const ux = +(ox + (x - pb[0]) * scale).toFixed(3);
      const uy = +(oy + (pb[3] - y) * scale).toFixed(3);
      if (ux === px && uy === py) continue;
      d += `${d ? "L" : "M"}${ux} ${uy}`;
      px = ux; py = uy;
    }
    return d ? d + "Z" : "";
  }).filter(Boolean).join("");
}

async function main() {
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`${SOURCE} returned ${res.status}`);
  const topo = await res.json();
  arcs = decodeArcs(topo);

  // Only the states that sign with their own silhouette need one drawn. That
  // also keeps Alaska out, whose Aleutian chain crosses the antimeridian and
  // normalises into an unusable smear. Rerun this if a state changes family.
  const STATES = (0, eval)(fs.readFileSync(path.join(ROOT, 'states.js'), 'utf8') + ';US_STATES')
    .filter(s => s.shield.family === 'outline');
  const byName = new Map(STATES.map(s => [s.name.toLowerCase(), s.id]));

  const paths = {};
  const unmatched = [];
  for (const geom of topo.objects.states.geometries) {
    const id = byName.get(String(geom.properties.name).toLowerCase());
    if (!id) { unmatched.push(geom.properties.name); continue; }

    const polys = geom.type === 'Polygon' ? [geom.arcs] : geom.arcs;
    let rings = polys.map(poly => ringToPoints(poly[0]));
    rings.sort((a, b) => area(b) - area(a));
    rings = rings.filter((r, i) => i === 0 || bboxDiag(bbox(r)) > MIN_DIAG);

    const simplified = rings.map(r => simplify(r, TOL)).filter(r => r.length >= 3);
    if (simplified.length) paths[id] = toUnitPath(simplified);
  }

  const missing = STATES.filter(s => !paths[s.id]).map(s => s.name);
  if (missing.length) console.error('No outline generated for:', missing.join(', '));
  void unmatched;   // every non-outline state and the territories land here by design

  const body = Object.keys(paths).sort()
    .map(id => `  ${JSON.stringify(id)}: ${JSON.stringify(paths[id])},`).join('\n');

  fs.writeFileSync(path.join(ROOT, 'state-outlines.js'), `// Auto-generated state silhouettes — do not hand-edit.
// Regenerate with: node tools/build-state-outlines.js
//
// Source: US Census cartographic boundaries via the us-atlas package (public
// domain), decoded from TopoJSON, outer rings only, Douglas-Peucker simplified
// to ${TOL}°, x scaled by cos(mean latitude), and normalised into a 0..1 box
// with y flipped for SVG. shieldSVG() drops these straight into a sign blank.

const STATE_OUTLINES = {
${body}
};
`);
  console.log(`Wrote state-outlines.js — ${Object.keys(paths).length} states`);
}

main().catch(e => { console.error(e); process.exit(1); });
