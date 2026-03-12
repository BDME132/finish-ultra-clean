"use client";

import { useState, useMemo, useEffect, useCallback, Fragment } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "pace-to-time" | "time-to-pace";
type Unit = "mi" | "km";

interface Preset {
  label: string;
  key: string;
  miles: number;
}

type SplitRow =
  | {
      type: "run";
      label: string;
      mile: number;
      paceSecPerUnit: number;
      segmentSeconds: number;
      cumulativeSeconds: number;
      isSecondHalf: boolean;
    }
  | {
      type: "aid";
      label: string;
      mile: number;
      stationSeconds: number;
      cumulativeSeconds: number;
    };

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

/** Format a duration in seconds to M:SS for aid station display */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
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
  const [slowdownEnabled, setSlowdownEnabled] = useState(false);
  const [slowdown, setSlowdown] = useState(20);
  const [stationCount, setStationCount] = useState("6");
  const [stationMinutes, setStationMinutes] = useState("3");

  const [splitsFullscreen, setSplitsFullscreen] = useState(false);

  const closeSplitsFullscreen = useCallback(() => setSplitsFullscreen(false), []);

  useEffect(() => {
    if (!splitsFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSplitsFullscreen();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [splitsFullscreen, closeSplitsFullscreen]);

  const effectiveSlowdown = slowdownEnabled ? slowdown : 0;

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

  /** Per-station time in seconds */
  const perStationSeconds = useMemo(() => {
    return (parseFloat(stationMinutes) || 0) * 60;
  }, [stationMinutes]);

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
      const factor = 2 + effectiveSlowdown / 100;
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
    effectiveSlowdown,
  ]);

  /** Base pace in seconds per selected unit */
  const basePaceSecPerUnit =
    unit === "km" ? basePaceSecPerMile / KM_PER_MILE : basePaceSecPerMile;

  /** Second-half pace (seconds per mile) */
  const secondHalfPaceSecPerMile = basePaceSecPerMile * (1 + effectiveSlowdown / 100);
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

  // ─── Aid station positions (evenly spaced) ────────────────────────────────

  const stationPositions = useMemo(() => {
    const count = parseInt(stationCount) || 0;
    if (count <= 0 || distanceMiles <= 0) return [];
    const spacing = distanceMiles / (count + 1);
    const positions: number[] = [];
    for (let i = 1; i <= count; i++) {
      positions.push(spacing * i);
    }
    return positions;
  }, [stationCount, distanceMiles]);

  // ─── Splits ─────────────────────────────────────────────────────────────────

  const splits = useMemo(() => {
    if (!distanceMiles || !basePaceSecPerMile) return [];
    const interval = splitsInterval(distanceMiles);
    const halfMile = distanceMiles / 2;
    const rows: SplitRow[] = [];

    let cumulative = 0;
    let mile = interval;
    let nextStationIdx = 0;

    while (mile <= distanceMiles + 0.01) {
      const effectiveMile = Math.min(mile, distanceMiles);
      const prevMile = effectiveMile - interval;
      const segmentMiles = effectiveMile - prevMile;

      // Determine pace for this segment based on where we are relative to halfway
      let segmentSeconds = 0;
      if (prevMile >= halfMile) {
        segmentSeconds = segmentMiles * secondHalfPaceSecPerMile;
      } else if (effectiveMile <= halfMile) {
        segmentSeconds = segmentMiles * basePaceSecPerMile;
      } else {
        const firstPart = halfMile - prevMile;
        const secondPart = effectiveMile - halfMile;
        segmentSeconds =
          firstPart * basePaceSecPerMile +
          secondPart * secondHalfPaceSecPerMile;
      }

      cumulative += segmentSeconds;

      const segmentUnits = unit === "km" ? segmentMiles * KM_PER_MILE : segmentMiles;
      const paceSecPerUnit = segmentUnits > 0 ? segmentSeconds / segmentUnits : 0;

      rows.push({
        type: "run",
        label:
          unit === "km"
            ? `${(effectiveMile * KM_PER_MILE).toFixed(1)} km`
            : `Mi ${Math.round(effectiveMile)}`,
        mile: effectiveMile,
        paceSecPerUnit,
        segmentSeconds,
        cumulativeSeconds: cumulative,
        isSecondHalf: effectiveMile > halfMile,
      });

      // Insert any aid stations that fall at or before this mile marker
      while (
        nextStationIdx < stationPositions.length &&
        stationPositions[nextStationIdx] <= effectiveMile + 0.01
      ) {
        cumulative += perStationSeconds;
        rows.push({
          type: "aid",
          label: `Aid ${nextStationIdx + 1}`,
          mile: stationPositions[nextStationIdx],
          stationSeconds: perStationSeconds,
          cumulativeSeconds: cumulative,
        });
        nextStationIdx++;
      }

      if (Math.abs(mile - distanceMiles) < 0.01) break;
      mile = Math.min(mile + interval, distanceMiles);
    }

    return rows;
  }, [distanceMiles, basePaceSecPerMile, secondHalfPaceSecPerMile, unit, stationPositions, perStationSeconds]);

  // ─── Input helpers ───────────────────────────────────────────────────────────

  function clampSec(val: string, setter: (v: string) => void) {
    const n = parseInt(val);
    if (isNaN(n)) { setter(""); return; }
    setter(Math.max(0, Math.min(59, n)).toString().padStart(2, "0"));
  }

  const hasResult = distanceMiles > 0 && basePaceSecPerMile > 0;

  // ─── Splits table renderer ─────────────────────────────────────────────────

  function renderSplitsTable(fullscreen: boolean) {
    return (
      <table className={`w-full ${fullscreen ? "text-base" : "text-sm"}`}>
        <thead className={`${fullscreen ? "bg-white" : "bg-light"} sticky top-0`}>
          <tr>
            <th className={`text-left font-medium text-gray text-xs uppercase tracking-wider ${fullscreen ? "px-4 sm:px-6 py-4" : "px-4 py-3"}`}>
              {unit === "km" ? "Km" : "Mile"}
            </th>
            <th className={`text-right font-medium text-gray text-xs uppercase tracking-wider ${fullscreen ? "px-4 sm:px-6 py-4" : "px-4 py-3"}`}>
              Pace/{unitLabel}
            </th>
            <th className={`text-right font-medium text-gray text-xs uppercase tracking-wider ${fullscreen ? "px-4 sm:px-6 py-4" : "px-4 py-3"}`}>
              Cumulative
            </th>
            <th className={`w-32 hidden sm:table-cell ${fullscreen ? "px-4 sm:px-6 py-4" : "px-4 py-3"}`} />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {(() => {
            let halfwayShown = false;
            return splits.map((split, i) => {
              const isHalfway =
                !halfwayShown &&
                split.type === "run" &&
                split.isSecondHalf;
              if (isHalfway) halfwayShown = true;

              const lastSplit = splits[splits.length - 1];
              const maxCumulative = lastSplit.cumulativeSeconds;
              const progressPct =
                maxCumulative > 0
                  ? (split.cumulativeSeconds / maxCumulative) * 100
                  : 0;

              const cellPx = fullscreen ? "px-4 sm:px-6 py-3.5" : "px-4 py-3";
              const cellPxSmall = fullscreen ? "px-4 sm:px-6 py-3" : "px-4 py-2.5";

              if (split.type === "aid") {
                return (
                  <tr key={`aid-${i}`} className="bg-emerald-50/60">
                    <td className={`${cellPxSmall} font-medium`}>
                      <span className="inline-flex items-center gap-1.5 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        {split.label}
                      </span>
                    </td>
                    <td className={`${cellPxSmall} text-right font-mono text-emerald-700 text-xs`}>
                      {formatDuration(split.stationSeconds)} stop
                    </td>
                    <td className={`${cellPxSmall} text-right font-mono text-emerald-700`}>
                      {formatTime(split.cumulativeSeconds)}
                    </td>
                    <td className={`${cellPxSmall} hidden sm:table-cell`}>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-400"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <Fragment key={`run-${i}`}>
                  {isHalfway && slowdownEnabled && effectiveSlowdown > 0 && (
                    <tr className="bg-primary/5">
                      <td
                        colSpan={4}
                        className={`${cellPxSmall} text-xs font-semibold text-primary text-center`}
                      >
                        ─ Halfway Point ─ Second half begins ─
                      </td>
                    </tr>
                  )}
                  <tr
                    className={`hover:bg-light/60 transition-colors ${
                      split.isSecondHalf && slowdownEnabled ? "bg-orange-50/30" : ""
                    }`}
                  >
                    <td className={`${cellPx} font-medium text-dark`}>
                      <span
                        className={`inline-flex items-center gap-1.5 ${
                          split.isSecondHalf && slowdownEnabled
                            ? "text-accent"
                            : "text-primary"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            split.isSecondHalf && slowdownEnabled
                              ? "bg-accent"
                              : "bg-primary"
                          }`}
                        />
                        {split.label}
                      </span>
                    </td>
                    <td className={`${cellPx} text-right font-mono text-dark`}>
                      {formatPace(split.paceSecPerUnit)}
                    </td>
                    <td className={`${cellPx} text-right font-mono text-dark`}>
                      {formatTime(split.cumulativeSeconds)}
                    </td>
                    <td className={`${cellPx} hidden sm:table-cell`}>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            split.isSecondHalf && slowdownEnabled
                              ? "bg-accent"
                              : "bg-primary"
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                </Fragment>
              );
            });
          })()}
        </tbody>
      </table>
    );
  }

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
                {slowdownEnabled
                  ? "Your first-half target pace. The slowdown factor will adjust your second half."
                  : "Your target pace for the entire race."}
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-dark">
                Second-Half Slowdown
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={slowdownEnabled}
                onClick={() => setSlowdownEnabled(!slowdownEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  slowdownEnabled ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    slowdownEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {slowdownEnabled ? (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray">Slowdown amount</span>
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
              </>
            ) : (
              <p className="text-xs text-gray">
                Even splits — same pace throughout. Enable to model second-half fatigue.
              </p>
            )}
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
              <span className="text-gray text-sm">&times;</span>
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
                    <p className="text-xs text-gray mt-1">
                      per {unitLabel}{slowdownEnabled ? " (first half)" : ""}
                    </p>
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

                {/* Second half pace — only when slowdown is on */}
                {slowdownEnabled && effectiveSlowdown > 0 && (
                  <div className="bg-light rounded-xl p-4">
                    <p className="text-xs font-medium text-gray uppercase tracking-wider mb-1">
                      2nd Half Pace
                    </p>
                    <p className="font-headline text-2xl font-bold text-dark">
                      {formatPace(secondHalfPaceSecPerUnit)}
                    </p>
                    <p className="text-xs text-gray">per {unitLabel}</p>
                  </div>
                )}

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

              {/* Pace breakdown bar — only when slowdown is on */}
              {slowdownEnabled && effectiveSlowdown > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray uppercase tracking-wider mb-2">
                    Pace Breakdown
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-xs text-gray w-24">First half</span>
                      <div className="flex-1 bg-primary/10 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(basePaceSecPerUnit / secondHalfPaceSecPerUnit) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-dark w-16 text-right">
                        {formatPace(basePaceSecPerUnit)}/{unitLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-xs text-gray w-24">Second half</span>
                      <div className="flex-1 bg-accent/10 rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: "100%" }} />
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-xs text-gray">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                  First half
                </span>
                {slowdownEnabled && effectiveSlowdown > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                    Second half
                  </span>
                )}
                {stationPositions.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    Aid station
                  </span>
                )}
              </div>
              <button
                onClick={() => setSplitsFullscreen(true)}
                className="p-1.5 rounded-lg text-gray hover:text-primary hover:bg-primary/5 transition-colors"
                title="View fullscreen"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5m-7 14l-5 5m0 0h4m-4 0v-4m18 4l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              {renderSplitsTable(false)}
            </div>
          </div>
          {stationPositions.length > 0 && (
            <p className="text-xs text-gray/60 mt-2">
              Aid stations are evenly spaced across the course.
            </p>
          )}
        </div>
      )}

      {/* ── Fullscreen Splits Overlay ── */}
      {splitsFullscreen && hasResult && splits.length > 0 && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-light flex-shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="font-headline text-xl font-bold text-dark">
                Projected Splits
              </h2>
              <div className="hidden sm:flex items-center gap-4 text-xs text-gray">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                  First half
                </span>
                {slowdownEnabled && effectiveSlowdown > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                    Second half
                  </span>
                )}
                {stationPositions.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    Aid station
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={closeSplitsFullscreen}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray hover:text-dark bg-white border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
          {/* Scrollable table */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
              {renderSplitsTable(true)}
              {stationPositions.length > 0 && (
                <p className="text-xs text-gray/60 mt-3">
                  Aid stations are evenly spaced across the course.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
