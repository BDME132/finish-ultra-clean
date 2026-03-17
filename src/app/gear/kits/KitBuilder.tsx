"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Answers = {
  distance: string;
  terrain: string;
  temp: string;
  night: string;
  experience: string;
  budget: string;
  sweat: string;
  stomach: string;
  feetWidth: string;
  priority: string;
};

type RetailerLink = { url: string; price: number };

type ProductLinks = {
  rei?: RetailerLink;
  amazon?: RetailerLink;
  backcountry?: RetailerLink;
  rw?: RetailerLink;
  direct?: RetailerLink;
};

type GearItem = {
  category: string;
  product: string;
  brand: string;
  price: number;
  why: string;
  tier: "standard" | "budget" | "premium";
  specs: string[];
  links: ProductLinks;
};

type Kit = {
  title: string;
  subtitle: string;
  items: GearItem[];
  packingChecklist: string[];
  dropBagEssentials: string[];
  testingTimeline: string[];
};

// ─── Analytics ───────────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type AnalyticsEvent =
  | { event: "product_click"; product_name: string; retailer: string; price: number; category: string; kit_type: string; position: number }
  | { event: "bulk_purchase_click"; retailer: string; total_price: number; kit_type: string }
  | { event: "specs_viewed"; product_name: string; category: string; kit_type: string }
  | { event: "price_comparison_viewed"; product_name: string; cheapest_retailer: string; savings: number }
  | { event: "purchase_tracked"; product_name: string; category: string; marked_purchased: boolean; kit_type: string };

function trackEvent(payload: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  // Google Analytics 4
  if (typeof window.gtag === "function") {
    const { event, ...params } = payload;
    window.gtag("event", event, params);
  }
  // GTM dataLayer fallback
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }
  // Dev logging
  if (process.env.NODE_ENV === "development") {
    console.log("[FinishUltra Analytics]", payload);
  }
}

// ─── Affiliate link builder ───────────────────────────────────────────────────

function makeLinks(searchTerm: string, basePrice: number, amazonDiscount = 0.97, rwDiscount = 0.98): ProductLinks {
  const q = encodeURIComponent(searchTerm);
  return {
    rei: { url: `https://www.rei.com/search?q=${q}&cm_mmc=aff_AL-_-finishultra-_-1`, price: basePrice },
    amazon: { url: `https://www.amazon.com/s?k=${q}&tag=finishultra-20`, price: Math.round(basePrice * amazonDiscount) },
    backcountry: { url: `https://www.backcountry.com/search?q=${q}&CMP_ID=finishultra`, price: basePrice },
    rw: { url: `https://www.runningwarehouse.com/searchresults/?searchTerm=${q}&sourceCode=FFULTRA`, price: Math.round(basePrice * rwDiscount) },
  };
}

// ─── Quiz questions ───────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: "distance", section: "Race Details", question: "What's your race distance?", icon: "🏁",
    options: [
      { label: "50K (~31 miles)", value: "50k" },
      { label: "50 Miles", value: "50m" },
      { label: "100K (~62 miles)", value: "100k" },
      { label: "100 Miles", value: "100m" },
    ],
  },
  {
    id: "terrain", section: "Race Details", question: "Primary course terrain?", icon: "⛰️",
    options: [
      { label: "Mountain / alpine (technical, rocky)", value: "mountain" },
      { label: "Desert / open (heat, flat to rolling)", value: "desert" },
      { label: "Forest trails / mixed (rooted, muddy)", value: "forest" },
      { label: "Groomed / road-mixed (runnable, fast)", value: "road" },
    ],
  },
  {
    id: "temp", section: "Race Details", question: "Expected race-day temperature?", icon: "🌡️",
    options: [
      { label: "Hot — 75°F+ (sun, humidity, heat index)", value: "hot" },
      { label: "Moderate — 50–75°F (ideal conditions)", value: "moderate" },
      { label: "Cold — 20–50°F (frost, cold nights)", value: "cold" },
      { label: "Extreme — below 20°F (winter, alpine)", value: "extreme" },
    ],
  },
  {
    id: "night", section: "Race Details", question: "Will you run through the night?", icon: "🌙",
    options: [
      { label: "Yes — night sections required", value: "yes" },
      { label: "No — day finish expected", value: "no" },
    ],
  },
  {
    id: "experience", section: "Runner Profile", question: "How many ultras have you finished?", icon: "🏅",
    options: [
      { label: "0 — this is my first ultra", value: "first" },
      { label: "1–3 — still learning the game", value: "beginner" },
      { label: "4–10 — I know what I need", value: "intermediate" },
      { label: "10+ — veteran, just want the best", value: "veteran" },
    ],
  },
  {
    id: "budget", section: "Runner Profile", question: "What's your total gear budget?", icon: "💰",
    options: [
      { label: "Under $400 — budget conscious", value: "budget" },
      { label: "$400–$800 — balanced value", value: "standard" },
      { label: "$800–$1,500 — performance focus", value: "premium" },
      { label: "No limit — best of the best", value: "elite" },
    ],
  },
  {
    id: "sweat", section: "Personal Factors", question: "How much do you sweat?", icon: "💧",
    options: [
      { label: "Light — barely glistening", value: "light" },
      { label: "Moderate — noticeably wet", value: "moderate" },
      { label: "Heavy — soaking through shirts", value: "heavy" },
    ],
  },
  {
    id: "stomach", section: "Personal Factors", question: "How's your stomach during long efforts?", icon: "🫃",
    options: [
      { label: "Iron gut — I can eat anything while running", value: "iron" },
      { label: "Average — occasional nausea at mile 40+", value: "average" },
      { label: "Sensitive — GI issues are my biggest limiter", value: "sensitive" },
    ],
  },
  {
    id: "feetWidth", section: "Personal Factors", question: "What's your foot width?", icon: "👟",
    options: [
      { label: "Narrow to standard (B–D width)", value: "standard" },
      { label: "Wide (2E width)", value: "wide" },
      { label: "Extra wide / high volume (4E+)", value: "xwide" },
    ],
  },
  {
    id: "priority", section: "Personal Factors", question: "What's your #1 gear priority?", icon: "🎯",
    options: [
      { label: "Foot comfort — blisters ruined past races", value: "feet" },
      { label: "Nutrition — fueling is my weakness", value: "nutrition" },
      { label: "Weather protection — I run in bad conditions", value: "weather" },
      { label: "Minimalism — I want to carry as little as possible", value: "minimal" },
    ],
  },
];

// ─── Kit builder logic ────────────────────────────────────────────────────────

