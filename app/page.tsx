"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Gauge,
  Layers,
  Wand2,
  Cpu,
  Megaphone,
  CalendarCheck2,
  Printer,
  GraduationCap,
  CheckCircle2,
  Quote,
  Briefcase,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowDivider } from "@/components/ui/glow-divider";

// HCP DIGITAL LABO — Homepage Premium v2 (Cabinet / Luxe Tech)

const process = [
  {
    n: "01",
    title: "Diagnostic",
    desc: "Cadrage, enjeux, contraintes, opportunités. Une lecture nette et actionnable.",
  },
  {
    n: "02",
    title: "Stratégie",
    desc: "Choix structurants, priorisation, KPIs. Un plan exécutable, pas un document.",
  },
  {
    n: "03",
    title: "Exécution",
    desc: "Livraison par pôle, gouvernance, jalons, qualité. Zéro flou.",
  },
  {
    n: "04",
    title: "Optimisation",
    desc: "Mesure, itérations, reporting, amélioration continue. Focus ROI.",
  },
];

const poles = [
  {
    id: "strategie",
    href: "/strategie",
    n: "01",
    icon: Megaphone,
    title: "Stratégie & Communication",
    desc: "Positionnement, branding, campagnes, communication institutionnelle, contenus premium.",
    bullets: ["Brand audit", "Plan marketing", "Communication corporate"],
  },
  {
    id: "digital",
    href: "/digital",
    n: "02",
    icon: Cpu,
    title: "Digital & Technologie",
    desc: "Web/mobile, CRM, automatisations, IA, UX/UI. Des produits robustes et maintenables.",
    bullets: ["Apps & sites", "CRM & intégrations", "Maintenance"],
  },
  {
    id: "evenementiel",
    href: "/evenementiel",
    n: "03",
    icon: CalendarCheck2,
    title: "Événementiel & Expériences",
    desc: "Événements corporate premium, scénographie, protocole, storytelling de marque.",
    bullets: ["Production", "Branding event", "Expérience VIP"],
  },
  {
    id: "production",
    href: "/production",
    n: "04",
    icon: Printer,
    title: "Production & Imprimerie",
    desc: "Supports premium : print, signalétique, packaging, goodies corporate, kits événements.",
    bullets: ["Print premium", "Signalétique", "Goodies"],
  },
  {
    id: "formation",
    href: "/formation",
    n: "05",
    icon: GraduationCap,
    title: "Formation & Transformation",
    desc: "Formations orientées résultats : marketing, outils, IA, exécution, montée en compétences.",
    bullets: ["Formations", "Ateliers", "Coaching"],
  },
];

const values = [
  {
    icon: Layers,
    title: "Structure",
    desc: "Méthode, gouvernance et livrables clairs. Vous savez où vous allez.",
  },
  {
    icon: Gauge,
    title: "Performance",
    desc: "KPI, délais, qualité. Une exécution pensée pour livrer vite et bien.",
  },
  {
    icon: ShieldCheck,
    title: "Exigence",
    desc: "Standards premium : finitions, cohérence, fiabilité, sens du détail.",
  },
  {
    icon: Sparkles,
    title: "Impact",
    desc: "Des systèmes et expériences qui transforment durablement votre marque.",
  },
];

const caseStudies = [
  {
    icon: Briefcase,
    title: "Repositionnement & kit corporate",
    kpi: "+42% de conversion",
    desc: "Identité, messages, supports, parcours. Alignement total et exécution rapide.",
  },
  {
    icon: TrendingUp,
    title: "CRM + automatisations",
    kpi: "-35% de temps support",
    desc: "Centralisation, workflows, templates, reporting. Une machine de performance.",
  },
  {
    icon: BarChart3,
    title: "Événement premium brandé",
    kpi: "+2x leads qualifiés",
    desc: "Concept, scénographie, production, contenus. Une expérience mémorable.",
  },
];

const testimonials = [
  {
    name: "Directeur Marketing",
    role: "Entreprise — Secteur services",
    quote:
      "Une approche structurée, une exécution propre et des livrables premium. On voit la différence.",
  },
  {
    name: "DRH",
    role: "Institution",
    quote:
      "Leur force : cadrer vite, livrer avec méthode, et rester orientés résultats.",
  },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium tracking-[0.24em] text-emerald-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {children}
    </span>
  );
}

function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_60px_-20px_rgba(16,185,129,0.6)] transition hover:-translate-y-0.5 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
      {...props}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

function SecondaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3.5 px-5 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div className="text-2xl font-semibold tracking-tight text-emerald-300">
        {value}
      </div>
      <div className="mt-1 text-xs text-white/60">{label}</div>
    </div>
  );
}

