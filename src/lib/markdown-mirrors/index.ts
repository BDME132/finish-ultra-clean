import { blogPosts } from "@/lib/content/blog-posts";
import { glossaryTerms } from "@/lib/content/glossary";

const BASE_URL = "https://www.finishultra.com";

function fm(
  title: string,
  description: string,
  path: string,
  lastUpdated: string
): string {
  return `---
title: ${title}
description: ${description}
url: ${BASE_URL}${path}
last_updated: ${lastUpdated}
---

`;
}

export function notFoundMarkdown(path: string): string {
  return `---
title: 404 Not Found
url: ${BASE_URL}${path}/index.md
last_updated: ${new Date().toISOString().split("T")[0]}
---

# 404 — Page Not Found

This page does not exist on FinishUltra.

[← Return to Home](/)
`;
}

// ---------------------------------------------------------------------------
// Static page content map
// ---------------------------------------------------------------------------

const staticPages: Record<string, string> = {
  // --- Homepage ---
  "/":
    fm(
      "FinishUltra — Free Ultra Marathon Training for Beginners",
      "Free training plans, honest gear reviews, an AI coach, and tools for first-time ultra runners. 50K through 100-mile distances.",
      "/",
      "2026-04-11"
    ) +
    `# FinishUltra

Free ultramarathon resources built by beginners, for beginners. Everything you need to go from curious to crossing your first finish line.

## What We Offer

- **Free Training Plans** — 16-week 50K plan, 12-week base building plan, race week protocol
- **Gear Guides** — Honest reviews of trail shoes, hydration vests, nutrition, and apparel
- **Pheidi AI Coach** — Ask anything about ultra running, available on every page
- **Pace Calculator** — Plan finish times and aid station splits for 50K to 100-mile races
- **Glossary** — Every ultra running term in plain English
- **18+ Articles** — Training, nutrition, gear, and race day guides written for beginners

## Get Started

- [Start Here](/start-here) — The complete beginner roadmap
- [First 50K Training Plan](/training/first-50k) — Free 16-week plan
- [Build Your Gear Kit](/gear/kits) — Personalized gear recommendations
- [Talk to Pheidi](/pheidi) — AI ultra coach

## From the Blog

Guides, gear reviews, and race reports for beginner ultra runners. See all at [/blog](/blog).
`,

  // --- Start Here ---
  "/start-here":
    fm(
      "Start Here — Your First Ultra Starts Now | FinishUltra",
      "New to ultra running? A clear path from zero to your first finish line. Free plans, gear guides, and an AI coach.",
      "/start-here",
      "2026-04-11"
    ) +
    `# Everything You Need for Your First Ultra

No gatekeeping. No jargon. A clear, step-by-step path from where you are now to crossing your first finish line.

## Where Are You Right Now?

**Building a Base** — Can run 3–6 miles → [12-Week Base Plan](/training/base-building)

**Ready to Train** — Can run a half marathon → [16-Week First 50K Plan](/training/first-50k)

**Race Coming Up** — Training is done → [Race Week Protocol](/training/race-week)

## Your 5-Step Roadmap

### Step 1: Learn What You're Getting Into

Ultra running isn't a mystery — it's just running far. Understand what race day looks like and learn the lingo.

- [How Hard Is a 50K, Really?](/blog/how-hard-is-a-50k)
- [12 Mistakes Every Beginner Makes](/blog/beginner-mistakes-ultra-marathon)
- [Ultra Glossary](/tools/glossary)

### Step 2: Pick Your Race

Choose a distance that excites you without terrifying you. A 50K is only 4.9 miles longer than a marathon, and most races have generous cutoffs.

- [How to Choose Your First Ultra](/blog/choosing-first-ultra)

### Step 3: Build Your Custom Gear Kit

Tell us about your race distance, terrain, climate, and budget — we'll build a personalized gear recommendation.

- [Build Your Kit](/gear/kits)
- [Trail Shoes](/gear/shoes)
- [What to Wear](/blog/what-to-wear-first-ultra)
- [Best Running Vests](/blog/best-running-vests-2025)

### Step 4: Train Smart

Follow a structured plan with gradual mileage, back-to-back long runs, and nutrition practice built in.

- [First 50K Plan](/training/first-50k)
- [Base Building Plan](/training/base-building)
- [Strength Training for Ultra Runners](/blog/strength-training-ultra-runners)
- [Custom Plan Builder](/training/plans)

### Step 5: Nail Nutrition & Race Day

Nutrition is the #1 reason first-timers DNF. Practice eating on long runs, finalize your gear, and trust your training.

- [Nutrition Guide](/blog/ultra-nutrition-beginners)
- [Electrolyte Guide](/blog/electrolyte-guide-ultra-runners)
- [Real Food for Ultras](/blog/real-food-ultra-marathon)
- [Race Week Protocol](/training/race-week)
- [Race Day Checklist](/blog/race-day-checklist)

## Free Tools

- [Pace Calculator](/tools/pace-calculator) — Plan your finish time with aid stops and slowdown factor
- [Custom Gear Builder](/gear/kits) — Personalized gear list for your race
- [Plan Builder](/training/plans) — Custom plans by distance, level, and timeline
- [Ultra Glossary](/tools/glossary) — Every term in plain English

## Essential Reading

- [How Hard Is a 50K, Really?](/blog/how-hard-is-a-50k) — Getting Started · 5 min
- [The No-BS 50K Training Guide](/blog/first-50k-training-guide) — Training · 7 min
- [Ultra Nutrition for Beginners](/blog/ultra-nutrition-beginners) — Nutrition · 4 min
- [12 Mistakes Every Beginner Makes](/blog/beginner-mistakes-ultra-marathon) — Race Day · 8 min

## Meet Pheidi — Your AI Ultra Coach

Not sure where to start? Pheidi can build a personalized plan, recommend gear, and answer any question about ultra running.

[Chat with Pheidi](/pheidi)
`,

  // --- About ---
  "/about":
    fm(
      "About | FinishUltra",
      "We're two high school runners documenting our journey into ultra running. Built by beginners, for beginners.",
      "/about",
      "2026-04-11"
    ) +
    `# About FinishUltra

Built by beginners, for beginners.

We're two high school runners who got curious about ultra running and couldn't find resources that spoke to us. Everything out there was made by elite athletes for experienced runners. So we built FinishUltra — the resource we wish existed when we started: specific, honest, and written by people who are still figuring it out themselves.

## Our Mission

Make ultra running approachable. We believe anyone with the curiosity and willingness to train can finish an ultra marathon. You don't need to be fast. You don't need expensive gear. You just need a plan and the confidence to start.

## What We Believe

1. **Beginners deserve specific advice.** "Just run more" isn't helpful. We give you exact plans, exact gear picks, and exact strategies.
2. **Honesty over hype.** If something is expensive and unnecessary, we'll tell you. If a budget option works just as well, we'll recommend it.
3. **You can do this.** A 50K sounds scary. It's only 4.9 miles longer than a marathon. If you can run a half, you can train for an ultra.

## How We Make Money

When we recommend gear, we include affiliate links. If you buy something through our links, we earn a small commission at no extra cost to you. We only recommend products we'd actually use.

See our [affiliate disclosure](/affiliate-disclosure) and [privacy policy](/privacy-policy).

## Contact

[Contact page](/contact) — hello@finishultra.com
`,

  // --- Contact ---
  "/contact":
    fm(
      "Contact | FinishUltra",
      "Get in touch with FinishUltra. Questions, corrections, affiliate inquiries.",
      "/contact",
      "2026-04-11"
    ) +
    `# Contact FinishUltra

Email: hello@finishultra.com

We typically respond within 2–3 business days.

## What to Contact Us About

- **General Questions** — Training, gear, or anything about the site
- **Editorial Corrections** — Found an error? Please let us know
- **Affiliate & Business** — Partnership and affiliate program inquiries

## Before You Email

- [Start Here](/start-here) — Complete beginner roadmap
- [Pheidi AI Coach](/pheidi) — Instant answers to training and gear questions
- [Blog](/blog) — 18+ articles covering common questions
- [Glossary](/tools/glossary) — Ultra running terminology
`,

  // --- Newsletter ---
  "/newsletter":
    fm(
      "Newsletter | FinishUltra",
      "One email a week: training tips, gear reviews, and beginner Q&A for ultra runners.",
      "/newsletter",
      "2026-04-11"
    ) +
    `# FinishUltra Newsletter

One email a week. That's it.

## What You'll Get

- **Training tip** — A specific, actionable tip for your training week
- **Gear spotlight** — One piece of gear worth knowing about
- **Beginner Q&A** — Real questions from the community, answered honestly
- **Race calendar** — Upcoming races worth knowing about

Free, no spam, unsubscribe anytime.
`,

  // --- Coach / Pheidi ---
  "/coach":
    fm(
      "Pheidi — AI Ultramarathon Coach | FinishUltra",
      "Ask Pheidi anything about ultra running. Training plans, gear advice, nutrition, race prep — instant personalized answers.",
      "/coach",
      "2026-04-11"
    ) +
    `# Pheidi — Your AI Ultra Coach

Pheidi is FinishUltra's AI ultramarathon coach. Ask anything about ultra running and get instant, personalized answers. Available at [finishultra.com/coach](https://www.finishultra.com/coach) and as a floating widget on every page.

## What Pheidi Can Help With

- **Training Plans** — Custom week-by-week plans based on your race, timeline, and fitness level
- **Gear Advice** — Shoe recommendations, vest comparisons, what to carry on race day
- **Nutrition** — Fueling strategies, product recommendations, race day nutrition plans
- **Race Prep** — Taper guidance, race week protocols, aid station strategy

*Pheidi is an AI assistant. Always verify medical or safety-critical advice with a qualified professional.*
`,

  "/pheidi":
    fm(
      "Pheidi — AI Ultramarathon Coach | FinishUltra",
      "Ask Pheidi anything about ultra running. Training plans, gear advice, nutrition, race prep.",
      "/pheidi",
      "2026-04-11"
    ) +
    `# Pheidi — Your AI Ultra Coach

Pheidi is FinishUltra's AI ultramarathon coach. Same experience as [/coach](/coach).

## What Pheidi Can Help With

- **Training Plans** — Custom plans based on your race, timeline, and fitness level
- **Gear Advice** — Shoe recommendations, vest comparisons, race day gear
- **Nutrition** — Fueling strategies, product recommendations
- **Race Prep** — Taper guidance, race week protocols, aid station strategy

*Pheidi is an AI assistant. Always verify medical or safety-critical advice with a qualified professional.*
`,

  // --- Training ---
  "/training":
    fm(
      "Free Ultra Marathon Training Plans | FinishUltra",
      "Free ultra marathon training plans for beginners. 50K, base building, and race week plans.",
      "/training",
      "2026-04-11"
    ) +
    `# Training Plans

Free ultra marathon training plans built for beginners. No fluff, no paywalls.

## Available Plans

### First 50K — 16 Weeks
From half marathon fitness to your first 50K. Includes back-to-back long runs, nutrition practice, and gear testing.
→ [View the 16-Week 50K Plan](/training/first-50k)

### Base Building — 12 Weeks
For runners currently at 3–6 miles. Build the aerobic foundation before starting a race-specific plan.
→ [View the Base Building Plan](/training/base-building)

### Race Week Protocol — 7 Days
Day-by-day guidance for the final week before your ultra. Taper, nutrition, gear prep, and mental readiness.
→ [View the Race Week Protocol](/training/race-week)

## Custom Plan Builder
→ [Open the Plan Builder](/training/plans)

## Training Dashboard
→ [Track your progress](/training/dashboard)
`,

  "/training/first-50k":
    fm(
      "Your First 50K Training Plan | FinishUltra",
      "A free 16-week training plan to get you from half marathon fitness to your first 50K ultra marathon.",
      "/training/first-50k",
      "2026-04-11"
    ) +
    `# Your First 50K Training Plan

**Distance:** 50K | **Level:** Beginner | **Duration:** 16 weeks

From half marathon fitness to ultramarathoner in 16 weeks. Mileage builds gradually with nutrition practice and gear testing built in.

## Week-by-Week Breakdown

| Week | Focus | Long Run | Weekly Miles | Notes |
|------|-------|----------|--------------|-------|
| 1 | Build Base | 10 mi | 25–30 | Easy pace. Get comfortable with time on feet. |
| 2 | Build Base | 11 mi | 27–32 | Add 1 mile to long run. Practice hydration. |
| 3 | Build Base | 13 mi | 30–35 | First back-to-back: 13 Sat + 6 Sun. |
| 4 | Recovery | 8 mi | 20–25 | Cutback week. Let your body adapt. |
| 5 | Build Endurance | 14 mi | 32–37 | Start practicing race nutrition on long runs. |
| 6 | Build Endurance | 16 mi | 35–40 | Back-to-back: 16 Sat + 8 Sun. |
| 7 | Build Endurance | 17 mi | 37–42 | Test your race shoes and vest on this one. |
| 8 | Recovery | 10 mi | 22–27 | Cutback week. How's your nutrition strategy feeling? |
| 9 | Peak Building | 18 mi | 38–43 | Biggest back-to-back: 18 Sat + 10 Sun. |
| 10 | Peak Building | 20 mi | 40–45 | Your longest run. Simulate race conditions. |
| 11 | Peak Building | 22 mi | 42–47 | Final big effort. You're ready after this. |
| 12 | Recovery | 12 mi | 25–30 | Cutback week. Trust the training. |
| 13 | Sharpening | 18 mi | 35–40 | Last long run with race nutrition dress rehearsal. |
| 14 | Taper | 14 mi | 28–33 | Mileage drops. You may feel restless — that's normal. |
| 15 | Taper | 10 mi | 20–25 | Easy running only. Focus on sleep and recovery. |
| 16 | Race Week | 50K Race! | Race | You've done the work. Go get that finish line. |

## Key Principles

### Run Easy
80% of your running should be at conversational pace. If you can't talk in full sentences, slow down. Ultra running is about endurance, not speed.

### Back-to-Back Long Runs
Running long on Saturday then medium on Sunday teaches your body to run on tired legs — exactly what you'll face in a 50K.

### Practice Nutrition
Every long run is a chance to test your fueling strategy. By race day, eating while running should feel automatic.

### Respect Cutback Weeks
Weeks 4, 8, and 12 are recovery weeks. Don't skip them or add extra mileage. This is when adaptation happens.

## Related

- [Race Week Protocol](/training/race-week)
- [Build Your Gear Kit](/gear/kits)
- [Ultra Nutrition Guide](/blog/ultra-nutrition-beginners)
`,

  "/training/base-building":
    fm(
      "12-Week Base Building Plan | FinishUltra",
      "Build an aerobic base before starting race-specific ultra training. For runners currently at 3–6 miles.",
      "/training/base-building",
      "2026-04-11"
    ) +
    `# 12-Week Base Building Plan

**Level:** Beginner | **Duration:** 12 weeks | **Starting fitness:** Can run 3–6 miles

Build the aerobic base you need before jumping into a race-specific ultra plan.

## What This Plan Does

- Builds your long run from 6 to 12 miles
- Increases weekly mileage gradually (10% rule)
- Introduces back-to-back running on weekends
- Prepares you for the [First 50K Training Plan](/training/first-50k)

## After This Plan

You'll be ready for the [First 50K Training Plan](/training/first-50k).

→ [Talk to Pheidi for a custom base-building plan](/pheidi)
`,

  "/training/race-week":
    fm(
      "Race Week Protocol | FinishUltra",
      "A day-by-day guide for the week before your ultra marathon. Taper, nutrition, gear prep, and mental readiness.",
      "/training/race-week",
      "2026-04-11"
    ) +
    `# Race Week Protocol

**Distance:** Any | **Level:** Beginner | **Duration:** 7 days

The final 7 days before your ultra. Day-by-day guidance for taper, nutrition, gear prep, and mental readiness.

## Day-by-Day Guide

### Monday (6 days out) — Easy Shakeout
20–30 minute easy run. Nothing hard. Start prioritizing sleep — aim for 8+ hours every night this week.

### Tuesday (5 days out) — Gear Check
Lay out everything you plan to wear and carry. Check your vest pockets, charge your watch, verify you have enough nutrition. Rest day or 20 min walk.

### Wednesday (4 days out) — Short Easy Run
20 minutes easy. Start carb loading — increase carbohydrate intake by 20–30%. Pasta, rice, bread, potatoes. Don't try new foods.

### Thursday (3 days out) — Rest Day
No running. Continue carb loading. Review the race course profile and aid station locations. Know what each aid station offers.

### Friday (2 days out) — Logistics Day
10 minute jog if you feel restless. Drive the route to the start if possible. Prepare drop bags. Print your race plan. Check the weather forecast.

### Saturday (1 day out) — Final Prep
Complete rest. Lay out race morning clothes. Pre-make breakfast. Set two alarms. Go to bed early — you probably won't sleep great, and that's normal.

### Sunday (Race Day) — Go Time
Eat your tested breakfast 2–3 hours before start. Arrive early. Use the bathroom twice. Start slow — slower than you think. Walk the uphills, run the flats. Eat at every aid station.

## Race Day Checklist

- Race vest / hydration pack packed
- Nutrition for full distance + 20% extra
- Headlamp + spare batteries
- First aid / blister kit + anti-chafe
- Drop bags prepared and labeled
- Watch charged
- Weather-appropriate layers
- Post-race gear in car
- Emergency contact info on race bib
- Cutoff times memorized for each aid station

## Related

- [First 50K Training Plan](/training/first-50k)
- [Ultra Nutrition Guide](/blog/ultra-nutrition-beginners)
`,

  "/training/race-day-checklist":
    fm(
      "Race Day Checklist | FinishUltra",
      "The complete race day checklist for your first ultra marathon.",
      "/training/race-day-checklist",
      "2026-04-11"
    ) +
    `# Race Day Checklist

The complete checklist for ultra marathon race day.

See the [Race Week Protocol](/training/race-week) for the full 7-day guide, and the [Race Day Checklist article](/blog/race-day-checklist) for a detailed breakdown.
`,

  "/training/plans":
    fm(
      "Training Plan Builder | FinishUltra",
      "Custom ultra marathon training plans by distance, level, and timeline.",
      "/training/plans",
      "2026-04-11"
    ) +
    `# Training Plan Builder

Build a custom ultra marathon training plan based on your race distance, current fitness level, and available time.

## Plans Available

- [First 50K — 16 Weeks](/training/first-50k)
- [Base Building — 12 Weeks](/training/base-building)
- [Race Week Protocol — 7 Days](/training/race-week)

Use the interactive builder at [finishultra.com/training/plans](https://www.finishultra.com/training/plans).
`,

  "/training/dashboard":
    fm(
      "Training Dashboard | FinishUltra",
      "Track your training progress and manage your active ultra marathon training plan.",
      "/training/dashboard",
      "2026-04-11"
    ) +
    `# Training Dashboard

Track your progress and manage your active training plan. Requires a free FinishUltra account.

- [Browse Training Plans](/training/plans)
- [Start Here](/start-here)
`,

  // --- Gear ---
  "/gear":
    fm(
      "Gear for Ultra Runners | FinishUltra",
      "Honest gear reviews and recommendations for ultramarathon beginners. Shoes, vests, nutrition, apparel, and complete race kits.",
      "/gear",
      "2026-04-11"
    ) +
    `# Ultra Marathon Gear

Honest gear reviews and recommendations for first-time ultra runners.

## Gear Categories

- [Trail Shoes](/gear/shoes) — Maximum cushion, lightweight racers, wide toe box, technical terrain picks
- [Packs & Vests](/gear/packs) — Race vests, training packs, expedition packs for 100-mile races
- [Nutrition](/gear/nutrition) — Gels, chews, hydration mixes, electrolytes, real food options
- [Apparel](/gear/apparel) — Base layers, shorts, insulation, rain shells
- [Gear Kits](/gear/kits) — Pre-built kits by distance, terrain, and budget
- [Race Day Kit](/gear/race-day-kit) — Everything you need for race day

## Build a Custom Kit

→ [Kit Builder](/gear/kits) — Personalized gear list for your race

## How We Review Gear

We use affiliate links to Amazon, REI, Backcountry, and Running Warehouse. We only recommend products we'd actually use. See our [affiliate disclosure](/affiliate-disclosure).
`,

  "/gear/shoes":
    fm(
      "Best Trail Running Shoes for Ultramarathons | FinishUltra",
      "Honest reviews of the best trail running shoes for ultra marathons. Maximum cushion, lightweight racers, wide toe box, and technical terrain picks.",
      "/gear/shoes",
      "2026-04-11"
    ) +
    `# Best Trail Running Shoes for Ultramarathons

Comprehensive trail shoe guide for ultra runners. Reviewed by beginners for beginners.

## Shoe Categories

### Maximum Cushion
Best for: long distances, all-day comfort, beginners

- **Hoka Speedgoat 5** (~$155) — The classic beginner ultra shoe. Max cushion, excellent grip, proven on all terrain.
- **Brooks Cascadia 17** (~$130) — Workhorse trail shoe with great durability for high-mileage training.
- **Salomon Ultra Glide 2** (~$140) — Smooth ride for trail-to-road mixed terrain.

### Lightweight Racers
Best for: faster runners, shorter ultras, good trails

- **Hoka Tecton X 2** (~$225) — Carbon-plated trail racer. For experienced runners chasing times.
- **Saucony Peregrine 14** (~$140) — Versatile lightweight option. Great for 50K and 50-mile races.

### Technical Terrain
Best for: rocky, rooty, steep trails requiring precision

- **La Sportiva Bushido III** (~$145) — Exceptional grip on wet rock.
- **Scarpa Ribelle Run** (~$180) — Italian precision for technical mountain terrain.

### Wide Toe Box
Best for: runners with wide feet, preventing blisters

- **Altra Lone Peak 8** (~$140) — Zero drop with wide toe box. Cult following among ultra runners.
- **Topo Athletic Ultraventure 3** (~$130) — Low drop, generous fit, high stack.

### Mountain / Alpine
Best for: 100-mile mountain races, heavy vertical gain

- **Hoka Mafate Speed 4** (~$175) — Built for serious mountain races. Maximum protection.

## How to Choose

1. **Cushion first** — For your first ultra, prioritize cushion over weight
2. **Fit matters most** — Thumb's width of space at the toe, no heel slippage
3. **Match terrain** — Lugged outsole for mud, rock plate for technical rocky trails
4. **Test on long runs** — Never race in unproven shoes

## Fitting Tips

- Size up half to one full size (feet swell over long distances)
- Try shoes at the end of the day when feet are largest
- Wear your race socks when fitting

## Technology Glossary

- **Midsole foam** — PEBA (Hoka, Saucony) is lightest; EVA is more durable
- **Rock plate** — Protects against sharp rocks; adds slight weight
- **Drop** — Height difference heel to toe; 4–8mm is typical; zero drop (Altra) requires adaptation period
- **Outsole lugs** — Deeper lugs = more grip on mud; shallower = faster on hard-packed

## Related

- [Best Running Vests](/blog/best-running-vests-2025)
- [What to Wear for Your First Ultra](/blog/what-to-wear-first-ultra)
- [Build Your Gear Kit](/gear/kits)
`,

  "/gear/packs":
    fm(
      "Best Running Vests & Hydration Packs for Ultras | FinishUltra",
      "Reviews of the best running vests and hydration packs for ultramarathon runners.",
      "/gear/packs",
      "2026-04-11"
    ) +
    `# Best Running Vests & Hydration Packs for Ultras

Your vest is your gear headquarters on race day.

## Categories

### Race Vests (Minimal, Fast)
Best for: 50K and 50-mile races

- **Salomon Active Skin 8** (~$160) — 8L, excellent fit, used by elite and beginner runners alike.
- **Ultimate Direction Race Vesta 6.0** (~$130) — Women's-specific cut, 6L, very comfortable.
- **Nathan VaporAiress 7L** (~$110) — Great value option with solid storage.

### All-Around Training & Racing
Best for: 50K through 100-mile, versatile use

- **Osprey Duro/Dyna 15** (~$180) — 15L, full-featured, excellent organization.
- **Salomon ADV Skin 12** (~$185) — The upgrade from the 8L for longer races.
- **UltrAspire Spry 2.0** (~$120) — Unique fit system, 4.5L, great for hot weather.

### Expedition / 100-Mile
Best for: 100-mile races with crew and drop bags

- **Ultimate Direction Mountain Vest 6.0** (~$190) — 15L, jacket attachment, serious storage.
- **Gregory Nano 18H** (~$160) — Structured back panel, 18L, good for mountain 100s.

## Capacity Guide

| Distance | Capacity | Water Carry |
|----------|----------|-------------|
| 50K | 6–10L | 1.5–2L |
| 50M | 10–12L | 2L |
| 100K | 12–15L | 2–3L |
| 100M | 15L+ | 2–3L |

## How to Choose

1. **Capacity** — Bigger race = more capacity
2. **Fit** — Bounce test with a loaded vest
3. **Front pockets** — You'll use these constantly; make sure they're accessible
4. **Soft flasks vs. bladder** — Soft flasks are faster to refill at aid stations

## Related

- [Best Running Vests 2025 (article)](/blog/best-running-vests-2025)
- [Build Your Gear Kit](/gear/kits)
`,

  "/gear/nutrition":
    fm(
      "Best Nutrition for Ultra Marathon Runners | FinishUltra",
      "Gels, chews, hydration mixes, electrolytes, and real food options for ultramarathon runners.",
      "/gear/nutrition",
      "2026-04-11"
    ) +
    `# Best Nutrition for Ultra Marathon Runners

Nutrition is the #1 reason first-timers DNF. Here's what to use and how to use it.

## Product Categories

### Gels
- **Maurten Gel 100** (~$3.50) — Clean ingredients, low GI issues for most runners.
- **Gu Energy Gel** (~$1.50) — Classic option, wide flavor variety, caffeinated options.
- **Spring Energy** (~$3.00) — Real food gels (rice, fruit). Great for sensitive stomachs.

### Chews & Waffles
- **Honey Stinger Waffles** (~$2.00) — Easiest solid food to eat while running.
- **Gu Chews** (~$2.50/pack) — Gummy format, easy to manage at effort.
- **Skratch Labs Sport Chews** (~$3.00) — Clean ingredients, easy to chew.

### Hydration Mixes
- **Tailwind Endurance Fuel** (~$25/bag) — Calories + electrolytes in one. Best for beginners.
- **Skratch Labs Sport Hydration** (~$22/bag) — Real fruit flavor, low sugar.
- **Maurten 320** (~$4/serving) — High carbohydrate, used by elites.

### Electrolytes
- **SaltStick Caps** (~$15/100 caps) — Sodium, potassium, magnesium. Take every 45–60 min.
- **Precision Hydration 1000** (~$2/tablet) — Higher sodium for heavy sweaters.
- **Nuun Sport** (~$7/tube) — Tablet format, easy to pack.

### Real Food (Aid Station Staples)
- Boiled potatoes with salt
- Peanut butter and banana sandwiches
- Ramen noodles
- Watermelon
- Broth (especially at night in long races)

## Fueling Strategy by Distance

| Distance | Calories/Hour | Start Fueling | Frequency |
|----------|--------------|---------------|-----------|
| 50K | 200–250 cal | Mile 6–8 | Every 30–45 min |
| 50M | 200–300 cal | Mile 5 | Every 20–30 min |
| 100K | 250–300 cal | Mile 5 | Every 20–30 min |
| 100M | 250–350 cal | Mile 1 | Every 15–20 min |

## Gut Training

Your gut needs to learn to process food while running. Practice eating on every long run in training. Skipping this is the most common race-day mistake.

## Related

- [Ultra Nutrition for Beginners](/blog/ultra-nutrition-beginners)
- [Electrolyte Guide](/blog/electrolyte-guide-ultra-runners)
- [Real Food for Ultras](/blog/real-food-ultra-marathon)
`,

  "/gear/apparel":
    fm(
      "Best Apparel for Ultra Runners | FinishUltra",
      "Base layers, shorts, insulation, and rain shells for ultramarathon runners.",
      "/gear/apparel",
      "2026-04-11"
    ) +
    `# Best Apparel for Ultra Runners

What to wear changes with distance, terrain, and conditions.

## Categories

### Base Layers
- **Patagonia Capilene Cool Trail Shirt** (~$55) — Versatile, fast-drying, anti-odor.
- **Smartwool Merino 150** (~$75) — Best for cold weather and multi-day events.

### Shorts & Bottoms
- **Salomon Trail Runner Shorts** (~$65) — 5" inseam, built-in liner, deep pockets.
- **Patagonia Strider Pro** (~$65) — Minimalist with zip pocket.
- **Rabbit EZ Short** (~$62) — Popular among ultra runners, soft feel.

### Insulation
- **Patagonia Nano Puff Vest** (~$150) — Packable, warm, great mid layer.
- **Arc'teryx Atom SL** (~$230) — Lightweight hooded insulation for mountain races.

### Rain & Wind Shells
- **Salomon Bonatti Trail Jacket** (~$200) — Waterproof, packable, trail-specific cut.
- **Outdoor Research Helium Rain Jacket** (~$199) — Lightest packable option.
- **Patagonia Houdini** (~$120) — Wind shell for mountain sections.

## Layering by Temperature

| Temperature | Recommended |
|-------------|-------------|
| 70°F+ | Singlet or short-sleeve, shorts |
| 55–70°F | Short-sleeve, shorts; shell in pack |
| 40–55°F | Long-sleeve base, shorts or tights, light gloves |
| Below 40°F | Thermal base, tights, insulation, waterproof shell, hat, gloves |

## Related

- [What to Wear for Your First Ultra](/blog/what-to-wear-first-ultra)
- [Build Your Gear Kit](/gear/kits)
`,

  "/gear/kits":
    fm(
      "Custom Gear Kits for Ultra Runners | FinishUltra",
      "Build a personalized gear kit for your ultra marathon. Answer a few questions and get a complete gear list.",
      "/gear/kits",
      "2026-04-11"
    ) +
    `# Custom Gear Kits

Tell us about your race and we'll build a personalized gear list.

## How It Works

Answer 10 questions about your race and budget, then get a complete gear recommendation covering:

- Footwear
- Hydration pack
- Lighting
- Clothing
- Foot care
- Nutrition
- Safety gear
- Recovery items

## Budget Tiers

- **Budget** ($300–500) — Everything you need to finish
- **Standard** ($500–900) — Upgrade key pieces for comfort
- **Premium** ($900–1500+) — Best-in-class gear for serious racing

## Showcase Kits

### First 50K Kit
Trail shoes + 8L vest + basic nutrition + essentials. ~$400–600

### Desert 100 Kit
Heat-resistant apparel, extra hydration, sun protection, electrolyte focus. ~$800–1200

### Mountain 50M Kit
Waterproof shell, poles, insulation layer. ~$700–1000

## Where to Buy

- Running Warehouse — Best selection of trail running gear
- REI — Great for packs, apparel, outdoor gear
- Amazon — Convenient; check for Prime eligibility
- Local running store — Try shoes before buying

→ [Build your kit at finishultra.com/gear/kits](https://www.finishultra.com/gear/kits)
`,

  "/gear/race-day-kit":
    fm(
      "Race Day Kit | FinishUltra",
      "Everything you need for ultra marathon race day. Complete gear checklist.",
      "/gear/race-day-kit",
      "2026-04-11"
    ) +
    `# Race Day Kit

Everything you need for race day, organized by category.

## Kit Categories

1. **Footwear** — Trail shoes, toe socks, gaiters, backup insoles
2. **Hydration** — Running vest, soft flasks, backup electrolytes
3. **Nutrition** — Gels, chews, real food, aid station backup nutrition
4. **Lighting** — Primary headlamp, backup headlamp, spare batteries
5. **Clothing** — Weather-appropriate layers, anti-chafe, arm warmers
6. **Safety & Medical** — Blister kit, emergency whistle, first aid basics, emergency contact card

## Pro Tips

- Pack 20% more nutrition than you think you'll need
- Test every piece of gear on training runs before race day
- Organize drop bags by aid station, not by category
- Carry anti-chafe even if you don't think you'll need it

→ [Race Week Protocol](/training/race-week)
→ [Build Your Custom Kit](/gear/kits)
`,

  "/gear/builder":
    fm(
      "Gear Builder | FinishUltra",
      "Interactive gear builder for ultra marathon runners.",
      "/gear/builder",
      "2026-04-11"
    ) +
    `# Gear Builder

Interactive tool to build your personalized ultra marathon gear list.

→ [Use the full Gear Kit Builder](/gear/kits) for complete product recommendations.
`,

  // --- Tools ---
  "/tools/pace-calculator":
    fm(
      "Ultra Marathon Pace Calculator | FinishUltra",
      "Calculate finish time, required pace, or per-mile pace for 50K, 50-mile, 100K, and 100-mile ultra marathons.",
      "/tools/pace-calculator",
      "2026-04-11"
    ) +
    `# Ultra Marathon Pace Calculator

Plan your finish time and aid station splits for any ultra marathon distance.

## Supported Distances

- 50K (31.07 miles)
- 50 miles
- 100K (62.14 miles)
- 100 miles

## How to Use

Enter your target finish time or target pace. The calculator outputs:

- Projected finish time
- Average pace per mile
- Estimated aid station splits

Includes a slowdown factor option to account for fatigue in the back half — critical for realistic planning at 50-mile and 100-mile distances.

→ [Open the Pace Calculator](https://www.finishultra.com/tools/pace-calculator)

## Related

- [Race Week Protocol](/training/race-week)
- [First 50K Training Plan](/training/first-50k)
`,

  // --- Other ---
  "/search":
    fm(
      "Search | FinishUltra",
      "Search FinishUltra for training plans, gear guides, articles, and tools.",
      "/search",
      "2026-04-11"
    ) +
    `# Search FinishUltra

Search for training plans, gear guides, articles, and tools.

Browse by section:

- [Training Plans](/training)
- [Gear](/gear)
- [Blog](/blog)
- [Glossary](/tools/glossary)
`,

  "/race-hq":
    fm(
      "Race HQ | FinishUltra",
      "Your personal race prep command center. Requires a free FinishUltra account.",
      "/race-hq",
      "2026-04-11"
    ) +
    `# Race HQ

Your personal race prep command center. Track your upcoming race, manage your gear kit, and review your training plan.

Requires a free FinishUltra account.

- [Start Here](/start-here)
- [Training Plans](/training)
- [Build Your Gear Kit](/gear/kits)
`,

  // --- Legal ---
  "/affiliate-disclosure":
    fm(
      "Affiliate Disclosure | FinishUltra",
      "FinishUltra participates in affiliate programs including Amazon Associates.",
      "/affiliate-disclosure",
      "2026-03-14"
    ) +
    `# Affiliate Disclosure

*Last updated: March 14, 2026*

FinishUltra participates in the Amazon Services LLC Associates Program and other affiliate programs. When you click a link and make a purchase, we may earn a small commission at no additional cost to you.

## How It Works

- Affiliate links appear in gear recommendations, blog posts, and gear pages
- Clicking a link and buying something earns us a small commission
- The price you pay is exactly the same whether you use our link or not
- We are not paid to recommend any specific product

## Our Editorial Standards

We recommend products based on merit, not affiliate income. We will always disclose when a link is an affiliate link.

## Programs We Participate In

- Amazon Associates (amazon.com)
- REI affiliate program
- Backcountry affiliate program
- Running Warehouse affiliate program

Questions? Email hello@finishultra.com.
`,

  "/privacy-policy":
    fm(
      "Privacy Policy | FinishUltra",
      "FinishUltra privacy policy. How we collect, use, and protect your information.",
      "/privacy-policy",
      "2026-03-14"
    ) +
    `# Privacy Policy

*Last updated: March 14, 2026*

## What We Collect

- **Email address** — when you sign up for the newsletter or create an account
- **Messages** — when you contact us or chat with Pheidi
- **Technical data** — anonymous analytics via Vercel Analytics
- **Cookies** — session cookies for authentication; analytics cookies

## How We Use It

- Send the weekly newsletter (if subscribed)
- Respond to messages
- Improve site content and performance
- Maintain account and Race HQ data

## Third-Party Services

- **Supabase** — Database and authentication
- **Resend** — Email delivery
- **OpenAI** — Powers the Pheidi AI coach
- **Vercel Analytics** — Anonymous usage analytics

## Your Choices

- **Unsubscribe** from the newsletter at any time via the link in any email
- **Disable cookies** in your browser settings
- **Request deletion** of your data: email hello@finishultra.com

## Contact

hello@finishultra.com
`,
};

