"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clearState, readState, setField } from "@/lib/gameStore";
import { BasicShell } from "@/components/Guard";
import { Button } from "@/components/ui/Button";
import { WaxSeal } from "@/components/ui/WaxSeal";
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
      `Project: BOND STABILITY ANALYSIS`,
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
    <BasicShell title="Sealed Dossier" subtitle="Unauthorized disclosure is prohibited">
      <div className="space-y-5 animate-fadeIn">
        {!started ? (
          <>
            <Folio
              label="IDENTIFICATION"
              title="Investigator Identification"
              note="To open the record, enter the investigator name."
            >
              <div className="relative">
                <div className="pointer-events-none absolute -right-4 -top-8 z-30 overflow-visible animate-fadeIn">
                  <WaxSeal open={started} label="SEALED" />
                </div>

                <Figure caption="Authentication field (local device only)">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-wide text-slate-800/80">
                      Investigator
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-slate-900/15 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/35"
                    />
                    <p className="text-xs text-slate-700/70">
                      (Used only for personalization on this device.)
                    </p>

                    <div className="pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          clearState();
                          setName("");
                        }}
                        title="Clear saved name from this session"
                      >
                        Clear saved name
                      </Button>
                    </div>
                  </div>
                </Figure>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full"
                    onClick={() => setStarted(true)}
                  >
                    Break the Seal
                  </Button>
                </div>

                <p className="mt-4 text-xs text-slate-700/60">
                  Note: the system will not reveal the final objective in advance.
                </p>
              </div>
            </Folio>
          </>
        ) : (
          <>
            <Folio
              label="LOG ENTRY"
              title="Recovered Archive Entry"
              note="This interface is procedural by design. No hints beyond the protocol."
            >
              <Figure caption="Recovered access transcript">
                <div className="font-mono text-[13px] leading-relaxed text-slate-900">
                  {out.map((l, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                      <span className="text-emerald-900/70 mr-2">▸</span>
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
