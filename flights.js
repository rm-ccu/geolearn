// GeoLearn ambient background — a flight tracker running behind the whole page.
//
// It is a simulation, not a live feed: the airports and the routes between them
// are real, but the aircraft are generated here. A live feed would mean an API
// key, a network round-trip, and a page that breaks on file:// — none of which is
// worth it for something whose entire job is to add depth behind the content.
//
// Reuses WORLD_LAND from globe-data.js for the coastlines, so it costs no extra
// data. Draws nothing interactive and never captures pointer events.
//
// Two stacked canvases: #flightMap holds the coastlines, graticule, airports and
// route corridors, all of which are static and drawn only on resize, and
// #flightField holds the aircraft and their trails. Keeping them apart means the
// animated layer never has to repaint the map underneath it.

// [lon, lat] of major international airports.
const AIRPORTS = {
  JFK: [-73.78, 40.64], LAX: [-118.41, 33.94], ORD: [-87.90, 41.98], ATL: [-84.43, 33.64],
  SFO: [-122.38, 37.62], DFW: [-97.04, 32.90], MIA: [-80.29, 25.79], YYZ: [-79.63, 43.68],
  YVR: [-123.18, 49.19], MEX: [-99.07, 19.44], GRU: [-46.47, -23.43], EZE: [-58.54, -34.82],
  BOG: [-74.15, 4.70], LIM: [-77.11, -12.02], SCL: [-70.79, -33.39],
  LHR: [-0.45, 51.47], CDG: [2.55, 49.01], AMS: [4.76, 52.31], FRA: [8.56, 50.03],
  MAD: [-3.56, 40.47], BCN: [2.08, 41.30], FCO: [12.25, 41.80], MUC: [11.79, 48.35],
  ZRH: [8.55, 47.46], VIE: [16.57, 48.11], CPH: [12.66, 55.62], ARN: [17.92, 59.65],
  OSL: [11.10, 60.19], HEL: [24.96, 60.32], DUB: [-6.25, 53.43], LIS: [-9.13, 38.77],
  IST: [28.75, 41.28], SVO: [37.41, 55.97], WAW: [20.97, 52.17], PRG: [14.26, 50.10],
  ATH: [23.95, 37.94], KEF: [-22.62, 63.99],
  DXB: [55.36, 25.25], DOH: [51.61, 25.27], TLV: [34.89, 32.01], CAI: [31.41, 30.11],
  JNB: [28.25, -26.14], CPT: [18.60, -33.97], NBO: [36.93, -1.32], LOS: [3.32, 6.58],
  CMN: [-7.59, 33.37],
  DEL: [77.10, 28.56], BOM: [72.87, 19.09], BKK: [100.75, 13.69], SIN: [103.99, 1.36],
  HKG: [113.91, 22.31], PVG: [121.81, 31.14], PEK: [116.58, 40.08], ICN: [126.44, 37.46],
  NRT: [140.39, 35.76], HND: [139.78, 35.55], KUL: [101.71, 2.74], CGK: [106.66, -6.13],
  TPE: [121.23, 25.08], MNL: [121.02, 14.51],
  SYD: [151.18, -33.94], MEL: [144.84, -37.67], AKL: [174.79, -37.01], PER: [115.97, -31.94],
};

// Real city pairs, weighted towards the corridors that actually carry traffic.
const ROUTES = [
  ["JFK","LHR"], ["JFK","CDG"], ["JFK","FRA"], ["JFK","DXB"], ["JFK","IST"], ["JFK","TLV"],
  ["ORD","LHR"], ["ATL","AMS"], ["MIA","BOG"], ["MIA","GRU"], ["DFW","LHR"],
  ["LAX","NRT"], ["LAX","SYD"], ["LAX","PEK"], ["LAX","ICN"], ["SFO","HKG"], ["SFO","LHR"],
  ["YYZ","LHR"], ["YVR","HKG"], ["MEX","MAD"], ["GRU","LIS"], ["EZE","MAD"], ["LIM","SCL"],
  ["LHR","DXB"], ["LHR","SIN"], ["LHR","HKG"], ["LHR","JNB"], ["LHR","BOM"], ["LHR","ZRH"],
  ["CDG","LOS"], ["CDG","CMN"], ["CDG","WAW"], ["FRA","PVG"], ["FRA","VIE"], ["AMS","DEL"],
  ["MAD","BCN"], ["LIS","BCN"], ["FCO","ATH"], ["MUC","PRG"], ["CPH","ARN"], ["OSL","HEL"],
  ["DUB","BCN"], ["KEF","CPH"], ["SVO","IST"], ["IST","DOH"],
  ["DXB","DEL"], ["DXB","BKK"], ["DXB","NBO"], ["DXB","CAI"], ["DXB","MNL"], ["DOH","SIN"],
  ["JNB","CPT"], ["NBO","LOS"],
  ["SIN","SYD"], ["SIN","HND"], ["SIN","KUL"], ["SIN","CGK"], ["SIN","PER"],
  ["HKG","TPE"], ["NRT","TPE"], ["ICN","PVG"], ["PEK","BKK"], ["BOM","DEL"],
  ["SYD","MEL"], ["SYD","AKL"], ["MEL","PER"],
];

