"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string | null;
  body: string;
  raceContext: string | null;
  milesTested: number | null;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  displayName: string | null;
}

interface ReviewsResponse {
  reviews: Review[];
  total: number;
  avgRating: number;
  ratingCounts: Record<number, number>;
}

type SortOption = "newest" | "oldest" | "helpful";

const FLAG_REASONS = [
  { value: "spam", label: "Spam" },
  { value: "offensive", label: "Offensive" },
  { value: "misleading", label: "Misleading" },
  { value: "off-topic", label: "Off-topic" },
  { value: "other", label: "Other" },
] as const;

// ─── Star SVG Helpers ──────────────────────────────────────────────────────

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? "text-amber-400" : "text-gray-200"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      {half ? (
        <>
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfStar)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </>
      ) : (
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      )}
    </svg>
  );
}

function StarRatingDisplay({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${sizeClass} ${i < Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            className="focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(starValue)}
            aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
            role="radio"
            aria-checked={value === starValue}
          >
            <svg
              className={`w-8 h-8 transition-colors ${
                (hover || value) >= starValue ? "text-amber-400" : "text-gray-200"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// ─── Rating Summary ────────────────────────────────────────────────────────

function RatingSummary({
  avgRating,
  total,
  ratingCounts,
}: {
  avgRating: number;
  total: number;
  ratingCounts: Record<number, number>;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Left: big average */}
        <div className="flex flex-col items-center sm:items-start gap-1 sm:pr-8 sm:border-r sm:border-gray-100">
          <span className="text-5xl font-bold text-dark">{avgRating.toFixed(1)}</span>
          <StarRatingDisplay rating={avgRating} />
          <span className="text-sm text-gray mt-1">
            {total} {total === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Right: distribution bars */}
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-gray w-6 text-right">{star}</span>
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Flag Modal ────────────────────────────────────────────────────────────

function FlagModal({
  reviewId,
  onClose,
}: {
  reviewId: string;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      setError("Please select a reason.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "review",
          contentId: reviewId,
          reason,
          details: details.trim() || undefined,
        }),
      });

      if (res.status === 409) {
        setError("You have already flagged this review.");
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit flag.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="font-headline font-bold text-dark text-lg mb-4">
          Flag Review
        </h3>

        {success ? (
          <p className="text-sm text-success font-medium">Thank you. Your report has been submitted.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Reason
              </label>
              <div className="space-y-2">
                {FLAG_REASONS.map((r) => (
                  <label key={r.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-dark">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="flag-details" className="block text-sm font-medium text-dark mb-1">
                Details (optional)
              </label>
              <textarea
                id="flag-details"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-dark"
                placeholder="Any additional context..."
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="text-sm px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Review Card ───────────────────────────────────────────────────────────

function ReviewCard({
  review,
  isLoggedIn,
}: {
  review: Review;
  isLoggedIn: boolean;
}) {
  const [showFlagModal, setShowFlagModal] = useState(false);

  const dateStr = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StarRatingDisplay rating={review.rating} size="sm" />
            <span className="text-xs text-gray">{dateStr}</span>
          </div>
          <span className="text-sm font-semibold text-dark">
            {review.displayName || "Anonymous Runner"}
          </span>
        </div>
        {isLoggedIn && (
          <button
            onClick={() => setShowFlagModal(true)}
            className="text-xs text-gray hover:text-red-400 transition-colors shrink-0"
            aria-label="Flag this review"
            title="Flag this review"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </button>
        )}
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-dark text-sm mb-1">{review.title}</h4>
      )}

      {/* Body */}
      <p className="text-sm text-gray leading-relaxed mb-3">{review.body}</p>

      {/* Context badges */}
      <div className="flex flex-wrap items-center gap-2">
        {review.raceContext && (
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
            {review.raceContext}
          </span>
        )}
        {review.milesTested && (
          <span className="text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full font-medium">
            {review.milesTested} miles tested
          </span>
        )}
        {review.helpfulCount > 0 && (
          <span className="text-xs text-gray ml-auto">
            {review.helpfulCount} found helpful
          </span>
        )}
      </div>

      {/* Flag modal */}
      {showFlagModal && (
        <FlagModal reviewId={review.id} onClose={() => setShowFlagModal(false)} />
      )}
    </div>
  );
}

// ─── Write Review Form ─────────────────────────────────────────────────────

function WriteReviewForm({
  productId,
  onReviewCreated,
}: {
  productId: string;
  onReviewCreated: (review: Review) => void;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [raceContext, setRaceContext] = useState("");
  const [milesTested, setMilesTested] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (body.trim().length < 10) {
      setError("Review must be at least 10 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim() || undefined,
          body: body.trim(),
          raceContext: raceContext.trim() || undefined,
          milesTested: milesTested ? parseInt(milesTested, 10) : undefined,
        }),
      });

      if (res.status === 409) {
        setError("You have already reviewed this product.");
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit review.");
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      onReviewCreated(data.review);

      // Reset form
      setRating(0);
      setTitle("");
      setBody("");
      setRaceContext("");
      setMilesTested("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="font-headline font-bold text-dark text-lg mb-4">
        Write a Review
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star rating */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Your Rating
          </label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="review-title" className="block text-sm font-medium text-dark mb-1">
            Title <span className="text-gray font-normal">(optional)</span>
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-dark"
            placeholder="Summarize your experience"
          />
        </div>

        {/* Body */}
        <div>
          <label htmlFor="review-body" className="block text-sm font-medium text-dark mb-1">
            Review
          </label>
          <textarea
            id="review-body"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-dark"
            placeholder="Share your experience with this product..."
            required
          />
          <p className="text-xs text-gray mt-1">
            {body.trim().length < 10
              ? `${10 - body.trim().length} more characters needed`
              : "Looks good!"}
          </p>
        </div>

        {/* Race context */}
        <div>
          <label htmlFor="review-race" className="block text-sm font-medium text-dark mb-1">
            Race Context <span className="text-gray font-normal">(optional)</span>
          </label>
          <input
            id="review-race"
            type="text"
            value={raceContext}
            onChange={(e) => setRaceContext(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-dark"
            placeholder="e.g., Western States 100, 2025"
          />
        </div>

        {/* Miles tested */}
        <div>
          <label htmlFor="review-miles" className="block text-sm font-medium text-dark mb-1">
            Miles Tested <span className="text-gray font-normal">(optional)</span>
          </label>
          <input
            id="review-miles"
            type="number"
            min="0"
            value={milesTested}
            onChange={(e) => setMilesTested(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-dark"
            placeholder="How many miles have you used this product?"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="text-sm px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

// ─── Main ReviewSection Component ──────────────────────────────────────────

export default function ReviewSection({ productId }: { productId: string }) {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/reviews?productId=${productId}&page=${page}&limit=${limit}&sort=${sort}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const json: ReviewsResponse = await res.json();
      setData(json);
    } catch {
      setError("Unable to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [productId, page, sort]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Check if current user already has a review
  const userHasReviewed = user && data?.reviews.some((r) => r.userId === user.id);

  function handleReviewCreated(review: Review) {
    // Re-fetch to get updated stats and review list
    fetchReviews();
  }

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="space-y-6">
      <h2 className="font-headline font-bold text-dark text-xl">
        Reviews
      </h2>

      {/* Rating Summary */}
      {data && data.total > 0 && (
        <RatingSummary
          avgRating={data.avgRating}
          total={data.total}
          ratingCounts={data.ratingCounts}
        />
      )}

      {data && data.total === 0 && !loading && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      )}

      {/* Sort and controls */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="review-sort" className="text-sm text-gray">
              Sort by:
            </label>
            <select
              id="review-sort"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortOption);
                setPage(1);
              }}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary text-dark"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray">Loading reviews...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-white rounded-xl border border-red-100 p-6 text-center">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchReviews}
            className="text-sm text-primary hover:text-primary-dark mt-2 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {/* Review list */}
      {!loading && data && data.reviews.length > 0 && (
        <div className="space-y-4">
          {data.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} isLoggedIn={!!user} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Write review form or login prompt */}
      {!authLoading && (
        <>
          {user && !userHasReviewed && (
            <WriteReviewForm productId={productId} onReviewCreated={handleReviewCreated} />
          )}
          {user && userHasReviewed && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <p className="text-sm text-gray">
                You have already reviewed this product. Thank you for sharing your experience!
              </p>
            </div>
          )}
          {!user && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <p className="text-sm text-gray">
                Log in to write a review
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
