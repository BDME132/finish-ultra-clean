import { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import SharedKitsHubClient from "@/app/gear/race-day-kit/SharedKitsHubClient";
import { loadPublicKitsServer } from "@/lib/public-kits-server";
import { pageMetadata } from "@/lib/seo-metadata";
import { absoluteUrl, breadcrumbJsonLdDocument, itemListJsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Shared Kits | FinishUltra",
  description:
    "Browse public ultra running kits built by real runners. Filter by distance, terrain, and budget, then load any shared setup into your own custom builder.",
  path: "/gear/race-day-kit",
});

export default async function SharedKitsPage() {
  const initialKits = await loadPublicKitsServer();

  const breadcrumbJsonLd = breadcrumbJsonLdDocument("/gear/race-day-kit", "Shared Kits");
  const sharedKitsItemListJsonLd = itemListJsonLd({
    name: "Shared ultra running kits",
    description:
      "Public runner-built ultra gear kits that can be browsed for inspiration and loaded into the FinishUltra custom builder.",
    url: absoluteUrl("/gear/race-day-kit"),
    items: initialKits.map((kit) => ({
      name: kit.kitTitle,
      url: absoluteUrl(`/gear/race-day-kit/${kit.slug}`),
      description: kit.kitSubtitle,
    })),
  });

  return (
    <>
      <Header />
      <JsonLd data={[breadcrumbJsonLd, sharedKitsItemListJsonLd]} />
      <main>
        <SharedKitsHubClient initialKits={initialKits} />
      </main>
      <Footer />
    </>
  );
}
