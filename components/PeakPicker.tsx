"use client";

import React from "react";

type PeakPickerProps = {
  value: number[];
  onChange: (next: number[]) => void;
};

// Five-field numeric entry for integrals; replace with spectrum UI when ready.
export function PeakPicker({ value, onChange }: PeakPickerProps) {
  const update = (idx: number, nextVal: number) => {
    const copy = [...value];
    copy[idx] = Number.isFinite(nextVal) ? nextVal : 0;
    onChange(copy);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4 ring-1 ring-amber-100/50">
      <div className="flex items-center justify-between text-sm text-slate-700">
        <span className="font-medium text-slate-800">Integrate by increasing δ</span>
        <button
          type="button"
          className="text-xs text-emerald-700 hover:text-emerald-900"
          onClick={() => onChange([0, 0, 0, 0, 0])}
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {value.map((v, idx) => (
          <label key={idx} className="space-y-1 text-sm text-slate-800">
            <div className="flex items-center justify-between">
              <span>δ{idx + 1} integral</span>
              <span className="text-xs text-slate-500">(arb units)</span>
            </div>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step={0.1}
              value={Number.isFinite(v) ? v : ""}
              onChange={(e) => update(idx, parseFloat(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-inner focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
            />
          </label>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-3 text-xs text-slate-700">
        Replace this with your NMR spectrum image and draggable integration overlay. For now, enter integrals directly.
      </div>
    </div>
  );
}

export default PeakPicker;
