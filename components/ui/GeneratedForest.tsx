"use client";

import React from "react";

export default function GeneratedForest({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 300" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#fff8e6" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="800" height="300" fill="url(#skyGrad)" />

      {/* forest path fork visualization */}
      <g strokeWidth="2" fill="none" stroke="#334155">
        {/* main trunk */}
        <path d="M 400 280 L 400 180" />
        {/* fork */}
        <path d="M 400 180 L 200 80" />
        <path d="M 400 180 L 600 80" />
        <path d="M 400 180 L 400 40" />
      </g>

      {/* labels */}
      <text x="180" y="70" fontSize="14" fontWeight="bold" fill="#065f46">LEFT</text>
      <text x="580" y="70" fontSize="14" fontWeight="bold" fill="#065f46">RIGHT</text>
      <text x="410" y="35" fontSize="14" fontWeight="bold" fill="#065f46">STRAIGHT</text>

      {/* forest elements */}
      {[150, 180, 220, 250].map((x) => (
        <g key={`left-${x}`}>
          <rect x={x - 4} y={100 + Math.random() * 50} width={8} height={40} fill="#15803d" />
          <circle cx={x} cy={95 + Math.random() * 60} r={3} fill="#22c55e" />
        </g>
      ))}
      {[550, 580, 620, 650].map((x) => (
        <g key={`right-${x}`}>
          <rect x={x - 4} y={100 + Math.random() * 50} width={8} height={40} fill="#15803d" />
          <circle cx={x} cy={95 + Math.random() * 60} r={3} fill="#22c55e" />
        </g>
      ))}

      {/* straight path markers */}
      {[390, 410].map((x) => (
        <circle key={`center-${x}`} cx={x} cy={80} r={4} fill="#0ea5e9" />
      ))}
    </svg>
  );
}
