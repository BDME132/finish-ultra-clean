"use client";

import { useState } from "react";
import { SendNewsletterResponse } from "@/types/newsletter";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
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
        body: JSON.stringify({ subject, body }),
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
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Send Newsletter</h1>

      {/* Status Messages */}
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{message}</p>
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{message}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Subject */}
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

        {/* Body */}
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

        {/* Actions */}
        <div className="flex items-center space-x-4">
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
            <div className="flex items-center space-x-2">
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

      {/* Preview */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-4">Preview</h2>
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
