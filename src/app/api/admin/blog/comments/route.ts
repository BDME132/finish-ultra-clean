import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-server";
import { loadAdminBlogCommentsServer } from "@/lib/blog-server";

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const comments = await loadAdminBlogCommentsServer();
  return NextResponse.json({ comments });
}
