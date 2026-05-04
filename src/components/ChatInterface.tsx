"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const FREE_LIMIT = 5;

const suggestedPrompts = [
  "I want to run my first 50K",
  "What shoes should I get?",
  "Help me make a nutrition plan",
  "How do I train for an ultra?",
];

interface ChatInterfaceProps {
  initialUserId?: string | null;
  initialUserEmail?: string | null;
  initialIsPro?: boolean;
  justUpgraded?: boolean;
  /** When true, trust initial props and skip the client-side auth fetch. */
  seeded?: boolean;
}

export default function ChatInterface({
  initialUserId = null,
  initialUserEmail = null,
  initialIsPro = false,
  justUpgraded = false,
  seeded = false,
}: ChatInterfaceProps = {}) {
  const pathname = usePathname();

  // Auth state — seeded from server when possible, else fetched client-side.
  const [userId, setUserId] = useState<string | null>(initialUserId);
  const [userEmail, setUserEmail] = useState<string | null>(initialUserEmail);
  const [isPro, setIsPro] = useState<boolean>(initialIsPro);
  const [authResolved, setAuthResolved] = useState<boolean>(seeded);

  // Client-side auth bootstrap (used when ChatInterface is rendered outside
  // the server-rendered /pheidi page — e.g., the slide-out PheidiSidebar).
  useEffect(() => {
    if (seeded) return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowser();
        if (!supabase) {
          if (!cancelled) setAuthResolved(true);
          return;
        }
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (user) {
          setUserId(user.id);
          setUserEmail(user.email ?? null);
          const { data } = await supabase
            .from("profiles")
            .select("is_pro")
            .eq("id", user.id)
            .maybeSingle();
          if (cancelled) return;
          setIsPro(data?.is_pro === true);
        }
        setAuthResolved(true);
      } catch {
        if (!cancelled) setAuthResolved(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [seeded]);

  // Upgrade gate state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showUpgradeToast, setShowUpgradeToast] = useState(justUpgraded);
  const [activatingPro, setActivatingPro] = useState(justUpgraded && !initialIsPro);

  // Stripe checkout
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Server-side rate limit state (logged-in non-pro users)
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  // Track messages in a ref for history saving
  const messagesRef = useRef<ReturnType<typeof useChat>["messages"]>([]);

  // ─── Strip ?upgraded=1 from URL once loaded ────────────────────────────────

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.search.includes("upgraded=1")) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Auto-dismiss upgrade toast after 6s.
  useEffect(() => {
    if (!showUpgradeToast) return;
    const t = setTimeout(() => setShowUpgradeToast(false), 6000);
    return () => clearTimeout(t);
  }, [showUpgradeToast]);

  // ─── Pro-status refresh ────────────────────────────────────────────────────
  // Right after a successful checkout the webhook may not have fired yet, so
  // poll the profile briefly until is_pro flips. Also runs once on mount as a
  // light-touch sync if the server-rendered state is stale.

  const refreshProStatus = useCallback(async (): Promise<boolean> => {
    const supabase = createSupabaseBrowser();
    if (!supabase || !userId) return false;
    const { data } = await supabase
      .from("profiles")
      .select("is_pro")
      .eq("id", userId)
      .maybeSingle();
    const pro = data?.is_pro === true;
    if (pro) setIsPro(true);
    return pro;
  }, [userId]);

  useEffect(() => {
    if (!activatingPro) return;
    let cancelled = false;
    const intervals = [800, 1500, 2500, 4000, 6000];
    let attempt = 0;
    async function tick() {
      if (cancelled) return;
      const ok = await refreshProStatus();
      if (ok || cancelled) {
        setActivatingPro(false);
        return;
      }
      if (attempt >= intervals.length) {
        setActivatingPro(false);
        return;
      }
      setTimeout(tick, intervals[attempt++]);
    }
    tick();
    return () => {
      cancelled = true;
    };
  }, [activatingPro, refreshProStatus]);

  // ─── Server rate-limit fetch ───────────────────────────────────────────────

  const fetchRemaining = useCallback(async () => {
    if (isPro || !userId) return;
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setRemaining(data.remaining);
        if (!data.allowed) {
          setUpgradeRequired(true);
          setShowUpgradeModal(true);
        }
      }
    } catch {
      // Non-critical
    }
  }, [isPro, userId]);

  useEffect(() => {
    fetchRemaining();
  }, [fetchRemaining]);

  // ─── useChat ───────────────────────────────────────────────────────────────

  const { messages, sendMessage, status } = useChat({
    onError(err) {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error === "upgrade_required") {
          setUpgradeRequired(true);
          setShowUpgradeModal(true);
          setRemaining(0);
        }
      } catch {
        // Non-rate-limit error, surfaced via the inline error UI below
      }
    },
    onFinish() {
      fetchRemaining();
      if (isPro && userId) {
        saveChatHistory(userId, messagesRef.current);
      }
    },
  });

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, status]);

  // ─── Submit handlers ───────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading || upgradeRequired) return;
    sendMessage({ text: input.trim() });
    setInput("");
  }

  function sendSuggested(text: string) {
    if (isLoading || upgradeRequired) return;
    sendMessage({ text });
  }

  // ─── Stripe checkout ───────────────────────────────────────────────────────

  async function handleUpgradeClick() {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setCheckoutError(
        data.error === "stripe_not_configured"
          ? "Checkout isn't configured yet. Please try again soon."
          : data.error || "Couldn't open checkout. Please try again.",
      );
    } catch {
      setCheckoutError("Couldn't reach Stripe. Check your connection and try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  // ─── Derived UI state ──────────────────────────────────────────────────────

  const inputDisabled = isLoading || upgradeRequired;
  const inputPlaceholder = upgradeRequired
    ? "Upgrade to keep chatting with Pheidi"
    : "Ask about training, gear, nutrition...";
  const returnUrl = encodeURIComponent(pathname ?? "/pheidi");
  const showCounter = !isPro && userId !== null && remaining !== null;
  const counterTone =
    remaining !== null && remaining <= 1 ? "amber" : "muted";

  // ─── Render: loading / auth gate ───────────────────────────────────────────

  if (!authResolved) {
    return <ChatLoadingSkeleton />;
  }
  if (!userId) {
    return <AuthGate returnUrl={returnUrl} />;
  }

  // ─── Render: chat ──────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col flex-1 min-w-0 bg-[#0B1120] relative">
      {/* Upgrade-success toast */}
      {showUpgradeToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-md w-[calc(100%-2rem)] animate-fade-in-up">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-900/60 backdrop-blur-sm px-4 py-3 shadow-lg">
            <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1 text-sm text-emerald-50">
              <p className="font-semibold">Welcome to Pheidi Pro</p>
              <p className="text-emerald-200/80 text-xs">
                {activatingPro
                  ? "Activating your subscription…"
                  : "Unlimited coaching unlocked."}
              </p>
            </div>
            <button
              onClick={() => setShowUpgradeToast(false)}
              aria-label="Dismiss"
              className="text-emerald-300/70 hover:text-emerald-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Pro pill */}
      {isPro && (
        <div className="lg:hidden flex justify-end px-4 pt-3">
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 border border-primary/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.966c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.075 9.394c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
            Pro
          </span>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full chat-scrollbar">
        {/* Empty state */}
        {messages.length === 0 && !upgradeRequired && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-[#1A2540] rounded-2xl flex items-center justify-center mb-4 animate-scale-in">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="font-headline text-2xl font-bold text-[#E2E8F0] mb-2 animate-fade-in-up">
              Pheidi
            </h2>
            <p className="text-[#94A3B8] text-sm mb-8 max-w-md animate-fade-in-up animation-delay-100">
              Ask me anything about ultra running — training, gear, nutrition, race day prep. I&apos;m here to help you get to that finish line.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={prompt}
                  onClick={() => sendSuggested(prompt)}
                  className={`text-left text-sm px-4 py-3 bg-[#141C2E] border border-[#1E293B] rounded-lg hover:border-primary hover:bg-[#1A2540] transition-all text-[#E2E8F0] opacity-0 animate-fade-in-up ${
                    i === 0 ? "animation-delay-100" : i === 1 ? "animation-delay-200" : i === 2 ? "animation-delay-300" : "animation-delay-400"
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#94A3B8]/40 mt-8 lg:hidden">
              AI advice — not a replacement for medical or coaching professionals.
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex animate-fade-in-up ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                message.role === "user"
                  ? "bg-primary text-white rounded-br-md"
                  : "bg-[#1A2540] text-[#E2E8F0] border border-[#2A3A55] rounded-bl-md"
              }`}
            >
              {message.parts.map((part, i) =>
                part.type === "text" ? <span key={i}>{part.text}</span> : null,
              )}
              {status === "streaming" &&
                message === messages[messages.length - 1] &&
                message.role === "assistant" && (
                  <span className="inline-block w-[2px] h-4 bg-primary ml-0.5 align-middle animate-[blink_1s_steps(2)_infinite]" />
                )}
            </div>
          </div>
        ))}

        {/* Shimmer thinking indicator */}
        {status === "submitted" && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[60%] rounded-2xl rounded-bl-md px-4 py-4 bg-[#1A2540] border border-[#2A3A55]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
                <span className="text-xs text-[#94A3B8]">Pheidi is thinking...</span>
              </div>
              <div className="space-y-2">
                <div className="h-3 rounded bg-[#2A3A55] chat-shimmer w-full" />
                <div className="h-3 rounded bg-[#2A3A55] chat-shimmer w-3/4" />
                <div className="h-3 rounded bg-[#2A3A55] chat-shimmer w-1/2" />
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === "error" && !upgradeRequired && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-3 bg-red-900/20 border border-red-500/30 text-sm leading-relaxed">
              <p className="text-red-400">Something went wrong. Please try again.</p>
              {messages.filter((m) => m.role === "user").length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
                    if (lastUserMessage) {
                      const text = lastUserMessage.parts
                        .filter((p): p is { type: "text"; text: string } => p.type === "text")
                        .map((p) => p.text)
                        .join("");
                      if (text) sendMessage({ text });
                    }
                  }}
                  className="mt-2 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-[#1E293B] p-4 max-w-3xl mx-auto w-full">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            className="flex-1 px-4 py-3 bg-[#141C2E] border border-[#2A3A55] rounded-lg text-[#E2E8F0] placeholder:text-[#94A3B8]/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm transition-colors disabled:opacity-50"
            disabled={inputDisabled}
            aria-label="Message Pheidi"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || upgradeRequired}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium active:scale-95"
          >
            Send
          </button>
        </div>

        {/* Counter / status row */}
        <div className="flex items-center justify-between mt-2 min-h-[1rem]">
          {showCounter ? (
            <p
              className={`text-xs text-right ml-auto ${
                counterTone === "amber" ? "text-amber-300" : "text-[#94A3B8]/60"
              }`}
            >
              {remaining === 0
                ? "No free messages left"
                : remaining === 1
                  ? "1 free message left — make it count"
                  : `${remaining} of ${FREE_LIMIT} free messages remaining`}
              {remaining !== null && remaining > 0 && (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(true)}
                    className="text-primary hover:underline"
                  >
                    Upgrade
                  </button>
                </>
              )}
            </p>
          ) : isPro ? (
            <p className="text-xs text-[#94A3B8]/40 ml-auto">
              Unlimited messages · Pheidi Pro
            </p>
          ) : null}
        </div>
      </form>

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <UpgradeModal
          email={userEmail}
          onUpgrade={handleUpgradeClick}
          onClose={() => {
            setShowUpgradeModal(false);
            setCheckoutError(null);
          }}
          checkoutLoading={checkoutLoading}
          checkoutError={checkoutError}
        />
      )}
    </div>
  );
}

