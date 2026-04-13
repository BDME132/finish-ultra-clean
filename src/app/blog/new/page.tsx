import { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogComposer from "@/app/blog/new/BlogComposer";
import { loadAuthorBlogPostForEditServer } from "@/lib/blog-server";
import {
  createSupabaseServer,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo-metadata";

type BlogComposerPageProps = {
  searchParams: Promise<{ postId?: string }>;
};

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Write a Community Post | FinishUltra",
    description:
      "Create a community blog post for FinishUltra. Draft, preview, upload a cover image, and submit for review.",
    path: "/blog/new",
    robots: { index: false, follow: false },
  }),
};

export default async function BlogComposerPage({
  searchParams,
}: BlogComposerPageProps) {
  const { postId } = await searchParams;

  if (!hasSupabaseServerEnv()) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-4rem)] bg-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h1 className="font-headline text-3xl font-bold text-dark mb-3">
                Community publishing is unavailable
              </h1>
              <p className="text-gray leading-relaxed">
                Add the Supabase environment variables to enable drafts, uploads,
                comments, and moderation in this environment.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const initialPost = postId
    ? await loadAuthorBlogPostForEditServer(user.id, postId)
    : null;

  return (
    <>
      <Header />
      <main className="bg-light min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BlogComposer initialPost={initialPost} />
        </div>
      </main>
      <Footer />
    </>
  );
}
