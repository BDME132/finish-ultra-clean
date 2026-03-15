"use client";

export type PlanTab = "schedule" | "progression" | "zones" | "pacing" | "resources";

interface PlanTabsProps {
  activeTab: PlanTab;
  onTabChange: (tab: PlanTab) => void;
}

const TABS: { id: PlanTab; label: string }[] = [
  { id: "schedule", label: "Schedule" },
  { id: "progression", label: "Progression" },
  { id: "zones", label: "Zones" },
  { id: "pacing", label: "Pacing" },
  { id: "resources", label: "Resources" },
];

export default function PlanTabs({ activeTab, onTabChange }: PlanTabsProps) {
  return (
    <div className="flex overflow-x-auto gap-2 pb-2 mb-8">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
            activeTab === tab.id
              ? "bg-primary text-white"
              : "bg-white border border-gray-200 text-dark hover:border-primary/40"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
