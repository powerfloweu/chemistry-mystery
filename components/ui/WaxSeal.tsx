"use client";

// DEPRECATED
// This SVG-based WaxSeal is no longer used.
// The app now uses the image-based <WaxSealButton /> instead.
// This component is kept only to avoid breaking old imports.

import React from "react";

type WaxSealProps = {
  text?: string;
  size?: number;           // px
  className?: string;
  rotateDeg?: number;      // subtle rotation looks more natural
  tone?: "emerald" | "forest";
};

export function WaxSeal({
  size = 118,
  className = "",
  rotateDeg = -6,
  tone = "emerald",
}: WaxSealProps) {
  const id = React.useId(); // unique ids for gradients/filters

  return null;
}

export default WaxSeal;