import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";
import PheidiShell from "@/components/PheidiShell";
import AuthProvider from "@/components/AuthProvider";
import { rootLayoutJsonLdGraph } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FinishUltra — Your First Ultra Starts Here",
  description:
    "Free training plans, honest gear reviews, and an AI coach for beginner ultra runners. Your first ultra starts here.",
  keywords: ["ultra marathon training", "beginner ultra runner", "ultra running gear", "50k training plan", "ultra running nutrition"],
  authors: [{ name: "FinishUltra" }],
  creator: "FinishUltra",
  metadataBase: new URL("https://www.finishultra.com"),
  verification: {
    google: "PASTE_YOUR_CODE_HERE",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.finishultra.com/",
    siteName: "FinishUltra",
    title: "FinishUltra — Your First Ultra Starts Here",
    description:
      "Free training plans, honest gear reviews, and an AI coach for beginner ultra runners. Your first ultra starts here.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinishUltra — Your first ultra starts here",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinishUltra — Your First Ultra Starts Here",
    description:
      "Free training plans, honest gear reviews, and an AI coach for beginner ultra runners. Your first ultra starts here.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const jsonLd = rootLayoutJsonLdGraph(pathname);

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0066FF" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <PheidiShell>{children}</PheidiShell>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
