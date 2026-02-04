import type { Product } from "@/lib/products";
import Button from "./Button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] bg-light flex items-center justify-center">
        <div className="text-center p-6">
          <span className="inline-block bg-primary text-white text-sm font-medium px-3 py-1 rounded-full mb-3">
            {product.distance}
          </span>
          <p className="text-gray text-sm">Product image coming soon</p>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-headline text-xl font-semibold text-dark mb-2">
          {product.name}
        </h3>
        <p className="text-gray text-sm mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          <Button size="sm">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
