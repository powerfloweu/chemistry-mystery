import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { memoryStore } from "@/lib/sessionStore";

const TTL_SECONDS = 6 * 60 * 60; // 6 hours

export async function GET(
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

    // Check if KV is configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      // Use in-memory fallback for local development
      const data = await memoryStore.getAll(session);
      console.log(`[API GET] Session ${session}:`, data);
      return NextResponse.json({
        ok: true,
        data: data || {},
      });
    }

    const sessionKey = `session:${session}`;

    // Get all fields from the hash
    let data = await kv.hgetall(sessionKey);

    // If the session exists, refresh TTL
    if (data && Object.keys(data).length > 0) {
      await kv.expire(sessionKey, TTL_SECONDS);
    }

    // Small delay to allow KV to propagate recent writes (eventual consistency safety)
    // Only on first few reads or if data seems incomplete
    if (!data || Object.keys(data).length === 0) {
      await new Promise((r) => setTimeout(r, 50));
      data = await kv.hgetall(sessionKey);
    }

    console.log(`[API GET] Session ${session}:`, data);

    return NextResponse.json({
      ok: true,
      data: data || {},
    });
  } catch (error) {
    console.error("Error reading session:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
