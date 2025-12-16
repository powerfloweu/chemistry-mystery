"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "../../components/Guard";
import { PeakPicker } from "../../components/PeakPicker";
import { validateNmrIntegrals, validateS1Identity } from "../../lib/validate";
import { setToken, setField } from "../../lib/gameStore";
import { ROUTES } from "../../lib/routes";
import { StoryCard } from "@/components/ui/StoryCard";
import { STORY } from "@/lib/story";
import TypewriterBlock from "@/components/ui/Typewriter";
import Folio from "@/components/ui/Folio";
import Figure from "@/components/ui/Figure";
import GeneratedNmr from "@/components/ui/GeneratedNmr";

export default function Station1Nmr() {
  const router = useRouter();
  const [vals, setVals] = useState<number[]>([0, 0, 0, 0, 0]);
  const ok = useMemo(() => validateNmrIntegrals(vals), [vals]);
  const filled = useMemo(() => vals.every((v) => v > 0), [vals]);
  const [integralsConfirmed, setIntegralsConfirmed] = useState(false);
  const [identityChoice, setIdentityChoice] = useState<"A" | "B" | null>(null);
  const [identityReason, setIdentityReason] = useState("");
  const [identityFeedback, setIdentityFeedback] = useState<string | null>(null);

  const confirmIntegrals = () => {
    if (!ok) return;
    setField("s1_integralsOk", true);
    setToken("token1", "C");
    setIntegralsConfirmed(true);
  };

  const submitIdentity = () => {
    if (!identityChoice) return setIdentityFeedback("Identity rejected");
    const valid = validateS1Identity(identityChoice, identityReason);
    if (!valid) {
      setIdentityFeedback("Identity rejected");
      return;
    }
    setField("s1_identityOk", true);
    router.push(ROUTES.s2);
  };

  return (
    <Guard require={["playerName"]}>
      <BasicShell title="Bond Stability Analysis" subtitle="Entry 01 • Identity Confirmation">
        <div className="space-y-4">
        <TypewriterBlock lines={Array.from(STORY.station1.microLore)} className="font-mono text-[13px] leading-relaxed text-slate-900" />

        <Folio label="FIELD NOTE" title={STORY.station1.title} note={STORY.station1.objective}>
          <StoryCard
            title={STORY.station1.title}
            objective={STORY.station1.objective}
            why={STORY.station1.why}
            procedure={Array.from(STORY.station1.procedure)}
            hint="Ignore splitting. Use integrals only. Order is by chemical shift (δ), not peak height."
          >
            <div className="space-y-4">
              <Figure caption="Generated ¹H NMR (stylized)">
                <GeneratedNmr className="w-full h-auto" />
              </Figure>

              <PeakPicker value={vals} onChange={setVals} />

              {filled && !ok ? <p className="text-sm text-slate-700">Re-check integration order and values.</p> : null}

              {!integralsConfirmed ? (
                <button
                  onClick={confirmIntegrals}
                  disabled={!ok}
                  className="w-full rounded-xl border px-4 py-3 text-sm font-medium hover:bg-muted disabled:opacity-50"
                >
                  Confirm Integrals
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm font-medium">Select candidate identity</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIdentityChoice("A")}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium ${identityChoice === "A" ? "border-emerald-700" : ""}`}
                    >
                      Candidate A: p-ethoxyacetophenone
                    </button>
                    <button
                      onClick={() => setIdentityChoice("B")}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium ${identityChoice === "B" ? "border-emerald-700" : ""}`}
                    >
                      Candidate B: p-ethoxypropiophenone
                    </button>
                  </div>

                  <label className="text-xs font-medium">Reason</label>
                  <select value={identityReason} onChange={(e) => setIdentityReason(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm">
                    <option value="">Select reason</option>
                    <option value="Mismatch in methyl integration">Mismatch in methyl integration</option>
                    <option value="Irregular coupling pattern">Irregular coupling pattern</option>
                    <option value="Unexpected multiplicity">Unexpected multiplicity</option>
                  </select>

                  {identityFeedback ? <div className="text-sm text-slate-700">{identityFeedback}</div> : null}

                  <button onClick={submitIdentity} className="w-full rounded-xl border px-4 py-3 text-sm font-medium hover:bg-muted">
                    Confirm Identity
                  </button>
                </div>
              )}
            </div>
          </StoryCard>
        </Folio>
      </div>
    </BasicShell>
    </Guard>
  );
}
