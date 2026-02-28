import React from "react";
import { ArrowRight } from "lucide-react";

export function SecondaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/0 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10"
      {...props}
    >
      {children}
      <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
