"use client";

import { useEffect, useState } from "react";
import type { AdminBlogComment, AuthorBlogPost } from "@/lib/blog";

type AdminTab = "posts" | "comments";

export default function AdminBlogClient() {
  const [tab, setTab] = useState<AdminTab>("posts");
  const [posts, setPosts] = useState<AuthorBlogPost[]>([]);
  const [comments, setComments] = useState<AdminBlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [postsRes, commentsRes] = await Promise.all([
        fetch("/api/admin/blog/posts"),
        fetch("/api/admin/blog/comments"),
      ]);

      const [postsPayload, commentsPayload] = await Promise.all([
        postsRes.json(),
        commentsRes.json(),
      ]);

      if (!postsRes.ok) {
        throw new Error(postsPayload.error || "Failed to load blog posts");
      }

      if (!commentsRes.ok) {
        throw new Error(commentsPayload.error || "Failed to load comments");
      }

      setPosts(postsPayload.posts ?? []);
      setComments(commentsPayload.comments ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load moderation data",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function runAction(
    key: string,
    request: Promise<Response>,
    onSuccess?: () => void,
  ) {
    setBusyKey(key);
    setError(null);

    try {
      const response = await request;
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Action failed");
      }

      if (payload.posts) {
        setPosts(payload.posts);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        await loadData();
      }
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Action failed",
      );
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Blog Moderation</h1>
        <p className="text-sm text-gray-600 mt-2">
          Review community post submissions, archive public posts, and moderate
          comments.
        </p>
      </div>

      <div className="flex gap-2">
        {(["posts", "comments"] as const).map((nextTab) => (
          <button
            key={nextTab}
            type="button"
            onClick={() => setTab(nextTab)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === nextTab
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {nextTab === "posts" ? "Posts" : "Comments"}
          </button>
        ))}
      </div>

      {loading && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          Loading moderation queue...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && tab === "posts" && (
        <div className="space-y-4">
          {posts.map((post) => {
            const latestVersion = post.latestVersion ?? post.publishedVersion;
            const keyPrefix = `post-${post.id}`;

            return (
              <article
                key={post.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap gap-2 mb-3 text-xs font-semibold">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                        {post.authorType === "ai" ? "AI" : "Member"}
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                        {latestVersion?.moderationStatus.replace(/_/g, " ") ?? "draft"}
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                        {post.visibility}
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {latestVersion?.title ?? "Untitled"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      By {post.authorName} · Slug: {post.slug}
                    </p>
                    <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                      {latestVersion?.excerpt || "No excerpt provided."}
                    </p>
                    {latestVersion?.reviewerNote && (
                      <p className="text-sm text-gray-600 mt-3">
                        Reviewer note: {latestVersion.reviewerNote}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {latestVersion?.moderationStatus === "pending_review" && (
                      <>
                        <button
                          type="button"
                          disabled={busyKey === `${keyPrefix}-approve`}
                          onClick={() =>
                            void runAction(
                              `${keyPrefix}-approve`,
                              fetch(`/api/admin/blog/posts/${post.id}/approve`, {
                                method: "POST",
                              }),
                            )
                          }
                          className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={busyKey === `${keyPrefix}-reject`}
                          onClick={() => {
                            const note = window.prompt("Reviewer note", "Please revise and resubmit.");
                            if (note === null) return;
                            void runAction(
                              `${keyPrefix}-reject`,
                              fetch(`/api/admin/blog/posts/${post.id}/reject`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ note }),
                              }),
                            );
                          }}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {post.visibility === "public" ? (
                      <button
                        type="button"
                        disabled={busyKey === `${keyPrefix}-archive`}
                        onClick={() =>
                          void runAction(
                            `${keyPrefix}-archive`,
                            fetch(`/api/admin/blog/posts/${post.id}/archive`, {
                              method: "POST",
                            }),
                          )
                        }
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Archive
                      </button>
                    ) : (
                      post.publishedVersion && (
                        <button
                          type="button"
                          disabled={busyKey === `${keyPrefix}-restore`}
                          onClick={() =>
                            void runAction(
                              `${keyPrefix}-restore`,
                              fetch(`/api/admin/blog/posts/${post.id}/restore`, {
                                method: "POST",
                              }),
                            )
                          }
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Restore
                        </button>
                      )
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
              No blog posts found.
            </div>
          )}
        </div>
      )}

      {!loading && tab === "comments" && (
        <div className="space-y-4">
          {comments.map((comment) => {
            const keyPrefix = `comment-${comment.id}`;
            return (
              <article
                key={comment.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap gap-2 mb-3 text-xs font-semibold">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                        {comment.moderationStatus}
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                        /blog/{comment.postSlug}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {comment.postTitle}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      {comment.authorName}
                    </p>
                    <p className="text-sm text-gray-700 mt-4 whitespace-pre-wrap leading-relaxed">
                      {comment.body}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {comment.moderationStatus === "visible" ? (
                      <button
                        type="button"
                        disabled={busyKey === `${keyPrefix}-hide`}
                        onClick={() =>
                          void runAction(
                            `${keyPrefix}-hide`,
                            fetch(`/api/admin/blog/comments/${comment.id}/hide`, {
                              method: "POST",
                            }),
                          )
                        }
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Hide
                      </button>
                    ) : comment.moderationStatus === "hidden" ? (
                      <button
                        type="button"
                        disabled={busyKey === `${keyPrefix}-unhide`}
                        onClick={() =>
                          void runAction(
                            `${keyPrefix}-unhide`,
                            fetch(`/api/admin/blog/comments/${comment.id}/unhide`, {
                              method: "POST",
                            }),
                          )
                        }
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Restore
                      </button>
                    ) : null}

                    <button
                      type="button"
                      disabled={busyKey === `${keyPrefix}-delete`}
                      onClick={() =>
                        void runAction(
                          `${keyPrefix}-delete`,
                          fetch(`/api/blog/comments/${comment.id}`, {
                            method: "DELETE",
                          }),
                        )
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {comments.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
              No comments found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
