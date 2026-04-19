import { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountNav from "@/components/account/AccountNav";
import AccountPostsClient from "@/app/account/posts/AccountPostsClient";
import { loadAuthorBlogPostsServer } from "@/lib/blog-server";
import {
  createSupabaseServer,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Your Blog Posts | FinishUltra",
    description:
      "Manage your community blog drafts, submissions, and published posts.",
    path: "/account/posts",
    robots: { index: false, follow: false },
  }),
};

export default async function AccountPostsPage() {
  if (!hasSupabaseServerEnv()) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-4rem)] bg-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h1 className="font-headline text-3xl font-bold text-dark mb-3">
                Blog publishing is unavailable
              </h1>
              <p className="text-gray leading-relaxed">
                Add the Supabase environment variables to enable drafts and post
                management in this environment.
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

  const posts = await loadAuthorBlogPostsServer(user.id);

  return (
    <>
      <Header />
      <main className="bg-light min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-headline text-3xl font-bold text-dark mb-6">Account</h1>
          <AccountNav />
          <AccountPostsClient initialPosts={posts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
