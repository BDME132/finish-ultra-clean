import Link from "next/link";
import { BlogPost } from "@/types/content";

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all"
    >
      <div className="aspect-[16/9] bg-light flex items-center justify-center">
        <span className="text-gray text-sm">{post.category}</span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-gray ml-auto">{post.readTime}</span>
        </div>
        <h3 className="font-headline text-lg font-bold text-dark mb-2">
          {post.title}
        </h3>
        <p className="text-gray text-sm leading-relaxed">{post.excerpt}</p>
      </div>
    </Link>
  );
}
