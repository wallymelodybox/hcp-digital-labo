"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlowDivider } from "./ui/glow-divider";

const poles = [
  { id: "strategie", title: "Stratégie & Communication" },
  { id: "digital", title: "Digital & Technologie" },
  { id: "evenementiel", title: "Événementiel & Expériences" },
  { id: "production", title: "Production & Imprimerie" },
  { id: "formation", title: "Formation & Transformation" },
];

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Stratégie", href: "/#strategie" },
  { label: "Digital", href: "/#digital" },
  { label: "Événementiel", href: "/#evenementiel" },
  { label: "Production", href: "/#production" },
  { label: "Formation", href: "/#formation" },
];

export function Footer() {
  const pathname = usePathname();
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="border-t border-white/10 bg-[#050607] text-white">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-1.5 rounded-full bg-emerald-400" />
              <div>
                <div className="text-sm font-semibold tracking-wide">HCP</div>
                <div className="-mt-0.5 text-[11px] tracking-[0.28em] text-white/60">DIGITAL LABO</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/60">
              Votre partenaire structurant pour la stratégie, le digital, l’événementiel, la production et la formation.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold tracking-[0.26em] text-white/60 uppercase">NOS PÔLES</div>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              {poles.map((p) => (
                <Link key={p.id} href={`/#${p.id}`} className="block hover:text-white transition-colors">
                  {p.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold tracking-[0.26em] text-white/60 uppercase">NAVIGATION</div>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              {navLinks.map((n) => (
                <Link key={n.href} href={n.href} className="block hover:text-white transition-colors">
                  {n.label}
                </Link>
              ))}
              <Link href="/#contact" className="block hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-semibold tracking-[0.26em] text-white/60 uppercase">CONTACT</div>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              <div className="text-emerald-300">contact@hcp-digitallabo.com</div>
              <div>+225 XX XX XX XX XX</div>
              <div>Abidjan, Côte d’Ivoire</div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <GlowDivider />
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <div>© {year} HCP Digital Labo. Tous droits réservés.</div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
