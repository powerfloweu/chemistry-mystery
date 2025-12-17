"use client";

import React from "react";

export function ReactionCoordinate() {
  const width = 600;
  const height = 400;
  const padding = 60;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  // Ink color from dossier palette
  const inkColor = "rgb(var(--ink))";
  const goldColor = "rgba(var(--dossier-gold), 0.6)";
  const lightGold = "rgba(var(--dossier-gold), 0.3)";

  // Paths for kinetic and thermodynamic reactions
  // Reactants start at (10%, 70%) energy
  // Kinetic: TS at (40%, 90%), Product at (85%, 65%)
  // Thermodynamic: TS at (50%, 95%), Product at (85%, 40%)

  const reactantX = padding + plotWidth * 0.1;
  const reactantY = padding + plotHeight * 0.7;

  const kineticTSX = padding + plotWidth * 0.4;
  const kineticTSY = padding + plotHeight * 0.1; // Higher on plot = higher energy

  const thermoTSX = padding + plotWidth * 0.5;
  const thermoTSY = padding + plotHeight * 0.05;

  const kineticProductX = padding + plotWidth * 0.85;
  const kineticProductY = padding + plotHeight * 0.65;

  const thermoProductX = padding + plotWidth * 0.85;
  const thermoProductY = padding + plotHeight * 0.4;

  return (
    <svg
      width={width}
      height={height}
      className="border border-slate-900/10 rounded-lg bg-white/10"
      viewBox={`0 0 ${width} ${height}`}
      style={{
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      }}
    >
      {/* Background */}
      <defs>
        <pattern
          id="gridPattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M 40 0 L 0 0 0 40`}
            fill="none"
            stroke="rgba(var(--ink), 0.05)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      {/* Grid */}
      <rect
        x={padding}
        y={padding}
        width={plotWidth}
        height={plotHeight}
        fill="url(#gridPattern)"
      />

      {/* Axes */}
      <line
        x1={padding}
        y1={padding + plotHeight}
        x2={width - padding}
        y2={padding + plotHeight}
        stroke={inkColor}
        strokeWidth="1.5"
      />
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={padding + plotHeight}
        stroke={inkColor}
        strokeWidth="1.5"
      />

      {/* Axis labels */}
      <text
        x={width / 2}
        y={height - 20}
        textAnchor="middle"
        fontSize="14"
        fill={inkColor}
        opacity="0.7"
      >
        Reaction Coordinate
      </text>
      <text
        x={25}
        y={height / 2}
        textAnchor="middle"
        fontSize="14"
        fill={inkColor}
        opacity="0.7"
        transform={`rotate(-90 25 ${height / 2})`}
      >
        Free Energy (G)
      </text>

      {/* Kinetic Pathway (dashed) */}
      <path
        d={`M ${reactantX} ${reactantY} Q ${kineticTSX} ${kineticTSY} ${kineticProductX} ${kineticProductY}`}
        fill="none"
        stroke={goldColor}
        strokeWidth="2"
        strokeDasharray="4,4"
        opacity="0.8"
      />

      {/* Thermodynamic Pathway (solid) */}
      <path
        d={`M ${reactantX} ${reactantY} Q ${thermoTSX} ${thermoTSY} ${thermoProductX} ${thermoProductY}`}
        fill="none"
        stroke={inkColor}
        strokeWidth="2"
        opacity="0.6"
      />

      {/* Points - Reactants */}
      <circle
        cx={reactantX}
        cy={reactantY}
        r="4"
        fill={inkColor}
        opacity="0.7"
      />
      <text
        x={reactantX}
        y={reactantY - 15}
        textAnchor="middle"
        fontSize="14"
        fill={inkColor}
        fontWeight="bold"
      >
        Reactants
      </text>

      {/* Points - Kinetic TS */}
      <circle
        cx={kineticTSX}
        cy={kineticTSY}
        r="4"
        fill={goldColor}
        opacity="0.8"
      />
      <text
        x={kineticTSX}
        y={kineticTSY - 22}
        textAnchor="middle"
        fontSize="14"
        fill={goldColor}
        fontWeight="bold"
      >
        TS_K
      </text>
      <text
        x={kineticTSX}
        y={kineticTSY + 14}
        textAnchor="middle"
        fontSize="12"
        fill={goldColor}
        fontFamily="monospace"
        opacity="0.8"
      >
        ΔG‡ = 68 kJ/mol
      </text>

      {/* Points - Thermodynamic TS */}
      <circle
        cx={thermoTSX}
        cy={thermoTSY}
        r="4"
        fill={inkColor}
        opacity="0.7"
      />
      <text
        x={thermoTSX}
        y={thermoTSY - 22}
        textAnchor="middle"
        fontSize="14"
        fill={inkColor}
        fontWeight="bold"
      >
        TS_T
      </text>
      <text
        x={thermoTSX}
        y={thermoTSY + 14}
        textAnchor="middle"
        fontSize="12"
        fill={inkColor}
        fontFamily="monospace"
        opacity="0.7"
      >
        ΔG‡ = 76 kJ/mol
      </text>

      {/* Points - Kinetic Product */}
      <circle
        cx={kineticProductX}
        cy={kineticProductY}
        r="4"
        fill={goldColor}
        opacity="0.8"
      />
      <text
        x={kineticProductX}
        y={kineticProductY - 15}
        textAnchor="middle"
        fontSize="14"
        fill={goldColor}
        fontWeight="bold"
      >
        Product_K
      </text>
      <text
        x={kineticProductX}
        y={kineticProductY + 15}
        textAnchor="middle"
        fontSize="12"
        fill={goldColor}
        fontFamily="monospace"
        opacity="0.8"
      >
        ΔG° = -2 kJ/mol
      </text>

      {/* Points - Thermodynamic Product */}
      <circle
        cx={thermoProductX}
        cy={thermoProductY}
        r="4"
        fill={inkColor}
        opacity="0.7"
      />
      <text
        x={thermoProductX}
        y={thermoProductY - 15}
        textAnchor="middle"
        fontSize="14"
        fill={inkColor}
        fontWeight="bold"
      >
        Product_T
      </text>
      <text
        x={thermoProductX}
        y={thermoProductY + 15}
        textAnchor="middle"
        fontSize="12"
        fill={inkColor}
        fontFamily="monospace"
        opacity="0.7"
      >
        ΔG° = -14 kJ/mol
      </text>

      {/* Legend */}
      <line
        x1={width - 160}
        y1={25}
        x2={width - 140}
        y2={25}
        stroke={goldColor}
        strokeWidth="2"
        strokeDasharray="4,4"
      />
      <text
        x={width - 135}
        y={30}
        fontSize="13"
        fill={inkColor}
      >
        Kinetic
      </text>

      <line
        x1={width - 160}
        y1={45}
        x2={width - 140}
        y2={45}
        stroke={inkColor}
        strokeWidth="2"
        opacity="0.6"
      />
      <text
        x={width - 135}
        y={50}
        fontSize="13"
        fill={inkColor}
      >
        Thermodynamic
      </text>
    </svg>
  );
}
