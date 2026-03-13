"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { glossaryTerms } from "@/lib/content/glossary";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const categoryStyles = {
  training: "bg-primary/10 text-primary",
  "race-day": "bg-accent/10 text-accent",
  gear: "bg-emerald-100 text-emerald-700",
  nutrition: "bg-amber-100 text-amber-700",
  trail: "bg-slate-100 text-slate-700",
} as const;

const categoryLabels = {
  training: "Training",
  "race-day": "Race Day",
  gear: "Gear",
  nutrition: "Nutrition",
  trail: "Trail",
} as const;

export default function GlossaryDirectory() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTerms = useMemo(() => {
    if (!normalizedQuery) return glossaryTerms;

    return glossaryTerms.filter((term) => {
      const haystack = [
        term.term,
        term.shortDefinition,
        term.definition,
        categoryLabels[term.category],
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const groupedTerms = useMemo(() => {
    return filteredTerms.reduce<Record<string, typeof glossaryTerms>>((groups, term) => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(term);
      return groups;
    }, {});
  }, [filteredTerms]);

  const availableLetters = new Set(Object.keys(groupedTerms));

  return (
    <>
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] gap-6 items-start">
            <div>
              <label
                htmlFor="glossary-search"
                className="block text-sm font-medium text-dark mb-2"
              >
                Search by term or meaning
              </label>
              <div className="relative">
                <input
                  id="glossary-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try: cutoff, drop bag, power hike, sodium..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm text-dark placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <svg
                  className="w-5 h-5 text-gray absolute right-4 top-1/2 -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray mt-3">
                {filteredTerms.length} term{filteredTerms.length === 1 ? "" : "s"} shown
                {normalizedQuery ? ` for "${query.trim()}"` : ` from the full glossary`}.
              </p>
            </div>

            <div className="bg-light rounded-2xl p-5 border border-gray-100">
              <p className="text-sm font-medium text-dark mb-2">Need a fast answer?</p>
              <p className="text-sm text-gray leading-relaxed mb-4">
                Use the glossary for definitions. Use Pheidi when you need context or help applying a term to your own training.
              </p>
              <Link
                href="/pheidi"
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Ask Pheidi &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-gray-100 bg-light/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray mb-4">
            Jump To Letter
          </p>
          <div className="flex flex-wrap gap-2">
            {letters.map((letter) => {
              const isAvailable = availableLetters.has(letter);

              return isAvailable ? (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="w-10 h-10 rounded-lg border border-gray-200 bg-white text-sm font-medium text-dark hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                >
                  {letter}
                </a>
              ) : (
                <span
                  key={letter}
                  className="w-10 h-10 rounded-lg border border-gray-100 bg-white/70 text-sm font-medium text-gray/40 flex items-center justify-center"
                >
                  {letter}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTerms.length === 0 ? (
            <div className="max-w-3xl mx-auto text-center bg-light rounded-2xl border border-gray-100 p-12">
              <h2 className="font-headline text-2xl font-bold text-dark mb-3">
                No matching terms
              </h2>
              <p className="text-gray mb-6">
                Try a broader search like "gear", "hike", or "nutrition".
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.keys(groupedTerms)
                .sort()
                .map((letter) => (
                  <section key={letter} id={`letter-${letter}`} className="scroll-mt-24">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary text-white font-headline text-xl font-bold flex items-center justify-center">
                        {letter}
                      </div>
                      <div>
                        <h2 className="font-headline text-2xl font-bold text-dark">
                          {letter}
                        </h2>
                        <p className="text-sm text-gray">
                          {groupedTerms[letter].length} term
                          {groupedTerms[letter].length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {groupedTerms[letter].map((term) => (
                        <article
                          key={term.slug}
                          id={term.slug}
                          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="font-headline text-2xl font-bold text-dark">
                              {term.term}
                            </h3>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${categoryStyles[term.category]}`}
                            >
                              {categoryLabels[term.category]}
                            </span>
                          </div>
                          <p className="text-dark font-medium leading-relaxed mb-3">
                            {term.shortDefinition}
                          </p>
                          <p className="text-gray leading-relaxed">
                            {term.definition}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark rounded-3xl px-6 py-8 sm:px-10 sm:py-10 text-white grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-6 items-center">
            <div>
              <p className="text-sm font-medium text-primary mb-2">Keep learning</p>
              <h2 className="font-headline text-3xl font-bold mb-3">
                Know the terms. Then use them.
              </h2>
              <p className="text-white/70 max-w-2xl leading-relaxed">
                The glossary gives you the language. The training plans, gear guides, and AI coach help you act on it.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <Link
                href="/training/first-50k"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                First 50K Plan
              </Link>
              <Link
                href="/tools/pace-calculator"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-white/15 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Pace Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
