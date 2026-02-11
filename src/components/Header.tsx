import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/home" className="font-headline text-2xl font-bold text-primary">
            FinishUltra
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              href="/kits"
              className="text-dark hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/custom-kit"
              className="text-dark hover:text-primary transition-colors"
            >
              Custom Kit
            </Link>
            <Link
              href="#contact"
              className="text-dark hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
