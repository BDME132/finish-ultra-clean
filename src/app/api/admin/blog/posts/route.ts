import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-server";
import { loadAdminBlogPostsServer } from "@/lib/blog-server";

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await loadAdminBlogPostsServer();
  return NextResponse.json({ posts });
}
