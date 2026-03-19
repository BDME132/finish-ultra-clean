"use client";

import { useState } from "react";
import { Coffee } from "lucide-react";

type Inputs = {
  weight: string;
  unit: "lbs" | "kg";
  distance: "50k" | "50m" | "100k" | "100m";
  finishHours: string;
  sweatRate: "light" | "moderate" | "heavy";
  temperature: "cool" | "moderate" | "hot";
  stomachSensitivity: "iron" | "average" | "sensitive";
  caffeineUser: "yes" | "no";
};

type Results = {
  calPerHour: number;
  carbsPerHour: number;
  fluidOzPerHour: number;
  sodiumPerHour: number;
  totalCalories: number;
  totalHours: number;
  caffeineSchedule: string[];
  sampleHour: { time: string; item: string; cals: number }[];
};

const DISTANCE_LABELS: Record<string, string> = {
  "50k": "50K (~31 miles)",
  "50m": "50 Miles",
  "100k": "100K (~62 miles)",
  "100m": "100 Miles",
};

function calculate(inputs: Inputs): Results {
  const weightKg =
    inputs.unit === "lbs"
      ? parseFloat(inputs.weight) * 0.453592
      : parseFloat(inputs.weight);
  const hours = parseFloat(inputs.finishHours) || 10;

  // Calorie burn estimate: ~60-80 cal/mile, adjusted for pace
  const mileage = { "50k": 31, "50m": 50, "100k": 62, "100m": 100 }[inputs.distance];
  const totalBurn = mileage * (weightKg * 0.9); // ~0.9 kcal/kg/km ≈ rough trail estimate

  // Target intake is ~40-60% of burn to avoid overloading GI
  const targetIntakePct = inputs.stomachSensitivity === "sensitive" ? 0.40 : inputs.stomachSensitivity === "average" ? 0.50 : 0.60;
  const totalCalories = Math.round(totalBurn * targetIntakePct);
  const calPerHour = Math.round(totalCalories / hours);

  // Carbs: 40-90g/hr depending on sensitivity and distance
  const carbBase = inputs.stomachSensitivity === "iron" ? 75 : inputs.stomachSensitivity === "average" ? 55 : 40;
  const carbsPerHour = inputs.distance === "50k" ? Math.min(carbBase, 60) : carbBase;

  // Fluid: 16-32oz/hr base, adjusted for sweat and temp
  let fluidBase = 16;
  if (inputs.sweatRate === "moderate") fluidBase = 20;
  if (inputs.sweatRate === "heavy") fluidBase = 26;
  if (inputs.temperature === "moderate") fluidBase += 2;
  if (inputs.temperature === "hot") fluidBase += 6;
  const fluidOzPerHour = fluidBase;

  // Sodium: 300-700mg/hr
  let sodiumBase = 300;
  if (inputs.sweatRate === "moderate") sodiumBase = 450;
  if (inputs.sweatRate === "heavy") sodiumBase = 600;
  if (inputs.temperature === "hot") sodiumBase += 100;
  const sodiumPerHour = sodiumBase;

  // Caffeine schedule
  const caffeineSchedule: string[] = [];
  if (inputs.caffeineUser === "yes") {
    if (inputs.distance === "50k") {
      caffeineSchedule.push(`Mile 20–25: 100mg (caffeinated gel or pill)`);
    } else if (inputs.distance === "50m") {
      caffeineSchedule.push(`Mile 30–35: 100mg first dose`);
      caffeineSchedule.push(`Mile 42–45: 100–200mg second dose`);
    } else if (inputs.distance === "100k") {
      caffeineSchedule.push(`Mile 25–30: 100mg when fatigue hits`);
      caffeineSchedule.push(`Mile 40–45: 150mg before nightfall`);
      caffeineSchedule.push(`Mile 55–60: 100mg late push`);
    } else {
      caffeineSchedule.push(`Mile 45–50 (evening): 150–200mg first dose`);
      caffeineSchedule.push(`Night miles every 3–4 hrs: 100mg as needed`);
      caffeineSchedule.push(`Mile 80–85 (dawn): 150–200mg final boost`);
    }
  }

  // Sample hourly fueling plan (first 4 hours)
  const sampleHour = [
    { time: "Hour 1", item: "1 energy gel + electrolyte drink (16oz)", cals: calPerHour },
    { time: "Hour 2", item: "Energy chews (half pack) + water (16oz)", cals: calPerHour },
    { time: "Hour 3", item: "1 energy gel + waffle + electrolyte drink", cals: calPerHour },
    {
      time: "Hour 4+",
      item:
        inputs.stomachSensitivity === "sensitive"
          ? "Bland real food (banana, pretzels) + water"
          : "Mix of gels, real food, drink mix — rotate flavors",
      cals: calPerHour,
    },
  ];

  return {
    calPerHour,
    carbsPerHour,
    fluidOzPerHour,
    sodiumPerHour,
    totalCalories,
    totalHours: hours,
    caffeineSchedule,
    sampleHour,
  };
}

const defaultInputs: Inputs = {
  weight: "155",
  unit: "lbs",
  distance: "50m",
  finishHours: "10",
  sweatRate: "moderate",
  temperature: "moderate",
  stomachSensitivity: "average",
  caffeineUser: "yes",
};

