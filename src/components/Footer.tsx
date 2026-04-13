import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const exploreLinks = [
    { href: "/start-here", label: "Start Here" },
    { href: "/training", label: "Training" },
    { href: "/gear", label: "Gear & Fuel" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/pheidi", label: "Pheidi" },
    { href: "/about", label: "About" },
  ];
  const toolLinks = [
    { href: "/tools/pace-calculator", label: "Pace Calculator" },
    { href: "/tools/glossary", label: "Ultra Glossary" },
    { href: "/search", label: "Search" },
  ];
  const moreLinks = [
    { href: "/newsletter", label: "Newsletter" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  ];

  return (
    <footer className="bg-dark text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr] lg:items-start">
          <div className="max-w-md">
            <Link href="/" className="font-headline text-lg font-bold">
              FinishUltra
            </Link>
            <p className="text-white/60 text-sm mt-2">
              Your first ultra starts here. Free training plans, honest gear advice, and Pheidi — your AI coach who gets what it&apos;s like to be a beginner.
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-white transition-colors mt-3"
            >
              Join the newsletter &rarr;
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <h3 className="font-headline font-semibold text-sm mb-2">Explore</h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {exploreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-headline font-semibold text-sm mb-2">Tools</h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {toolLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-headline font-semibold text-sm mb-2">More</h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
              <a href="mailto:hello@finishultra.com" className="text-white/60 hover:text-white transition-colors text-sm">hello@finishultra.com</a>
              <a
                href="https://instagram.com/finishultra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                Instagram
              </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-6 pt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white/60 text-sm">
            As an Amazon Associate I earn from qualifying purchases.
          </p>
          <p className="text-white/40 text-sm">
            &copy; {currentYear} FinishUltra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
