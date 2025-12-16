"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "../../components/Guard";
import { validateCatalyst } from "../../lib/validate";
import { setToken } from "../../lib/gameStore";
import { ROUTES } from "../../lib/routes";
import { StoryCard } from "../../components/ui/StoryCard";
import { LogLine } from "../../components/ui/LogLine";
import { Button } from "../../components/ui/Button";

export default function Station4Catalyst() {
  const router = useRouter();
  const [ans, setAns] = useState("");
  const ok = useMemo(() => validateCatalyst(ans), [ans]);

  const submit = () => {
    if (!ok) return;
    setToken("token3", "H");
    router.push(ROUTES.debrief);
  };

  return (
    <Guard require={["token1", "token2"]}>
      <BasicShell title="Bond Stability Analysis" subtitle="Entry 04 • Mechanistic Resolution">
        <div className="space-y-4">
          <LogLine>The transformation proceeds efficiently but not autonomously.</LogLine>
          <LogLine>One species facilitates progress yet leaves no trace.</LogLine>

          <StoryCard
            title="Station 4 — Catalysis"
            objective="Identify the species present in every step but absent from the net reaction."
            why="Catalysts lower activation barriers and are regenerated; identifying them confirms mechanism."
            procedure={[
              "Inspect the full reaction mechanism.",
              "Track species that appear and disappear during the sequence.",
              "Enter the catalyst responsible for facilitating the transformation.",
            ]}
            hint="The catalyst lowers the barrier but is regenerated."
          >
            <div className="space-y-4">
              <div style={{ borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.4)', padding: 12, fontSize: 14, color: 'rgba(var(--ink),0.8)' }}>
                Insert acid-catalyzed mechanism image here.
              </div>

              <input
                value={ans}
                onChange={(e) => setAns(e.target.value)}
                placeholder="Enter species"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />

              <Button variant="primary" onClick={submit} disabled={!ok}>
                Confirm Catalyst
              </Button>
            </div>
          </StoryCard>
        </div>
      </BasicShell>
    </Guard>
  );
}
