import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-light to-white py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-6">
          Your First Ultra Starts Here
        </h1>
        <p className="text-lg sm:text-xl text-gray max-w-2xl mx-auto mb-10">
          Free training plans, honest gear advice, and an AI coach who actually gets what it&apos;s like to be a beginner.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/start-here"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Start Here
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary bg-white border-2 border-primary rounded-lg hover:bg-light transition-colors"
          >
            Chat with Coach
          </Link>
        </div>
      </div>
    </section>
  );
}
