"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Stratégie", href: "/strategie" },
  { label: "Digital", href: "/digital" },
  { label: "Événementiel", href: "/evenementiel" },
  { label: "Production", href: "/production" },
  { label: "Formation", href: "/formation" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06090A]/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-1.5 rounded-full bg-emerald-400" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-white">HCP</div>
              <div className="-mt-0.5 text-[11px] tracking-[0.28em] text-white/60">
                DIGITAL LABO
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition hover:text-white ${
                  pathname === item.href ? "text-emerald-400" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/#contact"
              className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/35 hover:bg-white/10 md:inline-flex"
            >
              Nous contacter
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
              aria-label="Menu"
              type="button"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute right-0 top-0 h-full w-[86%] max-w-sm border-l border-white/10 bg-[#070A0B]/90 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-1.5 rounded-full bg-emerald-400" />
                  <div className="leading-tight">
                    <div className="text-sm font-semibold tracking-wide text-white">HCP</div>
                    <div className="-mt-0.5 text-[11px] tracking-[0.28em] text-white/60">
                      DIGITAL LABO
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
                  aria-label="Fermer"
                  type="button"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="mt-8 space-y-3">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm font-semibold text-white/80 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/#contact"
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black"
                >
                  Nous contacter
                </Link>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/3 p-4">
                <div className="text-xs tracking-[0.22em] text-white/55">RAPIDE</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  Audit express + feuille de route
                </div>
                <p className="mt-2 text-sm text-white/65">
                  Un cadrage propre pour lancer vite.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
