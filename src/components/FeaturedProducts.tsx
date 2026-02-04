import { products } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  return (
    <section id="products" className="py-16 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-4">
            Choose Your Distance
          </h2>
          <p className="text-gray max-w-xl mx-auto">
            Each kit is tailored to the demands of your race distance with
            carefully selected nutrition and recovery essentials.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
