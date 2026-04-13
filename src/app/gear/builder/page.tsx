import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Gear Kit Builder | FinishUltra",
    description: "Redirecting to the custom ultra gear kit builder at FinishUltra.",
    path: "/gear/builder",
  }),
};

export default function GearBuilderRedirect() {
  redirect("/gear/kits");
}
