// ─── Saved Training Plan Types ────────────────────────────────────────────────

export interface SavedWorkoutDay {
  day: string;
  workout: string;
  distance: string;
  effort: string;
  notes: string;
}

export interface SavedWeek {
  weekNumber: number;
  weeksToRace: number;
  startDate: string;
  endDate: string;
  phase: string;
  totalMiles: number;
  longRun: number;
  b2b: number;
  isRecovery: boolean;
  days: SavedWorkoutDay[];
  goals: string[];
}

export interface CompletedWorkout {
  weekNumber: number;
  dayIndex: number;
  day: string;
  plannedDistance: string;
  actualMiles: number;
  feeling: "great" | "good" | "average" | "tired" | "struggling";
  notes: string;
  completedAt: string;
}

export interface GearTrackingItem {
  id: string;
  category: string;
  productName: string;
  brand: string;
  price: string;
  priority: "critical" | "high" | "standard";
  neededByWeek: number;
  purchased: boolean;
  purchaseDate?: string;
  tested: boolean;
  testingNotes: string;
  rating: number; // 0-5
  breakInMiles: number;
  breakInTarget: number;
}

export interface NutritionProduct {
  id: string;
  type: "gel" | "drink" | "electrolyte" | "food" | "caffeine";
  productName: string;
  brand: string;
  price: string;
  purchased: boolean;
  tested: boolean;
  testingNotes: string;
  stomachRating: number; // 0-5
  wouldUseInRace: "yes" | "maybe" | "no" | "";
}

export interface RaceDayChecklistItem {
  id: string;
  category: string;
  label: string;
  checked: boolean;
}

export interface SavedPlan {
  raceDate: string;
  raceName: string;
  distance: string;
  level: string;
  weeksTotal: number;
  currentWeeklyMiles: number;
  generatedAt: string;
  weeks: SavedWeek[];
  completedWorkouts: Record<string, CompletedWorkout>; // key: "w{week}-d{dayIndex}"
  gearItems: GearTrackingItem[];
  nutritionProducts: NutritionProduct[];
  raceDayChecklist: RaceDayChecklistItem[];
}

