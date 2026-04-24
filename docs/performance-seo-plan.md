# Performance & SEO/AEO Plan

Two-phase plan to improve FinishUltra's Core Web Vitals and search/answer-engine visibility.

---

## Phase 1 — Performance ✅ Complete

### 1.1 Un-client the root layout ✅

Split the monolithic `Header.tsx` ("use client", 430 lines) and `PheidiShell.tsx` into server shells + tiny client islands so static pages stop hydrating the full auth/chat tree.

**New client islands under `src/components/header/`:**
- `HeaderShell.tsx` — scroll-shadow `<header>` wrapper (useState/useEffect)
- `ActiveLink.tsx` — active-link highlighting via usePathname
- `MoreDropdown.tsx` — "More" dropdown via usePathname
- `AICoachButton.tsx` — opens Pheidi via usePheidi + usePathname
- `UserMenu.tsx` — auth/profile menu via useAuth
- `MobileMenu.tsx` — mobile nav via usePathname + useAuth + usePheidi
- `nav-links.ts` — shared primaryLinks / moreLinks constants

**`src/components/Header.tsx`** — rewritten as a pure server component; imports the islands above as leaves.

**`src/components/PheidiShell.tsx`** — server component; just wraps PheidiProvider + PheidiSidebarMount.

**`src/components/PheidiSidebarMount.tsx`** — client island; checks `/mom` exclusion via usePathname (moved from server-side headers() call).

### 1.2 `next/image` everywhere ✅

- `next.config.ts` — added `images.formats: ["image/avif", "image/webp"]`, `deviceSizes`, `remotePatterns` for Supabase/Amazon/Unsplash.
- `src/components/BlogPostCard.tsx` — `<img>` → `<Image fill sizes="..." />`
- `src/app/blog/[slug]/page.tsx` — cover image → `<Image fill priority />`
- `src/components/account/Avatar.tsx` — `<img>` → `<Image width height unoptimized />`
- `src/app/account/profile/ProfileForm.tsx` — avatar preview → `<Image />`

### 1.3 ISR / `revalidate` on content pages ✅

- `src/app/page.tsx` — `revalidate = 3600`
- `src/app/blog/page.tsx` — `revalidate = 3600`
- `src/app/blog/[slug]/page.tsx` — `revalidate = 86400` + `generateStaticParams`
- `src/app/gear/library/[productId]/page.tsx` — `revalidate = 86400`
- `src/app/sitemap.ts` — `revalidate = 3600`

**Critical fix**: `layout.tsx` was calling `headers()` (and old `Header.tsx` did too), which opts the entire route into dynamic rendering. Fixed by:
1. Removing `headers()` from `layout.tsx`; `rootLayoutJsonLdGraph()` now called at module level as a constant.
2. Removing `headers()` from all server components in the render path.
3. Updating `rootLayoutJsonLdGraph()` in `src/lib/schema.ts` to take no args (returns static Organization + WebSite graph only; breadcrumbs stay on individual pages).

Result: homepage, blog index, blog slugs, all gear pages, all training pages → static/ISR (`○`/`●` in build output).

### 1.4 Lazy-load the Pheidi chat sidebar ✅

`PheidiSidebarMount` uses `next/dynamic(() => import("./PheidiSidebar"), { ssr: false })` and only renders once `isPheidiOpen` has been true at least once. The `@ai-sdk/react` bundle is never loaded on initial page visit.

### 1.5 `lucide-react` tree-shaking ✅

`next.config.ts` — added `experimental.optimizePackageImports: ["lucide-react"]`.

### 1.6 Header avatar query — fetch once per session ✅

`src/components/AuthProvider.tsx` — added `HeaderProfile` interface + `profile` state. Profile is fetched once on auth state change and exposed via `useAuth()`. `UserMenu` reads it instead of fetching on every mount.

### 1.7 AVIF image conversion ✅

Converted 6 blog post hero images from JPEG to AVIF using sharp:
- `public/checklist.jpg` (1.4MB) → `public/checklist.avif` (305KB) — 78% reduction
- `public/cold.jpg`, `mistakes.jpg`, `nutrition.jpg`, `vest.jpg`, `wear.jpg` → `.avif`
- Updated `src/lib/content/blog-posts.ts` references accordingly.

### 1.8 Bundle analyzer ✅

`package.json` — added `"analyze": "ANALYZE=true next build"` script. `@next/bundle-analyzer` wraps the Next config in `next.config.ts`.

---

## Phase 2 — SEO/AEO ✅ Complete

### 2.1 Sitemap completeness ✅

