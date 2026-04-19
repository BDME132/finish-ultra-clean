import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserCard from "@/components/account/UserCard";
import {
  createSupabaseServer,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";
import {
  PROFILE_FIELDS,
  profileDisplayName,
  type AccountProfile,
} from "@/lib/account/profile";
import {
  FOLLOW_PROFILE_FIELDS,
  type FollowProfile,
} from "@/lib/account/follows";
import { pageMetadata } from "@/lib/seo-metadata";

async function loadProfile(username: string): Promise<AccountProfile | null> {
  if (!hasSupabaseServerEnv()) return null;
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .ilike("username", username)
    .maybeSingle();
  if (!data) return null;
  const profile = data as AccountProfile;
  if (profile.profile_visibility !== "public") return null;
  return profile;
}

async function loadFollowers(userId: string): Promise<FollowProfile[]> {
  const supabase = await createSupabaseServer();
  const { data: rows } = await supabase
    .from("follows")
    .select("follower_user_id, created_at")
    .eq("followed_user_id", userId)
    .order("created_at", { ascending: false });
  const ids = ((rows as { follower_user_id: string }[]) ?? []).map((r) => r.follower_user_id);
  if (ids.length === 0) return [];
  const { data: profiles } = await supabase
    .from("profiles")
    .select(FOLLOW_PROFILE_FIELDS)
    .in("id", ids);
  const map = new Map(((profiles as FollowProfile[]) ?? []).map((p) => [p.id, p]));
  return ids
    .map((id) => map.get(id))
    .filter((p): p is FollowProfile => Boolean(p));
}

export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> },
): Promise<Metadata> {
  const { username } = await params;
  return pageMetadata({
    title: `Followers of @${username} | FinishUltra`,
    description: `Runners following @${username} on FinishUltra.`,
    path: `/u/${username}/followers`,
  });
}

export default async function PublicFollowersPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) notFound();
  const followers = await loadFollowers(profile.id);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href={`/u/${profile.username}`}
            className="text-sm text-primary hover:underline"
          >
            ← Back to {profileDisplayName(profile)}
          </Link>
          <h1 className="font-headline text-3xl font-bold text-dark mt-2 mb-6">
            Followers
          </h1>
          {followers.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray">
              No followers yet.
            </div>
          ) : (
            <ul className="space-y-2">
              {followers.map((p) => (
                <UserCard key={p.id} profile={p} />
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
