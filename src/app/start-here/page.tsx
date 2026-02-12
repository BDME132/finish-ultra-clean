import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Start Here | FinishUltra",
  description: "New to ultra running? Start here. A step-by-step roadmap to get you from curious to crossing your first ultra finish line.",
};

const steps = [
  {
    number: 1,
    title: "Decide Your Distance",
    description:
      "A 50K (31 miles) is the most popular first ultra. It's only 4.9 miles longer than a marathon, and most races have generous cutoff times. Pick a distance that excites you without terrifying you.",
    link: { href: "/blog/choosing-first-ultra", label: "How to Choose Your First Ultra" },
  },
  {
    number: 2,
    title: "Get the Right Gear",
    description:
      "You don't need everything at once, but you do need trail shoes, a running vest, and a nutrition strategy. We've curated starter kits so you don't have to figure it out alone.",
    link: { href: "/gear/kits", label: "Browse Gear Kits" },
  },
  {
    number: 3,
    title: "Follow a Training Plan",
    description:
      "Our free 16-week plan takes you from half marathon fitness to 50K ready. It builds mileage gradually, includes back-to-back long runs, and has nutrition practice built in.",
    link: { href: "/training/first-50k", label: "View the First 50K Plan" },
  },
  {
    number: 4,
    title: "Dial In Nutrition",
    description:
      "Nutrition is the #1 reason first-time ultra runners DNF. The good news: it doesn't have to be complicated. Start practicing eating while running on your long runs, weeks before race day.",
    link: { href: "/blog/ultra-nutrition-beginners", label: "Read the Nutrition Guide" },
  },
  {
    number: 5,
    title: "Race Day Prep",
    description:
      "The week before your race is about rest, not fitness. Taper your miles, lay out your gear, and trust your training. Nothing new on race day — wear what you've trained in.",
    link: { href: "/training/race-week", label: "Race Week Protocol" },
  },
];

export default function StartHerePage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Start Here
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              New to ultra running? You&apos;re in the right place. Follow these five steps and you&apos;ll be ready for your first ultra.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-headline font-bold text-lg">{step.number}</span>
                  </div>
                  <div>
                    <h2 className="font-headline text-xl font-bold text-dark mb-2">
                      {step.title}
                    </h2>
                    <p className="text-gray mb-3 leading-relaxed">{step.description}</p>
                    <Link
                      href={step.link.href}
                      className="text-primary font-medium text-sm hover:underline"
                    >
                      {step.link.label} &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-light py-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-headline text-2xl font-bold text-dark mb-4">
              Still have questions?
            </h2>
            <p className="text-gray mb-6">
              Our AI coach can give you personalized advice for your specific situation.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              Chat with Coach
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
