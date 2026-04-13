"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MarkdownContent from "@/components/blog/MarkdownContent";
import { useAuth } from "@/components/AuthProvider";
import { AuthorBlogPost, getBlogSourceLabel } from "@/lib/blog";
import {
  DEFAULT_BLOG_EDITOR_INPUT,
  versionToEditorInput,
} from "@/lib/blog-editor";
import {
  createSupabaseBrowser,
  hasSupabaseBrowserEnv,
} from "@/lib/supabase/client";

type BlogComposerProps = {
  initialPost: AuthorBlogPost | null;
};

type ComposerTab = "edit" | "preview";

const categoryOptions = [
  "Getting Started",
  "Training",
  "Gear",
  "Nutrition",
  "Race Day",
  "Stories",
];

function sanitizeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-");
}

export default function BlogComposer({ initialPost }: BlogComposerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [tab, setTab] = useState<ComposerTab>("edit");
  const [post, setPost] = useState(initialPost);
  const [form, setForm] = useState(
    initialPost?.latestVersion
      ? versionToEditorInput(initialPost.latestVersion)
      : initialPost?.publishedVersion
        ? versionToEditorInput(initialPost.publishedVersion)
        : DEFAULT_BLOG_EDITOR_INPUT,
  );
  const [tagsInput, setTagsInput] = useState(form.tags.join(", "));
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const latestVersion = post?.latestVersion ?? post?.publishedVersion ?? null;
  const isPendingReview = latestVersion?.moderationStatus === "pending_review";
  const isSupabaseConfigured = hasSupabaseBrowserEnv();

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveDraft(showMessage = true) {
    setIsSaving(true);
    setError(null);
    setStatusMessage(null);

    const payload = {
      ...form,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch(
        post ? `/api/blog/posts/${post.id}` : "/api/blog/posts",
        {
          method: post ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save draft");
      }

      if (result.post) {
        setPost(result.post);
        if (!post && result.post.id) {
          router.replace(`/blog/new?postId=${result.post.id}`);
        }
      }

      if (showMessage) {
        setStatusMessage("Draft saved.");
      }

      return result.post as AuthorBlogPost | null;
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save draft",
      );
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);
    setStatusMessage(null);

    try {
      const savedPost = post ?? (await saveDraft(false));
      const targetId = savedPost?.id ?? post?.id;

      if (!targetId) {
        throw new Error("Save the draft before submitting.");
      }

      const response = await fetch(`/api/blog/posts/${targetId}/submit`, {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit post");
      }

      if (result.post) {
        setPost(result.post);
      }
      setStatusMessage("Post submitted for review.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit post",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCoverUpload(file: File | null) {
    if (!file || !user) return;
    if (!isSupabaseConfigured) {
      setError("File uploads require Supabase configuration.");
      return;
    }

    const supabase = createSupabaseBrowser();
    if (!supabase) {
      setError("File uploads require Supabase configuration.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const filePath = `${user.id}/${Date.now()}-${sanitizeFilename(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from("blog-cover-images")
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type || "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("blog-cover-images")
        .getPublicUrl(filePath);

      setField("coverImageUrl", data.publicUrl);
      setStatusMessage("Cover image uploaded.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
            Community Publishing
          </p>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-dark">
            {post ? "Edit Community Post" : "Write a Community Post"}
          </h1>
          <p className="text-sm text-gray mt-2 max-w-2xl">
            Community posts are written by runners. Pheidi AI guides are labeled
            separately in the public feed.
          </p>
        </div>
        <Link
          href="/account/posts"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Back to your posts
        </Link>
      </div>

      {latestVersion && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
              Status: {latestVersion.moderationStatus.replace(/_/g, " ")}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-dark">
              {getBlogSourceLabel("member")}
            </span>
            {post?.visibility === "archived" && post?.publishedVersion && (
              <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-dark">
                Archived
              </span>
            )}
          </div>
          {latestVersion.reviewerNote && (
            <p className="mt-3 text-sm text-gray leading-relaxed">
              Reviewer note: {latestVersion.reviewerNote}
            </p>
          )}
        </div>
      )}

      {(statusMessage || error) && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {error ?? statusMessage}
        </div>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex gap-1 border-b border-gray-100 bg-light px-4 py-3">
          {(["edit", "preview"] as const).map((nextTab) => (
            <button
              key={nextTab}
              type="button"
              onClick={() => setTab(nextTab)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                tab === nextTab
                  ? "bg-white text-dark shadow-sm"
                  : "text-gray hover:text-dark"
              }`}
            >
              {nextTab === "edit" ? "Edit" : "Preview"}
            </button>
          ))}
        </div>

        {tab === "edit" ? (
          <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr] p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(event) => setField("title", event.target.value)}
                  disabled={isPendingReview}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50"
                  placeholder="e.g. What I Learned From My First 50K"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Excerpt
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(event) => setField("excerpt", event.target.value)}
                  disabled={isPendingReview}
                  rows={3}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50"
                  placeholder="A 1-2 sentence summary for the blog card and SEO description."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(event) => setField("category", event.target.value)}
                    disabled={isPendingReview}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Tags
                  </label>
                  <input
                    value={tagsInput}
                    onChange={(event) => setTagsInput(event.target.value)}
                    disabled={isPendingReview}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50"
                    placeholder="first ultra, race recap, lessons"
                  />
                  <p className="text-xs text-gray mt-2">
                    Up to 5 tags, comma separated.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Cover image
                </label>
                <div className="rounded-2xl border border-dashed border-gray-300 p-4">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isPendingReview || isUploading}
                    onChange={(event) =>
                      handleCoverUpload(event.target.files?.[0] ?? null)
                    }
                    className="block w-full text-sm text-dark"
                  />
                  <p className="text-xs text-gray mt-2">
                    Upload a cover image to the public blog storage bucket.
                  </p>
                </div>
                {form.coverImageUrl && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
                    <img
                      src={form.coverImageUrl}
                      alt="Cover preview"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Body (markdown)
              </label>
              <textarea
                value={form.bodyMarkdown}
                onChange={(event) => setField("bodyMarkdown", event.target.value)}
                disabled={isPendingReview}
                rows={22}
                className="w-full rounded-2xl border border-gray-200 px-4 py-4 font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50"
                placeholder="Write your post in markdown. Use ## for headings, - for lists, and **bold** where useful."
              />
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {form.category}
                </span>
                <h2 className="font-headline text-4xl font-bold text-dark mt-4 mb-3">
                  {form.title || "Untitled Draft"}
                </h2>
                <p className="text-gray leading-relaxed">
                  {form.excerpt || "Add an excerpt to preview the summary here."}
                </p>
              </div>

              {form.coverImageUrl && (
                <div className="overflow-hidden rounded-3xl border border-gray-200 mb-8">
                  <img
                    src={form.coverImageUrl}
                    alt={form.title || "Draft cover image"}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <MarkdownContent markdown={form.bodyMarkdown || "Start writing to preview your post."} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-light px-6 py-4">
          <p className="text-xs text-gray max-w-xl">
            Posts stay private until an admin approves them. Comments on public
            posts publish immediately and may be moderated later.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void saveDraft()}
              disabled={isSaving || isSubmitting || isPendingReview}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isSaving || isSubmitting || isPendingReview}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
