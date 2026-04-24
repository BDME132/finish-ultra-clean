import type { ApparelProduct } from "./types";

// ─── Centralized Apparel Product Library ────────────────────────────────────
// Sources: ApparelFinder.tsx buildOutfit(), KitBuilder.tsx buildKit(),
//          race-day-kit.ts (on-body, drop-bag, hydration-pack, post-race)

export const apparel: ApparelProduct[] = [
  // ── Base Layers ───────────────────────────────────────────────────────────

  {
    id: "smartwool-classic-thermal-crew",
    name: "Classic Thermal Crew Base Layer",
    brand: "Smartwool",
    category: "apparel",
    price: 120,
    priceDisplay: "$120",
    description:
      "Merino wool insulation layer that keeps you warm even when wet. Critical for mountain races where temperatures swing 30+ degrees between day and night.",
    whyWeRecommend:
      "Mountain ultras with big temperature swings demand a layer that performs wet or dry. Merino insulation keeps heat even after creek crossings and rain — synthetics can't match it.",
    specs: {
      fabric: "Merino wool blend",
      fit: "Regular",
      weight: "~250g (M)" },
    role: "base-layer",
    conditions: ["cold", "extreme"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Smartwool%20Classic%20Thermal%20Crew%20Base%20Layer&tag=finishultra-20" },
    tags: ["base-layer", "merino", "thermal", "mountain", "cold-weather"] },

  // ── Mid Layers / Insulation ───────────────────────────────────────────────


  // ── Bottoms ───────────────────────────────────────────────────────────────

  {
    id: "2xu-mcs-compression-tights",
    name: "MCS Run Compression Tights",
    brand: "2XU",
    category: "apparel",
    price: 100,
    priceDisplay: "$100",
    description:
      "Medical-grade graduated compression tights that accelerate muscle recovery by improving circulation. Wear for 24-48 hours post-race to reduce swelling and soreness.",
    whyWeRecommend:
      "Medical-grade graduated compression accelerates recovery by improving circulation. Put them on within 30 minutes of finishing and wear for 24-48 hours — the science on compression for recovery is strong.",
    specs: {
      fabric: "PWX compression fabric",
      fit: "Compression",
      weight: "~180g (M)" },
    role: "recovery",
    conditions: ["hot", "moderate", "cold", "extreme"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=2XU%20MCS%20Run%20Compression%20Tights&tag=finishultra-20" },
    tags: ["compression", "recovery", "post-race", "medical-grade"] },

  // ── Shells ────────────────────────────────────────────────────────────────

  {
    id: "outdoor-research-helium-rain-jacket",
    name: "Helium Rain Jacket",
    brand: "Outdoor Research",
    category: "apparel",
    price: 150,
    priceDisplay: "$150",
    description:
      "6.4oz waterproof shell that packs into its own chest pocket — best weight-to-protection ratio in its class. 2.5L Pertex Shield with fully taped seams.",
    whyWeRecommend:
      "Six ounces of waterproof protection that packs into its own chest pocket. You'll carry it the whole race and might never use it — but the one time you need it, it's the most valuable item in your pack.",
    specs: {
      fabric: "2.5L Pertex Shield",
      fit: "Standard",
      weight: "175g (M)" },
    role: "shell",
    conditions: ["moderate", "cold"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Outdoor%20Research%20Helium%20Rain%20Jacket&tag=finishultra-20" },
    tags: ["shell", "rain-jacket", "budget", "packable", "waterproof"],
    beginnerPick: true },


  // ── Headwear ──────────────────────────────────────────────────────────────

  {
    id: "salomon-xa-cap",
    name: "XA Cap",
    brand: "Salomon",
    category: "apparel",
    price: 30,
    priceDisplay: "$30",
    description:
      "Lightweight trail cap with UPF protection that blocks solar radiation. Moisture-wicking sweatband keeps sweat out of your eyes on long, hot days.",
    whyWeRecommend:
      "Lightweight trail cap with UPF protection that blocks solar radiation directly hitting your head — the single biggest driver of overheating on exposed desert or alpine courses.",
    specs: {
      fabric: "Recycled polyester mesh",
      upf: "50+",
      weight: "45g" },
    role: "headwear",
    conditions: ["hot"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Salomon%20XA%20Cap&tag=finishultra-20" },
    tags: ["cap", "hot-weather", "upf", "lightweight", "headwear"] },
  {
    id: "ciele-gocap",
    name: "GOCap",
    brand: "Ciele",
    category: "apparel",
    price: 38,
    priceDisplay: "$38",
    description:
      "Technical mesh 5-panel cap with COOLwick sweatband. Fits under a headlamp without shifting — ideal for moderate conditions and night running.",
    whyWeRecommend:
      "Technical mesh construction with COOLwick sweatband wicks perspiration away from your forehead on moderate days. Fits under a headlamp without shifting.",
    specs: {
      fabric: "Technical mesh",
      fit: "Structured 5-panel",
      weight: "57g" },
    role: "headwear",
    conditions: ["moderate"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Ciele%20GOCap&tag=finishultra-20" },
    tags: ["cap", "moderate-weather", "headlamp-compatible", "headwear"] },
  {
    id: "smartwool-merino-250-beanie",
    name: "Merino 250 Beanie",
    brand: "Smartwool",
    category: "apparel",
    price: 35,
    priceDisplay: "$35",
    description:
      "Merino wool beanie that covers ears without bulk. Naturally odor-resistant for multi-day use and warm even after it gets damp from sweat or precipitation.",
    whyWeRecommend:
      "Merino wool beanie covers your ears without the bulk of a heavy hat. Naturally odor-resistant for multi-day use and warm even after it gets damp from sweat or precipitation.",
    specs: {
      fabric: "100% Merino 250gsm",
      weight: "65g" },
    role: "headwear",
    conditions: ["cold", "extreme"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Smartwool%20Merino%20250%20Beanie&tag=finishultra-20" },
    tags: ["beanie", "cold-weather", "merino", "headwear"] },
  {
    id: "sunday-afternoons-ultra-adventure-hat",
    name: "Ultra Adventure Hat",
    brand: "Sunday Afternoons",
    category: "apparel",
    price: 48,
    priceDisplay: "$48",
    description:
      "UPF 50+ sun hat with full brim coverage and a moisture-wicking sweatband. Folds flat for pockets and stays put in wind.",
    whyWeRecommend:
      "Full-brim UPF 50+ coverage protects your face, ears, and neck on exposed desert and alpine courses. Folds flat when you don't need it and stays put when the wind picks up.",
    specs: {
      fabric: "Nylon with UPF 50+",
      upf: "50+",
      weight: "~85g" },
    role: "headwear",
    conditions: ["hot"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Sunday%20Afternoons%20Ultra%20Adventure%20Hat&tag=finishultra-20" },
    tags: ["sun-hat", "upf", "full-brim", "desert", "headwear"] },

  // ── Gloves ────────────────────────────────────────────────────────────────


  // ── Socks ─────────────────────────────────────────────────────────────────

  {
    id: "darn-tough-run-no-show-tab",
    name: "Run No-Show Tab Lightweight",
    brand: "Darn Tough",
    category: "apparel",
    price: 22,
    priceDisplay: "$22",
    description:
      "Merino wool no-show socks with seamless toe construction and a lifetime warranty. The no-brainer sock for trail ultras.",
    whyWeRecommend:
      "Lifetime warranty, merino wool, seamless toe construction to prevent blisters. Buy three pairs and never think about socks again.",
    specs: {
      fabric: "Merino wool blend",
      weight: "Light cushion" },
    role: "socks",
    conditions: ["hot", "moderate"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Darn%20Tough%20Run%20No-Show%20Tab%20Lightweight&tag=finishultra-20" },
    tags: ["socks", "merino", "lifetime-warranty", "blister-prevention", "lightweight"],
    beginnerPick: true },

  {
    id: "injinji-trail-midweight-crew",
    name: "Trail Midweight Crew Socks",
    brand: "Injinji",
    category: "apparel",
    price: 22,
    priceDisplay: "$22",
    description:
      "Toe socks that prevent blisters between toes — the #1 DNF cause in ultras. Individual toe pockets eliminate friction at the most vulnerable spots.",
    whyWeRecommend:
      "Toe socks physically prevent toe-on-toe friction — the root cause of blisters between toes. Many mountain 100 veterans swear by Injinji as the single most important blister-prevention tool.",
    specs: {
      fabric: "Moisture-wicking polyester blend",
      weight: "Midweight cushion" },
    role: "socks",
    conditions: ["hot", "moderate", "cold"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Injinji%20Trail%20Midweight%20Crew%20Socks&tag=finishultra-20" },
    tags: ["socks", "toe-socks", "blister-prevention", "trail"] },
  {
    id: "injinji-run-original-no-show",
    name: "Run Original Weight No-Show",
    brand: "Injinji",
    category: "apparel",
    price: 18,
    priceDisplay: "$18",
    description:
      "Lightweight toe sock liner with individual toe compartments. Can be layered under a regular sock for double blister protection on technical terrain.",
    whyWeRecommend:
      "Toe socks physically prevent toe-on-toe friction — the root cause of blisters between toes. Many mountain 100 veterans layer Injinji toe socks under a regular sock for double protection on technical terrain.",
    specs: {
      fabric: "Moisture-wicking polyester" },
    role: "socks",
    conditions: ["hot", "moderate", "cold"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Injinji%20Run%20Original%20Weight%20No-Show&tag=finishultra-20" },
    tags: ["socks", "toe-socks", "liner", "blister-prevention", "lightweight"] },


  // ── New Additions ─────────────────────────────────────────────────────────

  // Base Layers
  {
    id: "smartwool-merino-sport-120-tee",
    name: "Merino Sport 120 Short Sleeve Tee",
    brand: "Smartwool",
    category: "apparel",
    price: 65,
    priceDisplay: "$65",
    description:
      "120gsm ultralight merino wool tee that wicks moisture, resists odor, and regulates temperature across the swings of a full ultra day. The lightest merino base layer for hot and moderate conditions.",
    whyWeRecommend:
      "At 120gsm it's lighter than most synthetic tees but carries all the merino benefits — odor resistance for multi-day efforts and natural thermoregulation so you're not fighting temperature swings from dawn to noon.",
    specs: {
      fabric: "100% Merino wool 120gsm",
      upf: "20+",
      fit: "Regular",
      weight: "~120g (M)" },
    role: "base-layer",
    conditions: ["hot", "moderate"],
    affiliateLinks: { amazon: "https://amzn.to/4vICQ4n" },
    tags: ["base-layer", "merino", "ultralight", "hot-weather", "odor-resistant", "tee"] },
  {
    id: "smartwool-classic-allseason-merino-ls",
    name: "Classic All-Season Merino Long Sleeve",
    brand: "Smartwool",
    category: "apparel",
    price: 100,
    priceDisplay: "$100",
    description:
      "Mid-weight 200gsm merino long sleeve base layer that transitions from cold morning starts to warm afternoon sections without becoming clammy. A single shirt for wide temperature ranges.",
    whyWeRecommend:
      "200gsm merino hits the sweet spot between the 150 (too light for cold) and 250 (too warm for active climbing). One shirt that handles morning cold, afternoon sun, and nighttime dips — the true all-season ultra base layer.",
    specs: {
      fabric: "100% Merino wool 200gsm",
      upf: "20+",
      fit: "Regular",
      weight: "~200g (M)" },
    role: "base-layer",
    conditions: ["moderate", "cold"],
    affiliateLinks: { amazon: "https://amzn.to/48bS9bM" },
    tags: ["base-layer", "merino", "all-season", "long-sleeve", "temperature-regulation"] },

  // Mid Layers
  {
    id: "smartwool-intraknit-merino-fleece-hoody",
    name: "Intraknit Merino Fleece Full-Zip Hoody",
    brand: "Smartwool",
    category: "apparel",
    price: 220,
    priceDisplay: "$220",
    description:
      "Seamless-knit merino fleece hoody with zoned construction that places insulation where you need it and mesh panels where you breathe. Exceptionally warm-to-weight for overnight mountain sections.",
    whyWeRecommend:
      "The Intraknit's zoned construction puts fleece where you're cold and mesh where you overheat — smarter than a uniform mid-layer for the variable output of ultra running on technical mountain terrain.",
    specs: {
      fabric: "Merino wool fleece blend",
      fit: "Regular",
      weight: "~340g (M)" },
    role: "mid-layer",
    conditions: ["cold", "extreme"],
    affiliateLinks: { amazon: "https://amzn.to/4u0GVz2" },
    tags: ["mid-layer", "merino", "fleece", "hoody", "cold-weather", "zoned-insulation"] },
  {
    id: "outdoor-research-transcendent-down-vest",
    name: "Transcendent Down Vest",
    brand: "Outdoor Research",
    category: "apparel",
    price: 199,
    priceDisplay: "$199",
    description:
      "650-fill-power DownTek down vest that packs into its own pocket at just 240g. Core warmth without restricting arm swing — the ideal mid-layer for aid station stops and cold-weather descents.",
    whyWeRecommend:
      "Down-to-weight ratio beats synthetic at this price point — 650-fill packs to fist-size and delivers serious warmth at aid stations and on slow cold descents without the bulk of a full jacket.",
    specs: {
      fabric: "650-fill-power DownTek down",
      fit: "Regular",
      weight: "240g (M)" },
    role: "mid-layer",
    conditions: ["cold", "extreme"],
    affiliateLinks: { amazon: "https://amzn.to/48ePcqM" },
    tags: ["mid-layer", "down", "packable", "vest", "insulation", "cold-weather"] },
  {
    id: "tnf-canyonlands-fleece",
    name: "Canyonlands Fleece Hoodie",
    brand: "The North Face",
    category: "apparel",
    price: 110,
    priceDisplay: "$110",
    description:
      "Recycled fleece hoodie with a kangaroo pocket and DWR finish. A durable, warm mid-layer for crew stops, cold descents, and overnight drop-bag layering.",
    whyWeRecommend:
      "A reliable sub-$120 fleece mid-layer for drop bags and crew kits — warm enough for overnight cold sections, durable enough to survive the abuse of a long mountain race.",
    specs: {
      fabric: "100% recycled polyester fleece",
      fit: "Regular",
      weight: "~400g (M)" },
    role: "mid-layer",
    conditions: ["cold", "moderate"],
    affiliateLinks: { amazon: "https://amzn.to/48iBvHj" },
    tags: ["mid-layer", "fleece", "recycled", "drop-bag", "crew-stop", "hoodie"] },

  // Bottoms
  {
    id: "rabbit-ez-5-short",
    name: "EZ 5\" Running Short",
    brand: "Rabbit",
    category: "apparel",
    price: 62,
    priceDisplay: "$62",
    description:
      "5-inch running short with a soft interior liner, zip back pocket, and relaxed waistband. Built for all-day comfort on training runs without the restriction of compression-heavy race shorts.",
    whyWeRecommend:
      "Rabbit's EZ short prioritizes comfort over compression — the relaxed waistband doesn't dig on swollen bellies late in a race and the soft liner prevents inner-thigh chafing through a full ultra distance.",
    specs: {
      fabric: "Recycled polyester",
      fit: "Relaxed",
      inseam: "5\"" },
    role: "bottom",
    conditions: ["hot", "moderate"],
    affiliateLinks: { amazon: "https://amzn.to/4tqlGXt" },
    tags: ["shorts", "comfortable", "5-inch", "liner", "training", "relaxed-fit"] },
  {
    id: "smartwool-merino-sport-fleece-tights",
    name: "Merino Sport Fleece Tights",
    brand: "Smartwool",
    category: "apparel",
    price: 150,
    priceDisplay: "$150",
    description:
      "Merino-fleece lined running tights for cold-weather trail running. The soft fleece interior adds insulation against low temperatures while the exterior wicks moisture and blocks light wind.",
    whyWeRecommend:
      "Fleece-lined merino tights are warmer than standard running tights without adding a separate insulation layer — the right call for cold-weather mountain sections where you need both warmth and mobility.",
    specs: {
      fabric: "Merino wool fleece blend",
      fit: "Slim",
      weight: "~280g (M)" },
    role: "bottom",
    conditions: ["cold", "extreme"],
    affiliateLinks: { amazon: "https://amzn.to/3OtV09f" },
    tags: ["tights", "merino", "fleece-lined", "cold-weather", "mountain", "insulated"] },

  // Shells
  {
    id: "outdoor-research-helium-wind-hoody",
    name: "Helium Wind Hoody",
    brand: "Outdoor Research",
    category: "apparel",
    price: 109,
    priceDisplay: "$109",
    description:
      "80g wind hoody made from Pertex Quantum ripstop nylon. Packs to palm-size and blocks wind chill on ridge lines and exposed alpine sections without any waterproofing weight.",
    whyWeRecommend:
      "At 80g it's the lightest packable wind layer you can carry — blocks wind chill on exposed ridgelines without the waterproofing bulk of a rain shell. Carry it every race and barely notice it's there.",
    specs: {
      fabric: "Pertex Quantum ripstop nylon",
      fit: "Slim, athletic",
      weight: "80g (M)" },
    role: "shell",
    conditions: ["moderate", "cold"],
    affiliateLinks: { amazon: "https://amzn.to/4sOdG1C" },
    tags: ["shell", "wind-hoody", "ultralight", "packable", "ridge-running", "mandatory-gear"] },
  {
    id: "black-diamond-liquid-point-shell",
    name: "Liquid Point Shell",
    brand: "Black Diamond",
    category: "apparel",
    price: 299,
    priceDisplay: "$299",
    description:
      "3L hardshell rain jacket with fully seam-taped BD.dry waterproofing and a helmet-compatible hood. Built for sustained heavy rain on mountain alpine routes — the shell you reach for when conditions turn serious.",
    whyWeRecommend:
      "BD.dry 3L waterproofing and fully taped seams mean no rain gets in even in sustained mountain downpours — the step up from packable 2.5L jackets when alpine weather turns severe.",
    specs: {
      fabric: "BD.dry 3L laminate",
      fit: "Trim, athletic",
      weight: "~380g (M)" },
    role: "shell",
    conditions: ["cold", "extreme"],
    affiliateLinks: { amazon: "https://amzn.to/4eA6BOr" },
    tags: ["shell", "hardshell", "rain-jacket", "3L", "mountain", "waterproof", "alpine"] },
  {
    id: "marmot-precip-eco-rain-jacket",
    name: "PreCip Eco Rain Jacket",
    brand: "Marmot",
    category: "apparel",
    price: 100,
    priceDisplay: "$100",
    description:
      "Fully seam-sealed waterproof jacket made from recycled NanoPro fabric. The best budget waterproof shell for runners who need reliable rain protection without a premium price.",
    whyWeRecommend:
      "Fully seam-sealed NanoPro waterproofing at $100 is exceptional value — reliable rain protection for mandatory gear compliance without spending $250+ on a performance shell.",
    specs: {
      fabric: "NanoPro recycled nylon, fully seam-sealed",
      fit: "Regular",
      weight: "~340g (M)" },
    role: "shell",
    conditions: ["moderate", "cold"],
    affiliateLinks: { amazon: "https://amzn.to/4mOCAgg" },
    tags: ["shell", "rain-jacket", "budget", "waterproof", "seam-sealed", "mandatory-gear"],
    beginnerPick: true },

  // Headwear
  {
    id: "nathan-vapor-runner-cap",
    name: "Vapor Runner Cap",
    brand: "Nathan",
    category: "apparel",
    price: 30,
    priceDisplay: "$30",
    description:
      "Lightweight trail running cap with reflective details, a moisture-wicking sweatband, and a structured brim. Sits low enough to fit under a headlamp strap without shifting.",
    whyWeRecommend:
      "Fits under a headlamp without shifting — a detail that matters on 20+ hour efforts. Moisture-wicking sweatband and reflective hits make it practical for the full race arc from hot daylight to dark night sections.",
    specs: {
      fabric: "Lightweight polyester mesh",
      upf: "30+",
      weight: "55g" },
    role: "headwear",
    conditions: ["hot", "moderate"],
    affiliateLinks: { amazon: "https://amzn.to/3QjNgY1" },
    tags: ["cap", "headlamp-compatible", "reflective", "trail-running", "headwear"] },
  {
    id: "smartwool-merino-250-cuffed-beanie",
    name: "Merino 250 Cuffed Beanie",
    brand: "Smartwool",
    category: "apparel",
    price: 40,
    priceDisplay: "$40",
    description:
      "250gsm merino cuffed beanie with a double-layer cuff for extra ear coverage in extreme cold. Heavier and warmer than the standard Merino 250 Beanie for severe conditions.",
    whyWeRecommend:
      "The double-layer cuff seals out wind around your ears in extreme cold — critical when temperatures drop below 20°F on a mountain night section. Merino stays warm even after getting damp from sweat.",
    specs: {
      fabric: "100% Merino 250gsm",
      weight: "75g" },
    role: "headwear",
    conditions: ["cold", "extreme"],
    affiliateLinks: { amazon: "https://amzn.to/4cJLFSV" },
    tags: ["beanie", "cuffed", "cold-weather", "merino", "extreme-cold", "headwear"] },

  // Gloves
  {
    id: "smartwool-liner-gloves",
    name: "Liner Gloves",
    brand: "Smartwool",
    category: "apparel",
    price: 30,
    priceDisplay: "$30",
    description:
      "Ultra-thin merino liner gloves with touchscreen fingertips. Light enough to wear all day without overheating on climbs — the minimum warmth layer for cool starts and moderate night sections.",
    whyWeRecommend:
      "Merino liner gloves are the ideal compromise — thin enough that you barely notice them on climbs but warm enough for cool starts and moderate night sections. Touchscreen compatible for watch and phone use.",
    specs: {
      fabric: "Merino wool liner weight",
      weight: "30g/pair" },
    role: "handwear",
    conditions: ["moderate", "cold"],
    affiliateLinks: { amazon: "https://amzn.to/4cJobx9" },
    tags: ["gloves", "liner", "merino", "touchscreen", "ultralight", "cool-weather"] },
  {
    id: "outdoor-research-vigor-sensor-gloves",
    name: "Vigor Midweight Sensor Gloves",
    brand: "Outdoor Research",
    category: "apparel",
    price: 39,
    priceDisplay: "$39",
    description:
      "Midweight fleece gloves with touchscreen fingertips, silicone grip palms, and a moisture-wicking liner. The step-up from liner gloves for temperatures below 35°F.",
    whyWeRecommend:
      "Midweight fleece hits the sweet spot for cold-weather ultra running — warm enough for temps below 35°F, thin enough that you can still operate your watch and pole handles without removing them.",
    specs: {
      fabric: "Midweight fleece with silicone grip palms",
      weight: "~60g/pair" },
    role: "handwear",
    conditions: ["cold", "extreme"],
    affiliateLinks: { amazon: "https://amzn.to/4mM2EbI" },
    tags: ["gloves", "midweight", "fleece", "touchscreen", "cold-weather", "grip"] },

  // Socks
  {
    id: "darn-tough-run-no-show-ultralight",
    name: "Run No-Show Tab Ultralight",
    brand: "Darn Tough",
    category: "apparel",
    price: 22,
    priceDisplay: "$22",
    description:
      "Ultralight no-show merino running sock with a tab heel and cushioned sole. Darn Tough's lightest performance sock backed by the same lifetime guarantee as their full-cushion options.",
    whyWeRecommend:
      "Ultralight merino wicks and regulates better than synthetic in hot conditions while Darn Tough's lifetime guarantee means you replace them when they wear out, not when they fall apart.",
    specs: {
      fabric: "Merino wool blend ultralight",
      weight: "Ultralight cushion, no-show" },
    role: "socks",
    conditions: ["hot", "moderate"],
    affiliateLinks: { amazon: "https://amzn.to/4sSnUy3" },
    tags: ["socks", "merino", "ultralight", "no-show", "lifetime-warranty", "hot-weather"] },
  {
    id: "smartwool-hike-full-cushion-crew",
    name: "Hike Full Cushion Crew Socks",
    brand: "Smartwool",
    category: "apparel",
    price: 26,
    priceDisplay: "$26",
    description:
      "Full-cushion merino crew sock built for long-distance hiking and ultra running. Targeted cushioning at heel and forefoot absorbs impact on technical terrain over long miles.",
    whyWeRecommend:
      "Full-cushion merino absorbs more impact than ultralight options on technical terrain — the right call for 100-mile runners whose feet need more protection late in a race than they did at the start.",
    specs: {
      fabric: "Merino wool blend",
      weight: "Full cushion, crew height" },
    role: "socks",
    conditions: ["moderate", "cold"],
    affiliateLinks: { amazon: "https://amzn.to/4cuMWgc" },
    tags: ["socks", "merino", "full-cushion", "crew", "100-mile", "impact-protection"] },
];
