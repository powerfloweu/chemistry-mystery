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
      "relative bg-gradient-to-b from-emerald-900 to-emerald-950 text-amber-50 border-2 border-amber-600/60 shadow-lg hover:border-amber-500/80 hover:shadow-xl transition-all",

    secondary:
      "relative bg-gradient-to-b from-amber-100 to-amber-200 text-slate-900 border-2 border-amber-700/50 shadow-md hover:from-amber-200 hover:to-amber-300 hover:border-amber-700/70",

    ghost:
      "bg-transparent text-slate-900 border-2 border-amber-700/40 hover:border-amber-700/60 hover:bg-amber-50/40",
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
