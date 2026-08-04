"use client";

import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Loader2, RotateCcw, Save, Upload } from "lucide-react";
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

async function hasRequiredBannerDimensions(file: File) {
  if (!file.type.startsWith("image/")) return true;

  const objectUrl = URL.createObjectURL(file);
  try {
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = reject;
      image.src = objectUrl;
    });
    return dimensions.width === 1536 && dimensions.height === 1024;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function AdminImageManager() {
  const [images, setImages] = useState<Images>({});
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

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

  function resetImage(id: string) {
    setImages((current) => ({ ...current, [id]: "" }));
  }

  async function uploadFile(id: string, file: File) {
    setUploadingKey(id);
    setStatus("idle");
    setMessage("");

    try {
      if (!(await hasRequiredBannerDimensions(file))) {
        setStatus("error");
        setMessage("Dimension incorrecte : choisissez une image de 1536 × 1024 px exactement.");
        return;
      }
    } catch {
      setStatus("error");
      setMessage("Impossible de lire les dimensions de cette image.");
      return;
    } finally {
      setUploadingKey(null);
    }

    const formData = new FormData();
    formData.append("key", id);
    formData.append("file", file);
    setUploadingKey(id);

    try {
      const response = await fetch("/api/hcp-bo-7x9k2m/site-images", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error || "Téléversement impossible.");
        return;
      }

      setImages(payload.images || {});
      setStatus("success");
      setMessage("Le média a été remplacé avec succès.");
    } catch {
      setStatus("error");
      setMessage("Téléversement impossible. Vérifiez votre connexion.");
    } finally {
      setUploadingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Images du site</h2>
          <p className="mt-2 text-white/50">Choisissez un fichier depuis votre appareil pour remplacer chaque visuel.</p>
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
                      <video src={preview} className="aspect-3/2 w-full bg-white object-contain" muted controls playsInline preload="metadata" />
                    ) : (
                      <img src={preview} alt={item.title} className="aspect-3/2 w-full bg-white object-contain opacity-100" />
                    )
                  ) : (
                    <div className="flex aspect-3/2 items-center justify-center px-5 text-center text-xs text-white/35">
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
                  <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-black/15 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                          <ImagePlus className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Choisir un nouveau média</div>
                          <div className="mt-1 text-xs text-white/40">
                            {item.id === "formationPricingBanner"
                              ? "Format 1536 × 1024 px — image 8 Mo ou vidéo 50 Mo max."
                              : "Format obligatoire : 1536 × 1024 px — 8 Mo max."}
                          </div>
                        </div>
                      </div>

                      <label
                        htmlFor={`media-${item.id}`}
                        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 ${uploadingKey === item.id ? "pointer-events-none opacity-60" : ""}`}
                      >
                        {uploadingKey === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploadingKey === item.id ? "Envoi..." : "Parcourir"}
                      </label>
                      <input
                        id={`media-${item.id}`}
                        type="file"
                        accept={item.id === "formationPricingBanner" ? "image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/ogg,video/quicktime" : "image/jpeg,image/png,image/webp,image/gif,image/avif"}
                        className="sr-only"
                        disabled={Boolean(uploadingKey)}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void uploadFile(item.id, file);
                          event.target.value = "";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PremiumCard>
          );
        })}
      </div>
    </div>
  );
}
