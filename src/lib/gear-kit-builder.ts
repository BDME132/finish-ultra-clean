import type { Answers } from "@/types/gear";

export type RetailerLink = { url: string; price: number };

export type ProductLinks = {
  amazon: RetailerLink;
};

export type GearTier = "budget" | "standard" | "premium" | "elite";

export type GearItem = {
  category: string;
  product: string;
  brand: string;
  price: number;
  why: string;
  tier: GearTier;
  specs: string[];
  links: ProductLinks;
  productId?: string;
};

export type BuiltKit = {
  title: string;
  subtitle: string;
  items: GearItem[];
  packingChecklist: string[];
  dropBagEssentials: string[];
  testingTimeline: string[];
  impactBadges: string[];
  selectedTier: GearTier;
};

function makeLinks(searchTerm: string, basePrice: number): ProductLinks {
  const q = encodeURIComponent(searchTerm);
  return {
    amazon: { url: `https://www.amazon.com/s?k=${q}&tag=finishultra-20`, price: basePrice },
  };
}

function getBudgetTier(budget: Answers["budget"]): GearTier {
  if (budget === "budget") return "budget";
  if (budget === "standard") return "standard";
  if (budget === "premium") return "premium";
  return "elite";
}

function getBuildLabel(budget: Answers["budget"]): string {
  if (budget === "budget") return "Value";
  if (budget === "standard") return "Balanced";
  if (budget === "premium") return "Performance";
  return "Elite";
}

function getImpactBadges(answers: Answers): string[] {
  const badges: string[] = [];

  if (answers.night === "yes") {
    badges.push("Night sections added dedicated lighting and glove planning");
  }

  if (answers.feetWidth === "wide" || answers.feetWidth === "xwide") {
    badges.push("Foot width changed the shoe fit recommendation");
  }

  if (answers.stomach === "sensitive") {
    badges.push("Sensitive stomach swapped in gentler race fuel");
  }

  if (answers.sweat === "heavy") {
    badges.push("Heavy sweat rate increased electrolyte support");
  }

  if (answers.temp === "cold" || answers.temp === "extreme") {
    badges.push("Cold conditions added insulation and emergency warmth layers");
  }

  if (answers.priority === "minimal") {
    badges.push("Minimal-carry priority trimmed pack volume where possible");
  }

  if (answers.experience === "first") {
    badges.push("First-ultra profile added extra blister and chafe protection");
  } else if (answers.experience === "beginner") {
    badges.push("Developing-runner profile added rehearsal and organization safeguards");
  } else if (answers.experience === "veteran") {
    badges.push("Veteran profile trimmed redundant prep and favored race-specific efficiency");
  }

  if (answers.budget === "elite") {
    badges.push("Elite budget unlocked race-day-first premium picks");
  }

  return badges;
}

