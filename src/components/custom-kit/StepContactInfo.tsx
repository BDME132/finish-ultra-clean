import FormInput from "@/components/forms/FormInput";
import { CustomKitFormData, FormErrors } from "@/types/custom-kit-request";

interface StepContactInfoProps {
  formData: CustomKitFormData;
  errors: FormErrors;
  onChange: (field: keyof CustomKitFormData, value: string) => void;
}

export default function StepContactInfo({
  formData,
  errors,
  onChange,
}: StepContactInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-2xl font-bold text-dark mb-2">
          Contact Information
        </h2>
        <p className="text-gray text-sm">
          Let us know how to reach you about your custom kit.
        </p>
      </div>

      <FormInput
        label="Name"
        name="name"
        value={formData.name}
        onChange={(value) => onChange("name", value)}
        placeholder="Your full name"
        required
        error={errors.name}
      />

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(value) => onChange("email", value)}
        placeholder="you@example.com"
        required
        error={errors.email}
      />

      <FormInput
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(value) => onChange("phone", value)}
        placeholder="(555) 123-4567"
        error={errors.phone}
      />
    </div>
  );
}
