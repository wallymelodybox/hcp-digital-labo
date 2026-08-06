"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, Check, Code2, Sparkles, WandSparkles } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SectionTitle } from "@/components/ui/section-title";
import { Pill } from "@/components/ui/pill";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { defaultFormationOffers, type FormationOffer } from "@/lib/formation-offers";
import type { FormationSession } from "@/lib/formation-sessions";
import { useSiteImages } from "@/hooks/use-site-images";
import { CountdownTimer } from "@/components/countdown-timer";

type FormationSessionWithAvailability = FormationSession & { enrolled: number; remaining: number };

function formatSessionLabel(session: FormationSessionWithAvailability) {
  const date = session.startDate ? new Date(session.startDate).toLocaleDateString("fr-FR") : "";
  const formatLabel = session.format === "presentiel" ? "Présentiel" : session.format === "hybride" ? "Hybride" : "En ligne";
  const placesLabel = session.remaining > 0 ? `${session.remaining} places restantes` : "Complet";
  return [session.name, date, formatLabel, placesLabel].filter(Boolean).join(" — ");
}

function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(?:[?#].*)?$/i.test(url);
}

const comparisonRows: { label: string; values: [string, string, string] }[] = [
  { label: "Initiation à l'IA", values: ["✓", "✓", "✓"] },
  { label: "Maîtrise des prompts", values: ["✓", "✓", "✓"] },
  { label: "Création de visuels", values: ["✓", "✓", "✓"] },
  { label: "Création de vidéos", values: ["Initiation", "Avancée", "Avancée"] },
  { label: "Création de site", values: ["—", "✓", "✓"] },
  { label: "Création d'application", values: ["—", "Initiation", "✓"] },
  { label: "Création de SaaS", values: ["—", "—", "✓"] },
  { label: "Automatisation", values: ["—", "Basique", "Avancée"] },
  { label: "Projet pratique", values: ["—", "✓", "✓"] },
  { label: "Accompagnement", values: ["Standard", "Groupe privé", "Personnalisé"] },
];

const faqItems = [
  {
    question: "Faut-il savoir programmer ?",
    answer: "Non. La formation Basique et une grande partie de la formule Intermédiaire sont accessibles sans compétences techniques.",
  },
  {
    question: "Dois-je avoir un ordinateur ?",
    answer: "Oui, un ordinateur portable est fortement recommandé pour les exercices pratiques.",
  },
  {
    question: "Les outils sont-ils gratuits ?",
    answer: "Plusieurs outils proposent des versions gratuites. Les éventuels abonnements payants seront indiqués avant leur utilisation.",
  },
  {
    question: "Puis-je payer en plusieurs fois ?",
    answer: "Pour la formule Complète, un paiement en deux tranches peut être proposé selon les conditions affichées.",
  },
  {
    question: "Vais-je recevoir une attestation ?",
    answer: "Oui, après participation effective et réalisation des exercices demandés.",
  },
];

type FormStatus = "idle" | "loading" | "paying" | "success" | "error";

declare global {
  interface Window {
    KadevPay?: {
      checkout: (options: {
        public_key: string;
        amount: number;
        email: string;
        method: "momo" | "card";
        name?: string;
        phone?: string;
        metadata?: Record<string, unknown>;
        onSuccess?: (result: { reference: string }) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

function loadKadevScript(): Promise<void> {
  if (window.KadevPay) return Promise.resolve();

  const existing = document.querySelector('script[src="https://pay.kadev.ci/js/v1/kadev-pay.js"]');
  if (existing) {
    return new Promise((resolve) => existing.addEventListener("load", () => resolve()));
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://pay.kadev.ci/js/v1/kadev-pay.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Impossible de charger le module de paiement."));
    document.body.appendChild(script);
  });
}

type PromoState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "valid"; originalPrice: number; discountedPrice: number }
  | { status: "invalid"; error: string };

function RegistrationForm({ offers, selectedId, onDone }: { offers: FormationOffer[]; selectedId: string; onDone: () => void }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [formuleId, setFormuleId] = useState(selectedId);
  const [sessions, setSessions] = useState<FormationSessionWithAvailability[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promo, setPromo] = useState<PromoState>({ status: "idle" });

  useEffect(() => {
    fetch("/api/formation-sessions")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPromo({ status: "idle" });
  }, [formuleId]);

  const sessionsForFormule = sessions.filter((session) => session.formuleId === formuleId);
  const currentOffer = offers.find((offer) => offer.id === formuleId);

  async function checkPromoCode() {
    const code = promoCode.trim();
    if (!code) {
      setPromo({ status: "idle" });
      return;
    }

    setPromo({ status: "checking" });

    const response = await fetch("/api/formation-promo-codes/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, formuleId }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setPromo({ status: "invalid", error: payload.error || "Code invalide." });
      return;
    }

    setPromo({ status: "valid", originalPrice: payload.originalPrice, discountedPrice: payload.discountedPrice });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const response = await fetch("/api/formation-registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source: "formation" }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error || "Impossible d'envoyer votre inscription.");
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_KADEV_PUBLIC_KEY;
    const amount = promo.status === "valid" ? promo.discountedPrice : currentOffer?.price ?? 0;

    if (!publicKey || !data.email || data.modePaiement === "especes" || data.modePaiement === "virement") {
      form.reset();
      setStatus("success");
      setMessage("Votre demande d'inscription a bien été enregistrée. Finalisez votre paiement pour confirmer votre place.");
      return;
    }

    try {
      setStatus("paying");
      await loadKadevScript();

      window.KadevPay?.checkout({
        public_key: publicKey,
        amount,
        email: data.email,
        method: data.modePaiement === "carte" ? "card" : "momo",
        name: `${data.prenoms} ${data.nom}`.trim(),
        phone: data.whatsapp,
        metadata: { registrationId: payload.id },
        onSuccess: () => {
          form.reset();
          setStatus("success");
          setMessage("Paiement effectué et inscription enregistrée. Vous recevrez la confirmation par WhatsApp ou e-mail.");
        },
        onClose: () => {
          form.reset();
          setStatus("success");
          setMessage("Votre demande d'inscription a bien été enregistrée. Finalisez votre paiement pour confirmer votre place.");
        },
      });
    } catch {
      form.reset();
      setStatus("success");
      setMessage("Votre demande d'inscription a bien été enregistrée. Finalisez votre paiement pour confirmer votre place.");
    }
  }

  if (status === "success") {
    return (
      <PremiumCard className="p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/15 text-blue-300">
          <Check className="h-6 w-6" />
        </div>
        <p className="mt-4 text-white/80">{message}</p>
        <button type="button" onClick={onDone} className="mt-6 text-sm text-blue-300 hover:text-blue-200">
          Retour aux formules
        </button>
      </PremiumCard>
    );
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nom" name="nom" required />
        <Field label="Prénoms" name="prenoms" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Numéro WhatsApp" name="whatsapp" required />
        <Field label="Adresse e-mail" name="email" type="email" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Pays" name="pays" />
        <Field label="Ville" name="ville" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Profession" name="profession" />
        <Field label="Entreprise (facultatif)" name="entreprise" />
      </div>

      <div>
        <label className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">Niveau actuel en informatique</label>
        <select name="niveauInformatique" className="mt-2 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400/40">
          <option value="debutant">Débutant</option>
          <option value="intermediaire">Intermédiaire</option>
          <option value="avance">Avancé</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">Formule sélectionnée</label>
        <select
          name="formuleId"
          value={formuleId}
          onChange={(event) => setFormuleId(event.target.value)}
          className="mt-2 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
        >
          {offers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.title} — {formatPrice(offer.price)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">Mode de participation</label>
          <select name="modeParticipation" className="mt-2 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400/40">
            <option value="en_ligne">En ligne</option>
            <option value="presentiel">Présentiel</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">Session souhaitée</label>
          <select name="sessionId" className="mt-2 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400/40">
            <option value="">À définir avec l&apos;équipe</option>
            {sessionsForFormule.map((session) => (
              <option key={session.id} value={session.id} disabled={session.remaining <= 0}>
                {formatSessionLabel(session)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">Mode de paiement</label>
          <select name="modePaiement" className="mt-2 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400/40">
            <option value="orange_money">Orange Money</option>
            <option value="mtn_momo">MTN Mobile Money</option>
            <option value="wave">Wave</option>
            <option value="moov_money">Moov Money</option>
            <option value="carte">Carte bancaire</option>
            <option value="virement">Virement bancaire</option>
            <option value="especes">Espèces</option>
          </select>
        </div>
        <div>
          <label htmlFor="codePromo" className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
            Code promotionnel (si disponible)
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="codePromo"
              name="codePromo"
              value={promoCode}
              onChange={(event) => {
                setPromoCode(event.target.value.toUpperCase());
                setPromo({ status: "idle" });
              }}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            />
            <button
              type="button"
              onClick={checkPromoCode}
              disabled={promo.status === "checking"}
              className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white/70 transition hover:bg-white/10"
            >
              {promo.status === "checking" ? "..." : "Vérifier"}
            </button>
          </div>
          {promo.status === "valid" ? (
            <p className="mt-2 text-xs text-blue-300">
              Code appliqué : {formatPrice(promo.discountedPrice)} au lieu de {formatPrice(promo.originalPrice)}.
            </p>
          ) : null}
          {promo.status === "invalid" ? (
            <p className="mt-2 text-xs text-red-300">{promo.error}</p>
          ) : null}
        </div>
      </div>

      {currentOffer ? (
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
          Total à payer :{" "}
          <span className="font-semibold text-blue-300">
            {formatPrice(promo.status === "valid" ? promo.discountedPrice : currentOffer.price)}
          </span>
        </div>
      ) : null}

      <label className="flex items-start gap-3 text-sm text-white/60">
        <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-white/20 bg-black/20" />
        J&apos;accepte les conditions de participation à cette formation.
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <PrimaryButton disabled={status === "loading" || status === "paying"}>
          {status === "loading" ? "Envoi..." : status === "paying" ? "Ouverture du paiement..." : "Valider mon inscription"}
        </PrimaryButton>
      </div>

      {message ? (
        <div className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-100">{message}</div>
      ) : null}
    </form>
  );
}

function Field({ label, name, required, type = "text" }: { label: string; name: string; required?: boolean; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
      />
    </div>
  );
}

export function FormationPricing() {
  const [offers, setOffers] = useState<FormationOffer[]>(defaultFormationOffers);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const siteImages = useSiteImages();
  const bannerMedia = siteImages.formationPricingBanner;

  useEffect(() => {
    fetch("/api/formation-offers")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length) setOffers(data);
      })
      .catch(() => {});
  }, []);

  const selectedOffer = offers.find((offer) => offer.id === selectedId);

  return (
    <section className="py-16 md:py-24" id="formules">
      <div className="mx-auto max-w-6xl px-5">
        {bannerMedia ? (
          <div className="formation-banner relative overflow-hidden rounded-2xl border border-blue-300/20 bg-white shadow-[0_30px_100px_-45px_rgba(37,99,235,0.35)] sm:rounded-4xl">
            <h2 className="sr-only">Maîtrisez l&apos;IA pour créer vos propres solutions digitales</h2>
            {isVideoUrl(bannerMedia) ? (
              <video
                src={bannerMedia}
                className="aspect-3/2 h-auto w-full bg-white object-contain opacity-100"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                aria-label="Présentation de la formation IA"
              />
            ) : (
              <img
                src={bannerMedia}
                alt="Formations en intelligence artificielle"
                width={1536}
                height={1024}
                className="block aspect-3/2 w-full bg-white object-contain opacity-100"
              />
            )}
          </div>
        ) : (
        <div className="formation-banner relative isolate overflow-hidden rounded-4xl border border-blue-300/15 bg-[#07130f] px-6 py-12 shadow-[0_30px_100px_-45px_rgba(37,99,235,0.5)] sm:px-10 md:py-16 lg:px-16">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_82%_28%,rgba(37,99,235,0.28),transparent_27%),radial-gradient(circle_at_8%_90%,rgba(59,130,246,0.16),transparent_32%)]" />
          <div className="absolute inset-0 -z-10 opacity-20 bg-[linear-gradient(rgba(96,165,250,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.18)_1px,transparent_1px)] bg-size-[42px_42px] mask-[linear-gradient(to_right,black,transparent_72%)]" />

          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="max-w-3xl text-center lg:text-left">
              <Pill>Formation IA</Pill>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl text-balance">
                Maîtrisez l&apos;IA pour créer vos propres solutions digitales
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base lg:mx-0">
                Apprenez à créer des visuels, des vidéos, des sites web, des applications et des SaaS avec l&apos;intelligence artificielle, selon votre niveau.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs text-white/55 lg:justify-start">
                <span>Formation pratique</span>
                <span>Accessible aux débutants</span>
                <span>Projets concrets</span>
                <span>En ligne ou en présentiel</span>
              </div>
            </div>

            <div className="relative mx-auto h-56 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-black/25 sm:h-64" aria-hidden="true">
              <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-300/30 bg-blue-400/10 shadow-[0_0_70px_rgba(59,130,246,0.3)] backdrop-blur-xl">
                <BrainCircuit className="h-14 w-14 text-blue-300" strokeWidth={1.4} />
              </div>
              <div className="absolute left-3 top-5 flex h-16 w-16 rotate-[-7deg] items-center justify-center rounded-2xl border border-white/10 bg-white/6 backdrop-blur-md">
                <Code2 className="h-7 w-7 text-sky-200" />
              </div>
              <div className="absolute bottom-6 right-2 flex h-16 w-16 rotate-[8deg] items-center justify-center rounded-2xl border border-white/10 bg-white/6 backdrop-blur-md">
                <WandSparkles className="h-7 w-7 text-blue-200" />
              </div>
              <div className="absolute right-4 top-3 rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-[10px] font-semibold tracking-[0.18em] text-blue-200 uppercase">Créer</div>
              <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[10px] font-semibold tracking-[0.18em] text-white/70 uppercase">Automatiser</div>
            </div>
          </div>
        </div>
        )}

        {!selectedOffer ? (
          <>
            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {offers.map((offer) => (
                <PremiumCard
                  key={offer.id}
                  className={`p-8 flex flex-col ${offer.badge ? "border-blue-400/40 shadow-[0_30px_90px_-40px_rgba(37,99,235,0.55)]" : ""}`}
                >
                  {offer.badge ? (
                    <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-300">
                      <Sparkles className="h-3 w-3" />
                      {offer.badge}
                    </div>
                  ) : null}

                  <h3 className="text-xl font-bold text-white">{offer.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{offer.tagline}</p>

                  <div className="mt-6">
                    {offer.priceOnRequest ? (
                      <div className="text-3xl font-bold text-blue-300">Sur devis</div>
                    ) : (
                      <>
                        {offer.originalPrice ? (
                          <div className="text-sm text-white/40 line-through">{formatPrice(offer.originalPrice)}</div>
                        ) : null}
                        <div className="text-3xl font-bold text-blue-300">{formatPrice(offer.price)}</div>
                      </>
                    )}
                    <div className="mt-1 text-xs text-white/45">{offer.duration}</div>
                    {offer.flashSaleEndsAt ? (
                      <div className="mt-4">
                        <CountdownTimer target={offer.flashSaleEndsAt} />
                      </div>
                    ) : null}
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {offer.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-white/75">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => setSelectedId(offer.id)}
                    className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-400"
                  >
                    {offer.ctaLabel}
                  </button>
                </PremiumCard>
              ))}
            </div>

            <div className="mt-20">
              <SectionTitle kicker="COMPARATIF" title="Comparez les formules en un coup d'œil" />
              <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-160 border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-left text-white/70">
                      <th className="p-4 font-semibold">Fonctionnalité</th>
                      {offers.map((offer) => (
                        <th key={offer.id} className="p-4 font-semibold text-center">{offer.title.replace("Formation ", "")}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.label} className="border-b border-white/5 text-white/70 last:border-b-0">
                        <td className="p-4">{row.label}</td>
                        {row.values.map((value, idx) => (
                          <td key={idx} className="p-4 text-center">{value}</td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-white/5 font-semibold text-white">
                      <td className="p-4">Prix</td>
                      {offers.map((offer) => (
                        <td key={offer.id} className="p-4 text-center">{offer.priceOnRequest ? "Sur devis" : formatPrice(offer.price)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-20">
              <SectionTitle kicker="FAQ" title="Questions fréquentes" />
              <div className="mt-8 max-w-3xl">
                <Accordion type="single" collapsible>
                  {faqItems.map((item, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-white/10">
                      <AccordionTrigger className="text-white hover:no-underline">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-white/60">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto mt-16 max-w-2xl">
            <button type="button" onClick={() => setSelectedId(null)} className="text-sm text-white/50 hover:text-white">
              ← Changer de formule
            </button>
            <PremiumCard className="mt-4 p-8">
              <h3 className="text-xl font-bold text-white">Inscription — {selectedOffer.title}</h3>
              <p className="mt-1 text-sm text-white/50">{formatPrice(selectedOffer.price)} · {selectedOffer.duration}</p>
              <div className="mt-8">
                <RegistrationForm offers={offers} selectedId={selectedOffer.id} onDone={() => setSelectedId(null)} />
              </div>
            </PremiumCard>
          </div>
        )}
      </div>
    </section>
  );
}
