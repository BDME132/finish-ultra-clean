import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Newsletter preferences | FinishUltra",
};

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const ok = status === "ok";

  return (
    <>
      <Header />
      <main className="min-h-[50vh] py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          {ok ? (
            <>
              <h1 className="font-headline text-2xl font-bold text-dark mb-3">
                You&apos;re unsubscribed
              </h1>
              <p className="text-gray mb-6">
                You won&apos;t receive any more FinishUltra newsletter emails at this address.
                We&apos;re sorry to see you go — you can always sign up again on the homepage.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-headline text-2xl font-bold text-dark mb-3">
                Link invalid or expired
              </h1>
              <p className="text-gray mb-6">
                This unsubscribe link may have expired. Contact us at{" "}
                <a
                  href="mailto:hello@finishultra.com"
                  className="text-primary underline"
                >
                  hello@finishultra.com
                </a>{" "}
                and we&apos;ll remove you from the list.
              </p>
            </>
          )}
          <Link
            href="/"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            &larr; Back to FinishUltra
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
