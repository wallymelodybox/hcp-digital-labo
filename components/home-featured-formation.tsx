"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { CountdownTimer } from "@/components/countdown-timer";
import type { FormationOffer } from "@/lib/formation-offers";

function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

export function HomeFeaturedFormation() {
  const [offer, setOffer] = useState<FormationOffer | null>(null);

  useEffect(() => {
    fetch("/api/formation-offers")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: FormationOffer[]) => {
        const featured = Array.isArray(data) ? data.find((item) => item.featuredOnHome) : null;
        if (featured) setOffer(featured);
      })
      .catch(() => {});
  }, []);

  if (!offer) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <Link href={`/formation#formules`} className="group block">
          <PremiumCard className="relative overflow-hidden border-blue-400/40 p-8 transition hover:-translate-y-1 hover:border-blue-400/70 md:p-12">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.25),transparent_45%)]" />

            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-300">
                  <Sparkles className="h-3 w-3" />
                  {offer.badge || "Formation en avant"}
                </div>

                <h2 className="mt-5 flex items-center gap-3 text-2xl font-bold text-white sm:text-3xl">
                  <GraduationCap className="h-7 w-7 text-blue-300" />
                  {offer.title}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                  {offer.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-3">
                  {offer.priceOnRequest ? (
                    <span className="text-3xl font-bold text-blue-300">Sur devis</span>
                  ) : (
                    <>
                      {offer.originalPrice ? (
                        <span className="text-lg text-white/40 line-through">{formatPrice(offer.originalPrice)}</span>
                      ) : null}
                      <span className="text-3xl font-bold text-blue-300">{formatPrice(offer.price)}</span>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <PrimaryButton>Découvrir la formation</PrimaryButton>
                </div>
              </div>

              {offer.flashSaleEndsAt ? (
                <div className="shrink-0 rounded-2xl border border-white/10 bg-black/25 p-5">
                  <div className="mb-3 text-center text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    Offre limitée dans le temps
                  </div>
                  <CountdownTimer target={offer.flashSaleEndsAt} />
                </div>
              ) : null}
            </div>
          </PremiumCard>
        </Link>
      </motion.div>
    </section>
  );
}
