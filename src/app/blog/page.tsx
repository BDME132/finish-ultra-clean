import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostCard from "@/components/BlogPostCard";
import { blogPosts } from "@/lib/content/blog-posts";

export const metadata: Metadata = {
  title: "Blog | FinishUltra",
  description: "Guides, gear reviews, and race reports for beginner ultra runners. Practical advice from runners who are still learning.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Blog
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Guides, gear reviews, and race reports. Everything we wish someone had told us when we started.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
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
