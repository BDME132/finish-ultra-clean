import React from "react";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import NutritionCalculator from "./NutritionCalculator";
import {
  faqPageJsonLd,
  gearProductAnchorId,
  itemListJsonLd,
  SITE_URL,
} from "@/lib/schema";
import {
  Droplets, Candy, Coffee, Zap, Banana, Apple, Wheat, Beef,
  AlertTriangle, Smile, Frown, Sun, Calendar, Salad, PersonStanding,
  RefreshCcw,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ultra Marathon Nutrition & Fueling Strategy | FinishUltra",
  description:
    "Master ultra marathon nutrition from 50K to 100 miles. Personalized fueling calculator, top product reviews, distance-based strategies, and expert guidance on carbs, hydration, and electrolytes.",
  alternates: { canonical: "/gear/nutrition" },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type NutritionProduct = {
  name: string;
  brand: string;
  price: string;
  calories: string;
  carbs: string;
  caffeine: string;
  sodium: string;
  bestFor: string[];
  pros: string[];
  cons: string[];
  tags: string[];
  affiliates: { amazon: string; rei?: string; brand?: string };
};

// ─── Product Categories ───────────────────────────────────────────────────────

const productCategories: {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  color: string;
  badgeColor: string;
  description: string;
  products: NutritionProduct[];
}[] = [
  {
    id: "gels",
    title: "Energy Gels",
    icon: <Droplets className="w-6 h-6 text-primary" />,
    subtitle: "The backbone of ultra marathon fueling",
    color: "from-orange-50 to-white",
    badgeColor: "bg-orange-100 text-orange-800",
    description:
      "Gels are the most reliable calorie delivery system in ultra running. Fast-absorbing, compact, and consistent — when your stomach gets finicky, gels often stay down when food won't.",
    products: [
      {
        name: "Gel 100",
        brand: "Maurten",
        price: "$3.00/gel",
        calories: "100 kcal",
        carbs: "25g",
        caffeine: "0mg (Caf100: 100mg)",
        sodium: "55mg",
        bestFor: ["Sensitive stomachs", "Elite racing", "50K to 100M"],
        pros: [
          "Hydrogel technology dramatically reduces GI distress",
          "No fructose — easier on the gut than most gels",
          "Thin, water-like texture goes down easily",
          "Used by Eliud Kipchoge and elite ultra runners",
        ],
        cons: ["Most expensive gel on the market", "Neutral taste isn't for everyone", "Lower calories than some alternatives"],
        tags: ["elite", "sensitive", "all-distance"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
      {
        name: "Energy Gel",
        brand: "GU",
        price: "$1.30/gel",
        calories: "100 kcal",
        carbs: "22g",
        caffeine: "0–40mg (varies)",
        sodium: "55mg",
        bestFor: ["All distances", "Flavor variety seekers", "Budget-conscious runners"],
        pros: [
          "Most popular ultra gel for a reason — consistent and reliable",
          "Huge flavor selection (30+ flavors)",
          "Multiple caffeine levels to choose from",
          "Widely available at all race aid stations",
        ],
        cons: ["Higher osmolality can cause GI issues", "Thicker texture is hard to take without water", "Maltodextrin base isn't ideal for sensitive stomachs"],
        tags: ["popular", "caffeine", "value"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
      {
        name: "Energy Gels",
        brand: "Spring Energy",
        price: "$2.50/gel",
        calories: "160–180 kcal",
        carbs: "35–40g",
        caffeine: "0–100mg (varies)",
        sodium: "60–100mg",
        bestFor: ["Real food preference", "Sensitive stomachs", "Long races where appetite shifts"],
        pros: [
          "Real whole food ingredients — oats, fruit, almond butter",
          "Highest calories per gel in the category",
          "Genuinely tastes like food, not a supplement",
          "Much easier on the gut than synthetic gels",
        ],
        cons: ["Thick consistency — needs practice", "Refrigeration recommended for storage", "Limited caffeine options"],
        tags: ["real-food", "high-cal", "sensitive"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
      {
        name: "Chia Energy Gel",
        brand: "Huma",
        price: "$2.20/gel",
        calories: "100 kcal",
        carbs: "23g",
        caffeine: "0–25mg",
        sodium: "60mg",
        bestFor: ["Natural/clean label runners", "Sensitive stomachs", "50K to 50M"],
        pros: [
          "Real fruit + chia seeds — no artificial ingredients",
          "Lower osmolality than most gels = gentler on stomach",
          "Excellent flavor variety (all taste like real fruit)",
        ],
        cons: ["Chia texture isn't for everyone", "Lower calorie density requires more volume", "Shorter shelf life than synthetic gels"],
        tags: ["natural", "sensitive", "mid-distance"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
      {
        name: "Beta Fuel Gel",
        brand: "Science in Sport",
        price: "$2.50/gel",
        calories: "150 kcal",
        carbs: "40g",
        caffeine: "0–75mg",
        sodium: "75mg",
        bestFor: ["High-carb fueling", "Gut-trained runners", "Long distance 100K+"],
        pros: [
          "40g carbs per gel — highest in class for serious fueling",
          "2:1 maltodextrin:fructose ratio optimizes absorption",
          "150 calories lets you fuel with fewer gels",
        ],
        cons: ["High carb load can overwhelm untrained gut", "Requires gut training to use effectively", "Thick, dense texture"],
        tags: ["high-carb", "advanced", "long-distance"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
    ],
  },
  {
    id: "chews",
    title: "Energy Chews & Waffles",
    icon: <Candy className="w-6 h-6 text-primary" />,
    subtitle: "When gels get old, chewables keep you going",
    color: "from-yellow-50 to-white",
    badgeColor: "bg-yellow-100 text-yellow-800",
    description:
      "Chews and waffles provide the mental satisfaction of chewing — critical when gel fatigue sets in at mile 50. Many ultra runners use chews as their primary fuel for variety.",
    products: [
      {
        name: "BLOKS Energy Chews",
        brand: "CLIF",
        price: "$2.40/pack",
        calories: "200 kcal",
        carbs: "48g",
        caffeine: "0–50mg",
        sodium: "160–680mg",
        bestFor: ["Long runs", "Mid-race variety", "Salt supplementation"],
        pros: [
          "Electrolyte-loaded options (Mountain Berry has 3× sodium)",
          "200 calories per pack is solid density",
          "Satisfying chew texture — prevents gel fatigue",
          "Caffeine options available",
        ],
        cons: ["Sticky in warm weather — can be hard to handle", "May be too sweet late in races", "Difficult to eat while running at faster paces"],
        tags: ["electrolyte", "caffeine", "long-distance"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
      {
        name: "Sport Chews",
        brand: "Skratch Labs",
        price: "$2.50/pack",
        calories: "80 kcal",
        carbs: "19g",
        caffeine: "0mg",
        sodium: "80mg",
        bestFor: ["Real food preference", "Sensitive stomachs", "Mid-race snacking"],
        pros: [
          "Real fruit ingredients — genuinely tastes like candy",
          "Non-GMO, clean label",
          "Lighter on the stomach than most chews",
          "Less sweet than competitor options",
        ],
        cons: ["Lower calorie density requires more volume", "No caffeine option", "Higher price for fewer calories"],
        tags: ["natural", "sensitive", "mid-distance"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
      {
        name: "Organic Chews",
        brand: "Honey Stinger",
        price: "$2.00/pack",
        calories: "160 kcal",
        carbs: "39g",
        caffeine: "0–32mg",
        sodium: "60mg",
        bestFor: ["Organic preference", "Variety in long races", "Budget-conscious runners"],
        pros: [
          "Honey-based energy is natural and effective",
          "Certified organic ingredients",
          "Most affordable chews in category",
          "Great flavor variety",
        ],
        cons: ["Honey can crystallize in cold weather", "Lower sodium than some competitors", "Some find them too sweet late in a race"],
        tags: ["organic", "value", "all-distance"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
      {
        name: "Stroopwafel",
        brand: "Honey Stinger",
        price: "$1.50/waffle",
        calories: "140 kcal",
        carbs: "30g",
        caffeine: "0mg",
        sodium: "90mg",
        bestFor: ["Real food texture", "Early to mid race", "Aid station fuel"],
        pros: [
          "Warm-waffle texture is uniquely satisfying mid-race",
          "Solid enough to eat without hands (tuck in bra/pocket briefly)",
          "Much easier to stomach than gels after hour 4",
          "Affordable at $1.50",
        ],
        cons: ["Gets soggy if wet", "Hard to eat at faster running paces", "Not ideal for the first hours of racing (slower digestion)"],
        tags: ["real-food", "mid-race", "value"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
    ],
  },
  {
    id: "hydration",
    title: "Hydration & Drink Mixes",
    icon: <Coffee className="w-6 h-6 text-primary" />,
    subtitle: "Your liquid calorie and electrolyte foundation",
    color: "from-cyan-50 to-white",
    badgeColor: "bg-cyan-100 text-cyan-800",
    description:
      "Drink mixes let you absorb calories and electrolytes simultaneously while hydrating. For sensitive stomachs, liquid nutrition often works when solids don't.",
    products: [
      {
        name: "Endurance Fuel",
        brand: "Tailwind",
        price: "$40 / 30 servings",
        calories: "200 kcal/serving",
        carbs: "51g",
        caffeine: "0–35mg",
        sodium: "303mg",
        bestFor: ["All-in-one fueling", "Sensitive stomachs", "Runners who prefer liquid calories"],
        pros: [
          "All-in-one: calories + electrolytes + hydration in one product",
          "Dissolves completely — no sediment or sludge",
          "Among the gentlest on the GI system available",
          "Caffeinated option available for night sections",
        ],
        cons: ["Sweet taste becomes difficult late in long races", "200 cal/serving isn't enough alone for high-intensity efforts", "Requires precise measurement for ideal concentration"],
        tags: ["all-in-one", "sensitive", "all-distance"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
      {
        name: "Sport Hydration",
        brand: "Skratch Labs",
        price: "$22 / 20 servings",
        calories: "80 kcal/serving",
        carbs: "19g",
        caffeine: "0mg",
        sodium: "380mg",
        bestFor: ["Electrolyte-focused hydration", "Pairing with solid food", "Runners who prefer less sweet"],
        pros: [
          "Real fruit flavors — actually enjoyable to drink all day",
          "Higher sodium than most drink mixes (380mg)",
          "Lower sugar won't cause energy spikes",
          "Research-backed formula from Allen Lim",
        ],
        cons: ["Lower calorie density requires pairing with other fuel", "No caffeine option", "More expensive per calorie than Tailwind"],
        tags: ["electrolyte", "low-sugar", "natural"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
      {
        name: "Drink Mix 320",
        brand: "Maurten",
        price: "$45 / 14 servings",
        calories: "320 kcal/serving",
        carbs: "80g",
        caffeine: "0mg",
        sodium: "500mg",
        bestFor: ["Gut-trained runners", "High-carb fueling strategy", "Elite racing"],
        pros: [
          "Hydrogel technology dramatically reduces GI distress at high carb intakes",
          "320 calories per serving is the highest in category",
          "Neutral flavor doesn't cause taste fatigue",
          "Used by elite marathon and ultra runners worldwide",
        ],
        cons: ["Significant investment at $45 for 14 servings", "High carb load requires extensive gut training", "Requires precise water measurement"],
        tags: ["elite", "high-carb", "sensitive"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
      {
        name: "Sport Tablets",
        brand: "Nuun",
        price: "$7 / 10 tablets",
        calories: "15 kcal",
        carbs: "3g",
        caffeine: "0–40mg",
        sodium: "300mg",
        bestFor: ["Electrolyte-only supplementation", "Pairing with food-based calories", "Travel convenience"],
        pros: [
          "Ultra-portable — fits anywhere",
          "Effervescent tablets are easy and fun",
          "Excellent electrolyte profile at low calories",
          "Caffeinated option for night sections",
        ],
        cons: ["Not a calorie source — must pair with other fuel", "Dissolves slowly in cold water", "Carbonation can cause bloating"],
        tags: ["electrolyte", "portable", "caffeine"],
        affiliates: { amazon: "#", rei: "#", brand: "#" },
      },
    ],
  },
  {
    id: "electrolytes",
    title: "Electrolyte Supplements",
    icon: <Zap className="w-6 h-6 text-primary" />,
    subtitle: "Prevent cramps, hyponatremia, and performance decline",
    color: "from-green-50 to-white",
    badgeColor: "bg-green-100 text-green-800",
    description:
      "Electrolytes are the most underrated tool in ultra nutrition. Most DNFs involving cramping or stomach issues are electrolyte failures. Get this right before anything else.",
    products: [
      {
        name: "FastChews",
        brand: "SaltStick",
        price: "$10 / 60 chews",
        calories: "3 kcal",
        carbs: "0g",
        caffeine: "0mg",
        sodium: "100mg/chew",
        bestFor: ["Mid-race electrolyte supplementation", "Cramping prevention", "Runners who can't swallow pills while running"],
        pros: [
          "Chewable format is easier than pills at mile 70",
          "Balanced electrolyte profile (Na, K, Ca, Mg)",
          "Fast-acting — dissolves quickly in mouth",
          "Ultra-affordable at $10 for 60 chews",
        ],
        cons: ["Small individual dose requires multiple per hour", "Tums-like texture isn't for everyone", "Mild flavor may not appeal to all"],
        tags: ["cramp", "mid-race", "value"],
        affiliates: { amazon: "#", rei: "#" },
      },
      {
        name: "Caps",
        brand: "SaltStick",
        price: "$15 / 100 caps",
        calories: "0 kcal",
        carbs: "0g",
        caffeine: "0mg",
        sodium: "215mg/cap",
        bestFor: ["Capsule preference", "Precise sodium dosing", "Hot weather racing"],
        pros: [
          "Most comprehensive electrolyte capsule — all 5 electrolytes",
          "215mg sodium per cap lets you precisely hit targets",
          "Easy to carry — fits in any pocket",
          "The gold standard electrolyte capsule for ultra running",
        ],
        cons: ["Harder to swallow while running than chews", "Capsule breakdown can be inconsistent with some stomachs"],
        tags: ["capsule", "sodium", "hot-weather"],
        affiliates: { amazon: "#", rei: "#" },
      },
      {
        name: "Electrolyte Drink Mix",
        brand: "LMNT",
        price: "$45 / 30 sticks",
        calories: "0 kcal",
        carbs: "0g",
        caffeine: "0mg",
        sodium: "1000mg/serving",
        bestFor: ["Heavy sweaters", "Hot weather racing", "Sodium-aggressive supplementation"],
        pros: [
          "1000mg sodium per serving — designed for heavy sweaters",
          "Zero sugar lets you pair with any calorie source",
          "Excellent flavor despite high electrolyte content",
          "Great for pre-race loading in heat",
        ],
        cons: ["Very high sodium isn't appropriate for everyone", "Premium price", "No calories means you still need calorie sources"],
        tags: ["high-sodium", "heavy-sweater", "heat"],
        affiliates: { amazon: "#", brand: "#" },
      },
    ],
  },
  {
    id: "realfood",
    title: "Real Food Options",
    icon: <Banana className="w-6 h-6 text-primary" />,
    subtitle: "When gels fail, real food saves your race",
    color: "from-lime-50 to-white",
    badgeColor: "bg-lime-100 text-lime-800",
    description:
      "After 10+ hours, synthetic products often become impossible to stomach. Real food — familiar, comforting, and varied — is what keeps many runners moving through the night.",
    products: [
      {
        name: "Medjool Dates",
        brand: "Various",
        price: "$0.25/date",
        calories: "66 kcal",
        carbs: "18g",
        caffeine: "0mg",
        sodium: "0mg",
        bestFor: ["Natural fueling", "Sensitive stomachs", "Budget-conscious runners"],
        pros: [
          "Nature's gel — similar carb profile to energy gels",
          "Rich in potassium (often depleted in long runs)",
          "Incredibly affordable and available everywhere",
          "Real food satisfaction prevents palate fatigue",
        ],
        cons: ["Low sodium — combine with salt supplementation", "Sticky in hot weather", "Short shelf life once unpacked"],
        tags: ["natural", "value", "potassium"],
        affiliates: { amazon: "#" },
      },
      {
        name: "Baby Food Pouches",
        brand: "Various",
        price: "$1.00/pouch",
        calories: "60–90 kcal",
        carbs: "15–20g",
        caffeine: "0mg",
        sodium: "30–60mg",
        bestFor: ["Sensitive stomachs", "Long 100-mile efforts", "Budget fueling"],
        pros: [
          "Real fruit and vegetable ingredients",
          "Same squeeze format as a gel — easy to use on the run",
          "Gentler on the stomach than most synthetic products",
          "Much cheaper than specialty sports gels",
        ],
        cons: ["Lower calorie density requires more volume", "Limited flavors compared to sports products", "Some runners find the idea off-putting"],
        tags: ["real-food", "sensitive", "value"],
        affiliates: { amazon: "#" },
      },
      {
        name: "Nut Butter Packets",
        brand: "Justin's",
        price: "$1.50/packet",
        calories: "190 kcal",
        carbs: "7g",
        caffeine: "0mg",
        sodium: "105mg",
        bestFor: ["Miles 50+ fueling", "Calorie-dense options", "Savory craving relief"],
        pros: [
          "High calorie density (190 cal in a small packet)",
          "Fat + protein helps sustain energy in later miles",
          "Savory profile is a welcome break from sweet",
          "Portable and doesn't melt or spoil",
        ],
        cons: ["High fat slows digestion — not ideal early in race", "Very thick — needs water to wash down", "Minimal carbs for primary fueling"],
        tags: ["savory", "late-race", "calorie-dense"],
        affiliates: { amazon: "#" },
      },
      {
        name: "Boiled Potatoes",
        brand: "Aid Station Classic",
        price: "Free (aid stations)",
        calories: "50–70 kcal",
        carbs: "12–15g",
        caffeine: "0mg",
        sodium: "Variable (salted)",
        bestFor: ["Night sections", "Nausea management", "Salt supplementation"],
        pros: [
          "The most universally tolerated ultra fuel — available at most aid stations",
          "Bland enough to eat when nothing else stays down",
          "Warm salted potatoes provide sodium and comfort simultaneously",
          "Free at aid stations",
        ],
        cons: ["Low calorie density requires volume", "Not available between aid stations", "Can be hard to chew while running"],
        tags: ["aid-station", "nausea", "savory"],
        affiliates: { amazon: "#" },
      },
    ],
  },
  {
    id: "caffeine",
    title: "Caffeine Products",
    icon: <Coffee className="w-6 h-6 text-primary" />,
    subtitle: "Your night running secret weapon",
    color: "from-purple-50 to-white",
    badgeColor: "bg-purple-100 text-purple-800",
    description:
      "Caffeine is the most evidence-based performance supplement in sports science. Properly timed, it reduces perceived effort, delays fatigue, and can turn a dying race around.",
    products: [
      {
        name: "Caffeine Pills 200mg",
        brand: "Generic",
        price: "$0.10/pill",
        calories: "0 kcal",
        carbs: "0g",
        caffeine: "200mg",
        sodium: "0mg",
        bestFor: ["Precise dosing", "Night running", "Budget caffeine strategy"],
        pros: [
          "Most affordable caffeine source by a large margin",
          "Precise dosing — know exactly what you're taking",
          "No stomach volume — adds no liquid or food bulk",
          "Fast-acting when taken with water",
        ],
        cons: ["No calories — purely caffeine, not fuel", "Easy to accidentally overdose", "Some runners dislike pills at night"],
        tags: ["precise", "night", "value"],
        affiliates: { amazon: "#" },
      },
      {
        name: "Canaberry (100mg caffeine)",
        brand: "Spring Energy",
        price: "$2.60/gel",
        calories: "170 kcal",
        carbs: "37g",
        caffeine: "100mg",
        sodium: "80mg",
        bestFor: ["Night section fueling", "Calories + caffeine combined", "Real food preference"],
        pros: [
          "Real coffee caffeine from Arabica beans",
          "170 calories + 100mg caffeine in one product",
          "Real food base means gentler on stomach than synthetic options",
          "Natural caffeine has smoother onset than synthetic",
        ],
        cons: ["Most expensive caffeinated gel available", "Thick consistency", "Coffee flavor isn't for everyone"],
        tags: ["natural", "night", "high-cal"],
        affiliates: { amazon: "#", brand: "#" },
      },
      {
        name: "Rebuild Recovery",
        brand: "Tailwind",
        price: "$35 / 15 servings",
        calories: "200 kcal",
        carbs: "34g",
        caffeine: "0mg",
        sodium: "290mg",
        bestFor: ["Post-race recovery", "Within 30 minutes of finishing", "Sensitive stomachs post-race"],
        pros: [
          "Complete protein + carbs in one product",
          "Easy on the stomach when real food isn't appealing",
          "Correct 3:1 carb:protein ratio for glycogen replenishment",
        ],
        cons: ["Pricier than chocolate milk which achieves similar results", "Some runners prefer whole food recovery"],
        tags: ["recovery", "post-race", "protein"],
        affiliates: { amazon: "#", brand: "#" },
      },
    ],
  },
];


const nutritionItemListJsonLd = itemListJsonLd({
  name: "Ultra marathon nutrition products",
  description:
    "Energy gels, drink mixes, electrolytes, and real-food fuel reviewed for 50K through 100 miles.",
  url: `${SITE_URL}/gear/nutrition`,
  items: productCategories.flatMap((cat) =>
    cat.products.map((product) => ({
      name: `${product.brand} ${product.name}`,
      url: `${SITE_URL}/gear/nutrition#${gearProductAnchorId(cat.id, product.brand, product.name)}`,
      description: product.bestFor.join(", "),
    }))
  ),
});

const nutritionFaqEntries = [
  {
    q: "How much should I eat during an ultra?",
    a: "Target 200–400 calories per hour depending on distance, intensity, and stomach tolerance. The longer the race, the more critical consistent intake becomes. Use the calculator above for personalized targets. The golden rule: eat before you're hungry, drink before you're thirsty.",
  },
  {
    q: "When should I start fueling?",
    a: "Within the first 30 minutes, regardless of how you feel. Your glycogen stores are limited, and waiting until you feel depleted means you're already behind. Set a timer on your watch — every 20–25 minutes is a good starting rhythm for most runners.",
  },
  {
    q: "Can I fuel entirely from aid stations?",
    a: "For shorter ultras (50K) with frequent aid stations, it's possible but risky. Aid stations vary wildly between races. Always carry at least 2 hours worth of your tested nutrition regardless of race support. Never rely on aid station offerings alone for a 50M or longer.",
  },
  {
    q: "What if I can't stomach gels?",
    a: "Many runners can't tolerate synthetic gels, especially late in a race. Options: real food gels (Spring Energy, Huma), actual food (dates, waffles, banana, baby food pouches), liquid calories (Tailwind), or aid station food. The best fuel is whatever you can consistently get in — not whatever is theoretically optimal.",
  },
  {
    q: "Should I take salt tablets?",
    a: "Yes, for most ultramarathon runners — especially in heat or if you sweat heavily. SaltStick Caps (215mg sodium each) are the gold standard. Target 300–700mg of sodium per hour total (from all sources). Don't just take salt — make sure you're hydrating adequately alongside it.",
  },
  {
    q: "How do I train my gut for higher carb intake?",
    a: "Gradually increase carb intake over 12–16 weeks of training. Start at 30g/hour and add 10g every 2–3 weeks. Practice with your exact race products on long runs. Your gut adapts — runners who train with 60–90g/hour can absorb it on race day. It's genuinely trainable.",
  },
  {
    q: "How do I carb load properly?",
    a: "Start 4–5 days before your race. Target 8–10g of carbohydrates per kg of body weight per day. Reduce fat and fiber to make room. Focus on pasta, rice, bread, oatmeal, and potatoes. Reduce portion size 2 days out — just maintain the high carb percentage. Don't stuff yourself the night before.",
  },
  {
    q: "Is it normal to feel nauseous during a 100-miler?",
    a: "Yes — GI distress affects 30–90% of 100-mile runners. It's normal to feel nauseous, especially after mile 60. The key is managing it: switch to bland foods (potatoes, pretzels, broth), slow down, try ginger or Coke, and take smaller, more frequent bites. Some runners carry anti-nausea medication (Zofran, Tums) with medical guidance.",
  },
  {
    q: "Is expensive nutrition worth it?",
    a: "Sometimes. Maurten's hydrogel technology genuinely helps sensitive stomachs tolerate higher carb intakes — worth the premium for some runners. But chocolate milk is as effective as $40 recovery drinks. Dates work as well as $3 gels for some runners. Test budget alternatives in training and invest selectively where you see real performance differences.",
  },
  {
    q: "What's the best post-race recovery nutrition?",
    a: "Within 30 minutes: 3:1 carb-to-protein ratio, 200–400 calories. Chocolate milk is the most evidence-backed, affordable option (4:1 ratio, widely available). Within 2 hours: a real meal with 20–40g protein and substantial carbs to restore glycogen. Keep hydrating with electrolytes for the next 24–48 hours.",
  },
];

const nutritionFaqJsonLd = faqPageJsonLd(
  nutritionFaqEntries.map((item) => ({ question: item.q, answer: item.a }))
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductCard({
  product,
  categoryColor,
  id,
}: {
  product: NutritionProduct;
  categoryColor: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all overflow-hidden flex flex-col scroll-mt-24"
    >
      <div className="bg-gray-50 py-6 flex items-center justify-center border-b border-gray-100">
        <div className="text-center">
          <div className="mb-1"><Coffee className="w-8 h-8 text-gray" /></div>
          <p className="text-xs text-gray">{product.brand}</p>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor}`}>
            {product.brand}
          </span>
          <h3 className="font-headline font-bold text-dark text-lg mt-2 leading-tight">{product.name}</h3>
          <p className="text-accent font-bold text-sm mt-0.5">{product.price}</p>
        </div>

        {/* Nutrition facts */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray mb-4 border-t border-b border-gray-100 py-3">
          <span>Calories: <strong className="text-dark">{product.calories}</strong></span>
          <span>Carbs: <strong className="text-dark">{product.carbs}</strong></span>
          <span>Caffeine: <strong className="text-dark">{product.caffeine}</strong></span>
          <span>Sodium: <strong className="text-dark">{product.sodium}</strong></span>
        </div>

        {/* Best for */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-dark mb-1">Best for</p>
          <div className="flex flex-wrap gap-1">
            {product.bestFor.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        {/* Pros / Cons */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <p className="font-semibold text-dark mb-1">Pros</p>
            <ul className="space-y-0.5">
              {product.pros.slice(0, 3).map((p) => (
                <li key={p} className="text-gray flex gap-1">
                  <span className="text-green-500 shrink-0">+</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-dark mb-1">Cons</p>
            <ul className="space-y-0.5">
              {product.cons.map((c) => (
                <li key={c} className="text-gray flex gap-1">
                  <span className="text-red-400 shrink-0">−</span>{c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Affiliate links */}
        <div className="flex gap-2 flex-wrap mt-auto">
          {[
            ["Amazon", product.affiliates.amazon],
            ...(product.affiliates.rei ? [["REI", product.affiliates.rei]] : []),
            ...(product.affiliates.brand ? [["Brand Site", product.affiliates.brand]] : []),
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex-1 text-center text-xs px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors font-medium"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NutritionPage() {
  return (
    <>
      <Header />
      <JsonLd data={[nutritionItemListJsonLd, nutritionFaqJsonLd]} />

      <main>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-accent/10 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              The 4th Discipline
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">
              Ultra Marathon Nutrition<br className="hidden sm:block" /> & Fueling Strategy
            </h1>
            <p className="text-xl text-gray max-w-2xl mx-auto mb-4">
              Master your nutrition to conquer any distance — from training to race day.
            </p>
            <p className="text-base text-gray max-w-2xl mx-auto mb-6">
              Training, gear, and mental prep get all the attention — but nutrition is the fourth discipline of ultra
              running, and it&apos;s where most races are won or lost. You can train perfectly, have the best gear, and
              still DNF at mile 60 because your gut shut down.
            </p>
            <div className="inline-flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm font-medium">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              Studies show <strong>30–50% of ultra marathon DNFs are nutrition-related.</strong> Get this right.
            </div>
            {/* Nav pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {productCategories.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium"
                >
                  {c.title}
                </a>
              ))}
              <a href="#strategy" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">Distance Strategy</a>
              <a href="#mistakes" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">Mistakes</a>
              <a href="#raceweek" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">Race Week</a>
              <a href="#faq" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">FAQ</a>
            </div>
          </div>
        </section>

        {/* ── Calculator ── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-headline text-3xl font-bold text-dark mb-3">Personalized Fueling Calculator</h2>
              <p className="text-gray">Enter your race details to get your per-hour targets for calories, carbs, fluids, and sodium.</p>
            </div>
            <NutritionCalculator />
          </div>
        </section>

        {/* ── Fundamentals ── */}
        <section className="py-16 bg-dark text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold mb-4">Nutrition Fundamentals</h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                The science behind what fuels your body through 100 miles.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: <Wheat className="w-6 h-6 text-primary" />,
                  title: "Carbohydrates",
                  subtitle: "Primary fuel source",
                  points: [
                    "Glycogen stores hold only ~2,000 calories — enough for ~2 hours at race pace",
                    "Target 30–90g of carbs per hour (train your gut to reach the higher end)",
                    "Use multiple carb types: maltodextrin + fructose absorbed via different pathways",
                    "Carb load 3–4 days before race: 8–10g per kg body weight per day",
                    "Start fueling within the first 30 minutes — not when you feel you need it",
                  ],
                },
                {
                  icon: <Droplets className="w-6 h-6 text-primary" />,
                  title: "Hydration & Electrolytes",
                  subtitle: "More critical than calories",
                  points: [
                    "Baseline: 16–24oz (500–750ml) per hour; increase in heat",
                    "Sodium: 300–700mg per hour — the most critical electrolyte",
                    "Hyponatremia (low sodium from over-hydration) is more dangerous than dehydration",
                    "Sweat rate test: weigh before and after a 1-hour run to calibrate",
                    "Urine should be pale yellow — not clear (over-hydrated) or dark (dehydrated)",
                  ],
                },
                {
                  icon: <Beef className="w-6 h-6 text-primary" />,
                  title: "Protein & Fat",
                  subtitle: "Supporting roles",
                  points: [
                    "Fat is your aerobic engine for easy paces — but can&apos;t fuel high-intensity surges",
                    "Protein matters after mile 30+ in 100-milers: 10–20g/hour prevents muscle breakdown",
                    "BCAAs have limited evidence — whole protein sources are superior",
                    "Fat adaptation has merit in training but isn&apos;t a replacement for race-day carbs",
                    "Real food (potatoes, PB&J, broth) provides protein + fat naturally in later miles",
                  ],
                },
              ].map((block) => (
                <div key={block.title} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="mb-3">{block.icon}</div>
                  <h3 className="font-headline font-bold text-white text-xl mb-1">{block.title}</h3>
                  <p className="text-primary text-sm font-medium mb-4">{block.subtitle}</p>
                  <ul className="space-y-2">
                    {block.points.map((p) => (
                      <li key={p} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-accent shrink-0 mt-0.5">→</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Product Categories ── */}
        {productCategories.map((cat, i) => (
          <section
            key={cat.id}
            id={cat.id}
            className={`py-16 bg-gradient-to-b ${i % 2 === 0 ? cat.color : "from-white to-light"}`}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-3 ${cat.badgeColor}`}>
                  {cat.icon}{cat.title}
                </span>
                <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-2">{cat.title}</h2>
                <p className="text-accent font-semibold text-sm mb-3">{cat.subtitle}</p>
                <p className="text-gray max-w-2xl">{cat.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.products.map((product) => (
                  <ProductCard
                    key={`${cat.id}-${product.brand}-${product.name}`}
                    id={gearProductAnchorId(cat.id, product.brand, product.name)}
                    product={product}
                    categoryColor={cat.badgeColor}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── Distance Strategy ── */}
        <section id="strategy" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Fueling Strategy by Distance</h2>
              <p className="text-gray max-w-xl mx-auto">
                Each distance requires a different approach. Here&apos;s what changes and why.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  distance: "50K (31 miles)",
                  time: "4–10 hours",
                  calPerHr: "200–300",
                  carbsPerHr: "30–60g",
                  fluidPerHr: "16–24oz",
                  sodiumPerHr: "300–500mg",
                  color: "border-blue-200 bg-blue-50",
                  badgeColor: "bg-blue-100 text-blue-800",
                  phases: [
                    { phase: "Miles 0–10", strategy: "Establish your fueling rhythm. 1 gel every 30–45 min. Don't wait until you're hungry." },
                    { phase: "Miles 10–20", strategy: "Maintain gel/chew rotation. Start adding chews for variety. Consistent hydration." },
                    { phase: "Miles 20–31", strategy: "Add caffeine if needed around mile 22–25. Push through with gels and chews. Finish strong." },
                  ],
                  total: "~1,200–2,500 total calories | 6–10 gels equivalent",
                },
                {
                  distance: "50 Miles",
                  time: "7–14 hours",
                  calPerHr: "250–350",
                  carbsPerHr: "40–70g",
                  fluidPerHr: "18–28oz",
                  sodiumPerHr: "400–600mg",
                  color: "border-green-200 bg-green-50",
                  badgeColor: "bg-green-100 text-green-800",
                  phases: [
                    { phase: "Hours 1–3", strategy: "Gels, chews, drink mix. Establish rhythm. Don't go out too fast and burn glycogen." },
                    { phase: "Hours 3–6", strategy: "Transition to real food at aid stations. Waffles, PB&J. Variety prevents flavor fatigue." },
                    { phase: "Hours 6–9", strategy: "Anything that stays down. Caffeine at hour 6–7 if racing. Listen to cravings — they signal deficiencies." },
                    { phase: "Hour 9–finish", strategy: "Survival fueling. Whatever you can get in. Broth if available. Caffeine for final push." },
                  ],
                  total: "~2,500–4,500 total calories | Pack sweet and savory options",
                },
                {
                  distance: "100K (62 miles)",
                  time: "10–20 hours",
                  calPerHr: "200–400",
                  carbsPerHr: "50–90g",
                  fluidPerHr: "20–32oz",
                  sodiumPerHr: "500–700mg",
                  color: "border-orange-200 bg-orange-50",
                  badgeColor: "bg-orange-100 text-orange-800",
                  phases: [
                    { phase: "Miles 0–20", strategy: "Liquid nutrition dominant (Tailwind, Maurten). Gels for quick boosts. Establish hydration." },
                    { phase: "Miles 20–40", strategy: "Add solid foods. Real food becomes important. Protein starts here (cheese, PB, bars)." },
                    { phase: "Miles 40–55", strategy: "Whatever stays down. Night sections: warm food preference. Caffeine timing critical." },
                    { phase: "Miles 55–62", strategy: "Force minimum nutrition. 200 cal/hr minimum. Caffeine if needed. Finish line is close." },
                  ],
                  total: "~3,000–6,000 total calories | Add protein after mile 30",
                },
                {
                  distance: "100 Miles",
                  time: "20–36 hours",
                  calPerHr: "200–350",
                  carbsPerHr: "50–90g",
                  fluidPerHr: "20–30oz",
                  sodiumPerHr: "500–1000mg",
                  color: "border-red-200 bg-red-50",
                  badgeColor: "bg-red-100 text-red-800",
                  phases: [
                    { phase: "Miles 0–30 (Day)", strategy: "250–350 cal/hr. Gels, chews, drink mix. Build a nutrition bank early while appetite is good." },
                    { phase: "Miles 30–60 (Evening)", strategy: "Transition to real food. 200–300 cal/hr. Protein begins. Appetite often drops — don't fight it, just eat less more often." },
                    { phase: "Miles 60–80 (Night)", strategy: "Warm foods: broth, quesadillas, soup. 150–250 cal/hr minimum. Strategic caffeine every 3–4 hours. Comfort foods matter psychologically." },
                    { phase: "Miles 80–100 (Dawn)", strategy: "Reset: fresh food, fresh mindset. Caffeine boost at mile 80–85. 200+ cal/hr for the final push. Whatever it takes." },
                  ],
                  total: "~5,000–9,000 total calories | Night sections are the biggest nutrition challenge",
                },
              ].map((d) => (
                <div key={d.distance} className={`rounded-2xl border p-6 ${d.color}`}>
                  <div className="flex flex-wrap items-start gap-4 mb-5">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${d.badgeColor}`}>{d.time}</span>
                      <h3 className="font-headline font-bold text-dark text-2xl mt-2">{d.distance}</h3>
                    </div>
                    <div className="flex gap-4 flex-wrap ml-auto">
                      {[
                        ["Calories/hr", d.calPerHr],
                        ["Carbs/hr", d.carbsPerHr],
                        ["Fluid/hr", d.fluidPerHr],
                        ["Sodium/hr", d.sodiumPerHr],
                      ].map(([label, val]) => (
                        <div key={label} className="text-center">
                          <p className="font-bold text-dark text-sm">{val}</p>
                          <p className="text-xs text-gray">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {d.phases.map((phase) => (
                      <div key={phase.phase} className="bg-white/60 rounded-xl p-4">
                        <p className="text-xs font-bold text-dark mb-1">{phase.phase}</p>
                        <p className="text-sm text-gray">{phase.strategy}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-dark bg-white/40 rounded-lg px-4 py-2 inline-block">{d.total}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Common Mistakes ── */}
        <section id="mistakes" className="py-16 bg-dark text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold mb-4">Common Mistakes & How to Fix Them</h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Most nutrition failures follow predictable patterns. Know them before they ruin your race.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  problem: "Bonking (Energy Crash)",
                  icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
                  causes: ["Insufficient calorie intake", "Started fueling too late", "Went out too fast"],
                  prevention: ["Start fueling within first 30 minutes", "Set a timer — every 20–25 minutes", "Never skip an aid station"],
                  recovery: ["Immediate 200+ calorie boost (gel + drink)", "Slow down significantly while refueling", "Walk if needed — you can recover from a bonk"],
                },
                {
                  problem: "Nausea & GI Distress",
                  icon: <Frown className="w-6 h-6 text-red-500" />,
                  causes: ["Too much too fast", "Dehydration or overheating", "Products not trained with"],
                  prevention: ["Test ALL products in training", "Small, frequent intake vs. large boluses", "Dilute your drink mix more than you think"],
                  recovery: ["Switch to bland foods (pretzels, bread, potato)", "Ginger (ale, tea, chews)", "Coca-Cola often works miraculously — try it"],
                },
                {
                  problem: "Hyponatremia (Low Sodium)",
                  icon: <Smile className="w-6 h-6 text-orange-500" />,
                  causes: ["Drinking too much plain water", "Insufficient sodium intake", "Heavy sweater ignoring electrolytes"],
                  prevention: ["Never drink just water for extended periods", "300–700mg sodium per hour minimum", "Weigh yourself before/after long training runs"],
                  recovery: ["Increase sodium immediately (broth, pretzels, SaltStick)", "Temporarily reduce fluid intake", "Seek medical attention if confused or severely swollen"],
                },
                {
                  problem: "Flavor Fatigue",
                  icon: <Frown className="w-6 h-6 text-red-500" />,
                  causes: ["Too many sweet products", "Same flavor for hours", "Loss of appetite from fatigue"],
                  prevention: ["Pack both sweet AND savory options", "Rotate flavors — at least 4 different tastes", "Include real food from mile 30+ onward"],
                  recovery: ["Switch immediately to savory: broth, pretzels, chips, pickle juice", "Try water instead of sweet drink", "Cold soda (Sprite, Coke) can reset your palate"],
                },
                {
                  problem: "Dehydration",
                  icon: <Sun className="w-6 h-6 text-orange-500" />,
                  causes: ["Insufficient fluid intake", "Ignoring heat and sweat rate", "Over-relying on thirst sensation"],
                  prevention: ["Drink 16–24oz per hour minimum", "Monitor urine color (pale yellow target)", "Pre-hydrate the days before your race"],
                  recovery: ["Gradual rehydration with electrolytes — not just water", "Ice chips if feeling nauseous", "Slow down at aid station for a full refill"],
                },
                {
                  problem: "Cramping",
                  icon: <Zap className="w-6 h-6 text-accent" />,
                  causes: ["Electrolyte depletion (especially sodium)", "Dehydration", "Going out too hard, too early"],
                  prevention: ["Consistent sodium intake throughout the race", "Don't ignore cramp warnings (twitching)", "Pickle juice works — pack it in a small flask"],
                  recovery: ["Immediate electrolyte boost (SaltStick, LMNT, pickle juice)", "Slow pace — let blood flow restore", "Stretch if stopped, but don't force a severe cramp"],
                },
              ].map((m) => (
                <div key={m.problem} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="mb-2">{m.icon}</div>
                  <h3 className="font-headline font-bold text-white text-lg mb-4">{m.problem}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-red-400 mb-1">Causes</p>
                      <ul className="space-y-0.5">
                        {m.causes.map((c) => <li key={c} className="text-xs text-gray-400 flex gap-1"><span className="text-red-400">×</span>{c}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-400 mb-1">Prevention</p>
                      <ul className="space-y-0.5">
                        {m.prevention.map((p) => <li key={p} className="text-xs text-gray-400 flex gap-1"><span className="text-green-400">+</span>{p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-yellow-400 mb-1">Mid-Race Fix</p>
                      <ul className="space-y-0.5">
                        {m.recovery.map((r) => <li key={r} className="text-xs text-gray-400 flex gap-1"><span className="text-yellow-400">→</span>{r}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Race Week ── */}
        <section id="raceweek" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Race Week Nutrition</h2>
              <p className="text-gray max-w-xl mx-auto">
                The week before your race is where you build the fuel tank. Don&apos;t waste it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  day: "7 Days Out",
                  icon: <Calendar className="w-6 h-6 text-primary" />,
                  color: "bg-gray-50 border-gray-200",
                  items: ["Normal eating — don't change anything dramatic", "Begin hydration focus (extra 16oz/day)", "Cut alcohol completely", "Reduce fiber slightly", "Avoid new or exotic foods"],
                },
                {
                  day: "5 Days Out",
                  icon: <Wheat className="w-6 h-6 text-primary" />,
                  color: "bg-blue-50 border-blue-200",
                  items: ["Carb loading begins: 70–80% of calories from carbs", "Target 8–10g carbs per kg body weight", "Reduce fat to make room for carbs", "Focus: pasta, rice, bread, oatmeal, potatoes", "Hydration with electrolytes"],
                },
                {
                  day: "3 Days Out",
                  icon: <Salad className="w-6 h-6 text-primary" />,
                  color: "bg-green-50 border-green-200",
                  items: ["Continue carb loading", "Cut fiber foods: no beans, cruciferous vegetables", "Simple, familiar foods only", "Hydrate with electrolytes every meal", "Avoid excessive fruit (fiber + fructose)"],
                },
                {
                  day: "Day Before",
                  icon: <Apple className="w-6 h-6 text-primary" />,
                  color: "bg-orange-50 border-orange-200",
                  items: ["Normal-sized meals — don't stuff yourself", "Biggest meal at lunch, not dinner", "Light, familiar dinner (pasta, rice)", "Hydrate throughout the day", "Early bedtime — sleep > perfect nutrition"],
                },
                {
                  day: "Race Morning",
                  icon: <PersonStanding className="w-6 h-6 text-primary" />,
                  color: "bg-red-50 border-red-200",
                  items: ["3–4 hrs before: 400–800 cal (bagel + PB + banana)", "Same breakfast you&apos;ve practiced — NO experiments", "Sip electrolyte drink up to start", "Last gel: 15–30 min before gun", "Stop large solids 2 hrs before start"],
                },
              ].map((day) => (
                <div key={day.day} className={`rounded-xl border p-5 ${day.color}`}>
                  <div className="mb-2">{day.icon}</div>
                  <p className="font-headline font-bold text-dark text-sm mb-3">{day.day}</p>
                  <ul className="space-y-1.5">
                    {day.items.map((item) => (
                      <li key={item} className="text-xs text-gray flex gap-2">
                        <span className="text-primary shrink-0">→</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Aid Station + Caffeine ── */}
        <section className="py-16 bg-light">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Aid station strategy */}
              <div>
                <h2 className="font-headline text-2xl font-bold text-dark mb-2">Aid Station Strategy</h2>
                <p className="text-gray text-sm mb-6">Aid stations are opportunities — most runners waste them. Here&apos;s how to use them efficiently.</p>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
                  <p className="font-semibold text-dark mb-3 text-sm">What Most Aid Stations Offer</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray">
                    {["Water + electrolyte drink", "Coca-Cola / Ginger Ale", "Chips, pretzels, crackers", "Candy, gummies, M&Ms", "PB&J sandwiches", "Bananas, oranges", "Boiled potatoes with salt", "Quesadillas (major races)", "Broth (night sections)", "Coffee (100M races)"].map((item) => (
                      <div key={item} className="flex gap-1"><span className="text-green-500">→</span>{item}</div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="font-semibold text-dark mb-3 text-sm">Efficient Aid Station Protocol</p>
                  <div className="space-y-2">
                    {[
                      { rule: "Know your stop time goal", note: "50K/50M: under 2 min. 100M: 5–10 min max (night aid stations ok longer)" },
                      { rule: "Refill before you eat", note: "Get bottles filled first — hands free to grab food after" },
                      { rule: "Take food to go", note: "Potato, waffle, sandwich — eat while walking out of the station" },
                      { rule: "Use Coke strategically", note: "Don't use it every stop — save it for when you really need the boost" },
                      { rule: "Don't rely on aid stations", note: "Always carry your tested nutrition — aid stations vary wildly by race" },
                    ].map((row) => (
                      <div key={row.rule} className="text-sm">
                        <span className="font-semibold text-dark">{row.rule}: </span>
                        <span className="text-gray">{row.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Caffeine strategy */}
              <div>
                <h2 className="font-headline text-2xl font-bold text-dark mb-2">Caffeine Strategy</h2>
                <p className="text-gray text-sm mb-6">The most evidence-based performance tool available. Used correctly, it can turn a dying race around.</p>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
                  <p className="font-semibold text-dark mb-3 text-sm">The Science</p>
                  <ul className="space-y-1 text-sm text-gray">
                    {["Reduces perceived exertion — effort feels easier", "Delays central fatigue — brain gives up later", "Effective dose: 3–6mg per kg body weight", "Onset: 30–60 minutes after intake", "Duration: 4–6 hours per dose"].map((item) => (
                      <li key={item} className="flex gap-2"><span className="text-primary shrink-0">→</span>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="font-semibold text-dark mb-3 text-sm">Timing by Distance</p>
                  <div className="space-y-3">
                    {[
                      { dist: "50K", timing: "Mile 20–25 only", dose: "100–200mg total" },
                      { dist: "50 Miles", timing: "Mile 30–35, then 42–45", dose: "200–400mg total" },
                      { dist: "100K", timing: "Mile 25–30, before nightfall, late-night", dose: "300–600mg total" },
                      { dist: "100 Miles", timing: "Evening (mi 45), every 3–4 hrs through night, dawn (mi 80)", dose: "500–1000mg total" },
                    ].map((row) => (
                      <div key={row.dist} className="flex gap-3 text-sm pb-2 border-b border-gray-50 last:border-0">
                        <span className="font-bold text-primary w-16 shrink-0">{row.dist}</span>
                        <div>
                          <p className="text-dark font-medium">{row.timing}</p>
                          <p className="text-gray text-xs">{row.dose}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-red-500 mt-3 font-medium">Warning: Don&apos;t start too early — save it for when you need it. Test all caffeine products in training.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {nutritionFaqEntries.map((item) => (
                <details key={item.q} className="group bg-white rounded-xl border border-gray-100 shadow-sm">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-dark list-none">
                    {item.q}
                    <span className="text-primary ml-3 shrink-0 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-5 pb-5 text-gray text-sm leading-relaxed">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Affiliate Disclosure ── */}
        <section className="py-6 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs text-gray">
              <strong>Affiliate disclosure:</strong> FinishUltra may earn a commission on purchases made through links on this page at no additional cost to you.
              We only recommend products we&apos;ve researched and trust for ultra running.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
