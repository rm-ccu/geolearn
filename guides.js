// GeoLearn guidebook — the reading half of the app.
//
// Two collections, both plain globals like COUNTRIES:
//   COURSE      the beginner course, in the order you should actually read it
//   GUIDE_MAPS  per-map guides for the maps people actually queue into
//
// Lessons are built from typed blocks rather than raw HTML, so a chapter can
// never disagree with data.js: a `swatches` block draws the real bollards from
// the dataset, and a `diff` block runs the same comparison the Compare view does.
// Prose blocks take a tiny inline markup — **bold** and [[country-id]], which
// becomes a chip that opens that country in Browse.
//
// A chapter with no `body` is one that hasn't been written yet; the rail shows
// it greyed so the shape of the course is visible from the first screen.
//
// `minutes` is study time, not reading time: 180 words per minute plus half a
// minute per drill. It is derived from the chapter, so rewrite it when the
// chapter grows rather than guessing.

// How built-up a drop is changes which clues exist at all, so it changes the
// order you reach for them in. The six-step scan never changes; its payouts do.
// A bollard is an interurban object and a shopfront is an urban one, and a
// player who runs the same priority list in a city and on a forest road is
// spending half of every round looking at nothing.
//
// `guide` points each cue at the chapter that teaches it, so the block renders
// a link rather than restating the lesson. A cue with `guide: null` is one the
// book has no chapter for yet — architecture, mainly.
const DENSITY_TIERS = [
  {
    id: "urban",
    name: "Urban",
    kicker: "City and town centre",
    tell: "Continuous building frontage, kerbs and pavements, pedestrians, traffic lights, cars parked along both kerbs. No verge, and no horizon.",
    first: [
      { guide: "script", text: "**Read something.** Text is free here — a shopfront, a van door, a menu board, a poster. Script first, then diacritics. A city round should be answered on words before anything else is touched." },
      { guide: "domains", text: "**Domains and phone numbers.** Advertising is dense in a centre and nearly absent outside one. A `.pl` on an awning or a leading `+3` on a shopfront ends the round outright." },
      { guide: "plates", text: "**Parked plates.** Both kerbs are lined with stationary cars at reading distance, which is the easiest plate work in the game." },
      { guide: "signs", text: "**Street-name signs.** The name plate itself is a national design — enamel or pressed metal, wall-mounted or on a pole, and a colour that barely varies inside a country." },
      { guide: null, text: "**Architecture and street furniture.** Roof pitch, balconies, shutters, facade wiring, pavement tiling, bins and bike racks. Slower to learn than a bollard, but always present." },
    ],
    fading: [
      "**Bollards** — there is no verge to put them on, and the posts in a pedestrian zone are municipal furniture, not the national road design.",
      "**Poles and overhead wire** — buried, or hidden behind the buildings.",
      "**Sun, soil and vegetation** — the sky is cropped, the ground is paved and the plants were planted.",
    ],
    move: "Head for the largest junction, a bus stop or a petrol station. Signage concentrates where traffic has to make decisions.",
  },
  {
    id: "suburban",
    name: "Suburban",
    kicker: "Housing, estates and shop parades",
    tell: "Detached or terraced houses with driveways and garden walls, a verge that comes and goes, pavement on one side, a parade of shops every few hundred metres, and very little traffic.",
    first: [
      { guide: "signs", text: "**Signs at the estate mouth.** Residential warning signs and the direction sign where the estate meets the through road carry the full national typeface and colours." },
      { guide: "poles", text: "**Poles come back.** Distribution poles reappear the moment the buildings stop touching — wood or concrete, and the transformer and insulator style with them." },
      { guide: "road-markings", text: "**Kerb and parking paint.** Restriction paint, edge lines and the centre line survive out here where the shopfronts do not." },
      { guide: "plates", text: "**Driveways.** Every drive is a stationary car with both plates readable from the road at your leisure." },
      { guide: null, text: "**House-scale architecture.** Roof material, fencing, letterboxes, meter boxes, house numbering, garden hedging. Suburbs are more nationally uniform than city centres are." },
    ],
    fading: [
      "**Domains and phone codes** — advertising needs an audience, and it thins out within a street of the shop parade.",
      "**Bollards** — on the through road, yes; on the estate streets, almost never.",
    ],
    move: "Drive toward the arterial road the estate hangs off. A suburb is always attached to something bigger, and the junction with it is signposted.",
  },
  {
    id: "rural",
    name: "Rural",
    kicker: "Open road, field and forest",
    tell: "Verge, crop or trees to both sides, no pavement, buildings sparse or absent, and the horizon visible.",
    first: [
      { guide: "the-car", text: "**The car.** Out here it is often the only man-made object with a nationality. Blur shape, snorkel, camera generation." },
      { guide: "bollards", text: "**Bollards.** This is the bollard's home ground — Europe's interurban roads are lined with them, and one post is frequently the entire answer." },
      { guide: "road-markings", text: "**Paint and guardrail.** Centre-line colour, dash length, edge lines and the guardrail's post shape all run continuously along an empty road." },
      { guide: "poles", text: "**Poles.** The one object present in almost every rural drop that is not the road itself." },
      { guide: "sun-and-soil", text: "**Sun, soil and vegetation.** A full sky and bare ground make this the only setting where the climate clues are at full strength." },
    ],
    fading: [
      "**Script and language** — a rural round can run a kilometre without a readable word.",
      "**Domains and phone codes** — nobody is advertising to an empty field.",
      "**Plates** — traffic is thin, and what passes you is moving fast.",
    ],
    move: "Follow the road to the nearest junction or bridge. A rural round's only text is usually one direction sign several hundred metres away — and it is worth the drive.",
  },
];

