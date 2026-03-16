import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import BlogPostCard from "@/components/BlogPostCard";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/lib/content/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | FinishUltra`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: ["FinishUltra"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

/** Simple markdown-like renderer */
function renderBody(body: string) {
  return body.split("\n\n").map((block, i) => {
    // H2
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-headline text-2xl font-bold text-dark mt-10 mb-4"
        >
          {block.replace("## ", "")}
        </h2>
      );
    }
    // H3
    if (block.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="font-headline text-xl font-bold text-dark mt-8 mb-3"
        >
          {block.replace("### ", "")}
        </h3>
      );
    }
    // List items
    if (block.startsWith("1. ") || block.startsWith("- ")) {
      const items = block.split("\n");
      const ordered = block.startsWith("1. ");
      const Tag = ordered ? "ol" : "ul";
      return (
        <Tag
          key={i}
          className={`${ordered ? "list-decimal" : "list-disc"} pl-6 space-y-2 text-gray leading-relaxed my-4`}
        >
          {items.map((item, j) => (
            <li key={j}>
              {renderInline(
                item.replace(/^[\d]+\.\s*/, "").replace(/^-\s*/, "")
              )}
            </li>
          ))}
        </Tag>
      );
    }
    // Regular paragraph
    return (
      <p key={i} className="text-gray leading-relaxed my-4">
        {renderInline(block)}
      </p>
    );
  });
}

/** Render bold and links inline */
function renderInline(text: string) {
  // Split on **bold** patterns
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-dark">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: "FinishUltra",
      url: "https://finishultra.com",
    },
    publisher: {
      "@type": "Organization",
      name: "FinishUltra",
      url: "https://finishultra.com",
      logo: {
        "@type": "ImageObject",
        url: "https://finishultra.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://finishultra.com/blog/${post.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://finishultra.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://finishultra.com/blog/${post.slug}` },
    ],
  };

  const faqJsonLd = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <main>
        <article>
          {/* Hero */}
          <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-gray">{post.readTime}</span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-gray text-sm">
                Published {post.publishedAt}
                {post.updatedAt && (
                  <span className="text-accent font-medium">
                    {" "}· Updated {post.updatedAt}
                  </span>
                )}
              </p>
              {/* Tags */}
              {post.tags?.length > 0 && (
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

          {/* Body */}
          <section className="py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose max-w-none">{renderBody(post.body)}</div>
            </div>
          </section>

          {/* Affiliate Products */}
          {post.affiliateProducts && post.affiliateProducts.length > 0 && (
            <section className="py-12 bg-light border-t border-b border-gray-100">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🛒</span>
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

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
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

          {/* Back link */}
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

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 sm:py-16 bg-light border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-headline text-2xl font-bold text-dark mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((rp) => (
                  <BlogPostCard key={rp.id} post={rp} />
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
