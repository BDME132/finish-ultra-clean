"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function FollowButton({
  targetUserId,
  initialFollowing,
}: {
  targetUserId: string;
  initialFollowing?: boolean;
}) {
  const { user, isLoading: authLoading } = useAuth();
  const [following, setFollowing] = useState<boolean>(!!initialFollowing);
  const [loading, setLoading] = useState(false);
  const [statusLoaded, setStatusLoaded] = useState(initialFollowing !== undefined);
  const isSelf = user?.id === targetUserId;

  useEffect(() => {
    if (statusLoaded || authLoading || !user || isSelf) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/follows?target_user_id=${encodeURIComponent(targetUserId)}`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) {
          setFollowing(!!json.following);
          setStatusLoaded(true);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [statusLoaded, authLoading, user, targetUserId, isSelf]);

  if (authLoading) {
    return <div className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
      >
        Sign in to follow
      </Link>
    );
  }

  if (isSelf) {
    return (
      <Link
        href="/account/profile"
        className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium text-dark rounded-lg hover:bg-gray-50"
      >
        Edit profile
      </Link>
    );
  }

  async function toggle() {
    setLoading(true);
    try {
      if (following) {
        const res = await fetch(`/api/follows?user_id=${encodeURIComponent(targetUserId)}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) setFollowing(false);
      } else {
        const res = await fetch("/api/follows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ user_id: targetUserId }),
        });
        if (res.ok) setFollowing(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
        following
          ? "border border-gray-200 text-dark hover:bg-gray-50"
          : "bg-primary text-white hover:bg-primary/90"
      }`}
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
