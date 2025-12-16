"use client";

import React from "react";

export function Folio({
  label,
  title,
  note,
  children,
  className = "",
}: {
  label?: string;
  title?: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div 
      className={`relative rounded-3xl overflow-visible ${className}`} 
      style={{
        background: 'linear-gradient(135deg, rgba(255,250,240,0.85) 0%, rgba(255,250,240,0.75) 100%)',
        border: '2px solid rgba(var(--gold),0.25)',
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), 0 12px 32px -8px rgba(0,0,0,0.1)'
      }}
    >
      {/* Metallic edge gradient (top, very subtle) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{background: 'linear-gradient(90deg, transparent, rgba(var(--gold),0.4), transparent)'}} />

      {/* Micro diamond dust near top (three tiny specular dots) */}
      <div className="pointer-events-none absolute top-6 left-8 w-1 h-1 rounded-full" style={{background: 'rgba(var(--gold),0.3)'}} />
      <div className="pointer-events-none absolute top-5 right-12 w-0.5 h-0.5 rounded-full" style={{background: 'rgba(var(--gold),0.25)'}} />
      <div className="pointer-events-none absolute top-8 right-8 w-1 h-1 rounded-full" style={{background: 'rgba(var(--gold),0.2)'}} />

      <div className="relative z-10 p-7">
        {/* Header: label, title, note + rule */}
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <div className="flex-1">
            {label ? (
              <div className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{color: 'rgba(var(--gold),0.8)'}}>
                {label}
              </div>
            ) : null}
            {title ? (
              <h2 
                className="text-3xl sm:text-4xl font-serif font-bold mt-1" 
                style={{color: 'rgb(var(--ink))', letterSpacing: '0.01em'}}
              >
                {title}
              </h2>
            ) : null}
            {note ? (
              <div className="italic text-sm mt-2" style={{color: 'rgba(var(--ink),0.65)'}}>
                {note}
              </div>
            ) : null}
          </div>
          
          {/* Gold → Emerald accent rule */}
          <div className="ml-4 flex-shrink-0">
            <div 
              className="w-12 h-1 rounded-full" 
              style={{background: 'linear-gradient(90deg, rgba(var(--gold),0.95), rgba(var(--emerald),0.7))'}} 
            />
          </div>
        </div>

        {/* Inner paper panel with embossed inset shadow */}
        <div 
          className="mt-4 rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(255,250,240,0.95) 0%, rgba(255,250,240,0.9) 100%)',
            border: '1.5px solid rgba(var(--gold),0.2)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -1px 2px rgba(0,0,0,0.02)'
          }}
        >
          {children}
        </div>
      </div>

      {/* Gilded corner ornaments */}
      <div className="pointer-events-none absolute left-5 top-5 h-4 w-4 border-l-2 border-t-2" style={{borderColor: 'rgba(var(--gold),0.6)'}} />
      <div className="pointer-events-none absolute right-5 top-5 h-4 w-4 border-r-2 border-t-2" style={{borderColor: 'rgba(var(--gold),0.6)'}} />
      <div className="pointer-events-none absolute left-5 bottom-5 h-4 w-4 border-l-2 border-b-2" style={{borderColor: 'rgba(var(--gold),0.6)'}} />
      <div className="pointer-events-none absolute right-5 bottom-5 h-4 w-4 border-r-2 border-b-2" style={{borderColor: 'rgba(var(--gold),0.6)'}} />

      {/* Subtle emerald + gold blooms */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-800/6 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-52 w-52 rounded-full bg-amber-700/6 blur-3xl" />
    </div>
  );
}

export default Folio;
