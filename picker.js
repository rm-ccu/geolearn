// GeoLearn country picker — the searchable combobox the compare view runs on.
//
// It replaces a native <select>. Two hundred and eighteen options in a system
// dropdown is a scroll from Afghanistan to Zimbabwe with no way to jump, and it
// can't show a flag, so the thing you are picking a country by is the one thing
// it can't draw.
//
// The shape is a trigger button that opens a popover holding a search field and
// a listbox. With the field empty the list is grouped by region — the useful
// default, because the country you want is usually next to the one you just
// picked. Type, and the grouping collapses into one ranked list: exact code
// first ("de" -> Germany), then name-start, then word-start, then anywhere in
// the name, then the region. The matched run of the name is picked out in the
// result.
//
// Keyboard: the field keeps focus the whole time and drives the list through
// aria-activedescendant, so arrows move the highlight without moving focus,
// Enter picks, Escape closes and hands focus back to the trigger.

const PICKER_REGION_ORDER = [
  "Europe", "Eurasia", "Asia", "Africa",
  "North America", "Central America", "Caribbean", "South America", "Oceania",
];

const pickerRegionRank = (r) => {
  const i = PICKER_REGION_ORDER.indexOf(r);
  return i === -1 ? PICKER_REGION_ORDER.length : i;
};

// -1 means "no match". Lower is better; ties fall back to alphabetical.
function pickerScore(c, q) {
  const name = c.name.toLowerCase();
  if (c.code.toLowerCase() === q) return 0;
  if (name.startsWith(q)) return 1;
  if (name.split(/[\s-]+/).some(w => w.startsWith(q))) return 2;
  if (name.includes(q)) return 3;
  if (c.region.toLowerCase().includes(q)) return 4;
  return -1;
}

// The matched run of the name, marked. Falls back to the plain name when the hit
// was on the code or the region and there is nothing in the name to point at.
function pickerMark(name, q) {
  const at = name.toLowerCase().indexOf(q);
  if (at === -1) return escapeHtml(name);
  return escapeHtml(name.slice(0, at)) +
    `<mark>${escapeHtml(name.slice(at, at + q.length))}</mark>` +
    escapeHtml(name.slice(at + q.length));
}

// The right-hand column of a row. Under a region heading the region is already
// on screen, so the slot pays its way with the ccTLD instead — a real clue in
// its own right, and the same thing the browse cards carry.
function optionTag(c, q, taken) {
  if (taken) return "on the other side";
  return q ? escapeHtml(c.region) : `<span class="mono">${ccTLD(c.code)}</span>`;
}

let _pickerUid = 0;

