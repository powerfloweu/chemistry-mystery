"use client";

import React from "react";

export function WaxSeal({ size = 80, open = true, label = "" }: { size?: number; open?: boolean; label?: string }) {
  const [phase, setPhase] = React.useState<"idle" | "crack" | "fade">("idle");

  React.useEffect(() => {
    if (!open) return;
    const t1 = setTimeout(() => setPhase("crack"), 300);
    const t2 = setTimeout(() => setPhase("fade"), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open]);

  return (
    <div
      aria-hidden
      className="pointer-events-none z-30 select-none"
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className="block">
        <defs>
          {/* Pressed lacquer gradient: dark emerald base with gold edge highlight */}
          <radialGradient id="waxLacquer" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#059669" stopOpacity="1" />
            <stop offset="100%" stopColor="#047857" stopOpacity="1" />
          </radialGradient>
          {/* Gold edge shine */}
          <radialGradient id="waxShine" cx="50%" cy="20%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Main seal body: dark emerald lacquer */}
        <circle cx="50" cy="50" r="38" fill="url(#waxLacquer)" stroke="#1f2937" strokeWidth="1" />
        
        {/* Gold edge highlight for depth */}
        <circle cx="50" cy="50" r="38" fill="url(#waxShine)" stroke="none" />
        
        {/* Embossed center circle for seal impression hint */}
        <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,215,0,0.2)" strokeWidth="0.8" />

        {label ? (
          <text 
            x="50" y="54" 
            textAnchor="middle" 
            fontSize="10" 
            fill="rgba(255,250,240,0.85)" 
            fontWeight="bold" 
            style={{ letterSpacing: "0.12em" }}
          >
            {label}
          </text>
        ) : null}

        {/* Crack animation */}
        <g style={{ opacity: phase === "crack" ? 1 : 0, transition: "opacity 180ms ease" }}>
          <path d="M40 30 L60 50 L42 68" stroke="#1f2937" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <path d="M52 30 L48 52 L64 62" stroke="#1f2937" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>

        {/* Drip animation */}
        <g style={{ transformOrigin: "50% 80%", transition: "transform 900ms ease, opacity 900ms ease", transform: phase === "fade" ? "translateY(10px) scale(0.8)" : "translateY(0)", opacity: phase === "fade" ? 0 : 1 }}>
          <ellipse cx="50" cy="86" rx="4" ry="6" fill="#059669" />
        </g>
      </svg>
    </div>
  );
}

export default WaxSeal;
