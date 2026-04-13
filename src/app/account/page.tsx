import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountSettings from "./AccountSettings";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Account Settings | FinishUltra",
    description:
      "Manage your FinishUltra account, email preferences, and connected sessions. Private account page.",
    path: "/account",
    robots: { index: false, follow: false },
  }),
};

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-light">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-headline text-3xl font-bold text-dark mb-8">
            Account
          </h1>
          <AccountSettings />
        </div>
      </main>
      <Footer />
    </>
  );
}