const COURSE = [
  {
    id: "how-to-look",
    title: "How to look",
    goal: "Stop guessing in the first two seconds. Learn the scan that finds clues in a fixed order.",
    minutes: 2,
    body: [
      { t: "p", text: "Most bad guesses are not knowledge failures. They are **looking** failures — the player saw a green field, felt a hunch, and clicked before the round had given up anything. The fix is a fixed scan you run every single round, in the same order, whether the drop looks obvious or not." },
      { t: "p", text: "The order matters because it front-loads the clues that eliminate the most world per second. Driving side alone cuts the planet roughly in half. Script cuts it again. By the time you are squinting at a bollard you should already be choosing between four or five countries, not two hundred." },

      { t: "steps", label: "The scan", items: [
        "**Look down.** The car is under you in every round. Its blur, snorkel, antenna and colour are a clue that no landscape can hide.",
        "**Look at the road.** Which side are the cars on? What colour is the centre line, and how long are the dashes?",
        "**Look at the roadside.** Bollards, poles, guardrails, kerb paint — the furniture is more consistent than the scenery.",
        "**Read something.** Any text at all: a sign, a shopfront, a van door. Script first, then language, then the domain suffix.",
        "**Look up.** Sun position gives you a hemisphere. Sky and haze give you a climate.",
        "**Then move.** Only once the scan is dry is it worth driving to find a sign."
      ]},

      { t: "callout", tone: "tip", label: "The discipline", text: "Run all six steps before you place a pin, even when step one already told you the answer. The round where you are certain after two seconds is exactly the round that is about to punish you — [[albania]] looks like [[italy]] until you read a word." },

      { t: "p", text: "One thing the scan does not tell you is which of its steps will actually pay out, and that is decided by where you landed rather than by the order: a city has no bollards and a forest road has nothing to read. {{density|Urban, suburban, rural}} is the chapter that re-ranks the scan for each of those three settings — read the clue chapters first, then that one." },

      { t: "p", text: "The rest of this course is one chapter per step, and each chapter ends with drills. Work through them in order; the later chapters assume you can already do the earlier ones without thinking." }
    ]
  },

  {
    id: "driving-side",
    title: "Driving side",
    goal: "Cut the world in half in the first second, even when the road is empty.",
    minutes: 5,
    body: [
      { t: "p", text: "Nothing else you can see eliminates as much of the planet this fast. Of the 121 places a standard game can drop you, **33 drive on the left** — the British Isles, southern and eastern Africa, South Asia, most of South East Asia, Japan, Australasia, and a short list of islands. Everywhere else drives on the right." },
      { t: "p", text: "That is not a fifty-fifty split, and the asymmetry is useful in itself: left-hand traffic is the rarer, more informative answer. Seeing it immediately puts you in one of a handful of clusters, and those clusters barely overlap in language or climate." },

      { t: "steps", label: "Reading the side when no car is moving", items: [
        "**Parked cars.** Which kerb are they against, and which way are they facing? A row of cars nose-in on the left of the road is left-hand traffic.",
        "**The oncoming car.** Even through the blur, the driver's head sits on the side of the cabin the country drives on.",
        "**Stop lines and give-way triangles.** They sit on the approach side of a junction, which tells you which lane is which.",
        "**Slip roads and lay-bys.** Which side does traffic peel off to, and which side are bus stops built on?",
        "**Arrows and keep-left signs** on traffic islands point the way traffic is meant to pass.",
        "**The Google car's own lane.** On a divided road, the car is on the correct carriageway — look at where the median sits relative to you."
      ]},

      { t: "callout", tone: "warn", label: "The trap", text: "A single parked car facing the wrong way proves nothing — people park badly everywhere. Wait for a **pattern**: a row of cars, a junction, or moving traffic. And remember that left-hand-drive vehicles are common in some right-hand-traffic countries and vice versa, so the car's steering wheel is weaker evidence than the road itself." },

      { t: "p", text: "Once you know the side, the rest of the scan gets much cheaper. Left-hand traffic plus Latin script and English signage is a small family: [[uk]], [[ireland]], [[australia]], [[new zealand]], [[south africa]], [[kenya]], [[uganda]], [[botswana]], [[namibia]]. Left-hand traffic with a non-Latin script is smaller still." },

      { t: "drills", items: [
        { q: "Cars parked along the left kerb, English signage, green shopfronts advertising M-Pesa, red soil at the roadside.", a: "kenya", why: "Left-hand traffic plus English narrows it to the East African group; the green M-Pesa branding is the Kenyan giveaway over Uganda's yellow MTN paint." },
        { q: "Left-hand traffic in Europe, distances posted in kilometres, place names written twice in two languages.", a: "ireland", why: "The UK is the other left-hand-drive country here, but it posts distances in miles. Kilometres plus bilingual Irish and English is Ireland." },
        { q: "Right-hand traffic. The shop signs are in a blocky script made of circles and straight lines that is not Chinese or Japanese.", a: "south korea", why: "Hangul settles the script, and driving on the right separates Korea from Japan, which drives on the left." }
      ]}
    ]
  },
  {
    id: "the-car",
    title: "The Google car",
    goal: "Read the camera rig, blur and snorkel to separate whole regions of coverage.",
    minutes: 5,
    body: [
      { t: "p", text: "The car is the one thing present in every single round. A landscape can be featureless, a road can be empty, a village can have no signage at all — but the vehicle carrying the camera is always underneath you, and it varies by country in ways that are easy to see once you know to look." },
      { t: "p", text: "Pan straight down at the start of every round. It costs a second and it is the most reliable habit in the game." },

      { t: "steps", label: "What to read on the car", items: [
        "**Blur shape.** How much of the car is masked, and what silhouette does the mask make? Wide flat blur, narrow blur, blur with a bulge on one side.",
        "**Snorkel or antenna.** A long dark rod rising from the rear is common across sub-Saharan coverage and rare elsewhere.",
        "**Roof rack and mirrors.** Some fleets show a rack or a mirror stub poking into frame.",
        "**Colour.** White, black and silver cars are all in service in different places; the colour peeking past the blur is a real clue.",
        "**Camera generation.** Sharp, high-resolution, well-stitched imagery is recent. Soft, washed-out imagery with visible seams is an older generation and points at countries that have not been re-driven.",
        "**What it is mounted on at all.** A trekker backpack, a tuk-tuk, a snowmobile or a boat instead of a car narrows things enormously."
      ]},

      { t: "callout", tone: "warn", label: "Treat the car as supporting evidence", text: "Car metas are the fastest-moving clue in the game — Google re-drives countries and the rig changes with them. Use the car to confirm a guess you already have from the road, the script and the signage; do not hang the whole round on it." },

      { t: "p", text: "The most useful case is the one where the car alone is not enough. Several East and West African countries share near-identical rigs, so the vehicle gets you to the region and something else has to finish the job — usually shopfront branding or the plate format." },

      { t: "diff", a: "kenya", b: "uganda", rows: ["plates", "signs"],
        note: "The same region, the same left-hand traffic, English on every sign — and the car will not separate them. The plate prefix and the colour the telecoms have painted the shops will." },

      { t: "p", text: "The same logic runs across West Africa: [[ghana]] and [[nigeria]] both drive on the right with English signage, and it is the plate that splits them — Ghana puts the registration year on the end, Nigeria uses an American-sized plate with blue text and the state name across the top. [[senegal]] next door is French-speaking, which ends the question immediately." },

      { t: "drills", items: [
        { q: "Left-hand traffic, English signage, boda-boda motorcycle taxis everywhere, and the trading-centre shopfronts are painted bright yellow with MTN branding.", a: "uganda", why: "Yellow MTN paint over Kenya's green M-Pesa, on left-hand traffic with English signage. The plate prefix UA confirms it." },
        { q: "Right-hand traffic in dry scrub with baobabs, and every sign is in French — Route, Avenue, Quartier.", a: "senegal", why: "French-language signage rules out anglophone Ghana and Nigeria; the Sahel vegetation places it." },
        { q: "American-sized white plate with blue text, a state name across the top, right-hand traffic, green-and-white English signage.", a: "nigeria", why: "The American plate shape with blue text and a state name is Nigeria's alone in the region." }
      ]}
    ]
  },
  {
    id: "script",
    title: "Script and language",
    goal: "Go from alphabet to country in one glance, then split the Latin countries on diacritics alone.",
    minutes: 5,
    body: [
      { t: "p", text: "Text is the highest-value clue in the game, and you do not need to read it. You need to recognise the **shapes**. A script family usually collapses the answer to one country or a very short list, and unlike a bollard it appears in cities, villages and highways alike." },

      { t: "steps", label: "One-glance scripts", items: [
        "**Kanji and kana** — [[japan]], and only Japan.",
        "**Hangul**, all circles and boxes — [[south korea]].",
        "**Traditional Chinese** — [[taiwan]], [[hong kong]] or [[macau]]. Driving side splits them: Taiwan drives on the right, the other two on the left. Portuguese street names mean Macau.",
        "**Thai, Lao, Khmer, Burmese** — curling South East Asian scripts, one country each. Lao looks like a rounder, simpler Thai.",
        "**Devanagari** — [[india]] or [[nepal]]. Red plates mean Nepal.",
        "**Sinhala's** round bubbles — [[sri lanka]]. **Bengali** — [[bangladesh]]. **Tibetan** — [[bhutan]].",
        "**Georgian**, **Armenian**, **Greek**, **Amharic** — each essentially one country.",
        "**Arabic** — a large family, so fall through to plates, terrain and which Gulf state you are in."
      ]},

      { t: "callout", tone: "tip", label: "Two script tricks worth memorising", text: "Greek script appears in exactly two drivable places: [[greece]] and [[cyprus]] — and Cyprus drives on the left. Cyrillic appears in about eight, and Ukrainian is the one with **і** and **ї**, letters Russian does not use." },

      { t: "p", text: "Cyrillic is the other big family. [[russia]], [[ukraine]], [[belarus]], [[bulgaria]], [[north macedonia]], [[kazakhstan]], [[mongolia]] and [[kyrgyzstan]] all use it, and [[serbia]], [[bosnia]] and [[montenegro]] mix it with Latin on the same signs. Split them on the extra letters, on the plate, and on how worn the infrastructure looks." },

      { t: "p", text: "Most of the world writes in Latin, so the real work is one level down: **diacritics**. These are not decoration, they are a fingerprint, and a single word on a shopfront is usually enough." },

      { t: "steps", label: "Latin fingerprints", items: [
        "**ł ż ą ę** — [[poland]]. **ř ě ů** — [[czechia]]. **ľ ô ŕ** — [[slovakia]].",
        "**ő ű** — [[hungary]]. **ș ț ă** — [[romania]]. **ë** — [[albania]].",
        "**ı ğ ş** (a dotless i) — [[turkey]]. Stacked, doubled accents — [[vietnam]].",
        "**æ ø å** — [[denmark]] or [[norway]]. **ä ö å** — [[sweden]] or [[finland]]; long doubled vowels mean Finnish.",
        "**õ** — [[estonia]]. **ā ē ī** macrons — [[latvia]]. **ų ė į** — [[lithuania]]. **þ ð** — [[iceland]].",
        "**ñ** — Spanish. **ã õ ç** — Portuguese. **ħ ġ ż** — [[malta]].",
        "**č ć đ š ž** — Croatian or Serbian Latin; **č š ž with no ć or đ** — [[slovenia]]."
      ]},

      { t: "callout", tone: "warn", label: "Language is not country", text: "Spanish, French, Portuguese, English and Arabic each span continents. When the language is a world language, it tells you the colonial history and nothing more — go back to the road, the plates and the vegetation. [[brazil]] and [[portugal]] share a language; red soil and tropical growth are what actually separate them." },

      { t: "drills", items: [
        { q: "Cyrillic signage, and the town name contains the letters і and ї.", a: "ukraine", why: "Those two letters exist in Ukrainian and not in Russian — the cleanest split in the Cyrillic family." },
        { q: "Greek lettering on a road sign, and the traffic is driving on the left.", a: "cyprus", why: "Greek narrows it to two countries, and Greece drives on the right." },
        { q: "Traditional Chinese characters on a shopfront, with a street name written underneath in Portuguese.", a: "macau", why: "Portuguese alongside Chinese is Macau's signature — Hong Kong pairs Chinese with English and Taiwan with neither." }
      ]}
    ]
  },

  {
    id: "bollards",
    title: "Bollards",
    goal: "Name a European country from a single roadside post, and know which pairs the post cannot split.",
    minutes: 5,
    body: [
      { t: "p", text: "A bollard is the reflective post at the edge of the road. Europe is the only place that uses them densely and consistently enough to be diagnostic, and within Europe they are the single fastest tell there is — most countries have exactly one national design, applied everywhere, for decades." },
      { t: "p", text: "Read three things in this order: the **silhouette** (flat, rounded, domed, wedge), the **cap** (dark top section, or none), and the **band** (the reflector's colour and how far it wraps)." },

      { t: "swatches", kind: "bollard", ids: ["germany", "austria", "france", "switzerland", "italy", "czechia"],
        caption: "Six silhouettes that cover most of central Europe. These are drawn from the same data the country pages use." },

      { t: "p", text: "[[germany]] is the baseline: a plain flat white post, no cap. [[austria]] is that same post with a black cap and a dark reflector — the cap is the whole difference, and it is the most valuable single detail in European play. [[france]] rounds the top and caps it red. [[switzerland]] abandons the shape entirely for a red domed post. [[italy]] uses a black wedge with a vertical red stripe. [[czechia]] keeps the German silhouette but makes the reflector fluorescent orange." },

      { t: "callout", tone: "warn", label: "Where the bollard lies to you", text: "Some pairs share a post exactly. Italy and Albania are the classic one — identical wedge, and no amount of staring will split them. When you hit a known pair, stop looking at the post and go read a word." },

      { t: "diff", a: "italy", b: "albania", note: "Same bollard, different everything else. This is the same comparison the Compare tab runs — the bollard row is dim because it cannot help you here." },

      { t: "p", text: "Beyond the classics: [[belgium]], [[netherlands]] and [[luxembourg]] all use a narrow flat post and are genuinely hard to split on the bollard alone. [[denmark]] wraps its reflector all the way around a red post. [[poland]] blacks out the top section. [[sweden]] and [[norway]] barely use posts at all in the southern half — they use tall flexible reflector stakes instead, which is itself a Nordic tell." },

      { t: "drills", label: "Drills", items: [
        { q: "Flat white post, no cap, plain red reflector. Blue direction signs. The shopfront across the road reads 'Bäckerei'.", a: "germany", why: "Flat post with no cap rules out Austria immediately, and German-language signage confirms it over Poland or Czechia." },
        { q: "Flat white post, German silhouette — but the reflector is fluorescent orange, much brighter than anything the neighbours use.", a: "czechia", why: "The orange band on an otherwise German-looking post is near-unique to Czechia." },
        { q: "Black wedge post with a vertical red stripe on the face. The pharmacy sign reads 'Farmaci'.", a: "albania", why: "The wedge says Italy or Albania. 'Farmaci' is not Italian — Italian would be 'Farmacia' — so it is Albania." }
      ]}
    ]
  },

  {
    id: "road-markings",
    title: "Road markings",
    goal: "Use centre-line colour, dash length and kerb paint when the roadside offers nothing else.",
    minutes: 5,
    body: [
      { t: "p", text: "Paint is the clue that survives an empty landscape. There is no signage on a rural road, no bollard on a dirt track and no pole in a desert, but if there is a road at all there is often a line down the middle of it — and that line is a national standard." },

      { t: "steps", label: "Read the paint in this order", items: [
        "**Centre-line colour.** Yellow centre lines are the Americas, plus a handful of others. White is most of Europe, Africa and Asia.",
        "**Dash length and gap.** Long dashes with short gaps look nothing like short dashes with long gaps, and countries are consistent about it.",
        "**Edge lines.** Present or absent, white or yellow, solid or broken.",
        "**Kerb and kerbstone paint.** Black-and-white, black-and-yellow, red-and-white — each is a regional habit.",
        "**Condition.** Crisp thermoplastic with reflective beads is a wealthy road authority; faded hand-painted lines are not."
      ]},

      { t: "callout", tone: "tip", label: "The Nordic split", text: "[[norway]] paints its centre lines **yellow**; [[sweden]] paints them **white**. Two countries that share a climate, a script family and a general look, separated by the colour of one line." },

      { t: "p", text: "[[france]] is the other classic: unusually **long white dashes** down the centre of rural roads, a proportion almost nowhere else uses. Once you have seen it a few times it reads instantly, and it works on roads with no signs, no bollards and no buildings." },

      { t: "p", text: "Kerb paint is regional and underused. [[india]] paints kerbs and tree trunks in **black and yellow** bands along most main roads. [[malaysia]] marks bends with black-and-yellow chevrons. Much of the Balkans and the former Soviet bloc paints kerbstones black and white." },

      { t: "callout", tone: "warn", label: "Paint is a habit, not a law", text: "Road markings vary within countries — a motorway and a village lane in the same country can look very different, and repainting drifts over time. Use paint to build a case, not to close one." },

      { t: "drills", items: [
        { q: "Right-hand traffic, a yellow line down the centre of the road, Latin script, steep rock walls and a tunnel entrance ahead.", a: "norway", why: "Yellow centre lines plus mountains and tunnels — Sweden would paint that line white and would be much flatter." },
        { q: "Right-hand traffic, blue direction signs, and the centre-line dashes are conspicuously long.", a: "france", why: "The long dash proportion is the France tell, and it holds on rural roads with nothing else to read." },
        { q: "Left-hand traffic, kerbstones and tree trunks painted in black and yellow bands, English above a second script on a green sign.", a: "india", why: "Black-and-yellow kerb painting on left-hand roads with English over an Indic script is India; the specific script then places you within it." }
      ]}
    ]
  },
  {
    id: "plates",
    title: "Licence plates",
    goal: "Call a country from a plate's colour, band and shape, through blur and at distance.",
    minutes: 5,
    body: [
      { t: "p", text: "You can almost never read a plate. That is fine — you are not trying to. Colour, proportion and whether there is a coloured strip down one edge all survive the blur, and those three things are often enough on their own." },

      { t: "swatches", kind: "plate", ids: ["germany", "netherlands", "uk", "malaysia", "brazil", "laos"],
        caption: "Colour does most of the work. White is the default across Europe and much of the world; everything else is a short list." },

      { t: "steps", label: "The colour shortlist", items: [
        "**Yellow** — [[netherlands]], [[luxembourg]], [[cyprus]], [[namibia]], [[colombia]], and the **rear** plates of [[uk]], [[ireland]] and [[botswana]].",
        "**Black with white text** — [[malaysia]], [[singapore]], older [[indonesia]], [[macau]], [[liechtenstein]], [[tunisia]].",
        "**Red** — [[nepal]] private vehicles, and the older red-lettering format still common in [[brazil]].",
        "**Orange** — [[laos]], a combination none of its neighbours use.",
        "**White** — everywhere else, so move on to the band and the shape."
      ]},

      { t: "callout", tone: "tip", label: "Front and rear can differ", text: "[[uk]], [[sri lanka]] and [[botswana]] all run a white front plate and a yellow rear plate. If the colour changes as the car passes you, that pairing is itself the clue." },

      { t: "p", text: "**The band.** A blue strip on the left with a country letter is the EU format — and its absence is just as informative: [[switzerland]] and [[norway]] sit inside Europe with no band at all. Watch out for lookalikes: [[ukraine]] has a blue strip, but it is a national marker rather than an EU one, and [[russia]] prints a small tricolour on the plate instead." },

      { t: "p", text: "**The shape.** American-proportioned plates — short and tall — are used across North America and the Caribbean, and also by [[nigeria]] and the [[dominican republic]]. European plates are long and narrow. [[japan]] uses a smaller plate again, often with a region name in kanji across the top. Proportion reads at a distance where colour does not." },

      { t: "drills", items: [
        { q: "Bright yellow plates with black text, right-hand traffic, red-brick cycle lanes beside the road.", a: "netherlands", why: "Yellow plates plus dedicated red-brick bike infrastructure is close to a guaranteed Netherlands call." },
        { q: "Black plates with white characters, left-hand traffic, oil palms along the roadside and signs reading Jalan and Kampung.", a: "malaysia", why: "Black plates narrow it to Malaysia, Singapore or Brunei; oil palms and open road rule out wall-to-wall Singapore." },
        { q: "Left-hand traffic, white front plate and yellow rear plate starting with B, flat thorn scrub in every direction.", a: "botswana", why: "The B prefix with the split plate colours on Kalahari scrub is Botswana; Namibia's plates are yellow and start with N." }
      ]}
    ]
  },
  {
    id: "signs",
    title: "Signs and sign backs",
    goal: "Use sign colour, shape and even the back of a sign when the text is unreadable.",
    minutes: 5,
    body: [
      { t: "p", text: "Signage carries two separate clues: what it says, and what it looks like. The second one works at any distance, in any language, and through any amount of compression." },

      { t: "swatches", kind: "sign", ids: ["france", "usa", "germany", "australia", "japan", "poland"],
        caption: "Background colour first. Blue is the European default; green dominates the Americas, East and South Asia and much of Africa; white town signs are a northern European habit." },

      { t: "callout", tone: "tip", label: "The France/Italy inversion", text: "Both use blue and green, and they use them **the opposite way round**. In [[france]], motorways are blue and major non-motorway routes are green. In [[italy]], green is reserved for the autostrada and everything else is blue. Same two colours, opposite meanings — and it settles the round." },

      { t: "p", text: "**Warning-sign shape** splits the world in two. Most of it uses a red-bordered triangle. A smaller group uses a yellow diamond: the United States, Canada, Mexico, [[australia]], [[new zealand]], [[japan]] — and, oddly for Europe, [[ireland]]. A yellow diamond on a European road with left-hand traffic and kilometre distances is Ireland every time." },

      { t: "p", text: "**Town signs** are worth learning individually. [[germany]] uses a plain white board with a black border. [[poland]] uses white with a red border and a small locator map in the corner. [[sri lanka]] stacks three languages — Sinhala, Tamil and English — on one board as a national standard." },

      { t: "callout", tone: "warn", label: "Units are a clue too", text: "Miles mean [[uk]] or the United States. [[puerto rico]] is the strange one: distances in kilometres, speed limits in miles per hour, on American sign hardware with Spanish text. That combination exists nowhere else." },

      { t: "p", text: "When you cannot see a sign's face at all, the **back** still helps: the colour of the reverse, the shape of the post, the number of posts and whether it is bolted to a frame are all regional. So are the chevrons on a bend and the shape of kilometre markers." },

      { t: "drills", items: [
        { q: "Yellow diamond warning sign, left-hand traffic, distances in kilometres, place names given twice.", a: "ireland", why: "Ireland is the only European country combining yellow diamond warning signs with left-hand traffic; kilometres and bilingual text rule out the UK." },
        { q: "Right-hand traffic, a green motorway sign in the distance while local direction signs are blue, and the roadside posts are black wedges with a red stripe.", a: "italy", why: "Green reserved for the motorway with blue elsewhere is the Italian convention, and the wedge bollard matches." },
        { q: "American-standard signs, but the text is Spanish, distances are in kilometres and the speed limit is in miles per hour.", a: "puerto rico", why: "US hardware with Spanish text is Puerto Rico, and the mixed units confirm it over any mainland Spanish-speaking country." }
      ]}
    ]
  },
  {
    id: "poles",
    title: "Poles and utilities",
    goal: "Identify a region from the one object present in almost every rural drop.",
    minutes: 5,
    body: [
      { t: "p", text: "Utility poles are everywhere people are, they are built to a national standard, and they are almost never removed once installed. That makes them one of the most consistent clues available — and one of the least used, because they take a little practice to see." },

      { t: "steps", label: "What varies", items: [
        "**Material.** Wood, concrete, or steel lattice. This alone splits large parts of the world.",
        "**Cross-arm.** How many, how long, made of what, and mounted at what angle.",
        "**Insulators.** Their number, colour and whether they sit on top of the arm or hang below it.",
        "**Top shape.** Flat, pointed, stepped, or a distinctive cap.",
        "**Density and wiring.** A quiet single line versus a street where every pole carries a heavy bundle of cables.",
        "**Transformers.** Barrel transformers strapped to the pole are a strong North American and Latin American habit."
      ]},

      { t: "p", text: "Broadly: **wooden poles** dominate North America, the Nordics, [[australia]], [[new zealand]] and rural [[uk]]. **Concrete poles** dominate Latin America, southern and eastern Europe, South Asia and much of Africa — cheaper where timber is scarce and termites are not." },

      { t: "p", text: "[[japan]] is the extreme case and worth knowing on sight: concrete poles line almost every street, including narrow residential ones, carrying dense bundles of cable and often a transformer high up. A street with no visible text but that much overhead cable is a strong Japan signal." },

      { t: "callout", tone: "warn", label: "A supporting clue, not a closing one", text: "Poles narrow you to a region far more often than to a country, and neighbours frequently share designs. Use them to choose between candidates you already have — or to break a tie when the round has given you nothing else." },

      { t: "drills", items: [
        { q: "A narrow street with no readable text, left-hand traffic, and concrete poles every few metres carrying thick bundles of overhead cable.", a: "japan", why: "That pole density with heavy cable bundles on a narrow street is a Japanese signature, and left-hand traffic fits." },
        { q: "Wooden poles with barrel transformers, right-hand traffic, yellow centre line, wide shoulders.", a: "usa", why: "Wooden poles with barrel transformers plus a yellow centre line is the North American package; the road width and shoulder style fit the US." },
        { q: "Right-hand traffic, dead-flat farmland, poplar windbreaks along the road, Spanish on a blue direction sign.", a: "argentina", why: "Poplar windbreaks on flat pampas with Spanish signage is Argentina rather than Chile, which is pinned against the Andes." }
      ]}
    ]
  },
  {
    id: "domains",
    title: "Domains and phone codes",
    goal: "Turn any passing van, billboard or shopfront into a country code.",
    minutes: 4,
    body: [
      { t: "p", text: "Long before you find a road sign, a country tells you its name on the side of a plumber's van. Web addresses and phone numbers are printed on commercial vehicles, shop awnings, billboards and site hoardings everywhere, and both encode the country directly." },

      { t: "p", text: "A **country-code domain** is the ISO code lowercased — `.de`, `.pl`, `.ch`, `.br`, `.za`. Every country page on this site shows its own suffix next to the flag, so the chip on the card is the thing to look for in the wild. The exceptions are few; the one that matters is that the United Kingdom uses `.uk`, not `.gb`." },

      { t: "p", text: "A **dialling code** does the same job: +49 is Germany, +48 Poland, +33 France, +55 Brazil, +81 Japan. Vans usually print the local form without the country code, but billboards and anything aimed at tourists carry the full international number." },

      { t: "callout", tone: "tip", label: "Where to look", text: "Commercial vehicles, estate-agent boards, construction hoardings, bus-stop advertising and the awnings over small shops. Move up the road toward a parked van rather than away from one — a single door panel can end the round outright." },

      { t: "p", text: "Brand and telecom livery works the same way and is often more visible than any text. Green [[kenya]] shopfronts advertising M-Pesa, yellow MTN paint across [[uganda]], [[ghana]] and [[nigeria]], Copec forecourts down the length of [[chile]], colmado corner shops in the [[dominican republic]] — these are national retail networks, and their colours read from further away than lettering does." },

      { t: "drills", items: [
        { q: "A parked van carries a phone number beginning +48 and a web address ending .pl.", a: "poland", why: "Both point to Poland outright — the domain and the dialling code agree, which is as close to certainty as this game offers." },
        { q: "Right-hand traffic, Spanish signage, a Copec petrol station, and a wall of mountains along the eastern horizon.", a: "chile", why: "Copec is a Chilean network, and the Andes to the east with the sea to the west is Chile's shape." },
        { q: "Left-hand traffic, a shopfitter's van reading .co.uk, distances posted in miles.", a: "uk", why: "The .uk domain plus miles on left-hand traffic; Ireland would use .ie and kilometres." }
      ]}
    ]
  },
  {
    id: "sun-and-soil",
    title: "Sun, soil and vegetation",
    goal: "Pin a hemisphere and a climate band before you read a single word.",
    minutes: 5,
    body: [
      { t: "p", text: "This is the chapter that works when the round gives you nothing man-made at all. Sun, soil and plants are not decoration — they are latitude, hemisphere and climate, and together they can cut the shortlist down before you have found a road sign." },

      { t: "callout", tone: "tip", label: "The hemisphere trick", text: "At midday the sun sits **due south** in the northern hemisphere and **due north** in the southern one. Find the sun or read the shadows, check the compass, and you have just eliminated half the planet — including all the near-misses on the other side of the equator." },

      { t: "p", text: "Sun **height** adds latitude. A sun that stays low and long even at midday means you are far from the equator; a sun almost overhead with short hard shadows means you are near it. Combine that with the hemisphere and you have a band of the globe rather than a guess." },

      { t: "steps", label: "Soil and vegetation shortlist", items: [
        "**Deep red soil** — inland [[brazil]], much of [[kenya]] and West Africa, the Australian interior.",
        "**Oil palms in rows** — [[malaysia]] and [[indonesia]], which then need signage to split.",
        "**Baobabs in dry scrub** — [[senegal]] and the Sahel.",
        "**Birch and pine** — [[sweden]] and the wider Nordic belt.",
        "**Poplar windbreaks on flat farmland** — [[argentina]].",
        "**Eucalyptus** — [[australia]] natively, and planted widely elsewhere, so treat it as a hint rather than proof."
      ]},

      { t: "p", text: "Terrain shape is the same kind of clue at a larger scale: the tunnels and near-vertical walls of [[norway]], the Andes standing as a wall along one horizon in [[chile]], the flat thorn scrub of [[botswana]], the terraced hill roads of [[nepal]]." },

      { t: "callout", tone: "warn", label: "Plants travel", text: "Eucalyptus grows in Portugal, palms grow in California and pines are planted on every continent. Vegetation is excellent for narrowing a region and poor for closing a country — pair it with something built by people before you commit." },

      { t: "drills", items: [
        { q: "The midday sun is to the north, the trees are eucalyptus, traffic is on the left and the warning signs are yellow diamonds.", a: "australia", why: "Sun to the north puts you in the southern hemisphere; left-hand traffic with yellow diamond signs and eucalyptus is Australia." },
        { q: "Dead-flat farmland, rows of poplars planted as windbreaks, Spanish on the signs, right-hand traffic.", a: "argentina", why: "The pampas windbreak pattern with Spanish signage is Argentina — Chile's geography never looks like this." },
        { q: "Deep red soil beside the road, tropical growth, green highway signage, Portuguese text.", a: "brazil", why: "Portuguese plus red soil and tropical vegetation separates Brazil from Portugal, which shares the language and nothing else here." }
      ]}
    ]
  },
  {
    id: "density",
    title: "Urban, suburban, rural",
    goal: "Classify the drop in one second, then reach for the clue family that place actually has.",
    minutes: 6,
    body: [
      { t: "p", text: "Every chapter so far taught one clue family as if all of them were always available. They are not. A bollard is an **interurban object** — it exists to mark the edge of a road running between towns, so a city centre has none. A shopfront is an urban object; an empty forest road has none of those either. The scan from {{how-to-look|the first chapter}} still runs in the same order every round, but which steps pay out is decided before you look at anything: by how built-up the place is." },

      { t: "p", text: "So make that the thing you read first. It costs no time — you cannot help seeing it — and it tells you which four clues are worth spending the round on and which three are not there to be found." },

      { t: "steps", label: "Classifying the drop in one second", items: [
        "**Is there a pavement?** A raised kerb with a footway is the cleanest urban-or-suburban signal there is.",
        "**Can you see the horizon?** If buildings crop the sky, you are urban. If you can see to the edge of the world, you are rural.",
        "**Is there a verge?** Grass or gravel between the asphalt and whatever is beyond it means roadside furniture is possible.",
        "**Do the buildings touch?** Continuous frontage is a centre; gaps with driveways are suburban; isolated farms are rural.",
        "**Is anything advertising at you?** Signage density, not building density, is what decides whether the text clues will pay."
      ]},

      { t: "density", caption: "The same scan, re-ranked three ways. Each cue links to the chapter that teaches it." },

      { t: "callout", tone: "warn", label: "The mismatch is the real cost", text: "A player trained on rural European maps lands in a city and spends fifteen seconds hunting for a post at a roadside that has no roadside. A player trained on urban maps lands on a forest road and keeps panning for a word that is not going to appear. Both are looking hard at the wrong half of the round. The fix is not more study — it is spending the first second on the classification." },

      { t: "p", text: "The **edge of town** is the best drop in the game and worth recognising as its own case: the last shop parade, the town-boundary sign, a bollard on the verge and a plate on a parked car all in one panorama. If the scan is going badly and you have a choice of direction, drive toward the transition rather than deeper into either side of it." },

      { t: "callout", tone: "tip", label: "Density is also a clue in itself", text: "How a country builds is national. Ribbon development along every road is [[belgium]]; sudden dense villages with nothing between them is much of [[france]]. Enormous verges and set-back houses read American or Australian long before you find a route marker. The classification narrows the answer and re-ranks the scan at the same time." },

      { t: "p", text: "This also decides which map rewards which study. The official {{world|World map}} is rural-heavy, so it pays the car, the paint and the poles. The {{urban-world|urban and balanced worlds}} are the opposite, and reward the language chapter far more than the bollard one. Knowing which map you queued into tells you which column below you will be living in." },

      { t: "drills", items: [
        { q: "You land on a two-lane road with a wide grass verge, no pavement, forest to both sides, and a flat white post with a black cap carrying a red reflector.", a: "germany", why: "A rural drop, so the roadside furniture is at full strength and the text clues are probably not coming. The capped flat bollard is Germany — and the trap is Austria, whose post has a dark cap too, so the reflector colour and shape of the cap are what you check." },
        { q: "A dense city street, continuous four-storey frontage, trams, and shopfronts written in Latin script with the letters ł and ż.", a: "poland", why: "Urban, so words come first and the bollard question never arises. The Polish diacritics answer it immediately — this is a round where a second spent looking for roadside furniture is a second wasted." },
        { q: "A narrow residential street with no pavement and no centre line, low walls in front of two-storey houses, concrete poles carrying a stack of small transformers and a mass of cabling, and a boxy white car parked nose-in to a drive.", a: "japan", why: "Suburban, so the live clues are the poles, the street form and the parked cars rather than shopfront text. Dense stacked cabling on slim concrete poles, kerbless streets and a white kei car is the Japanese suburb — the script would confirm it, but you did not need to find any." }
      ]}
    ]
  },
  {
    id: "putting-it-together",
    title: "Putting it together",
    goal: "Run the whole scan as one flow, and beat the trap pairs that survive every individual test.",
    minutes: 7,
    body: [
      { t: "p", text: "You now have every individual tool. This chapter is about the order you use them in, and about what to do when two countries refuse to separate." },

      { t: "steps", label: "The full flow", items: [
        "**How built-up is it?** Urban, suburban or rural — it costs no time and it tells you which of the steps below are worth running. See {{density|the density chapter}}.",
        "**Side of the road.** Half the world gone, and the left-hand half is the small one.",
        "**Any text at all.** Script family first — often the whole answer. Latin means drop to diacritics.",
        "**The car.** Blur, snorkel, camera generation. Region, sometimes country.",
        "**Roadside furniture.** Bollards in Europe, poles everywhere else.",
        "**Paint.** Centre-line colour and dash length, edge lines, kerbs.",
        "**Plates and signs.** Colour, band, shape; sign colour and warning-sign shape.",
        "**Sun, soil and plants.** Hemisphere and climate band as a cross-check on everything above.",
        "**Commit.** If two candidates remain, take the one with more coverage — see below."
      ]},

      { t: "p", text: "The trap pairs are the whole game at a high level. Each one shares its most obvious clue, so the only way through is knowing in advance which clue to skip to." },

      { t: "diff", a: "germany", b: "austria", rows: ["bollard", "plates"],
        note: "The plates are the same and always will be. The black cap on the bollard is the entire difference — this is the highest-value single detail in European play." },

      { t: "diff", a: "chile", b: "argentina", rows: ["signs", "plates"],
        note: "Both Spanish-speaking, both right-hand traffic. Sign colour and the plate band split them, and the geography confirms: Chile is pinned between the Andes and the sea." },

      { t: "diff", a: "russia", b: "ukraine", rows: ["plates", "language"],
        note: "Cyrillic on both. The plate band and the Ukrainian letters і and ї are the fast splits." },

      { t: "p", text: "Two more worth memorising. [[malaysia]] and [[indonesia]] share left-hand traffic, black plates and oil palms — check the sign colour and look for the words Kabupaten or Desa, which are Indonesian only. The [[dominican republic]] and [[puerto rico]] are both Spanish-speaking Caribbean; Puerto Rico has American traffic hardware and route shields, and the Dominican Republic does not." },

      { t: "callout", tone: "tip", label: "The coverage tiebreaker", text: "When you genuinely cannot split two candidates, take the one the game is more likely to drop you in. Of the 217 entries on this site, **96 have no official Street View coverage at all** — a standard game cannot put you there. Torn between Kenya and Tanzania on an official map? Tanzania is photospheres-only. Take Kenya." },

      { t: "callout", tone: "warn", label: "Do not chase certainty", text: "Some rounds will not resolve, and hunting for one more sign costs more points than a confident 90% guess. Run the scan, take the best-supported country, move on. Country accuracy comes from doing the scan every round, not from winning the hard ones." },

      { t: "drills", label: "Final drills", items: [
        { q: "Flat white bollard with a black cap and a dark red reflector, right-hand traffic, blue town-centre information boards, German text.", a: "austria", why: "The black cap is decisive — Germany's post has no cap — and the blue info boards back it up." },
        { q: "Left-hand traffic, black plates, oil palms, and a green sign reading Kabupaten.", a: "indonesia", why: "Black plates and oil palms fit both Malaysia and Indonesia; Kabupaten is Indonesian, and the green sign matches Indonesia over Malaysia's blue." },
        { q: "Cyrillic signage, right-hand traffic, a white plate with no coloured strip but a small tricolour printed on it.", a: "russia", why: "The tricolour on the plate is Russian; Ukraine would show a blue national strip instead." },
        { q: "Left-hand traffic, three languages stacked on one road sign, tropical vegetation, a white front plate.", a: "sri lanka", why: "Sinhala, Tamil and English on one board is Sri Lanka's national standard." },
        { q: "Right-hand traffic, Spanish, Caribbean streetscape, mopeds everywhere, and no American route shields anywhere.", a: "dominican republic", why: "Puerto Rico would show US traffic hardware and route shields; without them, this is the Dominican Republic." }
      ]}
    ]
  },
  {
    id: "self-test",
    title: "Self-test",
    test: true,
    goal: "Fifteen rounds, four candidates each. Score yourself, and find out which chapters still owe you work.",
    body: [
      { t: "p", text: "Every question below is a round described in words: a handful of clues, and four countries that could plausibly produce them. The wrong answers are drawn from each country's own confusion list, so none of them are free." },
      { t: "p", text: "Nothing here repeats a drill from the chapters — this is fresh material. Answer all fifteen and the verdict at the end tells you which chapters to go back to." },
      { t: "test" }
    ]
  }
];

