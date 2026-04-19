import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountNav from "@/components/account/AccountNav";
import FeedClient from "./FeedClient";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Feed | FinishUltra",
    description: "Latest training plans, gear kits, and posts from runners you follow.",
    path: "/account/feed",
    robots: { index: false, follow: false },
  }),
};

export default function AccountFeedPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-headline text-3xl font-bold text-dark mb-6">Account</h1>
          <AccountNav />
          <FeedClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
