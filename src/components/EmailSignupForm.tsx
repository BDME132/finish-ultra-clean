"use client";

import { useState, useEffect } from "react";
import { EmailSignupResponse } from "@/types/email-signup";

type Status = "idle" | "loading" | "countdown" | "success" | "error";

export default function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdownNumber, setCountdownNumber] = useState(3);

  useEffect(() => {
    if (status === "countdown") {
      if (countdownNumber > 0) {
        const timer = setTimeout(() => {
          setCountdownNumber(countdownNumber - 1);
        }, 400);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setStatus("success");
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [status, countdownNumber]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your email");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/email-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data: EmailSignupResponse = await response.json();

      if (!response.ok || data.error) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setCountdownNumber(3);
      setStatus("countdown");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "countdown") {
    return (
      <div className="text-center h-24 flex items-center justify-center">
        <span
          key={countdownNumber}
          className="text-6xl font-bold text-primary animate-bounce-in"
        >
          {countdownNumber > 0 ? countdownNumber : ""}
        </span>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center h-24 flex flex-col items-center justify-center animate-scale-in">
        <p className="text-2xl font-bold text-primary mb-1">
          You're in!
        </p>
        <p className="text-gray-600">
          We'll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col items-center gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-8 py-3 text-lg font-medium text-white bg-primary rounded-lg hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-pulse-glow"
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Joining...
            </span>
          ) : (
            "Sign Up"
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-3 text-sm text-red-600 text-center animate-fade-in">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