// The capstone. Each question names the chapter it comes from, so a wrong answer
// can point at the reading that fixes it rather than just being marked wrong.
// Wrong options are generated from the answer's own `confusedWith` list — see
// testOptions() in guide.js — so the distractors are always genuine traps.
const SELF_TEST = [
  { ch: "driving-side", a: "south africa",
    q: "Left-hand traffic. Blue direction signs carry yellow-bordered route markers, and a shopfront across the road is lettered in Afrikaans as well as English.",
    why: "Botswana and Namibia both borrow South African signage, but not the language. Afrikaans beside English on left-hand roads is the reliable confirm." },

  { ch: "bollards", a: "czechia",
    q: "Right-hand traffic, blue direction signs, and a flat white bollard whose reflector band is a startlingly bright fluorescent orange. A town name on a sign contains ř.",
    why: "The orange band on an otherwise German-looking post is near-unique, and ř is a sound and a letter essentially confined to Czech." },

  { ch: "signs", a: "sri lanka",
    q: "Left-hand traffic in tropical greenery. One roadside board carries three scripts stacked on top of each other, and a passing car shows a white plate at the front and a yellow one at the back.",
    why: "Sinhala, Tamil and English on one board is a national standard, and the split plate colours confirm it." },

  { ch: "script", a: "kazakhstan",
    q: "Cyrillic signage, right-hand traffic, and flat treeless steppe running to the horizon in every direction with a dead-straight road through it.",
    why: "Cyrillic narrows it to about eight countries; that much empty steppe with no forest and no relief points at Kazakhstan rather than Russia's wooded regions." },

  { ch: "bollards", a: "france",
    q: "Right-hand traffic. A rounded white bollard with a red cap and a red band wrapping the post, and a parked car whose plate ends in a two-digit department number.",
    why: "The rounded red-capped post is French, and the department number on the end of the plate is a French format detail no neighbour copies." },

  { ch: "plates", a: "singapore",
    q: "Left-hand traffic, black plates with white characters, and unbroken high-rise in every direction with signage in English, Chinese and Tamil.",
    why: "Black plates put you in Malaysia, Singapore or Brunei; wall-to-wall city with four official languages on the signs is Singapore." },

  { ch: "bollards", a: "switzerland",
    q: "Right-hand traffic through steep mountains, German on the signs, red domed bollards at the roadside, and a white plate with no blue band on it.",
    why: "German plus mountains suggests Germany or Austria, but both carry the EU band. No band, and a red domed post, is Switzerland." },

  { ch: "signs", a: "argentina",
    q: "Right-hand traffic, Spanish signage on blue direction signs, dead-flat farmland to the horizon, and a plate with a blue strip across the top.",
    why: "Blue direction signs separate it from Chile's green ones, and the flat farmland rules out the country pinned against the Andes." },

  { ch: "plates", a: "nepal",
    q: "Left-hand traffic on a narrow road cut into a terraced hillside, Devanagari script on the signs, and red plates with white characters.",
    why: "Devanagari means Nepal or India; red private plates are Nepal's, since India's are white or yellow." },

  { ch: "script", a: "laos",
    q: "Right-hand traffic, a round flowing script that reads like a simplified Thai, and orange plates with black characters on the vehicles.",
    why: "The script family places you in South East Asia and the orange plate is a combination none of the neighbours use. Thailand also drives on the left." },

  { ch: "plates", a: "namibia",
    q: "Left-hand traffic, English signage, dry desert scrub in every direction, and yellow plates beginning with N.",
    why: "Botswana's plates start with B and are white at the front; the N prefix on yellow is Namibia." },

  { ch: "domains", a: "belgium",
    q: "Right-hand traffic. A direction sign gives the same town name twice in two languages, and a parked van's door carries a web address ending .be.",
    why: "Bilingual French and Dutch on one sign is Belgium's signature, and the domain settles it outright." },

  { ch: "script", a: "hong kong",
    q: "Left-hand traffic, Traditional Chinese characters with English beneath them, and dense high-rise towers on steep ground. No Portuguese anywhere.",
    why: "Traditional Chinese with left-hand traffic means Hong Kong or Macau; Macau pairs Chinese with Portuguese, not English." },

  { ch: "signs", a: "poland",
    q: "Right-hand traffic. The village sign is white with a red border and a small locator map in the corner, and the name on it contains ł and ż.",
    why: "The red-bordered village sign with its locator map is Polish, and those two letters confirm it over Czech or Slovak." },

  // Ireland is the trap worth setting here: it matches every clue except the one
  // that matters. New Zealand's own confusion list is Pitcairn and American Samoa,
  // which nobody would pick, so this question names its candidates.
  { ch: "poles", a: "new zealand", options: ["australia", "ireland", "south africa"],
    q: "Left-hand traffic, yellow diamond warning signs, wooden poles along the road, damp temperate forest rather than dry scrub — and the midday sun sitting due north.",
    why: "Ireland matches the signs, the traffic and the greenery, but the sun to the north puts you in the southern hemisphere. That leaves Australia or New Zealand, and the wet temperate forest is New Zealand." },
];


