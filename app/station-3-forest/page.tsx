"use client";

import { Guard, BasicShell } from "@/components/Guard";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { StoryCard } from "@/components/ui/StoryCard";
import { Button } from "@/components/ui/Button";
import { STORY } from "@/lib/story";
import TypewriterBlock from "@/components/ui/Typewriter";
import Folio from "@/components/ui/Folio";
import Figure from "@/components/ui/Figure";
import GeneratedForest from "@/components/ui/GeneratedForest";
import { useState } from "react";
import { setField } from "@/lib/gameStore";
import { validateS3FieldCode } from "@/lib/validate";

export default function Station3Forest() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const submitCode = () => {
    const ok = validateS3FieldCode(code);
    if (!ok) return setFeedback("Sequence rejected");
    setField("s3_confirmed", true);
    router.push(ROUTES.s4);
  };

  return (
    <Guard require={["s2_productOk", "s2_conditionOk"]}>
      <BasicShell title="Bond Stability Analysis" subtitle="Entry 03 • Field Perturbation Test">
        <div className="space-y-4">
          <TypewriterBlock lines={Array.from(STORY.station3.microLore)} className="font-mono text-[13px] leading-relaxed text-slate-900" />

          <Folio label="FIELD NOTE" title={STORY.station3.title} note={STORY.station3.objective}>
            <StoryCard
              title={STORY.station3.title}
              objective={STORY.station3.objective}
              why={STORY.station3.why}
              procedure={Array.from(STORY.station3.procedure)}
              hint="Temperature favors thermodynamic outcomes; pressure favors fewer moles; excess reagent drives forward."
            >
              <div className="space-y-4">
                <Figure caption="Generated field map (stylized fork)">
                  <GeneratedForest className="w-full h-auto" />
                </Figure>

                <div className="space-y-3">
                  <label className="text-xs font-medium">Enter field confirmation code</label>
                  <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. L-3" className="w-full rounded-xl border px-4 py-3 text-sm bg-white" />
                  {feedback ? <div className="text-sm text-slate-700">{feedback}</div> : null}
                  <Button variant="ghost" onClick={submitCode}>Submit Code</Button>
                </div>
              </div>
            </StoryCard>
          </Folio>
        </div>
      </BasicShell>
    </Guard>
  );
}
