import { Metadata } from "next";
import Link from "next/link";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { faqsByCategory } from "@/lib/content/faqs";
import { pageMetadata } from "@/lib/seo-metadata";
import { absoluteUrl, itemListJsonLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Ultra Running Gear Guides | FinishUltra",
  description:
    "Build a personalized ultra running gear kit, browse shared kits from other runners, and compare shoes, packs, nutrition, and apparel.",
  path: "/gear",
});

const supportingCategories = [
  {
    title: "Shoes",
    description: "Trail shoes that protect your feet and match your terrain, fit, and budget.",
    href: "/gear/shoes",
  },
  {
    title: "Packs & Vests",
    description: "Hydration carry systems for aid-station spacing, mandatory gear, and comfort.",
    href: "/gear/packs",
  },
  {
    title: "Nutrition",
    description: "Fuel, drink mix, and electrolytes that are easier to practice before race day.",
    href: "/gear/nutrition",
  },
  {
    title: "Apparel",
    description: "Shorts, layers, shells, and socks that hold up when hours turn into all-day efforts.",
    href: "/gear/apparel",
  },
];

const gearHubSections = [
  {
    title: "Custom Gear Kits",
    description:
      "Answer 10 questions and get product-level recommendations tailored to your race, climate, runner profile, and budget.",
    href: "/gear/kits",
  },
  {
    title: "Shared Kits",
    description:
      "Browse public runner-built kits for ideas you can load into your own builder.",
    href: "/gear/race-day-kit",
  },
  {
    title: "Product Library",
    description:
      "Browse the full catalog of gear, nutrition, and accessories. Filter by category, search, and add items to your kit.",
    href: "/gear/library",
  },
  ...supportingCategories,
];

const gearHubItemListJsonLd = itemListJsonLd({
  name: "Ultra running gear pages",
  description:
    "FinishUltra gear tools and guides, including the custom kit builder, shared kits, and product category pages.",
  url: absoluteUrl("/gear"),
  items: gearHubSections.map((section) => ({
    name: section.title,
    url: absoluteUrl(section.href),
    description: section.description,
  })),
});

export default function GearPage() {
  return (
    <>
      <Header />
      <JsonLd data={gearHubItemListJsonLd} />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Gear That Gets You to the Start Line Ready
            </h1>
            <p className="text-lg text-gray max-w-3xl mx-auto">
              Start with a personalized kit if you want recommendations for your exact race, or browse shared kits if you want to see how other runners are solving similar problems.
            </p>
          </div>
        </section>

        <section className="pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.35fr,0.95fr]">
              <div className="bg-gradient-to-r from-primary to-accent p-[2px] rounded-3xl shadow-lg">
                <Link
                  href="/gear/kits"
                  className="block bg-white rounded-[22px] p-8 sm:p-10 h-full group"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6">
                    Custom Builder
                  </div>
                  <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-4">
                    Build Your Custom Gear Kit
                  </h2>
                  <p className="text-base text-gray leading-relaxed max-w-2xl mb-8">
                    Answer 10 questions about your race, terrain, climate, foot shape, sweat rate, stomach, and budget. Get a real kit, not a generic starter list.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 mb-8">
                    {[
                      "Race-specific product picks",
                      "Budget-aware recommendations",
                      "Packing and drop-bag planning",
                      "Edit and save directly to Race HQ",
                    ].map((point) => (
                      <div key={point} className="rounded-xl border border-primary/10 bg-light px-4 py-3 text-sm font-medium text-dark">
                        {point}
                      </div>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/20 px-4 py-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                    Start Building
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </div>

              <Link
                href="/gear/race-day-kit"
                className="group block rounded-3xl border border-gray-200 bg-white p-8 sm:p-10 shadow-sm hover:shadow-md transition-all"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-6">
                  Community Inspiration
                </div>
                <h2 className="font-headline text-3xl font-bold text-dark mb-4">
                  Shared Kits
                </h2>
                <p className="text-base text-gray leading-relaxed mb-6">
                  Browse public kits built by real runners. See how other people are handling terrain, budget, distance, and race-day logistics, then load their ideas into your own builder.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "Best for comparing how runners approach similar races",
                    "Useful when you want inspiration before building your own setup",
                    "Every public kit can be loaded into the custom builder",
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-2 text-sm text-dark">
                      <span className="text-accent mt-0.5">•</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Browse shared kits
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Custom Kit</p>
                <p className="text-sm text-dark">Personalized to your race, climate, runner profile, and budget. Best when you want product-level recommendations.</p>
              </div>
              <div className="rounded-2xl border border-accent/10 bg-accent/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">Shared Kits</p>
                <p className="text-sm text-dark">Public runner-built kits. Best when you want inspiration, comparisons, and real-world ideas before customizing your own setup.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-medium text-gray uppercase tracking-wider">Browse by category</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportingCategories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                >
                  <h2 className="font-headline text-xl font-bold text-dark mb-2">{category.title}</h2>
                  <p className="text-sm text-gray leading-relaxed mb-4">{category.description}</p>
                  <span className="text-sm font-semibold text-primary group-hover:underline">Explore {category.title.toLowerCase()}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FAQSection faqs={faqsByCategory.gear} title="Gear Questions, Answered" />
      </main>
      <Footer />
    </>
  );
}
