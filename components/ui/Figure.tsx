"use client";

import React from "react";

export default function Figure({
  children,
  caption,
  className = "",
}: {
  children: React.ReactNode;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`space-y-3 ${className}`}>
      <div className="overflow-hidden rounded-xl border border-slate-900/8 bg-white/80 shadow-sm ring-1 ring-amber-100/50">
        <div className="bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/50 p-4">
          {children}
        </div>
      </div>
      {caption ? (
        <figcaption className="text-xs uppercase tracking-[0.22em] text-amber-800/80">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
