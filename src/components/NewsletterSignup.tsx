import EmailSignupForm from "./EmailSignupForm";

export default function NewsletterSignup() {
  return (
    <section className="bg-primary py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center shadow-sm [border-top:4px_solid_#FF6B00] sm:px-10 sm:py-12">
          <div className="mb-4 inline-flex rounded-full bg-primary/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary">
            Weekly newsletter
          </div>
          <div>
            <h2 className="font-headline text-3xl font-semibold text-dark mb-3 sm:text-4xl">
              Get Weekly Ultra Running Tips
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-gray sm:mb-10">
              Training advice, gear recommendations, and beginner Q&amp;A - delivered to your inbox. No spam, unsubscribe anytime.
            </p>
            <div className="flex justify-center">
              <EmailSignupForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
