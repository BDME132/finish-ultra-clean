"use client";

import Link from "next/link";
import type { FAQ } from "@/lib/content/faqs";

interface Props {
  faqs: FAQ[];
  title?: string;
}

export default function FAQSection({ faqs, title = "Frequently Asked Questions" }: Props) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-16 bg-light border-t border-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-2xl font-bold text-dark mb-8">{title}</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details key={faq.id} className="group bg-white rounded-xl border border-gray-100 open:border-primary/20">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-headline font-semibold text-dark text-sm list-none">
                {faq.question}
                <svg className="w-4 h-4 text-gray flex-shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm text-gray leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray">
          <Link href="/faq" className="text-primary font-medium hover:underline">
            See all 51 ultramarathon FAQs →
          </Link>
        </p>
      </div>
    </section>
  );
}
