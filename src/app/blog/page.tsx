import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import BlogPostCard from "@/components/BlogPostCard";
import BlogCategoryFilter from "@/components/BlogCategoryFilter";
import { blogPosts, getFeaturedPosts } from "@/lib/content/blog-posts";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Ultra Marathon Blog — Guides, Gear Reviews & Race Reports | FinishUltra",
  description: "Practical guides, honest gear reviews, race reports, and training advice for beginner ultra runners. Updated weekly by runners who are still learning.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const featured = getFeaturedPosts();
  const heroPost = featured[0];
  const nonHeroPosts = blogPosts.filter((p) => p.id !== heroPost.id);

  return (
    <>
      <Header />
      <main>
        {/* Hero — Featured Article */}
        <section className="bg-dark relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, #FF6B00 0%, transparent 50%), radial-gradient(circle at 70% 70%, #0066FF 0%, transparent 40%)",
            }}
          />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
                  <span>Featured</span>
                </div>
                <h1 className="font-headline text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                  {heroPost.title}
                </h1>
                <p className="text-lg text-gray leading-relaxed mb-6">
                  {heroPost.excerpt}
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                    {heroPost.category}
                  </span>
                  <span className="text-sm text-white/50">{heroPost.readTime}</span>
                  {heroPost.updatedAt && (
                    <span className="text-sm text-white/50">
                      Updated {heroPost.updatedAt}
                    </span>
                  )}
                </div>
                <Link
                  href={`/blog/${heroPost.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Read Article
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Featured articles sidebar */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                  More Featured
                </p>
                {featured.slice(1, 4).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-accent bg-accent/20 px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-white/40">{post.readTime}</span>
                    </div>
                    <h3 className="font-headline text-base font-bold text-white group-hover:text-accent transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-white/50 mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter + All Posts */}
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark">
                All Articles
              </h2>
              <span className="text-sm text-gray">
                {blogPosts.length} articles
              </span>
            </div>

            <BlogCategoryFilter posts={nonHeroPosts} />
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-light py-12 sm:py-16 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-3"><Mail className="w-8 h-8 text-primary" /></div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark mb-3">
              Get New Articles in Your Inbox
            </h2>
            <p className="text-gray mb-6 max-w-xl mx-auto">
              One email per week. Gear reviews, training tips, and race guides — no spam, no fluff.
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
