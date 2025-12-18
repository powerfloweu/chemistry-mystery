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
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Guard already blocks missing name, but keep this as belt+suspenders for routing edge cases
  useEffect(() => {
    // no-op: Guard handles it
  }, []);

  const startAudio = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      await el.play();
      el.muted = false;
      setAudioPlaying(true);
    } catch (err) {
      console.warn("Audio play blocked", err);
      setAudioPlaying(false);
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
            <div className="space-y-2">
              <audio
                ref={audioRef}
                controls
                playsInline
                loop
                preload="none"
                className="w-full"
                onPlay={() => setAudioPlaying(true)}
                onPause={() => setAudioPlaying(false)}
              >
                <source src="/audio/intro.mp3" type="audio/mpeg" />
              </audio>
              <Button
                variant="secondary"
                onClick={startAudio}
                className="w-full text-sm"
              >
                {audioPlaying ? "Music playing" : "Play intro music"}
              </Button>
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