// ---------------------------------------------------------------------------
// Dynamic: blog index (base template — post list appended at runtime)
// ---------------------------------------------------------------------------

const blogIndexBase =
  fm(
    "Blog — Ultra Marathon Guides & Articles | FinishUltra",
    "Training guides, gear reviews, nutrition advice, and race day prep for beginner ultra runners. 18+ free articles.",
    "/blog",
    "2026-04-11"
  ) +
  `# Blog

Training guides, gear reviews, nutrition advice, and race day prep — written by beginners for beginners.

## Categories

- Getting Started
- Training
- Gear
- Nutrition
- Race Day

## All Articles

`;

// ---------------------------------------------------------------------------
// Dynamic: individual blog post
// ---------------------------------------------------------------------------

function getBlogPostMarkdown(slug: string): string | null {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;

  const updated = post.updatedAt ?? post.publishedAt;
  let md = fm(`${post.title} | FinishUltra`, post.excerpt, `/blog/${post.slug}`, updated);

  md += `# ${post.title}\n\n`;
  md += `*${post.category} · ${post.readTime} · Published ${post.publishedAt}*\n\n`;
  md += `${post.excerpt}\n\n---\n\n`;
  md += `${post.body}\n\n`;

  if (post.faq && post.faq.length > 0) {
    md += `## Frequently Asked Questions\n\n`;
    for (const item of post.faq) {
      md += `### ${item.question}\n\n${item.answer}\n\n`;
    }
  }

  if (post.relatedSlugs && post.relatedSlugs.length > 0) {
    md += `## Related Articles\n\n`;
    for (const s of post.relatedSlugs) {
      const related = blogPosts.find((p) => p.slug === s);
      if (related) md += `- [${related.title}](/blog/${related.slug})\n`;
    }
    md += "\n";
  }

  return md;
}

