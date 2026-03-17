// ─── Dynamic Plan Generation ──────────────────────────────────────────────────
// Extracted from PlansClient for reuse and cleaner architecture

type Distance = "50K" | "50M" | "100K" | "100M";
type Level = "foundation" | "beginner" | "intermediate" | "advanced" | "competitive";

export interface PlanDay {
  day: string;
  workout: string;
  distance: string;
  effort: string;
  notes: string;
}

export type TimelineStatus = "excellent" | "good" | "tight" | "insufficient" | "past";

export interface TimelineAssessment {
  status: TimelineStatus;
  color: string;
  icon: string;
  title: string;
  message: string;
  requirements?: string[];
  phases: { name: string; weeks: number }[];
}

export interface DynamicWeek {
  weekNumber: number;
  weeksToRace: number;
  startDate: string;
  endDate: string;
  phase: string;
  totalMiles: number;
  longRun: number;
  b2b: number;
  isRecovery: boolean;
  days: PlanDay[];
  goals: string[];
}

export interface Milestone {
  week: number;
  date: string;
  label: string;
  icon: string;
}

export const DISTANCE_MILES: Record<Distance, number> = { "50K": 31, "50M": 50, "100K": 62, "100M": 100 };
const MIN_WEEKS: Record<Distance, number> = { "50K": 8, "50M": 12, "100K": 16, "100M": 20 };
const REC_WEEKS: Record<Distance, number> = { "50K": 16, "50M": 20, "100K": 24, "100M": 28 };
const PEAK_LONG_RUN: Record<Distance, number> = { "50K": 22, "50M": 30, "100K": 35, "100M": 40 };

export function getTimelineAssessment(weeks: number, distance: Distance): TimelineAssessment {
  const min = MIN_WEEKS[distance];
  const rec = REC_WEEKS[distance];

  if (weeks <= 0) {
    return {
      status: "past", color: "bg-red-50 border-red-200 text-red-800", icon: "🛑",
      title: "Race Date Has Passed",
      message: "This race date is in the past. Please select a future date.",
      phases: [],
    };
  }

  if (weeks < min) {
    const taperW = Math.max(1, Math.round(weeks * 0.15));
    const buildW = Math.max(1, weeks - taperW);
    return {
      status: "insufficient", color: "bg-red-50 border-red-200 text-red-800", icon: "🛑",
      title: "Insufficient Preparation Time",
      message: `${weeks} weeks is not enough to safely prepare for a ${distance}. You need a minimum of ${min} weeks with a strong base.`,
      requirements: [
        `Currently running ${distance === "50K" ? "30" : distance === "50M" ? "40" : "50"}+ miles/week`,
        "Recent long run of 15+ miles",
        "No current injuries",
      ],
      phases: [
        { name: "Quick Build", weeks: buildW },
        { name: "Taper", weeks: taperW },
      ],
    };
  }

  if (weeks < rec) {
    const baseW = Math.round(weeks * 0.2);
    const buildW = Math.round(weeks * 0.45);
    const peakW = Math.round(weeks * 0.15);
    const taperW = weeks - baseW - buildW - peakW;
    return {
      status: "tight", color: "bg-yellow-50 border-yellow-200 text-yellow-800", icon: "⚠️",
      title: "Compressed Timeline — Proceed with Caution",
      message: `${weeks} weeks is less than the recommended ${rec} weeks for a ${distance}, but achievable with a strong existing base.`,
      requirements: [
        `Currently running ${distance === "50K" ? "25" : distance === "50M" ? "35" : "45"}+ miles/week`,
        `Recent long run of ${distance === "50K" ? "10" : "15"}+ miles`,
        "No current injuries",
        "Previous race experience helpful",
      ],
      phases: [
        { name: "Base", weeks: baseW },
        { name: "Build", weeks: buildW },
        { name: "Peak", weeks: peakW },
        { name: "Taper", weeks: taperW },
      ],
    };
  }

  if (weeks <= rec + 10) {
    const baseW = Math.round(weeks * 0.25);
    const buildW = Math.round(weeks * 0.40);
    const peakW = Math.round(weeks * 0.15);
    const taperW = weeks - baseW - buildW - peakW;
    return {
      status: "good", color: "bg-green-50 border-green-200 text-green-800", icon: "✅",
      title: "Ideal Training Timeline",
      message: `${weeks} weeks gives you proper time to build safely for your ${distance}. Your plan includes gradual progression, recovery weeks, and adequate taper.`,
      phases: [
        { name: "Base", weeks: baseW },
        { name: "Build", weeks: buildW },
        { name: "Peak", weeks: peakW },
        { name: "Taper", weeks: taperW },
      ],
    };
  }

  const baseW = Math.round(weeks * 0.25);
  const build1W = Math.round(weeks * 0.25);
  const build2W = Math.round(weeks * 0.25);
  const peakW = Math.round(weeks * 0.10);
  const taperW = weeks - baseW - build1W - build2W - peakW;
  return {
    status: "excellent", color: "bg-blue-50 border-blue-200 text-blue-800", icon: "🌟",
    title: "Excellent Preparation Time",
    message: `${weeks} weeks gives you plenty of time for multiple training cycles, recovery, and experimentation. Consider adding a tune-up race at the halfway point.`,
    phases: [
      { name: "Foundation", weeks: baseW },
      { name: "Build Cycle 1", weeks: build1W },
      { name: "Build Cycle 2", weeks: build2W },
      { name: "Peak", weeks: peakW },
      { name: "Taper", weeks: taperW },
    ],
  };
}

