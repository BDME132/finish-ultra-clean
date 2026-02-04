export interface CustomKitFormData {
  // Step 1: Contact Info
  name: string;
  email: string;
  phone: string;

  // Step 2: Race Details
  targetDistance: string;
  raceName: string;
  raceDate: string;
  experienceLevel: string;

  // Step 3: Nutrition & Dietary
  dietaryRestrictions: string[];
  flavorPreferences: string[];
  pastNutritionIssues: string;

  // Step 4: Budget & Timeline
  budgetRange: string;
  whenNeededBy: string;
  additionalNotes: string;
}

export interface FormErrors {
  [key: string]: string;
}

export const TARGET_DISTANCE_OPTIONS = [
  { value: "50K", label: "50K" },
  { value: "100K", label: "100K" },
  { value: "100M", label: "100 Mile" },
  { value: "other", label: "Other" },
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: "first", label: "First ultra" },
  { value: "few", label: "Few ultras" },
  { value: "experienced", label: "Experienced" },
];

export const DIETARY_RESTRICTION_OPTIONS = [
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "dairy-free", label: "Dairy-free" },
  { value: "none", label: "None" },
];

export const FLAVOR_PREFERENCE_OPTIONS = [
  { value: "sweet", label: "Sweet" },
  { value: "salty", label: "Salty" },
  { value: "neutral", label: "Neutral" },
  { value: "fruity", label: "Fruity" },
];

export const BUDGET_RANGE_OPTIONS = [
  { value: "under-50", label: "Under $50" },
  { value: "50-100", label: "$50-$100" },
  { value: "100-150", label: "$100-$150" },
  { value: "150-plus", label: "$150+" },
];

export const initialFormData: CustomKitFormData = {
  name: "",
  email: "",
  phone: "",
  targetDistance: "",
  raceName: "",
  raceDate: "",
  experienceLevel: "",
  dietaryRestrictions: [],
  flavorPreferences: [],
  pastNutritionIssues: "",
  budgetRange: "",
  whenNeededBy: "",
  additionalNotes: "",
};
