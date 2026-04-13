import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo-metadata";

const lastUpdated = "March 14, 2026";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Affiliate Disclosure | FinishUltra",
    description:
      "How FinishUltra uses affiliate links (including Amazon Associates), how commissions work, and how we keep picks honest.",
    path: "/affiliate-disclosure",
  }),
};

export default function AffiliateDisclosurePage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Affiliate Disclosure
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              FinishUltra may earn commissions from some product links. This disclosure
              explains how that works and how we handle recommendations.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray">
                Last updated {lastUpdated}
              </p>

              <div className="mt-8 rounded-2xl bg-light border border-primary/10 p-6">
                <p className="font-headline text-xl font-bold text-dark mb-2">
                  Amazon Associates Notice
                </p>
                <p className="text-gray leading-relaxed">
                  As an Amazon Associate I earn from qualifying purchases.
                </p>
              </div>

              <div className="mt-8 space-y-10 text-gray leading-relaxed">
                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    How Affiliate Links Work
                  </h2>
                  <p>
                    Some links on FinishUltra are affiliate links. If you click one of
                    those links and make a purchase, we may earn a commission from the
                    retailer. The price you pay does not increase because of that link.
                  </p>
                </section>

                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    Amazon Associates Program
                  </h2>
                  <p>
                    FinishUltra participates in the Amazon Services LLC Associates Program,
                    an affiliate advertising program designed to provide a means for sites
                    to earn advertising fees by advertising and linking to Amazon.com.
                  </p>
                </section>

                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    Editorial Standards
                  </h2>
                  <p>
                    Affiliate relationships do not control our recommendations. We aim to
                    recommend products that are useful for beginner ultra runners, and we
                    do not accept payment in exchange for positive coverage.
                  </p>
                  <p className="mt-3">
                    If we do not think a product is worth recommending, we do not include
                    it just because a commission is available.
                  </p>
                </section>

                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    Where Disclosures Appear
                  </h2>
                  <p>
                    We aim to place affiliate disclosures where readers can reasonably see
                    them, including on relevant pages and in site-wide legal links.
                  </p>
                </section>

                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    Questions
                  </h2>
                  <p>
                    Questions about an affiliate link or recommendation can be sent to{" "}
                    <a
                      href="mailto:hello@finishultra.com"
                      className="text-primary font-medium hover:underline"
                    >
                      hello@finishultra.com
                    </a>
                    . You can also use the{" "}
                    <Link href="/contact" className="text-primary font-medium hover:underline">
                      contact page
                    </Link>{" "}
                    or review our{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-primary font-medium hover:underline"
                    >
                      privacy policy
                    </Link>
                    .
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
