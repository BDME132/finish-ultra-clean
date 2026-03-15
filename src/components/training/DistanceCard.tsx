"use client";

interface DistanceCardProps {
  distance: string;
  tagline: string;
  typicalRunner: string;
  durationRange: string;
  week1Miles: string;
  week1KeyWorkout: string;
  popular?: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function DistanceCard({
  distance,
  tagline,
  typicalRunner,
  durationRange,
  week1Miles,
  week1KeyWorkout,
  popular,
  selected,
  onClick,
}: DistanceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative text-left w-full rounded-xl p-6 transition-all group ${
        selected
          ? "border-2 border-primary bg-primary/5 shadow-md"
          : "border border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm"
      }`}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-2.5 left-4">
          <span className="text-[10px] font-bold text-white bg-accent px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Most popular
          </span>
        </div>
      )}

      {/* Checkmark */}
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className="font-headline text-2xl font-bold text-dark mb-1">{distance}</div>
      <p className="text-sm text-gray mb-2">{tagline}</p>
      <p className="text-xs text-primary font-medium mb-3">{typicalRunner}</p>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          {durationRange}
        </span>
        <span className="text-xs text-gray">3 plan tiers</span>
      </div>

      {/* Week 1 preview */}
      <div className={`mt-2 pt-3 border-t border-gray-100 transition-opacity ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <div className="text-[10px] font-semibold text-gray uppercase tracking-wider mb-1">Week 1 preview</div>
        <div className="flex justify-between text-xs text-dark">
          <span>{week1Miles} total</span>
          <span className="text-gray">{week1KeyWorkout}</span>
        </div>
      </div>
    </button>
  );
}
