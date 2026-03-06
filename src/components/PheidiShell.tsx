"use client";

import PheidiProvider from "./PheidiProvider";
import PheidiSidebar from "./PheidiSidebar";
import PheidiFAB from "./PheidiFAB";

export default function PheidiShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PheidiProvider>
      {children}
      <PheidiSidebar />
      <PheidiFAB />
    </PheidiProvider>
  );
}