`src/app/sitemap.ts` now loads in parallel and emits URLs for:
- **Gear library products** — 136 products from `ALL_PRODUCTS` (in-memory), priority 0.7, weekly.
- **Shared training plans** (`/training/shared-plans/[slug]`) via `loadPublicTrainingPlansServer`, priority 0.6, weekly.
- **Shared race-day kits** (`/gear/race-day-kit/[slug]`) via `loadPublicKitsServer`, priority 0.6, weekly.
- **Public user profiles** (`/u/[username]`) via new `loadPublicProfilesServer` (filters `profile_visibility = public`), priority 0.4, monthly.
- **Newsletter editions** (`/newsletter/[slug]`) via `loadPublishedNewsletters`, priority 0.6, monthly.

Glossary is a single page with anchors (not per-term routes) — no additional URLs required. Added `/start-here` and `/gear/library` top-level entries too.

New helper: `src/lib/account/public-profiles-server.ts`.

### 2.2 Product + Review schema ✅

`src/lib/schema.ts` additions:
- `productJsonLd(input)` / `productJsonLdNode(input, url)` — full Schema.org `Product` (name, sku, brand, image, description, category, url, aggregateRating, review).
- `productFromLibrary(product, extras)` — builds `ProductSchemaInput` from a library `Product`, with optional aggregateRating + reviews.
- `reviewJsonLdNode(review)` — `Review` with nested `Rating` (bestRating 5, worstRating 1).
- `itemListJsonLd` extended — each item can now carry a `product` field, producing a full `Product` node as the ListItem `item` (vs. URL only).

**Offer intentionally omitted**: we use affiliate links with no authoritative price/availability; stub offers cause Search Console warnings.

**Injected JSON-LD**:
- `src/app/gear/library/[productId]/page.tsx` — server-side review aggregate via new `loadProductReviewAggregateServer` (cookieless Supabase client so the page stays SSG). Emits `<JsonLd data={[breadcrumb, productSchema]} />` with aggregateRating + top 5 reviews when available.
- `src/app/gear/library/page.tsx` — full catalog ItemList with `Product`-typed entries.
- `src/app/gear/shoes/page.tsx`, `/packs`, `/nutrition`, `/apparel` — existing ItemLists upgraded to emit Product items (name, brand, description, category, anchor URL).

New helper: `src/lib/products/reviews-server.ts` (uses `getSupabasePublic`, no cookies, safe for SSG).

### 2.3 Markdown mirrors ✅

`src/lib/markdown-mirrors/index.ts` extended with dynamic handlers for the new sitemap URLs:
- `/gear/library/:productId` → product summary (brand/name, category, price, description, why we recommend, tags, affiliate link).
- `/gear/race-day-kit/:slug` → shared kit title/subtitle/author.
- `/training/shared-plans/:slug` → shared plan title/distance/level/author.
- `/newsletter/:slug` → full newsletter body.

`/u/:username` intentionally not mirrored — user profile pages are low-value for LLM crawling.

---

## Verification checklist

**Phase 1 (done):**
- [x] `npm run build` — all static/ISR pages show `○`/`●`, no unexpected `ƒ` dynamic pages
- [x] 204 pages generate successfully
- [x] AVIF conversion: checklist.jpg 1.4MB → 305KB (78% reduction)
- [ ] `npm run analyze` — capture before/after bundle sizes for `/`, `/blog`, `/blog/[slug]`, `/training/first-50k`
- [ ] PageSpeed / Lighthouse on deployed preview: target LCP < 2.5s, TBT < 200ms, CLS < 0.1 mobile

**Phase 2 (done in code; verify on deployed preview):**
- [x] Production build passes with 136 product pages SSG (`●`) via `generateStaticParams`
- [ ] `/sitemap.xml` on deployed preview — confirm product, shared-plan, shared-kit, newsletter, profile URLs present
- [ ] Load a product page → view source → paste JSON-LD into Google Rich Results Test → should pass as `Product` with no errors
- [ ] Re-run Rich Results Test on blog post, FAQ page, homepage — confirm no regressions
- [ ] `curl https://<preview>.vercel.app/gear/library/<productId>/index.md` — markdown mirror resolves
- [ ] After prod deploy: submit updated sitemap in Google Search Console; watch "Pages → Indexed"

---

## Out of scope (intentionally deferred)

- HowTo schema on training guides
- Expanded FAQ schema, Person/Speakable schema
- Full "use client" audit across every route beyond Header/PheidiShell
- Web Vitals custom instrumentation (using existing Vercel Analytics)
- Supabase query caching via `cache()`/`unstable_cache` (defer unless server render is measured bottleneck)
