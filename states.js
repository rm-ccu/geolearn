// GeoLearn US states — a second dataset, shaped as a sibling of a COUNTRIES entry
// so it can feed Browse and Compare later without a reshape. Today it is used
// only by the United States map guide.
//
// `shield.family` is the route-marker classification, and it is the reason this
// file exists: seeing which family a marker belongs to cuts fifty states down to
// a handful before you read the number on it.
//
//   circle    the plain federal blank — DE, IA, KY, MS, NJ, NM
//   square    a plain square or rectangular blank
//   diamond   MI and NC only
//   outline   the sign carries the state's own silhouette
//   other     a design of the state's own — a keystone, a beehive, a face
//
// Families are taken from routemarkers.com's by-shape index and Wikipedia's
// coverage of state markers (August 2026). Named symbols are recorded only
// where a source names them; the states marked `other` with a null symbol have
// a distinctive marker whose design this file does not yet describe.
//
// `landscape` and `keyTip` are the same kind of field as a country's, written
// to the same standard: what you can actually see from the road.

const US_STATES = [
  {
    id: "alabama", name: "Alabama", code: "AL", region: "Southeast",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Pine woods and red-clay cuts, humid and low-lying, with cotton and timber country inland.",
    keyTip: "A state-outline marker in humid pine country with red clay is Alabama or Georgia; Georgia's red clay runs deeper and its outline is squarer.",
    confusedWith: ["georgia", "mississippi", "tennessee"]
  },
  {
    id: "alaska", name: "Alaska", code: "AK", region: "Non-contiguous",
    shield: { family: "other", symbol: null, notes: "A design of its own rather than a plain geometric blank." },
    landscape: "Boreal spruce, tundra and mountains, with gravel shoulders and very little roadside development.",
    keyTip: "Almost nothing else in the United States looks like this: spruce, snow-capped ranges and empty gravel roads.",
    confusedWith: ["montana", "washington"]
  },
  {
    id: "arizona", name: "Arizona", code: "AZ", region: "Southwest",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Sonoran desert with saguaro cactus in the south, red rock and pine on the Colorado Plateau in the north.",
    keyTip: "Saguaro cactus grows nowhere else in the country — if you can see one, you are in southern Arizona.",
    confusedWith: ["new mexico", "nevada", "utah"]
  },
  {
    id: "arkansas", name: "Arkansas", code: "AR", region: "South Central",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Ozark and Ouachita hills, dense hardwood, and flat delta farmland in the east.",
    keyTip: "Hardwood hills with a state-outline marker, between the Mississippi delta and Oklahoma's plains.",
    confusedWith: ["missouri", "oklahoma", "tennessee"]
  },
  {
    id: "california", name: "California", code: "CA", region: "Pacific",
    shield: { family: "other", symbol: "spade", notes: "A green cutout spade — California is the only state whose marker is not a square, rectangle or circle blank." },
    landscape: "Everything from coastal fog and redwood to Central Valley farmland and Mojave desert.",
    keyTip: "The green cutout spade marker is unique in the country — California is the only state whose marker is not a square, rectangle or circle blank.",
    confusedWith: ["oregon", "nevada", "arizona"]
  },
  {
    id: "colorado", name: "Colorado", code: "CO", region: "Mountain West",
    shield: { family: "other", symbol: "flag", notes: "A blank carrying the state flag's design." },
    landscape: "High plains rising abruptly to the Front Range, with aspen and lodgepole pine above the foothills.",
    keyTip: "The marker carries the state flag's design, and the Front Range wall behind a flat plain is Colorado's signature.",
    confusedWith: ["wyoming", "utah", "new mexico"]
  },
  {
    id: "connecticut", name: "Connecticut", code: "CT", region: "New England",
    shield: { family: "square", symbol: null, notes: "A plain square or rectangular blank carrying the route number, with no state identity on it." },
    landscape: "Dense mixed hardwood, stone walls in the woods, and tightly spaced old towns.",
    keyTip: "New England hardwood and stone walls with a plain square marker; Connecticut is denser and flatter than Vermont or New Hampshire.",
    confusedWith: ["rhode island", "massachusetts", "new york"]
  },
  {
    id: "delaware", name: "Delaware", code: "DE", region: "Mid-Atlantic",
    shield: { family: "circle", symbol: null, notes: "A plain white circle on a black blank — the federal default. Six states use it, so the circle narrows the field rather than answering it." },
    landscape: "Flat coastal plain, farm fields and pine, with almost no relief anywhere in the state.",
    keyTip: "One of six states using the plain federal circle, and the flattest of them.",
    confusedWith: ["maryland", "new jersey"]
  },
  {
    id: "district of columbia", name: "District of Columbia", code: "DC", region: "Mid-Atlantic",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Dense urban core with federal architecture, mature street trees and no billboards.",
    keyTip: "The marker is the District's own diamond outline, and the federal architecture is unmistakable.",
    confusedWith: ["maryland", "virginia"]
  },
  {
    id: "florida", name: "Florida", code: "FL", region: "Southeast",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Flat sandy pine flatwoods, palmetto scrub, and cabbage palms; no relief anywhere.",
    keyTip: "Dead-flat sandy pine with palmetto, plus a county name across the bottom of the plate — Florida is the state that names the county on the plate.",
    confusedWith: ["georgia", "alabama"]
  },
  {
    id: "georgia", name: "Georgia", code: "GA", region: "Southeast",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Deep red clay, loblolly pine plantations, and kudzu smothering the roadside in summer.",
    keyTip: "Deep red clay under pine, with kudzu on everything, is Georgia before it is Alabama.",
    confusedWith: ["alabama", "south carolina", "tennessee"]
  },
  {
    id: "hawaii", name: "Hawaii", code: "HI", region: "Non-contiguous",
    shield: { family: "other", symbol: null, notes: "A design of its own rather than a plain geometric blank." },
    landscape: "Volcanic rock, tropical broadleaf and sugarcane country, with the ocean rarely far away.",
    keyTip: "Tropical volcanic landscape with US road hardware and English signage — nowhere else in the country looks like this.",
    confusedWith: ["california"]
  },
  {
    id: "idaho", name: "Idaho", code: "ID", region: "Mountain West",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Sagebrush plain in the south, dense conifer and river canyon in the north.",
    keyTip: "The state-outline marker is long and narrow like the state itself; sagebrush plain below, conifer above.",
    confusedWith: ["montana", "wyoming", "oregon"]
  },
  {
    id: "illinois", name: "Illinois", code: "IL", region: "Midwest",
    shield: { family: "square", symbol: null, notes: "A plain square or rectangular blank carrying the route number, with no state identity on it." },
    landscape: "Flat corn and soybean prairie, grain elevators, and dead-straight section-line roads.",
    keyTip: "Plain square marker on flat corn prairie; Illinois and Indiana are the two square states of the Midwest.",
    confusedWith: ["indiana", "iowa", "missouri"]
  },
  {
    id: "indiana", name: "Indiana", code: "IN", region: "Midwest",
    shield: { family: "square", symbol: null, notes: "A plain square or rectangular blank carrying the route number, with no state identity on it." },
    landscape: "Corn and soybean farmland with more woodlot and rolling ground than Illinois.",
    keyTip: "A square marker like Illinois, but with more trees and gentler relief.",
    confusedWith: ["illinois", "ohio", "kentucky"]
  },
  {
    id: "iowa", name: "Iowa", code: "IA", region: "Midwest",
    shield: { family: "circle", symbol: null, notes: "A plain white circle on a black blank — the federal default. Six states use it, so the circle narrows the field rather than answering it." },
    landscape: "Rolling corn country with black soil, hog barns and grain bins on almost every farm.",
    keyTip: "The plain federal circle on rolling black-soil corn country is Iowa.",
    confusedWith: ["illinois", "nebraska", "minnesota"]
  },
  {
    id: "kansas", name: "Kansas", code: "KS", region: "Great Plains",
    shield: { family: "other", symbol: "sunflower", notes: "A sunflower, the state flower." },
    landscape: "Flat to gently rolling wheat plains, with grain elevators visible for miles.",
    keyTip: "The sunflower marker is Kansas alone — the state flower on the state's own routes.",
    confusedWith: ["nebraska", "oklahoma", "missouri"]
  },
  {
    id: "kentucky", name: "Kentucky", code: "KY", region: "Southeast",
    shield: { family: "circle", symbol: null, notes: "A plain white circle on a black blank — the federal default. Six states use it, so the circle narrows the field rather than answering it." },
    landscape: "Rolling bluegrass pasture with black plank fencing, and Appalachian hills in the east.",
    keyTip: "Plank-fenced horse pasture with a plain circle marker is Kentucky.",
    confusedWith: ["tennessee", "indiana", "west virginia"]
  },
  {
    id: "louisiana", name: "Louisiana", code: "LA", region: "South Central",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Bayou, cypress swamp, elevated causeways and Spanish moss hanging from live oaks.",
    keyTip: "Cypress swamp and elevated causeway with a state-outline marker is Louisiana; the parish names on signage confirm it.",
    confusedWith: ["mississippi", "texas", "arkansas"]
  },
  {
    id: "maine", name: "Maine", code: "ME", region: "New England",
    shield: { family: "square", symbol: null, notes: "A plain square or rectangular blank carrying the route number, with no state identity on it." },
    landscape: "Spruce and birch forest, granite coast, and long stretches of unbroken woods.",
    keyTip: "Spruce-dominated forest this far east, with a plain square marker, is Maine.",
    confusedWith: ["new hampshire", "vermont"]
  },
  {
    id: "maryland", name: "Maryland", code: "MD", region: "Mid-Atlantic",
    shield: { family: "square", symbol: null, notes: "A plain square or rectangular blank carrying the route number, with no state identity on it." },
    landscape: "Chesapeake tidewater and rolling piedmont, dense suburb near Washington and Baltimore.",
    keyTip: "A square marker in Chesapeake tidewater country between Washington and Pennsylvania.",
    confusedWith: ["virginia", "delaware", "pennsylvania"]
  },
  {
    id: "massachusetts", name: "Massachusetts", code: "MA", region: "New England",
    shield: { family: "square", symbol: null, notes: "A plain square or rectangular blank carrying the route number, with no state identity on it." },
    landscape: "Mixed hardwood, stone walls, dense old towns and heavy coastal development.",
    keyTip: "Square marker in dense New England hardwood, more built-up than its neighbours.",
    confusedWith: ["connecticut", "rhode island", "new hampshire"]
  },
  {
    id: "michigan", name: "Michigan", code: "MI", region: "Midwest",
    shield: { family: "diamond", symbol: null, notes: "A white diamond blank — only Michigan and North Carolina use one." },
    landscape: "Mixed hardwood and pine with water everywhere — lakes, straits and dune country.",
    keyTip: "The white diamond marker is shared only with North Carolina, and Michigan is the one surrounded by lakes.",
    confusedWith: ["wisconsin", "ohio", "minnesota"]
  },
  {
    id: "minnesota", name: "Minnesota", code: "MN", region: "Midwest",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Lakes, birch and pine in the north, prairie farmland in the south, with long cold-weather road wear.",
    keyTip: "A state-outline marker this far north, in lake and birch country, is Minnesota.",
    confusedWith: ["wisconsin", "iowa", "north dakota"]
  },
  {
    id: "mississippi", name: "Mississippi", code: "MS", region: "Southeast",
    shield: { family: "circle", symbol: null, notes: "A plain white circle on a black blank — the federal default. Six states use it, so the circle narrows the field rather than answering it." },
    landscape: "Pine woods and delta cotton country, humid and low, with red-brown soil inland.",
    keyTip: "The plain federal circle in Deep South pine and delta country is Mississippi.",
    confusedWith: ["alabama", "louisiana", "arkansas"]
  },
  {
    id: "missouri", name: "Missouri", code: "MO", region: "Midwest",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Ozark hardwood hills in the south, corn and soybean plain in the north.",
    keyTip: "A state-outline marker on Ozark limestone and hardwood is Missouri.",
    confusedWith: ["arkansas", "kansas", "illinois"]
  },
  {
    id: "montana", name: "Montana", code: "MT", region: "Mountain West",
    shield: { family: "square", symbol: null, notes: "A plain square or rectangular blank carrying the route number, with no state identity on it." },
    landscape: "Short-grass plains in the east, dramatic ranges in the west, and very long empty sightlines.",
    keyTip: "A plain square marker with mountains on one horizon and empty plain on the other is Montana.",
    confusedWith: ["wyoming", "idaho", "north dakota"]
  },
  {
    id: "nebraska", name: "Nebraska", code: "NE", region: "Great Plains",
    shield: { family: "other", symbol: null, notes: "A design of its own rather than a plain geometric blank." },
    landscape: "Corn and cattle plains, sandhills in the centre, with irrigation pivots everywhere.",
    keyTip: "A distinctive non-geometric marker on flat irrigated corn plain is Nebraska rather than Kansas.",
    confusedWith: ["kansas", "iowa", "south dakota"]
  },
  {
    id: "nevada", name: "Nevada", code: "NV", region: "Mountain West",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Basin and range: sagebrush valleys separated by bare north-south mountain ridges.",
    keyTip: "Repeating basin-and-range ridges with a state-outline marker is Nevada.",
    confusedWith: ["utah", "arizona", "california"]
  },
  {
    id: "new hampshire", name: "New Hampshire", code: "NH", region: "New England",
    shield: { family: "other", symbol: "oldman", notes: "The Old Man of the Mountain profile, the state's own emblem." },
    landscape: "Granite hills, birch and conifer, with tight valley roads and white-steepled towns.",
    keyTip: "The marker carries the Old Man of the Mountain profile — the state's own emblem, used nowhere else.",
    confusedWith: ["vermont", "maine", "massachusetts"]
  },
  {
    id: "new jersey", name: "New Jersey", code: "NJ", region: "Mid-Atlantic",
    shield: { family: "circle", symbol: null, notes: "A plain white circle on a black blank — the federal default. Six states use it, so the circle narrows the field rather than answering it." },
    landscape: "Pine barrens in the south, dense suburb and industry in the north.",
    keyTip: "The plain federal circle in dense Northeast suburb is New Jersey.",
    confusedWith: ["new york", "pennsylvania", "delaware"]
  },
  {
    id: "new mexico", name: "New Mexico", code: "NM", region: "Southwest",
    shield: { family: "circle", symbol: "zia", notes: "A circle blank carrying the Zia sun symbol." },
    landscape: "High desert, mesas and juniper, with adobe-styled buildings even on new construction.",
    keyTip: "The Zia sun symbol inside the circle marker is New Mexico's alone.",
    confusedWith: ["arizona", "colorado", "texas"]
  },
  {
    id: "new york", name: "New York", code: "NY", region: "Mid-Atlantic",
    shield: { family: "other", symbol: null, notes: "A design of its own rather than a plain geometric blank." },
    landscape: "Dense hardwood upstate with Adirondack conifer, and heavy urban development downstate.",
    keyTip: "A distinctive marker of its own, in upstate hardwood between the Great Lakes and New England.",
    confusedWith: ["pennsylvania", "vermont", "new jersey"]
  },
  {
    id: "north carolina", name: "North Carolina", code: "NC", region: "Southeast",
    shield: { family: "diamond", symbol: null, notes: "A white diamond blank — only Michigan and North Carolina use one." },
    landscape: "Coastal plain pine, piedmont red clay, and Appalachian hardwood in the west.",
    keyTip: "The white diamond marker is shared only with Michigan, and North Carolina is the warm one.",
    confusedWith: ["south carolina", "virginia", "georgia"]
  },
  {
    id: "north dakota", name: "North Dakota", code: "ND", region: "Great Plains",
    shield: { family: "other", symbol: null, notes: "A design of its own rather than a plain geometric blank." },
    landscape: "Flat wheat and sunflower plains with almost no trees away from the river valleys.",
    keyTip: "Treeless flat wheat plain in the far north; the marker is being changed to a state outline.",
    confusedWith: ["south dakota", "minnesota", "montana"]
  },
  {
    id: "ohio", name: "Ohio", code: "OH", region: "Midwest",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Farmland and hardwood woodlot, dense small towns, and heavy freight infrastructure.",
    keyTip: "A state-outline marker on Midwest farmland with dense towns is Ohio.",
    confusedWith: ["indiana", "pennsylvania", "michigan"]
  },
  {
    id: "oklahoma", name: "Oklahoma", code: "OK", region: "South Central",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Red soil, scrub oak and grassland, with oil infrastructure common on the roadside.",
    keyTip: "Red soil under scrub oak with a state-outline marker is Oklahoma.",
    confusedWith: ["texas", "kansas", "arkansas"]
  },
  {
    id: "oregon", name: "Oregon", code: "OR", region: "Pacific",
    shield: { family: "other", symbol: null, notes: "A design of its own rather than a plain geometric blank." },
    landscape: "Douglas fir west of the Cascades, high sagebrush desert east of them.",
    keyTip: "A distinctive marker of its own, in Pacific Northwest conifer; Washington's marker carries a face and Oregon's does not.",
    confusedWith: ["washington", "california", "idaho"]
  },
  {
    id: "pennsylvania", name: "Pennsylvania", code: "PA", region: "Mid-Atlantic",
    shield: { family: "other", symbol: "keystone", notes: "A keystone, after the state's nickname." },
    landscape: "Appalachian ridge-and-valley hardwood, stone farmhouses and heavy old industry.",
    keyTip: "The keystone marker is Pennsylvania's alone — the state's nickname made into a sign.",
    confusedWith: ["new york", "ohio", "maryland"]
  },
  {
    id: "rhode island", name: "Rhode Island", code: "RI", region: "New England",
    shield: { family: "square", symbol: null, notes: "A plain square or rectangular blank carrying the route number, with no state identity on it." },
    landscape: "Dense coastal development, mixed hardwood, and very short distances between towns.",
    keyTip: "A square marker in the smallest, most tightly built New England state.",
    confusedWith: ["massachusetts", "connecticut"]
  },
  {
    id: "south carolina", name: "South Carolina", code: "SC", region: "Southeast",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Coastal live oak and palmetto, pine and red clay inland.",
    keyTip: "A state-outline marker with palmetto and live oak is South Carolina.",
    confusedWith: ["north carolina", "georgia"]
  },
  {
    id: "south dakota", name: "South Dakota", code: "SD", region: "Great Plains",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Short-grass plains, the Missouri breaks, and the Black Hills conifer in the west.",
    keyTip: "A state-outline marker on treeless plains with Black Hills conifer to the west is South Dakota.",
    confusedWith: ["north dakota", "nebraska", "montana"]
  },
  {
    id: "tennessee", name: "Tennessee", code: "TN", region: "Southeast",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Appalachian hardwood in the east, rolling pasture centrally, delta flat in the west.",
    keyTip: "A state-outline marker in Appalachian hardwood between Kentucky and Alabama.",
    confusedWith: ["kentucky", "north carolina", "alabama"]
  },
  {
    id: "texas", name: "Texas", code: "TX", region: "South Central",
    shield: { family: "outline", symbol: null, notes: "The marker is the outline of the state itself. Learn the silhouette and the sign names the state for you." },
    landscape: "Everything from piney woods in the east to desert in the west, via hill country and plains.",
    keyTip: "The marker is the Texas outline — the most recognisable state silhouette in the country.",
    confusedWith: ["oklahoma", "new mexico", "louisiana"]
  },
  {
    id: "utah", name: "Utah", code: "UT", region: "Mountain West",
    shield: { family: "other", symbol: "beehive", notes: "A beehive, for the Beehive State." },
    landscape: "Red rock canyon in the south, salt flat and the Wasatch range in the north.",
    keyTip: "The beehive marker is Utah's alone, and red-rock canyon country backs it up.",
    confusedWith: ["nevada", "arizona", "colorado"]
  },
  {
    id: "vermont", name: "Vermont", code: "VT", region: "New England",
    shield: { family: "other", symbol: null, notes: "A design of its own rather than a plain geometric blank." },
    landscape: "Green Mountain hardwood, dairy farms, white-steepled villages and no billboards at all.",
    keyTip: "Vermont bans billboards outright — a New England road with no advertising is a strong Vermont signal.",
    confusedWith: ["new hampshire", "new york", "massachusetts"]
  },
  {
    id: "virginia", name: "Virginia", code: "VA", region: "Mid-Atlantic",
    shield: { family: "other", symbol: null, notes: "A design of its own rather than a plain geometric blank." },
    landscape: "Tidewater flats, piedmont farmland and Blue Ridge hardwood running southwest to northeast.",
    keyTip: "A distinctive marker of its own, in Blue Ridge and piedmont country south of Washington.",
    confusedWith: ["maryland", "west virginia", "north carolina"]
  },
  {
    id: "washington", name: "Washington", code: "WA", region: "Pacific",
    shield: { family: "other", symbol: "bust", notes: "A silhouette of George Washington's head." },
    landscape: "Dense Douglas fir and moss west of the Cascades, dry sagebrush and orchard east of them.",
    keyTip: "The marker is a silhouette of George Washington's head — a face on a route marker is this state and no other.",
    confusedWith: ["oregon", "idaho"]
  },
  {
    id: "west virginia", name: "West Virginia", code: "WV", region: "Mid-Atlantic",
    shield: { family: "square", symbol: null, notes: "A plain square or rectangular blank carrying the route number, with no state identity on it." },
    landscape: "Steep Appalachian hardwood, narrow valley roads, and coal and rail infrastructure.",
    keyTip: "A square marker on steep, narrow Appalachian valley roads is West Virginia.",
    confusedWith: ["virginia", "kentucky", "pennsylvania"]
  },
  {
    id: "wisconsin", name: "Wisconsin", code: "WI", region: "Midwest",
    shield: { family: "other", symbol: "triangle", notes: "A triangle set on a square blank." },
    landscape: "Dairy farmland, mixed hardwood and pine, with lakes and glacial ground moraine.",
    keyTip: "The marker is a triangle on a square blank — a shape no other state uses.",
    confusedWith: ["minnesota", "michigan", "iowa"]
  },
  {
    id: "wyoming", name: "Wyoming", code: "WY", region: "Mountain West",
    shield: { family: "square", symbol: null, notes: "A plain square or rectangular blank carrying the route number, with no state identity on it." },
    landscape: "Sagebrush high plain, wind-scoured and treeless, with ranges rising in the west.",
    keyTip: "A square marker on empty windswept sagebrush plain is Wyoming.",
    confusedWith: ["montana", "colorado", "idaho"]
  }
];
