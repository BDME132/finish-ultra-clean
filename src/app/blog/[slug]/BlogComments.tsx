"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import type { BlogComment } from "@/lib/blog";

type BlogCommentsProps = {
  postId: string;
  initialComments: BlogComment[];
  isConfigured: boolean;
};

export default function BlogComments({
  postId,
  initialComments,
  isConfigured,
}: BlogCommentsProps) {
  const { user, isLoading } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/blog/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to post comment");
      }

      setComments((current) => [...current, payload.comment]);
      setBody("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to post comment",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    try {
      const response = await fetch(`/api/blog/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "Failed to delete comment");
      }

      setComments((current) =>
        current.filter((comment) => comment.id !== commentId),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete comment",
      );
    }
  }

  return (
    <section className="py-12 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-headline text-2xl font-bold text-dark">
              Comments
            </h2>
            <p className="text-sm text-gray mt-2">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </p>
          </div>
        </div>

        {!isConfigured && (
          <div className="rounded-2xl border border-gray-200 bg-light px-5 py-4 text-sm text-gray mb-6">
            Comments are unavailable until Supabase is configured for this
            environment.
          </div>
        )}

        {isConfigured && !isLoading && !user && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 mb-6">
            <p className="text-sm text-dark mb-2">
              Sign in to join the conversation.
            </p>
            <Link
              href="/login"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Log in to comment
            </Link>
          </div>
        )}

        {isConfigured && user && (
          <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-5 mb-8 shadow-sm">
            <label
              htmlFor="blog-comment"
              className="block text-sm font-semibold text-dark mb-2"
            >
              Add a comment
            </label>
            <textarea
              id="blog-comment"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Share your experience, question, or takeaway."
              rows={4}
              maxLength={2000}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-gray">
                Comments publish immediately and may be moderated later.
              </p>
              <button
                type="submit"
                disabled={isSubmitting || !body.trim()}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="font-semibold text-dark text-sm">
                      {comment.authorName}
                    </p>
                    <p className="text-xs text-gray">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {user && comment.authorUserId === user.id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs font-semibold text-gray hover:text-dark"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-light px-6 py-10 text-center">
            <p className="font-semibold text-dark mb-2">No comments yet.</p>
            <p className="text-sm text-gray">
              Be the first runner to add a question or lesson learned.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
