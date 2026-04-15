#!/usr/bin/env tsx
/**
 * FinishUltra Instagram Caption Generator
 *
 * Usage:
 *   npx tsx scripts/generate-social-posts.ts drafts/my-post.md
 *   npx tsx scripts/generate-social-posts.ts content/scheduled/my-post.md
 *   npm run blog:social -- drafts/my-post.md
 *
 * Output:
 *   social/instagram/<slug>.txt — 3 caption drafts
 *
 * Requires: ANTHROPIC_API_KEY in .env.local
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

// Load .env.local
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

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("\n❌  Usage: npx tsx scripts/generate-social-posts.ts <path-to-draft.md>\n");
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("\n❌  ANTHROPIC_API_KEY not set in .env.local\n");
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`\n❌  File not found: ${inputFile}\n`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You write Instagram captions for FinishUltra (@finishultra), an ultra marathon resource account for beginners.

## Account voice
- Encouraging, direct, no gatekeeping
- Relatable — "we're figuring this out together"
- Short sentences. Line breaks for readability on mobile.
- Specific numbers and facts over vague advice
- Occasional humor, always honest

## Caption structure (each of the 3 captions should use a different approach)
Caption 1 — "Quick tip" format: Start with a bold claim or surprising fact. 2-3 short paragraphs. End with a question to drive comments.
Caption 2 — "Story" format: Open with a scenario runners relate to. Share the insight. Link to site for more.
Caption 3 — "List" format: "X things about [topic]" or "X signs you're ready for your first ultra". Use emoji bullets. Punchy.

## Hashtags (include 15-20 per caption)
Always include: #ultramarathon #ultrarunning #trailrunning #beginnerrunner #finishultra
Add 10-15 from: #50k #trailrunner #runnersofinstagram #runningcommunity #ultrarunner #traillife #runhappy #runningmotivation #runningadvice #firstultra #starthere #trailrunninglife #outdoorfitness #runninglife #ultramarathontraining

## Rules
- No hashtags in the caption body — put them at the end after "." separator
- Always end with a CTA like "Link in bio for the full guide" or "Find the free plan at finishultra.com"
- Instagram doesn't render markdown — no **bold**, no ##, no hyphens as bullets (use emoji ✓ or → instead)
- Max 2200 characters per caption

## Output format
Return a JSON object with exactly this structure (no code fences):
{
  "caption1": "...",
  "caption2": "...",
  "caption3": "..."
}`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const raw = fs.readFileSync(inputFile, "utf-8");
  const { data, content } = matter(raw);

  const title = (data.title as string) || path.basename(inputFile, ".md");
  const slug = (data.slug as string) || title.toLowerCase().replace(/\s+/g, "-");
  const category = (data.category as string) || "";

  // Summarize the article for the prompt (first 1000 chars of body)
  const bodySummary = content.trim().slice(0, 1200);

  console.log(`\n📸 Generating Instagram captions for: "${title}"\n`);

  let message;
  try {
    message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Blog post details:
Title: ${title}
Category: ${category}
Article excerpt:
${bodySummary}

Generate 3 Instagram caption drafts for this post. Return only the JSON object.`,
        },
      ],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n❌  Anthropic API error: ${msg}\n`);
    process.exit(1);
  }

  const rawText = message.content[0];
  if (rawText.type !== "text") {
    console.error("\n❌  Unexpected API response type\n");
    process.exit(1);
  }

  const cleaned = rawText.text
    .replace(/^```json?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let captions: { caption1: string; caption2: string; caption3: string };
  try {
    captions = JSON.parse(cleaned);
  } catch {
    console.error("\n❌  Failed to parse API response");
    fs.writeFileSync("social/_error.txt", rawText.text);
    process.exit(1);
  }

  // ---------------------------------------------------------------------------
  // Write output file
  // ---------------------------------------------------------------------------
  const outputDir = path.join("social", "instagram");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${slug}.txt`);

  const divider = "─".repeat(60);
  const output = [
    `Instagram Captions: ${title}`,
    `Generated: ${new Date().toISOString().split("T")[0]}`,
    `Blog post: https://www.finishultra.com/blog/${slug}`,
    "",
    divider,
    "CAPTION 1 — Quick Tip",
    divider,
    "",
    captions.caption1,
    "",
    divider,
    "CAPTION 2 — Story Format",
    divider,
    "",
    captions.caption2,
    "",
    divider,
    "CAPTION 3 — List Format",
    divider,
    "",
    captions.caption3,
    "",
    divider,
    "SCHEDULING NOTES",
    divider,
    "• Pick the caption that fits your current content mix",
    "• Schedule 3-5 days after the blog post goes live",
    "• Image ideas: trail scene, gear flatlay, or text quote overlay",
    "• Add to Buffer/Later queue with the blog post publish date + 4 days",
    "",
  ].join("\n");

  fs.writeFileSync(outputPath, output, "utf-8");

  console.log(`✅ Saved to: ${outputPath}\n`);
  console.log("📋 Next steps:");
  console.log("   1. Pick your favorite caption (or mix elements)");
  console.log("   2. Add to Buffer/Later with a date 3-5 days after publish");
  console.log("   3. Pair with a relevant photo or canva graphic\n");
}

main();
