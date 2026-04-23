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

## Phase 2 — SEO/AEO (pending)

### 2.1 Sitemap completeness

**File**: `src/app/sitemap.ts`

Currently covers: static routes + blog posts. Missing:

- [ ] **Gear library products** (`/gear/library/[productId]`): fetch all live products from Supabase. Priority 0.7, `weekly`, `lastModified` from `updated_at`.
- [ ] **Shared training plans** (`/training/shared-plans/[slug]`): fetch all public plans. Priority 0.6, `weekly`.
- [ ] **Shared race-day kits** (`/gear/race-day-kit/[slug]`): fetch all public kits. Priority 0.6, `weekly`.
- [ ] **Public user profiles** (`/u/[username]`): fetch profiles where `is_public = true`. Priority 0.4, `monthly`.
- [ ] **Newsletter editions** (`/newsletter/[slug]`): list published editions. Priority 0.6, `monthly`.
- [ ] **Glossary terms** — check if `/tools/glossary` renders individual term pages or anchors. If individual pages, add them.

Server-side loader helpers to create (mirroring `src/lib/blog-server.ts` pattern):
- `src/lib/products-server.ts`
- `src/lib/shared-plans-server.ts`
- `src/lib/shared-kits-server.ts`
- `src/lib/profiles-server.ts`

Use `createSupabaseServer` (not the browser client) in all loaders.

### 2.2 Product + Review schema

Biggest AEO win. Gear queries are where LLM answer engines source structured data, and `/gear/library/[productId]` currently ships no `Product` JSON-LD.

**`src/lib/schema.ts`** — add two new builders:
- [ ] `productSchema(product)` → `{ "@type": "Product", name, image, description, brand, sku, offers, aggregateRating?, review? }`
- [ ] `reviewSchema(review)` → `{ "@type": "Review", reviewRating, author, datePublished, reviewBody }`

**Note**: Only include `Offer.price` if we have authoritative pricing. For affiliate-only products, omit `offers` entirely — do not stub a fake price (causes Search Console warnings).

**Where to inject**:
- [ ] `src/app/gear/library/[productId]/page.tsx` — `<JsonLd data={productSchema(product)} />`. Include `aggregateRating` if product has ≥1 review; include top 5 recent reviews as nested `review` entries.
- [ ] `src/app/gear/{shoes,packs,nutrition,apparel}/page.tsx` — `ItemList` of `Product` items for category landing pages.

`src/components/JsonLd.tsx` already exists and is wired. New schemas just need builders + `<JsonLd>` insertion.

### 2.3 Verify markdown mirrors cover new sitemap URLs

`/middleware.ts` + `src/lib/markdown-mirrors/` already generate `/<path>/index.md` for every page. Spot-check that the new sitemap URLs (product library items, shared plans, shared kits, profiles, newsletter editions) resolve via `/<url>/index.md`. If any return 404, extend the generator. Free AEO win — LLMs prefer the `.md` endpoint.

---

## Verification checklist

**Phase 1 (done):**
- [x] `npm run build` — all static/ISR pages show `○`/`●`, no unexpected `ƒ` dynamic pages
- [x] 204 pages generate successfully
- [x] AVIF conversion: checklist.jpg 1.4MB → 305KB (78% reduction)
- [ ] `npm run analyze` — capture before/after bundle sizes for `/`, `/blog`, `/blog/[slug]`, `/training/first-50k`
- [ ] PageSpeed / Lighthouse on deployed preview: target LCP < 2.5s, TBT < 200ms, CLS < 0.1 mobile

**Phase 2 (when ready):**
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
