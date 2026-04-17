import { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import SharedPlansHubClient from "@/app/training/shared-plans/SharedPlansHubClient";
import { loadPublicTrainingPlansServer } from "@/lib/public-training-plans-server";
import { pageMetadata } from "@/lib/seo-metadata";
import { absoluteUrl, breadcrumbJsonLdDocument, itemListJsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Shared Training Plans | FinishUltra",
  description:
    "Browse public ultra training plans built by real runners. Compare distance, level, and schedule structure, then build your own version in FinishUltra.",
  path: "/training/shared-plans",
});

export default async function SharedTrainingPlansPage() {
  const initialPlans = await loadPublicTrainingPlansServer();

  const breadcrumbJsonLd = breadcrumbJsonLdDocument("/training/shared-plans", "Shared Plans");
  const sharedPlansItemListJsonLd = itemListJsonLd({
    name: "Shared ultra training plans",
    description:
      "Public runner-built ultra training schedules that can be browsed for structure and inspiration.",
    url: absoluteUrl("/training/shared-plans"),
    items: initialPlans.map((plan) => ({
      name: plan.planTitle,
      url: absoluteUrl(`/training/shared-plans/${plan.slug}`),
      description: `${plan.distance} ${plan.level} training plan by ${plan.authorDisplayName}`,
    })),
  });

  return (
    <>
      <Header />
      <JsonLd data={[breadcrumbJsonLd, sharedPlansItemListJsonLd]} />
      <main>
        <SharedPlansHubClient initialPlans={initialPlans} />
      </main>
      <Footer />
    </>
  );
}
