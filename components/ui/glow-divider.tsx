import React from "react";

export function GlowDivider() {
  return (
    <div className="relative">
      <div className="h-px w-full bg-white/10" />
      <div className="pointer-events-none absolute inset-0 h-px w-full bg-linear-to-r from-transparent via-emerald-400/40 to-transparent" />
    </div>
  );
}
