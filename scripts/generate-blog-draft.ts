#!/usr/bin/env tsx
/**
 * FinishUltra Blog Draft Generator
 *
 * Usage:
 *   npx tsx scripts/generate-blog-draft.ts "best trail running shoes for wide feet"
 *   npm run blog:draft -- "how to run your first night ultra"
 *
 * Requires: ANTHROPIC_API_KEY in your environment (or a .env.local file)
 *
 * Output: drafts/<slug>.md
 *
 * ⚠️  This generates a DRAFT only. You must review, edit, and add your personal
 *     voice before moving the file to content/scheduled/
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Load .env.local if present (Next.js convention)
// ---------------------------------------------------------------------------
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

// ---------------------------------------------------------------------------
// CLI input
// ---------------------------------------------------------------------------
const topic = process.argv.slice(2).join(" ").trim();
if (!topic) {
  console.error("\n❌  Usage: npx tsx scripts/generate-blog-draft.ts <topic>\n");
  console.error('   Example: npx tsx scripts/generate-blog-draft.ts "what to eat the night before an ultra"\n');
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("\n❌  ANTHROPIC_API_KEY is not set.");
  console.error("   Add it to your .env.local file:\n");
  console.error("   ANTHROPIC_API_KEY=sk-ant-...\n");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

function suggestPublishDate(weeksOut = 2): string {
  const d = new Date();
  d.setDate(d.getDate() + weeksOut * 7);
  return d.toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// Anthropic system prompt — captures FinishUltra voice and SEO requirements
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are a blog writer for FinishUltra.com, an ultramarathon resource site built by beginners for beginners.

## VOICE & TONE
- Direct, honest, supportive, slightly casual
- Written by runners who are still figuring this out — no gatekeeping, no elite snobbery
- Use "we" and "our" to include the reader; acknowledge uncertainty when real ("we've found that..." not "experts say...")
- Give specific numbers, not vague advice. Say "35–40 miles/week" not "run more."
- Recommend budget and premium options — not everyone has $200 for a vest
- No preamble like "Great question!" or "In this article, we'll cover..." — just start with the answer

## SEO REQUIREMENTS (NON-NEGOTIABLE)
- Title must be a direct question or contain a question people search on Google
- Every H2 heading must be a question in search-query format (e.g., "## What Trail Shoes Should First-Time Ultra Runners Wear?")
- The FIRST sentence after every H2 must directly answer that question in 40–60 words. No lead-up, no "it depends" without an immediate answer.
- Include 3–5 internal links to these FinishUltra pages where they fit naturally:
  /start-here, /faq, /training, /training/first-50k, /training/base-building, /training/race-week,
  /gear, /gear/shoes, /gear/packs, /gear/nutrition, /gear/apparel, /gear/kits,
  /tools/pace-calculator, /tools/glossary, /pheidi,
  /blog/how-hard-is-a-50k, /blog/ultra-nutrition-beginners, /blog/first-50k-training-guide,
  /blog/what-to-wear-first-ultra, /blog/race-day-checklist
- Target word count for the body: 1500–2500 words
- meta description: exactly 150–160 characters, answers the question directly

## STRUCTURE
1. Hook intro: 2–3 sentences that speak directly to the reader's situation. No heading.
2. 4–6 H2 sections, each a question
3. End with a clear next-step CTA paragraph linking to the most relevant FinishUltra resource
4. 3–5 FAQ items (separate from the body)

## BODY FORMATTING RULES
Use this exact markdown syntax (it maps directly to the FinishUltra renderer):
- ## for H2 (must be a question)
- ### for H3 sub-headings
- **bold text** for emphasis and product names
- - for bullet lists (blank line before and after)
- 1. for numbered lists (blank line before and after)
- Blank line between every paragraph and between lists and paragraphs
- Do NOT use links in the body — the human reviewer will add affiliate links

## OUTPUT FORMAT
Return a single valid JSON object. No markdown code fences. No extra text before or after.

{
  "title": "string — question-format title",
  "slug": "string — kebab-case URL slug",
  "description": "string — 150–160 characters for meta description",
  "category": "string — one of: Getting Started, Training, Gear, Nutrition, Race Day",
  "tags": ["string"],
  "readTime": "X min read",
  "relatedSlugs": ["string — slugs from existing FinishUltra posts to link as related"],
  "body": "string — full article body with \\n\\n between paragraphs",
  "faq": [
    { "question": "string", "answer": "string — 2–4 sentences, direct answer" }
  ]
}

Existing FinishUltra posts (do not duplicate these topics):
how-hard-is-a-50k, choosing-first-ultra, first-50k-training-guide, strength-training-ultra-runners,
what-to-wear-first-ultra, hoka-speedgoat-6-review, best-running-vests-2025, trail-shoe-rotation,
ultra-nutrition-beginners, electrolyte-guide-ultra-runners, real-food-ultra-marathon,
race-day-checklist, first-100-miler-guide, summer-ultra-survival-guide, winter-trail-running-guide,
western-states-course-guide, ultrarunning-science-sleep-deprivation, beginner-mistakes-ultra-marathon`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  console.log(`\n🏃 Generating draft: "${topic}"\n`);
  console.log("   Calling Claude... (this takes ~30 seconds)\n");

  let message;
  try {
    message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Write a FinishUltra blog post for this topic: "${topic}"\n\nReturn only the JSON object, nothing else.`,
        },
      ],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n❌  Anthropic API error: ${msg}\n`);
    process.exit(1);
  }

  const raw = message.content[0];
  if (raw.type !== "text") {
    console.error("\n❌  Unexpected response type from API\n");
    process.exit(1);
  }

  // Strip accidental code fences
  const cleaned = raw.text
    .replace(/^```json?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let post: {
    title: string;
    slug: string;
    description: string;
    category: string;
    tags: string[];
    readTime: string;
    relatedSlugs: string[];
    body: string;
    faq: { question: string; answer: string }[];
  };

  try {
    post = JSON.parse(cleaned);
  } catch {
    const errorFile = path.join("drafts", "_parse-error.txt");
    fs.mkdirSync("drafts", { recursive: true });
    fs.writeFileSync(errorFile, raw.text, "utf-8");
    console.error(`\n❌  Failed to parse API response as JSON.`);
    console.error(`   Raw response saved to: ${errorFile}\n`);
    process.exit(1);
  }

  const slug = post.slug || toSlug(topic);
  const readTime = post.readTime || estimateReadTime(post.body);

  // ---------------------------------------------------------------------------
  // Build the frontmatter block
  // ---------------------------------------------------------------------------
  const tagsYaml = (post.tags || []).map((t) => `  - "${t}"`).join("\n");
  const relatedYaml = (post.relatedSlugs || []).map((s) => `  - "${s}"`).join("\n");
  const faqJson = JSON.stringify(post.faq || []);

  const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
slug: "${slug}"
description: "${post.description.replace(/"/g, '\\"')}"
category: "${post.category}"
tags:
${tagsYaml}
readTime: "${readTime}"
image: "/images/blog/${slug}.jpg"
publishDate: "${suggestPublishDate()}"
relatedSlugs:
${relatedYaml}
faqJson: '${faqJson.replace(/'/g, "\\'")}'
status: "draft"
---

`;

  // ---------------------------------------------------------------------------
  // Write the draft file
  // ---------------------------------------------------------------------------
  fs.mkdirSync("drafts", { recursive: true });
  const outputPath = path.join("drafts", `${slug}.md`);
  fs.writeFileSync(outputPath, frontmatter + post.body, "utf-8");

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log(`✅ Draft created: ${outputPath}`);
  console.log(`\n📋 Post details:`);
  console.log(`   Title:    ${post.title}`);
  console.log(`   Category: ${post.category}`);
  console.log(`   Tags:     ${(post.tags || []).join(", ")}`);
  console.log(`   Read time: ${readTime}`);
  console.log(`   FAQ items: ${(post.faq || []).length}`);
  console.log(`\n✏️  Your review checklist:`);
  console.log(`   [ ] Read the full post and adjust tone/voice`);
  console.log(`   [ ] Add any personal experiences or examples`);
  console.log(`   [ ] Add affiliate links (gear products, Amazon)`);
  console.log(`   [ ] Check that all internal links are relevant`);
  console.log(`   [ ] Set publishDate in frontmatter to your target date`);
  console.log(`   [ ] Add a real image to /public/images/blog/${slug}.jpg`);
  console.log(`   [ ] Move to content/scheduled/ when satisfied\n`);
}

main();
