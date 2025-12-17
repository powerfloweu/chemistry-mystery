"use client";

import { useEffect, useState } from "react";
import { setField, readState } from "@/lib/gameStore";
import { getActiveSession } from "@/lib/sessionGuard";

/**
 * Component that syncs session data from server to local gameStore
 * Place this in pages where you want to receive updates from the host
 */
export function SessionSyncProvider({ children }: { children: React.ReactNode }) {
  const [syncCounter, setSyncCounter] = useState(0);

  useEffect(() => {
    const session = getActiveSession();
    if (!session) return;

    let pollInterval: ReturnType<typeof setInterval>;

    const syncFromServer = async () => {
      try {
        const res = await fetch(`/api/session/${encodeURIComponent(session)}`);
        if (!res.ok) return;
        
        const json = await res.json();
        const serverData = json.data || {};
        
        let hasChanges = false;
        
        // Merge server data into local gameStore
        Object.entries(serverData).forEach(([key, value]) => {
          // Only update if value is different from local
          const currentState = readState();
          if (currentState[key as keyof typeof currentState] !== value) {
            (setField as any)(key, value);
            hasChanges = true;
          }
        });

        // Trigger re-render if there were changes
        if (hasChanges) {
          setSyncCounter(prev => prev + 1);
          // Dispatch custom event for components to listen to
          window.dispatchEvent(new CustomEvent('sessionSync', { detail: serverData }));
        }
      } catch (err) {
        console.warn("Session sync error:", err);
      }
    };

    // Initial sync
    syncFromServer();
    
    // Poll every 3 seconds
    pollInterval = setInterval(syncFromServer, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  return <>{children}</>;
}
