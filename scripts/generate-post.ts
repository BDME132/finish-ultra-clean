#!/usr/bin/env tsx
/**
 * FinishUltra Blog Post Generator
 *
 * Calls the OpenAI API to generate a fully SEO/AEO-optimized blog post,
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

import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import { ALL_PRODUCTS } from "../src/lib/products/index";

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

// ─── Publish date: next Monday or Friday ─────────────────────────────────────

function nextPublishDate(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  let daysUntil: number;
  if (day === 1 || day === 5) {
    daysUntil = 0; // Today IS Mon or Fri — publish today
  } else if (day === 0) {
    daysUntil = 1; // Sun → Mon
  } else if (day === 6) {
    daysUntil = 2; // Sat → Mon
  } else {
    daysUntil = 5 - day; // Tue(3)/Wed(2)/Thu(1) → Fri
  }
  now.setDate(now.getDate() + daysUntil);
  return now.toISOString().split("T")[0];
}

// ─── Affiliate link replacement ───────────────────────────────────────────────

/**
 * Build a flat lookup of product keywords → { name, brand, url }.
 * Called once so we don't re-process on every placeholder.
 */
function buildAffiliateLookup(): Array<{ terms: string[]; displayName: string; url: string }> {
  const entries: Array<{ terms: string[]; displayName: string; url: string }> = [];

  for (const product of ALL_PRODUCTS) {
    const url = (product.affiliateLinks as Record<string, string> | undefined)?.amazon;
    if (!url) continue;

    entries.push({
      terms: [
        product.name.toLowerCase(),
        product.brand.toLowerCase(),
        `${product.brand} ${product.name}`.toLowerCase(),
        ...product.tags.map((t) => t.toLowerCase()),
      ],
      displayName: `${product.brand} ${product.name}`,
      url,
    });
  }
  return entries;
}

/**
 * Replace [AFFILIATE: product name here] placeholders with real Amazon affiliate links.
 * Fuzzy-matches the hint against product name, brand, and tags.
 * Falls back to the gear page if no product is found.
 */
function replaceAffiliateLinks(body: string): string {
  const lookup = buildAffiliateLookup();

  return body.replace(/\[AFFILIATE:\s*([^\]]+)\]/gi, (_match, hint: string) => {
    const normalized = hint.toLowerCase().trim();

    let bestDisplay = "";
    let bestUrl = "";
    let bestScore = 0;

    for (const entry of lookup) {
      for (const term of entry.terms) {
        if (term === normalized) {
          // Exact match — use immediately
          return `[${entry.displayName} on Amazon](${entry.url})`;
        }
        if (term.includes(normalized) || normalized.includes(term)) {
          const score =
            Math.min(term.length, normalized.length) /
            Math.max(term.length, normalized.length);
          if (score > bestScore) {
            bestScore = score;
            bestDisplay = entry.displayName;
            bestUrl = entry.url;
          }
        }
      }
    }

    if (bestScore >= 0.3) {
      return `[${bestDisplay} on Amazon](${bestUrl})`;
    }

    // No product match — link to the gear page with the hint as anchor text
    console.log(`   ⚠️  No affiliate match for: "${hint.trim()}" — linking to /gear`);
    return `[${hint.trim()}](/gear)`;
  });
}

// ─── AI generation ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the expert content writer for FinishUltra, the #1 resource for beginner ultramarathon runners.

Voice: Encouraging, practical, honest. You've run ultras. You know what it's actually like. No fluff, no padding, no vague motivational filler. Write like you're talking to a friend who's nervous about their first 50K.

SEO & AEO rules (these directly affect Google rankings and AI citation):
- Write for "People Also Ask" and featured snippets. Every H2 should be a question someone types into Google or asks an AI assistant.
- The "**Quick Answer:**" box at the top gets quoted verbatim by AI search engines (ChatGPT, Perplexity, Gemini) — make it complete and factual enough to stand alone.
- Mention the primary keyword in the first 100 words, at least one H2, and naturally 3-4 more times throughout.
- Secondary keywords should appear naturally in body text and at least one H3.
- Use specific numbers, product names, and distances — AI search engines prefer specificity over generality.
- Each FAQ answer must be 2-4 sentences minimum — short FAQ answers get ignored by AI citation systems.

