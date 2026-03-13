import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlansClient from "./PlansClient";

export const metadata: Metadata = {
  title: "Ultra Marathon Training Plans | FinishUltra",
  description:
    "Comprehensive ultra marathon training plans for every distance and experience level — 50K through 100 miles. Interactive distance selector, week-by-week schedules, calculators, and more.",
  alternates: { canonical: "/training/plans" },
};

export default function TrainingPlansPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
      { "@type": "ListItem", position: 2, name: "Training", item: "https://finishultra.com/training" },
      { "@type": "ListItem", position: 3, name: "Training Plans", item: "https://finishultra.com/training/plans" },
    ],
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PlansClient />
      <Footer />
    </>
  );
}
