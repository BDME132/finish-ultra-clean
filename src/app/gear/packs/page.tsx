import React from "react";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import VestFinder from "./VestFinder";
import {
  faqPageJsonLd,
  gearProductAnchorId,
  itemListJsonLd,
  SITE_URL,
} from "@/lib/schema";
import {
  Package, Cloud, Moon, Sun, Snowflake, CloudRain, AlertTriangle,
  Ruler, Tag, PersonStanding, Wrench, Shirt, RefreshCcw, MapPin, Scale,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ultra Marathon Hydration Packs & Running Vests Guide | FinishUltra",
  description:
    "Find the perfect hydration vest or running pack for your ultra marathon. Compare top vests by capacity, fit, and distance — from 50K race vests to 100-mile expedition packs.",
  alternates: { canonical: "/gear/packs" },
};

// ─── Types ───────────────────────────────────────────────────────────────────

type Rating = {
  comfort: number;
  bounce: number;
  breathability: number;
  loadDistribution: number;
  easeOfAccess: number;
  durability: number;
};

type Vest = {
  name: string;
  brand: string;
  price: string;
  weight: string;
  capacity: string;
  sizes: string;
  genderFit: string;
  frontPockets: string;
  backStorage: string;
  hydrationSystem: string;
  poleCarry: boolean;
  whistle: boolean;
  bladderCompatible: boolean;
  includedFlasks: string;
  ratings: Rating;
  bestFor: string[];
  distances: string[];
  pros: string[];
  cons: string[];
  review: { quote: string; race: string; runner: string };
  affiliates: { rei: string; amazon: string; warehouse: string };
};

// ─── Category Data ────────────────────────────────────────────────────────────

