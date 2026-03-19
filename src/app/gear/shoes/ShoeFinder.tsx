"use client";

import { useState } from "react";
import { PersonStanding, Mountain, Target, Calendar } from "lucide-react";

const SHOES = [
  {
    id: "hoka-speedgoat-6",
    name: "Speedgoat 6",
    brand: "Hoka",
    category: "max-cushion",
    price: "$160",
    weight: "10.1 oz",
    drop: "4mm",
    stack: "37/33mm",
    terrainTags: ["technical", "mixed", "mountain"],
    priorityTags: ["cushion", "traction"],
    distanceTags: ["50k", "50m", "100k", "100m"],
    blurb: "The gold standard for high-mileage trail comfort. Vibram Megagrip traction handles technical terrain without sacrificing plush underfoot feel.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
  },
  {
    id: "hoka-mafate-speed-4",
    name: "Mafate Speed 4",
    brand: "Hoka",
    category: "max-cushion",
    price: "$175",
    weight: "11.0 oz",
    drop: "5mm",
    stack: "37/33mm",
    terrainTags: ["technical", "mountain", "mixed"],
    priorityTags: ["cushion", "stability"],
    distanceTags: ["100k", "100m"],
    blurb: "Built for 100-mile punishment. Dual-density midsole with aggressive Vibram outsole — when you need maximum protection on brutal courses.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
  },
  {
    id: "altra-olympus-5",
    name: "Olympus 5",
    brand: "Altra",
    category: "max-cushion",
    price: "$160",
    weight: "11.2 oz",
    drop: "0mm",
    stack: "33mm",
    terrainTags: ["smooth", "mixed", "desert"],
    priorityTags: ["cushion", "wide"],
    distanceTags: ["50k", "50m", "100k", "100m"],
    blurb: "Zero-drop maximum cushion with Altra's anatomical FootShape toe box. Ideal for runners who want plush comfort without heel elevation.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
  },
  {
    id: "saucony-endorphin-edge",
    name: "Endorphin Edge",
    brand: "Saucony",
    category: "max-cushion",
    price: "$190",
    weight: "9.7 oz",
    drop: "8mm",
    stack: "37/29mm",
    terrainTags: ["smooth", "mixed"],
    priorityTags: ["cushion", "light"],
    distanceTags: ["50k", "50m", "100k"],
    blurb: "PEBA foam with a carbon plate for trail runners who want road-shoe responsiveness on groomed singletrack. Surprisingly fast for its cushion level.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
  },
  {
    id: "salomon-slab-ultra-3",
    name: "S/Lab Ultra 3",
    brand: "Salomon",
    category: "lightweight",
    price: "$200",
    weight: "9.2 oz",
    drop: "6mm",
    stack: "30/24mm",
    terrainTags: ["technical", "mixed", "mountain"],
    priorityTags: ["light", "traction"],
    distanceTags: ["50k", "50m", "100k"],
    blurb: "Race-day weapon from Salomon's elite lab. SensiFit upper locks your foot down on descents while Contagrip keeps you planted on wet rocks.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
  },
  {
    id: "saucony-peregrine-14",
    name: "Peregrine 14",
    brand: "Saucony",
    category: "lightweight",
    price: "$140",
    weight: "9.6 oz",
    drop: "8mm",
    stack: "31/23mm",
    terrainTags: ["technical", "smooth", "mixed"],
    priorityTags: ["light", "traction"],
    distanceTags: ["50k", "50m"],
    blurb: "The reliable workhorse. TrailTack rubber and a versatile lug pattern make it one of the most trusted everyday trainers in ultra running.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
  },
  {
    id: "altra-superior-6",
    name: "Superior 6",
    brand: "Altra",
    category: "lightweight",
    price: "$140",
    weight: "8.7 oz",
    drop: "0mm",
    stack: "25mm",
    terrainTags: ["smooth", "mixed", "desert"],
    priorityTags: ["light", "wide"],
    distanceTags: ["50k", "50m"],
    blurb: "Altra's lightest trail shoe. Zero-drop minimalism meets a wide toe box for natural foot mechanics — beloved by ultra runners chasing PRs.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
  },
  {
    id: "la-sportiva-bushido-iii",
    name: "Bushido III",
    brand: "La Sportiva",
    category: "technical",
    price: "$160",
    weight: "10.4 oz",
    drop: "7mm",
    stack: "26/19mm",
    terrainTags: ["technical", "mountain"],
    priorityTags: ["traction", "stability"],
    distanceTags: ["50k", "50m", "100k"],
    blurb: "Italian precision for gnarly terrain. FriXion AT rubber and a flex grooved outsole grip wet roots and angled rock faces with confidence.",
    affiliates: { rei: "#", amazon: "#", backcountry: "#" },
  },
  {
    id: "salomon-speedcross-6",
    name: "Speedcross 6",
    brand: "Salomon",
    category: "technical",
    price: "$140",
    weight: "9.6 oz",
    drop: "8mm",
    stack: "34/26mm",
    terrainTags: ["technical", "mountain"],
    priorityTags: ["traction"],
    distanceTags: ["50k", "50m"],
    blurb: "The ultimate mud shoe. Deep chevron lugs bite into soft terrain like nothing else — if your race is muddy, these are your answer.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
  },
  {
    id: "inov8-mudclaw-g260",
    name: "Mudclaw G 260",
    brand: "Inov-8",
    category: "technical",
    price: "$160",
    weight: "9.2 oz",
    drop: "6mm",
    stack: "25/19mm",
    terrainTags: ["technical"],
    priorityTags: ["traction", "light"],
    distanceTags: ["50k", "50m"],
    blurb: "Graphene-enhanced rubber with 8mm spike-like lugs. Designed for wet, boggy, and ultra-technical courses where grip is life.",
    affiliates: { rei: "#", amazon: "#", backcountry: "#" },
  },
  {
    id: "altra-lone-peak-8",
    name: "Lone Peak 8",
    brand: "Altra",
    category: "wide",
    price: "$140",
    weight: "9.7 oz",
    drop: "0mm",
    stack: "25mm",
    terrainTags: ["smooth", "mixed", "mountain"],
    priorityTags: ["wide", "cushion"],
    distanceTags: ["50k", "50m", "100k", "100m"],
    blurb: "The most popular ultra shoe of all time. FootShape toe box, zero drop, and bomber durability across any terrain. A legend for a reason.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
  },
  {
    id: "altra-timp-5",
    name: "Timp 5",
    brand: "Altra",
    category: "wide",
    price: "$145",
    weight: "10.1 oz",
    drop: "0mm",
    stack: "33mm",
    terrainTags: ["technical", "mixed", "mountain"],
    priorityTags: ["wide", "cushion", "traction"],
    distanceTags: ["50k", "50m", "100k", "100m"],
    blurb: "The cushioned wide-toe-box choice. More stack than the Lone Peak with aggressive TrailClaw lugs — perfect for technical 100-mile courses.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
  },
  {
    id: "topo-ultraventure-3",
    name: "Ultraventure 3",
    brand: "Topo",
    category: "wide",
    price: "$140",
    weight: "10.1 oz",
    drop: "5mm",
    stack: "28/23mm",
    terrainTags: ["smooth", "mixed"],
    priorityTags: ["wide", "cushion"],
    distanceTags: ["50k", "50m", "100k"],
    blurb: "Topo's roomy fit and 5mm drop bridge the gap between zero-drop and traditional shoes. Great for wide-footed runners who want versatility.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
  },
  {
    id: "la-sportiva-ultra-raptor-ii",
    name: "Ultra Raptor II",
    brand: "La Sportiva",
    category: "mountain",
    price: "$175",
    weight: "11.6 oz",
    drop: "6mm",
    stack: "28/22mm",
    terrainTags: ["mountain", "technical"],
    priorityTags: ["traction", "stability"],
    distanceTags: ["50k", "50m", "100k"],
    blurb: "Built for the mountains. Gaiter-compatible, rockered construction, and Italian FriXion AT rubber that sticks to wet granite.",
    affiliates: { rei: "#", amazon: "#", backcountry: "#" },
  },
  {
    id: "hoka-tecton-x2",
    name: "Tecton X2",
    brand: "Hoka",
    category: "mountain",
    price: "$225",
    weight: "9.5 oz",
    drop: "8mm",
    stack: "38/30mm",
    terrainTags: ["mountain", "technical", "mixed"],
    priorityTags: ["cushion", "light"],
    distanceTags: ["50k", "50m", "100k"],
    blurb: "Two carbon fiber plates meet Hoka's max cushion platform. Explosive uphill response and plush downhill protection — the pinnacle of trail tech.",
    affiliates: { rei: "#", amazon: "#", runningWarehouse: "#" },
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
    ],
  },
  {
    id: "terrain",
    question: "What's your primary terrain?",
    icon: <Mountain className="w-5 h-5 text-primary" />,
    options: [
      { label: "Technical trails (rocks, roots)", value: "technical" },
      { label: "Smooth / groomed trails", value: "smooth" },
      { label: "Mixed terrain", value: "mixed" },
      { label: "Mountain / alpine", value: "mountain" },
      { label: "Desert / sandy", value: "desert" },
    ],
  },
  {
    id: "priority",
    question: "What's your top priority?",
    icon: <Target className="w-5 h-5 text-primary" />,
    options: [
      { label: "Maximum cushioning", value: "cushion" },
      { label: "Lightweight and fast", value: "light" },
      { label: "Superior traction / grip", value: "traction" },
      { label: "Wide toe box", value: "wide" },
      { label: "Stability / support", value: "stability" },
    ],
  },
  {
    id: "volume",
    question: "Weekly training volume?",
    icon: <Calendar className="w-5 h-5 text-primary" />,
    options: [
      { label: "Under 40 miles", value: "low" },
      { label: "40–60 miles", value: "medium" },
      { label: "60–80 miles", value: "high" },
      { label: "80+ miles", value: "very-high" },
    ],
  },
];

