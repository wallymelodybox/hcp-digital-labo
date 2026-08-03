"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import { defaultFormationOffers, type FormationOffer } from "@/lib/formation-offers";
import type { FormationSessionFormat, FormationSessionStatus } from "@/lib/formation-sessions";

type SessionWithAvailability = {
  id: string;
  name: string;
  formuleId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  format: FormationSessionFormat;
  location: string;
  capacity: number;
  formateur: string;
  status: FormationSessionStatus;
  enrolled?: number;
  remaining?: number;
};

const formatOptions: { label: string; value: FormationSessionFormat }[] = [
  { label: "En ligne", value: "en_ligne" },
  { label: "Présentiel", value: "presentiel" },
  { label: "Hybride", value: "hybride" },
];

const statusOptions: { label: string; value: FormationSessionStatus }[] = [
  { label: "Prévue", value: "prevue" },
  { label: "Ouverte", value: "ouverte" },
  { label: "Complète", value: "complete" },
  { label: "En cours", value: "en_cours" },
  { label: "Terminée", value: "terminee" },
  { label: "Annulée", value: "annulee" },
];

function emptySession(formuleId: string): SessionWithAvailability {
  return {
    id: `session-${Date.now()}`,
    name: "Nouvelle session",
    formuleId,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    timezone: "GMT",
    format: "en_ligne",
    location: "",
    capacity: 20,
    formateur: "",
    status: "prevue",
  };
}

export function AdminFormationSessionsManager() {
  const [sessions, setSessions] = useState<SessionWithAvailability[]>([]);
  const [offers, setOffers] = useState<FormationOffer[]>(defaultFormationOffers);
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/hcp-bo-7x9k2m/formation-sessions", { credentials: "same-origin" }).then((res) => (res.ok ? res.json() : [])),
      fetch("/api/hcp-bo-7x9k2m/formation-offers", { credentials: "same-origin" }).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([sessionsData, offersData]) => {
        if (Array.isArray(sessionsData)) setSessions(sessionsData);
        if (Array.isArray(offersData) && offersData.length) setOffers(offersData);
        setStatus("idle");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Impossible de charger les sessions.");
      });
  }, []);

  function updateSession(id: string, patch: Partial<SessionWithAvailability>) {
    setSessions((current) => current.map((session) => (session.id === id ? { ...session, ...patch } : session)));
  }

  function removeSession(id: string) {
    setSessions((current) => current.filter((session) => session.id !== id));
  }

  async function save() {
    setStatus("saving");
    setMessage("");

    const response = await fetch("/api/hcp-bo-7x9k2m/formation-sessions", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessions),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error || "Sauvegarde impossible.");
      return;
    }

    setSessions(payload);
    setStatus("success");
    setMessage("Sessions mises à jour.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Sessions & cohortes</h2>
          <p className="mt-2 text-white/50">Gérez les sessions proposées pour chaque formule, avec suivi du remplissage.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSessions((current) => [...current, emptySession(offers[0]?.id ?? "")])}
            className="gap-2 text-white/70 hover:bg-white/5 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Ajouter une session
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

      {!sessions.length ? (
        <PremiumCard className="p-8 text-sm text-white/50">Aucune session pour le moment. Ajoutez-en une.</PremiumCard>
      ) : null}

      <div className="grid gap-6">
        {sessions.map((session) => (
          <PremiumCard key={session.id} className="p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{session.name || "Sans nom"}</h3>
                  {session.enrolled !== undefined ? (
                    <div className="mt-1 text-xs text-white/40">
                      {session.enrolled} inscrit(s) · {session.remaining} place(s) restante(s) sur {session.capacity}
                    </div>
                  ) : null}
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSession(session.id)} className="gap-2 text-red-300 hover:bg-red-400/10 hover:text-red-200">
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Nom de la session</label>
                  <input
                    value={session.name}
                    onChange={(event) => updateSession(session.id, { name: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Formation associée</label>
                  <select
                    value={session.formuleId}
                    onChange={(event) => updateSession(session.id, { formuleId: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  >
                    {offers.map((offer) => (
                      <option key={offer.id} value={offer.id}>{offer.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Date début</label>
                  <input
                    type="date"
                    value={session.startDate}
                    onChange={(event) => updateSession(session.id, { startDate: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Date fin</label>
                  <input
                    type="date"
                    value={session.endDate}
                    onChange={(event) => updateSession(session.id, { endDate: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Heure début</label>
                  <input
                    type="time"
                    value={session.startTime}
                    onChange={(event) => updateSession(session.id, { startTime: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Heure fin</label>
                  <input
                    type="time"
                    value={session.endTime}
                    onChange={(event) => updateSession(session.id, { endTime: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Format</label>
                  <select
                    value={session.format}
                    onChange={(event) => updateSession(session.id, { format: event.target.value as FormationSessionFormat })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  >
                    {formatOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Lieu ou lien</label>
                  <input
                    value={session.location}
                    onChange={(event) => updateSession(session.id, { location: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Places</label>
                  <input
                    type="number"
                    value={session.capacity}
                    onChange={(event) => updateSession(session.id, { capacity: Number(event.target.value) })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Statut</label>
                  <select
                    value={session.status}
                    onChange={(event) => updateSession(session.id, { status: event.target.value as FormationSessionStatus })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Formateur</label>
                <input
                  value={session.formateur}
                  onChange={(event) => updateSession(session.id, { formateur: event.target.value })}
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
