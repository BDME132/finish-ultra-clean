"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePheidi } from "../PheidiProvider";
import { useAuth } from "../AuthProvider";
import { primaryLinks, moreLinks } from "./nav-links";

export default function MobileMenu() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const { openPheidi } = usePheidi();
  const { user, profile, isLoading } = useAuth();

  const publicProfileHref = profile?.username ? `/u/${profile.username}` : null;

  return (
    <>
      {/* Toggle button */}
      <button
        className="md:hidden p-2 text-dark hover:text-primary transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Panel — rendered outside the header row so it takes full width */}
      {open && (
        <nav className="md:hidden absolute left-0 right-0 top-16 bg-white border-b border-gray-100 z-40 px-4 sm:px-6 lg:px-8 pb-4 pt-4">
          <div className="flex flex-col gap-3 max-w-6xl mx-auto">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium px-2 py-1 transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-primary"
                    : "text-dark hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <p className="text-[11px] font-medium text-gray uppercase tracking-wider px-2 pt-2">
              More
            </p>
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium px-2 py-1 pl-4 transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-primary"
                    : "text-dark hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => {
                setOpen(false);
                openPheidi();
              }}
              className={`text-sm font-medium px-3 py-2 mt-2 border rounded-md text-center transition-all ${
                pathname.startsWith("/pheidi")
                  ? "text-white bg-primary border-primary"
                  : "text-primary border-primary/40"
              }`}
            >
              AI Coach
            </button>

            <Link
              href="/race-hq"
              onClick={() => setOpen(false)}
              className={`text-sm font-medium px-3 py-2 border rounded-md text-center transition-colors ${
                pathname.startsWith("/race-hq")
                  ? "border-primary text-primary bg-primary/5"
                  : "border-gray-200 text-dark hover:text-primary"
              }`}
            >
              Dashboard
            </Link>

            {!isLoading && user && (
              <>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium px-3 py-2 border border-gray-200 rounded-md text-center text-dark hover:text-primary transition-colors"
                >
                  Account
                </Link>
                {publicProfileHref && (
                  <Link
                    href={publicProfileHref}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium px-3 py-2 border border-gray-200 rounded-md text-center text-dark hover:text-primary transition-colors"
                  >
                    Public profile
                  </Link>
                )}
              </>
            )}
            {!isLoading && !user && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sm font-medium px-3 py-2 border border-gray-200 rounded-md text-center text-dark hover:text-primary transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
