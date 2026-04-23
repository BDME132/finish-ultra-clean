"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { moreLinks, isMoreActive } from "./nav-links";

export default function MoreDropdown() {
  const pathname = usePathname() ?? "/";
  const active = isMoreActive(pathname);

  return (
    <div className="relative group">
      <button
        className={`text-sm font-medium transition-colors flex items-center gap-0.5 pb-0.5 ${
          active
            ? "text-primary border-b-2 border-accent"
            : "text-dark hover:text-primary border-b-2 border-transparent"
        }`}
      >
        More
        <svg
          className="w-3.5 h-3.5 mt-px"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150">
        <div className="bg-white border border-gray-100 rounded-lg shadow-lg py-1 min-w-[160px]">
          {moreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 text-sm transition-colors ${
                pathname.startsWith(link.href)
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
  );
}
