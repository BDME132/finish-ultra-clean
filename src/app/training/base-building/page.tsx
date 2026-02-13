import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Base Building for Ultra | FinishUltra",
  description: "A 12-week base building program to prepare your body for ultra marathon training. Build aerobic fitness gradually.",
  alternates: { canonical: "/training/base-building" },
};

export default function BaseBuildingPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
      { "@type": "ListItem", position: 2, name: "Training", item: "https://finishultra.com/training" },
      { "@type": "ListItem", position: 3, name: "Base Building", item: "https://finishultra.com/training/base-building" },
    ],
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-sm font-medium text-white bg-primary px-3 py-1 rounded-full">Any Distance</span>
              <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">Beginner</span>
              <span className="text-sm text-gray">12 Weeks</span>
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Base Building for Ultra
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Not ready for a 50K plan yet? This 12-week program builds the aerobic engine you need before starting ultra-specific training.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl font-bold text-dark mb-6">What This Plan Does</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-headline font-bold text-dark mb-2">Builds Consistency</h3>
                <p className="text-gray leading-relaxed">The goal is running 4-5 days per week without injury. We start with what you can do and build from there.</p>
              </div>
              <div>
                <h3 className="font-headline font-bold text-dark mb-2">Grows Your Long Run</h3>
                <p className="text-gray leading-relaxed">By week 12, your long run will be 13-15 miles — enough to start our First 50K plan with confidence.</p>
              </div>
              <div>
                <h3 className="font-headline font-bold text-dark mb-2">Introduces Time on Feet</h3>
                <p className="text-gray leading-relaxed">Ultra running is about duration, not speed. This plan teaches you to enjoy (or at least tolerate) hours of forward motion.</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-light rounded-xl border border-gray-100">
              <h3 className="font-headline font-bold text-dark mb-3">Who This Plan Is For</h3>
              <ul className="space-y-2 text-gray">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">&#10003;</span>
                  <span>Runners who can currently run 3-5 miles comfortably</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">&#10003;</span>
                  <span>People stepping up from 5K/10K distances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">&#10003;</span>
                  <span>Runners returning from a break who need to rebuild</span>
                </li>
              </ul>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray mb-4">Full week-by-week breakdown coming soon.</p>
              <Link
                href="/training/first-50k"
                className="text-primary font-medium hover:underline"
              >
                Already running 13+ miles? Jump to the First 50K Plan &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
