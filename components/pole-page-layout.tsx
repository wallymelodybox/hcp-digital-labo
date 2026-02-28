"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowLeft } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Pill } from "@/components/ui/pill"
import { PrimaryButton } from "@/components/ui/primary-button"
import { PremiumCard } from "@/components/ui/premium-card"
import { SectionTitle } from "@/components/ui/section-title"
import { GlowDivider } from "@/components/ui/glow-divider"

interface PoleService {
  name: string
  detail: string
}

interface PoleStat {
  value: string
  label: string
}

interface PolePageLayoutProps {
  number: string
  title: string
  image: string
  icon: LucideIcon
  description: string
  services: PoleService[]
  stats: PoleStat[]
  prevPole?: { title: string; slug: string } | null
  nextPole?: { title: string; slug: string } | null
}

export function PolePageLayout({
  number,
  title,
  image,
  icon: Icon,
  description,
  services,
  stats,
  prevPole,
  nextPole,
}: PolePageLayoutProps) {
  return (
    <div className="bg-[#06090A] text-white min-h-screen">
      {/* Background elements to match home page premium feel */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-size-[56px_56px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.45)_75%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.30%22/%3E%3C/svg%3E')] mix-blend-soft-light" />
      </div>

      {/* Hero section */}
      <section className="relative overflow-hidden pt-14 pb-14 md:pt-20 md:pb-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-7"
            >
              <div className="flex items-center gap-4 mb-8">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-emerald-300"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Link>
                <GlowDivider />
              </div>

              <div className="flex items-center gap-6 mb-8">
                <span className="text-6xl font-bold text-emerald-400 lg:text-8xl tracking-tighter">
                  {number}
                </span>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/15 text-emerald-300">
                  <Icon className="h-8 w-8 lg:h-10 lg:w-10" />
                </div>
              </div>

              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-7xl text-balance">
                {title}
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
                {description}
              </p>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-10 md:grid-cols-3 max-w-2xl">
                {stats.map((stat) => (
                  <div key={stat.label} className="group rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    <div className="text-2xl font-bold text-emerald-300 lg:text-3xl tracking-tight">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-white/50 font-medium tracking-wide uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-4xl border border-white/10 bg-white/3.5 shadow-2xl">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#06090A]/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-bold tracking-widest text-emerald-300 backdrop-blur-md uppercase">
                    Pôle {number}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services detail section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle
            kicker="NOS SERVICES"
            title="Expertises & Livrables"
            desc="Chaque service est pensé pour apporter une valeur concrète et mesurable à votre projet."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => (
              <div key={service.name} className="group">
                <PremiumCard className="p-8 h-full transition-all hover:-translate-y-1 hover:border-emerald-400/30">
                  <div className="absolute -right-2 -top-4 text-6xl font-bold text-white/5 group-hover:text-emerald-400/10 transition-colors">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="relative">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {service.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/60">
                      {service.detail}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-300">
                    En savoir plus <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </PremiumCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl text-balance">
            Prêt à lancer votre projet ?
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-lg text-white/70">
            Bénéficiez d'un accompagnement structuré et de livrables premium orientés résultats.
          </p>
          <div className="mt-10">
            <Link href="/contact">
              <PrimaryButton>Démarrer un diagnostic</PrimaryButton>
            </Link>
          </div>
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>
      </section>

      {/* Prev/Next navigation */}
      <section className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-2">
            {prevPole ? (
              <Link
                href={prevPole.slug}
                className="group flex items-center gap-4 py-12 pr-6 border-r border-white/10 transition-colors hover:bg-white/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-white/40 transition-colors group-hover:border-emerald-400/30 group-hover:text-emerald-300">
                  <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1 font-semibold">
                    Précédent
                  </div>
                  <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {prevPole.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="border-r border-white/10" />
            )}
            {nextPole ? (
              <Link
                href={nextPole.slug}
                className="group flex items-center justify-end gap-4 py-12 pl-6 transition-colors hover:bg-white/5"
              >
                <div className="text-right">
                  <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1 font-semibold">
                    Suivant
                  </div>
                  <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {nextPole.title}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-white/40 transition-colors group-hover:border-emerald-400/30 group-hover:text-emerald-300">
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

