// GeoLearn globe — an orthographic 3D globe drawn on a 2D canvas.
//
// No libraries: the projection, hit-testing, and easing are all here. Geometry
// comes from globe-data.js (WORLD_LAND / WORLD_DOTS), which must load first.
//
// Orientation is two angles, matching the projection maths below:
//   lambda — spin about the polar axis. Centre longitude is -lambda.
//   phi    — tilt. Centre latitude is +phi.
// zoom scales the sphere radius; the canvas simply crops whatever spills out.

const DEG = Math.PI / 180;
const clampDeg = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// The globe is a hollow wireframe shell: no ocean, no solid body, just outlines
// and the graticule, with the far side showing faintly through. Everything is a
// level of white, so the whole palette is alpha.
const W_ = (a) => `rgba(255,255,255,${a})`;

// Far-side detail is gone by this zoom level.
const FAR_FADE_ZOOM = 2.2;

const GLOBE_COLORS = {
  graticule:    W_(0.085),
  landEdge:     W_(0.26),    // countries with no entry in data.js: outline only
  coveredFill:  W_(0.15),
  coveredEdge:  W_(0.55),
  photoFill:    W_(0.06),   // in the guide, but photospheres only — no car has driven it
  photoEdge:    W_(0.34),
  peerFill:     W_(0.3),    // same region as the selection
  peerEdge:     W_(0.85),
  hoverFill:    W_(0.55),
  hoverEdge:    W_(0.95),
  selectedFill: W_(0.96),
  selectedEdge: "#ffffff",
  rim:          W_(0.34),
};

// Countries whose largest ring is narrower than this get a marker dot as well
// as (or instead of) a polygon — otherwise they are a sub-pixel smudge.
const DOT_SPAN = 3.2;
// Once zoomed in, a country with real geometry is a big enough target on its
// own, so its dot gets out of the way. The micro-states have no polygon at all
// and keep theirs at every zoom level.
const DOT_ZOOM_CUTOFF = 2.6;

// ---------- Geometry prep ----------
// Rings arrive as flat [lon,lat,...] degrees. Unit vectors are precomputed once
// so each frame only has to apply two rotations per point.
const toXYZ = (flat) => {
  const v = new Float32Array((flat.length / 2) * 3);
  for (let i = 0, o = 0; i < flat.length; i += 2, o += 3) {
    const lon = flat[i] * DEG, lat = flat[i + 1] * DEG;
    const cl = Math.cos(lat);
    v[o] = cl * Math.cos(lon);
    v[o + 1] = cl * Math.sin(lon);
    v[o + 2] = Math.sin(lat);
  }
  return v;
};

// The whole world, unpacked once and memoised. The interactive globe and the
// compare view's snapshots share the same prepared arrays, so opening Compare
// costs no geometry work at all.
let _geometry = null;
function globeGeometry() {
  if (_geometry) return _geometry;

  const shapes = WORLD_LAND.map(c => ({
    name: c.n,
    id: c.g || null,
    centre: c.c,
    span: c.s,
    rings: c.p,
    xyz: c.p.map(toXYZ),
    dot: !!c.g && c.s < DOT_SPAN,
  }));

  const dots = WORLD_DOTS.map(d => ({
    name: null, id: d.g, centre: d.c, span: 0.6, rings: [], xyz: [], dot: true,
  }));

  const all = shapes.concat(dots);
  const byCountryId = new Map(all.filter(s => s.id).map(s => [s.id, s]));
  const markers = all.filter(s => s.dot);
  for (const m of markers) m.hasPolygon = m.rings.length > 0;

  // Graticule: meridians every 30°, parallels every 30°, sampled finely enough
  // that they stay smooth when zoomed in.
  const graticule = [];
  for (let lon = -180; lon < 180; lon += 30) {
    const flat = [];
    for (let lat = -80; lat <= 80; lat += 3) flat.push(lon, lat);
    graticule.push(toXYZ(flat));
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const flat = [];
    for (let lon = -180; lon <= 180; lon += 3) flat.push(lon, lat);
    graticule.push(toXYZ(flat));
  }

  _geometry = { shapes, all, byCountryId, markers, graticule };
  return _geometry;
}