function buildKit(answers: Answers): Kit {
  const { distance, terrain, temp, night, experience, budget, sweat, stomach, feetWidth, priority } = answers;
  const cold = temp === "cold" || temp === "extreme";
  const hot = temp === "hot";
  const longRace = distance === "100k" || distance === "100m";
  const mountain = terrain === "mountain";
  const budgetTier: "budget" | "standard" | "premium" =
    budget === "budget" ? "budget" : budget === "standard" ? "standard" : "premium";

  const items: GearItem[] = [];

  // ── FOOTWEAR ──
  if (feetWidth === "xwide" || feetWidth === "wide") {
    const name = feetWidth === "xwide" ? "Speedgoat 5 Wide" : "Speedgoat 5";
    const price = feetWidth === "xwide" ? 155 : 145;
    items.push({
      category: "Footwear", product: name, brand: "HOKA", price, tier: "standard",
      why: `Max cushion for technical alpine terrain. The ${feetWidth === "xwide" ? "extra-wide" : "wide"} fit eliminates toe box compression on long descents — critical for ${distance.toUpperCase()} distances where feet swell 1+ sizes.`,
      specs: ["Stack: 36mm/32mm", "Drop: 4mm", "Lugs: 5mm Vibram Megagrip", "Weight: 10.9oz (M9)"],
      links: makeLinks(`HOKA ${name}`, price),
    });
  } else if (mountain) {
    const isBudget = budgetTier === "budget";
    const name = isBudget ? "Peregrine 13" : "Torrent 3";
    const brand = isBudget ? "Saucony" : "HOKA";
    const price = isBudget ? 130 : 140;
    items.push({
      category: "Footwear", product: name, brand, price, tier: budgetTier,
      why: `Aggressive lugs and a protective rock plate are non-negotiable for mountain terrain. The ${name} is built for exactly the conditions you described — technical, rocky, sustained climbing and descending.`,
      specs: isBudget
        ? ["Stack: 24mm/20mm", "Drop: 4mm", "Lugs: 6mm PWRTRAC", "Weight: 9.7oz (M9)"]
        : ["Stack: 28mm/23mm", "Drop: 5mm", "Lugs: 5mm Vibram Megagrip", "Weight: 8.6oz (M9)"],
      links: makeLinks(`${brand} ${name}`, price),
    });
  } else if (hot) {
    items.push({
      category: "Footwear", product: "Sense Ride 5", brand: "Salomon", price: 140, tier: "standard",
      why: `Breathable upper keeps feet cooler in heat, which directly reduces blister risk. The secure Quicklace system won't come undone on dusty, sandy terrain — critical for desert and open course conditions.`,
      specs: ["Stack: 28mm/24mm", "Drop: 4mm", "Upper: Sensifit breathable mesh", "Weight: 9.5oz (M9)"],
      links: makeLinks("Salomon Sense Ride 5", 140),
    });
  } else {
    const name = budgetTier === "budget" ? "Cascadia 16" : budgetTier === "premium" ? "Ultraventure Pro" : "Speedgoat 5";
    const brand = budgetTier === "budget" ? "Brooks" : budgetTier === "premium" ? "La Sportiva" : "HOKA";
    const price = budgetTier === "budget" ? 120 : budgetTier === "premium" ? 170 : 145;
    items.push({
      category: "Footwear", product: name, brand, price, tier: budgetTier,
      why: `A proven all-conditions trail shoe for ${distance.toUpperCase()} efforts. Reliable grip, race-tested cushion, and enough durability to handle the full distance — the kind of shoe you forget you're wearing.`,
      specs: budgetTier === "budget"
        ? ["Stack: 26mm/14mm", "Drop: 12mm", "Outsole: TrailTack rubber", "Weight: 10.8oz (M9)"]
        : budgetTier === "premium"
        ? ["Stack: 33mm/28mm", "Drop: 5mm", "Outsole: FriXion XT Climb", "Weight: 10.4oz (M9)"]
        : ["Stack: 36mm/32mm", "Drop: 4mm", "Lugs: 5mm Vibram Megagrip", "Weight: 10.9oz (M9)"],
      links: makeLinks(`${brand} ${name}`, price),
    });
  }

  if (longRace) {
    items.push({
      category: "Footwear (Drop Bag)", product: "Clifton 9 Trail", brand: "HOKA", price: 140, tier: "standard",
      why: `Switch at mile 60–70 when your feet have swollen and the terrain flattens. Max cushion absorbs the pounding your feet have already taken, and a fresh shoe dramatically reduces blister risk in the final third.`,
      specs: ["Stack: 40mm/34mm", "Drop: 6mm", "Upper: Engineered mesh", "Weight: 9.7oz (M9)"],
      links: makeLinks("HOKA Clifton 9 Trail", 140),
    });
  }

  // ── HYDRATION PACK ──
  const packItem = (() => {
    if (priority === "minimal" || distance === "50k") {
      const isBudget = budgetTier === "budget";
      const name = isBudget ? "Fastpack 5 Vest" : "Sense Pro 5";
      const brand = isBudget ? "CamelBak" : "Salomon";
      const price = isBudget ? 90 : 120;
      return {
        product: name, brand, price,
        why: `5L is exactly right for ${distance.toUpperCase()} aid station spacing. You'll never carry more than you need between stops — which means less fatigue and more energy for running.`,
        specs: isBudget
          ? ["Capacity: 5L", "Flasks: 2×500ml included", "Weight: 198g", "Pockets: 8 total"]
          : ["Capacity: 5L", "Flasks: 2×500ml SoftFlask", "Weight: 165g", "Pockets: 6 total"],
        links: makeLinks(`${brand} ${name}`, price),
      };
    } else if (longRace) {
      const isBudget = budgetTier === "budget";
      const name = isBudget ? "Race Vest 10L" : "Zeal Pro 10L";
      const brand = isBudget ? "Nathan" : "Ultimate Direction";
      const price = isBudget ? 100 : 160;
      return {
        product: name, brand, price,
        why: `100-mile mandatory gear lists require 10L minimum. Pole loops for technical climbing, front soft flask pockets for hydration access without stopping, and enough storage to carry clothing changes between drop bags.`,
        specs: isBudget
          ? ["Capacity: 10L", "Flasks: 2×600ml included", "Weight: 312g", "Pole loops: Yes"]
          : ["Capacity: 10L", "Flasks: 2×500ml included", "Weight: 280g", "Pole loops: Yes"],
        links: makeLinks(`${brand} ${name}`, price),
      };
    } else {
      const isBudget = budgetTier === "budget";
      const name = isBudget ? "Hydraknight 12" : "Ultra Vest 3.0";
      const brand = isBudget ? "Osprey" : "Ultimate Direction";
      const price = isBudget ? 90 : 140;
      return {
        product: name, brand, price,
        why: `The 8–10L sweet spot for ${distance.toUpperCase()} — enough capacity for long gaps between aid stations without the bounce and weight of an overloaded 15L. Front pockets put nutrition within reach without breaking stride.`,
        specs: isBudget
          ? ["Capacity: 12L", "Reservoir: 2.5L compatible", "Weight: 340g", "Pockets: 10 total"]
          : ["Capacity: 8L", "Flasks: 2×500ml included", "Weight: 248g", "Pole loops: Yes"],
        links: makeLinks(`${brand} ${name}`, price),
      };
    }
  })();
  items.push({ category: "Hydration Pack", tier: budgetTier, ...packItem });

  // ── LIGHTING ──
  if (night === "yes" || longRace) {
    const isBudget = budgetTier === "budget";
    const name = isBudget ? "Core Headlamp 400" : "Iko Core 500";
    const brand = isBudget ? "Black Diamond" : "Petzl";
    const price = isBudget ? 50 : 80;
    items.push({
      category: "Lighting — Headlamp", product: name, brand, price, tier: budgetTier,
      why: `${longRace ? "100-mile races" : "Night running"} demands a rechargeable lamp with enough runtime for your full dark section. USB-C charging means no fumbling with battery packs at crew stops.`,
      specs: isBudget
        ? ["Lumens: 400 max", "Runtime: 200hr low / 4hr high", "Charge: USB-C", "Weight: 95g"]
        : ["Lumens: 500 max", "Runtime: 100hr low / 2hr high", "Charge: USB-C", "Weight: 105g"],
      links: makeLinks(`${brand} ${name}`, price),
    });
    if (longRace) {
      items.push({
        category: "Lighting — Backup", product: "Spot 400-E", brand: "Black Diamond", price: 35, tier: "budget",
        why: `Mandatory gear at most 100-milers. Runs on AAA batteries (different from your primary — a critical redundancy). Keep it in your vest all race and forget it's there unless you need it.`,
        specs: ["Lumens: 400 max", "Runtime: 40hr low / 2hr high", "Battery: 3×AAA", "Weight: 88g (w/ batteries)"],
        links: makeLinks("Black Diamond Spot 400-E headlamp", 35),
      });
    }
  }

  // ── CLOTHING: TOP ──
  if (cold) {
    items.push({
      category: "Base Layer — Top", product: "Merino 250 Base Layer Crew", brand: "Smartwool", price: 100, tier: "standard",
      why: `Cold-weather ultras demand merino. It's warm when damp, naturally odor-resistant for multi-day efforts, and regulates temperature across the wide range of output intensities you'll experience over ${distance.toUpperCase()}.`,
      specs: ["Fabric: 100% Merino wool 250gsm", "Fit: Next-to-skin", "Odor control: Natural merino", "Care: Machine wash cold"],
      links: makeLinks("Smartwool Merino 250 Base Layer Crew", 100),
    });
    items.push({
      category: "Insulation Layer", product: temp === "extreme" ? "R1 Hoody" : "Nano Puff Vest", brand: "Patagonia",
      price: temp === "extreme" ? 149 : 179, tier: "premium",
      why: temp === "extreme"
        ? `At sub-20°F, active insulation is the difference between a hard race and a dangerous one. The R1 grid fleece breathes hard on climbs and retains warmth when you slow down — layer it under a shell for full protection.`
        : `A vest delivers core warmth without restricting arm swing — the ideal mid-layer for running. It packs into its own pocket and lives in your vest until temperatures drop at night or on a long descent.`,
      specs: temp === "extreme"
        ? ["Fabric: Polartec Power Grid fleece", "Fit: Slim, layerable", "Weight: 297g (M)", "Packs to: Chest pocket"]
        : ["Fill: PrimaLoft Gold Eco", "Weight: 212g (M)", "Packs to: Hand pocket", "DWR: Yes"],
      links: makeLinks(`Patagonia ${temp === "extreme" ? "R1 Hoody" : "Nano Puff Vest"}`, temp === "extreme" ? 149 : 179),
    });
  } else {
    const name = hot ? "Capilene Cool Daily Shirt" : "Merino 150 Long Sleeve";
    const brand = hot ? "Patagonia" : "Smartwool";
    const price = hot ? 45 : 75;
    items.push({
      category: "Base Layer — Top", product: name, brand, price, tier: "standard",
      why: hot
        ? `UPF 50+ blocks sun radiation that compounds heat stress over long desert miles. The Polygiene odor control stays effective through your entire race — no synthetic funk at mile 25.`
        : `Lightweight merino transitions from cool starts to warm midday without soaking through. It layers under a shell if temperatures drop overnight without adding bulk to your vest.`,
      specs: hot
        ? ["UPF: 50+", "Fabric: Recycled polyester", "Odor control: Polygiene", "Weight: 128g (M)"]
        : ["Fabric: 100% Merino 150gsm", "UPF: 20+", "Odor control: Natural merino", "Weight: 198g (M)"],
      links: makeLinks(`${brand} ${name}`, price),
    });
  }

  // ── CLOTHING: BOTTOM ──
  if (cold) {
    items.push({
      category: "Bottom — Tights", product: "Capilene Midweight Tights", brand: "Patagonia", price: 89, tier: "standard",
      why: `Cold legs lose heat faster than any other body part during the slow miles of a ${distance.toUpperCase()}. Midweight Capilene keeps blood flowing to your quads and calves. Flatlock seams prevent inner-thigh chafing over 50+ miles.`,
      specs: ["Fabric: Capilene 3 polyester", "Fit: Slim trail-running cut", "Seams: Flatlock (anti-chafe)", "Waist: Elastic + drawcord"],
      links: makeLinks("Patagonia Capilene Midweight Tights", 89),
    });
  } else {
    const name = longRace ? "5\" AFO Middle Short" : "Strider Pro Shorts 5\"";
    const brand = longRace ? "Janji" : "Patagonia";
    const price = longRace ? 68 : 65;
    items.push({
      category: "Bottom — Shorts", product: name, brand, price, tier: "standard",
      why: longRace
        ? `Six accessible pockets let you carry nutrition without digging into your vest every mile — a genuine time-saver at race pace. The 4-way stretch and performance liner hold up for the full distance without chafing.`
        : `The 5-inch inseam hits the sweet spot between coverage and mobility for trail running. The built-in liner eliminates a layer and the secure gel pocket keeps nutrition accessible on the move.`,
      specs: longRace
        ? ["Pockets: 6 (including 2 side)", "Liner: Built-in performance", "Stretch: 4-way", "Inseam: 5\""]
        : ["Pockets: 3 (including gel pocket)", "Liner: Built-in brief", "Fabric: Recycled polyester", "Inseam: 5\""],
      links: makeLinks(`${brand} ${name}`, price),
    });
  }

  // ── SHELL ──
  if (!hot || mountain) {
    const isMountain = mountain;
    const name = isMountain ? "Norvan SL Hoody" : budgetTier === "budget" ? "Helium Rain Jacket" : "Ultralight Stretch Rain Jacket";
    const brand = isMountain ? "Arc'teryx" : budgetTier === "budget" ? "Outdoor Research" : "Patagonia";
    const price = isMountain ? 299 : budgetTier === "budget" ? 150 : 249;
    items.push({
      category: "Rain / Wind Shell", product: name, brand, price, tier: isMountain ? "premium" : budgetTier,
      why: isMountain
        ? `Alpine weather can go from 70°F to rain and hail in 20 minutes. Gore-Tex Shakedry never wets out, sheds water on contact, and weighs so little you'll forget it's in your vest until you desperately need it.`
        : `Six ounces of waterproof protection that packs into its own chest pocket. You'll carry it the whole race and might never use it — but the one time you need it, it's the most valuable item in your pack.`,
      specs: isMountain
        ? ["Weight: 130g (M)", "Waterproofing: Gore-Tex Shakedry", "Seams: Fully taped", "Packs to: Own pocket"]
        : budgetTier === "budget"
        ? ["Weight: 175g (M)", "Waterproofing: 2.5L Pertex Shield", "Seams: Fully taped", "Packs to: Own pocket"]
        : ["Weight: 210g (M)", "Waterproofing: H2No 2.5L", "Seams: Fully taped", "Stretch: 4-way"],
      links: makeLinks(`${brand} ${name}`, price),
    });
  }

  // ── SOCKS ──
  const sockName = priority === "feet" ? "Run Endure Crew" : cold ? "Merino Outdoor Medium Crew" : "Run No-Show Tab Lightweight";
  const sockBrand = cold ? "Smartwool" : "Darn Tough";
  const sockPrice = priority === "feet" ? 26 : cold ? 26 : 22;
  items.push({
    category: "Socks", product: sockName, brand: sockBrand, price: sockPrice, tier: "standard",
    why: priority === "feet"
      ? `Blister-prone runners need the extra cushion of the Endure Crew. The seamless toe construction eliminates the single biggest cause of blisters. Lifetime warranty means these are a long-term investment, not a race-day gamble.`
      : cold
      ? `Merino wool stays warm even when damp — critical when stream crossings and snow patches are inevitable on cold-weather courses. The cushioning absorbs impact on long descents.`
      : `The no-brainer sock for trail ultras. Lifetime guarantee (no questions asked), merino wool for natural blister resistance, seamless toe. Buy three pairs and never think about socks again.`,
    specs: ["Fabric: Merino wool blend", "Seams: Seamless toe", "Warranty: Lifetime (Darn Tough)", "Weight: Light cushion"],
    links: makeLinks(`${sockBrand} ${sockName}`, sockPrice),
  });

  if (priority === "feet" || longRace) {
    items.push({
      category: "Foot Care", product: "Anti-Blister Kit", brand: "Mixed (SNB + Leukotape)", price: 25, tier: "budget",
      why: `Blisters are the #1 preventable DNF cause. Apply Squirrel's Nut Butter before the start, use Leukotape on known hot spots pre-race, and carry the sterile needle for mid-race drainage before a blister becomes race-ending.`,
      specs: ["Includes: Squirrel's Nut Butter 1oz", "Includes: Leukotape P (1\" roll)", "Includes: Sterile needle + gauze", "Weight: 2oz total kit"],
      links: {
        amazon: { url: "https://www.amazon.com/s?k=squirrels+nut+butter+leukotape&tag=finishultra-20", price: 25 },
        rw: { url: "https://www.runningwarehouse.com/searchresults/?searchTerm=blister+kit&sourceCode=FFULTRA", price: 24 },
      },
    });
    items.push({
      category: "Foot Care", product: "Run Original Weight No-Show", brand: "Injinji", price: 18, tier: "budget",
      why: `Toe socks physically prevent toe-on-toe friction — the root cause of blisters between toes. Many mountain 100 veterans layer Injinji toe socks under a regular sock for double protection on technical terrain.`,
      specs: ["Style: Individual toe compartments", "Fabric: Moisture-wicking polyester", "Cut: No-show", "Qty recommended: 2 pairs"],
      links: makeLinks("Injinji Run Original Weight No-Show toe socks", 18),
    });
  }

  // ── NUTRITION ──
  const nutritionItems: GearItem[] = [];
  const gelName = stomach === "sensitive" ? "Gel 100" : "Energy Gel Variety Pack";
  const gelBrand = stomach === "sensitive" ? "Maurten" : "GU";
  const gelPrice = stomach === "sensitive" ? 4 : 2;
  nutritionItems.push({
    category: "Nutrition — Gels", product: gelName, brand: gelBrand, price: gelPrice, tier: "standard",
    why: stomach === "sensitive"
      ? `Maurten's hydrogel technology is clinically shown to be gentler on GI systems at race pace — the only gel specifically designed for sensitive stomachs. Worth the premium when a GI incident at mile 50 means a DNF.`
      : `The trail running standard for two decades. 100 calories, 20g carbs, amino acids. Tested by millions of runners in every condition — which is exactly why you want them when your brain isn't functioning at mile 70.`,
    specs: gelBrand === "Maurten"
      ? ["Calories: 100 per gel", "Carbs: 25g", "Caffeine: 0mg (plain)", "GI-friendly: Hydrogel formula"]
      : ["Calories: 100 per gel", "Carbs: 22g", "Caffeine: 0–40mg (varies)", "Flavors: 20+ options"],
    links: makeLinks(`${gelBrand} ${gelName}`, gelPrice),
  });

  const foodName = stomach === "iron" ? "Picky Oats" : "Real Food Gel";
  const foodBrand = stomach === "iron" ? "Picky Bars" : "Muir Energy";
  nutritionItems.push({
    category: "Nutrition — Real Food", product: foodName, brand: foodBrand, price: 4, tier: "standard",
    why: stomach === "iron"
      ? `Real food in portable oatmeal format. Whole grains, dates, and nuts give you a fat/protein/carb mix that sustains energy longer than simple sugars — your iron gut can handle it even at mile 80.`
      : `Real ingredients in gel format — no synthetic flavors or artificial ingredients. 130 calories of dates, nuts, and seeds digest cleanly and prevent the flavor fatigue that kills gel-only strategies after mile 40.`,
    specs: stomach === "iron"
      ? ["Calories: 200 per pouch", "Carbs: 30g", "Protein: 7g", "Ingredients: Whole oats, dates, nuts"]
      : ["Calories: 130 per gel", "Carbs: 19g", "Fat: 5g", "Ingredients: Real food only"],
    links: makeLinks(`${foodBrand} ${foodName}`, 4),
  });

  if (sweat === "heavy" || longRace) {
    nutritionItems.push({
      category: "Electrolytes", product: "Fastchews", brand: "SaltStick", price: 12, tier: "budget",
      why: `${sweat === "heavy" ? "Heavy sweaters" : "100-mile runners"} need 600–800mg of sodium per hour in race conditions — far more than most sports drinks provide. Chewable tabs let you dose precisely without adding stomach volume.`,
      specs: ["Sodium: 100mg per tab", "Potassium: 30mg per tab", "Magnesium: 6mg per tab", "Tablets: 60 per tube"],
      links: makeLinks("SaltStick Fastchews electrolytes", 12),
    });
  }
  items.push(...nutritionItems);

  const hydName = sweat === "heavy" || hot ? "Sport Hydration Mix" : "Endurance Fuel";
  const hydBrand = sweat === "heavy" || hot ? "Skratch Labs" : "Tailwind";
  items.push({
    category: "Hydration Mix", product: hydName, brand: hydBrand, price: 30, tier: "standard",
    why: sweat === "heavy" || hot
      ? `Skratch's electrolyte profile is formulated to match real sweat chemistry — lower sugar, higher sodium. This is the drink for ${hot ? "hot weather" : "heavy sweaters"} who need actual electrolyte replacement, not just flavored sugar water.`
      : `All-in-one calories + electrolytes + hydration in a single scoop. Many runners have finished 100-milers on Tailwind alone — it simplifies fueling to one product and reduces the chance of forgetting to eat.`,
    specs: hydBrand === "Skratch Labs"
      ? ["Calories: 80 per serving", "Sodium: 380mg per serving", "Sugar: 18g", "Servings: 20 per bag"]
      : ["Calories: 100 per serving", "Sodium: 310mg per serving", "Carbs: 25g", "Servings: 30 per bag"],
    links: makeLinks(`${hydBrand} ${hydName}`, 30),
  });

  // ── SAFETY ──
  if (longRace) {
    items.push({
      category: "Safety", product: "Spot X Satellite Communicator", brand: "SPOT", price: 150, tier: "premium",
      why: `Remote 100-mile courses go miles from cell coverage. Two-way satellite messaging lets your crew track you live and gets help to you if something goes wrong at mile 85, 20 miles from the nearest road.`,
      specs: ["Coverage: Global satellite network", "Messaging: Two-way SMS via satellite", "Tracking: Customizable intervals", "SOS: 24/7 GEOS response center"],
      links: {
        amazon: { url: "https://www.amazon.com/s?k=SPOT+X+Satellite+Communicator&tag=finishultra-20", price: 150 },
        rei: { url: "https://www.rei.com/search?q=spot+x+satellite&cm_mmc=aff_AL-_-finishultra-_-1", price: 150 },
        direct: { url: "https://www.findmespot.com/en-us/products-services/SPOT-X?aff=finishultra", price: 149 },
      },
    });
    items.push({
      category: "Safety", product: "Emergency Bivvy", brand: "SOL", price: 20, tier: "budget",
      why: `8 ounces that can save your life. Mandatory gear on most mountain 100s. Packs to the size of a fist and reflects 90% of body heat. The one item you hope to never use but will never leave home without.`,
      specs: ["Weight: 3.8oz", "Size packed: 3.5\" × 5.5\"", "Material: Reflective polyethylene", "Heat retention: 90%"],
      links: makeLinks("SOL Emergency Bivvy space blanket", 20),
    });
  }

  // ── HEAD ──
  const headName = hot ? "XA Cap" : cold ? "Merino 250 Beanie" : "GOCap";
  const headBrand = hot ? "Salomon" : cold ? "Smartwool" : "Ciele";
  const headPrice = hot ? 30 : cold ? 35 : 38;
  items.push({
    category: "Head", product: headName, brand: headBrand, price: headPrice, tier: "standard",
    why: hot
      ? `Lightweight trail cap with UPF protection that blocks solar radiation directly hitting your head — the single biggest driver of overheating on exposed desert or alpine courses.`
      : cold
      ? `Merino wool beanie covers your ears without the bulk of a heavy hat. Naturally odor-resistant for multi-day use and warm even after it gets damp from sweat or precipitation.`
      : `Technical mesh construction with COOLwick sweatband wicks perspiration away from your forehead on moderate days. Fits under a headlamp without shifting.`,
    specs: hot
      ? ["UPF: 50+", "Fabric: Recycled polyester mesh", "Brim: 3cm sun protection", "Weight: 45g"]
      : cold
      ? ["Fabric: 100% Merino 250gsm", "Coverage: Ears", "Odor control: Natural merino", "Weight: 65g"]
      : ["Fabric: Technical mesh", "Sweatband: COOLwick", "Fit: Structured 5-panel", "Weight: 57g"],
    links: makeLinks(`${headBrand} ${headName}`, headPrice),
  });

  // ── GLOVES ──
  if (cold || night === "yes") {
    const isExtreme = temp === "extreme";
    const gloveName = isExtreme ? "Mercury Mitts" : "Merino 150 Gloves";
    const gloveBrand = isExtreme ? "Black Diamond" : "Smartwool";
    const glovePrice = isExtreme ? 45 : 40;
    items.push({
      category: "Gloves", product: gloveName, brand: gloveBrand, price: glovePrice, tier: "standard",
      why: isExtreme
        ? `Sub-20°F Alpine conditions are hands-down (pun intended) the most dangerous comfort factor in ultra running. The Mercury Mitts provide maximum warmth for extreme cold — when cold hands slow you down, everything slows down.`
        : `Lightweight merino gloves cover your hands for cold starts and night sections without overheating when you're working hard on climbs. Touchscreen-compatible so you can use your GPS watch without removing them.`,
      specs: isExtreme
        ? ["Fill: PrimaLoft Gold insulation", "Shell: Pertex Quantum windproof", "Cuff: Extended 3cm", "Weight: 72g/pair"]
        : ["Fabric: Merino 150gsm blend", "Touchscreen: Yes", "Cuff: Elastic", "Weight: 48g/pair"],
      links: makeLinks(`${gloveBrand} ${gloveName}`, glovePrice),
    });
  }

  // ── RECOVERY ──
  if (longRace || priority === "feet") {
    items.push({
      category: "Recovery", product: "Compression Socks 20–30mmHg", brand: "CEP", price: 65, tier: "standard",
      why: `Put these on within 30 minutes of finishing. The 20–30mmHg compression gradient dramatically accelerates fluid clearance from your lower legs, reducing next-day swelling and getting you walking normally faster.`,
      specs: ["Compression: 20–30mmHg graduated", "Fabric: Meryl Skinlife nylon", "Height: Knee-high", "Recommended: Wear 4–6 hrs post-race"],
      links: makeLinks("CEP Compression Socks 20-30mmHg recovery", 65),
    });
  }

  // ── BUILD KIT METADATA ──
  const totalCost = items.reduce((sum, i) => sum + i.price, 0);

  const packingChecklist = [
    "✓ Headlamp (fully charged) + spare batteries/backup",
    "✓ Rain jacket (even if forecast is clear)",
    "✓ Emergency space blanket or bivvy",
    "✓ Phone + portable charger (20,000mAh)",
    "✓ Trekking poles (if race-legal and terrain warrants)",
    "✓ Nutrition: enough for 1.5× the expected time between aid stations",
    "✓ Soft flasks filled, pack fully loaded before start",
    "✓ Anti-chafe applied: toes, thighs, underarms, nipples",
    "✓ Race bib and timing chip secured",
    "✓ Crew and pacer contact sheets printed",
    ...(night === "yes" ? ["✓ Night gear in accessible front pocket (not buried in pack)"] : []),
    ...(cold ? ["✓ Extra gloves and hat in pack for emergency"] : []),
    ...(longRace ? ["✓ Drop bag labeled with crew point name and mile marker"] : []),
  ];

  const dropBagEssentials = longRace
    ? [
        "Fresh socks (2 pairs)", "Dry shirt / base layer", "Replacement headlamp + batteries",
        "Extra nutrition (gels, real food, drink mix)", "Blister kit (Leukotape, needle, SNB, gauze)",
        "Anti-chafe stick", "Charged backup phone battery",
        cold ? "Warm mid-layer (puffy or fleece)" : "Light gloves and arm sleeves",
        "Ibuprofen + anti-nausea (Zofran if prescribed)", "Spare hydration flask",
        "Change of shoes (if planned swap at mile 60–70)", "Crew notes / splits cheat sheet",
      ]
    : [
        "Extra nutrition", "Fresh socks", "Anti-chafe stick",
        "Spare headlamp (if night sections)", "Dry shirt for after finish",
      ];

  const testingTimeline = [
    `12 weeks out: Buy shoes — log at least 80 miles in race-day pair before taper`,
    `10 weeks out: Test full pack weight on back-to-back long runs`,
    `8 weeks out: Test nutrition plan during your longest run (simulate aid station food)`,
    `6 weeks out: Practice night running with headlamp — test battery life`,
    `4 weeks out: Do a full dress rehearsal in your complete race kit`,
    `2 weeks out: Nothing new. If it isn't tested, leave it at home`,
    `Race week: Charge all electronics. Prep drop bags. Confirm mandatory gear list`,
  ];

  return {
    title: `Your ${distance.toUpperCase()} ${terrain === "mountain" ? "Mountain" : terrain === "desert" ? "Desert" : ""} Kit — ${hot ? "Hot Weather" : cold ? "Cold Weather" : "All-Conditions"}`,
    subtitle: `Personalized for a ${experience === "first" ? "first-timer" : experience === "beginner" ? "developing ultra runner" : experience === "intermediate" ? "experienced runner" : "veteran racer"} · ${budget === "budget" ? "Value" : budget === "standard" ? "Balanced" : "Performance"} build · Est. total: ~$${totalCost.toLocaleString()}`,
    items,
    packingChecklist,
    dropBagEssentials,
    testingTimeline,
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
  "Footwear": "👟", "Footwear (Drop Bag)": "👟", "Hydration Pack": "🎒",
  "Lighting — Headlamp": "🔦", "Lighting — Backup": "🔦",
  "Base Layer — Top": "👕", "Insulation Layer": "🧥",
  "Bottom — Tights": "🩱", "Bottom — Shorts": "🩳",
  "Rain / Wind Shell": "🌧️", "Socks": "🧦",
  "Foot Care": "🩹", "Foot Care Kit": "🩹",
  "Nutrition — Gels": "⚡", "Nutrition — Real Food": "🍌",
  "Electrolytes": "🧂", "Hydration Mix": "💧",
  "Safety": "🛡️", "Head": "🧢", "Gloves": "🧤", "Recovery": "💪",
};

const RETAILER_LABELS: Record<string, string> = {
  rei: "REI", amazon: "Amazon", backcountry: "Backcountry", rw: "Running Warehouse", direct: "Brand Direct",
};

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  item,
  purchased,
  onToggle,
  position,
  kitType,
}: {
  item: GearItem;
  purchased: boolean;
  onToggle: () => void;
  position: number;
  kitType: string;
}) {
  const [showSpecs, setShowSpecs] = useState(false);

  const retailers = Object.entries(item.links) as [string, RetailerLink][];
  const lowestRetailer = retailers.reduce<[string, RetailerLink] | null>((best, curr) =>
    !best || curr[1].price < best[1].price ? curr : best, null);
  const primaryRetailer = item.links.rei ? ["rei", item.links.rei] as [string, RetailerLink]
    : retailers[0] ?? null;
  const secondaryRetailers = retailers.filter(([k]) => k !== primaryRetailer?.[0]);
  const hasSavings = lowestRetailer && primaryRetailer && lowestRetailer[1].price < primaryRetailer[1].price - 4;

  return (
    <div className={`rounded-xl border transition-all ${purchased ? "border-green-200 bg-green-50/50 opacity-80" : "border-gray-200 bg-white"}`}>
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Image placeholder */}
          <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-2xl">
            {CATEGORY_ICONS[item.category] ?? "📦"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-headline font-bold text-dark text-sm leading-snug">{item.brand} {item.product}</p>
                <p className="text-xs text-gray mt-0.5">{item.category}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-accent text-base">${item.price}</span>
                <button
                  onClick={() => {
                    trackEvent({ event: "purchase_tracked", product_name: `${item.brand} ${item.product}`, category: item.category, marked_purchased: !purchased, kit_type: kitType });
                    onToggle();
                  }}
                  title={purchased ? "Mark as not purchased" : "Mark as purchased"}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors text-xs ${
                    purchased ? "border-green-500 bg-green-500 text-white" : "border-gray-300 hover:border-primary"
                  }`}
                >
                  {purchased ? "✓" : ""}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Why */}
        <p className="text-xs text-gray leading-relaxed mb-3">{item.why}</p>

        {/* Specs toggle */}
        {item.specs.length > 0 && (
          <button
            onClick={() => {
              const next = !showSpecs;
              setShowSpecs(next);
              if (next) trackEvent({ event: "specs_viewed", product_name: `${item.brand} ${item.product}`, category: item.category, kit_type: kitType });
            }}
            className="text-xs text-primary font-medium mb-3 hover:underline"
          >
            {showSpecs ? "Hide specs ↑" : "View specs ↓"}
          </button>
        )}
        {showSpecs && item.specs.length > 0 && (
          <div className="grid grid-cols-2 gap-1 mb-3">
            {item.specs.map((s) => (
              <div key={s} className="text-xs text-dark bg-gray-50 rounded px-2 py-1 border border-gray-100">
                {s}
              </div>
            ))}
          </div>
        )}

        {/* Buy buttons */}
        {retailers.length > 0 && (
          <div className="space-y-2">
            {/* Primary button */}
            {primaryRetailer && (
              <a
                href={primaryRetailer[1].url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() => trackEvent({ event: "product_click", product_name: `${item.brand} ${item.product}`, retailer: RETAILER_LABELS[primaryRetailer[0]], price: primaryRetailer[1].price, category: item.category, kit_type: kitType, position })}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all hover:shadow-md"
              >
                <span>🛒</span>
                <span>Buy at {RETAILER_LABELS[primaryRetailer[0]]} — ${primaryRetailer[1].price}</span>
                <span>→</span>
              </a>
            )}

            {/* Secondary retailer buttons */}
            {secondaryRetailers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {secondaryRetailers.map(([key, info]) => (
                  <a
                    key={key}
                    href={info.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => trackEvent({ event: "product_click", product_name: `${item.brand} ${item.product}`, retailer: RETAILER_LABELS[key], price: info.price, category: item.category, kit_type: kitType, position })}
                    className="flex-1 min-w-[120px] text-center px-3 py-2 border border-gray-200 hover:border-primary hover:bg-primary/5 text-dark text-xs font-medium rounded-lg transition-all"
                  >
                    {RETAILER_LABELS[key]} — ${info.price}
                  </a>
                ))}
              </div>
            )}

            {/* Lowest price badge */}
            {hasSavings && lowestRetailer && (() => {
              const savings = primaryRetailer![1].price - lowestRetailer[1].price;
              return (
                <div
                  className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 cursor-pointer"
                  onClick={() => trackEvent({ event: "price_comparison_viewed", product_name: `${item.brand} ${item.product}`, cheapest_retailer: RETAILER_LABELS[lowestRetailer[0]], savings })}
                >
                  <span className="text-sm">💡</span>
                  <p className="text-xs text-dark font-medium">
                    Lowest price: {RETAILER_LABELS[lowestRetailer[0]]} — ${lowestRetailer[1].price}{" "}
                    <span className="text-green-700">(save ${savings})</span>
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Purchased state */}
        {purchased && (
          <div className="mt-2 text-center text-xs text-green-700 font-semibold">✅ Purchased</div>
        )}
      </div>

      {/* Affiliate note */}
      <div className="px-4 pb-3">
        <p className="text-[10px] text-gray/60 italic">As an affiliate, we earn from qualifying purchases at no cost to you.</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function KitBuilder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [kit, setKit] = useState<Kit | null>(null);
  const [activeTab, setActiveTab] = useState<"gear" | "packing" | "dropbag" | "timeline">("gear");
  const [purchased, setPurchasedRaw] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set<string>();
    try {
      const stored = localStorage.getItem("finishultra_kit_purchased");
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  // Persist purchased set to localStorage on every change
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    try {
      localStorage.setItem("finishultra_kit_purchased", JSON.stringify([...purchased]));
    } catch { /* storage full or unavailable */ }
  }, [purchased]);

  function setPurchased(updater: (prev: Set<string>) => Set<string>) {
    setPurchasedRaw(updater);
  }

  const currentQ = QUESTIONS[step];
  const progress = Math.round((step / QUESTIONS.length) * 100);

  function select(value: string) {
    const next = { ...answers, [currentQ.id]: value } as Answers;
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setKit(buildKit(next));
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setKit(null);
    setActiveTab("gear");
    setPurchasedRaw(new Set());
    try { localStorage.removeItem("finishultra_kit_purchased"); } catch { /* ignore */ }
  }

  function togglePurchased(key: string) {
    setPurchased((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const totalCost = kit ? kit.items.reduce((sum, i) => sum + i.price, 0) : 0;
  const purchasedCost = kit
    ? kit.items.filter((i) => purchased.has(`${i.category}::${i.product}`)).reduce((sum, i) => sum + i.price, 0)
    : 0;
  const purchasedCount = purchased.size;
  const progressPct = totalCost > 0 ? Math.round((purchasedCost / totalCost) * 100) : 0;

  const groupedItems = kit
    ? kit.items.reduce<Record<string, GearItem[]>>((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {})
    : {};

  const currentSection = QUESTIONS[step]?.section;
  const sectionSteps = ["Race Details", "Runner Profile", "Personal Factors"];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark to-gray-800 px-6 py-5 text-white">
        <h2 className="font-headline text-xl font-bold">Custom Kit Builder</h2>
        <p className="text-gray-300 text-sm mt-1">
          10 questions → a complete, personalized gear kit for your exact race.
        </p>
      </div>

      {!kit ? (
        /* ── QUIZ ─────────────────────────────────────────────────── */
        <div className="p-6 sm:p-8">
          <div className="flex gap-2 mb-5">
            {sectionSteps.map((s) => (
              <div
                key={s}
                className={`flex-1 text-center text-xs font-medium py-1.5 rounded-lg transition-colors ${
                  s === currentSection
                    ? "bg-primary text-white"
                    : sectionSteps.indexOf(s) < sectionSteps.indexOf(currentSection)
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-100 text-gray"
                }`}
              >
                {s}
              </div>
            ))}
          </div>

          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
            <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <p className="text-sm text-gray font-medium mb-2">Question {step + 1} of {QUESTIONS.length}</p>
          <h3 className="font-headline text-2xl font-bold text-dark mb-6">
            {currentQ.icon} {currentQ.question}
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {currentQ.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => select(opt.value)}
                className="text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all font-medium text-dark"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="mt-4 text-sm text-gray hover:text-primary transition-colors">
              ← Back
            </button>
          )}
        </div>
      ) : (
        /* ── RESULTS ───────────────────────────────────────────────── */
        <>
        <div className="p-6 sm:p-8">
          {/* Kit header */}
          <div className="flex items-start justify-between mb-5 gap-4">
            <div>
              <h3 className="font-headline text-xl font-bold text-dark">{kit.title}</h3>
              <p className="text-sm text-gray mt-1">{kit.subtitle}</p>
            </div>
            <button onClick={restart} className="text-sm text-primary hover:underline font-medium shrink-0">
              Rebuild →
            </button>
          </div>

          {/* Budget tiers */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-dark">${Math.round(totalCost * 0.75).toLocaleString()}</p>
              <p className="text-xs text-gray mt-0.5">Budget build</p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-primary">${totalCost.toLocaleString()}</p>
              <p className="text-xs text-gray mt-0.5">Standard build</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-accent">${Math.round(totalCost * 1.35).toLocaleString()}</p>
              <p className="text-xs text-gray mt-0.5">Premium build</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
            {(["gear", "packing", "dropbag", "timeline"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === tab ? "bg-white text-dark shadow-sm" : "text-gray hover:text-dark"
                }`}
              >
                {tab === "gear" ? "Gear List" : tab === "packing" ? "Pack Checklist" : tab === "dropbag" ? "Drop Bags" : "Testing Plan"}
              </button>
            ))}
          </div>

          {/* ── GEAR TAB ──────────────────────────────────────────── */}
          {activeTab === "gear" && (
            <div className="space-y-5">
              {/* Bulk buy buttons */}
              <div className="bg-dark rounded-xl p-4 space-y-2">
                <p className="text-white text-xs font-semibold uppercase tracking-wide mb-3">Quick Purchase Options</p>
                <a
                  href={`https://www.rei.com/search?q=ultra+marathon+gear&cm_mmc=aff_AL-_-finishultra-_-1`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() => trackEvent({ event: "bulk_purchase_click", retailer: "REI", total_price: totalCost, kit_type: kit.title })}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all hover:shadow-md"
                >
                  🛒 Shop Complete Kit at REI — ${totalCost.toLocaleString()} →
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://www.amazon.com/s?k=ultra+marathon+gear&tag=finishultra-20`}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => trackEvent({ event: "bulk_purchase_click", retailer: "Amazon", total_price: Math.round(totalCost * 0.97), kit_type: kit.title })}
                    className="text-center px-3 py-2.5 border border-white/20 hover:bg-white/10 text-white text-xs font-medium rounded-lg transition-all"
                  >
                    Amazon — ${Math.round(totalCost * 0.97).toLocaleString()}
                  </a>
                  <a
                    href={`https://www.runningwarehouse.com/searchresults/?searchTerm=ultra+trail&sourceCode=FFULTRA`}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => trackEvent({ event: "bulk_purchase_click", retailer: "Running Warehouse", total_price: Math.round(totalCost * 0.96), kit_type: kit.title })}
                    className="text-center px-3 py-2.5 border border-white/20 hover:bg-white/10 text-white text-xs font-medium rounded-lg transition-all"
                  >
                    Running Warehouse — ${Math.round(totalCost * 0.96).toLocaleString()}
                  </a>
                </div>
                <p className="text-gray-400 text-[11px] text-center pt-1">
                  Or purchase items individually below ↓
                </p>
              </div>

              {/* Budget progress tracker */}
              {purchasedCount > 0 && (
                <div className="bg-light rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-dark">Kit Progress</p>
                    <p className="text-xs text-gray">{purchasedCount} of {kit.items.length} items purchased</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700 font-medium">Purchased: ${purchasedCost.toLocaleString()}</span>
                    <span className="text-gray">Remaining: ${(totalCost - purchasedCost).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Product cards by category */}
              {(() => {
                let globalIndex = 0;
                return Object.entries(groupedItems).map(([category, categoryItems]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{CATEGORY_ICONS[category] ?? "📦"}</span>
                      <span className="text-sm font-bold text-dark uppercase tracking-wide">{category}</span>
                    </div>
                    <div className="space-y-3">
                      {categoryItems.map((item) => {
                        const key = `${item.category}::${item.product}`;
                        const pos = ++globalIndex;
                        return (
                          <ProductCard
                            key={key}
                            item={item}
                            purchased={purchased.has(key)}
                            onToggle={() => togglePurchased(key)}
                            position={pos}
                            kitType={kit.title}
                          />
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}

              {/* Total */}
              <div className="bg-dark rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold text-sm">Estimated Total</span>
                  {purchasedCount > 0 && (
                    <p className="text-gray-400 text-xs mt-0.5">${purchasedCost.toLocaleString()} purchased · ${(totalCost - purchasedCost).toLocaleString()} remaining</p>
                  )}
                </div>
                <span className="text-accent font-bold text-xl">~${totalCost.toLocaleString()}</span>
              </div>

              {/* Page-level affiliate disclosure */}
              <p className="text-[11px] text-gray text-center leading-relaxed px-2">
                <strong>Affiliate Disclosure:</strong> FinishUltra earns a small commission on purchases made through links on this page, at no additional cost to you. All recommendations are based on product performance — we never accept payment for placement.
              </p>
            </div>
          )}

          {/* ── PACKING TAB ───────────────────────────────────────── */}
          {activeTab === "packing" && (
            <div className="space-y-2">
              <p className="text-sm text-gray mb-4">Go through this list the morning before your race. Missing items have DNF&apos;d more runners than bad fitness.</p>
              {kit.packingChecklist.map((item) => (
                <div key={item} className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-dark border border-gray-100">{item}</div>
              ))}
            </div>
          )}

          {/* ── DROP BAG TAB ──────────────────────────────────────── */}
          {activeTab === "dropbag" && (
            <div>
              <p className="text-sm text-gray mb-4">Pack these in a clearly labeled dry bag for each crew access point.</p>
              <div className="space-y-2">
                {kit.dropBagEssentials.map((item) => (
                  <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                    <span className="text-primary mt-0.5">→</span>
                    <span className="text-sm text-dark">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-primary/5 rounded-xl p-4 border border-primary/20">
                <p className="text-sm font-semibold text-dark mb-1">Pro Tip: The Two-Bag System</p>
                <p className="text-sm text-gray">Pack a &ldquo;quick access&rdquo; small bag on top of everything — items you&apos;ll definitely use (socks, food, chafe stick). The main bag holds emergency items you might need. Saves 10+ minutes at crew points when your brain isn&apos;t working at mile 75.</p>
              </div>
            </div>
          )}

          {/* ── TIMELINE TAB ─────────────────────────────────────── */}
          {activeTab === "timeline" && (
            <div className="space-y-3">
              <p className="text-sm text-gray mb-4">Nothing on race day should be new. This is how you test your kit so gear never becomes the reason you DNF.</p>
              {kit.testingTimeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-sm text-dark">{item}</span>
                </div>
              ))}
              <div className="bg-accent/10 rounded-xl p-4 border border-accent/20 mt-2">
                <p className="text-sm font-semibold text-dark mb-1">The Golden Rule</p>
                <p className="text-sm text-gray">If you haven&apos;t worn it for at least 6 hours at race pace, it doesn&apos;t go in the bag. Hot spots, rubbing, bounce, and sweat-induced chafing only reveal themselves on long efforts — not in the store or on a 5-mile shakeout.</p>
              </div>
            </div>
          )}
        </div>

        {/* ── STICKY MOBILE PROGRESS BAR ──────────────────────────
            Visible on mobile only once at least one item is checked.
            Fixed to bottom of viewport, above the browser chrome.   */}
        {purchasedCount > 0 && (
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-dark">
                Kit Progress — {purchasedCount}/{kit.items.length} purchased
              </span>
              <span className="text-xs font-bold text-green-700">{progressPct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray">
              <span className="text-green-700 font-medium">${purchasedCost.toLocaleString()} purchased</span>
              <span>${(totalCost - purchasedCost).toLocaleString()} remaining</span>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  );
}
