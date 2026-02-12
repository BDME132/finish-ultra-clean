import EmailSignupForm from "./EmailSignupForm";

export default function NewsletterSignup() {
  return (
    <section className="bg-primary py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-headline text-3xl font-bold text-white mb-3">
          Get Weekly Ultra Running Tips
        </h2>
        <p className="text-white/80 mb-8">
          Training advice, gear recommendations, and beginner Q&amp;A — delivered to your inbox. No spam, unsubscribe anytime.
        </p>
        <div className="flex justify-center">
          <EmailSignupForm />
        </div>
      </div>
    </section>
  );
}
