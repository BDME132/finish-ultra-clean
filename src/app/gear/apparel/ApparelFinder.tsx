"use client";

import { useState } from "react";

type Answers = {
  distance: string;
  temp: string;
  terrain: string;
  night: string;
  sweater: string;
};

type OutfitLayer = {
  role: string;
  product: string;
  brand: string;
  price: string;
  why: string;
};

type Outfit = {
  label: string;
  layers: OutfitLayer[];
  totalEst: string;
  tip: string;
};

function buildOutfit(answers: Answers): Outfit {
  const { temp, distance, terrain, night, sweater } = answers;
  const cold = temp === "cold" || temp === "extreme";
  const hot = temp === "hot";
  const longRace = distance === "100k" || distance === "100m";
  const mountain = terrain === "mountain";

  const layers: OutfitLayer[] = [];

  // Top base layer
  if (hot || temp === "moderate") {
    layers.push({
      role: "Top — Base Layer",
      product: cold ? "Merino 150 Long Sleeve" : "Capilene Cool Daily Shirt",
      brand: cold ? "Smartwool" : "Patagonia",
      price: cold ? "$75" : "$45",
      why: hot
        ? "UPF 50+ protection, Polygiene odor control, featherlight in heat"
        : "Temperature-regulating merino handles morning cool and afternoon warmth",
    });
  } else {
    layers.push({
      role: "Top — Base Layer",
      product: "Merino 250 Base Layer Crew",
      brand: "Smartwool",
      price: "$100",
      why: "Heavyweight merino for cold weather — warm, breathable, and odor-resistant for multi-day use",
    });
  }

  // Bottom
  if (cold) {
    layers.push({
      role: "Bottom — Tights",
      product: "Capilene Midweight Tights",
      brand: "Patagonia",
      price: "$89",
      why: "Moisture-wicking insulating base for cold weather — flatlock seams prevent chafing",
    });
  } else {
    layers.push({
      role: "Bottom — Shorts",
      product: longRace ? "5\" AFO Middle Short" : "Strider Pro Shorts 5\"",
      brand: longRace ? "Janji" : "Patagonia",
      price: longRace ? "$68" : "$65",
      why: longRace
        ? "6 pockets for nutrition access, 4-way stretch, performance liner for 100-mile comfort"
        : "Lightweight recycled fabric, built-in brief, secure gel pocket",
    });
  }

  // Mid layer (cold or long races at night)
  if (cold || (longRace && night === "yes")) {
    layers.push({
      role: "Mid Layer — Insulation",
      product: cold && temp === "extreme" ? "R1 Hoody" : "Nano Puff Vest",
      brand: "Patagonia",
      price: cold && temp === "extreme" ? "$149" : "$179",
      why:
        temp === "extreme"
          ? "Highly breathable grid fleece for active warmth — layers over base, under shell"
          : "Core warmth without restricting arms — pack in vest pocket until needed",
    });
  }

  // Shell
  if (temp !== "hot" || mountain) {
    layers.push({
      role: "Outer Shell",
      product: mountain ? "Norvan SL Hoody" : "Helium Rain Jacket",
      brand: mountain ? "Arc'teryx" : "Outdoor Research",
      price: mountain ? "$299" : "$150",
      why: mountain
        ? "Gore-Tex Shakedry — featherlight alpine protection that never wets out, packs to nothing"
        : "6.4oz waterproof shell packs into its own chest pocket — best weight-to-protection ratio",
    });
  }

  // Hat
  layers.push({
    role: "Head",
    product:
      hot ? "XA Cap" : cold ? "Merino 250 Beanie" : "GOCap",
    brand: hot ? "Salomon" : cold ? "Smartwool" : "Ciele",
    price: hot ? "$30" : cold ? "$35" : "$38",
    why: hot
      ? "Lightweight mesh, UPF protection, moisture-wicking sweatband"
      : cold
      ? "Merino warmth, odor-resistant for multi-day use"
      : "Technical mesh construction, COOLwick sweatband for moderate conditions",
  });

  // Gloves (cold only)
  if (cold || (night === "yes" && temp !== "hot")) {
    layers.push({
      role: "Gloves",
      product: temp === "extreme" ? "Mercury Mitts" : "Merino 150 Gloves",
      brand: temp === "extreme" ? "Black Diamond" : "Smartwool",
      price: temp === "extreme" ? "$45" : "$40",
      why:
        temp === "extreme"
          ? "Alpine-grade warmth for sub-20°F — maximum protection when hands can't fail"
          : "Lightweight merino warmth with touchscreen compatibility — easy to wear all night",
    });
  }

  // Socks
  layers.push({
    role: "Socks",
    product: cold ? "Merino Outdoor Medium Crew" : "Run No-Show Tab Lightweight",
    brand: cold ? "Smartwool" : "Darn Tough",
    price: cold ? "$26" : "$22",
    why: cold
      ? "Merino cushioning for cold weather — warm even when slightly damp"
      : "Lifetime warranty, merino wool, seamless toe construction to prevent blisters",
  });

  // Heavy sweater add-on
  if (sweater === "heavy" && !hot) {
    layers.push({
      role: "Electrolyte / Anti-Chafe Note",
      product: "Squirrel's Nut Butter",
      brand: "SNB",
      price: "$14",
      why: "Heavy sweaters lose more sodium — increase electrolyte intake AND apply anti-chafe liberally before start and at every crew stop",
    });
  }

  const totalNums = layers
    .map((l) => parseInt(l.price.replace(/\D/g, "")))
    .filter(Boolean);
  const total = totalNums.reduce((a, b) => a + b, 0);

  return {
    label: `${temp === "hot" ? "Hot Weather" : temp === "cold" ? "Cold Weather" : temp === "extreme" ? "Extreme Cold" : "Moderate"} / ${distance.toUpperCase()} Outfit`,
    layers,
    totalEst: `~$${total}`,
    tip:
      hot
        ? "Rule #1 in heat: start cooler than you think you need. You'll warm up fast."
        : cold
        ? "Rule #1 in cold: layers you can shed. Overdress at the start, shed by mile 5."
        : "Rule #1: nothing new on race day. Test this exact outfit on a long training run.",
  };
}

