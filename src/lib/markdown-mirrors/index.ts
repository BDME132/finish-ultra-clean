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

  // --- FAQ ---
  "/faq":
    fm(
      "Ultramarathon FAQ: 51 Questions Every Beginner Asks (Answered) | FinishUltra",
      "Every question about running your first ultra, answered honestly by beginners who've been there.",
      "/faq",
      "2026-04-11"
    ) +
    `# Ultramarathon FAQ: Every Question Beginners Ask, Answered

51 questions from real beginners, answered honestly without jargon or gatekeeping.

[See the full FAQ page](https://www.finishultra.com/faq) or browse by category below.

## Getting Started

### What is an ultramarathon?

An ultramarathon is any race longer than a marathon (26.2 miles). The most common distances are 50K (31 miles), 50 miles, 100K (62 miles), and 100 miles. Unlike road marathons, most ultras run on trails, feature significant elevation change, and prioritize finishing over speed. There's no minimum pace requirement — moving forward is all that matters.

### How hard is a 50K, really?

A 50K is only 4.9 miles longer than a marathon — if you can run a marathon, you can train for a 50K. The challenge isn't distance alone; it's trail terrain, sustained nutrition, and time on feet. Most beginner 50Ks have cutoffs of 8–10 hours, so you don't need to be fast. With 16 weeks of training and a solid nutrition plan, finishing is very achievable.

### Do I need to run a marathon before running an ultra?

No. Many runners skip the marathon entirely and go straight to their first ultra. A 50K finish does not require a marathon on your resume. What matters is your training base — if you can run a half marathon comfortably and commit to 16 weeks of structured training, you're ready to prepare for a 50K.

### Can a beginner run an ultramarathon?

Yes. Ultra running has no experience requirement, and the community is one of the most welcoming in all of sport. Beginners finish ultras every weekend. The key is choosing the right first race (flat course, generous cutoffs, good aid stations) and following a structured training plan that builds mileage gradually over 16–20 weeks.

### How do I know if I'm ready for an ultramarathon?

You're likely ready if you can comfortably run a half marathon, have been running consistently for 6+ months, and can commit to 4 days per week of training for 16–20 weeks. You don't need to be fast or have run a marathon. If you can run 10–13 miles without it feeling catastrophic, you have the base to train for a 50K.

### Am I too slow to run an ultra?

Probably not. Most 50K races have cutoffs of 8–10 hours, which works out to roughly a 15–19 minute per mile average — including walking and aid station stops. Ultra running is not about speed. The people at the back of the pack often have the most fun. As long as you can keep moving forward, you belong at the start line.

### What's the difference between a trail ultra and a road ultra?

Trail ultras run on dirt paths, mountain terrain, and technical trails — often with significant elevation gain. Road ultras run on pavement and tend to be flatter and faster. Trail ultras are far more common, especially at longer distances, and require trail-specific shoes and gear. Most beginner ultras are trail races.

### How long does it take to train for an ultramarathon?

16 weeks is standard for a 50K if you already have half marathon fitness. If you're starting from less than that, budget 20–24 weeks. Training for a 50-mile race typically takes 20–24 weeks, and 100-mile preparation usually requires 6+ months of consistent training. Rushing the process is the #1 cause of injury in new ultra runners.

### What distance should I run for my first ultra?

Start with a 50K. It's the most beginner-friendly distance: manageable mileage, widely available races, and enough of a step up from a marathon to feel like an achievement. Some runners start with a 50-mile if they already have a marathon background and want more of a challenge, but the 50K is the standard entry point for good reason.

### How do I choose my first ultramarathon race?

Look for a race with: a flat-to-moderate course (under 5,000 feet of total climb), aid stations every 4–6 miles, a generous cutoff (10+ hours for a 50K), and a strong beginner-friendly reputation. Avoid technical mountain races for your first attempt. A local 50K with a looped course is often the ideal starting point.

## Training

### How many miles per week should I run to train for a 50K?

Most beginner 50K plans peak at 35–45 miles per week over a 16-week program. You don't need to run 50+ miles per week to finish a 50K. What matters more than peak mileage is consistency: 4 days per week, a weekly long run that builds to 20–22 miles, and back-to-back long runs on weekends.

### How long should my longest training run be before a 50K?

Your longest training run should be 20–22 miles, reached about 3 weeks before your race. You do NOT need to run the full 50K distance in training — your body can't recover fast enough from runs over 22 miles to keep training productively. The combination of your long run and next-day easy run simulates the fatigue of race day better than one massive effort.

### What are back-to-back long runs and why do they matter?

Back-to-back long runs mean doing your long run on Saturday, then a medium-length run on Sunday on tired legs. For example: 18 miles Saturday + 10 miles Sunday. This teaches your body to run when fatigued — exactly what ultras demand — without requiring a single 30-mile training run. It's the most important and unique element of ultra training.

### Do I need to run the full 50K distance in training?

No. Most training plans cap the longest run at 20–22 miles. Running the full 50K in training would take too long to recover from and wouldn't make race day easier. Your race fitness comes from accumulated weekly mileage, back-to-back long runs, and consistent training — not one heroic long run.

### How many days per week should I run for ultra training?

Four days per week is the sweet spot for most beginners: one long run, one medium run, and two easy runs. Running more than 5 days per week increases injury risk without proportionally improving fitness for a first-time ultra runner. Quality and consistency beat volume every time.

### Do I need to do speed work for an ultra?

No. Speed work (intervals, tempo runs) is not necessary for finishing a 50K. Ultra running is about aerobic endurance, not speed. Most of your training — 80% or more — should be run at a genuinely easy, conversational pace. Save speed work for road racing or once you're an experienced ultra runner chasing competitive times.

### Should I walk during an ultra?

Yes — walking is not just allowed, it's strategic. Nearly all experienced ultra runners walk the uphills and run the flats and downhills. Walking steep climbs conserves energy and is often faster than running them. Practice run-walk strategies on your long training runs so the transition feels natural on race day. Walking is not giving up — it's racing smart.

### How important is strength training for ultra runners?

Very important — but it doesn't have to be complicated. Two 20-minute sessions per week of single-leg squats, step-ups, calf raises, and side planks can reduce injury risk by up to 50% according to research. Strong legs handle trail terrain and descents far better than running-only fitness. You don't need a gym — bodyweight exercises work fine.

### How do I train for an ultra if I have a full-time job?

Four days per week with smart scheduling works well around a full-time job. Typical setup: two weekday runs (30–45 minutes each, easy pace), one Thursday medium run (60–75 minutes), and a Saturday long run. Most of the training volume comes from the long run, so as long as you protect Saturday mornings, the rest is manageable.

### What's the taper for a 50K?

The taper for a 50K is 2–3 weeks. In the final 3 weeks, reduce weekly mileage by about 20% each week. Your longest run in the final week before race day should be no more than 10 miles, and in the last 4 days, keep runs to 20–30 minutes. Expect to feel restless, heavy, and undertrained — this is normal and called 'taper madness.'

## Gear

### What shoes should I wear for my first ultra?

For your first ultra, prioritize maximum cushion and proven grip over lightweight racing performance. The Hoka Speedgoat 5 (~$155) is the most popular beginner trail shoe for good reason: enough cushion for 31 miles, aggressive outsole grip, and a well-tested design. Size up half a size to account for foot swelling on long runs. Never race in unproven shoes.

### Do I need a running vest or hydration pack?

Yes — for almost every ultra, a running vest is required or strongly recommended. You need to carry water, nutrition, and often mandatory gear (headlamp, emergency blanket, phone) that won't fit in shorts pockets. A race vest (6–10L capacity) is more stable and comfortable than a handheld bottle for anything over 15 miles.

### How much gear do I need for my first ultra?

For a 50K, you need surprisingly little: trail shoes, a running vest with water capacity, trail socks, moisture-wicking clothing, and race nutrition. Most 50K races have aid stations every 4–6 miles, so you're never far from support. Budget $400–600 for a solid beginner setup. Our gear kit builder creates a personalized list for your specific race.

### What should I carry during a 50K?

Carry: 1–1.5 liters of water (soft flasks in your vest), 200–300 calories per hour of race nutrition, your phone, a small blister kit, anti-chafe, and any race-required gear (check your race's mandatory list). You don't need to carry everything between aid stations — pack light, restock at every station.

### Do I need different socks for trail running?

Yes. Trail running socks are thicker, more durable, and often use merino wool or synthetic blends that resist moisture and odor. For ultras, toe socks (like Injinji Trail) are widely recommended — they prevent blisters between the toes, which is where the majority of ultra blisters occur. Never wear cotton socks for any run over 10 miles.

### Should I use trekking poles for my first ultra?

For a first 50K on moderate terrain, poles are optional. They're most valuable on courses with significant climbing (5,000+ feet) or technical descents. If you use them, practice with them on training runs before race day — poles change your gait and require upper body engagement. Check your race rules first; some events don't allow poles.

## Nutrition & Hydration

### What should I eat during an ultra?

Aim for 200–300 calories per hour from easily digestible sources. The simplest approach for beginners: use Tailwind Endurance Fuel in your water bottles (calories + electrolytes in one) and supplement with gels, chews, or real food at aid stations. Start fueling early — at mile 5–8 — before you feel hungry. Waiting until you're hungry is too late.

### How much water should I drink during an ultra?

Drink to thirst — don't follow a rigid schedule. Most runners consume 16–24 oz per hour, but this varies widely based on temperature, sweat rate, and intensity. The critical rule: never drink plain water without accompanying electrolytes during a race. Over-drinking plain water causes hyponatremia (dangerously low sodium), which is more common than dehydration in ultras.

### What are electrolytes and why do they matter for ultras?

Electrolytes are minerals (primarily sodium, potassium, and magnesium) that your body loses through sweat. In an ultra, replacing them is as important as replacing calories. Without adequate sodium, you can develop hyponatremia — a dangerous drop in blood sodium that causes confusion, nausea, and in severe cases, seizures. Aim for 500–700mg of sodium per hour during your race.

### Why do ultra runners eat real food instead of gels?

After 4–6 hours of running, most people can't stomach another gel. Taste fatigue is real — your brain actively craves different textures, temperatures, and flavors. Real food (boiled potatoes, PB&J, ramen, watermelon) is easier to eat when nauseated and often more satisfying. Aid stations stock real food specifically for this reason. Plan to transition to real food in the second half of any race over 50K.

### What is bonking and how do I avoid it?

Bonking is a sudden energy crash caused by depleted glycogen stores — your body runs out of available carbohydrates and hits a wall. It feels like sudden weakness, brain fog, nausea, and an overwhelming desire to stop. To avoid it: start fueling early (mile 5–8), eat consistently every 20–30 minutes, and never skip aid stations. Bonking is almost entirely preventable with good nutrition.

### Should I carb load before an ultra?

Yes, for races 4+ hours. Start 2–3 days before your race by increasing carbohydrate intake by 20–30% — extra pasta, rice, bread, and potatoes. Avoid high-fiber foods that might cause GI issues on race day. This tops off your glycogen stores and gives you a fuller tank at the start line. Stick to foods your gut already knows and tolerates well.

### What should I eat the morning of my ultra?

Eat a carb-heavy, familiar breakfast 2–3 hours before your race start. Something you've tested on long training runs — oatmeal, toast with peanut butter, a bagel with banana, or rice cakes. Keep it low in fat and fiber to minimize GI risk. Eat something even if you're nervous; starting with a full glycogen tank matters more than pre-race nerves.

### How do I train my gut for eating during runs?

Practice eating on every long run over 10 miles — no exceptions. Your digestive system needs to learn to process food while blood is diverted to working muscles. Start simple: a gel or chew every 30 minutes. Gradually introduce more varied foods. By the time you're doing 18-mile training runs, eating on the move should feel completely normal.

## Race Day

### What should I expect at my first ultra?

Expect to feel amazing for the first half and challenged for the second — that's the ultra experience. You'll encounter aid stations stocked with food and volunteers cheering you on. Expect your feet to hurt in new ways, your mood to swing, and your pace to slow. Also expect moments of pure joy, incredible scenery, and a finish line that'll make you cry. The ultra community is welcoming and positive.

### How do I pace a 50K?

Start 15–20% slower than you think you should. This is not an exaggeration. The #1 mistake in a first 50K is going out too fast and blowing up in the second half. Walk every uphill, even from mile 1. Run the flats and easy downhills. Use the pace calculator to set a conservative target finish time, then run even slower than that for the first 10 miles.

### What is an aid station and what do they have?

Aid stations are checkpoints along the race course where volunteers provide food, drinks, and support. They're typically spaced every 4–8 miles. Most stock water, sports drink, soda, chips, boiled potatoes, PB&J, bananas, and broth. Some larger races have hot food, medical support, and chair seating. Always stop, eat something, and refill your water at every station.

### What is a DNF and is it okay to drop out?

DNF means 'Did Not Finish.' It's a legitimate race outcome that every ultra runner encounters eventually. Dropping out is absolutely okay if you're injured, medically unwell, or in danger. Never quit at an aid station — leave and walk for 10 minutes first, because most 'I want to quit' feelings pass. But if you're experiencing confusion, chest pain, or injury that won't resolve, stopping is the smart, safe choice.

### Do I need a crew or pacer for a 50K?

No. Most 50K races don't allow crew access, and pacers are typically only permitted for 50-mile races and beyond. A 50K is self-sufficient with aid stations — you won't need your own support team. Having a friend or family member at the finish line is nice but not logistically necessary. Save the crew coordination for your first 100-miler.

### What do I do the week before my ultra?

Follow a strict taper: easy running only, sleep 8+ hours nightly, carb load starting Wednesday, and do a full gear check Tuesday. Don't try new food, shoes, or gear. Review the course profile and aid station locations. Prepare drop bags if applicable. Lay out all race gear the night before. Expect to feel restless and undertrained — that's taper madness, and it's normal.

### What if I have to use the bathroom during an ultra?

Go. Most races have porta-potties at aid stations, and using them adds only 2–3 minutes to your time. If you need to go between aid stations, duck off trail with some privacy — it happens to nearly every ultra runner and nobody bats an eye. Carry a small packet of toilet paper or wipes in your vest. GI issues are common in ultras; being prepared removes the stress.

### Will I hallucinate during an ultra?

In a 50K, no. Hallucinations are almost exclusively a feature of 100-mile and longer races where you're running through the night with extreme sleep deprivation (18+ hours of continuous effort). In a 50K finishing in 6–9 hours, you won't experience sleep deprivation severe enough to cause visual or auditory hallucinations. Save your hallucination worry for your first 100-miler.

## Injuries & Recovery

### How do I prevent blisters during an ultra?

Three things prevent the majority of blisters: properly fitted shoes (thumb's width of toe space, no heel slippage), toe socks like Injinji Trail, and anti-chafe lubricant on friction points. Shoes should be a half size larger than your street shoes to account for foot swelling. Practice your entire shoe-and-sock system on long training runs, not for the first time on race day.

### What should I do to recover after my first ultra?

The first week after a 50K: walk daily (don't sit still), sleep as much as possible, eat plenty of protein and carbohydrates, and don't run. Week 2: light jogging if soreness has resolved. Return to full training by week 3–4. Most runners are surprised by how long the fatigue lingers — systemic fatigue can last 2–3 weeks even if your legs feel normal after a few days.

### Is it normal to not be able to walk after an ultra?

Yes, completely normal — especially the stairs. Severe delayed onset muscle soreness (DOMS) in the quads is almost universal after a first 50K, particularly after technical descents. The soreness peaks 48–72 hours post-race and usually resolves within 5–7 days. Gentle walking, gentle stretching, protein intake, and sleep accelerate recovery. It feels worse than it is.

### How do I prevent injuries during ultra training?

Follow the 10% rule (never increase weekly mileage by more than 10% per week), run 80% of miles at easy/conversational pace, do strength training twice a week, take cutback weeks every 3–4 weeks, and sleep at least 7–8 hours. Most ultra training injuries come from increasing mileage too fast, running too hard on easy days, or skipping recovery weeks.

### Will I lose toenails from running an ultra?

Possibly, especially if your shoes fit too tightly or you have long toenails. Black toenails from repeated impact on descents are common but not universal. To minimize risk: size up half a size in trail shoes, keep toenails trimmed short before the race, and use toe socks. Lost toenails are painless once they detach and grow back within a few months.

## Mindset & Motivation

### How do I mentally prepare for my first ultra?

Practice mental toughness on your hardest training runs — specifically the last 30 minutes of your long runs when you're tired. Develop a go-to mantra. Break the race into small segments (next aid station, next mile) rather than thinking about the full distance. Remind yourself that every ultra runner has dark moments; the ability to keep moving through them is the skill you're building.

### What do you think about during a 50K?

Whatever gets you through. Many runners think about their nutrition and pace, chat with other runners around them, listen to music or podcasts, or focus on the scenery. Running with others — at least in the early miles — is one of the best parts of ultra culture. Preparing a playlist, an audiobook, and a few conversation topics gives you options for different parts of the race.

### What do I do when I hit a low point during the race?

First: don't quit at an aid station. Leave and walk for 10 minutes — most low points pass on their own. Eat and drink something; many lows are actually bonking in disguise. Change your music or start talking to another runner. If it's physical (nausea, pain), slow down and address the problem. Remind yourself that every finisher had a bad patch somewhere in that race — the low point is temporary.

### What if I finish last?

You're still a finisher. DFL (Dead Freaking Last) is a cherished term in ultra running — finishing last means you were the toughest person out there, because you kept moving when everyone else had already stopped. Race directors and volunteers celebrate every finisher. Nobody remembers who finished 47th vs. 48th. The finish line belongs to you no matter what time you cross it.
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
