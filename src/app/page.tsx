import EmailSignupForm from "@/components/EmailSignupForm";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <div className="text-center max-w-2xl">
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4">
          FinishUltra
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Premium ultra running nutrition kits, curated for your next big race.
        </p>
        <EmailSignupForm />
      </div>
    </div>
  );
}
