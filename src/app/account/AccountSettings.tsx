"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createSupabaseBrowser, hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import Avatar from "@/components/account/Avatar";
import {
  PROFILE_FIELDS,
  profileDisplayName,
  type AccountProfile,
} from "@/lib/account/profile";

export default function AccountSettings() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isSupabaseConfigured = hasSupabaseBrowserEnv();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    if (!isLoading && !user) {
      router.replace("/login");
      return;
    }

    if (user) {
      const supabase = createSupabaseBrowser();
      if (!supabase) return;

      (async () => {
        // Try full profile; fall back to base fields if migration not yet applied
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(PROFILE_FIELDS)
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          // New columns don't exist yet — load base fields only
          const { data: baseData } = await supabase
            .from("profiles")
            .select("id, display_name, updated_at")
            .eq("id", user.id)
            .maybeSingle();
          if (baseData) {
            const base = baseData as { id: string; display_name: string | null };
            setProfile({
              id: base.id,
              display_name: base.display_name,
              username: null,
              bio: null,
              avatar_url: null,
              location: null,
              website_url: null,
              profile_visibility: "public",
              goal_distance: null,
            });
            setDisplayName(base.display_name || "");
          }
        } else if (profileData) {
          const typed = profileData as AccountProfile;
          setProfile(typed);
          setDisplayName(typed.display_name || "");
        }

        const { data: subRow } = await supabase
          .from("email_signups")
          .select("id")
          .eq("user_id", user.id)
          .is("unsubscribed_at", null)
          .maybeSingle();
        setIsSubscribed(!!subRow);
      })();
    }
  }, [user, isLoading, router, isSupabaseConfigured]);

  async function handleSave() {
    if (!user) return;
    const supabase = createSupabaseBrowser();
    if (!supabase) return;

    setSaving(true);
    setSaved(false);

    await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          display_name: displayName.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <h2 className="font-headline text-xl font-bold text-dark mb-2">
          Account unavailable
        </h2>
        <p className="text-gray text-sm leading-relaxed">
          Add the Supabase environment variables to <code className="font-mono text-dark">.env.local</code> to enable account features.
        </p>
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-gray text-sm">Loading...</p>
      </div>
    );
  }

  const publicProfileHref = profile?.username ? `/u/${profile.username}` : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <Avatar profile={profile} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="font-headline text-lg font-bold text-dark truncate">
              {profileDisplayName(
                profile ?? {
                  display_name: displayName || null,
                  username: null,
                },
              )}
            </p>
            <p className="text-sm text-gray truncate">{user.email}</p>
            {publicProfileHref ? (
              <Link
                href={publicProfileHref}
                className="text-xs text-primary font-medium hover:underline mt-1 inline-block"
              >
                View public profile →
              </Link>
            ) : (
              <Link
                href="/account/profile"
                className="text-xs text-primary font-medium hover:underline mt-1 inline-block"
              >
                Choose a username →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-medium text-gray uppercase tracking-wider mb-4">
          Quick edit
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Email
            </label>
            <p className="text-sm text-gray bg-light rounded-lg px-3 py-2.5">
              {user.email}
            </p>
          </div>

          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-dark mb-1"
            >
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved && <span className="text-sm text-green-600">Saved</span>}
            <Link
              href="/account/profile"
              className="text-sm text-primary font-medium hover:underline ml-auto"
            >
              Edit full profile →
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-medium text-gray uppercase tracking-wider mb-4">
          Subscription
        </h2>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${
              isSubscribed ? "text-green-600" : "text-gray"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSubscribed ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            {isSubscribed === null
              ? "Loading..."
              : isSubscribed
              ? "Subscribed to newsletter"
              : "Not subscribed to newsletter"}
          </span>
        </div>
        <p className="text-xs text-gray mt-2">
          {isSubscribed
            ? "You receive weekly ultra running tips and updates."
            : "Sign up for the newsletter on the homepage to get weekly tips."}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 border border-gray-200 text-sm font-medium text-dark rounded-lg hover:bg-gray-50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
