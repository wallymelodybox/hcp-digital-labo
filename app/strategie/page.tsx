"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Megaphone,
  CheckCircle2,
  HelpCircle,
  Briefcase,
  TrendingUp,
  BarChart3,
  Quote,
  FileText,
  Target,
  PenTool,
  LineChart,
  Wand2,
} from "lucide-react";
import { GlowDivider } from "../../components/ui/glow-divider";
import { Pill } from "../../components/ui/pill";
import { PrimaryButton } from "../../components/ui/primary-button";
import { SecondaryButton } from "../../components/ui/secondary-button";
import { PremiumCard } from "../../components/ui/premium-card";
import { SectionTitle } from "../../components/ui/section-title";



const offers = [
  {
    icon: Target,
    title: "Positionnement & Messages",
    desc: "Clarifier votre proposition de valeur, vos cibles et vos messages clés. Aligner l’équipe sur une direction unique.",
    bullets: ["Proposition de valeur", "Personas", "Message house"],
  },
  {
    icon: PenTool,
    title: "Branding & Identité",
    desc: "Consolider une identité premium : ton, codes, charte et système visuel cohérent sur tous les supports.",
    bullets: ["Audit marque", "Charte", "Système visuel"],
  },
  {
    icon: LineChart,
    title: "Plan Marketing & Go-to-market",
    desc: "Construire un plan exécutable avec priorités, calendrier, budget, canaux, et KPIs suivis.",
    bullets: ["Roadmap", "Canaux", "KPI"],
  },
  {
    icon: FileText,
    title: "Communication Corporate",
    desc: "Structurer vos contenus et prises de parole : institutionnel, partenaires, RH, communication interne.",
    bullets: ["Narratif", "Contenus", "Templates"],
  },
];

const method = [
  {
    n: "01",
    title: "Diagnostic",
    desc: "Analyse de l’existant, marché, concurrence, perception, performance des canaux et cohérence des supports.",
  },
  {
    n: "02",
    title: "Choix stratégiques",
    desc: "Positionnement, cibles, messages, différenciation. On tranche et on priorise.",
  },
  {
    n: "03",
    title: "Système & livrables",
    desc: "Charte, kit communication, templates, plan marketing, parcours, contenus et guidelines d’exécution.",
  },
  {
    n: "04",
    title: "Déploiement & pilotage",
    desc: "Accompagnement à l’exécution, suivi KPI, optimisation continue, gouvernance légère et efficace.",
  },
];

const deliverables = [
  {
    title: "Brand Audit (diagnostic)",
    desc: "Forces/faiblesses, incohérences, opportunités, recommandations priorisées.",
  },
  {
    title: "Message House",
    desc: "Piliers, preuves, tonalité, argumentaires : une communication alignée et stable.",
  },
  {
    title: "Charte & Système visuel",
    desc: "Règles d’usage, typographies, couleurs, iconographie, composants.",
  },
  {
    title: "Plan Marketing (90 jours)",
    desc: "Actions, calendrier, canaux, budget, KPI, responsabilités.",
  },
  {
    title: "Kit Communication",
    desc: "Templates posts, présentations, doc corporate, signatures, visuels.",
  },
  {
    title: "Tableau de bord KPI",
    desc: "Mesure, reporting, rituels de pilotage et optimisation.",
  },
];

const caseStudies = [
  {
    icon: Briefcase,
    title: "Repositionnement marque",
    kpi: "+42% conversion",
    desc: "Refonte messages + kit corporate + templates : plus de clarté, plus de cohérence.",
  },
  {
    icon: TrendingUp,
    title: "Plan marketing 90 jours",
    kpi: "+2x leads",
    desc: "Priorisation, calendrier, contenus, KPIs — lancement structuré et suivi hebdo.",
  },
  {
    icon: BarChart3,
    title: "Pilotage KPI",
    kpi: "-30% coûts",
    desc: "Mesure, arbitrages, itérations : on coupe le bruit, on renforce ce qui marche.",
  },
];

const testimonials = [
  {
    name: "Directeur Marketing",
    role: "Entreprise — Secteur services",
    quote:
      "Le cadrage a été décisif : messages plus nets, charte propre, et un plan réellement exécutable.",
  },
  {
    name: "DG",
    role: "PME — Croissance",
    quote:
      "Enfin une stratégie qui se traduit en livrables et en actions. Simple, clair, mesurable."
  },
];

