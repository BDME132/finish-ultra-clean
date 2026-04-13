import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardClient from "./DashboardClient";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Training Dashboard | FinishUltra",
    description:
      "Track workouts, long runs, gear tests, and race countdown in your private ultra training dashboard. Sign in required.",
    path: "/training/dashboard",
    robots: { index: false, follow: false },
  }),
};

export default function TrainingDashboardPage() {
  return (
    <>
      <Header />
      <DashboardClient />
      <Footer />
    </>
  );
}
