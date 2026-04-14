import type { ApparelProduct } from "./types";

// ─── Centralized Apparel Product Library ────────────────────────────────────
// Sources: ApparelFinder.tsx buildOutfit(), KitBuilder.tsx buildKit(),
//          race-day-kit.ts (on-body, drop-bag, hydration-pack, post-race)

export const apparel: ApparelProduct[] = [
  // ── Base Layers ───────────────────────────────────────────────────────────

  {
    id: "patagonia-capilene-cool-daily",
    name: "Capilene Cool Daily Shirt",
    brand: "Patagonia",
    category: "apparel",
    price: 45,
    priceDisplay: "$45",
    description:
      "Ultralight moisture-wicking shirt with UPF 50+ sun protection and Polygiene odor control. Built for hot-weather trail running where heat management is everything.",
    whyWeRecommend:
      "UPF 50+ blocks sun radiation that compounds heat stress over long desert miles. The Polygiene odor control stays effective through your entire race — no synthetic funk at mile 25.",
    specs: {
      fabric: "Recycled polyester",
      upf: "50+",
      fit: "Regular",
      weight: "128g (M)" },
    role: "base-layer",
    conditions: ["hot", "moderate"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Patagonia%20Capilene%20Cool%20Daily%20Shirt&tag=finishultra-20" },
    tags: ["base-layer", "hot-weather", "upf", "lightweight", "odor-control"],
    beginnerPick: true },
  {
    id: "smartwool-merino-150-ls",
    name: "Merino 150 Long Sleeve",
    brand: "Smartwool",
    category: "apparel",
    price: 75,
    priceDisplay: "$75",
    description:
      "Lightweight 150gsm merino base layer that regulates temperature from cool starts to warm midday. Layers under a shell for overnight sections without adding bulk.",
    whyWeRecommend:
      "Temperature-regulating merino handles morning cool and afternoon warmth. It layers under a shell if temperatures drop overnight without adding bulk to your vest.",
    specs: {
      fabric: "100% Merino wool 150gsm",
      upf: "20+",
      fit: "Slim",
      weight: "198g (M)" },
    role: "base-layer",
    conditions: ["moderate", "cold"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Smartwool%20Merino%20150%20Long%20Sleeve&tag=finishultra-20" },
    tags: ["base-layer", "merino", "moderate-weather", "temperature-regulation"] },
  {
    id: "smartwool-merino-250-crew",
    name: "Merino 250 Base Layer Crew",
    brand: "Smartwool",
    category: "apparel",
    price: 100,
    priceDisplay: "$100",
    description:
      "Heavyweight 250gsm merino base layer for cold-weather ultras. Warm even when damp, naturally odor-resistant for multi-day efforts, and regulates temperature across wide output ranges.",
    whyWeRecommend:
      "Cold-weather ultras demand merino. It's warm when damp, naturally odor-resistant for multi-day efforts, and regulates temperature across the wide range of output intensities you'll experience.",
    specs: {
      fabric: "100% Merino wool 250gsm",
      fit: "Next-to-skin",
      weight: "~220g (M)" },
    role: "base-layer",
    conditions: ["cold", "extreme"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Smartwool%20Merino%20250%20Base%20Layer%20Crew&tag=finishultra-20" },
    tags: ["base-layer", "merino", "cold-weather", "heavyweight", "odor-resistant"] },
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

  {
    id: "patagonia-r1-hoody",
    name: "R1 Hoody",
    brand: "Patagonia",
    category: "apparel",
    price: 149,
    priceDisplay: "$149",
    description:
      "Polartec Power Grid fleece that breathes hard on climbs and retains warmth when you slow down. The definitive active insulation layer for extreme cold ultra running.",
    whyWeRecommend:
      "At sub-20°F, active insulation is the difference between a hard race and a dangerous one. The R1 grid fleece breathes on climbs and retains warmth when you slow down — layer under a shell for full protection.",
    specs: {
      fabric: "Polartec Power Grid fleece",
      fit: "Slim, layerable",
      weight: "297g (M)" },
    role: "mid-layer",
    conditions: ["extreme", "cold"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Patagonia%20R1%20Hoody&tag=finishultra-20" },
    tags: ["mid-layer", "fleece", "active-insulation", "extreme-cold", "breathable"] },
  {
    id: "patagonia-nano-puff-vest",
    name: "Nano Puff Vest",
    brand: "Patagonia",
    category: "apparel",
    price: 179,
    priceDisplay: "$179",
    description:
      "PrimaLoft Gold Eco insulated vest that delivers core warmth without restricting arm swing. Packs into its own hand pocket and lives in your vest until temperatures drop.",
    whyWeRecommend:
      "Core warmth without restricting arms — the ideal mid-layer for running. It packs into its own pocket and lives in your vest until temperatures drop at night or on a long descent.",
    specs: {
      fabric: "PrimaLoft Gold Eco fill, DWR shell",
      fit: "Regular",
      weight: "212g (M)" },
    role: "mid-layer",
    conditions: ["cold", "moderate"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Patagonia%20Nano%20Puff%20Vest&tag=finishultra-20" },
    tags: ["mid-layer", "insulation", "packable", "vest", "night-running"] },
  {
    id: "patagonia-r1-techface-fleece",
    name: "R1 TechFace Fleece",
    brand: "Patagonia",
    category: "apparel",
    price: 139,
    priceDisplay: "$139",
    description:
      "Lightweight fleece layer for overnight or mountain segments. Temperature drops sharply at elevation at night — having this in your final drop bag is how finishers stay finishers.",
    whyWeRecommend:
      "A drop-bag fleece for the final night push. When temperature drops sharply at elevation after midnight, having a warm layer waiting at mile 70 is the difference between finishing and shivering into a DNF.",
    specs: {
      fabric: "R1 TechFace fleece",
      fit: "Regular",
      weight: "~310g (M)" },
    role: "mid-layer",
    conditions: ["cold", "moderate"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Patagonia%20R1%20TechFace%20Fleece&tag=finishultra-20" },
    tags: ["mid-layer", "fleece", "drop-bag", "night-running", "mountain"] },
  {
    id: "patagonia-synchilla-snap-t",
    name: "Synchilla Snap-T Fleece",
    brand: "Patagonia",
    category: "apparel",
    price: 119,
    priceDisplay: "$119",
    description:
      "Warm recycled fleece pullover for post-race recovery. Your body temperature crashes at the finish line — have a dry, warm layer waiting in your finish bag.",
    whyWeRecommend:
      "Post-race body temperature crashes hard. A warm, dry fleece at the finish line is the first step in recovery — slip it on before the shivering starts and you'll feel human again faster.",
    specs: {
      fabric: "Recycled polyester Synchilla fleece",
      fit: "Relaxed",
      weight: "~400g (M)" },
    role: "recovery",
    conditions: ["cold", "moderate", "hot"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Patagonia%20Synchilla%20Snap-T%20Fleece&tag=finishultra-20" },
    tags: ["recovery", "fleece", "post-race", "warm-layer"] },

  // ── Bottoms ───────────────────────────────────────────────────────────────

  {
    id: "patagonia-strider-pro-shorts",
    name: "Strider Pro Shorts 5\"",
    brand: "Patagonia",
    category: "apparel",
    price: 65,
    priceDisplay: "$65",
    description:
      "Lightweight recycled-polyester shorts with built-in brief and secure gel pocket. The 5-inch inseam hits the sweet spot between coverage and mobility for trail running.",
    whyWeRecommend:
      "The 5-inch inseam hits the sweet spot between coverage and mobility for trail running. Built-in liner eliminates a layer and the secure gel pocket keeps nutrition accessible on the move.",
    specs: {
      fabric: "Recycled polyester",
      fit: "Regular",
      inseam: "5\"" },
    role: "bottom",
    conditions: ["hot", "moderate"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Patagonia%20Strider%20Pro%20Shorts%205%22&tag=finishultra-20" },
    tags: ["shorts", "built-in-liner", "lightweight", "hot-weather", "moderate-weather"],
    beginnerPick: true },
  {
    id: "janji-afo-middle-short",
    name: "5\" AFO Middle Short",
    brand: "Janji",
    category: "apparel",
    price: 68,
    priceDisplay: "$68",
    description:
      "Six-pocket performance shorts designed for 100-mile racing. 4-way stretch and performance liner hold up for the full distance without chafing.",
    whyWeRecommend:
      "Six accessible pockets let you carry nutrition without digging into your vest every mile — a genuine time-saver at race pace. The 4-way stretch and performance liner hold up for the full 100-mile distance.",
    specs: {
      fabric: "4-way stretch woven",
      fit: "Athletic",
      inseam: "5\"" },
    role: "bottom",
    conditions: ["hot", "moderate"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Janji%205%22%20AFO%20Middle%20Short&tag=finishultra-20" },
    tags: ["shorts", "100-mile", "pockets", "nutrition-access", "performance-liner"] },
  {
    id: "patagonia-capilene-midweight-tights",
    name: "Capilene Midweight Tights",
    brand: "Patagonia",
    category: "apparel",
    price: 89,
    priceDisplay: "$89",
    description:
      "Moisture-wicking insulating tights with flatlock seams to prevent chafing on cold-weather trail runs. Capilene 3 polyester keeps blood flowing to quads and calves.",
    whyWeRecommend:
      "Cold legs lose heat faster than any other body part during the slow miles of an ultra. Midweight Capilene keeps blood flowing to your quads and calves. Flatlock seams prevent inner-thigh chafing over 50+ miles.",
    specs: {
      fabric: "Capilene 3 polyester",
      fit: "Slim trail-running cut",
      weight: "~200g (M)" },
    role: "bottom",
    conditions: ["cold", "extreme"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Patagonia%20Capilene%20Midweight%20Tights&tag=finishultra-20" },
    tags: ["tights", "cold-weather", "flatlock-seams", "insulating"] },
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
    id: "patagonia-houdini-jacket",
    name: "Houdini Wind Jacket",
    brand: "Patagonia",
    category: "apparel",
    price: 129,
    priceDisplay: "$129",
    description:
      "98g wind and light rain jacket that packs into its own chest pocket. Required gear at most mountain ultras and worth carrying at every event.",
    whyWeRecommend:
      "The mandatory-gear staple. At 98g it disappears into your vest until you need it. Blocks wind and light rain on exposed ridgelines — the single most important piece of backup gear in your pack.",
    specs: {
      fabric: "Ripstop recycled nylon",
      fit: "Slim",
      weight: "98g (M)" },
    role: "shell",
    conditions: ["moderate", "cold"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Patagonia%20Houdini%20Wind%20Jacket&tag=finishultra-20" },
    tags: ["shell", "wind-jacket", "packable", "mandatory-gear", "ultralight"] },
  {
    id: "arcteryx-norvan-sl-hoody",
    name: "Norvan SL Hoody",
    brand: "Arc'teryx",
    category: "apparel",
    price: 299,
    priceDisplay: "$299",
    description:
      "Gore-Tex Shakedry shell that never wets out. Featherlight alpine protection that packs to nothing — the ultimate mountain-race rain jacket.",
    whyWeRecommend:
      "Alpine weather can go from 70°F to rain and hail in 20 minutes. Gore-Tex Shakedry never wets out, sheds water on contact, and weighs so little you'll forget it's in your vest until you desperately need it.",
    specs: {
      fabric: "Gore-Tex Shakedry",
      fit: "Trim, athletic",
      weight: "130g (M)" },
    role: "shell",
    conditions: ["cold", "extreme", "moderate"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Arc%27teryx%20Norvan%20SL%20Hoody&tag=finishultra-20" },
    tags: ["shell", "rain-jacket", "gore-tex", "mountain", "premium", "ultralight"] },
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
  {
    id: "patagonia-ultralight-stretch-rain-jacket",
    name: "Ultralight Stretch Rain Jacket",
    brand: "Patagonia",
    category: "apparel",
    price: 249,
    priceDisplay: "$249",
    description:
      "H2No 2.5L waterproof shell with 4-way stretch for unimpeded movement. Fully taped seams and a comfortable stretch fit for active use in sustained rain.",
    whyWeRecommend:
      "4-way stretch means this rain shell moves with you on scrambles and steep descents where rigid shells bind. H2No waterproofing is proven across thousands of mountain-race miles.",
    specs: {
      fabric: "H2No 2.5L",
      fit: "Athletic, 4-way stretch",
      weight: "210g (M)" },
    role: "shell",
    conditions: ["moderate", "cold"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Patagonia%20Ultralight%20Stretch%20Rain%20Jacket&tag=finishultra-20" },
    tags: ["shell", "rain-jacket", "stretch", "premium", "waterproof"] },

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

  {
    id: "smartwool-merino-150-gloves",
    name: "Merino 150 Gloves",
    brand: "Smartwool",
    category: "apparel",
    price: 40,
    priceDisplay: "$40",
    description:
      "Lightweight merino gloves with touchscreen compatibility. Easy to wear all night on cold starts and night sections without overheating on climbs.",
    whyWeRecommend:
      "Lightweight merino warmth with touchscreen compatibility — easy to wear all night. Cover your hands for cold starts and night sections without overheating when you're working hard on climbs.",
    specs: {
      fabric: "Merino 150gsm blend",
      weight: "48g/pair" },
    role: "handwear",
    conditions: ["cold", "moderate"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Smartwool%20Merino%20150%20Gloves&tag=finishultra-20" },
    tags: ["gloves", "merino", "touchscreen", "night-running", "cold-weather"] },
  {
    id: "black-diamond-mercury-mitts",
    name: "Mercury Mitts",
    brand: "Black Diamond",
    category: "apparel",
    price: 45,
    priceDisplay: "$45",
    description:
      "Alpine-grade mitts with PrimaLoft Gold insulation and Pertex Quantum windproof shell. Maximum warmth for sub-20°F conditions.",
    whyWeRecommend:
      "Sub-20°F Alpine conditions make cold hands the most dangerous comfort factor in ultra running. Mercury Mitts provide maximum warmth for extreme cold — when cold hands slow you down, everything slows down.",
    specs: {
      fabric: "PrimaLoft Gold insulation, Pertex Quantum shell",
      weight: "72g/pair" },
    role: "handwear",
    conditions: ["extreme"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Black%20Diamond%20Mercury%20Mitts&tag=finishultra-20" },
    tags: ["mitts", "extreme-cold", "alpine", "insulated", "windproof"] },

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
    id: "darn-tough-run-endure-crew",
    name: "Run Endure Crew",
    brand: "Darn Tough",
    category: "apparel",
    price: 26,
    priceDisplay: "$26",
    description:
      "Extra-cushion crew sock with seamless toe for blister-prone runners. Lifetime warranty and merino wool for natural blister resistance.",
    whyWeRecommend:
      "Blister-prone runners need the extra cushion of the Endure Crew. The seamless toe construction eliminates the single biggest cause of blisters. Lifetime warranty means these are a long-term investment.",
    specs: {
      fabric: "Merino wool blend",
      weight: "Medium cushion" },
    role: "socks",
    conditions: ["hot", "moderate", "cold"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Darn%20Tough%20Run%20Endure%20Crew&tag=finishultra-20" },
    tags: ["socks", "merino", "cushion", "blister-prone", "lifetime-warranty"] },
  {
    id: "smartwool-merino-outdoor-medium-crew",
    name: "Merino Outdoor Medium Crew",
    brand: "Smartwool",
    category: "apparel",
    price: 26,
    priceDisplay: "$26",
    description:
      "Merino cushioning sock for cold weather — warm even when slightly damp. Absorbs impact on long descents.",
    whyWeRecommend:
      "Merino wool stays warm even when damp — critical when stream crossings and snow patches are inevitable on cold-weather courses. The cushioning absorbs impact on long descents.",
    specs: {
      fabric: "Merino wool blend",
      weight: "Medium cushion" },
    role: "socks",
    conditions: ["cold", "extreme"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Smartwool%20Merino%20Outdoor%20Medium%20Crew&tag=finishultra-20" },
    tags: ["socks", "merino", "cold-weather", "cushion"] },
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
  {
    id: "darn-tough-trail-running-3pack",
    name: "Trail Running Sock 3-Pack",
    brand: "Darn Tough",
    category: "apparel",
    price: 66,
    priceDisplay: "$66",
    description:
      "Merino wool socks with a lifetime guarantee. Pack 3 pairs in drop bags so you always have dry socks — the cheapest performance upgrade in ultras.",
    whyWeRecommend:
      "Dry socks at drop bags are the cheapest performance upgrade in ultras. Three pairs with a lifetime guarantee means you never worry about socks again.",
    specs: {
      fabric: "Merino wool blend",
      weight: "Light cushion" },
    role: "socks",
    conditions: ["hot", "moderate", "cold"],
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Darn%20Tough%20Trail%20Running%20Sock%203-Pack&tag=finishultra-20" },
    tags: ["socks", "merino", "drop-bag", "multi-pack", "lifetime-warranty"] },
];
