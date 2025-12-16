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
    router.push("/station2");
  };

  return (
    <BasicShell title="Bond Stability Analysis" subtitle="Entry 01 • Sample Registration">
      <div className="space-y-4">
        <LogLine>
          A sealed vial labeled <span className="font-medium">Sample B</span> was recovered. Composition unknown. Begin identity confirmation by ¹H NMR.
        </LogLine>
        <LogLine>
          Note: the archive key will be generated only after field confirmation. Certain lines are redacted: ██████.
        </LogLine>

        <StoryCard
          title="Station 1 — ¹H NMR Integration"
          objective="Determine the integral pattern in increasing δ order and confirm Sample B is the correct target."
          why="Accurate integration confirms molecular stoichiometry and supports identity verification."
          procedure={[
            "Observe the spectrum (static image).",
            "Select the integral (1H/2H/3H) for each signal in increasing δ order.",
            "Submit the sequence to register Sample B.",
          ]}
          hint="Ignore splitting. Use integrals only. Order is by chemical shift (δ), not peak height."
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-900/10 bg-white/40 p-3 text-sm text-slate-700">
              Place your NMR spectrum image above or here (static). (You can embed /public/nmr.png later.)
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
