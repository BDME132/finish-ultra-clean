# FinishUltra — Business Overview

## What Is FinishUltra?

FinishUltra is a content and tools site for **beginner ultra runners** — people who are curious about or just starting out with ultra marathon distances (50K and beyond). The core promise is simple: give first-timers the honest, specific information they need to get to that finish line, without overwhelming them.

The target audience is not competitive athletes. It's people who've done a few road races, heard about ultras, and want to know where to even begin. The tone throughout the site is encouraging but direct — ultra running is hard, and beginners deserve straight talk.

---

## Site Sections

### Home (`/`)
The landing page. Introduces the brand, highlights the three core content pillars (Training, Gear, AI Coach), and pushes visitors toward the newsletter signup and Start Here guide.

### Start Here (`/start-here`)
The entry point for brand new visitors. Answers the question "I want to run an ultra — where do I begin?" Covers what an ultra actually is, realistic expectations, and where to go next on the site.

### Training (`/training`)
Training plan content for beginners. Key plans:
- **First 50K** (`/training/first-50k`) — the flagship plan, most-linked resource on the site
- **Base Building** (`/training/base-building`) — for runners not yet ready for a full plan
- **Race Week** (`/training/race-week`) — taper and race day logistics

### Gear (`/gear`)
Honest gear guides written for beginners who don't know what they need. Sub-sections:
- **Shoes** — trail shoe recommendations (Hoka, Salomon, etc.)
- **Packs** — hydration vests and handhelds
- **Nutrition** — race fuel (Tailwind, gels, real food)
- **Apparel** — what to wear for long days out
- **Kits** — curated gear bundles for specific scenarios

Gear content is the primary monetization surface — affiliate links throughout.

### Coach (`/coach`)
AI-powered coaching chat. Visitors can ask any ultra running question and get a response from "FinishUltra Coach," a GPT-4o-mini model with a custom system prompt. See **AI Coach** section below.

### Blog (`/blog`)
Long-form articles covering topics like "How hard is a 50K?", "What to wear for your first ultra", nutrition basics, and race selection. Content is hardcoded in the codebase (see Content Model).

### Newsletter (`/newsletter`)
Email signup page. The newsletter is the core audience-building asset — weekly ultra running tips delivered to subscribers. Email infrastructure runs through Resend.

### About (`/about`)
Background on the site and its purpose.

### Admin (`/admin`)
Password-protected internal dashboard. Used to:
- View the subscriber list
- Write and send newsletter campaigns to all subscribers

Not linked anywhere public on the site.

---

## AI Coach

The Coach chat is a key differentiator — a 24/7 coaching assistant tuned specifically for beginner ultra runners.

**Model:** OpenAI GPT-4o-mini via the Vercel AI SDK (`@ai-sdk/openai`, `ai`)

**System prompt persona:**
- Encouraging but honest
- Gives specific, actionable advice (not vague motivation)
- References FinishUltra resources when relevant (links to training plans, gear guides)
- Keeps responses concise (2–3 paragraphs max)
- Redirects medical/injury questions to professionals
- Knows popular gear brands and can make specific recommendations

**Rate limiting — two tiers:**
1. **Anonymous:** 5 free messages, no time reset. After 5, an inline signup gate appears.
2. **Subscribed:** Sign up for the newsletter to unlock 30 messages per calendar day (resets midnight UTC, no rollover). This ties the AI tool to the newsletter growth strategy.

**Limit tracking:** Stored in Supabase (`chat_rate_limits` table), keyed by IP address. Survives server restarts (unlike in-memory alternatives). Subscription status verified via a `chat_subscribed` cookie cross-referenced against the `email_signups` table.

---

## Monetization

**Current:**
- **Affiliate links** — gear pages link out to products on Amazon, REI, and brand sites. Revenue is commission-based on purchases.
- **Newsletter** — not directly monetized today, but grows the owned audience that future products/offers can reach.

**Potential future directions:**
- Sponsored content / brand partnerships (gear brands targeting ultra beginners)
- Paid training plans or coaching add-ons
- Digital products (race packing lists, nutrition calculators, etc.)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 3 |
| Language | TypeScript |
| AI | OpenAI GPT-4o-mini via Vercel AI SDK |
| Database | Supabase (PostgreSQL) |
| Email | Resend (transactional + bulk newsletters) |
| Hosting | Vercel |
| Analytics | Vercel Analytics |
| Fonts | Inter (body), Space Grotesk (headlines) via Google Fonts |

**No client-side state management library** — React state only.
**No animation library** — pure CSS keyframes + Tailwind utilities.

---

## Content Model

All editorial content (blog posts, training plans, gear products, kit bundles) is stored as **hardcoded TypeScript arrays** in `src/lib/content/`:

| File | Content |
|---|---|
| `src/lib/content/blog-posts.ts` | Blog article data |
| `src/lib/content/training-plans.ts` | Training plan details |
| `src/lib/content/products.ts` | Gear product listings with affiliate links |
| `src/lib/content/kits.ts` | Curated gear kit bundles |

Types are defined in `src/types/content.ts` (`BlogPost`, `AffiliateProduct`, `GearKit`, `TrainingPlan`).

This approach keeps content management simple (edit a TypeScript file, deploy) at the cost of requiring a code deploy for every content update. Suitable for the current scale.

---

## Database (Supabase)

Three tables in production:

| Table | Purpose |
|---|---|
| `email_signups` | Newsletter subscriber emails. Has unique constraint on `email`. |
| `newsletters` | Log of sent newsletter campaigns (subject, body, recipient count, sent timestamp). |
| `chat_rate_limits` | Per-IP message counters for the AI coach rate limiter. Tracks count, window start, and subscription status. |

Database client initialized in `src/lib/supabase.ts` using a service role key (server-side only).

---

## Admin System

Located at `/admin`. Protected by a password stored in the `ADMIN_PASSWORD` environment variable.

**Auth flow:** Password submitted → HMAC-SHA256 session token generated → stored as `admin_session` cookie (httpOnly, 24h expiry). Middleware in `middleware.ts` validates the cookie on all `/admin/*` and `/api/admin/*` routes.

**Admin capabilities:**
- View subscriber list (`/api/admin/subscribers`)
- Send newsletter to all subscribers (`/api/admin/newsletter/send`) — batched in groups of 100 with 1s delay between batches, logged to `newsletters` table

---

## Key Environment Variables

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (full DB access) |
| `OPENAI_API_KEY` | OpenAI API access for the AI coach |
| `RESEND_API_KEY` | Resend API for email sending |
| `ADMIN_PASSWORD` | Password for the admin dashboard |
| `ADMIN_EMAIL` | Where admin notifications are sent |

---

## Project Structure (abbreviated)

```
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/chat/         # AI coach endpoint (POST = chat, GET = rate limit check)
│   ├── api/email-signup/ # Newsletter signup endpoint
│   ├── api/admin/        # Admin-only endpoints (auth, subscribers, newsletter)
│   ├── coach/            # AI chat page
│   ├── blog/             # Blog listing + [slug] pages
│   ├── gear/             # Gear hub + sub-pages
│   ├── training/         # Training plan pages
│   └── admin/            # Admin dashboard UI
├── components/           # Shared React components (Header, ChatInterface, etc.)
├── lib/                  # Utilities: Supabase client, rate limiter, admin auth, content
└── types/                # TypeScript interfaces
```
