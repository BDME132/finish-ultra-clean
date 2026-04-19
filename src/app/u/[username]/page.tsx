import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, MapPin, Trophy } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Avatar from "@/components/account/Avatar";
import {
  createSupabaseServer,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";
import {
  PROFILE_FIELDS,
  profileDisplayName,
  type AccountProfile,
  type PublicProfileSummary,
} from "@/lib/account/profile";
import { pageMetadata } from "@/lib/seo-metadata";

interface PublicKitSummary {
  id: string;
  slug: string;
  kit_title: string;
  kit_subtitle: string;
  total_cost: number;
  published_at: string;
}

interface PublicPlanSummary {
  id: string;
  slug: string;
  plan_title: string;
  race_name: string | null;
  distance: string;
  level: string;
  race_date: string;
  published_at: string;
}

interface PublicRaceSummary {
  id: string;
  race_name: string | null;
  race_date: string;
  distance: string;
  finish_time: string | null;
  dnf: boolean;
}

interface PublicProfilePayload {
  profile: PublicProfileSummary;
  kits: PublicKitSummary[];
  plans: PublicPlanSummary[];
  races: PublicRaceSummary[];
}

async function loadPublicProfile(username: string): Promise<PublicProfilePayload | null> {
  if (!hasSupabaseServerEnv()) return null;
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .ilike("username", username)
    .maybeSingle();

  if (error || !data) return null;
  const profile = data as AccountProfile;
  if (profile.profile_visibility !== "public") return null;

  const [
    { data: kits },
    { data: plans },
    { data: races },
  ] = await Promise.all([
    supabase
      .from("public_kits")
      .select("id, slug, kit_title, kit_subtitle, total_cost, published_at")
      .eq("user_id", profile.id)
      .order("published_at", { ascending: false })
      .limit(6),
    supabase
      .from("public_training_plans")
      .select("id, slug, plan_title, race_name, distance, level, race_date, published_at")
      .eq("user_id", profile.id)
      .order("published_at", { ascending: false })
      .limit(6),
    supabase
      .from("race_results")
      .select("id, race_name, race_date, distance, finish_time, dnf")
      .eq("user_id", profile.id)
      .order("race_date", { ascending: false })
      .limit(6),
  ]);

  const summary: PublicProfileSummary = {
    id: profile.id,
    username: profile.username ?? username,
    display_name: profile.display_name,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    location: profile.location,
    website_url: profile.website_url,
    goal_distance: profile.goal_distance,
    follower_count: 0,
    following_count: 0,
  };

  return {
    profile: summary,
    kits: (kits as PublicKitSummary[]) ?? [],
    plans: (plans as PublicPlanSummary[]) ?? [],
    races: (races as PublicRaceSummary[]) ?? [],
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> },
): Promise<Metadata> {
  const { username } = await params;
  const data = await loadPublicProfile(username);
  if (!data) {
    return pageMetadata({
      title: `Runner not found | FinishUltra`,
      description: "This profile is private or does not exist.",
      path: `/u/${username}`,
      robots: { index: false, follow: false },
    });
  }
  const name = profileDisplayName(data.profile);
  return pageMetadata({
    title: `${name} (@${data.profile.username}) | FinishUltra`,
    description:
      data.profile.bio ||
      `Public profile for ${name} on FinishUltra. Follow their training plans, kits, and races.`,
    path: `/u/${data.profile.username}`,
  });
}

function formatDate(date: string): string {
  return new Date(`${date}${date.length === 10 ? "T00:00:00" : ""}`).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await loadPublicProfile(username);

  if (!data) notFound();

  const { profile, kits, plans, races } = data;
  const name = profileDisplayName(profile);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <Avatar profile={profile} size="xl" />
              <div className="flex-1 min-w-0">
                <h1 className="font-headline text-3xl font-bold text-dark">{name}</h1>
                <p className="text-gray mt-1">@{profile.username}</p>
                {profile.bio && <p className="text-dark mt-3 max-w-prose">{profile.bio}</p>}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </span>
                  )}
                  {profile.goal_distance && (
                    <span className="inline-flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      Goal: {profile.goal_distance}
                    </span>
                  )}
                  {profile.website_url && (
                    <a
                      href={profile.website_url}
                      rel="noopener noreferrer nofollow"
                      target="_blank"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {plans.length > 0 && (
            <Section title="Public training plans">
              <ul className="grid sm:grid-cols-2 gap-3">
                {plans.map((plan) => (
                  <li key={plan.id} className="border border-gray-100 rounded-lg p-4 bg-white">
                    <Link
                      href={`/training/shared-plans/${plan.slug}`}
                      className="font-semibold text-dark hover:text-primary"
                    >
                      {plan.plan_title}
                    </Link>
                    <p className="text-sm text-gray mt-1">
                      {plan.race_name || `${plan.distance} plan`} · {plan.distance} ·{" "}
                      {plan.level}
                    </p>
                    <p className="text-xs text-gray mt-1">Race day {formatDate(plan.race_date)}</p>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {kits.length > 0 && (
            <Section title="Public gear kits">
              <ul className="grid sm:grid-cols-2 gap-3">
                {kits.map((kit) => (
                  <li key={kit.id} className="border border-gray-100 rounded-lg p-4 bg-white">
                    <Link
                      href={`/gear/race-day-kit/${kit.slug}`}
                      className="font-semibold text-dark hover:text-primary"
                    >
                      {kit.kit_title}
                    </Link>
                    <p className="text-sm text-gray mt-1">{kit.kit_subtitle}</p>
                    <p className="text-xs text-gray mt-1">{formatPrice(kit.total_cost)}</p>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {races.length > 0 && (
            <Section title="Race log">
              <ul className="space-y-2">
                {races.map((race) => (
                  <li
                    key={race.id}
                    className="border border-gray-100 rounded-lg p-4 bg-white flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-dark">
                        {race.race_name || race.distance}
                      </p>
                      <p className="text-xs text-gray mt-0.5">
                        {formatDate(race.race_date)} · {race.distance}
                      </p>
                    </div>
                    <p className="text-sm font-mono text-dark">
                      {race.dnf ? <span className="text-red-600">DNF</span> : race.finish_time || "—"}
                    </p>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {plans.length === 0 && kits.length === 0 && races.length === 0 && (
            <Section title="Activity">
              <p className="text-sm text-gray">
                {name} hasn&apos;t published any public training plans, kits, or race results yet.
              </p>
            </Section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-sm font-medium text-gray uppercase tracking-wider mb-3">{title}</h2>
      {children}
    </section>
  );
}
