import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrainingPlanCard from "@/components/TrainingPlanCard";
import { trainingPlans } from "@/lib/content/training-plans";

export const metadata: Metadata = {
  title: "Training Plans | FinishUltra",
  description: "Free ultra marathon training plans for beginners. From base building to your first 50K, with race week prep included.",
  alternates: { canonical: "/training" },
};

export default function TrainingPage() {
  const featuredPlan = trainingPlans.find((p) => p.slug === "plans");
  const otherPlans = trainingPlans.filter((p) => p.slug !== "plans");

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Free Training Plans
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Structured plans built for beginners. No complicated periodization, no jargon — just a clear path from where you are to the finish line.
            </p>
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
