"use client";

import { useKit } from "@/lib/kit-context";
import type { Product } from "@/lib/products/types";
import { ShoppingCart, Check } from "lucide-react";

export default function AddToKitButton({ product }: { product: Product }) {
  const { addToKit, removeFromKit, isInKit } = useKit();
  const inKit = isInKit(product.id);

  return (
    <button
      onClick={() => (inKit ? removeFromKit(product.id) : addToKit(product))}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
        inKit
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-primary text-white hover:bg-blue-700 hover:shadow-md"
      }`}
    >
      {inKit ? (
        <>
          <Check className="w-4 h-4" />
          In Kit — Remove
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          Add to Kit
        </>
      )}
    </button>
  );
}
