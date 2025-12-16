"use client";

import React from "react";

type FolioProps = {
  label?: string;
  title?: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
};

export function Folio({ label, title, note, children, className = "" }: FolioProps) {
  return (
    <section
      className={`relative overflow-visible rounded-lg ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(var(--dossier-gold), 0.3) 0%, rgba(var(--dossier-gold), 0.2) 100%)',
        border: '2px solid rgba(var(--dossier-gold), 0.5)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25), inset 0 2px 6px rgba(255,255,255,0.2)',
        isolation: 'isolate'
      }}
    >
      {/* Parchment inner border */}
      <div 
        className="absolute inset-[2px] rounded-md pointer-events-none"
        style={{
          border: '1px solid rgba(var(--dossier-gold), 0.3)'
        }}
      />

      {/* Content */}
      <div 
        className="relative p-6"
        style={{
          background: 'rgba(var(--parchment), 0.3)'
        }}
      >
        <header className="text-center mb-6">
          {label ? (
            <div 
              className="inline-block text-[10px] font-semibold tracking-[0.3em] px-3 py-1 rounded mb-2"
              style={{
                background: 'rgba(var(--dossier-gold), 0.2)',
                color: 'rgb(var(--gold-deep))'
              }}
            >
              {label.toUpperCase()}
            </div>
          ) : null}

          {title ? (
            <h2 
              className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight"
              style={{
                fontFamily: 'Georgia, serif',
                color: 'rgb(var(--ink))'
              }}
            >
              {title}
            </h2>
          ) : null}

          {note ? (
            <p className="mt-2 text-sm italic opacity-80">
              {note}
            </p>
          ) : null}
        </header>

        {children}
      </div>
    </section>
  );
}

export default Folio;
