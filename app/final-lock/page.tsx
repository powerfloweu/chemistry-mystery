"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "@/components/Guard";
import { ROUTES } from "@/lib/routes";
import Folio from "@/components/ui/Folio";
import { Button } from "@/components/ui/Button";
import { readState, setField, isDevMode } from "@/lib/gameStore";
import { SessionSyncProvider } from "@/components/SessionSyncProvider";

function useTypewriter(lines: string[], enabled: boolean, speedMs = 18, pauseMs = 420) {
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

function routeGallery(): string {
  const r: any = ROUTES as any;
  return r.gallery || "/gallery";
}

function normToken(s: string): string {
  return (s || "")
    .trim()
    .toUpperCase()
    .replace(/[\s\-–—_:|]/g, "");
}

export default function FinalLock() {
  const router = useRouter();

  const [syncTrigger, setSyncTrigger] = useState(0);
  
  // Re-read state whenever sync triggers or component mounts
  const st = useMemo(() => readState(), [syncTrigger]);
  const player = (st.playerName || "Researcher").toString();
  const hintsUnlocked = !!st.hints_final_unlocked;
  
  // Listen for session sync events
  useEffect(() => {
    const handleSync = () => {
      setSyncTrigger(prev => prev + 1);
    };
    window.addEventListener('sessionSync', handleSync);
    return () => window.removeEventListener('sessionSync', handleSync);
  }, []);

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");

  const ok = useMemo(() => {
    const combined = normToken(`${a}${b}${c}${d}`);
    return combined === "C8H8";
  }, [a, b, c, d]);

  const lines = useMemo(
    () => [
      "FINAL ACCESS // LOCKED GATE",
      `Investigator: ${player}`,
      "Record integrity confirmed. No additional measurements required.",
      "A final gate remains. Provide the final key to proceed.",
    ],
    [player]
  );

  const { out, done } = useTypewriter(lines, true);

  const [ready, setReady] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  useEffect(() => {
    if (!done) {
      setReady(false);
      setJustUnlocked(false);
      return;
    }
    setJustUnlocked(true);
    const t1 = setTimeout(() => setReady(true), 900);
    const t2 = setTimeout(() => setJustUnlocked(false), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [done]);

  // Dev mode: auto-fill and jump to reveal
  useEffect(() => {
    try {
      if (isDevMode()) {
        setA((prev) => (prev ? prev : "dev"));
        setB((prev) => (prev ? prev : "dev"));
        setC((prev) => (prev ? prev : "dev"));
        setD((prev) => (prev ? prev : "dev"));
        setField("final_ok", true);
        router.replace(routeGallery());
      }
    } catch {}
  }, [router]);

  const unlock = () => {
    if (!ready || !ok) return;
    setField("final_ok", true);
    router.replace(routeGallery());
    setTimeout(() => {
      try {
        const p = routeGallery();
        if (typeof window !== "undefined" && window.location.pathname !== p) {
          window.location.href = p;
        }
      } catch {}
    }, 250);
  };

  return (
    <SessionSyncProvider>
    <Guard
      require={[
        "s1_integralsOk",
        "s1_identityOk",
        "s2_productOk",
        "s2_conditionOk",
        "s3_confirmed",
        "s4_catalystOk",
        "s4_persistentOk",
      ]}
    >
      <BasicShell title="Exploration" subtitle="Final lock • Repository gate">
        <div className="space-y-5">
          <div
            className={`rounded-xl border border-slate-900/10 bg-white/35 p-4 transition-all duration-700 ${
              justUnlocked ? "opacity-80" : "opacity-100"
            }`}
          >
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
          </div>

          <Folio label="GATE" title="Final key" note="Enter the final key. Formatting is ignored.">
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Entry 1</label>
                  <input
                    className="w-full rounded-xl border border-slate-900/15 bg-white/60 px-4 py-3 text-center text-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/35"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    placeholder="—"
                    inputMode="text"
                    autoCapitalize="characters"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Entry 2</label>
                  <input
                    className="w-full rounded-xl border border-slate-900/15 bg-white/60 px-4 py-3 text-center text-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/35"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    placeholder="—"
                    inputMode="text"
                    autoCapitalize="characters"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Entry 3</label>
                  <input
                    className="w-full rounded-xl border border-slate-900/15 bg-white/60 px-4 py-3 text-center text-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/35"
                    value={c}
                    onChange={(e) => setC(e.target.value)}
                    placeholder="—"
                    inputMode="text"
                    autoCapitalize="characters"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Entry 4</label>
                  <input
                    className="w-full rounded-xl border border-slate-900/15 bg-white/60 px-4 py-3 text-center text-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/35"
                    value={d}
                    onChange={(e) => setD(e.target.value)}
                    placeholder="—"
                    inputMode="text"
                    autoCapitalize="characters"
                  />
                </div>
              </div>

              {!hintsUnlocked ? (
                <div className="rounded-xl border border-slate-900/10 bg-white/40 p-3">
                  <div className="text-[11px] text-slate-700/70">Hint locked</div>
                  <div className="text-sm leading-relaxed text-slate-800">
                    Host verification required to view any hint for this gate.
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <div className="text-xs font-semibold text-emerald-800 mb-1">Hint unlocked:</div>
                  <div className="text-sm leading-relaxed text-slate-800">
                    Which molecular formula fits an aromatic record with eight carbons, eight hydrogens, and no heteroatoms?
                  </div>
                </div>
              )}

              {isDevMode() ? (
                <div className="text-[11px] text-amber-800/80">(Dev mode enabled)</div>
              ) : null}

              <Button variant="primary" className="w-full" disabled={!ready || !ok} onClick={unlock}>
                {!done
                  ? "Loading record…"
                  : !ready
                  ? "Sealing certification…"
                  : ok
                  ? "Unlock repository"
                  : "Key mismatch"}
              </Button>

              {!ok && (a || b || c || d) && (
                <div className="rounded-lg border border-slate-900/10 bg-white/50 p-3">
                  <div className="text-xs font-medium text-slate-800">NOT VERIFIED</div>
                  <div className="text-xs text-slate-700/70 mt-1">
                    Re-check the key. Hyphens and spaces are ignored.
                  </div>
                </div>
              )}
            </div>
          </Folio>
        </div>
      </BasicShell>
    </Guard>
    </SessionSyncProvider>
  );
}
