"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearState, readState, setField, isDevMode } from "@/lib/gameStore";
import { setActiveSession } from "@/lib/sessionGuard";
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

// Invitation gate: waits for host to activate session
function SessionInvitationGate({ session, onReady }: { session: string; onReady: () => void }) {
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let pollInterval: ReturnType<typeof setInterval>;

    const poll = async () => {
      try {
        const res = await fetch(`/api/session/${encodeURIComponent(session)}`);
        if (!res.ok) {
          if (res.status !== 503) {
            setError(`Error: ${res.status}`);
          }
          return;
        }
        const data = await res.json();
        if (data.data?.started === true) {
          // Stop polling as soon as the host activates the session
          if (pollInterval) clearInterval(pollInterval);
          // Store session in sessionStorage for other pages to check
          setActiveSession(session);
          setChecking(false);
          onReady();
        }
      } catch (err) {
        console.warn("Polling failed:", err);
        setError("Connection error");
      }
    };

    poll(); // Poll immediately
    pollInterval = setInterval(poll, 3000);

    return () => clearInterval(pollInterval);
  }, [session, onReady]);

  if (!checking) return null;

  return (
    <BasicShell
      title="Chemistry Mystery"
      subtitle="Invitation"
      description="Secure multi-device protocol"
    >
      <div className="space-y-5 animate-fadeIn">
        <Folio
          label="SESSION"
          title="Awaiting Activation"
          note={`Session: ${session}`}
        >
          <Figure caption="Status">
            <div className="space-y-4 text-center">
              <div className="animate-pulse">
                <p className="text-emerald-900 font-semibold">Waiting for host to activate…</p>
              </div>
              {error && (
                <p className="text-xs text-red-700">{error}</p>
              )}
              <p className="text-xs text-slate-600">
                Your host is preparing the experiment. Please stand by.
              </p>
            </div>
          </Figure>
        </Folio>
      </div>
    </BasicShell>
  );
}

function StartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSession = (searchParams.get("session") || "").trim() || null;
  const [manualSession, setManualSession] = useState("");
  const [session, setSession] = useState<string | null>(urlSession);
  const [gateReady, setGateReady] = useState(false);
  const onGateReady = useCallback(() => setGateReady(true), []);

  // All hooks must be called before any conditional returns
  const existing = useMemo(() => readState().playerName ?? "", []);
  const [name, setName] = useState(existing);
  const [started, setStarted] = useState(false);

  const safeName = (name || "").trim().slice(0, 28);

  const lines = useMemo(() => {
    const who = safeName.length ? safeName : "Researcher";
    return [
      `ACCESS GRANTED`,
      `Chemist: ${who}`,
      `Project: Chemistry Mystery`,
      `Scope: identity -> energetics -> field perturbation -> mechanism`,
      `A protocol surfaced in the Archive, recovered from storage c. 19/12. Its provenance is unknown; its structure suggests deliberate concealment.`,
      `It describes a bond so statistically improbable that its formation requires a specific orbital alignment—one that rarely occurs by chance.`,
      `Verification demands systematic proof: structural identity → thermodynamic persistence → mechanistic catalysis → field reproducibility.`,
      `Your studies in pericyclic reactions qualifies you uniquely to evaluate whether symmetry constraints support or refute the legend.`,
      `Protocol integrity is mandatory.`,
      `Proceed when ready.`,
      `PRESS BEGIN ANALYSIS`,
    ];
  }, [safeName]);

  const { out, done } = useTypewriter(lines, started);

  const handleSessionSubmit = () => {
    const code = manualSession.trim().toUpperCase();
    if (code) {
      setSession(code);
    }
  };

  // Session is required for two-player mode - show input if missing
  if (!session) {
    return (
      <BasicShell
        title="Chemistry Mystery"
        subtitle="Player Entry"
        description="This is a two-player experience"
      >
        <div className="space-y-5 animate-fadeIn">
          <Folio
            label="SESSION"
            title="Enter Session Code"
            note="Your host will provide the code"
          >
            <Figure caption="Two-Player Protocol">
              <div className="space-y-4">
                <p className="text-sm text-slate-700">
                  This experiment requires a session code from your host.
                </p>
                <input
                  value={manualSession}
                  onChange={(e) => setManualSession(e.target.value.toUpperCase())}
                  placeholder="e.g., ABCD1234"
                  className="w-full rounded-2xl border border-slate-900/15 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/35 uppercase"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSessionSubmit();
                  }}
                  autoFocus
                />
                <Button
                  variant="primary"
                  onClick={handleSessionSubmit}
                  disabled={!manualSession.trim()}
                  className="w-full"
                >
                  Join Session
                </Button>
              </div>
            </Figure>
          </Folio>
        </div>
      </BasicShell>
    );
  }

  // If session exists and gate is not ready, show invitation screen
  if (!gateReady) {
    return (
      <SessionInvitationGate
        session={session}
        onReady={onGateReady}
      />
    );
  }

  // Normal game flow (only after activation)
  const begin = () => {
    clearState();
    const entered = safeName.length ? safeName : "Researcher";
    setField("playerName", entered);
    // Dev mode trigger via Scientist Name
    const lower = entered.trim().toLowerCase();
    if (lower === "dev" || lower === "test") {
      setField("devMode", true as unknown as any);
    }
    router.push("/intro");
  };

  return (
    <BasicShell title="Chemistry Mystery" subtitle="You have been invited to solve a" description="A rare type of bond has been reported.">
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
                {isDevMode() && (
                  <p className="mt-2 text-[11px] text-amber-800/80">(Dev mode enabled)</p>
                )}
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

              <Button
                variant="primary"
                onClick={begin}
                disabled={!done}
                title={!done ? "Wait for the record to finish loading" : "Begin"}
                className="w-full"
              >
                Begin Analysis
              </Button>
            </Folio>
          </>
        )}
      </div>
    </BasicShell>
  );
}

export default function StartPage() {
  return (
    <Suspense
      fallback={
        <BasicShell title="Chemistry Mystery" subtitle="Loading..." description="">
          <div className="text-center text-slate-600">Loading…</div>
        </BasicShell>
      }
    >
      <StartContent />
    </Suspense>
  );
}
