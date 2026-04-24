import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ReviewSection from "./ReviewSection";
import CommentSection from "./CommentSection";
import AddToKitButton from "./AddToKitButton";
import {
  ALL_PRODUCTS,
  getProductById,
} from "@/lib/products";
import { loadProductReviewAggregateServer } from "@/lib/products/reviews-server";
import { productFromLibrary, productJsonLd } from "@/lib/schema";
import type {
  Product,
  ShoeProduct,
  PackProduct,
  ApparelProduct,
  NutritionProduct,
  AccessoryProduct,
} from "@/lib/products/types";

// ─── Static Params ──────────────────────────────────────────────────────────

export const revalidate = 86400;

export function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ productId: p.id }));
}

// ─── Dynamic Metadata ───────────────────────────────────────────────────────

type Params = { params: Promise<{ productId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { productId } = await params;
  const product = getProductById(productId);
  if (!product) return { title: "Product Not Found | FinishUltra" };

  return {
    title: `${product.name} by ${product.brand} | FinishUltra`,
    description: product.description,
    alternates: { canonical: `/gear/library/${product.id}` },
  };
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

function RatingBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-5 rounded-full ${
            i < value ? "bg-primary" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string | boolean | undefined }) {
  if (value === undefined || value === null) return null;
  const display = typeof value === "boolean" ? (value ? "Yes" : "No") : value;
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray">{label}</span>
      <span className="text-sm font-semibold text-dark">{display}</span>
    </div>
  );
}

function AffiliateButtons({ links }: { links: Product["affiliateLinks"] }) {
  if (!links.amazon || links.amazon === "#") return null;

  return (
    <div>
      <h2 className="font-headline font-bold text-dark text-lg mb-3">
        Where to Buy
      </h2>
      <a
        href={links.amazon}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-block text-sm px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors font-medium"
      >
        Buy on Amazon
      </a>
    </div>
  );
}

