import Link from "next/link";
import { TrainingPlan } from "@/types/content";

interface TrainingPlanCardProps {
  plan: TrainingPlan;
  variant?: "default" | "featured";
}

export default function TrainingPlanCard({ plan, variant = "default" }: TrainingPlanCardProps) {
  if (variant === "featured") {
    return (
      <div className="bg-gradient-to-r from-primary to-accent p-[2px] rounded-xl">
        <Link
          href={`/training/${plan.slug}`}
          className="block bg-white rounded-[10px] overflow-hidden hover:shadow-lg transition-all group"
        >
          <div className="aspect-[21/9] bg-gradient-to-r from-primary/10 to-accent/10 flex flex-col items-center justify-center px-6">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark text-center">
              Build Your Custom Training Plan
            </h2>
            <p className="text-sm text-gray mt-2">4 distances. 3 levels. Your plan.</p>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-3 py-1 rounded-full">
                Interactive Tool
              </span>
            </div>
            <p className="text-gray text-sm leading-relaxed mb-5">
              {plan.description}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/20 px-4 py-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
              Start Building
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={`/training/${plan.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all"
    >
      <div className="aspect-[16/9] bg-light flex items-center justify-center">
        <span className="text-gray text-sm">{plan.title}</span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-white bg-primary px-2.5 py-1 rounded-full">
            {plan.distance}
          </span>
          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full capitalize">
            {plan.level}
          </span>
          <span className="text-xs text-gray ml-auto">
            {plan.weeks} {plan.weeks === 1 ? "week" : "weeks"}
          </span>
        </div>
        <h3 className="font-headline text-lg font-bold text-dark mb-1">
          {plan.title}
        </h3>
        <p className="text-sm text-gray mb-3">{plan.subtitle}</p>
        <p className="text-gray text-sm leading-relaxed">
          {plan.description}
        </p>
      </div>
    </Link>
  );
}
