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
      <BasicShell title={STORY.finalLock.title} subtitle="Final access requires full verification">
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
              <input className="w-full rounded-xl border px-4 py-3 text-center text-lg bg-white/60" value={a} onChange={(e) => setA(e.target.value)} />

              <label className="text-xs">|ΔG°| magnitude of equilibrium-dominant product</label>
              <input className="w-full rounded-xl border px-4 py-3 text-center text-lg bg-white/60" value={b} onChange={(e) => setB(e.target.value)} />

              <label className="text-xs">Catalyst net charge (sign included)</label>
              <input className="w-full rounded-xl border px-4 py-3 text-center text-lg bg-white/60" value={c} onChange={(e) => setC(e.target.value)} />

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
