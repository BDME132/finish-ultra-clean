import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="font-headline text-xl font-bold">
              FinishUltra
            </Link>
            <p className="text-white/60 text-sm mt-2">
              Your first ultra starts here. Free training plans, honest gear advice, and an AI coach who gets what it&apos;s like to be a beginner.
            </p>
          </div>

          <div>
            <h3 className="font-headline font-semibold mb-3">Explore</h3>
            <div className="flex flex-col gap-2">
              <Link href="/start-here" className="text-white/60 hover:text-white transition-colors text-sm">Start Here</Link>
              <Link href="/gear" className="text-white/60 hover:text-white transition-colors text-sm">Gear</Link>
              <Link href="/training" className="text-white/60 hover:text-white transition-colors text-sm">Training</Link>
              <Link href="/chat" className="text-white/60 hover:text-white transition-colors text-sm">AI Coach</Link>
            </div>
          </div>

          <div>
            <h3 className="font-headline font-semibold mb-3">More</h3>
            <div className="flex flex-col gap-2">
              <Link href="/blog" className="text-white/60 hover:text-white transition-colors text-sm">Blog</Link>
              <Link href="/newsletter" className="text-white/60 hover:text-white transition-colors text-sm">Newsletter</Link>
              <Link href="/about" className="text-white/60 hover:text-white transition-colors text-sm">About</Link>
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
