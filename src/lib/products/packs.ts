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
    id: "patagonia-slope-runner-8",
    name: "Slope Runner 8L",
    brand: "Patagonia",
    category: "packs",
    subcategory: "race",
    price: 149,
    priceDisplay: "$149",
    description:
      "Patagonia's sustainable race vest. Made with recycled materials, generous 8L capacity, and a clean no-fuss design that works for training and race day.",
    whyWeRecommend:
      "The eco-conscious choice that doesn't compromise on performance — 8L sweet spot with Patagonia's legendary durability.",
    image: undefined,
    affiliateLinks: { amazon: "#" },
    tags: [
      "Eco-conscious runners",
      "50K to 100K",
      "Training and racing versatility",
      "50K",
      "50 Miles",
      "100K",
      "8L",
    ],
    beginnerPick: false,
    specs: {
      weight: "220g",
      capacity: "8L",
      genderFit: "Unisex (Women's version available)",
      sizes: "XS–XL",
      frontPockets: "2 front stretch pockets + 2 zip pockets",
      backStorage: "6L main compartment",
      hydrationSystem: "Bladder sleeve + 2 soft flask compatible",
      poleCarry: false,
      whistle: false,
      bladderCompatible: true,
      includedFlasks: "None" },
    ratings: {
      comfort: 4,
      bounce: 4,
      breathability: 4,
      loadDistribution: 4,
      easeOfAccess: 4,
      durability: 5 },
    finderTags: {
      distance: ["50k", "50m", "100k"],
      build: ["average", "large"],
      capacity: ["5to8"],
      hydration: ["flasks", "bladder"],
      priority: ["versatility", "bounce"] },
    bestFor: ["Eco-conscious runners", "50K to 100K", "Training and racing versatility"],
    distances: ["50K", "50 Miles", "100K"],
    pros: [
      "Made with recycled materials — Patagonia's sustainability commitment",
      "8L hits the sweet spot for most ultra distances",
      "Exceptional build quality and durability",
      "Clean, uncluttered design",
    ],
    cons: [
      "No pole carry system",
      "No whistle included",
      "Fewer pockets than Salomon or UD",
    ],
    review: {
      quote:
        "I've washed this thing 50 times and it still looks new. Patagonia builds things to last — and that matters for a vest I wear hundreds of miles.",
      race: "Miwok 100K",
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
    id: "salomon-adv-skin-18",
    name: "ADV Skin 18 Set",
    brand: "Salomon",
    category: "packs",
    subcategory: "expedition",
    price: 230,
    priceDisplay: "$230",
    description:
      "Salomon's maximum-capacity vest that still runs like a race vest. 18L feels shockingly stable at speed. The choice for UTMB-style mandatory gear races.",
    whyWeRecommend:
      "18L that still runs like a race vest — the only choice when UTMB-level mandatory gear lists demand serious capacity.",
    image: undefined,
    affiliateLinks: { amazon: "#" },
    tags: [
      "UTMB mandatory gear",
      "100-mile self-supported",
      "Alpine racing",
      "100K",
      "100 Miles",
      "Multi-day",
      "18L",
    ],
    beginnerPick: false,
    specs: {
      weight: "390g",
      capacity: "18L",
      genderFit: "Unisex (Women's version available)",
      sizes: "XS–XL",
      frontPockets: "6 front pockets + 2 flask sleeves",
      backStorage: "12L main + 6L extra pockets",
      hydrationSystem: "2× 500ml flasks included + 3L bladder compatible",
      poleCarry: true,
      whistle: true,
      bladderCompatible: true,
      includedFlasks: "2× 500ml" },
    ratings: {
      comfort: 4,
      bounce: 5,
      breathability: 4,
      loadDistribution: 5,
      easeOfAccess: 5,
      durability: 5 },
    finderTags: {
      distance: ["100k", "100m", "multiday"],
      build: ["small", "average", "large"],
      capacity: ["12plus"],
      hydration: ["flasks", "bladder", "both"],
      priority: ["capacity", "bounce", "poles", "weather"] },
    bestFor: ["UTMB mandatory gear", "100-mile self-supported", "Alpine racing"],
    distances: ["100K", "100 Miles", "Multi-day"],
    pros: [
      "18L that still runs like a race vest — remarkable engineering",
      "Handles full UTMB mandatory gear list with room to spare",
      "SensiFit scales to larger loads without bounce",
      "Comprehensive pole carry system",
      "Included 500ml flasks are top quality",
    ],
    cons: [
      "Premium $230 price tag",
      "18L feels excessive for anything shorter than 100K",
      "Heavy when fully loaded — expect to notice it at mile 80",
    ],
    review: {
      quote:
        "UTMB's mandatory gear list is brutal. The ADV Skin 18 is one of the only vests that fits it all and still lets me run properly.",
      race: "UTMB",
      runner: "Verified UTMB finisher" } },

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

  {
    id: "raidlight-revolutiv-18",
    name: "Revolutiv 18L",
    brand: "Raidlight",
    category: "packs",
    subcategory: "expedition",
    price: 180,
    priceDisplay: "$180",
    description:
      "French engineering for alpine ultra racing. 18L built for UTMB's extensive mandatory gear. Excellent pole carry, waterproof pockets, and bomber durability.",
    whyWeRecommend:
      "French-designed for the UTMB circuit with an outstanding weight-to-capacity ratio of 350g for 18L.",
    image: undefined,
    affiliateLinks: { amazon: "#" },
    tags: [
      "UTMB-style mandatory gear races",
      "Alpine racing",
      "European ultra circuit",
      "100K",
      "100 Miles",
      "18L",
    ],
    beginnerPick: false,
    specs: {
      weight: "350g",
      capacity: "18L",
      genderFit: "Unisex (Women's version available)",
      sizes: "XS–XL",
      frontPockets: "4 front pockets + 2 flask pockets",
      backStorage: "12L main + 4 external pockets",
      hydrationSystem: "2 soft flasks + 2L bladder compatible",
      poleCarry: true,
      whistle: true,
      bladderCompatible: true,
      includedFlasks: "2× 600ml" },
    ratings: {
      comfort: 4,
      bounce: 4,
      breathability: 4,
      loadDistribution: 5,
      easeOfAccess: 4,
      durability: 4 },
    finderTags: {
      distance: ["100k", "100m", "multiday"],
      build: ["average", "large"],
      capacity: ["12plus"],
      hydration: ["flasks", "bladder", "both"],
      priority: ["capacity", "poles", "weather"] },
    bestFor: [
      "UTMB-style mandatory gear races",
      "Alpine racing",
      "European ultra circuit",
    ],
    distances: ["100K", "100 Miles"],
    pros: [
      "French brand built for UTMB — knows mandatory gear demands inside out",
      "18L at 350g is excellent weight-to-capacity ratio",
      "Waterproof back pocket for electronics",
      "Excellent pole carry optimized for alpine terrain",
    ],
    cons: [
      "Less widely available outside Europe",
      "Fit can be inconsistent across sizes",
      "Less brand recognition means less resale value",
    ],
    review: {
      quote:
        "Raidlight built this vest for the UTMB circuit. It shows — every pocket placement makes sense when you're navigating mandatory gear requirements.",
      race: "CCC",
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

  {
    id: "salomon-sense-pro-5",
    name: "Sense Pro 5",
    brand: "Salomon",
    category: "packs",
    subcategory: "race",
    price: 120,
    priceDisplay: "$120",
    description:
      "Salomon's streamlined 5L race vest designed for supported ultras. Two 500ml SoftFlasks, 6 pockets, and a barely-there 165g build for runners who want Salomon quality at a lower price.",
    whyWeRecommend:
      "Salomon race-vest DNA at a more accessible price — 165g with included SoftFlasks for supported 50Ks.",
    image: undefined,
    affiliateLinks: { amazon: "#" },
    tags: ["Supported 50Ks", "Minimalist racing", "Budget Salomon", "50K", "5L"],
    beginnerPick: false,
    specs: {
      weight: "165g",
      capacity: "5L",
      genderFit: "Unisex",
      frontPockets: "6 total pockets",
      hydrationSystem: "2× 500ml SoftFlask included",
      includedFlasks: "2× 500ml SoftFlask" },
    finderTags: {
      distance: ["50k"],
      build: ["small", "average"],
      capacity: ["under5", "5to8"],
      hydration: ["flasks"],
      priority: ["light", "bounce", "access"] },
    bestFor: ["Supported 50Ks", "Minimalist racing"],
    distances: ["50K"] },

  {
    id: "camelbak-fastpack-5",
    name: "Fastpack 5 Vest",
    brand: "CamelBak",
    category: "packs",
    subcategory: "race",
    price: 90,
    priceDisplay: "$90",
    description:
      "CamelBak's budget-friendly 5L race vest with two included 500ml flasks and 8 pockets. A solid entry point for first-time ultra racers who need hydration and storage without the premium price.",
    whyWeRecommend:
      "The best value entry-level race vest at $90 with flasks included — perfect for your first 50K.",
    image: undefined,
    affiliateLinks: { amazon: "#" },
    tags: ["Budget race vest", "First ultra", "Supported 50Ks", "50K", "5L"],
    beginnerPick: true,
    specs: {
      weight: "198g",
      capacity: "5L",
      genderFit: "Unisex",
      frontPockets: "8 total pockets",
      hydrationSystem: "2× 500ml flasks included",
      includedFlasks: "2× 500ml" },
    finderTags: {
      distance: ["50k"],
      build: ["small", "average", "large"],
      capacity: ["under5", "5to8"],
      hydration: ["flasks"],
      priority: ["light", "access", "versatility"] },
    bestFor: ["Budget race vest", "First ultra", "Supported 50Ks"],
    distances: ["50K"] },

  {
    id: "ud-zeal-pro-10",
    name: "Zeal Pro 10L",
    brand: "Ultimate Direction",
    category: "packs",
    subcategory: "allround",
    price: 160,
    priceDisplay: "$160",
    description:
      "Ultimate Direction's 10L vest built for 100-mile mandatory gear. Two included 500ml flasks, pole loops for technical climbing, and enough storage for clothing changes between drop bags.",
    whyWeRecommend:
      "Purpose-built for 100-mile races with pole loops, included flasks, and 10L of organized mandatory-gear storage.",
    image: undefined,
    affiliateLinks: { amazon: "#" },
    tags: [
      "100-mile racing",
      "Mandatory gear",
      "Pole carry",
      "100K",
      "100 Miles",
      "10L",
    ],
    beginnerPick: false,
    specs: {
      weight: "280g",
      capacity: "10L",
      genderFit: "Unisex",
      hydrationSystem: "2× 500ml flasks included",
      poleCarry: true,
      includedFlasks: "2× 500ml" },
    finderTags: {
      distance: ["50m", "100k", "100m"],
      build: ["average", "large"],
      capacity: ["8to12"],
      hydration: ["flasks", "both"],
      priority: ["capacity", "poles", "access"] },
    bestFor: ["100-mile racing", "Mandatory gear lists", "Technical terrain with poles"],
    distances: ["50 Miles", "100K", "100 Miles"] },

  {
    id: "nathan-race-vest-10",
    name: "Race Vest 10L",
    brand: "Nathan",
    category: "packs",
    subcategory: "allround",
    price: 100,
    priceDisplay: "$100",
    description:
      "Nathan's budget 10L vest for 100-mile runners. Two included 600ml flasks, pole loops, and 312g build weight. Delivers the capacity you need for mandatory gear without the premium price.",
    whyWeRecommend:
      "The best budget option for 100-mile mandatory gear at just $100 with included 600ml flasks.",
    image: undefined,
    affiliateLinks: { amazon: "#" },
    tags: [
      "Budget 100-mile vest",
      "Mandatory gear",
      "Pole carry",
      "100K",
      "100 Miles",
      "10L",
    ],
    beginnerPick: true,
    specs: {
      weight: "312g",
      capacity: "10L",
      genderFit: "Unisex",
      hydrationSystem: "2× 600ml flasks included",
      poleCarry: true,
      includedFlasks: "2× 600ml" },
    finderTags: {
      distance: ["50m", "100k", "100m"],
      build: ["average", "large", "broad"],
      capacity: ["8to12"],
      hydration: ["flasks", "both"],
      priority: ["capacity", "poles", "versatility"] },
    bestFor: ["Budget 100-mile racing", "Mandatory gear lists", "First 100-miler"],
    distances: ["50 Miles", "100K", "100 Miles"] },

  {
    id: "ud-ultra-vest-3",
    name: "Ultra Vest 3.0",
    brand: "Ultimate Direction",
    category: "packs",
    subcategory: "allround",
    price: 140,
    priceDisplay: "$140",
    description:
      "Ultimate Direction's versatile 8L all-arounder with two included 500ml flasks and pole loops. The sweet spot for 50M-100K runners who need more than a race vest but less than an expedition pack.",
    whyWeRecommend:
      "The 8L sweet spot for mid-distance ultras — enough capacity without overkill, with included flasks and pole loops.",
    image: undefined,
    affiliateLinks: { amazon: "#" },
    tags: [
      "50M-100K racing",
      "All-around",
      "Pole carry",
      "50 Miles",
      "100K",
      "8L",
    ],
    beginnerPick: false,
    specs: {
      weight: "248g",
      capacity: "8L",
      genderFit: "Unisex",
      hydrationSystem: "2× 500ml flasks included",
      poleCarry: true,
      includedFlasks: "2× 500ml" },
    finderTags: {
      distance: ["50k", "50m", "100k"],
      build: ["average", "large"],
      capacity: ["5to8", "8to12"],
      hydration: ["flasks", "both"],
      priority: ["versatility", "access", "bounce"] },
    bestFor: ["50M-100K racing", "All-around training and racing", "Mid-distance ultras"],
    distances: ["50K", "50 Miles", "100K"] },

  {
    id: "osprey-hydraknight-12",
    name: "Hydraknight 12",
    brand: "Osprey",
    category: "packs",
    subcategory: "allround",
    price: 90,
    priceDisplay: "$90",
    description:
      "Osprey's budget-friendly 12L vest with 2.5L reservoir compatibility, 10 pockets, and Osprey's trademark lifetime warranty. A solid entry point for runners who need capacity without the premium price.",
    whyWeRecommend:
      "Osprey's lifetime warranty and 12L capacity at just $90 make this the best budget all-around vest.",
    image: undefined,
    affiliateLinks: { amazon: "#" },
    tags: [
      "Budget all-around vest",
      "50M-100K",
      "Bladder compatible",
      "50 Miles",
      "100K",
      "12L",
    ],
    beginnerPick: true,
    specs: {
      weight: "340g",
      capacity: "12L",
      genderFit: "Unisex",
      frontPockets: "10 total pockets",
      hydrationSystem: "2.5L reservoir compatible",
      bladderCompatible: true,
      includedFlasks: "None" },
    finderTags: {
      distance: ["50m", "100k"],
      build: ["average", "large", "broad"],
      capacity: ["8to12"],
      hydration: ["bladder", "both"],
      priority: ["capacity", "versatility"] },
    bestFor: ["Budget all-around vest", "50M-100K training and racing", "First long ultra"],
    distances: ["50 Miles", "100K"] },
];
