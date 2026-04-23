"use client";

import { usePathname } from "next/navigation";
import { usePheidi } from "../PheidiProvider";
import ChatPixelArt from "./ChatPixelArt";

export default function AICoachButton() {
  const pathname = usePathname() ?? "/";
  const isActive = pathname.startsWith("/pheidi");
  const { openPheidi } = usePheidi();

  return (
    <button
      onClick={openPheidi}
      className={`text-sm font-medium transition-all group border rounded-md px-3 py-1 ${
        isActive
          ? "text-white bg-primary border-primary"
          : "text-primary border-primary/40 hover:bg-primary hover:text-white hover:border-primary"
      }`}
    >
      <span className="block overflow-hidden h-5">
        <span className="flex flex-col transition-transform duration-[250ms] ease-in-out group-hover:-translate-y-5">
          <span className="h-5 flex items-center">AI Coach</span>
          <span className="h-5 flex items-center justify-center">
            <ChatPixelArt />
          </span>
        </span>
      </span>
    </button>
  );
}
