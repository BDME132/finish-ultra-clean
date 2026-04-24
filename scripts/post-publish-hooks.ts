#!/usr/bin/env tsx
/**
 * FinishUltra Post-Publish Hooks
 *
 * Runs automatically after publish-scheduled.ts in the GitHub Action.
 * Also safe to run manually after adding any post to blog-posts.ts.
 *
 * What it does:
 *   1. Reads all post slugs from blog-posts.ts
 *   2. Compares against the list in public/llms.txt
 *   3. Appends any missing blog post markdown mirror URLs to llms.txt
 *
 * The sitemap and markdown mirror API already handle new posts dynamically,
 * so no changes are needed there.
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
const BLOG_POSTS_FILE = path.join(ROOT, "src", "lib", "content", "blog-posts.ts");
const LLMS_TXT_FILE = path.join(ROOT, "public", "llms.txt");
const BASE_URL = "https://www.finishultra.com";

// ---------------------------------------------------------------------------
// Extract slugs + titles + excerpts from blog-posts.ts via regex
// ---------------------------------------------------------------------------
function extractPostsFromSource(source: string): { slug: string; title: string; excerpt: string }[] {
  // Split by top-level objects (each starts with a leading `{` after array entry)
  const results: { slug: string; title: string; excerpt: string }[] = [];
  const slugMatches = [...source.matchAll(/slug:\s*["']([^"']+)["']/g)];
  const titleMatches = [...source.matchAll(/title:\s*["']([^"']+)["']/g)];
  const excerptMatches = [...source.matchAll(/excerpt:\s*["'`]([^"'`]+)["'`]/g)];

  for (let i = 0; i < slugMatches.length; i++) {
    results.push({
      slug: slugMatches[i][1],
      title: titleMatches[i]?.[1] ?? slugMatches[i][1],
      excerpt: excerptMatches[i]?.[1]?.slice(0, 120).replace(/\n/g, " ") ?? "",
    });
  }
  return results;
}

// Keep backward-compat alias
function extractSlugsFromSource(source: string): string[] {
  return extractPostsFromSource(source).map((p) => p.slug);
}

// ---------------------------------------------------------------------------
// Parse existing mirror URLs from llms.txt
// ---------------------------------------------------------------------------
function extractExistingMirrors(llmsTxt: string): Set<string> {
  const lines = llmsTxt.split("\n");
  const mirrors = new Set<string>();
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- https://") || trimmed.startsWith("https://")) {
      mirrors.add(trimmed.replace(/^-\s*/, "").trim());
    }
  }
  return mirrors;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  console.log("\n🔗 Running post-publish hooks...\n");

  if (!fs.existsSync(BLOG_POSTS_FILE)) {
    console.error("   ❌  blog-posts.ts not found\n");
    process.exit(1);
  }

  if (!fs.existsSync(LLMS_TXT_FILE)) {
    console.error("   ❌  public/llms.txt not found\n");
    process.exit(1);
  }

  const source = fs.readFileSync(BLOG_POSTS_FILE, "utf-8");
  const posts = extractPostsFromSource(source);
  console.log(`   Found ${posts.length} blog posts in blog-posts.ts`);

  const llmsTxt = fs.readFileSync(LLMS_TXT_FILE, "utf-8");
  const existingMirrors = extractExistingMirrors(llmsTxt);

  // Find which slugs are missing a mirror URL
  const missing: typeof posts = [];
  for (const post of posts) {
    const mirrorUrl = `${BASE_URL}/blog/${post.slug}/index.md`;
    if (!existingMirrors.has(mirrorUrl)) {
      missing.push(post);
    }
  }

  if (missing.length === 0) {
    console.log("   ✅  llms.txt is up to date — no changes needed\n");
    return;
  }

  console.log(`   Adding ${missing.length} missing mirror URL(s) to llms.txt:`);
  for (const post of missing) {
    console.log(`   + /blog/${post.slug}/index.md`);
  }

  // Append to the Blog Posts section in llms.txt — rich format with title and summary
  const newLines = missing
    .map((post) => {
      const url = `${BASE_URL}/blog/${post.slug}/index.md`;
      const summary = post.excerpt ? ` — ${post.excerpt}` : "";
      return `- [${post.title}](${url})${summary}`;
    })
    .join("\n");

  // Find the Blog Posts section and append after its last entry
  const blogSectionMarker = "### Blog Posts";
  if (llmsTxt.includes(blogSectionMarker)) {
    // Find the end of the Blog Posts section (next ### or end of file)
    const afterMarker = llmsTxt.indexOf(blogSectionMarker) + blogSectionMarker.length;
    const nextSection = llmsTxt.indexOf("\n###", afterMarker);

    if (nextSection === -1) {
      // Blog Posts is the last section — append at end
      const updated = llmsTxt.trimEnd() + "\n" + newLines + "\n";
      fs.writeFileSync(LLMS_TXT_FILE, updated, "utf-8");
    } else {
      // Insert before the next section
      const before = llmsTxt.slice(0, nextSection);
      const after = llmsTxt.slice(nextSection);
      const updated = before.trimEnd() + "\n" + newLines + "\n" + after;
      fs.writeFileSync(LLMS_TXT_FILE, updated, "utf-8");
    }
  } else {
    // No Blog Posts section found — append to end
    const updated = llmsTxt.trimEnd() + "\n\n### Blog Posts\n" + newLines + "\n";
    fs.writeFileSync(LLMS_TXT_FILE, updated, "utf-8");
  }

  console.log("   ✅  llms.txt updated\n");
}

main();
