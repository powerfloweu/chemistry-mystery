"use client";

import React from "react";

export function StoryCard({
  title,
  objective,
  why,
  procedure,
  hint,
  children,
  className = "",
}: {
  title: string;
  objective: string;
  why: string;
  procedure: string[];
  hint?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(var(--dossier-gold), 0.4) 0%, rgba(var(--dossier-gold), 0.25) 100%)',
        border: '2px solid rgba(var(--dossier-gold), 0.5)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 3px rgba(255,255,255,0.3)'
      }}
    >
      {/* Decorative header */}
      <div 
        className="relative px-5 py-4 border-b-2"
        style={{
          background: 'linear-gradient(180deg, rgba(var(--parchment), 0.95), rgba(var(--parchment-dark), 0.9))',
          borderColor: 'rgba(var(--dossier-gold), 0.6)'
        }}
      >
        <div className="text-center">
          <div 
            className="inline-block text-[10px] uppercase tracking-[0.3em] font-semibold px-3 py-1 rounded"
            style={{
              background: 'rgba(var(--dossier-gold), 0.2)',
              color: 'rgb(var(--gold-deep))'
            }}
          >
            Field Note
          </div>
          <h3 
            className="mt-2 text-lg font-bold tracking-tight"
            style={{ 
              fontFamily: 'Georgia, serif',
              color: 'rgb(var(--ink))'
            }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Content area */}
      <div 
        className="space-y-4 px-5 py-5"
        style={{
          background: 'rgba(var(--parchment), 0.85)'
        }}
      >
        <div 
          className="rounded p-3"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(var(--dossier-gold), 0.3)'
          }}
        >
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-1">Objective</div>
          <p className="text-sm leading-relaxed">{objective}</p>
        </div>

        <div 
          className="rounded p-3"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(var(--dossier-gold), 0.3)'
          }}
        >
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-1">Why it matters</div>
          <p className="text-sm leading-relaxed">{why}</p>
        </div>

        <div 
          className="rounded p-3"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(var(--dossier-gold), 0.3)'
          }}
        >
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">Procedure</div>
          <ol className="space-y-2 text-sm">
            {procedure.map((step, idx) => (
              <li key={idx} className="flex gap-2">
                <span 
                  className="mt-[2px] flex-shrink-0 h-[18px] w-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: 'rgba(var(--dossier-gold), 0.6)',
                    color: 'rgb(var(--ink))'
                  }}
                >
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          {hint ? (
            <p className="mt-3 text-xs italic opacity-75">
              <span className="font-semibold">Hint:</span> {hint}
            </p>
          ) : null}
        </div>

        {children ? (
          <div 
            className="rounded p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(var(--dossier-gold), 0.4)'
            }}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default StoryCard;
