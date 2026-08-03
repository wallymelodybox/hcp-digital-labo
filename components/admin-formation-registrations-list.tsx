"use client";

import { useEffect, useState } from "react";
import { Download, GraduationCap, Inbox, MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import type { FormationRegistration, FormationRegistrationStatus } from "@/lib/site-storage";
import type { FormationSession } from "@/lib/formation-sessions";

const statusOptions: { label: string; value: FormationRegistrationStatus }[] = [
  { label: "Nouvelle demande", value: "nouvelle" },
  { label: "En attente de paiement", value: "en_attente_paiement" },
  { label: "Paiement confirmé", value: "paiement_confirme" },
  { label: "Inscription validée", value: "validee" },
  { label: "Annulée", value: "annulee" },
];

const statusStyles: Record<FormationRegistrationStatus, string> = {
  nouvelle: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  en_attente_paiement: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  paiement_confirme: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  validee: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  annulee: "border-red-400/25 bg-red-400/10 text-red-200",
};

function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

const niveauLabels: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

function niveauLabel(value: string) {
  return niveauLabels[value] ?? value;
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

export function AdminFormationRegistrationsList() {
  const [registrations, setRegistrations] = useState<FormationRegistration[]>([]);
  const [sessions, setSessions] = useState<FormationSession[]>([]);
  const [certificates, setCertificates] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [referenceDrafts, setReferenceDrafts] = useState<Record<string, string>>({});
  const [verifying, setVerifying] = useState<string | null>(null);
  const [issuing, setIssuing] = useState<string | null>(null);
  const [certificateError, setCertificateError] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/hcp-bo-7x9k2m/formation-sessions", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
      })
      .catch(() => {});

    fetch("/api/hcp-bo-7x9k2m/formation-certificates", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {};
          for (const cert of data) map[cert.registrationId] = cert.certificateNumber;
          setCertificates(map);
        }
      })
      .catch(() => {});
  }, []);

  function sessionLabel(sessionId?: string) {
    if (!sessionId) return null;
    const session = sessions.find((item) => item.id === sessionId);
    return session ? `${session.name} (${new Date(session.startDate).toLocaleDateString("fr-FR")})` : null;
  }

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/hcp-bo-7x9k2m/formation-registrations", { credentials: "same-origin" });
      if (!response.ok) throw new Error("load");
      setRegistrations(await response.json());
    } catch {
      setError("Impossible de charger les inscriptions.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: FormationRegistrationStatus) {
    const response = await fetch("/api/hcp-bo-7x9k2m/formation-registrations", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (response.ok) {
      setRegistrations((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    }
  }

  async function verifyPayment(id: string) {
    const reference = referenceDrafts[id]?.trim();
    if (!reference) return;

    setVerifying(id);
    try {
      const response = await fetch("/api/formation-registrations/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: id, reference }),
      });

      if (response.ok) {
        await load();
      }
    } finally {
      setVerifying(null);
    }
  }

  async function issueCertificate(id: string) {
    setIssuing(id);
    setCertificateError((current) => ({ ...current, [id]: "" }));
    try {
      const response = await fetch("/api/hcp-bo-7x9k2m/formation-certificates", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: id }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setCertificateError((current) => ({ ...current, [id]: payload.error || "Génération impossible." }));
        return;
      }

      setCertificates((current) => ({ ...current, [id]: payload.certificateNumber }));
    } finally {
      setIssuing(null);
    }
  }

  function exportCsv() {
    const headers = [
      "Nom",
      "Prénoms",
      "WhatsApp",
      "E-mail",
      "Pays",
      "Ville",
      "Profession",
      "Entreprise",
      "Niveau informatique",
      "Formule",
      "Prix",
      "Prix original",
      "Code promo",
      "Mode de participation",
      "Session",
      "Mode de paiement",
      "Statut",
      "Montant payé",
      "Référence paiement",
      "Date de paiement",
      "Source",
      "Date d'inscription",
    ];

    const rows = registrations.map((item) => [
      item.nom,
      item.prenoms,
      item.whatsapp,
      item.email,
      item.pays,
      item.ville,
      item.profession,
      item.entreprise ?? "",
      niveauLabel(item.niveauInformatique),
      item.formuleTitle,
      String(item.prix),
      item.prixOriginal ? String(item.prixOriginal) : "",
      item.codePromo ?? "",
      item.modeParticipation === "presentiel" ? "Présentiel" : "En ligne",
      sessionLabel(item.sessionId) ?? "",
      modePaiementLabel(item.modePaiement),
      statusOptions.find((option) => option.value === item.status)?.label ?? item.status,
      item.montantPaye ? String(item.montantPaye) : "",
      item.referencePaiement ?? "",
      item.paiementConfirmeAt ? new Date(item.paiementConfirmeAt).toLocaleString("fr-FR") : "",
      item.source,
      new Date(item.createdAt).toLocaleString("fr-FR"),
    ]);

    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(";")).join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inscriptions-formation-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <PremiumCard className="p-8 text-sm text-white/50">Chargement des inscriptions...</PremiumCard>;
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

  if (!registrations.length) {
    return (
      <PremiumCard className="p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <Inbox className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Aucune inscription pour le moment</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
              Les prochaines inscriptions depuis la page Formation apparaîtront ici automatiquement.
            </p>
          </div>
        </div>
      </PremiumCard>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="flex justify-end">
        <Button onClick={exportCsv} variant="ghost" className="gap-2 text-white/70 hover:bg-white/5 hover:text-white">
          <Download className="h-4 w-4" />
          Exporter en CSV ({registrations.length})
        </Button>
      </div>

      {registrations.map((item) => (
        <PremiumCard key={item.id} className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{item.prenoms} {item.nom}</h3>
                <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${statusStyles[item.status]}`}>
                  {statusOptions.find((option) => option.value === item.status)?.label ?? item.status}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
                <span className="inline-flex items-center gap-1.5 text-emerald-300">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {item.formuleTitle} — {formatPrice(item.prix)}
                </span>
                <span>{item.whatsapp}</span>
                {item.email ? <a href={`mailto:${item.email}`} className="text-emerald-300 hover:text-emerald-200">{item.email}</a> : null}
                {item.ville || item.pays ? <span>{[item.ville, item.pays].filter(Boolean).join(", ")}</span> : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/45">
                {item.profession ? <span>Profession : {item.profession}</span> : null}
                {item.entreprise ? <span>Entreprise : {item.entreprise}</span> : null}
                {item.niveauInformatique ? <span>Niveau info : {niveauLabel(item.niveauInformatique)}</span> : null}
                <span>Participation : {item.modeParticipation === "presentiel" ? "Présentiel" : "En ligne"}</span>
                {sessionLabel(item.sessionId) ? <span>Session : {sessionLabel(item.sessionId)}</span> : null}
                <span>Paiement : {modePaiementLabel(item.modePaiement)}</span>
                {item.codePromo ? (
                  <span>
                    Code promo : {item.codePromo}
                    {item.prixOriginal ? <> ({formatPrice(item.prixOriginal)} → {formatPrice(item.prix)})</> : null}
                  </span>
                ) : null}
                <span>Source : {item.source}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className={item.montantPaye ? "text-emerald-300" : "text-white/45"}>
                  Payé : {formatPrice(item.montantPaye ?? 0)} / {formatPrice(item.prix)}
                </span>
                {item.montantPaye !== undefined && item.montantPaye < item.prix ? (
                  <span className="text-amber-300">Solde restant : {formatPrice(item.prix - item.montantPaye)}</span>
                ) : null}
                {item.referencePaiement ? <span className="text-white/40">Réf. : {item.referencePaiement}</span> : null}
                {item.paiementConfirmeAt ? (
                  <span className="text-white/40">Confirmé le {new Date(item.paiementConfirmeAt).toLocaleString("fr-FR")}</span>
                ) : null}
              </div>

              {!item.montantPaye ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <input
                    value={referenceDrafts[item.id] ?? ""}
                    onChange={(event) => setReferenceDrafts((current) => ({ ...current, [item.id]: event.target.value }))}
                    placeholder="Référence de transaction Kadev"
                    className="w-56 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                  <button
                    type="button"
                    onClick={() => verifyPayment(item.id)}
                    disabled={verifying === item.id || !referenceDrafts[item.id]?.trim()}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-50"
                  >
                    {verifying === item.id ? "Vérification..." : "Vérifier le paiement"}
                  </button>
                </div>
              ) : null}

              {item.montantPaye ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {certificates[item.id] ? (
                    <a
                      href={`/api/hcp-bo-7x9k2m/formation-certificates/${certificates[item.id]}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
                    >
                      Télécharger l&apos;attestation ({certificates[item.id]})
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => issueCertificate(item.id)}
                      disabled={issuing === item.id}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-50"
                    >
                      {issuing === item.id ? "Génération..." : "Générer l'attestation"}
                    </button>
                  )}
                  {certificateError[item.id] ? (
                    <span className="text-xs text-red-300">{certificateError[item.id]}</span>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-3 text-xs text-white/35">
                {new Date(item.createdAt).toLocaleString("fr-FR")}
              </div>
            </div>

            <select
              value={item.status}
              onChange={(event) => updateStatus(item.id, event.target.value as FormationRegistrationStatus)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </PremiumCard>
      ))}
    </div>
  );
}
