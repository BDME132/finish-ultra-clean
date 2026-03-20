import Link from "next/link";
import { BlogPost } from "@/types/content";
import { PersonStanding, Dumbbell, Package, Zap, Flag, FileText } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "Getting Started": <PersonStanding className="w-8 h-8 text-primary" />,
  Training: <Dumbbell className="w-8 h-8 text-primary" />,
  Gear: <Package className="w-8 h-8 text-primary" />,
  Nutrition: <Zap className="w-8 h-8 text-primary" />,
  "Race Day": <Flag className="w-8 h-8 text-primary" />,
};

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all"
    >
      {/* Image placeholder */}
      <div className="aspect-[16/9] bg-gradient-to-br from-light to-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
        <span className="mb-1">{categoryIcons[post.category] ?? <FileText className="w-8 h-8 text-primary" />}</span>
        <span className="text-xs font-medium text-gray">{post.category}</span>
        {post.featured && (
          <span className="absolute top-3 right-3 text-[10px] font-bold text-white bg-accent px-2 py-0.5 rounded-full uppercase tracking-wider">
            Featured
          </span>
        )}
        {/* Accent hover bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
      </div>

      <div className="p-5">
        {/* Category + meta */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-gray ml-auto">{post.readTime}</span>
        </div>

        {/* Title */}
        <h3 className="font-headline text-lg font-bold text-dark mb-2 leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray text-sm leading-relaxed mb-3 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Tags */}
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

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-gray">
          <span>{post.publishedAt}</span>
          {post.updatedAt && (
            <span className="text-accent font-medium">
              Updated {post.updatedAt}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
