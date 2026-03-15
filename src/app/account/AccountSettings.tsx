"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createSupabaseBrowser, hasSupabaseBrowserEnv } from "@/lib/supabase/client";

interface Profile {
  display_name: string | null;
  is_newsletter_subscriber: boolean;
}

export default function AccountSettings() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
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

      supabase
        .from("profiles")
        .select("display_name, is_newsletter_subscriber")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setProfile(data);
            setDisplayName(data.display_name || "");
          }
        });
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
      .update({
        display_name: displayName.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

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

  return (
    <div className="space-y-6">
      {/* Email (read-only) */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-medium text-gray uppercase tracking-wider mb-4">
          Profile
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
            {saved && (
              <span className="text-sm text-green-600">Saved</span>
            )}
          </div>
        </div>
      </div>

      {/* Subscription status */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-medium text-gray uppercase tracking-wider mb-4">
          Subscription
        </h2>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${
              profile?.is_newsletter_subscriber
                ? "text-green-600"
                : "text-gray"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                profile?.is_newsletter_subscriber
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
            {profile?.is_newsletter_subscriber
              ? "Subscribed to newsletter"
              : "Not subscribed to newsletter"}
          </span>
        </div>
        <p className="text-xs text-gray mt-2">
          {profile?.is_newsletter_subscriber
            ? "You receive weekly ultra running tips and updates."
            : "Sign up for the newsletter on the homepage to get weekly tips."}
        </p>
      </div>

      {/* Sign out */}
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
