"use client";

import { useState, useEffect, useMemo } from "react";
import { BasicShell, Guard } from "@/components/Guard";
import Folio from "@/components/ui/Folio";
import { readState } from "@/lib/gameStore";
import { SessionSyncProvider } from "@/components/SessionSyncProvider";

export default function RevealQuestion() {
  const st = useMemo(() => readState(), []);
  const player = (st.playerName || "Researcher").toString();

  // Require host verification before showing the question
  const [hostVerified, setHostVerified] = useState(false);
  const [syncTrigger, setSyncTrigger] = useState(0);

  // Re-read state whenever sync triggers
  const state = useMemo(() => readState(), [syncTrigger]);

  // Listen for session sync events
  useEffect(() => {
    const handleSync = () => {
      setSyncTrigger((prev) => prev + 1);
    };
    window.addEventListener("sessionSync", handleSync);
    return () => window.removeEventListener("sessionSync", handleSync);
  }, []);

  // Check if host has verified the question
  useEffect(() => {
    if (state.reveal_question_verified) {
      setHostVerified(true);
    }
  }, [state.reveal_question_verified]);

  if (!hostVerified) {
    return (
      <SessionSyncProvider>
        <Guard require={["final_ok"]}>
          <BasicShell title="Sealed Repository" subtitle="Awaiting verification">
            <Folio label="GATE" title="Host Authorization Required">
              <div className="space-y-4 text-sm text-slate-800">
                <p>The final question requires host verification to unlock.</p>
                <p className="text-slate-600/80">Waiting for host authorization...</p>
              </div>
            </Folio>
          </BasicShell>
        </Guard>
      </SessionSyncProvider>
    );
  }

  return (
    <SessionSyncProvider>
      <Guard require={["final_ok"]}>
        <main className="min-h-screen px-3 py-8 sm:px-6 sm:py-12 flex items-center justify-center">
          <div className="relative w-full max-w-3xl animate-fadeIn">
            <QuestionBody player={player} />
          </div>
        </main>
      </Guard>
    </SessionSyncProvider>
  );
}

function QuestionBody({ player }: { player: string }) {
  return (
    <div className="text-center space-y-6">
      <h2
        className="text-3xl sm:text-4xl font-bold tracking-tight"
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          color: '#b68a2c',
          letterSpacing: '0.04em',
          textShadow: '0 1px 0 #5b4213, 0 0 18px rgba(182,138,44,0.65)',
          transform: 'rotate(-1deg)',
          display: 'inline-block',
        }}
      >
        {player}, would you choose to make this bond irreversible with me?
      </h2>
      <div className="text-6xl mt-8">💍</div>
    </div>
  );
}