function createGlobe(canvas, opts = {}) {
  const ctx = canvas.getContext("2d");
  const onSelect = opts.onSelect || (() => {});
  const onHover = opts.onHover || (() => {});
  const onGesture = opts.onGesture || (() => {});

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Ids whose only panoramas are user photospheres, read straight off data.js so
  // the globe doesn't need its own copy of the coverage state.
  const photoOnly = new Set(
    (typeof COUNTRIES === "undefined" ? [] : COUNTRIES)
      .filter(c => c.coverage === "photospheres")
      .map(c => c.id)
  );

  // Geometry is prepared once for the whole page and shared with the compare
  // view's snapshots — see globeGeometry() above.
  const { shapes, byCountryId, markers, graticule } = globeGeometry();

  // ---------- View state ----------
  const view = { lambda: -12, phi: 26, zoom: 1 };
  let W = 0, H = 0, cx = 0, cy = 0, baseR = 0;
  let selectedId = null, hoverId = null, peerIds = new Set();
  let spinVel = 0, tiltVel = 0;      // inertia, degrees per frame
  let idleSince = performance.now();
  let flight = null;                 // active fly-to animation
  let dirty = true, rafId = null, visible = true, pageVisible = true;

  const MIN_ZOOM = 1, MAX_ZOOM = 5.5;
  const AUTO_SPIN = 3.2;             // degrees per second when idle
  const IDLE_DELAY = 2600;           // ms of quiet before the globe drifts again

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const easeInOut = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  // Shortest way round the circle, so flying from Japan to Portugal doesn't
  // unwind the long way through the Pacific.
  const shortAngle = (from, to) => ((((to - from) % 360) + 540) % 360) - 180;

  function requestRender() {
    dirty = true;
    if (rafId === null) rafId = requestAnimationFrame(frame);
  }

  // ---------- Sizing ----------
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2; cy = H / 2;
    baseR = Math.min(W, H) / 2 - 16;   // leaves room for the legend and caption
    requestRender();
  }

  // ---------- Projection ----------
  let cl = 1, sl = 0, cf = 1, sf = 0, R = 1;
  function syncTrig() {
    const l = view.lambda * DEG, f = view.phi * DEG;
    cl = Math.cos(l); sl = Math.sin(l);
    cf = Math.cos(f); sf = Math.sin(f);
    R = baseR * view.zoom;
  }

  // Writes screen coords into px/py; returns the depth (>0 means front-facing).
  let px = 0, py = 0;
  function project(x, y, z) {
    const x1 = x * cl - y * sl;
    const y1 = x * sl + y * cl;
    const x2 = x1 * cf + z * sf;
    const z2 = -x1 * sf + z * cf;
    px = cx + R * y1;
    py = cy - R * z2;
    return x2;
  }

  function projectLonLat(lon, lat) {
    const la = lat * DEG, lo = lon * DEG, c = Math.cos(la);
    return project(c * Math.cos(lo), c * Math.sin(lo), Math.sin(la));
  }

  // Screen point -> [lon, lat], or null when the point misses the sphere.
  function unproject(sx, sy) {
    const y1 = (sx - cx) / R, z2 = -(sy - cy) / R;
    const r2 = y1 * y1 + z2 * z2;
    if (r2 > 1) return null;
    const x2 = Math.sqrt(1 - r2);
    const x1 = x2 * cf - z2 * sf;
    const z = x2 * sf + z2 * cf;
    const x = x1 * cl + y1 * sl;
    const y = -x1 * sl + y1 * cl;
    return [Math.atan2(y, x) / DEG, Math.asin(clamp(z, -1, 1)) / DEG];
  }

  // ---------- Hit testing ----------
  function inRing(flat, lon, lat) {
    let inside = false;
    for (let i = 0, j = flat.length - 2; i < flat.length; j = i, i += 2) {
      const yi = flat[i + 1], yj = flat[j + 1];
      if ((yi > lat) !== (yj > lat)) {
        const xi = flat[i], xj = flat[j];
        if (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
      }
    }
    return inside;
  }

  const markerRadius = (m) => (m.id === selectedId || m.id === hoverId ? 5.5 : 3.6) + view.zoom * 0.35;
  const markerVisible = (m) => !m.hasPolygon || view.zoom < DOT_ZOOM_CUTOFF;

  function nearestMarker(sx, sy) {
    let best = null, bestDist = Infinity;
    for (const m of markers) {
      if (!markerVisible(m)) continue;
      if (projectLonLat(m.centre[0], m.centre[1]) <= 0) continue;
      const d = Math.hypot(px - sx, py - sy);
      if (d < bestDist) { best = m; bestDist = d; }
    }
    return best ? { marker: best, dist: bestDist, radius: markerRadius(best) } : null;
  }

  // Priority runs: the dot you actually clicked, then the country you are inside
  // of, then a near-miss on a dot. Without that middle step Slovenia's dot would
  // swallow clicks on the Austrian Alps, since a dot is drawn at every scale but
  // is only a few pixels wide.
  function shapeAt(sx, sy) {
    const near = nearestMarker(sx, sy);
    if (near && near.dist <= near.radius + 2) return near.marker;

    const ll = unproject(sx, sy);
    if (!ll) return near && near.dist <= near.radius + 8 ? near.marker : null;

    const [lon, lat] = ll;
    let fallback = null;
    for (const s of shapes) {
      for (const ring of s.rings) {
        if (inRing(ring, lon, lat)) {
          if (s.id) return s;      // countries in the guide take priority
          fallback = fallback || s;
        }
      }
    }
    if (near && near.dist <= near.radius + 8) return near.marker;
    return fallback;
  }

  // ---------- Drawing ----------
  function strokePath(xyz, side) {
    let started = false, drew = false;
    for (let o = 0; o < xyz.length; o += 3) {
      const depth = project(xyz[o], xyz[o + 1], xyz[o + 2]);
      if (side > 0 ? depth <= 0 : depth > 0) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
      drew = true;
    }
    return drew;
  }

  // Builds one closed ring for the near face (side = 1) or the far face (side = -1).
  // Points on the other face are pushed out to the limb, so a country straddling
  // the horizon stays sealed against the edge instead of collapsing into a wedge
  // across the sphere. Returns false when the ring has nothing on that face.
  function buildPath(xyz, side) {
    let any = false;
    ctx.beginPath();
    for (let o = 0; o < xyz.length; o += 3) {
      const depth = project(xyz[o], xyz[o + 1], xyz[o + 2]);
      const onThisFace = side > 0 ? depth > 0 : depth <= 0;
      let x = px, y = py;
      if (!onThisFace) {
        const dx = px - cx, dy = py - cy;
        const len = Math.hypot(dx, dy) || 1;
        x = cx + (dx / len) * R;
        y = cy + (dy / len) * R;
      } else any = true;
      if (o === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    return any;
  }

  // [fill, edge, lineWidth, glow]. A null fill is what makes a country read as
  // absent from the guide: it stays an empty outline while entries are solid.
  // Photosphere-only countries sit between the two — filled, but barely, because
  // a standard game will never drop you there.
  function colorsFor(s) {
    const C = GLOBE_COLORS;
    if (s.id && s.id === selectedId) return [C.selectedFill, C.selectedEdge, 1.5, 18];
    if (s.id && s.id === hoverId) return [C.hoverFill, C.hoverEdge, 1.3, 12];
    if (s.id && peerIds.has(s.id)) return [C.peerFill, C.peerEdge, 1, 0];
    if (s.id && photoOnly.has(s.id)) return [C.photoFill, C.photoEdge, 0.8, 0];
    if (s.id) return [C.coveredFill, C.coveredEdge, 0.9, 0];
    return [null, C.landEdge, 0.8, 0];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (!baseR) return;
    syncTrig();

    // Halo just outside the shell, and a barely-there wash inside it so the page
    // texture doesn't read straight through the wireframe.
    const halo = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.18);
    halo.addColorStop(0, "rgba(255,255,255,0.14)");
    halo.addColorStop(0.42, "rgba(255,255,255,0.05)");
    halo.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(10,11,13,0.45)";
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    // Everything is clipped to the disc, so pushed-to-limb points and zoomed-in
    // artefacts can never bleed outside the shell.
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.lineJoin = "round";

    // --- Far face: outlines only, faint enough to read as the inside of a shell.
    // It fades out as you zoom in. Seeing through the shell is the whole point at
    // globe scale, but close up the antipodes project right over what you are
    // looking at, and New Zealand's coastline drawn across Austria reads as
    // scratches on the canvas rather than as depth.
    const farFade = clamp((FAR_FADE_ZOOM - view.zoom) / 1.2, 0, 1);
    if (farFade > 0.01) {
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = W_(0.045 * farFade);
      ctx.beginPath();
      for (const g of graticule) strokePath(g, -1);
      ctx.stroke();

      // Each ring is stroked on its own: a ring with nothing on this face has
      // every point clamped to the limb, and drawing that leaves long chords
      // slashing across the view, so buildPath's result has to be honoured per
      // ring rather than batched blindly.
      ctx.strokeStyle = W_(0.09 * farFade);
      for (const shape of shapes) {
        for (const xyz of shape.xyz) {
          if (buildPath(xyz, -1)) ctx.stroke();
        }
      }
    }

    // --- Near face.
    ctx.lineWidth = 1;
    ctx.strokeStyle = GLOBE_COLORS.graticule;
    ctx.beginPath();
    for (const g of graticule) strokePath(g, 1);
    ctx.stroke();

    // Uncovered countries first, so the filled ones in the guide sit on top of
    // any shared border.
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = GLOBE_COLORS.landEdge;
    for (const shape of shapes) {
      if (shape.id) continue;
      for (const xyz of shape.xyz) {
        if (buildPath(xyz, 1)) ctx.stroke();
      }
    }

    for (const shape of shapes) {
      if (!shape.id) continue;
      const [fill, edge, lw, glow] = colorsFor(shape);
      for (const xyz of shape.xyz) {
        if (!buildPath(xyz, 1)) continue;
        if (glow) {
          ctx.shadowColor = "rgba(255,255,255,0.85)";
          ctx.shadowBlur = glow;
        }
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = lw;
        ctx.strokeStyle = edge;
        ctx.stroke();
      }
    }

    for (const m of markers) {
      if (!markerVisible(m)) continue;
      if (projectLonLat(m.centre[0], m.centre[1]) <= 0) continue;
      const [fill, edge, , glow] = colorsFor(m);
      const r = markerRadius(m);
      if (glow) {
        ctx.shadowColor = "rgba(255,255,255,0.85)";
        ctx.shadowBlur = glow;
      }
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = fill || "rgba(0,0,0,0)";
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = edge;
      ctx.stroke();
    }
    ctx.restore();

    // The rim is the only thing that states where the sphere actually is.
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = GLOBE_COLORS.rim;
    ctx.shadowColor = "rgba(255,255,255,0.5)";
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // ---------- Animation loop ----------
  function frame(now) {
    rafId = null;
    let animating = false;

    if (flight) {
      const t = clamp((now - flight.start) / flight.duration, 0, 1);
      const e = easeInOut(t);
      view.lambda = flight.fromL + flight.dL * e;
      view.phi = flight.fromP + flight.dP * e;
      view.zoom = flight.fromZ + flight.dZ * e;
      dirty = true;
      if (t >= 1) flight = null; else animating = true;
    } else if (Math.abs(spinVel) > 0.01 || Math.abs(tiltVel) > 0.01) {
      view.lambda += spinVel;
      view.phi = clamp(view.phi + tiltVel, -85, 85);
      spinVel *= 0.93;
      tiltVel *= 0.93;
      dirty = true;
      animating = true;
    } else if (canDrift() && now - idleSince > IDLE_DELAY) {
      view.lambda += AUTO_SPIN * (1 / 60);
      dirty = true;
      animating = true;
    }

    if (view.lambda > 180) view.lambda -= 360;
    if (view.lambda < -180) view.lambda += 360;

    if (dirty) { draw(); dirty = false; }
    // Keep ticking while a drift is merely pending, otherwise the loop would stop
    // during the idle delay and the globe would never start turning again. These
    // waiting frames redraw nothing — `dirty` stays false.
    if (animating || canDrift()) rafId = requestAnimationFrame(frame);
  }

  function canDrift() {
    return !reduceMotion && !selectedId && !dragging && !hoverId && visible && pageVisible;
  }

  function nudge() {
    idleSince = performance.now();
    requestRender();
  }

  // ---------- Flying ----------
  // Small countries get more zoom than big ones, but the ceiling is low on
  // purpose: past roughly 3x the limb leaves the frame entirely and the thing
  // stops reading as a globe at all.
  const zoomForSpan = (span) => clamp(50 / (span + 10), 1.2, 3);

  function flyTo(lon, lat, zoom, duration = 780) {
    const targetL = -lon, targetP = clamp(lat, -85, 85);
    spinVel = tiltVel = 0;
    if (reduceMotion) {
      view.lambda = targetL; view.phi = targetP; view.zoom = zoom;
      flight = null;
      requestRender();
      return;
    }
    flight = {
      start: performance.now(), duration,
      fromL: view.lambda, dL: shortAngle(view.lambda, targetL),
      fromP: view.phi, dP: targetP - view.phi,
      fromZ: view.zoom, dZ: zoom - view.zoom,
    };
    requestRender();
  }

  function zoomBy(factor, anchor) {
    const next = clamp(view.zoom * factor, MIN_ZOOM, MAX_ZOOM);
    if (next === view.zoom) return;
    // Zooming towards a point means re-centring on whatever is under it, damped
    // so the globe eases that way rather than snapping.
    if (anchor) {
      syncTrig();
      const ll = unproject(anchor[0], anchor[1]);
      if (ll) {
        const pull = 0.55;
        const targetL = -ll[0], targetP = clamp(ll[1], -85, 85);
        view.lambda += shortAngle(view.lambda, targetL) * pull;
        view.phi += (targetP - view.phi) * pull;
      }
    }
    view.zoom = next;
    flight = null;
    nudge();
  }

  // ---------- Pointer input ----------
  let dragging = false, moved = 0, downAt = 0, lastX = 0, lastY = 0;
  const pointers = new Map();
  let pinchDist = 0;

  canvas.addEventListener("pointerdown", (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchDist = Math.hypot(a[0] - b[0], a[1] - b[1]);
      dragging = false;
      return;
    }
    dragging = true;
    moved = 0;
    downAt = performance.now();
    lastX = e.clientX; lastY = e.clientY;
    spinVel = tiltVel = 0;
    flight = null;
    nudge();
  });

  canvas.addEventListener("pointermove", (e) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, [e.clientX, e.clientY]);

    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (pinchDist > 0 && Math.abs(d - pinchDist) > 1) zoomBy(d / pinchDist);
      pinchDist = d;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;

    if (dragging) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      // Convert pixels to degrees at the sphere's surface, so a drag tracks the
      // point under the cursor at any zoom level.
      const perPx = 57.3 / R;
      spinVel = dx * perPx;
      tiltVel = dy * perPx;
      view.lambda += spinVel;
      view.phi = clamp(view.phi + tiltVel, -85, 85);
      nudge();
      return;
    }

    syncTrig();
    const hit = shapeAt(sx, sy);
    setHover(hit && hit.id ? hit.id : null);
    onHover(hit ? { id: hit.id, name: hit.name, x: sx, y: sy } : null);
    canvas.style.cursor = hit && hit.id ? "pointer" : "grab";
  });

  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchDist = 0;
    if (!dragging) return;
    dragging = false;
    const rect = canvas.getBoundingClientRect();
    const quick = performance.now() - downAt < 500;
    if (moved < 6 && quick) {
      spinVel = tiltVel = 0;
      syncTrig();
      const hit = shapeAt(e.clientX - rect.left, e.clientY - rect.top);
      if (hit && hit.id) onSelect(hit.id);
      else onSelect(null, hit ? hit.name : null);
    }
    nudge();
  }

  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);

  canvas.addEventListener("pointerleave", () => {
    setHover(null);
    onHover(null);
  });

  canvas.addEventListener("dblclick", (e) => {
    const rect = canvas.getBoundingClientRect();
    zoomBy(1.6, [e.clientX - rect.left, e.clientY - rect.top]);
  });

  // Cooperative scrolling: a bare wheel scrolls the page as usual, ⌘/Ctrl (and
  // trackpad pinch, which arrives as ctrlKey) zooms the globe.
  canvas.addEventListener("wheel", (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      zoomBy(Math.exp(-e.deltaY * 0.01), [e.clientX - rect.left, e.clientY - rect.top]);
    } else {
      onGesture("scroll-hint");
    }
  }, { passive: false });

  canvas.addEventListener("keydown", (e) => {
    const step = 8 / view.zoom;
    switch (e.key) {
      case "ArrowLeft":  view.lambda -= step; break;
      case "ArrowRight": view.lambda += step; break;
      case "ArrowUp":    view.phi = clamp(view.phi - step, -85, 85); break;
      case "ArrowDown":  view.phi = clamp(view.phi + step, -85, 85); break;
      case "+": case "=": zoomBy(1.25); break;
      case "-": case "_": zoomBy(1 / 1.25); break;
      case "Escape": onSelect(null); return;
      default: return;
    }
    e.preventDefault();
    flight = null;
    nudge();
  });

  function setHover(id) {
    if (hoverId === id) return;
    hoverId = id;
    requestRender();
  }

  // ---------- Visibility / sizing observers ----------
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener("resize", resize);

  // Drifting off-screen or in a background tab is wasted battery.
  if (window.IntersectionObserver) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) nudge();
    }, { threshold: 0.05 }).observe(canvas);
  }
  document.addEventListener("visibilitychange", () => {
    pageVisible = !document.hidden;
    if (pageVisible) nudge();
  });

  resize();

  // ---------- Public API ----------
  return {
    resize,
    select(id, peers) {
      selectedId = id || null;
      peerIds = new Set(peers || []);
      const s = id ? byCountryId.get(id) : null;
      if (s) flyTo(s.centre[0], s.centre[1], zoomForSpan(s.span));
      nudge();
    },
    clear() {
      selectedId = null;
      peerIds = new Set();
      if (view.zoom > MIN_ZOOM + 0.01) {
        flyTo(-view.lambda, view.phi, MIN_ZOOM, 620);
      }
      nudge();
    },
    zoomIn: () => zoomBy(1.3),
    zoomOut: () => zoomBy(1 / 1.3),
    reset() {
      selectedId = null;
      peerIds = new Set();
      flyTo(12, 26, MIN_ZOOM, 700);
    },
    has: (id) => byCountryId.has(id),
  };
}

