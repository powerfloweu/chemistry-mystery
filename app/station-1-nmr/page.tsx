"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "../../components/Guard";
import { PeakPicker } from "../../components/PeakPicker";
import { validateNmrIntegrals, validateS1Identity } from "../../lib/validate";
import { setToken, setField } from "../../lib/gameStore";
import { ROUTES } from "../../lib/routes";
import { STORY } from "@/lib/story";
import TypewriterBlock from "@/components/ui/Typewriter";
import Folio from "@/components/ui/Folio";
import Figure from "@/components/ui/Figure";
import GeneratedNmr from "@/components/ui/GeneratedNmr";
import { Button } from "../../components/ui/Button";

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
          <Figure caption="Recovered access transcript">
            <TypewriterBlock
              lines={Array.from(STORY.station1.microLore)}
              className="font-mono text-[13px] leading-relaxed text-slate-900"
            />
          </Figure>

          <Folio label="FIELD NOTE" title={STORY.station1.title} note={STORY.station1.objective}>
            <div className="grid gap-5 md:grid-cols-2">
              {/* LEFT: protocol + inputs */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-900/10 bg-white/55 p-5 shadow-[inset_0_1px_0_rgba(255,244,214,.35)]">
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-emerald-900/70">
                    PROTOCOL
                  </div>

                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-800/85">
                    <div>
                      <div className="text-xs font-semibold text-slate-900/80">Objective</div>
                      <p className="mt-1">{STORY.station1.objective}</p>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-900/80">Rationale</div>
                      <p className="mt-1">{STORY.station1.why}</p>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-900/80">Procedure</div>
                      <ol className="mt-2 list-decimal space-y-1 pl-5">
                        {Array.from(STORY.station1.procedure).map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <p className="italic text-slate-700/80">
                      Hint: Ignore splitting. Use integrals only. Order is by chemical shift (δ), not peak height.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <PeakPicker value={vals} onChange={setVals} />

                  {filled && !ok ? (
                    <p className="text-sm text-slate-700">Re-check integration order and values.</p>
                  ) : null}

                  {!integralsConfirmed ? (
                    <Button type="button" className="w-full" onClick={confirmIntegrals} disabled={!ok}>
                      Confirm Integrals
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-slate-900/85">Select candidate identity</div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={identityChoice === "A" ? "primary" : "secondary"}
                          onClick={() => setIdentityChoice("A")}
                          className="w-full"
                        >
                          Candidate A: p-ethoxyacetophenone
                        </Button>

                        <Button
                          type="button"
                          variant={identityChoice === "B" ? "primary" : "secondary"}
                          onClick={() => setIdentityChoice("B")}
                          className="w-full"
                        >
                          Candidate B: p-ethoxypropiophenone
                        </Button>
                      </div>

                      <label className="text-xs font-medium text-slate-700">Reason</label>
                      <select
                        value={identityReason}
                        onChange={(e) => setIdentityReason(e.target.value)}
                        className="w-full rounded-2xl border border-slate-900/15 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/35"
                      >
                        <option value="">Select reason</option>
                        <option value="Mismatch in methyl integration">Mismatch in methyl integration</option>
                        <option value="Irregular coupling pattern">Irregular coupling pattern</option>
                        <option value="Unexpected multiplicity">Unexpected multiplicity</option>
                      </select>

                      {identityFeedback ? (
                        <div className="text-sm text-slate-700">{identityFeedback}</div>
                      ) : null}

                      <Button type="button" className="w-full" onClick={submitIdentity}>
                        Confirm Identity
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: spectrum */}
              <div className="md:pt-1">
                <Figure caption="Generated ¹H NMR (stylized)">
                  <GeneratedNmr className="w-full h-auto" />
                </Figure>
              </div>
            </div>
          </Folio>
        </div>
    </BasicShell>
    </Guard>
  );
}
