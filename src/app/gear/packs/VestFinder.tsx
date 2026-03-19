"use client";

import { useState } from "react";
import { PersonStanding, Package, Droplets, Target } from "lucide-react";

const VESTS = [
  // ── Race Vests (5-8L) ──────────────────────────────────────────────────────
  {
    id: "salomon-adv-skin-5",
    name: "ADV Skin 5 Set",
    brand: "Salomon",
    category: "race",
    price: "$160",
    weight: "161g",
    capacity: "5L",
    genderFit: "unisex",
    distanceTags: ["50k", "50m"],
    buildTags: ["small", "average"],
    capacityTags: ["under5", "5to8"],
    hydrationTags: ["flasks", "both"],
    priorityTags: ["bounce", "light", "access"],
    blurb: "The benchmark race vest. Skin-tight SensiFit hugs your body with zero bounce. Two 500ml soft flasks included. The go-to choice for elite ultra runners worldwide.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  {
    id: "ud-race-vest-6",
    name: "Race Vest 6.0",
    brand: "Ultimate Direction",
    category: "race",
    price: "$130",
    weight: "185g",
    capacity: "6L",
    genderFit: "unisex",
    distanceTags: ["50k", "50m"],
    buildTags: ["average", "large"],
    capacityTags: ["5to8"],
    hydrationTags: ["flasks", "both"],
    priorityTags: ["bounce", "access", "versatility"],
    blurb: "UD's flagship race vest. Kangaroo front pocket fits everything you need for a 50K. Comfort Cinch straps eliminate bounce while keeping the design minimal.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  {
    id: "patagonia-slope-runner-8",
    name: "Slope Runner 8L",
    brand: "Patagonia",
    category: "race",
    price: "$149",
    weight: "220g",
    capacity: "8L",
    genderFit: "unisex",
    distanceTags: ["50k", "50m", "100k"],
    buildTags: ["average", "large"],
    capacityTags: ["5to8"],
    hydrationTags: ["flasks", "bladder"],
    priorityTags: ["versatility", "bounce"],
    blurb: "Patagonia's sustainable race vest. Made with recycled materials, generous 8L capacity, and a clean no-fuss design that works for training and race day.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  {
    id: "nathan-pinnacle-4",
    name: "Pinnacle 4L",
    brand: "Nathan",
    category: "race",
    price: "$120",
    weight: "198g",
    capacity: "4L",
    genderFit: "unisex",
    distanceTags: ["50k"],
    buildTags: ["small", "average"],
    capacityTags: ["under5"],
    hydrationTags: ["flasks"],
    priorityTags: ["light", "bounce"],
    blurb: "Featherlight 4L vest for supported 50Ks. Dual 20oz Exoshot flasks in angled front pockets make drinking on the move completely natural.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  // ── All-Around Vests (8-12L) ───────────────────────────────────────────────
  {
    id: "salomon-adv-skin-12",
    name: "ADV Skin 12 Set",
    brand: "Salomon",
    category: "allround",
    price: "$200",
    weight: "280g",
    capacity: "12L",
    genderFit: "unisex",
    distanceTags: ["50m", "100k", "100m"],
    buildTags: ["small", "average", "large"],
    capacityTags: ["8to12"],
    hydrationTags: ["flasks", "both"],
    priorityTags: ["bounce", "access", "versatility"],
    blurb: "The full-distance Salomon workhorse. 12L of organized storage, SensiFit, two included 500ml flasks, and enough pockets for 100-mile mandatory gear. The most trusted vest in ultra running.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  {
    id: "osprey-duro-6",
    name: "Duro 6 / Dyna 6",
    brand: "Osprey",
    category: "allround",
    price: "$140",
    weight: "312g",
    capacity: "6L",
    genderFit: "gendered",
    distanceTags: ["50k", "50m"],
    buildTags: ["average", "large", "broad"],
    capacityTags: ["5to8"],
    hydrationTags: ["bladder", "both"],
    priorityTags: ["bounce", "versatility"],
    blurb: "Osprey's trail running vest with AirScape back panel for breathability. Lifetime warranty. The Dyna is women's-specific with adjusted shoulder and chest geometry.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  {
    id: "nathan-vaporkrar-12",
    name: "VaporKrar 12L",
    brand: "Nathan",
    category: "allround",
    price: "$160",
    weight: "290g",
    capacity: "12L",
    genderFit: "unisex",
    distanceTags: ["50m", "100k", "100m"],
    buildTags: ["average", "large", "broad"],
    capacityTags: ["8to12"],
    hydrationTags: ["flasks", "both"],
    priorityTags: ["access", "capacity", "versatility"],
    blurb: "Designed with Rob Krar. Wide front pockets, massive back storage, and enough organizational pockets to handle 100-mile mandatory gear requirements.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  {
    id: "black-diamond-distance-8",
    name: "Distance 8",
    brand: "Black Diamond",
    category: "allround",
    price: "$130",
    weight: "248g",
    capacity: "8L",
    genderFit: "unisex",
    distanceTags: ["50k", "50m", "100k"],
    buildTags: ["average", "large"],
    capacityTags: ["5to8", "8to12"],
    hydrationTags: ["flasks", "bladder"],
    priorityTags: ["poles", "versatility", "bounce"],
    blurb: "Built by mountaineers for trail runners. Exceptional trekking pole stowage, alpine heritage durability, and Z-pole carry compatibility. Perfect for mountain ultras.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  // ── Expedition / 100-Mile Vests (12L+) ────────────────────────────────────
  {
    id: "ud-fastpack-25",
    name: "Fastpack 25",
    brand: "Ultimate Direction",
    category: "expedition",
    price: "$200",
    weight: "560g",
    capacity: "25L",
    genderFit: "unisex",
    distanceTags: ["100m", "multiday"],
    buildTags: ["average", "large", "broad"],
    capacityTags: ["12plus"],
    hydrationTags: ["bladder", "both"],
    priorityTags: ["capacity", "poles", "weather"],
    blurb: "The self-supported ultra pack. 25L swallows mandatory gear, a down jacket, and everything you need for a multi-day stage race. Built for runners who are out there alone.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  {
    id: "salomon-adv-skin-18",
    name: "ADV Skin 18 Set",
    brand: "Salomon",
    category: "expedition",
    price: "$230",
    weight: "390g",
    capacity: "18L",
    genderFit: "unisex",
    distanceTags: ["100k", "100m", "multiday"],
    buildTags: ["small", "average", "large"],
    capacityTags: ["12plus"],
    hydrationTags: ["flasks", "bladder", "both"],
    priorityTags: ["capacity", "bounce", "poles", "weather"],
    blurb: "Salomon's maximum-capacity vest that still runs like a race vest. 18L feels shockingly stable at speed. The choice for UTMB-style mandatory gear races.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  {
    id: "raidlight-revolutiv-18",
    name: "Revolutiv 18L",
    brand: "Raidlight",
    category: "expedition",
    price: "$180",
    weight: "350g",
    capacity: "18L",
    genderFit: "unisex",
    distanceTags: ["100k", "100m", "multiday"],
    buildTags: ["average", "large"],
    capacityTags: ["12plus"],
    hydrationTags: ["flasks", "bladder", "both"],
    priorityTags: ["capacity", "poles", "weather"],
    blurb: "French engineering for alpine ultra racing. 18L built for UTMB's extensive mandatory gear. Excellent pole carry, waterproof pockets, and bomber durability.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  // ── Minimalist (Under 5L) ──────────────────────────────────────────────────
  {
    id: "salomon-pulse-2",
    name: "Pulse 2 Set",
    brand: "Salomon",
    category: "minimalist",
    price: "$80",
    weight: "100g",
    capacity: "2L",
    genderFit: "unisex",
    distanceTags: ["50k"],
    buildTags: ["small", "average"],
    capacityTags: ["under5"],
    hydrationTags: ["flasks"],
    priorityTags: ["light", "bounce"],
    blurb: "Barely there. 100g barely registers on your body. Two 500ml flasks, a small back pocket for a jacket, and nothing else. For supported 50Ks when every gram counts.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
  {
    id: "omm-trailfire",
    name: "TrailFire",
    brand: "OMM",
    category: "minimalist",
    price: "$100",
    weight: "118g",
    capacity: "4L",
    genderFit: "unisex",
    distanceTags: ["50k"],
    buildTags: ["small", "average"],
    capacityTags: ["under5"],
    hydrationTags: ["flasks"],
    priorityTags: ["light", "bounce"],
    blurb: "British ultra racing heritage. Ultra-minimal design with an innovative flat-pack construction. No wasted material — just what you need and nothing more.",
    affiliates: { rei: "#", amazon: "#", warehouse: "#" },
  },
];

const QUESTIONS: { id: string; question: string; icon: React.ReactNode; options: { label: string; value: string }[] }[] = [
  {
    id: "distance",
    question: "What's your race distance?",
    icon: <PersonStanding className="w-5 h-5 text-primary" />,
    options: [
      { label: "50K", value: "50k" },
      { label: "50 Miles", value: "50m" },
      { label: "100K", value: "100k" },
      { label: "100 Miles", value: "100m" },
      { label: "Multi-day / Stage Race", value: "multiday" },
    ],
  },
  {
    id: "capacity",
    question: "How much capacity do you need?",
    icon: <Package className="w-5 h-5 text-primary" />,
    options: [
      { label: "Under 5L — minimalist racing", value: "under5" },
      { label: "5–8L — standard ultra", value: "5to8" },
      { label: "8–12L — long ultras with gear", value: "8to12" },
      { label: "12L+ — self-supported / multi-day", value: "12plus" },
    ],
  },
  {
    id: "hydration",
    question: "How do you prefer to hydrate?",
    icon: <Droplets className="w-5 h-5 text-primary" />,
    options: [
      { label: "Soft flasks in front pockets", value: "flasks" },
      { label: "Bladder / reservoir in back", value: "bladder" },
      { label: "Both flasks and bladder", value: "both" },
    ],
  },
  {
    id: "priority",
    question: "What's your top priority?",
    icon: <Target className="w-5 h-5 text-primary" />,
    options: [
      { label: "Minimal bounce / stays put", value: "bounce" },
      { label: "Maximum storage capacity", value: "capacity" },
      { label: "Lightweight and minimal", value: "light" },
      { label: "Easy nutrition access", value: "access" },
      { label: "Versatility (training + racing)", value: "versatility" },
      { label: "Trekking pole carry system", value: "poles" },
      { label: "Weather protection", value: "weather" },
    ],
  },
];

type Answers = Record<string, string>;

function scoreVest(vest: (typeof VESTS)[0], answers: Answers): number {
  let s = 0;
  if (vest.distanceTags.includes(answers.distance)) s += 3;
  if (vest.capacityTags.includes(answers.capacity)) s += 3;
  if (vest.hydrationTags.includes(answers.hydration)) s += 2;
  if (vest.priorityTags.includes(answers.priority)) s += 2;
  return s;
}

function getRecommendations(answers: Answers) {
  return [...VESTS]
    .map((v) => ({ ...v, _score: scoreVest(v, answers) }))
    .filter((v) => v._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 4);
}

const categoryColors: Record<string, string> = {
  race: "bg-blue-100 text-blue-800",
  allround: "bg-green-100 text-green-800",
  expedition: "bg-red-100 text-red-800",
  minimalist: "bg-purple-100 text-purple-800",
};

const categoryLabels: Record<string, string> = {
  race: "Race Vest",
  allround: "All-Around",
  expedition: "Expedition",
  minimalist: "Minimalist",
};

export default function VestFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const currentQ = QUESTIONS[step];

  function select(value: string) {
    const next = { ...answers, [currentQ.id]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setDone(false);
  }

  const results = done ? getRecommendations(answers) : [];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-5 text-white">
        <h2 className="font-headline text-xl font-bold">Vest Finder</h2>
        <p className="text-blue-100 text-sm mt-1">
          Answer 4 questions — we&apos;ll match you with the right pack.
        </p>
      </div>

      {!done ? (
        <div className="p-6 sm:p-8">
          {/* Progress */}
          <div className="flex gap-1.5 mb-6">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-gray-100"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-gray font-medium mb-2">
            Question {step + 1} of {QUESTIONS.length}
          </p>
          <h3 className="font-headline text-2xl font-bold text-dark mb-6 flex items-center gap-2">
            {currentQ.icon}
            <span>{currentQ.question}</span>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-headline text-xl font-bold text-dark">Your Matches</h3>
              <p className="text-sm text-gray mt-0.5">Ranked by fit to your answers.</p>
            </div>
            <button
              onClick={restart}
              className="text-sm text-primary hover:underline font-medium"
            >
              Retake →
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((vest, i) => (
              <div
                key={vest.id}
                className={`rounded-xl border p-5 ${
                  i === 0
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                {i === 0 && (
                  <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2">
                    Best Match
                  </span>
                )}
                <span
                  className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${
                    categoryColors[vest.category]
                  }`}
                >
                  {categoryLabels[vest.category]}
                </span>
                <p className="text-xs font-semibold text-gray uppercase tracking-wide">
                  {vest.brand}
                </p>
                <h4 className="font-headline font-bold text-dark text-lg leading-tight">
                  {vest.name}
                </h4>
                <div className="flex gap-3 mt-1 mb-3 text-xs text-gray flex-wrap">
                  <span>{vest.price}</span>
                  <span>•</span>
                  <span>{vest.capacity}</span>
                  <span>•</span>
                  <span>{vest.weight}</span>
                </div>
                <p className="text-sm text-gray leading-relaxed mb-4">{vest.blurb}</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    ["REI", vest.affiliates.rei],
                    ["Amazon", vest.affiliates.amazon],
                    ["Running Warehouse", vest.affiliates.warehouse],
                  ].map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary hover:text-primary transition-colors font-medium"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray mt-5 text-center">
            *Affiliate links — we may earn a commission at no extra cost to you.
          </p>
        </div>
      )}
    </div>
  );
}
