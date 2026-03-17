# Training Section Roadmap

This file tracks all planned improvements to the FinishUltra training section.
Check off items as they are completed. To execute a step, tell Claude: "do step [number] in docs/training-roadmap.md".

---

## Phase 1 — Foundation UI ✅

### 1.1 ✅ Featured card on training index page
**Files:** `src/components/TrainingPlanCard.tsx`, `src/app/training/page.tsx`
- "Ultra Training Plans" card visually distinct with gradient border, centered above other 3 cards
- Framed as "Build Your Custom Training Plan" with "Start Building →" CTA
- Other 3 cards remain in a 3-column grid below with "Or explore a specific plan" divider

### 1.2 ✅ 3-step plan builder wizard
**Files:** `src/app/training/plans/PlansClient.tsx`, `src/components/training/WizardStepper.tsx`, `src/components/training/DistanceCard.tsx`, `src/components/training/PlanTabs.tsx`
- Step 1: Choose distance (50K / 50M / 100K / 100M) via rich cards with taglines + duration ranges
- Step 2: Readiness calculator + level selection cards showing prerequisites and mileage ranges
- Step 3: Plan overview card + tabbed content (Schedule, Progression, Zones, Pacing, Resources)
- Removed overwhelming single-scroll layout, sticky nav, and buried calculators

---

## Phase 2 — Smarter Wizard ✅

### 2.1 ✅ More questions in Step 2: runner profile form
**Files:** `src/app/training/plans/PlansClient.tsx`

Add a short form in Step 2 (after or alongside the readiness calculator) that collects:
- **Race date** — date picker or "# weeks away" number input → show countdown in Step 3
- **Current weekly mileage** — number input (use this alongside longest run for recommendation)
- **Days/week available to train** — 3 / 4 / 5 / 6+ (affects plan tier recommendation)
- **Longest prior race** — None / 5K–half / Marathon / 50K / 50M+ (selector)
- **Primary goal** — Just finish / Beat a time goal (affects plan tier + pacing calculator default)
- **Terrain access** — Trails / Road / Mixed (flags in Step 3 if plan requires trails)

Recommendation engine: combine all inputs (not just longest run) to suggest the right distance + level combo. Show a single "We recommend: [50K Beginner]" banner above the level cards with an explanation.

### 2.2 ✅ Richer context per option in Steps 1 and 2
**Files:** `src/components/training/DistanceCard.tsx`, `src/app/training/plans/PlansClient.tsx`

**Distance cards (Step 1):**
- Add a "typical runner" one-liner: e.g. "Most first-timers start here" (50K), "For runners who've done a 50K and want more" (50M)
- Add a mini-preview of Week 1 on hover or expand: show total miles and key workout
- Add a "Most popular" badge on 50K

**Level cards (Step 2):**
- Add a "runner profile" blurb per level: e.g. Beginner: "You've finished a half marathon or marathon and run 3–4 days/week"
- Show the peak long run distance per level so users understand the commitment
- If the recommendation engine (2.1) has run, show "This matches your profile" instead of generic "Recommended for you"

---

## Phase 2.5 — Enhanced Personalization ✅

### 2.5.1 ✅ Expand to 5 training levels
**Files:** `src/app/training/plans/PlansClient.tsx`
- Added Foundation (below Beginner) and Competitive (above Advanced) levels
- 8 new plan configs (Foundation + Competitive × 4 distances) with full data
- Updated scoring thresholds: Foundation (score ≤ 0), Beginner (1–3), Intermediate (4–6), Advanced (7–10), Competitive (11+)

### 2.5.2 ✅ Auto-assign level from questionnaire
**Files:** `src/app/training/plans/PlansClient.tsx`, `src/components/training/WizardStepper.tsx`, `src/components/training/DistanceCard.tsx`
- Removed manual level selection cards entirely
- Recommendation engine auto-assigns level based on profile inputs
- Plan title shows "[User's name]'s [Distance] Training Plan" (or "Your" if not logged in)
- Level shown as subtle badge, not prominently
- "See Your Plan" button gated on filling out longest run
- WizardStepper Step 2 label changed to "Your Profile"
- DistanceCard "3 plan tiers" text changed to "Personalized plan"

### 2.5.3 ✅ Complete day-by-day schedule generator
**Files:** `src/app/training/plans/PlansClient.tsx`
- `generateFullSchedule(distance, level)` produces every day of every week
- Interpolates long run distances from checkpoint data
- Calculates weekly mileage with taper reduction
- Distributes workouts by phase (Base/Build/Peak/Taper)
- Assigns quality sessions (tempo, hills, intervals) based on phase and level
- Week navigator with arrows and dropdown replaces 3 sample week buttons
- Phase label and weekly mileage total shown per week
- Long run row highlighted

