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
    "appearance-none select-none inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition-all active:scale-[0.98] active:translate-y-[1px] focus:outline-none";

  const disabledCls = disabled
    ? "opacity-40 cursor-not-allowed"
    : "hover:brightness-[1.02]";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "relative !bg-emerald-900 !text-amber-50 ring-1 ring-amber-300/35 hover:ring-amber-200/55 shadow-[0_14px_30px_-22px_rgba(6,78,59,.95)] before:absolute before:inset-[1px] before:rounded-[14px] before:[background:linear-gradient(180deg,rgba(255,244,214,.32),transparent)] before:content-['']",

    secondary:
      "!bg-white/70 !text-slate-900 border border-amber-300/45 shadow-[inset_0_1px_0_rgba(255,244,214,.55)] hover:bg-white/85",

    ghost:
      "!bg-transparent !text-slate-900 border border-amber-300/25 hover:border-amber-300/45 hover:bg-white/40",
  };

  return (
    <button
      {...props}
      disabled={disabled}
      className={[base, variants[variant], disabledCls, className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export default Button;
