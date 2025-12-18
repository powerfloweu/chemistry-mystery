"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BasicShell } from "@/components/Guard";
import { Button } from "@/components/ui/Button";
import Folio from "@/components/ui/Folio";
import Figure from "@/components/ui/Figure";

interface SessionData {
  started?: boolean;
  s3_heat?: boolean;
  s3_pressure?: boolean;
  s3_excess?: boolean;
  s3_confirmed?: boolean;
  reveal_question_verified?: boolean;
  [key: string]: any;
}

function HostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionFromQuery = (searchParams.get("session") || "").trim() || null;

  const [sessionCode, setSessionCode] = useState<string | null>(sessionFromQuery);
  const [data, setData] = useState<SessionData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Generate a random session code
  const generateSessionCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluding confusing chars
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSessionCode(code);
    router.push(`/host?session=${code}`);
  };

  useEffect(() => {
    // Keep internal state aligned with the URL
    if (sessionFromQuery !== sessionCode) {
      setSessionCode(sessionFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionFromQuery]);

  // Poll session data (monotonic merge to avoid flicker)
  useEffect(() => {
    if (!sessionCode) return;

    setData({});
    setLastUpdated("");

    let pollInterval: ReturnType<typeof setInterval>;

    const poll = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/session/${encodeURIComponent(sessionCode)}`);

        if (!res.ok) {
          if (res.status === 503) {
            // KV not configured - hide error in development
            setError(null);
          } else {
            setError(`Error: ${res.status}`);
          }
          setLoading(false);
          return;
        }

        const json = await res.json();
        const incoming: SessionData = json.data || {};
        setData((prev) => {
          const merged: SessionData = { ...prev };
          for (const [k, v] of Object.entries(incoming)) {
            const prevVal = (prev as any)[k];
            if (typeof v === "boolean") {
              // booleans are monotonic: once true, keep true
              (merged as any)[k] = Boolean(prevVal) || Boolean(v);
            } else if (typeof v === "string") {
              // tokens/playerName: keep first non-empty
              (merged as any)[k] = prevVal && String(prevVal).length > 0 ? prevVal : v;
            } else {
              (merged as any)[k] = v;
            }
          }
          return merged;
        });
        setError(null);

        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setLastUpdated(timeStr);
      } catch (err) {
        console.error("Poll error:", err);
        setError("Connection failed");
      } finally {
        setLoading(false);
      }
    };

    poll(); // Immediate poll
    // Faster polling to reduce perceived lag
    pollInterval = setInterval(poll, 2000);

    return () => clearInterval(pollInterval);
  }, [sessionCode]);

  const handleActivate = async () => {
    if (!sessionCode) return;
    try {
      const res = await fetch(`/api/session/${encodeURIComponent(sessionCode)}/progress`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: "started", value: true }),
      });
      if (!res.ok) {
        setError("Failed to activate");
      }
    } catch (err) {
      console.error("Activation error:", err);
      setError("Activation failed");
    }
  };

  const handleDeactivate = async () => {
    if (!sessionCode) return;
    try {
      const res = await fetch(`/api/session/${encodeURIComponent(sessionCode)}/progress`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: "started", value: false }),
      });
      if (!res.ok) {
        setError("Failed to deactivate");
      }
    } catch (err) {
      console.error("Deactivation error:", err);
      setError("Deactivation failed");
    }
  };

  // Determine "other keys" (exclude system and station 3 keys)
  const systemKeys = new Set(["started", "s3_heat", "s3_pressure", "s3_excess", "s3_confirmed"]);
  const otherKeys = Object.entries(data)
    .filter(([k]) => !systemKeys.has(k))
    .sort(([a], [b]) => a.localeCompare(b));

  if (!sessionCode) {
    return (
      <BasicShell
        title="Chemistry Mystery"
        subtitle="Host Control"
        description="Create a session for your player"
      >
        <div className="space-y-5 animate-fadeIn">
          <Folio
            label="SESSION"
            title="Create Session"
            note="Generate a code to share with your player"
          >
            <Figure caption="New Session">
              <div className="space-y-3">
                <p className="text-sm text-slate-700">
                  Click below to create a new session. Share the code with your player so they can join.
                </p>
                <Button
                  variant="primary"
                  onClick={generateSessionCode}
                  className="w-full"
                >
                  Generate Session Code
                </Button>
              </div>
            </Figure>
          </Folio>
        </div>
      </BasicShell>
    );
  }

  return (
    <BasicShell
      title="Chemistry Mystery"
      subtitle="Host Control Panel"
      description={`Session: ${sessionCode}`}
    >
      <div className="space-y-5 animate-fadeIn">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Session Code Display */}
        <Folio label="SESSION" title="Player Code" note="Share this code with your player">
          <Figure caption="Session ID">
            <div className="space-y-3">
              <div className="rounded-lg bg-emerald-50 border-2 border-emerald-600 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-emerald-700 mb-1">Session Code</p>
                <p className="text-3xl font-bold text-emerald-900 tracking-widest font-mono">{sessionCode}</p>
              </div>
              <p className="text-xs text-slate-600">
                Your player should enter this code on the start page to join the session.
              </p>
            </div>
          </Figure>
        </Folio>

        {/* Status Card */}
        <Folio label="STATUS" title="Experiment Status" note={lastUpdated ? `Last updated: ${lastUpdated}` : ""}>
          <Figure caption="Activation">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <span className="text-sm font-semibold text-slate-900">Started</span>
                <span className={`text-sm font-bold ${data.started ? "text-emerald-700" : "text-slate-500"}`}>
                  {data.started ? "✓ ACTIVE" : "○ Inactive"}
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant={data.started ? "secondary" : "primary"}
                  onClick={handleActivate}
                  disabled={data.started || loading}
                  className="flex-1"
                >
                  Activate
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDeactivate}
                  disabled={!data.started || loading}
                  className="flex-1"
                >
                  Deactivate
                </Button>
              </div>
            </div>
          </Figure>
        </Folio>

        {/* All Stations Checkpoints (merged) */}
        <Folio label="PROGRESS" title="Player Progress" note="Checkpoints & Hints">
          <Figure caption="Station Completion">
            <div className="space-y-3">
              {/* Station 1 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-600">Station 1 – NMR</p>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      try {
                        await fetch(`/api/session/${encodeURIComponent(sessionCode!)}/progress`, {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ key: "hints_s1_unlocked", value: true }),
                        });
                      } catch (err) {
                        console.error("Failed to unlock hints:", err);
                      }
                    }}
                    className="text-[10px] py-0.5 px-1.5 h-auto"
                    disabled={data.hints_s1_unlocked}
                  >
                    {data.hints_s1_unlocked ? "✓" : "Hints"}
                  </Button>
                </div>
                <div className="space-y-1 pl-3">
                  {[
                    { key: "s1_integralsOk", label: "Integrals" },
                    { key: "s1_identityOk", label: "Identity" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className={`text-lg ${data[key as keyof SessionData] ? "text-emerald-700" : "text-slate-400"}`}>
                        {data[key as keyof SessionData] ? "✓" : "○"}
                      </span>
                      <span className="text-slate-700">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Station 2 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-600">Station 2 – Energetics</p>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      try {
                        await fetch(`/api/session/${encodeURIComponent(sessionCode!)}/progress`, {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ key: "hints_s2_unlocked", value: true }),
                        });
                      } catch (err) {
                        console.error("Failed to unlock hints:", err);
                      }
                    }}
                    className="text-[10px] py-0.5 px-1.5 h-auto"
                    disabled={data.hints_s2_unlocked}
                  >
                    {data.hints_s2_unlocked ? "✓" : "Hints"}
                  </Button>
                </div>
                <div className="space-y-1 pl-3">
                  {[
                    { key: "s2_productOk", label: "Product" },
                    { key: "s2_conditionOk", label: "Conditions" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className={`text-lg ${data[key as keyof SessionData] ? "text-emerald-700" : "text-slate-400"}`}>
                        {data[key as keyof SessionData] ? "✓" : "○"}
                      </span>
                      <span className="text-slate-700">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Station 3 */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Station 3 – Field Verification</p>
                <div className="space-y-2 pl-3">
                  {[
                    { key: "s3_heat", label: "Heat field" },
                    { key: "s3_pressure", label: "Pressure field" },
                    { key: "s3_excess", label: "Excess field" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg ${data[key as keyof SessionData] ? "text-emerald-700" : "text-slate-400"}`}>
                          {data[key as keyof SessionData] ? "✓" : "○"}
                        </span>
                        <span className="text-slate-700">{label}</span>
                      </div>
                      {!data[key as keyof SessionData] && (
                        <Button
                          variant="ghost"
                          onClick={async () => {
                            try {
                              await fetch(`/api/session/${encodeURIComponent(sessionCode!)}/progress`, {
                                method: "POST",
                                headers: { "content-type": "application/json" },
                                body: JSON.stringify({ key, value: true }),
                              });
                            } catch (err) {
                              console.error("Failed to mark field:", err);
                            }
                          }}
                          className="text-xs py-1 px-2 h-auto"
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-sm pt-2 border-t border-slate-200">
                    <span className={`text-lg ${data.s3_confirmed ? "text-emerald-700" : "text-slate-400"}`}>
                      {data.s3_confirmed ? "✓" : "○"}
                    </span>
                    <span className="text-slate-700">Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Station 4 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-600">Station 4 – Catalyst</p>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      try {
                        await fetch(`/api/session/${encodeURIComponent(sessionCode!)}/progress`, {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ key: "hints_s4_unlocked", value: true }),
                        });
                      } catch (err) {
                        console.error("Failed to unlock hints:", err);
                      }
                    }}
                    className="text-[10px] py-0.5 px-1.5 h-auto"
                    disabled={data.hints_s4_unlocked}
                  >
                    {data.hints_s4_unlocked ? "✓" : "Hints"}
                  </Button>
                </div>
                <div className="space-y-1 pl-3">
                  {[
                    { key: "s4_catalystOk", label: "Catalyst" },
                    { key: "s4_persistentOk", label: "Persistence" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className={`text-lg ${data[key as keyof SessionData] ? "text-emerald-700" : "text-slate-400"}`}>
                        {data[key as keyof SessionData] ? "✓" : "○"}
                      </span>
                      <span className="text-slate-700">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Gate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-600">Final Lock</p>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      try {
                        await fetch(`/api/session/${encodeURIComponent(sessionCode!)}/progress`, {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ key: "hints_final_unlocked", value: true }),
                        });
                      } catch (err) {
                        console.error("Failed to unlock hints:", err);
                      }
                    }}
                    className="text-[10px] py-0.5 px-1.5 h-auto"
                    disabled={data.hints_final_unlocked}
                  >
                    {data.hints_final_unlocked ? "✓" : "Hints"}
                  </Button>
                </div>
                <div className="space-y-1 pl-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`text-lg ${data["final_ok" as keyof SessionData] ? "text-emerald-700" : "text-slate-400"}`}>
                      {data["final_ok" as keyof SessionData] ? "✓" : "○"}
                    </span>
                    <span className="text-slate-700">Complete</span>
                  </div>
                </div>
              </div>

              {/* Reveal Question */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Reveal – Question</p>
                <div className="space-y-2 pl-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg ${data["reveal_question_verified" as keyof SessionData] ? "text-emerald-700" : "text-slate-400"}`}>
                        {data["reveal_question_verified" as keyof SessionData] ? "✓" : "○"}
                      </span>
                      <span className="text-slate-700">Question unlock</span>
                    </div>
                    {!data["reveal_question_verified" as keyof SessionData] && (
                      <Button
                        variant="ghost"
                        onClick={async () => {
                          try {
                            await fetch(`/api/session/${encodeURIComponent(sessionCode!)}/progress`, {
                              method: "POST",
                              headers: { "content-type": "application/json" },
                              body: JSON.stringify({ key: "reveal_question_verified", value: true }),
                            });
                          } catch (err) {
                            console.error("Failed to verify question:", err);
                          }
                        }}
                        className="text-xs py-1 px-2 h-auto"
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Figure>
        </Folio>

        {/* Cheatsheet */}
        <Folio label="SOLUTIONS" title="Cheatsheet" note="Correct answers">
          <Figure caption="Station Solutions">
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="text-xs font-semibold text-emerald-900 mb-2">Station 1 – NMR Fingerprint</p>
                <p className="text-xs text-emerald-800 font-mono">p-disubstituted aromatic a2b2 methyl</p>
                <p className="text-xs text-emerald-700 mt-1">Constraints: para, disubstituted, aromatic, a2b2_or_equiv, methyl</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="text-xs font-semibold text-emerald-900 mb-2">Station 2 – Energetics Key</p>
                <p className="text-xs text-emerald-800 font-mono">A:K ratio~25 | B:T</p>
                <p className="text-xs text-emerald-700 mt-1">Format: A:K (kinetic), B:T (thermodynamic), ratio 25, 50, or 100</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="text-xs font-semibold text-emerald-900 mb-2">Station 3 – Field Verification</p>
                <p className="text-xs text-emerald-800 font-mono mb-1">Heat › Thermodynamic product</p>
                <p className="text-xs text-emerald-800 font-mono mb-1">Pressure › Fewer accessible states</p>
                <p className="text-xs text-emerald-800 font-mono">Excess › Toward consumption of the excess</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="text-xs font-semibold text-emerald-900 mb-2">Station 4 – Catalyst</p>
                <p className="text-xs text-emerald-800 font-mono">H+ or H3O+</p>
                <p className="text-xs text-emerald-700 mt-1">The acid species that participates but cancels from net equation</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="text-xs font-semibold text-emerald-900 mb-2">Final Lock</p>
                <p className="text-xs text-emerald-800 font-mono">C8H8</p>
                <p className="text-xs text-emerald-700 mt-1">Molecular formula of the mysterious compound</p>
              </div>
            </div>
          </Figure>
        </Folio>

        {/* Raw Session Data (debug) */}
        <Folio label="DEBUG" title="Player Input Data" note={`${otherKeys.length} key(s) captured`}>
          <Figure caption="All Captured Input">
            {otherKeys.length === 0 ? (
              <p className="text-xs text-slate-600">No input data yet</p>
            ) : (
              <>
                <p className="text-xs text-slate-500 mb-3">Keys found: {otherKeys.map(([k]) => k).join(", ")}</p>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {otherKeys.map(([k, v]) => (
                    <div key={k} className="bg-slate-50 p-3 rounded border border-slate-200">
                      <p className="font-mono font-semibold text-slate-700 text-xs mb-2">{k}</p>
                      <div className="text-xs text-slate-600 font-mono whitespace-pre-wrap break-words bg-white p-2 rounded">
                        {(() => {
                          try {
                            if (typeof v === "object") {
                              return JSON.stringify(v, null, 2);
                            }
                            return String(v);
                          } catch (e) {
                            return `[Error rendering: ${String(e)}]`;
                          }
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Figure>
        </Folio>

        {/* Footer */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={async () => {
              // Deactivate current session before switching
              if (sessionCode && data.started) {
                await handleDeactivate();
              }
              setSessionCode(null);
              router.push("/host");
            }}
            className="flex-1"
          >
            Change Session
          </Button>
        </div>
      </div>
    </BasicShell>
  );
}

export default function HostPage() {
  return (
    <Suspense
      fallback={
        <BasicShell title="Chemistry Mystery" subtitle="Loading..." description="">
          <div className="text-center text-slate-600">Loading host panel…</div>
        </BasicShell>
      }
    >
      <HostContent />
    </Suspense>
  );
}
