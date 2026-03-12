import { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log In | FinishUltra",
  description:
    "Sign in to your FinishUltra account to save your race plans, chat history, and training progress.",
  robots: { index: false, follow: false },
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
