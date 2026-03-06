"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/start-here", label: "Start Here" },
  { href: "/gear", label: "Gear" },
  { href: "/training", label: "Training" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/about", label: "About" },
  { href: "/pheidi", label: "Pheidi" },
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

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-headline text-2xl font-bold text-primary">
            FinishUltra
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.label === "Pheidi" ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all group border rounded-md px-3 py-1 ${
                    pathname?.startsWith(link.href)
                      ? "text-white bg-primary border-primary"
                      : "text-primary border-primary/40 hover:bg-primary hover:text-white hover:border-primary"
                  }`}
                >
                  <span className="block overflow-hidden h-5">
                    <span className="flex flex-col transition-transform duration-[250ms] ease-in-out group-hover:-translate-y-5">
                      <span className="h-5 flex items-center">Pheidi</span>
                      <span className="h-5 flex items-center justify-center">
                        <ChatPixelArt />
                      </span>
                    </span>
                  </span>
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname?.startsWith(link.href)
                      ? "text-primary"
                      : "text-dark hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

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

        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
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
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
