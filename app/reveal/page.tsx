"use client";

import { useRouter } from "next/navigation";
import { BasicShell, Guard } from "@/components/Guard";
import Folio from "@/components/ui/Folio";
import { Button } from "@/components/ui/Button";
import { readState } from "@/lib/gameStore";

export default function Reveal() {
  const router = useRouter();
  const st = readState();
  const player = (st.playerName || "Researcher").toString();

  return (
    <Guard require={["final_ok"]}>
      <BasicShell title="Sealed Repository" subtitle="Access granted">
        <Folio label="ARCHIVE" title="Repository Unsealed">
          <RevealBody player={player} onContinue={() => router.push("/reveal/question")} />
        </Folio>
      </BasicShell>
    </Guard>
  );
}

function RevealBody({ player, onContinue }: { player: string; onContinue: () => void }) {
  return (
    <div className="space-y-6 text-slate-800">
      <div className="space-y-4">
        <p className="font-semibold">Conclusion</p>

        <p>All observable parameters have been satisfied.</p>

        <p>
          The structure is identifiable.<br />
          The pathway is energetically accessible.<br />
          Environmental perturbations no longer inhibit formation.<br />
          Catalytic conditions are present and sufficient.
        </p>

        <p>Within the limits of the model, the bond can form.</p>
      </div>

      <hr className="border-slate-300/50" />

      <div className="space-y-4">
        <p>
          What the archive could never determine<br />
          was not the mechanism,<br />
          nor the probability,<br />
          nor the stability.
        </p>

        <p>The missing variable was never chemical.</p>

        <p>
          It cannot be measured, integrated, or derived.<br />
          It cannot be forced.<br />
          It cannot be predicted.
        </p>
      </div>

      <hr className="border-slate-300/50" />

      <div className="space-y-4">
        <p>At this point, the system leaves theory.</p>

        <p>No further calculations apply.</p>

        <p>
          The final step requires a condition<br />
          that only one participant can supply.
        </p>

        <p className="italic text-slate-700">
          This action is irreversible.
        </p>
      </div>

      <div className="pt-4">
        <Button variant="primary" onClick={onContinue}>
          What?
        </Button>
      </div>
    </div>
  );
}
