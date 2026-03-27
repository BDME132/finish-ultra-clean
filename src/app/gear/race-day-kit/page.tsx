import { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SharedKitsHubClient from "@/app/gear/race-day-kit/SharedKitsHubClient";
import { loadPublicKitsServer } from "@/lib/public-kits-server";

export const metadata: Metadata = {
  title: "Shared Kits | FinishUltra",
  description:
    "Browse public ultra running kits built by real runners. Filter by distance, terrain, and budget, then load any shared setup into your own custom builder.",
  alternates: { canonical: "/gear/race-day-kit" },
};

export default async function SharedKitsPage() {
  const initialKits = await loadPublicKitsServer();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
      { "@type": "ListItem", position: 2, name: "Gear", item: "https://finishultra.com/gear" },
      { "@type": "ListItem", position: 3, name: "Shared Kits", item: "https://finishultra.com/gear/race-day-kit" },
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
        <SharedKitsHubClient initialKits={initialKits} />
      </main>
      <Footer />
    </>
  );
}
