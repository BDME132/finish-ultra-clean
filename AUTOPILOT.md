# FinishUltra Autopilot System

The complete guide to the semi-automated blog publishing pipeline. Read this when you come back after a long absence.

---

## What This System Does

Publishes pre-written blog posts on a schedule while you're away — without generating content automatically. Every post was written and reviewed by you before you left. The system just moves them from a queue to the live site at the right time.

**The guarantee:** Nothing gets published that you didn't write and approve. The automation only handles timing and file manipulation, not content creation.

---

## Directory Structure

```
finishultra/
├── content/
│   ├── scheduled/          # Posts ready to publish — ordered by publishDate
│   │   └── example-scheduled-post.md
│   └── published/          # Archive of posts after they go live
├── drafts/                 # Work-in-progress posts (never auto-published)
├── social/
│   └── instagram/          # Generated Instagram captions, one file per post
├── scripts/
│   ├── generate-blog-draft.ts      # AI draft writer (you run manually)
│   ├── generate-content-calendar.ts # 2-year topic calendar generator
│   ├── publish-scheduled.ts        # Core publisher (runs daily via GitHub Action)
│   ├── post-publish-hooks.ts       # Updates llms.txt after each publish
│   └── generate-social-posts.ts   # Instagram caption generator (manual)
└── .github/
    └── workflows/
        └── scheduled-publish.yml   # Daily GitHub Action at 8am UTC
```

---

## How Publishing Works

Every day at 8am UTC, GitHub Actions runs `scripts/publish-scheduled.ts`. That script:

1. Scans `content/scheduled/` for `.md` files
2. Checks each file's `publishDate` field
3. For any post where `publishDate <= today`, it:
   - Parses the frontmatter and body
   - Converts it to a TypeScript `BlogPost` object
   - Inserts it into `src/lib/content/blog-posts.ts`
   - Moves the `.md` file to `content/published/`
4. Then runs `post-publish-hooks.ts` to update `public/llms.txt` with the new post's mirror URL
5. Commits the changes and pushes to main, which triggers a Vercel rebuild

The site goes live with the new post within ~2 minutes of the GitHub Action completing.

---

## Scheduled Post File Format

Each file in `content/scheduled/` is a markdown file with YAML frontmatter:

```markdown
---
title: "Your Post Title"
slug: "your-post-slug"
description: "SEO meta description, 150-160 chars"
category: "Training"          # Training | Gear | Nutrition | Racing | Mindset
tags:
  - "tag one"
  - "tag two"
readTime: "7 min read"
image: "/images/blog/your-post-slug.jpg"
publishDate: "2026-06-15"     # YYYY-MM-DD — the day it goes live
relatedSlugs:
  - "related-post-slug"
  - "another-related-slug"
faqJson: '[{"question":"Q?","answer":"A."}]'
status: "scheduled"
---

Your post body in markdown. Use ## for H2 headings.
```

**Critical fields:**
- `slug` must be unique and URL-safe (kebab-case, no spaces)
- `publishDate` controls when it publishes — set this intentionally
- `faqJson` is a JSON string (array of `{question, answer}` objects) — generates the FAQ accordion and schema at the bottom of the post
- `image` path must exist in `public/images/blog/` or the post will render without a hero image

---

## Before You Leave: The Pre-Departure Checklist

Run through this before going hands-off:

1. **Generate your content calendar**
   ```bash
   pnpm blog:calendar
   ```
   Review `content-calendar.md` — this is 48 topics spread over 2 years. Adjust dates, categories, and topics to your liking.

2. **Write your drafts** (for each topic you want scheduled)
   ```bash
   pnpm blog:draft "your topic here"
   ```
   This calls Claude to write a full draft and saves it to `drafts/[slug].md`. Review and edit it. The AI gets the voice mostly right but always needs a human pass.

3. **Generate Instagram captions** (optional, do this per post)
   ```bash
   pnpm blog:social drafts/your-post-slug.md
   ```
   Saves 3 caption options to `social/instagram/your-post-slug.txt`.

4. **Move approved drafts to the queue**
   ```bash
   mv drafts/your-post-slug.md content/scheduled/your-post-slug.md
   ```
   Set the `publishDate` in the frontmatter to the date you want it live.

5. **Add post images** to `public/images/blog/` — one per post, named `[slug].jpg`. The publisher doesn't check for this, so if you skip it the post publishes without a hero image.

