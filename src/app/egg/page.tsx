"use client";

const PIXELS: { x: number; y: number; fill: string }[] = [
  // Headband - blue
  { x: 5, y: 1, fill: "#0066FF" }, { x: 6, y: 1, fill: "#0066FF" },
  { x: 7, y: 1, fill: "#0066FF" }, { x: 8, y: 1, fill: "#0066FF" },
  { x: 9, y: 1, fill: "#0066FF" }, { x: 10, y: 1, fill: "#0066FF" },
  // Head
  { x: 6, y: 2, fill: "#E2E8F0" }, { x: 7, y: 2, fill: "#E2E8F0" },
  { x: 8, y: 2, fill: "#E2E8F0" }, { x: 9, y: 2, fill: "#E2E8F0" },
  { x: 6, y: 3, fill: "#E2E8F0" }, { x: 7, y: 3, fill: "#0F172A" },
  { x: 8, y: 3, fill: "#E2E8F0" }, { x: 9, y: 3, fill: "#0F172A" },
  { x: 6, y: 4, fill: "#E2E8F0" }, { x: 7, y: 4, fill: "#E2E8F0" },
  { x: 8, y: 4, fill: "#E2E8F0" }, { x: 9, y: 4, fill: "#E2E8F0" },
  // Body
  { x: 5, y: 5, fill: "#0F172A" }, { x: 6, y: 5, fill: "#0F172A" },
  { x: 7, y: 5, fill: "#0F172A" }, { x: 8, y: 5, fill: "#0F172A" },
  { x: 9, y: 5, fill: "#0F172A" }, { x: 10, y: 5, fill: "#0F172A" },
  // Arms
  { x: 4, y: 6, fill: "#E2E8F0" }, { x: 6, y: 6, fill: "#0F172A" },
  { x: 7, y: 6, fill: "#0F172A" }, { x: 8, y: 6, fill: "#0F172A" },
  { x: 9, y: 6, fill: "#0F172A" }, { x: 11, y: 6, fill: "#E2E8F0" },
  { x: 3, y: 7, fill: "#E2E8F0" }, { x: 7, y: 7, fill: "#0F172A" },
  { x: 8, y: 7, fill: "#0F172A" }, { x: 12, y: 7, fill: "#E2E8F0" },
  // Legs
  { x: 6, y: 8, fill: "#0F172A" }, { x: 7, y: 8, fill: "#0F172A" },
  { x: 8, y: 8, fill: "#0F172A" }, { x: 9, y: 8, fill: "#0F172A" },
  { x: 5, y: 9, fill: "#0F172A" }, { x: 6, y: 9, fill: "#0F172A" },
  { x: 9, y: 9, fill: "#0F172A" }, { x: 10, y: 9, fill: "#0F172A" },
  { x: 4, y: 10, fill: "#0F172A" }, { x: 5, y: 10, fill: "#0F172A" },
  { x: 10, y: 10, fill: "#0F172A" }, { x: 11, y: 10, fill: "#0F172A" },
  // Shoes - orange
  { x: 3, y: 11, fill: "#FF6B00" }, { x: 4, y: 11, fill: "#FF6B00" },
  { x: 11, y: 11, fill: "#FF6B00" }, { x: 12, y: 11, fill: "#FF6B00" },
  { x: 2, y: 12, fill: "#FF6B00" }, { x: 3, y: 12, fill: "#FF6B00" },
  { x: 12, y: 12, fill: "#FF6B00" }, { x: 13, y: 12, fill: "#FF6B00" },
];

function downloadPNG() {
  const scale = 32; // 16 grid × 32 = 512px output
  const canvas = document.createElement("canvas");
  canvas.width = 16 * scale;
  canvas.height = 16 * scale;
  const ctx = canvas.getContext("2d")!;

  // Transparent background — no fill

  for (const { x, y, fill } of PIXELS) {
    ctx.fillStyle = fill;
    ctx.fillRect(x * scale, y * scale, scale, scale);
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finishultra-coach.png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

export default function EggPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0B1120] gap-6">
      <svg
        viewBox="0 0 16 16"
        style={{ imageRendering: "pixelated", width: "min(80vw, 80vh)", height: "min(80vw, 80vh)" }}
        shapeRendering="crispEdges"
      >
        {PIXELS.map(({ x, y, fill }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill} />
        ))}
      </svg>

      <button
        onClick={downloadPNG}
        className="flex items-center gap-2 px-4 py-2 bg-[#141C2E] border border-[#2A3A55] text-[#94A3B8] text-xs rounded-lg hover:border-primary hover:text-[#E2E8F0] transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PNG
      </button>
    </div>
  );
}