// ─── Default gear items by distance ──────────────────────────────────────────
export function getDefaultGearItems(distance: string): GearTrackingItem[] {
  const is100 = distance === "100M" || distance === "100K";
  const items: GearTrackingItem[] = [
    { id: "shoes-primary", category: "Footwear", productName: "Primary Trail Shoes", brand: "", price: "$140-160", priority: "critical", neededByWeek: 1, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 50 },
    { id: "socks", category: "Footwear", productName: "Trail Socks (4 pairs)", brand: "Darn Tough", price: "$88", priority: "critical", neededByWeek: 1, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
    { id: "vest", category: "Hydration", productName: "Running Vest", brand: "Salomon", price: "$130-180", priority: "critical", neededByWeek: 3, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
    { id: "bottles", category: "Hydration", productName: "Soft Flasks (2x 500ml)", brand: "", price: "$25", priority: "high", neededByWeek: 3, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
    { id: "shorts", category: "Apparel", productName: "Trail Shorts", brand: "", price: "$60-70", priority: "high", neededByWeek: 2, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
    { id: "top", category: "Apparel", productName: "Technical Top", brand: "", price: "$45-75", priority: "high", neededByWeek: 2, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
    { id: "rain-jacket", category: "Apparel", productName: "Rain Jacket", brand: "OR Helium", price: "$150", priority: "standard", neededByWeek: 10, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
    { id: "hat", category: "Accessories", productName: "Running Cap/Hat", brand: "", price: "$30-38", priority: "standard", neededByWeek: 4, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
    { id: "watch", category: "Electronics", productName: "GPS Watch", brand: "", price: "$130-500", priority: "high", neededByWeek: 1, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
    { id: "bodyglide", category: "Accessories", productName: "Anti-Chafe (Body Glide)", brand: "Body Glide", price: "$10", priority: "high", neededByWeek: 2, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
  ];

  if (is100) {
    items.push(
      { id: "shoes-spare", category: "Footwear", productName: "Spare Race Shoes", brand: "", price: "$140-160", priority: "high", neededByWeek: 10, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 50 },
      { id: "headlamp", category: "Electronics", productName: "Headlamp (Rechargeable)", brand: "Petzl", price: "$60-80", priority: "critical", neededByWeek: 8, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
      { id: "headlamp-spare", category: "Electronics", productName: "Spare Headlamp/Batteries", brand: "", price: "$25-40", priority: "standard", neededByWeek: 12, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
      { id: "warm-layer", category: "Apparel", productName: "Insulating Mid Layer", brand: "", price: "$80-150", priority: "standard", neededByWeek: 12, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
      { id: "gloves", category: "Apparel", productName: "Running Gloves", brand: "", price: "$30-45", priority: "standard", neededByWeek: 14, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
    );
  } else {
    items.push(
      { id: "headlamp", category: "Electronics", productName: "Headlamp (if night)", brand: "", price: "$40-80", priority: "standard", neededByWeek: 10, purchased: false, tested: false, testingNotes: "", rating: 0, breakInMiles: 0, breakInTarget: 0 },
    );
  }

  return items;
}

export function getDefaultNutritionProducts(): NutritionProduct[] {
  return [
    { id: "fuel-primary", type: "drink", productName: "Endurance Fuel (30 servings)", brand: "Tailwind", price: "$25-40", purchased: false, tested: false, testingNotes: "", stomachRating: 0, wouldUseInRace: "" },
    { id: "gel-primary", type: "gel", productName: "Energy Gels (12 pack)", brand: "Spring Energy", price: "$32", purchased: false, tested: false, testingNotes: "", stomachRating: 0, wouldUseInRace: "" },
    { id: "gel-backup", type: "gel", productName: "Backup Gel Brand", brand: "Maurten", price: "$36", purchased: false, tested: false, testingNotes: "", stomachRating: 0, wouldUseInRace: "" },
    { id: "electrolyte", type: "electrolyte", productName: "Electrolyte Caps (100ct)", brand: "SaltStick", price: "$22", purchased: false, tested: false, testingNotes: "", stomachRating: 0, wouldUseInRace: "" },
    { id: "electrolyte-drink", type: "electrolyte", productName: "Electrolyte Mix", brand: "LMNT", price: "$45", purchased: false, tested: false, testingNotes: "", stomachRating: 0, wouldUseInRace: "" },
    { id: "real-food", type: "food", productName: "Waffles/Chews", brand: "Honey Stinger", price: "$20", purchased: false, tested: false, testingNotes: "", stomachRating: 0, wouldUseInRace: "" },
    { id: "caffeine", type: "caffeine", productName: "Caffeine Pills (200mg)", brand: "", price: "$8", purchased: false, tested: false, testingNotes: "", stomachRating: 0, wouldUseInRace: "" },
  ];
}

export function getDefaultRaceDayChecklist(): RaceDayChecklistItem[] {
  return [
    // Night before
    { id: "rb-gear", category: "Night Before", label: "Lay out all gear", checked: false },
    { id: "rb-bib", category: "Night Before", label: "Pin bib to vest/shirt", checked: false },
    { id: "rb-charge", category: "Night Before", label: "Charge watch and headlamp", checked: false },
    { id: "rb-alarms", category: "Night Before", label: "Set 2+ alarms", checked: false },
    { id: "rb-carbs", category: "Night Before", label: "Eat carb-heavy dinner", checked: false },
    { id: "rb-dropbag", category: "Night Before", label: "Drop bags packed and labeled", checked: false },
    // Morning
    { id: "rm-meal", category: "Race Morning", label: "Eat 2-3 hours before start", checked: false },
    { id: "rm-sunscreen", category: "Race Morning", label: "Apply sunscreen and anti-chafe", checked: false },
    { id: "rm-flasks", category: "Race Morning", label: "Fill flasks with fuel", checked: false },
    { id: "rm-vest", category: "Race Morning", label: "Load vest with nutrition", checked: false },
    { id: "rm-bathroom", category: "Race Morning", label: "Use the bathroom (twice)", checked: false },
    { id: "rm-arrive", category: "Race Morning", label: "Arrive 30 min early", checked: false },
    // Start
    { id: "rs-watch", category: "Start Line", label: "Watch tracking and charged", checked: false },
    { id: "rs-gel", category: "Start Line", label: "Take 1 gel 15 min before start", checked: false },
    { id: "rs-breathe", category: "Start Line", label: "Deep breaths — trust your training", checked: false },
  ];
}

export const PLAN_STORAGE_KEY = "finishultra_training_plan";

export function loadSavedPlan(): SavedPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLAN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedPlan;
  } catch {
    return null;
  }
}

export function savePlan(plan: SavedPlan): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
}
