import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrainingPlanCard from "@/components/TrainingPlanCard";
import { trainingPlans } from "@/lib/content/training-plans";

export const metadata: Metadata = {
  title: "Training Plans | FinishUltra",
  description: "Free ultra marathon training plans for beginners. From base building to your first 50K, with race week prep included.",
};

export default function TrainingPage() {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trainingPlans.map((plan) => (
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
