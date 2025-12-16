"use client";

import React from "react";

export default function GeneratedCatalyst({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 300" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="molGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="800" height="300" fill="#ffffff" />

      {/* Title */}
      <text x="400" y="30" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#334155">Acid-Catalyzed Mechanism</text>

      {/* Reactant → Intermediate → Product */}
      {/* Reactant (left) */}
      <g>
        <circle cx="100" cy="120" r="40" fill="none" stroke="#065f46" strokeWidth="2" />
        <text x="100" y="125" fontSize="12" textAnchor="middle" fill="#065f46" fontWeight="bold">R</text>
        <text x="100" y="180" fontSize="11" textAnchor="middle" fill="#334155">Reactant</text>
      </g>

      {/* Arrow 1 */}
      <path d="M 145 120 L 245 120" stroke="#0ea5e9" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
      <text x="195" y="110" fontSize="11" fill="#0ea5e9">H+</text>

      {/* Intermediate (center) */}
      <g>
        <circle cx="300" cy="120" r="40" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="310" cy="130" r="8" fill="#ec4899" />
        <text x="300" y="125" fontSize="12" textAnchor="middle" fill="#f59e0b" fontWeight="bold">I</text>
        <text x="300" y="180" fontSize="11" textAnchor="middle" fill="#334155">Intermediate</text>
      </g>

      {/* Arrow 2 */}
      <path d="M 345 120 L 445 120" stroke="#0ea5e9" strokeWidth="2" fill="none" />
      <text x="395" y="110" fontSize="11" fill="#0ea5e9">-H+</text>

      {/* Product (right) */}
      <g>
        <circle cx="500" cy="120" r="40" fill="none" stroke="#16a34a" strokeWidth="2" />
        <text x="500" y="125" fontSize="12" textAnchor="middle" fill="#16a34a" fontWeight="bold">P</text>
        <text x="500" y="180" fontSize="11" textAnchor="middle" fill="#334155">Product</text>
      </g>

      {/* Cycle arrow (catalyst regen) */}
      <path d="M 420 170 A 120 80 0 0 1 580 170" stroke="#065f46" strokeWidth="2" fill="none" strokeDasharray="5,5" />
      <text x="500" y="260" fontSize="11" textAnchor="middle" fill="#065f46">Catalyst regenerated</text>

      {/* Charge label */}
      <text x="710" y="120" fontSize="16" fontWeight="bold" fill="#0ea5e9">+1</text>
      <text x="710" y="145" fontSize="10" fill="#0ea5e9">net charge</text>
    </svg>
  );
}
