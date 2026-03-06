"use client";

import { usePathname } from "next/navigation";
import { usePheidi } from "./PheidiProvider";

/* 16x16 pixel art: running AI coach character */
function ChatPixelArt() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-6 h-6"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* Headband - blue */}
      <rect x="5" y="1" width="1" height="1" fill="#0066FF" />
      <rect x="6" y="1" width="1" height="1" fill="#0066FF" />
      <rect x="7" y="1" width="1" height="1" fill="#0066FF" />
      <rect x="8" y="1" width="1" height="1" fill="#0066FF" />
      <rect x="9" y="1" width="1" height="1" fill="#0066FF" />
      <rect x="10" y="1" width="1" height="1" fill="#0066FF" />
      {/* Head */}
      <rect x="6" y="2" width="1" height="1" fill="#E2E8F0" />
      <rect x="7" y="2" width="1" height="1" fill="#E2E8F0" />
      <rect x="8" y="2" width="1" height="1" fill="#E2E8F0" />
      <rect x="9" y="2" width="1" height="1" fill="#E2E8F0" />
      <rect x="6" y="3" width="1" height="1" fill="#E2E8F0" />
      <rect x="7" y="3" width="1" height="1" fill="#0F172A" />
      <rect x="8" y="3" width="1" height="1" fill="#E2E8F0" />
      <rect x="9" y="3" width="1" height="1" fill="#0F172A" />
      <rect x="6" y="4" width="1" height="1" fill="#E2E8F0" />
      <rect x="7" y="4" width="1" height="1" fill="#E2E8F0" />
      <rect x="8" y="4" width="1" height="1" fill="#E2E8F0" />
      <rect x="9" y="4" width="1" height="1" fill="#E2E8F0" />
      {/* Body / shirt - dark */}
      <rect x="5" y="5" width="1" height="1" fill="#0F172A" />
      <rect x="6" y="5" width="1" height="1" fill="#0F172A" />
      <rect x="7" y="5" width="1" height="1" fill="#0F172A" />
      <rect x="8" y="5" width="1" height="1" fill="#0F172A" />
      <rect x="9" y="5" width="1" height="1" fill="#0F172A" />
      <rect x="10" y="5" width="1" height="1" fill="#0F172A" />
      {/* Arms pumping */}
      <rect x="4" y="6" width="1" height="1" fill="#E2E8F0" />
      <rect x="6" y="6" width="1" height="1" fill="#0F172A" />
      <rect x="7" y="6" width="1" height="1" fill="#0F172A" />
      <rect x="8" y="6" width="1" height="1" fill="#0F172A" />
      <rect x="9" y="6" width="1" height="1" fill="#0F172A" />
      <rect x="11" y="6" width="1" height="1" fill="#E2E8F0" />
      <rect x="3" y="7" width="1" height="1" fill="#E2E8F0" />
      <rect x="7" y="7" width="1" height="1" fill="#0F172A" />
      <rect x="8" y="7" width="1" height="1" fill="#0F172A" />
      <rect x="12" y="7" width="1" height="1" fill="#E2E8F0" />
      {/* Legs - running stride */}
      <rect x="6" y="8" width="1" height="1" fill="#0F172A" />
      <rect x="7" y="8" width="1" height="1" fill="#0F172A" />
      <rect x="8" y="8" width="1" height="1" fill="#0F172A" />
      <rect x="9" y="8" width="1" height="1" fill="#0F172A" />
      <rect x="5" y="9" width="1" height="1" fill="#0F172A" />
      <rect x="6" y="9" width="1" height="1" fill="#0F172A" />
      <rect x="9" y="9" width="1" height="1" fill="#0F172A" />
      <rect x="10" y="9" width="1" height="1" fill="#0F172A" />
      <rect x="4" y="10" width="1" height="1" fill="#0F172A" />
      <rect x="5" y="10" width="1" height="1" fill="#0F172A" />
      <rect x="10" y="10" width="1" height="1" fill="#0F172A" />
      <rect x="11" y="10" width="1" height="1" fill="#0F172A" />
      {/* Shoes - orange */}
      <rect x="3" y="11" width="1" height="1" fill="#FF6B00" />
      <rect x="4" y="11" width="1" height="1" fill="#FF6B00" />
      <rect x="11" y="11" width="1" height="1" fill="#FF6B00" />
      <rect x="12" y="11" width="1" height="1" fill="#FF6B00" />
      <rect x="2" y="12" width="1" height="1" fill="#FF6B00" />
      <rect x="3" y="12" width="1" height="1" fill="#FF6B00" />
      <rect x="12" y="12" width="1" height="1" fill="#FF6B00" />
      <rect x="13" y="12" width="1" height="1" fill="#FF6B00" />
    </svg>
  );
}

export default function PheidiFAB() {
  const pathname = usePathname();
  const { togglePheidi, isPheidiOpen } = usePheidi();

  // Hide FAB on the dedicated Pheidi page
  if (pathname === "/pheidi") return null;

  return (
    <button
      onClick={togglePheidi}
      aria-label={isPheidiOpen ? "Close Pheidi" : "Open Pheidi"}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/25 flex items-center justify-center hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all"
    >
      {isPheidiOpen ? (
        <svg
          className="w-6 h-6 text-white"
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
      ) : (
        <ChatPixelArt />
      )}
    </button>
  );
}