function SectionTitle({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) {
  return (
    <div>
      <div className="text-xs font-semibold tracking-[0.26em] text-emerald-300">
        {kicker}
      </div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {desc ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
          {desc}
        </p>
      ) : null}
    </div>
  );
}

function PremiumCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18),transparent_55%)]" />
      </div>
      {children}
    </div>
  );
}

export default function HcpDigitalLaboHomePremiumV2() {
  return (
    <div className="bg-[#06090A] text-white">
      {/* Background: ultra subtle grid + luxe glow + vignette */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-size-[56px_56px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.45)_75%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.30%22/%3E%3C/svg%3E')] opacity-[0.03] mix-blend-soft-light" />
      </div>

      {/* Hero v2: Luxe split + "signature" badge */}
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-14 md:pb-20 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="flex flex-wrap items-center gap-3">
                <Pill>TRANSFORMATION STRATÉGIQUE</Pill>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-white/60">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                  STANDARD PREMIUM
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
                La maison où
                <span className="block">la stratégie devient</span>
                <span className="block text-emerald-300">exécution.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
                HCP Digital Labo conçoit et déploie des systèmes de communication et de performance.
                Cinq pôles intégrés — un pilotage clair, des livrables premium, des résultats.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#expertises"><PrimaryButton>Découvrir nos expertises</PrimaryButton></a>
                <a href="#contact"><SecondaryButton>Parler à un expert</SecondaryButton></a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat value="5" label="Pôles intégrés" />
                <Stat value="150+" label="Missions livrées" />
                <Stat value="98%" label="Satisfaction" />
                <Stat value="10+" label="Années" />
              </div>
            </motion.div>
          </div>

          {/* Hero right: "glass" panel + animated edge */}
          <div className="md:col-span-5">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="group relative">
              <div className="pointer-events-none absolute -inset-px rounded-[26px] bg-linear-to-b from-emerald-400/35 via-white/10 to-transparent opacity-70 blur-[0.2px]" />
              <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                    alt="Bureau premium" 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-60"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#06090A] to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                        <Wand2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Cadrage → Livraison → KPI</div>
                        <div className="text-xs text-white/60">Un flux d’exécution sans friction.</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold text-white/60">
                      7 jours
                    </span>
                  </div>

                  <div className="mt-5"><GlowDivider /></div>

                  <div className="mt-5 space-y-3 text-sm text-white/70">
                    {[
                      "Gouvernance & jalons clairs",
                      "Design premium & cohérence de marque",
                      "Livrables traçables (KPI / reporting)",
                      "Équipes spécialisées par pôle",
                    ].map((t) => (
                      <div key={t} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs tracking-[0.22em] text-white/55 uppercase">Offre démarrage</div>
                    <div className="mt-1 text-sm font-semibold text-white">Audit express + feuille de route</div>
                    <p className="mt-2 text-sm text-white/65">
                      Une base solide pour prioriser, chiffrer et lancer.
                    </p>
                    <div className="mt-3">
                      <Link href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                        Demander un rendez-vous <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Logo strip (premium placeholders) */}
        <div className="mt-14">
          <div className="text-xs font-semibold tracking-[0.26em] text-white/55">ILS NOUS FONT CONFIANCE</div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/2 text-[11px] font-semibold tracking-[0.26em] text-white/35">
                LOGO
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#F6F7F8] py-14 text-[#0B0D0E]">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs font-semibold tracking-[0.26em] text-emerald-700">NOTRE MÉTHODE</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Une exécution pilotée, mesurée, optimisée</h2>
              <p className="mt-3 max-w-2xl text-sm text-black/60">Un cadre clair pour livrer vite, proprement, puis améliorer en continu.</p>
            </div>
            <div className="hidden md:block">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Standards premium
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {process.map((p) => (
              <div key={p.n} className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.45)] transition hover:-translate-y-1">
                <div className="absolute -right-3 -top-6 text-7xl font-semibold text-black/4">{p.n}</div>
                <div className="text-xs font-semibold tracking-[0.26em] text-emerald-700">{p.n}</div>
                <div className="mt-3 text-lg font-semibold">{p.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-black/60">{p.desc}</p>
                <div className="mt-4 h-px w-full bg-black/5" />
                <div className="mt-4 text-sm font-semibold text-emerald-700">En savoir plus</div>
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.14),transparent_55%)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertises */}
      <section id="expertises" className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            kicker="NOS EXPERTISES"
            title="Cinq pôles — une seule vision"
            desc="Une approche intégrée : stratégie → production → déploiement. Cohérence, vitesse, qualité."
          />
          <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            Démarrer un projet <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {poles.map((p) => {
            const Icon = p.icon;
            return (
              <Link key={p.id} href={p.href} className="group">
                <PremiumCard className="p-0 transition hover:-translate-y-1 hover:border-emerald-400/35 h-full overflow-hidden">
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image 
                      src={p.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"} 
                      alt={p.title} 
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-50"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#06090A] to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 backdrop-blur-md border border-white/10">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold tracking-[0.26em] text-white/55">{p.n}</div>
                        <div className="mt-1 text-base font-semibold">{p.title}</div>
                      </div>
                      <ArrowRight className="mt-2 h-4 w-4 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-white/70">{p.desc}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.bullets.map((b) => (
                        <span key={b} className="rounded-full border border-white/10 bg-white/2 px-3 py-1 text-[11px] font-semibold text-white/60">
                          {b}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">Découvrir le pôle</div>
                  </div>
                </PremiumCard>
              </Link>
            );
          })}

          <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold tracking-[0.26em] text-emerald-200/80">UN PROJET EN TÊTE ?</div>
                <div className="mt-1 text-base font-semibold text-white">Parlons de votre vision.</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/80">Une proposition structurée : périmètre, jalons, budget, délais.</p>
            <div className="mt-6">
              <a href="#contact">
                <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0B0D0E] transition hover:-translate-y-0.5">
                  Nous contacter <ArrowRight className="h-4 w-4" />
                </button>
              </a>
            </div>
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="bg-black/35 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle
            kicker="ÉTUDES DE CAS"
            title="Du concret. Des KPI."
            desc="Des exemples de missions typiques — même méthode, même exigence."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {caseStudies.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="group">
                  <PremiumCard className="p-6 transition hover:-translate-y-1 hover:border-emerald-400/30">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-base font-semibold text-white">{c.title}</div>
                      </div>
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                        {c.kpi}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-white/70">{c.desc}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                      Voir le format de mission <ArrowRight className="h-4 w-4" />
                    </div>
                  </PremiumCard>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ADN */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionTitle
                kicker="NOTRE ADN"
                title="Une approche globale pour un impact réel"
                desc="HCP Digital Labo n’est pas une simple agence. C’est un laboratoire d’exécution premium : stratégie, production, déploiement et optimisation — sous une gouvernance claire."
              />

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                  <div className="text-2xl font-semibold text-emerald-300">360</div>
                  <div className="mt-1 text-xs text-white/60">Couverture</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                  <div className="text-2xl font-semibold text-emerald-300">5</div>
                  <div className="mt-1 text-xs text-white/60">Pôles</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                  <div className="text-2xl font-semibold text-emerald-300">1</div>
                  <div className="mt-1 text-xs text-white/60">Vision</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-4 md:grid-cols-2">
                {values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div key={v.title} className="group">
                      <PremiumCard className="p-6 transition hover:-translate-y-1 hover:border-emerald-400/30">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-base font-semibold text-white">{v.title}</div>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">{v.desc}</p>
                        <div className="mt-5 h-px w-full bg-white/10" />
                        <div className="mt-4 text-sm font-semibold text-emerald-300">Standard HCP</div>
                      </PremiumCard>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-black/35 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle kicker="TÉMOIGNAGES" title="Une qualité qui se ressent" desc="Ce que nos clients retiennent : cadrage, exécution, finitions." />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.name} className="group">
                <PremiumCard className="p-6 transition hover:-translate-y-1 hover:border-emerald-400/25">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                      <Quote className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-relaxed text-white/80">“{t.quote}”</p>
                      <div className="mt-4 text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-white/60">{t.role}</div>
                    </div>
                  </div>
                </PremiumCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-white/10 bg-[#06090A] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="text-xs font-semibold tracking-[0.26em] text-emerald-300">CONTACT</div>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">Parlons de votre projet</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Décrivez votre besoin : nous revenons avec une proposition structurée (périmètre, jalons, budget, délais).
              </p>

              <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-white/3 p-6">
                <div className="text-sm text-white"><span className="text-white/60">Email :</span> <span className="font-semibold">contact@hcp-digitallabo.com</span></div>
                <div className="text-sm text-white"><span className="text-white/60">Téléphone :</span> <span className="font-semibold">+225 XX XX XX XX XX</span></div>
                <div className="text-sm text-white"><span className="text-white/60">Localisation :</span> <span className="font-semibold">Abidjan, Côte d’Ivoire</span></div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-white/3 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">Nom</label>
                    <input className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">Téléphone</label>
                    <input className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40" placeholder="+225 ..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">Besoin</label>
                    <textarea className="mt-2 min-h-30 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40" placeholder="Objectif, délai, budget indicatif" />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-white/50">Réponse sous 24–48h ouvrées.</div>
                  <PrimaryButton>Envoyer</PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
