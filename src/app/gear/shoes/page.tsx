import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GearCard from "@/components/GearCard";
import { getProductsByCategory } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Trail Shoes | FinishUltra",
  description: "Best trail running shoes for beginner ultra runners. Our picks for cushioning, grip, and comfort over long distances.",
  alternates: { canonical: "/gear/shoes" },
};

export default function ShoesPage() {
  const shoes = getProductsByCategory("shoes");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
      { "@type": "ListItem", position: 2, name: "Gear", item: "https://finishultra.com/gear" },
      { "@type": "ListItem", position: 3, name: "Shoes", item: "https://finishultra.com/gear/shoes" },
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
              Trail Shoes
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Your shoes are the most important piece of gear. Here are the ones we trust for everything from groomed paths to rocky mountain trails.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {shoes.map((product) => (
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
