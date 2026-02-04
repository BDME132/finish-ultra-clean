import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

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
  title: "FinishUltra - Premium Ultra Marathon Finish Kits",
  description:
    "Curated nutrition and recovery kits for ultra marathoners. Fuel your finish with race-tested products.",
  keywords: ["ultra marathon", "running nutrition", "recovery kit", "endurance sports", "race fuel"],
  authors: [{ name: "FinishUltra" }],
  creator: "FinishUltra",
  metadataBase: new URL("https://finishultra.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://finishultra.com",
    siteName: "FinishUltra",
    title: "FinishUltra - Premium Ultra Marathon Finish Kits",
    description:
      "Curated nutrition and recovery kits for ultra marathoners. Fuel your finish with race-tested products.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinishUltra - Premium Ultra Marathon Finish Kits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinishUltra - Premium Ultra Marathon Finish Kits",
    description:
      "Curated nutrition and recovery kits for ultra marathoners. Fuel your finish with race-tested products.",
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
          "Premium nutrition and recovery kits for ultra marathon runners.",
      },
      {
        "@type": "WebSite",
        "@id": "https://finishultra.com/#website",
        url: "https://finishultra.com",
        name: "FinishUltra",
        publisher: {
          "@id": "https://finishultra.com/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://finishultra.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
