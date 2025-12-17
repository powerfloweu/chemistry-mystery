"use client";

import { Guard, BasicShell } from "@/components/Guard";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setField, isDevMode } from "@/lib/gameStore";
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

export default function HeatTrial() {
  const router = useRouter();
  const [certified, setCertified] = useState(false);
  const [error, setError] = useState(false);

  const lines = useMemo(
    () => [
      "FIELD SITE 1 // HEAT",
      "Elevated temperature increases access to higher-energy states.",
      "Certify the outcome that persists under sustained heat.",
    ],
    []
  );
  const { out } = useTypewriter(lines, true);

  // Dev mode: auto-certify and redirect immediately
  useEffect(() => {
    if (isDevMode()) {
      setField("s3_heat", true);
      const timer = setTimeout(() => router.push("/station3"), 200);
      return () => clearTimeout(timer);
    }
  }, [router]);

  const handleChoice = (choice: "thermodynamic" | "kinetic") => {
    if (certified) return;
    setError(false);

      // Dev mode test input: accept "dev" or "test" as bypass
      const inputLower = choice.toLowerCase();
      const isTestInput = inputLower === "dev" || inputLower === "test";

      if (choice === "thermodynamic" || isTestInput) {
      setCertified(true);
      setField("s3_heat", true);
    } else {
      setError(true);
    }
  };

  const returnToHub = () => {
    router.push("/station3");
  };

  return (
    <Guard require={["token1", "token2"]}>
      <BasicShell title="Exploration" subtitle="Station 3 • Field Verification">
        <div className="space-y-6">
          {/* Typewriter */}
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

          {/* Question */}
          {!certified && (
            <Folio
              label="PERTURBATION"
              title="Temperature increased"
              note="Choose the outcome favored after equilibration."
            >
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-slate-800">
                  Under sustained heating, which outcome dominates at equilibrium?
                </p>
                {isDevMode() && (
                  <p className="text-[11px] text-amber-800/80">(Dev mode enabled)</p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleChoice("thermodynamic")}
                    className="w-full"
                  >
                    Thermodynamic product
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleChoice("kinetic")}
                    className="w-full"
                  >
                    Kinetic product
                  </Button>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-white/50 border border-slate-900/10">
                    <p className="text-xs font-medium text-slate-800">
                      NOT CERTIFIED — try again.
                    </p>
                  </div>
                )}
              </div>
            </Folio>
          )}

          {/* Certified */}
          {certified && (
            <Folio
              label="VERIFICATION"
              title="Certification recorded"
              note="Return to the Station 3 hub."
            >
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-white/50 border border-slate-900/10">
                  <p className="text-sm font-medium text-emerald-800">
                    FIELD SITE 1 — CERTIFIED
                  </p>
                  <p className="text-xs text-slate-700/70 mt-1">
                    Heat verification complete. Return to the Station 3 hub.
                  </p>
                </div>

                <Button variant="primary" onClick={returnToHub} className="w-full">
                  Return to Station 3 hub
                </Button>
              </div>
            </Folio>
          )}
        </div>
      </BasicShell>
    </Guard>
  );
}
