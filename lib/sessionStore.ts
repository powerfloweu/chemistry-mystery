// In-memory session store for local development
// When deployed to Vercel with KV, this won't be used
// MUST be a true global singleton that persists across all Node.js request handlers

interface SessionData {
  [key: string]: any;
}

class InMemorySessionStore {
  private sessions: Map<string, SessionData> = new Map();

  async get(session: string): Promise<SessionData | null> {
    return this.sessions.get(session) || null;
  }

  async set(session: string, key: string, value: any): Promise<void> {
    const existing = this.sessions.get(session) || {};
    this.sessions.set(session, { ...existing, [key]: value });
    console.log(`[sessionStore] Set ${session}.${key} = ${JSON.stringify(value)}`);
  }

  async getAll(session: string): Promise<SessionData> {
    const data = this.sessions.get(session) || {};
    console.log(`[sessionStore] GetAll ${session}:`, data);
    return data;
  }
}

// CRITICAL: Use globalThis to ensure the singleton persists across hot reloads and all request contexts
declare global {
  var __chemMysterySessionStore: InMemorySessionStore | undefined;
}

export const memoryStore: InMemorySessionStore =
  globalThis.__chemMysterySessionStore || new InMemorySessionStore();

if (!globalThis.__chemMysterySessionStore) {
  globalThis.__chemMysterySessionStore = memoryStore;
}
