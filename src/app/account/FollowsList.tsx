"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import UserCard from "@/components/account/UserCard";
import type { FollowEdge } from "@/lib/account/follows";

export default function FollowsList({ direction }: { direction: "followers" | "following" }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const isSupabaseConfigured = hasSupabaseBrowserEnv();
  const [edges, setEdges] = useState<FollowEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/follows?direction=${direction}&user_id=${encodeURIComponent(user.id)}`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        if (!cancelled) setEdges(json.edges ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, router, isSupabaseConfigured, direction]);

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-gray">Add Supabase env vars to use the social graph.</p>
      </div>
    );
  }

  if (authLoading || loading || !user) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-sm font-medium text-gray uppercase tracking-wider mb-4">
        {direction === "followers" ? "Followers" : "Following"}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {edges.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray">
          <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          {direction === "followers"
            ? "No followers yet. Share your profile to get started."
            : "Not following anyone yet. Find runners to follow on /u/[username] pages."}
        </div>
      ) : (
        <ul className="space-y-2">
          {edges.map((edge) => (
            <UserCard key={edge.profile.id} profile={edge.profile} />
          ))}
        </ul>
      )}
    </div>
  );
}
