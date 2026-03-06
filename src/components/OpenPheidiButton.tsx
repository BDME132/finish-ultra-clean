"use client";

import { usePheidi } from "./PheidiProvider";

export default function OpenPheidiButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { openPheidi } = usePheidi();

  return (
    <button onClick={openPheidi} className={className}>
      {children}
    </button>
  );
}
