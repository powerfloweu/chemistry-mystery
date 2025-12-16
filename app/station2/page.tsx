"use client";

import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "../../components/Guard";
import { setToken, setField } from "../../lib/gameStore";
import { ROUTES } from "../../lib/routes";
import { StoryCard } from "../../components/ui/StoryCard";
import { LogLine } from "../../components/ui/LogLine";
import { Button } from "../../components/ui/Button";

export default function Station2Reaction() {
  const router = useRouter();

  const choose = (which: "kinetic" | "thermo") => {
    if (which !== "thermo") return;
    setToken("token2", "8");
    setField("s2_productOk", true);
    setField("s2_conditionOk", true);
    router.push(ROUTES.s3);
  };

  return (
    <Guard require={["token1"]}>
      <BasicShell title="Bond Stability Analysis" subtitle="Entry 02 • Energetic Profiling">
        <div className="space-y-4">
          <LogLine>
            Sample B was subjected to controlled conditions. Two competing outcomes were observed.
          </LogLine>

          <div className="rounded-lg border border-amber-700/30 bg-amber-50/40 p-4 space-y-3">
            <div className="text-sm text-slate-700 space-y-2">
              <p className="font-semibold text-slate-800">The Controversy</p>
              <p>
                Early literature disagreed sharply: does a transformation succeed because it forms quickly, or because it persists? Some researchers optimized for speed—the lowest activation barrier. Others waited. They found that fast pathways often led to products that degraded or rearranged over time.
              </p>
              <p>
                The critical insight: <span className="font-semibold">endurance matters more than velocity</span>. A product that forms slowly but remains stable indefinitely proves more valuable than one that appears instantly but decomposes under ambient conditions. In the sealed archive, only stable outcomes were recorded.
              </p>
              <p>
                Your task: determine which product the system chooses when allowed unlimited time to reach true equilibrium.
              </p>
            </div>
          </div>

          <LogLine>
            Long-term behavior depends on free energy, not activation barrier. Choose the stable outcome.
          </LogLine>

          <StoryCard
            title="Station 2 — Reaction Coordinate & Stability"
            objective="Distinguish the kinetically favored product (fastest formation) from the thermodynamic product (most stable at equilibrium). Choose the one that persists."
            why="Under infinite time, only the thermodynamic product survives. Early pathways matter only if they lead to endurance, not speed."
            procedure={[
              "Examine the reaction coordinate diagram.",
              "Identify which barrier is lower (kinetic product) and which final state has lower energy (thermodynamic product).",
              "Select the product that prevails if the system is allowed to equilibrate at constant temperature.",
            ]}
            hint="Activation barriers determine timing. Free energy (ΔG°) determines the final answer. At equilibrium, ΔG° rules."
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
                Selecting the kinetic product will fail validation. The archive only records what survives indefinitely.
              </p>
            </div>
          </StoryCard>
        </div>
      </BasicShell>
    </Guard>
  );
}
