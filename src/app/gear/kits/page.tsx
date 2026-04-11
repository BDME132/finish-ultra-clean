import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import KitBuilder from "./KitBuilder";
import { faqPageJsonLd, SITE_URL, webApplicationJsonLd } from "@/lib/schema";
import { Target, DollarSign, ClipboardList, Package, Calendar, Microscope, Footprints, Flashlight, Shirt, Zap, Shield, Dumbbell } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Gear Kit Builder | FinishUltra",
  description: "Build your personalized ultra running gear kit in 10 questions. Get specific product recommendations for your distance, terrain, conditions, and budget — with packing checklists and training timelines.",
  alternates: { canonical: "/gear/kits" },
};

// ─── Types ──────────────────────────────────────────────────────────────────

type KitFeature = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

type ShowcaseKit = {
  label: string;
  distance: string;
  terrain: string;
  budget: string;
  items: { category: string; product: string; price: string }[];
  totalEst: string;
  color: string;
};

// ─── Static Data ─────────────────────────────────────────────────────────────

const FEATURES: KitFeature[] = [
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    title: "Race-Specific",
    desc: "Every recommendation is filtered by your exact distance and terrain — no generic lists.",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-primary" />,
    title: "Budget Tiers",
    desc: "See budget, standard, and premium builds for every kit. Pick the version that fits your wallet.",
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-primary" />,
    title: "Packing Checklist",
    desc: "A pre-race gear checklist built from your specific kit — never forget a critical item again.",
  },
  {
    icon: <Package className="w-6 h-6 text-primary" />,
    title: "Drop Bag Planner",
    desc: "Know exactly what goes in each drop bag and how to organize for fast transitions.",
  },
  {
    icon: <Calendar className="w-6 h-6 text-primary" />,
    title: "Testing Timeline",
    desc: "A week-by-week plan to test your kit in training so nothing fails on race day.",
  },
  {
    icon: <Microscope className="w-6 h-6 text-primary" />,
    title: "Personalized Logic",
    desc: "Sweating heavily? Sensitive stomach? Wide feet? Your answers change the recommendations.",
  },
];

const SHOWCASE_KITS: ShowcaseKit[] = [
  {
    label: "First 50K",
    distance: "50K",
    terrain: "Forest Trails",
    budget: "~$550",
    color: "from-green-500 to-emerald-600",
    items: [
      { category: "Shoes", product: "Brooks Cascadia 16", price: "$120" },
      { category: "Pack", product: "CamelBak Fastpack 5", price: "$90" },
      { category: "Shorts", product: "Patagonia Strider Pro", price: "$65" },
      { category: "Socks (2 pairs)", product: "Darn Tough Run No-Show", price: "$44" },
      { category: "Shell", product: "Outdoor Research Helium", price: "$150" },
      { category: "Nutrition Kit", product: "GU Gels + Skratch + SaltStick", price: "$80" },
    ],
    totalEst: "~$549",
  },
  {
    label: "Desert 100",
    distance: "100 Miles",
    terrain: "Desert / Open",
    budget: "~$950",
    color: "from-orange-500 to-red-500",
    items: [
      { category: "Shoes (2 pairs)", product: "Salomon Sense Ride 5 + HOKA Clifton", price: "$280" },
      { category: "Pack", product: "Ultimate Direction Zeal Pro 10L", price: "$160" },
      { category: "Lighting", product: "Petzl Iko Core + BD Backup", price: "$115" },
      { category: "Top / Shorts", product: "Patagonia Capilene Cool + Janji AFO", price: "$113" },
      { category: "Safety", product: "SPOT X Satellite + SOL Bivvy", price: "$170" },
      { category: "Nutrition", product: "Maurten Gels + Skratch + SaltStick", price: "$110" },
    ],
    totalEst: "~$948",
  },
  {
    label: "Mountain 50-Miler",
    distance: "50 Miles",
    terrain: "Alpine",
    budget: "~$1,100",
    color: "from-blue-500 to-primary",
    items: [
      { category: "Shoes", product: "HOKA Torrent 3", price: "$140" },
      { category: "Pack", product: "Ultimate Direction Ultra Vest 3.0", price: "$140" },
      { category: "Shell", product: "Arc'teryx Norvan SL Hoody", price: "$299" },
      { category: "Lighting", product: "Petzl Iko Core 500lm", price: "$80" },
      { category: "Insulation", product: "Patagonia Nano Puff Vest", price: "$179" },
      { category: "Recovery", product: "CEP Compression Socks + Foot Kit", price: "$90" },
    ],
    totalEst: "~$928",
  },
];

