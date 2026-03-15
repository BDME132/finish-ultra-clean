"use client";

interface DistanceCardProps {
  distance: string;
  tagline: string;
  durationRange: string;
  selected: boolean;
  onClick: () => void;
}

export default function DistanceCard({
  distance,
  tagline,
  durationRange,
  selected,
  onClick,
}: DistanceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative text-left w-full rounded-xl p-6 transition-all ${
        selected
          ? "border-2 border-primary bg-primary/5 shadow-md"
          : "border border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm"
      }`}
    >
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <div className="font-headline text-2xl font-bold text-dark mb-1">{distance}</div>
      <p className="text-sm text-gray mb-3">{tagline}</p>
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          {durationRange}
        </span>
        <span className="text-xs text-gray">3 plan tiers</span>
      </div>
    </button>
  );
}
