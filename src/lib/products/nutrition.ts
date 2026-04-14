import type { NutritionProduct } from "./types";

// ─── Centralized Nutrition Product Library ──────────────────────────────────
// Sources: race-day-kit.ts (nutrition category), KitBuilder.tsx buildKit()

export const nutrition: NutritionProduct[] = [
  // ── Drink Mixes ───────────────────────────────────────────────────────────

  {
    id: "tailwind-endurance-fuel",
    name: "Endurance Fuel",
    brand: "Tailwind",
    category: "nutrition",
    price: 35,
    priceDisplay: "$35 (30 servings)",
    description:
      "All-in-one calories, electrolytes, and hydration in a single scoop. Mix with water and sip steady — eliminates the complexity of juggling gels and tabs.",
    whyWeRecommend:
      "Many runners have finished 100-milers on Tailwind alone — it simplifies fueling to one product and reduces the chance of forgetting to eat. All-in-one calories + electrolytes + hydration.",
    specs: {
      calories: "100 per serving",
      carbs: "25g",
      sodium: "310mg per serving",
      servings: "30 per bag",
    },
    nutritionType: "drink-mix",
    stomachFriendly: true,
    affiliateLinks: {
      rei: "https://www.rei.com/search?q=Tailwind%20Endurance%20Fuel&cm_mmc=aff_AL-_-finishultra-_-1",
      amazon:
        "https://www.amazon.com/s?k=Tailwind%20Endurance%20Fuel&tag=finishultra-20",
    },
    tags: ["drink-mix", "all-in-one", "calories", "electrolytes", "stomach-friendly"],
    beginnerPick: true,
  },
  {
    id: "skratch-sport-hydration-mix",
    name: "Sport Hydration Mix",
    brand: "Skratch Labs",
    category: "nutrition",
    price: 25,
    priceDisplay: "$25 (20 servings)",
    description:
      "Low-sugar electrolyte drink formulated to match real sweat chemistry. Developed by sports scientists for athletes who need real hydration, not just sweet drinks.",
    whyWeRecommend:
      "Skratch's electrolyte profile is formulated to match real sweat chemistry — lower sugar, higher sodium. This is the drink for hot weather and heavy sweaters who need actual electrolyte replacement.",
    specs: {
      calories: "80 per serving",
      sodium: "380mg per serving",
      carbs: "18g",
      servings: "20 per bag",
    },
    nutritionType: "drink-mix",
    stomachFriendly: true,
    affiliateLinks: {
      rei: "https://www.rei.com/search?q=Skratch%20Labs%20Sport%20Hydration%20Mix&cm_mmc=aff_AL-_-finishultra-_-1",
      amazon:
        "https://www.amazon.com/s?k=Skratch%20Labs%20Sport%20Hydration%20Mix&tag=finishultra-20",
    },
    tags: ["drink-mix", "electrolytes", "low-sugar", "heavy-sweater", "hot-weather"],
  },

  // ── Gels ──────────────────────────────────────────────────────────────────

  {
    id: "gu-energy-gels",
    name: "Energy Gels (Box of 24)",
    brand: "GU Energy",
    category: "nutrition",
    price: 36,
    priceDisplay: "$36 (24-pack)",
    description:
      "The most widely tested gel in ultra racing. 100 calories per gel with amino acids for muscle protection. Available at most aid stations so supply chain is easy.",
    whyWeRecommend:
      "The trail running standard for two decades. Tested by millions of runners in every condition — which is exactly why you want them when your brain isn't functioning at mile 70.",
    specs: {
      calories: "100 per gel",
      carbs: "22g",
      caffeine: "0-40mg (varies by flavor)",
      servings: "24 per box",
    },
    nutritionType: "gel",
    affiliateLinks: {
      rei: "https://www.rei.com/search?q=GU%20Energy%20Gels%2024%20pack&cm_mmc=aff_AL-_-finishultra-_-1",
      amazon:
        "https://www.amazon.com/s?k=GU%20Energy%20Gels%2024%20pack&tag=finishultra-20",
    },
    tags: ["gel", "amino-acids", "variety-pack", "aid-station-staple"],
    beginnerPick: true,
  },
  {
    id: "spring-energy-awesome-sauce",
    name: "Awesome Sauce Gel",
    brand: "Spring Energy",
    category: "nutrition",
    price: 48,
    priceDisplay: "$48 (12-pack)",
    description:
      "Real-food gel made from rice, banana, and pumpkin. When your stomach rebels against chemicals at mile 60, real ingredients keep going down.",
    whyWeRecommend:
      "When your stomach rebels against synthetic gels at mile 60, real-food ingredients keep going down. Rice, banana, and pumpkin digest cleanly even when your GI system is shutting down.",
    specs: {
      calories: "~130 per gel",
      carbs: "~30g",
      servings: "12 per box",
    },
    nutritionType: "gel",
    stomachFriendly: true,
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Spring%20Energy%20Awesome%20Sauce%20Gel&tag=finishultra-20",
      rei: "https://www.rei.com/search?q=Spring%20Energy%20Awesome%20Sauce&cm_mmc=aff_AL-_-finishultra-_-1",
    },
    tags: ["gel", "real-food", "stomach-friendly", "rice-based"],
  },
  {
    id: "maurten-gel-100",
    name: "Gel 100",
    brand: "Maurten",
    category: "nutrition",
    price: 48,
    priceDisplay: "$48 (12-pack)",
    description:
      "Hydrogel technology clinically shown to be gentler on GI systems at race pace. The only gel specifically designed for sensitive stomachs.",
    whyWeRecommend:
      "Maurten's hydrogel technology is clinically shown to be gentler on GI systems at race pace — the only gel specifically designed for sensitive stomachs. Worth the premium when a GI incident at mile 50 means a DNF.",
    specs: {
      calories: "100 per gel",
      carbs: "25g",
      caffeine: "0mg (plain)",
    },
    nutritionType: "gel",
    stomachFriendly: true,
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Maurten%20Gel%20100&tag=finishultra-20",
      rei: "https://www.rei.com/search?q=Maurten%20Gel%20100&cm_mmc=aff_AL-_-finishultra-_-1",
    },
    tags: ["gel", "hydrogel", "sensitive-stomach", "premium", "gi-friendly"],
  },

  // ── Real Food ─────────────────────────────────────────────────────────────

  {
    id: "picky-bars-picky-oats",
    name: "Picky Oats",
    brand: "Picky Bars",
    category: "nutrition",
    price: 36,
    priceDisplay: "$36 (12-pack)",
    description:
      "Real food in portable oatmeal format. Whole grains, dates, and nuts give you a fat/protein/carb mix that sustains energy longer than simple sugars.",
    whyWeRecommend:
      "Real food in portable oatmeal format. Whole grains, dates, and nuts give you a fat/protein/carb mix that sustains energy longer than simple sugars — ideal for iron-gut runners who can handle solid food at race pace.",
    specs: {
      calories: "200 per pouch",
      carbs: "30g",
    },
    nutritionType: "real-food",
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Picky%20Bars%20Picky%20Oats&tag=finishultra-20",
      rei: "https://www.rei.com/search?q=Picky%20Bars%20Picky%20Oats&cm_mmc=aff_AL-_-finishultra-_-1",
    },
    tags: ["real-food", "oatmeal", "whole-grains", "sustained-energy"],
  },
  {
    id: "muir-energy-real-food-gel",
    name: "Real Food Gel",
    brand: "Muir Energy",
    category: "nutrition",
    price: 42,
    priceDisplay: "$42 (12-pack)",
    description:
      "Real ingredients in gel format — dates, nuts, and seeds. No synthetic flavors or artificial ingredients. Prevents the flavor fatigue that kills gel-only strategies after mile 40.",
    whyWeRecommend:
      "130 calories of dates, nuts, and seeds digest cleanly and prevent the flavor fatigue that kills gel-only strategies after mile 40. Real food in a portable, squeezable format.",
    specs: {
      calories: "130 per gel",
      carbs: "19g",
    },
    nutritionType: "real-food",
    stomachFriendly: true,
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Muir%20Energy%20Real%20Food%20Gel&tag=finishultra-20",
      rei: "https://www.rei.com/search?q=Muir%20Energy%20Gel&cm_mmc=aff_AL-_-finishultra-_-1",
    },
    tags: ["real-food", "gel-format", "natural", "no-artificial"],
  },

  // ── Chews ─────────────────────────────────────────────────────────────────

  {
    id: "clif-shot-bloks",
    name: "Shot Bloks Energy Chews",
    brand: "Clif",
    category: "nutrition",
    price: 24,
    priceDisplay: "$24 (18-pack)",
    description:
      "Chewable energy that's easier to manage than gels when your hands are cold or shaking. 3 bloks = 1 gel equivalent. Great texture variety.",
    whyWeRecommend:
      "Chewable energy is easier to manage than gels when your hands are cold or shaking. 3 bloks = 1 gel equivalent — and the chewing action can help settle a queasy stomach.",
    specs: {
      calories: "~33 per blok (100 per 3-blok serving)",
      carbs: "24g per 3 bloks",
      sodium: "70mg per 3 bloks",
      servings: "18 packages",
    },
    nutritionType: "chew",
    affiliateLinks: {
      rei: "https://www.rei.com/search?q=Clif%20Shot%20Bloks%20Energy%20Chews&cm_mmc=aff_AL-_-finishultra-_-1",
      amazon:
        "https://www.amazon.com/s?k=Clif%20Shot%20Bloks%20Energy%20Chews&tag=finishultra-20",
    },
    tags: ["chew", "portable", "cold-weather-friendly", "variety"],
  },

  // ── Electrolytes ──────────────────────────────────────────────────────────

  {
    id: "precision-hydration-ph1500",
    name: "PH 1500 Electrolyte Sachets",
    brand: "Precision Hydration",
    category: "nutrition",
    price: 30,
    priceDisplay: "$30 (10-pack)",
    description:
      "High-sodium electrolyte sachets for heavy sweaters and hot conditions. Prevents the dangerous hyponatremia (low sodium) that hospitalizes ultra runners every year.",
    whyWeRecommend:
      "High-sodium formula specifically for heavy sweaters and hot conditions. Prevents the dangerous hyponatremia (low sodium) that hospitalizes ultra runners every year. Dose precisely based on your sweat rate.",
    specs: {
      sodium: "1500mg per serving",
      servings: "10 sachets per box",
    },
    nutritionType: "electrolyte",
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Precision%20Hydration%20PH%201500&tag=finishultra-20",
      runningWarehouse:
        "https://www.runningwarehouse.com/searchresults/?searchTerm=Precision%20Hydration%201500&sourceCode=FFULTRA",
    },
    tags: ["electrolyte", "high-sodium", "heavy-sweater", "hot-weather", "hyponatremia-prevention"],
  },
  {
    id: "saltstick-fastchews",
    name: "Fastchews",
    brand: "SaltStick",
    category: "nutrition",
    price: 12,
    priceDisplay: "$12 (60 tabs)",
    description:
      "Chewable electrolyte tabs that let you dose precisely without adding stomach volume. 100mg sodium per tab — ideal for heavy sweaters and 100-mile efforts.",
    whyWeRecommend:
      "Heavy sweaters and 100-mile runners need 600-800mg of sodium per hour — far more than most sports drinks provide. Chewable tabs let you dose precisely without adding stomach volume.",
    specs: {
      sodium: "100mg per tab",
      servings: "60 per tube",
    },
    nutritionType: "electrolyte",
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=SaltStick%20Fastchews%20electrolytes&tag=finishultra-20",
      rei: "https://www.rei.com/search?q=SaltStick%20Fastchews&cm_mmc=aff_AL-_-finishultra-_-1",
    },
    tags: ["electrolyte", "chewable", "portable", "precise-dosing"],
  },

  // ── Recovery Nutrition ────────────────────────────────────────────────────

  {
    id: "momentous-whey-protein",
    name: "Grass-Fed Whey Protein",
    brand: "Momentous",
    category: "nutrition",
    price: 50,
    priceDisplay: "$50 (30 servings)",
    description:
      "NSF Certified for Sport protein powder with leucine for muscle protein synthesis. Consume within 30 minutes of finishing to kick-start muscle repair immediately.",
    whyWeRecommend:
      "NSF Certified for Sport means no banned substances — critical for competitive runners. Leucine-rich formula kick-starts muscle protein synthesis within 30 minutes of finishing.",
    specs: {
      calories: "~130 per serving",
      servings: "30 per container",
    },
    nutritionType: "recovery",
    affiliateLinks: {
      amazon:
        "https://www.amazon.com/s?k=Momentous%20Grass-Fed%20Whey%20Protein&tag=finishultra-20",
      rei: "https://www.rei.com/search?q=Momentous%20Whey%20Protein&cm_mmc=aff_AL-_-finishultra-_-1",
    },
    tags: ["recovery", "protein", "nsf-certified", "post-race"],
  },
];
