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

  // Countries whose largest ring is narrower than this get a marker dot as well
  // as (or instead of) a polygon — otherwise they are a sub-pixel smudge.
  const DOT_SPAN = 3.2;
  // Once zoomed in, a country with real geometry is a big enough target on its
  // own, so its dot gets out of the way. The micro-states have no polygon at all
  // and keep theirs at every zoom level.
  const DOT_ZOOM_CUTOFF = 2.6;

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
