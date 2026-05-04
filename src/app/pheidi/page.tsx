import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo-metadata";
import { webApplicationJsonLd, SITE_URL } from "@/lib/schema";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getSupabase } from "@/lib/supabase";
import { claimPendingPro } from "@/lib/claim-pending-pro";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Pheidi — AI Ultra Running Coach | FinishUltra",
    description:
      "Get personalized ultra running advice 24/7 from Pheidi, your AI coach. Ask about training, gear, nutrition, and race prep.",
    path: "/pheidi",
  }),
};

const pheidiJsonLd = webApplicationJsonLd({
  name: "Pheidi — AI Ultra Running Coach",
  description:
    "Chat with Pheidi for personalized training, gear, nutrition, and race day advice built for beginner ultra runners.",
  url: `${SITE_URL}/pheidi`,
  applicationCategory: "LifestyleApplication",
});

interface PheidiPageProps {
  searchParams: Promise<{ upgraded?: string }>;
}

interface InitialAuthState {
  userId: string | null;
  userEmail: string | null;
  isPro: boolean;
}

async function loadInitialAuth(): Promise<InitialAuthState> {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { userId: null, userEmail: null, isPro: false };
    }

    // Claim any pending pro subscription tied to this email.
    let claimed = false;
    if (user.email) {
      claimed = await claimPendingPro(user.id, user.email);
    }

    // Read pro status (post-claim).
    const service = getSupabase();
    const { data: profile } = await service
      .from("profiles")
      .select("is_pro")
      .eq("id", user.id)
      .maybeSingle();

    return {
      userId: user.id,
      userEmail: user.email ?? null,
      isPro: claimed || profile?.is_pro === true,
    };
  } catch {
    return { userId: null, userEmail: null, isPro: false };
  }
}

export default async function PheidiPage({ searchParams }: PheidiPageProps) {
  const params = await searchParams;
  const justUpgraded = params.upgraded === "1";

  const initialAuth = await loadInitialAuth();
  const showAnonUpgradedPrompt = justUpgraded && !initialAuth.userId;

  return (
    <>
      <Header />
      <JsonLd data={pheidiJsonLd} />
      <main className="h-[calc(100vh-4rem)] flex bg-[#0B1120]">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex lg:w-64 flex-shrink-0 flex-col bg-[#141C2E] border-r border-[#1E293B] p-6">
          {/* Branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1A2540] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-headline text-sm font-semibold text-[#E2E8F0]">FinishUltra</h2>
              <p className="text-xs text-[#94A3B8]">Pheidi</p>
            </div>
            {initialAuth.isPro && (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 border border-primary/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.966c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.075 9.394c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
                Pro
              </span>
            )}
          </div>

          {/* Capabilities */}
          <div className="mb-auto">
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-3">I can help with</p>
            <ul className="space-y-2.5">
              {[
                { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Training Plans" },
                { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", label: "Gear Advice" },
                { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", label: "Nutrition" },
                { icon: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9", label: "Race Prep" },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-[#E2E8F0]/80">
                  <svg className="w-4 h-4 text-primary/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-[#94A3B8]/50 leading-relaxed">
            AI advice — not a replacement for medical or coaching professionals.
          </p>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0 shadow-[0_0_80px_rgba(0,102,255,0.06)]">
          {showAnonUpgradedPrompt && (
            <div className="bg-emerald-900/40 border-b border-emerald-700/60 text-emerald-100 px-6 py-3 text-sm flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-medium">Payment received — last step:</span>
              <span>
                Create your account using the same email you entered at checkout to activate Pheidi Pro.
              </span>
              <Link
                href="/login?next=/pheidi"
                className="ml-auto inline-flex items-center rounded-md bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-sm font-medium"
              >
                Sign up / sign in
              </Link>
            </div>
          )}
          <ChatInterface
            seeded
            initialUserId={initialAuth.userId}
            initialUserEmail={initialAuth.userEmail}
            initialIsPro={initialAuth.isPro}
            justUpgraded={justUpgraded && !!initialAuth.userId}
          />
        </div>
      </main>
    </>
  );
}
