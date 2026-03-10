"use client";

import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "pace-to-time" | "time-to-pace";
type Unit = "mi" | "km";

interface Preset {
  label: string;
  key: string;
  miles: number;
}

const PRESETS: Preset[] = [
  { label: "50K", key: "50K", miles: 31.07 },
  { label: "50 mi", key: "50mi", miles: 50 },
  { label: "100K", key: "100K", miles: 62.14 },
  { label: "100 mi", key: "100mi", miles: 100 },
];

const KM_PER_MILE = 1.60934;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert total seconds to H:MM:SS display */
function formatTime(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds < 0) return "--:--:--";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Format pace in seconds/unit → M:SS */
function formatPace(secondsPerUnit: number): string {
  if (!isFinite(secondsPerUnit) || secondsPerUnit <= 0) return "--:--";
  const m = Math.floor(secondsPerUnit / 60);
  const s = Math.floor(secondsPerUnit % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function splitsInterval(distanceMiles: number): number {
  if (distanceMiles <= 35) return 1;
  if (distanceMiles <= 65) return 2;
  return 5;
}

function slowdownLabel(pct: number): string {
  if (pct === 0) return "Even splits — same pace start to finish";
  if (pct <= 10) return "Slight fade — very controlled effort";
  if (pct <= 20) return "Moderate fade — typical competitive ultra";
  if (pct <= 35) return "Significant slowdown — common for first-timers";
  if (pct <= 50) return "Major slowdown — surviving the back half";
  return "Extreme fade — everything falls apart out there";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaceCalculator() {
  const [mode, setMode] = useState<Mode>("pace-to-time");
  const [unit, setUnit] = useState<Unit>("mi");
  const [distancePreset, setDistancePreset] = useState<string>("50K");
  const [customDistance, setCustomDistance] = useState("");

  // Pace → Time inputs
  const [paceMin, setPaceMin] = useState("12");
  const [paceSec, setPaceSec] = useState("00");

  // Time → Pace inputs
  const [goalHrs, setGoalHrs] = useState("7");
  const [goalMin, setGoalMin] = useState("00");
  const [goalSec, setGoalSec] = useState("00");

  // Shared
  const [slowdown, setSlowdown] = useState(20);
  const [stationCount, setStationCount] = useState("6");
  const [stationMinutes, setStationMinutes] = useState("3");

  // ─── Derived values ─────────────────────────────────────────────────────────

  /** Distance always stored internally as miles */
  const distanceMiles = useMemo(() => {
    if (distancePreset !== "custom") {
      return PRESETS.find((p) => p.key === distancePreset)?.miles ?? 31.07;
    }
    const raw = parseFloat(customDistance);
    if (!raw || raw <= 0) return 0;
    return unit === "km" ? raw / KM_PER_MILE : raw;
  }, [distancePreset, customDistance, unit]);

  /** Distance displayed in selected unit */
  const displayDistance = unit === "km" ? distanceMiles * KM_PER_MILE : distanceMiles;
  const unitLabel = unit === "mi" ? "mi" : "km";

  /** Aid station total seconds */
  const aidSeconds = useMemo(() => {
    const count = parseInt(stationCount) || 0;
    const mins = parseFloat(stationMinutes) || 0;
    return count * mins * 60;
  }, [stationCount, stationMinutes]);

  /** Base pace in seconds per mile (first-half pace) */
  const basePaceSecPerMile = useMemo(() => {
    if (mode === "pace-to-time") {
      const m = parseInt(paceMin) || 0;
      const s = parseInt(paceSec) || 0;
      return m * 60 + s;
    } else {
      // Time → Pace: solve algebraically
      const goalTotalSec =
        (parseInt(goalHrs) || 0) * 3600 +
        (parseInt(goalMin) || 0) * 60 +
        (parseInt(goalSec) || 0);
      const runningTime = goalTotalSec - aidSeconds;
      if (runningTime <= 0 || distanceMiles <= 0) return 0;
      const halfDist = distanceMiles / 2;
      const factor = 2 + slowdown / 100;
      return runningTime / (halfDist * factor);
    }
  }, [
    mode,
    paceMin,
    paceSec,
    goalHrs,
    goalMin,
    goalSec,
    aidSeconds,
    distanceMiles,
    slowdown,
  ]);

  /** Base pace in seconds per selected unit */
  const basePaceSecPerUnit =
    unit === "km" ? basePaceSecPerMile / KM_PER_MILE : basePaceSecPerMile;

  /** Second-half pace (seconds per mile) */
  const secondHalfPaceSecPerMile = basePaceSecPerMile * (1 + slowdown / 100);
  const secondHalfPaceSecPerUnit =
    unit === "km"
      ? secondHalfPaceSecPerMile / KM_PER_MILE
      : secondHalfPaceSecPerMile;

  /** Total moving time in seconds */
  const movingTimeSeconds = useMemo(() => {
    if (!distanceMiles || !basePaceSecPerMile) return 0;
    const half = distanceMiles / 2;
    return half * basePaceSecPerMile + half * secondHalfPaceSecPerMile;
  }, [distanceMiles, basePaceSecPerMile, secondHalfPaceSecPerMile]);

  /** Total finish time */
  const finishTimeSeconds = movingTimeSeconds + aidSeconds;

  /** Average pace over the full distance */
  const avgPaceSecPerUnit =
    distanceMiles > 0 ? finishTimeSeconds / displayDistance : 0;

  // ─── Splits ─────────────────────────────────────────────────────────────────

  const splits = useMemo(() => {
    if (!distanceMiles || !basePaceSecPerMile) return [];
    const interval = splitsInterval(distanceMiles);
    const halfMile = distanceMiles / 2;
    const rows: {
      label: string;
      mile: number;
      paceSecPerUnit: number;
      segmentSeconds: number;
      cumulativeSeconds: number;
      isSecondHalf: boolean;
    }[] = [];

    let cumulative = 0;
    let mile = interval;

    while (mile <= distanceMiles + 0.01) {
      const effectiveMile = Math.min(mile, distanceMiles);
      const prevMile = effectiveMile - interval;
      const segmentMiles = effectiveMile - prevMile;

      // Determine pace for this segment based on where we are relative to halfway
      let segmentSeconds = 0;
      if (prevMile >= halfMile) {
        // Entirely in second half
        segmentSeconds = segmentMiles * secondHalfPaceSecPerMile;
      } else if (effectiveMile <= halfMile) {
        // Entirely in first half
        segmentSeconds = segmentMiles * basePaceSecPerMile;
      } else {
        // Straddles the halfway point
        const firstPart = halfMile - prevMile;
        const secondPart = effectiveMile - halfMile;
        segmentSeconds =
          firstPart * basePaceSecPerMile +
          secondPart * secondHalfPaceSecPerMile;
      }

      cumulative += segmentSeconds;

      const segmentUnits = unit === "km" ? segmentMiles * KM_PER_MILE : segmentMiles;
      const paceSecPerUnit = segmentUnits > 0 ? segmentSeconds / segmentUnits : 0;
      const cumulativeWithAid = cumulative + (effectiveMile / distanceMiles) * aidSeconds;

      rows.push({
        label:
          unit === "km"
            ? `${(effectiveMile * KM_PER_MILE).toFixed(1)} km`
            : `Mi ${Math.round(effectiveMile)}`,
        mile: effectiveMile,
        paceSecPerUnit,
        segmentSeconds,
        cumulativeSeconds: cumulativeWithAid,
        isSecondHalf: effectiveMile > halfMile,
      });

      if (Math.abs(mile - distanceMiles) < 0.01) break;
      mile = Math.min(mile + interval, distanceMiles);
    }

    return rows;
  }, [distanceMiles, basePaceSecPerMile, secondHalfPaceSecPerMile, aidSeconds, unit]);

  // ─── Input helpers ───────────────────────────────────────────────────────────

  function clampSec(val: string, setter: (v: string) => void) {
    const n = parseInt(val);
    if (isNaN(n)) { setter(""); return; }
    setter(String(Math.max(0, Math.min(59, n)).toString().padStart(2, "0")));
  }

  const hasResult = distanceMiles > 0 && basePaceSecPerMile > 0;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Mode Toggle ── */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-8 self-start w-full sm:w-auto">
        {(["pace-to-time", "time-to-pace"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-primary text-white"
                : "bg-white text-dark hover:bg-light"
            }`}
          >
            {m === "pace-to-time" ? "Pace → Finish Time" : "Goal Time → Pace"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── LEFT: Inputs ── */}
        <div className="space-y-6">
          {/* Distance */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Race Distance
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setDistancePreset(p.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    distancePreset === p.key
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-dark border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => setDistancePreset("custom")}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  distancePreset === "custom"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-dark border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                Custom
              </button>
            </div>
            {distancePreset === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customDistance}
                  onChange={(e) => setCustomDistance(e.target.value)}
                  placeholder={`Distance in ${unitLabel}`}
                  min="1"
                  className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <span className="text-sm text-gray">{unitLabel}</span>
              </div>
            )}
          </div>

          {/* Units */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Units</label>
            <div className="flex gap-4">
              {(["mi", "km"] as Unit[]).map((u) => (
                <label key={u} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="unit"
                    checked={unit === u}
                    onChange={() => setUnit(u)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-dark">
                    {u === "mi" ? "Miles" : "Kilometers"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Main pace or time input */}
          {mode === "pace-to-time" ? (
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Starting Pace
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={paceMin}
                    onChange={(e) => setPaceMin(e.target.value)}
                    min="1"
                    max="59"
                    className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <span className="text-xs text-gray">min</span>
                </div>
                <span className="text-gray font-bold">:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={paceSec}
                    onChange={(e) => setPaceSec(e.target.value)}
                    onBlur={(e) => clampSec(e.target.value, setPaceSec)}
                    min="0"
                    max="59"
                    className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <span className="text-xs text-gray">sec</span>
                </div>
                <span className="text-sm text-gray ml-1">per {unitLabel}</span>
              </div>
              <p className="text-xs text-gray/60 mt-1">
                Your first-half target pace. The slowdown factor will adjust your second half.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Goal Finish Time
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={goalHrs}
                    onChange={(e) => setGoalHrs(e.target.value)}
                    min="0"
                    max="99"
                    className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <span className="text-xs text-gray">hrs</span>
                </div>
                <span className="text-gray font-bold">:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={goalMin}
                    onChange={(e) => setGoalMin(e.target.value)}
                    onBlur={(e) => clampSec(e.target.value, setGoalMin)}
                    min="0"
                    max="59"
                    className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <span className="text-xs text-gray">min</span>
                </div>
                <span className="text-gray font-bold">:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={goalSec}
                    onChange={(e) => setGoalSec(e.target.value)}
                    onBlur={(e) => clampSec(e.target.value, setGoalSec)}
                    min="0"
                    max="59"
                    className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <span className="text-xs text-gray">sec</span>
                </div>
              </div>
            </div>
          )}

          {/* Slowdown Factor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-dark">
                Second-Half Slowdown
              </label>
              <span
                className={`text-sm font-bold ${
                  slowdown === 0
                    ? "text-green-600"
                    : slowdown <= 20
                    ? "text-primary"
                    : slowdown <= 40
                    ? "text-accent"
                    : "text-red-500"
                }`}
              >
                {slowdown}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={slowdown}
              onChange={(e) => setSlowdown(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-xs text-gray mt-1">{slowdownLabel(slowdown)}</p>
          </div>

          {/* Aid Stations */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Aid Station Time
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={stationCount}
                  onChange={(e) => setStationCount(e.target.value)}
                  min="0"
                  max="30"
                  className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <span className="text-sm text-gray">stops</span>
              </div>
              <span className="text-gray text-sm">×</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={stationMinutes}
                  onChange={(e) => setStationMinutes(e.target.value)}
                  min="0"
                  max="30"
                  step="0.5"
                  className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <span className="text-sm text-gray">min each</span>
              </div>
              {aidSeconds > 0 && (
                <span className="text-sm font-medium text-primary">
                  = {formatTime(aidSeconds)} total
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="space-y-6">
          {hasResult ? (
            <>
              {/* Result cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Primary result */}
                <div className="col-span-2 bg-primary/5 border border-primary/20 rounded-xl p-5">
                  <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                    {mode === "pace-to-time" ? "Projected Finish Time" : "Required Start Pace"}
                  </p>
                  <p className="font-headline text-4xl font-bold text-dark">
                    {mode === "pace-to-time"
                      ? formatTime(finishTimeSeconds)
                      : formatPace(basePaceSecPerUnit)}
                  </p>
                  {mode === "time-to-pace" && (
                    <p className="text-xs text-gray mt-1">per {unitLabel} (first half)</p>
                  )}
                </div>

                {/* Avg pace */}
                <div className="bg-light rounded-xl p-4">
                  <p className="text-xs font-medium text-gray uppercase tracking-wider mb-1">
                    Avg Pace
                  </p>
                  <p className="font-headline text-2xl font-bold text-dark">
                    {formatPace(avgPaceSecPerUnit)}
                  </p>
                  <p className="text-xs text-gray">per {unitLabel}</p>
                </div>

                {/* Moving time */}
                <div className="bg-light rounded-xl p-4">
                  <p className="text-xs font-medium text-gray uppercase tracking-wider mb-1">
                    Running Time
                  </p>
                  <p className="font-headline text-2xl font-bold text-dark">
                    {formatTime(movingTimeSeconds)}
                  </p>
                </div>

                {/* Second half pace */}
                <div className="bg-light rounded-xl p-4">
                  <p className="text-xs font-medium text-gray uppercase tracking-wider mb-1">
                    2nd Half Pace
                  </p>
                  <p className="font-headline text-2xl font-bold text-dark">
                    {formatPace(secondHalfPaceSecPerUnit)}
                  </p>
                  <p className="text-xs text-gray">per {unitLabel}</p>
                </div>

                {/* Aid time */}
                <div className="bg-light rounded-xl p-4">
                  <p className="text-xs font-medium text-gray uppercase tracking-wider mb-1">
                    Aid Station Time
                  </p>
                  <p className="font-headline text-2xl font-bold text-dark">
                    {aidSeconds > 0 ? formatTime(aidSeconds) : "—"}
                  </p>
                </div>
              </div>

              {/* Pace breakdown bar */}
              {slowdown > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray uppercase tracking-wider mb-2">
                    Pace Breakdown
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-xs text-gray w-24">First half</span>
                      <div className="flex-1 bg-primary/10 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }} />
                      </div>
                      <span className="text-xs font-medium text-dark w-16 text-right">
                        {formatPace(basePaceSecPerUnit)}/{unitLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-xs text-gray w-24">Second half</span>
                      <div className="flex-1 bg-accent/10 rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (secondHalfPaceSecPerUnit / basePaceSecPerUnit) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-dark w-16 text-right">
                        {formatPace(secondHalfPaceSecPerUnit)}/{unitLabel}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-light rounded-xl p-8 text-center">
              <p className="text-gray text-sm">
                Enter your {mode === "pace-to-time" ? "pace" : "goal time"} to see results
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Splits Table ── */}
      {hasResult && splits.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-xl font-bold text-dark">
              Projected Splits
            </h2>
            <div className="flex items-center gap-4 text-xs text-gray">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                First half
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                Second half
              </span>
            </div>
          </div>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-light sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray text-xs uppercase tracking-wider">
                      {unit === "km" ? "Km" : "Mile"}
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray text-xs uppercase tracking-wider">
                      Pace/{unitLabel}
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray text-xs uppercase tracking-wider">
                      Cumulative
                    </th>
                    <th className="px-4 py-3 w-32 hidden sm:table-cell" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {splits.map((split, i) => {
                    const prevCumulative = i > 0 ? splits[i - 1].cumulativeSeconds : 0;
                    const isHalfway =
                      i > 0 && !splits[i - 1].isSecondHalf && split.isSecondHalf;
                    const maxCumulative = splits[splits.length - 1].cumulativeSeconds;
                    const progressPct = (split.cumulativeSeconds / maxCumulative) * 100;

                    return (
                      <>
                        {isHalfway && (
                          <tr key={`halfway-${i}`} className="bg-primary/5">
                            <td
                              colSpan={4}
                              className="px-4 py-2 text-xs font-semibold text-primary text-center"
                            >
                              ─ Halfway Point ─ Second half begins ─
                            </td>
                          </tr>
                        )}
                        <tr
                          key={split.label}
                          className={`hover:bg-light/60 transition-colors ${
                            split.isSecondHalf ? "bg-orange-50/30" : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-dark">
                            <span
                              className={`inline-flex items-center gap-1.5 ${
                                split.isSecondHalf ? "text-accent" : "text-primary"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  split.isSecondHalf ? "bg-accent" : "bg-primary"
                                }`}
                              />
                              {split.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-dark">
                            {formatPace(split.paceSecPerUnit)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-dark">
                            {formatTime(split.cumulativeSeconds)}
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  split.isSecondHalf ? "bg-accent" : "bg-primary"
                                }`}
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-gray/60 mt-2">
            Aid station time is distributed proportionally across the race.
          </p>
        </div>
      )}
    </div>
  );
}
