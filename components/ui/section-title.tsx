import React from "react";

export function SectionTitle({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) {
  return (
    <div>
      <div className="text-xs font-semibold tracking-[0.26em] text-emerald-300">{kicker}</div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {desc ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">{desc}</p>
      ) : null}
    </div>
  );
}
