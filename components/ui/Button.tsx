"use client";

import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "appearance-none select-none inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold transition-all active:scale-[0.98] active:translate-y-[1px] focus:outline-none";

  const disabledCls = disabled
    ? "opacity-40 cursor-not-allowed"
    : "hover:brightness-[1.02]";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "relative border-2 border-amber-900/80 shadow-lg hover:border-amber-900 hover:shadow-xl transition-all",

    secondary:
      "relative border-2 border-amber-700/50 shadow-md hover:border-amber-700/70",

    ghost:
      "border-2 border-amber-700/60 hover:border-amber-700/80 shadow-md",
  };

  const bgStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(to bottom, #b45309, #92400e)',
      fontFamily: 'Georgia, "Times New Roman", serif',
      letterSpacing: '0.04em',
      color: '#d4af37',
      textShadow: '0 1px 0 #3d2817, 0 0 12px rgba(212,175,55,0.8)',
    },
    secondary: {
      background: 'linear-gradient(to bottom, #fef3c7, #fde68a)',
      fontFamily: 'Georgia, "Times New Roman", serif',
      letterSpacing: '0.04em',
      color: '#92400e',
      textShadow: '0 1px 2px rgba(255,255,255,0.8)',
    },
    ghost: {
      background: 'linear-gradient(to bottom, #fde68a, #fcd34d)',
      fontFamily: 'Georgia, "Times New Roman", serif',
      letterSpacing: '0.04em',
      color: '#92400e',
      textShadow: '0 1px 2px rgba(255,255,255,0.8)',
    },
  };

  return (
    <button
      {...props}
      disabled={disabled}
      className={[base, variants[variant], disabledCls, className]
        .filter(Boolean)
        .join(" ")}
      style={{ ...bgStyles[variant], ...props.style }}
    />
  );
}

export default Button;
