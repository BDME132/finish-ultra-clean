import { Metadata } from "next";
import Header from "@/components/Header";
import RaceHQClient from "./RaceHQClient";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Dashboard — Your Race Prep Hub | FinishUltra",
    description:
      "Track your training plan, gear kit, and race-day checklists in one place. Sign in to access your dashboard.",
    path: "/race-hq",
  }),
};

export default function RaceHQPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-light">
        <RaceHQClient />
      </main>
    </>
  );
}
