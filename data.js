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
    confusedWith: ["belgium", "monaco", "luxembourg", "andorra", "jersey", "reunion"]
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
    confusedWith: ["belgium", "germany", "curacao"]
  },
  {
    id: "italy", name: "Italy", code: "IT", region: "Europe", driving: "right",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge", notes: "Black diagonal wedge body reaching to the top, vertical red rectangle on the front, white rectangle on the back." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional arrows and blue-background motorway signage (green is reserved for the autostrada system)." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue side stripe (not full EU band position), black text." },
    language: { script: "Latin", notes: "Italian — double consonants and vowel-heavy endings (-o, -a, -i)." },
    keyTip: "Black wedge bollard with a vertical red front stripe — Albania shares this almost exactly, use language/architecture to split them.",
    confusedWith: ["albania", "san marino", "monaco", "malta", "tunisia"]
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
    confusedWith: ["germany", "czechia", "slovakia", "lithuania"]
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
    confusedWith: ["sweden", "norway", "germany", "faroe islands"]
  },
  {
    id: "sweden", name: "Sweden", code: "SE", region: "Europe", driving: "right",
    bollard: { body: "#f2c14e", cap: null, band: "#1b1d21", shape: "reflector-post", notes: "Distinct yellow/black reflector posts on rural roads, quite different from Denmark's red post." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage; dense birch and pine forest is common on rural roads." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "Blue-edged plate band with 'S', white background, black text." },
    language: { script: "Latin", notes: "Swedish — å, ä, ö appear, but ä/ö are shared with Finnish signage in bilingual areas, so check for å specifically." },
    keyTip: "Yellow-and-black rural reflector posts plus å/ä/ö text points to Sweden over Denmark or Norway.",
    confusedWith: ["norway", "finland", "denmark", "aland"]
  },
  {
    id: "norway", name: "Norway", code: "NO", region: "Europe", driving: "right",
    bollard: { body: "#f2c14e", cap: null, band: "#1b1d21", shape: "reflector-post", notes: "Similar reflector-post family to Sweden; terrain (fjords, tunnels, steep mountain roads) is the real differentiator." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Frequent tunnels and dramatic elevation change are a strong Norway signature versus flatter Sweden/Denmark." },
    plates: { bg: "#ffffff", band: null, notes: "White plate, black text, no blue EU band since Norway isn't in the EU." },
    language: { script: "Latin", notes: "Norwegian — æ, ø, å like Danish, but Norwegian spelling and grammar diverge on closer signage reading." },
    keyTip: "No blue EU band on the plate, combined with mountainous terrain, is the fastest Norway confirm.",
    confusedWith: ["sweden", "denmark", "iceland", "faroe islands", "svalbard"]
  },
  {
    id: "finland", name: "Finland", code: "FI", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "cylindrical", notes: "Cylindrical white post shape stands out from the flatter posts used elsewhere in Scandinavia." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Bilingual Finnish/Swedish signage in coastal regions; dense uniform birch forest inland." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'FIN', black text." },
    language: { script: "Latin", notes: "Finnish is unrelated to the other Nordic languages — long compound words with double vowels (aa, ää, öö) are distinctive." },
    keyTip: "Cylindrical (not flat) bollard shape plus non-Germanic-looking language text is the Finland signature.",
    confusedWith: ["sweden", "estonia", "aland"]
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
    confusedWith: ["portugal", "andorra", "gibraltar"]
  },
  {
    id: "portugal", name: "Portugal", code: "PT", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2c14e", shape: "flat", notes: "Flat white post but with a yellow reflector band rather than Spain's red." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Black-and-white cobblestone (calçada) pavement in towns is a distinctly Portuguese texture." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'P', black text, dashes separating letter/number groups." },
    language: { script: "Latin", notes: "Portuguese — tildes (ã, õ) and 'ç' distinguish it from Spanish at a glance." },
    keyTip: "Black-and-white cobblestone pavement in a town centre is close to a guaranteed Portugal confirm.",
    confusedWith: ["spain", "brazil", "macau", "sao tome and principe"]
  },
  {
    id: "uk", name: "United Kingdom", code: "GB", region: "Europe", driving: "left",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge-rare", notes: "Bollards are comparatively rare; when present, black-and-white sections with a large red rectangle on top." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue motorway signage, roundabout-heavy junctions, and yellow grid-lines painted at some intersections." },
    plates: { bg: "#fadb2c", band: null, notes: "Yellow rear plate / white front plate, black text, no blue EU strip post-Brexit." },
    language: { script: "Latin", notes: "English, with Welsh/Gaelic bilingual signage in Wales and parts of Scotland." },
    keyTip: "Left-hand driving plus yellow rear plates narrows Europe down to essentially the UK and Ireland — check for bilingual Welsh/Gaelic text to split them.",
    confusedWith: ["ireland", "cyprus", "malta", "gibraltar", "isle of man", "jersey", "akrotiri and dhekelia", "bermuda"]
  },
  {
    id: "ireland", name: "Ireland", code: "IE", region: "Europe", driving: "left",
    bollard: { body: "#1b1d21", cap: null, band: "#c1443c", shape: "wedge-rare", notes: "Similar sparse bollard usage to the UK; not a strong standalone differentiator." },
    signs: { bg: "#3b6ea8", accent: "#f2c14e", notes: "Distances in kilometres on green-background signs (vs the UK's miles on green/blue), and widespread bilingual Irish/English text." },
    plates: { bg: "#fadb2c", band: "#3b6ea8", notes: "Yellow plate, black text, but format includes a year-and-county code prefix distinct from UK plates." },
    language: { script: "Latin", notes: "Irish (Gaelic) alongside English on almost all official signage — the clearest tell against the UK." },
    keyTip: "Bilingual Irish/English signage with kilometre distances is a fast, reliable Ireland confirm.",
    confusedWith: ["uk", "iceland", "isle of man"]
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
    confusedWith: ["cyprus", "turkey", "israel", "tunisia"]
  },
  {
    id: "turkey", name: "Turkey", code: "TR", region: "Europe/Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "thick-rect", notes: "Thicker rectangular reflector than most of Europe — often compared to Australia's bollard profile." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue directional signage; minarets and mosque architecture are a strong regional confirm in towns." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue strip with province code number (not a country letter), black text." },
    language: { script: "Latin", notes: "Turkish — dotless 'ı', ğ, ş, ç are distinctive letterforms not found together elsewhere." },
    keyTip: "Dotless ı and ğ on any sign is a same-glance Turkey confirm.",
    confusedWith: ["greece", "georgia"]
  },
  {
    id: "russia", name: "Russia", code: "RU", region: "Europe/Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Simple flat white/red post; road quality and marking style vary widely by region." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Distinctive blue Google Street View camera watermark/car in many regions, plus Cyrillic road signage." },
    plates: { bg: "#ffffff", band: null, notes: "White plate, black text, region-code numbers after the letters, Russian tricolour flag graphic on the plate." },
    language: { script: "Cyrillic", notes: "Russian Cyrillic — combined with non-EU plate format, narrows quickly away from Bulgaria/Serbia." },
    keyTip: "Tricolour flag graphic printed directly on the plate is a distinctive Russia-specific detail.",
    confusedWith: ["belarus", "ukraine", "kazakhstan", "estonia", "latvia", "georgia", "mongolia", "kyrgyzstan"]
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
    confusedWith: ["new zealand", "south africa", "christmas island", "cocos islands"]
  },
  {
    id: "usa", name: "United States", code: "US", region: "North America", driving: "right",
    bollard: { body: "#c1443c", cap: null, band: "#ffffff", shape: "sparse", notes: "Bollards are inconsistent/rare state-to-state — lean on other clues far more than in Europe." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signage with white text, yellow diamond warning signs, and wide painted yellow centre-lines." },
    plates: { bg: "#ffffff", band: null, notes: "Plate colour/format varies by state — a strong regional narrower once you learn a handful of state designs." },
    language: { script: "Latin", notes: "English, with Spanish-language signage common in the Southwest." },
    keyTip: "Green highway signage with white text is the fastest US/Canada-region confirm versus Europe's blue.",
    confusedWith: ["canada", "mexico", "puerto rico", "united states virgin islands", "bermuda", "guam"]
  },
  {
    id: "brazil", name: "Brazil", code: "BR", region: "South America", driving: "right",
    bollard: { body: "#f2c14e", cap: null, band: "#1b1d21", shape: "sparse", notes: "Yellow-and-black hazard-style posts where present; not consistently used nationwide." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signage, red soil visible roadside in many inland regions." },
    plates: { bg: "#c1443c", band: null, notes: "Red lettering on white/silver plates in the older format, transitioning to Mercosul blue-striped plates." },
    language: { script: "Latin", notes: "Portuguese — same core tells as Portugal (ã, õ, ç), but road environment and terrain differ sharply." },
    keyTip: "Portuguese-language signage combined with red soil and tropical vegetation confirms Brazil over Portugal.",
    confusedWith: ["portugal", "argentina", "sao tome and principe", "uruguay"]
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
    confusedWith: ["norway", "ireland", "faroe islands", "svalbard", "greenland"]
  },
  {
    id: "estonia", name: "Estonia", code: "EE", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White flat post with a red reflector, shared broadly across the Baltic states." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs; dense flat pine and birch forest dominates the roadside." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue EU strip with 'EST', black text." },
    language: { script: "Latin", notes: "Estonian — õ is the standout letter, alongside ä, ö and ü; a Finnic language, so it looks nothing like Latvian or Lithuanian." },
    keyTip: "The letter õ plus doubled vowels marks Estonian — Finnish-looking text but on the south side of the Gulf.",
    confusedWith: ["finland", "russia", "latvia", "lithuania"]
  },
  {
    id: "belarus", name: "Belarus", code: "BY", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White flat post with a red reflector, in the broad post-Soviet pattern." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs with very wide, well-maintained rural roads and long tree-lined avenues." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue strip with 'BY', black text, region-number prefix." },
    language: { script: "Cyrillic", notes: "Belarusian and Russian — Belarusian uses ў, a letter found in no other Cyrillic alphabet." },
    keyTip: "The letter ў in Cyrillic text is unique to Belarusian and settles it against Russia or Ukraine instantly.",
    confusedWith: ["russia", "ukraine", "latvia", "lithuania"]
  },
  {
    id: "moldova", name: "Moldova", code: "MD", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White flat post with a red reflector; frequently absent on smaller rural roads." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs, rolling vineyard country, and noticeably rougher surfacing than Romania." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate, blue strip with 'MD', black text — the strip is a national marker, not an EU band." },
    language: { script: "Latin", notes: "Romanian, effectively identical to Romania's; Cyrillic appears in the Transnistria region." },
    keyTip: "Romanian-language signage with 'MD' rather than EU plates is the Moldova-over-Romania split. Note that Moldova has no official Street View car coverage — on official-coverage maps it is never the answer.",
    confusedWith: ["romania", "ukraine"]
  },
  {
    id: "cyprus", name: "Cyprus", code: "CY", region: "Europe", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White flat post with a red reflector; sparse, with kerbing more common than posts." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Bilingual Greek and English signage, with British-inherited road markings and roundabouts." },
    plates: { bg: "#fadb2c", band: "#3b6ea8", notes: "Yellow rear plate, white front, blue EU strip with 'CY' — the yellow is a British inheritance." },
    language: { script: "Greek", notes: "Greek alongside English on nearly all official signage." },
    keyTip: "Greek script combined with driving on the left is conclusive — Greece drives on the right, so it can only be Cyprus.",
    confusedWith: ["greece", "uk", "malta", "israel", "akrotiri and dhekelia"]
  },
  {
    id: "kazakhstan", name: "Kazakhstan", code: "KZ", region: "Europe/Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Posts appear only intermittently; vast stretches of road carry no markers at all." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs in Kazakh and Russian, over enormous flat, treeless steppe." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate with a blue strip carrying the flag and 'KZ' on the right-hand edge, black text." },
    language: { script: "Cyrillic", notes: "Kazakh and Russian — Kazakh Cyrillic adds ә, ғ, қ, ң, ө, ұ and ү, none of which exist in Russian." },
    keyTip: "Cyrillic with ә or ұ is Kazakh, not Russian — that plus open steppe settles it.",
    confusedWith: ["russia", "mongolia", "kyrgyzstan"]
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
    confusedWith: ["brazil", "chile", "bolivia", "uruguay"]
  },
  {
    id: "new zealand", name: "New Zealand", code: "NZ", region: "Oceania", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2c14e", shape: "reflector-post", notes: "White marker posts with yellow or white reflectors along rural highways." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signage, one-lane bridges, and a distinct absence of Australia's yellow diamond animal warnings." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text; a single national format rather than Australia's per-state variety." },
    language: { script: "Latin", notes: "English with widespread Māori place names — Whanga-, Wai- and Te are strong markers." },
    keyTip: "Māori place names plus left-hand driving and lush green hill country separates New Zealand from Australia.",
    confusedWith: ["australia", "american samoa", "pitcairn islands"]
  },
  {
    id: "south africa", name: "South Africa", code: "ZA", region: "Africa", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Marker posts are inconsistent; painted kerbs and cable barriers do more of the work." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs with distinctive yellow-bordered route markers, plus frequent roadside fencing." },
    plates: { bg: "#ffffff", band: null, notes: "Province-issued plates in varying formats; several provinces use a yellow background." },
    language: { script: "Latin", notes: "English and Afrikaans on most signage — Afrikaans compounds like 'Straat' and 'Weg' are the tell." },
    keyTip: "Afrikaans alongside English on left-hand-drive roads is a fast, reliable South Africa confirm.",
    confusedWith: ["australia", "kenya", "botswana", "namibia", "lesotho", "eswatini"]
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
    confusedWith: ["japan", "south korea", "hong kong", "macau"]
  },
  {
    id: "latvia", name: "Latvia", code: "LV", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Plain white flat post with a red reflector. The Baltic bollards are close enough to each other that they are not the tell — use the language." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs; brown tourist signs are common. Road furniture is a near-match for Estonia and Lithuania." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "Black on white with the blue EU strip and 'LV', two letters then a dash then up to four digits (AB-1234)." },
    language: { script: "Latin", notes: "Latvian — long-vowel macrons (ā, ē, ī, ū) that neither Estonian nor Lithuanian uses, and nouns ending -s or -is." },
    keyTip: "Macrons over vowels (ā, ē, ī, ū) settle Latvia against Lithuania's hooks (ą, ę, ų) and Estonia's õ instantly.",
    confusedWith: ["lithuania", "estonia", "belarus", "russia"]
  },
  {
    id: "lithuania", name: "Lithuania", code: "LT", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White flat post, red reflector — visually the same family as Latvia's, so treat it as a region hint rather than a country tell." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue direction signs with yellow-bordered priority-road diamonds; village entry signs are white with black text." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "Black on white with the blue EU strip and 'LT', three letters then three digits (ABC 123), no regional code." },
    language: { script: "Latin", notes: "Lithuanian — ogonek hooks (ą, ę, į, ų) and the -as / -is / -us endings that pile up on place names." },
    keyTip: "Hooks under the vowels rather than bars over them is Lithuania, not Latvia; Lithuanian also loves the ending -as.",
    confusedWith: ["latvia", "belarus", "poland", "estonia"]
  },
  {
    id: "malta", name: "Malta", code: "MT", region: "Europe", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Barely any bollards — roads are narrow, walled and lined with honey-coloured limestone rubble instead." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "British-pattern signage and road markings in English, with Maltese place names underneath." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "Black on white in the German FE-Schrift typeface, blue EU strip with 'M', three letters then three digits." },
    language: { script: "Latin", notes: "Maltese — the only Latin-script Semitic language, marked by ħ, ġ, ż and ċ, alongside English." },
    keyTip: "Left-hand traffic plus honey-coloured limestone everywhere and Maltese ħ / ġ / ż — Cyprus is the other left-driving Mediterranean island but its signage is Greek.",
    confusedWith: ["cyprus", "italy", "uk", "gibraltar"]
  },
  {
    id: "aland", name: "Åland Islands", code: "AX", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "cylindrical", notes: "Finnish road furniture, because Åland is part of Finland — the round-section posts and reflector poles are the mainland's." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Finnish sign shapes and layouts, but every word on them is Swedish — Åland is monolingually Swedish." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "Own plates: blue strip carrying the Åland flag and 'ÅL' rather than the EU circle of stars." },
    language: { script: "Latin", notes: "Swedish only. Finnish does not appear on signage here, which is the reverse of mainland Finland's bilingual signs." },
    keyTip: "Finnish infrastructure with Swedish-only signage and ÅL plates is Åland — mainland Finland pairs Finnish above Swedish.",
    confusedWith: ["finland", "sweden"]
  },
  {
    id: "faroe islands", name: "Faroe Islands", code: "FO", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#f2c14e", shape: "reflector-post", notes: "Tall thin marker posts with reflectors, suited to snow and fog rather than the Danish wrapping collar." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Danish-style signs in Faroese; single-lane tunnels with passing bays are everywhere and signed as such." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate with a blue strip and 'FO' — Danish-adjacent but never carrying the EU stars, since the Faroes are outside the EU." },
    language: { script: "Latin", notes: "Faroese — ð and ø, close enough to Icelandic to confuse, but Icelandic also uses þ, which Faroese does not." },
    keyTip: "Treeless steep green islands, black-tarred houses with turf roofs and ð in the text: Faroes. A þ in the text means Iceland instead.",
    confusedWith: ["iceland", "norway", "denmark", "greenland"]
  },
  {
    id: "gibraltar", name: "Gibraltar", code: "GI", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Almost no rural road at all — it is a dense town under a limestone rock, with British kerbs and railings." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "British signage, British road markings and English street names, packed into Mediterranean streets." },
    plates: { bg: "#ffffff", band: null, notes: "UK-style plate and typeface with a 'G' prefix, no EU band; front white, rear yellow like Britain." },
    language: { script: "Latin", notes: "English on all signage, with Spanish heard and written informally on shopfronts." },
    keyTip: "British signage and yellow rear plates but traffic on the right — that combination only happens in Gibraltar.",
    confusedWith: ["uk", "spain", "malta"]
  },
  {
    id: "isle of man", name: "Isle of Man", code: "IM", region: "Europe", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "British road furniture — hedgerows, stone walls and painted kerbs rather than posts." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "British-pattern signs; the three-legged triskelion turns up on official signage, and TT course markings on the mountain road." },
    plates: { bg: "#ffffff", band: null, notes: "UK format with a 'MN' or 'MAN' marker and the triskelion instead of an EU band." },
    language: { script: "Latin", notes: "English, with Manx Gaelic on bilingual village signs (Balley, Purt)." },
    keyTip: "A three-legged triskelion on plates or signs, with British roads and no EU band, is the Isle of Man.",
    confusedWith: ["uk", "ireland", "jersey"]
  },
  {
    id: "jersey", name: "Jersey", code: "JE", region: "Europe", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Granite walls and very narrow banked lanes; the road edge is stone, not posts." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "British signage in English but with French street and place names (Rue, Le Mont), plus yellow 'filter in turn' markings unique to the island." },
    plates: { bg: "#ffffff", band: null, notes: "'J' followed by up to five digits, black on white front and rear — no EU band and no British-style letter groups." },
    language: { script: "Latin", notes: "English, over a layer of Norman-French place names that look French but sit on British roads." },
    keyTip: "French place names on British roads with J-prefixed plates puts you in Jersey rather than Guernsey or Normandy.",
    confusedWith: ["uk", "france", "isle of man"]
  },
  {
    id: "svalbard", name: "Svalbard and Jan Mayen", code: "SJ", region: "Europe", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "reflector-post", notes: "Coverage is a handful of settlements; road furniture is minimal and often snow-buried." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Norwegian signage, plus the polar-bear warning sign at the edge of Longyearbyen that appears nowhere else on Earth." },
    plates: { bg: "#ffffff", band: null, notes: "Norwegian-style plates, frequently snow-covered; most vehicles in view are snowmobiles rather than cars." },
    language: { script: "Latin", notes: "Norwegian, with Russian in Barentsburg and Pyramiden." },
    keyTip: "No trees at all, boxy houses on pilings above the permafrost, and a polar-bear sign: Svalbard.",
    confusedWith: ["norway", "greenland", "iceland"]
  },
  {
    id: "georgia", name: "Georgia", code: "GE", region: "Europe/Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White posts with red reflectors on main roads; away from them, unsealed roads and no posts at all." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue signs with Georgian above a Latin transliteration — the two scripts stacked on one sign is the giveaway." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "Black on white with a blue strip and 'GE', format AA-123-AA in Latin letters." },
    language: { script: "Georgian", notes: "Georgian — a rounded, looping alphabet used by no other country, unmistakable once seen." },
    keyTip: "The Georgian alphabet is unique to Georgia; nothing else looks like it, so one legible sign ends the round.",
    confusedWith: ["turkey", "russia"]
  },
  {
    id: "india", name: "India", code: "IN", region: "Asia", driving: "left",
    bollard: { body: "#fadb2c", cap: "#1b1d21", band: "#1b1d21", shape: "sparse", notes: "Black-and-yellow striped kerbs, guard stones and tree trunks do the work of bollards on most Indian roads." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signs with white text, usually English over the state's own script, and blue-and-white town signs." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text for private vehicles, yellow with black for commercial — the two are mixed in every scene." },
    language: { script: "Devanagari + regional", notes: "Devanagari in the north, but Tamil, Telugu, Kannada, Malayalam, Bengali and Gurmukhi all appear regionally alongside English." },
    keyTip: "Left-hand traffic, black-and-yellow painted kerbs and English paired with an Indic script — the specific script then places you within India.",
    confusedWith: ["sri lanka", "bangladesh", "nepal", "bhutan"]
  },
  {
    id: "nepal", name: "Nepal", code: "NP", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Mountain roads with masonry parapets and occasional white posts; the terrain does more identifying than the furniture." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue and green signs in Devanagari with English transliteration; hill roads are narrow, cut into terraced slopes." },
    plates: { bg: "#c1443c", band: null, notes: "Red plates with white Devanagari for private vehicles — a colour no neighbour uses, and the fastest Nepal confirm." },
    language: { script: "Devanagari", notes: "Nepali in Devanagari, very close to Hindi in appearance, so lean on the plates rather than the script." },
    keyTip: "Red number plates with white Devanagari are Nepal — India's private plates are white and Bhutan's are white with Latin letters.",
    confusedWith: ["india", "bhutan", "bangladesh"]
  },
  {
    id: "bhutan", name: "Bhutan", code: "BT", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Narrow mountain roads with stone edging; the buildings, not the road, identify Bhutan." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Signage in Dzongkha above English, and painted timber-framed architecture on literally every building, by law." },
    plates: { bg: "#ffffff", band: null, notes: "White plate, Latin letters, BP / BT / BG prefix then a region digit — no Indic script at all." },
    language: { script: "Tibetan", notes: "Dzongkha, written in Tibetan script — horizontal, with a headline and stacked marks, unlike Devanagari's continuous top bar." },
    keyTip: "Ornate painted window frames and cornices on every single building, in Himalayan terrain, is Bhutan and nowhere else.",
    confusedWith: ["nepal", "india"]
  },
  {
    id: "bangladesh", name: "Bangladesh", code: "BD", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#1b8a3b", shape: "sparse", notes: "Rarely any roadside posts; roads run on embankments between paddy fields, with brick edging where anything exists." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Bengali-script signage, often with no English at all, and cycle rickshaws in almost every populated scene." },
    plates: { bg: "#ffffff", band: null, notes: "White plate written in Bengali letters and numerals, with the city name (DHAKA, CHATTAGRAM) spelled out in Bengali." },
    language: { script: "Bengali", notes: "Bengali — a top bar like Devanagari, but rounder and with more curling descenders." },
    keyTip: "Bengali script with left-hand traffic and rickshaw traffic: Bangladesh. The same script in India means West Bengal, where signs also carry Hindi or English.",
    confusedWith: ["india", "nepal"]
  },
  {
    id: "sri lanka", name: "Sri Lanka", code: "LK", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#1b1d21", shape: "flat", notes: "Squat white posts with a dark band on main roads, plus black-and-white painted kerbs through villages." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Three-language signage — Sinhala, Tamil and English stacked on the same board — is a national standard." },
    plates: { bg: "#ffffff", band: null, notes: "White front, yellow rear, black text with a two-letter province code — the split colours are a useful confirm." },
    language: { script: "Sinhala", notes: "Sinhala — very round, bubbly letterforms, quite unlike the angular Tamil that often sits beside it." },
    keyTip: "Round bubbly Sinhala script on tropical left-hand-drive roads is Sri Lanka; Tamil alone would point to Tamil Nadu in India.",
    confusedWith: ["india", "thailand"]
  },
  {
    id: "thailand", name: "Thailand", code: "TH", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White posts with red bands, and red-and-white painted kerbs marking no-parking, which are everywhere in towns." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signs in Thai over English; utility poles are concrete with a distinctive cross-arm, and 7-Elevens are constant." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black Thai characters and the province name spelled out along the bottom." },
    language: { script: "Thai", notes: "Thai — loops and circles at the start of letters, with marks above and below the line." },
    keyTip: "Thai script plus left-hand traffic is conclusive: Laos uses a similar-looking script but drives on the right.",
    confusedWith: ["laos", "cambodia", "malaysia", "sri lanka", "indonesia", "philippines"]
  },
  {
    id: "malaysia", name: "Malaysia", code: "MY", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White posts with red reflectors along trunk roads, often against oil-palm plantation walls of green." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue and green signs in Malay — Jalan, Kampung, Persiaran — with distinctive yellow-and-black chevrons on bends." },
    plates: { bg: "#1b1d21", band: null, notes: "Black plate with white characters, the format that only Malaysia, Singapore and Brunei use in the region." },
    language: { script: "Latin", notes: "Malay in Latin script, with Chinese and Tamil shop signage in towns." },
    keyTip: "Black plates with white text plus Malay-language signs and oil palms: Malaysia. Singapore has the same plates but is wall-to-wall city.",
    confusedWith: ["singapore", "indonesia", "thailand"]
  },
  {
    id: "singapore", name: "Singapore", code: "SG", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "No rural road exists; kerbs, railings and immaculate line-painting replace posts entirely." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green expressway signs in English, four official languages on public notices, and HDB tower blocks labelled with block numbers." },
    plates: { bg: "#1b1d21", band: null, notes: "Black plate with white characters, same family as Malaysia's, usually on newer cars with a checkerboard-clean streetscape behind them." },
    language: { script: "Latin", notes: "English first, with Chinese, Malay and Tamil alongside on official signage." },
    keyTip: "Black plates and left-hand traffic in a spotless high-rise city with no countryside anywhere is Singapore, not Malaysia.",
    confusedWith: ["malaysia", "hong kong"]
  },
  {
    id: "indonesia", name: "Indonesia", code: "ID", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Occasional white-and-red posts on trunk roads; village roads have concrete edging and open drains instead." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Indonesian-language signs — Jalan, Kabupaten, Desa — and dense motorbike traffic in almost every scene." },
    plates: { bg: "#1b1d21", band: null, notes: "Traditionally black with white text; newer issues are white with black text, so both turn up in current coverage." },
    language: { script: "Latin", notes: "Indonesian in Latin script — no diacritics, and words like Jalan, Selamat, Kampung recur constantly." },
    keyTip: "Left-hand traffic with Indonesian-language signs and swarms of scooters; Malaysia's Malay looks similar, so check for Kabupaten or Desa, which are Indonesian-only.",
    confusedWith: ["malaysia", "philippines", "thailand", "christmas island"]
  },
  {
    id: "philippines", name: "Philippines", code: "PH", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Concrete roads with painted kerbs; the roadside furniture that stands out is basketball hoops, which appear in nearly every barangay." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "English-language signage throughout, barangay welcome arches, and jeepneys or tricycles in the traffic." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text; older green-on-white issues still circulate." },
    language: { script: "Latin", notes: "English and Filipino, both Latin script — Spanish-derived place names (San, Santo, Nueva) are everywhere." },
    keyTip: "Right-hand traffic in Southeast Asia is already most of the answer — add English signs, jeepneys and outdoor basketball courts and it is the Philippines.",
    confusedWith: ["indonesia", "vietnam", "thailand"]
  },
  {
    id: "vietnam", name: "Vietnam", code: "VN", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White posts with red bands on national highways; narrow tube-houses crowd the roadside in towns." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue and green signs in Vietnamese; kilometre markers are squat white posts with rounded blue tops." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text and a province number; blue plates mark state vehicles." },
    language: { script: "Latin", notes: "Vietnamese — Latin letters carrying stacked diacritics (ế, ộ, ữ), which no other language piles up this way." },
    keyTip: "Latin script with two diacritics stacked on one vowel is Vietnamese, and settles it against every neighbouring script.",
    confusedWith: ["cambodia", "laos", "philippines"]
  },
  {
    id: "cambodia", name: "Cambodia", code: "KH", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Red laterite dust on everything beside rural roads, with little formal edge furniture." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Khmer signage over English, and roadside stilt houses with open ground floors through the countryside." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate with a blue strip and the province name in Khmer, black serial to the right of it." },
    language: { script: "Khmer", notes: "Khmer — tall, spiky ascenders and subscript consonants hanging below the line, denser than Thai or Lao." },
    keyTip: "Khmer script with right-hand traffic is Cambodia; Thailand's similar-looking script comes with left-hand traffic.",
    confusedWith: ["thailand", "laos", "vietnam"]
  },
  {
    id: "laos", name: "Laos", code: "LA", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Very light road furniture; coverage is thin and mostly follows the Mekong towns and Route 13." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Lao script signage, French-influenced town layouts in Vientiane and Luang Prabang, and hand-painted shopfronts." },
    plates: { bg: "#f2a900", band: null, notes: "Ordinary vehicles carry black on orange-yellow plates — a colour combination none of its neighbours uses." },
    language: { script: "Lao", notes: "Lao — rounder and simpler than Thai, with fewer flourishes and no tall spikes like Khmer." },
    keyTip: "Orange plates plus a round script that looks like a simplified Thai is Laos, and the traffic drives on the right.",
    confusedWith: ["thailand", "cambodia", "vietnam"]
  },
  {
    id: "israel", name: "Israel", code: "IL", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White posts with red reflectors on highways; stone walls and dry pine-and-scrub hillsides do the rest." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Trilingual signage — Hebrew, Arabic and English on the same green or blue board — is standard nationwide." },
    plates: { bg: "#fadb2c", band: "#3b6ea8", notes: "Reflective yellow plate with black digits and a small blue strip; the yellow is visible from a long way off." },
    language: { script: "Hebrew", notes: "Hebrew — square, blocky letters with no ascenders, sitting alongside Arabic on almost every sign." },
    keyTip: "Yellow plates front and rear plus Hebrew on the signs is immediate. Yellow plates with Arabic-only signage means you are in the West Bank.",
    confusedWith: ["palestine", "jordan", "cyprus", "greece", "lebanon"]
  },
  {
    id: "palestine", name: "Palestine", code: "PS", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "West Bank coverage only. Roads are narrower and rougher than Israeli ones, often with unfinished stone-block buildings alongside." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Arabic-first signage, frequently without Hebrew, and green Palestinian Authority boards in the towns." },
    plates: { bg: "#ffffff", band: "#1b8a3b", notes: "White plate with green digits and a green strip — visually the opposite of Israel's yellow plates." },
    language: { script: "Arabic", notes: "Arabic, with English transliteration on main routes; Hebrew is usually absent." },
    keyTip: "Same limestone hills as Israel, but white-and-green plates and Arabic-only signs: you are in the West Bank.",
    confusedWith: ["israel", "jordan", "lebanon"]
  },
  {
    id: "jordan", name: "Jordan", code: "JO", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Desert highways with little furniture; coverage concentrates on archaeological sites and the main north-south corridors." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Brown heritage signs to Petra and Jerash, and blue directional boards in Arabic over English." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "European-size white plates with black digits in a British-looking typeface, split by a hyphen." },
    language: { script: "Arabic", notes: "Arabic with English transliteration; road signs are consistently bilingual." },
    keyTip: "Bare ochre desert and limestone with Arabic-English signs and European-shaped white plates points to Jordan over its Gulf neighbours.",
    confusedWith: ["israel", "palestine", "oman", "united arab emirates", "lebanon"]
  },
  {
    id: "lebanon", name: "Lebanon", code: "LB", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Steep coastal and mountain roads, dense unrendered concrete apartment blocks, and very little formal roadside furniture." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Arabic and French both appear on signage — a colonial hangover that separates Lebanon from its neighbours." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate with a blue strip carrying لبنان and a cedar tree — the cedar is the single fastest confirm." },
    language: { script: "Arabic", notes: "Arabic, with French widely used on shopfronts and official signage, and English in Beirut." },
    keyTip: "A cedar tree on the plate strip, or French sharing a sign with Arabic, is Lebanon.",
    confusedWith: ["israel", "palestine", "jordan"]
  },
  {
    id: "united arab emirates", name: "United Arab Emirates", code: "AE", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Immaculate wide highways with sand drifting over the shoulders; irrigation lines and planted palms along urban roads." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green motorway signs in Arabic over English, extremely well maintained, with distinctive blue-and-white street name plaques." },
    plates: { bg: "#ffffff", band: null, notes: "Each emirate issues its own design, so the plate names the emirate — Dubai, Abu Dhabi, Sharjah — in Arabic and English." },
    language: { script: "Arabic", notes: "Arabic and English side by side almost everywhere, plus Hindi and Urdu on shopfronts." },
    keyTip: "Perfectly surfaced multi-lane roads through sand, with the emirate's name printed on the plate, is the UAE rather than Qatar or Oman.",
    confusedWith: ["qatar", "oman", "jordan"]
  },
  {
    id: "qatar", name: "Qatar", code: "QA", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Flat sand and gravel plains, new highways, and roundabouts in place of junctions almost everywhere." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue and green signage in Arabic over English; the landscape is flatter and emptier than the UAE's." },
    plates: { bg: "#ffffff", band: null, notes: "White plate carrying digits only, with no letter group — short numeric plates are a Qatar habit." },
    language: { script: "Arabic", notes: "Arabic with English; coverage is limited and clusters around Doha." },
    keyTip: "Flat featureless desert around a single big city, digits-only plates, and Arabic-English signs: Qatar.",
    confusedWith: ["united arab emirates", "oman"]
  },
  {
    id: "oman", name: "Oman", code: "OM", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Jagged bare rock mountains falling straight to the road — far more dramatic relief than the Gulf's other coverage." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue and brown signage in Arabic over English; low white buildings with crenellated parapets are common." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black digits and a red-and-white national marker; formats are short and numeric." },
    language: { script: "Arabic", notes: "Arabic with English transliteration on all main signage." },
    keyTip: "Sharp bare mountains and white low-rise towns with Arabic-English signs is Oman, not the flatter UAE or Qatar.",
    confusedWith: ["united arab emirates", "qatar", "jordan"]
  },
  {
    id: "mongolia", name: "Mongolia", code: "MN", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Outside Ulaanbaatar the road often is the steppe — parallel dirt tracks with no edge markings at all." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Cyrillic signage, gers pitched beside the road, and long distances between anything built." },
    plates: { bg: "#ffffff", band: null, notes: "White plate carrying the red Soyombo symbol at the left and 'MGL', with a province letter pair in the suffix." },
    language: { script: "Cyrillic", notes: "Mongolian written in Cyrillic — Russian-looking letters, but with ө and ү, which Russian does not use." },
    keyTip: "Cyrillic on signs in open treeless steppe with gers, and a red Soyombo on the plate: Mongolia, not Russia.",
    confusedWith: ["russia", "kazakhstan", "kyrgyzstan"]
  },
  {
    id: "kyrgyzstan", name: "Kyrgyzstan", code: "KG", region: "Asia", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Soviet-era concrete posts and kilometre markers, with high snow-covered ranges filling the background." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Cyrillic signage, Soviet-planned towns with poplar-lined streets, and grazing livestock on the verges." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "Black on white with a blue strip and 'KG'; region numbers lead the serial." },
    language: { script: "Cyrillic", notes: "Kyrgyz and Russian, both Cyrillic — Kyrgyz adds ң, ө and ү." },
    keyTip: "Cyrillic plus very high mountains right behind the road and KG plates puts you in Kyrgyzstan rather than Kazakhstan's flatter steppe.",
    confusedWith: ["kazakhstan", "mongolia", "russia"]
  },
  {
    id: "hong kong", name: "Hong Kong", code: "HK", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "British kerbs and railings, dense high-rise towers, and steep green hills immediately behind the built-up strip." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "British-pattern signs in Traditional Chinese over English, with double-decker buses and trams in traffic." },
    plates: { bg: "#ffffff", band: null, notes: "British standard: white front plate, yellow rear, black characters — inherited from the colonial period." },
    language: { script: "Traditional Chinese", notes: "Traditional characters with English on every official sign." },
    keyTip: "Left-hand traffic with Traditional Chinese and British white-front/yellow-rear plates is Hong Kong; Macau's plates are black.",
    confusedWith: ["macau", "taiwan", "singapore"]
  },
  {
    id: "macau", name: "Macau", code: "MO", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Narrow Portuguese-era streets with calçada mosaic paving in the old centre, casinos and reclaimed land elsewhere." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Blue-and-white tiled street plaques carrying Portuguese above Chinese — a pairing that exists nowhere else in Asia." },
    plates: { bg: "#1b1d21", band: null, notes: "Black plate with white characters, front and rear — the opposite of Hong Kong's white-and-yellow British plates." },
    language: { script: "Traditional Chinese", notes: "Traditional Chinese and Portuguese are both official; Portuguese street names survive throughout." },
    keyTip: "Portuguese on a tiled street sign next to Chinese, with black plates and left-hand traffic: Macau.",
    confusedWith: ["hong kong", "portugal", "taiwan"]
  },
  {
    id: "akrotiri and dhekelia", name: "Akrotiri and Dhekelia", code: "GB", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Cypriot roads inside British sovereign base areas — dry scrub, salt lakes and military fencing." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "A mix of Cypriot signage and British military boards; the coverage is a few short road sections near Avdimou." },
    plates: { bg: "#ffffff", band: null, notes: "British-style plates on service vehicles alongside ordinary Cypriot plates; the flag flown is the Union Flag." },
    language: { script: "Latin + Greek", notes: "English on base signage, Greek on the surrounding Cypriot roads." },
    keyTip: "Effectively Cyprus with British bases on it — if you land here, guessing Cyprus costs almost nothing.",
    confusedWith: ["cyprus", "uk"]
  },
  {
    id: "christmas island", name: "Christmas Island", code: "CX", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Australian road furniture dropped into dense tropical rainforest, with phosphate mining infrastructure and cliffs." },
    signs: { bg: "#fadb2c", accent: "#1b1d21", notes: "Australian-standard yellow diamond warnings, including crab-crossing signs and seasonal road closures for the crab migration." },
    plates: { bg: "#ffffff", band: null, notes: "Australian-style plates marked for the territory; very few vehicles are in view at all." },
    language: { script: "Latin", notes: "English, with Malay and Chinese in the settlement — the population is largely Malay and Chinese Australian." },
    keyTip: "Australian signage in equatorial rainforest, with red crab warnings on the road, is Christmas Island.",
    confusedWith: ["cocos islands", "australia", "indonesia"]
  },
  {
    id: "cocos islands", name: "Cocos (Keeling) Islands", code: "CC", region: "Asia", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "A flat coral atoll — coconut palms, white sand and a single-lane road, with no relief anywhere." },
    signs: { bg: "#fadb2c", accent: "#1b1d21", notes: "Australian-standard signs on an atoll road; the lagoon is visible from almost everywhere." },
    plates: { bg: "#ffffff", band: null, notes: "Australian-style plates; the vehicle you are most likely to see is a ute or a quad bike." },
    language: { script: "Latin", notes: "English and Cocos Malay — Home Island signage is Malay, West Island is English." },
    keyTip: "A flat palm atoll with Australian road signs and turquoise lagoon on both sides is Cocos, not Christmas Island, which is a forested cliff.",
    confusedWith: ["christmas island", "australia"]
  },
  {
    id: "kenya", name: "Kenya", code: "KE", region: "Africa", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#1b1d21", shape: "sparse", notes: "Black-and-white painted kerbs and drums through towns; rural roads run straight through red-earth shoulders." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "English signage, green Safaricom and M-Pesa shopfronts in every trading centre, and matatu minibuses in traffic." },
    plates: { bg: "#ffffff", band: null, notes: "White plate, black text, UK-style suffix format (KAA 123A); older black plates with white text still appear." },
    language: { script: "Latin", notes: "English and Swahili, both Latin script — Swahili words like Duka, Hoteli and Karibu recur on shopfronts." },
    keyTip: "Left-hand traffic, red soil and green M-Pesa shopfronts is a fast Kenya call; Uganda's plates start UA and Tanzania has no official coverage.",
    confusedWith: ["uganda", "rwanda", "south africa"]
  },
  {
    id: "uganda", name: "Uganda", code: "UG", region: "Africa", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#1b1d21", shape: "sparse", notes: "Deep red murram shoulders, banana plantations tight against the road, and painted kerbs in towns." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "English signage with heavy yellow MTN and Airtel branding on shopfronts, and boda-boda motorcycle taxis everywhere." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text in the UAx 123A format; the leading UA is the Uganda giveaway." },
    language: { script: "Latin", notes: "English and Luganda; town names like Kampala, Jinja, Mbarara are distinctive." },
    keyTip: "Left-hand traffic with UA-prefixed plates and yellow MTN paint on the dukas is Uganda rather than Kenya.",
    confusedWith: ["kenya", "rwanda"]
  },
  {
    id: "rwanda", name: "Rwanda", code: "RW", region: "Africa", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Well-kept roads with painted kerbs and drainage channels, cut into terraced hillsides." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "English and French signage, exceptionally clean streets, and motorcycle taxis whose riders all wear matching helmets." },
    plates: { bg: "#ffffff", band: null, notes: "European-size white plates with black text (RAA 123 A), stamped with Belgian dies." },
    language: { script: "Latin", notes: "Kinyarwanda, English and French — Kinyarwanda place names are long and vowel-heavy (Nyamirambo, Gikondo)." },
    keyTip: "Rwanda has only fourth-generation coverage, so the imagery is unusually sharp — crisp footage of terraced green hills with right-hand traffic is a strong tell.",
    confusedWith: ["uganda", "kenya"]
  },
  {
    id: "botswana", name: "Botswana", code: "BW", region: "Africa", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Long empty roads through flat thorn scrub, with cattle and donkeys on the verge and few markers of any kind." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "South African-style signage in English, plus animal warning signs for cattle, elephants and warthogs." },
    plates: { bg: "#ffffff", band: null, notes: "Front white, rear yellow, black text, always starting with B (B 123 ABC)." },
    language: { script: "Latin", notes: "English and Setswana — town names like Gaborone, Maun, Serowe." },
    keyTip: "Flat Kalahari thorn scrub, left-hand traffic and a plate starting with B: Botswana, not Namibia's yellow N plates.",
    confusedWith: ["namibia", "south africa", "eswatini"]
  },
  {
    id: "namibia", name: "Namibia", code: "NA", region: "Africa", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Gravel roads through desert and dry grassland; the roadside is sand, rock and the occasional windmill." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "South African-pattern signs in English, with German street names surviving in Swakopmund and Windhoek." },
    plates: { bg: "#fadb2c", band: null, notes: "Fluorescent yellow plate with black text, always beginning with N — unmistakable in a thumbnail." },
    language: { script: "Latin", notes: "English officially, with Afrikaans and German both visible on older signage and shopfronts." },
    keyTip: "Yellow plates starting with N in desert or dry scrub with left-hand traffic is Namibia; German shop names confirm it.",
    confusedWith: ["botswana", "south africa"]
  },
  {
    id: "lesotho", name: "Lesotho", code: "LS", region: "Africa", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Steep treeless mountain roads with stone-walled kraals; the whole country sits above 1,400 m." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "South African-style signage; Basotho blankets and conical mokorotlo hats appear constantly on people and shopfronts." },
    plates: { bg: "#ffffff", band: null, notes: "Blue text on white for private vehicles, with a mokorotlo hat sticker showing the validity period." },
    language: { script: "Latin", notes: "Sesotho and English — place names starting Ma-, Ha- and Thaba- are characteristic." },
    keyTip: "High treeless mountains completely surrounded by South Africa, with blue-on-white plates: Lesotho.",
    confusedWith: ["south africa", "eswatini"]
  },
  {
    id: "eswatini", name: "Eswatini", code: "SZ", region: "Africa", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "South African road furniture on a much smaller network — sugar cane, plantation pine and green hills." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "South African-pattern signage in English and siSwati; the terrain is far greener and hillier than Lesotho's bare highlands." },
    plates: { bg: "#ffffff", band: null, notes: "South African-sized plates carrying an SD marker; the country changed its name from Swaziland in 2018." },
    language: { script: "Latin", notes: "siSwati and English — words beginning with the prefixes Ka-, Lo- and eZulwini turn up on signs." },
    keyTip: "Green sugar-cane hills inside South Africa with SD plates is Eswatini; bare high mountains would be Lesotho instead.",
    confusedWith: ["lesotho", "south africa", "botswana"]
  },
  {
    id: "ghana", name: "Ghana", code: "GH", region: "Africa", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Red laterite shoulders, open concrete drains beside the carriageway, and speed humps at every settlement." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "English signage, hand-painted shop names with religious slogans, and dense roadside trading." },
    plates: { bg: "#ffffff", band: null, notes: "White plate, black text, region code then serial then the registration year (GR 1234-20) — the trailing year is a Ghana habit." },
    language: { script: "Latin", notes: "English, with Twi and Ga names on shopfronts." },
    keyTip: "Right-hand traffic in West Africa with English signage points at Ghana or Nigeria; the year on the end of the plate is Ghana's.",
    confusedWith: ["nigeria", "senegal"]
  },
  {
    id: "nigeria", name: "Nigeria", code: "NG", region: "Africa", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#1b8a3b", shape: "sparse", notes: "Very dense roadside commerce, okada motorcycles and danfo minibuses; formal road furniture is scarce." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "English signage in green and white, matching the national colours, with state slogans on welcome boards." },
    plates: { bg: "#ffffff", band: null, notes: "American-sized white plate with blue text, the state name across the top and 'Federal Republic of Nigeria' below." },
    language: { script: "Latin", notes: "English, over Yoruba, Igbo and Hausa names depending on the region." },
    keyTip: "American-shaped plates with blue text and a state name, on right-hand traffic in West Africa, is Nigeria.",
    confusedWith: ["ghana", "senegal"]
  },
  {
    id: "senegal", name: "Senegal", code: "SN", region: "Africa", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Sandy Sahelian shoulders, baobabs standing alone in fields, and horse carts sharing the road." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "French signage throughout — Route, Avenue, Quartier — with French road-marking conventions." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text and a regional number; French-influenced formats." },
    language: { script: "Latin", notes: "French officially, with Wolof widely spoken and appearing on informal signage." },
    keyTip: "French-language signs in dry Sahel with baobabs and right-hand traffic is Senegal, not anglophone Ghana or Nigeria.",
    confusedWith: ["ghana", "nigeria", "tunisia"]
  },
  {
    id: "tunisia", name: "Tunisia", code: "TN", region: "Africa", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White posts with red bands on the main network, olive groves in rows, and whitewashed walls with blue joinery." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Arabic and French on the same sign, the clearest marker of the Maghreb rather than the Gulf." },
    plates: { bg: "#1b1d21", band: null, notes: "Black plate with white characters and تونس set between the two number groups." },
    language: { script: "Arabic + Latin", notes: "Arabic and French together; French appears on street names, shopfronts and official signage." },
    keyTip: "Arabic paired with French, olive groves and a black plate with white digits: Tunisia.",
    confusedWith: ["senegal", "greece", "italy"]
  },
  {
    id: "sao tome and principe", name: "São Tomé and Príncipe", code: "ST", region: "Africa", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Steep volcanic islands under rainforest, with narrow roads and colonial roça plantation buildings." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Portuguese signage, very little of it; coverage is thin and mostly follows the coastal road." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text; very few vehicles in view." },
    language: { script: "Latin", notes: "Portuguese — the only Portuguese-speaking coverage in equatorial Africa." },
    keyTip: "Portuguese signage on a tiny equatorial volcanic island is São Tomé; Cape Verde and Angola have no official coverage.",
    confusedWith: ["portugal", "brazil", "reunion"]
  },
  {
    id: "reunion", name: "Réunion", code: "RE", region: "Africa", driving: "right",
    bollard: { body: "#f5f5f0", cap: "#c1443c", band: "#c1443c", shape: "rounded", notes: "French bollards and French road markings, transplanted onto a volcanic tropical island." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Standard French signage, including the coastal Route du Littoral under sheer cliffs and the Piton de la Fournaise lava fields." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "French EU plates ending in the department number 974 — that number is the entire tell." },
    language: { script: "Latin", notes: "French, with Réunion Creole on informal signage." },
    keyTip: "French road furniture and 974 on the plates, in sugar cane and volcanic terrain: Réunion.",
    confusedWith: ["france", "sao tome and principe"]
  },
  {
    id: "mexico", name: "Mexico", code: "MX", region: "North America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "White posts with red reflectors on federal highways; topes (speed humps) at the entrance to every town are more reliable than any post." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signs in Spanish, octagonal ALTO stop signs, and OXXO convenience stores and Pemex forecourts everywhere." },
    plates: { bg: "#ffffff", band: null, notes: "Each state issues its own design, often with graphics and colour, but the numbering is national — the state name is printed across the plate." },
    language: { script: "Latin", notes: "Spanish, with indigenous place names (Oaxaca, Tlaxcala, Xochimilco) that use x, tl and tz heavily." },
    keyTip: "ALTO on the stop signs, OXXO stores and Pemex stations put you in Mexico rather than anywhere further south.",
    confusedWith: ["guatemala", "usa", "costa rica"]
  },
  {
    id: "guatemala", name: "Guatemala", code: "GT", region: "Central America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Steep volcanic terrain, roadside maize on slopes, and concrete block houses painted with political or beer advertising." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Spanish signage, plus brightly repainted American school buses — camionetas — which are close to a national signature." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text and a letter marking the vehicle class (P for particular)." },
    language: { script: "Latin", notes: "Spanish, with Mayan languages and place names (Quetzaltenango, Chichicastenango) in the highlands." },
    keyTip: "Brightly painted chicken buses under volcanoes, with Spanish signage, is Guatemala.",
    confusedWith: ["mexico", "costa rica", "panama"]
  },
  {
    id: "costa rica", name: "Costa Rica", code: "CR", region: "Central America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Wet green roadsides with deep concrete drainage channels, barbed wire strung on living tree posts, and frequent one-lane bridges." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Spanish signage in a consistently lush, well-maintained setting; ICE utility poles and coffee plantations recur." },
    plates: { bg: "#ffffff", band: null, notes: "American-sized white plate with black text and the country name printed on it." },
    language: { script: "Latin", notes: "Spanish — Costa Rican signage is noticeably tidier and more standardised than its neighbours'." },
    keyTip: "Very green, very tidy Spanish-speaking Central America with one-lane bridge signs is Costa Rica rather than Guatemala or Panama.",
    confusedWith: ["panama", "guatemala", "colombia", "mexico"]
  },
  {
    id: "panama", name: "Panama", code: "PA", region: "Central America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Tropical roadside with the Panama City skyline visible from surprisingly far, and the canal corridor cutting the country in half." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Spanish signage; 'diablo rojo' painted buses and a big-city skyline unlike anything else in Central America." },
    plates: { bg: "#ffffff", band: null, notes: "Rear plate only — front plates are not required, so a car with a bare front bumper is a Panama hint." },
    language: { script: "Latin", notes: "Spanish, with English common around the canal and the former Zone." },
    keyTip: "Missing front plates plus a high-rise skyline in Central America is Panama.",
    confusedWith: ["costa rica", "colombia", "guatemala", "dominican republic"]
  },
  {
    id: "dominican republic", name: "Dominican Republic", code: "DO", region: "Caribbean", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Coverage is limited to Santo Domingo and Santiago; expect dense city streets, overhead cable tangles and motoconcho mopeds." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Spanish signage in a Caribbean setting, with colmado corner shops and heavy moped traffic." },
    plates: { bg: "#ffffff", band: null, notes: "American-sized plate whose background colour and leading letter change with the vehicle class." },
    language: { script: "Latin", notes: "Spanish — Caribbean Spanish, with Haitian Creole near the border." },
    keyTip: "Spanish-speaking Caribbean city with motoconchos and no American route shields: the Dominican Republic, not Puerto Rico.",
    confusedWith: ["puerto rico", "curacao", "panama"]
  },
  {
    id: "puerto rico", name: "Puerto Rico", code: "PR", region: "Caribbean", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "American road furniture — the same guardrails, signal masts and route shields as the mainland US — in a tropical setting." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "US-standard signs written in Spanish, and distance in kilometres while speed is in miles per hour." },
    plates: { bg: "#ffffff", band: null, notes: "US-sized plate reading Puerto Rico; only a rear plate is required." },
    language: { script: "Latin", notes: "Spanish, with English on official and commercial signage." },
    keyTip: "American traffic hardware with Spanish text on it is Puerto Rico; kilometres on the signs with mph limits seals it.",
    confusedWith: ["dominican republic", "usa", "united states virgin islands", "curacao"]
  },
  {
    id: "united states virgin islands", name: "United States Virgin Islands", code: "VI", region: "Caribbean", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Steep narrow island roads with American guardrails and utility poles, and left-hand traffic on them." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "American signage in English, including US route markers, with 'KEEP LEFT' reminders for visitors." },
    plates: { bg: "#ffffff", band: null, notes: "US-sized plates reading U.S. Virgin Islands, on left-hand-drive American cars." },
    language: { script: "Latin", notes: "English, in American spelling on official signage, with Caribbean place names like Charlotte Amalie and Frederiksted left over from Danish rule." },
    keyTip: "American plates and signage but traffic on the left — that contradiction only resolves to the US Virgin Islands.",
    confusedWith: ["puerto rico", "bermuda", "usa"]
  },
  {
    id: "curacao", name: "Curaçao", code: "CW", region: "Caribbean", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Arid Caribbean scrub — cactus and divi-divi trees bent by the trade wind — with Dutch-standard road markings." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Dutch-language signage and brightly coloured Dutch colonial gabled buildings in Willemstad." },
    plates: { bg: "#ffffff", band: null, notes: "American-sized plate reading Curaçao, usually with a year sticker." },
    language: { script: "Latin", notes: "Dutch and Papiamentu — Papiamentu looks like phonetically spelled Portuguese-Spanish (Bon Bini, Kaya)." },
    keyTip: "Dutch words on signs in dry cactus scrub by a turquoise sea is Curaçao — the Netherlands itself is never this arid.",
    confusedWith: ["netherlands", "dominican republic", "puerto rico"]
  },
  {
    id: "bermuda", name: "Bermuda", code: "BM", region: "North America", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Very narrow walled lanes with limestone walls, oleander hedges and no shoulder at all." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "British-pattern signage in English; every roof is white stepped limestone, built to catch rainwater." },
    plates: { bg: "#ffffff", band: null, notes: "Five black digits on plain white, front and rear — no letters at all on private cars." },
    language: { script: "Latin", notes: "English, with British spellings and parish names (Paget, Warwick, Devonshire) on the signs." },
    keyTip: "White stepped limestone roofs on pastel houses, left-hand traffic and all-numeric plates: Bermuda.",
    confusedWith: ["uk", "united states virgin islands", "usa"]
  },
  {
    id: "greenland", name: "Greenland", code: "GL", region: "North America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "No road connects any two towns — coverage is short networks inside settlements, ending abruptly at the rock." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Danish-style signage in Greenlandic and Danish, with brightly painted wooden houses on bare rock." },
    plates: { bg: "#ffffff", band: null, notes: "Danish-style plates, often on pickups; the vehicle fleet is small and heavily weathered." },
    language: { script: "Latin", notes: "Kalaallisut — extremely long agglutinated words (Kalaallit Nunaat, Nuussuaq) beside Danish." },
    keyTip: "Colourful wooden houses on bare rock with no trees and very long Greenlandic words: Greenland, not Iceland or the Faroes.",
    confusedWith: ["iceland", "faroe islands", "svalbard"]
  },
  {
    id: "chile", name: "Chile", code: "CL", region: "South America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "White posts with red reflectors on Ruta 5; the country's extreme north-south range means desert, vineyard and rainforest all appear." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Green highway signs in Spanish, Copec petrol stations, and the Andes as a wall on the eastern horizon." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "White plate with black characters and a small blue strip; the current format is four letters then two digits." },
    language: { script: "Latin", notes: "Spanish, with Mapuche place names in the south (Temuco, Pucón, Villarrica)." },
    keyTip: "Copec stations and a north-south highway squeezed between the Andes and the Pacific is Chile rather than Argentina.",
    confusedWith: ["argentina", "peru", "bolivia", "uruguay"]
  },
  {
    id: "colombia", name: "Colombia", code: "CO", region: "South America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Green mountainous roads with frequent motorcycle traffic and roadside fruit stalls; concrete drainage channels are common." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Spanish signage; commercial vehicles carry their plate number painted on the side as well as on the plate." },
    plates: { bg: "#fadb2c", band: null, notes: "Yellow plate with black text for private vehicles — the clearest single tell in South America." },
    language: { script: "Latin", notes: "Spanish, with indigenous and Caribbean place names (Bogotá, Cundinamarca, Barranquilla) and no Portuguese anywhere." },
    keyTip: "Yellow number plates are Colombia. Nothing else in South America uses them as standard.",
    confusedWith: ["ecuador", "peru", "panama", "costa rica"]
  },
  {
    id: "peru", name: "Peru", code: "PE", region: "South America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Desert coast, then switchback Andean roads with dust and rock; adobe and unfinished brick buildings line the road." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Spanish signage, mototaxis in every small town, and political slogans painted directly onto house walls." },
    plates: { bg: "#ffffff", band: null, notes: "American-sized white plate with black text; taxis carry the number as a large decal on the doors as well." },
    language: { script: "Latin", notes: "Spanish, with Quechua place names (Ollantaytambo, Huancayo) in the highlands." },
    keyTip: "Bare desert coast or dusty Andean switchbacks with mototaxis and painted wall slogans is Peru.",
    confusedWith: ["bolivia", "ecuador", "chile", "colombia"]
  },
  {
    id: "ecuador", name: "Ecuador", code: "EC", region: "South America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "Steep green Andean valleys with well-surfaced roads; the highway network is noticeably better kept than Peru's." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Spanish signage with the province name on many boards, and volcanic cones on the skyline." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with black text and the province name printed across the top." },
    language: { script: "Latin", notes: "Spanish, with Kichwa place names in the sierra." },
    keyTip: "Province name printed on the plate, with lush Andean terrain and good tarmac, points to Ecuador over Peru.",
    confusedWith: ["peru", "colombia"]
  },
  {
    id: "bolivia", name: "Bolivia", code: "BO", region: "South America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "High altiplano with adobe walls and brick buildings left unrendered; dust, llamas and very wide horizons." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "Spanish signage, minibuses in La Paz and El Alto, and cholita dress visible on the street." },
    plates: { bg: "#ffffff", band: null, notes: "White plate with blue characters in a boxed layout — the blue text separates it from its neighbours' black." },
    language: { script: "Latin", notes: "Spanish, with Aymara and Quechua names common on the altiplano." },
    keyTip: "Treeless high altiplano with unrendered red-brick buildings and blue-lettered plates is Bolivia.",
    confusedWith: ["peru", "chile", "argentina"]
  },
  {
    id: "uruguay", name: "Uruguay", code: "UY", region: "South America", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "flat", notes: "Flat to gently rolling grassland with wire fencing and eucalyptus windbreaks; roads are quiet and straight." },
    signs: { bg: "#3b6ea8", accent: "#ffffff", notes: "Spanish signage and ANCAP petrol stations, which are state-run and unique to Uruguay." },
    plates: { bg: "#ffffff", band: "#3b6ea8", notes: "Mercosur-style plate with a blue banner across the top; departmental colours appeared on older issues." },
    language: { script: "Latin", notes: "Spanish, in a Rioplatense accent shared with Argentina; place names are often Guaraní." },
    keyTip: "ANCAP stations are Uruguay-only, and settle it against Argentina's very similar pampas.",
    confusedWith: ["argentina", "brazil", "chile"]
  },
  {
    id: "guam", name: "Guam", code: "GU", region: "Oceania", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "American road furniture — the same signal masts, guardrails and strip-mall parking lots — under tropical vegetation." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "US-standard signage in English, with Chamorro place names (Hagåtña, Tamuning, Yigo) and heavy US military presence." },
    plates: { bg: "#ffffff", band: null, notes: "US-sized plate reading Guam USA, usually with a latte stone or island graphic." },
    language: { script: "Latin", notes: "English and Chamorro — Chamorro uses å and doubles vowels in place names." },
    keyTip: "American strip-mall streetscape with Chamorro place names in the tropical Pacific is Guam.",
    confusedWith: ["northern mariana islands", "american samoa", "usa"]
  },
  {
    id: "northern mariana islands", name: "Northern Mariana Islands", code: "MP", region: "Oceania", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "American furniture again, but on a much smaller and quieter network than Guam's — Saipan, Tinian and Rota only." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "US signage in English with Chamorro and Carolinian names, plus Japanese and Korean tourist signage on Saipan." },
    plates: { bg: "#ffffff", band: null, notes: "US-sized plate reading Northern Mariana Islands, often with a latte stone graphic." },
    language: { script: "Latin", notes: "English, Chamorro and Carolinian." },
    keyTip: "Same American-Pacific look as Guam but far less built up, and the plate says Northern Mariana Islands.",
    confusedWith: ["guam", "american samoa"]
  },
  {
    id: "american samoa", name: "American Samoa", code: "AS", region: "Oceania", driving: "right",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "A single coastal road under steep green volcanic ridges, with the road often metres from the sea." },
    signs: { bg: "#1b8a3b", accent: "#ffffff", notes: "American signage in English, with open-sided fale houses and a large church in every village." },
    plates: { bg: "#ffffff", band: null, notes: "US-sized plate reading American Samoa, frequently with an island graphic." },
    language: { script: "Latin", notes: "Samoan and English — Samoan is vowel-heavy and uses the ʻokina (Pago Pago, Fagatogo)." },
    keyTip: "US road signs, Samoan village names and a church every few hundred metres on a steep green coast: American Samoa. Note it drives on the right, unlike independent Samoa.",
    confusedWith: ["guam", "northern mariana islands", "new zealand", "pitcairn islands"]
  },
  {
    id: "pitcairn islands", name: "Pitcairn Islands", code: "PN", region: "Oceania", driving: "left",
    bollard: { body: "#f5f5f0", cap: null, band: "#c1443c", shape: "sparse", notes: "No sealed road network at all — steep red dirt tracks cut into a volcanic island, travelled by quad bike." },
    signs: { bg: "#ffffff", accent: "#1b1d21", notes: "Hand-painted English signs; the population is a few dozen people, so anything built is small and improvised." },
    plates: { bg: "#ffffff", band: null, notes: "Effectively no plate culture — quad bikes are the vehicle, and there is nothing to read off them." },
    language: { script: "Latin", notes: "English and Pitkern, a Bounty-descended creole." },
    keyTip: "Red dirt quad-bike tracks on a tiny cliff-bound Pacific island with English hand-painted signs is Pitcairn — there is nowhere else it could be.",
    confusedWith: ["american samoa", "new zealand"]
  }
];