const categories: {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  badgeColor: string;
  description: string;
  capacityNote: string;
  vests: Vest[];
}[] = [
  {
    id: "race",
    title: "Race Vests",
    subtitle: "Best for 50K–50M, minimal gear requirements, race-day speed",
    color: "from-blue-50 to-white",
    badgeColor: "bg-blue-100 text-blue-800",
    capacityNote: "Capacity: 5–8L",
    description:
      "Lean, fast, and body-hugging. Race vests prioritize minimal bounce and quick access over raw storage. Perfect when aid stations are frequent and mandatory gear is light.",
    vests: [
      {
        name: "ADV Skin 5 Set",
        brand: "Salomon",
        price: "$160",
        weight: "161g",
        capacity: "5L",
        sizes: "XS–XL",
        genderFit: "Unisex",
        frontPockets: "4 front pockets + 2 soft flask pockets",
        backStorage: "3L main + 2L extra",
        hydrationSystem: "2× 500ml soft flasks included",
        poleCarry: true,
        whistle: true,
        bladderCompatible: true,
        includedFlasks: "2× 500ml",
        ratings: { comfort: 5, bounce: 5, breathability: 5, loadDistribution: 4, easeOfAccess: 5, durability: 4 },
        bestFor: ["50K race day", "Fast 50M efforts", "Minimalist training"],
        distances: ["50K", "50 Miles"],
        pros: [
          "SensiFit body-hugging design eliminates bounce entirely",
          "Two 500ml flasks included — ready to run out of the box",
          "16 pockets in a 5L vest — exceptional organization",
          "Pole carry stow-on-the-go system",
        ],
        cons: [
          "Very snug fit — not comfortable for larger chest/shoulder runners",
          "5L is limiting for races with extensive mandatory gear",
        ],
        review: {
          quote: "I've done 12 ultras in the ADV Skin 5. It disappears on my body — I literally forget it's there at mile 40.",
          race: "UTMB OCC",
          runner: "Verified 50K finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Race Vest 6.0",
        brand: "Ultimate Direction",
        category: "race",
        price: "$130",
        weight: "185g",
        capacity: "6L",
        sizes: "XS–XL",
        genderFit: "Unisex (Women's version available)",
        frontPockets: "Kangaroo pouch + 2 flask pockets",
        backStorage: "4L main compartment",
        hydrationSystem: "Compatible with 2L bladder or soft flasks",
        poleCarry: true,
        whistle: true,
        bladderCompatible: true,
        includedFlasks: "None (sold separately)",
        ratings: { comfort: 4, bounce: 4, breathability: 4, loadDistribution: 4, easeOfAccess: 5, durability: 4 },
        bestFor: ["Versatile 50K-50M", "Runners preferring kangaroo-style access", "Value-conscious racers"],
        distances: ["50K", "50 Miles"],
        pros: [
          "Comfort Cinch straps self-adjust mid-run",
          "Large kangaroo front pocket fits phone, gels, jacket",
          "Best value race vest on the market",
          "Excellent fit range across body types",
        ],
        cons: [
          "No flasks included",
          "Back panel less breathable than Salomon",
          "Pole stowage system less refined",
        ],
        review: {
          quote: "The kangaroo pocket is game-changing. Everything I need is one motion away — no fumbling at aid stations.",
          race: "Lake Sonoma 50",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      } as unknown as Vest,
      {
        name: "Slope Runner 8L",
        brand: "Patagonia",
        price: "$149",
        weight: "220g",
        capacity: "8L",
        sizes: "XS–XL",
        genderFit: "Unisex (Women's version available)",
        frontPockets: "2 front stretch pockets + 2 zip pockets",
        backStorage: "6L main compartment",
        hydrationSystem: "Bladder sleeve + 2 soft flask compatible",
        poleCarry: false,
        whistle: false,
        bladderCompatible: true,
        includedFlasks: "None",
        ratings: { comfort: 4, bounce: 4, breathability: 4, loadDistribution: 4, easeOfAccess: 4, durability: 5 },
        bestFor: ["Eco-conscious runners", "50K to 100K", "Training and racing versatility"],
        distances: ["50K", "50 Miles", "100K"],
        pros: [
          "Made with recycled materials — Patagonia's sustainability commitment",
          "8L hits the sweet spot for most ultra distances",
          "Exceptional build quality and durability",
          "Clean, uncluttered design",
        ],
        cons: [
          "No pole carry system",
          "No whistle included",
          "Fewer pockets than Salomon or UD",
        ],
        review: {
          quote: "I've washed this thing 50 times and it still looks new. Patagonia builds things to last — and that matters for a vest I wear hundreds of miles.",
          race: "Miwok 100K",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Pinnacle 4L",
        brand: "Nathan",
        price: "$120",
        weight: "198g",
        capacity: "4L",
        sizes: "XS–XL",
        genderFit: "Unisex",
        frontPockets: "2 angled Exoshot flask pockets + 1 zip pocket",
        backStorage: "2L main + 2L side",
        hydrationSystem: "2× 20oz Exoshot flasks included",
        poleCarry: false,
        whistle: true,
        bladderCompatible: false,
        includedFlasks: "2× 20oz Exoshot",
        ratings: { comfort: 4, bounce: 5, breathability: 5, loadDistribution: 3, easeOfAccess: 5, durability: 4 },
        bestFor: ["Supported 50Ks", "Minimalist racers", "Warm weather events"],
        distances: ["50K"],
        pros: [
          "Angled Exoshot flask holders make drinking completely natural",
          "Featherlight at 198g",
          "Excellent breathability for hot weather racing",
          "Included flasks make it great out of the box value",
        ],
        cons: [
          "4L is strictly for short, supported races",
          "No bladder compatibility limits hydration options",
          "Limited pole carry",
        ],
        review: {
          quote: "For supported 50Ks in hot weather, nothing comes close. The angled flasks are the best drinking system I've used.",
          race: "Javelina 50K",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
    ],
  },
  {
    id: "allround",
    title: "All-Around Training & Racing Vests",
    subtitle: "Best for 50M–100K, versatile for both training and race day",
    color: "from-green-50 to-white",
    badgeColor: "bg-green-100 text-green-800",
    capacityNote: "Capacity: 8–12L",
    description:
      "The do-everything vests. Enough capacity for 100K mandatory gear, comfortable enough for daily training, and light enough that you won't notice the weight difference on race day.",
    vests: [
      {
        name: "ADV Skin 12 Set",
        brand: "Salomon",
        price: "$200",
        weight: "280g",
        capacity: "12L",
        sizes: "XS–XL",
        genderFit: "Unisex (Women's version available)",
        frontPockets: "6 front pockets + 2 flask sleeves",
        backStorage: "6L main + 4L extra + 2 side pockets",
        hydrationSystem: "2× 500ml flasks included + 2L bladder compatible",
        poleCarry: true,
        whistle: true,
        bladderCompatible: true,
        includedFlasks: "2× 500ml",
        ratings: { comfort: 5, bounce: 5, breathability: 4, loadDistribution: 5, easeOfAccess: 5, durability: 5 },
        bestFor: ["50M to 100M races", "UTMB mandatory gear", "High-volume training"],
        distances: ["50 Miles", "100K", "100 Miles"],
        pros: [
          "The most trusted vest in ultra running — worn by more elites than any other",
          "12L with SensiFit still feels like a race vest",
          "20+ pockets with logical organization system",
          "Stow-on-the-go pole carry works flawlessly",
          "Included 500ml flasks are excellent quality",
        ],
        cons: [
          "Premium price at $200",
          "Salomon's sizing runs very snug — try before buying",
        ],
        review: {
          quote: "The ADV Skin 12 has been on my back for four Western States, two UTMBs, and countless training runs. It just works.",
          race: "UTMB",
          runner: "Verified multi-100 finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Duro 6 / Dyna 6",
        brand: "Osprey",
        price: "$140",
        weight: "312g",
        capacity: "6L",
        sizes: "XS–XL",
        genderFit: "Men's (Duro) / Women's (Dyna)",
        frontPockets: "2 front stretch pockets",
        backStorage: "4L main + bladder sleeve",
        hydrationSystem: "2.5L Hydraulics reservoir included",
        poleCarry: false,
        whistle: false,
        bladderCompatible: true,
        includedFlasks: "None (2.5L bladder included)",
        ratings: { comfort: 4, bounce: 4, breathability: 5, loadDistribution: 4, easeOfAccess: 3, durability: 5 },
        bestFor: ["Training runs", "50K to 50M", "Runners preferring bladder hydration"],
        distances: ["50K", "50 Miles"],
        pros: [
          "AirScape back panel is the most breathable in this category",
          "Lifetime warranty — Osprey will repair or replace forever",
          "Gender-specific fit is genuinely better for both men and women",
          "Excellent durability reputation",
        ],
        cons: [
          "Bladder-focused design means front flask access is secondary",
          "No pole carry system",
          "Heavier than Salomon or UD equivalents",
        ],
        review: {
          quote: "The Dyna fits my chest properly — first vest that doesn't gap or slip. Osprey's women's-specific design is real, not just marketing.",
          race: "Black Hills 50K",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "VaporKrar 12L",
        brand: "Nathan",
        price: "$160",
        weight: "290g",
        capacity: "12L",
        sizes: "XS–XL",
        genderFit: "Unisex (Women's version available)",
        frontPockets: "2 wide front pockets + 2 zip pockets",
        backStorage: "8L main compartment",
        hydrationSystem: "Compatible with flasks + 2L bladder",
        poleCarry: true,
        whistle: true,
        bladderCompatible: true,
        includedFlasks: "None",
        ratings: { comfort: 4, bounce: 4, breathability: 4, loadDistribution: 4, easeOfAccess: 5, durability: 4 },
        bestFor: ["100K to 100M with mandatory gear", "Runners needing wide pockets", "High nutrition access priority"],
        distances: ["50 Miles", "100K", "100 Miles"],
        pros: [
          "Rob Krar designed — optimized for 100-mile racing demands",
          "Wide front pockets fit larger phones and more nutrition",
          "12L handles most race mandatory gear requirements",
          "Good value vs. Salomon at similar capacity",
        ],
        cons: [
          "Flasks not included",
          "Fit is looser than Salomon — can bounce more if not dialed",
          "Pole carry less secure than Black Diamond",
        ],
        review: {
          quote: "Rob Krar races Hardrock in this thing. That's all the endorsement I need. Front pockets fit everything I need for a 100-mile push.",
          race: "Cascade Crest 100",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Distance 8",
        brand: "Black Diamond",
        price: "$130",
        weight: "248g",
        capacity: "8L",
        sizes: "S–XL",
        genderFit: "Unisex",
        frontPockets: "2 front stretch pockets + 2 zip pockets",
        backStorage: "6L main + side pockets",
        hydrationSystem: "Bladder sleeve + soft flask compatible",
        poleCarry: true,
        whistle: false,
        bladderCompatible: true,
        includedFlasks: "None",
        ratings: { comfort: 4, bounce: 4, breathability: 4, loadDistribution: 5, easeOfAccess: 4, durability: 5 },
        bestFor: ["Mountain ultras", "Trekking pole users", "Technical terrain races"],
        distances: ["50K", "50 Miles", "100K"],
        pros: [
          "Best trekking pole carry system in the category — Z-pole compatible",
          "Alpine-grade durability from BD's mountaineering heritage",
          "Excellent load distribution for heavier packs",
          "Best value at $130 for the features offered",
        ],
        cons: [
          "Less organized pocket system than Salomon",
          "No whistle included",
          "Less body-hugging than ADV Skin series",
        ],
        review: {
          quote: "I carry poles for every mountain ultra. The BD Distance 8 is the only vest where I can grab and stow poles without stopping.",
          race: "Waldo 100K",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
    ],
  },
  {
    id: "expedition",
    title: "Expedition / 100-Mile Vests",
    subtitle: "Best for 100M, multi-day, self-supported, heavy mandatory gear",
    color: "from-red-50 to-white",
    badgeColor: "bg-red-100 text-red-800",
    capacityNote: "Capacity: 12L+",
    description:
      "When your race demands a bivy, rain jacket, emergency kit, night gear, and two days of nutrition, you need real capacity. These vests carry it all without sacrificing the running vest form factor.",
    vests: [
      {
        name: "ADV Skin 18 Set",
        brand: "Salomon",
        price: "$230",
        weight: "390g",
        capacity: "18L",
        sizes: "XS–XL",
        genderFit: "Unisex (Women's version available)",
        frontPockets: "6 front pockets + 2 flask sleeves",
        backStorage: "12L main + 6L extra pockets",
        hydrationSystem: "2× 500ml flasks included + 3L bladder compatible",
        poleCarry: true,
        whistle: true,
        bladderCompatible: true,
        includedFlasks: "2× 500ml",
        ratings: { comfort: 4, bounce: 5, breathability: 4, loadDistribution: 5, easeOfAccess: 5, durability: 5 },
        bestFor: ["UTMB mandatory gear", "100-mile self-supported", "Alpine racing"],
        distances: ["100K", "100 Miles", "Multi-day"],
        pros: [
          "18L that still runs like a race vest — remarkable engineering",
          "Handles full UTMB mandatory gear list with room to spare",
          "SensiFit scales to larger loads without bounce",
          "Comprehensive pole carry system",
          "Included 500ml flasks are top quality",
        ],
        cons: [
          "Premium $230 price tag",
          "18L feels excessive for anything shorter than 100K",
          "Heavy when fully loaded — expect to notice it at mile 80",
        ],
        review: {
          quote: "UTMB's mandatory gear list is brutal. The ADV Skin 18 is one of the only vests that fits it all and still lets me run properly.",
          race: "UTMB",
          runner: "Verified UTMB finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Fastpack 25",
        brand: "Ultimate Direction",
        price: "$200",
        weight: "560g",
        capacity: "25L",
        sizes: "XS–XL",
        genderFit: "Unisex",
        frontPockets: "2 front pockets + 2 zip pockets",
        backStorage: "20L main + side pockets",
        hydrationSystem: "2L bladder compatible + flask pockets",
        poleCarry: true,
        whistle: true,
        bladderCompatible: true,
        includedFlasks: "None",
        ratings: { comfort: 3, bounce: 3, breathability: 3, loadDistribution: 5, easeOfAccess: 4, durability: 5 },
        bestFor: ["Multi-day stage races", "Self-supported expeditions", "Races with overnight gear"],
        distances: ["100 Miles", "Multi-day"],
        pros: [
          "25L genuinely accommodates sleeping gear for stage races",
          "Exceptional load distribution for heavy packs",
          "UD's durability is industry-leading",
          "Compression system keeps load stable at speed",
        ],
        cons: [
          "560g is heavy compared to race vests",
          "Overkill for single-day 100-milers with crew",
          "Noticeably more bounce than smaller vests when full",
        ],
        review: {
          quote: "PTL requires carrying a sleeping bag, bivy, and two days of food. The Fastpack 25 is the only running vest that actually works for that.",
          race: "Petite Trotte à Léon (PTL)",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "Revolutiv 18L",
        brand: "Raidlight",
        price: "$180",
        weight: "350g",
        capacity: "18L",
        sizes: "XS–XL",
        genderFit: "Unisex (Women's version available)",
        frontPockets: "4 front pockets + 2 flask pockets",
        backStorage: "12L main + 4 external pockets",
        hydrationSystem: "2 soft flasks + 2L bladder compatible",
        poleCarry: true,
        whistle: true,
        bladderCompatible: true,
        includedFlasks: "2× 600ml",
        ratings: { comfort: 4, bounce: 4, breathability: 4, loadDistribution: 5, easeOfAccess: 4, durability: 4 },
        bestFor: ["UTMB-style mandatory gear races", "Alpine racing", "European ultra circuit"],
        distances: ["100K", "100 Miles"],
        pros: [
          "French brand built for UTMB — knows mandatory gear demands inside out",
          "18L at 350g is excellent weight-to-capacity ratio",
          "Waterproof back pocket for electronics",
          "Excellent pole carry optimized for alpine terrain",
        ],
        cons: [
          "Less widely available outside Europe",
          "Fit can be inconsistent across sizes",
          "Less brand recognition means less resale value",
        ],
        review: {
          quote: "Raidlight built this vest for the UTMB circuit. It shows — every pocket placement makes sense when you're navigating mandatory gear requirements.",
          race: "CCC",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
    ],
  },
  {
    id: "minimalist",
    title: "Minimalist Race Vests",
    subtitle: "Best for supported 50Ks, elite racers, ultra-light approaches",
    color: "from-purple-50 to-white",
    badgeColor: "bg-purple-100 text-purple-800",
    capacityNote: "Capacity: Under 5L",
    description:
      "When mandatory gear is minimal and aid stations are frequent, carry only what you need. These vests are the difference between running and hauling — barely there, never noticed.",
    vests: [
      {
        name: "Pulse 2 Set",
        brand: "Salomon",
        price: "$80",
        weight: "100g",
        capacity: "2L",
        sizes: "XS–XL",
        genderFit: "Unisex",
        frontPockets: "2 flask pockets + 1 small zip",
        backStorage: "1L back pocket",
        hydrationSystem: "2× 500ml flasks included",
        poleCarry: false,
        whistle: false,
        bladderCompatible: false,
        includedFlasks: "2× 500ml",
        ratings: { comfort: 5, bounce: 5, breathability: 5, loadDistribution: 3, easeOfAccess: 4, durability: 3 },
        bestFor: ["Supported 50Ks", "Elite racers", "Warm weather minimalist running"],
        distances: ["50K"],
        pros: [
          "100g — you will genuinely forget you're wearing a vest",
          "Two 500ml flasks included at an $80 price point",
          "Salomon's SensiFit body-mapping even in this minimalist form",
        ],
        cons: [
          "2L is only suitable for supported races with close aid stations",
          "No mandatory gear capacity",
          "Not durable enough for heavy training use",
        ],
        review: {
          quote: "I wore this at a road 50K and felt like I was running in just a singlet. Total weight including flasks was barely 300g.",
          race: "California International 50K",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
      {
        name: "TrailFire",
        brand: "OMM",
        price: "$100",
        weight: "118g",
        capacity: "4L",
        sizes: "XS–XL",
        genderFit: "Unisex",
        frontPockets: "2 flask pockets + 1 flat pocket",
        backStorage: "3L flat storage",
        hydrationSystem: "Soft flask compatible",
        poleCarry: false,
        whistle: true,
        bladderCompatible: false,
        includedFlasks: "None",
        ratings: { comfort: 4, bounce: 5, breathability: 5, loadDistribution: 3, easeOfAccess: 4, durability: 4 },
        bestFor: ["Fell/mountain racing", "British ultra circuit", "Minimalist 50K racing"],
        distances: ["50K"],
        pros: [
          "OMM's fell running heritage — built for conditions, not comfort",
          "Flat-pack design sits incredibly close to the body",
          "British ultra racing pedigree",
          "Whistle integrated",
        ],
        cons: [
          "No flasks included",
          "4L is restrictive for anything with mandatory gear",
          "Limited availability outside UK market",
        ],
        review: {
          quote: "The fell running community has trusted OMM for decades. The TrailFire is as minimal as a vest can get while still being functional.",
          race: "Lakeland 50",
          runner: "Verified finisher",
        },
        affiliates: { rei: "#", amazon: "#", warehouse: "#" },
      },
    ],
  },
];

const packsItemListJsonLd = itemListJsonLd({
  name: "Hydration packs and running vests for ultras",
  description:
    "Compare running vests by capacity, fit, and distance — from 50K race vests to 100-mile expedition packs.",
  url: `${SITE_URL}/gear/packs`,
  items: categories.flatMap((cat) =>
    cat.vests.map((vest) => ({
      name: `${vest.brand} ${vest.name}`,
      url: `${SITE_URL}/gear/packs#${gearProductAnchorId(cat.id, vest.brand, vest.name)}`,
      description: vest.bestFor.join(", "),
    }))
  ),
});

const packsFaqEntries = [
  {
    q: "How much capacity do I really need?",
    a: "Start with your longest expected gap between aid stations and work backwards. A 50K with aid every 5 miles needs under 5L. A 100-miler with 15-mile gaps in remote terrain needs 12L+. The capacity calculator rule: 500ml per hour of running between aid stations, plus all mandatory gear items.",
  },
  {
    q: "Front flasks vs. back bladder — which is better?",
    a: "Most elite ultra runners have moved to front flask-only setups. The reasons: you can see exactly how much water you have, refilling is faster at aid stations, you can carry different drinks, and there's no tube to maintain. Bladders are better for beginners who need reminders to drink or for very remote sections with 15+ mile aid gaps.",
  },
  {
    q: "How tight should my vest be?",
    a: "Snug, not compressive. You should be able to take a full deep breath without restriction. Filled flasks should not bounce during running — if they bounce, tighten the sternum straps or side compression. A common mistake is wearing a vest too loose — a slightly snug fit is more comfortable over 100 miles than a loose vest that bounces constantly.",
  },
  {
    q: "Will my vest work in winter with layers underneath?",
    a: "Depends on the design. Most vests have some stretch. If you plan to run in a soft shell or mid-layer under your vest, try it on with that layer and size up if needed. The sternum straps need to tighten sufficiently over the extra bulk. Some runners specifically buy a size up for winter training.",
  },
  {
    q: "What's the difference between men's and women's vests?",
    a: "Women's-specific vests have a shorter torso, narrower shoulders, wider chest (accommodation for bust), and adjusted sternum strap placement. In a unisex vest, women often experience gaps in the chest area or sternum straps that sit in the wrong position. Brands like Osprey (Dyna) and Salomon's women's ADV Skin are genuinely different designs — not just recolored men's vests.",
  },
  {
    q: "Do I need a vest for a 50K?",
    a: "Depends on the race. A fully supported 50K with aid every 3–5 miles? You might be fine with a handheld or waist belt. A 50K with a 10-mile remote section and mandatory gear? You need a vest. Check your race's required gear list and longest aid gap, then decide. When in doubt, a small race vest gives you flexibility without the weight penalty.",
  },
  {
    q: "How do I prevent chafing?",
    a: "Anti-chafe balm (Body Glide, Squirrel's Nut Butter) on the neck, underarms, and anywhere the vest contacts skin. Wear a technical fabric base layer (not cotton). Ensure vest is the right size — both too large and too small cause chafing. Identify hot spots in training and address them before race day. Seam tape or moleskin on specific problem spots.",
  },
  {
    q: "Are expensive vests ($180-250) worth it?",
    a: "For racing, usually yes. The difference between a $90 vest and a $200 Salomon ADV Skin is real and measurable in bounce, comfort over 50+ miles, and pocket organization. That said, a $130 Ultimate Direction Race Vest is excellent for most runners. Buy the best you can afford for race day — it's gear you'll use for hundreds of races over 5+ years. Cost per use drops significantly.",
  },
  {
    q: "How do I carry trekking poles when not using them?",
    a: "Three options: (1) Stow-on-the-go via vest's built-in elastic loops on shoulders — best for frequent pole use on mountain courses (Salomon's system is best). (2) Diagonal back carry through straps — more secure for long carry sections. (3) Side pocket stash — fastest but tips poles forward and can catch on trail. Practice your preferred method in training until it's muscle memory.",
  },
];

const packsFaqJsonLd = faqPageJsonLd(
  packsFaqEntries.map((item) => ({ question: item.q, answer: item.a }))
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

function VestCard({
  vest,
  categoryColor,
  id,
}: {
  vest: Vest;
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
          <div className="mb-1"><Package className="w-10 h-10 text-gray" /></div>
          <p className="text-xs text-gray">
            {vest.brand} {vest.name}
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor}`}>
            {vest.brand}
          </span>
          <h3 className="font-headline font-bold text-dark text-lg mt-2 leading-tight">{vest.name}</h3>
          <p className="text-accent font-bold text-sm mt-0.5">{vest.price}</p>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray mb-4 border-t border-b border-gray-100 py-3">
          <span>
            Weight: <strong className="text-dark">{vest.weight}</strong>
          </span>
          <span>
            Capacity: <strong className="text-dark">{vest.capacity}</strong>
          </span>
          <span>
            Sizes: <strong className="text-dark">{vest.sizes}</strong>
          </span>
          <span>
            Fit: <strong className="text-dark">{vest.genderFit}</strong>
          </span>
          <span>
            Flasks: <strong className="text-dark">{vest.includedFlasks}</strong>
          </span>
          <span>
            Pole carry: <strong className="text-dark">{vest.poleCarry ? "Yes" : "No"}</strong>
          </span>
          <span>
            Bladder: <strong className="text-dark">{vest.bladderCompatible ? "Yes" : "No"}</strong>
          </span>
          <span>
            Whistle: <strong className="text-dark">{vest.whistle ? "Included" : "No"}</strong>
          </span>
        </div>

        {/* Storage breakdown */}
        <div className="mb-4 text-xs">
          <p className="font-semibold text-dark mb-1">Storage</p>
          <p className="text-gray mb-0.5">
            <span className="font-medium text-dark">Front:</span> {vest.frontPockets}
          </p>
          <p className="text-gray mb-0.5">
            <span className="font-medium text-dark">Back:</span> {vest.backStorage}
          </p>
          <p className="text-gray">
            <span className="font-medium text-dark">Hydration:</span> {vest.hydrationSystem}
          </p>
        </div>

        {/* Ratings */}
        <div className="space-y-1.5 mb-4">
          {(
            [
              ["Comfort / Fit", vest.ratings.comfort],
              ["Bounce Reduction", vest.ratings.bounce],
              ["Breathability", vest.ratings.breathability],
              ["Load Distribution", vest.ratings.loadDistribution],
              ["Ease of Access", vest.ratings.easeOfAccess],
              ["Durability", vest.ratings.durability],
            ] as [string, number][]
          ).map(([label, val]) => (
            <div key={label} className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray w-32 shrink-0">{label}</span>
              <RatingBar value={val} />
            </div>
          ))}
        </div>

        {/* Best for */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-dark mb-1">Best for</p>
          <div className="flex flex-wrap gap-1">
            {vest.bestFor.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Pros/Cons */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <p className="font-semibold text-dark mb-1">Pros</p>
            <ul className="space-y-0.5">
              {vest.pros.slice(0, 3).map((p) => (
                <li key={p} className="text-gray flex gap-1">
                  <span className="text-green-500 shrink-0">+</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-dark mb-1">Cons</p>
            <ul className="space-y-0.5">
              {vest.cons.map((c) => (
                <li key={c} className="text-gray flex gap-1">
                  <span className="text-red-400 shrink-0">−</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Runner review */}
        <blockquote className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray italic flex-1">
          &ldquo;{vest.review.quote}&rdquo;
          <footer className="not-italic font-semibold text-dark mt-1">
            {vest.review.runner} · {vest.review.race}
          </footer>
        </blockquote>

        {/* Affiliate links */}
        <div className="flex gap-2 flex-wrap mt-auto">
          {[
            ["REI", vest.affiliates.rei],
            ["Amazon", vest.affiliates.amazon],
            ["Running Warehouse", vest.affiliates.warehouse],
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

export default function PacksPage() {
  return (
    <>
      <Header />
      <JsonLd data={[packsItemListJsonLd, packsFaqJsonLd]} />

      <main>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              Gear Guide
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">
              Hydration Packs &<br className="hidden sm:block" /> Running Vests Guide
            </h1>
            <p className="text-xl text-gray max-w-2xl mx-auto mb-4">
              Carry your essentials comfortably for miles. Find the perfect vest for your race.
            </p>
            <p className="text-base text-gray max-w-2xl mx-auto">
              A vest that bounces, chafes, or doesn&apos;t fit will ruin your race long before your legs give out.
              Proper load distribution keeps you comfortable from mile 1 to mile 100. The right hydration strategy
              keeps you moving when others stop at aid stations. There&apos;s no universal answer — but there is a
              perfect vest for your distance, body, and race requirements.
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
              <a
                href="#hydration"
                className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium"
              >
                Hydration Strategy
              </a>
              <a
                href="#features"
                className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium"
              >
                Feature Guide
              </a>
              <a
                href="#fitting"
                className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium"
              >
                Fitting Guide
              </a>
              <a
                href="#faq"
                className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium"
              >
                FAQ
              </a>
            </div>
          </div>
        </section>

        {/* ── Vest Finder ── */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-headline text-3xl font-bold text-dark mb-3">
                Not Sure Which Vest to Get?
              </h2>
              <p className="text-gray">
                Answer 4 questions and we&apos;ll match you with the right pack for your race and body.
              </p>
            </div>
            <VestFinder />
          </div>
        </section>

        {/* ── Vest Categories ── */}
        {categories.map((cat, catIdx) => (
          <section
            key={cat.id}
            id={cat.id}
            className={`py-16 bg-gradient-to-b ${catIdx % 2 === 0 ? cat.color : "from-white to-light"}`}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <span
                  className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${cat.badgeColor}`}
                >
                  {cat.capacityNote}
                </span>
                <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-2">
                  {cat.title}
                </h2>
                <p className="text-accent font-semibold text-sm mb-3">{cat.subtitle}</p>
                <p className="text-gray max-w-2xl">{cat.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.vests.map((vest) => (
                  <VestCard
                    key={`${cat.id}-${vest.brand}-${vest.name}`}
                    id={gearProductAnchorId(cat.id, vest.brand, vest.name)}
                    vest={vest}
                    categoryColor={cat.badgeColor}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── Hydration Strategy ── */}
        <section id="hydration" className="py-16 bg-dark text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold mb-4">
                Hydration Strategy by Distance
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Your vest capacity should match your hydration needs between aid stations — not just the total race distance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  distance: "50K",
                  capacity: "1–1.5L total",
                  icon: <Cloud className="w-6 h-6 text-blue-400" />,
                  setup: "2× 500ml front flasks",
                  aidStations: "Every 5–10 miles",
                  tips: [
                    "Front-only flasks usually sufficient",
                    "No bladder needed for most courses",
                    "Electrolyte tabs in front zip pocket",
                    "Race day: know aid station distances",
                  ],
                },
                {
                  distance: "50 Miles",
                  capacity: "1.5–2L",
                  icon: <Cloud className="w-6 h-6 text-blue-300" />,
                  setup: "2× 500ml flasks + optional 1L bladder",
                  aidStations: "Every 8–15 miles",
                  tips: [
                    "Consider adding a bladder for remote sections",
                    "Night section may require extra capacity",
                    "Pre-load electrolytes at aid stations",
                    "Know the longest gap between aid stations",
                  ],
                },
                {
                  distance: "100K",
                  capacity: "2–2.5L",
                  icon: <Cloud className="w-6 h-6 text-cyan-400" />,
                  setup: "2× 500ml flasks + 1.5L bladder",
                  aidStations: "Every 10–20 miles",
                  tips: [
                    "Redundant hydration systems critical",
                    "Remote sections may have 15+ mile gaps",
                    "Night sections need extra planning",
                    "Practice refilling while moving",
                  ],
                },
                {
                  distance: "100 Miles",
                  capacity: "2–3L",
                  icon: <Moon className="w-6 h-6 text-gray-600" />,
                  setup: "2× 500ml flasks + 2L bladder or crew support",
                  aidStations: "Every 5–20 miles (varies)",
                  tips: [
                    "Crew support can simplify hydration",
                    "Drop bag flask rotation at key points",
                    "Night running: flasks easier than bladder",
                    "Sweat rate changes significantly after mile 60",
                  ],
                },
              ].map((d) => (
                <div
                  key={d.distance}
                  className="bg-white/5 rounded-xl p-5 border border-white/10"
                >
                  <div className="mb-2">{d.icon}</div>
                  <p className="text-primary font-bold text-sm uppercase tracking-wide mb-1">
                    {d.distance}
                  </p>
                  <p className="font-headline font-bold text-white text-lg mb-1">{d.capacity}</p>
                  <p className="text-gray-400 text-xs mb-1">Setup: {d.setup}</p>
                  <p className="text-gray-400 text-xs mb-4">Aid stations: {d.aidStations}</p>
                  <ul className="space-y-1.5">
                    {d.tips.map((tip) => (
                      <li key={tip} className="text-xs text-gray-300 flex gap-2">
                        <span className="text-primary shrink-0">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Flask vs Bladder comparison */}
            <div className="mt-10 bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="font-headline font-bold text-white text-xl mb-6 text-center">
                Front Flasks vs. Back Bladder
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-primary mb-3">Soft Flasks (Front)</p>
                  <ul className="space-y-2">
                    {[
                      "See exactly how much you have left",
                      "Easier to refill at aid stations",
                      "Can mix different drinks in each",
                      "No tube to clean or maintain",
                      "Better for night running (feel for flask)",
                      "Industry trend — most elites use flasks only",
                    ].map((item) => (
                      <li key={item} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-green-400 shrink-0">+</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-3">Hydration Bladder (Back)</p>
                  <ul className="space-y-2">
                    {[
                      "Larger continuous capacity (2–3L)",
                      "Hands-free sipping via tube",
                      "Better for runners who forget to drink",
                      "Good for remote sections without aid stations",
                      "Harder to know remaining volume",
                      "Cleaning is more involved",
                    ].map((item) => (
                      <li key={item} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-blue-400 shrink-0">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature Deep Dive ── */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">
                Vest Features Explained
              </h2>
              <p className="text-gray max-w-xl mx-auto">
                Know what you&apos;re buying. These are the features that actually matter after 50 miles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Package className="w-6 h-6 text-primary" />,
                  title: "Pocket Systems",
                  items: [
                    {
                      name: "Front flask pockets",
                      desc: "Should hold flasks at an angle accessible while running. Depth and elasticity matter — shallow pockets bounce.",
                    },
                    {
                      name: "Kangaroo / overflow",
                      desc: "Large stretchable front pocket for bulkier items (jacket, food). UD's design is best-in-class.",
                    },
                    {
                      name: "Zippered security",
                      desc: "For phone, money, ID. Waterproof rating matters — sweat ruins electronics.",
                    },
                    {
                      name: "Back main compartment",
                      desc: "Where mandatory gear, layers, and larger items live. Should have one large opening, not multiple small ones.",
                    },
                  ],
                },
                {
                  icon: <Wrench className="w-6 h-6 text-primary" />,
                  title: "Adjustment Systems",
                  items: [
                    {
                      name: "Sternum straps",
                      desc: "Multiple height positions allow dialing in chest fit. Critical for reducing bounce and accommodating different chest shapes.",
                    },
                    {
                      name: "Side compression",
                      desc: "Pull cords on sides compress load as you consume food and water. Prevents sloshing and dead space.",
                    },
                    {
                      name: "Shoulder strap",
                      desc: "Fixed on most vests. Some offer torso length adjustment — essential for very short or tall runners.",
                    },
                    {
                      name: "Bottom hem cinch",
                      desc: "Stabilizes vest during technical running. Often overlooked but significantly reduces vertical bounce.",
                    },
                  ],
                },
                {
                  icon: <PersonStanding className="w-6 h-6 text-primary" />,
                  title: "Pole Carry Systems",
                  items: [
                    {
                      name: "Diagonal back carry",
                      desc: "Best for long-term storage. Poles go across the back. Requires practice to stow while moving.",
                    },
                    {
                      name: "Stow-on-the-go",
                      desc: "Salomon's system: loop poles into elastic on shoulders while running. The best solution for mountain ultras.",
                    },
                    {
                      name: "Side pocket stash",
                      desc: "Quick but tips heavy poles forward. Good for short sections. Not ideal for technical descents.",
                    },
                    {
                      name: "Z-pole compatibility",
                      desc: "Black Diamond's folding poles designed to slot into BD vests. The most secure carry system.",
                    },
                  ],
                },
                {
                  icon: <Cloud className="w-6 h-6 text-primary" />,
                  title: "Breathability",
                  items: [
                    {
                      name: "Mesh back panels",
                      desc: "Allow air circulation between vest and body. Critical in summer. Osprey's AirScape is the benchmark.",
                    },
                    {
                      name: "Seamless construction",
                      desc: "Reduces chafing contact points. Salomon's skin-mapped design eliminates seams on high-friction areas.",
                    },
                    {
                      name: "Laser-cut ventilation",
                      desc: "Precision holes in panels for airflow. Adds breathability without compromising structure.",
                    },
                    {
                      name: "Quick-dry fabrics",
                      desc: "Lightweight polyester dries fast. Important for creek crossings and rain sections.",
                    },
                  ],
                },
                {
                  icon: <CloudRain className="w-6 h-6 text-primary" />,
                  title: "Weather Protection",
                  items: [
                    {
                      name: "DWR coating",
                      desc: "Durable water repellent treatment on outer fabric. Beads water in light rain. Not waterproof — just resistant.",
                    },
                    {
                      name: "Waterproof pockets",
                      desc: "True waterproof (not just resistant) pockets for phone and electronics. Look for taped seams.",
                    },
                    {
                      name: "Insulated pockets",
                      desc: "Some vests offer insulated front flask pockets to keep drinks cooler in heat or prevent freezing in cold.",
                    },
                    {
                      name: "Pack covers",
                      desc: "Aftermarket rain covers are an alternative to built-in waterproofing. Easier to deploy mid-run.",
                    },
                  ],
                },
                {
                  icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
                  title: "Safety Features",
                  items: [
                    {
                      name: "Integrated whistle",
                      desc: "Required by some races. Should be accessible without removing vest. Many brands include on sternum strap.",
                    },
                    {
                      name: "Reflective elements",
                      desc: "360-degree reflectivity matters for night sections. Look for reflective on both front and back panels.",
                    },
                    {
                      name: "Blinker/light attachment",
                      desc: "Loop or clip for attaching a blinker light to the back. Critical for night running safety.",
                    },
                    {
                      name: "Emergency ID pocket",
                      desc: "Small pocket for ICE (In Case of Emergency) card with medical info and emergency contacts.",
                    },
                  ],
                },
              ].map((block) => (
                <div
                  key={block.title}
                  className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                >
                  <div className="mb-3">{block.icon}</div>
                  <h3 className="font-headline font-bold text-dark text-lg mb-4">{block.title}</h3>
                  <div className="space-y-3">
                    {block.items.map((item) => (
                      <div key={item.name}>
                        <p className="text-sm font-semibold text-primary">{item.name}</p>
                        <p className="text-xs text-gray mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fitting Guide ── */}
        <section id="fitting" className="py-16 bg-light">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">
                Sizing & Fit Guide
              </h2>
              <p className="text-gray max-w-xl mx-auto">
                A vest that fits wrong will chafe, bounce, or restrict your breathing. Get sizing right before race day.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "How to Measure",
                  icon: <Ruler className="w-6 h-6 text-primary" />,
                  tips: [
                    "Chest circumference: measure around the fullest part of your chest",
                    "Torso length: C7 vertebra (base of neck) to iliac crest (top of hip)",
                    "Measure in centimeters for most vest sizing charts",
                    "Measure after a run — body size changes slightly when warm",
                    "Women: measure band size AND cup — some vests have cup-specific fits",
                  ],
                },
                {
                  title: "Brand Sizing Notes",
                  icon: <Tag className="w-6 h-6 text-primary" />,
                  tips: [
                    "Salomon: runs very snug — size up if between sizes",
                    "Ultimate Direction: true to size, good range for broad builds",
                    "Osprey: generous sizing, excellent for larger builds",
                    "Patagonia: true to size with good shoulder room",
                    "Nathan: slightly generous — consider sizing down if between sizes",
                  ],
                },
                {
                  title: "Fit Testing",
                  icon: <PersonStanding className="w-6 h-6 text-primary" />,
                  tips: [
                    "Always test with water in flasks — weight changes fit significantly",
                    "Fill to your expected race load and run 20+ minutes",
                    "Adjust all straps while running, not standing still",
                    "Check for: chafing under arms, bouncing, breathing restriction",
                    "A vest should feel snug but not compressive — you should breathe freely",
                  ],
                },
                {
                  title: "Common Fit Issues",
                  icon: <Wrench className="w-6 h-6 text-primary" />,
                  tips: [
                    "Bouncing: tighten sternum straps + side compression + reduce weight",
                    "Chafing under arms: wrong size or wrong vest design for your build",
                    "Chest gap (women): vest is not women's-specific or wrong size",
                    "Shoulder pain: load redistribution needed or wrong torso length",
                    "Breathing restriction: loosen chest straps or try a larger size",
                  ],
                },
                {
                  title: "Layering Considerations",
                  icon: <Shirt className="w-6 h-6 text-primary" />,
                  tips: [
                    "Winter races: order your vest with your thickest base layer in mind",
                    "Most runners order 1 size up for cold weather use with layers",
                    "Soft shells under a vest: ensure vest sits over, not under",
                    "Rain jackets: go on top of vest — never trap the vest underneath",
                    "Test with your actual race kit — not just a t-shirt",
                  ],
                },
                {
                  title: "Break-In & Maintenance",
                  icon: <RefreshCcw className="w-6 h-6 text-primary" />,
                  tips: [
                    "Run at least 3–5 training runs in your vest before race day",
                    "Mark optimal strap positions with a marker after dialing in",
                    "Hand wash with mild detergent — never machine dry",
                    "Store with straps loose to prevent elastic memory",
                    "Bladder: rinse after every use, air dry fully before storing",
                  ],
                },
              ].map((section) => (
                <div
                  key={section.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="mb-3">{section.icon}</div>
                  <h3 className="font-headline font-bold text-dark text-lg mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.tips.map((tip) => (
                      <li key={tip} className="text-sm text-gray flex gap-2">
                        <span className="text-primary shrink-0 mt-0.5">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Race-Specific ── */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">
                Race-Specific Recommendations
              </h2>
              <p className="text-gray max-w-xl mx-auto">
                Different races have wildly different gear requirements. Here&apos;s what to bring where.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-semibold text-dark">Race</th>
                    <th className="text-left px-5 py-3 font-semibold text-dark">Capacity</th>
                    <th className="text-left px-5 py-3 font-semibold text-dark">Conditions</th>
                    <th className="text-left px-5 py-3 font-semibold text-dark">Top Picks</th>
                    <th className="text-left px-5 py-3 font-semibold text-dark">Key Needs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    {
                      race: "Western States 100",
                      capacity: "8–12L",
                      conditions: "Hot canyons, crew access frequent",
                      picks: "ADV Skin 12, VaporKrar 12L",
                      needs: "Heat management, easy refill",
                    },
                    {
                      race: "UTMB",
                      capacity: "12–18L",
                      conditions: "Alpine, extensive mandatory gear, weather variability",
                      picks: "ADV Skin 18, Revolutiv 18L",
                      needs: "Full mandatory gear, pole carry, waterproof pockets",
                    },
                    {
                      race: "Hardrock 100",
                      capacity: "12–15L",
                      conditions: "High altitude, remote, mountain terrain",
                      picks: "ADV Skin 12/18, Fastpack 25",
                      needs: "Self-sufficiency, pole carry, alpine durability",
                    },
                    {
                      race: "Leadville 100",
                      capacity: "8–12L",
                      conditions: "High altitude, crew access good, weather extremes",
                      picks: "ADV Skin 12, Slope Runner 8L",
                      needs: "Altitude layering room, weather adaptability",
                    },
                    {
                      race: "Moab 240",
                      capacity: "15L+",
                      conditions: "Multi-day, desert, maximum organization",
                      picks: "Fastpack 25, ADV Skin 18",
                      needs: "Max capacity, food storage, desert heat management",
                    },
                  ].map((row, i) => (
                    <tr key={row.race} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-5 py-3 font-semibold text-dark">{row.race}</td>
                      <td className="px-5 py-3 text-primary font-medium">{row.capacity}</td>
                      <td className="px-5 py-3 text-gray">{row.conditions}</td>
                      <td className="px-5 py-3 text-dark font-medium">{row.picks}</td>
                      <td className="px-5 py-3 text-gray">{row.needs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Packing Strategy ── */}
        <section className="py-16 bg-light">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">
                Packing Strategy
              </h2>
              <p className="text-gray max-w-xl mx-auto">
                How you pack is as important as what you pack. Poor organization costs minutes at aid stations and causes unnecessary suffering on the trail.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-headline font-bold text-dark text-lg mb-4">What Goes Where</h3>
                <div className="space-y-3">
                  {[
                    { location: "Front flask pockets", items: "Water/electrolyte flasks only — keep accessible" },
                    { location: "Front zip pockets", items: "Gels, chews, salt tabs — things you grab every 30 min" },
                    { location: "Chest pockets", items: "Phone, map, emergency contact card" },
                    { location: "Back top layer", items: "Rain jacket, emergency blanket — things you may need fast" },
                    { location: "Back main", items: "Headlamp, first aid, insulation, extra food" },
                    { location: "Back bottom", items: "Heaviest items (water bottles, heavier food) — close to spine" },
                  ].map((row) => (
                    <div key={row.location} className="flex gap-3 text-sm">
                      <span className="font-semibold text-primary shrink-0 w-36">{row.location}</span>
                      <span className="text-gray">{row.items}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-headline font-bold text-dark text-lg mb-4">Weight Distribution</h3>
                <ul className="space-y-2 text-sm text-gray">
                  {[
                    "Heavy items (water, food) as close to your back and center as possible",
                    "Balance left and right — asymmetric loading causes hip and shoulder issues over 50+ miles",
                    "Lower heavy items to reduce lever arm effect on shoulders",
                    "Use compression straps to eliminate dead space as the pack empties",
                    "Rebalance at every major aid station — the load changes dramatically as you eat and drink",
                    "Practice with your expected race-day weight, not an empty vest",
                  ].map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="text-primary shrink-0 mt-0.5">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {packsFaqEntries.map((item) => (
                <details
                  key={item.q}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-dark list-none">
                    {item.q}
                    <span className="text-primary ml-3 shrink-0 group-open:rotate-180 transition-transform">
                      ▾
                    </span>
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
              <strong>Affiliate disclosure:</strong> FinishUltra may earn a commission on purchases
              made through links on this page at no additional cost to you. We only recommend gear
              we&apos;ve researched and trust for ultra running.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
