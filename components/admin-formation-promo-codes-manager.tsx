"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import { defaultFormationOffers, type FormationOffer } from "@/lib/formation-offers";
import type { FormationPromoCode, PromoDiscountType } from "@/lib/formation-promo-codes";

const discountTypeOptions: { label: string; value: PromoDiscountType }[] = [
  { label: "Montant fixe (FCFA)", value: "fixed" },
  { label: "Pourcentage (%)", value: "percent" },
];

function emptyCode(): FormationPromoCode {
  return {
    id: `promo-${Date.now()}`,
    code: "NOUVEAUCODE",
    discountType: "percent",
    discountValue: 10,
    active: true,
  };
}

export function AdminFormationPromoCodesManager() {
  const [codes, setCodes] = useState<FormationPromoCode[]>([]);
  const [offers, setOffers] = useState<FormationOffer[]>(defaultFormationOffers);
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/hcp-bo-7x9k2m/formation-promo-codes", { credentials: "same-origin" }).then((res) => (res.ok ? res.json() : [])),
      fetch("/api/hcp-bo-7x9k2m/formation-offers", { credentials: "same-origin" }).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([codesData, offersData]) => {
        if (Array.isArray(codesData)) setCodes(codesData);
        if (Array.isArray(offersData) && offersData.length) setOffers(offersData);
        setStatus("idle");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Impossible de charger les codes promotionnels.");
      });
  }, []);

  function updateCode(id: string, patch: Partial<FormationPromoCode>) {
    setCodes((current) => current.map((code) => (code.id === id ? { ...code, ...patch } : code)));
  }

  function removeCode(id: string) {
    setCodes((current) => current.filter((code) => code.id !== id));
  }

  async function save() {
    setStatus("saving");
    setMessage("");

    const response = await fetch("/api/hcp-bo-7x9k2m/formation-promo-codes", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(codes),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error || "Sauvegarde impossible.");
      return;
    }

    setCodes(payload);
    setStatus("success");
    setMessage("Codes promotionnels mis à jour.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Codes promotionnels</h2>
          <p className="mt-2 text-white/50">Créez des réductions applicables sur la page Formation.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="ghost" onClick={() => setCodes((current) => [...current, emptyCode()])} className="gap-2 text-white/70 hover:bg-white/5 hover:text-white">
            <Plus className="h-4 w-4" />
            Ajouter un code
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

      {!codes.length ? (
        <PremiumCard className="p-8 text-sm text-white/50">Aucun code pour le moment. Ajoutez-en un.</PremiumCard>
      ) : null}

      <div className="grid gap-6">
        {codes.map((code) => (
          <PremiumCard key={code.id} className="p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={code.active}
                    onChange={(event) => updateCode(code.id, { active: event.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-black/20"
                  />
                  Actif
                </label>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCode(code.id)} className="gap-2 text-red-300 hover:bg-red-400/10 hover:text-red-200">
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Code</label>
                  <input
                    value={code.code}
                    onChange={(event) => updateCode(code.id, { code: event.target.value.toUpperCase() })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-mono text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Type de réduction</label>
                  <select
                    value={code.discountType}
                    onChange={(event) => updateCode(code.id, { discountType: event.target.value as PromoDiscountType })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  >
                    {discountTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Valeur</label>
                  <input
                    type="number"
                    value={code.discountValue}
                    onChange={(event) => updateCode(code.id, { discountValue: Number(event.target.value) })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Formation concernée</label>
                  <select
                    value={code.formuleId ?? ""}
                    onChange={(event) => updateCode(code.id, { formuleId: event.target.value || undefined })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  >
                    <option value="">Toutes les formules</option>
                    {offers.map((offer) => (
                      <option key={offer.id} value={offer.id}>{offer.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Utilisations max</label>
                  <input
                    type="number"
                    value={code.maxUses ?? ""}
                    onChange={(event) => updateCode(code.id, { maxUses: event.target.value ? Number(event.target.value) : undefined })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="Illimité"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Date début</label>
                  <input
                    type="date"
                    value={code.startDate ?? ""}
                    onChange={(event) => updateCode(code.id, { startDate: event.target.value || undefined })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Date fin</label>
                  <input
                    type="date"
                    value={code.endDate ?? ""}
                    onChange={(event) => updateCode(code.id, { endDate: event.target.value || undefined })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}
