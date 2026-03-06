"use client";

import { useEffect } from "react";
import { usePheidi } from "./PheidiProvider";
import ChatInterface from "./ChatInterface";

export default function PheidiSidebar() {
  const { isPheidiOpen, closePheidi } = usePheidi();

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isPheidiOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPheidiOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isPheidiOpen) closePheidi();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPheidiOpen, closePheidi]);

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isPheidiOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closePheidi}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 right-0 h-full z-50 w-full sm:w-[400px] bg-[#0B1120] shadow-2xl shadow-black/40 flex flex-col transition-transform duration-300 ease-in-out ${
          isPheidiOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1A2540] rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-headline text-sm font-semibold text-[#E2E8F0]">
                Pheidi
              </h2>
              <p className="text-[10px] text-[#94A3B8]">AI Coach</p>
            </div>
          </div>
          <button
            onClick={closePheidi}
            className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-[#E2E8F0] transition-colors rounded-lg hover:bg-[#1A2540]"
            aria-label="Close Pheidi"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Chat */}
        <ChatInterface />
      </aside>
    </>
  );
}
