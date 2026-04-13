import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PaceCalculator from "./PaceCalculator";
import { pageMetadata } from "@/lib/seo-metadata";
import { webApplicationJsonLd, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ultra Marathon Pace Calculator | FinishUltra",
    description:
      "Calculate your pace, splits, and finish time for 50K, 50-mile, and 100-mile ultra marathon distances.",
    path: "/tools/pace-calculator",
  }),
};

const paceCalculatorJsonLd = webApplicationJsonLd({
  name: "Ultra Marathon Pace Calculator",
  description:
    "Calculate pace, splits, and finish times for ultra marathon distances with slowdown factor and aid station time.",
  url: `${SITE_URL}/tools/pace-calculator`,
  applicationCategory: "UtilityApplication",
});

export default function PaceCalculatorPage() {
  return (
    <>
      <Header />
      <JsonLd data={paceCalculatorJsonLd} />
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