export function buildKit(answers: Answers): BuiltKit {
  const { distance, terrain, temp, night, experience, budget, sweat, stomach, feetWidth, priority } = answers;
  const cold = temp === "cold" || temp === "extreme";
  const hot = temp === "hot";
  const longRace = distance === "100k" || distance === "100m";
  const mountain = terrain === "mountain";
  const budgetTier = getBudgetTier(budget);

  const items: GearItem[] = [];

  // Footwear
  if (feetWidth === "xwide" || feetWidth === "wide") {
    const isElite = budgetTier === "elite";
    const name =
      feetWidth === "xwide"
        ? isElite
          ? "Olympus 6"
          : "Speedgoat 5 Wide"
        : isElite
        ? "Timp 5 Wide"
        : "Speedgoat 5";
    const brand =
      feetWidth === "xwide"
        ? isElite
          ? "Altra"
          : "HOKA"
        : isElite
        ? "Altra"
        : "HOKA";
    const price =
      feetWidth === "xwide"
        ? isElite
          ? 180
          : 155
        : isElite
        ? 165
        : 145;

    items.push({
      category: "Footwear",
      product: name,
      brand,
      price,
      tier: isElite ? "elite" : "standard",
      why: `Your ${feetWidth === "xwide" ? "extra-wide" : "wide"} fit requirement changes the shoe more than any trend or review list. This pick prioritizes toe-box comfort for late-race swelling and long descents.`,
      specs: isElite
        ? ["Fit: Wide/high-volume platform", "Use case: Long-distance comfort", "Upper: Breathable engineered mesh", "Priority: Toe-box space under fatigue"]
        : ["Stack: 36mm/32mm", "Drop: 4mm", "Lugs: 5mm Vibram Megagrip", "Weight: 10.9oz (M9)"],
      links: makeLinks(`${brand} ${name}`, price),
    });
  } else if (mountain) {
    const name =
      budgetTier === "budget"
        ? "Peregrine 13"
        : budgetTier === "elite"
        ? "Norda 001"
        : "Torrent 3";
    const brand =
      budgetTier === "budget"
        ? "Saucony"
        : budgetTier === "elite"
        ? "Norda"
        : "HOKA";
    const price =
      budgetTier === "budget"
        ? 130
        : budgetTier === "elite"
        ? 285
        : 140;

    items.push({
      category: "Footwear",
      product: name,
      brand,
      price,
      tier: budgetTier,
      why: `Technical mountain terrain punishes sloppy footwear choices. This pick is tuned for secure climbing, predictable descending, and rock protection over long alpine miles.`,
      specs:
        budgetTier === "budget"
          ? ["Stack: 24mm/20mm", "Drop: 4mm", "Lugs: 6mm PWRTRAC", "Weight: 9.7oz (M9)"]
          : budgetTier === "elite"
          ? ["Upper: Dyneema-based woven upper", "Priority: Durability + precision", "Outsole: Vibram grip", "Use case: Technical long-distance racing"]
          : ["Stack: 28mm/23mm", "Drop: 5mm", "Lugs: 5mm Vibram Megagrip", "Weight: 8.6oz (M9)"],
      links: makeLinks(`${brand} ${name}`, price),
    });
  } else if (hot) {
    const name = budgetTier === "elite" ? "S/Lab Genesis" : "Sense Ride 5";
    const brand = "Salomon";
    const price = budgetTier === "elite" ? 200 : 140;

    items.push({
      category: "Footwear",
      product: name,
      brand,
      price,
      tier: budgetTier === "elite" ? "elite" : "standard",
      why: `Heat and exposure raise blister risk fast. This option emphasizes foothold security and breathable upper volume so your feet stay cooler and more stable on open terrain.`,
      specs:
        budgetTier === "elite"
          ? ["Upper: Fast-drying race mesh", "Priority: Precision + drainage", "Use case: Hot, runnable trail racing", "Weight: 9.2oz (M9)"]
          : ["Stack: 28mm/24mm", "Drop: 4mm", "Upper: Sensifit breathable mesh", "Weight: 9.5oz (M9)"],
      links: makeLinks(`${brand} ${name}`, price),
    });
  } else {
    const name =
      budgetTier === "budget"
        ? "Cascadia 16"
        : budgetTier === "premium"
        ? "Ultraventure Pro"
        : budgetTier === "elite"
        ? "Norda 001"
        : "Speedgoat 5";
    const brand =
      budgetTier === "budget"
        ? "Brooks"
        : budgetTier === "premium"
        ? "La Sportiva"
        : budgetTier === "elite"
        ? "Norda"
        : "HOKA";
    const price =
      budgetTier === "budget"
        ? 120
        : budgetTier === "premium"
        ? 170
        : budgetTier === "elite"
        ? 285
        : 145;

    items.push({
      category: "Footwear",
      product: name,
      brand,
      price,
      tier: budgetTier,
      why: `This is the all-conditions anchor of the kit: enough grip, enough cushion, and enough durability to disappear on race day instead of demanding attention.`,
      specs:
        budgetTier === "budget"
          ? ["Stack: 26mm/14mm", "Drop: 12mm", "Outsole: TrailTack rubber", "Weight: 10.8oz (M9)"]
          : budgetTier === "premium"
          ? ["Stack: 33mm/28mm", "Drop: 5mm", "Outsole: FriXion XT Climb", "Weight: 10.4oz (M9)"]
          : budgetTier === "elite"
          ? ["Upper: Bio-Dyneema woven upper", "Outsole: Vibram", "Priority: Precision + longevity", "Use case: Premium race-day build"]
          : ["Stack: 36mm/32mm", "Drop: 4mm", "Lugs: 5mm Vibram Megagrip", "Weight: 10.9oz (M9)"],
      links: makeLinks(`${brand} ${name}`, price),
    });
  }

  if (longRace) {
    const eliteDropBag = budgetTier === "elite";
    items.push({
      category: "Footwear (Drop Bag)",
      product: eliteDropBag ? "Tecton X 3" : "Clifton 9 Trail",
      brand: "HOKA",
      price: eliteDropBag ? 225 : 140,
      tier: eliteDropBag ? "elite" : "standard",
      why: `A long-race shoe swap lets you reset foot comfort deep into the event, when swelling and impact accumulation become the real problem.`,
      specs: eliteDropBag
        ? ["Use case: Fast late-race changeover", "Priority: Cushion + propulsion", "Best for: Runnable late-race terrain", "Swap window: Mile 60-70"]
        : ["Stack: 40mm/34mm", "Drop: 6mm", "Upper: Engineered mesh", "Weight: 9.7oz (M9)"],
      links: makeLinks(`HOKA ${eliteDropBag ? "Tecton X 3" : "Clifton 9 Trail"}`, eliteDropBag ? 225 : 140),
    });
  }

  // Hydration pack
  const packItem = (() => {
    if (priority === "minimal" || distance === "50k") {
      const name =
        budgetTier === "budget"
          ? "Fastpack 5 Vest"
          : budgetTier === "elite"
          ? "S/Lab Pulsar 3"
          : "Sense Pro 5";
      const brand =
        budgetTier === "budget"
          ? "CamelBak"
          : "Salomon";
      const price =
        budgetTier === "budget"
          ? 90
          : budgetTier === "elite"
          ? 180
          : 120;
      return {
        product: name,
        brand,
        price,
        tier: budgetTier,
        why: `This volume stays true to your low-carry priority and short aid-station gaps without forcing you into a cramped race setup.`,
        specs:
          budgetTier === "budget"
            ? ["Capacity: 5L", "Flasks: 2×500ml included", "Weight: 198g", "Pockets: 8 total"]
            : budgetTier === "elite"
            ? ["Capacity: 3L race-lean profile", "Priority: No-bounce fit", "Use case: High-efficiency race carry", "Access: Front fuel storage"]
            : ["Capacity: 5L", "Flasks: 2×500ml SoftFlask", "Weight: 165g", "Pockets: 6 total"],
        links: makeLinks(`${brand} ${name}`, price),
      };
    }

    if (longRace) {
      const name =
        budgetTier === "budget"
          ? "Race Vest 10L"
          : budgetTier === "elite"
          ? "S/Lab Ultra 10 Set"
          : "Zeal Pro 10L";
      const brand =
        budgetTier === "budget"
          ? "Nathan"
          : budgetTier === "elite"
          ? "Salomon"
          : "Ultimate Direction";
      const price =
        budgetTier === "budget"
          ? 100
          : budgetTier === "elite"
          ? 200
          : 160;
      return {
        product: name,
        brand,
        price,
        tier: budgetTier,
        why: `Long-race mandatory gear and slower late-race execution both reward a vest with stable capacity, easy pocket access, and enough organization for drop-bag transitions.`,
        specs:
          budgetTier === "budget"
            ? ["Capacity: 10L", "Flasks: 2×600ml included", "Weight: 312g", "Pole loops: Yes"]
            : budgetTier === "elite"
            ? ["Capacity: 10L", "Priority: Race-grade fit under load", "Access: Fast front storage", "Use case: Technical or overnight ultras"]
            : ["Capacity: 10L", "Flasks: 2×500ml included", "Weight: 280g", "Pole loops: Yes"],
        links: makeLinks(`${brand} ${name}`, price),
      };
    }

    const name =
      budgetTier === "budget"
        ? "Hydraknight 12"
        : budgetTier === "elite"
        ? "Adv Skin 12"
        : "Ultra Vest 3.0";
    const brand =
      budgetTier === "budget"
        ? "Osprey"
        : budgetTier === "elite"
        ? "Salomon"
        : "Ultimate Direction";
    const price =
      budgetTier === "budget"
        ? 90
        : budgetTier === "elite"
        ? 165
        : 140;

    return {
      product: name,
      brand,
      price,
      tier: budgetTier,
      why: `This is the middle-distance sweet spot: enough capacity for extra layers and nutrition without turning the vest into a bouncing backpack.`,
      specs:
        budgetTier === "budget"
          ? ["Capacity: 12L", "Reservoir: 2.5L compatible", "Weight: 340g", "Pockets: 10 total"]
          : budgetTier === "elite"
          ? ["Capacity: 12L", "Priority: Stable wrap fit", "Use case: Race-ready all-day vest", "Access: Front flask + quick-reach storage"]
          : ["Capacity: 8L", "Flasks: 2×500ml included", "Weight: 248g", "Pole loops: Yes"],
      links: makeLinks(`${brand} ${name}`, price),
    };
  })();
  items.push({ category: "Hydration Pack", ...packItem });

  // Lighting
  if (night === "yes" || longRace) {
    const name =
      budgetTier === "budget"
        ? "Core Headlamp 400"
        : budgetTier === "elite"
        ? "Nao RL"
        : "Iko Core 500";
    const brand =
      budgetTier === "budget"
        ? "Black Diamond"
        : "Petzl";
    const price =
      budgetTier === "budget"
        ? 50
        : budgetTier === "elite"
        ? 170
        : 80;

    items.push({
      category: "Lighting — Headlamp",
      product: name,
      brand,
      price,
      tier: budgetTier,
      why: `${longRace ? "Long overnight racing" : "Night running"} needs reliable runtime and a light you can trust when your decision-making is fading.`,
      specs:
        budgetTier === "budget"
          ? ["Lumens: 400 max", "Runtime: 200hr low / 4hr high", "Charge: USB-C", "Weight: 95g"]
          : budgetTier === "elite"
          ? ["Lighting: Reactive beam adjustment", "Priority: Runtime + visibility", "Charge: Rechargeable", "Use case: Serious overnight racing"]
          : ["Lumens: 500 max", "Runtime: 100hr low / 2hr high", "Charge: USB-C", "Weight: 105g"],
      links: makeLinks(`${brand} ${name}`, price),
    });

    if (longRace || experience !== "veteran") {
      items.push({
        category: "Lighting — Backup",
        product: budgetTier === "elite" ? "Bindi" : "Spot 400-E",
        brand: budgetTier === "elite" ? "Petzl" : "Black Diamond",
        price: budgetTier === "elite" ? 55 : 35,
        tier: budgetTier === "elite" ? "premium" : "budget",
        why: `Backup lighting is a mandatory-rules item for many races and a real safety hedge when batteries, weather, or timing go sideways.`,
        specs: budgetTier === "elite"
          ? ["Use case: Lightweight backup lamp", "Charge: USB", "Priority: Redundancy without bulk", "Pack placement: Vest-access pocket"]
          : ["Lumens: 400 max", "Runtime: 40hr low / 2hr high", "Battery: 3×AAA", "Weight: 88g (w/ batteries)"],
        links: makeLinks(`${budgetTier === "elite" ? "Petzl Bindi headlamp" : "Black Diamond Spot 400-E headlamp"}`, budgetTier === "elite" ? 55 : 35),
      });
    }
  }

  // Clothing
  if (cold) {
    items.push({
      category: "Base Layer — Top",
      product: "Merino 250 Base Layer Crew",
      brand: "Smartwool",
      price: 100,
      tier: "standard",
      why: `Cold-weather ultras reward warmth that still breathes when effort changes. Merino handles sweat, night sections, and weather swings better than a standard cotton-like layer.`,
      specs: ["Fabric: 100% Merino wool 250gsm", "Fit: Next-to-skin", "Odor control: Natural merino", "Care: Machine wash cold"],
      links: makeLinks("Smartwool Merino 250 Base Layer Crew", 100),
    });

    items.push({
      category: "Insulation Layer",
      product: temp === "extreme" ? (budgetTier === "elite" ? "Alpha Direct 90 Hoody" : "R1 Hoody") : "Nano Puff Vest",
      brand: temp === "extreme" && budgetTier === "elite" ? "Senchi" : "Patagonia",
      price: temp === "extreme" ? (budgetTier === "elite" ? 220 : 149) : 179,
      tier: budgetTier === "elite" && temp === "extreme" ? "elite" : "premium",
      why: temp === "extreme"
        ? `Sub-freezing ultras become gear-management races. This layer keeps you warm during pace drops and exposed sections without turning climbs into a sauna.`
        : `A packable core-warmth layer gives you real temperature range without eating up arm swing or vest space.`,
      specs: temp === "extreme"
        ? ["Priority: Warmth during output swings", "Packability: High", "Use case: Overnight cold or alpine racing", "Layer role: Mid-layer safety buffer"]
        : ["Fill: PrimaLoft Gold Eco", "Weight: 212g (M)", "Packs to: Hand pocket", "DWR: Yes"],
      links: makeLinks(`${temp === "extreme" && budgetTier === "elite" ? "Senchi Alpha Direct 90 Hoody" : `Patagonia ${temp === "extreme" ? "R1 Hoody" : "Nano Puff Vest"}`}`, temp === "extreme" ? (budgetTier === "elite" ? 220 : 149) : 179),
    });
  } else {
    const name = hot ? "Capilene Cool Daily Shirt" : "Merino 150 Long Sleeve";
    const brand = hot ? "Patagonia" : "Smartwool";
    const price = hot ? 45 : 75;
    items.push({
      category: "Base Layer — Top",
      product: name,
      brand,
      price,
      tier: "standard",
      why: hot
        ? `Sun and heat compound fast over ultra distance, so your base layer needs to help with both cooling and exposure.`
        : `This layer bridges cool starts and warmer mid-race conditions without forcing an early wardrobe change.`,
      specs: hot
        ? ["UPF: 50+", "Fabric: Recycled polyester", "Odor control: Polygiene", "Weight: 128g (M)"]
        : ["Fabric: 100% Merino 150gsm", "UPF: 20+", "Odor control: Natural merino", "Weight: 198g (M)"],
      links: makeLinks(`${brand} ${name}`, price),
    });
  }

  if (cold) {
    items.push({
      category: "Bottom — Tights",
      product: "Capilene Midweight Tights",
      brand: "Patagonia",
      price: 89,
      tier: "standard",
      why: `Cold legs sap efficiency late in a race. A midweight tight keeps descents and exposed stretches from becoming a body-temperature problem.`,
      specs: ["Fabric: Capilene 3 polyester", "Fit: Slim trail-running cut", "Seams: Flatlock (anti-chafe)", "Waist: Elastic + drawcord"],
      links: makeLinks("Patagonia Capilene Midweight Tights", 89),
    });
  } else {
    const name = longRace ? "5\" AFO Middle Short" : "Strider Pro Shorts 5\"";
    const brand = longRace ? "Janji" : "Patagonia";
    const price = longRace ? 68 : 65;
    items.push({
      category: "Bottom — Shorts",
      product: name,
      brand,
      price,
      tier: "standard",
      why: longRace
        ? `Multiple accessible pockets matter more the longer the race gets, because tiny aid-station inefficiencies add up.`
        : `This keeps nutrition accessible and minimizes the chance that short-shift, liner rub, or wet fabric becomes the distraction of the day.`,
      specs: longRace
        ? ["Pockets: 6 (including 2 side)", "Liner: Built-in performance", "Stretch: 4-way", "Inseam: 5\""]
        : ["Pockets: 3 (including gel pocket)", "Liner: Built-in brief", "Fabric: Recycled polyester", "Inseam: 5\""],
      links: makeLinks(`${brand} ${name}`, price),
    });
  }

  if (!hot || mountain) {
    const name = mountain
      ? budgetTier === "elite"
        ? "Norvan Shell Jacket"
        : "Norvan SL Hoody"
      : budgetTier === "budget"
      ? "Helium Rain Jacket"
      : budgetTier === "elite"
      ? "Storm Racer Jacket"
      : "Ultralight Stretch Rain Jacket";
    const brand = mountain
      ? "Arc'teryx"
      : budgetTier === "budget"
      ? "Outdoor Research"
      : "Patagonia";
    const price = mountain
      ? budgetTier === "elite"
        ? 400
        : 299
      : budgetTier === "budget"
      ? 150
      : budgetTier === "elite"
      ? 329
      : 249;
    items.push({
      category: "Rain / Wind Shell",
      product: name,
      brand,
      price,
      tier: mountain && budgetTier === "elite" ? "elite" : budgetTier,
      why: mountain
        ? `Mountain weather punishes optimism. This shell is here because alpine forecasts lie and exposed ridgelines turn “fine” into “dangerous” fast.`
        : `A shell is one of the highest-value emergency items in the kit: tiny when unused, enormous when conditions flip.`,
      specs: mountain
        ? budgetTier === "elite"
          ? ["Priority: Race-grade storm protection", "Packability: High", "Use case: Serious mountain weather", "Layer role: Mandatory shell anchor"]
          : ["Weight: 130g (M)", "Waterproofing: Gore-Tex Shakedry", "Seams: Fully taped", "Packs to: Own pocket"]
        : budgetTier === "budget"
        ? ["Weight: 175g (M)", "Waterproofing: 2.5L Pertex Shield", "Seams: Fully taped", "Packs to: Own pocket"]
        : budgetTier === "elite"
        ? ["Priority: Breathability + stormproofing", "Use case: Fast racing in unstable weather", "Packability: Vest-friendly", "Layer role: Race shell"]
        : ["Weight: 210g (M)", "Waterproofing: H2No 2.5L", "Seams: Fully taped", "Stretch: 4-way"],
      links: makeLinks(`${brand} ${name}`, price),
    });
  }

  // Socks and foot care
  const sockName = priority === "feet" ? "Run Endure Crew" : cold ? "Merino Outdoor Medium Crew" : "Run No-Show Tab Lightweight";
  const sockBrand = cold ? "Smartwool" : "Darn Tough";
  const sockPrice = priority === "feet" ? 26 : cold ? 26 : 22;
  items.push({
    category: "Socks",
    product: sockName,
    brand: sockBrand,
    price: sockPrice,
    tier: "standard",
    why: priority === "feet"
      ? `If foot comfort is your limiter, this is not the place to compromise. Sock friction control can save a race.`
      : cold
      ? `Cold courses reward a sock that still works after water, mud, or snow.`
      : `A durable, low-drama sock reduces the chance of race-day surprises more than almost any flashy accessory.`,
    specs: ["Fabric: Merino wool blend", "Seams: Seamless toe", "Warranty: Lifetime (Darn Tough)", "Weight: Light cushion"],
    links: makeLinks(`${sockBrand} ${sockName}`, sockPrice),
  });

  if (priority === "feet" || longRace || experience === "first") {
    items.push({
      category: "Foot Care",
      product: "Anti-Blister Kit",
      brand: "Mixed (SNB + Leukotape)",
      price: 25,
      tier: "budget",
      why: `This is cheap insurance against one of the most common preventable race-ending problems: ignored hot spots becoming full blister issues.`,
      specs: ["Includes: Squirrel's Nut Butter 1oz", "Includes: Leukotape P (1\" roll)", "Includes: Sterile needle + gauze", "Weight: 2oz total kit"],
      links: {
        amazon: { url: "https://www.amazon.com/s?k=squirrels+nut+butter+leukotape&tag=finishultra-20", price: 25 },
      },
    });
  }

  if (priority === "feet" || longRace || experience === "beginner") {
    items.push({
      category: "Foot Care",
      product: "Run Original Weight No-Show",
      brand: "Injinji",
      price: 18,
      tier: "budget",
      why: `Toe-on-toe friction is predictable and preventable. Toe socks are especially useful for runners still figuring out their blister system.`,
      specs: ["Style: Individual toe compartments", "Fabric: Moisture-wicking polyester", "Cut: No-show", "Qty recommended: 2 pairs"],
      links: makeLinks("Injinji Run Original Weight No-Show toe socks", 18),
    });
  }

  if (experience === "first") {
    items.push({
      category: "Foot Care",
      product: "Anti-Chafe Stick",
      brand: "Squirrel's Nut Butter",
      price: 15,
      tier: "budget",
      why: `First-time ultra runners tend to underestimate how many friction points show up after four or five hours. This prevents avoidable skin issues before they start.`,
      specs: ["Use case: Toes, thighs, underarms, bra line", "Application: Pre-race + aid station touchups", "Priority: Beginner mistake prevention", "Format: Pocket-sized stick"],
      links: makeLinks("Squirrel's Nut Butter anti chafe stick", 15),
    });
  }

  // Nutrition
  items.push({
    category: "Nutrition — Gels",
    product: stomach === "sensitive" ? "Gel 100" : "Energy Gel Variety Pack",
    brand: stomach === "sensitive" ? "Maurten" : "GU",
    price: stomach === "sensitive" ? 4 : 2,
    tier: stomach === "sensitive" ? "premium" : "standard",
    why: stomach === "sensitive"
      ? `You called out GI sensitivity, so the default shifts toward the gentler option instead of assuming “tough it out” will work late in the race.`
      : `A familiar, widely available gel reduces experimentation risk and makes training practice easier to repeat.`,
    specs: stomach === "sensitive"
      ? ["Calories: 100 per gel", "Carbs: 25g", "Caffeine: 0mg (plain)", "GI-friendly: Hydrogel formula"]
      : ["Calories: 100 per gel", "Carbs: 22g", "Caffeine: 0-40mg (varies)", "Flavors: 20+ options"],
    links: makeLinks(`${stomach === "sensitive" ? "Maurten Gel 100" : "GU Energy Gel Variety Pack"}`, stomach === "sensitive" ? 4 : 2),
  });

  items.push({
    category: "Nutrition — Real Food",
    product: stomach === "iron" ? "Picky Oats" : "Real Food Gel",
    brand: stomach === "iron" ? "Picky Bars" : "Muir Energy",
    price: 4,
    tier: "standard",
    why: stomach === "iron"
      ? `If your stomach handles variety, adding a real-food lane helps prevent taste fatigue and can steady energy over very long events.`
      : `This keeps a softer, more natural backup option in the plan without pushing you toward a complex real-food strategy.`,
    specs: stomach === "iron"
      ? ["Calories: 200 per pouch", "Carbs: 30g", "Protein: 7g", "Ingredients: Whole oats, dates, nuts"]
      : ["Calories: 130 per gel", "Carbs: 19g", "Fat: 5g", "Ingredients: Real food only"],
    links: makeLinks(`${stomach === "iron" ? "Picky Bars Picky Oats" : "Muir Energy Real Food Gel"}`, 4),
  });

  if (sweat === "heavy" || longRace) {
    items.push({
      category: "Electrolytes",
      product: "Fastchews",
      brand: "SaltStick",
      price: 12,
      tier: "budget",
      why: `${sweat === "heavy" ? "Heavy sweat loss" : "Long duration"} increases the odds that your sodium plan will fail before your legs do.`,
      specs: ["Sodium: 100mg per tab", "Potassium: 30mg per tab", "Magnesium: 6mg per tab", "Tablets: 60 per tube"],
      links: makeLinks("SaltStick Fastchews electrolytes", 12),
    });
  }

  items.push({
    category: "Hydration Mix",
    product: sweat === "heavy" || hot ? "Sport Hydration Mix" : "Endurance Fuel",
    brand: sweat === "heavy" || hot ? "Skratch Labs" : "Tailwind",
    price: 30,
    tier: "standard",
    why: sweat === "heavy" || hot
      ? `Your conditions point toward sweat replacement first, not just calories dissolved in water.`
      : `This simplifies fueling by keeping calories and hydration in one repeatable system.`,
    specs: sweat === "heavy" || hot
      ? ["Calories: 80 per serving", "Sodium: 380mg per serving", "Sugar: 18g", "Servings: 20 per bag"]
      : ["Calories: 100 per serving", "Sodium: 310mg per serving", "Carbs: 25g", "Servings: 30 per bag"],
    links: makeLinks(`${sweat === "heavy" || hot ? "Skratch Labs Sport Hydration Mix" : "Tailwind Endurance Fuel"}`, 30),
  });

  // Safety
  if (longRace) {
    items.push({
      category: "Safety",
      product: budgetTier === "elite" ? "inReach Mini 2" : "Spot X Satellite Communicator",
      brand: budgetTier === "elite" ? "Garmin" : "SPOT",
      price: budgetTier === "elite" ? 300 : 150,
      tier: budgetTier === "elite" ? "elite" : "premium",
      why: `Remote ultras make communication gear a crew, logistics, and safety tool, not just a gadget.`,
      specs: budgetTier === "elite"
        ? ["Messaging: Two-way satellite", "Tracking: Live sharing", "Priority: Crew visibility + emergency contact", "Use case: Remote endurance events"]
        : ["Coverage: Global satellite network", "Messaging: Two-way SMS via satellite", "Tracking: Customizable intervals", "SOS: 24/7 GEOS response center"],
      links: budgetTier === "elite"
        ? makeLinks("Garmin inReach Mini 2", 300)
        : {
            amazon: { url: "https://www.amazon.com/s?k=SPOT+X+Satellite+Communicator&tag=finishultra-20", price: 150 },
          },
    });

    items.push({
      category: "Safety",
      product: "Emergency Bivvy",
      brand: "SOL",
      price: 20,
      tier: "budget",
      why: `This is dead-simple emergency insurance that matters far more when you are cold, alone, or slowed deep into a long race.`,
      specs: ["Weight: 3.8oz", "Size packed: 3.5\" × 5.5\"", "Material: Reflective polyethylene", "Heat retention: 90%"],
      links: makeLinks("SOL Emergency Bivvy space blanket", 20),
    });
  }

  // Head and gloves
  items.push({
    category: "Head",
    product: hot ? "XA Cap" : cold ? "Merino 250 Beanie" : "GOCap",
    brand: hot ? "Salomon" : cold ? "Smartwool" : "Ciele",
    price: hot ? 30 : cold ? 35 : 38,
    tier: "standard",
    why: hot
      ? `Head coverage matters more on exposed, hot courses than many runners realize.`
      : cold
      ? `Cold starts and overnight sections become much more manageable when ears and forehead stay protected.`
      : `A technical cap keeps sweat and glare manageable without adding bulk under a headlamp.`,
    specs: hot
      ? ["UPF: 50+", "Fabric: Recycled polyester mesh", "Brim: 3cm sun protection", "Weight: 45g"]
      : cold
      ? ["Fabric: 100% Merino 250gsm", "Coverage: Ears", "Odor control: Natural merino", "Weight: 65g"]
      : ["Fabric: Technical mesh", "Sweatband: COOLwick", "Fit: Structured 5-panel", "Weight: 57g"],
    links: makeLinks(`${hot ? "Salomon XA Cap" : cold ? "Smartwool Merino 250 Beanie" : "Ciele GOCap"}`, hot ? 30 : cold ? 35 : 38),
  });

  if (cold || night === "yes") {
    const isExtreme = temp === "extreme";
    items.push({
      category: "Gloves",
      product: isExtreme ? "Mercury Mitts" : "Merino 150 Gloves",
      brand: isExtreme ? "Black Diamond" : "Smartwool",
      price: isExtreme ? 45 : 40,
      tier: "standard",
      why: isExtreme
        ? `Extremely cold races stop being comfortable-problem races and become hand-function races fast.`
        : `Light gloves buy you comfort during cold starts and late-race fatigue without creating a bulky layer-management problem.`,
      specs: isExtreme
        ? ["Fill: PrimaLoft Gold insulation", "Shell: Pertex Quantum windproof", "Cuff: Extended 3cm", "Weight: 72g/pair"]
        : ["Fabric: Merino 150gsm blend", "Touchscreen: Yes", "Cuff: Elastic", "Weight: 48g/pair"],
      links: makeLinks(`${isExtreme ? "Black Diamond Mercury Mitts" : "Smartwool Merino 150 Gloves"}`, isExtreme ? 45 : 40),
    });
  }

  if (longRace || priority === "feet") {
    items.push({
      category: "Recovery",
      product: "Compression Socks 20-30mmHg",
      brand: "CEP",
      price: 65,
      tier: "standard",
      why: `If the race is long enough or your feet are your limiter, post-race lower-leg recovery becomes part of the plan rather than an afterthought.`,
      specs: ["Compression: 20-30mmHg graduated", "Fabric: Meryl Skinlife nylon", "Height: Knee-high", "Recommended: Wear 4-6 hrs post-race"],
      links: makeLinks("CEP Compression Socks 20-30mmHg recovery", 65),
    });
  }

  const totalCost = items.reduce((sum, item) => sum + item.price, 0);

  const packingChecklist = [
    "Soft flasks filled and pack fully loaded before start",
    "Nutrition packed for 1.5× the expected time between aid stations",
    "Race bib and timing chip secured",
    "Phone and portable charger packed",
    "Rain shell packed even if the forecast looks clean",
    "Anti-chafe applied to toes, thighs, underarms, and any known hotspots",
    ...(night === "yes" ? ["Night gear stored in a front-access pocket"] : []),
    ...(cold ? ["Emergency warm layer and dry gloves packed"] : []),
    ...(longRace ? ["Drop bag labeled by mile marker and crew point"] : []),
    ...(experience === "first" ? ["Printed mandatory-gear list checked line by line"] : []),
    ...(experience === "beginner" ? ["Vest pockets rehearsed so you know exactly where everything lives"] : []),
    ...(experience === "intermediate" ? ["Planned shoe, layer, and fuel swap triggers written on your crew card"] : []),
    ...(experience === "veteran" ? ["Only proven race-day items packed; no speculative extras"] : []),
  ];

  const dropBagEssentials = longRace
    ? [
        "Fresh socks (2 pairs)",
        "Dry shirt or base layer",
        "Replacement headlamp or charging backup",
        "Extra nutrition and drink mix",
        "Blister kit with tape, lube, gauze, and needle",
        "Spare hydration flask",
        "Change of shoes if planning a late-race swap",
        ...(experience === "first" ? ["Simple step-by-step crew note for what to grab first"] : []),
        ...(experience === "beginner" ? ["Pocket-layout cheat sheet so you repack the vest the same way every time"] : []),
        ...(experience === "intermediate" ? ["One-card decision rules for layers and calories"] : []),
        ...(experience === "veteran" ? ["Only one quick-access bag plus one true-emergency bag"] : []),
      ]
    : [
        "Extra nutrition",
        "Fresh socks",
        "Anti-chafe stick",
        "Dry shirt for after the finish",
        ...(experience === "first" ? ["Mini post-race checklist for finish area priorities"] : []),
      ];

  const testingTimeline = [
    "12 weeks out: Buy shoes and log enough miles to trust them before taper",
    "10 weeks out: Test full vest weight on a long run",
    "8 weeks out: Practice your nutrition plan in long-run conditions",
    "6 weeks out: Test lighting and battery life if any dark running is expected",
    "4 weeks out: Complete a full dress rehearsal in your exact race kit",
    "2 weeks out: If it is not tested, it does not race",
    "Race week: Charge electronics, prep drop bags, and confirm mandatory gear",
    ...(experience === "first" ? ["14 weeks out: Practice aid-station stops and power-hike transitions in full kit"] : []),
    ...(experience === "beginner" ? ["9 weeks out: Repack your vest until nutrition and layers are automatic to reach"] : []),
    ...(experience === "intermediate" ? ["7 weeks out: Run a back-to-back weekend in your exact race kit and fuel plan"] : []),
    ...(experience === "veteran" ? ["5 weeks out: Trim any item that has not earned its place in race simulations"] : []),
  ];

  const title = `Your ${distance.toUpperCase()} ${terrain === "mountain" ? "Mountain" : terrain === "desert" ? "Desert" : terrain === "forest" ? "Trail" : "Runnable"} Kit — ${hot ? "Hot Weather" : cold ? "Cold Weather" : "All-Conditions"}`;

  return {
    title,
    subtitle: `Personalized for a ${experience === "first" ? "first-timer" : experience === "beginner" ? "developing ultra runner" : experience === "intermediate" ? "experienced runner" : "veteran racer"} · ${getBuildLabel(budget)} build · Est. total: ~$${totalCost.toLocaleString()}`,
    items,
    packingChecklist,
    dropBagEssentials,
    testingTimeline,
    impactBadges: getImpactBadges(answers),
    selectedTier: budgetTier,
  };
}