// ---------------------------------------------------------------------------
// Dynamic: glossary
// ---------------------------------------------------------------------------

function getGlossaryMarkdown(): string {
  let md = fm(
    "Ultra Running Glossary | FinishUltra",
    "Every ultra running term explained in plain English. Beginner-friendly definitions.",
    "/tools/glossary",
    "2026-04-11"
  );

  md += `# Ultra Running Glossary\n\n`;
  md += `Every term you'll encounter in ultra running, explained in plain English. ${glossaryTerms.length} terms.\n\n`;

  const categoryOrder = ["race-day", "training", "nutrition", "gear", "general"];
  const categoryLabels: Record<string, string> = {
    "race-day": "Race Day",
    training: "Training",
    nutrition: "Nutrition",
    gear: "Gear",
    general: "General",
  };

  const byCategory = new Map<string, typeof glossaryTerms>();
  for (const term of glossaryTerms) {
    const cat = term.category ?? "general";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(term);
  }

  const orderedCats = [
    ...categoryOrder.filter((c) => byCategory.has(c)),
    ...[...byCategory.keys()].filter((c) => !categoryOrder.includes(c)),
  ];

  for (const cat of orderedCats) {
    const terms = byCategory.get(cat)!;
    const label = categoryLabels[cat] ?? cat;
    md += `## ${label}\n\n`;
    for (const t of terms) {
      md += `### ${t.term}\n\n${t.definition}\n\n`;
    }
  }

  return md;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getMarkdownForPath(path: string): string | null {
  // Normalize trailing slash
  const normalized = path === "/" ? "/" : path.replace(/\/$/, "");

  // Blog index — append post list dynamically
  if (normalized === "/blog") {
    let md = blogIndexBase;
    for (const post of blogPosts) {
      md += `- [${post.title}](/blog/${post.slug}) — ${post.category} · ${post.readTime}\n`;
    }
    return md;
  }

  // Glossary — fully dynamic from content file
  if (normalized === "/tools/glossary") {
    return getGlossaryMarkdown();
  }

  // Static pages
  if (normalized in staticPages) {
    return staticPages[normalized];
  }

  // Dynamic blog posts — /blog/:slug
  if (normalized.startsWith("/blog/")) {
    const slug = normalized.slice("/blog/".length);
    return getBlogPostMarkdown(slug);
  }

  return null;
}
