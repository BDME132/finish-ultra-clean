"use client";

import { useState } from "react";
import { PersonStanding, Mountain, Target, Calendar } from "lucide-react";
import { shoes as shoeProducts } from "@/lib/products";
import type { ShoeProduct } from "@/lib/products/types";

const SHOES = shoeProducts.map((s: ShoeProduct) => ({
  id: s.id,
  name: s.name,
  brand: s.brand,
  category: s.subcategory ?? "max-cushion",
  price: s.priceDisplay,
  weight: s.specs.weight,
  drop: s.specs.drop,
  stack: s.specs.stack,
  terrainTags: s.finderTags.terrain,
  priorityTags: s.finderTags.priority,
  distanceTags: s.finderTags.distance,
  blurb: s.description,
  affiliates: {
    rei: s.affiliateLinks.rei,
    amazon: s.affiliateLinks.amazon,
    runningWarehouse: s.affiliateLinks.runningWarehouse,
    backcountry: s.affiliateLinks.backcountry,
  },
}));

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
