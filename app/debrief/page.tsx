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
      <BasicShell title="RUN COMPLETE" subtitle="All analytical objectives met">
        <div className="space-y-4">
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
              <Button variant="ghost" onClick={() => router.push(ROUTES.archive)}>
                Open Lab Archive
              </Button>
            </div>
          </Folio>
        </div>
      </BasicShell>
    </Guard>
  );
}
 