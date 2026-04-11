import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import EmailSignupForm from "@/components/EmailSignupForm";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo-metadata";
import { howToJsonLd, SITE_URL } from "@/lib/schema";
import {
  Footprints,
  Dumbbell,
  Calculator,
  ClipboardList,
  BookOpen,
  Timer,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Start Here — Your First Ultra Roadmap | FinishUltra",
    description:
      "New to ultra running? Follow these 5 steps to go from curious runner to finishing your first ultramarathon.",
    path: "/start-here",
  }),
};

/* ───────────────────────── data ───────────────────────── */

const paths = [
  {
    label: "Building a Base",
    fitness: "Can run 3–6 miles",
    href: "/training/base-building",
    cta: "12-Week Base Plan",
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    icon: Footprints,
  },
  {
    label: "Ready to Train",
    fitness: "Can run a half marathon",
    href: "/training/first-50k",
    cta: "16-Week First 50K Plan",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-primary",
    icon: Dumbbell,
  },
  {
    label: "Race Coming Up",
    fitness: "Training is done",
    href: "/training/race-week",
    cta: "Race Week Protocol",
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    icon: Timer,
  },
];

const roadmap = [
  {
    step: 1,
    title: "Learn What You're Getting Into",
    description:
      "Ultra running isn't a mystery — it's just running far. Understand what race day actually looks like and learn the lingo before you dive in.",
    links: [
      { href: "/blog/how-hard-is-a-50k", label: "How Hard Is a 50K, Really?" },
      { href: "/blog/beginner-mistakes-ultra-marathon", label: "12 Mistakes Every Beginner Makes" },
      { href: "/tools/glossary", label: "Ultra Glossary" },
    ],
  },
  {
    step: 2,
    title: "Pick Your Race",
    description:
      "Choose a distance that excites you without terrifying you. A 50K is only 4.9 miles longer than a marathon, and most races have generous cutoffs.",
    links: [
      { href: "/blog/choosing-first-ultra", label: "How to Choose Your First Ultra" },
    ],
  },
  {
    step: 3,
    title: "Build Your Custom Gear Kit",
    description:
      "Skip the generic starter lists. Tell us about your race distance, terrain, climate, and budget — we'll build a personalized gear recommendation tailored to exactly what you need.",
    links: [
      { href: "/gear/kits", label: "Build Your Kit", primary: true },
      { href: "/gear/shoes", label: "Trail Shoes" },
      { href: "/blog/what-to-wear-first-ultra", label: "What to Wear" },
      { href: "/blog/best-running-vests-2025", label: "Best Running Vests" },
    ],
  },
  {
    step: 4,
    title: "Train Smart",
    description:
      "Follow a structured plan that builds mileage gradually, includes back-to-back long runs, and has nutrition practice baked in.",
    links: [
      { href: "/training/first-50k", label: "First 50K Plan" },
      { href: "/training/base-building", label: "Base Building Plan" },
      { href: "/blog/strength-training-ultra-runners", label: "Strength Training" },
      { href: "/training/plans", label: "Custom Plan Builder" },
    ],
  },
  {
    step: 5,
    title: "Nail Nutrition & Race Day",
    description:
      "Nutrition is the #1 reason first-timers DNF. Practice eating on long runs, finalize your gear, and trust your training when race week arrives.",
    links: [
      { href: "/blog/ultra-nutrition-beginners", label: "Nutrition Guide" },
      { href: "/blog/electrolyte-guide-ultra-runners", label: "Electrolyte Guide" },
      { href: "/blog/real-food-ultra-marathon", label: "Real Food for Ultras" },
      { href: "/training/race-week", label: "Race Week Protocol" },
      { href: "/blog/race-day-checklist", label: "Race Day Checklist" },
    ],
  },
];

const tools = [
  {
    icon: Calculator,
    title: "Pace Calculator",
    description: "Plan your finish time with aid stops and slowdown factor.",
    href: "/tools/pace-calculator",
  },
  {
    icon: Wrench,
    title: "Custom Gear Builder",
    description: "Answer a few questions, get a personalized gear list for your race.",
    href: "/gear/kits",
  },
  {
    icon: ClipboardList,
    title: "Plan Builder",
    description: "Custom plans by distance, level, and timeline.",
    href: "/training/plans",
  },
  {
    icon: BookOpen,
    title: "Ultra Glossary",
    description: "Every term in plain English.",
    href: "/tools/glossary",
  },
];

const essentialReads = [
  {
    href: "/blog/how-hard-is-a-50k",
    title: "How Hard Is a 50K, Really?",
    category: "Getting Started",
    readTime: "5 min",
  },
  {
    href: "/blog/first-50k-training-guide",
    title: "The No-BS 50K Training Guide",
    category: "Training",
    readTime: "7 min",
  },
  {
    href: "/blog/ultra-nutrition-beginners",
    title: "Ultra Nutrition for Beginners",
    category: "Nutrition",
    readTime: "4 min",
  },
  {
    href: "/blog/beginner-mistakes-ultra-marathon",
    title: "12 Mistakes Every Beginner Makes",
    category: "Race Day",
    readTime: "8 min",
  },
];

