import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ALL_PRODUCTS } from "@/lib/products";
import {
  absoluteUrl,
  itemListJsonLd,
  productFromLibrary,
  SITE_URL,
} from "@/lib/schema";
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
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Gear", item: `${SITE_URL}/gear` },
    { "@type": "ListItem", position: 3, name: "Library", item: `${SITE_URL}/gear/library` },
  ],
};

const libraryItemListJsonLd = itemListJsonLd({
  name: "FinishUltra Gear Library",
  description:
    "Full catalog of trail running shoes, hydration packs, apparel, nutrition, and accessories for ultra marathons.",
  url: `${SITE_URL}/gear/library`,
  items: ALL_PRODUCTS.map((product) => {
    const url = absoluteUrl(`/gear/library/${product.id}`);
    return {
      name: `${product.brand} ${product.name}`,
      url,
      description: product.description,
      product: productFromLibrary(product),
    };
  }),
});

export default function LibraryPage() {
  return (
    <>
      <Header />
      <JsonLd data={[breadcrumbJsonLd, libraryItemListJsonLd]} />
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
