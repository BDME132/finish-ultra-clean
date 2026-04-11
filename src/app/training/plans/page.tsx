import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PlansClient from "./PlansClient";
import { getPlanBySlug } from "@/lib/content/training-plans";
import { pageMetadata } from "@/lib/seo-metadata";
import { webApplicationJsonLd, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Interactive Ultra Training Plan Builder | FinishUltra",
    description:
      "Pick your distance and timeline for a tailored ultra plan outline — 50K through 100 miles, with schedules, zones, and calculators.",
    path: "/training/plans",
  }),
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
