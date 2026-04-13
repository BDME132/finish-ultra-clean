import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RaceHQClient from "./RaceHQClient";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Race HQ — Your Race Prep Hub | FinishUltra",
    description:
      "Private race dashboard: your training plan, gear kit, and checklists in one place. Sign in required.",
    path: "/race-hq",
    robots: { index: false, follow: false },
  }),
};

export default function RaceHQPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-light">
        <RaceHQClient />
      </main>
      <Footer />
    </>
  );
}
