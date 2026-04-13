import type { Metadata } from "next";
import AdminLayoutClient from "./AdminLayoutClient";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Admin | FinishUltra",
    description:
      "FinishUltra admin tools for newsletter and subscribers. Not indexed by search engines.",
    path: "/admin",
    robots: { index: false, follow: false },
  }),
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
