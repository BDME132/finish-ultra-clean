interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = ["Contact", "Race", "Nutrition", "Budget"];

export default function WizardProgress({
  currentStep,
  totalSteps,
}: WizardProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : isCompleted
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-200 text-gray"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`w-full h-1 mx-2 rounded ${
                    isCompleted ? "bg-primary/20" : "bg-gray-200"
                  }`}
                  style={{ width: "60px" }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between">
        {STEP_LABELS.map((label, i) => (
          <span
            key={i}
            className={`text-xs ${
              i + 1 === currentStep ? "text-primary font-medium" : "text-gray"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