const CATEGORIES: { icon: React.ReactNode; name: string; desc: string; note: string }[] = [
  { icon: <Footprints className="w-6 h-6 text-primary" />, name: "Footwear", desc: "Primary race shoe + optional drop bag swap", note: "Your most important gear decision" },
  { icon: <Package className="w-6 h-6 text-primary" />, name: "Hydration Pack", desc: "5L–12L vest matched to distance and course", note: "Carry capacity determines self-sufficiency" },
  { icon: <Flashlight className="w-6 h-6 text-primary" />, name: "Lighting", desc: "Primary headlamp + mandatory backup", note: "Required for any race with night sections" },
  { icon: <Shirt className="w-6 h-6 text-primary" />, name: "Clothing", desc: "Full layer system from base to shell", note: "Nothing new on race day — test everything" },
  { icon: <Package className="w-6 h-6 text-primary" />, name: "Foot Care", desc: "Race socks + anti-blister kit + toe socks option", note: "Blisters cause more DNFs than fitness" },
  { icon: <Zap className="w-6 h-6 text-primary" />, name: "Nutrition", desc: "Gels, real food, drink mix, electrolytes", note: "GI failure is the #1 100-mile DNF cause" },
  { icon: <Shield className="w-6 h-6 text-primary" />, name: "Safety", desc: "Emergency bivvy, satellite tracker, first aid", note: "Mandatory gear varies by race — verify your list" },
  { icon: <Dumbbell className="w-6 h-6 text-primary" />, name: "Recovery", desc: "Compression socks, foot care, post-race kit", note: "Starts when the race ends — have it at the finish" },
];

const kitsWebAppJsonLd = webApplicationJsonLd({
  name: "FinishUltra Custom Gear Kit Builder",
  description:
    "Answer 10 questions. Get a complete, personalized ultra running gear kit with packing lists, drop bag plans, and a testing timeline.",
  url: `${SITE_URL}/gear/kits`,
  applicationCategory: "ShoppingApplication",
});

const FAQS = [
  {
    q: "How accurate are the budget estimates?",
    a: "Estimates are based on current MSRP at major retailers. Most items run $5–15 lower on sale or at discount retailers. Budget builds swap in more affordable alternatives in the same category — same function, less cost.",
  },
  {
    q: "Should I buy all this at once?",
    a: "No. Buy shoes first — you need 80+ training miles in your race-day pair. Then buy your pack, then work outward to clothing and accessories. Buying everything at once leads to gear you haven't tested.",
  },
  {
    q: "Can I reuse gear from previous races?",
    a: "Absolutely. The kit builder recommends new gear, but your existing tested kit should always win over something new and untested. Use the recommendations to identify gaps, not to replace what's already working.",
  },
  {
    q: "What if my race has a mandatory gear list?",
    a: "Always start with your race's mandatory gear list before anything else. Requirements vary dramatically — some mountain 100s require 4 layers, waterproof pants, and a survival kit. Compare the mandatory list to your kit builder results and fill gaps.",
  },
  {
    q: "How important is brand loyalty vs. buying what the builder recommends?",
    a: "Function > brand. If you have a shoe that doesn't blister you, don't change it. The recommendations are starting points based on category-best products — your personal proven gear should always take priority.",
  },
  {
    q: "When should I buy a second pair of shoes for a 100-miler?",
    a: "Yes for most runners. Feet swell 1–2 sizes during a 100-miler. Switching to a half-size-up max-cushion shoe at mile 60–70 reduces the chance of toenail loss and late-race foot pain. Pack them in your mile 65–70 drop bag.",
  },
];

const kitsFaqJsonLd = faqPageJsonLd(FAQS.map((f) => ({ question: f.q, answer: f.a })));

// ─── Page ────────────────────────────────────────────────────────────────────

