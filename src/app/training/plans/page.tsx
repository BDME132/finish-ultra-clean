import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PlansClient from "./PlansClient";
import { getPlanBySlug } from "@/lib/content/training-plans";
import { webApplicationJsonLd, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Ultra Marathon Training Plans | FinishUltra",
  description:
    "Comprehensive ultra marathon training plans for every distance and experience level — 50K through 100 miles. Interactive distance selector, week-by-week schedules, calculators, and more.",
  alternates: { canonical: "/training/plans" },
};

const plansBuilder = getPlanBySlug("plans");

const trainingPlansWebAppJsonLd = webApplicationJsonLd({
  name: plansBuilder?.title ?? "Ultra Marathon Training Plans",
  description:
    plansBuilder?.description ??
    "Interactive ultra marathon training plan builder with distance selector, schedules, and calculators.",
  url: `${SITE_URL}/training/plans`,
  applicationCategory: "HealthApplication",
});

export default function TrainingPlansPage() {
  return (
    <>
      <Header />
      <JsonLd data={trainingPlansWebAppJsonLd} />
      <PlansClient />
      <Footer />
    </>
  );
}
