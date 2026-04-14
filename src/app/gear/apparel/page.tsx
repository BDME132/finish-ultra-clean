import React from "react";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ApparelFinder from "./ApparelFinder";
import { gearProductAnchorId, itemListJsonLd, SITE_URL } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo-metadata";
import {
  Shirt, PersonStanding, Layers, CloudRain, Footprints, Shield,
  Sun, Cloud, Snowflake, Mountain, Scissors, Flame, Droplets, Leaf,
  Wind, RefreshCcw, ClipboardList, Sparkles, Zap, Circle,
} from "lucide-react";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ultra Running Apparel & Layering Guide | FinishUltra",
    description:
      "What to wear for trail ultras: base layers, shells, socks, and accessories — fabrics, chafe prevention, and hot/cold race picks.",
    path: "/gear/apparel",
  }),
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ApparelProduct = {
  name: string;
  brand: string;
  price: string;
  weight?: string;
  material: string;
  bestFor: string[];
  pros: string[];
  cons: string[];
  genderFit: string;
  affiliates: { amazon: string };
};

// ─── Category Data ────────────────────────────────────────────────────────────

const categories: {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  color: string;
  badgeColor: string;
  description: string;
  products: ApparelProduct[];
}[] = [
  {
    id: "tops",
    title: "Base Layers — Tops",
    icon: <Shirt className="w-6 h-6 text-primary" />,
    subtitle: "Your first line of defense against sweat, sun, and cold",
    color: "from-blue-50 to-white",
    badgeColor: "bg-blue-100 text-blue-800",
    description:
      "The shirt touching your skin determines everything: blister prevention at the underarms, temperature regulation, and whether you smell like a human being at mile 80. Cotton is never the answer.",
    products: [],
  },
  {
    id: "shorts",
    title: "Shorts & Bottoms",
    icon: <PersonStanding className="w-6 h-6 text-primary" />,
    subtitle: "Chafe prevention and pocket access define your race",
    color: "from-green-50 to-white",
    badgeColor: "bg-green-100 text-green-800",
    description:
      "The wrong shorts will sideline you with chafing by mile 30. The right ones carry your nutrition, stay in place, and feel like nothing after 100 miles. Liner, pocket count, and inseam are everything.",
    products: [],
  },
  {
    id: "insulation",
    title: "Insulation & Mid Layers",
    icon: <Layers className="w-6 h-6 text-primary" />,
    subtitle: "Packable warmth that earns its space in your vest",
    color: "from-orange-50 to-white",
    badgeColor: "bg-orange-100 text-orange-800",
    description:
      "Every layer in your vest costs you space and weight. Insulation needs to earn its place by being compressible, light, and warm when you stop moving. These do all three.",
    products: [],
  },
  {
    id: "shells",
    title: "Rain & Wind Shells",
    icon: <CloudRain className="w-6 h-6 text-primary" />,
    subtitle: "Mandatory gear that must perform when conditions turn",
    color: "from-gray-50 to-white",
    badgeColor: "bg-gray-200 text-gray-800",
    description:
      "Many races mandate a waterproof jacket. Even when they don't, a shell is non-negotiable for 100-mile mountain races. Weight and packability determine whether runners actually carry it vs. leave it at camp.",
    products: [],
  },
  {
    id: "socks",
    title: "Socks",
    icon: <Footprints className="w-6 h-6 text-primary" />,
    subtitle: "The most important piece of apparel per dollar spent",
    color: "from-yellow-50 to-white",
    badgeColor: "bg-yellow-100 text-yellow-800",
    description:
      "Blisters end more races than bonking. The right socks, sized correctly and worn with race shoes, are the difference between walking mile 70 and running it. Never scrimp here.",
    products: [
    ],
  },
  {
    id: "accessories",
    title: "Hats, Gloves & Accessories",
    icon: <Shield className="w-6 h-6 text-primary" />,
    subtitle: "Small items with outsized impact on comfort and safety",
    color: "from-purple-50 to-white",
    badgeColor: "bg-purple-100 text-purple-800",
    description:
      "Accessories are where races are lost to cold hands, eye strain, and neck exposure. They weigh almost nothing in your vest but matter enormously when conditions change.",
    products: [],
  },
  {
    id: "antichafe",
    title: "Anti-Chafe & Undergarments",
    icon: <Shield className="w-6 h-6 text-primary" />,
    subtitle: "The unsexy products that save your race",
    color: "from-red-50 to-white",
    badgeColor: "bg-red-100 text-red-800",
    description:
      "Chafing is entirely preventable and absolutely race-ending. Apply before you start, reapply at crew stops, and carry it in your vest. These products cost pennies per mile of comfort.",
    products: [],
  },
];

