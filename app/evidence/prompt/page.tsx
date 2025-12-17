"use client";

import { Guard, BasicShell } from "@/components/Guard";
import Folio from "@/components/ui/Folio";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { isDevMode } from "@/lib/gameStore";

export default function EvidencePrompt() {
  const router = useRouter();
  return (
    <Guard require={["final_ok"]}>
      <BasicShell title="After the evidence" subtitle="All frames played">
        <div className="space-y-6">
          <Folio label="PROMPT" title="After the evidence" note="Unlocks only after the slideshow finishes">
            <div className="space-y-3">
              <p className="text-sm text-slate-800">You saw every frame. Ready to answer?</p>
              <Button variant="primary" className="w-full" onClick={() => router.push("/reveal")}>Confirm evidence</Button>
              {isDevMode() && (
                <p className="text-[11px] text-amber-800/80">(Dev mode enabled)</p>
              )}
            </div>
          </Folio>
        </div>
      </BasicShell>
    </Guard>
  );
}
