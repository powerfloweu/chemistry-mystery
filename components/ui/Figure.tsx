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
      <div className="overflow-hidden rounded-xl border border-slate-900/10 bg-transparent shadow-sm">
        <div className="bg-transparent p-4">
          {children}
        </div>
      </div>
      {caption ? (
        <figcaption className="text-xs uppercase tracking-[0.22em] text-amber-800/80 text-center">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
