import type { ReactNode } from "react";
import Link from "next/link";
import { PersonStanding, Dumbbell, Package, Zap, Flag, FileText } from "lucide-react";
import { PublicBlogPost, getBlogSourceLabel } from "@/lib/blog";

const categoryIcons: Record<string, ReactNode> = {
  "Getting Started": <PersonStanding className="w-8 h-8 text-primary" />,
  Training: <Dumbbell className="w-8 h-8 text-primary" />,
  Gear: <Package className="w-8 h-8 text-primary" />,
  Nutrition: <Zap className="w-8 h-8 text-primary" />,
  "Race Day": <Flag className="w-8 h-8 text-primary" />,
};

interface BlogPostCardProps {
  post: PublicBlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all"
    >
      <div className="aspect-[16/9] bg-gradient-to-br from-light to-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <>
            <span className="mb-1">
              {categoryIcons[post.category] ?? (
                <FileText className="w-8 h-8 text-primary" />
              )}
            </span>
            <span className="text-xs font-medium text-gray">{post.category}</span>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-dark">
            {getBlogSourceLabel(post.authorType)}
          </span>
          <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            {post.category}
          </span>
        </div>
        {post.featured && (
          <span className="absolute top-3 right-3 text-[10px] font-bold text-white bg-accent px-2 py-0.5 rounded-full uppercase tracking-wider">
            Featured
          </span>
        )}
        {!post.coverImageUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="mb-1">
              {categoryIcons[post.category] ?? (
                <FileText className="w-8 h-8 text-primary" />
              )}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {post.authorName}
          </span>
          <span className="text-xs text-gray ml-auto">{post.readTime}</span>
        </div>

        <h3 className="font-headline text-lg font-bold text-dark mb-2 leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="text-gray text-sm leading-relaxed mb-3 line-clamp-2">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium text-gray bg-light px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray">
          <span>
            {new Date(post.publishedAt ?? post.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <span className="text-accent font-medium">
              Updated{" "}
              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
