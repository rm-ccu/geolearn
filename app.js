// ---------- Helpers ----------

const byId = (id) => COUNTRIES.find(c => c.id === id);

// Search text is user input and gets injected into innerHTML, so it must be escaped.
const escapeHtml = (str) => String(str).replace(/[&<>"']/g, ch => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));

const titleCase = (str) => str.replace(/\b\w/g, ch => ch.toUpperCase());

// Geometry for each bollard.shape value in data.js. Everything is expressed as a
// fraction of `S` so a single definition renders correctly at 22px and 64px alike.
// `d` is the post silhouette; band/cap are clipped to it, so they can never spill
// outside the outline no matter which shape is selected.
function bollardGeometry(shape, S) {
  const B = 0.88 * S;                       // ground line
  const rect = (x0, x1, T) => `M${x0*S} ${B} L${x0*S} ${T*S} L${x1*S} ${T*S} L${x1*S} ${B} Z`;
  const band = (x0, x1, y, h) => ({ x: x0*S, y: y*S, w: (x1-x0)*S, h: h*S });

  switch (shape) {
    case "flat-narrow":
      return { d: rect(0.36, 0.64, 0.08), band: band(0.36, 0.64, 0.46, 0.13) };

    case "thick-rect":
      return { d: rect(0.24, 0.76, 0.08), band: band(0.24, 0.76, 0.46, 0.13) };

    case "reflector-post": // thin tall marker post, reflector sits high
      return { d: rect(0.41, 0.59, 0.05), band: band(0.41, 0.59, 0.24, 0.12) };

    case "sparse": // short stub, inconsistently deployed
      return { d: rect(0.33, 0.67, 0.44), band: band(0.33, 0.67, 0.60, 0.13) };

    case "domed": // semicircular top (Switzerland)
      return {
        d: `M${0.30*S} ${B} L${0.30*S} ${0.28*S} A ${0.20*S} ${0.20*S} 0 0 1 ${0.70*S} ${0.28*S} L${0.70*S} ${B} Z`,
        band: band(0.30, 0.70, 0.46, 0.13)
      };

    case "rounded": // softly rounded top (France)
      return {
        d: `M${0.31*S} ${B} L${0.31*S} ${0.17*S} Q ${0.31*S} ${0.08*S} ${0.50*S} ${0.08*S} Q ${0.69*S} ${0.08*S} ${0.69*S} ${0.17*S} L${0.69*S} ${B} Z`,
        band: band(0.31, 0.69, 0.46, 0.13)
      };

    case "rounded-wrap": // wider post, squarer shoulder, deep wrapping collar (Denmark)
      return {
        d: `M${0.27*S} ${B} L${0.27*S} ${0.14*S} Q ${0.27*S} ${0.07*S} ${0.36*S} ${0.07*S} L${0.64*S} ${0.07*S} Q ${0.73*S} ${0.07*S} ${0.73*S} ${0.14*S} L${0.73*S} ${B} Z`,
        band: band(0.27, 0.73, 0.42, 0.20)
      };

    case "cylindrical": // round section, elliptical top face (Finland)
      return {
        d: `M${0.31*S} ${B} L${0.31*S} ${0.13*S} A ${0.19*S} ${0.055*S} 0 0 1 ${0.69*S} ${0.13*S} L${0.69*S} ${B} Z`,
        band: band(0.31, 0.69, 0.46, 0.13),
        topFace: { cx: 0.50*S, cy: 0.13*S, rx: 0.19*S, ry: 0.055*S },
        shading: true
      };

    case "wedge": // angled crown, low-left to high-right (Italy / Albania)
      return {
        d: `M${0.30*S} ${B} L${0.30*S} ${0.28*S} L${0.70*S} ${0.08*S} L${0.70*S} ${B} Z`,
        band: band(0.30, 0.70, 0.46, 0.13)
      };

    case "wedge-rare": // mirrored wedge, so it reads as distinct from `wedge`
      return {
        d: `M${0.30*S} ${B} L${0.30*S} ${0.08*S} L${0.70*S} ${0.28*S} L${0.70*S} ${B} Z`,
        band: band(0.30, 0.70, 0.46, 0.13)
      };

    case "flat-back": // flat post with a back plate offset behind it (Croatia)
      return {
        d: rect(0.32, 0.66, 0.08),
        band: band(0.32, 0.66, 0.46, 0.13),
        behind: `<rect x="${0.62*S}" y="${0.12*S}" width="${0.13*S}" height="${B - 0.12*S}" rx="1" fill="#6b6f78"/>`
      };

    case "offset": // chamfered crown, reflector sits off-centre rather than spanning (Serbia)
      return {
        d: `M${0.30*S} ${B} L${0.30*S} ${0.08*S} L${0.62*S} ${0.08*S} L${0.70*S} ${0.17*S} L${0.70*S} ${B} Z`,
        band: band(0.30, 0.56, 0.46, 0.13)
      };

    case "flat":
    default:
      return { d: rect(0.30, 0.70, 0.08), band: band(0.30, 0.70, 0.46, 0.13) };
  }
}

let _bollardUid = 0;

function bollardSVG(c, size = 64) {
  const b = c.bollard;
  const g = bollardGeometry(b.shape, size);
  const uid = "bollard-clip-" + (++_bollardUid);
  const bd = g.band;

  // Cap occupies the top slice of the post; clipping keeps it inside domed/wedge tops.
  const cap = b.cap
    ? `<rect x="0" y="0" width="${size}" height="${size * 0.21}" fill="${b.cap}" clip-path="url(#${uid})"/>`
    : "";
  // Gradient is pinned to the post's own x-range (userSpaceOnUse); spanning the whole
  // SVG would put both dark edges outside the post, leaving the shading invisible.
  const shading = g.shading
    ? `<rect x="${bd.x}" y="0" width="${bd.w}" height="${size}" fill="url(#${uid}-g)" clip-path="url(#${uid})"/>`
    : "";
  const shadeDef = g.shading
    ? `<linearGradient id="${uid}-g" gradientUnits="userSpaceOnUse" x1="${bd.x}" x2="${bd.x + bd.w}"><stop offset="0" stop-color="#000" stop-opacity="0.34"/><stop offset="0.34" stop-color="#000" stop-opacity="0"/><stop offset="0.66" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.36"/></linearGradient>`
    : "";
  const topFace = g.topFace
    ? `<ellipse cx="${g.topFace.cx}" cy="${g.topFace.cy}" rx="${g.topFace.rx}" ry="${g.topFace.ry}" fill="#ffffff" opacity="0.22"/>`
    : "";

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name} bollard: ${b.shape} shape">
    <defs><clipPath id="${uid}"><path d="${g.d}"/></clipPath>${shadeDef}</defs>
    <rect x="${size*0.32}" y="${size*0.9}" width="${size*0.36}" height="${size*0.06}" rx="2" fill="#00000033"/>
    ${g.behind || ""}
    <path d="${g.d}" fill="${b.body}" stroke="#00000022" stroke-width="1"/>
    <rect x="${bd.x}" y="${bd.y}" width="${bd.w}" height="${bd.h}" fill="${b.band}" clip-path="url(#${uid})"/>
    ${cap}
    ${shading}
    ${topFace}
  </svg>`;
}

function signSwatch(c, size = 64) {
  return `
  <svg width="${size*1.4}" height="${size}" viewBox="0 0 ${size*1.4} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name} sign colour swatch">
    <rect x="2" y="2" width="${size*1.4-4}" height="${size-4}" rx="6" fill="${c.signs.bg}" stroke="#00000022" stroke-width="2"/>
    <rect x="${size*0.18}" y="${size*0.4}" width="${size*1.04}" height="${size*0.2}" rx="2" fill="${c.signs.accent}" opacity="0.85"/>
  </svg>`;
}

function plateSwatch(c, size = 64) {
  // The side band is data-driven: `plates.band` is null for countries with no band
  // (Switzerland, USA, Japan, Norway...), so the swatch stops contradicting the notes.
  const band = c.plates.band
    ? `<rect x="${size*0.09}" y="${size*0.09}" width="${size*0.26}" height="${size*0.52}" rx="2" fill="${c.plates.band}"/>`
    : "";
  return `
  <svg width="${size*1.6}" height="${size*0.7}" viewBox="0 0 ${size*1.6} ${size*0.7}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name} plate: ${c.plates.band ? "with side band" : "no side band"}">
    <rect x="1" y="1" width="${size*1.6-2}" height="${size*0.7-2}" rx="5" fill="${c.plates.bg}" stroke="#1b1d21" stroke-width="2"/>
    ${band}
  </svg>`;
}

// ---------- ccTLD ----------

// The ccTLD is the ISO alpha-2 code lowercased, with a handful of historical
// exceptions. Britain is the only one that applies to the current dataset.
const TLD_EXCEPTIONS = { GB: "uk" };
const ccTLD = (code) => "." + (TLD_EXCEPTIONS[code] || code.toLowerCase());

// ---------- State ----------

let state = {
  view: "browse",
  search: "",
  selectedId: null,      // country focused on the globe and open in the detail panel
  compareLeft: null,
  compareRight: null,
};

let globe = null;

// ---------- Rendering: Browse ----------

// Two things can narrow the list: a search, or the country picked on the globe
// (which scopes the list to that country's region). Search wins when both are
// active — typing is the more deliberate act, and a search that silently only
// looked inside one region would be a trap.
function visibleCountries() {
  const q = state.search.trim().toLowerCase();
  const selected = byId(state.selectedId);
  let list = COUNTRIES;
  if (q) list = list.filter(c => c.name.toLowerCase().includes(q));
  else if (selected) list = list.filter(c => c.region === selected.region);
  return list.slice().sort((a, b) => a.name.localeCompare(b.name));
}

const regionPeers = (country) =>
  country ? COUNTRIES.filter(c => c.region === country.region).map(c => c.id) : [];

function renderListHead() {
  const el = document.getElementById("listHead");
  const q = state.search.trim();
  const selected = byId(state.selectedId);
  const count = visibleCountries().length;

  if (q) {
    el.innerHTML = `<span class="list-scope">${count} match${count === 1 ? "" : "es"} for &ldquo;${escapeHtml(q)}&rdquo;</span>`;
    return;
  }
  if (selected) {
    el.innerHTML = `
      <span class="list-scope">${escapeHtml(selected.region)} <span class="count">${count}</span></span>
      <button type="button" class="clear-scope" id="clearScope">Show all ${COUNTRIES.length}</button>`;
    document.getElementById("clearScope").addEventListener("click", clearSelection);
    return;
  }
  el.innerHTML = `<span class="list-scope">All countries <span class="count">${COUNTRIES.length}</span></span>`;
}

function renderGrid() {
  const grid = document.getElementById("grid");
  const filtered = visibleCountries();

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="compare-empty" style="grid-column:1/-1">No countries match &ldquo;${escapeHtml(state.search)}&rdquo;.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(c => `
    <button class="plate-card${c.id === state.selectedId ? " is-selected" : ""}" data-id="${c.id}" aria-pressed="${c.id === state.selectedId}">
      <div class="name-row">
        <h3>${c.name}</h3>
        <span class="side-tag">${c.driving === "left" ? "LEFT" : "RIGHT"}</span>
      </div>
      <div class="card-mid">
        ${bollardSVG(c, 48)}
        ${flagImg(c.code, c.name, 27)}
        <span class="tld mono" title="Domain suffix — worth reading off vans and billboards">${ccTLD(c.code)}</span>
      </div>
      <div class="tip">${c.keyTip}</div>
    </button>
  `).join("");

  grid.querySelectorAll(".plate-card").forEach(card => {
    card.addEventListener("click", () => selectCountry(card.dataset.id));
  });
}

// ---------- Selection ----------

function selectCountry(id) {
  const c = byId(id);
  if (!c) return;
  state.selectedId = id;
  document.getElementById("browseBody").classList.add("has-selection");
  renderListHead();
  renderGrid();
  renderDetailPanel();
  setCaption();
  if (globe) globe.select(id, regionPeers(c));
  // Stacked layout puts the panel under the list, so it needs bringing into view.
  if (window.matchMedia("(max-width: 900px)").matches) {
    document.getElementById("detailCol").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }
}

function clearSelection() {
  if (!state.selectedId) return;
  state.selectedId = null;
  document.getElementById("browseBody").classList.remove("has-selection");
  renderListHead();
  renderGrid();
  renderDetailPanel();
  setCaption();
  if (globe) globe.clear();
}

// ---------- Globe chrome ----------

const ZOOM_KEY = navigator.platform.toLowerCase().includes("mac") ? "\u2318" : "Ctrl";

function setCaption(text) {
  const el = document.getElementById("globeCaption");
  const selected = byId(state.selectedId);
  if (text) { el.textContent = text; return; }
  el.textContent = selected
    ? `${selected.name} — click the ocean or press Esc to zoom back out`
    : `Drag to spin · click a country · ${ZOOM_KEY} + scroll to zoom`;
}

function showTip(info) {
  const tip = document.getElementById("globeTip");
  const known = info && info.id ? byId(info.id) : null;
  const label = known ? known.name : (info && info.name);
  if (!label) { tip.classList.remove("show"); return; }
  tip.textContent = known ? label : `${label} — not in the guide yet`;
  tip.classList.toggle("muted", !known);
  tip.style.left = `${info.x}px`;
  tip.style.top = `${info.y}px`;
  tip.classList.add("show");
}

let hintTimer = null;
function flashHint() {
  const el = document.getElementById("globeHint");
  el.textContent = `Hold ${ZOOM_KEY} and scroll to zoom the globe`;
  el.classList.add("show");
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

// ---------- Rendering: Detail panel ----------

function renderDetailPanel() {
  const col = document.getElementById("detailCol");
  const el = document.getElementById("detailContent");
  const c = byId(state.selectedId);

  if (!c) {
    col.hidden = true;
    el.innerHTML = "";
    return;
  }
  col.hidden = false;

  el.innerHTML = `
    <div class="detail-header">
      <div class="detail-title">
        <h2>${flagImg(c.code, c.name, 26)} ${c.name}</h2>
        <span class="side-tag">${ccTLD(c.code)} &middot; ${c.region} &middot; drives on the ${c.driving}</span>
      </div>
      <button type="button" class="close-btn" id="closeDetail" aria-label="Close ${c.name}">&times;</button>
    </div>

    <div class="key-tip-banner">
      <div class="label">Fastest tell</div>
      ${c.keyTip}
    </div>

    <div class="attr-grid">
      <div class="attr-card">
        <div class="label">${bollardSVG(c, 22)} Bollard</div>
        <p>${c.bollard.notes}</p>
      </div>
      <div class="attr-card">
        <div class="label">${signSwatch(c, 20)} Signage</div>
        <p>${c.signs.notes}</p>
      </div>
      <div class="attr-card">
        <div class="label">${plateSwatch(c, 20)} Plates</div>
        <p>${c.plates.notes}</p>
      </div>
      <div class="attr-card">
        <div class="label">Language</div>
        <p><span class="mono">${c.language.script}</span> &mdash; ${c.language.notes}</p>
      </div>
    </div>

    <div class="confused-with">
      <div class="label">Commonly confused with</div>
      <div class="chip-row">
        ${c.confusedWith.map(cid => {
          const other = byId(cid);
          // Not every id listed here has an entry in data.js yet. Those are shown
          // dimmed and non-clickable rather than as a button that goes nowhere.
          if (!other) {
            return `<span class="chip chip-missing" title="Not in data.js yet">${escapeHtml(titleCase(cid))}</span>`;
          }
          return `
            <span class="chip chip-pair">
              <button type="button" class="chip-name" data-select="${cid}">${other.name}</button>
              <button type="button" class="chip-compare" data-compare="${c.id}|${cid}"
                      title="Compare ${c.name} with ${other.name}"
                      aria-label="Compare ${c.name} with ${other.name}">&#8644;</button>
            </span>`;
        }).join("")}
      </div>
    </div>
  `;

  document.getElementById("closeDetail").addEventListener("click", clearSelection);

  // Swapping the panel in place keeps you on the globe; the compare button is
  // the only thing that still leaves the browse view.
  el.querySelectorAll("[data-select]").forEach(btn => {
    btn.addEventListener("click", () => selectCountry(btn.dataset.select));
  });
  el.querySelectorAll("[data-compare]").forEach(btn => {
    btn.addEventListener("click", () => {
      const [a, b] = btn.dataset.compare.split("|");
      state.compareLeft = a;
      state.compareRight = byId(b) ? b : null;
      setView("compare"); // setView already re-renders the compare view
    });
  });
}

// ---------- Rendering: Compare ----------

function populateSelect(selectEl, selectedId) {
  selectEl.innerHTML = `<option value="">Choose a country&hellip;</option>` +
    COUNTRIES.slice().sort((a,b) => a.name.localeCompare(b.name)).map(c =>
      `<option value="${c.id}" ${c.id === selectedId ? "selected" : ""}>${c.name}</option>`
    ).join("");
}

function fieldRow(label, leftVal, rightVal, leftNote, rightNote, isDiff) {
  return `
    <div class="diff-row ${isDiff ? 'is-diff' : 'is-same'}">
      <div class="diff-cell">
        <div class="field-label">${label}</div>
        <div class="field-value">${leftVal}</div>
        ${leftNote ? `<div class="field-note">${leftNote}</div>` : ""}
      </div>
      <div class="diff-cell">
        <div class="field-label">${label}</div>
        <div class="field-value">${rightVal}</div>
        ${rightNote ? `<div class="field-note">${rightNote}</div>` : ""}
      </div>
    </div>`;
}

function renderCompare() {
  populateSelect(document.getElementById("selectLeft"), state.compareLeft);
  populateSelect(document.getElementById("selectRight"), state.compareRight);

  const out = document.getElementById("compareOutput");
  const a = byId(state.compareLeft);
  const b = byId(state.compareRight);

  if (!a || !b) {
    out.innerHTML = `<div class="compare-empty">Pick two countries above to see exactly what differs between them.</div>`;
    return;
  }

  const drivingDiff = a.driving !== b.driving;
  const bollardShapeDiff = a.bollard.shape !== b.bollard.shape || a.bollard.body !== b.bollard.body || a.bollard.band !== b.bollard.band || a.bollard.cap !== b.bollard.cap;
  const signDiff = a.signs.bg !== b.signs.bg;
  const plateDiff = a.plates.bg !== b.plates.bg || a.plates.band !== b.plates.band || a.plates.notes !== b.plates.notes;
  const scriptDiff = a.language.script !== b.language.script;

  out.innerHTML = `
    <div class="diff-legend">
      <span class="legend-swatch"><span class="legend-dot" style="background:var(--lane-yellow)"></span>Different &mdash; use this to split them</span>
      <span class="legend-swatch"><span class="legend-dot" style="background:var(--chalk-dim)"></span>Same &mdash; not useful here</span>
    </div>

    ${fieldRow("Driving side", a.driving.toUpperCase(), b.driving.toUpperCase(), "", "", drivingDiff)}

    <div class="diff-row ${bollardShapeDiff ? 'is-diff' : 'is-same'}">
      <div class="diff-cell">
        <div class="field-label">Bollard</div>
        ${bollardSVG(a, 44)}
        <div class="field-note">${a.bollard.notes}</div>
      </div>
      <div class="diff-cell">
        <div class="field-label">Bollard</div>
        ${bollardSVG(b, 44)}
        <div class="field-note">${b.bollard.notes}</div>
      </div>
    </div>

    <div class="diff-row ${signDiff ? 'is-diff' : 'is-same'}">
      <div class="diff-cell">
        <div class="field-label">Signage</div>
        ${signSwatch(a, 34)}
        <div class="field-note">${a.signs.notes}</div>
      </div>
      <div class="diff-cell">
        <div class="field-label">Signage</div>
        ${signSwatch(b, 34)}
        <div class="field-note">${b.signs.notes}</div>
      </div>
    </div>

    <div class="diff-row ${plateDiff ? 'is-diff' : 'is-same'}">
      <div class="diff-cell">
        <div class="field-label">Plates</div>
        ${plateSwatch(a, 34)}
        <div class="field-note">${a.plates.notes}</div>
      </div>
      <div class="diff-cell">
        <div class="field-label">Plates</div>
        ${plateSwatch(b, 34)}
        <div class="field-note">${b.plates.notes}</div>
      </div>
    </div>

    ${fieldRow("Language / script", `<span class="mono">${a.language.script}</span>`, `<span class="mono">${b.language.script}</span>`, a.language.notes, b.language.notes, scriptDiff)}

    <div class="key-tip-banner" style="margin-top:20px">
      <div class="label">${a.name}'s fastest tell</div>
      ${a.keyTip}
    </div>
    <div class="key-tip-banner">
      <div class="label">${b.name}'s fastest tell</div>
      ${b.keyTip}
    </div>
  `;
}

// ---------- View switching ----------

function setView(view) {
  state.view = view;
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${view}`).classList.add("active");
  document.querySelectorAll("nav.tabs button").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  if (view === "compare") renderCompare();
  if (view === "browse" && globe) globe.resize(); // the canvas had no size while hidden
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
  createFlightField(
    document.getElementById("flightField"),
    document.getElementById("flightMap")
  );

  renderListHead();
  renderGrid();

  globe = createGlobe(document.getElementById("globeCanvas"), {
    onSelect: (id, name) => {
      if (id) { selectCountry(id); return; }
      // Clicking bare ocean backs out; clicking a country we have no data for
      // says so instead of silently doing nothing.
      clearSelection();
      if (name) {
        setCaption(`${name} isn't in the guide yet`);
        setTimeout(() => setCaption(), 2200);
      }
    },
    onHover: showTip,
    onGesture: (kind) => { if (kind === "scroll-hint") flashHint(); },
  });
  setCaption();

  document.querySelectorAll("[data-globe]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.globe === "in") globe.zoomIn();
      else if (btn.dataset.globe === "out") globe.zoomOut();
      else { globe.reset(); clearSelection(); }
    });
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderListHead();
    renderGrid();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.view === "browse") clearSelection();
  });

  document.querySelectorAll("nav.tabs button").forEach(btn => {
    btn.addEventListener("click", () => setView(btn.dataset.view));
  });

  document.getElementById("selectLeft").addEventListener("change", (e) => {
    state.compareLeft = e.target.value || null;
    renderCompare();
  });
  document.getElementById("selectRight").addEventListener("change", (e) => {
    state.compareRight = e.target.value || null;
    renderCompare();
  });

  populateSelect(document.getElementById("selectLeft"), null);
  populateSelect(document.getElementById("selectRight"), null);
});
