"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import { defaultStrategyOffers, type StrategyOffer, type StrategyOfferIcon } from "@/lib/strategy-offers";

const iconOptions: { label: string; value: StrategyOfferIcon }[] = [
  { label: "Cible", value: "target" },
  { label: "Design", value: "pen" },
  { label: "Croissance", value: "chart" },
  { label: "Document", value: "file" },
];

function emptyOffer(): StrategyOffer {
  return {
    id: `offre-${Date.now()}`,
    icon: "target",
    title: "Nouvelle offre",
    desc: "Décrivez la valeur concrète de cette offre.",
    bullets: ["Livrable 1", "Livrable 2"],
  };
}

export function AdminStrategyOffersManager() {
  const [offers, setOffers] = useState<StrategyOffer[]>(defaultStrategyOffers);
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hcp-bo-7x9k2m/strategy-offers", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length) setOffers(data);
        setStatus("idle");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Impossible de charger les offres.");
      });
  }, []);

  function updateOffer(id: string, patch: Partial<StrategyOffer>) {
    setOffers((current) => current.map((offer) => (offer.id === id ? { ...offer, ...patch } : offer)));
  }

  function updateBullets(id: string, value: string) {
    updateOffer(id, {
      bullets: value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  }

  function removeOffer(id: string) {
    setOffers((current) => (current.length > 1 ? current.filter((offer) => offer.id !== id) : current));
  }

  async function save() {
    setStatus("saving");
    setMessage("");

    const response = await fetch("/api/hcp-bo-7x9k2m/strategy-offers", {
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
    setMessage("Offres mises à jour.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Offres Stratégie</h2>
          <p className="mt-2 text-white/50">Éditez les cartes de la section “Une stratégie pensée pour être exécutée”.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="ghost" onClick={() => setOffers((current) => [...current, emptyOffer()])} className="gap-2 text-white/70 hover:bg-white/5 hover:text-white">
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
          <Button onClick={save} disabled={status === "saving" || status === "loading"} className="gap-2 bg-emerald-500 text-white hover:bg-emerald-600">
            <Save className="h-4 w-4" />
            {status === "saving" ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>

      {message ? (
        <div className={`rounded-xl border px-4 py-3 text-sm ${status === "success" ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100" : "border-red-400/25 bg-red-400/10 text-red-100"}`}>
          {message}
        </div>
      ) : null}

      <div className="grid gap-6">
        {offers.map((offer, index) => (
          <PremiumCard key={offer.id} className="p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-white/35">Offre {index + 1}</div>
                  <h3 className="mt-1 text-lg font-semibold text-white">{offer.title || "Sans titre"}</h3>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeOffer(offer.id)} className="gap-2 text-red-300 hover:bg-red-400/10 hover:text-red-200">
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
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
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Icône</label>
                  <select
                    value={offer.icon}
                    onChange={(event) => updateOffer(offer.id, { icon: event.target.value as StrategyOfferIcon })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Description</label>
                <textarea
                  value={offer.desc}
                  onChange={(event) => updateOffer(offer.id, { desc: event.target.value })}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Puces, une par ligne</label>
                <textarea
                  value={offer.bullets.join("\n")}
                  onChange={(event) => updateBullets(offer.id, event.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                />
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}
