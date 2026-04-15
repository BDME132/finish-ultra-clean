import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { loadPublishedNewsletterBySlug } from "@/lib/newsletter-archive";
import { SITE_URL } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo-metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const issue = await loadPublishedNewsletterBySlug(slug);
  if (!issue?.subject) {
    return { title: "Newsletter | FinishUltra" };
  }
  return {
    ...pageMetadata({
      title: `${issue.subject} | FinishUltra Newsletter`,
      description: `Past FinishUltra newsletter issue: ${issue.subject}`,
      path: `/newsletter/${slug}`,
    }),
    alternates: {
      canonical: `${SITE_URL}/newsletter/${slug}`,
    },
  };
}

export default async function NewsletterIssuePage({ params }: Props) {
  const { slug } = await params;
  const issue = await loadPublishedNewsletterBySlug(slug);

  if (!issue?.body || !issue.slug) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="py-12 sm:py-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray mb-2">
            <Link href="/newsletter" className="text-primary hover:underline">
              Newsletter
            </Link>
            <span className="mx-2">&rsaquo;</span>
            <span>Issue</span>
          </p>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">
            {issue.subject}
          </h1>
          {issue.published_at && (
            <p className="text-sm text-gray mb-8">
              {new Date(issue.published_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          <div
            className="prose prose-gray max-w-none newsletter-issue-body"
            dangerouslySetInnerHTML={{ __html: issue.body }}
          />
          <p className="mt-10 pt-8 border-t border-gray-200">
            <Link href="/newsletter" className="text-primary font-medium hover:underline">
              &larr; Back to newsletter
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
