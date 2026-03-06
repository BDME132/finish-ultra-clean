"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

interface PheidiContextValue {
  isPheidiOpen: boolean;
  openPheidi: () => void;
  closePheidi: () => void;
  togglePheidi: () => void;
  currentPage: string;
}

const PheidiContext = createContext<PheidiContextValue | null>(null);

export function usePheidi() {
  const ctx = useContext(PheidiContext);
  if (!ctx) throw new Error("usePheidi must be used within PheidiProvider");
  return ctx;
}

export default function PheidiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPheidiOpen, setIsPheidiOpen] = useState(false);
  const pathname = usePathname();

  const openPheidi = useCallback(() => setIsPheidiOpen(true), []);
  const closePheidi = useCallback(() => setIsPheidiOpen(false), []);
  const togglePheidi = useCallback(() => setIsPheidiOpen((prev) => !prev), []);

  return (
    <PheidiContext.Provider
      value={{
        isPheidiOpen,
        openPheidi,
        closePheidi,
        togglePheidi,
        currentPage: pathname || "/",
      }}
    >
      {children}
    </PheidiContext.Provider>
  );
}