// Map guides. Composition is described qualitatively and dated on purpose —
// community maps are re-cut constantly, and a hard location count in here would
// be wrong within a month.
const GUIDE_MAPS = [
  { id: "world", name: "World", flavour: "Official", url: "https://www.geoguessr.com/maps/world",
    blurb: "The default map, and the one every other map is a reaction to.",
    body: [
      { t: "p", text: "The official World map draws from everything Google has driven, which means its shape is not a design decision — it is a **map of where the Street View car has been**. That single fact explains almost everything about how it plays." },

      { t: "p", text: "Of the 217 entries in this guide, **121 can appear here and 96 cannot**, because the other 96 have no official coverage at all. Egypt, China, Pakistan, Cuba, Tanzania and every small Pacific and Caribbean state are simply not in the deck. That is the most useful thing you can know about this map, and it is worth internalising before any clue work: a country you cannot be dropped in is never the answer." },

      { t: "callout", tone: "tip", label: "Use the coverage filter in your head", text: "Torn between two candidates? Check whether one of them is photospheres-only. On this map that ends the argument immediately. The globe in Browse shades the two coverage types differently for exactly this reason." },

      { t: "p", text: "**Where the drops cluster.** Coverage follows roads and roads follow people, so the United States, Russia, Brazil, Japan, Australia and western Europe carry far more of the map than their share of the world's land. As of August 2026 that weighting has been stable for years. The practical consequence is that a handful of countries repay study enormously — and that the United States needs a level of detail no other country does, which is why it has {{united-states|a guide of its own}}." },

      { t: "p", text: "**Roadside nothing is normal.** A large share of official coverage is empty rural road: no signs, no buildings, no people. This map rewards the clues that survive that — the car, the paint, the poles, the vegetation and the sun — far more than the ones that need a town." },

      { t: "density", only: ["rural"], caption: "The column this map lives in. The full three-way ranking is in {{density|Urban, suburban, rural}}." },

      { t: "steps", label: "How to play it", items: [
        "**Run the full scan before moving.** Most rounds have more information in the first panorama than players use.",
        "**Move along the road, not away from it.** Junctions, bus stops and bridges concentrate signage.",
        "**Learn the big six first.** The US, Russia, Brazil, Japan, Australia and France repay study out of all proportion.",
        "**Accept the region.** On a big empty drop, a confident country and a rough region beats a slow guess at the town."
      ]}
    ]
  },
  { id: "a-community-world", name: "A Community World", flavour: "Community", url: "https://www.geoguessr.com/maps/62a44b22040f04bd36e8a914",
    blurb: "The handpicked world map competitive play has settled on.",
    body: [
      { t: "p", text: "A Community World is a world map of over 100,000 handpicked locations, assembled by more than a hundred experienced players and map makers. It is the map most people mean when they say they are practising, and the one competitive play has largely settled on." },

      { t: "p", text: "The difference from the official World map is **curation**. Locations were chosen rather than sampled, which pulls the map toward drops that are actually solvable: more villages and towns, fewer kilometres of identical forest, and a spread across countries that feels deliberate rather than accidental." },

      { t: "callout", tone: "tip", label: "What curation changes for you", text: "More drops have something to read. That moves the value from the clues that survive emptiness — car, paint, poles — toward **script, signage and shopfronts**. If you find the course's language chapter harder than the bollard chapter, this is the map that punishes it." },

      { t: "p", text: "It is still built from official coverage, so the 96 photospheres-only entries remain out of the deck. What changes is the weighting inside the 121 that are in: countries that feel rare on the official map turn up at a rate you will notice, so the tail is worth more study here than it is there." },

      { t: "steps", label: "Playing it in duels", items: [
        "**Commit early.** Duels reward a fast confident country far more than a slow precise pin.",
        "**Guess the country, then place inside it.** A wrong country is usually a lost round; a wrong region rarely is.",
        "**Do not chase the last clue.** If the scan gave you a country at 90%, take it.",
        "**Know the trap pairs cold.** At speed, the pairs from the last chapter are what actually decide rounds."
      ]},

      { t: "p", text: "Composition described qualitatively and as of August 2026: community maps are re-cut regularly, and a location count quoted to the exact number would be wrong within a month." }
    ]
  },
  { id: "famous-places", name: "Famous Places", flavour: "Official", url: "https://www.geoguessr.com/maps/famous-places",
    blurb: "A different skill entirely: recognise the landmark, not the roadside.",
    body: [
      { t: "p", text: "Famous Places drops you at the world's landmarks — natural wonders and built monuments — and it is barely the same game. The roadside identification the rest of this course teaches is your **fallback** here, not your first move. The first move is recognition." },

      { t: "callout", tone: "tip", label: "The one thing that makes this map different", text: "Landmarks are exactly where user photospheres exist. That means countries with **no official coverage at all** can and do appear here — Egypt, China, Iran, Cuba, Tanzania. The 96 entries this guide marks as photospheres-only are effectively unlocked on this map, and nowhere else." },

      { t: "p", text: "So the coverage tiebreaker that serves you well everywhere else is actively wrong here. If a scene looks like Giza, it is Giza; do not talk yourself out of it because Egypt has no car coverage." },

      { t: "p", text: "**When you do not recognise the place**, fall back to the scan. You are usually still standing on a path or a road, with signage, script, bollards and plates within reach. Interpretive panels at monuments are especially generous: they are often multilingual, and the language order tells you which country you are in." },

      { t: "steps", label: "How to study for it", items: [
        "**Learn landmarks by country, not alphabetically** — it converts recognition failures into country guesses.",
        "**Watch the crowd.** Dress, script on signage and tour-group languages are all readable at a monument.",
        "**Read the interpretive boards.** Multilingual panels with the local language first are a direct answer.",
        "**Remember the photosphere unlock.** Half the countries that never appear elsewhere live on this map."
      ]}
    ]
  },
  { id: "urban-world", name: "Urban and balanced worlds", flavour: "Community",
    blurb: "City-weighted and evenly-weighted world maps, and what changes when every drop has signage.",
    body: [
      { t: "p", text: "A whole family of community maps exists to correct the official map's bias. They come in two broad flavours, and they demand nearly opposite things from you." },

      { t: "p", text: "**Balanced worlds** flatten the country weighting so that every country appears at a similar rate, rather than in proportion to how much Google has driven it. The immediate effect is that the tail matters: the countries you can currently identify only by elimination will now show up as often as Germany does." },

      { t: "p", text: "**Urban worlds** drop you in towns and cities only. Signage, shopfronts, plates and architecture are everywhere; the empty-road clues you leaned on — paint, poles, vegetation — mostly stop mattering." },

      { t: "callout", tone: "warn", label: "Urban maps punish a bollard-first habit", text: "If your instinct on landing is to look for a post at the roadside, an urban map will feel strangely hard. Retrain the first move to **read something** — a shopfront, a van, a street sign — because in a city there is always text." },

      { t: "density", only: ["urban"], caption: "The order to run in a city drop, from {{density|Urban, suburban, rural}} — where the suburban and rural columns are, and where the difference is argued out." },

      { t: "steps", label: "What to study for these", items: [
        "**Scripts and diacritics**, well past the easy ones. Balanced maps put the rare alphabets in front of you constantly.",
        "**Shopfront and telecom branding**, which is national and reads from across a street.",
        "**Architecture and street furniture** — kerb style, bollard type in pedestrian zones, balcony and window shapes.",
        "**Domains and phone codes**, which are dense in cities and almost absent in the countryside."
      ]},

      { t: "p", text: "Composition here is qualitative on purpose: these maps are re-cut often, and there is no single canonical one. Read the map's own description before you play it — the maker usually states the weighting rule outright." }
    ]
  },
  { id: "country-streaks", name: "Country streaks", flavour: "Format",
    blurb: "Not a map but a format — and it rewards the opposite instincts to duels.",
    body: [
      { t: "p", text: "A country streak asks only for the country, and keeps asking until you get one wrong. The scoring is binary and the clock usually is not the constraint, which inverts almost everything duels taught you." },

      { t: "callout", tone: "tip", label: "The whole strategy in one line", text: "**Never guess before the scan is dry.** A streak has no partial credit, so a fast 80% guess is worth strictly less than a slow 99% one. If moving for two minutes finds you a road sign, move for two minutes." },

      { t: "p", text: "This is the format where the course's discipline pays off most literally. Run all six steps. Drive to the junction. Find the van, read the domain, check the plate. The clue that ends the round is often three hundred metres up the road." },

      { t: "steps", label: "Streak habits", items: [
        "**Drive toward signage**, not scenery: junctions, town edges, petrol stations, bus stops.",
        "**Confirm with a second clue** before committing. One clue is a hypothesis; two agreeing is an answer.",
        "**Use the {{putting-it-together|coverage tiebreaker}}.** Between two candidates, the one with official coverage is the one the map can actually drop you in.",
        "**Know your trap pairs**, because a streak dies on Italy/Albania and Kenya/Uganda far more often than on hard countries.",
        "**Bank the boring ones fast.** Germany, the US and Brazil should cost you seconds, leaving time for the rounds that need it."
      ]},

      { t: "p", text: "The failure mode to watch for is impatience after a long streak: the longer it runs, the more it costs to lose, and the more tempting it gets to guess quickly and move on. Slow down as the streak grows, not the other way round." }
    ]
  },
  {
    id: "united-states", name: "United States", flavour: "Official + community",
    blurb: "The country is free. All the work is in the state — and the route marker does most of it.",
    body: [
      { t: "p", text: "The United States is the largest single block of coverage in the game, which makes it the one country where getting the country right is worth almost nothing. Every point is in the state, and often in the corner of the state. That makes it a different exercise from the rest of the course: the clue families are the same, but they all operate one level down." },

      { t: "p", text: "The good news is that the country hands you a tool nowhere else has. Every state signs its own highways with its own marker, the markers are standardised within a state, and they are **everywhere**. This is the American bollard." },

      { t: "families", caption: "Every state and the District, grouped by what its route marker is shaped like. The silhouettes are the real state outlines, generated from census boundaries rather than drawn by hand." },

      { t: "p", text: "That grouping is the whole trick. A silhouette-shaped sign cuts fifty states to seventeen before you have read the number on it. A plain circle cuts them to six. A diamond cuts them to two." },

      { t: "shields", ids: ["pennsylvania", "utah", "kansas", "washington", "new mexico", "california"],
        caption: "The states with an emblem of their own are the free ones — each of these answers the round on sight." },

      { t: "callout", tone: "tip", label: "Learn the eight free ones first", text: "Pennsylvania's keystone, Utah's beehive, Kansas's sunflower, Washington's bust, New Hampshire's Old Man, New Mexico's Zia sun, Colorado's flag and California's green spade. Eight states that need no further thought, for about twenty minutes of study." },

      { t: "p", text: "The families that do not answer the round still narrow it hard, and then the landscape finishes the job. Two states sharing a marker family almost never share a biome." },

      { t: "state-diff", a: "michigan", b: "north carolina",
        note: "The only two diamond states in the country — so the marker gets you to a coin flip, and one look at the trees settles it." },

      { t: "state-diff", a: "georgia", b: "minnesota",
        note: "Both sign with their own outline. Red clay under pine against birch and lake country: the family narrows, the landscape decides." },

      { t: "p", text: "**Landscape is the second tool**, and in the US it is unusually legible because the country is big enough for its biomes to be distinct. Red clay and loblolly pine in the Southeast. Black-soil corn and grain bins across the Midwest. Treeless short-grass plain on the High Plains. Sagebrush basin and bare ridge in the Great Basin. Douglas fir and moss west of the Cascades, sagebrush east of them. Stone walls in the woods across New England." },

      { t: "callout", tone: "warn", label: "Plates change, so read them loosely", text: "US plate designs are reissued constantly and most states run dozens of specialty variants at once, so a specific colour is weak evidence. Read the **state name band** rather than the artwork. The one durable structural tell is Florida, which prints the **county name** across the bottom of the plate — no other state does that as standard." },

      { t: "steps", label: "The rest of the American toolkit", items: [
        "**Area codes** on shopfronts and vans — three digits that pin a metro area, not just a state.",
        "**Regional chains.** Publix in the Southeast, HEB in Texas, Wawa in the Mid-Atlantic, In-N-Out in the West. A single storefront can be worth a state.",
        "**Road surface.** Jointed concrete with a regular thump line is common across the Midwest and Texas; asphalt dominates the Northeast and South.",
        "**Utility poles.** Wooden almost everywhere, so read the transformer and cross-arm style rather than the material.",
        "**Guardrail and post type**, and whether the shoulder is paved, gravel or nothing at all.",
        "**Vermont bans billboards outright**, and so do Maine, Hawaii and Alaska — an American road with no advertising at all is a real clue."
      ]},

      { t: "p", text: "**How the coverage is weighted.** The official map and the balanced community versions both follow the road network, which means population: the Northeast corridor, the Midwest grid, coastal California and the Texas triangle carry far more drops than the Mountain West. Interior Alaska and the emptiest parts of Nevada and Wyoming exist but are rare. As of August 2026 that weighting has been stable for years — when you are torn between an empty western state and a populated eastern one, the east is the better bet." },

      { t: "callout", tone: "tip", label: "Where to spend your study time", text: "The eight emblem states, then the seventeen outline states as a group, then the four biome bands. That is most of the country handled without memorising a single plate design." },

      { t: "drills", label: "State drills", items: [
        { q: "A white diamond route marker, dense mixed hardwood and pine, and a lake visible through the trees.", a: "michigan", why: "The diamond narrows it to Michigan or North Carolina, and lake-and-hardwood country in a cold climate is Michigan." },
        { q: "A route marker shaped like a beehive, red rock canyon walls either side of the road.", a: "utah", why: "The beehive is Utah's alone, and the red rock confirms it." },
        { q: "Flat sandy pine flatwoods with palmetto, and a passing plate carries a county name across the bottom.", a: "florida", why: "The county name on the plate as standard is Florida, and the flatwoods and palmetto match." }
      ]}
    ]
  },
  { id: "flags", name: "Flags of the world", flavour: "Training",
    blurb: "Flag recall as a drill — and flags are a real in-game clue, not just a quiz.",
    body: [
      { t: "p", text: "Flag maps are usually treated as a quiz rather than practice, which undersells them. Flags fly in the game constantly: outside schools, town halls, police stations, petrol stations, car dealerships and hotels, and on bumper stickers and shop awnings. A flag at the end of a village street can end a round on its own." },

      { t: "p", text: "This site ships the **real flag of every entry in the dataset**, at the top of every country page and on every card, so Browse doubles as a flag drill surface. Search a region, scan the flags, then check yourself against the names." },

      { t: "steps", label: "Learn them in families, not alphabetically", items: [
        "**Nordic crosses** — the offset cross is the family; the colours name the country.",
        "**Pan-Arab colours** — red, white, black and green, recombined; learn the arrangement and the emblem.",
        "**Pan-African colours** — red, gold and green; the star, arrangement and shade do the work.",
        "**Union Jack cantons** — a small British flag in the corner narrows you to a short list, then the rest of the field decides.",
        "**Tricolours** — the largest and worst family; group them by orientation first, then by which colours."
      ]},

      { t: "callout", tone: "warn", label: "A flag is not proof of the country", text: "Embassies, hotels, international chains and border towns all fly other countries' flags, and diaspora communities fly theirs. Treat a single flag as strong evidence, not as an answer — and check that it agrees with the driving side and the script before you commit." },

      { t: "p", text: "The pairs worth learning deliberately are the ones the eye slides over: Chad and Romania, Indonesia and Monaco, Ireland and Côte d'Ivoire, Netherlands and Luxembourg, Australia and New Zealand. Every one of them is a real in-game trap." }
    ]
  }
];
