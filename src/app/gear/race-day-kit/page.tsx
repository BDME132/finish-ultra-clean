import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { raceDayCategories, proTips } from "@/lib/content/race-day-kit";
import { Footprints, Package, Zap, Target, Tent, Trophy, Lightbulb, Flag } from "lucide-react";

export const metadata: Metadata = {
  title: "Ultra Marathon Race Day Kits | FinishUltra",
  description:
    "The complete race day gear checklist for ultra runners. Every product you need across 6 kit categories — on-body, hydration, nutrition, drop bag, crew, and recovery.",
  alternates: { canonical: "/gear/race-day-kit" },
};

const categoryIconComponents: Record<string, React.ReactNode> = {
  "on-body": <Footprints className="w-6 h-6 text-accent" />,
  "hydration-pack": <Package className="w-6 h-6 text-accent" />,
  nutrition: <Zap className="w-6 h-6 text-accent" />,
  "drop-bag": <Target className="w-6 h-6 text-accent" />,
  "crew-support": <Tent className="w-6 h-6 text-accent" />,
  "post-race": <Trophy className="w-6 h-6 text-accent" />,
};

export default function RaceDayKitPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
      { "@type": "ListItem", position: 2, name: "Gear", item: "https://finishultra.com/gear" },
      { "@type": "ListItem", position: 3, name: "Custom Kits", item: "https://finishultra.com/gear/kits" },
      { "@type": "ListItem", position: 4, name: "Race Day Kit", item: "https://finishultra.com/gear/race-day-kit" },
    ],
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main style={{ scrollBehavior: "smooth" }}>

        {/* Hero */}
        <section className="bg-dark py-20 sm:py-28 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #FF6B00 0%, transparent 50%), radial-gradient(circle at 80% 20%, #FF6B00 0%, transparent 40%)",
            }}
          />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              <span>TrainingPeaks Verified Checklist</span>
            </div>
            <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Ultra Marathon
              <br />
              <span className="text-accent">Race Day Kits</span>
            </h1>
            <p className="text-xl text-gray max-w-3xl mx-auto mb-10 leading-relaxed">
              Everything you need to toe the line prepared. Six kit categories, 35+ tested products,
              and the pro tips that separate finishers from DNFs.
            </p>
            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { value: "6", label: "Kit Categories" },
                { value: "35+", label: "Tested Products" },
                { value: "3", label: "Retailers Per Item" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-headline text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-gray mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sticky section nav */}
        <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
              {raceDayCategories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium text-gray hover:text-dark hover:bg-light transition-colors flex-shrink-0"
                >
                  {categoryIconComponents[cat.id]}
                  <span>{cat.title}</span>
                </a>
              ))}
              <a
                href="#pro-tips"
                className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 transition-colors flex-shrink-0 ml-auto"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Pro Tips</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Category sections */}
        {raceDayCategories.map((category, catIndex) => (
          <section
            key={category.id}
            id={category.id}
            className={`py-16 sm:py-20 ${catIndex % 2 === 0 ? "bg-white" : "bg-light"}`}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section header */}
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    {categoryIconComponents[category.id] ?? null}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">
                      Category {catIndex + 1} of {raceDayCategories.length}
                    </div>
                    <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark">
                      {category.title}
                    </h2>
                  </div>
                </div>

                {/* Pro tip callout */}
                {category.tip && (
                  <div className="flex items-start gap-3 bg-accent/5 border border-accent/20 rounded-xl p-4 mt-6">
                    <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-dark leading-relaxed">
                      <span className="font-semibold text-accent">Pro Tip: </span>
                      {category.tip}
                    </p>
                  </div>
                )}
              </div>

              {/* Product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-accent/20 transition-all duration-200 overflow-hidden group"
                  >
                    {/* Card image placeholder */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-light to-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
                      <span className="mb-2">{categoryIconComponents[category.id] ?? null}</span>
                      <span className="text-xs font-medium text-gray">
                        {product.brand}
                      </span>
                      {/* Accent hover bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </div>

                    <div className="p-5">
                      {/* Brand + price */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          {product.brand}
                        </span>
                        <span className="text-sm font-bold text-dark">
                          {product.price}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="font-headline text-lg font-bold text-dark mb-2 leading-snug">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray leading-relaxed mb-4">
                        {product.description}
                      </p>

                      {/* Affiliate links */}
                      <div className="space-y-2">
                        {product.affiliateLinks.map((link, i) => (
                          <a
                            key={link.retailer}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              i === 0
                                ? "bg-primary-dark text-white hover:bg-blue-900"
                                : "bg-light text-dark hover:bg-gray-200 border border-gray-200"
                            }`}
                          >
                            <span>{link.retailer}</span>
                            <svg
                              className="w-3.5 h-3.5 opacity-70"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA Banner */}
        <section className="bg-dark py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-4"><Flag className="w-10 h-10 text-accent" /></div>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Build Your Complete Kit?
            </h2>
            <p className="text-lg text-gray mb-8 max-w-2xl mx-auto">
              Start with the essentials and add from there. Every piece of gear here has been tested by real ultra runners. Nothing in this list is fluff.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/gear/kits"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
              >
                Build My Custom Kit
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/start-here"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                New to Ultras? Start Here
              </Link>
            </div>
          </div>
        </section>

        {/* Pro Tips section */}
        <section id="pro-tips" className="py-16 sm:py-20 bg-light">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4"><Lightbulb className="w-10 h-10 text-accent" /></div>
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">
                Race Day Pro Tips
              </h2>
              <p className="text-gray max-w-xl mx-auto">
                The things experienced ultra runners wish someone had told them at their first race.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {proTips.map((tip) => (
                <div
                  key={tip.category}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-3 py-1.5 rounded-full mb-4">
                    {tip.category}
                  </div>
                  <p className="text-dark text-sm leading-relaxed">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Affiliate Disclosure */}
        <div className="bg-white border-t border-gray-100 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-gray text-center leading-relaxed">
              <span className="font-semibold">Affiliate Disclosure:</span> FinishUltra participates in affiliate programs with REI, Amazon, Backcountry, and other retailers. When you purchase through links on this page, we may earn a small commission at no additional cost to you. We only recommend gear we&apos;d genuinely use ourselves. These commissions help keep FinishUltra free for everyone.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
