import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Egg | FinishUltra",
    description: "Internal FinishUltra page.",
    path: "/egg",
    robots: { index: false, follow: false },
  }),
};

export default function EggLayout({ children }: { children: React.ReactNode }) {
  return children;
}
