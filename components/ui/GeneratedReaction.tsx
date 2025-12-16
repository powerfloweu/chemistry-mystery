"use client";

import React from "react";

export default function GeneratedReaction({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 300" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="curveGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="800" height="300" fill="#ffffff" />
      {/* axes */}
      <line x1="60" y1="260" x2="780" y2="260" stroke="#334155" strokeWidth="1" />
      <line x1="60" y1="20" x2="60" y2="260" stroke="#334155" strokeWidth="1" />
      <text x="400" y="290" textAnchor="middle" fontSize="12" fill="#334155">Reaction coordinate</text>
      <text x="30" y="140" textAnchor="middle" fontSize="12" fill="#334155" transform="rotate(-90 30 140)">ΔG</text>
      {/* two pathways: kinetic (higher barrier, lower product) vs thermo (lower product) */}
      <path d="M 60 240 C 180 40, 300 40, 420 240 C 500 280, 580 280, 660 240" stroke="url(#curveGrad)" strokeWidth="2" fill="none" />
      <path d="M 60 240 C 180 60, 300 60, 420 240 C 500 240, 580 230, 740 200" stroke="#0ea5e9" strokeWidth="2" fill="none" />
      {/* labels */}
      <text x="460" y="235" fontSize="12" fill="#065f46">Kinetic</text>
      <text x="700" y="200" fontSize="12" fill="#0ea5e9">Thermodynamic</text>
    </svg>
  );
}
