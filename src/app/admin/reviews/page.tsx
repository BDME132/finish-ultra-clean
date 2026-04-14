"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface FlagContent {
  id: string;
  userId: string;
  productId: string;
  body: string;
  title: string | null;
  rating: number | null;
  status: string;
  createdAt: string;
  displayName: string | null;
}

interface Flag {
  id: string;
  reporterId: string;
  contentType: "review" | "comment";
  contentId: string;
  reason: string;
  details: string | null;
  status: string;
  createdAt: string;
  content: FlagContent | null;
}

interface Stats {
  pendingFlags: number;
  totalReviews: number;
  totalComments: number;
}

interface ModerationData {
  flags: Flag[];
  stats: Stats;
}

const reasonColors: Record<string, string> = {
  spam: "bg-red-100 text-red-800",
  offensive: "bg-red-100 text-red-800",
  misleading: "bg-yellow-100 text-yellow-800",
  "off-topic": "bg-gray-100 text-gray-800",
  other: "bg-gray-100 text-gray-800",
};

export default function AdminReviewsPage() {
  const [data, setData] = useState<ModerationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function fetchFlags() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) {
        throw new Error("Failed to fetch flagged content");
      }
      const json: ModerationData = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFlags();
  }, []);

  async function handleAction(flagId: string, action: "dismiss" | "hide") {
    setActionLoading(flagId);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flagId, action }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Action failed");
      }

      // Refresh the list after action
      await fetchFlags();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-lg text-gray-600">Loading flagged content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Review Moderation</h1>
        <Link
          href="/admin"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Pending Flags
          </h2>
          <p className="text-4xl font-bold text-blue-600">
            {data?.stats.pendingFlags ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Total Reviews
          </h2>
          <p className="text-4xl font-bold text-blue-600">
            {data?.stats.totalReviews ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Total Comments
          </h2>
          <p className="text-4xl font-bold text-blue-600">
            {data?.stats.totalComments ?? 0}
          </p>
        </div>
      </div>

      {/* Flagged Content List */}
      <div className="space-y-4">
        {data?.flags.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              No pending flags. All clear!
            </p>
          </div>
        ) : (
          data?.flags.map((flag) => (
            <div
              key={flag.id}
              className="bg-white rounded-lg shadow p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reasonColors[flag.reason] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {flag.reason}
                  </span>
                  <span className="text-sm text-gray-500">
                    {flag.contentType === "review" ? "Review" : "Comment"}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  Flagged {new Date(flag.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Flagged content body */}
              {flag.content ? (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {flag.content.title && (
                    <h3 className="font-medium text-gray-900">
                      {flag.content.title}
                    </h3>
                  )}
                  <p className="text-gray-700">{flag.content.body}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      By:{" "}
                      <span className="font-medium">
                        {flag.content.displayName || "Anonymous"}
                      </span>
                    </span>
                    {flag.content.rating !== null && (
                      <span>Rating: {flag.content.rating}/5</span>
                    )}
                    <Link
                      href={`/gear/library/${flag.content.productId}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-400 italic">
                    Content no longer available
                  </p>
                </div>
              )}

              {/* Flag details */}
              {flag.details && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Reporter details:</span>{" "}
                  {flag.details}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleAction(flag.id, "dismiss")}
                  disabled={actionLoading === flag.id}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading === flag.id ? "Processing..." : "Dismiss Flag"}
                </button>
                <button
                  onClick={() => handleAction(flag.id, "hide")}
                  disabled={actionLoading === flag.id}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading === flag.id ? "Processing..." : "Hide Content"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
