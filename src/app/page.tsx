import EmailSignupForm from "@/components/EmailSignupForm";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white overflow-hidden">
      <div className="text-center max-w-2xl flex flex-col items-center">
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4 opacity-0 animate-fade-in-up">
          FinishUltra
        </h1>
        <p className="text-xl text-gray-600 mb-8 opacity-0 animate-fade-in-up animation-delay-200">
          Join the community. Crush your next race.
        </p>
        <div className="opacity-0 animate-fade-in-up animation-delay-400 w-full flex justify-center">
          <EmailSignupForm />
        </div>
      </div>
    </div>
  );
}