// ─── Loading skeleton (while client-side auth resolves) ─────────────────────

function ChatLoadingSkeleton() {
  return (
    <div className="flex flex-col flex-1 min-w-0 bg-[#0B1120]">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
          <span>Loading Pheidi…</span>
        </div>
      </div>
      <div className="border-t border-[#1E293B] p-4 max-w-3xl mx-auto w-full">
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-[#141C2E] border border-[#2A3A55] rounded-lg" />
          <div className="w-20 h-12 bg-primary/30 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Auth gate ────────────────────────────────────────────────────────────────

function AuthGate({ returnUrl }: { returnUrl: string }) {
  return (
    <div className="flex flex-col flex-1 min-w-0 bg-[#0B1120]">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-[#1A2540] rounded-2xl flex items-center justify-center mb-5 animate-scale-in">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>

        <h2 className="font-headline text-2xl font-bold text-[#E2E8F0] mb-3 animate-fade-in-up">
          Meet Pheidi, Your Ultra Coach
        </h2>
        <p className="text-[#94A3B8] text-sm mb-2 max-w-sm animate-fade-in-up animation-delay-100">
          Create a free account to start chatting with Pheidi — your personal AI ultramarathon coach.
        </p>
        <p className="text-[#94A3B8]/70 text-xs mb-8 max-w-sm animate-fade-in-up animation-delay-100">
          5 free messages on signup, no credit card required.
        </p>

        <div className="w-full max-w-xs space-y-3 animate-fade-in-up animation-delay-200">
          <Link
            href={`/login?next=${returnUrl}`}
            className="block w-full px-5 py-3 bg-primary hover:bg-blue-600 text-white font-semibold text-sm rounded-xl text-center transition-all active:scale-95"
          >
            Sign Up Free
          </Link>
          <p className="text-xs text-[#94A3B8] text-center">
            Already have an account?{" "}
            <Link
              href={`/login?next=${returnUrl}`}
              className="text-primary hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="border-t border-[#1E293B] p-4 max-w-3xl mx-auto w-full">
        <div className="flex gap-3">
          <input
            type="text"
            disabled
            placeholder="Sign in to chat with Pheidi..."
            className="flex-1 px-4 py-3 bg-[#141C2E] border border-[#2A3A55] rounded-lg text-[#E2E8F0] placeholder:text-[#94A3B8]/40 text-sm opacity-50 cursor-not-allowed"
            aria-hidden="true"
          />
          <button
            disabled
            className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium opacity-30 cursor-not-allowed"
            aria-hidden="true"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Upgrade modal ────────────────────────────────────────────────────────────

function UpgradeModal({
  email,
  onUpgrade,
  onClose,
  checkoutLoading,
  checkoutError,
}: {
  email: string | null;
  onUpgrade: () => void;
  onClose: () => void;
  checkoutLoading: boolean;
  checkoutError: string | null;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // ESC closes; focus the close button on mount.
  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div
        className="relative w-full max-w-sm bg-[#141C2E] border border-[#2A3A55] rounded-2xl p-6 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1A2540] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <h2 id="upgrade-modal-title" className="font-headline text-xl font-bold text-[#E2E8F0] text-center mb-2">
          Unlock unlimited Pheidi
        </h2>
        <p className="text-sm text-[#94A3B8] text-center mb-5">
          Pheidi Pro is{" "}
          <span className="text-[#E2E8F0] font-semibold">$7/month</span> — unlimited
          coaching, saved chat history, and weekly training summaries.
        </p>

        <ul className="space-y-2 mb-6 text-sm text-[#E2E8F0]/90">
          {[
            "Unlimited messages",
            "Saved conversation history",
            "Weekly training summaries",
            "Cancel anytime",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>

        <button
          onClick={onUpgrade}
          disabled={checkoutLoading}
          className="w-full px-4 py-3 bg-primary hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
        >
          {checkoutLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Opening checkout…
            </>
          ) : (
            "Upgrade for $7/month"
          )}
        </button>

        {email && (
          <p className="text-[11px] text-[#94A3B8]/70 text-center mt-3">
            Billed to {email}. Cancel anytime from your account.
          </p>
        )}

        {checkoutError && (
          <p className="text-xs text-red-400 text-center mt-3">{checkoutError}</p>
        )}
      </div>
    </div>
  );
}

// ─── Chat history save (pro users) ───────────────────────────────────────────

async function saveChatHistory(
  userId: string,
  messages: ReturnType<typeof useChat>["messages"],
) {
  if (!messages.length) return;
  try {
    const supabase = createSupabaseBrowser();
    if (!supabase) return;

    const today = new Date().toISOString().split("T")[0];
    const sessionId = `${userId}-${today}`;

    await supabase.from("pheidi_chat_history").upsert(
      {
        user_id: userId,
        session_id: sessionId,
        messages: messages,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id" },
    );
  } catch {
    // Non-critical
  }
}
