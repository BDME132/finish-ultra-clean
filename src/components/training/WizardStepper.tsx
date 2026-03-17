"use client";

interface WizardStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { number: 1, label: "Choose Distance" },
  { number: 2, label: "Your Profile" },
  { number: 3, label: "Your Plan" },
];

export default function WizardStepper({ currentStep, onStepClick }: WizardStepperProps) {
  return (
    <div className="flex items-center justify-center py-8 px-4">
      {STEPS.map((step, i) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;
        const isFuture = step.number > currentStep;

        return (
          <div key={step.number} className="flex items-center">
            {/* Connecting line before (except first) */}
            {i > 0 && (
              <div
                className={`w-12 sm:w-20 h-0.5 ${
                  step.number <= currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}

            {/* Step node */}
            <button
              onClick={() => !isFuture && onStepClick(step.number)}
              disabled={isFuture}
              className={`flex flex-col items-center gap-1.5 ${
                isFuture ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-headline font-bold text-sm transition-all ${
                  isActive
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : isCompleted
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`hidden sm:block text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-primary" : isCompleted ? "text-dark" : "text-gray"
                }`}
              >
                {step.label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