### 2.5.4 ✅ Time goal input in questionnaire
**Files:** `src/app/training/plans/PlansClient.tsx`
- Inline hours/minutes input revealed when "Beat a time goal" is selected
- Styled consistently with other form inputs
- Shows contextual average finish times per distance
- Values pass through to pacing calculator

---

## Phase 3 — Save Plans to Account

### 3.1 ☐ Supabase database table for saved training plans
**Files:** Supabase migration (SQL), `src/app/api/training-plan/route.ts` (new)

Create table:
```sql
training_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  distance text not null,           -- '50K' | '50M' | '100K' | '100M'
  level text not null,              -- 'beginner' | 'intermediate' | 'advanced'
  race_date date,
  goal text,                        -- 'finish' | 'time'
  target_hours int,
  target_mins int,
  custom_notes jsonb default '{}',  -- week-level notes: { "week_1": "notes...", ... }
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```

API route `POST /api/training-plan` — save/update plan for authenticated user.
API route `GET /api/training-plan` — fetch current user's saved plan.

### 3.2 ☐ "Save Plan" UI in Step 3
**Files:** `src/app/training/plans/PlansClient.tsx`

- Add a "Save to My Account" button in Step 3 (next to the plan overview card header)
- If not logged in: show a modal/prompt "Create a free account to save your plan" with Google OAuth button
- If logged in: button saves distance + level + race_date + goal to database, shows "Plan saved ✓"
- If user already has a saved plan: button becomes "Update Saved Plan"

### 3.3 ☐ "My Training Plan" section in /account page
**Files:** `src/app/account/AccountSettings.tsx` (or new `src/app/account/page.tsx` section)

- Show the user's saved plan (distance, level, race date countdown, start date)
- "View Plan" button that links back to `/training/plans` with the saved state pre-loaded
- "Edit Plan" option to go back through the wizard
- Delete plan option

---

## Phase 4 — Pheidi Integration with Training Plans

### 4.1 ☐ Pass saved plan context to Pheidi API
**Files:** `src/app/api/chat/route.ts`, `src/components/ChatInterface.tsx`

- When user is authenticated and has a saved plan, fetch plan data before sending chat request
- Inject plan as context into the system prompt:
  ```
  The user is training for a [50K] at the [Beginner] level.
  Their race is on [date], [X] weeks away.
  Their plan is [duration] weeks, running [X] days/week.
  ```
- Pass plan data from client via a new `planContext` field in the chat request body

### 4.2 ☐ Pheidi can answer questions about the saved plan
**Files:** `src/app/api/chat/route.ts`

- Update Pheidi's system prompt to include the user's current plan week and sample schedule
- Pheidi can now answer "Why is week 8 so hard?", "What's my long run this weekend?", "Am I on track?"
- Context includes: distance, level, duration, current week (if race_date is set), weekly mileage range, key workouts

### 4.3 ☐ Pheidi can modify the saved plan (write)
**Files:** `src/app/api/chat/route.ts`, new `src/app/api/training-plan/modify/route.ts`

- Add a tool call to Pheidi's system that allows it to write week-level notes/modifications to the `custom_notes` column
- When user says "swap my Thursday run for a swim in week 3", Pheidi calls the modify API and confirms the change
- Changes are scoped to `custom_notes` only (the base plan template stays unchanged)
- Step 3 UI shows custom notes inline with the sample schedule

---

## Phase 5 — Complete Placeholder Pages

### 5.1 ☐ Base Building page: full week-by-week content
**File:** `src/app/training/base-building/page.tsx`

Currently says "Full week-by-week breakdown coming soon." Add:
- 12-week table: Week, Focus, Long Run, Weekly Miles, Notes (same format as First 50K page)
- Key principles section
- Link to First 50K plan as "graduation" step

### 5.2 ☐ Race Day Checklist page: complete placeholder
**File:** `src/app/training/race-day-checklist/page.tsx`

Currently entirely "Coming soon." Add:
- Interactive checklist (checkbox UI) organized by category: Gear, Nutrition, Logistics, Mental
- 24-hour timeline: Night before / Race morning / Aid stations / Finish line
- Link back to Race Week Protocol

---

## Notes

- **Auth system**: Supabase with Google OAuth + magic link. User profiles in `profiles` table. Middleware protects `/account` routes.
- **AI**: Pheidi uses `gpt-4o-mini` via `@ai-sdk/openai`. System prompt lives in `src/app/api/chat/route.ts`.
- **Styling**: Tailwind CSS. Colors: primary `#0066FF`, accent `#FF6B00`, dark `#0F172A`, gray `#64748B`, light `#F8FAFC`.
- **Font**: Headlines use `font-headline` (Space Grotesk), body uses `font-sans` (Inter).
