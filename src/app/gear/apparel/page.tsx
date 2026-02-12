import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GearCard from "@/components/GearCard";
import { getProductsByCategory } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Apparel | FinishUltra",
  description: "Running apparel for ultra marathons. Shorts, socks, and layers that handle long distances without chafing.",
};

export default function ApparelPage() {
  const apparel = getProductsByCategory("apparel");

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Apparel
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              What you wear matters more than you think when you&apos;re running for 6+ hours. These picks handle sweat, rain, and distance.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {apparel.map((product) => (
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
