import Link from "next/link";
import { GearKit } from "@/types/content";

interface KitCardProps {
  kit: GearKit;
}

export default function KitCard({ kit }: KitCardProps) {
  return (
    <Link
      href={`/gear/kits#${kit.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all"
    >
      <div className="aspect-[16/9] bg-light flex items-center justify-center">
        <span className="text-gray text-sm">{kit.name}</span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-white bg-primary px-2.5 py-1 rounded-full">
            {kit.distance}
          </span>
          <span className="text-xs text-gray">
            {kit.itemIds.length} items
          </span>
          <span className="text-xs font-medium text-dark ml-auto">
            {kit.totalEstimate}
          </span>
        </div>
        <h3 className="font-headline text-lg font-bold text-dark mb-2">
          {kit.name}
        </h3>
        <p className="text-gray text-sm leading-relaxed">
          {kit.description}
        </p>
      </div>
    </Link>
  );
}
