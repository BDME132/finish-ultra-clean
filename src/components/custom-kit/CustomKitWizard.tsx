"use client";

import { useState } from "react";
import WizardProgress from "./WizardProgress";
import StepContactInfo from "./StepContactInfo";
import StepRaceDetails from "./StepRaceDetails";
import StepNutritionDietary from "./StepNutritionDietary";
import StepBudgetTimeline from "./StepBudgetTimeline";
import {
  CustomKitFormData,
  FormErrors,
  initialFormData,
} from "@/types/custom-kit-request";

const TOTAL_STEPS = 4;

export default function CustomKitWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomKitFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    field: keyof CustomKitFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        break;
      case 2:
        if (!formData.targetDistance)
          newErrors.targetDistance = "Please select a distance";
        if (!formData.raceDate) newErrors.raceDate = "Race date is required";
        if (!formData.experienceLevel)
          newErrors.experienceLevel = "Please select your experience level";
        break;
      case 3:
        // No required fields in step 3
        break;
      case 4:
        if (!formData.budgetRange)
          newErrors.budgetRange = "Please select a budget range";
        if (!formData.whenNeededBy)
          newErrors.whenNeededBy = "Please select when you need the kit";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/custom-kit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }

      setIsSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-primary"
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
        </div>
        <h2 className="font-headline text-2xl font-bold text-dark mb-2">
          Request Submitted!
        </h2>
        <p className="text-gray mb-6">
          Thanks for your custom kit request! We&apos;ll review your information
          and get back to you within 24-48 hours.
        </p>
        <a
          href="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-light transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div>
      <WizardProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
        {currentStep === 1 && (
          <StepContactInfo
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        )}
        {currentStep === 2 && (
          <StepRaceDetails
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        )}
        {currentStep === 3 && (
          <StepNutritionDietary
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        )}
        {currentStep === 4 && (
          <StepBudgetTimeline
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        )}

        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {submitError}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray hover:text-dark"
            }`}
          >
            Back
          </button>

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-light transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
