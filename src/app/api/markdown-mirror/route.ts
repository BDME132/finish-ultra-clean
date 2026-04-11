import { NextRequest, NextResponse } from "next/server";
import { getMarkdownForPath, notFoundMarkdown } from "@/lib/markdown-mirrors";

const HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
};

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") ?? "/";
  const markdown = getMarkdownForPath(path);

  if (!markdown) {
    return new NextResponse(notFoundMarkdown(path), {
      status: 404,
      headers: HEADERS,
    });
  }

  return new NextResponse(markdown, {
    status: 200,
    headers: HEADERS,
  });
}
