import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gear | FinishUltra",
  description: "Honest gear recommendations for beginner ultra runners. Curated kits, shoe guides, pack reviews, and nutrition picks.",
};

const categories = [
  {
    title: "Curated Kits",
    description: "Pre-built gear bundles for specific distances. Everything you need, nothing you don't.",
    href: "/gear/kits",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "Shoes",
    description: "Trail shoes that protect your feet and grip the terrain. Our picks for every surface and budget.",
    href: "/gear/shoes",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Packs & Vests",
    description: "Running vests and hydration packs to carry water, nutrition, and required gear on race day.",
    href: "/gear/packs",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
      </svg>
    ),
  },
  {
    title: "Nutrition",
    description: "Fuel that keeps you moving. Drinks, gels, and real-food options that are easy on the stomach.",
    href: "/gear/nutrition",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: "Apparel",
    description: "Shorts, socks, and layers that handle sweat, rain, and 50+ miles without chafing.",
    href: "/gear/apparel",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
];

export default function GearPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Gear Guide
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Honest recommendations from runners who are still learning too. Every product here is something we&apos;d actually use.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-primary/20 transition-all"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {cat.icon}
                  </div>
                  <h2 className="font-headline text-xl font-bold text-dark mb-2">
                    {cat.title}
                  </h2>
                  <p className="text-gray text-sm leading-relaxed">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
