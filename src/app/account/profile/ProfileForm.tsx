"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import Avatar from "@/components/account/Avatar";
import AvatarEditorModal from "@/components/account/AvatarEditorModal";
import {
  GOAL_DISTANCES,
  type AccountProfile,
  type ProfileVisibility,
  validateUsername,
} from "@/lib/account/profile";

interface FormState {
  display_name: string;
  username: string;
  bio: string;
  location: string;
  website_url: string;
  goal_distance: string;
  profile_visibility: ProfileVisibility;
  avatar_url: string | null;
}

const EMPTY_FORM: FormState = {
  display_name: "",
  username: "",
  bio: "",
  location: "",
  website_url: "",
  goal_distance: "",
  profile_visibility: "public",
  avatar_url: null,
};

function formFromProfile(profile: AccountProfile | null): FormState {
  if (!profile) return EMPTY_FORM;
  return {
    display_name: profile.display_name ?? "",
    username: profile.username ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    website_url: profile.website_url ?? "",
    goal_distance: profile.goal_distance ?? "",
    profile_visibility: profile.profile_visibility ?? "public",
    avatar_url: profile.avatar_url ?? null,
  };
}

export default function ProfileForm() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSupabaseConfigured = hasSupabaseBrowserEnv();

  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [migrationPending, setMigrationPending] = useState(false);
  const [editorSrc, setEditorSrc] = useState<string | null>(null);

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
        const res = await fetch("/api/account/profile", { credentials: "include" });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          // Check if this looks like a missing-migration scenario
          const msg: string = json.error ?? "";
          if (res.status >= 500 || msg.toLowerCase().includes("column")) {
            if (!cancelled) setMigrationPending(true);
          } else {
            if (!cancelled) setError(msg || "Could not load profile.");
          }
          return;
        }
        const json = await res.json();
        if (cancelled) return;
        setProfile(json.profile);
        setForm(formFromProfile(json.profile));
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Could not load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, router, isSupabaseConfigured]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSavedAt(null);
  }

  // Step 1: file selected → open editor
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEditorSrc(url);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Step 2: editor applied → upload cropped blob
  async function handleEditorApply(blob: Blob) {
    setEditorSrc(null);
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      const res = await fetch("/api/account/avatar", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      const newUrl = json.avatar_url as string;
      setForm((prev) => ({ ...prev, avatar_url: newUrl }));
      setProfile((prev) => (prev ? { ...prev, avatar_url: newUrl } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload avatar.");
    } finally {
      setUploading(false);
    }
  }

  function handleEditorCancel() {
    if (editorSrc) URL.revokeObjectURL(editorSrc);
    setEditorSrc(null);
  }

  function handleRemoveAvatar() {
    setForm((prev) => ({ ...prev, avatar_url: null }));
  }

  // Revoke object URLs when they're no longer needed
  useEffect(() => {
    return () => {
      if (editorSrc) URL.revokeObjectURL(editorSrc);
    };
  }, [editorSrc]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;
    setError(null);

    if (form.username) {
      const usernameCheck = validateUsername(form.username.toLowerCase());
      if (!usernameCheck.ok) {
        setError(usernameCheck.reason);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          display_name: form.display_name,
          username: form.username || null,
          bio: form.bio,
          location: form.location,
          website_url: form.website_url,
          goal_distance: form.goal_distance || null,
          profile_visibility: form.profile_visibility,
          avatar_url: form.avatar_url,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setProfile(json.profile);
      setForm(formFromProfile(json.profile));
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <h2 className="font-headline text-xl font-bold text-dark mb-2">Account unavailable</h2>
        <p className="text-gray text-sm">Add Supabase environment variables to enable profile editing.</p>
      </div>
    );
  }

  if (authLoading || loading || !user) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray">
        Loading profile...
      </div>
    );
  }

  if (migrationPending) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-3">
        <h2 className="text-base font-semibold text-amber-900">Database migration required</h2>
        <p className="text-sm text-amber-800">
          The profile features require a database migration. Apply{" "}
          <code className="font-mono text-xs bg-amber-100 px-1 rounded">
            supabase/migrations/011_account_upgrade.sql
          </code>{" "}
          to your Supabase project to enable username, avatar, bio, and public profile features.
        </p>
        <p className="text-xs text-amber-700">
          You can apply it via the Supabase dashboard SQL editor or by running{" "}
          <code className="font-mono bg-amber-100 px-1 rounded">supabase db push</code>.
        </p>
      </div>
    );
  }

  return (
    <>
      {editorSrc && (
        <AvatarEditorModal
          imageSrc={editorSrc}
          onApply={handleEditorApply}
          onCancel={handleEditorCancel}
        />
      )}

    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-medium text-gray uppercase tracking-wider mb-4">Avatar</h2>
        <div className="flex items-center gap-5">
          {/* Clickable avatar with camera overlay */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10">
              {form.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Avatar
                  profile={{ ...profile!, ...form, avatar_url: null }}
                  size="lg"
                />
              )}
            </div>
            {/* Edit overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="Change avatar"
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:cursor-not-allowed"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 border border-gray-200 text-sm font-medium text-dark rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {uploading ? "Uploading…" : "Upload photo"}
              </button>
              {form.avatar_url && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray">PNG or JPG up to 4 MB. You can drag and zoom to crop.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-medium text-gray uppercase tracking-wider">Identity</h2>

        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-dark mb-1">
            Display name
          </label>
          <input
            id="display_name"
            type="text"
            value={form.display_name}
            onChange={(e) => update("display_name", e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-dark mb-1">
            Username
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray text-sm">/u/</span>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) => update("username", e.target.value.toLowerCase())}
              placeholder="trail_runner_42"
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <p className="text-xs text-gray mt-1">
            Lowercase letters, numbers, and underscores. 3-30 characters.
          </p>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-dark mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            placeholder="Beginner ultra runner. First 50K coming up!"
            maxLength={500}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-dark mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Boulder, CO"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-dark mb-1">
              Website
            </label>
            <input
              id="website"
              type="url"
              value={form.website_url}
              onChange={(e) => update("website_url", e.target.value)}
              placeholder="https://"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-medium text-gray uppercase tracking-wider">Goals & visibility</h2>

        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-dark mb-1">
            Goal distance
          </label>
          <select
            id="goal"
            value={form.goal_distance}
            onChange={(e) => update("goal_distance", e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
          >
            <option value="">Not set</option>
            {GOAL_DISTANCES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-sm font-medium text-dark mb-2">Profile visibility</span>
          <div className="flex gap-3">
            {(["public", "private"] as const).map((value) => (
              <label
                key={value}
                className={`flex-1 px-3 py-2.5 border rounded-lg text-sm cursor-pointer transition-colors ${
                  form.profile_visibility === value
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-gray-200 text-dark hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={value}
                  checked={form.profile_visibility === value}
                  onChange={() => update("profile_visibility", value)}
                  className="sr-only"
                />
                {value === "public" ? "Public profile" : "Private"}
              </label>
            ))}
          </div>
          <p className="text-xs text-gray mt-2">
            Public profiles are visible at /u/{form.username || "your-username"} and can be followed by other runners.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
        {savedAt && <span className="text-sm text-green-600">Saved</span>}
      </div>
    </form>
    </>
  );
}
