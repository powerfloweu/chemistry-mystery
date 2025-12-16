"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "@/components/Guard";
import { validateFinalLockDerived } from "@/lib/validate";
import { ROUTES } from "@/lib/routes";
import { StoryCard } from "@/components/ui/StoryCard";
import { Button } from "@/components/ui/Button";
import { STORY } from "@/lib/story";
import Folio from "@/components/ui/Folio";
import { setField } from "@/lib/gameStore";

export default function FinalLock() {
  const router = useRouter();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const ok = useMemo(() => validateFinalLockDerived(a, b, c), [a, b, c]);

  return (
    <Guard require={["s1_integralsOk","s1_identityOk","s2_productOk","s2_conditionOk","s3_confirmed","s4_catalystOk","s4_persistentOk"]}>
      <BasicShell title={STORY.finalLock.title} subtitle="All analytical constraints satisfied">
        <div className="mb-6 rounded-lg border border-amber-700/30 bg-amber-50/40 p-4 space-y-3">
          <div className="text-sm text-slate-700 space-y-2">
            <p className="font-semibold text-slate-800">System Status: Fully Determined</p>
            <p>
              Four independent constraints have been verified. The molecular identity has been established through spectroscopic integration. Thermodynamic stability has been confirmed under equilibrium conditions. Field perturbation has validated robustness. Catalytic mechanism has been resolved.
            </p>
            <p>
              No further degrees of freedom remain. The system is over-constrained: any additional measurement would be redundant. The outcome is no longer a prediction—it is an inevitable consequence of the recorded data.
            </p>
            <p className="font-semibold">
              Enter the derived verification code. The repository will unlock if and only if the values are internally consistent with the sealed protocol.
            </p>
          </div>
        </div>

        <Folio label="FINAL LOCK" title={STORY.finalLock.title} note={STORY.finalLock.objective}>
          <StoryCard
            title={STORY.finalLock.title}
            objective={STORY.finalLock.objective}
            why={STORY.finalLock.why}
            procedure={[
              "Recall the number of distinct ¹H environments.",
              "Recall the |ΔG°| magnitude of the dominant product.",
              "Recall the catalyst net charge.",
              "Enter the three-part derived code in order.",
            ]}
          >
            <div className="space-y-4">
              <label className="text-xs">Number of distinct ¹H environments in Sample B</label>
              <input className="w-full rounded-xl border px-4 py-3 text-center text-lg bg-white" value={a} onChange={(e) => setA(e.target.value)} />

              <label className="text-xs">|ΔG°| magnitude of equilibrium-dominant product</label>
              <input className="w-full rounded-xl border px-4 py-3 text-center text-lg bg-white" value={b} onChange={(e) => setB(e.target.value)} />

              <label className="text-xs">Catalyst net charge (sign included)</label>
              <input className="w-full rounded-xl border px-4 py-3 text-center text-lg bg-white" value={c} onChange={(e) => setC(e.target.value)} />

              <Button
                variant="primary"
                className="w-full"
                disabled={!ok}
                onClick={() => {
                  if (!ok) return;
                  setField("final_ok", true);
                  // Prefer client-side navigation; add hard fallback to avoid dev overlay stalls
                  router.replace(ROUTES.reveal);
                  setTimeout(() => {
                    try {
                      if (typeof window !== "undefined" && window.location.pathname !== ROUTES.reveal) {
                        window.location.href = ROUTES.reveal;
                      }
                    } catch {}
                  }, 250);
                }}
              >
                Unlock Repository
              </Button>
            </div>
          </StoryCard>
        </Folio>
      </BasicShell>
    </Guard>
  );
}
