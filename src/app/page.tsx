import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import NewsletterSignup from "@/components/NewsletterSignup";
import BlogPostCard from "@/components/BlogPostCard";
import Footer from "@/components/Footer";
import { blogPosts } from "@/lib/content/blog-posts";

export default function HomePage() {
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureGrid />
        <NewsletterSignup />

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl font-bold text-dark text-center mb-4">
              From the Blog
            </h2>
            <p className="text-gray text-center mb-12">
              Guides, gear reviews, and race reports for beginner ultra runners.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