function ProsCons({
  pros,
  cons,
}: {
  pros?: string[];
  cons?: string[];
}) {
  if (!pros?.length && !cons?.length) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {pros && pros.length > 0 && (
        <div>
          <h3 className="font-headline font-bold text-dark text-base mb-2">
            Pros
          </h3>
          <ul className="space-y-1.5">
            {pros.map((p) => (
              <li key={p} className="text-sm text-gray flex gap-2">
                <span className="text-green-500 shrink-0 font-bold">+</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons && cons.length > 0 && (
        <div>
          <h3 className="font-headline font-bold text-dark text-base mb-2">
            Cons
          </h3>
          <ul className="space-y-1.5">
            {cons.map((c) => (
              <li key={c} className="text-sm text-gray flex gap-2">
                <span className="text-red-400 shrink-0 font-bold">&minus;</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function RunnerReview({
  review,
}: {
  review?: { quote: string; race: string; runner: string };
}) {
  if (!review) return null;
  return (
    <blockquote className="bg-gray-50 rounded-xl p-5 text-sm text-gray italic border border-gray-100">
      &ldquo;{review.quote}&rdquo;
      <footer className="not-italic font-semibold text-dark mt-2">
        {review.runner} &middot; {review.race}
      </footer>
    </blockquote>
  );
}

// ─── Category-Specific Sections ─────────────────────────────────────────────

function ShoeDetails({ product }: { product: ShoeProduct }) {
  const { specs, ratings, bestFor, pros, cons, review } = product;

  return (
    <div className="space-y-8">
      {/* Specs grid */}
      <div>
        <h2 className="font-headline font-bold text-dark text-lg mb-3">
          Specifications
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="grid sm:grid-cols-2 gap-x-8">
            <SpecRow label="Weight" value={specs.weight} />
            <SpecRow label="Drop" value={specs.drop} />
            <SpecRow label="Stack Height" value={specs.stack} />
            <SpecRow label="Lug Depth" value={specs.lug} />
            <SpecRow label="Midsole" value={specs.midsole} />
            <SpecRow label="Outsole" value={specs.outsole} />
            <SpecRow label="Rock Plate" value={specs.rockPlate} />
            <SpecRow label="Widths" value={specs.widths} />
          </div>
        </div>
      </div>

      {/* Ratings */}
      {ratings && (
        <div>
          <h2 className="font-headline font-bold text-dark text-lg mb-3">
            Ratings
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            {(
              [
                ["Cushioning", ratings.cushioning],
                ["Traction", ratings.traction],
                ["Durability", ratings.durability],
                ["Breathability", ratings.breathability],
                ["Ground Feel", ratings.groundFeel],
              ] as [string, number][]
            ).map(([label, val]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-sm text-gray w-32 shrink-0">
                  {label}
                </span>
                <RatingBar value={val} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best For */}
      {bestFor && bestFor.length > 0 && (
        <div>
          <h2 className="font-headline font-bold text-dark text-lg mb-3">
            Best For
          </h2>
          <div className="flex flex-wrap gap-2">
            {bestFor.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <ProsCons pros={pros} cons={cons} />
      <RunnerReview review={review} />
    </div>
  );
}

function PackDetails({ product }: { product: PackProduct }) {
  const { specs, ratings, bestFor, distances, pros, cons, review } = product;

  return (
    <div className="space-y-8">
      {/* Specs grid */}
      <div>
        <h2 className="font-headline font-bold text-dark text-lg mb-3">
          Specifications
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="grid sm:grid-cols-2 gap-x-8">
            <SpecRow label="Weight" value={specs.weight} />
            <SpecRow label="Capacity" value={specs.capacity} />
            <SpecRow label="Gender Fit" value={specs.genderFit} />
            <SpecRow label="Sizes" value={specs.sizes} />
            <SpecRow label="Front Pockets" value={specs.frontPockets} />
            <SpecRow label="Back Storage" value={specs.backStorage} />
            <SpecRow label="Hydration System" value={specs.hydrationSystem} />
            <SpecRow label="Pole Carry" value={specs.poleCarry} />
            <SpecRow label="Whistle" value={specs.whistle} />
            <SpecRow label="Bladder Compatible" value={specs.bladderCompatible} />
            <SpecRow label="Included Flasks" value={specs.includedFlasks} />
          </div>
        </div>
      </div>

      {/* Ratings */}
      {ratings && (
        <div>
          <h2 className="font-headline font-bold text-dark text-lg mb-3">
            Ratings
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            {(
              [
                ["Comfort", ratings.comfort],
                ["Bounce", ratings.bounce],
                ["Breathability", ratings.breathability],
                ["Load Distribution", ratings.loadDistribution],
                ["Ease of Access", ratings.easeOfAccess],
                ["Durability", ratings.durability],
              ] as [string, number][]
            ).map(([label, val]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-sm text-gray w-36 shrink-0">
                  {label}
                </span>
                <RatingBar value={val} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best For */}
      {bestFor && bestFor.length > 0 && (
        <div>
          <h2 className="font-headline font-bold text-dark text-lg mb-3">
            Best For
          </h2>
          <div className="flex flex-wrap gap-2">
            {bestFor.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Distances */}
      {distances && distances.length > 0 && (
        <div>
          <h2 className="font-headline font-bold text-dark text-lg mb-3">
            Recommended Distances
          </h2>
          <div className="flex flex-wrap gap-2">
            {distances.map((d) => (
              <span
                key={d}
                className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full font-medium"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      <ProsCons pros={pros} cons={cons} />
      <RunnerReview review={review} />
    </div>
  );
}

function ApparelDetails({ product }: { product: ApparelProduct }) {
  const { specs, role, conditions } = product;

  return (
    <div className="space-y-8">
      {/* Specs */}
      <div>
        <h2 className="font-headline font-bold text-dark text-lg mb-3">
          Specifications
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="grid sm:grid-cols-2 gap-x-8">
            <SpecRow label="Fabric" value={specs.fabric} />
            <SpecRow label="UPF" value={specs.upf} />
            <SpecRow label="Fit" value={specs.fit} />
            <SpecRow label="Weight" value={specs.weight} />
            <SpecRow label="Inseam" value={specs.inseam} />
          </div>
        </div>
      </div>

      {/* Role */}
      {role && (
        <div>
          <h2 className="font-headline font-bold text-dark text-lg mb-3">
            Role
          </h2>
          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
            {role}
          </span>
        </div>
      )}

      {/* Conditions */}
      {conditions && conditions.length > 0 && (
        <div>
          <h2 className="font-headline font-bold text-dark text-lg mb-3">
            Best Conditions
          </h2>
          <div className="flex flex-wrap gap-2">
            {conditions.map((c) => (
              <span
                key={c}
                className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NutritionDetails({ product }: { product: NutritionProduct }) {
  const { specs, nutritionType, stomachFriendly } = product;

  return (
    <div className="space-y-8">
      {/* Specs */}
      <div>
        <h2 className="font-headline font-bold text-dark text-lg mb-3">
          Nutrition Facts
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="grid sm:grid-cols-2 gap-x-8">
            <SpecRow label="Calories" value={specs.calories} />
            <SpecRow label="Carbs" value={specs.carbs} />
            <SpecRow label="Sodium" value={specs.sodium} />
            <SpecRow label="Servings" value={specs.servings} />
            <SpecRow label="Caffeine" value={specs.caffeine} />
          </div>
        </div>
      </div>

      {/* Type & stomach friendly */}
      <div className="flex flex-wrap gap-3">
        {nutritionType && (
          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
            {nutritionType}
          </span>
        )}
        {stomachFriendly && (
          <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Stomach Friendly
          </span>
        )}
      </div>
    </div>
  );
}

function AccessoryDetails({ product }: { product: AccessoryProduct }) {
  const { specs } = product;
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline font-bold text-dark text-lg mb-3">
          Specifications
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="grid sm:grid-cols-2 gap-x-8">
            {entries.map(([key, value]) => (
              <SpecRow
                key={key}
                label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                value={value}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Category Label Helper ──────────────────────────────────────────────────

function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    shoes: "Shoes",
    packs: "Packs",
    apparel: "Apparel",
    nutrition: "Nutrition",
    lighting: "Lighting",
    safety: "Safety",
    recovery: "Recovery",
    accessories: "Accessories",
    footcare: "Foot Care",
  };
  return labels[cat] ?? cat;
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({ params }: Params) {
  const { productId } = await params;
  const product = getProductById(productId);

  if (!product) notFound();

  const reviewAggregate = await loadProductReviewAggregateServer(product.id);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://finishultra.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gear",
        item: "https://finishultra.com/gear",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Library",
        item: "https://finishultra.com/gear/library",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://finishultra.com/gear/library/${product.id}`,
      },
    ],
  };

  const productSchema = productJsonLd(
    productFromLibrary(product, {
      aggregateRating: reviewAggregate
        ? {
            ratingValue: reviewAggregate.ratingValue,
            reviewCount: reviewAggregate.reviewCount,
          }
        : undefined,
      reviews: reviewAggregate?.reviews,
    }),
  );

  return (
    <>
      <Header />
      <JsonLd data={[breadcrumbJsonLd, productSchema]} />

      <main className="bg-light min-h-screen">
        {/* Back link */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link
            href="/gear/library"
            className="text-sm text-primary hover:text-primary-dark transition-colors font-medium"
          >
            &larr; Back to Library
          </Link>
        </div>

        {/* Product header */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {product.brand}
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray">
              {categoryLabel(product.category)}
            </span>
            {product.subcategory && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray">
                {product.subcategory}
              </span>
            )}
            {product.beginnerPick && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                Beginner Pick
              </span>
            )}
          </div>

          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-2 leading-tight">
            {product.name}
          </h1>

          <p className="text-2xl font-bold text-accent mb-6">
            {product.priceDisplay}
          </p>

          <p className="text-base text-gray leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Why We Recommend */}
          <div className="bg-white rounded-xl border-l-4 border-primary p-5 mb-8">
            <h2 className="font-headline font-bold text-dark text-base mb-2">
              Why We Recommend It
            </h2>
            <p className="text-sm text-gray leading-relaxed">
              {product.whyWeRecommend}
            </p>
          </div>
        </section>

        {/* Category-specific content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {product.category === "shoes" && (
            <ShoeDetails product={product as ShoeProduct} />
          )}
          {product.category === "packs" && (
            <PackDetails product={product as PackProduct} />
          )}
          {product.category === "apparel" && (
            <ApparelDetails product={product as ApparelProduct} />
          )}
          {product.category === "nutrition" && (
            <NutritionDetails product={product as NutritionProduct} />
          )}
          {!["shoes", "packs", "apparel", "nutrition"].includes(
            product.category,
          ) && (
            <AccessoryDetails product={product as AccessoryProduct} />
          )}
        </section>

        {/* Affiliate links + Add to Kit */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-wrap items-center gap-4">
            <AffiliateButtons links={product.affiliateLinks} />
            <AddToKitButton product={product} />
          </div>
        </section>

        {/* Tags */}
        {product.tags.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <ReviewSection productId={product.id} />
        </section>

        {/* Comments */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <CommentSection productId={product.id} />
        </section>
      </main>

      <Footer />
    </>
  );
}
