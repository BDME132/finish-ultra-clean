import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "FinishUltra - Your First Ultra Starts Here",
  description:
    "Free training plans, gear guides, and an AI coach for beginner ultra runners. Built by beginners, for beginners.",
  keywords: ["ultra marathon training", "beginner ultra runner", "ultra running gear", "50k training plan", "ultra running nutrition"],
  authors: [{ name: "FinishUltra" }],
  creator: "FinishUltra",
  metadataBase: new URL("https://finishultra.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://finishultra.com",
    siteName: "FinishUltra",
    title: "FinishUltra - Your First Ultra Starts Here",
    description:
      "Free training plans, gear guides, and an AI coach for beginner ultra runners.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinishUltra - Your First Ultra Starts Here",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinishUltra - Your First Ultra Starts Here",
    description:
      "Free training plans, gear guides, and an AI coach for beginner ultra runners.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://finishultra.com/#organization",
        name: "FinishUltra",
        url: "https://finishultra.com",
        logo: {
          "@type": "ImageObject",
          url: "https://finishultra.com/logo.png",
        },
        description:
          "Free training plans, gear guides, and an AI coach for beginner ultra runners.",
      },
      {
        "@type": "WebSite",
        "@id": "https://finishultra.com/#website",
        url: "https://finishultra.com",
        name: "FinishUltra",
        publisher: {
          "@id": "https://finishultra.com/#organization",
        },
        description: "Free training plans, gear guides, and an AI coach for beginner ultra runners.",
      },
    ],
  };

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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