const faqs = [
  {
    q: "En combien de temps peut-on sortir une stratégie ?",
    a: "Selon le périmètre : 7 à 21 jours ouvrés. Le format ‘Audit express + feuille de route’ est le plus rapide.",
  },
  {
    q: "Vous faites la stratégie seulement ou aussi l’exécution ?",
    a: "Les deux. La stratégie est conçue pour être exécutée. Nous pouvons déployer via nos pôles (digital, production, event, etc.).",
  },
  {
    q: "Est-ce adapté à une petite entreprise ?",
    a: "Oui. Nous ajustons le niveau de profondeur et les livrables pour rester utiles et rentables. L’objectif : ROI.",
  },
  {
    q: "Qu’est-ce que je reçois concrètement ?",
    a: "Des livrables actionnables : messages, charte, templates, plan marketing, KPIs — plus une roadmap claire.",
  },
];

export default function StrategiePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const year = new Date().getFullYear();

  return (
    <div id="top" className="min-h-screen bg-[#06090A] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-size-[56px_56px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.45)_75%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.30%22/%3E%3C/svg%3E')] mix-blend-soft-light" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-14 md:pb-20 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="flex flex-wrap items-center gap-3">
                <Pill>STRATÉGIE & COMMUNICATION</Pill>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-white/60">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                  CABINET PREMIUM
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
                Des messages clairs.
                <span className="block">Une identité forte.</span>
                <span className="block text-emerald-300">Un plan exécutable.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
                Nous cadrons votre marque et votre communication comme un système : positionnement, identité, plan marketing,
                contenus et pilotage KPI. Objectif : impact mesurable.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#offres"><PrimaryButton>Voir nos offres</PrimaryButton></a>
                <a href="#contact"><SecondaryButton>Demander un audit</SecondaryButton></a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { v: "7–21j", l: "Délais" },
                  { v: "90j", l: "Plan d’action" },
                  { v: "KPI", l: "Pilotage" },
                  { v: "Premium", l: "Finitions" },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border border-white/10 bg-white/3.5 px-5 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    <div className="text-2xl font-semibold tracking-tight text-emerald-300">{s.v}</div>
                    <div className="mt-1 text-xs text-white/60">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-5">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="group relative">
              <div className="pointer-events-none absolute -inset-px rounded-[26px] bg-linear-to-b from-emerald-400/35 via-white/10 to-transparent opacity-70 blur-0" />
              <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" 
                    alt="Stratégie et Analyse" 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-60"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#06090A] to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Livrables concrets</div>
                      <div className="text-xs text-white/60">Pas de blabla : du prêt-à-exécuter.</div>
                    </div>
                  </div>

                  <div className="mt-5"><GlowDivider /></div>

                  <div className="mt-5 space-y-3 text-sm text-white/70">
                    {[
                      "Message house + argumentaires",
                      "Charte + templates premium",
                      "Plan marketing 90 jours",
                      "Tableau de bord KPI",
                    ].map((t) => (
                      <div key={t} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs tracking-[0.22em] text-white/55">FORMAT RAPIDE</div>
                    <div className="mt-1 text-sm font-semibold text-white">Audit express + feuille de route</div>
                    <p className="mt-2 text-sm text-white/65">Pour prioriser et lancer sans perdre de temps.</p>
                    <div className="mt-3">
                      <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                        Réserver un échange <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Offres */}
      <section id="offres" className="mx-auto max-w-6xl px-5 pb-6">
        <SectionTitle
          kicker="NOS OFFRES"
          title="Une stratégie pensée pour être exécutée"
          desc="Nous structurons votre communication comme un système : clair, cohérent, mesurable."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {offers.map((o) => {
            const Icon = o.icon;
            return (
              <div key={o.title} className="group">
                <PremiumCard className="p-6 transition hover:-translate-y-1 hover:border-emerald-400/35">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-base font-semibold">{o.title}</div>
                        <div className="mt-1 text-sm text-white/65">{o.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className="mt-2 h-4 w-4 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {o.bullets.map((b) => (
                      <span key={b} className="rounded-full border border-white/10 bg-white/2 px-3 py-1 text-[11px] font-semibold text-white/60">
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                    Découvrir le format <ArrowRight className="h-4 w-4" />
                  </div>
                </PremiumCard>
              </div>
            );
          })}
        </div>
      </section>

      {/* Méthode */}
      <section className="bg-[#F6F7F8] py-14 text-[#0B0D0E]">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs font-semibold tracking-[0.26em] text-emerald-700">NOTRE MÉTHODE</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">De l’analyse à l’exécution</h2>
              <p className="mt-3 max-w-2xl text-sm text-black/60">Chaque livrable sert une action. Chaque action sert un KPI.</p>
            </div>
            <div className="hidden md:block">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
                <Wand2 className="h-4 w-4 text-emerald-600" />
                Exécution premium
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {method.map((m) => (
              <div key={m.n} className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.45)] transition hover:-translate-y-1">
                <div className="absolute -right-3 -top-6 text-7xl font-semibold text-black/4">{m.n}</div>
                <div className="text-xs font-semibold tracking-[0.26em] text-emerald-700">{m.n}</div>
                <div className="mt-3 text-lg font-semibold">{m.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-black/60">{m.desc}</p>
                <div className="mt-4 h-px w-full bg-black/5" />
                <div className="mt-4 text-sm font-semibold text-emerald-700">Détail</div>
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.14),transparent_55%)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Livrables */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionTitle
          kicker="LIVRABLES"
          title="Ce que vous recevez"
          desc="Des documents et assets directement utilisables par vos équipes — sans réinterprétation."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {deliverables.map((d) => (
            <div key={d.title} className="group">
              <PremiumCard className="p-6 transition hover:-translate-y-1 hover:border-emerald-400/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="text-base font-semibold">{d.title}</div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{d.desc}</p>
                <div className="mt-5 h-px w-full bg-white/10" />
                <div className="mt-4 text-sm font-semibold text-emerald-300">Format premium</div>
              </PremiumCard>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section className="bg-black/35 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle kicker="RÉSULTATS" title="Du concret. Des KPI." desc="Même approche : cadrage, livrables, actions, mesure." />

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
                        <div className="text-base font-semibold">{c.title}</div>
                      </div>
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">{c.kpi}</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-white/70">{c.desc}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                      Voir le format <ArrowRight className="h-4 w-4" />
                    </div>
                  </PremiumCard>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle kicker="TÉMOIGNAGES" title="Une stratégie qui se ressent" desc="Cadrage net, livrables propres, exécution pilotée." />

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
                      <div className="mt-4 text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-white/60">{t.role}</div>
                    </div>
                  </div>
                </PremiumCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-black/35 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle kicker="FAQ" title="Questions fréquentes" desc="Réponses rapides, décisions rapides." />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={f.q} className="group">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left"
                  >
                    <PremiumCard className="p-6 transition hover:-translate-y-1 hover:border-emerald-400/25">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                            <HelpCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-base font-semibold">{f.q}</div>
                            <AnimatePresence>
                              {isOpen ? (
                                <motion.p
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="mt-3 overflow-hidden text-sm leading-relaxed text-white/70"
                                >
                                  {f.a}
                                </motion.p>
                              ) : null}
                            </AnimatePresence>
                          </div>
                        </div>
                        <span className="mt-2 text-white/45">{isOpen ? "—" : "+"}</span>
                      </div>
                    </PremiumCard>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-[#06090A] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-black/20 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-emerald-200">
                  <ShieldCheck className="h-4 w-4" />
                  CADRAGE PREMIUM
                </div>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight">On démarre par un audit ?</h3>
                <p className="mt-3 max-w-2xl text-sm text-white/80">
                  Un échange court, une analyse, puis une feuille de route claire (actions, délais, KPI). Vous décidez ensuite.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a href="#contact"><PrimaryButton>Demander un audit</PrimaryButton></a>
                <a href="#offres"><SecondaryButton>Voir les offres</SecondaryButton></a>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-white/10 bg-[#050607] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="text-xs font-semibold tracking-[0.26em] text-emerald-300">CONTACT</div>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight">Parlons de votre marque</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Décrivez votre besoin : nous revenons avec une proposition structurée (périmètre, jalons, budget, délais).
              </p>

              <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-white/3 p-6">
                <div className="text-sm"><span className="text-white/60">Email :</span> <span className="font-semibold">contact@hcp-digitallabo.com</span></div>
                <div className="text-sm"><span className="text-white/60">Téléphone :</span> <span className="font-semibold">+225 XX XX XX XX XX</span></div>
                <div className="text-sm"><span className="text-white/60">Localisation :</span> <span className="font-semibold">Abidjan, Côte d’Ivoire</span></div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-white/3 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold tracking-[0.22em] text-white/60">Nom</label>
                    <input className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-[0.22em] text-white/60">Téléphone</label>
                    <input className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40" placeholder="+225 ..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold tracking-[0.22em] text-white/60">Besoin</label>
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
