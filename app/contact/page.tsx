"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Mail, Phone, MapPin, Sparkles, ShieldCheck } from "lucide-react"
import { Pill } from "@/components/ui/pill"
import { PrimaryButton } from "@/components/ui/primary-button"
import { PremiumCard } from "@/components/ui/premium-card"
import { SectionTitle } from "@/components/ui/section-title"
import { GlowDivider } from "@/components/ui/glow-divider"
import { siteContact } from "@/lib/site-data"
import { ContactForm } from "@/components/contact-form"
import { useSiteImages } from "@/hooks/use-site-images"

export default function ContactPage() {
  const siteImages = useSiteImages();

  return (
    <div className="public-theme min-h-screen bg-[#06090A] text-white">
      {/* Background elements */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.08),transparent:60%)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-size-[56px_56px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.45)_75%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.30%22/%3E%3C/svg%3E')] mix-blend-soft-light" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-5 pt-14 pb-14 md:pt-20 md:pb-20 overflow-hidden rounded-[40px] mt-8">
        <div className="absolute inset-0 -z-10">
          <Image 
            src={siteImages.contactHero || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"} 
            unoptimized={Boolean(siteImages.contactHero)}
            alt="Contact Background" 
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#06090A]/50 to-[#06090A]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Pill>CONTACT & AUDIT</Pill>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-white/60">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              REPONSE SOUS 24-48H
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
            Parlons de votre projet.
            <span className="block text-blue-300">Construisons l'impact.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            Contactez-nous pour un diagnostic gratuit. Nos experts analysent votre écosystème et vous proposent un plan d'action adapté à vos enjeux et à vos ambitions.
          </p>
        </motion.div>
      </section>

      {/* Contact content */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Left: Info */}
          <div className="md:col-span-5 space-y-8">
            <SectionTitle
              kicker="COORDONNÉES"
              title="Nos points de contact"
            />

            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: siteContact.email },
                { icon: Phone, label: "Téléphone", value: siteContact.phone },
                { icon: MapPin, label: "Adresse", value: siteContact.location },
              ].map((item) => (
                <PremiumCard key={item.label} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-400/15 text-blue-300">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-1">{item.label}</div>
                      <div className="text-base font-semibold text-white">{item.value}</div>
                    </div>
                  </div>
                </PremiumCard>
              ))}
            </div>

            <PremiumCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="h-5 w-5 text-blue-300" />
                <h3 className="text-sm font-semibold tracking-widest uppercase text-white/60">Horaires</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Lundi - Vendredi</span>
                  <span className="font-semibold">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Samedi</span>
                  <span className="font-semibold">09:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Dimanche</span>
                  <span className="text-blue-400/50">Fermé</span>
                </div>
              </div>
            </PremiumCard>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-7">
            <PremiumCard className="p-8 md:p-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
              <div className="mb-10">
                <h2 className="text-2xl font-semibold tracking-tight">Envoyez-nous un message</h2>
                <p className="mt-2 text-sm text-white/50">Remplissez le formulaire et nous reviendrons vers vous avec une proposition structurée.</p>
              </div>

              <ContactForm source="contact" />
            </PremiumCard>
          </div>
        </div>
      </section>
    </div>
  )
}







