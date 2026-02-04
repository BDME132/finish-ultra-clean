import Button from "./Button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-background py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-6">
          Fuel Your Finish
        </h1>
        <p className="text-lg sm:text-xl text-gray max-w-2xl mx-auto mb-10">
          Premium finish line kits curated by ultra runners, for ultra runners.
          Everything you need dominate your next race.
        </p>
        <Button href="/kits" size="lg">
          Shop Kits
        </Button>
      </div>
    </section>
  );
}
