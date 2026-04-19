import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountNav from "@/components/account/AccountNav";
import FollowsList from "../FollowsList";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Followers | FinishUltra",
    description: "Runners following your training updates, kits, and races.",
    path: "/account/followers",
    robots: { index: false, follow: false },
  }),
};

export default function AccountFollowersPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-headline text-3xl font-bold text-dark mb-6">Account</h1>
          <AccountNav />
          <FollowsList direction="followers" />
        </div>
      </main>
      <Footer />
    </>
  );
}
