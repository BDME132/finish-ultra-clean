import type { AccessoryProduct } from "./types";

// ─── Centralized Accessories Product Library ────────────────────────────────
// Sources: race-day-kit.ts (watches, headlamps, first-aid, recovery, crew),
//          KitBuilder.tsx buildKit() (headlamps, trekking poles, safety, footcare)

export const accessories: AccessoryProduct[] = [
  // ── Lighting ──────────────────────────────────────────────────────────────

  {
    id: "petzl-iko-core-500",
    name: "Iko Core 500",
    brand: "Petzl",
    category: "lighting",
    price: 80,
    priceDisplay: "$80",
    description:
      "500-lumen rechargeable headlamp with USB-C charging and ultra-thin AIRFIT headband. Designed for ultra running with a low-profile fit that doesn't bounce.",
    whyWeRecommend:
      "Night running at 100-mile distances demands a rechargeable lamp with enough runtime for your full dark section. USB-C charging means no fumbling with battery packs at crew stops.",
    specs: {
      lumens: "500 max",
      runtime: "100hr low / 2hr high",
      charge: "USB-C rechargeable",
      weight: "105g" },
    affiliateLinks: { amazon: "https://amzn.to/40CwFk6" },
    tags: ["headlamp", "rechargeable", "usb-c", "night-running", "primary"] },
  {
    id: "black-diamond-core-headlamp-400",
    name: "Core Headlamp 400",
    brand: "Black Diamond",
    category: "lighting",
    price: 50,
    priceDisplay: "$50",
    description:
      "400-lumen rechargeable headlamp with USB-C charging. Solid budget option for night running with good runtime on low settings.",
    whyWeRecommend:
      "Reliable 400-lumen rechargeable lamp at a budget-friendly price. USB-C charging and 200-hour low-mode runtime mean you won't run out of light on any night section.",
    specs: {
      lumens: "400 max",
      runtime: "200hr low / 4hr high",
      charge: "USB-C rechargeable",
      weight: "95g" },
    affiliateLinks: { amazon:
        "https://www.amazon.com/s?k=Black%20Diamond%20Core%20Headlamp%20400&tag=finishultra-20" },
    tags: ["headlamp", "rechargeable", "budget", "usb-c", "night-running"],
    beginnerPick: true },
  {
    id: "black-diamond-spot-400-r",
    name: "Spot 400-R Headlamp",
    brand: "Black Diamond",
    category: "lighting",
    price: 70,
    priceDisplay: "$70",
    description:
      "400-lumen rechargeable headlamp with red night-vision mode. Most 50-milers and all 100s require you to run through the night.",
    whyWeRecommend:
      "Red night-vision mode preserves your night vision for technical trail sections. 400 lumens is plenty for trail running and the rechargeable battery keeps weight down.",
    specs: {
      lumens: "400 max",
      charge: "USB-C rechargeable",
      modes: "Spot, flood, red night-vision",
      weight: "~95g" },
    affiliateLinks: { amazon: "https://amzn.to/4bg1Asv" },
    tags: ["headlamp", "rechargeable", "red-mode", "night-vision"] },
  {
    id: "black-diamond-spot-400-e",
    name: "Spot 400-E",
    brand: "Black Diamond",
    category: "lighting",
    price: 35,
    priceDisplay: "$35",
    description:
      "400-lumen battery-powered backup headlamp running on AAA batteries. Different power source from your primary — a critical redundancy for 100-mile races.",
    whyWeRecommend:
      "Mandatory gear at most 100-milers. Runs on AAA batteries (different from your primary — a critical redundancy). Keep it in your vest all race and forget it's there unless you need it.",
    specs: {
      lumens: "400 max",
      runtime: "40hr low / 2hr high",
      battery: "3x AAA",
      weight: "88g (w/ batteries)" },
    affiliateLinks: { amazon:
        "https://www.amazon.com/s?k=Black%20Diamond%20Spot%20400-E%20headlamp&tag=finishultra-20" },
    tags: ["headlamp", "backup", "battery-powered", "mandatory-gear", "100-mile"] },
  {
    id: "biolite-headlamp-330",
    name: "HeadLamp 330",
    brand: "BioLite",
    category: "lighting",
    price: 55,
    priceDisplay: "$55",
    description:
      "Rechargeable 330-lumen headlamp for crew members navigating dark aid stations and parking areas. Lightweight and comfortable for long hours of crewing.",
    whyWeRecommend:
      "Your crew needs their own light sources — don't share with the runner. A rechargeable 330-lumen headlamp keeps crew members effective at dark aid stations and parking areas.",
    specs: {
      lumens: "330 max",
      charge: "USB-C rechargeable",
      weight: "69g",
      modes: "Spot, flood, red" },
    affiliateLinks: { amazon: "https://amzn.to/4dsBiEP" },
    tags: ["headlamp", "crew-gear", "lightweight", "rechargeable"] },

  // ── Accessories — Watches ─────────────────────────────────────────────────

  {
    id: "garmin-forerunner-955-solar",
    name: "Forerunner 955 Solar",
    brand: "Garmin",
    category: "accessories",
    price: 499,
    priceDisplay: "$499",
    description:
      "GPS watch built for ultra distances. Tracks pace, elevation, heart rate, and navigation with 49-hour battery life in GPS mode. Solar charging extends life even further.",
    whyWeRecommend:
      "49-hour GPS battery life means no mid-race charging for most ultras up to 100 miles. Full course navigation, real-time heart rate, and altitude tracking keep you informed when decision-making is critical.",
    specs: {
      battery: "49hr GPS mode (solar extends)",
      navigation: "Full course GPS + breadcrumb",
      sensors: "HR, altimeter, compass, gyroscope",
      weight: "53g" },
    affiliateLinks: { amazon: "https://amzn.to/4bumseh" },
    tags: ["watch", "gps", "navigation", "ultra-battery", "solar"] },

  // ── Accessories — Eyewear ─────────────────────────────────────────────────

  {
    id: "goodr-bfg-sunglasses",
    name: "BFGs Running Sunglasses",
    brand: "Goodr",
    category: "accessories",
    price: 35,
    priceDisplay: "$35",
    description:
      "Polarized sport sunglasses that don't bounce or slip. Wrap-around coverage for trail sun and dust, with no-slip grip for sweaty conditions.",
    whyWeRecommend:
      "Polarized lenses, no-bounce fit, and no-slip grip for sweaty conditions at an unbeatable price. Wrap-around coverage protects from sun and trail dust.",
    specs: {
      lenses: "Polarized, UV400",
      fit: "No-slip, no-bounce",
      coverage: "Wrap-around",
      weight: "~25g" },
    affiliateLinks: { amazon:
        "https://www.amazon.com/s?k=Goodr%20BFGs%20Running%20Sunglasses&tag=finishultra-20" },
    tags: ["sunglasses", "polarized", "no-bounce", "affordable"],
    beginnerPick: true },

  // ── Accessories — Trekking Poles ──────────────────────────────────────────

  {
    id: "black-diamond-distance-z",
    name: "Distance Z Trekking Poles",
    brand: "Black Diamond",
    category: "accessories",
    price: 110,
    priceDisplay: "$110",
    description:
      "Ultralight folding poles that collapse small enough to stash on your vest. On any race with significant climbing, poles save 20-30% of your leg muscle energy.",
    whyWeRecommend:
      "On any race with significant climbing, poles save 20-30% of your leg muscle energy. Ultralight folding design collapses small enough to stash on your vest between climbs.",
    specs: {
      weight: "300g/pair",
      collapsed: "~13\" folded",
      material: "Aluminum",
      grip: "EVA foam" },
    affiliateLinks: { amazon: "https://amzn.to/47EKEtn" },
    tags: ["trekking-poles", "folding", "ultralight", "mountain", "climbing"] },

  // ── Accessories — Power ───────────────────────────────────────────────────

  {
    id: "anker-powercore-10000",
    name: "PowerCore 10000 Power Bank",
    brand: "Anker",
    category: "accessories",
    price: 22,
    priceDisplay: "$22",
    description:
      "Compact 10,000mAh power bank that fully charges a GPS watch twice. Essential for 100-milers and long 50-milers that exceed your watch battery life.",
    whyWeRecommend:
      "Compact enough for a drop bag and powerful enough to charge your GPS watch twice. Essential for 100-milers and long 50-milers that exceed your watch battery life.",
    specs: {
      capacity: "10,000mAh",
      output: "USB-A + USB-C",
      weight: "~180g",
      charges: "~2 full GPS watch charges" },
    affiliateLinks: { amazon: "https://amzn.to/4buCp4p" },
    tags: ["power-bank", "drop-bag", "charging", "100-mile"] },

  // ── Accessories — Anti-Chafe ──────────────────────────────────────────────

  {
    id: "squirrels-nut-butter-anti-chafe",
    name: "Anti-Chafe Balm",
    brand: "Squirrel's Nut Butter",
    category: "accessories",
    price: 14,
    priceDisplay: "$14",
    description:
      "All-natural anti-chafe balm that outlasts petroleum jelly by miles. Reapply at drop bags to prevent the thigh rash and armpit burns that build slowly and end races.",
    whyWeRecommend:
      "All-natural anti-chafe balm that outlasts petroleum jelly by miles. Reapply at drop bags to prevent the thigh rash and armpit burns that build slowly over 50+ miles and can end races.",
    specs: {
      size: "2oz stick",
      ingredients: "All-natural (coconut oil, cocoa butter, beeswax)",
      application: "Pre-race + every crew/drop-bag stop" },
    affiliateLinks: { amazon:
        "https://www.amazon.com/s?k=Squirrel%27s%20Nut%20Butter%20Anti-Chafe&tag=finishultra-20" },
    tags: ["anti-chafe", "body-care", "drop-bag", "all-natural"],
    beginnerPick: true },

  // ── Accessories — Sun Protection ──────────────────────────────────────────

  {
    id: "neutrogena-sport-face-spf70",
    name: "Sport Face SPF 70 Sunscreen",
    brand: "Neutrogena",
    category: "accessories",
    price: 11,
    priceDisplay: "$11",
    description:
      "Sweat-proof sport sunscreen that won't run into your eyes. Reapply at every other drop bag — sun damage accumulates over a long race day and impairs performance.",
    whyWeRecommend:
      "Sweat-proof formula won't run into your eyes mid-race. Sun damage accumulates over a long race day and impairs performance — reapply at every other drop bag to stay protected.",
    specs: {
      spf: "70",
      type: "Sweat-proof sport formula",
      size: "2.5 fl oz" },
    affiliateLinks: { amazon: "https://amzn.to/3NcPd7r" },
    tags: ["sunscreen", "sun-protection", "sweat-proof", "drop-bag"] },

  // ── Safety ────────────────────────────────────────────────────────────────

  {
    id: "sol-escape-pro-bivvy",
    name: "Escape Pro Bivvy",
    brand: "SOL",
    category: "safety",
    price: 40,
    priceDisplay: "$40",
    description:
      "Waterproof emergency bivvy that weighs 8.5oz. Required gear at nearly all mountain ultras and potentially life-saving if you get injured on course.",
    whyWeRecommend:
      "8 ounces that can save your life. Mandatory gear on most mountain 100s. Packs to the size of a fist and reflects 90% of body heat. The one item you hope to never use but will never leave home without.",
    specs: {
      weight: "8.5oz",
      packed: "3.5\" x 5.5\"",
      material: "Reflective polyethylene",
      heatRetention: "90%" },
    affiliateLinks: { amazon: "https://amzn.to/40yVjC7" },
    tags: ["emergency", "bivvy", "mandatory-gear", "mountain", "safety"],
    beginnerPick: true },
  {
    id: "sol-emergency-bivvy",
    name: "Emergency Bivvy",
    brand: "SOL",
    category: "safety",
    price: 20,
    priceDisplay: "$20",
    description:
      "Ultralight emergency bivvy at 3.8oz — even lighter than the Escape Pro. Reflects 90% of body heat and packs to fist size. Budget-friendly mandatory gear option.",
    whyWeRecommend:
      "At 3.8oz, this is the lightest mandatory-gear bivvy option. Packs to the size of a fist and reflects 90% of body heat. The budget pick for meeting mandatory gear requirements.",
    specs: {
      weight: "3.8oz",
      packed: "3.5\" x 5.5\"",
      material: "Reflective polyethylene",
      heatRetention: "90%" },
    affiliateLinks: { amazon:
        "https://www.amazon.com/s?k=SOL%20Emergency%20Bivvy&tag=finishultra-20" },
    tags: ["emergency", "bivvy", "mandatory-gear", "ultralight", "budget"] },
  {
    id: "spot-x-satellite-communicator",
    name: "Spot X Satellite Communicator",
    brand: "SPOT",
    category: "safety",
    price: 150,
    priceDisplay: "$150",
    description:
      "Two-way satellite messenger with SOS capability and live tracking. Provides communication on remote 100-mile courses miles from cell coverage.",
    whyWeRecommend:
      "Remote 100-mile courses go miles from cell coverage. Two-way satellite messaging lets your crew track you live and gets help to you if something goes wrong at mile 85, 20 miles from the nearest road.",
    specs: {
      coverage: "Global satellite network",
      messaging: "Two-way SMS via satellite",
      tracking: "Customizable intervals",
      sos: "24/7 GEOS response center" },
    affiliateLinks: { amazon: "https://amzn.to/40ChtDu" },
    tags: ["satellite", "communication", "sos", "tracking", "remote", "100-mile"] },
  {
    id: "adventure-medical-kits-trail",
    name: "Trail Series Medical Kit",
    brand: "Adventure Medical Kits",
    category: "safety",
    price: 30,
    priceDisplay: "$30",
    description:
      "Comprehensive trail first aid kit with blister care, wound closure, and pain management. Your crew needs to handle anything from blisters to sprains.",
    whyWeRecommend:
      "Your crew needs to handle anything from blisters to sprains without stopping at an aid station. A comprehensive trail kit covers blister care, wound closure, and pain management in one package.",
    specs: {
      contents: "Blister care, wound closure, pain management",
      size: "Compact crew-bag size",
      weight: "~8oz" },
    affiliateLinks: { amazon: "https://amzn.to/4bOT6bZ" },
    tags: ["first-aid", "crew-gear", "blister-care", "medical"] },

  // ── Foot Care ─────────────────────────────────────────────────────────────

  {
    id: "leukotape-blister-kit",
    name: "Blister Prevention & Repair Kit",
    brand: "Leukotape",
    category: "footcare",
    price: 12,
    priceDisplay: "$12",
    description:
      "Athletic tape that stays on wet feet for 100 miles. Pre-tape known hot spots before the race and include a roll with a needle in your drop bag for mid-race repairs.",
    whyWeRecommend:
      "Pre-tape known hot spots before the race and include a roll in your drop bag. Leukotape stays on wet, sweaty feet for 100 miles — the only blister tape that actually works at ultra distances.",
    specs: {
      type: "Zinc oxide adhesive tape",
      adhesion: "Stays on wet feet 100+ miles",
      includes: "1\" roll + sterile needle" },
    affiliateLinks: { amazon:
        "https://www.amazon.com/s?k=Leukotape%20blister%20prevention%20tape&tag=finishultra-20" },
    tags: ["blister-tape", "prevention", "drop-bag", "mandatory"],
    beginnerPick: true },
  {
    id: "anti-blister-kit-mixed",
    name: "Anti-Blister Kit",
    brand: "Mixed (SNB + Leukotape)",
    category: "footcare",
    price: 25,
    priceDisplay: "$25",
    description:
      "Complete blister prevention and repair kit with Squirrel's Nut Butter, Leukotape P, sterile needle, and gauze. Everything you need to keep blisters from ending your race.",
    whyWeRecommend:
      "Blisters are the #1 preventable DNF cause. Apply Squirrel's Nut Butter before the start, use Leukotape on known hot spots pre-race, and carry the sterile needle for mid-race drainage.",
    specs: {
      contents: "SNB 1oz + Leukotape P 1\" roll + sterile needle + gauze",
      weight: "2oz total" },
    affiliateLinks: { amazon:
        "https://www.amazon.com/s?k=squirrels%20nut%20butter%20leukotape%20blister%20kit&tag=finishultra-20" },
    tags: ["blister-kit", "prevention", "repair", "foot-care", "complete-kit"] },

  // ── Recovery ──────────────────────────────────────────────────────────────

  {
    id: "oofos-ooahh-sport-flex",
    name: "OOahh Sport Flex Sandals",
    brand: "Oofos",
    category: "recovery",
    price: 65,
    priceDisplay: "$65",
    description:
      "Patented impact-absorbing foam that reduces stress on your feet and joints by 37%. Slip these on at the finish line — your feet will feel like they're floating.",
    whyWeRecommend:
      "Patented OOfoam absorbs 37% more impact than traditional footwear. Slip them on at the finish line and feel the immediate relief — the first step in your recovery process.",
    specs: {
      technology: "OOfoam impact absorption",
      reduction: "37% less impact vs. traditional",
      closure: "Slip-on",
      weight: "~200g/pair" },
    affiliateLinks: { amazon: "https://amzn.to/4sM5TBB" },
    tags: ["recovery", "sandals", "post-race", "impact-absorption"],
    beginnerPick: true },
  {
    id: "cep-compression-socks",
    name: "Compression Socks 20-30mmHg",
    brand: "CEP",
    category: "recovery",
    price: 65,
    priceDisplay: "$65",
    description:
      "Medical-grade 20-30mmHg graduated compression socks that accelerate fluid clearance from your lower legs. Put on within 30 minutes of finishing.",
    whyWeRecommend:
      "Put these on within 30 minutes of finishing. The 20-30mmHg compression gradient dramatically accelerates fluid clearance from your lower legs, reducing next-day swelling and getting you walking normally faster.",
    specs: {
      compression: "20-30mmHg graduated",
      fabric: "Meryl Skinlife nylon",
      height: "Knee-high",
      duration: "Wear 4-6 hrs post-race" },
    affiliateLinks: { amazon:
        "https://www.amazon.com/s?k=CEP%20Compression%20Socks%2020-30mmHg&tag=finishultra-20" },
    tags: ["compression", "recovery", "post-race", "medical-grade"] },
  {
    id: "triggerpoint-grid-foam-roller",
    name: "GRID Foam Roller",
    brand: "TriggerPoint",
    category: "recovery",
    price: 35,
    priceDisplay: "$35",
    description:
      "Multi-density foam roller that mimics the feel of a massage therapist's hands. Use starting 24 hours post-race to break up adhesions and speed tissue repair.",
    whyWeRecommend:
      "Multi-density surface mimics the feel of a massage therapist's hands. Use starting 24 hours post-race to break up adhesions and speed tissue repair in quads, calves, and IT bands.",
    specs: {
      surface: "Multi-density EVA foam",
      dimensions: "13\" x 5.5\"",
      weight: "~500g",
      durability: "Hollow core, maintains shape" },
    affiliateLinks: { amazon: "https://amzn.to/4bqqF2M" },
    tags: ["foam-roller", "recovery", "self-massage", "post-race"] },
  {
    id: "theragun-mini",
    name: "Mini Percussive Therapy Device",
    brand: "Theragun",
    category: "recovery",
    price: 199,
    priceDisplay: "$199",
    description:
      "Portable percussion massager that penetrates 12mm deep into muscle tissue. 2-3 minutes per muscle group on your quads and calves post-race dramatically reduces DOMS.",
    whyWeRecommend:
      "Portable percussion massager that reaches 12mm deep into muscle tissue. 2-3 minutes per muscle group on quads and calves post-race dramatically reduces delayed onset muscle soreness.",
    specs: {
      depth: "12mm amplitude",
      speed: "1750-2400 PPM",
      battery: "150 minutes",
      weight: "680g" },
    affiliateLinks: { amazon: "https://amzn.to/4lCJ4hu" },
    tags: ["percussion", "recovery", "portable", "deep-tissue", "premium"] },

  // ── Crew Gear ─────────────────────────────────────────────────────────────

  {
    id: "helinox-chair-zero",
    name: "Chair Zero",
    brand: "Helinox",
    category: "accessories",
    price: 175,
    priceDisplay: "$175",
    description:
      "Ultralight packable camp chair (1.1 lbs) for crew areas. Your crew will be waiting hours at each aid station — give them somewhere to sit and recharge.",
    whyWeRecommend:
      "Your crew will be waiting hours at each aid station. At 1.1 lbs, this chair packs down to nothing and gives your crew a comfortable base of operations at every crew-access point.",
    specs: {
      weight: "1.1 lbs (510g)",
      capacity: "265 lbs",
      packed: "10\" x 4\"",
      material: "DAC aluminum, ripstop polyester" },
    affiliateLinks: { amazon: "https://amzn.to/3NJTPC3" },
    tags: ["crew-gear", "chair", "ultralight", "packable"] },
  {
    id: "yeti-roadie-24",
    name: "Roadie 24 Hard Cooler",
    brand: "YETI",
    category: "accessories",
    price: 250,
    priceDisplay: "$250",
    description:
      "Keep food cold and ice cream solid for 24 hours. Cold, real food at mile 70 is one of the most powerful recovery tools available to your crew.",
    whyWeRecommend:
      "Cold, real food at mile 70 is one of the most powerful recovery tools available to your crew. This cooler keeps ice solid for 24 hours — long enough for any 100-mile race.",
    specs: {
      capacity: "24 cans",
      insulation: "Permafrost insulation, 24hr ice retention",
      material: "Rotomolded polyethylene",
      weight: "12.8 lbs" },
    affiliateLinks: { amazon: "https://amzn.to/4rBGLfS" },
    tags: ["crew-gear", "cooler", "food-storage", "100-mile"] },
  {
    id: "thermacell-mr450",
    name: "MR450 Mosquito Repeller",
    brand: "Thermacell",
    category: "accessories",
    price: 35,
    priceDisplay: "$35",
    description:
      "Flame-free zone mosquito protection for crew areas. Aid stations near water or in the mountains can have brutal bug situations that grind down crew morale.",
    whyWeRecommend:
      "Aid stations near water or in the mountains can have brutal bug situations that grind down crew morale. Flame-free zone protection keeps your crew effective and comfortable.",
    specs: {
      coverage: "15-foot zone",
      fuel: "Butane cartridge",
      runtime: "12 hours per cartridge",
      weight: "~230g" },
    affiliateLinks: { amazon: "https://amzn.to/4dcGxbR" },
    tags: ["crew-gear", "bug-protection", "aid-station"] },
  {
    id: "dude-wipes-48pack",
    name: "Wipes (Flushable, 48-Pack)",
    brand: "DUDE",
    category: "accessories",
    price: 10,
    priceDisplay: "$10",
    description:
      "Biodegradable wipes for the runner and crew. A full-body wipe-down at mile 60 can mentally reset a deteriorating runner better than almost anything else.",
    whyWeRecommend:
      "A full-body wipe-down at mile 60 can mentally reset a deteriorating runner better than almost anything else. Keep a pack in every drop bag and crew kit.",
    specs: {
      count: "48 per pack",
      type: "Biodegradable, flushable",
      size: "7\" x 7.5\"" },
    affiliateLinks: { amazon: "https://amzn.to/4ly8BbL" },
    tags: ["wipes", "hygiene", "crew-gear", "drop-bag", "mental-reset"] },
];
