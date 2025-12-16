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
        background: 'linear-gradient(135deg, rgba(var(--dossier-gold), 0.35) 0%, rgba(var(--dossier-gold), 0.2) 100%)',
        border: '2px solid rgba(var(--dossier-gold), 0.5)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.25)'
      }}
    >
      {/* Header */}
      <div 
        className="relative px-6 py-4 border-b-2"
        style={{
          background: 'linear-gradient(180deg, rgba(var(--parchment), 0.95), rgba(var(--parchment-dark), 0.9))',
          borderColor: 'rgba(var(--dossier-gold), 0.6)'
        }}
      >
        <div className="text-center">
          <div 
            className="inline-block px-3 py-1 rounded"
            style={{
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 600,
              background: 'rgba(var(--dossier-gold), 0.25)',
              color: 'rgb(120 72 0)'
            }}
          >
            Field Protocol
          </div>
          <h3 
            style={{ 
              fontFamily: 'Georgia, serif',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'rgb(var(--ink))',
              marginTop: 'var(--space-2)'
            }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div 
        style={{
          background: 'rgba(var(--parchment), 0.88)',
          padding: 'var(--space-6)'
        }}
      >
        <div className="space-y-4">
        <div 
          className="rounded-lg p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(var(--dossier-gold), 0.35)'
          }}
        >
          <div 
            style={{
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
              color: 'rgb(var(--ink-muted))',
              marginBottom: 'var(--space-2)'
            }}
          >
            Objective
          </div>
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              lineHeight: 1.7,
              color: 'rgb(var(--ink))'
            }}
          >
            {objective}
          </p>
        </div>

        <div 
          className="rounded-lg p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(var(--dossier-gold), 0.35)'
          }}
        >
          <div 
            style={{
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
              color: 'rgb(var(--ink-muted))',
              marginBottom: 'var(--space-2)'
            }}
          >
            Why it matters
          </div>
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              lineHeight: 1.7,
              color: 'rgb(var(--ink))'
            }}
          >
            {why}
          </p>
        </div>

        <div 
          className="rounded-lg p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(var(--dossier-gold), 0.35)'
          }}
        >
          <div 
            style={{
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
              color: 'rgb(var(--ink-muted))',
              marginBottom: 'var(--space-3)'
            }}
          >
            Procedure
          </div>
          <ol className="space-y-3" style={{ fontSize: 'var(--text-sm)' }}>
            {procedure.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span 
                  className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center"
                  style={{
                    marginTop: '2px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    background: 'rgba(var(--dossier-gold), 0.7)',
                    color: 'rgb(var(--ink))'
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ lineHeight: 1.7, color: 'rgb(var(--ink))' }}>{step}</span>
              </li>
            ))}
          </ol>
          {hint ? (
            <p 
              style={{
                marginTop: 'var(--space-4)',
                fontSize: 'var(--text-xs)',
                fontStyle: 'italic',
                color: 'rgb(var(--ink-muted))'
              }}
            >
              <span style={{ fontWeight: 600 }}>Hint:</span> {hint}
            </p>
          ) : null}
        </div>

        {children ? (
          <div 
            className="rounded-lg p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.65)',
              border: '1px solid rgba(var(--dossier-gold), 0.4)'
            }}
          >
            {children}
          </div>
        ) : null}
        </div>
      </div>
    </div>
  );
}

export default StoryCard;
