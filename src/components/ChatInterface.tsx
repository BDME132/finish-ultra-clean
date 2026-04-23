"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/client";

// ─── Constants ────────────────────────────────────────────────────────────────

const ANON_DAILY_LIMIT = 5;
const LS_KEY = "pheidi_anon_v1";

const suggestedPrompts = [
  "I want to run my first 50K",
  "What shoes should I get?",
  "Help me make a nutrition plan",
  "How do I train for an ultra?",
];

// ─── localStorage helpers ─────────────────────────────────────────────────────

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function getAnonState(): { count: number; date: string } {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { count: 0, date: getTodayKey() };
    const parsed = JSON.parse(raw) as { count: number; date: string };
    // Reset if it's a new day
    if (parsed.date !== getTodayKey()) return { count: 0, date: getTodayKey() };
    return parsed;
  } catch {
    return { count: 0, date: getTodayKey() };
  }
}

function saveAnonState(count: number): void {
  localStorage.setItem(LS_KEY, JSON.stringify({ count, date: getTodayKey() }));
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ChatInterface() {
  // Pro / auth status
  const [isPro, setIsPro] = useState<boolean | null>(null); // null = still loading
  const [userId, setUserId] = useState<string | null>(null);

  // Freemium gate state (anonymous users only)
  const [anonCount, setAnonCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  // Stripe checkout loading
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Legacy server-side state (still used for subscribed / auth users)
  const [remaining, setRemaining] = useState<number | null>(null);
  const [resetAt, setResetAt] = useState<string | null>(null);
  const [rateLimitError, setRateLimitError] = useState<
    "signup_required" | "daily_limit_reached" | null
  >(null);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Track messages in a ref for history saving
  const messagesRef = useRef<ReturnType<typeof useChat>["messages"]>([]);

  // ─── Auth / Pro check ───────────────────────────────────────────────────────

  useEffect(() => {
    async function checkProStatus() {
      const supabase = createSupabaseBrowser();
      if (!supabase) { setIsPro(false); return; }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsPro(false); return; }

      setUserId(user.id);
      const { data } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", user.id)
        .single();
      const pro = data?.is_pro === true;
      setIsPro(pro);

      // Auto-trigger Stripe checkout if user just logged in to upgrade
      if (!pro && localStorage.getItem("pheidi_checkout_intent")) {
        localStorage.removeItem("pheidi_checkout_intent");
        const res = await fetch("/api/stripe/checkout", { method: "POST" });
        const checkoutData = await res.json();
        if (checkoutData.url) window.location.href = checkoutData.url;
      }
    }
    checkProStatus();
  }, []);

  // ─── Load anon count from localStorage ─────────────────────────────────────

  useEffect(() => {
    // Only gate anonymous users
    if (isPro === null) return; // still loading
    if (isPro || userId) return; // pro or logged-in non-pro: no client-side gate
    const state = getAnonState();
    setAnonCount(state.count);
    if (state.count >= ANON_DAILY_LIMIT) {
      // Already at limit from a previous session today
      setShowUpgradeModal(true);
    }
  }, [isPro, userId]);

  // ─── Handle ?upgraded=1 success return from Stripe ─────────────────────────

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "1") {
      // Clean the URL without a full reload
      window.history.replaceState({}, "", "/pheidi");
      // isPro will already be true after the webhook fires & user refreshes auth
    }
  }, []);

  // ─── Server rate limit fetch (for subscribed / auth users) ─────────────────

  const fetchRemaining = useCallback(async () => {
    if (isPro) return; // Pro users don't need this
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setRemaining(data.remaining);
        setResetAt(data.resetAt);
        if (!data.allowed) {
          setRateLimitError(data.requiresSignup ? "signup_required" : "daily_limit_reached");
        }
      }
    } catch {
      // Not critical
    }
  }, [isPro]);

  useEffect(() => {
    fetchRemaining();
  }, [fetchRemaining]);

  // ─── useChat ────────────────────────────────────────────────────────────────

  const { messages, sendMessage, status, error } = useChat({
    onError(err) {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error === "signup_required") {
          setRateLimitError("signup_required");
          setRemaining(0);
        } else if (parsed.error === "daily_limit_reached") {
          setRateLimitError("daily_limit_reached");
          setRemaining(0);
          if (parsed.resetAt) setResetAt(parsed.resetAt);
        }
      } catch {
        // Non-rate-limit error
      }
    },
    onFinish() {
      fetchRemaining();

      // Anonymous: check if we just hit the 4th message (1 left warning)
      if (!isPro && !userId) {
        const current = getAnonState().count;
        if (current === ANON_DAILY_LIMIT - 1) {
          setShowLimitWarning(true);
        }
      }

      // Pro users: save chat history to Supabase
      if (isPro && userId) {
        saveChatHistory(userId, messagesRef.current);
      }
    },
  });

  // Keep ref in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, status, rateLimitError, showLimitWarning, showUpgradeModal]);

  // ─── Submit handler ─────────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Anonymous gate
    if (!isPro && !userId) {
      const state = getAnonState();
      if (state.count >= ANON_DAILY_LIMIT) {
        setShowUpgradeModal(true);
        return;
      }
      const newCount = state.count + 1;
      saveAnonState(newCount);
      setAnonCount(newCount);
    }

    if (rateLimitError) return;
    sendMessage({ text: input.trim() });
    setInput("");
  }

  function sendSuggested(text: string) {
    if (isLoading || rateLimitError) return;

    if (!isPro && !userId) {
      const state = getAnonState();
      if (state.count >= ANON_DAILY_LIMIT) {
        setShowUpgradeModal(true);
        return;
      }
      const newCount = state.count + 1;
      saveAnonState(newCount);
      setAnonCount(newCount);
    }

    sendMessage({ text });
  }

  // ─── Stripe checkout ────────────────────────────────────────────────────────

  async function handleUpgradeClick() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();

      if (res.status === 401 && data.error === "login_required") {
        // Store intent so we auto-trigger checkout after login
        localStorage.setItem("pheidi_checkout_intent", "1");
        window.location.href = "/login?next=/pheidi";
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Fall through — button re-enables
    } finally {
      setCheckoutLoading(false);
    }
  }

  // ─── Newsletter signup (legacy — for subscribed users hitting server limit) ─

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const email = signupEmail.trim().toLowerCase();
    if (!email) return;

    setSignupLoading(true);
    setSignupError("");

    try {
      const res = await fetch("/api/email-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok && res.status !== 409) {
        setSignupError(data.error || "Something went wrong");
        setSignupLoading(false);
        return;
      }

      document.cookie = `chat_subscribed=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=strict`;
      setRateLimitError(null);
      setSignupEmail("");
      setTimeout(() => fetchRemaining(), 100);
    } catch {
      setSignupError("Failed to connect. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  }

  // ─── Derived UI state ───────────────────────────────────────────────────────

  // Input is disabled when:
  // - A message is being sent/streamed
  // - Server-side rate limit hit
  // - Modal dismissed ("come back tomorrow")
  const inputDisabled =
    isLoading ||
    !!rateLimitError ||
    modalDismissed;

  const inputPlaceholder = modalDismissed
    ? "Come back tomorrow or upgrade to keep going"
    : rateLimitError
    ? "Message limit reached"
    : "Ask about training, gear, nutrition...";

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col flex-1 min-w-0 bg-[#0B1120]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full chat-scrollbar">
        {/* Empty state */}
        {messages.length === 0 && !rateLimitError && (
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
                part.type === "text" ? <span key={i}>{part.text}</span> : null
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

        {/* "1 message left today" inline warning — shown after 4th response */}
        {showLimitWarning && !showUpgradeModal && !modalDismissed && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="rounded-2xl rounded-bl-md px-4 py-2.5 bg-[#1A2540] border border-amber-500/30 flex items-center gap-2">
              <span className="text-amber-400 text-xs">⚡</span>
              <p className="text-xs text-amber-300/90">1 message left today — make it count.</p>
            </div>
          </div>
        )}

        {/* Newsletter signup gate (legacy — server-side signup_required) */}
        {rateLimitError === "signup_required" && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="max-w-sm rounded-2xl rounded-bl-md p-5 bg-[#141C2E] border border-[#2A3A55]">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-sm font-semibold text-[#E2E8F0]">Join the community to keep chatting with Pheidi</h3>
              </div>
              <p className="text-xs text-[#94A3B8] mb-4">
                Sign up for the FinishUltra newsletter to unlock 30 messages per day. Get weekly ultra running tips too.
              </p>
              <form onSubmit={handleSignup} className="space-y-2">
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-3 py-2 bg-[#0B1120] border border-[#2A3A55] rounded-lg text-sm text-[#E2E8F0] placeholder:text-[#94A3B8]/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                />
                {signupError && <p className="text-xs text-red-400">{signupError}</p>}
                <button
                  type="submit"
                  disabled={signupLoading || !signupEmail.trim()}
                  className="w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signupLoading ? "Signing up..." : "Sign up & chat with Pheidi"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Daily limit reached (server-side, subscribed users) */}
        {rateLimitError === "daily_limit_reached" && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="max-w-sm rounded-2xl rounded-bl-md p-5 bg-[#141C2E] border border-[#2A3A55]">
              <h3 className="text-sm font-semibold text-[#E2E8F0] mb-2">Daily message limit reached</h3>
              <p className="text-xs text-[#94A3B8] mb-1">You&apos;ve used all 30 messages for today.</p>
              {resetAt && <CountdownTimer resetAt={resetAt} />}
              <p className="text-xs text-[#94A3B8] mt-3 mb-3">While you wait, check out:</p>
              <div className="flex flex-col gap-2">
                <Link href="/training/first-50k" className="text-xs text-primary hover:text-primary-dark transition-colors">First 50K Training Plan &rarr;</Link>
                <Link href="/gear" className="text-xs text-primary hover:text-primary-dark transition-colors">Gear Guides &rarr;</Link>
                <Link href="/newsletter" className="text-xs text-primary hover:text-primary-dark transition-colors">Newsletter &rarr;</Link>
              </div>
            </div>
          </div>
        )}

        {/* Error state (non-rate-limit errors) */}
        {status === "error" && !rateLimitError && (
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
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !!rateLimitError || modalDismissed}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium active:scale-95"
          >
            Send
          </button>
        </div>
        {remaining !== null && remaining < 10 && !rateLimitError && !isPro && (
          <p className="text-xs text-[#94A3B8]/50 mt-2 text-right">
            {remaining} message{remaining !== 1 ? "s" : ""} remaining today
          </p>
        )}
      </form>

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <UpgradeModal
          onUpgrade={handleUpgradeClick}
          onDismiss={() => {
            setShowUpgradeModal(false);
            setModalDismissed(true);
          }}
          checkoutLoading={checkoutLoading}
        />
      )}
    </div>
  );
}

// ─── Upgrade modal ────────────────────────────────────────────────────────────

function UpgradeModal({
  onUpgrade,
  onDismiss,
  checkoutLoading,
}: {
  onUpgrade: () => void;
  onDismiss: () => void;
  checkoutLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#141C2E] border border-[#2A3A55] rounded-2xl p-6 shadow-2xl animate-scale-in">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <h2 className="font-headline text-xl font-bold text-[#E2E8F0] text-center mb-2">
          You&apos;ve hit your daily limit
        </h2>
        <p className="text-sm text-[#94A3B8] text-center mb-6">
          Upgrade to Pheidi Pro for unlimited coaching, saved conversation history, and weekly training summaries —&nbsp;
          <span className="text-[#E2E8F0] font-semibold">$7/month.</span>
        </p>

        <button
          onClick={onUpgrade}
          disabled={checkoutLoading}
          className="w-full px-4 py-3 bg-primary hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 mb-3"
        >
          {checkoutLoading ? "Loading checkout..." : "Upgrade for $7/month"}
        </button>

        <button
          onClick={onDismiss}
          className="w-full text-sm text-[#94A3B8] hover:text-[#E2E8F0] transition-colors py-2"
        >
          Come back tomorrow
        </button>
      </div>
    </div>
  );
}

// ─── Countdown timer ──────────────────────────────────────────────────────────

function CountdownTimer({ resetAt }: { resetAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const now = Date.now();
      const reset = new Date(resetAt).getTime();
      const diff = Math.max(0, reset - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (diff <= 0) {
        setTimeLeft("Refreshing...");
        window.location.reload();
        return;
      }

      setTimeLeft(`${hours}h ${minutes}m`);
    }

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [resetAt]);

  return (
    <p className="text-xs text-[#94A3B8]">
      Resets in <span className="text-[#E2E8F0] font-medium">{timeLeft}</span>
    </p>
  );
}

// ─── Chat history save (pro users) ───────────────────────────────────────────

async function saveChatHistory(
  userId: string,
  messages: ReturnType<typeof useChat>["messages"]
) {
  if (!messages.length) return;
  try {
    const supabase = createSupabaseBrowser();
    if (!supabase) return;

    // Try to update an existing session from today (upsert by user_id + date prefix)
    const today = new Date().toISOString().split("T")[0];
    const sessionId = `${userId}-${today}`;

    await supabase.from("pheidi_chat_history").upsert(
      {
        user_id: userId,
        session_id: sessionId,
        messages: messages,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id" }
    );
  } catch {
    // History save is non-critical — swallow errors
  }
}
