import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GearCard from "@/components/GearCard";
import { getProductsByCategory } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Packs & Vests | FinishUltra",
  description: "Running vests and hydration packs for ultra marathons. Carry water, nutrition, and gear without slowing down.",
  alternates: { canonical: "/gear/packs" },
};

export default function PacksPage() {
  const packs = getProductsByCategory("packs");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
      { "@type": "ListItem", position: 2, name: "Gear", item: "https://finishultra.com/gear" },
      { "@type": "ListItem", position: 3, name: "Packs & Vests", item: "https://finishultra.com/gear/packs" },
    ],
  };

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
              Packs & Vests
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              A running vest is essential for carrying water, nutrition, and required gear. Here are our picks from entry-level to race-ready.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packs.map((product) => (
                <GearCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
