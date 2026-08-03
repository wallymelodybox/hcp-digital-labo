"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Quote,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { poles } from "@/lib/poles-data";
import { adminOperationalItems, homeProcess, siteContact, siteMetrics } from "@/lib/site-data";
import { GlowDivider } from "@/components/ui/glow-divider";
import { Pill } from "@/components/ui/pill";
import { PremiumCard } from "@/components/ui/premium-card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { SectionTitle } from "@/components/ui/section-title";
import { ContactForm } from "@/components/contact-form";
import { useSiteImages } from "@/hooks/use-site-images";

const proofItems = [
  "Gouvernance et jalons clairs",
  "Livrables coherents sur tous les points de contact",
  "Pilotage par KPI et reporting lisible",
  "Experts mobilises selon le besoin reel",
];

const testimonials = [
  {
    name: "Direction marketing",
    role: "Entreprise de services",
    quote: "Une approche structuree, une execution propre et des livrables directement utilisables.",
  },
  {
    name: "Direction generale",
    role: "PME en croissance",
    quote: "Le cadrage nous a permis de prioriser vite et de lancer avec une feuille de route claire.",
  },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div className="text-2xl font-semibold tracking-tight text-emerald-300">{value}</div>
      <div className="mt-1 text-xs text-white/60">{label}</div>
    </div>
  );
}

export default function HomePage() {
  const siteImages = useSiteImages();

  return (
    <div className="public-theme min-h-screen bg-[#06090A] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-size-[56px_56px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.45)_75%)]" />
      </div>

      <section className="mx-auto max-w-6xl px-5 pb-14 pt-14 md:pb-20 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="flex flex-wrap items-center gap-3">
                <Pill>TRANSFORMATION STRATEGIQUE</Pill>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-white/60">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                  STANDARD PREMIUM
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
                HCP Digital Labo
                <span className="block">transforme vos idees</span>
                <span className="block text-emerald-300">en execution mesurable.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
                Cinq poles integres pour cadrer, produire, deployer et optimiser vos projets de marque, de digital, d'evenementiel, de production et de formation.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="#expertises"><PrimaryButton>Decouvrir nos expertises</PrimaryButton></Link>
                <Link href="/contact"><SecondaryButton>Parler a un expert</SecondaryButton></Link>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
                {siteMetrics.map((metric) => (
                  <Stat key={metric.label} value={metric.value} label={metric.label} />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-5">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="group relative">
              <div className="pointer-events-none absolute -inset-px rounded-[26px] bg-linear-to-b from-emerald-400/35 via-white/10 to-transparent opacity-70" />
              <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={siteImages.homeHero || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"}
                    alt="Espace de travail HCP Digital Labo"
                    fill
                    priority
                    className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#06090A] to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                      <Wand2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Cadrage - Livraison - KPI</div>
                      <div className="text-xs text-white/60">Un flux d'execution sans friction.</div>
                    </div>
                  </div>

                  <div className="mt-5"><GlowDivider /></div>

                  <div className="mt-5 space-y-3 text-sm text-white/70">
                    {proofItems.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs tracking-[0.22em] text-white/55 uppercase">Offre demarrage</div>
                    <div className="mt-1 text-sm font-semibold text-white">Audit express + feuille de route</div>
                    <p className="mt-2 text-sm text-white/65">Une base solide pour prioriser, chiffrer et lancer.</p>
                    <Link href="/contact" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                      Demander un diagnostic <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F7F8] py-14 text-[#0B0D0E]">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-[0.26em] text-emerald-700">NOTRE METHODE</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Une execution pilotee, mesuree, optimisee</h2>
              <p className="mt-3 max-w-2xl text-sm text-black/60">Un cadre clair pour livrer vite, proprement, puis ameliorer en continu.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              BO sous controle
            </span>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {homeProcess.map((step) => (
              <div key={step.n} className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.45)] transition hover:-translate-y-1">
                <div className="absolute -right-3 -top-6 text-7xl font-semibold text-black/5">{step.n}</div>
                <div className="text-xs font-semibold tracking-[0.26em] text-emerald-700">{step.n}</div>
                <div className="mt-3 text-lg font-semibold">{step.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-black/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="expertises" className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            kicker="NOS EXPERTISES"
            title="Cinq poles, une seule vision"
            desc="Les pages publiques et le back-office lisent les memes donnees pour eviter les informations contradictoires."
          />
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            Demarrer un projet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {poles.map((pole) => {
            const Icon = pole.icon;
            return (
              <Link id={pole.id} key={pole.id} href={pole.slug} className="group scroll-mt-28">
                <PremiumCard className="h-full p-0 transition hover:-translate-y-1 hover:border-emerald-400/35">
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image src={siteImages[pole.id] || pole.image} alt={pole.title} fill className="object-cover opacity-50 transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-linear-to-t from-[#06090A] to-transparent" />
                    <div className="absolute bottom-4 left-6 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-emerald-400/15 text-emerald-300 backdrop-blur-md">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold tracking-[0.26em] text-white/55">{pole.number}</div>
                        <div className="mt-1 text-base font-semibold text-white">{pole.title}</div>
                      </div>
                      <ArrowRight className="mt-2 h-4 w-4 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-white/70">{pole.shortDescription}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {pole.services.slice(0, 3).map((service) => (
                        <span key={service.name} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[11px] font-semibold text-white/60">
                          {service.name}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">Decouvrir le pole</div>
                  </div>
                </PremiumCard>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-black/35 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle kicker="BACK-OFFICE" title="Gestion claire du contenu" desc="Les zones encore a connecter sont identifiees afin de ne pas confondre interface et donnee reelle." />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {adminOperationalItems.map((item) => (
              <PremiumCard key={item.title} className="p-6">
                <div className="text-xs font-semibold tracking-[0.22em] text-emerald-300 uppercase">{item.status}</div>
                <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{item.detail}</p>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle kicker="TEMOIGNAGES" title="Une qualite qui se ressent" desc="Cadrage net, livrables propres, execution pilotee." />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <PremiumCard key={testimonial.name} className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                    <Quote className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed text-white/80">"{testimonial.quote}"</p>
                    <div className="mt-4 text-sm font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-white/60">{testimonial.role}</div>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 bg-[#06090A] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="text-xs font-semibold tracking-[0.26em] text-emerald-300">CONTACT</div>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">Parlons de votre projet</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">Decrivez votre besoin : nous revenons avec une proposition structuree.</p>
              <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-sm text-white"><span className="text-white/60">Email :</span> <span className="font-semibold">{siteContact.email}</span></div>
                <div className="text-sm text-white"><span className="text-white/60">Telephone :</span> <span className="font-semibold">{siteContact.phone}</span></div>
                <div className="text-sm text-white"><span className="text-white/60">Localisation :</span> <span className="font-semibold">{siteContact.location}</span></div>
              </div>
            </div>
            <div className="md:col-span-7">
              <PremiumCard className="p-6">
                <ContactForm compact source="accueil" />
              </PremiumCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}