function getPhaseForWeek(weekNum: number, assessment: TimelineAssessment): string {
  let accumulated = 0;
  for (const phase of assessment.phases) {
    accumulated += phase.weeks;
    if (weekNum <= accumulated) return phase.name;
  }
  return assessment.phases[assessment.phases.length - 1]?.name ?? "Build";
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function generateWeekDays(
  remainingMiles: number,
  longRun: number,
  b2b: number,
  phase: string,
  isRecovery: boolean,
  level: Level,
  weekNum: number,
): PlanDay[] {
  const isTaper = phase === "Taper";
  const isBuild = phase.includes("Build") || phase === "Peak";
  const hasQuality = !isRecovery && !isTaper && isBuild && weekNum > 2;
  const easyPerRun = Math.max(3, Math.round(remainingMiles / (level === "beginner" ? 3 : 4)));

  const days: PlanDay[] = [
    { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: isRecovery ? "Recovery week — rest fully" : "Sleep and fuel" },
  ];

  if (hasQuality && level !== "beginner") {
    const qualityMiles = Math.min(easyPerRun + 2, Math.round(remainingMiles * 0.35));
    const tempoMiles = Math.round(qualityMiles * 0.5);
    days.push({
      day: "Tue",
      workout: weekNum % 2 === 0 ? "Tempo run" : "Hill repeats",
      distance: `${qualityMiles} mi${weekNum % 2 === 0 ? ` (${tempoMiles} at tempo)` : ""}`,
      effort: "Zone 3–4",
      notes: weekNum % 2 === 0 ? `Warm up, ${tempoMiles} mi at threshold, cool down` : `6×200m hills + ${qualityMiles - 2} mi easy`,
    });
    days.push({ day: "Wed", workout: "Easy run", distance: `${easyPerRun} mi`, effort: "Zone 2", notes: "" });
  } else {
    days.push({ day: "Tue", workout: "Easy run", distance: `${easyPerRun} mi`, effort: "Zone 2", notes: isTaper ? "Short and easy — trust the taper" : "" });
    days.push({ day: "Wed", workout: isRecovery ? "Easy run" : "Easy run + strength", distance: `${easyPerRun} mi`, effort: "Zone 2", notes: isRecovery ? "" : "20-min core/hip work after" });
  }

  days.push({ day: "Thu", workout: "Easy run", distance: `${Math.max(3, easyPerRun - 1)} mi`, effort: "Zone 2", notes: "" });
  days.push({ day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: isTaper ? "Rest — you've earned this" : "" });
  days.push({
    day: "Sat",
    workout: phase === "Peak" ? "Race simulation" : "Long run",
    distance: `${longRun} mi`,
    effort: "Zone 2",
    notes: phase === "Peak" ? "Full vest, race nutrition, race kit" : longRun >= 15 ? "Practice nutrition every 45 min" : "Time on feet — no pace goals",
  });

  if (b2b > 0) {
    days.push({ day: "Sun", workout: "Back-to-back", distance: `${b2b} mi`, effort: "Zone 1–2", notes: "Run on tired legs — this is the point" });
  } else {
    days.push({ day: "Sun", workout: isTaper ? "Rest" : "Recovery run or rest", distance: isTaper ? "—" : `${Math.max(3, Math.round(easyPerRun * 0.6))} mi`, effort: isTaper ? "—" : "Zone 1", notes: "" });
  }

  return days;
}

function generateWeekGoals(w: number, total: number, phase: string, isRecovery: boolean, distance: Distance, longRun: number): string[] {
  const goals: string[] = [];
  if (isRecovery) {
    goals.push("Recovery week — keep everything easy");
    goals.push("Address any niggles or soreness");
    goals.push("Focus on sleep and nutrition");
    return goals;
  }
  if (phase === "Taper") {
    goals.push("Trust the training — fitness is banked");
    if (total - w <= 1) { goals.push("Final gear check"); goals.push("Carb load today and tomorrow"); }
    else { goals.push("Maintain sharpness with easy running"); goals.push("Perfect sleep and nutrition"); }
    return goals;
  }
  if (phase.includes("Base") || phase === "Foundation") {
    goals.push("All runs at conversational pace");
    if (w <= 3) goals.push("Test race shoes on long runs");
    goals.push("Build aerobic base consistently");
  }
  if (phase.includes("Build")) {
    if (longRun >= 15) goals.push("Practice race nutrition on long run");
    if (longRun >= 20) goals.push("Run long run in full race vest");
    goals.push("Increase volume gradually — listen to your body");
  }
  if (phase === "Peak") {
    goals.push("PEAK WEEK — highest mileage of the plan");
    goals.push("Full race simulation (gear, nutrition, pacing)");
    if (DISTANCE_MILES[distance] >= 62) goals.push("Include night section if race has one");
  }
  if (total - w === 8) goals.push("Break in race shoes by this week");
  if (total - w === 4) goals.push("Finalize race nutrition — no changes after this");
  if (total - w === 2) goals.push("No new gear from this point forward");
  return goals;
}

export function generateDynamicPlan(
  totalWeeks: number,
  distance: Distance,
  level: Level,
  currentMileage: number,
  raceDateStr: string,
  assessment: TimelineAssessment,
): DynamicWeek[] {
  const raceDate = new Date(raceDateStr);
  const distMiles = DISTANCE_MILES[distance];
  const peakLong = PEAK_LONG_RUN[distance];

  const levelMultMap: Record<Level, number> = { foundation: 0.85, beginner: 1.0, intermediate: 1.2, advanced: 1.4, competitive: 1.6 };
  const levelMult = levelMultMap[level];

  const basePeakMult = totalWeeks < 12 ? 1.2 : totalWeeks < 20 ? 1.5 : 2.0;
  const peakWeeklyMiles = Math.min(Math.round(distMiles * basePeakMult * (levelMult * 0.8)), 120);

  const startMilesMap: Record<Level, number> = { foundation: 15, beginner: 25, intermediate: 40, advanced: 55, competitive: 65 };
  const startMiles = currentMileage > 0 ? Math.max(currentMileage, 20) : startMilesMap[level];

  const weeks: DynamicWeek[] = [];

  for (let w = 1; w <= totalWeeks; w++) {
    const weeksToRace = totalWeeks - w + 1;
    const phase = getPhaseForWeek(w, assessment);

    const weekStart = new Date(raceDate);
    weekStart.setDate(weekStart.getDate() - weeksToRace * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const isRecovery = (phase === "Build" || phase === "Build Cycle 1" || phase === "Build Cycle 2") && w % 4 === 0;

    const progressFraction = w / totalWeeks;
    let totalMiles: number;

    if (phase === "Taper") {
      const taperWeek = w - (totalWeeks - assessment.phases[assessment.phases.length - 1].weeks);
      const taperTotal = assessment.phases[assessment.phases.length - 1].weeks;
      const taperFraction = taperWeek / taperTotal;
      totalMiles = Math.round(peakWeeklyMiles * (0.7 - taperFraction * 0.45));
    } else if (phase === "Peak") {
      totalMiles = peakWeeklyMiles;
    } else if (isRecovery) {
      const buildMiles = startMiles + (peakWeeklyMiles - startMiles) * progressFraction;
      totalMiles = Math.round(buildMiles * 0.7);
    } else {
      totalMiles = Math.round(startMiles + (peakWeeklyMiles - startMiles) * Math.min(progressFraction * 1.1, 1));
    }

    totalMiles = Math.max(totalMiles, 15);

    let longRun = Math.round(totalMiles * 0.35);
    const longRunCap = phase === "Taper" ? Math.round(peakLong * 0.6) : peakLong;
    longRun = Math.min(longRun, longRunCap);
    if (isRecovery) longRun = Math.round(longRun * 0.7);
    longRun = Math.max(longRun, 8);

    const hasB2B = distMiles >= 50 && !phase.includes("Foundation") && phase !== "Taper" && !isRecovery;
    const b2b = hasB2B ? Math.round(longRun * 0.45) : 0;

    const remainingMiles = totalMiles - longRun - b2b;
    const days = generateWeekDays(remainingMiles, longRun, b2b, phase, isRecovery, level, w);
    const goals = generateWeekGoals(w, totalWeeks, phase, isRecovery, distance, longRun);

    weeks.push({
      weekNumber: w,
      weeksToRace,
      startDate: formatDate(weekStart),
      endDate: formatDate(weekEnd),
      phase,
      totalMiles,
      longRun,
      b2b,
      isRecovery,
      days,
      goals,
    });
  }

  return weeks;
}

export function calculateMilestones(totalWeeks: number, raceDateStr: string, distance: Distance, assessment: TimelineAssessment): Milestone[] {
  const raceDate = new Date(raceDateStr);
  const milestones: Milestone[] = [];

  const dateForWeek = (weeksOut: number) => {
    const d = new Date(raceDate);
    d.setDate(d.getDate() - weeksOut * 7);
    return formatDate(d);
  };

  let accumulated = 0;
  for (const phase of assessment.phases) {
    milestones.push({
      week: accumulated + 1,
      date: dateForWeek(totalWeeks - accumulated),
      label: `${phase.name} phase begins`,
      icon: phase.name === "Taper" ? "📉" : phase.name === "Peak" ? "🔥" : "📈",
    });
    accumulated += phase.weeks;
  }

  const firstBigLong = Math.ceil(totalWeeks * 0.35);
  if (firstBigLong > 0 && firstBigLong < totalWeeks) {
    milestones.push({ week: firstBigLong, date: dateForWeek(totalWeeks - firstBigLong), label: "First 20+ mile long run", icon: "🏃" });
  }

  if (totalWeeks > 8) {
    milestones.push({ week: totalWeeks - 8, date: dateForWeek(8), label: "Break in race shoes by now", icon: "👟" });
  }
  if (totalWeeks > 6) {
    milestones.push({ week: totalWeeks - 6, date: dateForWeek(6), label: "Finalize vest fit under load", icon: "🎒" });
  }
  if (totalWeeks > 4) {
    milestones.push({ week: totalWeeks - 4, date: dateForWeek(4), label: "Lock in race nutrition", icon: "⚡" });
  }
  milestones.push({ week: totalWeeks - 2, date: dateForWeek(2), label: "No new gear after this", icon: "🚫" });
  milestones.push({ week: totalWeeks, date: formatDate(raceDate), label: "RACE DAY!", icon: "🏁" });

  milestones.sort((a, b) => a.week - b.week);
  return milestones;
}

// ─── Nutrition Fueling Calculator ─────────────────────────────────────────────

export interface FuelingStrategy {
  hourlyCalories: number;
  hourlyCarbs: number;
  hourlySodium: number;
  hourlyFluids: number;
  totalCalories: number;
  totalCarbs: number;
  totalSodium: number;
  totalFluids: number;
  estimatedHours: number;
  hourlySchedule: { hour: number; miles: string; calories: number; fluids: string; notes: string }[];
  dropBags: { location: string; items: string[] }[];
}

export function calculateFuelingStrategy(
  distance: Distance,
  weightLbs: number,
  sweatRate: "light" | "moderate" | "heavy",
  stomachSensitivity: "iron" | "average" | "sensitive",
): FuelingStrategy {
  const distMiles = DISTANCE_MILES[distance];

  // Estimated finish time based on distance (conservative pace)
  const paceMin = distance === "50K" ? 12 : distance === "50M" ? 13.5 : distance === "100K" ? 15 : 16;
  const estimatedHours = Math.round((distMiles * paceMin) / 60 * 10) / 10;

  // Calorie targets: 200-300 cal/hr based on weight and sensitivity
  const baseCal = Math.round(weightLbs * 1.2);
  const hourlyCalories = stomachSensitivity === "sensitive" ? Math.round(baseCal * 0.8) : stomachSensitivity === "iron" ? Math.round(baseCal * 1.1) : baseCal;

  // Carbs: ~1g per kg body weight per hour
  const hourlyCarbs = Math.round((weightLbs / 2.2) * 0.9);

  // Sodium: 400-800mg/hr based on sweat rate
  const hourlySodium = sweatRate === "light" ? 400 : sweatRate === "heavy" ? 750 : 550;

  // Fluids: 16-32oz/hr based on sweat rate
  const hourlyFluids = sweatRate === "light" ? 18 : sweatRate === "heavy" ? 28 : 22;

  const totalCalories = Math.round(hourlyCalories * estimatedHours);
  const totalCarbs = Math.round(hourlyCarbs * estimatedHours);
  const totalSodium = Math.round(hourlySodium * estimatedHours);
  const totalFluids = Math.round(hourlyFluids * estimatedHours);

  // Build hourly schedule
  const hourlySchedule = [];
  const milesPerHour = distMiles / estimatedHours;
  for (let h = 1; h <= Math.ceil(estimatedHours); h++) {
    const startMile = Math.round((h - 1) * milesPerHour);
    const endMile = Math.min(Math.round(h * milesPerHour), distMiles);
    hourlySchedule.push({
      hour: h,
      miles: `${startMile}-${endMile}`,
      calories: hourlyCalories,
      fluids: `${hourlyFluids}oz`,
      notes: h === 1 ? "Gel + water at 0:15 and 0:45"
        : h <= 3 ? "Gel every 30-45 min + sip drink mix"
        : h <= Math.ceil(estimatedHours * 0.6) ? "Maintain fueling — don't skip"
        : h <= Math.ceil(estimatedHours * 0.8) ? "Switch to easier foods if stomach struggles"
        : "Whatever you can tolerate — caffeine boost",
    });
  }

  // Drop bag suggestions
  const dropBags: { location: string; items: string[] }[] = [];
  if (distMiles >= 50) {
    const bagLocations = distMiles >= 100
      ? [Math.round(distMiles * 0.2), Math.round(distMiles * 0.4), Math.round(distMiles * 0.6), Math.round(distMiles * 0.8)]
      : [Math.round(distMiles * 0.3), Math.round(distMiles * 0.6)];
    bagLocations.forEach((mile, i) => {
      const isLate = i >= bagLocations.length - 1;
      dropBags.push({
        location: `Mile ${mile}`,
        items: [
          `${Math.round(estimatedHours / bagLocations.length * 2)}x gels`,
          "Drink mix refill packets (2)",
          "Electrolyte caps (12)",
          ...(isLate ? ["Caffeine pill", "Easy-to-eat snacks", "Fresh socks"] : []),
          ...(distMiles >= 100 ? ["Spare headlamp batteries", "Fresh shirt"] : []),
        ],
      });
    });
  }

  return {
    hourlyCalories, hourlyCarbs, hourlySodium, hourlyFluids,
    totalCalories, totalCarbs, totalSodium, totalFluids,
    estimatedHours, hourlySchedule, dropBags,
  };
}
