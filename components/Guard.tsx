"use client";

import { WaxSealButton } from "@/components/ui/WaxSealButton";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { readState, GameState } from "../lib/gameStore";
import { lastValidRoute } from "../lib/routes";

type GuardProps = {
  require?: Array<keyof GameState>;
  children: React.ReactNode;
};

export function Guard({ require = [], children }: GuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const s = readState();
    const missing = require.some((k) => !s[k as keyof GameState]);
    if (missing) {
      const target = lastValidRoute(s as GameState);
      if (target !== pathname) router.replace(target);
    }
  }, [require, router, pathname]);

  return <>{children}</>;
}

export function BasicShell({
  title,
  subtitle,
  description,
  children,
}: {
  title: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-3 py-8 sm:px-6 sm:py-12 flex items-center justify-center">
      <div 
        className="relative w-full max-w-3xl animate-fadeIn rounded-lg shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(var(--dossier-gold), 0.9) 0%, rgba(var(--dossier-gold), 0.75) 100%)',
          padding: '2px',
        }}
      >
        {/* Ornate outer border */}
        <div 
          className="relative rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgb(var(--parchment)) 0%, rgb(var(--parchment-dark)) 100%)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-16 h-16 opacity-40" style={{
            background: 'radial-gradient(circle at top left, rgba(var(--dossier-gold), 0.6), transparent 70%)'
          }} />
          <div className="absolute top-0 right-0 w-16 h-16 opacity-40" style={{
            background: 'radial-gradient(circle at top right, rgba(var(--dossier-gold), 0.6), transparent 70%)'
          }} />
          <div className="absolute bottom-0 left-0 w-16 h-16 opacity-40" style={{
            background: 'radial-gradient(circle at bottom left, rgba(var(--dossier-gold), 0.6), transparent 70%)'
          }} />
          <div className="absolute bottom-0 right-0 w-16 h-16 opacity-40" style={{
            background: 'radial-gradient(circle at bottom right, rgba(var(--dossier-gold), 0.6), transparent 70%)'
          }} />

          <div className="relative px-8 py-10 sm:px-12 sm:py-14">
            <header className="text-center space-y-3 mb-8">
              {subtitle ? (
                <div className="text-xs uppercase tracking-[0.3em] font-semibold opacity-70">
                  {subtitle}
                </div>
              ) : null}
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ 
                fontFamily: 'Georgia, "Times New Roman", serif',
                color: '#b68a2c',
                letterSpacing: '0.04em',
                textShadow: '0 1px 0 #5b4213, 0 0 18px rgba(182,138,44,0.65)',
                transform: 'rotate(-1deg)',
                display: 'inline-block'
              }}>
                {title}
              </h1>
              {description ? (
                <p className="text-sm italic opacity-80 mt-2">
                  {description}
                </p>
              ) : null}
              <div 
                className="h-px w-full mt-4"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(var(--dossier-gold), 0.5) 20%, rgba(var(--dossier-gold), 0.5) 80%, transparent)'
                }}
              />
            </header>

            <section>{children}</section>

            <footer className="mt-10 pt-6 border-t border-black/10 text-center text-xs opacity-60">
              Field Notes Interface
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
