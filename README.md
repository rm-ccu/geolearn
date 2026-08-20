# GeoLearn

A country-clue reference and compare tool for [GeoGuessr](https://www.geoguessr.com/) players.

**Live: <https://rm-ccu.github.io/geolearn/>**

GeoLearn collects the small visual tells that identify a country in Street View — which
side of the road traffic drives on, bollard shapes, road-sign styling, licence-plate
colours, script and language, plus the countries it's most often mixed up with — and lets
you look them up or compare them side by side. **53 countries** are covered so far.

It's a **static site with no build step and no framework**: plain HTML, CSS, and
JavaScript. Nothing to install, nothing to compile. (One generated file, `globe-data.js`,
has a script that rebuilds it — but it's already committed, so the page runs as-is.)

---

## Project structure

```
geolearn/
├── index.html      # Static shell: header, and the two <section> views
├── style.css       # All styling (dark "asphalt" theme, CSS custom properties in :root)
├── data.js         # The COUNTRIES array — the entire dataset
├── globe-data.js   # Generated country outlines for the globe (see "Globe geometry")
├── globe.js        # The globe itself: projection, drawing, hit-testing, gestures
├── flights.js      # The ambient flight-tracker background (see "The background")
├── flags.js        # Flag specs + the SVG flag renderer
├── app.js          # Renders the views, owns the state object, draws the SVG swatches
├── tools/
│   └── build-globe-data.js   # Regenerates globe-data.js (not part of the page)
├── README.md
└── .gitignore
```

The scripts load in that order, so `COUNTRIES`, `WORLD_LAND`, `createGlobe()`, and
`createFlightField()`, and `flagSVG()` are all defined as plain globals by the time
`app.js` runs. There are no ES modules and no
`fetch()`, which is why the page works from `file://`.

The UI is two views inside one page — **browse** and **compare** (two countries side by
side, matching fields dimmed and differing fields highlighted). `app.js` swaps between them
by toggling an `.active` class; there is no router. A single `state` object holds the
current view, search text, the selected country, and the two compare selections.

### The browse view

Browse is a search box, a globe, and a country list, and picking a country never leaves the
page:

- **Click a country on the globe** (or a card in the list) and it flies to that country and
  highlights it, the list narrows to that country's region, and its full clue breakdown
  opens in a panel on the right while the list slides into a compact column on the left.
- **Click the ocean, press <kbd>Esc</kbd>, or hit "Show all"** to clear the selection: the
  globe zooms back out and the full list returns.
- The globe is a **hollow monochrome wireframe** — no ocean, no solid body, just the
  graticule and country outlines, with the far side of the shell showing faintly through
  it. Coverage is what fills a country in: countries in `data.js` are filled, the rest are
  empty outlines that say "not in the guide yet" on hover. Brightness carries the rest of
  the state — the others in the selected country's region are filled brighter (the visual
  echo of the filtered list), and the selected country itself is solid white with a glow.
- Typing in the search box overrides the region scope, so a search always covers all 53
  countries rather than silently searching inside one continent.
- Each card carries the country's **flag and ccTLD** next to the bollard — `.ch`, `.ru`,
  `.at`. The domain suffix is a real clue in its own right: it turns up on vans, shopfronts
  and billboards long before you find a road sign.

Everything the globe does is also reachable without it — the list, the search box, and
keyboard control of the globe (arrows to rotate, <kbd>+</kbd>/<kbd>-</kbd> to zoom,
<kbd>Esc</kbd> to clear) all work on their own.

Flags are **drawn, not emoji** — see below. The bollard, sign, and plate thumbnails are
**generated SVG**, not images — `bollardSVG()`,
`signSwatch()`, and `plateSwatch()` build them from the hex colours in `data.js`. That's why
the project has no image assets at all.

---

## Flags

`flags.js` draws all 53 flags from a small declarative spec, in the same spirit as the
bollard and plate swatches. Emoji flags were the first attempt and were dropped: they
carried a different visual language to everything else on the page, and Windows ships no
flag glyphs at all, so a third of visitors would have seen two boxed letters.

Every flag is authored in a fixed `60x40` viewBox, so `flagSVG(code, name, width)` only has
to set width and height. A spec is usually one line:

```js
DE: { h: ["#000000", "#dd0000", "#ffce00"] },        // horizontal bands
FR: { v: ["#002654", "#ffffff", "#ce1126"] },        // vertical bands
DK: { nordic: ["#c8102e", "#ffffff"] },              // off-centre cross
ES: { raw: `...` },                                   // hand-drawn
HR: { h: [...], over: `...` },                        // bands plus an emblem
```

Bands take `[colour, weight]` pairs when the stripes aren't equal, and there are shared
helpers for the shapes that recur: `star()`, `sunburst()`, `shield()`, `nordicCross()`,
`doubleEagle()`, and a `unionJack` that scales into the canton of the Australian and New
Zealand flags.

**Emblems are stylised on purpose.** These render between 26 and 40 pixels wide, where real
heraldry is sub-pixel mush — Albania's eagle is a silhouette with two beaked heads rather
than an attempt at the actual bird, and Spain's coat of arms is a suggestion of one. The
target is what you'd recognise in a thumbnail, not what a vexillologist would accept.

The ccTLD beside each flag is the ISO code lowercased, with an exception table in `app.js`
for the cases where the two diverge — `GB` → `.uk` is the only one in the current dataset.

---

## The background

Behind the whole page, `flights.js` runs an ambient flight tracker: a faint world map with
aircraft moving along real great-circle corridors, trails behind them. It is decoration —
`pointer-events: none`, no interaction, nothing to click.

**It is a simulation, not a live feed.** The 64 airports and the 66 city pairs between them
are real, but the aircraft are generated locally. A live feed would mean an API key, a
network round-trip, and a page that no longer opens from `file://` — a poor trade for
something whose entire job is to add depth behind the content. If you ever do want real
traffic, the shape to fill is `flights`: give each entry a position and a heading and the
renderer does not care where they came from.

Three things keep it cheap enough to leave running:

- **Two stacked canvases.** `#flightMap` holds the coastlines, graticule, airport dots and
  route corridors — all static, redrawn only on resize. `#flightField` holds the aircraft.
  The animated layer never repaints the map underneath it.
- **Corridors are cached in screen space.** Each route is sampled into a `Float32Array`
  once per resize, so drawing a trail or placing an aircraft is array lookups and a lerp
  rather than a great-circle interpolation per point per frame. This is what took the frame
  from ~6 ms to ~0.1 ms.
- **30 fps, at up to 1.5× device pixel ratio, paused when the tab is hidden**, and frozen
  entirely under `prefers-reduced-motion` — the map still draws, the aircraft just hold
  position.

The coastlines come from `WORLD_LAND` in `globe-data.js`, so the background costs no extra
data at all.

---

## Globe geometry

`globe-data.js` is **generated, not hand-written**. It holds 177 country outlines derived
from [Natural Earth](https://www.naturalearthdata.com/) 1:110m country boundaries (public
domain), taken from the `world-atlas` package and processed down to something small enough
to ship inline:

- TopoJSON arcs decoded to absolute lon/lat degrees
- outer rings only — holes are invisible at this scale
- rings smaller than ~1.1° of bounding-box diagonal dropped, except each country's largest
- Douglas-Peucker simplified at 0.28°, coordinates rounded to 2 decimals

That leaves ~5,000 points in ~70 KB, which draws at 60 fps. Each entry also carries `g`,
the matching `COUNTRIES` id, so `globe.js` knows which countries are clickable — the four
countries too small to survive simplification (Andorra, Liechtenstein, Monaco, San Marino)
are listed separately in `WORLD_DOTS` and drawn as marker dots instead.

**When you add a country to `data.js`, regenerate `globe-data.js`** so the new country
becomes clickable on the globe:

```bash
node tools/build-globe-data.js
```

That needs a network connection and nothing else — no `npm install`, no dependencies. It
matches Natural Earth's `properties.name` against the `name` field in `data.js`; those
spellings don't always agree (`United States of America`, `Bosnia and Herz.`, `Macedonia`),
so a small `ALIAS` table at the top of the script covers the differences. If a country
matches nothing the script tells you which one and stops, rather than quietly shipping a
globe you can't click. Countries too small to survive simplification go in its `DOTS`
table instead.

`globe.js` itself has no dependencies. It projects orthographically — `lambda` spins about
the polar axis, `phi` tilts, and the centre of the disc is always
`(-lambda, phi)` — draws to a 2D canvas, and hit-tests clicks by inverting the projection
and running a point-in-polygon test in lon/lat.

Because the shell is transparent, each ring is drawn twice per frame: once for the near
face and once for the far one, with points on the opposite face pushed out to the limb so a
country straddling the horizon stays sealed against the edge. Rings with nothing on the
face being drawn have to be skipped rather than drawn as degenerate limb-hugging paths,
which is what `buildPath()` returns a boolean for. Far-side detail fades out as you zoom
in — seeing through the shell is the point at globe scale, but close up the antipodes
project straight over what you are looking at. A whole frame costs about half a
millisecond.

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
| `name` | `string` | Display name shown in the UI. Also what `tools/build-globe-data.js` matches against Natural Earth to find the country's outline. |
| `code` | `string` | **ISO 3166-1 alpha-2**, uppercase. Drives the flag emoji and the ccTLD chip (`"CH"` → 🇨🇭 and `.ch`). The ccTLD is the code lowercased, apart from a small exception table in `app.js` — `GB` → `.uk`. |
| `region` | `string` | Grouping used to scope the list when a country is picked on the globe, and to tint that country's neighbours. Reuse an existing value unless you mean to add a category. Currently: `Europe`, `Europe/Asia`, `Asia`, `Africa`, `Oceania`, `North America`, `South America`. |
| `driving` | `"left"` \| `"right"` | Which side traffic drives on. Rendered as the LEFT/RIGHT tag on each card. |
| `bollard` | `object` | See below. |
| `signs` | `object` | See below. |
| `plates` | `object` | See below. |
| `language` | `object` | See below. |
| `keyTip` | `string` | The one give-away you'd rely on under time pressure. Shown on the card and as the "fastest tell" banner. Keep it to a sentence. |
| `confusedWith` | `string[]` | Array of **other entries' `id` values**. Renders the shortcut chips at the bottom of the detail panel — the left half of a chip opens that country, the right half opens the compare view. |

**`bollard`**

| Key | Type | Notes |
| --- | --- | --- |
| `body` | hex | Main post colour. |
| `cap` | hex or `null` | Colour of the cap block at the top. Use `null` for no cap — the key must be present either way. |
| `band` | hex | Reflector band colour. |
| `shape` | `string` | Selects the silhouette drawn by `bollardGeometry()` in `app.js`. Must be one of the 13 known values: `flat`, `flat-narrow`, `thick-rect`, `flat-back`, `offset`, `domed`, `rounded`, `rounded-wrap`, `cylindrical`, `wedge`, `wedge-rare`, `reflector-post`, `sparse`. An unrecognised value silently falls back to `flat`, so add a `case` to `bollardGeometry()` before inventing a new label. |
| `notes` | `string` | Prose description shown under the swatch. |

**`signs`** — `bg` (hex background), `accent` (hex for the bar across the swatch), `notes` (prose).

**`plates`** — `bg` (hex plate background), `band` (hex for the vertical side band, or
`null` for none), `notes` (prose). Use `null` for countries with no side band at all
(Switzerland, USA, Japan, Norway, UK…). The convention is that `band` represents a
*vertical* side stripe; where a country's stripe runs across the top instead (Mercosur
plates in Brazil and Argentina), leave `band: null` and describe it in `notes`.

**`language`** — `script` (e.g. `"Latin"`, `"Cyrillic"`, `"Kanji/Kana"`; shown in monospace
and diffed in the compare view) and `notes` (prose).

### Conventions worth keeping

- **Keep `id` stable.** Other entries point at it through `confusedWith`; renaming an `id`
  silently orphans those links.
- **Prefer ids that already exist.** A `confusedWith` id with no matching entry renders as a
  dimmed, non-clickable chip — a visible "not added yet" placeholder rather than a crash, but
  it can't be compared against. The dataset currently has none of these; keep it that way.
- **Make `confusedWith` mutual.** If Portugal lists Spain, Spain should list Portugal, or the
  shortcut only appears from one side.
- **Always include every key**, including `bollard.cap: null` and `plates.band: null`. The
  SVG helpers read these directly, and a missing key renders wrong rather than erroring
  loudly.
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