// A ring whose bounding box wraps the antimeridian has a meaningless midpoint
// longitude: Russia and Fiji are both stored at 0°E, one in the North Sea and
// one off west Africa. Their longitude is recovered as the mean direction of
// every vertex, which the wrap cannot confuse. Latitude never wraps, so the
// stored value stands — and it is the better answer anyway, since the Arctic
// coast carries more vertices than the southern border and would drag a mean
// latitude for Russia up past 71°N.
// The stored span goes the same way — 360° for both, which would tell the
// snapshot that Fiji is the size of a hemisphere. It is replaced by the widest
// angle any vertex makes with the recovered centre, doubled.
function displayShape(shape) {
  if (shape.display) return shape.display;

  let centre = shape.centre, span = shape.span;
  if (span >= 180) {
    let x = 0, y = 0;
    for (const xyz of shape.xyz) {
      for (let o = 0; o < xyz.length; o += 3) { x += xyz[o]; y += xyz[o + 1]; }
    }
    if (x || y) centre = [Math.atan2(y, x) / DEG, shape.centre[1]];

    const la = centre[1] * DEG, lo = centre[0] * DEG, cla = Math.cos(la);
    const ax = cla * Math.cos(lo), ay = cla * Math.sin(lo), az = Math.sin(la);
    let worst = 1;
    for (const xyz of shape.xyz) {
      for (let o = 0; o < xyz.length; o += 3) {
        const dot = xyz[o] * ax + xyz[o + 1] * ay + xyz[o + 2] * az;
        if (dot < worst) worst = dot;
      }
    }
    span = 2 * Math.acos(clampDeg(worst, -1, 1)) / DEG;
  }

  shape.display = { centre, span };
  return shape.display;
}

