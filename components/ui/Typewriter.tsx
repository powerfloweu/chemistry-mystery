"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

function useTypewriter(
  lines: string[],
  enabled: boolean,
  speedMs = 22,
  pauseMs = 420
) {
  const [out, setOut] = useState<string[]>([]);
  const idxRef = useRef({ line: 0, char: 0 });

  useEffect(() => {
    if (!enabled) {
      setOut(lines);
      return;
    }

    let cancelled = false;
    setOut([]);
    idxRef.current = { line: 0, char: 0 };

    const tick = async () => {
      while (!cancelled) {
        const { line, char } = idxRef.current;
        if (line >= lines.length) return;

        const full = lines[line];
        const nextChar = char + 1;

        setOut((prev) => {
          const next = [...prev];
          next[line] = full.slice(0, nextChar);
          return next;
        });

        idxRef.current = { line, char: nextChar };

        if (nextChar >= full.length) {
          await new Promise((r) => setTimeout(r, pauseMs));
          idxRef.current = { line: line + 1, char: 0 };
          setOut((prev) => {
            const next = [...prev];
            if (next.length < line + 2) next.push("");
            return next;
          });
        } else {
          await new Promise((r) => setTimeout(r, speedMs));
        }
      }
    };

    tick();
    return () => {
      cancelled = true;
    };
  }, [enabled, lines, speedMs, pauseMs]);

  const done = useMemo(
    () =>
      out.length >= lines.length &&
      out.every((l, i) => {
        const target = lines[i] ?? "";
        return (l ?? "").length === target.length;
      }),
    [out, lines]
  );

  return { out, done };
}

export default function TypewriterBlock({
  lines,
  className = "",
  start = true,
  speedMs,
  pauseMs,
}: {
  lines: string[];
  className?: string;
  start?: boolean;
  speedMs?: number;
  pauseMs?: number;
}) {
  const { out, done } = useTypewriter(lines, start, speedMs, pauseMs);

  return (
    <div className={className}>
      {out.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap">
          <span className="mr-2 text-emerald-900/70">▸</span>
          {l}
          {i === out.length - 1 && !done ? (
            <span className="ml-1 inline-block w-[8px] animate-pulse">▍</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
