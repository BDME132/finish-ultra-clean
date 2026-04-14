import { getKitBySlug } from "@/lib/content/kits";
import type { Answers } from "@/types/gear";

const PRESET_ANSWERS: Record<string, Answers> = {
  "first-50k": {
    distance: "50k",
    terrain: "forest",
    temp: "moderate",
    night: "no",
    experience: "first",
    budget: "standard",
    sweat: "moderate",
    stomach: "average",
    feetWidth: "standard",
    priority: "feet",
  },
  "budget-starter": {
    distance: "50k",
    terrain: "road",
    temp: "moderate",
    night: "no",
    experience: "beginner",
    budget: "budget",
    sweat: "moderate",
    stomach: "average",
    feetWidth: "standard",
    priority: "minimal",
  },
  "mountain-trail": {
    distance: "50m",
    terrain: "mountain",
    temp: "cold",
    night: "yes",
    experience: "intermediate",
    budget: "premium",
    sweat: "heavy",
    stomach: "average",
    feetWidth: "standard",
    priority: "weather",
  },
};

export type GearKitPreset = {
  slug: string;
  name: string;
  description: string;
  answers: Answers;
};

export function getKitPreset(slug: string): GearKitPreset | null {
  const kit = getKitBySlug(slug);
  const answers = PRESET_ANSWERS[slug];

  if (!kit || !answers) return null;

  return {
    slug,
    name: kit.name,
    description: kit.description,
    answers,
  };
}

export function getAllKitPresets(): GearKitPreset[] {
  return Object.keys(PRESET_ANSWERS)
    .map((slug) => getKitPreset(slug))
    .filter((preset): preset is GearKitPreset => preset !== null);
}
