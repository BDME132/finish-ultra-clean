import React from "react";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { faqs } from "@/lib/content/faqs";
import JsonLd from "@/components/JsonLd";
import ShoeFinder from "./ShoeFinder";
import {
  faqPageJsonLd,
  gearProductAnchorId,
  itemListJsonLd,
  SITE_URL,
} from "@/lib/schema";
import {
  Footprints, Circle, Settings, Ruler, ArrowLeftRight, RefreshCcw,
  PersonStanding, Zap, Mountain, BedDouble, CheckCircle, Dumbbell,
  Smile, Shield,
} from "lucide-react";

import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Best Trail Shoes for Ultra Marathons | FinishUltra",
    description:
      "Compare cushioned, technical, and race-day trail shoes for ultras — stack, drop, grip, and real-world picks from 50K to 100 miles.",
    path: "/gear/shoes",
  }),
};

// ─── Shoe Data ────────────────────────────────────────────────────────────────

type Rating = { cushioning: number; traction: number; durability: number; breathability: number; groundFeel: number };

type Shoe = {
  name: string;
  brand: string;
  price: string;
  weight: string;
  stack: string;
  drop: string;
  lug: string;
  midsole: string;
  outsole: string;
  rockPlate: boolean;
  widths: string;
  ratings: Rating;
  bestFor: string[];
  pros: string[];
  cons: string[];
  review: { quote: string; race: string; runner: string };
  affiliates: { rei: string; amazon: string; warehouse: string };
};

