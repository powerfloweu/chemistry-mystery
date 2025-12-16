"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "../../components/Guard";
import Folio from "../../components/ui/Folio";
import Figure from "../../components/ui/Figure";
import { Button } from "../../components/ui/Button";
import { STORY } from "../../lib/story";

export default function IntroPage() {
  const router = useRouter();

  // Guard already blocks missing name, but keep this as belt+suspenders for routing edge cases
  useEffect(() => {
    // no-op: Guard handles it
  }, []);

  return (
    <Guard require={["playerName"]}>
      <BasicShell
        title="Recovered Dossier"
        subtitle="Initial Access Granted — Archival Layer Unsealed"
      >
        <Folio
          label="ARCHIVAL NOTE"
          title={STORY.intro.title}
          note={STORY.intro.subtitle}
        >
          <div className="space-y-4 text-sm leading-relaxed text-slate-800/85">
            <Figure caption="Archival advisory: orbital symmetry constraints may apply">
              <div className="space-y-3">
                {STORY.intro.sections.map((p, i) => (
                  <p key={i} className={i === STORY.intro.emphasisIndex ? "italic text-slate-800/75" : ""}>
                    {p}
                  </p>
                ))}
              </div>
            </Figure>

            <div className="pt-2">
              <Button className="w-full" type="button" onClick={() => router.push("/station1")}>
                Begin the Protocol
              </Button>
            </div>

            <p className="text-xs text-slate-700/65">{STORY.intro.footnote}</p>
          </div>
        </Folio>
      </BasicShell>
    </Guard>
  );
}