6. **Verify the GitHub Action has the API key secret**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Check that `ANTHROPIC_API_KEY` exists (needed only if you run `blog:draft` or `blog:social` via Actions — the publisher itself doesn't need it)

7. **Do a dry run**
   - Go to GitHub → Actions → "Scheduled Blog Publisher" → Run workflow → check "dry_run"
   - This runs the publish script without committing anything — lets you verify it finds your posts and parses them correctly

8. **Check your queue**
   ```bash
   ls content/scheduled/
   ```
   Confirm the posts you expect are there with the right dates.

9. **Push everything to main**
   ```bash
   git add content/scheduled/ drafts/ social/
   git commit -m "Queue posts for auto-publish"
   git push
   ```
   Once this is pushed, the GitHub Action will handle everything else.

---

## When You Come Back: Picking Up Where You Left Off

1. **See what published while you were gone**
   ```bash
   ls content/published/
   git log --oneline | grep "Auto-publish"
   ```

2. **See what's still queued**
   ```bash
   ls content/scheduled/
   ```

3. **Check the GitHub Actions log** for any failures — go to your repo → Actions tab and scan for red Xs.

4. **Refill the queue** if it's running low — run `pnpm blog:calendar` to generate new topics, then `pnpm blog:draft` for each one.

---

## Scripts Reference

### `pnpm blog:draft "topic"`
Calls Claude (claude-sonnet-4-5) to write a full draft post on the given topic. Saves to `drafts/[generated-slug].md`. Requires `ANTHROPIC_API_KEY` in `.env.local`.

```bash
pnpm blog:draft "how to choose your first trail running vest"
```

**Output:** `drafts/how-to-choose-first-trail-running-vest.md`

---

### `pnpm blog:calendar`
Generates a 48-topic, 2-year content calendar. Calls Claude to suggest topics that don't overlap with your existing 18 posts. Distributes across categories with seasonal awareness (spring = race prep, fall = recovery, winter = base building).

**Output:**
- `content-calendar.json` — machine-readable
- `content-calendar.md` — human-readable markdown table

---

### `pnpm blog:publish`
Runs the publisher manually (same as what the GitHub Action runs). Parses all `.md` files in `content/scheduled/`, publishes any with `publishDate <= today`, updates `blog-posts.ts`, moves files to `content/published/`, and updates `llms.txt`.

You won't need to run this manually often — it runs automatically every day.

---

### `pnpm blog:social <path-to-draft>`
Generates 3 Instagram caption styles for a post: Quick Tip format, Story format, and List format. Each includes hashtags.

```bash
pnpm blog:social drafts/my-post.md
```

**Output:** `social/instagram/my-post.txt`

---

## GitHub Action Setup

The workflow lives at `.github/workflows/scheduled-publish.yml`. It runs daily at 8am UTC.

**To verify it's active:**
1. Go to your GitHub repo
2. Click Actions tab
3. Look for "Scheduled Blog Publisher" in the left sidebar
4. It should show recent runs

**If it's not running:**
- Check that the workflow file is in `.github/workflows/` and committed to main
- Check that Actions are enabled for your repo (Settings → Actions → General → Allow all actions)

**Required GitHub Secrets** (Settings → Secrets and variables → Actions):
- `ANTHROPIC_API_KEY` — only needed if you extend the workflow to run AI scripts directly. The publisher itself doesn't need it.

**Manual trigger:**
- Actions → "Scheduled Blog Publisher" → "Run workflow" button
- Optional: check "dry_run" to test without committing

---

## How Blog Posts Are Stored

**Important:** Blog posts are NOT stored as markdown files in the repo. They live as TypeScript objects in `src/lib/content/blog-posts.ts`.

The publisher converts your `.md` scheduled files into TypeScript objects and inserts them into that file. This is by design — the entire site uses this file as its content source.

This means:
- You can edit published posts by editing `blog-posts.ts` directly
- The TypeScript object format is the canonical source of truth
- The `.md` files in `content/published/` are archives — editing them does nothing

---

## Safeguards

**Nothing auto-generates + auto-publishes.** The system only publishes posts you manually approved and placed in `content/scheduled/`. The AI tools (`blog:draft`, `blog:calendar`, `blog:social`) are manual commands you run yourself — they never run automatically.

**The publish script only reads, never guesses.** If a file in `content/scheduled/` is missing required fields (title, slug, body), the script skips it with a warning rather than publishing something broken.

**Dry run mode.** The GitHub Action has a `dry_run` input. Use it to verify parsing without touching `blog-posts.ts`.

**No silent failures.** If the publisher encounters a post it can't parse, it logs the error and skips that file. The rest of the queue still processes.

---

## Troubleshooting

**Post didn't publish on its date**
- Check the GitHub Action log for that day — was there a failure?
- Verify the `publishDate` field in the `.md` file is `YYYY-MM-DD` format
- Verify the file is in `content/scheduled/` (not `drafts/`)
- Check that `status: "scheduled"` is in the frontmatter

**TypeScript errors after publish**
- The publisher inserts raw TypeScript into `blog-posts.ts` — if a post body contains unescaped backticks or `${`, it will break the file
- Check the published post in `blog-posts.ts` and manually escape any problematic characters: `` ` `` → `` \` ``, `${` → `\${`

**GitHub Action failing with "nothing to commit"**
- This is normal on days when no post was scheduled — the workflow exits cleanly

**`pnpm blog:draft` failing**
- Check that `ANTHROPIC_API_KEY` is set in `.env.local`
- The `.env.local` file is gitignored — it won't be present in a fresh clone

---

## Adding a New Post Manually (Without the Scripts)

1. Create `content/scheduled/your-slug.md` with the format shown above
2. Set `publishDate` to when you want it live
3. Commit and push — the GitHub Action handles the rest

---

## System Files Quick Reference

| File | Purpose |
|------|---------|
| `src/lib/content/blog-posts.ts` | All published blog posts (TypeScript) |
| `content/scheduled/` | Queue of approved, dated posts |
| `content/published/` | Archive after publishing |
| `drafts/` | Work in progress — never auto-published |
| `public/llms.txt` | AI crawler site overview — auto-updated on publish |
| `src/app/sitemap.ts` | Dynamic sitemap — automatically includes new posts |
| `.github/workflows/scheduled-publish.yml` | The daily cron job |
