"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { computeCountdown } from "@/lib/formation-offers";

function Digit({ value }: { value: number }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-blue-400/30 bg-blue-500/10 sm:h-14 sm:w-14">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={display}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="text-xl font-bold tabular-nums text-blue-200 sm:text-2xl"
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function CountdownTimer({ target, onExpire }: { target: string; onExpire?: () => void }) {
  const [countdown, setCountdown] = useState(() => computeCountdown(target));

  useEffect(() => {
    const interval = setInterval(() => {
      const next = computeCountdown(target);
      setCountdown(next);
      if (!next) onExpire?.();
    }, 1000);

    return () => clearInterval(interval);
  }, [target, onExpire]);

  if (!countdown) return null;

  const units = [
    { label: "Jours", value: countdown.days },
    { label: "Heures", value: countdown.hours },
    { label: "Min", value: countdown.minutes },
    { label: "Sec", value: countdown.seconds },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center gap-1">
            <Digit value={unit.value} />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/45">{unit.label}</span>
          </div>
          {idx < units.length - 1 ? <span className="pb-4 text-lg font-bold text-blue-400/50">:</span> : null}
        </div>
      ))}
    </div>
  );
}
