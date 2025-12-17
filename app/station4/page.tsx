"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "../../components/Guard";
import { validateCatalyst } from "../../lib/validate";
import { setToken, setField, isDevMode, readState } from "@/lib/gameStore";
import { ROUTES } from "../../lib/routes";
import { StoryCard } from "../../components/ui/StoryCard";
import { LogLine } from "../../components/ui/LogLine";
import { Button } from "../../components/ui/Button";

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

export default function Station4Catalyst() {
  const router = useRouter();
  const [ans, setAns] = useState("");
  const state = useMemo(() => readState(), []);
  const hintsUnlocked = !!state.hints_s4_unlocked;
  const ok = useMemo(() => validateCatalyst(ans), [ans]);

  const lines = useMemo(
    () => [
      "ENTRY 04 // MECHANISTIC RESOLUTION",
      "A durable outcome still requires an invisible architecture.",
      "Identify the species that participates in multiple elementary steps but cancels from the net equation.",
    ],
    []
  );
  const { out: introOut, done: introDone } = useTypewriter(lines, true);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  useEffect(() => {
    if (!introDone) {
      setReadyToSubmit(false);
      setJustUnlocked(false);
      return;
    }

    // Short “seal sets” delay after the record finishes loading.
    setJustUnlocked(true);
    const t1 = setTimeout(() => setReadyToSubmit(true), 900);
    const t2 = setTimeout(() => setJustUnlocked(false), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [introDone]);

  // Dev mode: prefill and enable submission
  useEffect(() => {
    try {
      if (isDevMode()) {
        setAns("dev");
        setReadyToSubmit(true);
      }
    } catch {}
  }, []);

  const submit = () => {
    // Always capture the attempt
    (setField as unknown as (k: string, v: unknown) => void)(
      "station4_attempt",
      {
        input: ans.trim(),
        correct: ok,
        ts: Date.now(),
      }
    );

    if (!readyToSubmit) return;
    
    // Only proceed to next page if answer is correct
    if (!ok) return;
    
    setToken("token3", "H");
    setField("s4_catalystOk", true);
    setField("s4_persistentOk", true);
    (setField as unknown as (k: string, v: unknown) => void)(
      "station4_catalyst",
      {
        input: ans.trim(),
        ts: Date.now(),
      }
    );
    router.push(ROUTES.debrief);
  };

  return (
    <Guard require={["token1", "token2"]}>
      <BasicShell title="Exploration" subtitle="Station 4 • Mechanistic Resolution">
        <div className="space-y-4">
          <div
            className={`rounded-xl border border-slate-900/10 bg-white/35 p-4 transition-all duration-700 ${
              justUnlocked ? "opacity-80" : "opacity-100"
            }`}
          >
            <div className="font-mono text-[13px] leading-relaxed text-slate-900">
              {introOut.map((l, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  <span className="text-emerald-900/70 mr-2">▸</span>
                  {l}
                  {i === introOut.length - 1 && !introDone ? (
                    <span className="inline-block w-[8px] ml-1 animate-pulse">▍</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-900/10 bg-white/35 p-4">
            <div className="space-y-2 text-sm leading-relaxed text-slate-800">
              <p className="font-medium">Catalysis: presence without ownership</p>
              <p>
                Some species participate in a mechanism yet vanish from the net equation. They enter, change what is
                possible, and leave without being consumed overall.
              </p>
              <p>
                A catalyst is identified by bookkeeping: it appears within elementary steps and is regenerated, leaving
                stoichiometry unchanged.
              </p>
            </div>
          </div>

          <StoryCard
            title="Station 4 — Mechanistic Resolution"
            objective="From the mechanism excerpt, identify the species that is returned unchanged and therefore cancels from the net equation. Enter that species only."
            why="Catalysts are the hidden architecture of efficient transformations. Mechanistic accuracy requires identifying what influences the pathway without consuming itself."
            procedure={[
              "Examine the complete reaction mechanism (all elementary steps).",
              "For each species appearing in any intermediate: does it reappear unchanged in a later step?",
              "If yes → catalyst. If no → reagent or solvent. Enter only the catalyst.",
            ]}
          >
            <div className="space-y-4">
             <div className="rounded-xl border border-slate-900/10 bg-white/35 p-3">
  <div className="text-xs text-slate-700/70 mb-2">Mechanism excerpt (acid-catalyzed, catalyst cancels in net equation)</div>
  <div className="w-full overflow-x-auto">
    <svg viewBox="0 0 980 220" className="min-w-[920px] h-[220px]">
      {/* background grid feel */}
      <defs>
        <pattern id="g" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0H0V22" fill="none" stroke="rgba(15,23,42,0.06)" strokeWidth="1" />
        </pattern>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(15,23,42,0.6)" />
        </marker>
      </defs>
      <rect x="0" y="0" width="980" height="220" fill="url(#g)" />

      {/* Step boxes */}
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="rgba(15,23,42,0.9)">
        <text x="24" y="28" fontSize="14">Step 1</text>
        <rect x="18" y="40" width="300" height="68" rx="12" fill="rgba(255,255,255,0.55)" stroke="rgba(15,23,42,0.12)" />
        <text x="34" y="70" fontSize="14">Carbonyl + (acid)  →  activated</text>
        <text x="34" y="92" fontSize="13" fill="rgba(15,23,42,0.7)">protonation (reversible)</text>

        <text x="346" y="28" fontSize="14">Step 2</text>
        <rect x="340" y="40" width="300" height="68" rx="12" fill="rgba(255,255,255,0.55)" stroke="rgba(15,23,42,0.12)" />
        <text x="356" y="70" fontSize="14">Nu: attacks  →  intermediate</text>
        <text x="356" y="92" fontSize="13" fill="rgba(15,23,42,0.7)">bond formation</text>

        <text x="668" y="28" fontSize="14">Step 3</text>
        <rect x="662" y="40" width="300" height="68" rx="12" fill="rgba(255,255,255,0.55)" stroke="rgba(15,23,42,0.12)" />
        <text x="678" y="70" fontSize="14">Deprotonation  →  product + regenerated species</text>
        <text x="678" y="92" fontSize="13" fill="rgba(15,23,42,0.7)">catalyst regenerated</text>
      </g>

      {/* arrows */}
      <line x1="320" y1="74" x2="340" y2="74" stroke="rgba(15,23,42,0.6)" strokeWidth="2" markerEnd="url(#arr)" />
      <line x1="642" y1="74" x2="662" y2="74" stroke="rgba(15,23,42,0.6)" strokeWidth="2" markerEnd="url(#arr)" />

      {/* bookkeeping note */}
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
        <rect x="18" y="132" width="944" height="70" rx="14" fill="rgba(255,255,255,0.45)" stroke="rgba(15,23,42,0.10)" />
        <text x="34" y="162" fontSize="13" fill="rgba(15,23,42,0.85)">Bookkeeping test:</text>
        <text x="190" y="162" fontSize="13" fill="rgba(15,23,42,0.75)">species appears early and late, cancels from the net equation</text>
      </g>
    </svg>
  </div>
  <div className="mt-2 text-[11px] text-slate-700/65">
    Instruction: enter the species that is present in the mechanism yet absent from the net reaction.
  </div>
</div>

              <input
                value={ans}
                onChange={(e) => setAns(e.target.value)}
                placeholder="Enter species (formula/charge preferred)"
                className="w-full rounded-xl border border-slate-900/15 bg-white/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/35"
              />
              <p className="text-[11px] text-slate-700/65">
                Use a chemical species. Names like "catalyst" may be rejected.
              </p>
              {isDevMode() && (
                <p className="text-[11px] text-amber-800/80">(Dev mode enabled)</p>
              )}

              <Button variant="primary" onClick={submit} disabled={!readyToSubmit || !ans.trim()}>
                {!introDone
                  ? "Loading record…"
                  : !readyToSubmit
                  ? "Sealing certification…"
                  : ok
                  ? "Confirm Catalyst"
                  : "Submit Attempt"}
              </Button>
            </div>
          </StoryCard>

          {!hintsUnlocked ? (
            <div className="rounded-xl border border-slate-900/10 bg-white/40 p-3 text-sm text-slate-800">
              <div className="text-xs font-semibold text-slate-700 mb-1">Hint locked</div>
              Host verification required to view any hints for this station.
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-slate-800">
              <div className="text-xs font-semibold text-emerald-800 mb-1">Hint unlocked:</div>
              Look for a species that is used and later returned. If it cancels in the net equation, it is a catalyst.
            </div>
          )}
        </div>
      </BasicShell>
    </Guard>
  );
}
