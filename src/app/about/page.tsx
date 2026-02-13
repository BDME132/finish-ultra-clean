import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About | FinishUltra",
  description: "We're two high school runners documenting our journey into ultra running. Built by beginners, for beginners.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              About FinishUltra
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Built by beginners, for beginners.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose-like">
            <div className="space-y-6 text-gray leading-relaxed">
              <p>
                We&apos;re two high school runners who got curious about ultra running and couldn&apos;t find resources that spoke to us. Everything out there was made by elite athletes for experienced runners. Where were the guides for people like us — total beginners who didn&apos;t know the difference between a running vest and a hydration pack?
              </p>
              <p>
                So we built FinishUltra. It&apos;s the resource we wish existed when we started: specific, honest, and written by people who are still figuring it out themselves.
              </p>

              <h2 className="font-headline text-2xl font-bold text-dark pt-4">Our Mission</h2>
              <p>
                Make ultra running approachable. We believe anyone with the curiosity and willingness to train can finish an ultra marathon. You don&apos;t need to be fast. You don&apos;t need expensive gear. You just need a plan and the confidence to start.
              </p>

              <h2 className="font-headline text-2xl font-bold text-dark pt-4">What We Believe</h2>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-0.5">01</span>
                  <span><strong className="text-dark">Beginners deserve specific advice.</strong> &quot;Just run more&quot; isn&apos;t helpful. We give you exact plans, exact gear picks, and exact strategies.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-0.5">02</span>
                  <span><strong className="text-dark">Honesty over hype.</strong> If something is expensive and unnecessary, we&apos;ll tell you. If a budget option works just as well, we&apos;ll recommend it.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-0.5">03</span>
                  <span><strong className="text-dark">You can do this.</strong> A 50K sounds scary. It&apos;s only 4.9 miles longer than a marathon. If you can run a half, you can train for an ultra.</span>
                </li>
              </ul>

              <h2 className="font-headline text-2xl font-bold text-dark pt-4">How We Make Money</h2>
              <p>
                When we recommend gear, we include affiliate links. If you buy something through our links, we earn a small commission at no extra cost to you. This is how we keep FinishUltra free.
              </p>
              <p>
                We only recommend products we&apos;d actually use. If we haven&apos;t tested it or don&apos;t believe in it, it&apos;s not on this site.
              </p>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray mb-4">Questions? Suggestions? Just want to say hi?</p>
              <a
                href="mailto:hello@finishultra.com"
                className="text-primary font-medium hover:underline"
              >
                hello@finishultra.com
              </a>
              <div className="mt-6">
                <Link
                  href="/start-here"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Ready to Start? &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
