import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Search | FinishUltra",
  description:
    "Search FinishUltra for training plans, gear guides, blog posts, and more.",
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Search
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Find training plans, gear guides, blog posts, and glossary terms.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-light rounded-xl p-12">
              <p className="text-gray text-lg mb-4">Coming soon.</p>
              <p className="text-gray/60 text-sm">
                Try browsing our{" "}
                <Link
                  href="/start-here"
                  className="text-primary hover:underline"
                >
                  Start Here
                </Link>{" "}
                guide or{" "}
                <Link
                  href="/pheidi"
                  className="text-primary hover:underline"
                >
                  ask Pheidi
                </Link>{" "}
                to find what you need.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
