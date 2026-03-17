"use client";

import { useState } from "react";
import BlogPostCard from "@/components/BlogPostCard";
import { BlogPost } from "@/types/content";
import { blogCategories } from "@/lib/content/blog-posts";

interface Props {
  posts: BlogPost[];
}

export default function BlogCategoryFilter({ posts }: Props) {
  const [active, setActive] = useState<string>("All");

  const filtered =
    active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {blogCategories.map((cat) => {
          const count =
            cat === "All"
              ? posts.length
              : posts.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                active === cat
                  ? "bg-primary text-white"
                  : "bg-light text-gray hover:text-dark hover:bg-gray-200"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-xs ${
                  active === cat ? "text-white/70" : "text-gray"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray">No articles in this category yet.</p>
        </div>
      )}
    </>
  );
}
