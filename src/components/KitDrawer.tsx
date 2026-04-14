"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Trash2, ChevronUp, ChevronDown, Save } from "lucide-react";
import { useKit } from "@/lib/kit-context";
import { useAuth } from "@/components/AuthProvider";
import { generateKitId } from "@/lib/kit-types";
import type { SavedKit } from "@/lib/kit-types";
import { saveNewKit } from "@/lib/kit-sync";

export default function KitDrawer() {
  const {
    kitItems,
    removeFromKit,
    clearKit,
    itemCount,
    totalCost,
    isDrawerOpen,
    setDrawerOpen,
  } = useKit();

  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (itemCount === 0) return null;

  async function handleSaveKit() {
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const kit: SavedKit = {
        kitId: generateKitId(),
        createdAt: now,
        lastModified: now,
        raceDetails: {
          distance: "",
          terrain: "",
          temp: "",
          night: "",
          experience: "",
          budget: "",
          sweat: "",
          stomach: "",
          feetWidth: "",
          priority: "",
        },
        kitTitle: "My Custom Kit",
        kitSubtitle: `${itemCount} items from the product library`,
        totalCost,
        budgetCost: 0,
        premiumCost: 0,
        items: kitItems,
        packingChecklist: [],
        dropBagEssentials: [],
        testingTimeline: [],
        purchaseProgress: {
          totalItems: itemCount,
          purchased: 0,
          tested: 0,
          totalSpent: 0,
        },
        status: "active",
        notes: "",
      };

      await saveNewKit(kit, user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  // ── Collapsed: floating pill ──────────────────────────────────────────────
  if (!isDrawerOpen) {
    return (
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-white pl-4 pr-5 py-3 rounded-full shadow-2xl hover:bg-primary-dark transition-all hover:scale-105 active:scale-95"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="font-semibold text-sm">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span className="text-white/70 text-sm">${totalCost}</span>
        <ChevronUp className="w-4 h-4 ml-1" />
      </button>
    );
  }

  // ── Expanded: slide-up panel ──────────────────────────────────────────────
  return (
    <div className="fixed bottom-0 right-0 left-0 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-headline font-bold text-dark text-sm">
                My Custom Kit
              </h3>
              <p className="text-xs text-gray">
                {itemCount} {itemCount === 1 ? "item" : "items"} &middot; ${totalCost}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray hover:text-dark transition-colors"
            aria-label="Collapse kit drawer"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
          {kitItems.map((item) => (
            <div
              key={item.productId ?? item.product}
              className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark truncate">
                  {item.brand} {item.product}
                </p>
                <p className="text-xs text-gray">${item.price}</p>
              </div>
              <button
                onClick={() => item.productId && removeFromKit(item.productId)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray hover:text-red-500 transition-colors flex-shrink-0"
                aria-label={`Remove ${item.product} from kit`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-gray-100 space-y-3">
          {/* Total */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray font-medium">Estimated Total</span>
            <span className="font-bold text-dark">${totalCost}</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveKit}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : saving ? "Saving..." : "Save Kit"}
            </button>
            <Link
              href="/gear/kits"
              className="flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-dark hover:border-primary hover:text-primary transition-colors"
            >
              View Kits
            </Link>
          </div>

          {/* Clear all */}
          <button
            onClick={clearKit}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-gray hover:text-red-500 transition-colors py-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
