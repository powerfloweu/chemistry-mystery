/**
 * Session guard utilities for two-player mode
 */

const SESSION_KEY = "chemMystery:session:v1";

export function getActiveSession(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SESSION_KEY);
}

export function setActiveSession(session: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, session);
}

export function clearActiveSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function requireSession(): string {
  const session = getActiveSession();
  if (!session) {
    // Redirect to start page
    if (typeof window !== "undefined") {
      window.location.href = "/start";
    }
    throw new Error("Session required");
  }
  return session;
}