Format rules you MUST follow exactly:
1. Start the ENTIRE post with a "**Quick Answer:**" paragraph (no heading above it) — 2-4 sentences that directly answer the primary question with specific facts. This is the AI citation snippet.
2. Title is handled by frontmatter — do NOT repeat it as an H1 in the body.
3. H2s must be full questions (e.g. "## What Shoes Are Best for Beginners?"). These become Google featured snippet targets.
4. H3s for sub-points under H2s — use for specific product recommendations or sub-topics.
5. Never skip heading levels.
6. Include EXACTLY 3 internal links using this format: [anchor text](/path) — choose from: /training/first-50k, /gear, /gear/shoes, /gear/packs, /gear/nutrition, /tools/pace-calculator, /tools/glossary, /blog, /pheidi
7. Include EXACTLY 2 affiliate placeholders formatted as: [AFFILIATE: product name here] — use real gear brand + product names (e.g. "Hoka Speedgoat 6", "Salomon Advanced Skin 12", "Tailwind Endurance Fuel", "Nathan VaporAir 7L", "Garmin Forerunner 255").
8. End with a "## Frequently Asked Questions" section with EXACTLY 6 questions and thorough answers (2-4 sentences each).
9. Target word count must be met — do not pad with filler, use it for depth.
10. No markdown tables — use bullet lists or numbered lists instead.`;

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
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  // Normalize: strip markdown bold markers GPT sometimes adds (e.g. **TITLE:**)
  const normalized = raw.replace(/\*\*/g, "").replace(/\r\n/g, "\n");

  // Parse structured response
  const titleMatch = normalized.match(/^TITLE:\s*(.+)$/m);
  const descMatch = normalized.match(/^DESCRIPTION:\s*(.+)$/m);
  const catMatch = normalized.match(/^CATEGORY:\s*(.+)$/m);
  const tagsMatch = normalized.match(/^TAGS:\s*(.+)$/m);
  const bodyMatch = normalized.match(/^BODY:\s*\n([\s\S]+)$/m);

  if (!titleMatch || !bodyMatch) {
    throw new Error("Response did not contain expected TITLE: or BODY: sections.\n\nRaw output:\n" + normalized.slice(0, 500));
  }

  const title = titleMatch[1].trim();
  const description = descMatch?.[1]?.trim() ?? `${title} — FinishUltra guide for beginner ultra runners.`;
  const category = catMatch?.[1]?.trim() ?? "Getting Started";
  const tags = (tagsMatch?.[1] ?? keyword)
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean);
  const rawBody = bodyMatch[1].trim();
  const body = rawBody;
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
  authorType: "ai" | "member";
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
authorType: "${post.authorType}"
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

  // Replace [AFFILIATE: ...] placeholders with real Amazon affiliate links
  const bodyWithLinks = replaceAffiliateLinks(post.body);
  const postWithLinks = { ...post, body: bodyWithLinks };

  // 40% chance of showing "AI Guide" label, 60% show "FinishUltra Team"
  const authorType: "ai" | "member" = Math.random() < 0.4 ? "ai" : "member";
  const filePath = saveScheduledPost({ ...postWithLinks, publishDate, authorType });

  console.log(`\n   ✅  Saved: ${filePath}`);
  console.log(`   Title: ${postWithLinks.title}`);
  console.log(`   Slug: ${postWithLinks.slug}`);
  console.log(`   Words: ~${bodyWithLinks.split(" ").length}`);

  // Update llms.txt immediately
  updateLlmsTxt(postWithLinks.slug, postWithLinks.title, postWithLinks.description);

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
