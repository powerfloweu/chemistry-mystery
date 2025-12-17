export type TokenKey = "token1" | "token2" | "token3";

export type GameState = {
  playerName?: string;

  // Station 1
  s1_integralsOk?: boolean;
  s1_identityOk?: boolean;

  // Station 2
  s2_productOk?: boolean;
  s2_conditionOk?: boolean;

  // Station 3
  s3_heat?: boolean;
  s3_pressure?: boolean;
  s3_excess?: boolean;
  s3_confirmed?: boolean;

  // Station 4
  s4_catalystOk?: boolean;
  s4_persistentOk?: boolean;

  // Final gate
  final_ok?: boolean;
  debriefSeen?: boolean;

  // Reveal question gate
  reveal_question_verified?: boolean;

  // Hint unlocks (host-controlled)
  hints_s1_unlocked?: boolean;
  hints_s2_unlocked?: boolean;
  hints_s4_unlocked?: boolean;
  hints_final_unlocked?: boolean;

  // Dev mode
  devMode?: boolean;

  // legacy tokens
  token1?: string; // "C"
  token2?: string; // "8"
  token3?: string; // "H"
};


const STORAGE_KEY = "chemMystery:state:v1";

// Cache the dynamic import so we don't re-import on every write
let sessionSyncPromise: Promise<typeof import("./sessionSync")> | null = null;
function getSessionSync() {
  if (!sessionSyncPromise) {
    sessionSyncPromise = import("./sessionSync");
  }
  return sessionSyncPromise;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

export function readState(): GameState {
  if (!isBrowser()) return {};
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return {};
  }
}

export function writeState(next: GameState): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function setToken(key: TokenKey, value: string): GameState {
  const prev = readState();
  const next = { ...prev, [key]: value };
  writeState(next);
  return next;
}

export function setField<K extends keyof GameState>(key: K, value: GameState[K]): GameState {
  const prev = readState();
  const next = { ...prev, [key]: value };
  writeState(next);
  
  // Sync to server if a session exists (client-side only)
  if (isBrowser()) {
    getSessionSync()
      .then(({ maybeSyncProgress, maybeSyncSnapshot }) => {
        // Send the changed field for quick UI, and the full snapshot to avoid partial KV states
        maybeSyncProgress(key as string, value);
        try { maybeSyncSnapshot(next as any); } catch {}
      })
      .catch(() => {
        // Silently ignore sync/import errors
      });
  }
  
  return next;
}

export function clearState(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function initDevMode(): void {
  if (!isBrowser()) return;
  const params = new URLSearchParams(window.location.search);
  if (params.get("dev") === "true") {
    setField("devMode", true);
  }
}

export function isDevMode(): boolean {
  if (!isBrowser()) return false;
  return !!readState().devMode;
}

export function hasToken(key: TokenKey, expected?: string): boolean {
  const s = readState();
  const v = s[key];
  if (!v) return false;
  return expected ? v === expected : true;
}
