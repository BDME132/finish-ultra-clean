import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import TrainingPlanCard from "@/components/TrainingPlanCard";
import { trainingPlans } from "@/lib/content/training-plans";
import { itemListJsonLd, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Training Plans | FinishUltra",
  description: "Free ultra marathon training plans for beginners. From base building to your first 50K, with race week prep included.",
  alternates: { canonical: "/training" },
};

const trainingHubItemListJsonLd = itemListJsonLd({
  name: "Ultra marathon training plans",
  description:
    "Structured plans for beginners — from base building and first 50K to race week and the interactive plan builder.",
  url: `${SITE_URL}/training`,
  items: trainingPlans.map((p) => ({
    name: p.title,
    url: `${SITE_URL}/training/${p.slug}`,
    description: p.description,
  })),
});

export default function TrainingPage() {
  const featuredPlan = trainingPlans.find((p) => p.slug === "plans");
  const otherPlans = trainingPlans.filter((p) => p.slug !== "plans");

  return (
    <>
      <Header />
      <JsonLd data={trainingHubItemListJsonLd} />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Free Training Plans
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto mb-6">
              Structured plans built for beginners. No complicated periodization, no jargon — just a clear path from where you are to the finish line.
            </p>
            <Link
              href="/training/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-md"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Open Training Dashboard
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Featured card */}
            <div className="max-w-2xl mx-auto mb-10">
              {featuredPlan && (
                <TrainingPlanCard plan={featuredPlan} variant="featured" />
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-medium text-gray uppercase tracking-wider">
                Or explore a specific plan
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Other plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherPlans.map((plan) => (
                <TrainingPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
