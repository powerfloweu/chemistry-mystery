"use client";

import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "@/components/Guard";
import { ROUTES } from "@/lib/routes";
import { LogLine } from "@/components/ui/LogLine";
import { Button } from "@/components/ui/Button";
import Folio from "@/components/ui/Folio";
import { STORY } from "@/lib/story";

export default function Debrief() {
  const router = useRouter();

  return (
    <Guard require={["s1_integralsOk","s1_identityOk","s2_productOk","s2_conditionOk","s3_confirmed","s4_catalystOk","s4_persistentOk"]}>
      <BasicShell title="RUN COMPLETE" subtitle="All analytical constraints satisfied">
        <div className="space-y-4">
          <div className="rounded-lg border border-amber-700/30 bg-amber-50/40 p-4 space-y-3">
            <div className="text-sm text-slate-700 space-y-2">
              <p className="font-semibold text-slate-800">Summary of Investigation</p>
              <p>
                The protocol has been executed in full. Structural identity was established through spectroscopic analysis. Thermodynamic preference was confirmed under both equilibrium and field conditions. Mechanistic catalysis was resolved with complete bookkeeping.
              </p>
              <p>
                The chemical model is internally consistent and reproducible. All necessary conditions for the reported transformation have been verified. The system satisfies orbital symmetry requirements, energetic favorability, and catalytic accessibility.
              </p>
              <p className="font-semibold">
                However: the model cannot predict initiation. One variable—external to mechanistic constraints—determines whether the transformation proceeds. This variable is not chemical in nature and cannot be optimized experimentally.
              </p>
            </div>
          </div>

          <Folio label="FIELD NOTE" title="BOND STABILITY ANALYSIS — SUMMARY" note="All analytical objectives met">
            <LogLine>{STORY.debrief.why}</LogLine>

            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-slate-700">
              <div>Sample</div><div>B</div>
              <div>Dominant product</div><div>Thermodynamic</div>
              <div>Catalyst</div><div>H⁺</div>
              <div>Status</div><div>Completed</div>
            </div>

            <p className="mt-4 text-sm text-slate-700">{STORY.debrief.objective}</p>

            <div className="mt-4">
              <Button variant="primary" onClick={() => router.push(ROUTES.archive)}>
                Proceed to Archive
              </Button>
            </div>
          </Folio>
        </div>
      </BasicShell>
    </Guard>
  );
}
 