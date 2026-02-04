import FormSelect from "@/components/forms/FormSelect";
import FormInput from "@/components/forms/FormInput";
import FormDatePicker from "@/components/forms/FormDatePicker";
import {
  CustomKitFormData,
  FormErrors,
  TARGET_DISTANCE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
} from "@/types/custom-kit-request";

interface StepRaceDetailsProps {
  formData: CustomKitFormData;
  errors: FormErrors;
  onChange: (field: keyof CustomKitFormData, value: string) => void;
}

export default function StepRaceDetails({
  formData,
  errors,
  onChange,
}: StepRaceDetailsProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-2xl font-bold text-dark mb-2">
          Race Details
        </h2>
        <p className="text-gray text-sm">
          Tell us about your upcoming race so we can tailor your kit.
        </p>
      </div>

      <FormSelect
        label="Target Distance"
        name="targetDistance"
        value={formData.targetDistance}
        onChange={(value) => onChange("targetDistance", value)}
        options={TARGET_DISTANCE_OPTIONS}
        placeholder="Select distance"
        required
        error={errors.targetDistance}
      />

      <FormInput
        label="Race Name"
        name="raceName"
        value={formData.raceName}
        onChange={(value) => onChange("raceName", value)}
        placeholder="e.g., Western States 100"
      />

      <FormDatePicker
        label="Race Date"
        name="raceDate"
        value={formData.raceDate}
        onChange={(value) => onChange("raceDate", value)}
        min={today}
        required
        error={errors.raceDate}
      />

      <FormSelect
        label="Experience Level"
        name="experienceLevel"
        value={formData.experienceLevel}
        onChange={(value) => onChange("experienceLevel", value)}
        options={EXPERIENCE_LEVEL_OPTIONS}
        placeholder="Select experience level"
        required
        error={errors.experienceLevel}
      />
    </div>
  );
}
