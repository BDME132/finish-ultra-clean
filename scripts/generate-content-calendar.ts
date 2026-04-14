#!/usr/bin/env tsx
/**
 * FinishUltra 2-Year Content Calendar Generator
 *
 * Usage:
 *   npx tsx scripts/generate-content-calendar.ts
 *   npm run blog:calendar
 *
 * Output:
 *   content-calendar.json  — structured data for the scheduler
 *   content-calendar.md    — human-readable calendar
 *
 * Requires: ANTHROPIC_API_KEY in your environment
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

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

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("\n❌  ANTHROPIC_API_KEY is not set. Add it to .env.local\n");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Generate biweekly publish dates for 2 years starting ~2 weeks from now
// ---------------------------------------------------------------------------
function generatePublishDates(count: number, startWeeksOut = 2): string[] {
  const dates: string[] = [];
  const start = new Date();
  start.setDate(start.getDate() + startWeeksOut * 7);
  // Normalize to next Tuesday (good publish day)
  const dayOfWeek = start.getDay();
  const daysToTuesday = (2 - dayOfWeek + 7) % 7;
  start.setDate(start.getDate() + daysToTuesday);

  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 14); // every 2 weeks
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

// ---------------------------------------------------------------------------
// Existing posts to avoid duplicating
// ---------------------------------------------------------------------------
const EXISTING_POSTS = [
  "How Hard Is a 50K, Really?",
  "How to Choose Your First Ultra Marathon",
  "The No-BS 50K Training Guide for Complete Beginners",
  "Strength Training for Ultra Runners: The Minimum Effective Dose",
  "What to Wear for Your First Ultra",
  "Hoka Speedgoat 6 Review",
  "Best Running Vests 2025",
  "Trail Shoe Rotation: Do You Need More Than One Pair?",
  "Ultra Nutrition for Beginners: Keep It Simple",
  "The Complete Electrolyte Guide for Ultra Runners",
  "Real Food for Ultras: What to Eat When Gels Make You Gag",
  "The Ultimate Ultra Marathon Race Day Checklist",
  "Your First 100-Miler: A Brutally Honest Guide",
  "How to Run an Ultra in the Heat Without Destroying Yourself",
  "Winter Trail Running: How to Keep Running When It's Freezing",
  "Western States 100 Course Guide",
  "The Science of Sleep Deprivation in Ultrarunning",
  "12 Beginner Mistakes in Ultramarathon Racing",
];

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are an SEO content strategist for FinishUltra.com, an ultramarathon resource site for beginner runners.

Your job: Generate a 48-post, 2-year content calendar. Posts publish every 2 weeks.

## CONSTRAINTS
- Every title must be a question or question-format that people search on Google
- No topic should duplicate these existing posts:
${EXISTING_POSTS.map((p) => `  - ${p}`).join("\n")}
- Distribute across categories: Getting Started (8), Training (14), Gear (10), Nutrition (8), Race Day (8)
- Match seasonality:
  - Oct–Nov: cold weather running, off-season training, gear for cold
  - Dec–Jan: base building, motivation in winter, goal setting
  - Feb–Mar: early season training ramp, gear prep for spring races
  - Apr–May: heat training, spring race prep, racing tips
  - Jun–Jul: summer ultras, heat management, racing in heat
  - Aug–Sep: fall race prep, recovery between races, 100-mile content
- Target long-tail keywords with specific search intent
- Mix beginner-focused and slightly more advanced topics as the calendar progresses

## OUTPUT FORMAT
Return a JSON array of exactly 48 objects. No code fences, no extra text.

Each object:
{
  "title": "string — question-format title",
  "category": "Getting Started | Training | Gear | Nutrition | Race Day",
  "targetKeyword": "string — the primary search phrase to target",
  "season": "any | winter | spring | summer | fall",
  "estimatedSearchVolume": "low | medium | high",
  "notes": "string — 1 sentence about affiliate opportunities or content angle",
  "relatedExistingPost": "string — slug of the most relevant existing post, or empty string"
}`;

interface CalendarEntry {
  title: string;
  category: string;
  targetKeyword: string;
  season: string;
  estimatedSearchVolume: string;
  notes: string;
  relatedExistingPost: string;
  suggestedPublishDate?: string;
}

async function main() {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  console.log("\n📅 Generating 2-year content calendar (48 posts)...\n");
  console.log("   Calling Claude... (this takes ~60 seconds)\n");

  let message;
  try {
    message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content:
            "Generate the 48-post content calendar for FinishUltra.com starting from April 2026. Return only the JSON array.",
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
    console.error("\n❌  Unexpected response type\n");
    process.exit(1);
  }

  const cleaned = raw.text
    .replace(/^```json?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let entries: CalendarEntry[];
  try {
    entries = JSON.parse(cleaned);
    if (!Array.isArray(entries)) throw new Error("Response is not an array");
  } catch {
    fs.writeFileSync("content-calendar-error.txt", raw.text);
    console.error("\n❌  Failed to parse API response. Raw response saved to content-calendar-error.txt\n");
    process.exit(1);
  }

  // Assign publish dates
  const dates = generatePublishDates(entries.length);
  entries = entries.map((entry, i) => ({
    ...entry,
    suggestedPublishDate: dates[i],
  }));

  // ---------------------------------------------------------------------------
  // Write content-calendar.json
  // ---------------------------------------------------------------------------
  fs.writeFileSync("content-calendar.json", JSON.stringify(entries, null, 2), "utf-8");
  console.log("✅  Saved: content-calendar.json");

  // ---------------------------------------------------------------------------
  // Write content-calendar.md
  // ---------------------------------------------------------------------------
  const categoryCounts: Record<string, number> = {};
  for (const e of entries) {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
  }

  let md = `# FinishUltra Content Calendar — 2026–2028\n\n`;
  md += `Generated: ${new Date().toISOString().split("T")[0]}\n`;
  md += `Total posts: ${entries.length} (publishing every 2 weeks)\n\n`;

  md += `## Category Breakdown\n\n`;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    md += `- **${cat}**: ${count} posts\n`;
  }
  md += `\n---\n\n`;
  md += `## Full Calendar\n\n`;
  md += `| # | Publish Date | Title | Category | Keyword | Volume | Status |\n`;
  md += `|---|-------------|-------|----------|---------|--------|--------|\n`;

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const title = e.title.replace(/\|/g, "\\|");
    const keyword = e.targetKeyword.replace(/\|/g, "\\|");
    md += `| ${i + 1} | ${e.suggestedPublishDate} | ${title} | ${e.category} | \`${keyword}\` | ${e.estimatedSearchVolume} | ⬜ draft |\n`;
  }

  md += `\n---\n\n`;
  md += `## Notes by Post\n\n`;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    md += `### ${i + 1}. ${e.title}\n\n`;
    md += `- **Date:** ${e.suggestedPublishDate}\n`;
    md += `- **Category:** ${e.category}\n`;
    md += `- **Keyword:** \`${e.targetKeyword}\`\n`;
    md += `- **Volume:** ${e.estimatedSearchVolume}\n`;
    md += `- **Season:** ${e.season}\n`;
    if (e.relatedExistingPost) {
      md += `- **Related post:** /blog/${e.relatedExistingPost}\n`;
    }
    md += `- **Notes:** ${e.notes}\n\n`;
  }

  md += `---\n\n`;
  md += `## How to Use This Calendar\n\n`;
  md += `1. For each post, run: \`npm run blog:draft -- "<title>"\`\n`;
  md += `2. Review and edit the generated draft in \`drafts/\`\n`;
  md += `3. Add personal experiences, affiliate links, and your voice\n`;
  md += `4. Update \`publishDate\` in frontmatter to the date from this calendar\n`;
  md += `5. Move the file to \`content/scheduled/\`\n`;
  md += `6. The GitHub Action will auto-publish on the scheduled date\n`;

  fs.writeFileSync("content-calendar.md", md, "utf-8");
  console.log("✅  Saved: content-calendar.md");

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log(`\n📊 Calendar summary:`);
  for (const [cat, count] of Object.entries(categoryCounts)) {
    console.log(`   ${cat}: ${count} posts`);
  }
  console.log(`\n   First post: ${entries[0]?.suggestedPublishDate}`);
  console.log(`   Last post:  ${entries[entries.length - 1]?.suggestedPublishDate}`);
  console.log(`\n🏁 Next step: generate drafts for the first 10 posts:`);
  entries.slice(0, 10).forEach((e, i) => {
    console.log(`   ${i + 1}. npm run blog:draft -- "${e.title}"`);
  });
  console.log();
}

main();
