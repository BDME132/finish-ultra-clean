import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { faqs, faqsByCategory, speakableFaqs } from "@/lib/content/faqs";

export const metadata: Metadata = {
  title: "Ultramarathon FAQ: 51 Questions Every Beginner Asks (Answered) | FinishUltra",
  description:
    "Every question about running your first ultra, answered honestly by beginners who've been there. Training, gear, nutrition, race day, and more.",
  alternates: { canonical: "/faq" },
};

const categories = [
  { key: "getting-started", label: "Getting Started", description: "New to ultra running? Start here." },
  { key: "training", label: "Training", description: "How to build fitness and follow a plan." },
  { key: "gear", label: "Gear", description: "Shoes, vests, socks, and everything in between." },
  { key: "nutrition", label: "Nutrition & Hydration", description: "Fueling for long distances." },
  { key: "race-day", label: "Race Day", description: "What to expect and how to handle it." },
  { key: "injuries-recovery", label: "Injuries & Recovery", description: "Prevention, treatment, and coming back stronger." },
  { key: "mindset", label: "Mindset & Motivation", description: "The mental side of ultra running." },
] as const;

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.finishultra.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FAQ",
        item: "https://www.finishultra.com/faq",
      },
    ],
  };

  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Ultramarathon FAQ: 51 Questions Every Beginner Asks (Answered)",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: speakableFaqs.map((faq) => `#${faq.id}`),
    },
    url: "https://www.finishultra.com/faq",
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-4">
              Ultramarathon FAQ: Every Question Beginners Ask, Answered
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto mb-10">
              51 questions. Honest answers. No gatekeeping.
            </p>

            {/* Category jump links */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <a
                  key={cat.key}
                  href={`#${cat.key}`}
                  className="text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  {cat.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ content */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {categories.map((cat) => (
              <div key={cat.key} id={cat.key} className="mb-16 scroll-mt-24">
                <div className="mb-8">
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark mb-2">
                    {cat.label}
                  </h2>
                  <p className="text-gray text-sm">{cat.description}</p>
                </div>

                <div>
                  {faqsByCategory[cat.key].map((faq) => (
                    <div
                      key={faq.id}
                      id={faq.id}
                      className="border-b border-gray-100 pb-8 mb-8 scroll-mt-24"
                    >
                      <h3 className="font-headline text-lg font-bold text-dark mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray leading-relaxed mb-4">{faq.answer}</p>
                      {faq.relatedPages.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {faq.relatedPages.map((page) => (
                            <Link
                              key={page}
                              href={page}
                              className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                            >
                              {page}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
