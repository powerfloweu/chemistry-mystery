"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionGuard } from "../../components/SessionGuard";
import { Guard, BasicShell } from "../../components/Guard";
import Folio from "../../components/ui/Folio";
import Figure from "../../components/ui/Figure";
import { Button } from "../../components/ui/Button";
import { STORY } from "../../lib/story";

export default function IntroPage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Guard already blocks missing name, but keep this as belt+suspenders for routing edge cases
  useEffect(() => {
    // no-op: Guard handles it
  }, []);

  const startAudio = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      el.muted = false;
      await el.play();
      setAudioPlaying(true);
    } catch (err) {
      console.warn("Audio play blocked", err);
    }
  };

  return (
    <SessionGuard>
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
            <div className="relative">
              <audio
                ref={audioRef}
                controls
                autoPlay
                muted
                playsInline
                loop
                className="w-full mb-4"
                onCanPlay={() => setAudioReady(true)}
                onPlay={() => setAudioPlaying(true)}
              >
                <source src="/audio/intro.mp3" type="audio/mpeg" />
              </audio>
              {!audioPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-slate-900/70 text-white text-xs px-3 py-1 rounded-full shadow">
                    Tap play to enable audio
                  </div>
                </div>
              )}
              {!audioPlaying && audioReady && (
                <div className="mt-2 flex justify-center">
                  <Button variant="secondary" onClick={startAudio} className="text-xs py-1 px-3 h-auto">
                    Enable audio
                  </Button>
                </div>
              )}
            </div>
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
      </BasicShell>
    </Guard>
    </SessionGuard>
  );
}