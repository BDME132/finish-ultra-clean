"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../AuthProvider";

export default function UserMenu() {
  const { user, profile, isLoading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onClick = () => setOpen(false);
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [open]);

  async function handleSignOut() {
    await signOut();
    setOpen(false);
  }

  if (isLoading) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-dark/60 hover:text-primary transition-colors"
      >
        Sign in
      </Link>
    );
  }

  const initial = (
    profile?.display_name?.[0] ||
    user.user_metadata?.full_name?.[0] ||
    user.email?.[0] ||
    "U"
  ).toUpperCase();
  const publicProfileHref = profile?.username ? `/u/${profile.username}` : null;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/20 transition-colors overflow-hidden"
        title="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt="Avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
            unoptimized
          />
        ) : (
          initial
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-lg shadow-lg py-1 min-w-[180px] z-50"
          role="menu"
          onClick={(e) => e.stopPropagation()}
        >
          {publicProfileHref && (
            <Link
              href={publicProfileHref}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-dark hover:bg-gray-50"
              role="menuitem"
            >
              View public profile
            </Link>
          )}
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-dark hover:bg-gray-50"
            role="menuitem"
          >
            Account settings
          </Link>
          <Link
            href="/account/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-dark hover:bg-gray-50"
            role="menuitem"
          >
            Edit profile
          </Link>
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-dark hover:bg-gray-50"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
