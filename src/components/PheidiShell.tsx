"use client";

import { usePathname } from "next/navigation";
import PheidiProvider from "./PheidiProvider";
import PheidiSidebar from "./PheidiSidebar";

export default function PheidiShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hidePheidiUi = pathname === "/mom";

  return (
    <PheidiProvider>
      {children}
      {!hidePheidiUi && <PheidiSidebar />}
    </PheidiProvider>
  );
}
