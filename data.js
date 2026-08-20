// GeoLearn data — community-sourced GeoGuessr identification clues.
// Colors are used to draw the bollard/sign swatches. Extend this array to add countries.

const COUNTRIES = [
  {
    id: "germany", name: "Germany", code: "DE", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Flat white rectangular post, red or white reflector band, no dark cap." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Ortsschild town signs are white with black border/text. Info boards in town centres skew dark, not blue." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'D' on the left, black city code + letters + numbers, round TÜV inspection sticker top right." },
    language: { script: "Latin", notes: "German — umlauts ä ö ü and ß appear regularly." },
    keyTip: "Flat white bollard, no black cap. If you see a black cap, you're probably in Austria instead.",
    confusedWith: ["austria", "switzerland", "poland", "netherlands", "denmark", "luxembourg"]
  },
  {
    id: "austria", name: "Austria", code: "AT", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: "#1b1d21", band: "#5a2a24", shape: "flat", notes: "Same white flat body as Germany, but with a distinct black/dark cap and a dark red or blackish reflector." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Town-centre info boards commonly use a blue background — a fast tell against Germany and Slovenia's darker boards." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'A', district-code letters then numbers, black text." },
    language: { script: "Latin", notes: "German with Austrian vocabulary (e.g. Gehsteig vs Germany's Gehweg) — a tiebreaker if you can read signage." },
    keyTip: "Black cap + dark reflector on the bollard is unique to Austria — no other country has both.",
    confusedWith: ["germany", "slovenia", "switzerland", "czechia", "hungary", "liechtenstein"]
  },
  {
    id: "switzerland", name: "Switzerland", code: "CH", region: "Europe", driving: "right",
    bollard: { body: "#c1443c", cap: null, band: "#ffffff", shape: "domed", notes: "Distinctive red domed-top post, quite different from the flat German/Austrian posts." },
    signs: { bg: "#ffffff", accent: "#c1443c", notes: "Blue direction signs like much of Europe, but red-bordered warning signs and very clean, well-maintained road paint." },
    plates: { bg: "#ffffff", band: null, notes: "White plate, black text, canton abbreviation, no blue EU band (Switzerland isn't in the EU)." },
    language: { script: "Latin", notes: "German, French, or Italian depending on canton — regional split is itself a clue to which part of the country you're in." },
    keyTip: "No blue EU band on the plate is the fastest confirm — Germany and Austria both have it, Switzerland never does.",
    confusedWith: ["germany", "austria", "liechtenstein"]
  },
  {
    id: "france", name: "France", code: "FR", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: "#c1443c", band: "#c1443c", shape: "rounded", notes: "Rounded-top white post with a red cap and a red reflector band that wraps around the post." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signs, and famously long white dashed centre-lines on rural roads." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'F', black text, department number visible at the end." },
    language: { script: "Latin", notes: "French — accented characters (é, è, ç) and article words (le, la, les) on signage." },
    keyTip: "Very long white dashes down the centre of the road are a strong France tell almost nowhere else matches.",
    confusedWith: ["belgium", "monaco", "luxembourg", "andorra"]
  },
  {
    id: "belgium", name: "Belgium", code: "BE", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat-narrow", notes: "Narrow flat white post, red reflector — visually close to Netherlands/Germany, so lean on other clues." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Bilingual signage (French/Dutch) in and around Brussels is the single strongest Belgium tell." },
    plates: { bg: "#ff3b30", band: null, notes: "Older-style plates often show red lettering/blur rather than the standard black-on-white EU format." },
    language: { script: "Latin", notes: "French in Wallonia, Dutch in Flanders, both on many national signs — dual-language signage is very diagnostic." },
    keyTip: "Bilingual French/Dutch place names on the same sign narrows you to Belgium almost immediately.",
    confusedWith: ["netherlands", "france", "luxembourg"]
  },
  {
    id: "netherlands", name: "Netherlands", code: "NL", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat-narrow", notes: "Similar flat white/red post family to Belgium and Germany — not a strong standalone clue here." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Distinct red-bordered cycling infrastructure signs and dedicated red-brick bike lanes are the giveaway." },
    plates: { bg: "#fadb2c", band: "#3b6ea8", notes: "Bright yellow plates with black text — one of the most recognisable plate colours in Europe." },
    language: { script: "Latin", notes: "Dutch — watch for doubled vowels (aa, oo, ee) and 'straat'/'weg' endings on street names." },
    keyTip: "Yellow plates with black text are close to a guaranteed Netherlands confirm.",
    confusedWith: ["belgium", "germany"]
  },
  {
    id: "italy", name: "Italy", code: "IT", region: "Europe", driving: "right",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge", notes: "Black diagonal wedge body reaching to the top, vertical red rectangle on the front, white rectangle on the back." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional arrows and blue-background motorway signage (green is reserved for the autostrada system)." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue side stripe (not full EU band position), black text." },
    language: { script: "Latin", notes: "Italian — double consonants and vowel-heavy endings (-o, -a, -i)." },
    keyTip: "Black wedge bollard with a vertical red front stripe — Albania shares this almost exactly, use language/architecture to split them.",
    confusedWith: ["albania", "san marino", "monaco"]
  },
  {
    id: "albania", name: "Albania", code: "AL", region: "Europe", driving: "right",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge", notes: "Effectively identical to Italy's bollard — this pairing is a known trap, don't rely on it alone." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Rougher road maintenance and older infrastructure than Italy on average — a soft, not certain, tell." },
    plates: { bg: "#ffffff", band: null, notes: "White plate, black text, 'AL' country oval sometimes visible, distinct from Italy's EU-band format." },
    language: { script: "Latin", notes: "Albanian — look for 'ë' and words ending in -a/-i that don't read as Italian; shop signage is the fastest confirm." },
    keyTip: "If the bollard says Italy but the language on any visible sign doesn't look Italian, you're almost certainly in Albania.",
    confusedWith: ["italy", "north macedonia", "montenegro"]
  },
  {
    id: "poland", name: "Poland", code: "PL", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: "#1b1d21", band: "#c1443c", shape: "flat", notes: "Flat white post with a black top section — different profile from Germany's plain flat post." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Village name signs are white with a red border, black text, and a small locator map top corner." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'PL', black text, distinctive province-letter prefix." },
    language: { script: "Latin", notes: "Polish — heavy consonant clusters (sz, cz, rz) and diacritics (ł, ż, ń) are a fast confirm." },
    keyTip: "Black-topped flat bollard plus red-bordered village signs is a strong combined Poland tell.",
    confusedWith: ["germany", "czechia", "slovakia"]
  },
  {
    id: "czechia", name: "Czechia", code: "CZ", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2a900", shape: "flat", notes: "Flat white post with a fluorescent orange reflector band — the orange tone is unusually bright versus neighbours." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage similar to Slovakia and Austria; rely on the bollard's orange band to split from those." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'CZ', black text." },
    language: { script: "Latin", notes: "Czech — háček diacritics (č, š, ž) and 'ř', a sound essentially unique to Czech." },
    keyTip: "Fluorescent orange reflector on a flat white bollard is a near-unique Czechia signature.",
    confusedWith: ["slovakia", "austria", "poland"]
  },
  {
    id: "denmark", name: "Denmark", code: "DK", region: "Europe", driving: "right",
    bollard: { body: "#c1443c", cap: null, band: "#ffffff", shape: "rounded-wrap", notes: "Red post with a reflective band that wraps fully around it, similar concept to France but different colour balance." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Very flat terrain, dense cyclist infrastructure, and distinctly Scandinavian place names on white-background signs." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'DK', black text on a slightly squarer plate shape." },
    language: { script: "Latin", notes: "Danish — the letters æ, ø, å are the giveaway versus German or Dutch." },
    keyTip: "æ / ø / å on any sign is close to a guaranteed Denmark (or wider Nordic) confirm.",
    confusedWith: ["sweden", "norway", "germany"]
  },
  {
    id: "sweden", name: "Sweden", code: "SE", region: "Europe", driving: "right",
    bollard: { body: "#f2c14e", cap: null, band: "#1b1d21", shape: "reflector-post", notes: "Distinct yellow/black reflector posts on rural roads, quite different from Denmark's red post." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage; dense birch and pine forest is common on rural roads." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "Blue-edged plate band with 'S', white background, black text." },
    language: { script: "Latin", notes: "Swedish — å, ä, ö appear, but ä/ö are shared with Finnish signage in bilingual areas, so check for å specifically." },
    keyTip: "Yellow-and-black rural reflector posts plus å/ä/ö text points to Sweden over Denmark or Norway.",
    confusedWith: ["norway", "finland", "denmark"]
  },
  {
    id: "norway", name: "Norway", code: "NO", region: "Europe", driving: "right",
    bollard: { body: "#f2c14e", cap: null, band: "#1b1d21", shape: "reflector-post", notes: "Similar reflector-post family to Sweden; terrain (fjords, tunnels, steep mountain roads) is the real differentiator." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Frequent tunnels and dramatic elevation change are a strong Norway signature versus flatter Sweden/Denmark." },
    plates: { bg: "#ffffff", band: null, notes: "White plate, black text, no blue EU band since Norway isn't in the EU." },
    language: { script: "Latin", notes: "Norwegian — æ, ø, å like Danish, but Norwegian spelling and grammar diverge on closer signage reading." },
    keyTip: "No blue EU band on the plate, combined with mountainous terrain, is the fastest Norway confirm.",
    confusedWith: ["sweden", "denmark", "iceland"]
  },
  {
    id: "finland", name: "Finland", code: "FI", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "cylindrical", notes: "Cylindrical white post shape stands out from the flatter posts used elsewhere in Scandinavia." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Bilingual Finnish/Swedish signage in coastal regions; dense uniform birch forest inland." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'FIN', black text." },
    language: { script: "Latin", notes: "Finnish is unrelated to the other Nordic languages — long compound words with double vowels (aa, ää, öö) are distinctive." },
    keyTip: "Cylindrical (not flat) bollard shape plus non-Germanic-looking language text is the Finland signature.",
    confusedWith: ["sweden", "estonia"]
  },
  {
    id: "croatia", name: "Croatia", code: "HR", region: "Europe", driving: "right",
    bollard: { body: "#ffffff", cap: null, band: "#c1443c", shape: "flat-back", notes: "White front face, but the back of the bollard is distinctly white rather than the darker backs common elsewhere in the Balkans." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage; coastal roads have limestone terrain and Mediterranean vegetation." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'HR', black text, city-code prefix." },
    language: { script: "Latin", notes: "Croatian uses Latin script with č/ć/š/ž — a fast split from Serbia, which commonly uses Cyrillic." },
    keyTip: "Latin script with č/ć/š/ž (not Cyrillic) is the quickest Croatia vs Serbia split.",
    confusedWith: ["serbia", "slovenia", "bosnia"]
  },
  {
    id: "serbia", name: "Serbia", code: "RS", region: "Europe", driving: "right",
    bollard: { body: "#ffffff", cap: null, band: "#c1443c", shape: "offset", notes: "Red rectangle sits slightly off-centre on the reflector band, a small but noted distinguishing detail from Croatia." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Mixed Cyrillic and Latin signage is common — seeing Cyrillic at all is a strong Balkans-region narrower." },
    plates: { bg: "#ffffff", band: null, notes: "White plate, black text, no blue EU strip since Serbia isn't in the EU." },
    language: { script: "Latin & Cyrillic", notes: "Serbian is often written in Cyrillic on official signage even though Latin is also used day-to-day." },
    keyTip: "Any Cyrillic text on road signage is a strong signal for Serbia over Croatia.",
    confusedWith: ["croatia", "bosnia", "montenegro", "bulgaria", "north macedonia"]
  },
  {
    id: "spain", name: "Spain", code: "ES", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Flat white post, red reflector; distinct mainly through colour context on the wider sign environment." },
    signs: { bg: "#ffffff", accent: "#c1443c", notes: "White background town signs with red border, and very orange/dry roadside vegetation inland." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'E', black text, no city code (unlike most of Europe, Spanish plates are randomised)." },
    language: { script: "Latin", notes: "Spanish — ñ and inverted punctuation (¿ ¡) are distinctive; regional co-official languages (Catalan, Basque, Galician) appear on some signs." },
    keyTip: "Randomised plate format with no visible city/province code is a strong Spain-specific tell.",
    confusedWith: ["portugal", "andorra"]
  },
  {
    id: "portugal", name: "Portugal", code: "PT", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2c14e", shape: "flat", notes: "Flat white post but with a yellow reflector band rather than Spain's red." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Black-and-white cobblestone (calçada) pavement in towns is a distinctly Portuguese texture." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'P', black text, dashes separating letter/number groups." },
    language: { script: "Latin", notes: "Portuguese — tildes (ã, õ) and 'ç' distinguish it from Spanish at a glance." },
    keyTip: "Black-and-white cobblestone pavement in a town centre is close to a guaranteed Portugal confirm.",
    confusedWith: ["spain", "brazil"]
  },
  {
    id: "uk", name: "United Kingdom", code: "GB", region: "Europe", driving: "left",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge-rare", notes: "Bollards are comparatively rare; when present, black-and-white sections with a large red rectangle on top." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue motorway signage, roundabout-heavy junctions, and yellow grid-lines painted at some intersections." },
    plates: { bg: "#fadb2c", band: null, notes: "Yellow rear plate / white front plate, black text, no blue EU strip post-Brexit." },
    language: { script: "Latin", notes: "English, with Welsh/Gaelic bilingual signage in Wales and parts of Scotland." },
    keyTip: "Left-hand driving plus yellow rear plates narrows Europe down to essentially the UK and Ireland — check for bilingual Welsh/Gaelic text to split them.",
    confusedWith: ["ireland", "cyprus"]
  },
  {
    id: "ireland", name: "Ireland", code: "IE", region: "Europe", driving: "left",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge-rare", notes: "Similar sparse bollard usage to the UK; not a strong standalone differentiator." },
    signs: { bg: "#3b6ea8", accent: "#f2c14e", notes: "Distances in kilometres on green-background signs (vs the UK's miles on green/blue), and widespread bilingual Irish/English text." },
    plates: { bg: "#fadb2c", band: "#3b6ea8", notes: "Yellow plate, black text, but format includes a year-and-county code prefix distinct from UK plates." },
    language: { script: "Latin", notes: "Irish (Gaelic) alongside English on almost all official signage — the clearest tell against the UK." },
    keyTip: "Bilingual Irish/English signage with kilometre distances is a fast, reliable Ireland confirm.",
    confusedWith: ["uk", "iceland"]
  },
  {
    id: "hungary", name: "Hungary", code: "HU", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Flat white post, red reflector band positioned lower on the post than most neighbours." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage; flat plains (the Great Hungarian Plain) dominate outside Budapest." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'H', black text." },
    language: { script: "Latin", notes: "Hungarian is unrelated to neighbouring languages — heavy accented vowels (ő, ű) are a fast confirm." },
    keyTip: "ő / ű accented vowels on signage are essentially unique to Hungarian in this region.",
    confusedWith: ["slovakia", "romania", "austria", "slovenia"]
  },
  {
    id: "romania", name: "Romania", code: "RO", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Flat white/red post family shared with much of Central Europe — not a strong standalone clue." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Rougher rural road surfaces and horse-drawn cart use are still visible in many regions." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'RO', black text, county-letter prefix." },
    language: { script: "Latin", notes: "Romanian is a Romance language written in Latin script with ă, â, î, ș, ț diacritics — visually distinct from Slavic neighbours." },
    keyTip: "Romance-looking vocabulary (closer to Italian than to Hungarian/Slavic) with ă/â/î/ș/ț diacritics confirms Romania.",
    confusedWith: ["moldova", "bulgaria", "hungary"]
  },
  {
    id: "bulgaria", name: "Bulgaria", code: "BG", region: "Europe", driving: "right",
    bollard: { body: "#ffffff", cap: null, band: "#c1443c", shape: "flat", notes: "Front face carries a red rectangle; the back shows the same rectangle in white." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Cyrillic script on virtually all signage is the fastest regional narrower." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'BG', black text." },
    language: { script: "Cyrillic", notes: "Bulgarian Cyrillic — distinguishing it from Serbian/Russian Cyrillic takes practice with specific letterforms, but any Cyrillic at all narrows you fast." },
    keyTip: "Cyrillic script combined with EU-format blue-strip plates narrows you to Bulgaria (vs non-EU Serbia/Russia).",
    confusedWith: ["serbia", "north macedonia", "romania"]
  },
  {
    id: "greece", name: "Greece", code: "GR", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Flat white/red post; bollards are secondary here to the very strong script clue." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Bilingual Greek/Latin signage on major roads, with double yellow or white centre lines." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'GR', black text." },
    language: { script: "Greek", notes: "Greek alphabet (α, β, γ...) is unmistakable and essentially confirms the country on sight." },
    keyTip: "Greek-alphabet signage is a same-glance confirm — no other country in Europe uses this script.",
    confusedWith: ["cyprus", "turkey"]
  },
  {
    id: "turkey", name: "Turkey", code: "TR", region: "Europe/Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "thick-rect", notes: "Thicker rectangular reflector than most of Europe — often compared to Australia's bollard profile." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage; minarets and mosque architecture are a strong regional confirm in towns." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue strip with province code number (not a country letter), black text." },
    language: { script: "Latin", notes: "Turkish — dotless 'ı', ğ, ş, ç are distinctive letterforms not found together elsewhere." },
    keyTip: "Dotless ı and ğ on any sign is a same-glance Turkey confirm.",
    confusedWith: ["greece"]
  },
  {
    id: "russia", name: "Russia", code: "RU", region: "Europe/Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Simple flat white/red post; road quality and marking style vary widely by region." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Distinctive blue Google Street View camera watermark/car in many regions, plus Cyrillic road signage." },
    plates: { bg: "#ffffff", band: null, notes: "White plate, black text, region-code numbers after the letters, Russian tricolour flag graphic on the plate." },
    language: { script: "Cyrillic", notes: "Russian Cyrillic — combined with non-EU plate format, narrows quickly away from Bulgaria/Serbia." },
    keyTip: "Tricolour flag graphic printed directly on the plate is a distinctive Russia-specific detail.",
    confusedWith: ["belarus", "ukraine", "kazakhstan", "estonia"]
  },
  {
    id: "ukraine", name: "Ukraine", code: "UA", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2c14e", shape: "flat", notes: "Flat post family, often visibly weathered or damaged compared to neighbouring EU countries." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Cyrillic signage; road surfaces and infrastructure often show more wear than EU-member neighbours." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue strip with 'UA', black text — note the blue strip here is a national marker, not an EU one." },
    language: { script: "Cyrillic", notes: "Ukrainian Cyrillic includes the letter 'і' and 'ї', which don't appear in Russian — a useful split if you can read text closely." },
    keyTip: "Visibly weathered flat bollards plus Cyrillic 'і'/'ї' letterforms point to Ukraine over Russia.",
    confusedWith: ["russia", "belarus", "moldova"]
  },
  {
    id: "australia", name: "Australia", code: "AU", region: "Oceania", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "thick-rect", notes: "Thick rectangular reflector similar in profile to Turkey's — rely on terrain/language to split." },
    signs: { bg: "#f2c14e", accent: "#1b1d21", notes: "Yellow diamond warning signs, wide unmarked shoulders, and very long straight rural roads." },
    plates: { bg: "#ffffff", band: null, notes: "State-issued plates vary by colour/format per state — a distinct look from the uniform EU system." },
    language: { script: "Latin", notes: "English, but road signage style (yellow diamond warnings) is visually distinct from North America's shapes." },
    keyTip: "Yellow diamond-shaped warning signs plus left-hand driving and Google's distinct trekker imagery style confirm Australia.",
    confusedWith: ["new zealand", "south africa"]
  },
  {
    id: "usa", name: "United States", code: "US", region: "North America", driving: "right",
    bollard: { body: "#c1443c", cap: null, band: "#ffffff", shape: "sparse", notes: "Bollards are inconsistent/rare state-to-state — lean on other clues far more than in Europe." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signage with white text, yellow diamond warning signs, and wide painted yellow centre-lines." },
    plates: { bg: "#ffffff", band: null, notes: "Plate colour/format varies by state — a strong regional narrower once you learn a handful of state designs." },
    language: { script: "Latin", notes: "English, with Spanish-language signage common in the Southwest." },
    keyTip: "Green highway signage with white text is the fastest US/Canada-region confirm versus Europe's blue.",
    confusedWith: ["canada"]
  },
  {
    id: "brazil", name: "Brazil", code: "BR", region: "South America", driving: "right",
    bollard: { body: "#f2c14e", cap: null, band: "#1b1d21", shape: "sparse", notes: "Yellow-and-black hazard-style posts where present; not consistently used nationwide." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signage, red soil visible roadside in many inland regions." },
    plates: { bg: "#c1443c", band: null, notes: "Red lettering on white/silver plates in the older format, transitioning to Mercosul blue-striped plates." },
    language: { script: "Latin", notes: "Portuguese — same core tells as Portugal (ã, õ, ç), but road environment and terrain differ sharply." },
    keyTip: "Portuguese-language signage combined with red soil and tropical vegetation confirms Brazil over Portugal.",
    confusedWith: ["portugal", "argentina"]
  },
  {
    id: "japan", name: "Japan", code: "JP", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2c14e", shape: "reflector-post", notes: "Yellow-and-black striped reflector posts are common on rural roads." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Blue directional expressway signage, green rural highway signage, and utility poles lining almost every street." },
    plates: { bg: "#ffffff", band: null, notes: "Distinct plate shape/size versus Western countries, often with a regional name in kanji at the top." },
    language: { script: "Kanji/Kana", notes: "Japanese kanji/hiragana/katakana script is an instant, unmistakable confirm." },
    keyTip: "Kanji/kana script on any sign is a same-glance Japan confirm — no ambiguity once you can read the script family.",
    confusedWith: ["south korea", "taiwan"]
  },
  {
    id: "slovenia", name: "Slovenia", code: "SI", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: "#1b1d21", band: "#c1443c", shape: "flat", notes: "White flat post with a dark cap — close enough to Austria's that it is not a reliable split on its own." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs; town-centre information boards run darker than Austria's brighter blue." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'SLO', black text, often a coloured regional sticker at the right." },
    language: { script: "Latin", notes: "Slovene — uses č, š, ž but never Croatian's ć or đ." },
    keyTip: "Slovene text with č/š/ž but no ć or đ splits Slovenia from Croatia faster than any roadside clue.",
    confusedWith: ["austria", "croatia", "hungary"]
  },
  {
    id: "slovakia", name: "Slovakia", code: "SK", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: "#1b1d21", band: "#c1443c", shape: "flat", notes: "White flat post with a black cap and red reflector — lacks Czechia's fluorescent orange reflector." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Village signs are white with a red border, similar to Poland's but without the locator map corner." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'SK', black text, two-letter district prefix." },
    language: { script: "Latin", notes: "Slovak — ä, ô, ľ and ŕ appear where Czech would use different forms." },
    keyTip: "A red reflector where Czechia would show fluorescent orange is the quickest Slovakia-over-Czechia call.",
    confusedWith: ["czechia", "hungary", "poland"]
  },
  {
    id: "bosnia", name: "Bosnia and Herzegovina", code: "BA", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Plain white flat post with a red reflector; deployment is patchy compared with Croatia." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Signage frequently carries both Latin and Cyrillic spellings of the same place name." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue strip with 'BIH', black text — deliberately neutral format with no entity marking." },
    language: { script: "Latin + Cyrillic", notes: "Bosnian/Croatian/Serbian — the dual-script signage is the distinguishing feature." },
    keyTip: "The same place name written in both Latin and Cyrillic on one sign is close to a guaranteed Bosnia confirm.",
    confusedWith: ["croatia", "serbia", "montenegro"]
  },
  {
    id: "montenegro", name: "Montenegro", code: "ME", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White flat post with red reflector, shared with most of the western Balkans." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs; dramatic coastal and canyon terrain does more identifying work than the signage." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue strip with 'MNE', black text, city-code prefix." },
    language: { script: "Latin + Cyrillic", notes: "Montenegrin — Latin dominates on signage, with Cyrillic appearing less than in Serbia." },
    keyTip: "Steep Adriatic coast or deep river canyons plus 'MNE' plates narrows to Montenegro quickly.",
    confusedWith: ["serbia", "bosnia", "albania"]
  },
  {
    id: "north macedonia", name: "North Macedonia", code: "MK", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White flat post with a red reflector; sparse outside main routes." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs, commonly bilingual Macedonian Cyrillic and Albanian Latin in the west." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue strip with 'NMK', black text." },
    language: { script: "Cyrillic", notes: "Macedonian Cyrillic — look for Ѓ and Ќ, letters that do not exist in Serbian or Bulgarian." },
    keyTip: "Cyrillic containing Ѓ or Ќ is unique to Macedonian and rules out both Serbia and Bulgaria.",
    confusedWith: ["bulgaria", "serbia", "albania"]
  },
  {
    id: "luxembourg", name: "Luxembourg", code: "LU", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat-narrow", notes: "Narrow white post with a red reflector, essentially the Belgian pattern." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "French-language signage with German alongside it, and Luxembourgish on local place names." },
    plates: { bg: "#fadb2c", band: "#3b6ea8", notes: "Yellow plate with black text and a blue EU strip with 'L' — yellow like the Netherlands, but on a smaller, squarer plate." },
    language: { script: "Latin", notes: "French, German and Luxembourgish together; 'Rue' alongside German compounds is the giveaway." },
    keyTip: "Yellow plates plus French-and-German signage in hilly, forested terrain points to Luxembourg over the Netherlands.",
    confusedWith: ["belgium", "france", "germany"]
  },
  {
    id: "liechtenstein", name: "Liechtenstein", code: "LI", region: "Europe", driving: "right",
    bollard: { body: "#c1443c", cap: null, band: "#ffffff", shape: "domed", notes: "Swiss-style red domed post — the road furniture is effectively Switzerland's." },
    signs: { bg: "#ffffff", accent: "#c1443c", notes: "Swiss-pattern signage and immaculate road maintenance, in a very small Alpine valley." },
    plates: { bg: "#1b1d21", band: null, notes: "Black plate with white lettering and 'FL' — unmistakable and shared with no neighbour." },
    language: { script: "Latin", notes: "German — indistinguishable from Swiss or Austrian German on signage." },
    keyTip: "Black plates with white text are a same-glance Liechtenstein confirm; nothing nearby uses them.",
    confusedWith: ["switzerland", "austria"]
  },
  {
    id: "monaco", name: "Monaco", code: "MC", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: "#c1443c", band: "#c1443c", shape: "rounded", notes: "French-pattern rounded post where any exists — the territory is almost entirely urban." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "French signage on a dense, immaculately maintained urban street grid stacked up a steep hillside." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text and a red-and-white crest, no EU band — Monaco is not in the EU." },
    language: { script: "Latin", notes: "French — identical to France, so language will not split them." },
    keyTip: "Dense high-rise towers on a steep Mediterranean slope with French signage and no EU band means Monaco.",
    confusedWith: ["france", "italy"]
  },
  {
    id: "san marino", name: "San Marino", code: "SM", region: "Europe", driving: "right",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge", notes: "Italian-pattern black wedge post — the road furniture is inherited wholesale from Italy." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Italian-style signage, but watch for the distinctive brown heritage signs around Monte Titano." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate with a blue band carrying the coat of arms and 'RSM', black text." },
    language: { script: "Latin", notes: "Italian — no help at all in separating it from surrounding Italy." },
    keyTip: "Steep fortified ridge with Italian signage but 'RSM' plates is the only reliable San Marino confirm.",
    confusedWith: ["italy"]
  },
  {
    id: "andorra", name: "Andorra", code: "AD", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "rounded", notes: "Rounded white post with red reflector, sitting between the French and Spanish patterns." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Catalan-language signage in a steep high-Pyrenean valley packed with retail and ski infrastructure." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text and a small national crest, no EU band — Andorra is not in the EU." },
    language: { script: "Latin", notes: "Catalan — 'carrer' and 'avinguda' rather than Spanish 'calle' or French 'rue'." },
    keyTip: "Catalan signage high in the Pyrenees with no EU band on the plates is Andorra, not Spain or France.",
    confusedWith: ["spain", "france"]
  },
  {
    id: "iceland", name: "Iceland", code: "IS", region: "Europe", driving: "right",
    bollard: { body: "#f2c14e", cap: null, band: "#1b1d21", shape: "reflector-post", notes: "Yellow-topped flexible marker posts line most rural roads, standing out against treeless terrain." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs, single-lane bridges marked 'Einbreið brú', and near-total absence of trees." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue strip with 'IS', black text — the strip is a national marker, not an EU band." },
    language: { script: "Latin", notes: "Icelandic — þ (thorn) and ð (eth) appear nowhere else on a road sign." },
    keyTip: "A þ or ð on any sign is an instant, unambiguous Iceland confirm.",
    confusedWith: ["norway", "ireland"]
  },
  {
    id: "estonia", name: "Estonia", code: "EE", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White flat post with a red reflector, shared broadly across the Baltic states." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs; dense flat pine and birch forest dominates the roadside." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'EST', black text." },
    language: { script: "Latin", notes: "Estonian — õ is the standout letter, alongside ä, ö and ü; a Finnic language, so it looks nothing like Latvian or Lithuanian." },
    keyTip: "The letter õ plus doubled vowels marks Estonian — Finnish-looking text but on the south side of the Gulf.",
    confusedWith: ["finland", "russia"]
  },
  {
    id: "belarus", name: "Belarus", code: "BY", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White flat post with a red reflector, in the broad post-Soviet pattern." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs with very wide, well-maintained rural roads and long tree-lined avenues." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue strip with 'BY', black text, region-number prefix." },
    language: { script: "Cyrillic", notes: "Belarusian and Russian — Belarusian uses ў, a letter found in no other Cyrillic alphabet." },
    keyTip: "The letter ў in Cyrillic text is unique to Belarusian and settles it against Russia or Ukraine instantly.",
    confusedWith: ["russia", "ukraine"]
  },
  {
    id: "moldova", name: "Moldova", code: "MD", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White flat post with a red reflector; frequently absent on smaller rural roads." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs, rolling vineyard country, and noticeably rougher surfacing than Romania." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue strip with 'MD', black text — the strip is a national marker, not an EU band." },
    language: { script: "Latin", notes: "Romanian, effectively identical to Romania's; Cyrillic appears in the Transnistria region." },
    keyTip: "Romanian-language signage with 'MD' rather than EU plates is the Moldova-over-Romania split.",
    confusedWith: ["romania", "ukraine"]
  },
  {
    id: "cyprus", name: "Cyprus", code: "CY", region: "Europe", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White flat post with a red reflector; sparse, with kerbing more common than posts." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Bilingual Greek and English signage, with British-inherited road markings and roundabouts." },
    plates: { bg: "#fadb2c", band: "#3b6ea8", notes: "Yellow rear plate, white front, blue EU strip with 'CY' — the yellow is a British inheritance." },
    language: { script: "Greek", notes: "Greek alongside English on nearly all official signage." },
    keyTip: "Greek script combined with driving on the left is conclusive — Greece drives on the right, so it can only be Cyprus.",
    confusedWith: ["greece", "uk"]
  },
  {
    id: "kazakhstan", name: "Kazakhstan", code: "KZ", region: "Europe/Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Posts appear only intermittently; vast stretches of road carry no markers at all." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs in Kazakh and Russian, over enormous flat, treeless steppe." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate with a blue strip carrying the flag and 'KZ' on the right-hand edge, black text." },
    language: { script: "Cyrillic", notes: "Kazakh and Russian — Kazakh Cyrillic adds ә, ғ, қ, ң, ө, ұ and ү, none of which exist in Russian." },
    keyTip: "Cyrillic with ә or ұ is Kazakh, not Russian — that plus open steppe settles it.",
    confusedWith: ["russia"]
  },
  {
    id: "canada", name: "Canada", code: "CA", region: "North America", driving: "right",
    bollard: { body: "#f2c14e", cap: null, band: "#1b1d21", shape: "sparse", notes: "Flexible delineator posts where present, largely matching US practice." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signage very like the US, but distances in kilometres and bilingual French in Québec and New Brunswick." },
    plates: { bg: "#ffffff", band: null, notes: "Province-issued plates varying in colour and format, with no front plate required in several provinces." },
    language: { script: "Latin", notes: "English, with French co-official — 'Arrêt' on stop signs in Québec is a same-glance confirm." },
    keyTip: "Speed limits posted in km/h on otherwise US-looking signage is the fastest Canada-over-USA call.",
    confusedWith: ["usa"]
  },
  {
    id: "argentina", name: "Argentina", code: "AR", region: "South America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Occasional white posts with red reflectors; long rural stretches carry none." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs, and dead-straight pampas roads lined with poplar windbreaks." },
    plates: { bg: "#ffffff", band: null, notes: "Mercosur plates with a blue strip across the top carrying 'ARGENTINA', replacing the older black-on-white format." },
    language: { script: "Latin", notes: "Spanish — 'Ruta' rather than Brazil's 'Rodovia' is the quickest read." },
    keyTip: "Spanish signage with flat pampas and poplar windbreaks separates Argentina from Portuguese-speaking Brazil.",
    confusedWith: ["brazil"]
  },
  {
    id: "new zealand", name: "New Zealand", code: "NZ", region: "Oceania", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2c14e", shape: "reflector-post", notes: "White marker posts with yellow or white reflectors along rural highways." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signage, one-lane bridges, and a distinct absence of Australia's yellow diamond animal warnings." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text; a single national format rather than Australia's per-state variety." },
    language: { script: "Latin", notes: "English with widespread Māori place names — Whanga-, Wai- and Te are strong markers." },
    keyTip: "Māori place names plus left-hand driving and lush green hill country separates New Zealand from Australia.",
    confusedWith: ["australia"]
  },
  {
    id: "south africa", name: "South Africa", code: "ZA", region: "Africa", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Marker posts are inconsistent; painted kerbs and cable barriers do more of the work." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs with distinctive yellow-bordered route markers, plus frequent roadside fencing." },
    plates: { bg: "#ffffff", band: null, notes: "Province-issued plates in varying formats; several provinces use a yellow background." },
    language: { script: "Latin", notes: "English and Afrikaans on most signage — Afrikaans compounds like 'Straat' and 'Weg' are the tell." },
    keyTip: "Afrikaans alongside English on left-hand-drive roads is a fast, reliable South Africa confirm.",
    confusedWith: ["australia"]
  },
  {
    id: "south korea", name: "South Korea", code: "KR", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#1b8a3b", shape: "reflector-post", notes: "Slim posts with green or yellow reflectors; guardrails are often painted green." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signage with Hangul and English, and blue signs on urban arterials." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black Hangul and numerals, wider than the Japanese format." },
    language: { script: "Hangul", notes: "Korean Hangul — circular and angular blocks, visually unlike Japanese kana or Chinese characters." },
    keyTip: "Hangul plus driving on the right is conclusive — Japan drives on the left and uses kanji and kana.",
    confusedWith: ["japan", "taiwan"]
  },
  {
    id: "taiwan", name: "Taiwan", code: "TW", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Posts are uncommon; painted kerbs and dense scooter-lane markings dominate instead." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green and blue signage in Traditional Chinese with English, plus dedicated scooter waiting boxes at junctions." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text, often a shorter format than mainland Chinese plates." },
    language: { script: "Traditional Chinese", notes: "Traditional characters — visibly denser than the simplified forms used on the mainland." },
    keyTip: "Traditional Chinese characters with right-hand driving and swarms of scooters is a fast Taiwan confirm.",
    confusedWith: ["japan", "south korea"]
  }
];
