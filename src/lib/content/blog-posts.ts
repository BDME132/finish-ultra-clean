import { BlogPost } from "@/types/content";

export const blogPosts: BlogPost[] = [
  {
    id: "how-hard-is-a-50k",
    title: "How Hard Is a 50K, Really?",
    slug: "how-hard-is-a-50k",
    excerpt:
      "If you can run a marathon, you can run a 50K. Here's what to actually expect — the good, the bad, and the blisters.",
    body: `If you've been thinking about running a 50K but keep putting it off because it sounds impossibly hard, this post is for you.

The truth is: a 50K is only 4.9 miles longer than a marathon. That's it. The distance itself isn't the scary part — it's the terrain, the nutrition, and the mental game that make it different.

## The Good

Ultra runners are the friendliest people in all of running. The vibe at a 50K is completely different from a road marathon. People chat, share food, and genuinely cheer each other on. There's no "competing" — it's you vs. the distance.

Most 50Ks have generous cutoff times. You don't need to be fast. You just need to keep moving forward.

## The Bad

You will bonk if you don't practice nutrition. This is the #1 mistake first-time ultra runners make. You need to eat and drink consistently from mile 1. We recommend starting with Tailwind Endurance Fuel — it's the simplest approach for beginners.

Your feet will hurt in new ways. Trail terrain is unforgiving, and 31 miles of roots and rocks will find every weakness in your footwear. Invest in good trail shoes and toe socks.

## The Bottom Line

A 50K is hard, but it's not impossible. If you can run 20 miles, you can train for a 50K. Start with our First 50K Training Plan and build up gradually.`,
    category: "Getting Started",
    publishedAt: "2025-01-15",
    image: "/images/blog/50k-difficulty.jpg",
    readTime: "5 min read",
  },
  {
    id: "what-to-wear-first-ultra",
    title: "What to Wear for Your First Ultra",
    slug: "what-to-wear-first-ultra",
    excerpt:
      "Your road running wardrobe won't cut it on the trails. Here's exactly what to wear (and what to skip) for your first ultra marathon.",
    body: `Heading into your first ultra with road running gear is like showing up to a camping trip in dress shoes. You'll survive, but you won't enjoy it.

## The Essentials

**Shoes:** Trail shoes are non-negotiable. You need grip, protection, and drainage. The Hoka Speedgoat 5 is our top pick for beginners — cushioned enough for comfort, grippy enough for technical terrain.

**Socks:** Toe socks. Seriously. Injinji Trail Midweight Crew socks prevent blisters between your toes, which is where 80% of ultra blisters happen.

**Shorts:** Lightweight, quick-drying, with a built-in brief. Patagonia Strider Pro shorts are our favorite.

**Vest/Pack:** A running vest is essential for carrying water, nutrition, and required gear. The Salomon ADV Skin 5 is the gold standard for beginners.

## What to Skip

- Cotton anything (chafing nightmare)
- New gear on race day (test everything in training)
- Bulky hydration packs (running vests are lighter and more stable)

## The Rule

Nothing new on race day. Whatever you wear in your longest training run should be what you wear on race day. Test everything.`,
    category: "Gear",
    publishedAt: "2025-01-22",
    image: "/images/blog/what-to-wear.jpg",
    readTime: "4 min read",
  },
  {
    id: "ultra-nutrition-beginners",
    title: "Ultra Nutrition for Beginners: Keep It Simple",
    slug: "ultra-nutrition-beginners",
    excerpt:
      "Forget complicated fueling strategies. Here's a dead-simple nutrition plan that will get you through your first 50K without bonking.",
    body: `Nutrition is where most first-time ultra runners fail. Not fitness, not mental toughness — food. The good news? It doesn't have to be complicated.

## The Simple Strategy

**Calories per hour:** Aim for 200-300 calories per hour after the first hour. Set a timer on your watch if you need to.

**The easiest approach:** Tailwind Endurance Fuel in your bottles. It handles calories AND electrolytes in one product. No gels to carry, no timing to figure out. Just sip consistently.

**Backup plan:** Carry 2-3 Spring Energy gels for when you want something with more texture or when aid stations have water but you need calories.

## Common Mistakes

1. **Waiting too long to eat.** Start fueling at mile 5, not mile 15.
2. **Trying new foods on race day.** Practice your nutrition plan on every long run.
3. **Only drinking water.** You need electrolytes. Plain water can cause hyponatremia on hot days.
4. **Eating too much at once.** Small amounts frequently > big meals infrequently.

## Practice Makes Perfect

Use your weekend long runs to dial in nutrition. By race day, eating while running should feel automatic.`,
    category: "Nutrition",
    publishedAt: "2025-02-01",
    image: "/images/blog/nutrition.jpg",
    readTime: "4 min read",
  },
  {
    id: "choosing-first-ultra",
    title: "How to Choose Your First Ultra Marathon",
    slug: "choosing-first-ultra",
    excerpt:
      "Not all 50Ks are created equal. Here's how to pick a first race that sets you up for success (and a finish line photo you'll love).",
    body: `Picking the right first ultra is almost as important as training for it. A brutal mountain 50K with 10,000 feet of climbing is a very different experience from a flat trail loop.

## What to Look For

**Looped courses:** Multiple loops mean you pass through the start/finish area several times. This gives you access to your gear, your crew, and a mental boost.

**Moderate elevation:** Under 3,000 feet of total climbing for your first 50K. Save the mountain races for later.

**Good aid stations:** Look for races with aid stations every 4-6 miles. More support = less you need to carry.

**Generous cutoffs:** A 10+ hour cutoff for a 50K gives you breathing room. Don't pick a race where you'll be stressed about time.

## Red Flags for a First Ultra

- "Technical terrain" in the description
- Mandatory gear lists longer than 10 items
- Elevation profiles that look like an EKG
- Cutoff times under 8 hours

## Our Recommendation

Start with a local 50K on runnable trails. Ask in local running groups — experienced ultra runners love recommending races to beginners.`,
    category: "Getting Started",
    publishedAt: "2025-02-10",
    image: "/images/blog/choosing-race.jpg",
    readTime: "5 min read",
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
