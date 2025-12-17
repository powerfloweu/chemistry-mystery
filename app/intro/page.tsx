"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionGuard } from "../../components/SessionGuard";
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
    <SessionGuard>
      <Guard require={["playerName"]}>
      <BasicShell
        title="Recovered Dossier"
        subtitle="Initial Access Granted — Archival Layer Unsealed"
      >
        <div
          style={{
            backgroundImage: 'url(/images/parchment.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            margin: '-1.5rem',
          }}
        >
          <Folio
            label="ARCHIVAL NOTE"
            title={STORY.intro.title}
            note={STORY.intro.subtitle}
          >
            <div className="space-y-4 text-sm leading-relaxed text-slate-800/85">
            <audio controls autoPlay loop className="w-full mb-4">
              <source src="/audio/intro.mp3" type="audio/mpeg" />
            </audio>
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
          </div>
          </Folio>
        </div>
      </BasicShell>
    </Guard>
    </SessionGuard>
  );
}