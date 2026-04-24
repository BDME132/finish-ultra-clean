#!/usr/bin/env tsx
/**
 * FinishUltra Blog Post Generator
 *
 * Calls the Anthropic API to generate a fully SEO/AEO-optimized blog post,
 * then saves it as a scheduled .md file ready for publish-scheduled.ts to pick up.
 *
 * Usage:
 *   npm run generate-post -- \
 *     --topic="Best Trail Shoes for Beginners" \
 *     --keyword="best trail running shoes beginners" \
 *     --secondary="trail shoes under 150, hoka vs altra beginners" \
 *     --words=1800
 *
 *   Or from the CSV calendar (used by GitHub Actions):
 *   npm run generate-post -- --from-csv
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const OpenAI = require("openai").default ?? require("openai");
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
const SCHEDULED_DIR = path.join(ROOT, "content", "scheduled");
const CALENDAR_FILE = path.join(ROOT, "content", "blog-calendar.csv");
const LLMS_TXT_FILE = path.join(ROOT, "public", "llms.txt");
const BASE_URL = "https://www.finishultra.com";

// ─── CLI argument parsing ─────────────────────────────────────────────────────

function parseArgs(): {
  topic: string;
  keyword: string;
  secondary: string;
  words: number;
  fromCsv: boolean;
} {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const entry = args.find((a) => a.startsWith(`--${flag}=`));
    return entry ? entry.split("=").slice(1).join("=") : null;
  };

  return {
    topic: get("topic") ?? "",
    keyword: get("keyword") ?? "",
    secondary: get("secondary") ?? "",
    words: parseInt(get("words") ?? "1500", 10),
    fromCsv: args.includes("--from-csv"),
  };
}

// ─── CSV helpers ──────────────────────────────────────────────────────────────

interface CalendarRow {
  topic: string;
  primary_keyword: string;
  secondary_keywords: string;
  word_count: number;
  status: "pending" | "published";
  lineIndex: number;
}

function parseCalendarCsv(): CalendarRow[] {
  if (!fs.existsSync(CALENDAR_FILE)) {
    throw new Error(`Calendar file not found: ${CALENDAR_FILE}`);
  }
  const lines = fs.readFileSync(CALENDAR_FILE, "utf-8").split("\n");
  const rows: CalendarRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // CSV parse — handle quoted commas
    const cols: string[] = line.match(/(".*?"|[^,]+)(?=,|$)/g) ?? [];
    const clean = (s: string | undefined) => (s ?? "").replace(/^"|"$/g, "").trim();

    rows.push({
      topic: clean(cols[0]),
      primary_keyword: clean(cols[1]),
      secondary_keywords: clean(cols[2]),
      word_count: parseInt(clean(cols[3]) || "1500", 10),
      status: (clean(cols[4]) || "pending") as "pending" | "published",
      lineIndex: i,
    });
  }
  return rows;
}

function markCsvRowPublished(lineIndex: number): void {
  const lines = fs.readFileSync(CALENDAR_FILE, "utf-8").split("\n");
  const cols: string[] = lines[lineIndex].match(/(".*?"|[^,]+)(?=,|$)/g) ?? [];
  // Replace last column (status) with "published"
  if (cols.length >= 5) {
    cols[4] = "published";
  } else {
    while (cols.length < 4) cols.push("");
    cols.push("published");
  }
  lines[lineIndex] = cols.join(",");
  fs.writeFileSync(CALENDAR_FILE, lines.join("\n"), "utf-8");
  console.log(`   ✅  Marked row ${lineIndex} as published in blog-calendar.csv`);
}

// ─── Slug generation ──────────────────────────────────────────────────────────

function toSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── Publish date: next Tuesday or Friday ────────────────────────────────────

function nextPublishDate(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 2=Tue, 5=Fri
  let daysUntil = 1;
  if (day < 2) daysUntil = 2 - day;
  else if (day < 5) daysUntil = 5 - day;
  else daysUntil = 9 - day; // next Tuesday
  now.setDate(now.getDate() + daysUntil);
  return now.toISOString().split("T")[0];
}

// ─── AI generation ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the expert content writer for FinishUltra, the #1 resource for beginner ultramarathon runners.

Voice: Encouraging, practical, honest. You've run ultras. You know what it's actually like. No fluff, no padding, no vague motivational filler. Write like you're talking to a friend who's nervous about their first 50K.

Format rules you MUST follow exactly:
1. Start the ENTIRE post with a "**Quick Answer:**" paragraph (no heading above it) — 2-3 sentences that directly answer the primary question. This is critical for AI citation.
2. Use one H1 (title is handled by frontmatter — do NOT repeat it in the body)
3. H2s must be full questions (e.g. "## What Shoes Are Best for Beginners?")
4. H3s for sub-points under H2s
5. Never skip heading levels
6. Include EXACTLY 3 internal links using this format: [anchor text](/path) — choose from: /training/first-50k, /gear, /gear/shoes, /gear/packs, /gear/nutrition, /tools/pace-calculator, /tools/glossary, /blog, /pheidi
7. Include EXACTLY 2 affiliate placeholders formatted as: [AFFILIATE: product name here]
8. End with a "## Frequently Asked Questions" section with EXACTLY 6 questions and thorough answers
9. Target word count must be met
10. No markdown tables — use bullet lists or numbered lists instead`;

async function generatePostContent(
  topic: string,
  keyword: string,
  secondary: string,
  words: number,
): Promise<{
  title: string;
  slug: string;
  description: string;
  body: string;
  tags: string[];
  category: string;
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = new (OpenAI as any)({ apiKey: process.env.OPENAI_API_KEY });

  const userPrompt = `Write a complete blog post for FinishUltra.

Topic: ${topic}
Primary keyword (use in H1, intro, and throughout): ${keyword}
Secondary keywords to weave in naturally: ${secondary}
Target word count: ${words} words

Generate:
1. An SEO-optimized title (50-60 characters, primary keyword first)
2. A meta description (150-160 characters, includes keyword + gentle CTA)
3. A category (one of: Getting Started, Training, Gear, Nutrition, Race Day, Stories)
4. 4-6 tags as a comma-separated list
5. The full post body following ALL format rules in the system prompt

Return your response in this EXACT format with these exact delimiters:

TITLE: [title here]
DESCRIPTION: [meta description here]
CATEGORY: [category here]
TAGS: [tag1, tag2, tag3, tag4]
BODY:
[full post body here — everything after this line until end of response]`;

  console.log(`\n   🤖  Generating post for: "${topic}"...`);

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 8096,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "";

  // Parse structured response
  const titleMatch = raw.match(/^TITLE:\s*(.+)$/m);
  const descMatch = raw.match(/^DESCRIPTION:\s*(.+)$/m);
  const catMatch = raw.match(/^CATEGORY:\s*(.+)$/m);
  const tagsMatch = raw.match(/^TAGS:\s*(.+)$/m);
  const bodyMatch = raw.match(/^BODY:\n([\s\S]+)$/m);

  if (!titleMatch || !bodyMatch) {
    throw new Error("Response did not contain expected TITLE: or BODY: sections.\n\nRaw output:\n" + raw.slice(0, 500));
  }

  const title = titleMatch[1].trim();
  const description = descMatch?.[1]?.trim() ?? `${title} — FinishUltra guide for beginner ultra runners.`;
  const category = catMatch?.[1]?.trim() ?? "Getting Started";
  const tags = (tagsMatch?.[1] ?? keyword)
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean);
  const body = bodyMatch[1].trim();
  const slug = toSlug(topic);

  return { title, slug, description, body, tags, category };
}

// ─── Save as scheduled .md file ───────────────────────────────────────────────

function saveScheduledPost(post: {
  title: string;
  slug: string;
  description: string;
  body: string;
  tags: string[];
  category: string;
  publishDate: string;
}): string {
  fs.mkdirSync(SCHEDULED_DIR, { recursive: true });

  const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
slug: "${post.slug}"
description: "${post.description.replace(/"/g, '\\"')}"
category: "${post.category}"
tags: [${post.tags.map((t) => `"${t}"`).join(", ")}]
readTime: "${Math.max(4, Math.round(post.body.split(" ").length / 200))} min read"
image: "/images/blog/${post.slug}.jpg"
publishDate: "${post.publishDate}"
status: "scheduled"
---

${post.body}`;

  const filePath = path.join(SCHEDULED_DIR, `${post.slug}.md`);
  fs.writeFileSync(filePath, frontmatter, "utf-8");
  return filePath;
}

// ─── Update llms.txt ──────────────────────────────────────────────────────────

function updateLlmsTxt(slug: string, title: string, description: string): void {
  if (!fs.existsSync(LLMS_TXT_FILE)) return;

  const llmsTxt = fs.readFileSync(LLMS_TXT_FILE, "utf-8");
  const mirrorUrl = `${BASE_URL}/blog/${slug}/index.md`;

  if (llmsTxt.includes(mirrorUrl)) return; // already listed

  const newLine = `- [${title}](${mirrorUrl}) — ${description.slice(0, 120)}`;
  const blogSection = "### Blog Posts";

  if (llmsTxt.includes(blogSection)) {
    const afterMarker = llmsTxt.indexOf(blogSection) + blogSection.length;
    const nextSection = llmsTxt.indexOf("\n###", afterMarker);
    if (nextSection === -1) {
      fs.writeFileSync(LLMS_TXT_FILE, llmsTxt.trimEnd() + "\n" + newLine + "\n", "utf-8");
    } else {
      const before = llmsTxt.slice(0, nextSection);
      const after = llmsTxt.slice(nextSection);
      fs.writeFileSync(LLMS_TXT_FILE, before.trimEnd() + "\n" + newLine + "\n" + after, "utf-8");
    }
  } else {
    fs.writeFileSync(LLMS_TXT_FILE, llmsTxt.trimEnd() + `\n\n${blogSection}\n${newLine}\n`, "utf-8");
  }

  console.log(`   ✅  Added to llms.txt: ${slug}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  let topic: string;
  let keyword: string;
  let secondary: string;
  let words: number;
  let calendarRowIndex: number | null = null;

  if (args.fromCsv) {
    // Pick the next pending row from blog-calendar.csv
    const rows = parseCalendarCsv();
    const next = rows.find((r) => r.status === "pending");
    if (!next) {
      console.log("   ✅  No pending posts in blog-calendar.csv — nothing to generate.\n");
      process.exit(0);
    }
    topic = next.topic;
    keyword = next.primary_keyword;
    secondary = next.secondary_keywords;
    words = next.word_count;
    calendarRowIndex = next.lineIndex;
    console.log(`\n📅  Generating from calendar: "${topic}"`);
  } else {
    if (!args.topic || !args.keyword) {
      console.error("Usage: npm run generate-post -- --topic=\"...\" --keyword=\"...\" [--secondary=\"...\"] [--words=1500]");
      process.exit(1);
    }
    topic = args.topic;
    keyword = args.keyword;
    secondary = args.secondary;
    words = args.words;
    console.log(`\n✍️  Generating: "${topic}"`);
  }

  const publishDate = nextPublishDate();
  console.log(`   Publish date: ${publishDate}`);

  const post = await generatePostContent(topic, keyword, secondary, words);
  const filePath = saveScheduledPost({ ...post, publishDate });

  console.log(`\n   ✅  Saved: ${filePath}`);
  console.log(`   Title: ${post.title}`);
  console.log(`   Slug: ${post.slug}`);
  console.log(`   Words: ~${post.body.split(" ").length}`);

  // Update llms.txt immediately
  updateLlmsTxt(post.slug, post.title, post.description);

  // Mark CSV row as published (topic queued, not yet live)
  if (calendarRowIndex !== null) {
    markCsvRowPublished(calendarRowIndex);
  }

  console.log("\n🎉  Done! The post is scheduled and will publish on:", publishDate, "\n");
}

main().catch((err) => {
  console.error("\n❌  Error:", err.message ?? err);
  process.exit(1);
});
