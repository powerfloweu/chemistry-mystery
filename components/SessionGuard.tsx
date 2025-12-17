"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getActiveSession } from "@/lib/sessionGuard";

/**
 * SessionGuard ensures a valid session exists before allowing access to game pages.
 * Redirects to /start if no session is found.
 */
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const session = getActiveSession();
    if (!session) {
      router.replace("/start");
    }
  }, [router]);

  const session = getActiveSession();
  if (!session) {
    return null; // Don't render children while redirecting
  }

  return <>{children}</>;
}