const categories: {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  badgeColor: string;
  description: string;
  stackNote: string;
  shoes: Shoe[];
}[] = [
  {
    id: "max-cushion",
    title: "Maximum Cushion",
    subtitle: "Best for long distances, recovery runs, plush comfort",
    color: "from-blue-50 to-white",
    badgeColor: "bg-blue-100 text-blue-800",
    description:
      "High-stack shoes prioritize underfoot protection and comfort over raw ground feel. Essential for 100-mile efforts and runners who log big training weeks.",
    stackNote: "Stack height: 30mm+",
    shoes: [
      {
        name: "Speedgoat 6",
        brand: "Hoka",
        price: "$160",
        weight: "10.1 oz",
        stack: "37/33mm",
        drop: "4mm",
        lug: "5mm",
        midsole: "EVA (ProFly)",
        outsole: "Vibram Megagrip",
        rockPlate: false,
        widths: "Regular, Wide",
        ratings: { cushioning: 5, traction: 5, durability: 4, breathability: 4, groundFeel: 2 },
        bestFor: ["Technical trails", "100-mile races", "High weekly mileage"],
        pros: ["Best-in-class Vibram traction", "Plush all-day comfort", "Wide platform stability", "Updated breathable upper"],
        cons: ["Heavy for race-day speed", "Low ground feel", "Can run narrow in toebox"],
        review: {
          quote: "I've run Western States in Speedgoats for three years. They hold up from the canyons to the finish.",
          race: "Western States 100",
          runner: "Verified 100-mile finisher",
        },
        affiliates: { rei: "#", amazon: "https://amzn.to/4broufc", warehouse: "#" },
      },
      {
        name: "Mafate Speed 4",
        brand: "Hoka",
        price: "$175",
        weight: "11.0 oz",
        stack: "37/33mm",
        drop: "5mm",
        lug: "6mm",
        midsole: "Dual-density EVA",
        outsole: "Vibram Megagrip",
        rockPlate: false,
        widths: "Regular",
        ratings: { cushioning: 5, traction: 5, durability: 5, breathability: 3, groundFeel: 2 },
        bestFor: ["100-mile races", "Rocky/mountain terrain", "Runners over 180 lbs"],
        pros: ["Exceptional durability", "Bomber stability for big descents", "Dual-density midsole lasts longer"],
        cons: ["Heaviest shoe in category", "Limited breathability", "Overkill for shorter ultras"],
        review: {
          quote: "After 400 miles the lugs still bite. Nothing else has lasted as long on scree and granite.",
          race: "Hardrock 100",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Olympus 5",
        brand: "Altra",
        price: "$160",
        weight: "11.2 oz",
        stack: "33mm",
        drop: "0mm",
        lug: "4mm",
        midsole: "Quantic foam",
        outsole: "TrailClaw",
        rockPlate: false,
        widths: "Regular, Wide",
        ratings: { cushioning: 5, traction: 4, durability: 4, breathability: 4, groundFeel: 3 },
        bestFor: ["Zero-drop advocates", "Wide forefoot", "Desert and mixed terrain"],
        pros: ["Maximum stack with zero drop", "Anatomical FootShape toe box", "Comfortable from mile 1 to 100"],
        cons: ["Takes time to adapt if coming from heeled shoes", "Less aggressive traction than Vibram options"],
        review: {
          quote: "Switching to zero drop changed everything. The Olympus let me go big without destroying my feet.",
          race: "Javelina Jundred",
          runner: "Verified 100-mile finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Endorphin Edge",
        brand: "Saucony",
        price: "$190",
        weight: "9.7 oz",
        stack: "37/29mm",
        drop: "8mm",
        lug: "4mm",
        midsole: "PEBA foam",
        outsole: "TrailTack",
        rockPlate: true,
        widths: "Regular",
        ratings: { cushioning: 5, traction: 3, durability: 3, breathability: 5, groundFeel: 3 },
        bestFor: ["Groomed/smooth trails", "Faster paced 50K/50M", "Road-to-trail crossover runners"],
        pros: ["PEBA foam energy return is exceptional", "Surprisingly lightweight", "Carbon plate efficiency"],
        cons: ["Traction limited on wet rock", "Less durable than traditional rubber", "Premium price"],
        review: {
          quote: "Felt like racing flats on the groomed sections and still had enough foam for the long haul.",
          race: "Lake Sonoma 50",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
    ],
  },
  {
    id: "lightweight",
    title: "Lightweight Trail Racers",
    subtitle: "Best for faster efforts, shorter ultras, experienced runners",
    color: "from-green-50 to-white",
    badgeColor: "bg-green-100 text-green-800",
    description:
      "Stripped-down shoes that prioritize speed and feel. A smart choice for 50K race day or tempo training when you want responsiveness without dead weight.",
    stackNote: "Stack height: 20–28mm",
    shoes: [
      {
        name: "S/Lab Ultra 3",
        brand: "Salomon",
        price: "$200",
        weight: "9.2 oz",
        stack: "30/24mm",
        drop: "6mm",
        lug: "4mm",
        midsole: "EnergyCell foam",
        outsole: "Contagrip MA",
        rockPlate: false,
        widths: "Regular",
        ratings: { cushioning: 3, traction: 4, durability: 4, breathability: 5, groundFeel: 4 },
        bestFor: ["Race day 50K/50M", "Technical trails at speed", "Experienced runners with strong feet"],
        pros: ["SensiFit cradles foot perfectly on descents", "Excellent fit-to-feel ratio", "Used by elite ultra runners worldwide"],
        cons: ["Expensive", "Narrow fit", "Not enough cushion for 100M"],
        review: {
          quote: "SensiFit is the most secure trail fit I've ever worn. I flew down the descents with zero slippage.",
          race: "UTMB",
          runner: "Elite finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Peregrine 14",
        brand: "Saucony",
        price: "$140",
        weight: "9.6 oz",
        stack: "31/23mm",
        drop: "8mm",
        lug: "4mm",
        midsole: "PWRTRAC foam",
        outsole: "TrailTack",
        rockPlate: false,
        widths: "Regular, Wide",
        ratings: { cushioning: 3, traction: 4, durability: 5, breathability: 4, groundFeel: 4 },
        bestFor: ["Technical and smooth mixed terrain", "50K to 50M", "High-mileage training"],
        pros: ["Bulletproof durability", "Versatile lug pattern for mixed terrain", "Great value at $140"],
        cons: ["Less cushion than higher-stack options", "Not the lightest in class"],
        review: {
          quote: "I've put 600 miles on my Peregrines and they're still racing. Best value in ultra footwear.",
          race: "Cascade Crest 100",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Terraventure 4",
        brand: "Topo",
        price: "$130",
        weight: "9.7 oz",
        stack: "28/23mm",
        drop: "5mm",
        lug: "4mm",
        midsole: "ZipFoam",
        outsole: "Vibram Megagrip",
        rockPlate: false,
        widths: "Regular",
        ratings: { cushioning: 3, traction: 5, durability: 4, breathability: 4, groundFeel: 4 },
        bestFor: ["Versatile mixed terrain", "Runners transitioning from heeled shoes", "Budget-conscious racers"],
        pros: ["Vibram grip at a lower price point", "Roomy toe box for Topo", "5mm drop is a sweet spot for many runners"],
        cons: ["Less refined upper than Salomon or Hoka", "Somewhat heavy for a race shoe"],
        review: {
          quote: "The Terraventure punches above its price. Vibram Megagrip at $130 is a steal.",
          race: "Black Hills 100",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
    ],
  },
  {
    id: "technical",
    title: "Technical Terrain Specialists",
    subtitle: "Best for rocks, roots, steep descents, aggressive grip",
    color: "from-orange-50 to-white",
    badgeColor: "bg-orange-100 text-orange-800",
    description:
      "When the trail demands precision grip and confident footing over rocks and roots, these shoes answer the call. Aggressive lugs and sticky rubber are non-negotiable.",
    stackNote: "Features: Deep lugs, sticky rubber, secure fit",
    shoes: [
      {
        name: "Bushido III",
        brand: "La Sportiva",
        price: "$160",
        weight: "10.4 oz",
        stack: "26/19mm",
        drop: "7mm",
        lug: "4mm",
        midsole: "Aero-Mesh upper + compression-molded EVA",
        outsole: "FriXion AT",
        rockPlate: true,
        widths: "Regular",
        ratings: { cushioning: 3, traction: 5, durability: 4, breathability: 4, groundFeel: 5 },
        bestFor: ["Wet/slippery rock", "Rooty PNW trails", "Mountain racing"],
        pros: ["FriXion AT is exceptional on wet rock", "Forefoot flex groove for natural feel", "Durable Italian construction"],
        cons: ["Firm underfoot", "Narrow fit", "Less comfortable on non-technical terrain"],
        review: {
          quote: "On wet granite, nothing touches the Bushido. I felt glued to the mountain the entire race.",
          race: "Waldo 100K",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Speedcross 6",
        brand: "Salomon",
        price: "$140",
        weight: "9.6 oz",
        stack: "34/26mm",
        drop: "8mm",
        lug: "6mm",
        midsole: "EnergyCell",
        outsole: "Contagrip TA",
        rockPlate: false,
        widths: "Regular",
        ratings: { cushioning: 4, traction: 5, durability: 4, breathability: 3, groundFeel: 3 },
        bestFor: ["Mud", "Soft terrain", "Pacific Northwest races"],
        pros: ["Unmatched mud performance", "Chevron lug pattern self-cleans", "Higher stack for a technical shoe"],
        cons: ["Poor on hard-packed trails", "Heavy for a race shoe", "Lugs can feel awkward on rock"],
        review: {
          quote: "Soggy Oregon mud — the Speedcross just laughed at it. Nothing else comes close.",
          race: "Tillamook Burn 50K",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Mudclaw G 260",
        brand: "Inov-8",
        price: "$160",
        weight: "9.2 oz",
        stack: "25/19mm",
        drop: "6mm",
        lug: "8mm",
        midsole: "Powerflow",
        outsole: "Graphene Grip",
        rockPlate: false,
        widths: "Regular",
        ratings: { cushioning: 2, traction: 5, durability: 5, groundFeel: 5, breathability: 4 },
        bestFor: ["Bog, mud, wet fell running", "Technical fell racing", "Ultra-technical UK-style courses"],
        pros: ["Graphene rubber is the most durable grip compound available", "8mm spike-like lugs dig deep", "Legendary in fell running circles"],
        cons: ["Minimal cushion", "Uncomfortable on hard surfaces", "Niche use case"],
        review: {
          quote: "I've been running Mudclaws since 2018. Nothing else works on British fells.",
          race: "Lakeland 100",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
    ],
  },
  {
    id: "wide",
    title: "Wide Toe Box",
    subtitle: "Best for natural toe splay, blister prevention, long-distance comfort",
    color: "from-purple-50 to-white",
    badgeColor: "bg-purple-100 text-purple-800",
    description:
      "At mile 80, swollen feet need room. Wide toe box shoes allow natural toe splay, reduce hotspots, and dramatically cut blister risk on long efforts.",
    stackNote: "Feature: Anatomical FootShape or roomy toe box design",
    shoes: [
      {
        name: "Lone Peak 8",
        brand: "Altra",
        price: "$140",
        weight: "9.7 oz",
        stack: "25mm",
        drop: "0mm",
        lug: "4mm",
        midsole: "Altra EGO",
        outsole: "TrailClaw",
        rockPlate: false,
        widths: "Regular, Wide, Max Wide",
        ratings: { cushioning: 3, traction: 4, durability: 5, groundFeel: 4, breathability: 4 },
        bestFor: ["Any terrain", "All distances", "Zero-drop runners", "Wide forefoot"],
        pros: ["The most popular ultra shoe ever made", "Zero drop promotes natural running", "Bulletproof durability", "Available in Max Wide"],
        cons: ["Minimal cushion for 100-mile efforts", "Zero drop requires adaptation period"],
        review: {
          quote: "I've finished 14 hundred-milers in Lone Peaks. If it ain't broke, don't fix it.",
          race: "Leadville 100",
          runner: "Verified multi-100 finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Timp 5",
        brand: "Altra",
        price: "$145",
        weight: "10.1 oz",
        stack: "33mm",
        drop: "0mm",
        lug: "5mm",
        midsole: "Altra EGO Max",
        outsole: "TrailClaw",
        rockPlate: false,
        widths: "Regular, Wide",
        ratings: { cushioning: 5, traction: 5, groundFeel: 3, durability: 4, breathability: 4 },
        bestFor: ["Technical 100-mile courses", "Runners wanting Lone Peak fit + more cushion", "Mountain terrain"],
        pros: ["More cushion than Lone Peak", "Aggressive TrailClaw traction", "Zero drop in a high-stack shoe"],
        cons: ["Heavier than Lone Peak", "Some runners find EGO Max less responsive"],
        review: {
          quote: "Lone Peak fit, Olympus cushion. The Timp 5 is my go-to for everything above 50 miles.",
          race: "Bear 100",
          runner: "Verified 100-mile finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Ultraventure 3",
        brand: "Topo",
        price: "$140",
        weight: "10.1 oz",
        stack: "28/23mm",
        drop: "5mm",
        lug: "4mm",
        midsole: "ZipFoam",
        outsole: "Vibram Megagrip",
        rockPlate: false,
        widths: "Regular",
        ratings: { cushioning: 4, traction: 5, groundFeel: 3, durability: 4, breathability: 4 },
        bestFor: ["Runners transitioning to wider toe boxes", "Mixed terrain", "50K to 100K"],
        pros: ["5mm drop bridges the gap for non-zero-drop runners", "Vibram Megagrip for excellent traction", "Roomy fit without being extreme"],
        cons: ["Less roomy than Altra", "Heavier build"],
        review: {
          quote: "I couldn't go zero-drop, but the Ultraventure's wide box still saved my toes at mile 60.",
          race: "Zion 100",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
    ],
  },
  {
    id: "mountain",
    title: "Mountain / Alpine",
    subtitle: "Best for high elevation, scree, mixed terrain, gaiter compatibility",
    color: "from-red-50 to-white",
    badgeColor: "bg-red-100 text-red-800",
    description:
      "Courses like Hardrock and UTMB demand specialized footwear. Mountain shoes combine sticky rubber, toe protection, and gaiter compatibility for high-altitude punishment.",
    stackNote: "Features: Toe cap, gaiter attachment, sticky mountain rubber",
    shoes: [
      {
        name: "Ultra Raptor II",
        brand: "La Sportiva",
        price: "$175",
        weight: "11.6 oz",
        stack: "28/22mm",
        drop: "6mm",
        lug: "4mm",
        midsole: "Compression-molded EVA",
        outsole: "FriXion AT",
        rockPlate: true,
        widths: "Regular",
        ratings: { cushioning: 3, traction: 5, durability: 5, groundFeel: 5, breathability: 3 },
        bestFor: ["Hardrock 100", "UTMB", "High-altitude scree and technical terrain"],
        pros: ["Gaiter attachment system", "FriXion AT on wet alpine rock", "Exceptional toe protection", "Rock plate for scree"],
        cons: ["Heavy", "Not ideal for smooth trails", "Warm in hot conditions"],
        review: {
          quote: "Hardrock is essentially a mountain climbing race. The Ultra Raptor is the only shoe I trust on the Grouse-Ouray section.",
          race: "Hardrock 100",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Tecton X2",
        brand: "Hoka",
        price: "$225",
        weight: "9.5 oz",
        stack: "38/30mm",
        drop: "8mm",
        lug: "4mm",
        midsole: "ProFly X with dual carbon plates",
        outsole: "Vibram Megagrip",
        rockPlate: true,
        widths: "Regular",
        ratings: { cushioning: 5, traction: 5, durability: 4, groundFeel: 3, breathability: 4 },
        bestFor: ["Mixed mountain terrain", "Runners wanting max cushion + mountain grip", "Technical 100K/100M"],
        pros: ["Two carbon fiber plates for explosive climbing", "Max cushion for descents", "Vibram Megagrip on alpine terrain", "Surprisingly lightweight"],
        cons: ["Premium price", "High stack can feel unstable on off-camber", "Requires break-in on technical ground"],
        review: {
          quote: "The uphills felt effortless and the descents didn't destroy my quads. It's the future of mountain ultra footwear.",
          race: "Transvulcania",
          runner: "Elite finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Golden Gate ATR",
        brand: "Scarpa",
        price: "$200",
        weight: "10.2 oz",
        stack: "30/24mm",
        drop: "6mm",
        lug: "4mm",
        midsole: "Responsive EVA",
        outsole: "SILV-R rubber",
        rockPlate: false,
        widths: "Regular",
        ratings: { cushioning: 3, traction: 5, durability: 5, groundFeel: 5, breathability: 4 },
        bestFor: ["Alpine races", "Wet technical terrain", "Runners valuing ground feel"],
        pros: ["Italian mountain craftsmanship", "Excellent durability", "SILV-R rubber excels on wet rock", "Natural flex"],
        cons: ["Less cushion than Hoka", "Limited availability", "Not beginner-friendly"],
        review: {
          quote: "Built like a mountaineering boot but runs like a trail shoe. Scarpa nailed it.",
          race: "Lavaredo Ultra Trail",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
    ],
  },
];

const shoesItemListJsonLd = itemListJsonLd({
  name: "Trail running shoes for ultra marathons",
  description:
    "Compare top trail shoes by terrain, cushion, and drop — expert picks for 50K through 100 miles.",
  url: `${SITE_URL}/gear/shoes`,
  items: categories.flatMap((cat) =>
    cat.shoes.map((shoe) => ({
      name: `${shoe.brand} ${shoe.name}`,
      url: `${SITE_URL}/gear/shoes#${gearProductAnchorId(cat.id, shoe.brand, shoe.name)}`,
      description: shoe.bestFor.join(", "),
    }))
  ),
});

const shoesFaqEntries = [
  {
    q: "How many pairs of shoes should I own?",
    a: "For 100-mile training, 3–4 pairs is ideal. At minimum, have a cushioned trainer for long days and a technical shoe for grip-demanding terrain. Multiple pairs also extends each shoe's lifespan by allowing midsole decompression between runs.",
  },
  {
    q: "When should I buy new shoes before a race?",
    a: "6–8 weeks out is the sweet spot. That gives you enough time to break them in properly (50–100 miles) without racing in fresh-out-of-the-box shoes. Never debut shoes on race day.",
  },
  {
    q: "Can I use road shoes for trail ultras?",
    a: "For groomed trail 50Ks, possibly. But for anything technical, you'll want trail-specific grip and a rock plate. Road shoes on wet roots and rock are a DNF waiting to happen.",
  },
  {
    q: "What's the best shoe for Western States? UTMB? Hardrock?",
    a: "Western States: Hoka Speedgoat 6 or Altra Lone Peak 8 — you'll want cushion and versatile traction across canyons and high country. UTMB: Salomon S/Lab Ultra 3 or La Sportiva Ultra Raptor II — technical European trails demand secure fit. Hardrock: La Sportiva Ultra Raptor II — it's essentially a mountain race and demands the most specialized footwear.",
  },
  {
    q: "Zero drop vs traditional drop for ultras?",
    a: "There's no universal answer. Zero drop (Altra) promotes natural mechanics but requires a long adaptation period. Traditional 6–8mm drop is easier to transition from road running. Many elite runners thrive on both. Choose based on your history, not hype.",
  },
  {
    q: "Should I size up for 100-milers?",
    a: "Yes — at least 0.5 size, ideally a full size. Feet swell significantly over 20+ hours. A shoe that fits perfectly fresh out of the box at mile 0 will feel like a vice grip at mile 70.",
  },
  {
    q: "Are carbon plate shoes worth it for ultras?",
    a: "For uphills, yes — the propulsive efficiency of carbon plates like in the Hoka Tecton X2 is real. For 100-mile events, the energy return helps on climbs. However, they require adaptation and offer less ground feel on technical terrain. Best for runners already comfortable in maximalist shoes.",
  },
  {
    q: "How do I prevent blisters with new shoes?",
    a: "Wear your race socks when fitting. Break shoes in gradually over 50–100 miles. Use anti-chafe balm (Body Glide, Squirrel's Nut Butter) on hot spots. Consider double-sock systems for 100-mile efforts. Address any fit issue in training — never assume it will resolve on race day.",
  },
];

const shoesFaqJsonLd = faqPageJsonLd(
  shoesFaqEntries.map((item) => ({ question: item.q, answer: item.a }))
);

// ─── Sub-Components ────────────────────────────────────────────────────────────

function RatingBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-4 rounded-full ${i < value ? "bg-primary" : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

function ShoeCard({
  shoe,
  categoryColor,
  id,
}: {
  shoe: Shoe;
  categoryColor: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all overflow-hidden flex flex-col scroll-mt-24"
    >
      {/* Image placeholder */}
      <div className="bg-gray-50 aspect-[4/3] flex items-center justify-center border-b border-gray-100">
        <div className="text-center">
          <div className="mb-1"><Footprints className="w-10 h-10 text-gray" /></div>
          <p className="text-xs text-gray">{shoe.brand} {shoe.name}</p>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor}`}>{shoe.brand}</span>
          <h3 className="font-headline font-bold text-dark text-lg mt-2 leading-tight">{shoe.name}</h3>
          <p className="text-accent font-bold text-sm mt-0.5">{shoe.price}</p>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray mb-4 border-t border-b border-gray-100 py-3">
          <span>Weight: <strong className="text-dark">{shoe.weight}</strong></span>
          <span>Drop: <strong className="text-dark">{shoe.drop}</strong></span>
          <span>Stack: <strong className="text-dark">{shoe.stack}</strong></span>
          <span>Widths: <strong className="text-dark">{shoe.widths}</strong></span>
          <span>Outsole: <strong className="text-dark">{shoe.outsole}</strong></span>
          <span>Rock plate: <strong className="text-dark">{shoe.rockPlate ? "Yes" : "No"}</strong></span>
        </div>

        {/* Ratings */}
        <div className="space-y-1.5 mb-4">
          {(
            [
              ["Cushioning", shoe.ratings.cushioning],
              ["Traction", shoe.ratings.traction],
              ["Durability", shoe.ratings.durability],
              ["Breathability", shoe.ratings.breathability],
              ["Ground Feel", shoe.ratings.groundFeel],
            ] as [string, number][]
          ).map(([label, val]) => (
            <div key={label} className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray w-24 shrink-0">{label}</span>
              <RatingBar value={val} />
            </div>
          ))}
        </div>

        {/* Best for */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-dark mb-1">Best for</p>
          <div className="flex flex-wrap gap-1">
            {shoe.bestFor.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        {/* Pros/Cons */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <p className="font-semibold text-dark mb-1">Pros</p>
            <ul className="space-y-0.5">
              {shoe.pros.slice(0, 3).map((p) => (
                <li key={p} className="text-gray flex gap-1"><span className="text-green-500 shrink-0">+</span>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-dark mb-1">Cons</p>
            <ul className="space-y-0.5">
              {shoe.cons.map((c) => (
                <li key={c} className="text-gray flex gap-1"><span className="text-red-400 shrink-0">−</span>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Runner review */}
        <blockquote className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray italic flex-1">
          &ldquo;{shoe.review.quote}&rdquo;
          <footer className="not-italic font-semibold text-dark mt-1">{shoe.review.runner} · {shoe.review.race}</footer>
        </blockquote>

        {/* Affiliate links */}
        <div className="flex gap-2 flex-wrap mt-auto">
          {[
            ["REI", shoe.affiliates.rei],
            ["Amazon", shoe.affiliates.amazon],
            ["Running Warehouse", shoe.affiliates.warehouse],
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

export default function ShoesPage() {
  return (
    <>
      <Header />
      <JsonLd data={[shoesItemListJsonLd, shoesFaqJsonLd]} />

      <main>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              Gear Guide
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">
              Ultra Marathon Running<br className="hidden sm:block" /> Shoes Guide
            </h1>
            <p className="text-xl text-gray max-w-2xl mx-auto mb-4">
              Find the perfect shoe for your terrain, distance, and running style.
            </p>
            <p className="text-base text-gray max-w-2xl mx-auto">
              Your shoes are the only piece of gear between you and the earth for every single step of a 100-mile race.
              The right shoe prevents blisters, saves your knees on descents, and keeps you moving when everything else
              wants to stop. No single shoe is perfect for everyone — but one is right for you.
            </p>
            {/* Nav pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {categories.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium"
                >
                  {c.title}
                </a>
              ))}
              <a href="#technology" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">
                Technology
              </a>
              <a href="#fitting" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">
                Fitting Guide
              </a>
              <a href="#faq" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">
                FAQ
              </a>
            </div>
          </div>
        </section>

        {/* ── Shoe Finder ── */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-headline text-3xl font-bold text-dark mb-3">Not Sure Where to Start?</h2>
              <p className="text-gray">Answer 4 questions and we&apos;ll point you to the right shoe.</p>
            </div>
            <ShoeFinder />
          </div>
        </section>

        {/* ── Shoe Categories ── */}
        {categories.map((cat, catIdx) => (
          <section
            key={cat.id}
            id={cat.id}
            className={`py-16 bg-gradient-to-b ${catIdx % 2 === 0 ? cat.color : "from-white to-light"}`}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${cat.badgeColor}`}>
                  {cat.stackNote}
                </span>
                <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-2">{cat.title}</h2>
                <p className="text-accent font-semibold text-sm mb-3">{cat.subtitle}</p>
                <p className="text-gray max-w-2xl">{cat.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.shoes.map((shoe) => (
                  <ShoeCard
                    key={`${cat.id}-${shoe.brand}-${shoe.name}`}
                    id={gearProductAnchorId(cat.id, shoe.brand, shoe.name)}
                    shoe={shoe}
                    categoryColor={cat.badgeColor}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── Technology ── */}
        <section id="technology" className="py-16 bg-dark text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold mb-4">Shoe Technology Explained</h2>
              <p className="text-gray-400 max-w-xl mx-auto">Know what you&apos;re buying before you spend $200 on a shoe.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Circle className="w-5 h-5 text-yellow-500" />,
                  title: "Midsole Materials",
                  items: [
                    { name: "EVA", desc: "Traditional foam. Durable, consistent, affordable. Hoka ProFly is EVA-based." },
                    { name: "PEBA", desc: "Lightweight, super-responsive. Used in Nike ZoomX and Saucony PWRRUN PB. Less durable." },
                    { name: "TPU", desc: "Bouncy, resilient. Great energy return. Used in Adidas Boost." },
                    { name: "PEBA + Carbon", desc: "The performance combo: carbon plate + PEBA = maximum propulsion. Saucony Endorphin Edge, Hoka Tecton X2." },
                  ],
                },
                {
                  icon: <Circle className="w-5 h-5 text-gray-700" />,
                  title: "Outsole Rubber",
                  items: [
                    { name: "Vibram Megagrip", desc: "The gold standard. Sticky on wet rock. Used by Hoka, Topo, Inov-8." },
                    { name: "Contagrip", desc: "Salomon's proprietary compound. Excellent all-conditions grip." },
                    { name: "FriXion AT", desc: "La Sportiva's mountain rubber. Outstanding on wet alpine rock." },
                    { name: "TrailTack", desc: "Saucony's sticky compound. Great versatility on mixed terrain." },
                  ],
                },
                {
                  icon: <Settings className="w-5 h-5 text-gray-500" />,
                  title: "Plate Systems",
                  items: [
                    { name: "Carbon Fiber", desc: "Stiff, propulsive. Helps push-off efficiency. Great for uphills (Hoka Tecton X2)." },
                    { name: "Nylon Rock Plate", desc: "Flexible protection from sharp rocks. Standard in technical trail shoes." },
                    { name: "No Plate", desc: "More natural ground feel. Suitable for non-rocky terrain or minimalist runners." },
                    { name: "Race Regulations", desc: "Some races have stack height limits (UTMB: 40mm max). Check before race day." },
                  ],
                },
                {
                  icon: <Ruler className="w-5 h-5 text-primary" />,
                  title: "Drop & Stack Height",
                  items: [
                    { name: "0mm (Zero Drop)", desc: "Heel and forefoot at same height. Promotes midfoot strike. Altra signature." },
                    { name: "4–6mm", desc: "Low drop. Balance of natural feel and transition ease. Common in Hoka trail shoes." },
                    { name: "8–12mm", desc: "Traditional drop. Familiar for road runners. Easier transition from road shoes." },
                    { name: "Transitioning", desc: "Going lower in drop? Reduce by 2–4mm at a time. Give your calves 6+ weeks to adapt." },
                  ],
                },
              ].map((block) => (
                <div key={block.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="mb-3">{block.icon}</div>
                  <h3 className="font-headline font-bold text-white text-lg mb-4">{block.title}</h3>
                  <div className="space-y-3">
                    {block.items.map((item) => (
                      <div key={item.name}>
                        <p className="text-sm font-semibold text-primary">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Shoe Rotation Strategy ── */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Shoe Rotation Strategy</h2>
              <p className="text-gray max-w-xl mx-auto">
                The best ultra runners don&apos;t train in one shoe. A 3–4 shoe rotation extends lifespan, reduces injury risk, and matches the right tool to the workout.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {[
                { icon: <Dumbbell className="w-5 h-5 text-primary" />, role: "Easy / Long Runs", rec: "Max cushion shoe", why: "Protect your legs on high-mileage days. Comfort over speed.", example: "Hoka Speedgoat 6" },
                { icon: <Zap className="w-5 h-5 text-accent" />, role: "Workouts / Tempos", rec: "Lightweight racer", why: "Responsive feel encourages proper form at faster paces.", example: "Salomon S/Lab Ultra 3" },
                { icon: <Mountain className="w-5 h-5 text-primary" />, role: "Technical Trail", rec: "Technical specialist", why: "Match grip to the terrain. Don't fight the trail.", example: "La Sportiva Bushido III" },
                { icon: <BedDouble className="w-5 h-5 text-blue-500" />, role: "Recovery Runs", rec: "Plush trainer", why: "Fresh midsole = fresh legs. Let yesterday's shoe recover too.", example: "Altra Olympus 5" },
              ].map((slot) => (
                <div key={slot.role} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="text-2xl mb-2">{slot.icon}</div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">{slot.role}</p>
                  <p className="font-headline font-bold text-dark mb-2">{slot.rec}</p>
                  <p className="text-xs text-gray mb-3">{slot.why}</p>
                  <p className="text-xs font-semibold text-dark">e.g. {slot.example}</p>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
              <h3 className="font-headline font-bold text-dark text-xl mb-4">Sample Rotations by Race Distance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    distance: "50K Training",
                    pairs: ["Max cushion trainer (easy days)", "Lightweight racer (workouts)", "Technical shoe (trail days)"],
                  },
                  {
                    distance: "100-Mile Training",
                    pairs: ["Max cushion (long runs)", "Moderate cushion (medium efforts)", "Technical specialist (mountain runs)", "Race-day shoe (final tune-up)"],
                  },
                  {
                    distance: "Multi-Surface",
                    pairs: ["Road hybrid (pavement/easy trail)", "Aggressive traction (wet/muddy)", "Wide toe box (100M race day)"],
                  },
                ].map((rotation) => (
                  <div key={rotation.distance}>
                    <p className="font-semibold text-dark mb-2">{rotation.distance}</p>
                    <ul className="space-y-1">
                      {rotation.pairs.map((p) => (
                        <li key={p} className="text-sm text-gray flex gap-2">
                          <span className="text-primary">→</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Fitting Guide ── */}
        <section id="fitting" className="py-16 bg-light">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Shoe Fitting Guide</h2>
              <p className="text-gray max-w-xl mx-auto">A shoe that doesn&apos;t fit right will ruin your race. Get sizing right before training starts.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Sizing for Ultras",
                  icon: <Ruler className="w-5 h-5 text-primary" />,
                  tips: [
                    "Go up 0.5–1 full size for races over 50 miles",
                    "Feet swell up to a full size on long runs",
                    "Thumb's width between longest toe and shoe tip",
                    "Try on shoes at the end of the day (feet are largest then)",
                    "Wear your race socks when fitting",
                  ],
                },
                {
                  title: "Width Considerations",
                  icon: <ArrowLeftRight className="w-5 h-5 text-primary" />,
                  tips: [
                    "Altra: naturally wide toe box in regular width",
                    "Salomon: runs narrow — size up or go wide",
                    "Hoka: medium width, wide option available",
                    "Signs too narrow: black toenails, blisters on ball of foot, cramped toes",
                    "Signs too wide: heel slip, blisters on heel",
                  ],
                },
                {
                  title: "Break-In & Retirement",
                  icon: <RefreshCcw className="w-5 h-5 text-primary" />,
                  tips: [
                    "Never race in brand new shoes",
                    "Allow 50–100 miles of break-in before a big race",
                    "Trail shoes: replace at 250–400 miles",
                    "Press test: push thumb into midsole — if it bottoms out easily, replace",
                    "Increased aches or joint pain = worn-out midsole",
                  ],
                },
              ].map((section) => (
                <div key={section.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-2xl mb-3">{section.icon}</div>
                  <h3 className="font-headline font-bold text-dark text-lg mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.tips.map((tip) => (
                      <li key={tip} className="text-sm text-gray flex gap-2">
                        <span className="text-primary shrink-0 mt-0.5">→</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Terrain Recommendations ── */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Terrain-Specific Recommendations</h2>
              <p className="text-gray max-w-xl mx-auto">Different courses demand different tools. Here&apos;s what to wear where.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-semibold text-dark">Terrain / Region</th>
                    <th className="text-left px-5 py-3 font-semibold text-dark">Conditions</th>
                    <th className="text-left px-5 py-3 font-semibold text-dark">Top Picks</th>
                    <th className="text-left px-5 py-3 font-semibold text-dark">Key Feature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { terrain: "Pacific Northwest", conditions: "Mud, roots, rain, wet rock", picks: "Speedcross 6, Bushido III, Mudclaw G 260", feature: "Deep lugs + sticky wet-rock rubber" },
                    { terrain: "Rocky Mountain / Hardrock", conditions: "Scree, talus, snow, steep descent", picks: "Ultra Raptor II, Tecton X2, Timp 5", feature: "Rock plate + toe protection + gaiter tabs" },
                    { terrain: "Desert Southwest", conditions: "Dry, sandy, hot, loose gravel", picks: "Lone Peak 8, Olympus 5, Superior 6", feature: "Breathability + drainage + wider fit" },
                    { terrain: "Eastern Hardpack", conditions: "Smooth buff trail, occasional roots", picks: "Peregrine 14, Terraventure 4, S/Lab Ultra 3", feature: "Moderate lug + lightweight build" },
                    { terrain: "Alpine / UTMB", conditions: "Mixed: rock, snow, technical, road", picks: "Ultra Raptor II, Golden Gate ATR, Tecton X2", feature: "Gaiter compatible + sticky alpine rubber" },
                  ].map((row, i) => (
                    <tr key={row.terrain} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-5 py-3 font-semibold text-dark">{row.terrain}</td>
                      <td className="px-5 py-3 text-gray">{row.conditions}</td>
                      <td className="px-5 py-3 text-primary font-medium">{row.picks}</td>
                      <td className="px-5 py-3 text-gray">{row.feature}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-16 bg-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {shoesFaqEntries.map((item) => (
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
              We only recommend gear we&apos;ve researched and trust for ultra running.
            </p>
          </div>
        </section>
        <FAQSection
          faqs={faqs.filter(f => ["what-shoes-for-first-ultra", "trail-socks", "trekking-poles"].includes(f.id))}
          title="Common Questions About Trail Running Shoes"
        />
      </main>

      <Footer />
    </>
  );
}