// `opts.onChange(id)` fires on every pick, including the clear.
// `opts.unavailable` is asked, on every render, for an id that cannot be picked —
// the compare view points it at the other side, since a country compared with
// itself is a page of grey rows.
function createCountryPicker(mount, opts = {}) {
  const uid = "picker-" + (++_pickerUid);
  const onChange = opts.onChange || (() => {});
  const unavailable = opts.unavailable || (() => null);

  let value = null;      // selected country id
  let open = false;
  let query = "";
  let rows = [];         // ids of the rows arrows can reach, top to bottom.
                         // null is the "clear this side" row.
  let active = -1;       // index into rows

  mount.className = "country-picker";
  mount.innerHTML = `
    <button type="button" class="picker-trigger" id="${uid}-trigger"
            aria-haspopup="dialog" aria-expanded="false">
      <span class="picker-face"></span>
      <span class="picker-name">Choose a country&hellip;</span>
      <svg class="picker-caret" viewBox="0 0 12 8" aria-hidden="true">
        <path d="M1 1.6 6 6.4 11 1.6" fill="none" stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="picker-pop" hidden>
      <div class="picker-search-row">
        <svg class="picker-glass" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10.4 10.4 14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input class="picker-search" type="text" role="combobox" autocomplete="off"
               spellcheck="false" aria-expanded="true" aria-autocomplete="list"
               aria-controls="${uid}-list" aria-label="Search countries"
               placeholder="Search ${COUNTRIES.length} countries&hellip;">
      </div>
      <ul class="picker-list" id="${uid}-list" role="listbox" tabindex="-1"
          aria-label="Countries"></ul>
    </div>`;

  const trigger = mount.querySelector(".picker-trigger");
  const pop = mount.querySelector(".picker-pop");
  const search = mount.querySelector(".picker-search");
  const list = mount.querySelector(".picker-list");

  // ---------- The trigger ----------

  function renderTrigger() {
    const c = value ? byId(value) : null;
    const face = mount.querySelector(".picker-face");
    const name = mount.querySelector(".picker-name");
    mount.classList.toggle("has-value", !!c);
    if (c) {
      face.innerHTML = flagImg(c.code, c.name, 20);
      name.textContent = c.name;
      trigger.setAttribute("aria-label", `${opts.label || "Country"}: ${c.name}. Change it.`);
    } else {
      face.innerHTML = "";
      name.innerHTML = "Choose a country&hellip;";
      trigger.setAttribute("aria-label", `${opts.label || "Country"}: none chosen yet.`);
    }
  }

  // ---------- The list ----------

  function matches() {
    const q = query.trim().toLowerCase();
    if (!q) {
      return COUNTRIES.slice().sort((a, b) =>
        pickerRegionRank(a.region) - pickerRegionRank(b.region) ||
        a.name.localeCompare(b.name));
    }
    return COUNTRIES
      .map(c => ({ c, s: pickerScore(c, q) }))
      .filter(x => x.s !== -1)
      .sort((a, b) => a.s - b.s || a.c.name.localeCompare(b.c.name))
      .map(x => x.c);
  }

  function renderList() {
    const q = query.trim().toLowerCase();
    const blocked = unavailable();
    const found = matches();
    rows = [];

    if (found.length === 0) {
      list.innerHTML = `<li class="picker-none" role="presentation">No country matches &ldquo;${escapeHtml(query.trim())}&rdquo;.</li>`;
      setActive(-1);
      return;
    }

    // Row ids are positional. Country ids are slugs with spaces in them ("san
    // marino"), which are not legal in an HTML id, and aria-activedescendant
    // needs a real one to point at.
    const row = (id) => {
      rows.push(id);
      return `${uid}-r${rows.length - 1}`;
    };

    let html = "";
    // Only worth offering once something is chosen, and only in the ungrouped
    // resting state — a "clear" row on top of search results is noise.
    if (value && !q) {
      html += `<li class="picker-row picker-clear" role="option" aria-selected="false"
                   id="${row(null)}">Clear this side</li>`;
    }

    let region = null;
    for (const c of found) {
      if (!q && c.region !== region) {
        region = c.region;
        html += `<li class="picker-group" role="presentation">${escapeHtml(region)}</li>`;
      }
      const taken = c.id === blocked;
      html += `
        <li class="picker-row picker-option${taken ? " is-taken" : ""}" role="option"
            ${taken ? 'aria-disabled="true"' : `id="${row(c.id)}"`}
            data-id="${escapeHtml(c.id)}"
            aria-selected="${c.id === value}">
          ${flagImg(c.code, c.name, 16)}
          <span class="picker-option-name">${q ? pickerMark(c.name, q) : escapeHtml(c.name)}</span>
          <span class="picker-option-tag">${optionTag(c, q, taken)}</span>
        </li>`;
    }
    list.innerHTML = html;

    // Opening on a chosen country should land on it; a fresh search should land
    // on its best hit.
    const at = value ? rows.indexOf(value) : -1;
    setActive(at !== -1 && !q ? at : (rows.length ? 0 : -1), true);
  }

  function rowEl(i) {
    return i < 0 || i >= rows.length ? null : document.getElementById(`${uid}-r${i}`);
  }

  function setActive(i, jump) {
    active = i;
    list.querySelectorAll(".is-active").forEach(el => el.classList.remove("is-active"));
    const el = rowEl(i);
    if (!el) {
      active = -1;
      search.removeAttribute("aria-activedescendant");
      return;
    }
    el.classList.add("is-active");
    search.setAttribute("aria-activedescendant", el.id);

    // Scrolled by hand rather than with scrollIntoView, which is free to scroll
    // the page as well as the list and would yank the whole compare view about.
    const top = el.offsetTop, bottom = top + el.offsetHeight;
    if (jump) list.scrollTop = top - (list.clientHeight - el.offsetHeight) / 2;
    else if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }

  function move(delta) {
    if (!rows.length) return;
    setActive((active + delta + rows.length) % rows.length);
  }

  // ---------- Opening and closing ----------

  function openPop() {
    if (open) return;
    open = true;
    query = "";
    search.value = "";
    pop.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    mount.classList.add("is-open");
    renderList();
    search.focus();
    document.addEventListener("pointerdown", onOutside, true);
  }

  function closePop(refocus) {
    if (!open) return;
    open = false;
    pop.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    mount.classList.remove("is-open");
    document.removeEventListener("pointerdown", onOutside, true);
    if (refocus) trigger.focus();
  }

  function onOutside(e) {
    if (!mount.contains(e.target)) closePop(false);
  }

  function choose(id) {
    value = id || null;
    renderTrigger();
    closePop(true);
    onChange(value);
  }

  // ---------- Wiring ----------

  trigger.addEventListener("click", () => open ? closePop(true) : openPop());

  search.addEventListener("input", () => {
    query = search.value;
    renderList();
  });

  search.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowDown": move(1); break;
      case "ArrowUp": move(-1); break;
      case "Home": setActive(rows.length ? 0 : -1, true); break;
      case "End": setActive(rows.length - 1, true); break;
      case "PageDown": setActive(Math.min(rows.length - 1, active + 8), true); break;
      case "PageUp": setActive(Math.max(0, active - 8), true); break;
      case "Enter":
        if (active >= 0 && active < rows.length) choose(rows[active]);
        break;
      case "Escape": closePop(true); break;
      case "Tab": closePop(false); return;   // let focus leave normally
      default: return;
    }
    e.preventDefault();
  });

  // Pointer, not click: the mousedown would otherwise blur the search field and
  // the outside-click handler would close the popover before the click landed.
  list.addEventListener("mousedown", (e) => e.preventDefault());

  list.addEventListener("click", (e) => {
    if (e.target.closest(".picker-clear")) { choose(null); return; }
    const opt = e.target.closest(".picker-option");
    if (!opt || opt.classList.contains("is-taken")) return;
    choose(opt.dataset.id);
  });

  list.addEventListener("mousemove", (e) => {
    const el = e.target.closest(".picker-row");
    if (!el || !el.id) return;                     // group headings, and taken rows
    const i = Number(el.id.slice((uid + "-r").length));
    if (i !== active) setActive(i);
  });

  renderTrigger();

  return {
    get value() { return value; },
    // Silent: used to sync the button with state the view already knows about,
    // which must not loop back through onChange.
    setValue(id) {
      value = id || null;
      renderTrigger();
      if (open) renderList();
    },
    close: () => closePop(false),
  };
}