const apparelItemListJsonLd = itemListJsonLd({
  name: "Ultra marathon running apparel",
  description:
    "Base layers, shorts, shells, socks, and accessories reviewed for trail ultras from 50K to 100 miles.",
  url: `${SITE_URL}/gear/apparel`,
  items: categories.flatMap((cat) =>
    cat.products.map((product) => ({
      name: `${product.brand} ${product.name}`,
      url: `${SITE_URL}/gear/apparel#${gearProductAnchorId(cat.id, product.brand, product.name)}`,
      description: product.bestFor.join(", "),
    }))
  ),
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function ApparelCard({
  product,
  categoryColor,
  id,
}: {
  product: ApparelProduct;
  categoryColor: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all overflow-hidden flex flex-col scroll-mt-24"
    >
      <div className="bg-gray-50 py-8 flex items-center justify-center border-b border-gray-100">
        <div className="text-center">
          <div className="flex justify-center mb-1"><Shirt className="w-8 h-8 text-gray" /></div>
          <p className="text-xs text-gray">{product.brand}</p>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor}`}>{product.brand}</span>
          <h3 className="font-headline font-bold text-dark text-lg mt-2 leading-tight">{product.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-accent font-bold text-sm">{product.price}</span>
            {product.weight && <span className="text-xs text-gray">{product.weight}</span>}
          </div>
        </div>

        <div className="text-xs text-gray mb-4 border-t border-b border-gray-100 py-3 space-y-1">
          <p><span className="font-semibold text-dark">Material:</span> {product.material}</p>
          <p><span className="font-semibold text-dark">Fit:</span> {product.genderFit}</p>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-dark mb-1">Best for</p>
          <div className="flex flex-wrap gap-1">
            {product.bestFor.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <p className="font-semibold text-dark mb-1">Pros</p>
            <ul className="space-y-0.5">
              {product.pros.slice(0, 3).map((p) => (
                <li key={p} className="text-gray flex gap-1"><span className="text-green-500 shrink-0">+</span>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-dark mb-1">Cons</p>
            <ul className="space-y-0.5">
              {product.cons.map((c) => (
                <li key={c} className="text-gray flex gap-1"><span className="text-red-400 shrink-0">−</span>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mt-auto">
          <a
            href={product.affiliates.amazon}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 text-center text-xs px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors font-medium"
          >
            Buy on Amazon
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApparelPage() {
  return (
    <>
      <Header />
      <JsonLd data={apparelItemListJsonLd} />

      <main>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              Gear Guide
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">
              Ultra Marathon Apparel<br className="hidden sm:block" /> & Running Clothing
            </h1>
            <p className="text-xl text-gray max-w-2xl mx-auto mb-4">
              Dress for comfort, performance, and survival across any distance and conditions.
            </p>
            <p className="text-base text-gray max-w-2xl mx-auto mb-6">
              The right apparel system isn&apos;t about brand loyalty — it&apos;s about matching fabric, weight, and layering to
              your specific race conditions. A poorly chosen shirt can end a 100-mile race through chafing alone.
              The wrong insulation layer can cause hypothermia on a mountain at 2am. Get this right.
            </p>
            <div className="inline-flex items-center gap-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl px-5 py-3 text-sm font-bold">
              <Zap className="w-5 h-5 text-orange-600 flex-shrink-0" />
              The first rule of ultra apparel: <strong>cotton kills, synthetics and merino save.</strong>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {categories.map((c) => (
                <a key={c.id} href={`#${c.id}`} className="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">
                  {c.icon}{c.title}
                </a>
              ))}
              <a href="#layering" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">Layering Guide</a>
              <a href="#fabric" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">Fabric Tech</a>
              <a href="#distance" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">By Distance</a>
              <a href="#faq" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray font-medium">FAQ</a>
            </div>
          </div>
        </section>

        {/* ── Outfit Finder ── */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-headline text-3xl font-bold text-dark mb-3">Build Your Race Outfit</h2>
              <p className="text-gray">5 questions → a complete layering recommendation with specific products.</p>
            </div>
            <ApparelFinder />
          </div>
        </section>

        {/* ── Product Categories ── */}
        {categories.map((cat, i) => (
          <section key={cat.id} id={cat.id} className={`py-16 bg-gradient-to-b ${i % 2 === 0 ? cat.color : "from-white to-light"}`}>
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
                  <ApparelCard
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

        {/* ── Layering Guide ── */}
        <section id="layering" className="py-16 bg-dark text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold mb-4">Layering by Conditions</h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                The layering system that keeps you comfortable from a summer desert 50K to a winter mountain 100-miler.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  temp: "Hot (75°F+)",
                  icon: <Sun className="w-6 h-6 text-orange-400" />,
                  color: "border-orange-500/30",
                  layers: [
                    { layer: "Top", item: "Patagonia Capilene Cool Daily", note: "UPF 50+, Polygiene" },
                    { layer: "Bottom", item: "Janji 5\" AFO Short", note: "Pockets, 4-way stretch" },
                    { layer: "Socks", item: "Darn Tough No-Show Low", note: "Merino, lifetime warranty" },
                    { layer: "Head", item: "Salomon XA Cap", note: "UPF, mesh vent" },
                    { layer: "Eyes", item: "Goodr Running Sunglasses", note: "No-bounce, polarized" },
                  ],
                  total: "~$165",
                  tip: "Start with ice in your hat and bandana. Apply sunscreen AND SPF lip balm.",
                },
                {
                  temp: "Moderate (50–75°F)",
                  icon: <Cloud className="w-6 h-6 text-blue-400" />,
                  color: "border-blue-500/30",
                  layers: [
                    { layer: "Top", item: "OR Echo Long Sleeve", note: "Sun protection, thumbholes" },
                    { layer: "Bottom", item: "Patagonia Strider Pro 5\"", note: "DWR, built-in brief" },
                    { layer: "Socks", item: "Balega Hidden Comfort", note: "Plush, seamless toe" },
                    { layer: "Head", item: "Ciele GOCap", note: "COOLwick, technical" },
                    { layer: "Vest pocket", item: "Patagonia Houdini", note: "Wind/light rain" },
                  ],
                  total: "~$320",
                  tip: "Moderate days change — morning cold, afternoon warm. Layer for the start, not the peak.",
                },
                {
                  temp: "Cool (35–50°F)",
                  icon: <Cloud className="w-6 h-6 text-cyan-400" />,
                  color: "border-cyan-500/30",
                  layers: [
                    { layer: "Base Top", item: "Smartwool Merino 150 LS", note: "Natural temp regulation" },
                    { layer: "Base Bottom", item: "Patagonia Capilene Tights", note: "Insulating base" },
                    { layer: "Mid Layer", item: "Patagonia Nano Puff Vest", note: "Core warmth, packable" },
                    { layer: "Head", item: "Smartwool Merino 250 Beanie", note: "Merino, under headlamp" },
                    { layer: "Hands", item: "Smartwool Merino 150 Gloves", note: "Touchscreen, lightweight" },
                  ],
                  total: "~$380",
                  tip: "The vest goes in your pack when you warm up — arms free, core warm.",
                },
                {
                  temp: "Cold (20–35°F)",
                  icon: <Snowflake className="w-6 h-6 text-blue-300" />,
                  color: "border-blue-300/30",
                  layers: [
                    { layer: "Base Top", item: "Smartwool Merino 250 Crew", note: "Heavyweight warmth" },
                    { layer: "Base Bottom", item: "Smartwool Merino 250 Tights", note: "Full warm base" },
                    { layer: "Mid", item: "Patagonia R1 Hoody", note: "Breathable active fleece" },
                    { layer: "Shell", item: "OR Helium Rain Jacket", note: "Wind/water barrier" },
                    { layer: "Head + Hands", item: "Full accessories kit", note: "Beanie + liner gloves + Buff" },
                  ],
                  total: "~$500",
                  tip: "Your biggest cold-weather mistake: not having a dry base layer in your drop bag.",
                },
                {
                  temp: "Wet / Rainy",
                  icon: <CloudRain className="w-6 h-6 text-primary" />,
                  color: "border-gray-400/30",
                  layers: [
                    { layer: "Base", item: "Quick-dry synthetic (not merino)", note: "Dries faster when soaked" },
                    { layer: "Shell", item: "Patagonia Storm Racer Jacket", note: "H2No waterproof" },
                    { layer: "Bottom", item: "DWR-treated shorts/tights", note: "Sheds water off thighs" },
                    { layer: "Head", item: "Patagonia Duckbill Cap", note: "Brim keeps rain off face" },
                    { layer: "Hands", item: "Waterproof gloves or shells", note: "Wet = cold hands fast" },
                  ],
                  total: "~$350+",
                  tip: "Extra dry socks in your vest. Wet feet are inevitable — dry socks reset you.",
                },
                {
                  temp: "Mountain / Alpine",
                  icon: <Mountain className="w-6 h-6 text-purple-400" />,
                  color: "border-purple-500/30",
                  layers: [
                    { layer: "Base", item: "Smartwool Merino 150 LS", note: "Natural temp buffer" },
                    { layer: "Insulation", item: "Patagonia Nano Puff Jacket", note: "Compresses to fist-size" },
                    { layer: "Shell", item: "Arc'teryx Norvan SL Hoody", note: "Lightest waterproof available" },
                    { layer: "Accessories", item: "Full cold weather kit", note: "Beanie, gloves, Buff" },
                    { layer: "Night add-ons", item: "Extra base, hand warmers", note: "Temps drop 30°F at night" },
                  ],
                  total: "~$600+",
                  tip: "Mountain races: all layers accessible in vest top pocket. Never dig for emergency gear.",
                },
              ].map((scenario) => (
                <div key={scenario.temp} className={`bg-white/5 rounded-xl p-5 border ${scenario.color}`}>
                  <div className="mb-2">{scenario.icon}</div>
                  <h3 className="font-headline font-bold text-white text-lg mb-1">{scenario.temp}</h3>
                  <p className="text-accent font-bold text-xs mb-4">{scenario.total} estimated</p>
                  <div className="space-y-2 mb-4">
                    {scenario.layers.map((l) => (
                      <div key={l.layer} className="text-xs">
                        <span className="text-gray-400 font-medium">{l.layer}: </span>
                        <span className="text-white font-semibold">{l.item}</span>
                        <span className="text-gray-500 ml-1">— {l.note}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-primary font-medium border-t border-white/10 pt-3">{scenario.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fabric Technology ── */}
        <section id="fabric" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Fabric Technology Guide</h2>
              <p className="text-gray max-w-xl mx-auto">
                Know what you&apos;re buying. These are the technologies that actually matter over 100 miles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  title: "Base Fabrics",
                  icon: <Scissors className="w-6 h-6 text-primary" />,
                  items: [
                    { name: "Merino Wool", desc: "Temperature regulating, odor-resistant, naturally moisture-wicking. Slower to dry than synthetic. Best for multi-day events." },
                    { name: "Polyester", desc: "Fast-drying, durable, affordable. Retains odor over time. Nike Dri-FIT, Patagonia Capilene." },
                    { name: "Nylon", desc: "Softer feel than polyester, more durable, excellent moisture management. Patagonia's preferred synthetic." },
                    { name: "Merino Blends", desc: "Best of both: wool odor resistance + synthetic durability and drying speed. Smartwool PhD line." },
                  ],
                },
                {
                  title: "Insulation Tech",
                  icon: <Flame className="w-6 h-6 text-orange-500" />,
                  items: [
                    { name: "Down (800+ fill)", desc: "Best warmth-to-weight ratio. Loses insulation when wet. Best for dry cold. Mountain Hardwear Ghost Whisperer." },
                    { name: "PrimaLoft / Coreloft", desc: "Synthetic insulation that works when wet. More durable than down. Patagonia Nano Puff, Arc'teryx Atom." },
                    { name: "Polartec Fleece", desc: "Breathable active insulation. Grid interior wicks moisture. Best mid-layer for running. Patagonia R1." },
                    { name: "37.5 Technology", desc: "Active particles in fiber move moisture and maintain optimal body temp. Salomon uses extensively." },
                  ],
                },
                {
                  title: "Weather Membranes",
                  icon: <Droplets className="w-6 h-6 text-blue-500" />,
                  items: [
                    { name: "Gore-Tex", desc: "Gold standard waterproof-breathable. Expensive, durable, widely trusted. Arc'teryx Beta LT." },
                    { name: "Gore-Tex Shakedry", desc: "Exposed membrane — lightest waterproof available. Delicate but remarkable. Arc'teryx Norvan SL." },
                    { name: "Patagonia H2No", desc: "Patagonia's proprietary membrane. Excellent breathability/waterproofing balance at lower price." },
                    { name: "DWR Coating", desc: "Surface treatment that beads water. Not waterproof — needs shell behind it. Reapply with Nikwax periodically." },
                  ],
                },
                {
                  title: "Sustainability",
                  icon: <Leaf className="w-6 h-6 text-green-500" />,
                  items: [
                    { name: "Bluesign Approved", desc: "Certification for safe, sustainable fabric production. Patagonia, Arc'teryx, Outdoor Research." },
                    { name: "Recycled Content", desc: "Patagonia's Capilene uses 100% recycled polyester. Performance identical to virgin synthetic." },
                    { name: "ZQ Merino", desc: "Ethical merino sourcing standard. Animal welfare + land management. Smartwool, Icebreaker." },
                    { name: "Polygiene", desc: "Antimicrobial treatment that reduces wash frequency — less water, less energy. Patagonia, various brands." },
                  ],
                },
              ].map((block) => (
                <div key={block.title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
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

        {/* ── By Distance ── */}
        <section id="distance" className="py-16 bg-light">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Clothing by Race Distance</h2>
              <p className="text-gray max-w-xl mx-auto">
                Longer races require more clothing redundancy, drop bag planning, and night-section preparation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  distance: "50K",
                  time: "4–10 hrs",
                  icon: <Circle className="w-6 h-6 text-green-500" />,
                  budget: "$200–500",
                  outfit: ["Single full outfit (weather-appropriate)", "1 layering option in vest", "Hat, sunglasses, buff"],
                  dropBag: ["No drop bags typically needed", "Extra sock pair if long course"],
                  notes: "Test your exact race-day outfit on a 15-20 mile training run first.",
                },
                {
                  distance: "50 Miles",
                  time: "7–14 hrs",
                  icon: <Circle className="w-6 h-6 text-yellow-500" />,
                  budget: "$400–700",
                  outfit: ["Start outfit", "1-2 layering options in vest", "Full accessories kit"],
                  dropBag: ["Extra shirt", "1-2 extra sock pairs", "Warmer layer if evening finish", "Fresh hat"],
                  notes: "Plan for the temperature at your estimated finish time, not the start.",
                },
                {
                  distance: "100K",
                  time: "10–20 hrs",
                  icon: <Circle className="w-6 h-6 text-orange-500" />,
                  budget: "$600–1,000",
                  outfit: ["Day start outfit", "Night transition layer in vest", "2-3 layering options accessible"],
                  dropBag: ["Mid-race shirt change", "2-3 sock pairs", "Night running warm kit", "Emergency dry base layer"],
                  notes: "Day-to-night transition is where most clothing mistakes happen. Plan it explicitly.",
                },
                {
                  distance: "100 Miles",
                  time: "20–36 hrs",
                  icon: <Circle className="w-6 h-6 text-red-500" />,
                  budget: "$800–1,500",
                  outfit: ["Multiple complete outfits", "Full layering system at all times", "Night gear must be accessible without stopping"],
                  dropBag: ["4-6 fresh sock pairs", "3-4 fresh shirts", "2 fresh shorts/tights", "Full night kit in 50-mile bag", "Rain gear at every bag"],
                  notes: "A fresh shirt and clean socks at mile 70 can save a race psychologically. Include them.",
                },
              ].map((d) => (
                <div key={d.distance} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span>{d.icon}</span>
                    <div>
                      <p className="font-headline font-bold text-dark">{d.distance}</p>
                      <p className="text-xs text-gray">{d.time}</p>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-accent">{d.budget}</span>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-bold text-dark mb-1.5">Race Day Outfit</p>
                    <ul className="space-y-0.5">
                      {d.outfit.map((item) => (
                        <li key={item} className="text-xs text-gray flex gap-1"><span className="text-primary shrink-0">→</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-bold text-dark mb-1.5">Drop Bags</p>
                    <ul className="space-y-0.5">
                      {d.dropBag.map((item) => (
                        <li key={item} className="text-xs text-gray flex gap-1"><span className="text-gray-400 shrink-0">·</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-primary font-medium border-t border-gray-100 pt-3">{d.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Care Guide ── */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Clothing Care & Longevity</h2>
              <p className="text-gray max-w-xl mx-auto">Proper care extends the life of technical apparel by years. These aren&apos;t regular clothes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Washing Rules",
                  icon: <Sparkles className="w-6 h-6 text-primary" />,
                  tips: [
                    "Cold water always — heat degrades technical fabrics",
                    "Gentle cycle — tumble damages DWR and stretchy fibers",
                    "Sport-specific detergent (Nikwax Sport Wash, Sport Suds) — regular detergent clogs moisture-wicking",
                    "No fabric softener — ever — it destroys wicking properties",
                    "Turn garments inside out to reduce pilling",
                    "Zip all zippers before washing",
                  ],
                },
                {
                  title: "Drying Rules",
                  icon: <Wind className="w-6 h-6 text-primary" />,
                  tips: [
                    "Air dry whenever possible — extends fabric life by years",
                    "No high heat in dryer — degrades elastic and synthetic fibers",
                    "Waterproof shells: tumble dry LOW to reactivate DWR coating",
                    "Down jackets: tumble dry LOW with tennis balls to restore loft",
                    "Merino wool: lay flat to dry — hanging stretches it",
                    "Out of direct sunlight — UV degrades many fabrics",
                  ],
                },
                {
                  title: "DWR Maintenance",
                  icon: <CloudRain className="w-6 h-6 text-primary" />,
                  tips: [
                    "DWR (water-repellent coating) wears off with use and washing",
                    "Signs it's gone: jacket 'wets out' and feels heavy in rain",
                    "Restore by washing and tumble drying — heat reactivates DWR",
                    "If that fails: apply Nikwax TX.Direct or Granger's spray",
                    "Reapply every season or when performance drops",
                    "Never use regular detergent on waterproof shells",
                  ],
                },
                {
                  title: "Merino Wool Care",
                  icon: <Leaf className="w-6 h-6 text-green-500" />,
                  tips: [
                    "Wash less frequently — merino can be worn 3-5 times before washing",
                    "Use wool-specific detergent (Eucalan, Nikwax Wool Wash)",
                    "Cool water only — warm water causes felting and shrinking",
                    "Lay flat to dry — never hang or machine dry",
                    "Pilling is normal — use a fabric shaver to remove",
                    "Never bleach — destroys wool fiber permanently",
                  ],
                },
                {
                  title: "When to Replace",
                  icon: <RefreshCcw className="w-6 h-6 text-primary" />,
                  tips: [
                    "Fabric has thinned noticeably (hold to light — transparency test)",
                    "Holes or tears that can't be repaired with seam tape",
                    "Lost stretch — waistbands, cuffs that no longer grip",
                    "Persistent odor that washing can't remove (bacterial saturation)",
                    "Waterproofing can't be restored despite DWR reapplication",
                    "Seams failing in multiple places",
                  ],
                },
                {
                  title: "Warranties to Know",
                  icon: <ClipboardList className="w-6 h-6 text-primary" />,
                  tips: [
                    "Darn Tough: Unconditional lifetime warranty — replace any worn-out sock free",
                    "Patagonia: Ironclad Guarantee — repair, replace, or refund regardless of age",
                    "Arc'teryx: Lifetime limited warranty on manufacturing defects",
                    "Feetures: Lifetime guarantee on their performance socks",
                    "Smartwool: Limited lifetime guarantee on defects",
                    "Register your gear — warranties require proof of purchase",
                  ],
                },
              ].map((section) => (
                <div key={section.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="mb-3">{section.icon}</div>
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

        {/* ── FAQ ── */}
        <section id="faq" className="py-16 bg-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What should I wear for my first ultra?",
                  a: "Start simple: a moisture-wicking shirt, running shorts with a liner, quality socks (Darn Tough or Balega), and a running cap. If the course requires a rain jacket, add an Outdoor Research Helium. The most important rule: wear the exact outfit on a 15–20 mile training run before race day. Never debut anything new on race day.",
                },
                {
                  q: "Cotton or synthetic? Is it really that important?",
                  a: "Yes — this is one of the few non-negotiable rules in ultra running. Cotton absorbs sweat and stays wet, causing chafing over long distances and dangerous heat loss in cold conditions. Wet cotton against skin in cold mountains can cause hypothermia. Synthetic fabrics (polyester, nylon) and merino wool wick moisture away and dry quickly. This isn't marketing — it's physics.",
                },
                {
                  q: "Is merino wool worth the extra cost?",
                  a: "For multi-day or 100-mile races, yes — particularly for socks and base layers. Merino's odor resistance means you can wear it for 24+ hours without the bacterial buildup that synthetics develop. Temperature regulation also works in both directions. For training and shorter races, quality synthetics like Patagonia Capilene perform similarly at lower cost.",
                },
                {
                  q: "How do I prevent chafing?",
                  a: "Four-part strategy: (1) Wear moisture-wicking technical fabrics everywhere — no cotton, no rough seams. (2) Apply Squirrel's Nut Butter or Body Glide to all known problem areas before the start (inner thighs, underarms, nipples, waistband line). (3) Reapply at crew access points — anti-chafe breaks down over time. (4) Carry a small amount of anti-chafe in your vest for emergency mid-race application.",
                },
                {
                  q: "Should I wear compression?",
                  a: "The evidence for compression during running is modest. Compression socks and tights may reduce muscle vibration and perceived fatigue, and there's clearer evidence for their recovery benefits post-race. Many ultra runners swear by calf sleeves on long efforts. If you've used compression in training without issues, feel free to race in it. Don't debut it on race day.",
                },
                {
                  q: "What do I wear at night?",
                  a: "Night brings two challenges: lower temperatures and visibility. Temperature: add at least one layer even if the day was warm — desert temperatures drop 30–40°F at night, and mountains are colder still. Plan a night layer in your vest. Visibility: choose clothing with reflective elements, wear your headlamp, and consider a blinking light on your vest back. Gloves and a hat belong in every night section kit.",
                },
                {
                  q: "How many pairs of socks should I bring?",
                  a: "More than you think. For a 50K: 1 spare pair in your vest. For a 50M: 2 pairs (one per major drop bag). For a 100K: 3 pairs. For a 100M: 4–6 pairs minimum, including waterproof trail crossings. Fresh socks at mile 70 of a hundred can literally save your race — the psychological lift of clean, dry socks is real and documented.",
                },
                {
                  q: "When should I change clothes during a 100-miler?",
                  a: "At minimum: fresh socks and a dry shirt at your mile 50–60 drop bag before the night section. Ideally: fresh everything at each major drop bag opportunity. Wet, dirty clothing causes chafing that compounds over hours. A clean kit isn't a luxury in a 100-miler — it's maintenance. Your body will thank you at mile 80.",
                },
                {
                  q: "Can I wear the same outfit for training and racing?",
                  a: "Yes — and you should. Race-day clothes should be your most-tested training clothes. The worst strategy is buying special race-day gear and wearing it for the first time at mile 1. Your training outfit IS your race outfit. If you want to invest in higher-quality race-specific pieces (lighter, more pockets), break them in for 50+ miles in training first.",
                },
                {
                  q: "How do I dress for variable mountain weather?",
                  a: "The alpine layering principle: always carry more than you need, compressed as small as possible. A mountain race can go from 70°F sun to 40°F rain to 25°F wind in a single day. Your vest should always contain: a windproof layer, waterproof shell, warm hat, and gloves — even if you start in shorts and a t-shirt. Mountain weather is non-negotiable.",
                },
              ].map((item) => (
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
      </main>

      <Footer />
    </>
  );
}
