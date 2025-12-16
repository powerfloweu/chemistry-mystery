"use client";

import { Guard, BasicShell } from "../../components/Guard";
import { useRouter } from "next/navigation";
import { setField } from "../../lib/gameStore";
import { ROUTES } from "../../lib/routes";
import { StoryCard } from "../../components/ui/StoryCard";
import { LogLine } from "../../components/ui/LogLine";
import { Button } from "../../components/ui/Button";

export default function Station3Forest() {
  const router = useRouter();

  const completeField = () => {
    setField("s3_confirmed", true);
    router.push(ROUTES.s4);
  };

  return (
    <Guard require={["token1", "token2"]}>
      <BasicShell title="Bond Stability Analysis" subtitle="Entry 03 • Field Perturbation Test">
        <div className="space-y-4">
          <LogLine>
            Energetic preference alone is insufficient. System response under perturbation must be verified.
          </LogLine>

          <div className="rounded-lg border border-amber-700/30 bg-amber-50/40 p-4 space-y-3">
            <div className="text-sm text-slate-700 space-y-2">
              <p className="font-semibold text-slate-800">Why Leave the Archive?</p>
              <p>
                In the sealed laboratory, conditions are constant: standard temperature, neutral pressure, stoichiometric ratios. Real chemistry does not occur in such isolation. Systems encounter temperature variation, mechanical stress, excess reagents, competing environments.
              </p>
              <p>
                Some pathways emerge only under perturbation. A bond may form, persist, or fail depending on whether the system encounters heat, pressure, or reagent excess. The Châtelier principle predicts these shifts: thermodynamic products prevail when the system returns to equilibrium after disturbance.
              </p>
              <p>
                You will verify the predicted outcome by physically exposing the system to environmental stresses in the field. If the thermodynamic analysis was correct, the same product prevails.
              </p>
            </div>
          </div>

          <LogLine>Field conditions apply temperature, pressure, and excess to test the robustness of thermodynamic conclusions.</LogLine>

          <StoryCard
            title="Station 3 — Environmental Selectivity"
            objective="Expose the system to sequential perturbations (heat, compression, reagent excess) and predict equilibrium shifts using Le Châtelier's principle. Follow the forks correctly."
            why="Only thermodynamic products survive arbitrary environmental changes. Kinetic artifacts fail under stress. Robustness is proof."
            procedure={[
              "Proceed to the designated field location.",
              "At each fork, you will encounter a labeled perturbation (temperature increase, pressure applied, excess reagent added).",
              "Predict which direction (left, right, or straight) maintains equilibrium stability for Sample B's transformation.",
              "Complete the entire sequence correctly and return with the confirmation code.",
            ]}
            hint="Increasing T favors the product with higher entropy (usually thermodynamic). Increasing P favors the side with fewer moles. Excess of a reactant shifts the equilibrium forward."
          >
            <div className="space-y-4">
              <div style={{ borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.4)', padding: 12, fontSize: 14, color: 'rgba(var(--ink),0.8)' }}>
                Field map showing sequence of perturbations at forks: Heat | Pressure | Excess Reagent.
              </div>

              <Button variant="ghost" onClick={completeField}>
                I have completed the field sequence
              </Button>
            </div>
          </StoryCard>
        </div>
      </BasicShell>
    </Guard>
  );
}