const pheidiPrompts = [
  "I want to run my first 50K",
  "What shoes should I get?",
  "Help me make a nutrition plan",
  "How do I train for an ultra?",
];

/* ───────────────────────── page ───────────────────────── */

const startHereHowToJsonLd = howToJsonLd({
  name: "How to Prepare for Your First Ultra Marathon",
  description:
    "Follow these five steps — in order or at your own pace — to go from curious runner to ultramarathoner.",
  steps: roadmap.map((r) => ({
    name: r.title,
    text: r.description,
    url: `${SITE_URL}/start-here#step-${r.step}`,
  })),
});

export default function StartHerePage() {
  return (
    <>
      <Header />
      <JsonLd data={startHereHowToJsonLd} />
      <main>
        {/* ── 1. Hero ── */}
        <section className="bg-gradient-to-b from-light to-white py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-6">
              Everything You Need for Your First Ultra
            </h1>
            <p className="text-lg sm:text-xl text-gray max-w-2xl mx-auto mb-10">
              No gatekeeping. No jargon. Just a clear, step-by-step path from where you are now to crossing your first finish line.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#roadmap"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
              >
                See the Roadmap
              </a>
              <Link
                href="/pheidi"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary bg-white border-2 border-primary rounded-lg hover:bg-light transition-colors"
              >
                Talk to Pheidi (AI Coach)
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. Where Are You? — Three Paths ── */}
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark text-center mb-3">
              Where Are You Right Now?
            </h2>
            <p className="text-gray text-center max-w-xl mx-auto mb-12">
              Pick the path that matches your current fitness and we&apos;ll point you to the right plan.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paths.map((p) => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.href}
                    href={p.href}
                    className={`block rounded-xl border-2 ${p.color} p-6 text-center hover:shadow-md transition-all group`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${p.iconColor}`} />
                    <h3 className="font-headline text-lg font-bold text-dark mb-1">
                      {p.label}
                    </h3>
                    <p className="text-sm text-gray mb-4">{p.fitness}</p>
                    <span className="text-sm font-medium text-primary group-hover:underline">
                      {p.cta} &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 3. Five-Step Roadmap ── */}
        <section id="roadmap" className="bg-light py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark text-center mb-3">
              Your 5-Step Roadmap
            </h2>
            <p className="text-gray text-center max-w-xl mx-auto mb-14">
              Follow these steps — in order or at your own pace — and you&apos;ll be ready for race day.
            </p>

            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-primary/20 hidden sm:block" />

              <div className="space-y-12">
                {roadmap.map((item) => (
                  <div
                    key={item.step}
                    id={`step-${item.step}`}
                    className="flex gap-6 relative scroll-mt-28"
                  >
                    {/* Step number */}
                    <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center relative z-10">
                      <span className="text-white font-headline font-bold text-lg">
                        {item.step}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="pt-1">
                      <h3 className="font-headline text-xl font-bold text-dark mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray leading-relaxed mb-3">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={
                              "primary" in link && link.primary
                                ? "inline-flex items-center text-sm font-medium text-white bg-primary rounded-full px-4 py-1.5 hover:bg-primary-dark transition-colors"
                                : "inline-flex items-center text-sm font-medium text-primary bg-white border border-primary/20 rounded-full px-3 py-1 hover:bg-primary hover:text-white transition-colors"
                            }
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Free Tools Strip ── */}
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark text-center mb-12">
              Free Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-primary/20 transition-all group"
                  >
                    <Icon className="w-7 h-7 text-primary mb-3" />
                    <h3 className="font-headline text-base font-bold text-dark mb-1 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray">{tool.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. Essential Reading ── */}
        <section className="bg-light py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark text-center mb-12">
              Essential Reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {essentialReads.map((post) => (
                <Link
                  key={post.href}
                  href={post.href}
                  className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-primary/20 transition-all group"
                >
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="font-headline text-base font-bold text-dark mt-2 mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <span className="text-xs text-gray">{post.readTime} read</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Pheidi CTA ── */}
        <section className="bg-dark py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-3">
              Meet Pheidi — Your AI Ultra Coach
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Not sure where to start? Pheidi can build you a personalized plan, recommend gear, and answer any question about ultra running — no experience required.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {pheidiPrompts.map((prompt) => (
                <span
                  key={prompt}
                  className="bg-white/10 text-white/80 text-sm rounded-full px-4 py-2 border border-white/10"
                >
                  &ldquo;{prompt}&rdquo;
                </span>
              ))}
            </div>
            <Link
              href="/pheidi"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-dark bg-white rounded-lg hover:bg-light transition-colors"
            >
              Chat with Pheidi
            </Link>
          </div>
        </section>

        {/* ── 7. Newsletter Signup ── */}
        <section className="bg-primary py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-headline text-3xl font-bold text-white mb-3">
              One Email a Week. That&apos;s It.
            </h2>
            <p className="text-white/80 mb-8">
              Training tips, gear reviews, and beginner Q&amp;A — delivered every week. Free, no spam, unsubscribe anytime.
            </p>
            <div className="flex justify-center">
              <EmailSignupForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
