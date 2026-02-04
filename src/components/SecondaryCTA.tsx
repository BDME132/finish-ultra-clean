import Button from "./Button";

export default function SecondaryCTA() {
  return (
    <section className="py-16 sm:py-20 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white mb-4">
          Don&apos;t bonk at mile 80
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Set yourself up for success with a finish kit that&apos;s ready when you are.
          Your future self will thank you.
        </p>
        <Button variant="secondary" size="lg" href="#products">
          Get Your Kit
        </Button>
      </div>
    </section>
  );
}
