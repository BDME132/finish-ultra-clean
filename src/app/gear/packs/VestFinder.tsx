"use client";

import { useState } from "react";
import { PersonStanding, Package, Droplets, Target } from "lucide-react";
import { packs } from "@/lib/products";
import type { PackProduct } from "@/lib/products/types";

const VESTS = packs.map((p: PackProduct) => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  category: p.subcategory ?? "",
  price: p.priceDisplay,
  weight: p.specs.weight,
  capacity: p.specs.capacity,
  genderFit: p.specs.genderFit,
  distanceTags: p.finderTags.distance,
  buildTags: p.finderTags.build,
  capacityTags: p.finderTags.capacity,
  hydrationTags: p.finderTags.hydration,
  priorityTags: p.finderTags.priority,
  blurb: p.description,
  affiliates: {
    rei: p.affiliateLinks.rei ?? "#",
    amazon: p.affiliateLinks.amazon ?? "#",
    warehouse: p.affiliateLinks.runningWarehouse ?? "#",
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
