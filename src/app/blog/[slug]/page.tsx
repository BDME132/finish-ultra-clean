import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import BlogPostCard from "@/components/BlogPostCard";
import JsonLd from "@/components/JsonLd";
import PeopleAlsoAsk from "@/components/PeopleAlsoAsk";
import MarkdownContent from "@/components/blog/MarkdownContent";
import BlogComments from "@/app/blog/[slug]/BlogComments";
import {
  getBlogSourceLabel,
  getRelatedBlogPosts,
} from "@/lib/blog";
import {
  loadPublicBlogPostBySlugServer,
  loadPublicBlogPostsServer,
  loadVisibleBlogCommentsServer,
} from "@/lib/blog-server";
import { hasSupabaseServerEnv } from "@/lib/supabase/server";
import {
  blogPostingJsonLd,
  breadcrumbJsonLdDocument,
  faqPageJsonLd,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/seo-metadata";

const peopleAlsoAskBySlug: Record<string, { question: string; href: string }[]> = {
  "how-hard-is-a-50k": [
    { question: "What is an ultramarathon?", href: "/faq#what-is-an-ultramarathon" },
    { question: "Do I need to run a marathon before running an ultra?", href: "/faq#do-i-need-a-marathon" },
    { question: "Can a beginner run an ultramarathon?", href: "/faq#can-a-beginner-run-an-ultramarathon" },
    { question: "Am I too slow to run an ultra?", href: "/faq#am-i-too-slow-for-an-ultra" },
  ],
  "choosing-first-ultra": [
    { question: "What distance should I run for my first ultra?", href: "/faq#what-distance-first" },
    { question: "How do I know if I'm ready for an ultramarathon?", href: "/faq#how-do-i-know-if-im-ready" },
    { question: "How long does it take to train for an ultramarathon?", href: "/faq#how-long-to-train" },
  ],
  "first-50k-training-guide": [
    { question: "How many miles per week should I run to train for a 50K?", href: "/faq#miles-per-week-50k" },
    { question: "How long should my longest training run be before a 50K?", href: "/faq#longest-training-run" },
    { question: "What are back-to-back long runs?", href: "/faq#back-to-back-long-runs" },
    { question: "What's the taper for a 50K?", href: "/faq#taper-50k" },
  ],
  "ultra-nutrition-beginners": [
    { question: "What should I eat during an ultra?", href: "/faq#what-to-eat-during-ultra" },
    { question: "What is bonking and how do I avoid it?", href: "/faq#what-is-bonking" },
    { question: "What are electrolytes and why do they matter?", href: "/faq#what-are-electrolytes" },
    { question: "How do I train my gut for eating during runs?", href: "/faq#gut-training" },
  ],
  "race-day-checklist": [
    { question: "What should I expect at my first ultra?", href: "/faq#what-to-expect-first-ultra" },
    { question: "How do I pace a 50K?", href: "/faq#how-to-pace-50k" },
    { question: "Do I need a crew or pacer for a 50K?", href: "/faq#do-i-need-crew-pacer" },
    { question: "What is a DNF and is it okay to drop out?", href: "/faq#what-is-dnf" },
  ],
  "strength-training-ultra-runners": [
    { question: "How important is strength training for ultra runners?", href: "/faq#strength-training" },
    { question: "How many days per week should I run?", href: "/faq#days-per-week" },
    { question: "How do I prevent injuries during ultra training?", href: "/faq#prevent-injuries-training" },
  ],
  "what-to-wear-first-ultra": [
    { question: "What shoes should I wear for my first ultra?", href: "/faq#what-shoes-for-first-ultra" },
    { question: "Do I need different socks for trail running?", href: "/faq#trail-socks" },
    { question: "Do I need a running vest or hydration pack?", href: "/faq#do-i-need-a-vest" },
  ],
  "electrolyte-guide-ultra-runners": [
    { question: "What are electrolytes and why do they matter?", href: "/faq#what-are-electrolytes" },
    { question: "How much water should I drink during an ultra?", href: "/faq#how-much-water" },
    { question: "What should I eat during an ultra?", href: "/faq#what-to-eat-during-ultra" },
  ],
  "real-food-ultra-marathon": [
    { question: "Why do ultra runners eat real food instead of gels?", href: "/faq#real-food-vs-gels" },
    { question: "What should I eat during an ultra?", href: "/faq#what-to-eat-during-ultra" },
    { question: "What is bonking and how do I avoid it?", href: "/faq#what-is-bonking" },
  ],
  "best-running-vests-2025": [
    { question: "Do I need a running vest or hydration pack?", href: "/faq#do-i-need-a-vest" },
    { question: "What should I carry during a 50K?", href: "/faq#what-to-carry" },
    { question: "How much gear do I need for my first ultra?", href: "/faq#how-much-gear" },
  ],
};

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  const posts = await loadPublicBlogPostsServer();
  return posts.map((post) => ({ slug: post.slug }));
}

const aiDisclaimer =
  "Written by Pheidi (AI). This article was generated by AI after reviewing extensive ultrarunning information. Verify important medical, training, and safety decisions independently.";

