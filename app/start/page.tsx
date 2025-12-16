"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clearState, readState, setField } from "@/lib/gameStore";
import { BasicShell } from "@/components/Guard";
import { Button } from "@/components/ui/Button";
import { WaxSealImage } from "@/components/ui/WaxSealImage";
import Folio from "@/components/ui/Folio";
import Figure from "@/components/ui/Figure";
import { STORY } from "@/lib/story";

function useTypewriter(lines: string[], enabled: boolean, speedMs = 22, pauseMs = 450) {
  const [out, setOut] = useState<string[]>([]);
  const idxRef = useRef({ line: 0, char: 0 });

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setOut([]);
    idxRef.current = { line: 0, char: 0 };

    const tick = async () => {
      while (!cancelled) {
        const { line, char } = idxRef.current;

        if (line >= lines.length) return;

        const full = lines[line];
        const nextChar = char + 1;

        setOut((prev) => {
          const next = [...prev];
          next[line] = full.slice(0, nextChar);
          return next;
        });

        idxRef.current = { line, char: nextChar };

        if (nextChar >= full.length) {
          await new Promise((r) => setTimeout(r, pauseMs));
          idxRef.current = { line: line + 1, char: 0 };
          setOut((prev) => {
            const next = [...prev];
            if (next.length < line + 2) next.push("");
            return next;
          });
        } else {
          await new Promise((r) => setTimeout(r, speedMs));
        }
      }
    };

    tick();
    return () => {
      cancelled = true;
    };
  }, [enabled, lines, speedMs, pauseMs]);

  const done =
    out.length >= lines.length &&
    out.every((l, i) => {
      const target = lines[i] ?? "";
      return (l ?? "").length === target.length;
    });
  return { out, done };
}

export default function StartPage() {
  const router = useRouter();
  const existing = useMemo(() => readState().playerName ?? "", []);
  const [name, setName] = useState(existing);
  const [started, setStarted] = useState(false);

  const safeName = (name || "").trim().slice(0, 28);

  const lines = useMemo(() => {
    const who = safeName.length ? safeName : "Researcher";
    return [
      `ACCESS GRANTED`,
      `Subject: ${who}`,
      `Project: FIELD NOTES INTERFACE`,
      `Scope: identity -> energetics -> field perturbation -> mechanism`,
      ...(STORY.start?.beats ?? []),
      `Protocol integrity is mandatory.`,
      `Proceed when ready.`,
    ];
  }, [safeName]);

  const { out, done } = useTypewriter(lines, started);

  const begin = () => {
    clearState();
    setField("playerName", safeName.length ? safeName : "Researcher");
    router.push("/intro");
  };

  return (
    <BasicShell title="Chemistry Mystery" subtitle="You have been invited to solve a" description="A rare, symmetric bond has been reported.">
      <div className="space-y-5 animate-fadeIn">
        <div className="absolute top-2 right-0 translate-x-3 z-40">
          <WaxSealImage
            broken={started}
            disabled={!safeName.length}
            size={220}
            onClick={() => {
              if (!safeName.length) return;
              setStarted(true);
            }}
          />
        </div>

        {!started ? (
          <>
            <Folio
              label="IDENTIFICATION"
              title="Chemist Clearance"
              note="Enter your name to authorize record access."
            >
              <div className="relative">
                <Figure caption="Local Encryption">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-wide text-slate-800/80">
                      Scientist Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-slate-900/15 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/35"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-slate-700/70">
                        (Persistent on this device only. Required for record segregation.)
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs px-2 py-1 whitespace-nowrap"
                        onClick={() => {
                          clearState();
                          setName("");
                        }}
                        title="Clear saved name from this session"
                      >
                        New alter ego
                      </Button>
                    </div>
                  </div>
                </Figure>

                <p className="mt-4 text-xs text-slate-700/60 border-l-2 border-amber-700/40 pl-3">
                  <span className="font-semibold">Archive Protocol:</span> The final objective remains sealed. You will proceed by evidence only.
                </p>
              </div>
            </Folio>
          </>
        ) : (
          <>
            <Folio
              label="CLEARANCE LOG"
              title="Archive Authorization"
              note="System access initialized. Retrieving sealed records..."
            >
              <Figure caption="Verified investigator session transcript">
                <div className="font-mono text-[13px] leading-relaxed text-slate-900">
                  {out.map((l, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                      <span className="text-emerald-900/70 mr-2">→</span>
                      {l}
                      {i === out.length - 1 && !done ? (
                        <span className="inline-block w-[8px] ml-1 animate-pulse">▍</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Figure>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button variant="secondary" onClick={() => setStarted(false)}>
                  Reseal
                </Button>

                <Button
                  variant="primary"
                  onClick={begin}
                  disabled={!done}
                  title={!done ? "Wait for the record to finish loading" : "Begin"}
                >
                  Begin Analysis
                </Button>
              </div>
            </Folio>
          </>
        )}
      </div>
    </BasicShell>
  );
}
