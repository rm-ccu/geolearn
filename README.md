# GeoLearn

A country-clue reference and compare tool for [GeoGuessr](https://www.geoguessr.com/) players.

**Live: <https://rm-ccu.github.io/geolearn/>**

GeoLearn collects the small visual tells that identify a country in Street View — which
side of the road traffic drives on, bollard shapes, road-sign styling, licence-plate
colours, script and language, plus the countries it's most often mixed up with — and lets
you look them up or compare them side by side. **Every country in the world is in the
dataset** — all 193 UN members plus Vatican City, Kosovo, Taiwan and Palestine, and the
territories that play as their own place in GeoGuessr (Hong Kong, Macau, Puerto Rico, the
Faroes, Réunion, Guam and the rest). 217 entries in total, each marked with whether Google
actually drove it or whether the only panoramas are user photospheres.

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
├── guides.js       # The COURSE and GUIDE_MAPS arrays — the guidebook's content
├── states.js       # The US_STATES array — 50 states + DC, for the US map guide
├── state-outlines.js # Generated state silhouettes for the route-marker swatches
├── globe-data.js   # Generated country outlines for the globe (see "Globe geometry")
├── globe.js        # The globe itself: projection, drawing, hit-testing, gestures
├── flights.js      # The ambient flight-tracker background (see "The background")
├── flags.js        # Flag <img> renderer + the per-flag aspect ratios
├── flags/          # The 216 real flag images (PNG, public domain)
├── shields.js      # Route-marker renderer — the US analogue of bollardSVG()
├── picker.js       # The searchable country combobox the compare view runs on
├── guide.js        # Renders the guidebook from its typed blocks
├── app.js          # Renders the views, owns the state object, draws the SVG swatches
├── tools/
│   ├── build-globe-data.js       # Regenerates globe-data.js (not part of the page)
│   └── build-state-outlines.js   # Regenerates state-outlines.js
├── README.md
└── .gitignore
```

The scripts load in that order, so `COUNTRIES`, `WORLD_LAND`, `createGlobe()`,
`createFlightField()`, `flagImg()`, and `createCountryPicker()` are all defined as plain
globals by the time `app.js` runs. There are no ES modules and no
`fetch()`, which is why the page works from `file://`.

The UI is three views inside one page — **browse**, **compare** (two countries side by
side, matching fields dimmed and differing fields highlighted), and **guide** (the
guidebook). `app.js` swaps between them by toggling an `.active` class; there is no router.
A single `state` object holds the current view, search text, the selected country, and the
two compare selections; the guidebook keeps its own small `guideState` in `guide.js`.

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
- Typing in the search box overrides the region scope, so a search always covers all 217
  entries rather than silently searching inside one continent.
- Each card carries the country's **flag and ccTLD** next to the bollard — `.ch`, `.ru`,
  `.at`. The domain suffix is a real clue in its own right: it turns up on vans, shopfronts
  and billboards long before you find a road sign.

Everything the globe does is also reachable without it — the list, the search box, and
keyboard control of the globe (arrows to rotate, <kbd>+</kbd>/<kbd>-</kbd> to zoom,
<kbd>Esc</kbd> to clear) all work on their own.

Flags are **real flag images** — see below. The bollard, sign, and plate thumbnails are
still **generated SVG** — `bollardSVG()`, `signSwatch()`, and `plateSwatch()` build them
from the hex colours in `data.js` — so `flags/` is the only place the project keeps
image assets.


### The compare view

Two pickers and a stack of paired rows. Fields that match are dimmed, fields that differ
get a yellow edge, and the point of the page is that you read only the bright ones.

- **The pickers are a custom combobox** (`picker.js`), not a `<select>`. Two hundred and
  eighteen options in a system dropdown is a scroll from Afghanistan to Zimbabwe with no
  way to jump, and it can't draw a flag — the one thing you are picking a country by.
  Each side opens a search field over a listbox: empty, the list is **grouped by region**
  with the ccTLD in the margin; typing collapses it into one **ranked** list — exact
  country code first, so `de` finds Germany, then name-start, word-start, anywhere in the
  name, and finally the region, with the matched run marked. Arrow keys drive the
  highlight through `aria-activedescendant` while focus stays in the field, so <kbd>↑</kbd>
  <kbd>↓</kbd> <kbd>Enter</kbd> <kbd>Esc</kbd> all work without touching the mouse. Each
  picker greys out whatever the other side is holding, because a country compared with
  itself is a page of grey rows.
- **The last row is a pair of globes.** `drawGlobeSnapshot()` in `globe.js` draws one
  frozen frame per country onto a small canvas — the same projection and the same
  prepared geometry as the interactive globe, with everything that moves left out. The
  country is turned to face the viewer so it is always dead centre, land is filled rather
  than wireframed (at 170px an outline is mush), and anything under 14° across gets a
  locator ring, which is the only way Monaco is visible at all. Each globe is drawn in its
  own side's accent — blue on the left, red on the right, matching the picker edge above
  it — so neither column needs a label saying which country it belongs to.

Both pickers and both globes read `state.compareLeft` / `state.compareRight`, which the
`confusedWith` chips in Browse also set: clicking the compare half of a chip fills both
sides and switches view in one go.

### The guidebook

The third view is a book rather than a lookup: a **beginner course** that goes from "I have
no idea" to naming the country, and **per-map guides** for the maps people actually queue
into. A contents rail on the left, one chapter in the reading pane on the right; below
900px the rail collapses behind a one-line **Contents** disclosure so the article stays the
first thing on screen.

Chapters live in `guides.js` as **typed blocks**, not HTML:

| Block | What it renders |
|---|---|
| `p` | A paragraph |
| `steps` | A numbered procedure |
| `callout` | A highlighted tip (`tone: "tip"`) or trap warning (`tone: "warn"`) |
| `swatches` | Real bollard/sign/plate swatches for a list of country ids |
| `diff` | A two-country comparison, same rows the Compare view builds. `rows` picks the fields — `["bollard", "plates"]` for a European pair, `["plates", "signs"]` for an East African one |
| `drills` | Click-to-reveal practice questions, answers linked to countries (or to states) |
| `density` | The urban / suburban / rural columns from `DENSITY_TIERS` — each one the same scan re-ranked, with the cues linked to the chapter that teaches them. `only: ["urban"]` renders a single column, which is how a map guide shows the setting that map is made of |
| `shields` | Route-marker swatches for a list of state ids |
| `families` | The five route-marker families and every state in each, built from `states.js` |
| `state-diff` | Two states side by side — marker family and landscape |
| `test` | The scored self-test, drawn from the `SELF_TEST` array |

The indirection is the point: `swatches` calls `bollardSVG()` and `diff` calls `fieldRow()`,
so **a lesson cannot drift away from `data.js`** — edit a country's bollard colour and every
chapter that draws it updates. Nothing in `guide.js` knows what a bollard looks like.

Prose takes a tiny inline markup — `**bold**`, `` `code` ``, `[[country-id]]` and
`{{entry-id|label}}`. The third becomes a
chip with the country's flag that jumps straight into Browse with that country open
(`openCountry()` in `app.js`), which is the whole reason the guidebook lives inside the app
instead of being a markdown file. Text is escaped before the markup runs, so the markup is
the only thing that can produce a tag; a `[[typo]]` renders as literal text rather than
disappearing. The fourth links one part of the book to another — the World guide points at
the US guide, the streak guide at the chapter that teaches the coverage tiebreaker — and it
needs no wiring, because the delegated handler already routes anything carrying
`data-guide`.

Showing the rows that **cannot** split a pair is half the lesson: on Germany vs Austria the
plate row is deliberately there, dimmed, because those plates will never help you and the
bollard's black cap is the whole difference.

The book is complete: **13 chapters**, 38 drills, a scored **self-test**, and **7 map
guides** — World, A Community World, Famous Places, urban and balanced worlds, country
streaks, the United States and flags. Every country, state, chapter link and drill answer is
checked against `data.js` and `states.js`.

Map guides describe composition **qualitatively and dated**, and link out to the map only
where the URL is verified — three of the seven do. Community maps are re-cut constantly, so
a location count quoted exactly would be wrong within a month.

The self-test is 15 fresh scenarios — nothing repeated from the chapter drills — each with
four candidate countries. The wrong options are **generated, not authored**: they come from
the answer's own `confusedWith` list, so every distractor is a country people genuinely mix
it up with. Short lists are padded from second-degree confusions (a neighbour of a
neighbour) before falling back to the region, and a question can override the set entirely
with an `options` field when the dataset's confusions are not the interesting comparison —
the New Zealand question names Ireland, which matches every clue except the sun's position.

Option order is rotated by a seed derived from the question number *and* the answer's name.
Rotating by the index alone put the correct answer in a visible 0, 3, 2, 1 cycle that could
be read off without knowing any geography.

Each question carries the `ch` of the chapter it comes from, so a wrong answer offers a link
straight back to the reading that would have prevented it, and the end-of-test verdict lists
exactly which chapters to revisit. Answers live in memory only — reload and the test is
fresh, navigate to a chapter and back and your progress is still there.

Nothing is drafting now, but the mechanism stays for whatever gets added next: a chapter
with no `body` still appears in the rail, greyed and flagged **Drafting**, so the shape of
the book is visible from the first screen — and its page says so plainly instead of 404ing.


### US states and route markers

The United States is the one country where getting the country right is worth almost
nothing, so the US map guide works a level down — and it needs its own dataset to do it.
`states.js` holds all 50 states plus the District, **shaped as a sibling of a `COUNTRIES`
entry** (`id`, `name`, `code`, `region`, `keyTip`, `confusedWith`) so it can feed Browse and
Compare later without a reshape. Today only the guidebook reads it.

The field that earns the file is `shield.family`, the route-marker classification:

| Family | States | What it means |
|---|---|---|
| `outline` | 17 | The sign is the state's own silhouette |
| `other` | 16 | A design of the state's own — a keystone, a beehive, a face |
| `square` | 10 | A plain square or rectangular blank |
| `circle` | 6 | The plain federal blank, with no state identity at all |
| `diamond` | 2 | Michigan and North Carolina, and nobody else |

Seeing which family a marker belongs to cuts fifty states to a handful before you have read
the number on it, which is why this is the American bollard. Families are sourced from
routemarkers.com's by-shape index and Wikipedia's coverage of state markers (August 2026);
named emblems are recorded **only where a source names them**, so eight `other` states
(Alaska, Hawaii, Nebraska, New York, North Dakota, Oregon, Vermont, Virginia) have a
distinctive marker this dataset does not yet describe. `shieldSVG()` draws those as a
dashed blank rather than inventing artwork.

`shieldSVG(state, size)` in `shields.js` is the counterpart to `bollardSVG()`: same
fraction-of-`S` convention, same "one definition renders at 34px and 64px alike" rule. It
draws the real sign colours — white on black — rather than the site palette, because that
is what a route marker looks like out in the world.

**The silhouettes are real.** Drawing seventeen state outlines as one generic blob would
teach the wrong shape, and the shape *is* the clue, so `state-outlines.js` is generated the
same way `globe-data.js` is:

```
node tools/build-state-outlines.js
```

It pulls US Census cartographic boundaries from the `us-atlas` package — the sibling of the
`world-atlas` package the globe already uses — decodes the TopoJSON with the same arc
decoder, simplifies with the same Douglas-Peucker, scales x by cos(mean latitude) so states
are not drawn too wide, and normalises each into a 0..1 box with y flipped for SVG. One
transform then drops any state into a sign at any size. Only outline-family states are
emitted; nothing else is drawn from a silhouette, and it keeps Alaska out, whose Aleutian
chain crosses the antimeridian and normalises into an unusable smear.

Like `globe-data.js`, the output is committed, so the page runs as-is and the tool is only
needed when the dataset changes.

---

## What counts as covered

Every country in the world is in here — all 193 UN member states, plus Vatican City,
Kosovo, Taiwan and Palestine — so the answer to "why isn't X in the guide" is never a
coverage rule. On top of that are the dependent territories that play as their own place
in GeoGuessr: Hong Kong, Macau, Puerto Rico, the US Virgin Islands, Bermuda, Curaçao,
Greenland, the Faroes, Åland, Svalbard, Gibraltar, Jersey, the Isle of Man, Réunion, Guam,
the Northern Marianas, American Samoa, Christmas Island, the Cocos Islands, Pitcairn and
Akrotiri and Dhekelia. Their tells are nothing like their parent country's — the USVI
drives on the left with American plates, Macau pairs Portuguese with Chinese.

What differs between entries is **how you can actually be dropped there**, which is what
the `coverage` field records:

- **`official`** — a Street View car or trekker has driven it. 121 entries, taken from the
  rows marked as public in Wikipedia's [Google Street View
  coverage](https://en.wikipedia.org/wiki/Google_Street_View_coverage) table (August 2026).
  This is the set a standard GeoGuessr game draws from.
- **`photospheres`** — no official coverage; the only panoramas are user-uploaded. 96
  entries, including China, Egypt, Iran, Pakistan, Cuba, Paraguay, Tanzania and every
  small Pacific and Caribbean state. They turn up in community maps that allow unofficial
  coverage, and nowhere else.

Photosphere-only entries read as a dimmer fill on the globe, with their own legend key —
that is the at-a-glance version, and the country cards stay uncluttered. The detail panel
says it in words next to the region, and the compare view has a Coverage row. Moldova is
one of them: no official coverage despite being surrounded by countries that have it, and
its key tip says so.

One oddity worth knowing: **Akrotiri and Dhekelia** has no ISO code of its own, so it
carries `GB` — which means it shows the Union Flag and a `.uk` chip. It is a British base
area on Cyprus; if you land there, guessing Cyprus costs you almost nothing.

`region` is used to scope the list when you pick a country, so it is coarse on purpose:
Europe, Eurasia, Asia, Africa, North America, Central America, Caribbean, South America,
Oceania.

---

## Flags

`flags/` holds the real flag of every country in the dataset — public domain artwork from
[flagcdn.com](https://flagcdn.com), rasterised to 160px wide and checked in, so the page
still makes no third-party requests and still works from `file://`. All 216 together are
about 870 KB. (216, not 217: the Akrotiri and Dhekelia entry flies the Union Flag, so it
reuses the UK's file.)

This is the third version. Emoji came first and were dropped: Windows ships no flag glyphs
at all, so a third of visitors saw two boxed letters. Hand-drawn SVG specs came second —
they matched the drawn bollard and plate swatches, but a stylised guess at a coat of arms
is exactly the wrong thing in a reference you're using to learn what a country actually
looks like. Albania's eagle has to be Albania's eagle.

`flagImg(code, name, height)` sizes flags by **height**, not width:

```js
flagImg("CH", "Switzerland", 26)
// <img class="flag" src="flags/ch.png" width="26" height="26" ...>
```

Every flag then sits on the same baseline while keeping its true proportions — Switzerland
is square, the UK and Canada are 2:1, most of Europe is 3:2 — instead of being stretched
into one uniform box. `FLAG_RATIO` in `flags.js` records each image's width/height so the
`<img>` can carry both dimensions up front and nothing reflows as the flags decode. A
country in `data.js` with no entry there falls back to a `?` placeholder rather than a
broken image.

The rounded corners, hairline ring and drop shadow are `.flag` in `style.css`. To add a
country, drop `flags/xx.png` in and add its ratio to `FLAG_RATIO`.

The ccTLD beside each flag is the ISO code lowercased, with an exception table in `app.js`
for the cases where the two diverge — `GB` → `.uk` is the only one in the current dataset.

---

## The mark

The logo in the header is inline SVG in `index.html`, animated entirely in CSS
(`.brand-mark` in `style.css`) — no JS, no GIF, nothing to load.

Two things move. The globe turns: two meridians are drawn as full-width circles and
squashed horizontally with `scaleX`, running a quarter-period apart so one wire is edge-on
while the other is face-on. Scaling is used rather than animating the `rx` attribute so the
whole thing stays on the compositor. Then a route draws itself across the globe on a
separate 6s loop — `pathLength="1"` on the path turns the dash values into plain fractions
of its length — and the pin lands at the end of it with a small overshoot and a halo ping
before the whole thing clears and repeats.

Under `prefers-reduced-motion` every animation is switched off and the mark falls back to
the static logo it was before: one narrow meridian, route drawn, pin sitting at the end.

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
the matching `COUNTRIES` id, so `globe.js` knows which countries are clickable — the
entries too small to survive simplification (the European microstates, Malta, Singapore,
Hong Kong, Macau, and the island territories from the Faroes to Pitcairn) are listed
separately in `WORLD_DOTS` and drawn as marker dots instead.

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
globe you can't click. Anything with no 1:110m outline at all — Singapore, Malta, Macau,
most of the island territories — goes in its `DOTS` table with a lon/lat instead.

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

The unpacked geometry — rings converted to unit vectors once, so a frame only has to apply
two rotations per point — lives in a memoised `globeGeometry()` at module scope rather than
inside `createGlobe()`. The compare view's snapshots read the same arrays, so a second
"globe" on the page costs nothing but the drawing.

Two countries have a largest ring whose bounding box wraps the antimeridian, which makes
the generated `c` and `s` meaningless: Russia and Fiji are both stored at 0°E with a span
of 360°. The interactive globe survives that because you can drag; a snapshot can't, so
`displayShape()` recovers the longitude as the mean direction of every vertex and the span
as the widest angle any vertex makes with it. Latitude is left as generated — it never
wraps, and Russia's Arctic coast carries enough vertices to drag a mean latitude up past
71°N.

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
— nothing else to register or import — plus two side files:

1. **The flag.** `curl -o flags/pt.png https://flagcdn.com/w160/pt.png`, then add the
   image's width/height to `FLAG_RATIO` in `flags.js`. Skip it and the card renders a `?`
   placeholder; everything else still works.
2. **The globe.** `node tools/build-globe-data.js`, adding an `ALIAS` or `DOTS` entry if it
   tells you the name matched no outline. Skip it and the country is in the list but not
   clickable on the globe.

The colour fields are real hex colours: `app.js` draws the little bollard, sign, and plate
swatches from them at runtime, so they need to be valid CSS colours, not names.

```js
{
  id: "portugal", name: "Portugal", code: "PT", region: "Europe", driving: "right",
  coverage: "official",
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
| `code` | `string` | **ISO 3166-1 alpha-2**, uppercase. Drives the flag image and the ccTLD chip (`"CH"` → `flags/ch.png` and `.ch`). The ccTLD is the code lowercased, apart from a small exception table in `app.js` — `GB` → `.uk`. |
| `region` | `string` | Grouping used to scope the list when a country is picked on the globe, and to tint that country's neighbours. Reuse an existing value unless you mean to add a category. Currently: `Europe`, `Eurasia`, `Asia`, `Africa`, `Oceania`, `North America`, `Central America`, `Caribbean`, `South America`. |
| `driving` | `"left"` \| `"right"` | Which side traffic drives on. Rendered as the LEFT/RIGHT tag on each card. |
| `coverage` | `"official"` \| `"photospheres"` | Whether a Street View car has driven the country, or the only panoramas are user photospheres. Drives the dimmer fill on the globe, the line in the detail panel, and a row in the compare view. |
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
