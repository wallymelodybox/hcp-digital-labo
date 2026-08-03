"use client";

import { useEffect, useMemo, useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";
import { poles } from "@/lib/poles-data";

type Images = Record<string, string>;

const globalImages = [
  {
    id: "homeHero",
    title: "Hero accueil",
    fallback: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "contactHero",
    title: "Hero contact",
    fallback: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "formationPricingBanner",
    title: "Bannière Formation IA (image ou vidéo)",
    fallback: "",
  },
];

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(?:[?#].*)?$/i.test(url);
}

export function AdminImageManager() {
  const [images, setImages] = useState<Images>({});
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const items = useMemo(
    () => [
      ...globalImages,
      ...poles.map((pole) => ({ id: pole.id, title: pole.title, fallback: pole.image })),
    ],
    [],
  );

  useEffect(() => {
    fetch("/api/hcp-bo-7x9k2m/site-images", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setImages(data || {});
        setStatus("idle");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Impossible de charger les images du BO.");
      });
  }, []);

  async function save() {
    setStatus("saving");
    setMessage("");

    const response = await fetch("/api/hcp-bo-7x9k2m/site-images", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(images),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error || "Sauvegarde impossible.");
      return;
    }

    setImages(payload);
    setStatus("success");
    setMessage("Images mises à jour.");
  }

  function updateImage(id: string, value: string) {
    setImages((current) => ({ ...current, [id]: value }));
  }

  function resetImage(id: string) {
    setImages((current) => ({ ...current, [id]: "" }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Images du site</h2>
          <p className="mt-2 text-white/50">Modifiez les URLs des visuels principaux. Laissez vide pour revenir à l'image par défaut.</p>
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
        {items.map((item) => {
          const value = images[item.id] || "";
          const preview = value || item.fallback;

          return (
            <PremiumCard key={item.id} className="p-6">
              <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-start">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  {preview ? (
                    isVideoUrl(preview) ? (
                      <video src={preview} className="aspect-video w-full object-cover" muted controls playsInline preload="metadata" />
                    ) : (
                      <img src={preview} alt={item.title} className="aspect-video w-full object-cover" />
                    )
                  ) : (
                    <div className="flex aspect-video items-center justify-center px-5 text-center text-xs text-white/35">
                      Aucun média — le visuel par défaut sera utilisé
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/35">Clé : {item.id}</div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => resetImage(item.id)} className="gap-2 text-white/60 hover:bg-white/5 hover:text-white">
                      <RotateCcw className="h-4 w-4" />
                      Défaut
                    </Button>
                  </div>
                  <label className="mt-5 block text-xs font-semibold uppercase tracking-widest text-white/40">
                    {item.id === "formationPricingBanner" ? "URL directe de l’image ou de la vidéo" : "URL image"}
                  </label>
                  <input
                    value={value}
                    onChange={(event) => updateImage(item.id, event.target.value)}
                    placeholder={item.fallback}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                  {item.id === "formationPricingBanner" ? (
                    <p className="mt-2 text-xs text-white/35">Vidéo compatible : MP4, WebM, OGG ou MOV. Utilisez une URL directe vers le fichier.</p>
                  ) : null}
                </div>
              </div>
            </PremiumCard>
          );
        })}
      </div>
    </div>
  );
}