const DEG2RAD = Math.PI / 180;

function createFlightField(canvas, mapLayer) {
  const ctx = canvas.getContext("2d");
  const mapCtx = mapLayer.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, dpr = 1, scale = 1, offX = 0, offY = 0;
  let rafId = null, lastTime = 0, accum = 0, pageVisible = true;

  const projX = (lon) => offX + (lon + 180) * scale;
  const projY = (lat) => offY + (90 - lat) * scale;

  // Unit vectors for great-circle interpolation.
  const toVec = ([lon, lat]) => {
    const la = lat * DEG2RAD, lo = lon * DEG2RAD, c = Math.cos(la);
    return [c * Math.cos(lo), c * Math.sin(lo), Math.sin(la)];
  };

  const flights = ROUTES.map((pair, i) => {
    const a = AIRPORTS[pair[0]], b = AIRPORTS[pair[1]];
    const va = toVec(a), vb = toVec(b);
    const dot = Math.max(-1, Math.min(1, va[0]*vb[0] + va[1]*vb[1] + va[2]*vb[2]));
    const arc = Math.acos(dot);            // route length in radians
    return {
      va, vb, arc,
      sinArc: Math.sin(arc),
      // Staggered so they don't all depart together, and alternating direction so
      // each corridor has traffic both ways.
      t: (i * 0.137) % 1,
      dir: i % 2 ? 1 : -1,
      speed: 0.9 + (i % 5) * 0.08,
    };
  });

  // Point at fraction f along the great circle, as [lon, lat].
  function along(f, fl) {
    const { va, vb, arc, sinArc } = fl;
    let x, y, z;
    if (sinArc < 1e-6) { [x, y, z] = va; }
    else {
      const s1 = Math.sin((1 - f) * arc) / sinArc;
      const s2 = Math.sin(f * arc) / sinArc;
      x = s1 * va[0] + s2 * vb[0];
      y = s1 * va[1] + s2 * vb[1];
      z = s1 * va[2] + s2 * vb[2];
    }
    return [Math.atan2(y, x) / DEG2RAD, Math.asin(Math.max(-1, Math.min(1, z))) / DEG2RAD];
  }

  // Every corridor is fixed geometry, so each one is sampled into screen space
  // once per resize. After that, drawing a trail or placing an aircraft is array
  // lookups and a lerp — no trigonometry on the render path at all.
  const SAMPLES = 96;

  function buildPaths() {
    for (const fl of flights) {
      const xs = new Float32Array(SAMPLES);
      const ys = new Float32Array(SAMPLES);
      // A sample is "cut" when the segment reaching it crosses the antimeridian,
      // which would otherwise draw as a stripe back across the whole map.
      const cut = new Uint8Array(SAMPLES);
      let prevX = null;
      for (let i = 0; i < SAMPLES; i++) {
        const [lon, lat] = along(i / (SAMPLES - 1), fl);
        const x = projX(lon), y = projY(lat);
        cut[i] = prevX !== null && Math.abs(x - prevX) > W * 0.5 ? 1 : 0;
        xs[i] = x; ys[i] = y; prevX = x;
      }
      fl.xs = xs; fl.ys = ys; fl.cut = cut;
    }
  }

  // Strokes the cached polyline between two sample indices (inclusive).
  function strokeSamples(target, fl, from, to) {
    const lo = Math.max(0, Math.min(from, to));
    const hi = Math.min(SAMPLES - 1, Math.max(from, to));
    target.beginPath();
    let started = false;
    for (let i = lo; i <= hi; i++) {
      if (!started || fl.cut[i]) { target.moveTo(fl.xs[i], fl.ys[i]); started = true; }
      else target.lineTo(fl.xs[i], fl.ys[i]);
    }
    target.stroke();
  }

  function drawMapLayer() {
    mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mapCtx.clearRect(0, 0, W, H);

    mapCtx.lineWidth = 0.7;
    mapCtx.strokeStyle = "rgba(255,255,255,0.035)";
    for (let lon = -180; lon <= 180; lon += 30) {
      mapCtx.beginPath();
      mapCtx.moveTo(projX(lon), projY(90));
      mapCtx.lineTo(projX(lon), projY(-90));
      mapCtx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      mapCtx.beginPath();
      mapCtx.moveTo(projX(-180), projY(lat));
      mapCtx.lineTo(projX(180), projY(lat));
      mapCtx.stroke();
    }

    mapCtx.lineWidth = 0.9;
    mapCtx.strokeStyle = "rgba(255,255,255,0.07)";
    mapCtx.lineJoin = "round";
    for (const country of WORLD_LAND) {
      for (const ring of country.p) {
        mapCtx.beginPath();
        for (let i = 0; i < ring.length; i += 2) {
          const x = projX(ring[i]), y = projY(ring[i + 1]);
          if (i === 0) mapCtx.moveTo(x, y); else mapCtx.lineTo(x, y);
        }
        mapCtx.closePath();
        mapCtx.stroke();
      }
    }

    // The corridors themselves never move — baking them in is what keeps the
    // per-frame work down to just the trails and the aircraft.
    mapCtx.lineWidth = 0.8;
    mapCtx.strokeStyle = "rgba(255,255,255,0.045)";
    for (const fl of flights) strokeSamples(mapCtx, fl, 0, SAMPLES - 1);

    mapCtx.fillStyle = "rgba(255,255,255,0.16)";
    for (const code in AIRPORTS) {
      const [lon, lat] = AIRPORTS[code];
      mapCtx.beginPath();
      mapCtx.arc(projX(lon), projY(lat), 1.1, 0, Math.PI * 2);
      mapCtx.fill();
    }
  }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    if (!w || !h) return;
    // A background of hairlines does not need full retina density, and this layer
    // is the largest surface on the page.
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = w; H = h;
    for (const c of [canvas, mapLayer]) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
    canvas.style.width = mapLayer.style.width = W + "px";
    canvas.style.height = mapLayer.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // "Cover" the viewport rather than fit it, so there is never a bare band
    // above or below the map.
    scale = Math.max(W / 360, H / 180);
    offX = (W - 360 * scale) / 2;
    offY = (H - 180 * scale) / 2;

    buildPaths();
    drawMapLayer();
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const last = SAMPLES - 1;
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = "rgba(255,255,255,0.17)";

    for (const fl of flights) {
      const t = fl.dir > 0 ? fl.t : 1 - fl.t;
      const f = t * last;
      const i = Math.min(last - 1, Math.floor(f));
      const frac = fl.cut[i + 1] ? 0 : f - i;      // never lerp across the seam

      const x = fl.xs[i] + (fl.xs[i + 1] - fl.xs[i]) * frac;
      const y = fl.ys[i] + (fl.ys[i + 1] - fl.ys[i]) * frac;

      const trail = Math.round(0.13 * last);
      strokeSamples(ctx, fl, i, i - fl.dir * trail);

      // Heading comes from the segment the aircraft is on, or the one before it
      // when that segment is the seam.
      let hx = i, hy = i + 1;
      if (fl.cut[i + 1] && i > 0) { hx = i - 1; hy = i; }
      const angle = Math.atan2(
        (fl.ys[hy] - fl.ys[hx]) * fl.dir,
        (fl.xs[hy] - fl.xs[hx]) * fl.dir
      );

      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      ctx.moveTo(4.2, 0);
      ctx.lineTo(-2.6, 2.4);
      ctx.lineTo(-1.4, 0);
      ctx.lineTo(-2.6, -2.4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  const FRAME = 1000 / 30;   // 30fps is plenty for traffic this slow, and halves the cost
  const CRUISE = 0.019;      // radians of arc per second

  function tick(now) {
    rafId = null;
    const dt = Math.min(now - lastTime, 100);
    lastTime = now;
    accum += dt;
    if (accum >= FRAME) {
      accum = 0;
      for (const fl of flights) {
        fl.t += (CRUISE * fl.speed * (dt / 1000)) / Math.max(fl.arc, 0.12);
        if (fl.t >= 1) { fl.t = 0; fl.dir *= -1; }   // turn the aircraft around
      }
      draw();
    }
    if (pageVisible) rafId = requestAnimationFrame(tick);
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  document.addEventListener("visibilitychange", () => {
    pageVisible = !document.hidden;
    if (pageVisible && !reduceMotion && rafId === null) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  });

  resize();
  if (!reduceMotion) {
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  return { resize };
}
