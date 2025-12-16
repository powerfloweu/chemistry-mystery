"use client";

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
  children,
}: {
  title: string;
  subtitle?: string;
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
              <div className="text-xs uppercase tracking-[0.3em] font-semibold opacity-70">
                Sealed Dossier
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ 
                fontFamily: 'Georgia, serif',
                color: 'rgb(var(--ink))'
              }}>
                {title}
              </h1>
              {subtitle ? (
                <div className="mt-2">
                  <div className="text-xs uppercase tracking-[0.25em] font-medium opacity-60 mb-1">
                    Identification
                  </div>
                  <p className="text-sm italic opacity-80">
                    {subtitle}
                  </p>
                </div>
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
              Bond Stability Analysis • Field Notes Interface
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
