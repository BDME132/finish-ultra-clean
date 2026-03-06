import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand + Newsletter CTA */}
          <div>
            <Link href="/" className="font-headline text-xl font-bold">
              FinishUltra
            </Link>
            <p className="text-white/60 text-sm mt-2 mb-4">
              Your first ultra starts here. Free training plans, honest gear advice, and Pheidi — your AI coach who gets what it&apos;s like to be a beginner.
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-white transition-colors"
            >
              Join the newsletter &rarr;
            </Link>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-headline font-semibold mb-3">Explore</h3>
            <div className="flex flex-col gap-2">
              <Link href="/start-here" className="text-white/60 hover:text-white transition-colors text-sm">Start Here</Link>
              <Link href="/training" className="text-white/60 hover:text-white transition-colors text-sm">Training</Link>
              <Link href="/gear" className="text-white/60 hover:text-white transition-colors text-sm">Gear & Fuel</Link>
              <Link href="/blog" className="text-white/60 hover:text-white transition-colors text-sm">Blog</Link>
              <Link href="/pheidi" className="text-white/60 hover:text-white transition-colors text-sm">Pheidi</Link>
              <Link href="/about" className="text-white/60 hover:text-white transition-colors text-sm">About</Link>
            </div>
          </div>

          {/* Tools + More */}
          <div>
            <h3 className="font-headline font-semibold mb-3">Tools</h3>
            <div className="flex flex-col gap-2">
              <Link href="/tools/pace-calculator" className="text-white/60 hover:text-white transition-colors text-sm">Pace Calculator</Link>
              <Link href="/tools/glossary" className="text-white/60 hover:text-white transition-colors text-sm">Ultra Glossary</Link>
              <Link href="/search" className="text-white/60 hover:text-white transition-colors text-sm">Search</Link>
            </div>

            <h3 className="font-headline font-semibold mb-3 mt-6">More</h3>
            <div className="flex flex-col gap-2">
              <Link href="/newsletter" className="text-white/60 hover:text-white transition-colors text-sm">Newsletter</Link>
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

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} FinishUltra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
