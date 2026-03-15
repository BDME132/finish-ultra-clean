"use client";

import { useState } from "react";

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

type GearItem = {
  category: string;
  product: string;
  brand: string;
  price: number;
  why: string;
  tier: "standard" | "budget" | "premium";
  link?: string;
};

type Kit = {
  title: string;
  subtitle: string;
  items: GearItem[];
  packingChecklist: string[];
  dropBagEssentials: string[];
  testingTimeline: string[];
};

const QUESTIONS = [
  {
    id: "distance",
    section: "Race Details",
    question: "What's your race distance?",
    icon: "🏁",
    options: [
      { label: "50K (~31 miles)", value: "50k" },
      { label: "50 Miles", value: "50m" },
      { label: "100K (~62 miles)", value: "100k" },
      { label: "100 Miles", value: "100m" },
    ],
  },
  {
    id: "terrain",
    section: "Race Details",
    question: "Primary course terrain?",
    icon: "⛰️",
    options: [
      { label: "Mountain / alpine (technical, rocky)", value: "mountain" },
      { label: "Desert / open (heat, flat to rolling)", value: "desert" },
      { label: "Forest trails / mixed (rooted, muddy)", value: "forest" },
      { label: "Groomed / road-mixed (runnable, fast)", value: "road" },
    ],
  },
  {
    id: "temp",
    section: "Race Details",
    question: "Expected race-day temperature?",
    icon: "🌡️",
    options: [
      { label: "Hot — 75°F+ (sun, humidity, heat index)", value: "hot" },
      { label: "Moderate — 50–75°F (ideal conditions)", value: "moderate" },
      { label: "Cold — 20–50°F (frost, cold nights)", value: "cold" },
      { label: "Extreme — below 20°F (winter, alpine)", value: "extreme" },
    ],
  },
  {
    id: "night",
    section: "Race Details",
    question: "Will you run through the night?",
    icon: "🌙",
    options: [
      { label: "Yes — night sections required", value: "yes" },
      { label: "No — day finish expected", value: "no" },
    ],
  },
  {
    id: "experience",
    section: "Runner Profile",
    question: "How many ultras have you finished?",
    icon: "🏅",
    options: [
      { label: "0 — this is my first ultra", value: "first" },
      { label: "1–3 — still learning the game", value: "beginner" },
      { label: "4–10 — I know what I need", value: "intermediate" },
      { label: "10+ — veteran, just want the best", value: "veteran" },
    ],
  },
  {
    id: "budget",
    section: "Runner Profile",
    question: "What's your total gear budget?",
    icon: "💰",
    options: [
      { label: "Under $400 — budget conscious", value: "budget" },
      { label: "$400–$800 — balanced value", value: "standard" },
      { label: "$800–$1,500 — performance focus", value: "premium" },
      { label: "No limit — best of the best", value: "elite" },
    ],
  },
  {
    id: "sweat",
    section: "Personal Factors",
    question: "How much do you sweat?",
    icon: "💧",
    options: [
      { label: "Light — barely glistening", value: "light" },
      { label: "Moderate — noticeably wet", value: "moderate" },
      { label: "Heavy — soaking through shirts", value: "heavy" },
    ],
  },
  {
    id: "stomach",
    section: "Personal Factors",
    question: "How's your stomach during long efforts?",
    icon: "🫃",
    options: [
      { label: "Iron gut — I can eat anything while running", value: "iron" },
      { label: "Average — occasional nausea at mile 40+", value: "average" },
      { label: "Sensitive — GI issues are my biggest limiter", value: "sensitive" },
    ],
  },
  {
    id: "feetWidth",
    section: "Personal Factors",
    question: "What's your foot width?",
    icon: "👟",
    options: [
      { label: "Narrow to standard (B–D width)", value: "standard" },
      { label: "Wide (2E width)", value: "wide" },
      { label: "Extra wide / high volume (4E+)", value: "xwide" },
    ],
  },
  {
    id: "priority",
    section: "Personal Factors",
    question: "What's your #1 gear priority?",
    icon: "🎯",
    options: [
      { label: "Foot comfort — blisters ruined past races", value: "feet" },
      { label: "Nutrition — fueling is my weakness", value: "nutrition" },
      { label: "Weather protection — I run in bad conditions", value: "weather" },
      { label: "Minimalism — I want to carry as little as possible", value: "minimal" },
    ],
  },
];

