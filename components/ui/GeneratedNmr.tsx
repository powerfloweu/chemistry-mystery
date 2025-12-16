"use client";

import React from "react";

export default function GeneratedNmr({ className = "" }: { className?: string }) {
  // Real NMR spectrum with 5 peaks: integrals 3, 3, 2, 2, 2 (left to right by δ)
  return (
    <svg viewBox="0 0 1000 450" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgNmr" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>

      <rect x="0" y="0" width="1000" height="450" fill="url(#bgNmr)" />

      {/* Title */}
      <text x="500" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#065f46">
        ¹H NMR Spectrum
      </text>

      {/* Axes */}
      <line x1="80" y1="50" x2="80" y2="350" stroke="#334155" strokeWidth="2" />
      <line x1="80" y1="350" x2="950" y2="350" stroke="#334155" strokeWidth="2" />

      {/* δ scale labels (0 to 10 ppm) */}
      <text x="950" y="375" textAnchor="middle" fontSize="12" fill="#334155">
        0
      </text>
      <text x="170" y="375" textAnchor="middle" fontSize="12" fill="#334155">
        9
      </text>
      <text x="515" y="375" textAnchor="middle" fontSize="12" fill="#334155">
        5
      </text>

      {/* δ ppm label */}
      <text x="500" y="405" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#334155">
        δ (ppm)
      </text>

      {/* Intensity axis label */}
      <text x="30" y="200" textAnchor="middle" fontSize="12" fill="#334155" transform="rotate(-90 30 200)">
        Intensity
      </text>

      {/* Grid lines for ppm */}
      {Array.from({ length: 11 }, (_, i) => {
        const x = 950 - (i * 87);
        return (
          <g key={i}>
            <line x1={x} y1="350" x2={x} y2="340" stroke="#334155" strokeWidth="1" />
            {i % 2 === 0 && <line x1={x} y1="350" x2={x} y2="200" stroke="#e5e7eb" strokeWidth="0.5" />}
          </g>
        );
      })}

      {/* Baseline */}
      <line x1="80" y1="350" x2="950" y2="350" stroke="#065f46" strokeWidth="1.5" />

      {/* Peak 1: δ ~1.2 ppm, integral 3 (triplet-like) */}
      <g filter="url(#blur)">
        <path
          d="M 840 350 Q 835 280 840 230 Q 845 280 840 350"
          fill="none"
          stroke="#065f46"
          strokeWidth="2.5"
        />
        <path
          d="M 855 350 Q 850 270 855 210 Q 860 270 855 350"
          fill="none"
          stroke="#065f46"
          strokeWidth="2.5"
        />
        <path
          d="M 870 350 Q 865 280 870 230 Q 875 280 870 350"
          fill="none"
          stroke="#065f46"
          strokeWidth="2.5"
        />
        {/* Integration trace */}
        <path d="M 835 230 L 835 180 L 875 180 L 875 230" stroke="#0284c7" strokeWidth="2" fill="none" />
        <text x="855" y="170" textAnchor="middle" fontSize="11" fill="#0284c7" fontWeight="bold">
          3H
        </text>
      </g>

      {/* Peak 2: δ ~3.7 ppm, integral 3 (quartet-like) */}
      <g filter="url(#blur)">
        <path
          d="M 540 350 Q 530 260 540 190 Q 550 260 540 350"
          fill="none"
          stroke="#065f46"
          strokeWidth="3"
        />
        <path
          d="M 560 350 Q 550 245 560 180 Q 570 245 560 350"
          fill="none"
          stroke="#065f46"
          strokeWidth="3"
        />
        {/* Integration trace */}
        <path d="M 530 180 L 530 125 L 570 125 L 570 180" stroke="#0284c7" strokeWidth="2" fill="none" />
        <text x="550" y="115" textAnchor="middle" fontSize="11" fill="#0284c7" fontWeight="bold">
          3H
        </text>
      </g>

      {/* Peak 3: δ ~5.0 ppm, integral 2 (singlet-like) */}
      <g filter="url(#blur)">
        <path
          d="M 355 350 Q 345 240 355 160 Q 365 240 355 350"
          fill="none"
          stroke="#065f46"
          strokeWidth="2.8"
        />
        {/* Integration trace */}
        <path d="M 340 160 L 340 110 L 370 110 L 370 160" stroke="#0284c7" strokeWidth="2" fill="none" />
        <text x="355" y="100" textAnchor="middle" fontSize="11" fill="#0284c7" fontWeight="bold">
          2H
        </text>
      </g>

      {/* Peak 4: δ ~6.8 ppm, integral 2 (doublet-like) */}
      <g filter="url(#blur)">
        <path
          d="M 240 350 Q 232 290 240 220 Q 248 290 240 350"
          fill="none"
          stroke="#065f46"
          strokeWidth="2.6"
        />
        <path
          d="M 260 350 Q 252 295 260 225 Q 268 295 260 350"
          fill="none"
          stroke="#065f46"
          strokeWidth="2.6"
        />
        {/* Integration trace */}
        <path d="M 230 220 L 230 165 L 270 165 L 270 220" stroke="#0284c7" strokeWidth="2" fill="none" />
        <text x="250" y="155" textAnchor="middle" fontSize="11" fill="#0284c7" fontWeight="bold">
          2H
        </text>
      </g>

      {/* Peak 5: δ ~7.3 ppm, integral 2 (doublet-like) */}
      <g filter="url(#blur)">
        <path
          d="M 130 350 Q 122 295 130 225 Q 138 295 130 350"
          fill="none"
          stroke="#065f46"
          strokeWidth="2.6"
        />
        <path
          d="M 150 350 Q 142 290 150 220 Q 158 290 150 350"
          fill="none"
          stroke="#065f46"
          strokeWidth="2.6"
        />
        {/* Integration trace */}
        <path d="M 120 225 L 120 170 L 160 170 L 160 225" stroke="#0284c7" strokeWidth="2" fill="none" />
        <text x="140" y="160" textAnchor="middle" fontSize="11" fill="#0284c7" fontWeight="bold">
          2H
        </text>
      </g>

      {/* Legend */}
      <rect x="750" y="60" width="220" height="120" fill="white" stroke="#334155" strokeWidth="1" rx="4" />
      <text x="860" y="80" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#065f46">
        Integration (δ order)
      </text>
      <text x="765" y="105" fontSize="11" fill="#334155">
        δ 1.2 ppm → 3H
      </text>
      <text x="765" y="125" fontSize="11" fill="#334155">
        δ 3.7 ppm → 3H
      </text>
      <text x="765" y="145" fontSize="11" fill="#334155">
        δ 5.0 ppm → 2H
      </text>
      <text x="765" y="165" fontSize="11" fill="#334155">
        δ 6.8 ppm → 2H
      </text>
    </svg>
  );
}
