import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ultra Running Glossary | FinishUltra",
  description:
    "A-Z glossary of ultra marathon and trail running terms. Learn what DNF, aid station, drop bag, cutoff time, and dozens more terms mean.",
  alternates: { canonical: "/tools/glossary" },
};

export default function GlossaryPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-primary mb-2">Tools</p>
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Ultra Running Glossary
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Every term you&apos;ll hear on the trail, explained in plain
              English. From aid stations to zombie pace.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-light rounded-xl p-12">
              <p className="text-gray text-lg mb-4">Coming soon.</p>
              <p className="text-gray/60 text-sm">
                Have a question about ultra running terms?{" "}
                <Link
                  href="/pheidi"
                  className="text-primary hover:underline"
                >
                  Ask Pheidi
                </Link>
                , our AI coach, and she&apos;ll explain it.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
