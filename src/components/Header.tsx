"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-headline text-2xl font-bold text-primary">
            FinishUltra
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              href="/kits"
              className="text-dark hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/custom-kit"
              className="text-dark hover:text-primary transition-colors"
            >
              Custom Kit
            </Link>
            <Link
              href="#contact"
              className="text-dark hover:text-primary transition-colors"
            >
              Contact
            </Link>

            {!loading && (
              <>
                {user ? (
                  <Link
                    href="/account"
                    className="flex items-center gap-2 text-dark hover:text-primary transition-colors"
                  >
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden sm:inline">Account</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                  >
                    Log In
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
