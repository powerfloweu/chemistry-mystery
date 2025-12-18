"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BasicShell } from "@/components/Guard";
import Folio from "@/components/ui/Folio";
import { Button } from "@/components/ui/Button";
import { setField, isDevMode, readState } from "@/lib/gameStore";
import { SessionSyncProvider } from "@/components/SessionSyncProvider";

function useTypewriter(
  lines: string[],
  enabled: boolean,
  speedMs = 18,
  pauseMs = 420
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

export default function Station1() {
  const router = useRouter();

  const [boot, setBoot] = useState(true);
  const [answer, setAnswer] = useState("");
  const [verified, setVerified] = useState(false);
  const [syncTrigger, setSyncTrigger] = useState(0);
  
  // Re-read state whenever sync triggers or component mounts
  const state = useMemo(() => readState(), [syncTrigger]);
  const hintsUnlocked = !!state.hints_s1_unlocked;
  
  // Listen for session sync events
  useEffect(() => {
    const handleSync = () => {
      setSyncTrigger(prev => prev + 1);
    };
    window.addEventListener('sessionSync', handleSync);
    return () => window.removeEventListener('sessionSync', handleSync);
  }, []);

  const lines = useMemo(
    () => [
      "ENTRY 01 — SAMPLE REGISTRATION",
      "Module: ¹H NMR (400 MHz, CDCl₃)",
      "Objective: confirm Sample B identity via spectral fingerprint",
      "Note: structural drawings removed from the archive copy.",
      "Method: read invariant features; ignore noise; do not overfit.",
      "Proceed to field protocol.",
    ],
    []
  );

  const { out, done } = useTypewriter(lines, boot);

  // If dev mode is active, auto-verify to allow proceeding without entering input.
  useEffect(() => {
    try {
      if (isDevMode()) {
        setVerified(true);
      }
    } catch {}
  }, []);

  // --- Answer logic (hard mode): require a multi-constraint fingerprint.
  // The user must provide a *structured* archive key that encodes:
  // 1) para-disubstituted aromatic ring (explicit)
  // 2) A2B2 / two aromatic sets / 4H aromatic pattern (explicit)
  // 3) methyl (CH3) present (explicit)
  // Optional (bonus but not required): mention ~2.2–2.5 ppm for methyl.
  const normalized = answer.trim().toLowerCase();
  const compact = normalized.replace(/\s+/g, " ");

  const hasPara = compact.includes("para") || compact.includes("p-") || compact.includes("p ");
  const hasDisub =
    compact.includes("disub") ||
    compact.includes("disubstit") ||
    compact.includes("di-sub") ||
    compact.includes("di sub");

  const hasAromatic =
    compact.includes("aromatic") ||
    compact.includes("benzene") ||
    compact.includes("phenyl") ||
    compact.includes("aryl") ||
    compact.includes("ar");

  const hasMethyl = compact.includes("methyl") || compact.includes("ch3") || compact.includes("me");

  // Aromatic pattern requirement: accept any of these explicit fingerprints.
  const hasA2B2 = compact.includes("a2b2") || compact.includes("a₂b₂");
  const hasTwoSets = compact.includes("two") && (compact.includes("doublet") || compact.includes("sets") || compact.includes("signals"));
  const hasAromatic4H = compact.includes("4h") && (compact.includes("aromatic") || compact.includes("aryl") || compact.includes("phenyl") || compact.includes("benzene"));

  // Strict: para + disubstituted + aromatic + (A2B2 OR (two sets) OR (4H aromatic)) + methyl
  const isCorrect = hasPara && hasDisub && hasAromatic && (hasA2B2 || hasTwoSets || hasAromatic4H) && hasMethyl;

  // Dev test input
  const isTestInput = normalized === "dev" || normalized === "test";

  const handleCheck = () => {
    // Always capture the attempt, even if incomplete/wrong
    (setField as unknown as (k: string, v: unknown) => void)(
      "station1_attempt",
      {
        archiveKey: answer.trim(),
        constraints: {
          para: hasPara,
          disubstituted: hasDisub,
          aromatic: hasAromatic,
          a2b2_or_equiv: hasA2B2 || hasTwoSets || hasAromatic4H,
          methyl: hasMethyl,
        },
        correct: isCorrect,
        ts: Date.now(),
      }
    );

    if (!isCorrect && !isTestInput) return;
    setVerified(true);

    // Store successful completion
    (setField as unknown as (k: string, v: unknown) => void)(
      "station1_nmr_fingerprint",
      {
        archiveKey: answer.trim(),
        constraints: {
          para: hasPara,
          disubstituted: hasDisub,
          aromatic: hasAromatic,
          a2b2_or_equiv: hasA2B2 || hasTwoSets || hasAromatic4H,
          methyl: hasMethyl,
        },
        ts: Date.now(),
      }
    );
  };

  return (
    <SessionSyncProvider>
      <BasicShell
        title="NMR"
        subtitle="Field Notes Interface — Station 1"
      >
        <div className="space-y-6">
        {/* --- Boot / Typewriter --- */}
        <Folio
          label="ARCHIVE BOOT"
          title="Recovered System Log"
          note="Read-only. Output is intentionally minimal."
        >
          <div className="font-mono text-[13px] leading-relaxed text-slate-900">
            {out.map((l, i) => (
              <div key={i} className="whitespace-pre-wrap">
                <span className="text-emerald-900/70 mr-2">▸</span>
                {l}
                {i === out.length - 1 && !done ? (
                  <span className="inline-block w-[8px] ml-1 animate-pulse">
                    ▍
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </Folio>

        {/* --- Why NMR (the "this used to look good" block) --- */}
        <Folio
          label="WHY NMR"
          title="Why this instrument survives bad evidence"
          note="The archive does not trust stories. It trusts ratios."
        >
          <div className="space-y-3 text-sm leading-relaxed text-slate-800">
            <p>
              Structural identity cannot be inferred from a formula alone.
              <span className="font-medium"> ¹H NMR counts hydrogens</span>
              <span> and reports their chemical environments.</span>
            </p>
            <p>
              When archival samples degrade, the spectrum gets messy:
              baseline drift, extra peaks, solvent artifacts.
              <span className="font-medium"> The fingerprint still persists</span>
              in the regions that remain readable.
            </p>
            <p className="font-medium">
              Your job is not to name the compound. Your job is to name the
              constraint it proves.
            </p>
          </div>
        </Folio>

        {/* --- Protocol --- */}
        <Folio
          label="FIELD PROTOCOL"
          title="Station 1 — ¹H NMR Fingerprint"
          note="Ignore splitting. Focus on pattern and invariants."
        >
          <div className="space-y-4 text-sm leading-relaxed text-slate-800">
            <div className="rounded-lg border border-slate-900/10 bg-white/50 p-3">
              <div className="text-xs font-semibold tracking-widest text-slate-700">
                PROCEDURE
              </div>
              <ol className="mt-2 list-decimal pl-5">
                <li>
                  Treat the spectrum as a crime scene photo: don’t embellish.
                </li>
                <li>
                  Identify the <span className="font-medium">aromatic symmetry</span>: does it collapse into
                  <span className="font-medium"> two equivalent aromatic sets</span>?
                </li>
                <li>
                  Study the integration pattern and determine what structure fits.
                </li>
                <li>
                  Confirm a <span className="font-medium">methyl (CH₃)</span> signature consistent with a ring substituent.
                  If you can, note the approximate region (~2.2–2.5 ppm).
                </li>
                <li>
                  Write a structured archive key that encodes all constraints in one line.
                </li>
              </ol>
            </div>
          </div>
        </Folio>

        {/* --- NMR spectrum --- */}
        <div className="space-y-2">
          <img
            src="/images/nmr_parchment.png"
            alt="¹H NMR spectrum"
            className="rounded-lg border border-slate-900/10 bg-white shadow-md"
          />
          <p className="text-xs text-slate-600">
            ¹H NMR (400 MHz, CDCl₃) — archive copy
          </p>
        </div>

        {/* --- Task / Input --- */}
        <Folio
          label="INTERPRETATION"
          title="Register the fingerprint"
          note="One phrase. No mechanism. No structure drawing."
        >
          <div className="space-y-4 text-sm leading-relaxed text-slate-800">
            <p>
              This station is not asking you to “solve” the spectrum.
              It is asking you to certify a single, durable claim:
            </p>
            {isDevMode() && (
              <p className="text-[11px] text-amber-800/80">(Dev mode enabled)</p>
            )}

            <div className="rounded-lg border border-slate-900/10 bg-white/50 p-3">
              <div className="text-xs font-semibold tracking-widest text-slate-700">
                REQUIRED CLAIM
              </div>
              <p className="mt-2">
                Provide a fingerprint statement that simultaneously encodes:
                <span className="font-medium"> the substitution symmetry</span> of the aromatic ring,
                <span className="font-medium"> the number of dominant aromatic sets</span>,
                and <span className="font-medium"> the presence of a small alkyl signature</span> consistent with a substituent.
              </p>
            </div>

            <div className="pt-1">
              {!hintsUnlocked ? (
                <div className="rounded-lg border border-slate-900/10 bg-white/45 p-3 text-xs text-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Hint locked</span>
                  <span className="text-[11px] text-slate-600">Host verification required to view hints.</span>
                </div>
              ) : (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-slate-700">
                  <span className="font-semibold text-emerald-800 block mb-1">Hint unlocked:</span>
                  Start with the aromatic region: ask whether it collapses into a small number of repeated patterns.
                  Then scan the aliphatic region for a compact group signal that could belong to a substituent.
                  Write your key as a short, pattern-based sentence.
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-slate-700">
                Archive Key
              </label>
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder='e.g. "aromatic symmetry + aromatic sets + small alkyl"'
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                disabled={verified}
              />

              {!verified && answer.length > 0 && !isCorrect && (
                <p className="text-xs text-slate-600 pt-1">
                  Incomplete archive key. One or more required constraints are missing.
                  Keep it short and pattern-based.
                </p>
              )}

              {verified && (
                <p className="text-sm font-medium text-emerald-800 pt-2">
                  ARCHIVE NOTE — VERIFIED
                  <br />
                  Fingerprint registered: aromatic symmetry + dominant sets + substituent signature.
                </p>
              )}
            </div>
          </div>
        </Folio>

        {/* --- Controls --- */}
        <div className="flex gap-3">
          {!verified ? (
            <Button
              variant="primary"
              onClick={handleCheck}
              disabled={!answer.trim().length}
              title="Register your conclusion"
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                setField("token1", "C");
                setField("s1_integralsOk", true);
                setField("s1_identityOk", true);
                router.push("/station2");
              }}
              title="Proceed"
            >
              Proceed to Station 2
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => {
              setAnswer("");
              setVerified(false);
              setBoot(true);
            }}
            title="Reset this station"
          >
            Reset
          </Button>
        </div>
      </div>
      </BasicShell>
    </SessionSyncProvider>
  );
}