export default function GearKitsPage() {
  return (
    <>
      <Header />
      <JsonLd data={[kitsWebAppJsonLd, kitsFaqJsonLd]} />
      <main>

        {/* ─── Hero + Kit Builder ───────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-dark to-gray-800 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full mb-5">
                <Target className="w-4 h-4" /> Personalized Gear Recommendations
              </div>
              <h1 className="font-headline text-4xl sm:text-5xl font-bold text-white mb-4">
                Build Your Custom Gear Kit
              </h1>
              <p className="text-gray-300 max-w-xl mx-auto">
                Answer 10 questions. Get a complete, personalized gear kit with packing lists, drop bag plans, and a testing timeline.
              </p>
            </div>
            <KitBuilder />
          </div>
        </section>

        {/* ─── What's Included ──────────────────────────────────────────────── */}
        <section className="py-14 bg-light">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl font-bold text-dark text-center mb-10">
              What the Kit Builder Covers
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              {CATEGORIES.map((cat) => (
                <div key={cat.name} className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                  <div className="flex justify-center mb-2">{cat.icon}</div>
                  <p className="font-headline font-bold text-dark text-sm mb-1">{cat.name}</p>
                  <p className="text-xs text-gray leading-snug">{cat.desc}</p>
                  <p className="text-xs text-primary font-medium mt-2">{cat.note}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white rounded-xl p-5 border border-gray-100 flex gap-4">
                  <span className="shrink-0">{f.icon}</span>
                  <div>
                    <p className="font-headline font-bold text-dark text-sm mb-1">{f.title}</p>
                    <p className="text-xs text-gray leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Showcase Kits ────────────────────────────────────────────────── */}
        <section className="py-16 bg-light">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl font-bold text-dark text-center mb-3">
              Example Kits
            </h2>
            <p className="text-gray text-center max-w-xl mx-auto mb-10">
              See how kits look across different race scenarios. Use the builder above for a fully personalized version.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {SHOWCASE_KITS.map((kit) => (
                <div key={kit.label} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className={`bg-gradient-to-r ${kit.color} px-5 py-4 text-white`}>
                    <p className="font-headline font-bold text-lg">{kit.label}</p>
                    <div className="flex gap-3 text-xs text-white/80 mt-1">
                      <span>{kit.distance}</span>
                      <span>·</span>
                      <span>{kit.terrain}</span>
                      <span>·</span>
                      <span>{kit.budget}</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    {kit.items.map((item) => (
                      <div key={item.product} className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-gray uppercase tracking-wide">{item.category}</p>
                          <p className="text-sm font-medium text-dark">{item.product}</p>
                        </div>
                        <span className="text-sm font-bold text-accent shrink-0">{item.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <span className="text-sm font-semibold text-dark">Estimated Total</span>
                      <span className="font-bold text-dark">{kit.totalEst}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Rules ─────────────────────────────────────────────────────────── */}
        <section className="py-16 bg-dark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl font-bold text-white text-center mb-3">
              The Rules of Ultra Gear
            </h2>
            <p className="text-gray-400 text-center max-w-xl mx-auto mb-12">
              Ten years of finishes and DNFs distilled into six rules. Every gear decision you make should pass these tests.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { rule: "01", title: "Nothing New on Race Day", body: "If you haven't worn it for 6+ hours at race effort, it doesn't go in the bag. Period. Taper week is not for gear experiments." },
                { rule: "02", title: "Foot Care is Non-Negotiable", body: "Blisters cause more DNFs than bad fitness. Lubricate before the start, check at mile 30, re-lube at any crew stop." },
                { rule: "03", title: "Test Your Nutrition in Conditions", body: "The gel that works fine on a 20-mile training run will betray you at mile 70 in heat. Simulate race conditions in training." },
                { rule: "04", title: "Layer, Don't Bulk", body: "One 10oz insulation layer you can remove beats a heavy jacket you can't. Start cold, warm up, strip layers as needed." },
                { rule: "05", title: "Mandatory Gear First", body: "Check your race's mandatory gear list before buying anything. Gear requirements vary wildly between races and regions." },
                { rule: "06", title: "Comfort Beats Features", body: "A $90 pack that doesn't bounce beats a $200 pack that chafes. Fit, comfort, and proven reliability beat specs sheets every time." },
              ].map((r) => (
                <div key={r.rule} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <p className="text-3xl font-headline font-bold text-primary/60 mb-2">{r.rule}</p>
                  <p className="font-headline font-bold text-white mb-2">{r.title}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Budget Breakdown ─────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl font-bold text-dark text-center mb-3">
              Budget Reality Check
            </h2>
            <p className="text-gray text-center max-w-xl mx-auto mb-10">
              You don't need the most expensive kit to finish. You need a tested kit. Here's what each budget tier actually gets you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  tier: "Budget",
                  range: "$300–$500",
                  color: "border-green-200 bg-green-50",
                  badge: "bg-green-100 text-green-800",
                  points: [
                    "Brooks or Saucony trail shoes",
                    "Nathan or CamelBak entry vest",
                    "Black Diamond 400lm headlamp",
                    "Patagonia or REI Co-op shorts/top",
                    "GU gels + generic electrolytes",
                    "Budget shell from Outdoor Research",
                  ],
                  verdict: "Will get you to the finish line. Most 50K and 50-mile runners don't need more.",
                },
                {
                  tier: "Standard",
                  range: "$500–$900",
                  color: "border-primary/20 bg-primary/5",
                  badge: "bg-primary/10 text-primary",
                  points: [
                    "HOKA or Salomon trail shoes (2 pairs for 100s)",
                    "Ultimate Direction or Salomon vest",
                    "Petzl 500lm rechargeable headlamp",
                    "Patagonia or Janji technical run kit",
                    "Maurten or Skratch + SaltStick",
                    "Outdoor Research or Patagonia shell",
                  ],
                  verdict: "The sweet spot. Meaningful performance gains without chasing diminishing returns.",
                },
                {
                  tier: "Premium",
                  range: "$900–$1,500+",
                  color: "border-orange-200 bg-orange-50",
                  badge: "bg-orange-100 text-orange-800",
                  points: [
                    "La Sportiva or Norda race shoes",
                    "Ultimate Direction race vest + poles",
                    "Petzl 1100lm + backup",
                    "Arc'teryx or Patagonia alpine kit",
                    "Full Maurten protocol + CEP compression",
                    "Arc'teryx Norvan SL Hoody",
                  ],
                  verdict: "Marginal gains at the margins. Worth it for technical 100-mile mountain events.",
                },
              ].map((b) => (
                <div key={b.tier} className={`rounded-2xl border-2 p-5 ${b.color}`}>
                  <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${b.badge}`}>
                    {b.tier}
                  </div>
                  <p className="font-headline font-bold text-2xl text-dark mb-4">{b.range}</p>
                  <ul className="space-y-2 mb-4">
                    {b.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-dark">
                        <span className="text-primary mt-0.5">→</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray italic">{b.verdict}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Where to Buy ─────────────────────────────────────────────────── */}
        <section className="py-12 bg-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl font-bold text-dark text-center mb-8">
              Where to Buy Your Kit
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Running Warehouse", specialty: "Largest trail shoe selection, competitive pricing, free 2-day shipping", badge: "Best for Shoes" },
                { name: "REI", specialty: "Full-service store, knowledgeable staff for pack fitting, generous return policy", badge: "Best for Packs" },
                { name: "Amazon", specialty: "Price matching, fast delivery, best for nutrition and accessories you know you want", badge: "Best for Nutrition" },
                { name: "Local Running Store", specialty: "Gait analysis, professional fitting, community knowledge of local races and terrain", badge: "Best for First-Timers" },
              ].map((s) => (
                <div key={s.name} className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-bold text-primary mb-1">{s.badge}</p>
                  <p className="font-headline font-bold text-dark mb-2">{s.name}</p>
                  <p className="text-xs text-gray leading-relaxed">{s.specialty}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl font-bold text-dark text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group border border-gray-100 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-dark bg-white hover:bg-light transition-colors list-none">
                    {faq.q}
                    <span className="text-gray group-open:rotate-180 transition-transform shrink-0 ml-3">▾</span>
                  </summary>
                  <div className="px-5 py-4 text-sm text-gray leading-relaxed bg-light border-t border-gray-100">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Disclosure ──────────────────────────────────────────────────── */}
        <section className="py-8 bg-light border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-gray text-center leading-relaxed">
              <strong>Affiliate Disclosure:</strong> Some links on this page are affiliate links. If you purchase through them, FinishUltra may earn a commission at no additional cost to you. All recommendations are based on product performance and community experience — we do not accept payment for placement.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
