import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Race Week Protocol | FinishUltra",
  description: "A day-by-day guide for the week before your ultra marathon. Taper, nutrition, gear prep, sleep, and mental preparation.",
  alternates: { canonical: "/training/race-week" },
};

const days = [
  {
    day: "Monday (6 days out)",
    title: "Easy Shakeout",
    details: "20-30 minute easy run. Nothing hard. Start prioritizing sleep — aim for 8+ hours every night this week.",
  },
  {
    day: "Tuesday (5 days out)",
    title: "Gear Check",
    details: "Lay out everything you plan to wear and carry. Check your vest pockets, charge your watch, and verify you have enough nutrition. Rest day or 20 min walk.",
  },
  {
    day: "Wednesday (4 days out)",
    title: "Short Easy Run",
    details: "20 minutes easy. Start carb loading — increase your carbohydrate intake by 20-30%. Pasta, rice, bread, potatoes. Don't try new foods.",
  },
  {
    day: "Thursday (3 days out)",
    title: "Rest Day",
    details: "No running. Continue carb loading. Review the race course profile and aid station locations. Know what each aid station offers.",
  },
  {
    day: "Friday (2 days out)",
    title: "Logistics Day",
    details: "10 minute jog if you feel restless. Drive the route to the start (if possible). Prepare your drop bags. Print your race plan. Check the weather forecast.",
  },
  {
    day: "Saturday (1 day out)",
    title: "Final Prep",
    details: "Complete rest. Lay out race morning clothes. Pre-make breakfast. Set two alarms. Go to bed early — you probably won't sleep great, and that's normal.",
  },
  {
    day: "Sunday (Race Day)",
    title: "Go Time",
    details: "Eat your tested breakfast 2-3 hours before start. Arrive early. Use the bathroom twice. Start slow — slower than you think. Walk the uphills, run the flats. Eat at every aid station. You've got this.",
  },
];

export default function RaceWeekPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://finishultra.com" },
      { "@type": "ListItem", position: 2, name: "Training", item: "https://finishultra.com/training" },
      { "@type": "ListItem", position: 3, name: "Race Week", item: "https://finishultra.com/training/race-week" },
    ],
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-sm font-medium text-white bg-primary px-3 py-1 rounded-full">Any Distance</span>
              <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">Beginner</span>
              <span className="text-sm text-gray">1 Week</span>
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Race Week Protocol
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              The final 7 days before your ultra. Day-by-day guidance for taper, nutrition, gear prep, and mental readiness.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {days.map((d, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary mb-1">{d.day}</p>
                    <h3 className="font-headline text-lg font-bold text-dark mb-2">{d.title}</h3>
                    <p className="text-gray leading-relaxed">{d.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl font-bold text-dark mb-6">Race Day Checklist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Trail shoes (broken in)",
                "Toe socks",
                "Running vest/pack",
                "Water bottles/flasks",
                "Nutrition (gels, drink mix)",
                "Race bib + safety pins",
                "Watch (charged)",
                "Body glide / anti-chafe",
                "Headlamp + extra batteries",
                "Phone + charger",
                "Sunscreen",
                "Change of clothes (post-race)",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray">
                  <span className="w-4 h-4 border-2 border-gray-300 rounded flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
