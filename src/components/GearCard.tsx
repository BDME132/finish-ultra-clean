import { AffiliateProduct } from "@/types/content";

interface GearCardProps {
  product: AffiliateProduct;
}

export default function GearCard({ product }: GearCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] bg-light flex items-center justify-center">
        <span className="text-gray text-sm">{product.brand} {product.name}</span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            {product.brand}
          </span>
          {product.tags.includes("beginner") && (
            <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
              Beginner Pick
            </span>
          )}
        </div>
        <h3 className="font-headline text-lg font-bold text-dark mb-2">
          {product.name}
        </h3>
        <p className="text-gray text-sm mb-3">{product.description}</p>
        <p className="text-dark text-sm italic mb-4">&ldquo;{product.whyWeRecommend}&rdquo;</p>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
        >
          View Product
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
