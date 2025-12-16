"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "@/components/Guard";
import { validateS4CatalystPair } from "@/lib/validate";
import { setToken, setField } from "@/lib/gameStore";
import { ROUTES } from "@/lib/routes";
import { StoryCard } from "@/components/ui/StoryCard";
import TypewriterBlock from "@/components/ui/Typewriter";
import { LogLine } from "@/components/ui/LogLine";
import { Button } from "@/components/ui/Button";
import { STORY } from "@/lib/story";
import Folio from "@/components/ui/Folio";
import Figure from "@/components/ui/Figure";
import GeneratedCatalyst from "@/components/ui/GeneratedCatalyst";

export default function Station4Catalyst() {
  const router = useRouter();
  const [catalyst, setCatalyst] = useState("");
  const [persistent, setPersistent] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const submit = () => {
    const ok = validateS4CatalystPair(catalyst, persistent);
    if (!ok) {
      setFeedback("Selection rejected");
      return;
    }
    setField("s4_catalystOk", true);
    setField("s4_persistentOk", true);
    setToken("token3", "H");
    router.push(ROUTES.debrief);
  };

  return (
    <Guard require={["s3_confirmed"]}>
      <BasicShell title="Bond Stability Analysis" subtitle="Entry 04 • Mechanistic Resolution">
        <div className="space-y-4">
          <Folio label="FIELD NOTE" title={STORY.station4.title} note={STORY.station4.objective}>
            <StoryCard
              title={STORY.station4.title}
              objective={STORY.station4.objective}
              why={STORY.station4.why}
              procedure={Array.from(STORY.station4.procedure)}
              hint="The catalyst lowers the barrier but is regenerated."
            >
              <div className="space-y-4">
                <Figure caption="Generated mechanistic sketch (acid-catalyzed)">
                  <GeneratedCatalyst className="w-full h-auto" />
                </Figure>

                <label className="text-xs font-medium">Catalyst (regenerated, absent from net equation)</label>
                <select value={catalyst} onChange={(e) => setCatalyst(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm">
                  <option value="">Select catalyst</option>
                  <option>H+</option>
                  <option>H3O+</option>
                  <option>ROH (solvent)</option>
                  <option>A− (conjugate base)</option>
                </select>

                <label className="text-xs font-medium">Persistent species (appears throughout)</label>
                <select value={persistent} onChange={(e) => setPersistent(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm">
                  <option value="">Select persistent species</option>
                  <option>H+</option>
                  <option>H3O+</option>
                  <option>ROH (solvent)</option>
                  <option>A− (conjugate base)</option>
                </select>

                {feedback ? <div className="text-sm text-slate-700">{feedback}</div> : null}

                <Button variant="primary" onClick={submit} className="w-full">
                  Confirm Selections
                </Button>
              </div>
            </StoryCard>
          </Folio>
        </div>
      </BasicShell>
    </Guard>
  );
}
