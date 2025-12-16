"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = [
    "appearance-none select-none inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition-all",
    "active:scale-95 active:translate-y-0.5",
    disabled ? "opacity-40 cursor-not-allowed" : "hover:shadow-lg",
    className || "",
  ];

  const style: React.CSSProperties = {};
  
  if (variant === "primary") {
    // Emerald enamel with gold rim
    style.backgroundColor = "rgb(var(--emerald))";
    style.color = "rgb(var(--paper))";
    style.boxShadow = `
      inset 0 1px 2px rgba(255,255,255,0.3),
      0 0 0 2px rgba(var(--gold),0.4),
      0 8px 20px -6px rgba(16,24,40,0.12)
    `;
    style.textShadow = "0 1px 1px rgba(0,0,0,0.1)";
  }
  
  if (variant === "secondary") {
    // Paper background with gold outline, no gray
    style.backgroundColor = "rgba(255,250,240,0.85)";
    style.color = "rgb(var(--ink))";
    style.border = "1.5px solid rgba(var(--gold),0.5)";
    style.boxShadow = "inset 0 1px 2px rgba(255,255,255,0.5)";
  }
  
  if (variant === "ghost") {
    // Transparent, gold text on hover
    style.backgroundColor = "transparent";
    style.color = "rgb(var(--ink))";
    style.border = "1px solid rgba(var(--gold),0.3)";
    style.transition = "all 200ms ease";
  }

  return (
    <button {...props} disabled={disabled} className={baseClasses.filter(Boolean).join(" ")} style={style} />
  );
}

export default Button;
