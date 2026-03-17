import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Training Dashboard | FinishUltra",
  description: "Track your ultra marathon training progress. Daily workouts, gear checklist, nutrition testing, and race countdown — all in one place.",
  alternates: { canonical: "/training/dashboard" },
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
