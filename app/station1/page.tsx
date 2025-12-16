"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BasicShell } from "../../components/Guard";
import { PeakPicker } from "../../components/PeakPicker";
import { validateNmrIntegrals } from "../../lib/validate";
import { setToken } from "../../lib/gameStore";
import { StoryCard } from "../../components/ui/StoryCard";
import { Button } from "../../components/ui/Button";
import { LogLine } from "../../components/ui/LogLine";

export default function Station1() {
  const router = useRouter();
  const [vals, setVals] = useState<number[]>([0, 0, 0, 0, 0]);
  const ok = useMemo(() => validateNmrIntegrals(vals), [vals]);
  const filled = useMemo(() => vals.every((v) => v > 0), [vals]);

  const submit = () => {
    if (!ok) return;
    setToken("token1", "C");
    setToken("s1_integralsOk", true);
    setToken("s1_identityOk", true);
    router.push("/station2");
  };

  return (
    <BasicShell title="Bond Stability Analysis" subtitle="Entry 01 • Sample Registration">
      <div className="space-y-4">
        <LogLine>
          A sealed vial labeled <span className="font-medium">Sample B</span> was recovered. Composition unknown. Begin identity confirmation by ¹H NMR.
        </LogLine>

        <div className="rounded-lg border border-amber-700/30 bg-amber-50/40 p-4 space-y-3">
          <div className="text-sm text-slate-700 space-y-2">
            <p className="font-semibold text-slate-800">Why NMR?</p>
            <p>
              Structural identity cannot be inferred from formula alone. ¹H NMR integration reveals the true count and environment of hydrogen atoms. When archival samples are degraded or impure, the spectrum becomes noisy—extraneous peaks appear, baselines shift, coupling patterns blur. Identity must be reconstructed from the signal that persists: integral ratios.
            </p>
            <p>
              Your task: extract the integral pattern in order of increasing chemical shift (δ). This sequence uniquely identifies Sample B and permits verification against the archived standard.
            </p>
          </div>
        </div>

        <LogLine>
          Note: the archive key will be generated only after field confirmation. Certain lines are redacted: ██████.
        </LogLine>

        <StoryCard
          title="Station 1 — ¹H NMR Integration"
          objective="Confirm Sample B by extracting the integral pattern from the archived spectrum. Noise and redaction are present—use the signal that remains."
          why="Integration ratios are invariant under noise and solvent interference. They uniquely encode molecular structure, regardless of archive degradation."
          procedure={[
            "Examine the spectrum. Redacted regions are marked ██████. Ignore them.",
            "Read each signal's integral (peak area) in order of increasing chemical shift δ.",
            "Convert integrals to the lowest whole-number ratio (1H, 2H, 3H, etc.).",
            "Submit the sequence to register and verify Sample B.",
          ]}
          hint="Ignore peak splitting and multiplicity. Use only the integral ratios. Order left-to-right by δ value (upfield to downfield)."
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-900/10 bg-white/40 p-4 text-sm space-y-2">
              <p className="text-slate-700 font-semibold">Archived Spectrum (Sample B)</p>
              <p className="text-slate-600 text-xs">
                Image: ¹H NMR at 400 MHz in CDCl₃. Some metadata and integration labels are corrupted (shown as ██████). 
                You must derive the integration pattern by visual inspection.
              </p>
              <div className="bg-slate-100 h-40 rounded flex items-center justify-center text-slate-500 text-xs">
                [NMR Spectrum Placeholder]
              </div>
            </div>

            <PeakPicker value={vals} onChange={setVals} />

            {filled && !ok ? (
              <p className="text-sm text-slate-700">Sequence rejected. Re-check δ order and integration values.</p>
            ) : null}

            <Button variant="primary" onClick={submit} disabled={!ok} className="w-full">
              Register Sample B
            </Button>
          </div>
        </StoryCard>
      </div>
    </BasicShell>
  );
}