export default function NutritionCalculator() {
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [results, setResults] = useState<Results | null>(null);

  function set<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setResults(null);
  }

  function run() {
    if (!inputs.weight || isNaN(parseFloat(inputs.weight))) return;
    setResults(calculate(inputs));
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-accent to-orange-600 px-6 py-5 text-white">
        <h2 className="font-headline text-xl font-bold">Personalized Nutrition Calculator</h2>
        <p className="text-orange-100 text-sm mt-1">
          Get your per-hour fueling targets based on your race profile.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Weight */}
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5">Body Weight</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputs.weight}
                onChange={(e) => set("weight", e.target.value)}
                placeholder="155"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              />
              <select
                value={inputs.unit}
                onChange={(e) => set("unit", e.target.value as "lbs" | "kg")}
                className="px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
              >
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          {/* Distance */}
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5">Race Distance</label>
            <select
              value={inputs.distance}
              onChange={(e) => set("distance", e.target.value as Inputs["distance"])}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
            >
              {Object.entries(DISTANCE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          {/* Finish time */}
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5">Estimated Finish Time (hrs)</label>
            <input
              type="number"
              value={inputs.finishHours}
              onChange={(e) => set("finishHours", e.target.value)}
              placeholder="10"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Sweat rate */}
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5">Sweat Rate</label>
            <select
              value={inputs.sweatRate}
              onChange={(e) => set("sweatRate", e.target.value as Inputs["sweatRate"])}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
            >
              <option value="light">Light sweater</option>
              <option value="moderate">Moderate sweater</option>
              <option value="heavy">Heavy sweater</option>
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5">Expected Temperature</label>
            <select
              value={inputs.temperature}
              onChange={(e) => set("temperature", e.target.value as Inputs["temperature"])}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
            >
              <option value="cool">Cool (&lt;60°F)</option>
              <option value="moderate">Moderate (60–75°F)</option>
              <option value="hot">Hot (75°F+)</option>
            </select>
          </div>

          {/* Stomach */}
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5">Stomach Tolerance</label>
            <select
              value={inputs.stomachSensitivity}
              onChange={(e) => set("stomachSensitivity", e.target.value as Inputs["stomachSensitivity"])}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
            >
              <option value="iron">Iron gut — can eat anything</option>
              <option value="average">Average — occasional issues</option>
              <option value="sensitive">Sensitive — GI problems common</option>
            </select>
          </div>

          {/* Caffeine */}
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5">Use Caffeine?</label>
            <select
              value={inputs.caffeineUser}
              onChange={(e) => set("caffeineUser", e.target.value as "yes" | "no")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
            >
              <option value="yes">Yes — I use caffeine</option>
              <option value="no">No — I avoid caffeine</option>
            </select>
          </div>

          {/* CTA */}
          <div className="flex items-end">
            <button
              onClick={run}
              className="w-full px-4 py-2.5 bg-accent hover:bg-orange-600 text-white font-bold rounded-lg transition-colors text-sm"
            >
              Calculate →
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="border-t border-gray-100 pt-6 animate-fade-in">
            <h3 className="font-headline font-bold text-dark text-lg mb-4">
              Your Fueling Targets — {DISTANCE_LABELS[inputs.distance]}
            </h3>

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Calories / hour", value: `${results.calPerHour}`, unit: "kcal", color: "bg-orange-50 border-orange-200" },
                { label: "Carbs / hour", value: `${results.carbsPerHour}`, unit: "grams", color: "bg-blue-50 border-blue-200" },
                { label: "Fluid / hour", value: `${results.fluidOzPerHour}`, unit: "oz", color: "bg-cyan-50 border-cyan-200" },
                { label: "Sodium / hour", value: `${results.sodiumPerHour}`, unit: "mg", color: "bg-yellow-50 border-yellow-200" },
              ].map((m) => (
                <div key={m.label} className={`rounded-xl border p-4 text-center ${m.color}`}>
                  <p className="text-2xl font-bold text-dark">{m.value}</p>
                  <p className="text-xs text-gray mt-0.5">{m.unit}</p>
                  <p className="text-xs font-semibold text-dark mt-1">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              {/* Total summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-dark mb-3 text-sm">Total Race Nutrition</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray">Estimated finish time</span>
                    <span className="font-medium text-dark">{results.totalHours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">Total calories target</span>
                    <span className="font-medium text-dark">{results.totalCalories.toLocaleString()} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">Total fluid (approx)</span>
                    <span className="font-medium text-dark">
                      {Math.round(results.fluidOzPerHour * results.totalHours)} oz
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">Gels needed (est.)</span>
                    <span className="font-medium text-dark">
                      {Math.ceil((results.totalCalories * 0.6) / 100)} gels
                    </span>
                  </div>
                </div>
              </div>

              {/* Caffeine schedule */}
              {results.caffeineSchedule.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold text-dark mb-3 text-sm flex items-center gap-1.5"><Coffee className="w-4 h-4" /> Caffeine Timeline</p>
                  <ul className="space-y-1.5">
                    {results.caffeineSchedule.map((s) => (
                      <li key={s} className="text-sm text-gray flex gap-2">
                        <span className="text-accent shrink-0">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sample hourly plan */}
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <p className="font-semibold text-dark mb-3 text-sm">Sample Hourly Fueling Plan</p>
              <div className="space-y-2">
                {results.sampleHour.map((row) => (
                  <div key={row.time} className="flex items-start gap-3 text-sm">
                    <span className="font-bold text-primary shrink-0 w-16">{row.time}</span>
                    <span className="text-gray flex-1">{row.item}</span>
                    <span className="font-medium text-dark shrink-0">~{row.cals} cal</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray mt-3 italic">
                * These are estimates. Always test your nutrition plan in training before race day.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
