"use client";

import { useMemo, useState } from "react";
import BlogPostCard from "@/components/BlogPostCard";
import {
  BLOG_CATEGORIES,
  BlogSourceFilter,
  PublicBlogPost,
  applyBlogFilters,
} from "@/lib/blog";

const sourceFilters: { value: BlogSourceFilter; label: string }[] = [
  { value: "all", label: "All Posts" },
  { value: "ai", label: "AI Guides" },
  { value: "community", label: "Community Posts" },
];

interface Props {
  posts: PublicBlogPost[];
}

export default function BlogCategoryFilter({ posts }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSource, setActiveSource] = useState<BlogSourceFilter>("all");

  const filtered = useMemo(() => {
    return applyBlogFilters(posts, {
      source: activeSource,
      category: activeCategory,
    });
  }, [activeCategory, activeSource, posts]);

  return (
    <>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray mb-3">
          Source
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {sourceFilters.map((filter) => {
            const count = applyBlogFilters(posts, {
              source: filter.value,
              category: activeCategory,
            }).length;

            return (
              <button
                key={filter.value}
                onClick={() => setActiveSource(filter.value)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeSource === filter.value
                    ? "bg-dark text-white"
                    : "bg-light text-gray hover:bg-gray-200 hover:text-dark"
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`text-xs ${
                    activeSource === filter.value ? "text-white/70" : "text-gray"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {BLOG_CATEGORIES.map((category) => {
          const count = applyBlogFilters(posts, {
            source: activeSource,
            category,
          }).length;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-light text-gray hover:text-dark hover:bg-gray-200"
              }`}
            >
              <span>{category}</span>
              <span
                className={`text-xs ${
                  activeCategory === category ? "text-white/70" : "text-gray"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl border border-dashed border-gray-300 bg-light">
          <p className="font-headline text-2xl font-bold text-dark mb-2">
            No posts match those filters yet.
          </p>
          <p className="text-gray text-sm">
            Try a different source or category.
          </p>
        </div>
      )}
    </>
  );
}
