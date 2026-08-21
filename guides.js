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

      { t: "p", text: "The rest of this course is one chapter per step, and each chapter ends with drills. Work through them in order; the later chapters assume you can already do the earlier ones without thinking." }
    ]
  },

  {
    id: "driving-side",
    title: "Driving side",
    goal: "Cut the world in half in the first second, even when the road is empty.",
    minutes: 5,
    body: [
      { t: "p", text: "Nothing else you can see eliminates as much of the planet this fast. Of the 122 places a standard game can drop you, **33 drive on the left** — the British Isles, southern and eastern Africa, South Asia, most of South East Asia, Japan, Australasia, and a short list of islands. Everywhere else drives on the right." },
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
        "**Georgian**, **Armenian**, **Hebrew**, **Greek**, **Amharic** — each essentially one country.",
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
        "**Yellow** — [[netherlands]], [[luxembourg]], [[cyprus]], [[israel]], [[namibia]], [[colombia]], and the **rear** plates of [[uk]], [[ireland]] and [[botswana]].",
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
    id: "putting-it-together",
    title: "Putting it together",
    goal: "Run the whole scan as one flow, and beat the trap pairs that survive every individual test.",
    minutes: 7,
    body: [
      { t: "p", text: "You now have every individual tool. This chapter is about the order you use them in, and about what to do when two countries refuse to separate." },

      { t: "steps", label: "The full flow", items: [
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

      { t: "callout", tone: "tip", label: "The coverage tiebreaker", text: "When you genuinely cannot split two candidates, take the one the game is more likely to drop you in. Of the 218 entries on this site, **96 have no official Street View coverage at all** — a standard game cannot put you there. Torn between Kenya and Tanzania on an official map? Tanzania is photospheres-only. Take Kenya." },

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
    blurb: "The default map, and the one every other map is a reaction to." },
  { id: "a-community-world", name: "A Community World", flavour: "Community", url: "https://www.geoguessr.com/maps/62a44b22040f04bd36e8a914",
    blurb: "The handpicked world map used for ranked duels." },
  { id: "famous-places", name: "Famous Places", flavour: "Official", url: "https://www.geoguessr.com/maps/famous-places",
    blurb: "A different skill entirely: recognise the landmark, not the roadside." },
  { id: "urban-world", name: "Urban and balanced worlds", flavour: "Community",
    blurb: "City-weighted world maps, and what changes when every drop has signage." },
  { id: "country-streaks", name: "Country streaks", flavour: "Format",
    blurb: "Not a map but a format — and it rewards the opposite instincts to duels." },
  { id: "united-states", name: "United States", flavour: "Official + community",
    blurb: "State-level tells: plates, route shields, poles and tree lines." },
  { id: "flags", name: "Flags of the world", flavour: "Training",
    blurb: "Flag recall as a drill, using the 217 flags this site already ships." }
];
