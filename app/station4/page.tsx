"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "../../components/Guard";
import { validateCatalyst } from "../../lib/validate";
import { setToken } from "../../lib/gameStore";
import { ROUTES } from "../../lib/routes";
import { StoryCard } from "../../components/ui/StoryCard";
import { LogLine } from "../../components/ui/LogLine";
import { Button } from "../../components/ui/Button";

export default function Station4Catalyst() {
  const router = useRouter();
  const [ans, setAns] = useState("");
  const ok = useMemo(() => validateCatalyst(ans), [ans]);

  const submit = () => {
    if (!ok) return;
    setToken("token3", "H");
    setToken("s4_catalystOk", true);
    setToken("s4_persistentOk", true);
    router.push(ROUTES.debrief);
  };

  return (
    <Guard require={["token1", "token2"]}>
      <BasicShell title="Bond Stability Analysis" subtitle="Entry 04 • Mechanistic Resolution">
        <div className="space-y-4">
          <LogLine>The transformation proceeds efficiently but not autonomously.</LogLine>

          <div className="rounded-lg border border-amber-700/30 bg-amber-50/40 p-4 space-y-3">
            <div className="text-sm text-slate-700 space-y-2">
              <p className="font-semibold text-slate-800">Catalysis: Presence Without Ownership</p>
              <p>
                Some species participate in the mechanism but do not appear in the net equation. They bind reactants, stabilize intermediates, and lower activation barriers. Yet they emerge from each elementary step unchanged—consumed and regenerated.
              </p>
              <p>
                This is the definition of a catalyst: a species that influences reaction rate and selectivity without being consumed overall. Catalysts are not reagents. They are not products. They are <span className="font-semibold">persistent presences</span>—available at every step, essential to the pathway, but claiming no stake in the outcome.
              </p>
              <p>
                Mechanistic bookkeeping demands distinguishing catalysts (regenerated) from persistent reagents or solvents (present but not regenerated). Only this precision allows mechanistic verification.
              </p>
            </div>
          </div>

          <LogLine>Identify the species that accelerates the transformation but leaves the stoichiometry unchanged.</LogLine>

          <StoryCard
            title="Station 4 — Mechanistic Resolution"
            objective="Distinguish the catalyst (regenerated in every step) from reagents and solvents (persistent but not regenerated). Enter the catalyst only."
            why="Catalysts are the hidden architecture of efficient transformations. Mechanistic accuracy requires identifying what influences the pathway without consuming itself."
            procedure={[
              "Examine the complete reaction mechanism (all elementary steps).",
              "For each species appearing in any intermediate: does it reappear unchanged in a later step?",
              "If yes → catalyst. If no → reagent or solvent. Enter only the catalyst.",
            ]}
            hint="The catalyst enters the mechanism and exits it unchanged. It is present in at least two steps but absent from the net reaction."
          >
            <div className="space-y-4">
              <div style={{ borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.4)', padding: 12, fontSize: 14, color: 'rgba(var(--ink),0.8)' }}>
                Complete reaction mechanism showing all intermediate species across elementary steps.
              </div>

              <input
                value={ans}
                onChange={(e) => setAns(e.target.value)}
                placeholder="Enter species"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />

              <Button variant="primary" onClick={submit} disabled={!ok}>
                Confirm Catalyst
              </Button>
            </div>
          </StoryCard>
        </div>
      </BasicShell>
    </Guard>
  );
}
