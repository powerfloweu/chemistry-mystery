"use client";

import { Guard, BasicShell } from "@/components/Guard";
import Folio from "@/components/ui/Folio";
import { Button } from "@/components/ui/Button";
import { isDevMode, readState } from "@/lib/gameStore";
import { SessionSyncProvider } from "@/components/SessionSyncProvider";
import { ReactionCoordinate } from "@/components/diagrams/ReactionCoordinate";
import { setField } from "@/lib/gameStore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

function useTypewriter(
  lines: string[],
  enabled: boolean,
  speedMs = 18,
  pauseMs = 380
) {
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

export default function Station2Energetics() {
  const router = useRouter();
  const [archiveKey, setArchiveKey] = useState("");
  const [keyVerified, setKeyVerified] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [syncTrigger, setSyncTrigger] = useState(0);
  
  // Re-read state whenever sync triggers or component mounts
  const state = useMemo(() => readState(), [syncTrigger]);
  const hintsUnlocked = !!state.hints_s2_unlocked;
  
  // Listen for session sync events
  useEffect(() => {
    const handleSync = () => {
      setSyncTrigger(prev => prev + 1);
    };
    window.addEventListener('sessionSync', handleSync);
    return () => window.removeEventListener('sessionSync', handleSync);
  }, []);

  const introLines = useMemo(
    () => [
      "ENTRY 02 // ENERGETICS",
      "Recovered record indicates two protocols and divergent endpoints.",
      "One product appears first (low barrier) and can be trapped.",
      "One product survives equilibration (lower ΔG°).",
      "CERTIFY THE DURABLE OUTCOME.",
      "Compute the ratio and register the key.",
    ],
    []
  );

  const { out: introOut, done: introDone } = useTypewriter(introLines, true);

  // Dev mode: auto-verify (no auto-navigation)
  useEffect(() => {
    try {
      if (isDevMode() && !keyVerified) {
        setArchiveKey((prev) => (prev ? prev : "DEV"));
        setKeyVerified(true);
        setField("token2", "8");
        setField("s2_productOk", true);
        setField("s2_conditionOk", true);
      }
    } catch {}
  }, [keyVerified]);

  const validateArchiveKey = () => {
    const normalized = archiveKey.trim().toUpperCase();
    setKeyError(null);

      // Dev mode test input bypass
      const isTestInput = normalized === "DEV" || normalized === "TEST";

    // Parse the attempt for tracking
    const hasAK_attempt = /\bA\s*[:\/-]?\s*K\b/.test(normalized) || /\bA\s+K\b/.test(normalized);
    const hasBT_attempt = /\bB\s*[:\/-]?\s*T\b/.test(normalized) || /\bB\s+T\b/.test(normalized);
    const ratioAfterLabel_attempt = normalized.match(/RATIO[^0-9]{0,10}(\d{1,3})/);
    const anyInt_attempt = normalized.match(/\b(\d{1,3})\b/);
    const ratioStr_attempt = (ratioAfterLabel_attempt?.[1] ?? anyInt_attempt?.[1]) ?? null;
    const ratio_attempt = ratioStr_attempt ? parseInt(ratioStr_attempt, 10) : null;
    const isCorrect_attempt = hasAK_attempt && hasBT_attempt && ratio_attempt !== null && ratio_attempt >= 20 && ratio_attempt <= 35;

    // Always capture the attempt
    (setField as unknown as (k: string, v: unknown) => void)(
      "station2_attempt",
      {
        input: archiveKey.trim(),
        parsed: {
          hasAK: hasAK_attempt,
          hasBT: hasBT_attempt,
          ratio: ratio_attempt,
        },
        correct: isCorrect_attempt,
        ts: Date.now(),
      }
    );

    // Looser parsing: accept multiple separators / spacing variants.
    // We only require that the key communicates:
    //  - an A:K (A/K, A-K, A K) kinetic reference
    //  - a B:T (B/T, B-T, B T) thermodynamic reference
    //  - a ratio number (20–35) somewhere after an optional "ratio" label

    const hasAK = /\bA\s*[:\/-]?\s*K\b/.test(normalized) || /\bA\s+K\b/.test(normalized);
    const hasBT = /\bB\s*[:\/-]?\s*T\b/.test(normalized) || /\bB\s+T\b/.test(normalized);

    // Prefer a number that appears after the word "RATIO" if present; otherwise take the first integer.
    const ratioAfterLabel = normalized.match(/RATIO[^0-9]{0,10}(\d{1,3})/);
    const anyInt = normalized.match(/\b(\d{1,3})\b/);
    const ratioStr = (ratioAfterLabel?.[1] ?? anyInt?.[1]) ?? null;

    if (!hasAK || !hasBT || !ratioStr) {
        if (!isTestInput) {
          setKeyError(
        "Key format not recognized. Include A:K (kinetic), B:T (thermodynamic), and a ratio number (20–35). Example: A:K ratio~25 | B:T"
      );
          return;
        }
    }

    const ratio = ratioStr ? parseInt(ratioStr, 10) : 0;
    if (!Number.isFinite(ratio) || ratio < 20 || ratio > 35) {
        if (!isTestInput) {
          setKeyError(
        "Ratio outside acceptable range. Use an integer between 20 and 35 (e.g., 25)."
      );
          return;
        }
    }

    // Correct! Set state and proceed
    setKeyVerified(true);
    setField("token2", "8");
    setField("s2_productOk", true);
    setField("s2_conditionOk", true);
    (setField as unknown as (k: string, v: unknown) => void)(
      "station2_energetics",
      {
        input: archiveKey.trim(),
        ratio: ratio,
        ts: Date.now(),
      }
    );

    // Auto-advance only outside dev mode
    if (!isDevMode()) {
      setTimeout(() => {
        router.push("/station3");
      }, 650);
    }
  };

  return (
    <SessionSyncProvider>
    <Guard require={["token1"]}>
      <BasicShell
        title="Energetics"
        subtitle="Entry 02 • Reaction Coordinate & Stability"
      >
            <div className="space-y-4">
          {/* Overview */}
          <Folio
            label="OBSERVATION"
            title="Recovered outcome summary"
            note="Two protocols. Divergent endpoints."
          >
            <div className="space-y-4">
              {isDevMode() && (
                <p className="text-[11px] text-amber-800/80">(Dev mode enabled)</p>
              )}
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

              <div className="rounded-xl border border-slate-900/10 bg-white/35 p-4">
                <p className="text-sm leading-relaxed text-slate-800">
                  <span className="font-semibold">Question:</span> Under conditions open to equilibration, which product is expected to dominate permanently?
                </p>
              </div>
            </div>
          </Folio>

          {/* Reaction Coordinate Diagram */}
          <Folio
            label="DIAGRAM"
            title="Reaction coordinate"
            note="Read ΔG‡ (barriers) and ΔG° (stability)."
          >
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-slate-800">
                Reaction Coordinate: kinetic vs. thermodynamic pathways
              </p>
              <div className="flex justify-center w-full overflow-x-auto">
                <div className="min-w-[560px]">
                  <ReactionCoordinate />
                </div>
              </div>
              <p className="text-xs text-slate-700/70">
                Read the labeled barriers (ΔG‡) and product stabilities (ΔG°). Use them to encode your key.
              </p>
            </div>
          </Folio>

          {/* Protocol A */}
          <Folio
            label="PROTOCOL A"
            title="Low-temperature quench"
            note="Kinetic control"
          >
            <div className="space-y-3 text-sm leading-relaxed text-slate-800">
              <p className="font-medium">Protocol A conditions</p>
              <div className="rounded-xl border border-slate-900/10 bg-white/35 p-3">
                <div className="text-xs font-medium text-slate-700">Conditions</div>
                <div className="mt-1 font-mono text-xs text-slate-900">
                  0°C, 10 minutes, rapid quench to −78°C
                </div>
              </div>
              <p>
                At low temperature, the kinetic product forms preferentially. The system is "frozen" before it can traverse the higher activation barrier. The faster pathway dominates. Once trapped at low temperature, this product persists due to kinetic barriers preventing rearrangement.
              </p>
              <div className="rounded-xl border border-slate-900/10 bg-white/35 p-3">
                <div className="text-xs font-medium text-slate-700">Key values</div>
                <div className="mt-1 text-xs text-slate-800">
                  ΔG‡<sub>kinetic</sub> = 68 kJ/mol · ΔG° = −2 kJ/mol
                </div>
              </div>
            </div>
          </Folio>

          {/* Protocol B */}
          <Folio
            label="PROTOCOL B"
            title="Thermal equilibration"
            note="Thermodynamic control"
          >
            <div className="space-y-3 text-sm leading-relaxed text-slate-800">
              <p className="font-medium">Protocol B conditions</p>
              <div className="rounded-xl border border-slate-900/10 bg-white/35 p-3">
                <div className="text-xs font-medium text-slate-700">Conditions</div>
                <div className="mt-1 font-mono text-xs text-slate-900">
                  298 K, 12 hours, open to reversible equilibration
                </div>
              </div>
              <p>
                At room temperature with extended time, the system overcomes both activation barriers. Molecules continuously interconvert. The lower-energy product accumulates and dominates. Thermodynamic control prevails: only the most stable species survives indefinitely.
              </p>
              <div className="rounded-xl border border-slate-900/10 bg-white/35 p-3">
                <div className="text-xs font-medium text-slate-700">Key values</div>
                <div className="mt-1 text-xs text-slate-800">
                  ΔG‡<sub>thermodynamic</sub> = 76 kJ/mol · ΔG° = −14 kJ/mol
                </div>
              </div>
            </div>
          </Folio>

          {/* Archive Note */}
          <Folio
            label="ARCHIVAL PRINCIPLE"
            title="Interpretation rule"
            note="Barriers decide timing; ΔG° decides survival."
          >
            <div className="space-y-3 text-sm leading-relaxed text-slate-800">
              <p>
                Under <span className="font-semibold">irreversible conditions</span> (rapid quench, low temperature), kinetic barriers dominate. The fastest pathway wins, regardless of final stability. The product forms and becomes trapped—persistent only because the system lacks energy to rearrange.
              </p>
              <p>
                Under <span className="font-semibold">reversible conditions</span> (thermal equilibrium, extended time), the system explores all pathways continuously. Activation barriers matter only for timing; free energy (ΔG°) determines which state accumulates. The most stable product survives indefinitely.
              </p>
              <p className="font-medium">
                The archive records permanent states. Only the equilibrium-favored outcome warrants entry.
              </p>
            </div>
          </Folio>

          {/* Selection Prompt */}
          <Folio
            label="ANALYSIS"
            title="Register the key"
            note="One line. Pattern + computed ratio."
          >
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-slate-800">
                Study the diagram and protocols above. Encode your analysis as an archive key:
              </p>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Archive Key
                </label>
                <input
                  value={archiveKey}
                  onChange={(e) => setArchiveKey(e.target.value)}
                  placeholder="A:K ratio~[value] | B:T"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                  disabled={keyVerified}
                />
                {!hintsUnlocked ? (
                  <div className="text-xs text-slate-700/70 rounded-lg border border-slate-900/10 bg-white/40 p-2">
                    Hint locked — host verification required to view guidance.
                  </div>
                ) : (
                  <div className="text-xs text-slate-700 rounded-lg border border-emerald-200 bg-emerald-50 p-2">
                    <span className="font-semibold text-emerald-800">Hint unlocked:</span> Certify the equilibrium outcome and provide a plausible A:K ratio.
                  </div>
                )}
              </div>

              {keyError && (
                <div className="p-3 rounded-lg bg-white/50 border border-slate-900/10">
                  <p className="text-xs font-medium text-slate-800">
                    {keyError}
                  </p>
                </div>
              )}

              {keyVerified && (
                <div className="p-3 rounded-lg bg-white/50 border border-slate-900/10">
                  <p className="text-xs font-medium text-emerald-800">
                    Archive key accepted. Proceeding…
                  </p>
                </div>
              )}

              <Button
                variant="primary"
                onClick={validateArchiveKey}
                disabled={!archiveKey.trim().length || keyVerified}
                className="w-full"
              >
                {keyVerified ? "Entry confirmed" : "Register key"}
              </Button>

              {keyVerified && (
                <Button
                  variant="primary"
                  onClick={() => router.push("/station3")}
                  className="w-full"
                >
                  Continue to Station 3
                </Button>
              )}
            </div>
          </Folio>
        </div>
      </BasicShell>
    </Guard>
    </SessionSyncProvider>
  );
}
