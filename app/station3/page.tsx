"use client";

import { Guard, BasicShell } from "@/components/Guard";
import { SessionSyncProvider } from "@/components/SessionSyncProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { readState, setField, isDevMode } from "@/lib/gameStore";
import { ROUTES } from "@/lib/routes";
import { LogLine } from "@/components/ui/LogLine";
import { Button } from "@/components/ui/Button";
import Folio from "@/components/ui/Folio";

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

export default function Station3Hub() {
  const router = useRouter();
  const [syncTrigger, setSyncTrigger] = useState(0);
  
  // Re-read state whenever sync triggers or component mounts
  const state = useMemo(() => readState(), [syncTrigger]);

  const lines = useMemo(
    () => [
      "FIELD VERIFICATION PROTOCOL INITIATED",
      "Three perturbations await.",
      "Some require insight. Some require experiment. Sometimes solutions need a change of perspective.",
    ],
    []
  );
  const { out } = useTypewriter(lines, true);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // Listen for session sync events
  useEffect(() => {
    const handleSync = () => {
      setSyncTrigger(prev => prev + 1);
    };
    window.addEventListener('sessionSync', handleSync);
    return () => window.removeEventListener('sessionSync', handleSync);
  }, []);

  // Check status from gameStore
  const heat = !!state.s3_heat;
  const pressure = !!state.s3_pressure;
  const excess = !!state.s3_excess;
  const allVerified = heat && pressure && excess;

  // Dev mode: auto-certify all field sites and enable proceed
  useEffect(() => {
    if (isDevMode()) {
      if (!heat) setField("s3_heat", true);
      if (!pressure) setField("s3_pressure", true);
      if (!excess) setField("s3_excess", true);
    }
  }, [heat, pressure, excess]);

  useEffect(() => {
    if (!allVerified) {
      setReadyToProceed(false);
      setJustCompleted(false);
      return;
    }
    // In dev mode, skip delay and proceed immediately
    if (isDevMode()) {
      setReadyToProceed(true);
      setJustCompleted(false);
      return;
    }
    // When the last certification flips to true, add a short “seal sets” delay.
    setJustCompleted(true);
    const t1 = setTimeout(() => setReadyToProceed(true), 900);
    const t2 = setTimeout(() => setJustCompleted(false), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [allVerified]);

  const proceedToStation4 = () => {
    if (!readyToProceed) return;
    setField("s3_confirmed", true);
    (setField as unknown as (k: string, v: unknown) => void)(
      "station3_field_verification",
      {
        heat: heat,
        pressure: pressure,
        excess: excess,
        ts: Date.now(),
      }
    );
    router.push(ROUTES.s4);
  };

  return (
    <SessionSyncProvider>
      <Guard require={["token1", "token2"]}>
        <BasicShell
          title="Exploration"
          subtitle="Station 3 • Field Verification"
        >
          <div className="space-y-6">
          {/* Catalyst definition */}
          <Folio label="FIELD DEFINITION" title="What is a catalyst?">
            <p className="text-sm text-slate-800 leading-relaxed">
              A catalyst is defined operationally: it participates in elementary steps, lowers the activation barrier by providing an alternative pathway, and is regenerated, leaving the overall stoichiometry and equilibrium unchanged.
            </p>
          </Folio>

          {/* Typewriter intro */}
          <div className="rounded-xl border border-slate-900/10 bg-white/35 p-4">
            <div className="font-mono text-[13px] leading-relaxed text-slate-900">
              {out.map((l, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  <span className="text-emerald-900/70 mr-2">▸</span>
                  {l}
                  {i === out.length - 1 && (out[i] ?? "").length < (lines[i] ?? "").length ? (
                    <span className="inline-block w-[8px] ml-1 animate-pulse">▍</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Status Card */}
          <Folio label="VERIFICATION STATUS">
            <div className="space-y-4">
              <p className="text-sm text-slate-700 mb-3">
                Await host verification of the three field sites.
              </p>
              <div className="space-y-2">
                {/* Heat */}
                <div className="flex items-start justify-between p-3 rounded-lg bg-slate-900/5 border border-slate-900/10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🔥</span>
                      <span className="text-sm font-semibold text-slate-800">Heat field</span>
                    </div>
                    <p className="text-xs text-slate-600 italic pl-6">Under sustained heating, which outcome dominates at equilibrium?</p>
                  </div>
                  <span className="text-lg ml-2">{heat ? "✅" : "○"}</span>
                </div>

                {/* Pressure */}
                <div className="flex items-start justify-between p-3 rounded-lg bg-slate-900/5 border border-slate-900/10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">⚖️</span>
                      <span className="text-sm font-semibold text-slate-800">Pressure field</span>
                    </div>
                    <p className="text-xs text-slate-600 italic pl-6">Under increased pressure, which configuration is favored at equilibrium?</p>
                  </div>
                  <span className="text-lg ml-2">{pressure ? "✅" : "○"}</span>
                </div>

                {/* Excess */}
                <div className="flex items-start justify-between p-3 rounded-lg bg-slate-900/5 border border-slate-900/10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💧</span>
                      <span className="text-sm font-semibold text-slate-800">Excess field</span>
                    </div>
                    <p className="text-xs text-slate-600 italic pl-6">Upon introduction of an excess component, which direction is favored at equilibrium?</p>
                  </div>
                  <span className="text-lg ml-2">{excess ? "✅" : "○"}</span>
                </div>
              </div>

              {allVerified && (
                <div
                  className={`p-3 rounded-lg bg-white/50 border border-slate-900/10 transition-all duration-700 ${
                    justCompleted ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
                  }`}
                >
                  <p className="text-xs font-medium text-emerald-800">
                    All field sites certified. Proceed to next station.
                  </p>
                </div>
              )}

              {!allVerified && (
                <p className="text-xs text-slate-600">
                  Waiting for host verification of all field sites.
                </p>
              )}
            </div>
          </Folio>

          {/* Action */}
          <Button
            variant="primary"
            onClick={proceedToStation4}
            disabled={!readyToProceed}
            className="w-full"
          >
            {readyToProceed
              ? "Continue to Station 4"
              : allVerified
              ? "Sealing certification…"
              : "Verification incomplete"}
          </Button>
        </div>
      </BasicShell>
    </Guard>
    </SessionSyncProvider>
  );
}
