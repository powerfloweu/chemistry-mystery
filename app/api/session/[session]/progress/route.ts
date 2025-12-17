import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { memoryStore } from "@/lib/sessionStore";

const TTL_SECONDS = 6 * 60 * 60; // 6 hours

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  try {
    const { session } = await params;

    if (!session || typeof session !== "string" || session.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Invalid session parameter" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || typeof key !== "string" || key.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Invalid key parameter" },
        { status: 400 }
      );
    }

    // Prevent accidental storage of functions or undefined
    if (typeof value === "undefined") {
      return NextResponse.json(
        { ok: false, error: "Invalid value" },
        { status: 400 }
      );
    }

    const isSnapshot = key === "__stateSnapshot" && value && typeof value === "object";

    // Check if KV is configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      // Use in-memory fallback for local development
      if (isSnapshot) {
        console.log(`[API POST] Session ${session}: merging snapshot`);
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          await memoryStore.set(session, k, v);
        }
        return NextResponse.json({ ok: true });
      } else {
        console.log(`[API POST] Session ${session}: setting ${key} = ${JSON.stringify(value)}`);
        await memoryStore.set(session, key, value);
        return NextResponse.json({ ok: true });
      }
    }

    const sessionKey = `session:${session}`;

    if (isSnapshot) {
      // Merge all fields in one atomic hset
      await kv.hset(sessionKey, value as Record<string, unknown>);
      await kv.expire(sessionKey, TTL_SECONDS);
      console.log(`[API POST] Session ${session}: merged snapshot (${Object.keys(value as object).length} keys)`);
      return NextResponse.json({ ok: true });
    }

    // Set the field in the hash
    await kv.hset(sessionKey, { [key]: value });

    // Set/refresh TTL
    await kv.expire(sessionKey, TTL_SECONDS);

    // Verify write took by reading back (ensures KV propagation before responding)
    // Small retry loop in case of transient issues
    let verified = false;
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 25));
      const verify = await kv.hget(sessionKey, key);
      if (verify !== null && verify === value) {
        verified = true;
        break;
      }
    }

    if (!verified) {
      console.warn(
        `[API POST] Write verification failed for ${session}.${key}, but continuing`
      );
    }

    console.log(`[API POST] Session ${session}: ${key} = ${JSON.stringify(value)} (verified: ${verified})`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating session progress:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
