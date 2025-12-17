"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type Slide = {
  src: string; // /images/.. path
  alt?: string;
  caption?: string;
};

export default function Slideshow({
  slides,
  intervalMs = 3500,
  className = "",
  loop = true,
  onComplete,
}: {
  slides: Slide[];
  intervalMs?: number;
  className?: string;
  loop?: boolean;
  onComplete?: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);
  const completeFired = useRef(false);

  const hasSlides = slides && slides.length > 0;
  const safeIdx = hasSlides ? Math.max(0, Math.min(idx, slides.length - 1)) : 0;

  useEffect(() => {
    if (!hasSlides) return;

    // Reset completion state when slides change
    completeFired.current = false;

    // If we are not looping and there's only one slide, fire completion immediately
    if (!loop && slides.length === 1) {
      if (!completeFired.current) {
        completeFired.current = true;
        onComplete?.();
      }
      return;
    }

    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setIdx((i) => {
        const next = i + 1;
        if (!loop && next >= slides.length) {
          if (timer.current) {
            window.clearInterval(timer.current);
            timer.current = null;
          }
          if (!completeFired.current) {
            completeFired.current = true;
            onComplete?.();
          }
          return i; // stay on last frame
        }
        return next % slides.length;
      });
    }, intervalMs);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
    };
  }, [slides, intervalMs, hasSlides, loop, onComplete]);

  const goto = (i: number) => {
    if (!hasSlides) return;
    setIdx(((i % slides.length) + slides.length) % slides.length);
    if (!loop && i >= slides.length - 1 && !completeFired.current) {
      completeFired.current = true;
      onComplete?.();
    }
  };

  const prev = () => goto(safeIdx - 1);
  const next = () => goto(safeIdx + 1);

  const current = hasSlides ? slides[safeIdx] : undefined;

  return (
    <div className={`rounded-2xl border border-slate-900/10 bg-white/70 ring-1 ring-amber-100/60 ${className}`}>
      <div className="relative">
        {/* image area */}
        <div
          className="relative w-full rounded-t-2xl bg-slate-100 overflow-hidden"
          style={{ aspectRatio: "3 / 4" }}
        >
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.src}
              alt={current.alt ?? ""}
              className="absolute inset-0 h-full w-full object-cover rounded-t-2xl"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-700">No slides yet</div>
          )}
        </div>

        {/* controls */}
        <div className="absolute inset-x-0 bottom-2 flex items-center justify-between px-3">
          <button aria-label="Previous" onClick={prev} className="rounded-full bg-black/40 px-3 py-1 text-white hover:bg-black/55">‹</button>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => goto(i)} className={`h-2 w-2 rounded-full ${i === safeIdx ? "bg-emerald-400" : "bg-white/80"}`} />
            ))}
          </div>
          <button aria-label="Next" onClick={next} className="rounded-full bg-black/40 px-3 py-1 text-white hover:bg-black/55">›</button>
        </div>
      </div>

      {current?.caption ? (
        <div className="border-t border-slate-900/10 p-3 text-sm text-slate-800">{current.caption}</div>
      ) : null}
    </div>
  );
}
