/**
 * Client-side helper for session management and progress syncing
 */

const SESSION_KEY = "chemMystery:session:v1";

/**
 * Get the session code from URL query parameters or sessionStorage
 */
export function getSessionFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  
  // First check URL params (for direct links)
  const params = new URLSearchParams(window.location.search);
  let session = params.get("session");
  if (session && session.trim().length > 0) {
    return session.trim();
  }
  
  // Fall back to sessionStorage (for manual code entry)
  try {
    session = sessionStorage.getItem(SESSION_KEY);
    return session && session.trim().length > 0 ? session.trim() : null;
  } catch {
    return null;
  }
}

/**
 * Sync progress to the server if a session exists
 * Silently fails if session is not present or if the request fails
 */
export async function maybeSyncProgress(key: string, value: any): Promise<void> {
  const session = getSessionFromUrl();
  if (!session) {
    console.warn(`[sessionSync] No session found for key: ${key}`);
    return;
  }

  console.log(`[sessionSync] Syncing ${key} to session ${session}`, value);

  try {
    const res = await fetch(`/api/session/${encodeURIComponent(session)}/progress`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ key, value }),
      keepalive: true,
    });
    if (!res.ok) {
      console.warn(`[sessionSync] Sync failed with status ${res.status}`, await res.text());
    } else {
      console.log(`[sessionSync] Sync successful for ${key}`);
    }
  } catch (err) {
    console.error(`[sessionSync] Sync error for ${key}:`, err);
  }
}

/**
 * Sync the entire local state snapshot in one request.
 * This prevents partial KV states when multiple fields change quickly.
 */
export async function maybeSyncSnapshot(state: any): Promise<void> {
  return maybeSyncProgress("__stateSnapshot", state);
}
