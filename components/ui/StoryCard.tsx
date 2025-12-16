"use client";

import React from "react";

export function StoryCard({
  title,
  objective,
  why,
  procedure,
  hint,
  children,
  className = "",
}: {
  title: string;
  objective: string;
  why: string;
  procedure: string[];
  hint?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-900/10 bg-white/80 shadow-sm ring-1 ring-amber-100/60 ${className}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-amber-900/10 bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/60 px-4 py-3">
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-[0.22em] text-amber-800/80">Protocol</div>
          <h3 className="text-lg font-semibold" style={{ color: "rgb(var(--ink))" }}>
            {title}
          </h3>
          <p className="text-sm text-slate-700/90">Objective: {objective}</p>
        </div>
        <div className="mt-1 h-8 w-1 rounded-full" style={{ background: "linear-gradient(180deg, rgba(var(--emerald),0.75), rgba(var(--gold),0.75))" }} />
      </div>

      <div className="space-y-5 px-5 py-4">
        <div className="rounded-xl bg-white/80 p-4 ring-1 ring-slate-900/5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-amber-800/80">Why it matters</div>
          <p className="mt-1 text-sm text-slate-800/90">{why}</p>
        </div>

        <div className="rounded-xl bg-white/80 p-4 ring-1 ring-slate-900/5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-amber-800/80">Procedure</div>
          <ol className="mt-2 space-y-2 text-sm text-slate-800/90">
            {procedure.map((step, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-[2px] h-[6px] w-[6px] rounded-full bg-emerald-700/80" />
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          {hint ? <p className="mt-3 text-xs text-slate-700/80">Hint: {hint}</p> : null}
        </div>

        {children ? (
          <div className="rounded-xl bg-white/85 p-4 ring-1 ring-amber-100/60 shadow-sm">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default StoryCard;
