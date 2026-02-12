import Link from "next/link";

const features = [
  {
    title: "AI Coach",
    description: "Get personalized ultra running advice 24/7. Ask about training, nutrition, gear — anything a beginner needs to know.",
    href: "/chat",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    title: "Gear Kits",
    description: "Curated bundles for every distance. No overwhelm, no guesswork — just the gear you actually need.",
    href: "/gear/kits",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "Free Training Plans",
    description: "Your first 50K in 16 weeks. Structured plans built for beginners, with nutrition and gear tips baked in.",
    href: "/training",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-3xl font-bold text-dark text-center mb-4">
          Everything You Need to Get Started
        </h2>
        <p className="text-gray text-center mb-12 max-w-2xl mx-auto">
          Built by beginners, for beginners. No gatekeeping, no jargon — just the stuff that actually helps.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-headline text-xl font-bold text-dark mb-3">
                {feature.title}
              </h3>
              <p className="text-gray text-sm leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
