#!/usr/bin/env tsx
/**
 * FinishUltra Scheduled Post Publisher
 *
 * Run by the GitHub Action daily at 8am UTC.
 * Also safe to run manually: npx tsx scripts/publish-scheduled.ts
 *
 * What it does:
 *   1. Reads all .md files in content/scheduled/
 *   2. Parses frontmatter — looks for publishDate field
 *   3. If publishDate <= today, converts the post to a BlogPost TS object
 *   4. Appends the new object to src/lib/content/blog-posts.ts
 *   5. Moves the file to content/published/ (archive)
 *   6. Logs everything clearly
 *
 * NO API CALLS — this script is fully offline.
 * The GitHub Action commits the blog-posts.ts change, triggering Vercel rebuild.
 */

import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const SCHEDULED_DIR = path.join(ROOT, "content", "scheduled");
const PUBLISHED_DIR = path.join(ROOT, "content", "published");
const BLOG_POSTS_FILE = path.join(ROOT, "src", "lib", "content", "blog-posts.ts");

// Marker in blog-posts.ts — we insert before the closing ]; of the array
// The file ends with:  },\n];\n\nexport const blogCategories
const ARRAY_CLOSE_MARKER = "\n];\n\nexport const blogCategories";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function isDue(publishDate: string): boolean {
  return publishDate <= today();
}

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function slugExists(slug: string, blogPostsContent: string): boolean {
  return blogPostsContent.includes(`slug: "${slug}"`);
}

/**
 * Escape a string for use inside a TypeScript template literal (backtick string).
 * Escapes backticks and ${} expressions.
 */
function escapeTemplateLiteral(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

/**
 * Serialize a value as a TypeScript literal for injection into source code.
 */
function tsLiteral(value: unknown): string {
  if (value === undefined || value === null) return "undefined";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const items = value.map((v) => `    ${tsLiteral(v)}`).join(",\n");
    return `[\n${items},\n  ]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `      ${k}: ${tsLiteral(v)}`);
    return `{\n${entries.join(",\n")},\n    }`;
  }
  return JSON.stringify(value);
}

/**
 * Build the TypeScript object literal for a new BlogPost, ready to insert into the array.
 */
function buildPostObject(data: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  publishedAt: string;
  image: string;
  readTime: string;
  authorType?: "ai" | "member";
  relatedSlugs?: string[];
  faq?: { question: string; answer: string }[];
}): string {
  const lines: string[] = ["  {"];

  lines.push(`    id: ${JSON.stringify(data.id)},`);
  lines.push(`    title: ${JSON.stringify(data.title)},`);
  lines.push(`    slug: ${JSON.stringify(data.slug)},`);
  lines.push(`    excerpt: ${JSON.stringify(data.excerpt)},`);
  lines.push(`    body: \`${escapeTemplateLiteral(data.body)}\`,`);
  lines.push(`    category: ${JSON.stringify(data.category)},`);
  lines.push(`    tags: ${JSON.stringify(data.tags)},`);
  lines.push(`    publishedAt: ${JSON.stringify(data.publishedAt)},`);
  lines.push(`    image: ${JSON.stringify(data.image)},`);
  lines.push(`    readTime: ${JSON.stringify(data.readTime)},`);
  if (data.authorType) {
    lines.push(`    authorType: ${JSON.stringify(data.authorType)},`);
  }

  if (data.relatedSlugs && data.relatedSlugs.length > 0) {
    lines.push(`    relatedSlugs: ${JSON.stringify(data.relatedSlugs)},`);
  }

  if (data.faq && data.faq.length > 0) {
    const faqItems = data.faq
      .map((f) => `      { question: ${JSON.stringify(f.question)}, answer: ${JSON.stringify(f.answer)} }`)
      .join(",\n");
    lines.push(`    faq: [\n${faqItems},\n    ],`);
  }

  lines.push("  },");
  return lines.join("\n");
}

/**
 * Extract excerpt from body: first non-empty line that's a paragraph (not a heading).
 */
