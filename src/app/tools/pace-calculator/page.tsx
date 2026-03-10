import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ultra Pace Calculator | FinishUltra",
  description:
    "Calculate your pace, finish time, or distance for any ultra marathon. Preset distances for 50K, 50 mile, 100K, and 100 mile races with per-mile splits.",
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
              Enter any two of distance, time, or pace and we&apos;ll calculate
              the third. Pre-loaded with common ultra distances.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-light rounded-xl p-12">
              <p className="text-gray text-lg mb-4">Coming soon.</p>
              <p className="text-gray/60 text-sm">
                In the meantime, check out our{" "}
                <Link
                  href="/training/first-50k"
                  className="text-primary hover:underline"
                >
                  First 50K Training Plan
                </Link>{" "}
                to start preparing for your race.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
