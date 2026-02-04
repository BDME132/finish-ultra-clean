import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomKitWizard from "@/components/custom-kit/CustomKitWizard";

export const metadata = {
  title: "Custom Kit Request | FinishUltra",
  description:
    "Request a custom nutrition kit tailored to your ultra race needs.",
};

export default function CustomKitPage() {
  return (
    <>
      <Header />
      <main className="bg-light min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="font-headline text-4xl font-bold text-dark mb-2">
              Custom Kit Request
            </h1>
            <p className="text-gray">
              Tell us about your race and we&apos;ll build a kit just for you.
            </p>
          </div>

          <CustomKitWizard />
        </div>
      </main>
      <Footer />
    </>
  );
}
