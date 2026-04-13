import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Interactive Ultra Race Day Checklist | FinishUltra",
    description:
      "Build a custom race day packing list for your ultra by distance and conditions — vest, nutrition, layers, and drop bag items.",
    path: "/training/race-day-checklist",
  }),
};

export default function RaceDayChecklistPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-primary mb-2">Training</p>
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Race Day Checklist
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              An interactive packing list customized to your race distance and
              conditions. Check items off as you pack — never forget your
              headlamp again.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-light rounded-xl p-12">
              <p className="text-gray text-lg mb-4">Coming soon.</p>
              <p className="text-gray/60 text-sm">
                While you wait, check out our{" "}
                <Link
                  href="/training/race-week"
                  className="text-primary hover:underline"
                >
                  Race Week Guide
                </Link>{" "}
                for everything you need to know before the big day.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
