"use client";

import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "../../components/Guard";
import { setToken } from "../../lib/gameStore";
import { ROUTES } from "../../lib/routes";
import { StoryCard } from "../../components/ui/StoryCard";
import { LogLine } from "../../components/ui/LogLine";
import { Button } from "../../components/ui/Button";

export default function Station2Reaction() {
  const router = useRouter();

  const choose = (which: "kinetic" | "thermo") => {
    if (which !== "thermo") return;
    setToken("token2", "8");
    router.push(ROUTES.s3);
  };

  return (
    <Guard require={["token1"]}>
      <BasicShell title="Bond Stability Analysis" subtitle="Entry 02 • Energetic Profiling">
        <div className="space-y-4">
          <LogLine>
            Sample B was subjected to controlled conditions. Two competing outcomes were observed.
          </LogLine>
          <LogLine>
            Long-term behavior depends on energetic favorability, not formation speed.
          </LogLine>

          <StoryCard
            title="Station 2 — Reaction Coordinate"
            objective="Identify the product that dominates when the system is allowed to equilibrate."
            why="Equilibrium control reveals the thermodynamic product, validating energetic analysis."
            procedure={[
              "Inspect the reaction coordinate diagram.",
              "Compare activation barriers and final free energies.",
              "Select the product favored at equilibrium.",
            ]}
            hint="At equilibrium, the lowest ΔG° product dominates — not the one formed fastest."
          >
            <div className="space-y-4">
              <div style={{ borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.4)', padding: 12, fontSize: 14, color: 'rgba(var(--ink),0.8)' }}>
                Insert reaction coordinate diagram here (static image).
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Button variant="secondary" onClick={() => choose("kinetic")}>Kinetic product</Button>
                <Button variant="secondary" onClick={() => choose("thermo")}>Thermodynamic product</Button>
              </div>

              <p style={{ fontSize: 14, color: 'rgba(var(--ink),0.75)' }}>
                If the system is not at equilibrium, re-evaluate the diagram.
              </p>
            </div>
          </StoryCard>
        </div>
      </BasicShell>
    </Guard>
  );
}