// Where a country sits, for anything that wants to say it in words rather than
// draw it. Returns [lon, lat], or null for an id the geometry has never heard of.
const globeCentre = (id) => {
  const s = globeGeometry().byCountryId.get(id);
  return s ? displayShape(s).centre : null;
};

// ---------- Static snapshots ----------
// The compare view wants to say "here, and here" without putting a second
// draggable globe on the page: one frozen frame per country, drawn straight
// onto a small canvas. Same projection and the same prepared geometry as the
// interactive globe, with everything that moves left out — no inertia, no
// hover, no far face, no hit-testing, no animation loop. There is no instance
// to hold on to: call it again to redraw.
//
// Two things differ from the big globe on purpose. The country is turned to
// face the viewer, so it is always dead centre on the near face rather than
// squashed against the limb. And land is filled rather than wireframed — at
// 130px a hollow outline is mush, and the whole job of the picture is to make
// one shape jump out of a continent.

const SNAP_LAND = W_(0.13);
const SNAP_GRATICULE = W_(0.07);

// Anything narrower than this gets a locator ring as well as the highlight.
// Half the dataset is a country you could cover with a fingernail at this size,
// and Monaco is quite literally a single pixel of accent colour.
const SNAP_RING_SPAN = 14;

function drawGlobeSnapshot(canvas, countryId, opts = {}) {
  const rect = canvas.getBoundingClientRect();
  // Compare renders while its view is still hidden, so the canvas has no size
  // yet. The caller redraws from a ResizeObserver once it does.
  if (!rect.width || !rect.height) return false;

  const geo = globeGeometry();
  const target = countryId ? geo.byCountryId.get(countryId) : null;
  const accent = opts.accent || "#ffffff";

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = rect.width, H = rect.height;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2, cy = H / 2;
  const R = Math.min(W, H) / 2 - 5;   // the glow needs a little room outside the rim
  if (R <= 4) return false;

  // Orientation, in the same two angles the interactive globe uses. The tilt is
  // held off the poles so the graticule never collapses to a point behind an
  // Arctic country and takes the sense of a sphere with it.
  const shown = target ? displayShape(target) : null;
  const lon = shown ? shown.centre[0] : 12;
  const lat = shown ? clampDeg(shown.centre[1], -74, 74) : 22;
  const cl = Math.cos(-lon * DEG), sl = Math.sin(-lon * DEG);
  const cf = Math.cos(lat * DEG), sf = Math.sin(lat * DEG);

  let px = 0, py = 0;
  const project = (x, y, z) => {
    const x1 = x * cl - y * sl;
    const y1 = x * sl + y * cl;
    const x2 = x1 * cf + z * sf;
    const z2 = -x1 * sf + z * cf;
    px = cx + R * y1;
    py = cy - R * z2;
    return x2;
  };

  // Near face only. A ring with nothing on this face is skipped rather than
  // clamped to the limb — there is no far side to keep sealed here.
  const nearRing = (xyz) => {
    let any = false;
    ctx.beginPath();
    for (let o = 0; o < xyz.length; o += 3) {
      const depth = project(xyz[o], xyz[o + 1], xyz[o + 2]);
      let x = px, y = py;
      if (depth <= 0) {
        const dx = px - cx, dy = py - cy;
        const len = Math.hypot(dx, dy) || 1;
        x = cx + (dx / len) * R;
        y = cy + (dy / len) * R;
      } else any = true;
      if (o === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    return any;
  };

  // Halo outside the shell, wash inside it — the same two gradients as the big
  // globe, so the pair read as the same object.
  const halo = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.16);
  halo.addColorStop(0, "rgba(255,255,255,0.12)");
  halo.addColorStop(0.42, "rgba(255,255,255,0.04)");
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(10,11,13,0.5)";
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();
  ctx.lineJoin = "round";

  ctx.lineWidth = 0.7;
  ctx.strokeStyle = SNAP_GRATICULE;
  ctx.beginPath();
  for (const g of geo.graticule) {
    let started = false;
    for (let o = 0; o < g.length; o += 3) {
      if (project(g[o], g[o + 1], g[o + 2]) <= 0) { started = false; continue; }
      if (started) ctx.lineTo(px, py); else { ctx.moveTo(px, py); started = true; }
    }
  }
  ctx.stroke();

  // Land, filled flat. Stroking each ring in its own fill colour thickens it by
  // half a pixel, which is the difference between an island chain showing up
  // and disappearing entirely.
  ctx.fillStyle = SNAP_LAND;
  ctx.strokeStyle = SNAP_LAND;
  ctx.lineWidth = 0.6;
  for (const shape of geo.shapes) {
    if (shape === target) continue;
    for (const xyz of shape.xyz) {
      if (!nearRing(xyz)) continue;
      ctx.fill();
      ctx.stroke();
    }
  }

  if (target) {
    ctx.shadowColor = accent;
    ctx.shadowBlur = 12;
    ctx.fillStyle = accent;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.2;
    let drew = false;
    for (const xyz of target.xyz) {
      if (!nearRing(xyz)) continue;
      ctx.globalAlpha = 0.92;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.stroke();
      drew = true;
    }
    // Micro-states have no polygon at all, and a country a couple of degrees
    // across paints fewer pixels than the ring around it. Both get a dot.
    if (!drew || shown.span < 2.5) {
      ctx.beginPath();
      ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    if (shown.span < SNAP_RING_SPAN) {
      const own = R * Math.sin((shown.span / 2) * DEG);
      const rr = Math.min(R * 0.55, Math.max(9, own + 6));
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.arc(cx, cy, rr + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.lineWidth = 1;
  ctx.strokeStyle = W_(0.3);
  ctx.stroke();

  return true;
}
