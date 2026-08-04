"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { GlowDivider } from "./ui/glow-divider";
import { poles } from "@/lib/poles-data";
import { siteContact } from "@/lib/site-data";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Expertises", href: "/#expertises" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="public-theme border-t border-blue-950/10 bg-[#eef2f7] text-blue-950">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-1.5 rounded-full bg-blue-500" />
              <div>
                <div className="text-sm font-semibold tracking-wide">HCP</div>
                <div className="-mt-0.5 text-[11px] tracking-[0.28em] text-blue-950/55">DIGITAL LABO</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-blue-950/65">
              Votre partenaire structurant pour la strategie, le digital, l'evenementiel, la production, la formation, la livraison et le VTC.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold tracking-[0.26em] text-blue-950/50 uppercase">NOS POLES</div>
            <div className="mt-4 space-y-2 text-sm text-blue-950/65">
              {poles.map((pole) => (
                <Link key={pole.id} href={pole.slug} className="block transition-colors hover:text-blue-950">
                  {pole.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold tracking-[0.26em] text-blue-950/50 uppercase">NAVIGATION</div>
            <div className="mt-4 space-y-2 text-sm text-blue-950/65">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block transition-colors hover:text-blue-950">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-semibold tracking-[0.26em] text-blue-950/50 uppercase">CONTACT</div>
            <div className="mt-4 space-y-2 text-sm text-blue-950/65">
              <div className="text-blue-600">{siteContact.email}</div>
              <div>{siteContact.phone}</div>
              <div>{siteContact.location}</div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <GlowDivider />
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs text-blue-950/45 md:flex-row md:items-center md:justify-between">
          <div>© {year} HCP Digital Labo. Tous droits reserves.</div>
          <div className="flex items-center gap-4">
            <Link href="#" className="transition-colors hover:text-blue-950">Mentions legales</Link>
            <Link href="#" className="transition-colors hover:text-blue-950">Politique de confidentialite</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
