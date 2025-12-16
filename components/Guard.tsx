"use client"
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
    <main className="min-h-screen p-6 flex items-center justify-center" style={{ background: 'radial-gradient(600px 300px at 10% 15%, rgba(var(--emerald),0.04), transparent 20%), radial-gradient(500px 260px at 85% 30%, rgba(var(--gold),0.04), transparent 18%), linear-gradient(180deg, rgba(250,244,233,0.5) 0%, rgba(247,240,227,0.5) 100%)' }}>
      <div className="w-full max-w-xl space-y-6">
        {/* Header: Title, Subtitle, Divider */}
        <header className="space-y-3">
          {title ? (
            <h1 
              className="text-4xl font-serif font-bold tracking-wide" 
              style={{ color: 'rgb(var(--ink))', letterSpacing: '0.02em' }}
            >
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p 
              className="text-sm italic font-light" 
              style={{ color: 'rgba(var(--ink),0.6)' }}
            >
              {subtitle}
            </p>
          ) : null}

          {/* Gold → Emerald divider rule */}
          <div 
            className="h-px w-full" 
            style={{ background: 'linear-gradient(90deg, rgba(var(--gold),0.8) 0%, rgba(var(--emerald),0.5) 50%, rgba(var(--gold),0.8) 100%)' }} 
          />
        </header>

        {/* Main Folio Panel */}
        <section className="relative rounded-3xl overflow-hidden animate-fadeIn">
          {/* Gilded corners */}
          <div className="pointer-events-none absolute left-5 top-5 h-4 w-4 border-l-2 border-t-2" style={{ borderColor: 'rgba(var(--gold),0.8)' }} />
          <div className="pointer-events-none absolute right-5 top-5 h-4 w-4 border-r-2 border-t-2" style={{ borderColor: 'rgba(var(--gold),0.8)' }} />
          <div className="pointer-events-none absolute left-5 bottom-5 h-4 w-4 border-l-2 border-b-2" style={{ borderColor: 'rgba(var(--gold),0.8)' }} />
          <div className="pointer-events-none absolute right-5 bottom-5 h-4 w-4 border-r-2 border-b-2" style={{ borderColor: 'rgba(var(--gold),0.8)' }} />

          {/* Subtle emerald bloom */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-800/5 blur-3xl" />

          {/* Outer gilt frame + inner paper */}
          <div className="p-1 relative">
            <div 
              className="rounded-2xl border-2 p-6"
              style={{ 
                borderColor: 'rgba(var(--gold),0.3)',
                background: 'linear-gradient(135deg, rgba(255,250,240,0.95) 0%, rgba(255,250,240,0.9) 100%)',
                boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), 0 10px 30px -10px rgba(0,0,0,0.08)'
              }}
            >
              {children}
            </div>
          </div>
        </section>

        {/* Footer: Archival system label */}
        <footer className="text-xs font-light text-center" style={{ color: 'rgba(var(--ink),0.5)' }}>
          Bond Stability Analysis • Field Notes Interface
        </footer>
      </div>
    </main>
  );
}
