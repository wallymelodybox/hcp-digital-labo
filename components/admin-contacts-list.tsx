"use client";

import { useEffect, useState } from "react";
import { CheckCheck, Inbox, MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";

type ContactRequest = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  pole?: string;
  message: string;
  source: string;
  createdAt: string;
  status: "new" | "read";
};

export function AdminContactsList() {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadContacts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/hcp-bo-7x9k2m/contacts", { credentials: "same-origin" });
      if (!response.ok) throw new Error("load");
      setContacts(await response.json());
    } catch {
      setError("Impossible de charger les demandes.");
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: string) {
    const response = await fetch("/api/hcp-bo-7x9k2m/contacts", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setContacts((current) => current.map((contact) => (contact.id === id ? { ...contact, status: "read" } : contact)));
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  if (loading) {
    return <PremiumCard className="p-8 text-sm text-white/50">Chargement des demandes...</PremiumCard>;
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

  if (!contacts.length) {
    return (
      <PremiumCard className="p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <Inbox className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Aucune demande pour le moment</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
              Les prochains envois depuis les formulaires du site apparaîtront ici automatiquement.
            </p>
          </div>
        </div>
      </PremiumCard>
    );
  }

  return (
    <div className="grid gap-5">
      {contacts.map((contact) => (
        <PremiumCard key={contact.id} className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${contact.status === "new" ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/5 text-white/45"}`}>
                  {contact.status === "new" ? "Nouveau" : "Lu"}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/50">
                {contact.company ? <span>{contact.company}</span> : null}
                {contact.email ? <a href={`mailto:${contact.email}`} className="text-emerald-300 hover:text-emerald-200">{contact.email}</a> : null}
                {contact.phone ? <span>{contact.phone}</span> : null}
                {contact.pole ? <span>Pôle : {contact.pole}</span> : null}
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/75">{contact.message}</p>
              <div className="mt-4 text-xs text-white/35">
                Source : {contact.source} · {new Date(contact.createdAt).toLocaleString("fr-FR")}
              </div>
            </div>
            {contact.status === "new" ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => markRead(contact.id)} className="gap-2 text-white/60 hover:bg-white/5 hover:text-white">
                <CheckCheck className="h-4 w-4" />
                Marquer lu
              </Button>
            ) : null}
          </div>
        </PremiumCard>
      ))}
    </div>
  );
}
