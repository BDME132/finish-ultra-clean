import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GearCard from "@/components/GearCard";
import { kits } from "@/lib/content/kits";
import { getProductById } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Gear Kits | FinishUltra",
  description: "Curated gear bundles for ultra runners. Everything you need for your first 50K, a budget starter kit, and a mountain 50-miler setup.",
  alternates: { canonical: "/gear/kits" },
};

export default function GearKitsPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
      { "@type": "ListItem", position: 2, name: "Gear", item: "https://finishultra.com/gear" },
      { "@type": "ListItem", position: 3, name: "Kits", item: "https://finishultra.com/gear/kits" },
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
              Curated Gear Kits
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Pre-built gear bundles for specific distances. We picked every item for a reason — no filler, no fluff.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            {kits.map((kit) => {
              const items = kit.itemIds
                .map((id) => getProductById(id))
                .filter(Boolean);

              return (
                <div key={kit.id} id={kit.slug}>
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-white bg-primary px-3 py-1 rounded-full">
                        {kit.distance}
                      </span>
                      <span className="text-sm text-gray">{kit.totalEstimate}</span>
                    </div>
                    <h2 className="font-headline text-3xl font-bold text-dark mb-3">
                      {kit.name}
                    </h2>
                    <p className="text-gray max-w-2xl leading-relaxed">
                      {kit.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((product) => (
                      <GearCard key={product!.id} product={product!} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
