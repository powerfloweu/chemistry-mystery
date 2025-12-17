"use client";

/**
 * Simple SVG-based NMR spectrum visualization for Station 1.
 * Displays a typical ¹H NMR spectrum with common aromatic and aliphatic regions.
 */
export const NmrSpectrum = () => {
  return (
    <svg
      viewBox="0 0 1000 300"
      className="w-full border border-slate-300 rounded-lg bg-white"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Background */}
      <rect width="1000" height="300" fill="white" />

      {/* Grid lines */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`vgrid-${i}`}
          x1={i * 100}
          y1="0"
          x2={i * 100}
          y2="250"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={`hgrid-${i}`}
          x1="0"
          y1={i * 50}
          x2="1000"
          y2={i * 50}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {/* X-axis labels (ppm) */}
      {Array.from({ length: 11 }).map((_, i) => {
        const ppm = 10 - i;
        return (
          <text
            key={`xlabel-${i}`}
            x={i * 100}
            y="280"
            textAnchor="middle"
            fontSize="12"
            fill="#666"
          >
            {ppm}
          </text>
        );
      })}

      {/* X-axis label */}
      <text x="500" y="300" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">
        δ (ppm)
      </text>

      {/* X-axis */}
      <line x1="0" y1="250" x2="1000" y2="250" stroke="#000" strokeWidth="2" />

      {/* Y-axis */}
      <line x1="0" y1="0" x2="0" y2="250" stroke="#000" strokeWidth="2" />

      {/* Major peaks with labels */}

      {/* Aromatic region: Two doublets (A2B2 pattern around 7-7.5 ppm) */}
      {/* Peak 1: 7.7 ppm */}
      <path
        d="M 230 250 Q 235 200 240 180 Q 245 160 250 140 Q 255 160 260 180 Q 265 200 270 250"
        fill="none"
        stroke="#1e40af"
        strokeWidth="2.5"
      />
      <text x="250" y="120" textAnchor="middle" fontSize="11" fill="#1e40af" fontWeight="bold">
        7.7
      </text>

      {/* Peak 2: 7.1 ppm (mirror doublet) */}
      <path
        d="M 490 250 Q 495 205 500 170 Q 505 135 510 110 Q 515 135 520 170 Q 525 205 530 250"
        fill="none"
        stroke="#1e40af"
        strokeWidth="2.5"
      />
      <text x="510" y="85" textAnchor="middle" fontSize="11" fill="#1e40af" fontWeight="bold">
        7.1
      </text>

      {/* Methyl peak: 2.3 ppm (singlet, tall) */}
      <path
        d="M 770 250 Q 775 140 780 80 Q 785 140 790 250"
        fill="none"
        stroke="#dc2626"
        strokeWidth="2.5"
      />
      <text x="780" y="60" textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="bold">
        2.3
      </text>

      {/* Integration labels */}
      <text x="250" y="35" textAnchor="middle" fontSize="10" fill="#0369a1">
        4H
      </text>
      <text x="780" y="35" textAnchor="middle" fontSize="10" fill="#7c2d12">
        3H
      </text>

      {/* Spectrum title */}
      <text x="500" y="25" textAnchor="middle" fontSize="13" fill="#1f2937" fontWeight="bold">
        ¹H NMR (400 MHz, CDCl₃)
      </text>
    </svg>
  );
};
