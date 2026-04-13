import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Contact FinishUltra | Questions & Feedback",
    description:
      "Contact FinishUltra for site questions, editorial corrections, affiliate or privacy inquiries, and partnership ideas. We read every message.",
    path: "/contact",
  }),
};

const contactTopics = [
  {
    title: "General Questions",
    description:
      "Send questions about the site, beginner ultra resources, broken links, or account issues.",
  },
  {
    title: "Editorial Corrections",
    description:
      "If you spot an error or want us to review a content update, send the page URL and the correction details.",
  },
  {
    title: "Affiliate, Privacy, or Business Inquiries",
    description:
      "Use the same email for affiliate disclosure questions, privacy requests, partnership outreach, or compliance reviews.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Contact
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              The fastest way to reach FinishUltra is by email. We read every message
              and aim to respond within 2 to 3 business days.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="font-headline text-2xl font-bold text-dark mb-4">
                  Email
                </h2>
                <a
                  href="mailto:hello@finishultra.com"
                  className="text-primary text-lg font-medium hover:underline"
                >
                  hello@finishultra.com
                </a>
                <p className="text-gray leading-relaxed mt-4">
                  Include as much detail as you can so we can help quickly. If your message
                  is about a specific article or product page, include the page link.
                </p>

                <div className="mt-8 space-y-4">
                  {contactTopics.map((topic) => (
                    <div
                      key={topic.title}
                      className="rounded-2xl bg-light border border-slate-200 p-5"
                    >
                      <h3 className="font-headline text-lg font-bold text-dark mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-gray leading-relaxed">{topic.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-light p-8 shadow-sm">
                <h2 className="font-headline text-2xl font-bold text-dark mb-4">
                  Before You Email
                </h2>
                <ul className="list-disc pl-6 space-y-3 text-gray leading-relaxed">
                  <li>Check the relevant page URL and include it in your message.</li>
                  <li>Use the email address you subscribed with for newsletter questions.</li>
                  <li>For privacy requests, tell us exactly what you want updated or removed.</li>
                  <li>We do not currently offer phone support or a mailing address for site inquiries.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
