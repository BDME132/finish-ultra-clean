import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tate | FinishUltra",
    description: "Internal FinishUltra page.",
    path: "/tate",
    robots: { index: false, follow: false },
  }),
};

export default function TatePage() {
    return <h1>Hello World</h1>;
  }
  