function buildKit(answers: Answers): Kit {
  const { distance, terrain, temp, night, experience, budget, sweat, stomach, feetWidth, priority } = answers;
  const cold = temp === "cold" || temp === "extreme";
  const hot = temp === "hot";
  const longRace = distance === "100k" || distance === "100m";
  const mountain = terrain === "mountain";
  const budgetTier: "budget" | "standard" | "premium" =
    budget === "budget" ? "budget" : budget === "standard" ? "standard" : "premium";

  const items: GearItem[] = [];

  // --- FOOTWEAR ---
  if (feetWidth === "xwide" || feetWidth === "wide") {
    if (mountain) {
      items.push({ category: "Footwear", product: feetWidth === "xwide" ? "Speedgoat 5 Wide" : "Speedgoat 5", brand: "HOKA", price: feetWidth === "xwide" ? 155 : 145, why: "Max cushion for technical alpine terrain. Wide fit eliminates toe box compression on long descents.", tier: "standard" });
    } else {
      items.push({ category: "Footwear", product: "Challenger ATR 7 Wide", brand: "HOKA", price: 140, why: "Trail-ready wide toe box — accommodates foot swelling over 50+ miles without blistering.", tier: "standard" });
    }
  } else if (mountain) {
    items.push({
      category: "Footwear",
      product: budgetTier === "budget" ? "Peregrine 13" : "Torrent 3",
      brand: budgetTier === "budget" ? "Saucony" : "Hoka",
      price: budgetTier === "budget" ? 130 : 140,
      why: mountain ? "Aggressive 6mm lugs, rock plate protection, low-drop feel for technical descents" : "Balanced cushion and grip for mixed trail conditions",
      tier: budgetTier,
    });
  } else if (hot) {
    items.push({ category: "Footwear", product: "Sense Ride 5", brand: "Salomon", price: 140, why: "Breathable upper for heat management, moderate cushion, secure lacing for long miles in the sun.", tier: "standard" });
  } else {
    items.push({
      category: "Footwear",
      product: budgetTier === "budget" ? "Cascadia 16" : budgetTier === "premium" ? "Ultraventure Pro" : "Speedgoat 5",
      brand: budgetTier === "budget" ? "Brooks" : budgetTier === "premium" ? "La Sportiva" : "HOKA",
      price: budgetTier === "budget" ? 120 : budgetTier === "premium" ? 170 : 145,
      why: "Versatile all-conditions trail shoe. Maximum mileage, reliable grip, race-tested cushion.",
      tier: budgetTier,
    });
  }

  // Second pair for 100-milers
  if (longRace) {
    items.push({
      category: "Footwear (Drop Bag)",
      product: "Clifton 9 Trail",
      brand: "HOKA",
      price: 140,
      why: "Switch to max-cushion road-friendly shoe at mile 60–70 when feet are swollen and trails flatten.",
      tier: "standard",
    });
  }

  // --- HYDRATION PACK ---
  const packItem = (() => {
    if (priority === "minimal" || distance === "50k") {
      return { product: budgetTier === "budget" ? "Fastpack 5 Vest" : "Sense Pro 5", brand: budgetTier === "budget" ? "CamelBak" : "Salomon", price: budgetTier === "budget" ? 90 : 120, why: "5L minimalist vest — carries mandatory gear with room for nutrition. Perfect for 50K aid station spacing." };
    } else if (longRace) {
      return { product: budgetTier === "budget" ? "Race Vest 10L" : "Zeal Pro 10L", brand: budgetTier === "budget" ? "Nathan" : "Ultimate Direction", price: budgetTier === "budget" ? 100 : 160, why: "10L capacity for 100-mile mandatory gear lists. Pole loops, front soft flask pockets, drop bag organization." };
    } else {
      return { product: budgetTier === "budget" ? "Hydraknight 12" : "Ultra Vest 3.0", brand: budgetTier === "budget" ? "Osprey" : "Ultimate Direction", price: budgetTier === "budget" ? 90 : 140, why: "8–10L sweet spot. Enough capacity without sloshing — ideal for 50-mile aid station gaps." };
    }
  })();
  items.push({ category: "Hydration Pack", ...packItem, tier: budgetTier });

  // --- LIGHTING ---
  if (night === "yes" || longRace) {
    items.push({
      category: "Lighting — Headlamp",
      product: budgetTier === "budget" ? "Core Headlamp (400 lm)" : "Iko Core (500 lm)",
      brand: budgetTier === "budget" ? "Black Diamond" : "Petzl",
      price: budgetTier === "budget" ? 50 : 80,
      why: "Rechargeable USB-C headlamp. 500+ lumens handles technical night terrain. Bring a backup in your pack.",
      tier: budgetTier,
    });
    if (longRace) {
      items.push({ category: "Lighting — Backup", product: "Spot 400-E", brand: "Black Diamond", price: 35, why: "Lightweight backup lamp. Mandatory gear at most 100s. Lives in your pack all race.", tier: "budget" });
    }
  }

  // --- CLOTHING: TOP ---
  if (cold) {
    items.push({ category: "Base Layer — Top", product: "Merino 250 Base Layer Crew", brand: "Smartwool", price: 100, why: "Heavyweight merino: warm, breathable, naturally odor-resistant for multi-day use.", tier: "standard" });
    items.push({ category: "Insulation Layer", product: temp === "extreme" ? "R1 Hoody" : "Nano Puff Vest", brand: "Patagonia", price: temp === "extreme" ? 149 : 179, why: temp === "extreme" ? "Grid fleece active insulation — layers under a shell, breathes on climbs" : "Core-warming vest packs to nothing. Carry it, wear it on cold descents.", tier: "premium" });
  } else {
    items.push({ category: "Base Layer — Top", product: hot ? "Capilene Cool Daily Shirt" : "Merino 150 Long Sleeve", brand: hot ? "Patagonia" : "Smartwool", price: hot ? 45 : 75, why: hot ? "UPF 50+ with Polygiene odor control. Featherlight in heat." : "Lightweight merino transitions from cool mornings to warm afternoons.", tier: "standard" });
  }

  // --- CLOTHING: BOTTOM ---
  if (cold) {
    items.push({ category: "Bottom — Tights", product: "Capilene Midweight Tights", brand: "Patagonia", price: 89, why: "Insulating moisture-wicking base. Flatlock seams prevent chafing on 50+ mile days.", tier: "standard" });
  } else {
    items.push({ category: "Bottom — Shorts", product: longRace ? "5\" AFO Middle Short" : "Strider Pro Shorts 5\"", brand: longRace ? "Janji" : "Patagonia", price: longRace ? 68 : 65, why: longRace ? "6 pockets for nutrition, 4-way stretch, performance liner for 100-mile comfort" : "Lightweight recycled fabric, built-in brief, secure gel pocket.", tier: "standard" });
  }

  // --- SHELL ---
  if (!hot || mountain) {
    items.push({
      category: "Rain / Wind Shell",
      product: mountain ? "Norvan SL Hoody" : budgetTier === "budget" ? "Helium Rain Jacket" : "Ultralight Stretch Rain Jacket",
      brand: mountain ? "Arc'teryx" : budgetTier === "budget" ? "Outdoor Research" : "Patagonia",
      price: mountain ? 299 : budgetTier === "budget" ? 150 : 249,
      why: mountain ? "Gore-Tex Shakedry — featherlight alpine protection that never wets out, packs to nothing" : "6oz waterproof shell packs into its own chest pocket. Best weight-to-protection ratio.",
      tier: mountain ? "premium" : budgetTier,
    });
  }

  // --- SOCKS ---
  items.push({
    category: "Socks",
    product: priority === "feet" ? "Run Endure Crew" : cold ? "Merino Outdoor Medium Crew" : "Run No-Show Tab Lightweight",
    brand: priority === "feet" ? "Darn Tough" : cold ? "Smartwool" : "Darn Tough",
    price: priority === "feet" ? 26 : cold ? 26 : 22,
    why: priority === "feet" ? "Lifetime warranty, seamless toe, extra cushion for blister-prone runners on 100-mile efforts" : cold ? "Merino cushioning — warm even when slightly damp" : "Lifetime warranty, merino, seamless toe. The no-brainer sock choice.",
    tier: "standard",
  });

  if (priority === "feet" || longRace) {
    items.push({ category: "Foot Care Kit", product: "Anti-Blister Kit (SNB + Leukotape + Needle)", brand: "Mixed", price: 25, why: "Squirrel's Nut Butter pre-application + Leukotape for known hot spots + sterile needle for mid-race drainage.", tier: "budget" });
    items.push({ category: "Foot Care Kit", product: "Injinji Run Original Weight No-Show", brand: "Injinji", price: 18, why: "Toe socks eliminate inter-toe blisters. Many runners wear over their regular socks on mountain 100s.", tier: "budget" });
  }

  // --- NUTRITION CARRY ---
  const nutritionItems = (() => {
    const base: GearItem[] = [
      { category: "Nutrition — Gel", product: stomach === "sensitive" ? "Maurten Gel 100" : "GU Energy Gel", brand: stomach === "sensitive" ? "Maurten" : "GU", price: stomach === "sensitive" ? 4 : 2, why: stomach === "sensitive" ? "Hydrogel technology — clinically gentler on sensitive GI systems at race pace" : "70 calories, 20g carbs, amino acids. The trail standard for 20+ years.", tier: "standard" },
      { category: "Nutrition — Real Food", product: stomach === "iron" ? "Picky Oats (portable oatmeal)" : "Muir Energy Real Food Gel", brand: stomach === "iron" ? "Picky Bars" : "Muir Energy", price: stomach === "iron" ? 4 : 4, why: stomach === "iron" ? "Real food nutrition you can stomach 60 miles in — whole grains, dates, nuts" : "Real food in a gel format. 130 calories of dates, nuts, seeds — no crash.", tier: "standard" },
    ];
    if (sweat === "heavy" || longRace) {
      base.push({ category: "Electrolytes", product: "SaltStick Fastchews", brand: "SaltStick", price: 12, why: "Chewable electrolytes — 100mg sodium per tablet. Heavy sweaters and 100-milers need 600–800mg/hr in heat.", tier: "budget" });
    }
    return base;
  })();
  items.push(...nutritionItems);

  // --- HYDRATION MIX ---
  items.push({
    category: "Hydration Mix",
    product: sweat === "heavy" || hot ? "Skratch Labs Sport Hydration" : "Tailwind Endurance Fuel",
    brand: sweat === "heavy" || hot ? "Skratch" : "Tailwind",
    price: 30,
    why: sweat === "heavy" || hot ? "Skratch's electrolyte profile matches real sweat. Lower sugar, higher sodium for hot/heavy-sweat conditions." : "All-in-one fuel + electrolytes. Many runners go 100 miles on Tailwind alone.",
    tier: "standard",
  });

  // --- NIGHT / SAFETY ---
  if (longRace) {
    items.push({ category: "Safety", product: "Spot X Satellite Communicator", brand: "SPOT", price: 150, why: "Two-way satellite messaging for remote 100-mile courses. Many RDs require a tracker or safety device.", tier: "premium" });
    items.push({ category: "Safety", product: "Emergency Bivvy", brand: "SOL", price: 20, why: "8oz emergency shelter. Mandatory gear on most mountain races. Packs to fist-size.", tier: "budget" });
  }

  // --- ACCESSORIES ---
  items.push({
    category: "Head",
    product: hot ? "XA Cap" : cold ? "Merino 250 Beanie" : "GOCap",
    brand: hot ? "Salomon" : cold ? "Smartwool" : "Ciele",
    price: hot ? 30 : cold ? 35 : 38,
    why: hot ? "Lightweight mesh, UPF protection, wicking sweatband" : cold ? "Merino warmth, naturally odor-resistant for multi-day use" : "Technical mesh, COOLwick sweatband — the go-to for moderate conditions.",
    tier: "standard",
  });

  if (cold || night === "yes") {
    items.push({ category: "Gloves", product: temp === "extreme" ? "Mercury Mitts" : "Merino 150 Gloves", brand: temp === "extreme" ? "Black Diamond" : "Smartwool", price: temp === "extreme" ? 45 : 40, why: temp === "extreme" ? "Alpine-grade warmth for sub-20°F — maximum protection when hands can't fail" : "Lightweight merino warmth with touchscreen compatibility.", tier: "standard" });
  }

  if (longRace || priority === "feet") {
    items.push({ category: "Recovery", product: "Compression Socks 20–30mmHg", brand: "CEP", price: 65, why: "Wear on the drive home. Dramatically speeds recovery and reduces next-day swelling.", tier: "standard" });
  }

  const totalCost = items.reduce((sum, i) => sum + i.price, 0);

  // Packing checklist
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

  // Drop bag essentials
  const dropBagEssentials = longRace
    ? [
        "Fresh socks (2 pairs)",
        "Dry shirt / base layer",
        "Replacement headlamp + batteries",
        "Extra nutrition (gels, real food, drink mix)",
        "Blister kit (Leukotape, needle, SNB, gauze)",
        "Anti-chafe stick",
        "Charged backup phone battery",
        cold ? "Warm mid-layer (puffy or fleece)" : "Light gloves and arm sleeves",
        "Ibuprofen + anti-nausea (Zofran if prescribed)",
        "Spare hydration flask",
        "Change of shoes (if planned swap at mile 60–70)",
        "Crew notes / splits cheat sheet",
      ]
    : [
        "Extra nutrition",
        "Fresh socks",
        "Anti-chafe stick",
        "Spare headlamp (if night sections)",
        "Dry shirt for after finish",
      ];

  // Testing timeline
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
    title: `Your ${distance.toUpperCase()} ${terrain === "mountain" ? "Mountain" : terrain === "desert" ? "Desert" : ""} Kit — ${temp === "hot" ? "Hot Weather" : cold ? "Cold Weather" : "All-Conditions"}`,
    subtitle: `Personalized for a ${experience === "first" ? "first-timer" : experience === "beginner" ? "developing ultra runner" : experience === "intermediate" ? "experienced runner" : "veteran racer"} with a ${budget === "budget" ? "value-focused" : budget === "standard" ? "balanced" : "performance"} budget. Estimated total: ~$${totalCost.toLocaleString()}`,
    items,
    packingChecklist,
    dropBagEssentials,
    testingTimeline,
  };
}

