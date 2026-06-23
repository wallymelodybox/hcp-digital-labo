"use client";

import { useState } from "react";
import { poles } from "@/lib/poles-data";
import { siteContact } from "@/lib/site-data";
import { PrimaryButton } from "@/components/ui/primary-button";

type ContactFormProps = {
  compact?: boolean;
  source?: string;
};

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({ compact = false, source = "site" }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error || "Impossible d'envoyer la demande.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage("Demande reçue. Elle est maintenant visible dans le BO.");
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${source}-name`} className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
            Nom
          </label>
          <input
            id={`${source}-name`}
            name="name"
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            placeholder="Votre nom"
          />
        </div>

        {!compact ? (
          <div>
            <label htmlFor={`${source}-company`} className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
              Entreprise
            </label>
            <input
              id={`${source}-company`}
              name="company"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              placeholder="Votre entreprise"
            />
          </div>
        ) : (
          <div>
            <label htmlFor={`${source}-phone`} className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
              Téléphone
            </label>
            <input
              id={`${source}-phone`}
              name="phone"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              placeholder={siteContact.phone}
            />
          </div>
        )}
      </div>

      {!compact ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor={`${source}-email`} className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
              Email
            </label>
            <input
              id={`${source}-email`}
              name="email"
              type="email"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label htmlFor={`${source}-phone-full`} className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
              Téléphone
            </label>
            <input
              id={`${source}-phone-full`}
              name="phone"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              placeholder={siteContact.phone}
            />
          </div>
        </div>
      ) : null}

      {!compact ? (
        <div>
          <label htmlFor={`${source}-pole`} className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
            Pôle d'intérêt
          </label>
          <select
            id={`${source}-pole`}
            name="pole"
            className="mt-2 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          >
            <option value="">Sélectionnez un pôle</option>
            {poles.map((pole) => (
              <option key={pole.id} value={pole.id}>
                {pole.title}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label htmlFor={`${source}-message`} className="text-xs font-semibold tracking-[0.22em] text-white/60 uppercase">
          Besoin
        </label>
        <textarea
          id={`${source}-message`}
          name="message"
          required
          rows={compact ? 4 : 5}
          className="mt-2 min-h-30 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          placeholder="Objectif, délai, budget indicatif"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-white/50">Réponse sous {siteContact.responseTime}.</div>
        <PrimaryButton disabled={status === "loading"}>
          {status === "loading" ? "Envoi..." : "Envoyer"}
        </PrimaryButton>
      </div>

      {message ? (
        <div className={`rounded-xl border px-4 py-3 text-sm ${status === "success" ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100" : "border-red-400/25 bg-red-400/10 text-red-100"}`}>
          {message}
        </div>
      ) : null}
    </form>
  );
}

