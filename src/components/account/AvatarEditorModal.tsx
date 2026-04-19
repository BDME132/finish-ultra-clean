"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, ZoomIn } from "lucide-react";

const PREVIEW_SIZE = 280;
const EXPORT_SIZE = 400;

interface Props {
  imageSrc: string;
  onApply: (blob: Blob) => void;
  onCancel: () => void;
}

export default function AvatarEditorModal({ imageSrc, onApply, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fillScale, setFillScale] = useState(1);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, ox: 0, oy: 0 });

  // Load image and compute fill scale
  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      const fill = Math.max(
        PREVIEW_SIZE / image.naturalWidth,
        PREVIEW_SIZE / image.naturalHeight,
      );
      setFillScale(fill);
      setZoomFactor(1);
      setOffset({ x: 0, y: 0 });
      setImg(image);
    };
    image.src = imageSrc;
  }, [imageSrc]);

  const actualScale = fillScale * zoomFactor;

  const drawToCanvas = useCallback(
    (canvas: HTMLCanvasElement, size: number, ox: number, oy: number, scale: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx || !img) return;

      ctx.clearRect(0, 0, size, size);

      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const drawX = size / 2 - drawW / 2 + ox;
      const drawY = size / 2 - drawH / 2 + oy;

      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Dim area outside circle
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, size, size);
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = "rgba(0,0,0,0.48)";
      ctx.fill("evenodd");
      ctx.restore();

      // Circle ring
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
      ctx.stroke();
    },
    [img],
  );

  // Re-render preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    drawToCanvas(canvas, PREVIEW_SIZE, offset.x, offset.y, actualScale);
  }, [img, offset, actualScale, drawToCanvas]);

  // Non-passive wheel listener (required for preventDefault to work)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.06 : 0.06;
      setZoomFactor((z) => Math.max(1, Math.min(z + delta * z, 6)));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, []);

  // Pointer drag
  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset({ x: dragRef.current.ox + dx, y: dragRef.current.oy + dy });
  }

  function onPointerUp() {
    setDragging(false);
  }

  function handleApply() {
    if (!img) return;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = EXPORT_SIZE;
    exportCanvas.height = EXPORT_SIZE;

    // Scale offsets from preview → export
    const scaleFactor = EXPORT_SIZE / PREVIEW_SIZE;
    const exportScale = actualScale * scaleFactor;
    const exportOx = offset.x * scaleFactor;
    const exportOy = offset.y * scaleFactor;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Clip to circle first
    ctx.beginPath();
    ctx.arc(EXPORT_SIZE / 2, EXPORT_SIZE / 2, EXPORT_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();

    const drawW = img.naturalWidth * exportScale;
    const drawH = img.naturalHeight * exportScale;
    const drawX = EXPORT_SIZE / 2 - drawW / 2 + exportOx;
    const drawY = EXPORT_SIZE / 2 - drawH / 2 + exportOy;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    exportCanvas.toBlob(
      (blob) => {
        if (blob) onApply(blob);
      },
      "image/jpeg",
      0.92,
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-lg font-bold text-dark">Position photo</h3>
          <button
            onClick={onCancel}
            className="p-2 text-gray hover:text-dark rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          {!img ? (
            <div
              className="rounded-full bg-gray-100 animate-pulse"
              style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
            />
          ) : (
            <canvas
              ref={canvasRef}
              width={PREVIEW_SIZE}
              height={PREVIEW_SIZE}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              className="rounded-full touch-none select-none"
              style={{
                width: PREVIEW_SIZE,
                height: PREVIEW_SIZE,
                cursor: dragging ? "grabbing" : "grab",
              }}
            />
          )}

          <div className="w-full space-y-2">
            <div className="flex items-center gap-3">
              <ZoomIn className="w-4 h-4 text-gray flex-shrink-0" />
              <input
                type="range"
                min={100}
                max={600}
                step={1}
                value={Math.round(zoomFactor * 100)}
                onChange={(e) =>
                  setZoomFactor(Math.max(1, parseInt(e.target.value) / 100))
                }
                className="flex-1 accent-primary"
              />
            </div>
            <p className="text-xs text-gray text-center">
              Drag to reposition · scroll or slide to zoom
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium text-dark rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!img}
            className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Use photo
          </button>
        </div>
      </div>
    </div>
  );
}
