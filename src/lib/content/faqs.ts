export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "getting-started" | "training" | "gear" | "nutrition" | "race-day" | "injuries-recovery" | "mindset";
  relatedPages: string[];
  speakable?: boolean;
}

export const faqs: FAQ[] = [
  // GETTING STARTED (1-10)
  {
    id: "what-is-an-ultramarathon",
    question: "What is an ultramarathon?",
    answer: "An ultramarathon is any race longer than a marathon (26.2 miles). The most common distances are 50K (31 miles), 50 miles, 100K (62 miles), and 100 miles. Unlike road marathons, most ultras run on trails, feature significant elevation change, and prioritize finishing over speed. There's no minimum pace requirement — moving forward is all that matters.",
    category: "getting-started",
    relatedPages: ["/start-here", "/blog/how-hard-is-a-50k"],
    speakable: true,
  },
  {
    id: "how-hard-is-a-50k",
    question: "How hard is a 50K, really?",
    answer: "A 50K is only 4.9 miles longer than a marathon — if you can run a marathon, you can train for a 50K. The challenge isn't distance alone; it's trail terrain, sustained nutrition, and time on feet. Most beginner 50Ks have cutoffs of 8–10 hours, so you don't need to be fast. With 16 weeks of training and a solid nutrition plan, finishing is very achievable.",
    category: "getting-started",
    relatedPages: ["/blog/how-hard-is-a-50k", "/training/first-50k"],
    speakable: true,
  },
  {
    id: "do-i-need-a-marathon",
    question: "Do I need to run a marathon before running an ultra?",
    answer: "No. Many runners skip the marathon entirely and go straight to their first ultra. A 50K finish does not require a marathon on your resume. What matters is your training base — if you can run a half marathon comfortably and commit to 16 weeks of structured training, you're ready to prepare for a 50K.",
    category: "getting-started",
    relatedPages: ["/training/first-50k", "/start-here"],
    speakable: true,
  },
  {
    id: "can-a-beginner-run-an-ultramarathon",
    question: "Can a beginner run an ultramarathon?",
    answer: "Yes. Ultra running has no experience requirement, and the community is one of the most welcoming in all of sport. Beginners finish ultras every weekend. The key is choosing the right first race (flat course, generous cutoffs, good aid stations) and following a structured training plan that builds mileage gradually over 16–20 weeks.",
    category: "getting-started",
    relatedPages: ["/start-here", "/blog/choosing-first-ultra"],
  },
  {
    id: "how-do-i-know-if-im-ready",
    question: "How do I know if I'm ready for an ultramarathon?",
    answer: "You're likely ready if you can comfortably run a half marathon, have been running consistently for 6+ months, and can commit to 4 days per week of training for 16–20 weeks. You don't need to be fast or have run a marathon. If you can run 10–13 miles without it feeling catastrophic, you have the base to train for a 50K.",
    category: "getting-started",
    relatedPages: ["/start-here", "/training/base-building"],
  },
  {
    id: "am-i-too-slow-for-an-ultra",
    question: "Am I too slow to run an ultra?",
    answer: "Probably not. Most 50K races have cutoffs of 8–10 hours, which works out to roughly a 15–19 minute per mile average — including walking and aid station stops. Ultra running is not about speed. The people at the back of the pack often have the most fun. As long as you can keep moving forward, you belong at the start line.",
    category: "getting-started",
    relatedPages: ["/tools/pace-calculator", "/start-here"],
  },
  {
    id: "trail-vs-road-ultra",
    question: "What's the difference between a trail ultra and a road ultra?",
    answer: "Trail ultras run on dirt paths, mountain terrain, and technical trails — often with significant elevation gain. Road ultras run on pavement and tend to be flatter and faster. Trail ultras are far more common, especially at longer distances, and require trail-specific shoes and gear. Most beginner ultras are trail races.",
    category: "getting-started",
    relatedPages: ["/gear/shoes", "/blog/what-to-wear-first-ultra"],
  },
  {
    id: "how-long-to-train",
    question: "How long does it take to train for an ultramarathon?",
    answer: "16 weeks is standard for a 50K if you already have half marathon fitness. If you're starting from less than that, budget 20–24 weeks. Training for a 50-mile race typically takes 20–24 weeks, and 100-mile preparation usually requires 6+ months of consistent training. Rushing the process is the #1 cause of injury in new ultra runners.",
    category: "getting-started",
    relatedPages: ["/training/first-50k", "/training/base-building"],
  },
  {
    id: "what-distance-first",
    question: "What distance should I run for my first ultra?",
    answer: "Start with a 50K. It's the most beginner-friendly distance: manageable mileage, widely available races, and enough of a step up from a marathon to feel like an achievement. Some runners start with a 50-mile if they already have a marathon background and want more of a challenge, but the 50K is the standard entry point for good reason.",
    category: "getting-started",
    relatedPages: ["/training/first-50k", "/blog/how-hard-is-a-50k"],
  },
  {
    id: "how-to-choose-first-race",
    question: "How do I choose my first ultramarathon race?",
    answer: "Look for a race with: a flat-to-moderate course (under 5,000 feet of total climb), aid stations every 4–6 miles, a generous cutoff (10+ hours for a 50K), and a strong beginner-friendly reputation. Avoid technical mountain races for your first attempt. A local 50K with a looped course is often the ideal starting point.",
    category: "getting-started",
    relatedPages: ["/blog/choosing-first-ultra"],
  },

  // TRAINING (11-20)
  {
    id: "miles-per-week-50k",
    question: "How many miles per week should I run to train for a 50K?",
    answer: "Most beginner 50K plans peak at 35–45 miles per week over a 16-week program. You don't need to run 50+ miles per week to finish a 50K. What matters more than peak mileage is consistency: 4 days per week, a weekly long run that builds to 20–22 miles, and back-to-back long runs on weekends.",
    category: "training",
    relatedPages: ["/training/first-50k", "/blog/first-50k-training-guide"],
    speakable: false,
  },
  {
    id: "longest-training-run",
    question: "How long should my longest training run be before a 50K?",
    answer: "Your longest training run should be 20–22 miles, reached about 3 weeks before your race. You do NOT need to run the full 50K distance in training — your body can't recover fast enough from runs over 22 miles to keep training productively. The combination of your long run and next-day easy run simulates the fatigue of race day better than one massive effort.",
    category: "training",
    relatedPages: ["/training/first-50k"],
  },
  {
    id: "back-to-back-long-runs",
    question: "What are back-to-back long runs and why do they matter?",
    answer: "Back-to-back long runs mean doing your long run on Saturday, then a medium-length run on Sunday on tired legs. For example: 18 miles Saturday + 10 miles Sunday. This teaches your body to run when fatigued — exactly what ultras demand — without requiring a single 30-mile training run. It's the most important and unique element of ultra training.",
    category: "training",
    relatedPages: ["/training/first-50k", "/blog/first-50k-training-guide"],
  },
  {
    id: "do-i-need-to-run-full-distance",
    question: "Do I need to run the full 50K distance in training?",
    answer: "No. Most training plans cap the longest run at 20–22 miles. Running the full 50K in training would take too long to recover from and wouldn't make race day easier. Your race fitness comes from accumulated weekly mileage, back-to-back long runs, and consistent training — not one heroic long run.",
    category: "training",
    relatedPages: ["/training/first-50k"],
  },
  {
    id: "days-per-week",
    question: "How many days per week should I run for ultra training?",
    answer: "Four days per week is the sweet spot for most beginners: one long run, one medium run, and two easy runs. Running more than 5 days per week increases injury risk without proportionally improving fitness for a first-time ultra runner. Quality and consistency beat volume every time.",
    category: "training",
    relatedPages: ["/training/first-50k", "/training/base-building"],
  },
  {
    id: "do-i-need-speed-work",
    question: "Do I need to do speed work for an ultra?",
    answer: "No. Speed work (intervals, tempo runs) is not necessary for finishing a 50K. Ultra running is about aerobic endurance, not speed. Most of your training — 80% or more — should be run at a genuinely easy, conversational pace. Save speed work for road racing or once you're an experienced ultra runner chasing competitive times.",
    category: "training",
    relatedPages: ["/training/first-50k"],
  },
  {
    id: "should-i-walk",
    question: "Should I walk during an ultra?",
    answer: "Yes — walking is not just allowed, it's strategic. Nearly all experienced ultra runners walk the uphills and run the flats and downhills. Walking steep climbs conserves energy and is often faster than running them. Practice run-walk strategies on your long training runs so the transition feels natural on race day. Walking is not giving up — it's racing smart.",
    category: "training",
    relatedPages: ["/training/first-50k", "/training/race-week"],
  },
  {
    id: "strength-training",
    question: "How important is strength training for ultra runners?",
    answer: "Very important — but it doesn't have to be complicated. Two 20-minute sessions per week of single-leg squats, step-ups, calf raises, and side planks can reduce injury risk by up to 50% according to research. Strong legs handle trail terrain and descents far better than running-only fitness. You don't need a gym — bodyweight exercises work fine.",
    category: "training",
    relatedPages: ["/blog/strength-training-ultra-runners"],
  },
  {
    id: "ultra-training-full-time-job",
    question: "How do I train for an ultra if I have a full-time job?",
    answer: "Four days per week with smart scheduling works well around a full-time job. Typical setup: two weekday runs (30–45 minutes each, easy pace), one Thursday medium run (60–75 minutes), and a Saturday long run. Most of the training volume comes from the long run, so as long as you protect Saturday mornings, the rest is manageable.",
    category: "training",
    relatedPages: ["/training/first-50k", "/training/plans"],
  },
  {
    id: "taper-50k",
    question: "What's the taper for a 50K?",
    answer: "The taper for a 50K is 2–3 weeks. In the final 3 weeks, reduce weekly mileage by about 20% each week. Your longest run in the final week before race day should be no more than 10 miles, and in the last 4 days, keep runs to 20–30 minutes. Expect to feel restless, heavy, and undertrained — this is normal and called 'taper madness.'",
    category: "training",
    relatedPages: ["/training/race-week", "/training/first-50k"],
  },

  // GEAR (21-26)
  {
    id: "what-shoes-for-first-ultra",
    question: "What shoes should I wear for my first ultra?",
    answer: "For your first ultra, prioritize maximum cushion and proven grip over lightweight racing performance. The Hoka Speedgoat 5 (~$155) is the most popular beginner trail shoe for good reason: enough cushion for 31 miles, aggressive outsole grip, and a well-tested design. Size up half a size to account for foot swelling on long runs. Never race in unproven shoes.",
    category: "gear",
    relatedPages: ["/gear/shoes", "/blog/what-to-wear-first-ultra"],
    speakable: false,
  },
  {
    id: "do-i-need-a-vest",
    question: "Do I need a running vest or hydration pack?",
    answer: "Yes — for almost every ultra, a running vest is required or strongly recommended. You need to carry water, nutrition, and often mandatory gear (headlamp, emergency blanket, phone) that won't fit in shorts pockets. A race vest (6–10L capacity) is more stable and comfortable than a handheld bottle for anything over 15 miles.",
    category: "gear",
    relatedPages: ["/gear/packs", "/blog/best-running-vests-2025"],
  },
  {
    id: "how-much-gear",
    question: "How much gear do I need for my first ultra?",
    answer: "For a 50K, you need surprisingly little: trail shoes, a running vest with water capacity, trail socks, moisture-wicking clothing, and race nutrition. Most 50K races have aid stations every 4–6 miles, so you're never far from support. Budget $400–600 for a solid beginner setup. Our gear kit builder creates a personalized list for your specific race.",
    category: "gear",
    relatedPages: ["/gear/kits", "/gear"],
  },
  {
    id: "what-to-carry",
    question: "What should I carry during a 50K?",
    answer: "Carry: 1–1.5 liters of water (soft flasks in your vest), 200–300 calories per hour of race nutrition, your phone, a small blister kit, anti-chafe, and any race-required gear (check your race's mandatory list). You don't need to carry everything between aid stations — pack light, restock at every station.",
    category: "gear",
    relatedPages: ["/gear/packs", "/gear/race-day-kit"],
  },
  {
    id: "trail-socks",
    question: "Do I need different socks for trail running?",
    answer: "Yes. Trail running socks are thicker, more durable, and often use merino wool or synthetic blends that resist moisture and odor. For ultras, toe socks (like Injinji Trail) are widely recommended — they prevent blisters between the toes, which is where the majority of ultra blisters occur. Never wear cotton socks for any run over 10 miles.",
    category: "gear",
    relatedPages: ["/gear/shoes", "/blog/what-to-wear-first-ultra"],
  },
  {
    id: "trekking-poles",
    question: "Should I use trekking poles for my first ultra?",
    answer: "For a first 50K on moderate terrain, poles are optional. They're most valuable on courses with significant climbing (5,000+ feet) or technical descents. If you use them, practice with them on training runs before race day — poles change your gait and require upper body engagement. Check your race rules first; some events don't allow poles.",
    category: "gear",
    relatedPages: ["/gear", "/gear/kits"],
  },

  // NUTRITION (27-34)
  {
    id: "what-to-eat-during-ultra",
    question: "What should I eat during an ultra?",
    answer: "Aim for 200–300 calories per hour from easily digestible sources. The simplest approach for beginners: use Tailwind Endurance Fuel in your water bottles (calories + electrolytes in one) and supplement with gels, chews, or real food at aid stations. Start fueling early — at mile 5–8 — before you feel hungry. Waiting until you're hungry is too late.",
    category: "nutrition",
    relatedPages: ["/gear/nutrition", "/blog/ultra-nutrition-beginners"],
    speakable: true,
  },
  {
    id: "how-much-water",
    question: "How much water should I drink during an ultra?",
    answer: "Drink to thirst — don't follow a rigid schedule. Most runners consume 16–24 oz per hour, but this varies widely based on temperature, sweat rate, and intensity. The critical rule: never drink plain water without accompanying electrolytes during a race. Over-drinking plain water causes hyponatremia (dangerously low sodium), which is more common than dehydration in ultras.",
    category: "nutrition",
    relatedPages: ["/blog/electrolyte-guide-ultra-runners", "/gear/nutrition"],
  },
  {
    id: "what-are-electrolytes",
    question: "What are electrolytes and why do they matter for ultras?",
    answer: "Electrolytes are minerals (primarily sodium, potassium, and magnesium) that your body loses through sweat. In an ultra, replacing them is as important as replacing calories. Without adequate sodium, you can develop hyponatremia — a dangerous drop in blood sodium that causes confusion, nausea, and in severe cases, seizures. Aim for 500–700mg of sodium per hour during your race.",
    category: "nutrition",
    relatedPages: ["/blog/electrolyte-guide-ultra-runners"],
  },
  {
    id: "real-food-vs-gels",
    question: "Why do ultra runners eat real food instead of gels?",
    answer: "After 4–6 hours of running, most people can't stomach another gel. Taste fatigue is real — your brain actively craves different textures, temperatures, and flavors. Real food (boiled potatoes, PB&J, ramen, watermelon) is easier to eat when nauseated and often more satisfying. Aid stations stock real food specifically for this reason. Plan to transition to real food in the second half of any race over 50K.",
    category: "nutrition",
    relatedPages: ["/blog/real-food-ultra-marathon", "/gear/nutrition"],
  },
  {
    id: "what-is-bonking",
    question: "What is bonking and how do I avoid it?",
    answer: "Bonking is a sudden energy crash caused by depleted glycogen stores — your body runs out of available carbohydrates and hits a wall. It feels like sudden weakness, brain fog, nausea, and an overwhelming desire to stop. To avoid it: start fueling early (mile 5–8), eat consistently every 20–30 minutes, and never skip aid stations. Bonking is almost entirely preventable with good nutrition.",
    category: "nutrition",
    relatedPages: ["/blog/ultra-nutrition-beginners", "/gear/nutrition"],
  },
  {
    id: "carb-loading",
    question: "Should I carb load before an ultra?",
    answer: "Yes, for races 4+ hours. Start 2–3 days before your race by increasing carbohydrate intake by 20–30% — extra pasta, rice, bread, and potatoes. Avoid high-fiber foods that might cause GI issues on race day. This tops off your glycogen stores and gives you a fuller tank at the start line. Stick to foods your gut already knows and tolerates well.",
    category: "nutrition",
    relatedPages: ["/training/race-week"],
  },
  {
    id: "race-morning-breakfast",
    question: "What should I eat the morning of my ultra?",
    answer: "Eat a carb-heavy, familiar breakfast 2–3 hours before your race start. Something you've tested on long training runs — oatmeal, toast with peanut butter, a bagel with banana, or rice cakes. Keep it low in fat and fiber to minimize GI risk. Eat something even if you're nervous; starting with a full glycogen tank matters more than pre-race nerves.",
    category: "nutrition",
    relatedPages: ["/training/race-week"],
  },
  {
    id: "gut-training",
    question: "How do I train my gut for eating during runs?",
    answer: "Practice eating on every long run over 10 miles — no exceptions. Your digestive system needs to learn to process food while blood is diverted to working muscles. Start simple: a gel or chew every 30 minutes. Gradually introduce more varied foods. By the time you're doing 18-mile training runs, eating on the move should feel completely normal.",
    category: "nutrition",
    relatedPages: ["/blog/ultra-nutrition-beginners", "/gear/nutrition"],
  },

  // RACE DAY (35-42)
  {
    id: "what-to-expect-first-ultra",
    question: "What should I expect at my first ultra?",
    answer: "Expect to feel amazing for the first half and challenged for the second — that's the ultra experience. You'll encounter aid stations stocked with food and volunteers cheering you on. Expect your feet to hurt in new ways, your mood to swing, and your pace to slow. Also expect moments of pure joy, incredible scenery, and a finish line that'll make you cry. The ultra community is welcoming and positive.",
    category: "race-day",
    relatedPages: ["/blog/how-hard-is-a-50k", "/training/race-week"],
  },
  {
    id: "how-to-pace-50k",
    question: "How do I pace a 50K?",
    answer: "Start 15–20% slower than you think you should. This is not an exaggeration. The #1 mistake in a first 50K is going out too fast and blowing up in the second half. Walk every uphill, even from mile 1. Run the flats and easy downhills. Use the pace calculator to set a conservative target finish time, then run even slower than that for the first 10 miles.",
    category: "race-day",
    relatedPages: ["/tools/pace-calculator", "/training/race-week"],
    speakable: true,
  },
  {
    id: "what-is-an-aid-station",
    question: "What is an aid station and what do they have?",
    answer: "Aid stations are checkpoints along the race course where volunteers provide food, drinks, and support. They're typically spaced every 4–8 miles. Most stock water, sports drink, soda, chips, boiled potatoes, PB&J, bananas, and broth. Some larger races have hot food, medical support, and chair seating. Always stop, eat something, and refill your water at every station.",
    category: "race-day",
    relatedPages: ["/training/race-week"],
  },
  {
    id: "what-is-dnf",
    question: "What is a DNF and is it okay to drop out?",
    answer: "DNF means 'Did Not Finish.' It's a legitimate race outcome that every ultra runner encounters eventually. Dropping out is absolutely okay if you're injured, medically unwell, or in danger. Never quit at an aid station — leave and walk for 10 minutes first, because most 'I want to quit' feelings pass. But if you're experiencing confusion, chest pain, or injury that won't resolve, stopping is the smart, safe choice.",
    category: "race-day",
    relatedPages: ["/blog/how-hard-is-a-50k"],
  },
  {
    id: "do-i-need-crew-pacer",
    question: "Do I need a crew or pacer for a 50K?",
    answer: "No. Most 50K races don't allow crew access, and pacers are typically only permitted for 50-mile races and beyond. A 50K is self-sufficient with aid stations — you won't need your own support team. Having a friend or family member at the finish line is nice but not logistically necessary. Save the crew coordination for your first 100-miler.",
    category: "race-day",
    relatedPages: ["/training/race-week"],
  },
  {
    id: "week-before-ultra",
    question: "What do I do the week before my ultra?",
    answer: "Follow a strict taper: easy running only, sleep 8+ hours nightly, carb load starting Wednesday, and do a full gear check Tuesday. Don't try new food, shoes, or gear. Review the course profile and aid station locations. Prepare drop bags if applicable. Lay out all race gear the night before. Expect to feel restless and undertrained — that's taper madness, and it's normal.",
    category: "race-day",
    relatedPages: ["/training/race-week"],
  },
  {
    id: "bathroom-during-ultra",
    question: "What if I have to use the bathroom during an ultra?",
    answer: "Go. Most races have porta-potties at aid stations, and using them adds only 2–3 minutes to your time. If you need to go between aid stations, duck off trail with some privacy — it happens to nearly every ultra runner and nobody bats an eye. Carry a small packet of toilet paper or wipes in your vest. GI issues are common in ultras; being prepared removes the stress.",
    category: "race-day",
    relatedPages: ["/gear/race-day-kit"],
  },
  {
    id: "will-i-hallucinate",
    question: "Will I hallucinate during an ultra?",
    answer: "In a 50K, no. Hallucinations are almost exclusively a feature of 100-mile and longer races where you're running through the night with extreme sleep deprivation (18+ hours of continuous effort). In a 50K finishing in 6–9 hours, you won't experience sleep deprivation severe enough to cause visual or auditory hallucinations. Save your hallucination worry for your first 100-miler.",
    category: "race-day",
    relatedPages: ["/blog/first-100-miler-guide"],
  },

  // INJURIES & RECOVERY (43-47)
  {
    id: "prevent-blisters",
    question: "How do I prevent blisters during an ultra?",
    answer: "Three things prevent the majority of blisters: properly fitted shoes (thumb's width of toe space, no heel slippage), toe socks like Injinji Trail, and anti-chafe lubricant on friction points. Shoes should be a half size larger than your street shoes to account for foot swelling. Practice your entire shoe-and-sock system on long training runs, not for the first time on race day.",
    category: "injuries-recovery",
    relatedPages: ["/gear/shoes", "/gear/race-day-kit"],
  },
  {
    id: "recovery-after-ultra",
    question: "What should I do to recover after my first ultra?",
    answer: "The first week after a 50K: walk daily (don't sit still), sleep as much as possible, eat plenty of protein and carbohydrates, and don't run. Week 2: light jogging if soreness has resolved. Return to full training by week 3–4. Most runners are surprised by how long the fatigue lingers — systemic fatigue can last 2–3 weeks even if your legs feel normal after a few days.",
    category: "injuries-recovery",
    relatedPages: ["/training/race-week"],
  },
  {
    id: "cant-walk-after-ultra",
    question: "Is it normal to not be able to walk after an ultra?",
    answer: "Yes, completely normal — especially the stairs. Severe delayed onset muscle soreness (DOMS) in the quads is almost universal after a first 50K, particularly after technical descents. The soreness peaks 48–72 hours post-race and usually resolves within 5–7 days. Gentle walking, gentle stretching, protein intake, and sleep accelerate recovery. It feels worse than it is.",
    category: "injuries-recovery",
    relatedPages: ["/training/race-week"],
  },
  {
    id: "prevent-injuries-training",
    question: "How do I prevent injuries during ultra training?",
    answer: "Follow the 10% rule (never increase weekly mileage by more than 10% per week), run 80% of miles at easy/conversational pace, do strength training twice a week, take cutback weeks every 3–4 weeks, and sleep at least 7–8 hours. Most ultra training injuries come from increasing mileage too fast, running too hard on easy days, or skipping recovery weeks.",
    category: "injuries-recovery",
    relatedPages: ["/training/first-50k", "/blog/strength-training-ultra-runners"],
  },
  {
    id: "lose-toenails",
    question: "Will I lose toenails from running an ultra?",
    answer: "Possibly, especially if your shoes fit too tightly or you have long toenails. Black toenails from repeated impact on descents are common but not universal. To minimize risk: size up half a size in trail shoes, keep toenails trimmed short before the race, and use toe socks. Lost toenails are painless once they detach and grow back within a few months.",
    category: "injuries-recovery",
    relatedPages: ["/gear/shoes"],
  },

  // MINDSET & MOTIVATION (48-51)
  {
    id: "mental-preparation",
    question: "How do I mentally prepare for my first ultra?",
    answer: "Practice mental toughness on your hardest training runs — specifically the last 30 minutes of your long runs when you're tired. Develop a go-to mantra. Break the race into small segments (next aid station, next mile) rather than thinking about the full distance. Remind yourself that every ultra runner has dark moments; the ability to keep moving through them is the skill you're building.",
    category: "mindset",
    relatedPages: ["/blog/how-hard-is-a-50k", "/training/first-50k"],
  },
  {
    id: "what-to-think-about",
    question: "What do you think about during a 50K?",
    answer: "Whatever gets you through. Many runners think about their nutrition and pace, chat with other runners around them, listen to music or podcasts, or focus on the scenery. Running with others — at least in the early miles — is one of the best parts of ultra culture. Preparing a playlist, an audiobook, and a few conversation topics gives you options for different parts of the race.",
    category: "mindset",
    relatedPages: ["/blog/how-hard-is-a-50k"],
  },
  {
    id: "low-point-during-race",
    question: "What do I do when I hit a low point during the race?",
    answer: "First: don't quit at an aid station. Leave and walk for 10 minutes — most low points pass on their own. Eat and drink something; many lows are actually bonking in disguise. Change your music or start talking to another runner. If it's physical (nausea, pain), slow down and address the problem. Remind yourself that every finisher had a bad patch somewhere in that race — the low point is temporary.",
    category: "mindset",
    relatedPages: ["/blog/how-hard-is-a-50k", "/training/race-week"],
  },
  {
    id: "finish-last",
    question: "What if I finish last?",
    answer: "You're still a finisher. DFL (Dead Freaking Last) is a cherished term in ultra running — finishing last means you were the toughest person out there, because you kept moving when everyone else had already stopped. Race directors and volunteers celebrate every finisher. Nobody remembers who finished 47th vs. 48th. The finish line belongs to you no matter what time you cross it.",
    category: "mindset",
    relatedPages: ["/start-here", "/blog/how-hard-is-a-50k"],
  },
];

export const faqsByCategory = {
  "getting-started": faqs.filter(f => f.category === "getting-started"),
  "training": faqs.filter(f => f.category === "training"),
  "gear": faqs.filter(f => f.category === "gear"),
  "nutrition": faqs.filter(f => f.category === "nutrition"),
  "race-day": faqs.filter(f => f.category === "race-day"),
  "injuries-recovery": faqs.filter(f => f.category === "injuries-recovery"),
  "mindset": faqs.filter(f => f.category === "mindset"),
};

export const speakableFaqs = faqs.filter(f => f.speakable);
