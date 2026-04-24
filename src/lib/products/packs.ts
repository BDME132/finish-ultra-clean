import type { PackProduct } from "./types";

// ─── Centralized Pack / Vest Product Data ───────────────────────────────────
//
// Merged from:
//   - src/app/gear/packs/page.tsx      (rich specs, ratings, pros/cons, reviews)
//   - src/app/gear/packs/VestFinder.tsx (finderTags, blurbs)
//   - src/app/gear/kits/KitBuilder.tsx  (additional budget/KitBuilder-only packs)
//
// Every pack that appears in any source file lives here exactly once.

export const packs: PackProduct[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // RACE VESTS (5–8 L)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "salomon-adv-skin-5",
    name: "ADV Skin 5 Set",
    brand: "Salomon",
    category: "packs",
    subcategory: "race",
    price: 160,
    priceDisplay: "$160",
    description:
      "The benchmark race vest. Skin-tight SensiFit hugs your body with zero bounce. Two 500ml soft flasks included. The go-to choice for elite ultra runners worldwide.",
    whyWeRecommend:
      "The most proven race vest in ultra running — SensiFit eliminates bounce and 16 pockets keep everything organized.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/47PXJA2" },
    tags: ["50K race day", "Fast 50M efforts", "Minimalist training", "50K", "50 Miles", "5L"],
    beginnerPick: false,
    specs: {
      weight: "161g",
      capacity: "5L",
      genderFit: "Unisex",
      sizes: "XS–XL",
      frontPockets: "4 front pockets + 2 soft flask pockets",
      backStorage: "3L main + 2L extra",
      hydrationSystem: "2× 500ml soft flasks included",
      poleCarry: true,
      whistle: true,
      bladderCompatible: true,
      includedFlasks: "2× 500ml" },
    ratings: {
      comfort: 5,
      bounce: 5,
      breathability: 5,
      loadDistribution: 4,
      easeOfAccess: 5,
      durability: 4 },
    finderTags: {
      distance: ["50k", "50m"],
      build: ["small", "average"],
      capacity: ["under5", "5to8"],
      hydration: ["flasks", "both"],
      priority: ["bounce", "light", "access"] },
    bestFor: ["50K race day", "Fast 50M efforts", "Minimalist training"],
    distances: ["50K", "50 Miles"],
    pros: [
      "SensiFit body-hugging design eliminates bounce entirely",
      "Two 500ml flasks included — ready to run out of the box",
      "16 pockets in a 5L vest — exceptional organization",
      "Pole carry stow-on-the-go system",
    ],
    cons: [
      "Very snug fit — not comfortable for larger chest/shoulder runners",
      "5L is limiting for races with extensive mandatory gear",
    ],
    review: {
      quote:
        "I've done 12 ultras in the ADV Skin 5. It disappears on my body — I literally forget it's there at mile 40.",
      race: "UTMB OCC",
      runner: "Verified 50K finisher" } },

  {
    id: "ud-race-vest-6",
    name: "Race Vest 6.0",
    brand: "Ultimate Direction",
    category: "packs",
    subcategory: "race",
    price: 130,
    priceDisplay: "$130",
    description:
      "UD's flagship race vest. Kangaroo front pocket fits everything you need for a 50K. Comfort Cinch straps eliminate bounce while keeping the design minimal.",
    whyWeRecommend:
      "Best value race vest on the market with the game-changing kangaroo front pocket for instant access to nutrition.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/3NpYeKo" },
    tags: [
      "Versatile 50K-50M",
      "Kangaroo-style access",
      "Value-conscious racers",
      "50K",
      "50 Miles",
      "6L",
    ],
    beginnerPick: false,
    specs: {
      weight: "185g",
      capacity: "6L",
      genderFit: "Unisex (Women's version available)",
      sizes: "XS–XL",
      frontPockets: "Kangaroo pouch + 2 flask pockets",
      backStorage: "4L main compartment",
      hydrationSystem: "Compatible with 2L bladder or soft flasks",
      poleCarry: true,
      whistle: true,
      bladderCompatible: true,
      includedFlasks: "None (sold separately)" },
    ratings: {
      comfort: 4,
      bounce: 4,
      breathability: 4,
      loadDistribution: 4,
      easeOfAccess: 5,
      durability: 4 },
    finderTags: {
      distance: ["50k", "50m"],
      build: ["average", "large"],
      capacity: ["5to8"],
      hydration: ["flasks", "both"],
      priority: ["bounce", "access", "versatility"] },
    bestFor: [
      "Versatile 50K-50M",
      "Runners preferring kangaroo-style access",
      "Value-conscious racers",
    ],
    distances: ["50K", "50 Miles"],
    pros: [
      "Comfort Cinch straps self-adjust mid-run",
      "Large kangaroo front pocket fits phone, gels, jacket",
      "Best value race vest on the market",
      "Excellent fit range across body types",
    ],
    cons: [
      "No flasks included",
      "Back panel less breathable than Salomon",
      "Pole stowage system less refined",
    ],
    review: {
      quote:
        "The kangaroo pocket is game-changing. Everything I need is one motion away — no fumbling at aid stations.",
      race: "Lake Sonoma 50",
      runner: "Verified finisher" } },


  {
    id: "nathan-pinnacle-4",
    name: "Pinnacle 4L",
    brand: "Nathan",
    category: "packs",
    subcategory: "race",
    price: 120,
    priceDisplay: "$120",
    description:
      "Featherlight 4L vest for supported 50Ks. Dual 20oz Exoshot flasks in angled front pockets make drinking on the move completely natural.",
    whyWeRecommend:
      "The best hot-weather race vest with angled Exoshot flasks that make drinking at speed effortless.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/4bObB06" },
    tags: ["Supported 50Ks", "Minimalist racers", "Warm weather events", "50K", "4L"],
    beginnerPick: false,
    specs: {
      weight: "198g",
      capacity: "4L",
      genderFit: "Unisex",
      sizes: "XS–XL",
      frontPockets: "2 angled Exoshot flask pockets + 1 zip pocket",
      backStorage: "2L main + 2L side",
      hydrationSystem: "2× 20oz Exoshot flasks included",
      poleCarry: false,
      whistle: true,
      bladderCompatible: false,
      includedFlasks: "2× 20oz Exoshot" },
    ratings: {
      comfort: 4,
      bounce: 5,
      breathability: 5,
      loadDistribution: 3,
      easeOfAccess: 5,
      durability: 4 },
    finderTags: {
      distance: ["50k"],
      build: ["small", "average"],
      capacity: ["under5"],
      hydration: ["flasks"],
      priority: ["light", "bounce"] },
    bestFor: ["Supported 50Ks", "Minimalist racers", "Warm weather events"],
    distances: ["50K"],
    pros: [
      "Angled Exoshot flask holders make drinking completely natural",
      "Featherlight at 198g",
      "Excellent breathability for hot weather racing",
      "Included flasks make it great out of the box value",
    ],
    cons: [
      "4L is strictly for short, supported races",
      "No bladder compatibility limits hydration options",
      "Limited pole carry",
    ],
    review: {
      quote:
        "For supported 50Ks in hot weather, nothing comes close. The angled flasks are the best drinking system I've used.",
      race: "Javelina 50K",
      runner: "Verified finisher" } },

  // ═══════════════════════════════════════════════════════════════════════════
  // ALL-AROUND VESTS (8–12 L)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "salomon-adv-skin-12",
    name: "ADV Skin 12 Set",
    brand: "Salomon",
    category: "packs",
    subcategory: "allround",
    price: 200,
    priceDisplay: "$200",
    description:
      "The full-distance Salomon workhorse. 12L of organized storage, SensiFit, two included 500ml flasks, and enough pockets for 100-mile mandatory gear. The most trusted vest in ultra running.",
    whyWeRecommend:
      "The most trusted vest in ultra running — worn by more elites than any other, with 12L that still feels like a race vest.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/47apuDo" },
    tags: [
      "50M to 100M races",
      "UTMB mandatory gear",
      "High-volume training",
      "50 Miles",
      "100K",
      "100 Miles",
      "12L",
    ],
    beginnerPick: true,
    specs: {
      weight: "280g",
      capacity: "12L",
      genderFit: "Unisex (Women's version available)",
      sizes: "XS–XL",
      frontPockets: "6 front pockets + 2 flask sleeves",
      backStorage: "6L main + 4L extra + 2 side pockets",
      hydrationSystem: "2× 500ml flasks included + 2L bladder compatible",
      poleCarry: true,
      whistle: true,
      bladderCompatible: true,
      includedFlasks: "2× 500ml" },
    ratings: {
      comfort: 5,
      bounce: 5,
      breathability: 4,
      loadDistribution: 5,
      easeOfAccess: 5,
      durability: 5 },
    finderTags: {
      distance: ["50m", "100k", "100m"],
      build: ["small", "average", "large"],
      capacity: ["8to12"],
      hydration: ["flasks", "both"],
      priority: ["bounce", "access", "versatility"] },
    bestFor: ["50M to 100M races", "UTMB mandatory gear", "High-volume training"],
    distances: ["50 Miles", "100K", "100 Miles"],
    pros: [
      "The most trusted vest in ultra running — worn by more elites than any other",
      "12L with SensiFit still feels like a race vest",
      "20+ pockets with logical organization system",
      "Stow-on-the-go pole carry works flawlessly",
      "Included 500ml flasks are excellent quality",
    ],
    cons: [
      "Premium price at $200",
      "Salomon's sizing runs very snug — try before buying",
    ],
    review: {
      quote:
        "The ADV Skin 12 has been on my back for four Western States, two UTMBs, and countless training runs. It just works.",
      race: "UTMB",
      runner: "Verified multi-100 finisher" } },

  {
    id: "osprey-duro-6",
    name: "Duro 6 / Dyna 6",
    brand: "Osprey",
    category: "packs",
    subcategory: "allround",
    price: 140,
    priceDisplay: "$140",
    description:
      "Osprey's trail running vest with AirScape back panel for breathability. Lifetime warranty. The Dyna is women's-specific with adjusted shoulder and chest geometry.",
    whyWeRecommend:
      "Osprey's lifetime warranty and gender-specific fit make this the most breathable and long-lasting all-around vest.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/47QUisV" },
    tags: [
      "Training runs",
      "50K to 50M",
      "Bladder hydration",
      "50K",
      "50 Miles",
      "6L",
    ],
    beginnerPick: false,
    specs: {
      weight: "312g",
      capacity: "6L",
      genderFit: "Men's (Duro) / Women's (Dyna)",
      sizes: "XS–XL",
      frontPockets: "2 front stretch pockets",
      backStorage: "4L main + bladder sleeve",
      hydrationSystem: "2.5L Hydraulics reservoir included",
      poleCarry: false,
      whistle: false,
      bladderCompatible: true,
      includedFlasks: "None (2.5L bladder included)" },
    ratings: {
      comfort: 4,
      bounce: 4,
      breathability: 5,
      loadDistribution: 4,
      easeOfAccess: 3,
      durability: 5 },
    finderTags: {
      distance: ["50k", "50m"],
      build: ["average", "large", "broad"],
      capacity: ["5to8"],
      hydration: ["bladder", "both"],
      priority: ["bounce", "versatility"] },
    bestFor: ["Training runs", "50K to 50M", "Runners preferring bladder hydration"],
    distances: ["50K", "50 Miles"],
    pros: [
      "AirScape back panel is the most breathable in this category",
      "Lifetime warranty — Osprey will repair or replace forever",
      "Gender-specific fit is genuinely better for both men and women",
      "Excellent durability reputation",
    ],
    cons: [
      "Bladder-focused design means front flask access is secondary",
      "No pole carry system",
      "Heavier than Salomon or UD equivalents",
    ],
    review: {
      quote:
        "The Dyna fits my chest properly — first vest that doesn't gap or slip. Osprey's women's-specific design is real, not just marketing.",
      race: "Black Hills 50K",
      runner: "Verified finisher" } },

  {
    id: "nathan-vaporkrar-12",
    name: "VaporKrar 12L",
    brand: "Nathan",
    category: "packs",
    subcategory: "allround",
    price: 160,
    priceDisplay: "$160",
    description:
      "Designed with Rob Krar. Wide front pockets, massive back storage, and enough organizational pockets to handle 100-mile mandatory gear requirements.",
    whyWeRecommend:
      "Rob Krar's signature vest delivers wide front pockets and 12L capacity at a better price than the Salomon ADV Skin 12.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/4uBMOUm" },
    tags: [
      "100K to 100M with mandatory gear",
      "Wide pockets",
      "High nutrition access",
      "50 Miles",
      "100K",
      "100 Miles",
      "12L",
    ],
    beginnerPick: false,
    specs: {
      weight: "290g",
      capacity: "12L",
      genderFit: "Unisex (Women's version available)",
      sizes: "XS–XL",
      frontPockets: "2 wide front pockets + 2 zip pockets",
      backStorage: "8L main compartment",
      hydrationSystem: "Compatible with flasks + 2L bladder",
      poleCarry: true,
      whistle: true,
      bladderCompatible: true,
      includedFlasks: "None" },
    ratings: {
      comfort: 4,
      bounce: 4,
      breathability: 4,
      loadDistribution: 4,
      easeOfAccess: 5,
      durability: 4 },
    finderTags: {
      distance: ["50m", "100k", "100m"],
      build: ["average", "large", "broad"],
      capacity: ["8to12"],
      hydration: ["flasks", "both"],
      priority: ["access", "capacity", "versatility"] },
    bestFor: [
      "100K to 100M with mandatory gear",
      "Runners needing wide pockets",
      "High nutrition access priority",
    ],
    distances: ["50 Miles", "100K", "100 Miles"],
    pros: [
      "Rob Krar designed — optimized for 100-mile racing demands",
      "Wide front pockets fit larger phones and more nutrition",
      "12L handles most race mandatory gear requirements",
      "Good value vs. Salomon at similar capacity",
    ],
    cons: [
      "Flasks not included",
      "Fit is looser than Salomon — can bounce more if not dialed",
      "Pole carry less secure than Black Diamond",
    ],
    review: {
      quote:
        "Rob Krar races Hardrock in this thing. That's all the endorsement I need. Front pockets fit everything I need for a 100-mile push.",
      race: "Cascade Crest 100",
      runner: "Verified finisher" } },

  {
    id: "black-diamond-distance-8",
    name: "Distance 8",
    brand: "Black Diamond",
    category: "packs",
    subcategory: "allround",
    price: 130,
    priceDisplay: "$130",
    description:
      "Built by mountaineers for trail runners. Exceptional trekking pole stowage, alpine heritage durability, and Z-pole carry compatibility. Perfect for mountain ultras.",
    whyWeRecommend:
      "The best trekking pole carry system in the category, backed by Black Diamond's alpine-grade durability.",
    image: undefined,
    affiliateLinks: { amazon: "#" },
    tags: [
      "Mountain ultras",
      "Trekking pole users",
      "Technical terrain races",
      "50K",
      "50 Miles",
      "100K",
      "8L",
    ],
    beginnerPick: false,
    specs: {
      weight: "248g",
      capacity: "8L",
      genderFit: "Unisex",
      sizes: "S–XL",
      frontPockets: "2 front stretch pockets + 2 zip pockets",
      backStorage: "6L main + side pockets",
      hydrationSystem: "Bladder sleeve + soft flask compatible",
      poleCarry: true,
      whistle: false,
      bladderCompatible: true,
      includedFlasks: "None" },
    ratings: {
      comfort: 4,
      bounce: 4,
      breathability: 4,
      loadDistribution: 5,
      easeOfAccess: 4,
      durability: 5 },
    finderTags: {
      distance: ["50k", "50m", "100k"],
      build: ["average", "large"],
      capacity: ["5to8", "8to12"],
      hydration: ["flasks", "bladder"],
      priority: ["poles", "versatility", "bounce"] },
    bestFor: ["Mountain ultras", "Trekking pole users", "Technical terrain races"],
    distances: ["50K", "50 Miles", "100K"],
    pros: [
      "Best trekking pole carry system in the category — Z-pole compatible",
      "Alpine-grade durability from BD's mountaineering heritage",
      "Excellent load distribution for heavier packs",
      "Best value at $130 for the features offered",
    ],
    cons: [
      "Less organized pocket system than Salomon",
      "No whistle included",
      "Less body-hugging than ADV Skin series",
    ],
    review: {
      quote:
        "I carry poles for every mountain ultra. The BD Distance 8 is the only vest where I can grab and stow poles without stopping.",
      race: "Waldo 100K",
      runner: "Verified finisher" } },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPEDITION / 100-MILE VESTS (12 L+)
  // ═══════════════════════════════════════════════════════════════════════════


  {
    id: "ud-fastpack-25",
    name: "Fastpack 25",
    brand: "Ultimate Direction",
    category: "packs",
    subcategory: "expedition",
    price: 200,
    priceDisplay: "$200",
    description:
      "The self-supported ultra pack. 25L swallows mandatory gear, a down jacket, and everything you need for a multi-day stage race. Built for runners who are out there alone.",
    whyWeRecommend:
      "The only running vest that genuinely works for multi-day stage races and self-supported expeditions.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/3NmjZe7" },
    tags: [
      "Multi-day stage races",
      "Self-supported expeditions",
      "Races with overnight gear",
      "100 Miles",
      "Multi-day",
      "25L",
    ],
    beginnerPick: false,
    specs: {
      weight: "560g",
      capacity: "25L",
      genderFit: "Unisex",
      sizes: "XS–XL",
      frontPockets: "2 front pockets + 2 zip pockets",
      backStorage: "20L main + side pockets",
      hydrationSystem: "2L bladder compatible + flask pockets",
      poleCarry: true,
      whistle: true,
      bladderCompatible: true,
      includedFlasks: "None" },
    ratings: {
      comfort: 3,
      bounce: 3,
      breathability: 3,
      loadDistribution: 5,
      easeOfAccess: 4,
      durability: 5 },
    finderTags: {
      distance: ["100m", "multiday"],
      build: ["average", "large", "broad"],
      capacity: ["12plus"],
      hydration: ["bladder", "both"],
      priority: ["capacity", "poles", "weather"] },
    bestFor: [
      "Multi-day stage races",
      "Self-supported expeditions",
      "Races with overnight gear",
    ],
    distances: ["100 Miles", "Multi-day"],
    pros: [
      "25L genuinely accommodates sleeping gear for stage races",
      "Exceptional load distribution for heavy packs",
      "UD's durability is industry-leading",
      "Compression system keeps load stable at speed",
    ],
    cons: [
      "560g is heavy compared to race vests",
      "Overkill for single-day 100-milers with crew",
      "Noticeably more bounce than smaller vests when full",
    ],
    review: {
      quote:
        "PTL requires carrying a sleeping bag, bivy, and two days of food. The Fastpack 25 is the only running vest that actually works for that.",
      race: "Petite Trotte a Leon (PTL)",
      runner: "Verified finisher" } },


  // ═══════════════════════════════════════════════════════════════════════════
  // MINIMALIST VESTS (Under 5 L)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "salomon-pulse-2",
    name: "Pulse 2 Set",
    brand: "Salomon",
    category: "packs",
    subcategory: "minimalist",
    price: 80,
    priceDisplay: "$80",
    description:
      "Barely there. 100g barely registers on your body. Two 500ml flasks, a small back pocket for a jacket, and nothing else. For supported 50Ks when every gram counts.",
    whyWeRecommend:
      "At 100g with flasks included for $80, this is the ultimate minimalist vest for supported 50Ks.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/4rJgSuN" },
    tags: [
      "Supported 50Ks",
      "Elite racers",
      "Warm weather minimalist running",
      "50K",
      "2L",
    ],
    beginnerPick: false,
    specs: {
      weight: "100g",
      capacity: "2L",
      genderFit: "Unisex",
      sizes: "XS–XL",
      frontPockets: "2 flask pockets + 1 small zip",
      backStorage: "1L back pocket",
      hydrationSystem: "2× 500ml flasks included",
      poleCarry: false,
      whistle: false,
      bladderCompatible: false,
      includedFlasks: "2× 500ml" },
    ratings: {
      comfort: 5,
      bounce: 5,
      breathability: 5,
      loadDistribution: 3,
      easeOfAccess: 4,
      durability: 3 },
    finderTags: {
      distance: ["50k"],
      build: ["small", "average"],
      capacity: ["under5"],
      hydration: ["flasks"],
      priority: ["light", "bounce"] },
    bestFor: ["Supported 50Ks", "Elite racers", "Warm weather minimalist running"],
    distances: ["50K"],
    pros: [
      "100g — you will genuinely forget you're wearing a vest",
      "Two 500ml flasks included at an $80 price point",
      "Salomon's SensiFit body-mapping even in this minimalist form",
    ],
    cons: [
      "2L is only suitable for supported races with close aid stations",
      "No mandatory gear capacity",
      "Not durable enough for heavy training use",
    ],
    review: {
      quote:
        "I wore this at a road 50K and felt like I was running in just a singlet. Total weight including flasks was barely 300g.",
      race: "California International 50K",
      runner: "Verified finisher" } },

  {
    id: "omm-trailfire",
    name: "TrailFire",
    brand: "OMM",
    category: "packs",
    subcategory: "minimalist",
    price: 100,
    priceDisplay: "$100",
    description:
      "British ultra racing heritage. Ultra-minimal design with an innovative flat-pack construction. No wasted material — just what you need and nothing more.",
    whyWeRecommend:
      "OMM's fell running pedigree in a barely-there 118g vest with innovative flat-pack construction.",
    image: undefined,
    affiliateLinks: { amazon: "#" },
    tags: [
      "Fell/mountain racing",
      "British ultra circuit",
      "Minimalist 50K racing",
      "50K",
      "4L",
    ],
    beginnerPick: false,
    specs: {
      weight: "118g",
      capacity: "4L",
      genderFit: "Unisex",
      sizes: "XS–XL",
      frontPockets: "2 flask pockets + 1 flat pocket",
      backStorage: "3L flat storage",
      hydrationSystem: "Soft flask compatible",
      poleCarry: false,
      whistle: true,
      bladderCompatible: false,
      includedFlasks: "None" },
    ratings: {
      comfort: 4,
      bounce: 5,
      breathability: 5,
      loadDistribution: 3,
      easeOfAccess: 4,
      durability: 4 },
    finderTags: {
      distance: ["50k"],
      build: ["small", "average"],
      capacity: ["under5"],
      hydration: ["flasks"],
      priority: ["light", "bounce"] },
    bestFor: ["Fell/mountain racing", "British ultra circuit", "Minimalist 50K racing"],
    distances: ["50K"],
    pros: [
      "OMM's fell running heritage — built for conditions, not comfort",
      "Flat-pack design sits incredibly close to the body",
      "British ultra racing pedigree",
      "Whistle integrated",
    ],
    cons: [
      "No flasks included",
      "4L is restrictive for anything with mandatory gear",
      "Limited availability outside UK market",
    ],
    review: {
      quote:
        "The fell running community has trusted OMM for decades. The TrailFire is as minimal as a vest can get while still being functional.",
      race: "Lakeland 50",
      runner: "Verified finisher" } },

  // ═══════════════════════════════════════════════════════════════════════════
  // KITBUILDER-ONLY PACKS (from src/app/gear/kits/KitBuilder.tsx)
  // ═══════════════════════════════════════════════════════════════════════════


  // ═══════════════════════════════════════════════════════════════════════════
  // NEW ADDITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "osprey-duro-15",
    name: "Duro 15",
    brand: "Osprey",
    category: "packs",
    subcategory: "allround",
    price: 130,
    priceDisplay: "$130",
    description:
      "Lightweight 15L trail running pack with 2.5L reservoir sleeve, front stash pocket, and Osprey's lifetime guarantee. Bridges the gap between a race vest and a day pack for high mandatory-gear races.",
    whyWeRecommend:
      "Osprey's lifetime warranty and 15L capacity make the Duro a reliable all-around training and long-distance racing pack — enough room for mandatory gear without weighing you down.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/3ORWwlG" },
    tags: ["allround", "training", "50M-100K", "bladder compatible", "50 Miles", "100K", "15L"],
    beginnerPick: true,
    specs: {
      weight: "450g",
      capacity: "15L",
      genderFit: "Unisex",
      frontPockets: "2 front pockets + hipbelt pockets",
      hydrationSystem: "2.5L reservoir sleeve included",
      bladderCompatible: true,
      includedFlasks: "None" },
    finderTags: {
      distance: ["50m", "100k", "100m"],
      build: ["average", "large", "broad"],
      capacity: ["8to12", "10to20"],
      hydration: ["bladder", "both"],
      priority: ["capacity", "versatility"] },
    bestFor: ["Long training runs with mandatory gear", "50M-100K racing", "Budget-friendly all-arounder"],
    distances: ["50 Miles", "100K", "100 Miles"] },

  {
    id: "nathan-vapor-airess-7l",
    name: "Vapor Airess 7L",
    brand: "Nathan",
    category: "packs",
    subcategory: "race",
    price: 160,
    priceDisplay: "$160",
    description:
      "Women's-specific 7L race vest with anatomical fit, a breathable AirMesh back panel, and front soft-flask pockets. Designed to eliminate bounce for female runners at race pace.",
    whyWeRecommend:
      "A truly women's-specific race vest is rare — the Vapor Airess delivers anatomical fit, bounce-free carry, and 7L of organized storage for 50K to 100K efforts.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/4u7pkWp" },
    tags: ["women's", "race vest", "7L", "bounce-free", "50K", "100K"],
    beginnerPick: false,
    specs: {
      weight: "255g",
      capacity: "7L",
      genderFit: "Women's",
      sizes: "XS–XL",
      frontPockets: "4 front pockets + 2 soft flask pockets",
      backStorage: "5L main compartment",
      hydrationSystem: "2× 600ml soft flasks compatible",
      poleCarry: true,
      whistle: true,
      bladderCompatible: true,
      includedFlasks: "None" },
    finderTags: {
      distance: ["50k", "50m", "100k"],
      build: ["small", "average"],
      capacity: ["5to8"],
      hydration: ["flasks", "both"],
      priority: ["bounce", "access", "light"] },
    bestFor: ["Women's race-day carry", "50K-100K efforts", "Anatomically fitted vest seekers"],
    distances: ["50K", "50 Miles", "100K"] },

  {
    id: "ud-ultra-vest-5",
    name: "Ultra Vest 5.0",
    brand: "Ultimate Direction",
    category: "packs",
    subcategory: "race",
    price: 120,
    priceDisplay: "$120",
    description:
      "Minimalist 5L race vest with body-mapped stretch construction and front flask pockets. Ultimate Direction's most dialed-in race vest for competitive 50K and 50-mile efforts.",
    whyWeRecommend:
      "Body-mapped stretch eliminates bounce with no adjustment needed. At 5L it carries your race essentials without bulk — the choice for runners prioritizing a dialed fit over max capacity.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/4e18RhJ" },
    tags: ["race vest", "5L", "minimalist", "50K", "50 miles", "body-mapped"],
    beginnerPick: false,
    specs: {
      weight: "240g",
      capacity: "5L",
      genderFit: "Unisex",
      sizes: "XS–XL",
      frontPockets: "2 front flask pockets + 4 accessory pockets",
      backStorage: "4L main compartment",
      hydrationSystem: "Soft flask compatible",
      poleCarry: true,
      whistle: false,
      bladderCompatible: false,
      includedFlasks: "None" },
    finderTags: {
      distance: ["50k", "50m"],
      build: ["small", "average", "large"],
      capacity: ["under5", "5to8"],
      hydration: ["flasks"],
      priority: ["bounce", "light"] },
    bestFor: ["50K race day", "Competitive 50-mile efforts", "Minimalist fit-focused runners"],
    distances: ["50K", "50 Miles"] },

  {
    id: "salomon-active-skin-4",
    name: "Active Skin 4 Set",
    brand: "Salomon",
    category: "packs",
    subcategory: "race",
    price: 130,
    priceDisplay: "$130",
    description:
      "Ultra-minimal 4L race vest with SensiFit body-hugging design and two included 500ml soft flasks. The lightest Salomon vest for short-distance racing and fast training days.",
    whyWeRecommend:
      "At just 4L and under 120g, the Active Skin 4 is for runners who want the minimum viable vest for 50K efforts — SensiFit eliminates bounce while two included flasks keep you hydrated.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/48elmCK" },
    tags: ["race vest", "4L", "ultra-minimalist", "50K", "SensiFit", "included flasks"],
    beginnerPick: false,
    specs: {
      weight: "119g",
      capacity: "4L",
      genderFit: "Unisex",
      sizes: "XS–XL",
      frontPockets: "3 front pockets + 2 soft flask pockets",
      backStorage: "2L main compartment",
      hydrationSystem: "2× 500ml soft flasks included",
      poleCarry: true,
      whistle: true,
      bladderCompatible: false,
      includedFlasks: "2× 500ml" },
    finderTags: {
      distance: ["50k"],
      build: ["small", "average"],
      capacity: ["under5"],
      hydration: ["flasks"],
      priority: ["bounce", "light"] },
    bestFor: ["50K race day", "Fast training runs", "Minimalist vest seekers"],
    distances: ["50K"] },

  {
    id: "camelbak-zephyr-pro-16",
    name: "Zephyr Pro 16",
    brand: "CamelBak",
    category: "packs",
    subcategory: "allround",
    price: 180,
    priceDisplay: "$180",
    description:
      "16L hydration vest with included 2L Crux reservoir, front flask pockets, and a structured back panel for load stability. CamelBak's flagship trail running vest for long-distance carrying capacity.",
    whyWeRecommend:
      "16L of capacity with a 2L bladder and front flask pockets covers mandatory gear, nutrition, and extra layers for 50-mile to 100-mile efforts in a well-organized, stable package.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/4vKKaMQ" },
    tags: ["allround", "16L", "bladder", "50M-100M", "structured", "high-capacity"],
    beginnerPick: false,
    specs: {
      weight: "460g",
      capacity: "16L",
      genderFit: "Unisex",
      sizes: "S/M, M/L",
      frontPockets: "2 front pockets + hipbelt pockets",
      backStorage: "14L + 2L reservoir",
      hydrationSystem: "2L Crux reservoir included",
      poleCarry: true,
      whistle: true,
      bladderCompatible: true,
      includedFlasks: "None" },
    finderTags: {
      distance: ["50m", "100k", "100m"],
      build: ["average", "large", "broad"],
      capacity: ["10to20"],
      hydration: ["bladder", "both"],
      priority: ["capacity", "versatility"] },
    bestFor: ["50-mile to 100-mile racing", "High mandatory gear requirements", "Bladder-preferred runners"],
    distances: ["50 Miles", "100K", "100 Miles"] },

  {
    id: "ud-fastpack-20",
    name: "Fastpack 20",
    brand: "Ultimate Direction",
    category: "packs",
    subcategory: "allround",
    price: 200,
    priceDisplay: "$200",
    description:
      "20L technical trail pack with a structured back panel, hipbelt pockets, and top-loader access. The go-to for mountain ultras with extensive mandatory gear lists.",
    whyWeRecommend:
      "20L of organized capacity handles the most demanding mandatory gear lists for mountain 100s — a structured back panel distributes heavy loads efficiently over long mountain miles.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/4criFjT" },
    tags: ["training pack", "20L", "mountain", "100-mile", "high-capacity", "structured"],
    beginnerPick: false,
    specs: {
      weight: "560g",
      capacity: "20L",
      genderFit: "Unisex",
      sizes: "S/M, M/L",
      frontPockets: "2 front pockets + hipbelt pockets",
      backStorage: "18L main + 2L top",
      hydrationSystem: "Reservoir sleeve included",
      poleCarry: true,
      whistle: true,
      bladderCompatible: true,
      includedFlasks: "None" },
    finderTags: {
      distance: ["100k", "100m"],
      build: ["average", "large", "broad"],
      capacity: ["10to20"],
      hydration: ["bladder", "both"],
      priority: ["capacity"] },
    bestFor: ["Mountain 100-mile racing", "Heavy mandatory gear races", "Multi-day ultra efforts"],
    distances: ["100K", "100 Miles"] },

  {
    id: "nathan-pinnacle-12l",
    name: "Pinnacle 12L",
    brand: "Nathan",
    category: "packs",
    subcategory: "allround",
    price: 145,
    priceDisplay: "$145",
    description:
      "12L training and racing vest with 2L reservoir compatibility, dual front soft-flask pockets, and Nathan's QuickShot flask system. A well-organized mid-capacity option for 50M-100K runners.",
    whyWeRecommend:
      "12L of capacity, front flask pockets, and bladder compatibility in one package — the Pinnacle gives runners the flexibility to switch between flasks and bladder depending on race requirements.",
    image: undefined,
    affiliateLinks: { amazon: "https://amzn.to/4sLRiG4" },
    tags: ["allround", "12L", "50M-100K", "bladder compatible", "training", "QuickShot"],
    beginnerPick: true,
    specs: {
      weight: "380g",
      capacity: "12L",
      genderFit: "Unisex",
      sizes: "XS–XL",
      frontPockets: "2 soft flask pockets + 4 accessory pockets",
      backStorage: "10L main compartment",
      hydrationSystem: "2L reservoir compatible",
      poleCarry: false,
      whistle: true,
      bladderCompatible: true,
      includedFlasks: "None" },
    finderTags: {
      distance: ["50m", "100k"],
      build: ["average", "large"],
      capacity: ["8to12"],
      hydration: ["flasks", "bladder", "both"],
      priority: ["versatility", "access"] },
    bestFor: ["50M-100K training and racing", "Flask-to-bladder flexible carry", "All-around training vest"],
    distances: ["50 Miles", "100K"] },
];
