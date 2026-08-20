// GeoLearn data — community-sourced GeoGuessr identification clues.
// Colors are used to draw the bollard/sign swatches. Extend this array to add countries.

const COUNTRIES = [
  {
    id: "germany", name: "Germany", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Flat white rectangular post, red or white reflector band, no dark cap." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Ortsschild town signs are white with black border/text. Info boards in town centres skew dark, not blue." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'D' on the left, black city code + letters + numbers, round TÜV inspection sticker top right." },
    language: { script: "Latin", notes: "German — umlauts ä ö ü and ß appear regularly." },
    keyTip: "Flat white bollard, no black cap. If you see a black cap, you're probably in Austria instead.",
    confusedWith: ["austria", "switzerland", "poland"]
  },
  {
    id: "austria", name: "Austria", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: "#1b1d21", band: "#5a2a24", shape: "flat", notes: "Same white flat body as Germany, but with a distinct black/dark cap and a dark red or blackish reflector." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Town-centre info boards commonly use a blue background — a fast tell against Germany and Slovenia's darker boards." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'A', district-code letters then numbers, black text." },
    language: { script: "Latin", notes: "German with Austrian vocabulary (e.g. Gehsteig vs Germany's Gehweg) — a tiebreaker if you can read signage." },
    keyTip: "Black cap + dark reflector on the bollard is unique to Austria — no other country has both.",
    confusedWith: ["germany", "slovenia", "switzerland"]
  },
  {
    id: "switzerland", name: "Switzerland", region: "Europe", driving: "right",
    bollard: { body: "#c1443c", cap: null, band: "#ffffff", shape: "domed", notes: "Distinctive red domed-top post, quite different from the flat German/Austrian posts." },
    signs: { bg: "#ffffff", accent: "#c1443c", notes: "Blue direction signs like much of Europe, but red-bordered warning signs and very clean, well-maintained road paint." },
    plates: { bg: "#ffffff", notes: "White plate, black text, canton abbreviation, no blue EU band (Switzerland isn't in the EU)." },
    language: { script: "Latin", notes: "German, French, or Italian depending on canton — regional split is itself a clue to which part of the country you're in." },
    keyTip: "No blue EU band on the plate is the fastest confirm — Germany and Austria both have it, Switzerland never does.",
    confusedWith: ["germany", "austria", "liechtenstein"]
  },
  {
    id: "france", name: "France", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: "#c1443c", band: "#c1443c", shape: "rounded", notes: "Rounded-top white post with a red cap and a red reflector band that wraps around the post." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signs, and famously long white dashed centre-lines on rural roads." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'F', black text, department number visible at the end." },
    language: { script: "Latin", notes: "French — accented characters (é, è, ç) and article words (le, la, les) on signage." },
    keyTip: "Very long white dashes down the centre of the road are a strong France tell almost nowhere else matches.",
    confusedWith: ["belgium", "monaco"]
  },
  {
    id: "belgium", name: "Belgium", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat-narrow", notes: "Narrow flat white post, red reflector — visually close to Netherlands/Germany, so lean on other clues." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Bilingual signage (French/Dutch) in and around Brussels is the single strongest Belgium tell." },
    plates: { bg: "#ff3b30", notes: "Older-style plates often show red lettering/blur rather than the standard black-on-white EU format." },
    language: { script: "Latin", notes: "French in Wallonia, Dutch in Flanders, both on many national signs — dual-language signage is very diagnostic." },
    keyTip: "Bilingual French/Dutch place names on the same sign narrows you to Belgium almost immediately.",
    confusedWith: ["netherlands", "france", "luxembourg"]
  },
  {
    id: "netherlands", name: "Netherlands", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat-narrow", notes: "Similar flat white/red post family to Belgium and Germany — not a strong standalone clue here." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Distinct red-bordered cycling infrastructure signs and dedicated red-brick bike lanes are the giveaway." },
    plates: { bg: "#fadb2c", notes: "Bright yellow plates with black text — one of the most recognisable plate colours in Europe." },
    language: { script: "Latin", notes: "Dutch — watch for doubled vowels (aa, oo, ee) and 'straat'/'weg' endings on street names." },
    keyTip: "Yellow plates with black text are close to a guaranteed Netherlands confirm.",
    confusedWith: ["belgium", "germany"]
  },
  {
    id: "italy", name: "Italy", region: "Europe", driving: "right",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge", notes: "Black diagonal wedge body reaching to the top, vertical red rectangle on the front, white rectangle on the back." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional arrows and blue-background motorway signage (green is reserved for the autostrada system)." },
    plates: { bg: "#ffffff", notes: "White plate, blue side stripe (not full EU band position), black text." },
    language: { script: "Latin", notes: "Italian — double consonants and vowel-heavy endings (-o, -a, -i)." },
    keyTip: "Black wedge bollard with a vertical red front stripe — Albania shares this almost exactly, use language/architecture to split them.",
    confusedWith: ["albania", "san marino"]
  },
  {
    id: "albania", name: "Albania", region: "Europe", driving: "right",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge", notes: "Effectively identical to Italy's bollard — this pairing is a known trap, don't rely on it alone." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Rougher road maintenance and older infrastructure than Italy on average — a soft, not certain, tell." },
    plates: { bg: "#ffffff", notes: "White plate, black text, 'AL' country oval sometimes visible, distinct from Italy's EU-band format." },
    language: { script: "Latin", notes: "Albanian — look for 'ë' and words ending in -a/-i that don't read as Italian; shop signage is the fastest confirm." },
    keyTip: "If the bollard says Italy but the language on any visible sign doesn't look Italian, you're almost certainly in Albania.",
    confusedWith: ["italy", "north macedonia", "montenegro"]
  },
  {
    id: "poland", name: "Poland", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: "#1b1d21", band: "#c1443c", shape: "flat", notes: "Flat white post with a black top section — different profile from Germany's plain flat post." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Village name signs are white with a red border, black text, and a small locator map top corner." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'PL', black text, distinctive province-letter prefix." },
    language: { script: "Latin", notes: "Polish — heavy consonant clusters (sz, cz, rz) and diacritics (ł, ż, ń) are a fast confirm." },
    keyTip: "Black-topped flat bollard plus red-bordered village signs is a strong combined Poland tell.",
    confusedWith: ["germany", "czechia"]
  },
  {
    id: "czechia", name: "Czechia", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2a900", shape: "flat", notes: "Flat white post with a fluorescent orange reflector band — the orange tone is unusually bright versus neighbours." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage similar to Slovakia and Austria; rely on the bollard's orange band to split from those." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'CZ', black text." },
    language: { script: "Latin", notes: "Czech — háček diacritics (č, š, ž) and 'ř', a sound essentially unique to Czech." },
    keyTip: "Fluorescent orange reflector on a flat white bollard is a near-unique Czechia signature.",
    confusedWith: ["slovakia", "austria", "poland"]
  },
  {
    id: "denmark", name: "Denmark", region: "Europe", driving: "right",
    bollard: { body: "#c1443c", cap: null, band: "#ffffff", shape: "rounded-wrap", notes: "Red post with a reflective band that wraps fully around it, similar concept to France but different colour balance." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Very flat terrain, dense cyclist infrastructure, and distinctly Scandinavian place names on white-background signs." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'DK', black text on a slightly squarer plate shape." },
    language: { script: "Latin", notes: "Danish — the letters æ, ø, å are the giveaway versus German or Dutch." },
    keyTip: "æ / ø / å on any sign is close to a guaranteed Denmark (or wider Nordic) confirm.",
    confusedWith: ["sweden", "norway", "germany"]
  },
  {
    id: "sweden", name: "Sweden", region: "Europe", driving: "right",
    bollard: { body: "#f2c14e", cap: null, band: "#1b1d21", shape: "reflector-post", notes: "Distinct yellow/black reflector posts on rural roads, quite different from Denmark's red post." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage; dense birch and pine forest is common on rural roads." },
    plates: { bg: "#3b6ea8", notes: "Blue-edged plate band with 'S', white background, black text." },
    language: { script: "Latin", notes: "Swedish — å, ä, ö appear, but ä/ö are shared with Finnish signage in bilingual areas, so check for å specifically." },
    keyTip: "Yellow-and-black rural reflector posts plus å/ä/ö text points to Sweden over Denmark or Norway.",
    confusedWith: ["norway", "finland", "denmark"]
  },
  {
    id: "norway", name: "Norway", region: "Europe", driving: "right",
    bollard: { body: "#f2c14e", cap: null, band: "#1b1d21", shape: "reflector-post", notes: "Similar reflector-post family to Sweden; terrain (fjords, tunnels, steep mountain roads) is the real differentiator." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Frequent tunnels and dramatic elevation change are a strong Norway signature versus flatter Sweden/Denmark." },
    plates: { bg: "#ffffff", notes: "White plate, black text, no blue EU band since Norway isn't in the EU." },
    language: { script: "Latin", notes: "Norwegian — æ, ø, å like Danish, but Norwegian spelling and grammar diverge on closer signage reading." },
    keyTip: "No blue EU band on the plate, combined with mountainous terrain, is the fastest Norway confirm.",
    confusedWith: ["sweden", "denmark", "iceland"]
  },
  {
    id: "finland", name: "Finland", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "cylindrical", notes: "Cylindrical white post shape stands out from the flatter posts used elsewhere in Scandinavia." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Bilingual Finnish/Swedish signage in coastal regions; dense uniform birch forest inland." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'FIN', black text." },
    language: { script: "Latin", notes: "Finnish is unrelated to the other Nordic languages — long compound words with double vowels (aa, ää, öö) are distinctive." },
    keyTip: "Cylindrical (not flat) bollard shape plus non-Germanic-looking language text is the Finland signature.",
    confusedWith: ["sweden", "estonia"]
  },
  {
    id: "croatia", name: "Croatia", region: "Europe", driving: "right",
    bollard: { body: "#ffffff", cap: null, band: "#c1443c", shape: "flat-back", notes: "White front face, but the back of the bollard is distinctly white rather than the darker backs common elsewhere in the Balkans." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage; coastal roads have limestone terrain and Mediterranean vegetation." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'HR', black text, city-code prefix." },
    language: { script: "Latin", notes: "Croatian uses Latin script with č/ć/š/ž — a fast split from Serbia, which commonly uses Cyrillic." },
    keyTip: "Latin script with č/ć/š/ž (not Cyrillic) is the quickest Croatia vs Serbia split.",
    confusedWith: ["serbia", "slovenia", "bosnia"]
  },
  {
    id: "serbia", name: "Serbia", region: "Europe", driving: "right",
    bollard: { body: "#ffffff", cap: null, band: "#c1443c", shape: "offset", notes: "Red rectangle sits slightly off-centre on the reflector band, a small but noted distinguishing detail from Croatia." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Mixed Cyrillic and Latin signage is common — seeing Cyrillic at all is a strong Balkans-region narrower." },
    plates: { bg: "#ffffff", notes: "White plate, black text, no blue EU strip since Serbia isn't in the EU." },
    language: { script: "Latin & Cyrillic", notes: "Serbian is often written in Cyrillic on official signage even though Latin is also used day-to-day." },
    keyTip: "Any Cyrillic text on road signage is a strong signal for Serbia over Croatia.",
    confusedWith: ["croatia", "bosnia", "montenegro"]
  },
  {
    id: "spain", name: "Spain", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Flat white post, red reflector; distinct mainly through colour context on the wider sign environment." },
    signs: { bg: "#ffffff", accent: "#c1443c", notes: "White background town signs with red border, and very orange/dry roadside vegetation inland." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'E', black text, no city code (unlike most of Europe, Spanish plates are randomised)." },
    language: { script: "Latin", notes: "Spanish — ñ and inverted punctuation (¿ ¡) are distinctive; regional co-official languages (Catalan, Basque, Galician) appear on some signs." },
    keyTip: "Randomised plate format with no visible city/province code is a strong Spain-specific tell.",
    confusedWith: ["portugal", "andorra"]
  },
  {
    id: "portugal", name: "Portugal", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2c14e", shape: "flat", notes: "Flat white post but with a yellow reflector band rather than Spain's red." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Black-and-white cobblestone (calçada) pavement in towns is a distinctly Portuguese texture." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'P', black text, dashes separating letter/number groups." },
    language: { script: "Latin", notes: "Portuguese — tildes (ã, õ) and 'ç' distinguish it from Spanish at a glance." },
    keyTip: "Black-and-white cobblestone pavement in a town centre is close to a guaranteed Portugal confirm.",
    confusedWith: ["spain"]
  },
  {
    id: "uk", name: "United Kingdom", region: "Europe", driving: "left",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge-rare", notes: "Bollards are comparatively rare; when present, black-and-white sections with a large red rectangle on top." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue motorway signage, roundabout-heavy junctions, and yellow grid-lines painted at some intersections." },
    plates: { bg: "#fadb2c", notes: "Yellow rear plate / white front plate, black text, no blue EU strip post-Brexit." },
    language: { script: "Latin", notes: "English, with Welsh/Gaelic bilingual signage in Wales and parts of Scotland." },
    keyTip: "Left-hand driving plus yellow rear plates narrows Europe down to essentially the UK and Ireland — check for bilingual Welsh/Gaelic text to split them.",
    confusedWith: ["ireland"]
  },
  {
    id: "ireland", name: "Ireland", region: "Europe", driving: "left",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge-rare", notes: "Similar sparse bollard usage to the UK; not a strong standalone differentiator." },
    signs: { bg: "#3b6ea8", accent: "#f2c14e", notes: "Distances in kilometres on green-background signs (vs the UK's miles on green/blue), and widespread bilingual Irish/English text." },
    plates: { bg: "#fadb2c", notes: "Yellow plate, black text, but format includes a year-and-county code prefix distinct from UK plates." },
    language: { script: "Latin", notes: "Irish (Gaelic) alongside English on almost all official signage — the clearest tell against the UK." },
    keyTip: "Bilingual Irish/English signage with kilometre distances is a fast, reliable Ireland confirm.",
    confusedWith: ["uk"]
  },
  {
    id: "hungary", name: "Hungary", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Flat white post, red reflector band positioned lower on the post than most neighbours." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage; flat plains (the Great Hungarian Plain) dominate outside Budapest." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'H', black text." },
    language: { script: "Latin", notes: "Hungarian is unrelated to neighbouring languages — heavy accented vowels (ő, ű) are a fast confirm." },
    keyTip: "ő / ű accented vowels on signage are essentially unique to Hungarian in this region.",
    confusedWith: ["slovakia", "romania", "austria"]
  },
  {
    id: "romania", name: "Romania", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Flat white/red post family shared with much of Central Europe — not a strong standalone clue." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Rougher rural road surfaces and horse-drawn cart use are still visible in many regions." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'RO', black text, county-letter prefix." },
    language: { script: "Latin", notes: "Romanian is a Romance language written in Latin script with ă, â, î, ș, ț diacritics — visually distinct from Slavic neighbours." },
    keyTip: "Romance-looking vocabulary (closer to Italian than to Hungarian/Slavic) with ă/â/î/ș/ț diacritics confirms Romania.",
    confusedWith: ["moldova", "bulgaria"]
  },
  {
    id: "bulgaria", name: "Bulgaria", region: "Europe", driving: "right",
    bollard: { body: "#ffffff", cap: null, band: "#c1443c", shape: "flat", notes: "Front face carries a red rectangle; the back shows the same rectangle in white." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Cyrillic script on virtually all signage is the fastest regional narrower." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'BG', black text." },
    language: { script: "Cyrillic", notes: "Bulgarian Cyrillic — distinguishing it from Serbian/Russian Cyrillic takes practice with specific letterforms, but any Cyrillic at all narrows you fast." },
    keyTip: "Cyrillic script combined with EU-format blue-strip plates narrows you to Bulgaria (vs non-EU Serbia/Russia).",
    confusedWith: ["serbia", "north macedonia"]
  },
  {
    id: "greece", name: "Greece", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Flat white/red post; bollards are secondary here to the very strong script clue." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Bilingual Greek/Latin signage on major roads, with double yellow or white centre lines." },
    plates: { bg: "#ffffff", notes: "White plate, blue EU strip with 'GR', black text." },
    language: { script: "Greek", notes: "Greek alphabet (α, β, γ...) is unmistakable and essentially confirms the country on sight." },
    keyTip: "Greek-alphabet signage is a same-glance confirm — no other country in Europe uses this script.",
    confusedWith: ["cyprus"]
  },
  {
    id: "turkey", name: "Turkey", region: "Europe/Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "thick-rect", notes: "Thicker rectangular reflector than most of Europe — often compared to Australia's bollard profile." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage; minarets and mosque architecture are a strong regional confirm in towns." },
    plates: { bg: "#ffffff", notes: "White plate, blue strip with province code number (not a country letter), black text." },
    language: { script: "Latin", notes: "Turkish — dotless 'ı', ğ, ş, ç are distinctive letterforms not found together elsewhere." },
    keyTip: "Dotless ı and ğ on any sign is a same-glance Turkey confirm.",
    confusedWith: ["greece"]
  },
  {
    id: "russia", name: "Russia", region: "Europe/Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Simple flat white/red post; road quality and marking style vary widely by region." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Distinctive blue Google Street View camera watermark/car in many regions, plus Cyrillic road signage." },
    plates: { bg: "#ffffff", notes: "White plate, black text, region-code numbers after the letters, Russian tricolour flag graphic on the plate." },
    language: { script: "Cyrillic", notes: "Russian Cyrillic — combined with non-EU plate format, narrows quickly away from Bulgaria/Serbia." },
    keyTip: "Tricolour flag graphic printed directly on the plate is a distinctive Russia-specific detail.",
    confusedWith: ["belarus", "ukraine", "kazakhstan"]
  },
  {
    id: "ukraine", name: "Ukraine", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2c14e", shape: "flat", notes: "Flat post family, often visibly weathered or damaged compared to neighbouring EU countries." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Cyrillic signage; road surfaces and infrastructure often show more wear than EU-member neighbours." },
    plates: { bg: "#ffffff", notes: "White plate, blue strip with 'UA', black text — note the blue strip here is a national marker, not an EU one." },
    language: { script: "Cyrillic", notes: "Ukrainian Cyrillic includes the letter 'і' and 'ї', which don't appear in Russian — a useful split if you can read text closely." },
    keyTip: "Visibly weathered flat bollards plus Cyrillic 'і'/'ї' letterforms point to Ukraine over Russia.",
    confusedWith: ["russia", "belarus", "moldova"]
  },
  {
    id: "australia", name: "Australia", region: "Oceania", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "thick-rect", notes: "Thick rectangular reflector similar in profile to Turkey's — rely on terrain/language to split." },
    signs: { bg: "#f2c14e", accent: "#1b1d21", notes: "Yellow diamond warning signs, wide unmarked shoulders, and very long straight rural roads." },
    plates: { bg: "#ffffff", notes: "State-issued plates vary by colour/format per state — a distinct look from the uniform EU system." },
    language: { script: "Latin", notes: "English, but road signage style (yellow diamond warnings) is visually distinct from North America's shapes." },
    keyTip: "Yellow diamond-shaped warning signs plus left-hand driving and Google's distinct trekker imagery style confirm Australia.",
    confusedWith: ["new zealand", "south africa"]
  },
  {
    id: "usa", name: "United States", region: "North America", driving: "right",
    bollard: { body: "#c1443c", cap: null, band: "#ffffff", shape: "sparse", notes: "Bollards are inconsistent/rare state-to-state — lean on other clues far more than in Europe." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signage with white text, yellow diamond warning signs, and wide painted yellow centre-lines." },
    plates: { bg: "#ffffff", notes: "Plate colour/format varies by state — a strong regional narrower once you learn a handful of state designs." },
    language: { script: "Latin", notes: "English, with Spanish-language signage common in the Southwest." },
    keyTip: "Green highway signage with white text is the fastest US/Canada-region confirm versus Europe's blue.",
    confusedWith: ["canada"]
  },
  {
    id: "brazil", name: "Brazil", region: "South America", driving: "right",
    bollard: { body: "#f2c14e", cap: null, band: "#1b1d21", shape: "sparse", notes: "Yellow-and-black hazard-style posts where present; not consistently used nationwide." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signage, red soil visible roadside in many inland regions." },
    plates: { bg: "#c1443c", notes: "Red lettering on white/silver plates in the older format, transitioning to Mercosul blue-striped plates." },
    language: { script: "Latin", notes: "Portuguese — same core tells as Portugal (ã, õ, ç), but road environment and terrain differ sharply." },
    keyTip: "Portuguese-language signage combined with red soil and tropical vegetation confirms Brazil over Portugal.",
    confusedWith: ["portugal", "argentina"]
  },
  {
    id: "japan", name: "Japan", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2c14e", shape: "reflector-post", notes: "Yellow-and-black striped reflector posts are common on rural roads." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Blue directional expressway signage, green rural highway signage, and utility poles lining almost every street." },
    plates: { bg: "#ffffff", notes: "Distinct plate shape/size versus Western countries, often with a regional name in kanji at the top." },
    language: { script: "Kanji/Kana", notes: "Japanese kanji/hiragana/katakana script is an instant, unmistakable confirm." },
    keyTip: "Kanji/kana script on any sign is a same-glance Japan confirm — no ambiguity once you can read the script family.",
    confusedWith: ["south korea", "taiwan"]
  }
];
