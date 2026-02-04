"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { products } from "@/lib/products";

export default function KitsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.distance.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Header />
      <main className="bg-light min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="font-headline text-4xl font-bold text-dark mb-2">
              All Kits
            </h1>
            <p className="text-gray">
              Find the perfect finish kit for your next ultra
            </p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search kits..."
            />
          </div>

          <p className="text-center text-gray text-sm mb-6">
            Showing {filteredProducts.length} of {products.length} kits
          </p>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray text-lg">
                No kits found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-primary hover:underline mt-2"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
