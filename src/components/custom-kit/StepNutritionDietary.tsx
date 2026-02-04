import FormMultiSelect from "@/components/forms/FormMultiSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import {
  CustomKitFormData,
  FormErrors,
  DIETARY_RESTRICTION_OPTIONS,
  FLAVOR_PREFERENCE_OPTIONS,
} from "@/types/custom-kit-request";

interface StepNutritionDietaryProps {
  formData: CustomKitFormData;
  errors: FormErrors;
  onChange: (
    field: keyof CustomKitFormData,
    value: string | string[]
  ) => void;
}

export default function StepNutritionDietary({
  formData,
  errors,
  onChange,
}: StepNutritionDietaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-2xl font-bold text-dark mb-2">
          Nutrition & Dietary
        </h2>
        <p className="text-gray text-sm">
          Help us understand your dietary needs and preferences.
        </p>
      </div>

      <FormMultiSelect
        label="Dietary Restrictions"
        name="dietaryRestrictions"
        value={formData.dietaryRestrictions}
        onChange={(value) => onChange("dietaryRestrictions", value)}
        options={DIETARY_RESTRICTION_OPTIONS}
        error={errors.dietaryRestrictions}
      />

      <FormMultiSelect
        label="Flavor Preferences"
        name="flavorPreferences"
        value={formData.flavorPreferences}
        onChange={(value) => onChange("flavorPreferences", value)}
        options={FLAVOR_PREFERENCE_OPTIONS}
        error={errors.flavorPreferences}
      />

      <FormTextarea
        label="Past Nutrition Issues"
        name="pastNutritionIssues"
        value={formData.pastNutritionIssues}
        onChange={(value) => onChange("pastNutritionIssues", value)}
        placeholder="Any GI issues, bonking experiences, or products that didn't work for you..."
        rows={3}
      />
    </div>
  );
}
