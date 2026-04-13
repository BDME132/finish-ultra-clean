"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AuthorBlogPost } from "@/lib/blog";

type AccountPostsClientProps = {
  initialPosts: AuthorBlogPost[];
};

export default function AccountPostsClient({
  initialPosts,
}: AccountPostsClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [busyPostId, setBusyPostId] = useState<string | null>(null);

  async function handleSubmit(postId: string) {
    setBusyPostId(postId);
    setError(null);

    try {
      const response = await fetch(`/api/blog/posts/${postId}/submit`, {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit post");
      }

      if (result.post) {
        setPosts((current) =>
          current.map((post) => (post.id === postId ? result.post : post)),
        );
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit post",
      );
    } finally {
      setBusyPostId(null);
    }
  }

  async function handleArchive(postId: string) {
    setBusyPostId(postId);
    setError(null);

    try {
      const response = await fetch(`/api/blog/posts/${postId}/archive`, {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to archive post");
      }

      setPosts((current) =>
        current.map((post) =>
          post.id === postId ? { ...post, visibility: "archived" } : post,
        ),
      );
    } catch (archiveError) {
      setError(
        archiveError instanceof Error
          ? archiveError.message
          : "Failed to archive post",
      );
    } finally {
      setBusyPostId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold text-dark">
            Your Community Posts
          </h1>
          <p className="text-sm text-gray mt-2">
            Draft, submit, revise, and archive your posts from here.
          </p>
        </div>
        <Link
          href="/blog/new"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          Write a New Post
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => {
            const latestVersion = post.latestVersion ?? post.publishedVersion;
            const isBusy = busyPostId === post.id;
            const canSubmit =
              latestVersion &&
              (latestVersion.moderationStatus === "draft" ||
                latestVersion.moderationStatus === "rejected");
            const canArchive =
              post.visibility === "public" && Boolean(post.publishedVersion);

            return (
              <article
                key={post.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {latestVersion?.moderationStatus.replace(/_/g, " ") ?? "draft"}
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-dark">
                        {post.visibility === "public" ? "Published" : "Private / Archived"}
                      </span>
                    </div>
                    <h2 className="font-headline text-2xl font-bold text-dark mb-2">
                      {latestVersion?.title ?? "Untitled Draft"}
                    </h2>
                    <p className="text-sm text-gray leading-relaxed mb-3">
                      {latestVersion?.excerpt || "No excerpt yet."}
                    </p>
                    <p className="text-xs text-gray">
                      Updated{" "}
                      {new Date(post.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {latestVersion?.reviewerNote && (
                      <p className="text-sm text-gray mt-3">
                        Reviewer note: {latestVersion.reviewerNote}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/blog/new?postId=${post.id}`}
                      className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-dark hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </Link>
                    {canSubmit && (
                      <button
                        type="button"
                        onClick={() => void handleSubmit(post.id)}
                        disabled={isBusy}
                        className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
                      >
                        {isBusy ? "Submitting..." : "Submit"}
                      </button>
                    )}
                    {canArchive && (
                      <button
                        type="button"
                        onClick={() => void handleArchive(post.id)}
                        disabled={isBusy}
                        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-dark hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {isBusy ? "Archiving..." : "Archive"}
                      </button>
                    )}
                    {post.visibility === "public" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                      >
                        View Live
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="font-headline text-2xl font-bold text-dark mb-3">
            You haven’t started a post yet.
          </p>
          <p className="text-sm text-gray mb-6">
            Draft your first community article and send it into the review queue.
          </p>
          <button
            type="button"
            onClick={() => router.push("/blog/new")}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Start Writing
          </button>
        </div>
      )}
    </div>
  );
}
