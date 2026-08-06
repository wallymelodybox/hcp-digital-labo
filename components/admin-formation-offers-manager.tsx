"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import { defaultFormationOffers, type FormationLevel, type FormationOffer } from "@/lib/formation-offers";

const levelOptions: { label: string; value: FormationLevel }[] = [
  { label: "Basique", value: "basique" },
  { label: "Intermédiaire", value: "intermediaire" },
  { label: "Complète", value: "complete" },
];

export function AdminFormationOffersManager() {
  const [offers, setOffers] = useState<FormationOffer[]>(defaultFormationOffers);
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hcp-bo-7x9k2m/formation-offers", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length) setOffers(data);
        setStatus("idle");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Impossible de charger les formules.");
      });
  }, []);

  function updateOffer(id: string, patch: Partial<FormationOffer>) {
    setOffers((current) => current.map((offer) => (offer.id === id ? { ...offer, ...patch } : offer)));
  }

  function updateFeatures(id: string, value: string) {
    updateOffer(id, {
      features: value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  }

  async function save() {
    setStatus("saving");
    setMessage("");

    const response = await fetch("/api/hcp-bo-7x9k2m/formation-offers", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offers),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error || "Sauvegarde impossible.");
      return;
    }

    setOffers(payload);
    setStatus("success");
    setMessage("Formules mises à jour.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Formules Formation IA</h2>
          <p className="mt-2 text-white/50">Éditez les 3 cartes tarifaires affichées sur la page Formation.</p>
        </div>
        <Button onClick={save} disabled={status === "saving" || status === "loading"} className="gap-2 bg-emerald-500 text-white hover:bg-emerald-600">
          <Save className="h-4 w-4" />
          {status === "saving" ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      {message ? (
        <div className={`rounded-xl border px-4 py-3 text-sm ${status === "success" ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100" : "border-red-400/25 bg-red-400/10 text-red-100"}`}>
          {message}
        </div>
      ) : null}

      <div className="grid gap-6">
        {offers.map((offer, index) => (
          <PremiumCard key={offer.id} className={`p-6 ${offer.visible ? "border-emerald-400/30" : "border-white/10 opacity-70"}`}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-white/35">Formule {index + 1}</div>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-white/70">
                    <input
                      type="checkbox"
                      checked={offer.visible}
                      onChange={(event) => updateOffer(offer.id, { visible: event.target.checked })}
                      className="h-4 w-4 rounded border-white/20 bg-black/20"
                    />
                    Visible sur le site
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-white/70">
                    <input
                      type="checkbox"
                      checked={offer.featuredOnHome}
                      onChange={(event) => updateOffer(offer.id, { featuredOnHome: event.target.checked })}
                      className="h-4 w-4 rounded border-white/20 bg-black/20"
                    />
                    Mise en avant sur l&apos;accueil
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-white/70">
                    <input
                      type="checkbox"
                      checked={Boolean(offer.priceOnRequest)}
                      onChange={(event) => updateOffer(offer.id, { priceOnRequest: event.target.checked })}
                      className="h-4 w-4 rounded border-white/20 bg-black/20"
                    />
                    Prix sur devis
                  </label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Titre</label>
                  <input
                    value={offer.title}
                    onChange={(event) => updateOffer(offer.id, { title: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Niveau</label>
                  <select
                    value={offer.level}
                    onChange={(event) => updateOffer(offer.id, { level: event.target.value as FormationLevel })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  >
                    {levelOptions.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Sous-titre</label>
                <textarea
                  value={offer.tagline}
                  onChange={(event) => updateOffer(offer.id, { tagline: event.target.value })}
                  rows={2}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Prix (FCFA)</label>
                  <input
                    type="number"
                    value={offer.price}
                    onChange={(event) => updateOffer(offer.id, { price: Number(event.target.value) })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Prix normal (facultatif)</label>
                  <input
                    type="number"
                    value={offer.originalPrice ?? ""}
                    onChange={(event) => updateOffer(offer.id, { originalPrice: event.target.value ? Number(event.target.value) : undefined })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Durée</label>
                  <input
                    value={offer.duration}
                    onChange={(event) => updateOffer(offer.id, { duration: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Badge (facultatif)</label>
                  <input
                    value={offer.badge ?? ""}
                    onChange={(event) => updateOffer(offer.id, { badge: event.target.value || undefined })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Fin de la vente flash (facultatif)</label>
                <input
                  type="datetime-local"
                  value={offer.flashSaleEndsAt ? offer.flashSaleEndsAt.slice(0, 16) : ""}
                  onChange={(event) =>
                    updateOffer(offer.id, {
                      flashSaleEndsAt: event.target.value ? new Date(event.target.value).toISOString() : undefined,
                    })
                  }
                  className="mt-2 w-full max-w-xs rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                />
                <p className="mt-1 text-xs text-white/35">Affiche un compte à rebours sur la carte tant que cette date n&apos;est pas dépassée.</p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Contenu, une ligne par élément</label>
                <textarea
                  value={offer.features.join("\n")}
                  onChange={(event) => updateFeatures(offer.id, event.target.value)}
                  rows={6}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Texte du bouton</label>
                <input
                  value={offer.ctaLabel}
                  onChange={(event) => updateOffer(offer.id, { ctaLabel: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                />
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}
