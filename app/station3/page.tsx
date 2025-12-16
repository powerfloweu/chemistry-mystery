"use client";

import { Guard, BasicShell } from "../../components/Guard";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../lib/routes";
import { StoryCard } from "../../components/ui/StoryCard";
import { LogLine } from "../../components/ui/LogLine";
import { Button } from "../../components/ui/Button";

export default function Station3Forest() {
  const router = useRouter();

  return (
    <Guard require={["token1", "token2"]}>
      <BasicShell title="Bond Stability Analysis" subtitle="Entry 03 • Field Perturbation Test">
        <div className="space-y-4">
          <LogLine>
            Energetic preference alone is insufficient. System response under perturbation must be verified.
          </LogLine>
          <LogLine>Field conditions simulate non-ideal constraints.</LogLine>

          <StoryCard
            title="Station 3 — Selectivity in the Field"
            objective="Confirm predicted selectivity by applying Le Châtelier’s principle in a physical environment."
            procedure={[
              "Proceed to the designated outdoor location with the tablet.",
              "At each fork, predict the equilibrium shift caused by the perturbation shown.",
              "Follow the correct sequence to completion.",
              "Return once the sequence is complete.",
            ]}
            hint="Temperature favors thermodynamic outcomes; pressure favors fewer moles; excess reagent drives forward."
          >
            <div className="space-y-4">
              <div style={{ borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.4)', padding: 12, fontSize: 14, color: 'rgba(var(--ink),0.8)' }}>
                Insert forest fork map here (Right → Left → Straight).
              </div>

              <Button variant="ghost" onClick={() => router.push(ROUTES.s4)}>
                I have completed the field sequence
              </Button>
            </div>
          </StoryCard>
        </div>
      </BasicShell>
    </Guard>
  );
}
