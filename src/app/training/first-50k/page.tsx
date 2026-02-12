import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Your First 50K Training Plan | FinishUltra",
  description: "A free 16-week training plan to get you from half marathon fitness to your first 50K ultra marathon. Week-by-week breakdown included.",
};

const weeks = [
  { week: 1, focus: "Build Base", longRun: "10 mi", weeklyMiles: "25-30", notes: "Easy pace. Get comfortable with time on feet." },
  { week: 2, focus: "Build Base", longRun: "11 mi", weeklyMiles: "27-32", notes: "Add 1 mile to long run. Practice hydration." },
  { week: 3, focus: "Build Base", longRun: "13 mi", weeklyMiles: "30-35", notes: "First back-to-back weekend: 13 Sat + 6 Sun." },
  { week: 4, focus: "Recovery", longRun: "8 mi", weeklyMiles: "20-25", notes: "Cutback week. Let your body adapt." },
  { week: 5, focus: "Build Endurance", longRun: "14 mi", weeklyMiles: "32-37", notes: "Start practicing race nutrition on long runs." },
  { week: 6, focus: "Build Endurance", longRun: "16 mi", weeklyMiles: "35-40", notes: "Back-to-back: 16 Sat + 8 Sun." },
  { week: 7, focus: "Build Endurance", longRun: "17 mi", weeklyMiles: "37-42", notes: "Test your race shoes and vest on this one." },
  { week: 8, focus: "Recovery", longRun: "10 mi", weeklyMiles: "22-27", notes: "Cutback week. How's your nutrition strategy feeling?" },
  { week: 9, focus: "Peak Building", longRun: "18 mi", weeklyMiles: "38-43", notes: "Biggest back-to-back: 18 Sat + 10 Sun." },
  { week: 10, focus: "Peak Building", longRun: "20 mi", weeklyMiles: "40-45", notes: "Your longest run. Simulate race conditions." },
  { week: 11, focus: "Peak Building", longRun: "22 mi", weeklyMiles: "42-47", notes: "Final big effort. You're ready after this." },
  { week: 12, focus: "Recovery", longRun: "12 mi", weeklyMiles: "25-30", notes: "Cutback week. Trust the training." },
  { week: 13, focus: "Sharpening", longRun: "18 mi", weeklyMiles: "35-40", notes: "Last long run with race nutrition dress rehearsal." },
  { week: 14, focus: "Taper", longRun: "14 mi", weeklyMiles: "28-33", notes: "Mileage drops. You may feel restless — that's normal." },
  { week: 15, focus: "Taper", longRun: "10 mi", weeklyMiles: "20-25", notes: "Easy running only. Focus on sleep and recovery." },
  { week: 16, focus: "Race Week", longRun: "50K Race!", weeklyMiles: "Race", notes: "You've done the work. Go get that finish line." },
];

export default function First50kPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-light to-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-sm font-medium text-white bg-primary px-3 py-1 rounded-full">50K</span>
              <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">Beginner</span>
              <span className="text-sm text-gray">16 Weeks</span>
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-dark mb-6">
              Your First 50K
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              From half marathon fitness to ultramarathoner in 16 weeks. This plan builds mileage gradually with nutrition practice and gear testing built in.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl font-bold text-dark mb-6">Week-by-Week Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-3 font-headline font-semibold text-dark">Week</th>
                    <th className="text-left py-3 px-3 font-headline font-semibold text-dark">Focus</th>
                    <th className="text-left py-3 px-3 font-headline font-semibold text-dark">Long Run</th>
                    <th className="text-left py-3 px-3 font-headline font-semibold text-dark">Weekly Miles</th>
                    <th className="text-left py-3 px-3 font-headline font-semibold text-dark">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((w) => (
                    <tr key={w.week} className="border-b border-gray-100 hover:bg-light/50">
                      <td className="py-3 px-3 font-medium text-dark">{w.week}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          w.focus === "Recovery" ? "bg-green-100 text-green-700" :
                          w.focus === "Taper" ? "bg-yellow-100 text-yellow-700" :
                          w.focus === "Race Week" ? "bg-primary/10 text-primary" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {w.focus}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-dark">{w.longRun}</td>
                      <td className="py-3 px-3 text-gray">{w.weeklyMiles}</td>
                      <td className="py-3 px-3 text-gray">{w.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 bg-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl font-bold text-dark mb-6">Key Principles</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-headline font-bold text-dark mb-2">Run Easy</h3>
                <p className="text-gray leading-relaxed">80% of your running should be at conversational pace. If you can&apos;t talk in full sentences, slow down. Ultra running is about endurance, not speed.</p>
              </div>
              <div>
                <h3 className="font-headline font-bold text-dark mb-2">Back-to-Back Long Runs</h3>
                <p className="text-gray leading-relaxed">Running long on Saturday then medium on Sunday teaches your body to run on tired legs — exactly what you&apos;ll face in a 50K.</p>
              </div>
              <div>
                <h3 className="font-headline font-bold text-dark mb-2">Practice Nutrition</h3>
                <p className="text-gray leading-relaxed">Every long run is a chance to test your fueling strategy. By race day, eating while running should feel automatic.</p>
              </div>
              <div>
                <h3 className="font-headline font-bold text-dark mb-2">Respect the Cutback Weeks</h3>
                <p className="text-gray leading-relaxed">Recovery weeks aren&apos;t wasted weeks. Your body gets stronger during rest, not during the run itself.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-headline text-2xl font-bold text-dark mb-4">Need Gear for Training?</h2>
            <p className="text-gray mb-6">Check out our curated First 50K Kit — everything you need, nothing you don&apos;t.</p>
            <Link
              href="/gear/kits#first-50k"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              View the First 50K Kit
            </Link>
          </div>
        </section>

        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
