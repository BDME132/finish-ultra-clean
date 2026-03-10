import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GearCard from "@/components/GearCard";
import { getProductsByCategory } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Nutrition | FinishUltra",
  description: "Ultra marathon nutrition for beginners. Simple fueling strategies and our favorite products for calories, hydration, and electrolytes.",
  alternates: { canonical: "/gear/nutrition" },
};

export default function NutritionPage() {
  const nutrition = getProductsByCategory("nutrition");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
      { "@type": "ListItem", position: 2, name: "Gear", item: "https://finishultra.com/gear" },
      { "@type": "ListItem", position: 3, name: "Nutrition", item: "https://finishultra.com/gear/nutrition" },
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
              Nutrition
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Nutrition is where most first-time ultra runners fail. These products keep it simple — calories in, bonking out.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {nutrition.map((product) => (
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
