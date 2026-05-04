#!/usr/bin/env tsx
/**
 * FinishUltra Batch Post Generator
 *
 * Generates N posts from blog-calendar.csv sequentially, then assigns Mon/Fri
 * publish dates so they roll out automatically via the scheduled workflow.
 *
 * Usage (GitHub Actions manual trigger — see batch-generate.yml):
 *   tsx scripts/generate-batch.ts --count=10
 *
 * Each post is saved to content/scheduled/ and the CSV row is marked "published".
 * Publish dates are assigned starting from the next Mon/Fri, one slot per post.
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

// ─── Arg parsing ─────────────────────────────────────────────────────────────

function getCount(): number {
  const arg = process.argv.find((a) => a.startsWith("--count="));
  return arg ? Math.max(1, parseInt(arg.split("=")[1], 10)) : 10;
}

// ─── CSV helpers ─────────────────────────────────────────────────────────────

interface CalendarRow {
  topic: string;
  primary_keyword: string;
  secondary_keywords: string;
  word_count: number;
  status: "pending" | "published";
  lineIndex: number;
}

function parseCalendarCsv(): CalendarRow[] {
  const lines = fs.readFileSync(CALENDAR_FILE, "utf-8").split("\n");
  const rows: CalendarRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
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
  if (cols.length >= 5) cols[4] = "published";
  else { while (cols.length < 4) cols.push(""); cols.push("published"); }
  lines[lineIndex] = cols.join(",");
  fs.writeFileSync(CALENDAR_FILE, lines.join("\n"), "utf-8");
}

// ─── Publish date slots (Mon/Fri, starting from next upcoming Mon or Fri) ────

function generatePublishSlots(count: number, startAfterDate?: string): string[] {
  const slots: string[] = [];
  // Find existing scheduled posts' dates to avoid collisions
  const taken = new Set<string>();
  if (fs.existsSync(SCHEDULED_DIR)) {
    for (const f of fs.readdirSync(SCHEDULED_DIR).filter((f) => f.endsWith(".md"))) {
      const raw = fs.readFileSync(path.join(SCHEDULED_DIR, f), "utf-8");
      const match = raw.match(/publishDate: "([^"]+)"/);
      if (match) taken.add(match[1]);
    }
  }

  // Start from tomorrow so we don't try to publish today (action already ran)
  const base = startAfterDate
    ? new Date(startAfterDate + "T00:00:00Z")
    : new Date();
  base.setUTCDate(base.getUTCDate() + 1);

  const d = new Date(base);
  while (slots.length < count) {
    const day = d.getUTCDay();
    const iso = d.toISOString().split("T")[0];
    if ((day === 1 || day === 5) && !taken.has(iso)) {
      slots.push(iso);
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return slots;
}

// ─── Slug ─────────────────────────────────────────────────────────────────────

function toSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── Affiliate replacement ────────────────────────────────────────────────────

function replaceAffiliateLinks(body: string): string {
  const lookup: Array<{ terms: string[]; displayName: string; url: string }> = [];
  for (const product of ALL_PRODUCTS) {
    const url = (product.affiliateLinks as Record<string, string> | undefined)?.amazon;
    if (!url) continue;
    lookup.push({
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

  return body.replace(/\[AFFILIATE:\s*([^\]]+)\]/gi, (_match, hint: string) => {
    const normalized = hint.toLowerCase().trim();
    let bestDisplay = "";
    let bestUrl = "";
    let bestScore = 0;
    for (const entry of lookup) {
      for (const term of entry.terms) {
        if (term === normalized) return `[${entry.displayName} on Amazon](${entry.url})`;
        if (term.includes(normalized) || normalized.includes(term)) {
          const score = Math.min(term.length, normalized.length) / Math.max(term.length, normalized.length);
          if (score > bestScore) { bestScore = score; bestDisplay = entry.displayName; bestUrl = entry.url; }
        }
      }
    }
    if (bestScore >= 0.3) return `[${bestDisplay} on Amazon](${bestUrl})`;
    console.log(`   ⚠️  No affiliate match for: "${hint.trim()}" — linking to /gear`);
    return `[${hint.trim()}](/gear)`;
  });
}

// ─── System prompt ────────────────────────────────────────────────────────────

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

// ─── Generate one post ────────────────────────────────────────────────────────

async function generatePost(
  client: OpenAI,
  topic: string,
  keyword: string,
  secondary: string,
  words: number,
  publishDate: string,
  index: number,
  total: number,
): Promise<void> {
  console.log(`\n[${index + 1}/${total}] Generating: "${topic}"`);
  console.log(`        Publish date: ${publishDate}`);

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
  const titleMatch = normalized.match(/^TITLE:\s*(.+)$/m);
  const descMatch = normalized.match(/^DESCRIPTION:\s*(.+)$/m);
  const catMatch = normalized.match(/^CATEGORY:\s*(.+)$/m);
  const tagsMatch = normalized.match(/^TAGS:\s*(.+)$/m);
  const bodyMatch = normalized.match(/^BODY:\s*\n([\s\S]+)$/m);

  if (!titleMatch || !bodyMatch) {
    throw new Error(`[${topic}] Response missing TITLE or BODY sections.\n\n${normalized.slice(0, 300)}`);
  }

  const title = titleMatch[1].trim();
  const description = descMatch?.[1]?.trim() ?? `${title} — FinishUltra guide for beginner ultra runners.`;
  const category = catMatch?.[1]?.trim() ?? "Getting Started";
  const tags = (tagsMatch?.[1] ?? keyword).split(",").map((t: string) => t.trim()).filter(Boolean);
  const rawBody = bodyMatch[1].trim();
  const body = replaceAffiliateLinks(rawBody);
  const slug = toSlug(topic);
  const authorType: "ai" | "member" = Math.random() < 0.4 ? "ai" : "member";
  const readTime = `${Math.max(4, Math.round(body.split(" ").length / 200))} min read`;

  // Save to content/scheduled/
  fs.mkdirSync(SCHEDULED_DIR, { recursive: true });

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
description: "${description.replace(/"/g, '\\"')}"
category: "${category}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
readTime: "${readTime}"
image: "/images/blog/${slug}.jpg"
publishDate: "${publishDate}"
authorType: "${authorType}"
status: "scheduled"
---

${body}`;

  const filePath = path.join(SCHEDULED_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, frontmatter, "utf-8");

  // Update llms.txt
  if (fs.existsSync(LLMS_TXT_FILE)) {
    const mirrorUrl = `${BASE_URL}/blog/${slug}/index.md`;
    let llmsTxt = fs.readFileSync(LLMS_TXT_FILE, "utf-8");
    if (!llmsTxt.includes(mirrorUrl)) {
      const newLine = `- [${title}](${mirrorUrl}) — ${description.slice(0, 120)}`;
      const blogSection = "### Blog Posts";
      if (llmsTxt.includes(blogSection)) {
        const afterMarker = llmsTxt.indexOf(blogSection) + blogSection.length;
        const nextSection = llmsTxt.indexOf("\n###", afterMarker);
        if (nextSection === -1) {
          llmsTxt = llmsTxt.trimEnd() + "\n" + newLine + "\n";
        } else {
          llmsTxt = llmsTxt.slice(0, nextSection).trimEnd() + "\n" + newLine + "\n" + llmsTxt.slice(nextSection);
        }
      } else {
        llmsTxt = llmsTxt.trimEnd() + `\n\n${blogSection}\n${newLine}\n`;
      }
      fs.writeFileSync(LLMS_TXT_FILE, llmsTxt, "utf-8");
    }
  }

  console.log(`        ✅ Saved: ${slug}.md (~${body.split(" ").length} words)`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const count = getCount();
  console.log(`\n🚀 FinishUltra Batch Generator — generating ${count} post(s)\n`);

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌  OPENAI_API_KEY is not set.");
    process.exit(1);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const rows = parseCalendarCsv();
  const pending = rows.filter((r) => r.status === "pending");

  if (pending.length === 0) {
    console.log("✅ No pending rows in blog-calendar.csv — nothing to generate.");
    process.exit(0);
  }

  const toGenerate = pending.slice(0, count);
  console.log(`   Found ${pending.length} pending topics. Generating ${toGenerate.length}.\n`);

  const slots = generatePublishSlots(toGenerate.length);
  console.log(`   Publish slots: ${slots[0]} → ${slots[slots.length - 1]}\n`);

  for (let i = 0; i < toGenerate.length; i++) {
    const row = toGenerate[i];
    try {
      await generatePost(client, row.topic, row.primary_keyword, row.secondary_keywords, row.word_count, slots[i], i, toGenerate.length);
      markCsvRowPublished(row.lineIndex);
    } catch (err) {
      console.error(`   ❌ Failed to generate "${row.topic}":`, (err as Error).message);
      // Continue with next post
    }
    // Small delay to avoid rate limits
    if (i < toGenerate.length - 1) await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n🎉 Batch complete! ${toGenerate.length} post(s) saved to content/scheduled/\n`);
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
