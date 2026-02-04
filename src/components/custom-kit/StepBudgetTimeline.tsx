import FormSelect from "@/components/forms/FormSelect";
import FormDatePicker from "@/components/forms/FormDatePicker";
import FormTextarea from "@/components/forms/FormTextarea";
import {
  CustomKitFormData,
  FormErrors,
  BUDGET_RANGE_OPTIONS,
} from "@/types/custom-kit-request";

interface StepBudgetTimelineProps {
  formData: CustomKitFormData;
  errors: FormErrors;
  onChange: (field: keyof CustomKitFormData, value: string) => void;
}

export default function StepBudgetTimeline({
  formData,
  errors,
  onChange,
}: StepBudgetTimelineProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-2xl font-bold text-dark mb-2">
          Budget & Timeline
        </h2>
        <p className="text-gray text-sm">
          Let us know your budget and when you need your kit.
        </p>
      </div>

      <FormSelect
        label="Budget Range"
        name="budgetRange"
        value={formData.budgetRange}
        onChange={(value) => onChange("budgetRange", value)}
        options={BUDGET_RANGE_OPTIONS}
        placeholder="Select budget range"
        required
        error={errors.budgetRange}
      />

      <FormDatePicker
        label="When do you need it by?"
        name="whenNeededBy"
        value={formData.whenNeededBy}
        onChange={(value) => onChange("whenNeededBy", value)}
        min={today}
        required
        error={errors.whenNeededBy}
      />

      <FormTextarea
        label="Additional Notes"
        name="additionalNotes"
        value={formData.additionalNotes}
        onChange={(value) => onChange("additionalNotes", value)}
        placeholder="Anything else we should know about your kit needs..."
        rows={3}
      />
    </div>
  );
}
