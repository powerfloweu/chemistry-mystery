"use client";

import { useEffect, useState } from "react";
import { initDevMode, isDevMode } from "@/lib/gameStore";

export default function DevBadge() {
  const [dev, setDev] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initDevMode();
    setDev(isDevMode());
  }, []);

  if (!mounted) return null;

  if (!dev) return null;

  return (
    <div style={{ position: "fixed", bottom: 12, right: 12, zIndex: 50 }}>
      <span
        title="Dev Mode Active"
        style={{
          padding: "6px 10px",
          borderRadius: 12,
          background: "rgba(245, 208, 54, 0.15)",
          border: "1px solid rgba(180, 138, 44, 0.6)",
          fontFamily: "Georgia, serif",
          fontSize: 12,
          color: "#b68a2c",
          textShadow: "0 0 12px rgba(255, 215, 0, 0.35)",
        }}
      >
        DEV MODE ACTIVE
      </span>
    </div>
  );
}
