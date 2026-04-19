"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  UserCircle,
  History,
  Package,
  Calendar,
  PenSquare,
} from "lucide-react";

const ITEMS: { href: string; label: string; icon: React.ReactNode; exact?: boolean }[] = [
  { href: "/account", label: "Settings", icon: <Settings className="w-4 h-4" />, exact: true },
  { href: "/account/profile", label: "Profile", icon: <UserCircle className="w-4 h-4" /> },
  { href: "/account/history", label: "Race log", icon: <History className="w-4 h-4" /> },
  { href: "/account/plans", label: "Plans", icon: <Calendar className="w-4 h-4" /> },
  { href: "/account/kits", label: "Kits", icon: <Package className="w-4 h-4" /> },
  { href: "/account/posts", label: "Posts", icon: <PenSquare className="w-4 h-4" /> },
];

function isActive(pathname: string | null, href: string, exact?: boolean): boolean {
  if (!pathname) return false;
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white rounded-xl border border-gray-100 p-2 mb-6 overflow-x-auto">
      <ul className="flex md:flex-wrap gap-1 min-w-max md:min-w-0">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  active
                    ? "bg-primary text-white font-medium"
                    : "text-dark hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
