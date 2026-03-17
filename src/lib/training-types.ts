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

// ─── Runner Profile ──────────────────────────────────────────────────────────
export interface RunnerProfile {
  weightLbs?: number;
  sweatRate?: "light" | "moderate" | "heavy";
  stomachSensitivity?: "iron" | "average" | "sensitive";
  caffeineUser?: boolean;
}

// ─── Daily Tasks ─────────────────────────────────────────────────────────────
export interface DailyTask {
  id: string;
  category: "recovery" | "nutrition" | "gear" | "training";
  label: string;
  checked: boolean;
  date: string; // ISO date YYYY-MM-DD
}

// ─── Post-Race Report ────────────────────────────────────────────────────────
export interface PostRaceReport {
  finishTime?: string;
  placing?: string;
  ageGroupPlacing?: string;
  dnf?: boolean;
  wentWell?: string;
  improvements?: string;
  wouldChange?: string;
  overallFeeling?: "amazing" | "good" | "tough" | "brutal";
  nutritionNotes?: string;
  gearNotes?: string;
  completedAt?: string;
}

// ─── Race Countdown Checklists ───────────────────────────────────────────────
export interface RaceCountdownChecklist {
  fourWeeksOut: RaceDayChecklistItem[];
  twoWeeksOut: RaceDayChecklistItem[];
  raceWeek: RaceDayChecklistItem[];
  nightBefore: RaceDayChecklistItem[];
  raceMorning: RaceDayChecklistItem[];
  startLine: RaceDayChecklistItem[];
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
  // New fields (optional for backward compatibility)
  runnerProfile?: RunnerProfile;
  dailyTasks?: DailyTask[];
  postRaceReport?: PostRaceReport;
  raceCountdown?: RaceCountdownChecklist;
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

export function getDefaultRaceCountdown(): RaceCountdownChecklist {
  return {
    fourWeeksOut: [
      { id: "4w-peak", category: "4 Weeks Out", label: "Complete peak week training", checked: false },
      { id: "4w-shoes", category: "4 Weeks Out", label: "All shoes broken in (100+ miles)", checked: false },
      { id: "4w-vest", category: "4 Weeks Out", label: "Vest tested on 8+ long runs", checked: false },
      { id: "4w-gear-check", category: "4 Weeks Out", label: "Final gear check — everything works", checked: false },
      { id: "4w-nutrition", category: "4 Weeks Out", label: "Race nutrition finalized", checked: false },
      { id: "4w-dropbag-confirm", category: "4 Weeks Out", label: "Confirm drop bag locations with race", checked: false },
      { id: "4w-accommodation", category: "4 Weeks Out", label: "Book accommodations if not done", checked: false },
      { id: "4w-travel", category: "4 Weeks Out", label: "Arrange travel", checked: false },
      { id: "4w-crew", category: "4 Weeks Out", label: "Crew/pacer coordination", checked: false },
      { id: "4w-course", category: "4 Weeks Out", label: "Review course maps", checked: false },
    ],
    twoWeeksOut: [
      { id: "2w-taper", category: "2 Weeks Out", label: "Taper mode — easy running only", checked: false },
      { id: "2w-gear-pack", category: "2 Weeks Out", label: "Pack all gear into race bag", checked: false },
      { id: "2w-extras", category: "2 Weeks Out", label: "Extra of everything (socks, nutrition, batteries)", checked: false },
      { id: "2w-electronics", category: "2 Weeks Out", label: "Test all electronics (watch, headlamp)", checked: false },
      { id: "2w-charge", category: "2 Weeks Out", label: "Charge all batteries", checked: false },
      { id: "2w-dropbag-pack", category: "2 Weeks Out", label: "Pack all drop bags", checked: false },
      { id: "2w-nutrition-pack", category: "2 Weeks Out", label: "All race nutrition purchased & packed", checked: false },
      { id: "2w-crew-plan", category: "2 Weeks Out", label: "Crew has nutrition plan copy", checked: false },
      { id: "2w-travel-confirm", category: "2 Weeks Out", label: "Travel arrangements confirmed", checked: false },
      { id: "2w-checkin", category: "2 Weeks Out", label: "Check-in time noted", checked: false },
      { id: "2w-cutoffs", category: "2 Weeks Out", label: "Reviewed cutoff times", checked: false },
      { id: "2w-visualize", category: "2 Weeks Out", label: "Visualize race segments", checked: false },
      { id: "2w-mantras", category: "2 Weeks Out", label: "Positive mantras ready", checked: false },
    ],
    raceWeek: [
      { id: "rw-mon", category: "Race Week", label: "Monday: Easy 3 miles or rest + hydration focus", checked: false },
      { id: "rw-tue", category: "Race Week", label: "Tuesday: Easy 2-3 miles with strides", checked: false },
      { id: "rw-wed", category: "Race Week", label: "Wednesday: Rest or easy 2 miles", checked: false },
      { id: "rw-thu", category: "Race Week", label: "Thursday: Easy 3-4 miles (last workout)", checked: false },
      { id: "rw-fri", category: "Race Week", label: "Friday: Rest + peak carb loading", checked: false },
      { id: "rw-sat", category: "Race Week", label: "Saturday: Complete rest + packet pickup", checked: false },
      { id: "rw-dropbags", category: "Race Week", label: "Ship/deliver drop bags", checked: false },
      { id: "rw-carb", category: "Race Week", label: "Carb loading (60-70% of calories)", checked: false },
      { id: "rw-organize", category: "Race Week", label: "Organize all gear", checked: false },
      { id: "rw-charge-all", category: "Race Week", label: "Charge all electronics", checked: false },
      { id: "rw-documents", category: "Race Week", label: "Print all race documents", checked: false },
    ],
    nightBefore: [
      { id: "nb-gear", category: "Night Before", label: "Lay out all gear", checked: false },
      { id: "nb-bib", category: "Night Before", label: "Pin bib to vest/shirt", checked: false },
      { id: "nb-charge", category: "Night Before", label: "Charge watch and headlamp", checked: false },
      { id: "nb-alarms", category: "Night Before", label: "Set 3 alarms", checked: false },
      { id: "nb-dinner", category: "Night Before", label: "Light dinner, early bed", checked: false },
      { id: "nb-dropbag", category: "Night Before", label: "Drop bags packed and labeled", checked: false },
      { id: "nb-outfit", category: "Night Before", label: "Lay out race morning outfit", checked: false },
      { id: "nb-bed", category: "Night Before", label: "Bed by 8 PM", checked: false },
    ],
    raceMorning: [
      { id: "rm-wake", category: "Race Morning", label: "Wake up 3-4 hours before start", checked: false },
      { id: "rm-coffee", category: "Race Morning", label: "Coffee/tea if normal routine", checked: false },
      { id: "rm-meal", category: "Race Morning", label: "Race morning meal (500-800 cal)", checked: false },
      { id: "rm-dress", category: "Race Morning", label: "Get dressed in exact race outfit", checked: false },
      { id: "rm-bodyglide", category: "Race Morning", label: "Apply Body Glide / anti-chafe", checked: false },
      { id: "rm-sunscreen", category: "Race Morning", label: "Sunscreen if day start", checked: false },
      { id: "rm-bib", category: "Race Morning", label: "Pin race bib", checked: false },
      { id: "rm-vest-check", category: "Race Morning", label: "Double-check vest contents", checked: false },
      { id: "rm-flasks", category: "Race Morning", label: "Fill flasks with fuel", checked: false },
      { id: "rm-arrive", category: "Race Morning", label: "Arrive at start 1 hour early", checked: false },
      { id: "rm-bathroom", category: "Race Morning", label: "Porta-potty visit", checked: false },
      { id: "rm-hydrate", category: "Race Morning", label: "Final hydration (16 oz)", checked: false },
      { id: "rm-warmup", category: "Race Morning", label: "Dynamic warm-up (10 min)", checked: false },
    ],
    startLine: [
      { id: "sl-vest", category: "Start Line", label: "Vest on, all straps adjusted", checked: false },
      { id: "sl-watch", category: "Start Line", label: "Watch tracking and charged", checked: false },
      { id: "sl-headlamp", category: "Start Line", label: "Headlamp if dark start", checked: false },
      { id: "sl-gel", category: "Start Line", label: "Take 1 gel 15 min before start", checked: false },
      { id: "sl-water", category: "Start Line", label: "Sip water", checked: false },
      { id: "sl-corral", category: "Start Line", label: "Find corral position", checked: false },
      { id: "sl-breathe", category: "Start Line", label: "Deep breaths — trust your training", checked: false },
      { id: "sl-pace", category: "Start Line", label: "Control your pace — start conservative", checked: false },
    ],
  };
}

// ─── Daily Task Generation ───────────────────────────────────────────────────
export function generateDailyTasks(
  plan: SavedPlan,
  today: Date,
  todayWorkout: SavedWorkoutDay | undefined,
  currentWeekNum: number,
): DailyTask[] {
  const dateStr = today.toISOString().split("T")[0];
  const tasks: DailyTask[] = [];

  // Training task
  if (todayWorkout && todayWorkout.workout !== "Rest") {
    tasks.push({
      id: `t-workout-${dateStr}`,
      category: "training",
      label: `Complete ${todayWorkout.workout} (${todayWorkout.distance})`,
      checked: false,
      date: dateStr,
    });
  }

  // Recovery tasks
  tasks.push(
    { id: `r-water-${dateStr}`, category: "recovery", label: "Drink 80+ oz water today", checked: false, date: dateStr },
    { id: `r-sleep-${dateStr}`, category: "recovery", label: "Sleep 8+ hours tonight", checked: false, date: dateStr },
  );

  if (todayWorkout && todayWorkout.workout !== "Rest") {
    tasks.push(
      { id: `r-protein-${dateStr}`, category: "recovery", label: "Recovery protein within 30 min of run", checked: false, date: dateStr },
    );
    if (todayWorkout.workout.includes("Long") || todayWorkout.workout.includes("simulation")) {
      tasks.push(
        { id: `r-foam-${dateStr}`, category: "recovery", label: "Foam roll legs after run", checked: false, date: dateStr },
        { id: `r-ice-${dateStr}`, category: "recovery", label: "Ice any sore spots", checked: false, date: dateStr },
      );
    }
  }

  // Gear tasks — items that need to be ordered soon
  const urgentGear = plan.gearItems.filter(
    (g) => !g.purchased && g.neededByWeek <= currentWeekNum + 2
  ).slice(0, 2);
  urgentGear.forEach((g) => {
    tasks.push({
      id: `g-${g.id}-${dateStr}`,
      category: "gear",
      label: `Order: ${g.productName} (need by Week ${g.neededByWeek})`,
      checked: false,
      date: dateStr,
    });
  });

  // Nutrition tasks on long run days
  if (todayWorkout && (todayWorkout.workout.includes("Long") || todayWorkout.workout.includes("simulation"))) {
    const untestedProducts = plan.nutritionProducts.filter((n) => n.purchased && !n.tested);
    if (untestedProducts.length > 0) {
      tasks.push({
        id: `n-test-${dateStr}`,
        category: "nutrition",
        label: `Test ${untestedProducts[0].brand} ${untestedProducts[0].productName} on long run`,
        checked: false,
        date: dateStr,
      });
    }
    tasks.push({
      id: `n-fuel-${dateStr}`,
      category: "nutrition",
      label: "Practice fueling every 45 min during long run",
      checked: false,
      date: dateStr,
    });
  }

  return tasks;
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