const QUESTIONS = [
  {
    id: "distance",
    question: "What's your race distance?",
    icon: "🏃",
    options: [
      { label: "50K", value: "50k" },
      { label: "50 Miles", value: "50m" },
      { label: "100K", value: "100k" },
      { label: "100 Miles", value: "100m" },
    ],
  },
  {
    id: "temp",
    question: "Expected temperature range?",
    icon: "🌡️",
    options: [
      { label: "Hot — 75°F+ (desert, summer)", value: "hot" },
      { label: "Moderate — 50–75°F", value: "moderate" },
      { label: "Cold — 20–50°F", value: "cold" },
      { label: "Extreme — below 20°F", value: "extreme" },
    ],
  },
  {
    id: "terrain",
    question: "Primary terrain?",
    icon: "⛰️",
    options: [
      { label: "Mountain / alpine", value: "mountain" },
      { label: "Desert / open", value: "desert" },
      { label: "Forest trails / mixed", value: "forest" },
      { label: "Groomed / road mixed", value: "road" },
    ],
  },
  {
    id: "night",
    question: "Will you be running at night?",
    icon: "🌙",
    options: [
      { label: "Yes — night sections required", value: "yes" },
      { label: "No — day finish expected", value: "no" },
    ],
  },
  {
    id: "sweater",
    question: "How much do you sweat?",
    icon: "💧",
    options: [
      { label: "Light sweater", value: "light" },
      { label: "Moderate sweater", value: "moderate" },
      { label: "Heavy sweater", value: "heavy" },
    ],
  },
];

export default function ApparelFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [result, setResult] = useState<Outfit | null>(null);

  const currentQ = QUESTIONS[step];

  function select(value: string) {
    const next = { ...answers, [currentQ.id]: value } as Answers;
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setResult(buildOutfit(next));
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResult(null);
  }

  const roleColors: Record<string, string> = {
    "Top — Base Layer": "bg-blue-100 text-blue-800",
    "Bottom — Shorts": "bg-green-100 text-green-800",
    "Bottom — Tights": "bg-green-100 text-green-800",
    "Mid Layer — Insulation": "bg-orange-100 text-orange-800",
    "Outer Shell": "bg-gray-100 text-gray-800",
    Head: "bg-purple-100 text-purple-800",
    Gloves: "bg-purple-100 text-purple-800",
    Socks: "bg-yellow-100 text-yellow-800",
    "Electrolyte / Anti-Chafe Note": "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-5 text-white">
        <h2 className="font-headline text-xl font-bold">Outfit Finder</h2>
        <p className="text-blue-100 text-sm mt-1">
          5 questions → a complete outfit recommendation for your race.
        </p>
      </div>

      {!result ? (
        <div className="p-6 sm:p-8">
          <div className="flex gap-1.5 mb-6">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-gray-100"}`}
              />
            ))}
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
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <h3 className="font-headline text-xl font-bold text-dark">{result.label}</h3>
              <p className="text-sm text-gray mt-0.5">Estimated total: <strong className="text-accent">{result.totalEst}</strong></p>
            </div>
            <button onClick={restart} className="text-sm text-primary hover:underline font-medium shrink-0">
              Retake →
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {result.layers.map((layer) => (
              <div key={layer.role} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start gap-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${roleColors[layer.role] ?? "bg-gray-100 text-gray-700"}`}>
                    {layer.role}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-headline font-bold text-dark text-sm">{layer.brand} {layer.product}</span>
                      <span className="text-accent font-bold text-xs">{layer.price}</span>
                    </div>
                    <p className="text-xs text-gray mt-1">{layer.why}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <p className="text-sm font-semibold text-dark mb-1">Pro Tip</p>
            <p className="text-sm text-gray">{result.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}
