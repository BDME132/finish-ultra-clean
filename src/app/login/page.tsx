import { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "./LoginForm";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Log In | FinishUltra",
    description:
      "Sign in to FinishUltra to sync your training dashboard, Race HQ, and Pheidi chat. Private account page.",
    path: "/login",
    robots: { index: false, follow: false },
  }),
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-light px-4">
        <Suspense>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