// ─── Quick Answer extraction ──────────────────────────────────────────────────
// Detects a leading "**Quick Answer:** ..." paragraph and separates it from body.
function extractQuickAnswer(body: string): { quickAnswer: string | null; restBody: string } {
  const trimmed = body.trimStart();
  const match = trimmed.match(/^\*\*Quick Answer:\*\*\s*([\s\S]+?)(?=\n\n|\n##|\n###|$)/);
  if (match) {
    const fullMatch = `**Quick Answer:** ${match[1]}`;
    const rest = trimmed.slice(fullMatch.length).trimStart();
    return { quickAnswer: match[1].trim(), restBody: rest };
  }
  return { quickAnswer: null, restBody: body };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPublicBlogPostBySlugServer(slug);
  if (!post) return {};

  return pageMetadata({
    title: `${post.title} | FinishUltra`,
    description: post.excerpt,
    path: `/blog/${slug}`,
    ogImage: post.coverImageUrl || undefined,
    ogType: "article",
    ogArticle: {
      publishedTime: post.publishedAt ?? post.createdAt,
      modifiedTime: post.updatedAt ?? post.publishedAt ?? post.createdAt,
      authors: [post.authorName],
      tags: post.tags,
    },
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await loadPublicBlogPostBySlugServer(slug);

  if (!post) {
    notFound();
  }

  const [allPosts, comments] = await Promise.all([
    loadPublicBlogPostsServer(),
    loadVisibleBlogCommentsServer(post.id),
  ]);
  const relatedPosts = getRelatedBlogPosts(post, allPosts, 3);

  const structuredData: Record<string, unknown>[] = [
    blogPostingJsonLd(post),
    breadcrumbJsonLdDocument(`/blog/${post.slug}`, post.title),
  ];
  if (post.faq.length) {
    structuredData.push(
      faqPageJsonLd(
        post.faq.map((f) => ({ question: f.question, answer: f.answer })),
      ),
    );
  }

  return (
    <>
      <Header />
      <JsonLd data={structuredData} />
      <main>
        <article>
          <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {getBlogSourceLabel(post.authorType)}
                </span>
                <span className="text-sm font-medium text-dark bg-gray-100 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-gray">{post.readTime}</span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-gray text-sm">
                By <span className="font-semibold text-dark">{post.authorName}</span>
                {" "}· Published{" "}
                {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {post.updatedAt && (
                  <span className="text-accent font-medium">
                    {" "}· Updated{" "}
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-gray bg-gray-100 px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {post.authorType === "ai" && (
            <section className="pb-4">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-accent/30 bg-accent/10 px-5 py-4">
                  <p className="text-sm text-dark leading-relaxed">
                    {aiDisclaimer}
                  </p>
                </div>
              </div>
            </section>
          )}

          {post.coverImageUrl && (
            <section className="pb-4">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-cover"
                  />
                </div>
              </div>
            </section>
          )}

          {(() => {
            const { quickAnswer, restBody } = extractQuickAnswer(post.bodyMarkdown);
            return (
              <>
                {quickAnswer && (
                  <section className="pb-2 pt-6">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="rounded-2xl border-l-4 border-primary bg-primary/5 px-6 py-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Quick Answer</p>
                        <p className="text-dark leading-relaxed text-sm sm:text-base">{quickAnswer}</p>
                      </div>
                    </div>
                  </section>
                )}
                <section className="py-12">
                  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <MarkdownContent markdown={restBody} className="prose max-w-none" />
                  </div>
                </section>
              </>
            );
          })()}

          {post.affiliateProducts.length > 0 && (
            <section className="py-12 bg-light border-t border-b border-gray-100">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingCart className="w-6 h-6 text-primary flex-shrink-0" />
                  <h2 className="font-headline text-xl font-bold text-dark">
                    Products Mentioned in This Article
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {post.affiliateProducts.map((product) => (
                    <div
                      key={product.name}
                      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          {product.brand}
                        </span>
                        <span className="text-sm font-bold text-dark">
                          {product.price}
                        </span>
                      </div>
                      <h3 className="font-headline text-base font-bold text-dark mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray mb-3 leading-relaxed">
                        {product.why}
                      </p>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-dark text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors"
                      >
                        Check Price
                        <svg
                          className="w-3 h-3 opacity-70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray mt-4 leading-relaxed">
                  Affiliate Disclosure: Links above may earn FinishUltra a small
                  commission at no additional cost to you.
                </p>
              </div>
            </section>
          )}

          {peopleAlsoAskBySlug[post.slug] && (
            <PeopleAlsoAsk items={peopleAlsoAskBySlug[post.slug]} />
          )}

          {post.faq.length > 0 && (
            <section className="py-12">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="font-headline text-2xl font-bold text-dark mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {post.faq.map((item) => (
                    <details
                      key={item.question}
                      className="group bg-light rounded-xl border border-gray-100"
                    >
                      <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-headline font-semibold text-dark text-sm list-none">
                        {item.question}
                        <svg
                          className="w-4 h-4 text-gray flex-shrink-0 transition-transform group-open:rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <div className="px-5 pb-4">
                        <p className="text-sm text-gray leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          )}

          <BlogComments
            postId={post.id}
            initialComments={comments}
            isConfigured={hasSupabaseServerEnv()}
          />

          {/* Author bio */}
          <section className="py-10 border-t border-gray-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-start gap-4 bg-light rounded-2xl p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Written by</p>
                  <p className="font-headline font-bold text-dark text-base mb-1">
                    <Link href="/about" className="hover:text-primary transition-colors">FinishUltra Team</Link>
                  </p>
                  <p className="text-sm text-gray leading-relaxed">
                    We&apos;re beginner ultra runners who built the resource we wish existed when we started. Everything on FinishUltra is written from real experience on the trail — no fluff, no elite jargon.{" "}
                    <Link href="/about" className="text-primary hover:underline">Learn more about us →</Link>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-8 border-t border-gray-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Link
                href="/blog"
                className="text-primary font-medium hover:underline"
              >
                &larr; Back to Blog
              </Link>
            </div>
          </section>
        </article>

        {relatedPosts.length > 0 && (
          <section className="py-12 sm:py-16 bg-light border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-headline text-2xl font-bold text-dark mb-8 text-center">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}

        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