function extractExcerpt(body: string): string {
  const lines = body.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("-") && !trimmed.startsWith("*")) {
      // Remove markdown bold markers
      const clean = trimmed.replace(/\*\*/g, "").slice(0, 200);
      return clean.length < trimmed.length ? clean + "..." : clean;
    }
  }
  return "";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\n📅 FinishUltra Scheduled Publisher — ${today()}\n`);

  // Ensure directories exist
  fs.mkdirSync(SCHEDULED_DIR, { recursive: true });
  fs.mkdirSync(PUBLISHED_DIR, { recursive: true });

  // Find .md files in content/scheduled/
  const files = fs.readdirSync(SCHEDULED_DIR).filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    console.log("   No scheduled posts found in content/scheduled/\n");
    return;
  }

  console.log(`   Found ${files.length} scheduled post(s)\n`);

  const blogPostsContent = fs.readFileSync(BLOG_POSTS_FILE, "utf-8");
  let updatedContent = blogPostsContent;
  let publishedCount = 0;
  const published: string[] = [];

  for (const file of files) {
    const filePath = path.join(SCHEDULED_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");

    let data: Record<string, unknown>;
    let content: string;
    try {
      const parsed = matter(raw);
      data = parsed.data as Record<string, unknown>;
      content = parsed.content.trim();
    } catch (err) {
      console.log(`   ⚠️  ${file}: Failed to parse frontmatter — skipping`);
      continue;
    }

    const publishDate = data.publishDate as string;
    if (!publishDate) {
      console.log(`   ⚠️  ${file}: No publishDate in frontmatter — skipping`);
      continue;
    }

    if (!isDue(publishDate)) {
      const daysUntil = Math.ceil(
        (new Date(publishDate).getTime() - new Date().getTime()) / 86400000
      );
      console.log(`   ⏳ ${file}: scheduled for ${publishDate} (${daysUntil} days away)`);
      continue;
    }

    const title = (data.title as string) || path.basename(file, ".md");
    const slug = (data.slug as string) || toSlug(title);

    // Check for duplicates
    if (slugExists(slug, updatedContent)) {
      console.log(`   ⚠️  ${file}: slug "${slug}" already exists in blog-posts.ts — skipping`);
      continue;
    }

    console.log(`   🚀 Publishing: "${title}" (${publishDate})`);

    // Parse FAQ from faqJson field
    let faq: { question: string; answer: string }[] = [];
    if (data.faqJson) {
      try {
        faq = JSON.parse(data.faqJson as string);
      } catch {
        console.log(`      ⚠️  Could not parse faqJson — FAQ will be empty`);
      }
    }

    // Build post object
    const rawAuthorType = data.authorType as string | undefined;
    const authorType = rawAuthorType === "ai" ? "ai" : "member";

    const postData = {
      id: slug,
      title,
      slug,
      excerpt: (data.description as string) || extractExcerpt(content),
      body: content,
      category: (data.category as string) || "Getting Started",
      tags: (data.tags as string[]) || [],
      publishedAt: publishDate,
      image: (data.image as string) || `/images/blog/${slug}.jpg`,
      readTime: (data.readTime as string) || "5 min read",
      authorType: authorType as "ai" | "member",
      relatedSlugs: (data.relatedSlugs as string[]) || [],
      faq,
    };

    const postObject = buildPostObject(postData);

    // Insert into blog-posts.ts before the array closing
    if (!updatedContent.includes(ARRAY_CLOSE_MARKER)) {
      console.log(`   ❌  Could not find array close marker in blog-posts.ts — skipping`);
      continue;
    }

    updatedContent = updatedContent.replace(
      ARRAY_CLOSE_MARKER,
      `\n${postObject}${ARRAY_CLOSE_MARKER}`
    );

    // Move to published archive
    const archivePath = path.join(PUBLISHED_DIR, file);
    fs.copyFileSync(filePath, archivePath);
    fs.unlinkSync(filePath);

    publishedCount++;
    published.push(`${title} → /blog/${slug}`);
    console.log(`      ✅ Inserted into blog-posts.ts`);
    console.log(`      📁 Archived to content/published/${file}`);
  }

  // Write updated blog-posts.ts
  if (publishedCount > 0) {
    fs.writeFileSync(BLOG_POSTS_FILE, updatedContent, "utf-8");
    console.log(`\n✅ Published ${publishedCount} post(s):`);
    for (const p of published) {
      console.log(`   • ${p}`);
    }
    console.log(`\n   blog-posts.ts updated — Vercel will rebuild on git push\n`);
  } else {
    console.log("\n   No posts were due for publishing today.\n");
  }
}

main().catch((err) => {
  console.error("\n❌  Publisher error:", err.message, "\n");
  process.exit(1);
});
