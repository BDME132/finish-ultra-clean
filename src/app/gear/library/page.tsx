import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ALL_PRODUCTS } from "@/lib/products";
import LibraryClient from "./LibraryClient";

export const metadata: Metadata = {
  title: "Product Library | FinishUltra",
  description:
    "Browse the complete FinishUltra gear catalog. Filter by category, search by name or brand, and find the best ultra running gear for every budget and terrain.",
  alternates: { canonical: "/gear/library" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
    { "@type": "ListItem", position: 2, name: "Gear", item: "https://finishultra.com/gear" },
    { "@type": "ListItem", position: 3, name: "Library", item: "https://finishultra.com/gear/library" },
  ],
};

export default function LibraryPage() {
  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Product Library
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Browse our complete catalog of gear, nutrition, and accessories.
              Filter by category, search by name, and find the right products
              for your next ultra.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <LibraryClient products={ALL_PRODUCTS} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
