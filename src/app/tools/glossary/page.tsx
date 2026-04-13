import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import GlossaryDirectory from "./GlossaryDirectory";
import { glossaryTerms } from "@/lib/content/glossary";
import { pageMetadata } from "@/lib/seo-metadata";
import { definedTermSetJsonLd, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ultra Running Glossary (A–Z) | FinishUltra",
    description:
      "Ultra running terminology explained in plain English. Every term a beginner needs to know.",
    path: "/tools/glossary",
  }),
};

const glossaryPageUrl = `${SITE_URL}/tools/glossary`;

const glossaryDefinedTermSetJsonLd = definedTermSetJsonLd(
  "Ultra Running Glossary",
  "Plain-English definitions of ultra marathon and trail running terms for beginners.",
  glossaryPageUrl,
  glossaryTerms
);

export default function GlossaryPage() {
  return (
    <>
      <Header />
      <JsonLd data={glossaryDefinedTermSetJsonLd} />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-primary mb-2">Tools</p>
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Ultra Running Glossary
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Every term you&apos;ll hear on the trail, explained in plain English.
              Learn the language of ultras without pretending you were born
              knowing it.
            </p>
            <p className="text-sm text-gray mt-4">
              {glossaryTerms.length} plain-English definitions for beginner ultra runners.
            </p>
          </div>
        </section>
        <GlossaryDirectory />
      </main>
      <Footer />
    </>
  );
}
