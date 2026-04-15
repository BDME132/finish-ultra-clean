"use client";

import { useState } from "react";
import { SendNewsletterResponse } from "@/types/newsletter";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [publishToArchive, setPublishToArchive] = useState(false);
  const [archiveSlug, setArchiveSlug] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setStatus("error");
      setMessage("Subject and body are required");
      return;
    }

    setStatus("loading");
    setMessage("");
    setShowConfirm(false);

    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
          publishToArchive,
          archiveSlug: archiveSlug.trim() || null,
        }),
      });

      const json: SendNewsletterResponse = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to send newsletter");
      }

      setStatus("success");
      setMessage(`Newsletter sent successfully to ${json.recipientCount} subscribers!`);
      setRecipientCount(json.recipientCount || null);
      setSubject("");
      setBody("");
      setPublishToArchive(false);
      setArchiveSlug("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Send Newsletter</h1>

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{message}</p>
          {recipientCount != null && (
            <p className="text-green-600 text-sm mt-1">
              Recipients: {recipientCount}. Unsubscribe footer and List-Unsubscribe headers are added automatically per subscriber.
            </p>
          )}
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{message}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Newsletter subject..."
            disabled={status === "loading"}
          />
        </div>

        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Body (HTML supported)
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="Write your newsletter content here..."
            disabled={status === "loading"}
          />
        </div>

        <div className="rounded-lg border border-gray-200 p-4 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={publishToArchive}
              onChange={(e) => setPublishToArchive(e.target.checked)}
              disabled={status === "loading"}
              className="mt-1"
            />
            <span>
              <span className="font-medium text-gray-800">
                Publish to public archive
              </span>
              <span className="block text-sm text-gray-500">
                Shows this issue on /newsletter with a shareable URL. Slug is generated from the subject if left blank.
              </span>
            </span>
          </label>
          {publishToArchive && (
            <div>
              <label
                htmlFor="archiveSlug"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Archive URL slug (optional)
              </label>
              <input
                type="text"
                id="archiveSlug"
                value={archiveSlug}
                onChange={(e) => setArchiveSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="e.g. march-training-tips"
                disabled={status === "loading"}
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 flex-wrap gap-y-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>

          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={status === "loading" || !subject.trim() || !body.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Newsletter
            </button>
          ) : (
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm text-gray-600">Are you sure?</span>
              <button
                type="button"
                onClick={handleSend}
                disabled={status === "loading"}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Yes, Send Now"}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={status === "loading"}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {showPreview && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-4">Preview</h2>
          <p className="text-xs text-gray-500 mb-3">
            Subscribers will also receive an automatic footer with an unsubscribe link (not shown in this preview).
          </p>
          <div className="border rounded-lg p-4">
            <div className="border-b pb-2 mb-4">
              <span className="text-sm text-gray-500">Subject: </span>
              <span className="font-medium">{subject || "(no subject)"}</span>
            </div>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: body || "<p>(no content)</p>" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
