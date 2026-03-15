import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const lastUpdated = "March 14, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy | FinishUltra",
  description:
    "How FinishUltra collects, uses, and protects information across the site, newsletter, account features, and AI chat.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              This page explains what information FinishUltra collects, how we use it,
              and the choices you have when you use the site.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray">
                Last updated {lastUpdated}
              </p>

              <div className="mt-8 space-y-10 text-gray leading-relaxed">
                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    Information We Collect
                  </h2>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      Information you choose to give us, such as your email address when
                      you join the newsletter, create an account, or contact us.
                    </li>
                    <li>
                      Messages you send through site features such as the Pheidi AI chat
                      or by email.
                    </li>
                    <li>
                      Technical and usage information such as IP address, browser or device
                      information, pages viewed, and similar analytics data collected to run
                      and improve the site.
                    </li>
                    <li>
                      Cookies or similar technologies used for authentication, site
                      functionality, analytics, and chat access controls.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    How We Use Information
                  </h2>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>Provide and maintain FinishUltra and its site features.</li>
                    <li>Send newsletters or replies when you request them.</li>
                    <li>Operate account features, manage subscriptions, and prevent abuse.</li>
                    <li>Improve site content, performance, and user experience.</li>
                    <li>Comply with legal obligations and protect the security of the site.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    Services We Use
                  </h2>
                  <p>
                    We use third-party tools to operate parts of FinishUltra. These may
                    process information on our behalf, including Supabase for database and
                    authentication services, Resend for email delivery, OpenAI-powered
                    services for the Pheidi chat experience, and Vercel Analytics for site
                    analytics.
                  </p>
                </section>

                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    Affiliate Links
                  </h2>
                  <p>
                    Some pages on FinishUltra include affiliate links. If you click one of
                    those links, the destination site may use its own cookies or tracking
                    tools to attribute purchases. Those third-party sites control their own
                    privacy practices.
                  </p>
                  <p className="mt-3">
                    You can read more on our{" "}
                    <Link
                      href="/affiliate-disclosure"
                      className="text-primary font-medium hover:underline"
                    >
                      affiliate disclosure
                    </Link>{" "}
                    page.
                  </p>
                </section>

                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    Your Choices
                  </h2>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>You can unsubscribe from marketing emails at any time.</li>
                    <li>
                      You can disable cookies in your browser, although some site features
                      may not work correctly.
                    </li>
                    <li>
                      You can contact us to request that we update or delete information you
                      have submitted, subject to legal and operational requirements.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    Data Retention
                  </h2>
                  <p>
                    We keep information for as long as it is reasonably necessary to operate
                    the site, provide requested services, maintain records, prevent abuse,
                    and meet legal obligations.
                  </p>
                </section>

                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    Children&apos;s Privacy
                  </h2>
                  <p>
                    FinishUltra is not directed to children under 13, and we do not
                    knowingly collect personal information from children under 13.
                  </p>
                </section>

                <section>
                  <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                    Contact
                  </h2>
                  <p>
                    Questions about this policy can be sent to{" "}
                    <a
                      href="mailto:hello@finishultra.com"
                      className="text-primary font-medium hover:underline"
                    >
                      hello@finishultra.com
                    </a>
                    . You can also visit our{" "}
                    <Link href="/contact" className="text-primary font-medium hover:underline">
                      contact page
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
