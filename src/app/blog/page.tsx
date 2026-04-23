import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Mail, PenSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCategoryFilter from "@/components/BlogCategoryFilter";
import { getBlogSourceLabel } from "@/lib/blog";
import { loadPublicBlogPostsServer } from "@/lib/blog-server";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ultra Running Blog — AI Guides, Community Posts & Tips | FinishUltra",
    description:
      "Browse FinishUltra's blog feed with clearly labeled Pheidi AI guides and community posts from ultra runners.",
    path: "/blog",
  }),
};

export const revalidate = 3600;

const aiNotice =
  "Some articles here are written by Pheidi, FinishUltra’s AI guide. AI articles are labeled clearly. Pheidi generates these guides after processing extensive ultrarunning information, but they are still AI-generated and should not replace professional medical, coaching, or safety advice.";

export default async function BlogPage() {
  const posts = await loadPublicBlogPostsServer();
  const featuredPosts = posts.filter((post) => post.featured);
  const heroPost = featuredPosts[0] ?? posts[0] ?? null;
  const nonHeroPosts = heroPost
    ? posts.filter((post) => post.id !== heroPost.id)
    : posts;

  return (
    <>
      <Header />
      <main>
        <section className="bg-dark relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, #FF6B00 0%, transparent 50%), radial-gradient(circle at 70% 70%, #0066FF 0%, transparent 40%)",
            }}
          />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
            <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr] items-start">
              <div>
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    Blog Feed
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    AI Guides + Community
                  </span>
                </div>
                <h1 className="font-headline text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                  FinishUltra Blog
                </h1>
                <p className="text-lg text-gray leading-relaxed mb-6 max-w-2xl">
                  One feed. Clearly labeled sources. Pheidi&apos;s AI guides live
                  alongside community posts from runners building toward their own
                  finish lines.
                </p>

                <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5 mb-8">
                  <p className="text-sm leading-relaxed text-white/90">
                    {aiNotice}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/blog/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                  >
                    <PenSquare className="w-4 h-4" />
                    Write a Community Post
                  </Link>
                  <span className="text-sm text-white/60">
                    {posts.length} published posts
                  </span>
                </div>
              </div>

              {heroPost && (
                <Link
                  href={`/blog/${heroPost.slug}`}
                  className="group block rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/5">
                    {heroPost.coverImageUrl ? (
                      <Image
                        src={heroPost.coverImageUrl}
                        alt={heroPost.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/60">
                        Featured Post
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/10 to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-dark">
                        {getBlogSourceLabel(heroPost.authorType)}
                      </span>
                      <span className="rounded-full bg-accent/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        {heroPost.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">
                      Featured
                    </p>
                    <h2 className="font-headline text-2xl font-bold text-white leading-tight mb-3 group-hover:text-accent transition-colors">
                      {heroPost.title}
                    </h2>
                    <p className="text-sm text-white/70 leading-relaxed mb-4">
                      {heroPost.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
                      <span>{heroPost.authorName}</span>
                      <span>{heroPost.readTime}</span>
                      <span>
                        {new Date(
                          heroPost.publishedAt ?? heroPost.updatedAt,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark">
                  Browse the Feed
                </h2>
                <p className="text-sm text-gray mt-2">
                  Filter by source and topic. Every AI article is explicitly
                  labeled.
                </p>
              </div>
              <Link
                href="/account/posts"
                className="text-sm font-medium text-primary hover:underline"
              >
                Manage your posts
              </Link>
            </div>

            <BlogCategoryFilter posts={nonHeroPosts} />
          </div>
        </section>

        <section className="bg-light py-12 sm:py-16 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-3">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark mb-3">
              Get New Posts in Your Inbox
            </h2>
            <p className="text-gray mb-6 max-w-xl mx-auto">
              AI guides, runner stories, gear reviews, and race-day lessons. One
              email per week.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray mt-3">Free. Unsubscribe anytime.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
