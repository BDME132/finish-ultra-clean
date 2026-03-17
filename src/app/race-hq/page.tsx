import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RaceHQClient from "./RaceHQClient";

export const metadata: Metadata = {
  title: "Race HQ | FinishUltra",
  description: "Your personal race prep command center. View your training plan and gear kit in one place.",
  robots: { index: false, follow: false },
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
