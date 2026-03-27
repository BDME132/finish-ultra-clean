import { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicKitDetailClient from "@/app/gear/race-day-kit/[slug]/PublicKitDetailClient";
import { loadPublicKitBySlugServer } from "@/lib/public-kits-server";

type SharedKitDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: SharedKitDetailPageProps,
): Promise<Metadata> {
  const { slug } = await params;
  const kit = await loadPublicKitBySlugServer(slug);

  if (!kit) {
    return {
      title: "Shared Kit Not Found | FinishUltra",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${kit.kitTitle} | Shared Kits | FinishUltra`,
    description: `${kit.kitSubtitle} Browse the full public kit from ${kit.authorDisplayName} and load it into your own custom builder.`,
    alternates: { canonical: `/gear/race-day-kit/${kit.slug}` },
  };
}

export default async function SharedKitDetailPage({ params }: SharedKitDetailPageProps) {
  const { slug } = await params;
  const kit = await loadPublicKitBySlugServer(slug);

  if (!kit) {
    notFound();
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
      { "@type": "ListItem", position: 2, name: "Gear", item: "https://finishultra.com/gear" },
      { "@type": "ListItem", position: 3, name: "Shared Kits", item: "https://finishultra.com/gear/race-day-kit" },
      { "@type": "ListItem", position: 4, name: kit.kitTitle, item: `https://finishultra.com/gear/race-day-kit/${kit.slug}` },
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
        <PublicKitDetailClient kit={kit} />
      </main>
      <Footer />
    </>
  );
}
