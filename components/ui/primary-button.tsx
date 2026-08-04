import React from "react";
import { ArrowRight } from "lucide-react";

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_60px_-20px_rgba(37,99,235,0.6)] transition hover:-translate-y-0.5 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
      {...props}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
