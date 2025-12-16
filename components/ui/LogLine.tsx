"use client";

import React from "react";

export function LogLine({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`font-mono text-[13px] leading-relaxed text-slate-900 ${className}`}>
      <span className="mr-2 text-emerald-900/70">▸</span>
      {children}
    </div>
  );
}

export default LogLine;
