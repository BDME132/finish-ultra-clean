"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { usePheidi } from "./PheidiProvider";
import { useAuth } from "./AuthProvider";

const primaryLinks = [
  { href: "/training", label: "Training" },
  { href: "/gear", label: "Gear" },
  { href: "/blog", label: "Blog" },
];

const moreLinks = [
  { href: "/tools/pace-calculator", label: "Pace Calculator" },
  { href: "/tools/glossary", label: "Glossary" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/search", label: "Search" },
];

/* 16x16 pixel art: running AI coach character */
function ChatPixelArt() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-5 h-5"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* Headband - blue */}
      <rect x="5" y="1" width="1" height="1" fill="#0066FF" />
      <rect x="6" y="1" width="1" height="1" fill="#0066FF" />
      <rect x="7" y="1" width="1" height="1" fill="#0066FF" />
      <rect x="8" y="1" width="1" height="1" fill="#0066FF" />
      <rect x="9" y="1" width="1" height="1" fill="#0066FF" />
      <rect x="10" y="1" width="1" height="1" fill="#0066FF" />
      {/* Head */}
      <rect x="6" y="2" width="1" height="1" fill="#E2E8F0" />
      <rect x="7" y="2" width="1" height="1" fill="#E2E8F0" />
      <rect x="8" y="2" width="1" height="1" fill="#E2E8F0" />
      <rect x="9" y="2" width="1" height="1" fill="#E2E8F0" />
      <rect x="6" y="3" width="1" height="1" fill="#E2E8F0" />
      <rect x="7" y="3" width="1" height="1" fill="#0F172A" />
      <rect x="8" y="3" width="1" height="1" fill="#E2E8F0" />
      <rect x="9" y="3" width="1" height="1" fill="#0F172A" />
      <rect x="6" y="4" width="1" height="1" fill="#E2E8F0" />
      <rect x="7" y="4" width="1" height="1" fill="#E2E8F0" />
      <rect x="8" y="4" width="1" height="1" fill="#E2E8F0" />
      <rect x="9" y="4" width="1" height="1" fill="#E2E8F0" />
      {/* Body / shirt - dark */}
      <rect x="5" y="5" width="1" height="1" fill="#0F172A" />
      <rect x="6" y="5" width="1" height="1" fill="#0F172A" />
      <rect x="7" y="5" width="1" height="1" fill="#0F172A" />
      <rect x="8" y="5" width="1" height="1" fill="#0F172A" />
      <rect x="9" y="5" width="1" height="1" fill="#0F172A" />
      <rect x="10" y="5" width="1" height="1" fill="#0F172A" />
      {/* Arms pumping */}
      <rect x="4" y="6" width="1" height="1" fill="#E2E8F0" />
      <rect x="6" y="6" width="1" height="1" fill="#0F172A" />
      <rect x="7" y="6" width="1" height="1" fill="#0F172A" />
      <rect x="8" y="6" width="1" height="1" fill="#0F172A" />
      <rect x="9" y="6" width="1" height="1" fill="#0F172A" />
      <rect x="11" y="6" width="1" height="1" fill="#E2E8F0" />
      <rect x="3" y="7" width="1" height="1" fill="#E2E8F0" />
      <rect x="7" y="7" width="1" height="1" fill="#0F172A" />
      <rect x="8" y="7" width="1" height="1" fill="#0F172A" />
      <rect x="12" y="7" width="1" height="1" fill="#E2E8F0" />
      {/* Legs - running stride */}
      <rect x="6" y="8" width="1" height="1" fill="#0F172A" />
      <rect x="7" y="8" width="1" height="1" fill="#0F172A" />
      <rect x="8" y="8" width="1" height="1" fill="#0F172A" />
      <rect x="9" y="8" width="1" height="1" fill="#0F172A" />
      <rect x="5" y="9" width="1" height="1" fill="#0F172A" />
      <rect x="6" y="9" width="1" height="1" fill="#0F172A" />
      <rect x="9" y="9" width="1" height="1" fill="#0F172A" />
      <rect x="10" y="9" width="1" height="1" fill="#0F172A" />
      <rect x="4" y="10" width="1" height="1" fill="#0F172A" />
      <rect x="5" y="10" width="1" height="1" fill="#0F172A" />
      <rect x="10" y="10" width="1" height="1" fill="#0F172A" />
      <rect x="11" y="10" width="1" height="1" fill="#0F172A" />
      {/* Shoes - orange */}
      <rect x="3" y="11" width="1" height="1" fill="#FF6B00" />
      <rect x="4" y="11" width="1" height="1" fill="#FF6B00" />
      <rect x="11" y="11" width="1" height="1" fill="#FF6B00" />
      <rect x="12" y="11" width="1" height="1" fill="#FF6B00" />
      <rect x="2" y="12" width="1" height="1" fill="#FF6B00" />
      <rect x="3" y="12" width="1" height="1" fill="#FF6B00" />
      <rect x="12" y="12" width="1" height="1" fill="#FF6B00" />
      <rect x="13" y="12" width="1" height="1" fill="#FF6B00" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openPheidi } = usePheidi();
  const { user, isLoading: authLoading } = useAuth();
  const isMoreActive = pathname?.startsWith("/tools") || pathname?.startsWith("/faq") || pathname?.startsWith("/about") || pathname?.startsWith("/contact") || pathname?.startsWith("/newsletter") || pathname?.startsWith("/search");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`border-b border-gray-100 sticky top-0 z-50 transition-all duration-200 ${scrolled ? "nav-scrolled" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-headline text-2xl font-bold text-primary">
            FinishUltra
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors pb-0.5 ${
                  pathname?.startsWith(link.href)
                    ? "text-primary border-b-2 border-accent"
                    : "text-dark hover:text-primary border-b-2 border-transparent"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative group">
              <button
                className={`text-sm font-medium transition-colors flex items-center gap-0.5 pb-0.5 ${
                  isMoreActive
                    ? "text-primary border-b-2 border-accent"
                    : "text-dark hover:text-primary border-b-2 border-transparent"
                }`}
              >
                More
                <svg className="w-3.5 h-3.5 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150">
                <div className="bg-white border border-gray-100 rounded-lg shadow-lg py-1 min-w-[160px]">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        pathname?.startsWith(link.href)
                          ? "text-primary bg-primary/5"
                          : "text-dark hover:text-primary hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Coach — pill button with pixel art hover */}
            <button
              onClick={openPheidi}
              className={`text-sm font-medium transition-all group border rounded-md px-3 py-1 ${
                pathname?.startsWith("/pheidi")
                  ? "text-white bg-primary border-primary"
                  : "text-primary border-primary/40 hover:bg-primary hover:text-white hover:border-primary"
              }`}
            >
              <span className="block overflow-hidden h-5">
                <span className="flex flex-col transition-transform duration-[250ms] ease-in-out group-hover:-translate-y-5">
                  <span className="h-5 flex items-center">AI Coach</span>
                  <span className="h-5 flex items-center justify-center">
                    <ChatPixelArt />
                  </span>
                </span>
              </span>
            </button>

            {/* Dashboard + Auth */}
            <Link
              href="/race-hq"
              className={`text-sm font-medium transition-colors pb-0.5 ${
                pathname?.startsWith("/race-hq")
                  ? "text-primary border-b-2 border-accent"
                  : "text-dark hover:text-primary border-b-2 border-transparent"
              }`}
            >
              Dashboard
            </Link>
            {!authLoading && (
              user ? (
                <Link
                  href="/account"
                  className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                  title="Account"
                >
                  {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-dark/60 hover:text-primary transition-colors"
                >
                  Sign in
                </Link>
              )
            )}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-dark hover:text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-3">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium px-2 py-1 transition-colors ${
                    pathname?.startsWith(link.href)
                      ? "text-primary"
                      : "text-dark hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* More section */}
              <p className="text-[11px] font-medium text-gray uppercase tracking-wider px-2 pt-2">More</p>
              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium px-2 py-1 pl-4 transition-colors ${
                    pathname?.startsWith(link.href)
                      ? "text-primary"
                      : "text-dark hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* AI Coach */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openPheidi();
                }}
                className={`text-sm font-medium px-3 py-2 mt-2 border rounded-md text-center transition-all ${
                  pathname?.startsWith("/pheidi")
                    ? "text-white bg-primary border-primary"
                    : "text-primary border-primary/40"
                }`}
              >
                AI Coach
              </button>

              {/* Dashboard + Auth (mobile) */}
              <Link
                href="/race-hq"
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium px-3 py-2 border rounded-md text-center transition-colors ${
                  pathname?.startsWith("/race-hq")
                    ? "border-primary text-primary bg-primary/5"
                    : "border-gray-200 text-dark hover:text-primary"
                }`}
              >
                Dashboard
              </Link>
              {!authLoading && (
                user ? (
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium px-3 py-2 border border-gray-200 rounded-md text-center text-dark hover:text-primary transition-colors"
                  >
                    Account
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium px-3 py-2 border border-gray-200 rounded-md text-center text-dark hover:text-primary transition-colors"
                  >
                    Sign in
                  </Link>
                )
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
