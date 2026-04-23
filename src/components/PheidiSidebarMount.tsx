"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usePheidi } from "./PheidiProvider";

const PheidiSidebar = dynamic(() => import("./PheidiSidebar"), { ssr: false });

/**
 * Defers loading the chat bundle (PheidiSidebar + ChatInterface + @ai-sdk/react)
 * until the user opens the sidebar for the first time. After that the component
 * stays mounted so the conversation state survives a close+reopen.
 */
export default function PheidiSidebarMount() {
  const pathname = usePathname() ?? "/";
  const { isPheidiOpen } = usePheidi();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isPheidiOpen) setMounted(true);
  }, [isPheidiOpen]);

  if (pathname === "/mom") return null;
  if (!mounted) return null;
  return <PheidiSidebar />;
}
