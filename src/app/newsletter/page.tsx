import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Newsletter | FinishUltra",
  description: "Sign up for weekly ultra running tips. Training advice, gear recommendations, and beginner Q&A delivered to your inbox.",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Newsletter
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Weekly tips, gear spotlights, and beginner Q&amp;A — no spam, no fluff. Just the stuff that helps you get to the finish line.
            </p>
          </div>
        </section>

        <NewsletterSignup />

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl font-bold text-dark mb-6 text-center">
              What You&apos;ll Get
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-light rounded-xl">
                <h3 className="font-headline font-bold text-dark mb-2">Training Tip of the Week</h3>
                <p className="text-gray text-sm">Actionable advice you can apply to your next run. No theory, just practice.</p>
              </div>
              <div className="p-6 bg-light rounded-xl">
                <h3 className="font-headline font-bold text-dark mb-2">Gear Spotlight</h3>
                <p className="text-gray text-sm">One product we&apos;re currently using or testing, with our honest take.</p>
              </div>
              <div className="p-6 bg-light rounded-xl">
                <h3 className="font-headline font-bold text-dark mb-2">Beginner Q&amp;A</h3>
                <p className="text-gray text-sm">Answers to the most common questions from our community and AI coach.</p>
              </div>
              <div className="p-6 bg-light rounded-xl">
                <h3 className="font-headline font-bold text-dark mb-2">Race Calendar</h3>
                <p className="text-gray text-sm">Upcoming beginner-friendly ultras and registration deadlines.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-headline text-2xl font-bold text-dark mb-4">Newsletter Archive</h2>
            <p className="text-gray">Past issues coming soon. Sign up above to get the next one.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