const CATEGORY_ICONS: Record<string, string> = {
  "Footwear": "👟",
  "Footwear (Drop Bag)": "👟",
  "Hydration Pack": "🎒",
  "Lighting — Headlamp": "🔦",
  "Lighting — Backup": "🔦",
  "Base Layer — Top": "👕",
  "Insulation Layer": "🧥",
  "Bottom — Tights": "🩱",
  "Bottom — Shorts": "🩳",
  "Rain / Wind Shell": "🌧️",
  "Socks": "🧦",
  "Foot Care Kit": "🩹",
  "Nutrition — Gel": "⚡",
  "Nutrition — Real Food": "🍌",
  "Electrolytes": "🧂",
  "Hydration Mix": "💧",
  "Safety": "🛡️",
  "Head": "🧢",
  "Gloves": "🧤",
  "Recovery": "💪",
};

export default function KitBuilder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [kit, setKit] = useState<Kit | null>(null);
  const [activeTab, setActiveTab] = useState<"gear" | "packing" | "dropbag" | "timeline">("gear");

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
  }

  // Group items by category for display
  const groupedItems = kit
    ? kit.items.reduce<Record<string, GearItem[]>>((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {})
    : {};

  const totalCost = kit ? kit.items.reduce((sum, i) => sum + i.price, 0) : 0;

  // Section grouping for quiz progress display
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
        <div className="p-6 sm:p-8">
          {/* Section progress */}
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

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray font-medium mb-2">
            Question {step + 1} of {QUESTIONS.length}
          </p>
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
            <button
              onClick={() => setStep(step - 1)}
              className="mt-4 text-sm text-gray hover:text-primary transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      ) : (
        <div className="p-6 sm:p-8">
          {/* Result header */}
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <h3 className="font-headline text-xl font-bold text-dark">{kit.title}</h3>
              <p className="text-sm text-gray mt-1">{kit.subtitle}</p>
            </div>
            <button
              onClick={restart}
              className="text-sm text-primary hover:underline font-medium shrink-0"
            >
              Rebuild →
            </button>
          </div>

          {/* Budget summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
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
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
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

          {/* Gear tab */}
          {activeTab === "gear" && (
            <div className="space-y-3">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">{CATEGORY_ICONS[category] ?? "📦"}</span>
                    <span className="text-xs font-bold text-gray uppercase tracking-wide">{category}</span>
                  </div>
                  {categoryItems.map((item) => (
                    <div key={item.product} className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-headline font-bold text-dark text-sm">{item.brand} {item.product}</span>
                          <span className="text-accent font-bold text-xs">${item.price}</span>
                        </div>
                        <p className="text-xs text-gray mt-1">{item.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="bg-dark rounded-xl p-4 flex items-center justify-between">
                <span className="text-white font-semibold text-sm">Estimated Total</span>
                <span className="text-accent font-bold text-lg">~${totalCost.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Packing tab */}
          {activeTab === "packing" && (
            <div className="space-y-2">
              <p className="text-sm text-gray mb-4">Go through this list the morning before your race. Missing items have DNF'd more runners than bad fitness.</p>
              {kit.packingChecklist.map((item) => (
                <div key={item} className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-dark border border-gray-100">
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* Drop bag tab */}
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

          {/* Timeline tab */}
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
      )}
    </div>
  );
}
