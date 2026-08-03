"use client";

import { useEffect, useMemo, useState } from "react";
import { Banknote, Inbox, MailWarning } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import type { FormationRegistration, FormationRegistrationStatus } from "@/lib/site-storage";

function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

const modePaiementLabels: Record<string, string> = {
  orange_money: "Orange Money",
  mtn_momo: "MTN Mobile Money",
  wave: "Wave",
  moov_money: "Moov Money",
  carte: "Carte bancaire",
  virement: "Virement bancaire",
  especes: "Espèces",
};

function modePaiementLabel(value: string) {
  return modePaiementLabels[value] ?? value;
}

type FilterKey = "tous" | "payes" | "en_attente";

const filterOptions: { label: string; value: FilterKey }[] = [
  { label: "Tous", value: "tous" },
  { label: "Payés", value: "payes" },
  { label: "En attente", value: "en_attente" },
];

export function AdminFormationPaymentsList() {
  const [registrations, setRegistrations] = useState<FormationRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterKey>("tous");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/hcp-bo-7x9k2m/formation-registrations", { credentials: "same-origin" });
      if (!response.ok) throw new Error("load");
      setRegistrations(await response.json());
    } catch {
      setError("Impossible de charger les paiements.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const relevant = registrations.filter((item) => item.status !== "annulee");

  const totals = useMemo(() => {
    const totalDu = relevant.reduce((sum, item) => sum + item.prix, 0);
    const totalPaye = relevant.reduce((sum, item) => sum + (item.montantPaye ?? 0), 0);
    return {
      totalDu,
      totalPaye,
      totalRestant: totalDu - totalPaye,
      nbPayes: relevant.filter((item) => item.montantPaye).length,
      nbEnAttente: relevant.filter((item) => !item.montantPaye).length,
    };
  }, [relevant]);

  const filtered = relevant.filter((item) => {
    if (filter === "payes") return Boolean(item.montantPaye);
    if (filter === "en_attente") return !item.montantPaye;
    return true;
  });

  if (loading) {
    return <PremiumCard className="p-8 text-sm text-white/50">Chargement des paiements...</PremiumCard>;
  }

  if (error) {
    return (
      <PremiumCard className="p-8">
        <div className="flex items-start gap-4 text-red-100">
          <MailWarning className="h-6 w-6 text-red-300" />
          <div>{error}</div>
        </div>
      </PremiumCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <PremiumCard className="p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/40">Total encaissé</div>
          <div className="mt-2 text-2xl font-bold text-emerald-300">{formatPrice(totals.totalPaye)}</div>
          <div className="mt-1 text-xs text-white/40">{totals.nbPayes} paiement(s) confirmé(s)</div>
        </PremiumCard>
        <PremiumCard className="p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/40">Solde restant à encaisser</div>
          <div className="mt-2 text-2xl font-bold text-amber-300">{formatPrice(totals.totalRestant)}</div>
          <div className="mt-1 text-xs text-white/40">{totals.nbEnAttente} inscription(s) en attente</div>
        </PremiumCard>
        <PremiumCard className="p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/40">Chiffre d&apos;affaires total</div>
          <div className="mt-2 text-2xl font-bold text-white">{formatPrice(totals.totalDu)}</div>
          <div className="mt-1 text-xs text-white/40">Hors inscriptions annulées</div>
        </PremiumCard>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
              filter === option.value
                ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
                : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {!filtered.length ? (
        <PremiumCard className="p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
              <Inbox className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Aucun paiement pour ce filtre</h3>
            </div>
          </div>
        </PremiumCard>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-160 border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-left text-white/70">
                <th className="p-4 font-semibold">Participant</th>
                <th className="p-4 font-semibold">Formule</th>
                <th className="p-4 font-semibold">Moyen</th>
                <th className="p-4 font-semibold">Référence</th>
                <th className="p-4 font-semibold text-right">Payé / Dû</th>
                <th className="p-4 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/5 text-white/75 last:border-b-0">
                  <td className="p-4">
                    <div className="font-medium text-white">{item.prenoms} {item.nom}</div>
                    <div className="text-xs text-white/40">{item.whatsapp}</div>
                  </td>
                  <td className="p-4">{item.formuleTitle}</td>
                  <td className="p-4">{modePaiementLabel(item.modePaiement)}</td>
                  <td className="p-4 text-xs text-white/50">{item.referencePaiement ?? "—"}</td>
                  <td className="p-4 text-right">
                    <span className={item.montantPaye ? "text-emerald-300" : "text-amber-300"}>
                      {formatPrice(item.montantPaye ?? 0)}
                    </span>
                    <span className="text-white/40"> / {formatPrice(item.prix)}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      {item.montantPaye ? (
                        <Banknote className="h-3.5 w-3.5 text-emerald-300" />
                      ) : (
                        <Banknote className="h-3.5 w-3.5 text-white/30" />
                      )}
                      {item.montantPaye ? "Payé" : "En attente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
