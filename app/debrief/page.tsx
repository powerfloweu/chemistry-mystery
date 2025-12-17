"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BasicShell } from "@/components/Guard";
import Folio from "@/components/ui/Folio";
import { Button } from "@/components/ui/Button";
import { readState, setField } from "@/lib/gameStore";
import { ROUTES } from "@/lib/routes";

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

function routeFinalLock(): string {
  const r: any = ROUTES as any;
  return r.finalLock || r.final_lock || r.lock || "/final-lock";
}

export default function DebriefPage() {
  const router = useRouter();
  const st = useMemo(() => readState(), []);

  const player = (st.playerName || "Researcher").toString();
  const token1 = (st.token1 || "").toString();
  const token2 = (st.token2 || "").toString();
  const token3 = (st.token3 || "").toString();

  const lines = useMemo(
    () => [
      "DEBRIEF // ARCHIVE CONSOLIDATION",
      `Investigator: ${player}`,
      "Status: Internal consistency confirmed across orthogonal tests.",
      "Preparing final access gate…",
    ],
    [player]
  );

  const { out, done } = useTypewriter(lines, true);

  const [ready, setReady] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  // micro-delay (“seal sets”) after typewriter completes
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

  const proceed = () => {
    if (!ready) return;
    setField("debriefSeen", true);
    router.push(routeFinalLock());
  };

  const summary = useMemo(
    () => [
      {
        k: "Station 1 — NMR",
        v: "Signal pattern indicates a constrained identity consistent with a symmetric aromatic environment.",
      },
      {
        k: "Station 2 — Energetics",
        v: "Barrier heights separate formation rate from stability; equilibrium selects the lower-energy basin.",
      },
      {
        k: "Station 3 — Perturbation",
        v: "Heat, pressure, and stoichiometric excess converge on a single robust outcome.",
      },
      {
        k: "Station 4 — Mechanism",
        v: "A species participates yet cancels from the net equation: acceleration without ownership.",
      },
    ],
    []
  );

  return (
    <BasicShell title="Exploration" subtitle="Debrief • Consolidated record">
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

        <Folio
          label="SUMMARY"
          title="What the record now supports"
          note="Each station tested a different axis. Agreement is the point."
        >
          <div className="space-y-3">
            {summary.map((row) => (
              <div key={row.k} className="rounded-xl border border-slate-900/10 bg-white/40 p-3">
                <div className="text-xs font-medium text-slate-800">{row.k}</div>
                <div className="text-sm leading-relaxed text-slate-800 mt-1">{row.v}</div>
              </div>
            ))}
          </div>
        </Folio>

        <Folio
          label="RESIDUAL"
          title="One variable remains"
          note="Chemistry constrains the pathway. It does not decide intent."
        >
          <div className="space-y-2 text-sm leading-relaxed text-slate-800">
            <p>The archive now satisfies identity, energetics, perturbation robustness, and mechanistic bookkeeping.</p>
            <p>
              No further optimization is possible without introducing a non-chemical variable — one that cannot be
              forced, predicted, or catalyzed.
            </p>
          </div>
        </Folio>

        <div className="rounded-xl border border-slate-900/10 bg-white/35 p-4">
          <div className="text-sm leading-relaxed text-slate-800">
            Final access requires the three-token gate.
            <span className="text-slate-700/70"> Tokens are stored locally on this device.</span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-slate-900/10 bg-white/50 p-2">
              <div className="text-[11px] text-slate-700/70">Token 1</div>
              <div className="font-mono text-sm text-slate-900">{token1 || "—"}</div>
            </div>
            <div className="rounded-lg border border-slate-900/10 bg-white/50 p-2">
              <div className="text-[11px] text-slate-700/70">Token 2</div>
              <div className="font-mono text-sm text-slate-900">{token2 || "—"}</div>
            </div>
            <div className="rounded-lg border border-slate-900/10 bg-white/50 p-2">
              <div className="text-[11px] text-slate-700/70">Token 3</div>
              <div className="font-mono text-sm text-slate-900">{token3 || "—"}</div>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="primary" className="w-full" onClick={proceed} disabled={!ready}>
              {!done ? "Loading record…" : !ready ? "Sealing certification…" : "Proceed to final access"}
            </Button>
          </div>
        </div>
      </div>
    </BasicShell>
  );
}