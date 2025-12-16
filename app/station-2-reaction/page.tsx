"use client";

import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "@/components/Guard";
import { setToken, setField } from "@/lib/gameStore";
import { ROUTES } from "@/lib/routes";
import { StoryCard } from "@/components/ui/StoryCard";
import TypewriterBlock from "@/components/ui/Typewriter";
import Folio from "@/components/ui/Folio";
import Figure from "@/components/ui/Figure";
import GeneratedReaction from "@/components/ui/GeneratedReaction";
import { Button } from "@/components/ui/Button";
import { STORY } from "@/lib/story";
import { validateS2Product, validateS2Condition } from "@/lib/validate";
import { useState } from "react";

export default function Station2Reaction() {
  const router = useRouter();

  const [productConfirmed, setProductConfirmed] = useState(false);
  const [productChoice, setProductChoice] = useState<"kinetic" | "thermo" | null>(null);
  const [conditionChoice, setConditionChoice] = useState<"I" | "II" | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const chooseProduct = (which: "kinetic" | "thermo") => {
    setProductChoice(which);
    const ok = validateS2Product(which);
    if (!ok) {
      setFeedback("Sequence rejected");
      return;
    }
    setField("s2_productOk", true);
    setToken("token2", "8");
    setProductConfirmed(true);
    setFeedback(null);
  };

  const chooseCondition = (which: "I" | "II") => {
    setConditionChoice(which);
    const ok = validateS2Condition(which);
    if (!ok) {
      setFeedback("Sequence rejected");
      return;
    }
    setField("s2_conditionOk", true);
    router.push(ROUTES.s3);
  };

  return (
    <Guard require={["s1_integralsOk", "s1_identityOk"]}>
      <BasicShell title="Bond Stability Analysis" subtitle="Entry 02 • Energetic Profiling">
        <div className="space-y-4">
          <TypewriterBlock lines={Array.from(STORY.station2.microLore)} className="font-mono text-[13px] leading-relaxed text-slate-900" />


          <Folio label="FIELD NOTE" title={STORY.station2.title} note={STORY.station2.objective}>
            <StoryCard
              title={STORY.station2.title}
              objective={STORY.station2.objective}
              why={STORY.station2.why}
              procedure={Array.from(STORY.station2.procedure)}
              hint="At equilibrium, the lowest ΔG° product dominates — not the one formed fastest."
            >
              <div className="space-y-4">
                <Figure caption="Generated reaction coordinate (stylized)">
                  <GeneratedReaction className="w-full h-auto" />
                </Figure>

              {!productConfirmed ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" onClick={() => chooseProduct("kinetic")}>
                    Kinetic product
                  </Button>
                  <Button variant="secondary" onClick={() => chooseProduct("thermo")}>
                    Thermodynamic product
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm font-medium">Select condition that allows the product to persist</div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" onClick={() => chooseCondition("I")}>Condition I: High temperature, long time</Button>
                    <Button variant="secondary" onClick={() => chooseCondition("II")}>Condition II: Low temperature, short time</Button>
                  </div>
                  <p className="text-sm text-slate-700">If the system is not at equilibrium, re-evaluate the diagram.</p>
                </div>
              )}

              {feedback ? <p className="text-sm text-slate-700">{feedback}</p> : null}
            </div>
          </StoryCard>
          </Folio>
        </div>
      </BasicShell>
    </Guard>
  );
}
 
