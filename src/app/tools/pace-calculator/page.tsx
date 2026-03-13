import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaceCalculator from "./PaceCalculator";

export const metadata: Metadata = {
  title: "Ultra Pace Calculator | FinishUltra",
  description:
    "Calculate your pace, finish time, or required pace for any ultra marathon. Supports 50K, 50 mile, 100K, and 100 mile with slowdown factor and aid station time.",
  alternates: { canonical: "/tools/pace-calculator" },
};

export default function PaceCalculatorPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-primary mb-2">Tools</p>
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Ultra Pace Calculator
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Plan your finish time or find the pace you need — with slowdown factor and aid station time built in.
            </p>
          </div>
        </section>

        <PaceCalculator />
      </main>
      <Footer />
    </>
  );
}
