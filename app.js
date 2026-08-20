// ---------- Helpers ----------

const byId = (id) => COUNTRIES.find(c => c.id === id);

// Search text is user input and gets injected into innerHTML, so it must be escaped.
const escapeHtml = (str) => String(str).replace(/[&<>"']/g, ch => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));

const titleCase = (str) => str.replace(/\b\w/g, ch => ch.toUpperCase());

function bollardSVG(c, size = 64) {
  const b = c.bollard;
  const cap = b.cap ? `<rect x="${size*0.28}" y="${size*0.06}" width="${size*0.44}" height="${size*0.12}" rx="2" fill="${b.cap}"/>` : "";
  const capOffset = b.cap ? size * 0.16 : size * 0.04;
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name} bollard illustration">
    <rect x="${size*0.32}" y="${size*0.9}" width="${size*0.36}" height="${size*0.06}" rx="2" fill="#00000033"/>
    <rect x="${size*0.30}" y="${capOffset}" width="${size*0.40}" height="${size*0.84 - capOffset}" rx="4" fill="${b.body}" stroke="#00000022" stroke-width="1"/>
    <rect x="${size*0.30}" y="${size*0.5}" width="${size*0.40}" height="${size*0.14}" fill="${b.band}"/>
    ${cap}
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
  return `
  <svg width="${size*1.6}" height="${size*0.7}" viewBox="0 0 ${size*1.6} ${size*0.7}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name} plate colour swatch">
    <rect x="1" y="1" width="${size*1.6-2}" height="${size*0.7-2}" rx="5" fill="${c.plates.bg}" stroke="#1b1d21" stroke-width="2"/>
    <rect x="${size*0.12}" y="${size*0.18}" width="${size*0.3}" height="${size*0.34}" fill="#3b6ea8" opacity="0.9"/>
  </svg>`;
}

const REGIONS = ["All", ...Array.from(new Set(COUNTRIES.map(c => c.region)))];

// ---------- State ----------

let state = {
  view: "browse",
  search: "",
  region: "All",
  detailId: null,
  compareLeft: null,
  compareRight: null,
};

// ---------- Rendering: Browse ----------

function renderRegionFilter() {
  const el = document.getElementById("regionFilter");
  el.innerHTML = REGIONS.map(r =>
    `<button data-region="${r}" class="${state.region === r ? 'active' : ''}">${r}</button>`
  ).join("");
  el.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      state.region = btn.dataset.region;
      renderRegionFilter();
      renderGrid();
    });
  });
}

function renderGrid() {
  const grid = document.getElementById("grid");
  const q = state.search.trim().toLowerCase();
  const filtered = COUNTRIES.filter(c => {
    const matchesSearch = !q || c.name.toLowerCase().includes(q);
    const matchesRegion = state.region === "All" || c.region === state.region;
    return matchesSearch && matchesRegion;
  }).sort((a, b) => a.name.localeCompare(b.name));

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="compare-empty" style="grid-column:1/-1">No countries match “${escapeHtml(state.search)}”.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(c => `
    <button class="plate-card" data-id="${c.id}">
      <div class="name-row">
        <h3>${c.name}</h3>
        <span class="side-tag">${c.driving === "left" ? "LEFT" : "RIGHT"}</span>
      </div>
      ${bollardSVG(c, 48)}
      <div class="tip">${c.keyTip}</div>
    </button>
  `).join("");

  grid.querySelectorAll(".plate-card").forEach(card => {
    card.addEventListener("click", () => openDetail(card.dataset.id));
  });
}

// ---------- Rendering: Detail ----------

function openDetail(id) {
  state.detailId = id;
  setView("detail");
  renderDetail();
}

function renderDetail() {
  const c = byId(state.detailId);
  if (!c) return;
  const el = document.getElementById("detailContent");
  el.innerHTML = `
    <div class="detail-header">
      <button class="back-btn" id="backToBrowse">&larr; Back</button>
      <h2>${c.name}</h2>
      <span class="side-tag">${c.region} &middot; drives on the ${c.driving}</span>
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
          return `<button class="chip" data-compare="${c.id}|${cid}">${other.name} &rarr; compare</button>`;
        }).join("")}
      </div>
    </div>
  `;
  document.getElementById("backToBrowse").addEventListener("click", () => setView("browse"));
  el.querySelectorAll("[data-compare]").forEach(chip => {
    chip.addEventListener("click", () => {
      const [a, b] = chip.dataset.compare.split("|");
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
  const plateDiff = a.plates.bg !== b.plates.bg || a.plates.notes !== b.plates.notes;
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
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
  renderRegionFilter();
  renderGrid();

  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderGrid();
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
