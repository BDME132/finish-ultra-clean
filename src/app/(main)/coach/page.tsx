import { Metadata } from "next";
import ChatInterface from "@/components/ChatInterface";

export const metadata: Metadata = {
  title: "AI Ultra Coach | FinishUltra",
  description: "Get personalized ultra running advice from our AI coach. Ask about training, gear, nutrition, and race day prep.",
  alternates: { canonical: "/chat" },
};

export default function ChatPage() {
  return (
    <>
      <main className="h-[calc(100vh-3.5rem)] md:h-screen flex bg-[#0B1120]">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex lg:w-64 flex-shrink-0 flex-col bg-[#141C2E] border-r border-[#1E293B] p-6">
          {/* Branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1A2540] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h2 className="font-headline text-sm font-semibold text-[#E2E8F0]">FinishUltra</h2>
              <p className="text-xs text-[#94A3B8]">AI Coach</p>
            </div>
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
          <ChatInterface />
        </div>
      </main>
    </>
  );
}
