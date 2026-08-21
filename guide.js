// GeoLearn guidebook renderer.
//
// Turns the typed blocks in guides.js into the reading view. The point of the
// block indirection is reuse: `swatches` and `diff` blocks call the exact same
// bollardSVG/signSwatch/plateSwatch/fieldRow functions the Browse and Compare
// views use, so a lesson cannot drift away from data.js. Nothing here knows
// what a bollard looks like.

// Every entry in the book, in reading order, so prev/next can walk from the
// last chapter of the course straight into the first map guide.
const GUIDE_ORDER = [
  ...COURSE.map(c => ({ kind: "course", id: c.id, entry: c })),
  ...GUIDE_MAPS.map(m => ({ kind: "map", id: m.id, entry: m })),
];

const guideEntry = (id) => GUIDE_ORDER.find(e => e.id === id);

let guideState = { activeId: COURSE[0].id };

// ---------- Inline markup ----------

// Lesson prose is authored, not user input, but it still goes through escaping
// first so the markup pass is the only thing that can produce a tag. Supports
// **bold** and [[country-id]], which becomes a chip that opens Browse.
function inline(text) {
  return escapeHtml(text)
    .replace(/\[\[([a-z0-9 -]+)\]\]/g, (whole, id) => {
      const c = byId(id);
      if (!c) return whole;   // a typo shows as literal [[...]] rather than vanishing
      return `<button type="button" class="country-chip" data-country="${c.id}"
        title="Open ${escapeHtml(c.name)} in Browse">${flagImg(c.code, c.name, 13)}${escapeHtml(c.name)}</button>`;
    })
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// ---------- Blocks ----------

const SWATCH_RENDERERS = {
  bollard: (c) => bollardSVG(c, 52),
  sign: (c) => signSwatch(c, 34),
  plate: (c) => plateSwatch(c, 34),
};

function swatchesBlock(b) {
  const draw = SWATCH_RENDERERS[b.kind] || SWATCH_RENDERERS.bollard;
  const cells = b.ids.map(id => {
    const c = byId(id);
    if (!c) return "";
    return `
      <button type="button" class="swatch-cell" data-country="${c.id}" title="Open ${escapeHtml(c.name)} in Browse">
        ${draw(c)}
        <span class="swatch-name">${escapeHtml(c.name)}</span>
      </button>`;
  }).join("");
  return `
    <div class="guide-swatches">
      <div class="swatch-row">${cells}</div>
      ${b.caption ? `<div class="swatch-caption">${inline(b.caption)}</div>` : ""}
    </div>`;
}

// A lesson-sized version of the Compare view, for the pairs a chapter is
// explicitly warning you about. `rows` picks which fields to show: a European
// pair is split by its bollard, an East African one by plates and shopfronts,
// and showing the rows that cannot split them is half the lesson.
const DIFF_ROWS = {
  driving: (a, z) => fieldRow("Driving side", a.driving.toUpperCase(), z.driving.toUpperCase(),
    "", "", a.driving !== z.driving),

  coverage: (a, z) => fieldRow("Coverage",
    isPhoto(a) ? "PHOTOSPHERES" : "OFFICIAL", isPhoto(z) ? "PHOTOSPHERES" : "OFFICIAL",
    coverageLabel(a), coverageLabel(z), a.coverage !== z.coverage),

  language: (a, z) => fieldRow("Language", escapeHtml(a.language.script), escapeHtml(z.language.script),
    escapeHtml(a.language.notes), escapeHtml(z.language.notes), a.language.notes !== z.language.notes),

  bollard: (a, z) => swatchRow("Bollard", a, z, bollardSVG, 40,
    a.bollard.shape !== z.bollard.shape || a.bollard.body !== z.bollard.body || a.bollard.cap !== z.bollard.cap,
    c => c.bollard.notes),

  signs: (a, z) => swatchRow("Signage", a, z, signSwatch, 30, a.signs.bg !== z.signs.bg, c => c.signs.notes),

  plates: (a, z) => swatchRow("Plates", a, z, plateSwatch, 30,
    a.plates.bg !== z.plates.bg || a.plates.band !== z.plates.band, c => c.plates.notes),
};

function swatchRow(label, a, z, draw, size, isDiff, note) {
  const cell = (c) => `
    <div class="diff-cell">
      <div class="field-label">${label}</div>${draw(c, size)}
      <div class="field-note">${escapeHtml(note(c))}</div>
    </div>`;
  return `<div class="diff-row ${isDiff ? "is-diff" : "is-same"}">${cell(a)}${cell(z)}</div>`;
}

function diffBlock(b) {
  const a = byId(b.a), z = byId(b.b);
  if (!a || !z) return "";
  const rows = (b.rows || ["bollard", "language"])
    .map(r => DIFF_ROWS[r] ? DIFF_ROWS[r](a, z) : "").join("");
  return `
    <div class="guide-diff">
      <div class="guide-diff-head">
        <span>${flagImg(a.code, a.name, 15)} ${escapeHtml(a.name)}</span>
        <span class="vs">vs</span>
        <span>${flagImg(z.code, z.name, 15)} ${escapeHtml(z.name)}</span>
      </div>
      ${rows}
      ${b.note ? `<div class="swatch-caption">${inline(b.note)}</div>` : ""}
    </div>`;
}

// Ids must stay unique even if a chapter ever carries two drill blocks.
let _drillUid = 0;

function drillsBlock(b) {
  const items = b.items.map((d) => {
    const i = ++_drillUid;
    const c = byId(d.a);
    const answer = c
      ? `${flagImg(c.code, c.name, 18)} <button type="button" class="country-chip" data-country="${c.id}">${escapeHtml(c.name)}</button>`
      : escapeHtml(d.a);
    return `
      <li class="drill">
        <div class="drill-q">${inline(d.q)}</div>
        <button type="button" class="drill-reveal" aria-expanded="false" aria-controls="drill-a-${i}">Reveal</button>
        <div class="drill-a" id="drill-a-${i}" hidden>
          <div class="drill-answer">${answer}</div>
          <p>${inline(d.why)}</p>
        </div>
      </li>`;
  }).join("");
  return `
    <section class="guide-drills">
      <h3>${escapeHtml(b.label || "Drills")}</h3>
      <ol class="drill-list">${items}</ol>
    </section>`;
}

function renderBlock(b) {
  switch (b.t) {
    case "p":
      return `<p class="guide-p">${inline(b.text)}</p>`;
    case "steps":
      return `
        <section class="guide-steps">
          ${b.label ? `<h3>${escapeHtml(b.label)}</h3>` : ""}
          <ol>${b.items.map(i => `<li>${inline(i)}</li>`).join("")}</ol>
        </section>`;
    case "callout":
      return `
        <div class="guide-callout ${b.tone === "warn" ? "is-warn" : "is-tip"}">
          <div class="label">${escapeHtml(b.label || (b.tone === "warn" ? "Watch out" : "Tip"))}</div>
          ${inline(b.text)}
        </div>`;
    case "swatches": return swatchesBlock(b);
    case "diff":     return diffBlock(b);
    case "drills":   return drillsBlock(b);
    default:         return "";
  }
}

// ---------- Rail ----------

function renderGuideRail() {
  const item = (o, i, numbered) => {
    const written = !!o.entry.body;
    return `
      <li>
        <button type="button" class="rail-item ${o.id === guideState.activeId ? "active" : ""} ${written ? "" : "is-draft"}"
                data-guide="${o.id}" ${o.id === guideState.activeId ? 'aria-current="true"' : ""}>
          ${numbered ? `<span class="rail-num">${String(i + 1).padStart(2, "0")}</span>` : ""}
          <span class="rail-text">
            <span class="rail-title">${escapeHtml(o.entry.title || o.entry.name)}</span>
            ${written ? "" : `<span class="rail-flag">Drafting</span>`}
          </span>
        </button>
      </li>`;
  };

  const course = GUIDE_ORDER.filter(o => o.kind === "course");
  const maps = GUIDE_ORDER.filter(o => o.kind === "map");

  document.getElementById("guideRail").innerHTML = `
    <nav class="rail-group" aria-label="Beginner course">
      <div class="rail-head">Beginner course</div>
      <ol class="rail-list">${course.map((o, i) => item(o, i, true)).join("")}</ol>
    </nav>
    <nav class="rail-group" aria-label="Map guides">
      <div class="rail-head">Map guides</div>
      <ul class="rail-list">${maps.map(o => item(o, 0, false)).join("")}</ul>
    </nav>`;
}

// ---------- Article ----------

function renderGuideArticle() {
  const el = document.getElementById("guideArticle");
  const o = guideEntry(guideState.activeId);
  if (!o) { el.innerHTML = ""; return; }
  const e = o.entry;

  const idx = GUIDE_ORDER.indexOf(o);
  const prev = GUIDE_ORDER[idx - 1];
  const next = GUIDE_ORDER[idx + 1];
  const navBtn = (target, dir) => target
    ? `<button type="button" class="guide-nav-btn" data-guide="${target.id}">
         <span class="dir">${dir === "prev" ? "&larr; Previous" : "Next &rarr;"}</span>
         <span class="name">${escapeHtml(target.entry.title || target.entry.name)}</span>
       </button>`
    : `<span></span>`;

  const kicker = o.kind === "course"
    ? `Chapter ${String(COURSE.findIndex(c => c.id === e.id) + 1).padStart(2, "0")}`
    : `${escapeHtml(e.flavour)} map`;

  const meta = o.kind === "course" && e.minutes ? `<span class="guide-mins">${e.minutes} min study</span>` : "";
  const link = o.kind === "map" && e.url
    ? `<a class="guide-maplink" href="${e.url}" target="_blank" rel="noopener">Open the map on GeoGuessr &nearr;</a>`
    : "";

  const body = e.body
    ? e.body.map(renderBlock).join("")
    : `<div class="guide-draft">
         <div class="label">Not written yet</div>
         <p>This ${o.kind === "course" ? "chapter" : "guide"} is part of the planned book and is being written next.
            Everything above it in the rail that isn't greyed out is finished and readable now.</p>
       </div>`;

  el.innerHTML = `
    <header class="guide-header">
      <div class="guide-kicker">${kicker}${meta}</div>
      <h2>${escapeHtml(e.title || e.name)}</h2>
      <p class="guide-goal">${escapeHtml(e.goal || e.blurb || "")}</p>
      ${link}
    </header>
    <div class="guide-body">${body}</div>
    <footer class="guide-foot">${navBtn(prev, "prev")}${navBtn(next, "next")}</footer>`;
}

function renderGuide() {
  renderGuideRail();
  renderGuideArticle();
  const o = guideEntry(guideState.activeId);
  document.getElementById("railCurrent").textContent = o ? (o.entry.title || o.entry.name) : "";
}

function setRailOpen(open) {
  document.getElementById("guideAside").classList.toggle("is-open", open);
  document.getElementById("railToggle").setAttribute("aria-expanded", String(open));
}

function openGuide(id) {
  if (!guideEntry(id)) return;
  guideState.activeId = id;
  renderGuide();
  // On the stacked layout the rail is a disclosure; opening a chapter closes it
  // again so the article starts at the top of the screen rather than below a list.
  setRailOpen(false);
  const article = document.getElementById("guideArticle");
  article.focus({ preventScroll: true });
  article.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

// ---------- Wiring ----------

// One delegated listener for the whole view: rail items, prev/next, drill
// reveals, and every country chip and swatch in the prose.
function initGuide() {
  renderGuide();

  document.getElementById("view-guide").addEventListener("click", (ev) => {
    if (ev.target.closest("#railToggle")) {
      setRailOpen(!document.getElementById("guideAside").classList.contains("is-open"));
      return;
    }

    const nav = ev.target.closest("[data-guide]");
    if (nav) { openGuide(nav.dataset.guide); return; }

    const chip = ev.target.closest("[data-country]");
    if (chip) { openCountry(chip.dataset.country); return; }

    const reveal = ev.target.closest(".drill-reveal");
    if (reveal) {
      const answer = document.getElementById(reveal.getAttribute("aria-controls"));
      const open = reveal.getAttribute("aria-expanded") === "true";
      reveal.setAttribute("aria-expanded", String(!open));
      reveal.textContent = open ? "Reveal" : "Hide";
      answer.hidden = open;
    }
  });
}
