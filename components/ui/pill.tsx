import React from "react";

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1 text-[11px] font-medium tracking-[0.24em] text-blue-200">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
      {children}
    </span>
  );
}
