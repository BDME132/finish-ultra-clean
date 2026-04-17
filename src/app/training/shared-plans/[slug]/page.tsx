import { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import PublicTrainingPlanDetailClient from "@/app/training/shared-plans/[slug]/PublicTrainingPlanDetailClient";
import { loadPublicTrainingPlanBySlugServer } from "@/lib/public-training-plans-server";
import { breadcrumbJsonLdDocument } from "@/lib/schema";

type SharedTrainingPlanDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: SharedTrainingPlanDetailPageProps,
): Promise<Metadata> {
  const { slug } = await params;
  const plan = await loadPublicTrainingPlanBySlugServer(slug);

  if (!plan) {
    return {
      title: "Shared Plan Not Found | FinishUltra",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${plan.planTitle} | Shared Training Plans | FinishUltra`,
    description: `Browse the full ${plan.distance} ${plan.level} training schedule shared by ${plan.authorDisplayName}.`,
    alternates: { canonical: `/training/shared-plans/${plan.slug}` },
  };
}

export default async function SharedTrainingPlanDetailPage({ params }: SharedTrainingPlanDetailPageProps) {
  const { slug } = await params;
  const plan = await loadPublicTrainingPlanBySlugServer(slug);

  if (!plan) {
    notFound();
  }

  const breadcrumbJsonLd = breadcrumbJsonLdDocument(
    `/training/shared-plans/${plan.slug}`,
    plan.planTitle,
  );

  return (
    <>
      <Header />
      <JsonLd data={breadcrumbJsonLd} />
      <main>
        <PublicTrainingPlanDetailClient plan={plan} />
      </main>
      <Footer />
    </>
  );
}
