"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Comment {
  id: string;
  userId: string;
  displayName: string | null;
  productId: string;
  parentId: string | null;
  body: string;
  helpfulCount: number;
  createdAt: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

function CommentForm({
  onSubmit,
  placeholder,
  submitLabel,
  autoFocus,
}: {
  onSubmit: (body: string) => Promise<void>;
  placeholder: string;
  submitLabel: string;
  autoFocus?: boolean;
}) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(body.trim());
      setBody("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={3}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-dark placeholder:text-gray/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!body.trim() || submitting}
          className="text-sm font-medium px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Posting..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  replies,
  isLoggedIn,
  onReply,
  onFlag,
}: {
  comment: Comment;
  replies: Comment[];
  isLoggedIn: boolean;
  onReply: (parentId: string, body: string) => Promise<void>;
  onFlag: (commentId: string) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  async function handleReply(body: string) {
    await onReply(comment.id, body);
    setShowReplyForm(false);
  }

  return (
    <div className="space-y-0">
      {/* Comment card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {(comment.displayName ?? "R")[0].toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-dark">
            {comment.displayName ?? "Runner"}
          </span>
          <span className="text-xs text-gray/60">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-gray leading-relaxed whitespace-pre-wrap">
          {comment.body}
        </p>
        <div className="flex items-center gap-4 mt-3">
          {isLoggedIn && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
            >
              {showReplyForm ? "Cancel" : "Reply"}
            </button>
          )}
          <button
            onClick={() => onFlag(comment.id)}
            className="text-xs text-gray/40 hover:text-red-400 transition-colors"
            title="Flag this comment"
          >
            Flag
          </button>
        </div>
      </div>

      {/* Reply form */}
      {showReplyForm && (
        <div className="ml-8 mt-3">
          <CommentForm
            onSubmit={handleReply}
            placeholder="Write a reply..."
            submitLabel="Reply"
            autoFocus
          />
        </div>
      )}

      {/* Nested replies */}
      {replies.length > 0 && (
        <div className="ml-6 mt-3 pl-4 border-l-2 border-primary/20 space-y-3">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  {(reply.displayName ?? "R")[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-dark">
                  {reply.displayName ?? "Runner"}
                </span>
                <span className="text-xs text-gray/60">{timeAgo(reply.createdAt)}</span>
              </div>
              <p className="text-sm text-gray leading-relaxed whitespace-pre-wrap">
                {reply.body}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => onFlag(reply.id)}
                  className="text-xs text-gray/40 hover:text-red-400 transition-colors"
                  title="Flag this comment"
                >
                  Flag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CommentSection({ productId }: { productId: string }) {
  const { user, isLoading: authLoading } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!user;

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?productId=${encodeURIComponent(productId)}`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(data.comments);
    } catch {
      setError("Could not load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handlePost(body: string, parentId?: string) {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, parentId: parentId ?? null, body }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to post comment");
    }

    await fetchComments();
  }

  async function handleReply(parentId: string, body: string) {
    await handlePost(body, parentId);
  }

  function handleFlag(commentId: string) {
    fetch("/api/flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: "comment", contentId: commentId }),
    }).catch(() => {
      // Silently fail — flagging is best-effort
    });
  }

  // ── Derived data ──

  const topLevel = comments.filter((c) => c.parentId === null);
  const repliesByParent = comments.reduce<Record<string, Comment[]>>((acc, c) => {
    if (c.parentId) {
      if (!acc[c.parentId]) acc[c.parentId] = [];
      acc[c.parentId].push(c);
    }
    return acc;
  }, {});

  const totalCount = comments.length;

  // ── Render ──

  if (loading || authLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-gray">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="font-headline font-bold text-dark text-lg">
        Discussion{totalCount > 0 ? ` (${totalCount} comment${totalCount === 1 ? "" : "s"})` : ""}
      </h2>

      {/* Top-level comment form or login prompt */}
      {isLoggedIn ? (
        <CommentForm
          onSubmit={(body) => handlePost(body)}
          placeholder="Share your experience with this product..."
          submitLabel="Post Comment"
        />
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 text-center">
          <p className="text-sm text-gray">
            Log in to join the discussion
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Comments list */}
      {topLevel.length > 0 ? (
        <div className="space-y-4">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={repliesByParent[comment.id] ?? []}
              isLoggedIn={isLoggedIn}
              onReply={handleReply}
              onFlag={handleFlag}
            />
          ))}
        </div>
      ) : (
        !error && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <p className="text-sm text-gray">
              No comments yet. Be the first to share your experience!
            </p>
          </div>
        )
      )}
    </div>
  );
}
