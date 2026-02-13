import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { blogPosts, getPostBySlug } from "@/lib/content/blog-posts";

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
      authors: ["FinishUltra"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://finishultra.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://finishultra.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://finishultra.com/blog/${post.slug}`,
      },
    ],
  };

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
      <main>
        <article>
          <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-gray">{post.readTime}</span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-4">
                {post.title}
              </h1>
              <p className="text-gray">{post.publishedAt}</p>
            </div>
          </section>

          <section className="py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose max-w-none">
                {post.body.split("\n\n").map((paragraph, i) => {
                  if (paragraph.startsWith("## ")) {
                    return (
                      <h2 key={i} className="font-headline text-2xl font-bold text-dark mt-10 mb-4">
                        {paragraph.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith("1. ") || paragraph.startsWith("- ")) {
                    const items = paragraph.split("\n");
                    return (
                      <ul key={i} className="list-disc pl-6 space-y-2 text-gray leading-relaxed my-4">
                        {items.map((item, j) => (
                          <li key={j}>{item.replace(/^[\d]+\.\s*/, "").replace(/^-\s*/, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={i} className="text-gray leading-relaxed my-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-12 border-t border-gray-100">
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

        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
