"use client";

import React from "react";

type WaxSealProps = {
  text?: string;           // e.g. "1993"
  size?: number;           // px
  className?: string;
  rotateDeg?: number;      // subtle rotation looks more natural
  tone?: "emerald" | "forest";
};

export function WaxSeal({
  text = "1993",
  size = 118,
  className = "",
  rotateDeg = -6,
  tone = "emerald",
}: WaxSealProps) {
  const id = React.useId(); // unique ids for gradients/filters

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotateDeg}deg)`,
        transformOrigin: "center",
      }}
      aria-label={`Wax seal ${text}`}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        role="img"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          {/* Outer soft drop shadow */}
          <filter id={`${id}-ds`} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="11"
              floodColor="rgba(0,0,0,.42)"
            />
          </filter>

          {/* Inner shadow for wax depth */}
          <filter id={`${id}-inner`} x="-30%" y="-30%" width="160%" height="160%">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="blur" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="innerShadow" />
            <feColorMatrix
              in="innerShadow"
              type="matrix"
              values="
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 .70 0"
              result="shadowAlpha"
            />
            <feComposite in="shadowAlpha" in2="SourceGraphic" operator="over" />
          </filter>

          {/* Main wax body gradient (photographic) */}
          <radialGradient id={`${id}-wax`} cx="42%" cy="36%" r="78%">
            <stop offset="0%" stopColor={tone === "forest" ? "#3B8D62" : "#3FAE79"} />
            <stop offset="34%" stopColor={tone === "forest" ? "#2E6F53" : "#2E8C64"} />
            <stop offset="70%" stopColor={tone === "forest" ? "#1F4F3F" : "#226B51"} />
            <stop offset="100%" stopColor={tone === "forest" ? "#12352C" : "#184E3F"} />
          </radialGradient>

          {/* Thick dark rim ring */}
          <radialGradient id={`${id}-rim`} cx="38%" cy="30%" r="95%">
            <stop offset="0%" stopColor={tone === "forest" ? "#2E7B5B" : "#2D8B67"} />
            <stop offset="45%" stopColor={tone === "forest" ? "#1C5B45" : "#1B5A44"} />
            <stop offset="100%" stopColor={tone === "forest" ? "#0E3A31" : "#0F3E33"} />
          </radialGradient>

          {/* Specular highlight (more lens-like) */}
          <radialGradient id={`${id}-shine`} cx="30%" cy="22%" r="62%">
            <stop offset="0%" stopColor="rgba(255,255,255,.60)" />
            <stop offset="16%" stopColor="rgba(255,255,255,.22)" />
            <stop offset="40%" stopColor="rgba(255,255,255,.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* Edge highlight ring */}
          <radialGradient id={`${id}-edge`} cx="50%" cy="50%" r="55%">
            <stop offset="70%" stopColor="rgba(255,255,255,0)" />
            <stop offset="88%" stopColor="rgba(255,255,255,.16)" />
            <stop offset="100%" stopColor="rgba(0,0,0,.18)" />
          </radialGradient>

          {/* Subtle wax marbling/noise using turbulence */}
          <filter id={`${id}-grain`} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="
                0 0 0 0 0.18
                0 0 0 0 0.55
                0 0 0 0 0.35
                0 0 0 0.08 0"
              result="tint"
            />
            <feComposite in="tint" in2="SourceGraphic" operator="overlay" />
          </filter>

          {/* Subtle surface displacement (wax ripples) */}
          <filter id={`${id}-displace`} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="11" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Specular lighting for glossy wax */}
          <filter id={`${id}-specular`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feSpecularLighting
              in="blur"
              surfaceScale="3"
              specularConstant="0.55"
              specularExponent="22"
              lightingColor="rgba(255,255,255,0.9)"
              result="spec"
            >
              <fePointLight x="60" y="40" z="60" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" operator="in" result="specIn" />
            <feBlend in="SourceGraphic" in2="specIn" mode="screen" />
          </filter>

          {/* Emboss filter for stamped text */}
          <filter id={`${id}-emboss`} x="-30%" y="-30%" width="160%" height="160%">
            <feOffset dx="0" dy="1" result="off1" />
            <feGaussianBlur in="off1" stdDeviation="0.8" result="blur1" />
            <feComposite in="blur1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="cut" />
            <feColorMatrix
              in="cut"
              type="matrix"
              values="
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 .75 0"
            />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* Outer wax edge (irregular) + drip tab */}
        <g filter={`url(#${id}-ds)`}>
          {/* irregular edge blob */}
          <path
            d="M100 8
               C121 10 140 18 154 31
               C171 47 186 70 189 92
               C192 114 187 137 174 154
               C159 174 130 190 100 192
               C71 190 41 176 27 156
               C12 136 7 110 10 88
               C13 64 27 44 44 30
               C58 18 78 10 100 8 Z"
            fill={`url(#${id}-rim)`}
          />

          {/* drip/tab */}
          <path
            d="M102 190
               C110 190 118 194 120 202
               C121 208 116 214 110 216
               C104 218 96 215 94 208
               C92 201 95 194 102 190 Z"
            fill={`url(#${id}-rim)`}
            opacity="0.98"
          />

          {/* subtle dark outline like pressed wax edge */}
          <path
            d="M100 10
               C120 12 139 20 153 33
               C170 49 184 71 187 92
               C190 114 185 136 172 152
               C157 171 129 187 100 189
               C72 187 43 174 29 154
               C15 135 11 110 13 88
               C16 66 29 46 45 33
               C59 20 79 12 100 10 Z"
            fill="none"
            stroke="rgba(0,0,0,.22)"
            strokeWidth="2.2"
          />
        </g>

        {/* Wax body */}
        <g filter={`url(#${id}-inner)`}>
          <g filter={`url(#${id}-displace)`}>
            <g filter={`url(#${id}-specular)`}>
              <circle cx="100" cy="100" r="78" fill={`url(#${id}-wax)`} />
            </g>
          </g>
          {/* bevel highlight */}
          <circle cx="100" cy="100" r="78" fill={`url(#${id}-edge)`} opacity="0.85" />
          {/* inner rim ring */}
          <circle cx="100" cy="100" r="77" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="2" />
        </g>

        {/* Texture overlay */}
        <g filter={`url(#${id}-grain)`} opacity="0.40">
          <circle cx="100" cy="100" r="82" fill="transparent" />
        </g>

        {/* Shine */}
        <g opacity="0.92">
          <ellipse cx="74" cy="60" rx="58" ry="42" fill={`url(#${id}-shine)`} />
          <ellipse cx="86" cy="76" rx="34" ry="22" fill="rgba(255,255,255,.06)" />
        </g>

        {/* Slight vignette to deepen edges */}
        <circle cx="100" cy="100" r="82" fill="rgba(0,0,0,.08)" opacity="0.25" />

        {/* Stamp ring impression */}
        <g opacity="0.95">
          <circle cx="100" cy="104" r="56" fill="none" stroke="rgba(0,0,0,.20)" strokeWidth="2" />
          <circle cx="100" cy="104" r="54" fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="1.6" />
        </g>

        {/* Stamped text (embossed, not flat) */}
        <g filter={`url(#${id}-emboss)`}>
          <text
            x="100"
            y="117.2"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
            fontWeight="900"
            fontSize="40"
            letterSpacing="10"
            fill="rgba(0,0,0,.28)"
          >
            {text}
          </text>
          <text
            x="100"
            y="116"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
            fontWeight="900"
            fontSize="40"
            letterSpacing="10"
            fill="rgba(0,0,0,.78)"
          >
            {text}
          </text>

          {/* highlight edge on the text for “pressed” feel */}
          <text
            x="100"
            y="114.6"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
            fontWeight="900"
            fontSize="40"
            letterSpacing="10"
            fill="rgba(255,255,255,.08)"
          >
            {text}
          </text>
        </g>
      </svg>
    </div>
  );
}

export default WaxSeal;