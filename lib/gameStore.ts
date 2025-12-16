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
  s3_confirmed?: boolean;

  // Station 4
  s4_catalystOk?: boolean;
  s4_persistentOk?: boolean;

  // Final gate
  final_ok?: boolean;

  // legacy tokens
  token1?: string; // "C"
  token2?: string; // "8"
  token3?: string; // "H"
};


const STORAGE_KEY = "chemMystery:state:v1";

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
  return next;
}

export function clearState(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function hasToken(key: TokenKey, expected?: string): boolean {
  const s = readState();
  const v = s[key];
  if (!v) return false;
  return expected ? v === expected : true;
}
