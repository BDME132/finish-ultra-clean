import Link from "next/link";
import { TrainingPlan } from "@/types/content";

interface TrainingPlanCardProps {
  plan: TrainingPlan;
}

export default function TrainingPlanCard({ plan }: TrainingPlanCardProps) {
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