type Answers = Record<string, string>;

function score(shoe: (typeof SHOES)[0], answers: Answers): number {
  let s = 0;
  if (shoe.terrainTags.includes(answers.terrain)) s += 3;
  if (shoe.priorityTags.includes(answers.priority)) s += 3;
  if (shoe.distanceTags.includes(answers.distance)) s += 2;
  // high-volume runners benefit from more cushion
  if (answers.volume === "very-high" && shoe.category === "max-cushion") s += 1;
  return s;
}

function getRecommendations(answers: Answers) {
  return [...SHOES]
    .map((shoe) => ({ ...shoe, _score: score(shoe, answers) }))
    .filter((s) => s._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 4);
}

const categoryColors: Record<string, string> = {
  "max-cushion": "bg-blue-100 text-blue-800",
  lightweight: "bg-green-100 text-green-800",
  technical: "bg-orange-100 text-orange-800",
  wide: "bg-purple-100 text-purple-800",
  mountain: "bg-red-100 text-red-800",
};

const categoryLabels: Record<string, string> = {
  "max-cushion": "Max Cushion",
  lightweight: "Lightweight",
  technical: "Technical",
  wide: "Wide Toe Box",
  mountain: "Mountain",
};

export default function ShoeFinder() {
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
        <h2 className="font-headline text-xl font-bold">Shoe Finder</h2>
        <p className="text-blue-100 text-sm mt-1">Answer 4 quick questions — we&apos;ll match you with the right shoe.</p>
      </div>

      {!done ? (
        <div className="p-6 sm:p-8">
          {/* Progress */}
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
              <p className="text-sm text-gray mt-0.5">Based on your answers — ranked by fit.</p>
            </div>
            <button
              onClick={restart}
              className="text-sm text-primary hover:underline font-medium"
            >
              Retake →
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((shoe, i) => (
              <div
                key={shoe.id}
                className={`rounded-xl border p-5 ${i === 0 ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-100 bg-gray-50"}`}
              >
                {i === 0 && (
                  <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2">
                    Best Match
                  </span>
                )}
                <span
                  className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${categoryColors[shoe.category]}`}
                >
                  {categoryLabels[shoe.category]}
                </span>
                <p className="text-xs font-semibold text-gray uppercase tracking-wide">{shoe.brand}</p>
                <h4 className="font-headline font-bold text-dark text-lg leading-tight">{shoe.name}</h4>
                <div className="flex gap-3 mt-1 mb-3 text-xs text-gray">
                  <span>{shoe.price}</span>
                  <span>•</span>
                  <span>{shoe.weight}</span>
                  <span>•</span>
                  <span>{shoe.drop} drop</span>
                </div>
                <p className="text-sm text-gray leading-relaxed mb-4">{shoe.blurb}</p>
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={shoe.affiliates.rei}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary hover:text-primary transition-colors font-medium"
                  >
                    REI
                  </a>
                  <a
                    href={shoe.affiliates.amazon}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary hover:text-primary transition-colors font-medium"
                  >
                    Amazon
                  </a>
                  <a
                    href={shoe.affiliates.runningWarehouse ?? shoe.affiliates.backcountry ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary hover:text-primary transition-colors font-medium"
                  >
                    Running Warehouse
                  </a>
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
