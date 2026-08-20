# GeoLearn

A country-clue reference and compare tool for [GeoGuessr](https://www.geoguessr.com/) players.

**Live: <https://rm-ccu.github.io/geolearn/>**

GeoLearn collects the small visual tells that identify a country in Street View — which
side of the road traffic drives on, bollard shapes, road-sign styling, licence-plate
colours, script and language, plus the countries it's most often mixed up with — and lets
you look them up or compare them side by side.

It's a **static site with no build step and no framework**: plain HTML, CSS, and
JavaScript. Nothing to install, nothing to compile.

---

## Project structure

```
geolearn/
├── index.html   # Static shell: header, and the three <section> views
├── style.css    # All styling (dark "asphalt" theme, CSS custom properties in :root)
├── data.js      # The COUNTRIES array — the entire dataset
├── app.js       # Renders all three views, owns the state object, draws the SVG swatches
├── README.md
└── .gitignore
```

`data.js` is loaded before `app.js`, so the `COUNTRIES` global exists by the time the app
code runs. There are no ES modules and no `fetch()`, which is why the page works from
`file://`.

The UI is three views inside one page — **browse** (searchable/filterable card grid),
**detail** (one country's full clue breakdown), and **compare** (two countries side by side
with matching fields dimmed and differing fields highlighted). `app.js` swaps between them
by toggling an `.active` class; there is no router, so all three live in `index.html` at
once. A single `state` object holds the current view, search text, region filter, and the
two compare selections.

The bollard, sign, and plate thumbnails are **generated SVG**, not images — `bollardSVG()`,
`signSwatch()`, and `plateSwatch()` build them from the hex colours in `data.js`. That's why
the project has no image assets at all.

---

## Running it locally

**Option 1 — just open the file.** Double-click `index.html`, or:

```bash
open index.html          # macOS
```

Since there's no build step and no `fetch()` of local files, this works directly off
`file://`.

**Option 2 — serve it over HTTP.** Preferable if you add anything that a browser blocks on
`file://` later (ES modules, `fetch`, service workers):

```bash
npx serve .
```

```bash
python3 -m http.server 8000
```

Then visit the URL it prints — usually <http://localhost:3000> for `serve` or
<http://localhost:8000> for the Python server.

> **Tip:** browsers cache aggressively on localhost. If an edit doesn't show up, hard-reload
> with <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>.

---

## Adding a new country

Every country is one object in the `COUNTRIES` array in `data.js`. Add an entry and reload
— there is nothing else to register or import.

The colour fields are real hex colours: `app.js` draws the little bollard, sign, and plate
swatches from them at runtime, so they need to be valid CSS colours, not names.

```js
{
  id: "portugal", name: "Portugal", region: "Europe", driving: "right",
  bollard: { body: "#f5f5f0", cap: "#1b1d21", band: "#c1443c", shape: "flat",
             notes: "White post with a black cap and a red reflective band near the top." },
  signs:   { bg: "#ffffff", accent: "#1b1d21",
             notes: "Red-bordered circular signs; place names on white with a thin black border." },
  plates:  { bg: "#ffffff",
             notes: "White plate, yellow strip on the right edge, blue EU band on the left." },
  language:{ script: "Latin",
             notes: "Portuguese — look for ç, ã, õ and the frequent word 'Rua'." },
  keyTip: "Cobbled sidewalks (calçada) in black-and-white patterns are near-conclusive.",
  confusedWith: ["spain", "brazil"]
}
```

### Field reference

| Field | Type | What it holds |
| --- | --- | --- |
| `id` | `string` | Unique lowercase slug. Used for lookups and referenced by other entries' `confusedWith`, so it must stay unique and stable. |
| `name` | `string` | Display name shown in the UI. |
| `region` | `string` | Grouping used to build the region filter buttons. A new value automatically adds a new filter button, so reuse an existing one unless you mean to add a category. Currently: `Europe`, `Europe/Asia`, `Asia`, `Oceania`, `North America`, `South America`. |
| `driving` | `"left"` \| `"right"` | Which side traffic drives on. Rendered as the LEFT/RIGHT tag on each card. |
| `bollard` | `object` | See below. |
| `signs` | `object` | See below. |
| `plates` | `object` | See below. |
| `language` | `object` | See below. |
| `keyTip` | `string` | The one give-away you'd rely on under time pressure. Shown on the card and as the "fastest tell" banner. Keep it to a sentence. |
| `confusedWith` | `string[]` | Array of **other entries' `id` values**. Renders the compare shortcuts at the bottom of the detail view. |

**`bollard`**

| Key | Type | Notes |
| --- | --- | --- |
| `body` | hex | Main post colour. |
| `cap` | hex or `null` | Colour of the cap block at the top. Use `null` for no cap — the key must be present either way. |
| `band` | hex | Reflector band colour. |
| `shape` | `string` | Free-text shape label (`flat`, `domed`, `wedge`, `cylindrical`, …). **Currently used only to decide whether two bollards count as "different" in the compare view — it does not change how the SVG is drawn.** |
| `notes` | `string` | Prose description shown under the swatch. |

**`signs`** — `bg` (hex background), `accent` (hex for the bar across the swatch), `notes` (prose).

**`plates`** — `bg` (hex plate background), `notes` (prose). Note the blue side band in the
plate swatch is currently hardcoded and drawn for every country, EU or not.

**`language`** — `script` (e.g. `"Latin"`, `"Cyrillic"`, `"Kanji/Kana"`; shown in monospace
and diffed in the compare view) and `notes` (prose).

### Conventions worth keeping

- **Keep `id` stable.** Other entries point at it through `confusedWith`; renaming an `id`
  silently orphans those links.
- **Prefer ids that already exist.** A `confusedWith` id with no matching entry renders as a
  dimmed, non-clickable chip — it shows up in the UI as a "not added yet" placeholder rather
  than breaking, but it can't be compared against.
- **Make `confusedWith` mutual.** If Portugal lists Spain, Spain should list Portugal, or the
  shortcut only appears from one side.
- **Always include every key**, including `bollard.cap: null`. The SVG helpers read these
  directly and a missing key renders wrong rather than erroring loudly.
- **Mind the commas** between objects — a stray or missing one is a syntax error that stops
  `data.js` loading entirely, which shows up as a completely blank page.

## Deploying

The site is entirely static, so any host that serves files will do.

### GitHub Pages — already set up

This repo publishes to <https://rm-ccu.github.io/geolearn/> from `main` / `(root)`.
**Every push to `main` triggers a rebuild**, which takes about a minute.

Because `index.html` is at the repo root and every asset path is relative, no workflow file
or configuration is needed. If you ever need to re-point it: **Settings → Pages → Deploy
from a branch → `main` / `(root)`**.

### Netlify

Drag the project folder onto <https://app.netlify.com/drop> for an instant deploy, or
connect the Git repo and set:

- **Build command:** *(leave empty)*
- **Publish directory:** `.`

Every push to `main` then redeploys automatically.
