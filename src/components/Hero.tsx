import Link from "next/link";

const DIAGONAL_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cline x1='0' y1='40' x2='40' y2='0' stroke='%230F172A' stroke-width='0.5'/%3E%3C/svg%3E")`;

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-light to-white py-20 sm:py-28 overflow-hidden">
      {/* Subtle diagonal texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: DIAGONAL_TEXTURE, backgroundSize: "40px 40px", opacity: 0.04 }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          className="font-headline text-5xl sm:text-6xl lg:text-7xl font-normal text-dark mb-6"
          style={{ letterSpacing: "-0.02em" }}
        >
          Your First Ultra Starts Here
        </h1>
        <p className="text-lg sm:text-xl text-gray/70 max-w-[480px] mx-auto mb-10">
          The all-purpose tool for beginner ultra runners.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/start-here"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-accent rounded hover:opacity-90 transition-opacity"
          >
            Start Here
          </Link>
          <Link
            href="/pheidi"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-primary bg-transparent border border-primary/40 rounded hover:bg-primary/5 transition-colors"
          >
            Chat with Pheidi
          </Link>
        </div>
      </div>
    </section>
  );
}
