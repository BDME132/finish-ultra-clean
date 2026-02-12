import { TrainingPlan } from "@/types/content";

export const trainingPlans: TrainingPlan[] = [
  {
    id: "first-50k",
    title: "Your First 50K",
    subtitle: "From marathon runner to ultramarathoner in 16 weeks",
    slug: "first-50k",
    description:
      "Our flagship free plan. Designed for runners who can comfortably run a half marathon and want to take the leap to 50K. Builds mileage gradually with back-to-back long runs, nutrition practice, and gear testing built in.",
    weeks: 16,
    level: "beginner",
    distance: "50K",
    image: "/images/training/first-50k.jpg",
  },
  {
    id: "base-building",
    title: "Base Building for Ultra",
    subtitle: "Build the aerobic engine you need before training starts",
    slug: "base-building",
    description:
      "Not ready for a 50K plan yet? This 12-week base building program gets your body ready for ultra training. Focus on easy miles, consistency, and building the habit of time on feet.",
    weeks: 12,
    level: "beginner",
    distance: "Any",
    image: "/images/training/base-building.jpg",
  },
  {
    id: "race-week",
    title: "Race Week Protocol",
    subtitle: "The final 7 days before your ultra",
    slug: "race-week",
    description:
      "A day-by-day guide covering taper, nutrition loading, gear prep, sleep strategy, and mental preparation. Everything you need to arrive at the start line ready to go.",
    weeks: 1,
    level: "beginner",
    distance: "Any",
    image: "/images/training/race-week.jpg",
  },
];

export function getPlanBySlug(slug: string) {
  return trainingPlans.find((p) => p.slug === slug);
}
