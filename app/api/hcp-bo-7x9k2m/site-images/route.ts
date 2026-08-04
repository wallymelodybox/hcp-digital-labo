import { NextRequest, NextResponse } from "next/server";
import { isAdminMutationRequest, isAdminRequest } from "@/lib/admin-auth";
import { getSiteImages, saveSiteImages } from "@/lib/site-storage";
import { hasRemoteMediaStorage, removeRemoteSiteMedia, uploadRemoteSiteMedia } from "@/lib/site-media-storage";

export const runtime = "nodejs";

function isAllowedImageUrl(value: unknown) {
  if (value === "") return true;
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\");
  }
}

const allowedImageKeys = new Set([
  "homeHero",
  "contactHero",
  "formationPricingBanner",
  "strategie",
  "digital",
  "evenementiel",
  "production",
  "formation",
  "livraison",
  "vtc",
]);

const allowedFiles: Record<string, { extension: string; maxBytes: number; kind: "image" | "video" }> = {
  "image/jpeg": { extension: "jpg", maxBytes: 8 * 1024 * 1024, kind: "image" },
  "image/png": { extension: "png", maxBytes: 8 * 1024 * 1024, kind: "image" },
  "image/webp": { extension: "webp", maxBytes: 8 * 1024 * 1024, kind: "image" },
  "image/gif": { extension: "gif", maxBytes: 8 * 1024 * 1024, kind: "image" },
  "image/avif": { extension: "avif", maxBytes: 8 * 1024 * 1024, kind: "image" },
  "video/mp4": { extension: "mp4", maxBytes: 50 * 1024 * 1024, kind: "video" },
  "video/webm": { extension: "webm", maxBytes: 50 * 1024 * 1024, kind: "video" },
  "video/ogg": { extension: "ogv", maxBytes: 50 * 1024 * 1024, kind: "video" },
  "video/quicktime": { extension: "mov", maxBytes: 50 * 1024 * 1024, kind: "video" },
};

function hasExpectedSignature(bytes: Uint8Array, mime: string) {
  const ascii = (start: number, end: number) => Buffer.from(bytes.slice(start, end)).toString("ascii");
  const hex = (end: number) => Buffer.from(bytes.slice(0, end)).toString("hex");

  if (mime === "image/jpeg") return hex(3) === "ffd8ff";
  if (mime === "image/png") return hex(8) === "89504e470d0a1a0a";
  if (mime === "image/gif") return ["GIF87a", "GIF89a"].includes(ascii(0, 6));
  if (mime === "image/webp") return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  if (mime === "image/avif") return ascii(4, 12).startsWith("ftypavi");
  if (mime === "video/webm") return hex(4) === "1a45dfa3";
  if (mime === "video/ogg") return ascii(0, 4) === "OggS";
  if (mime === "video/mp4" || mime === "video/quicktime") return ascii(4, 8) === "ftyp";
  return false;
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return NextResponse.json(await getSiteImages());
}

export async function PUT(req: NextRequest) {
  if (!isAdminMutationRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }

  const current = await getSiteImages();
  const next = { ...current };

  for (const [key, rawValue] of Object.entries(body)) {
    if (!allowedImageKeys.has(key)) {
      return NextResponse.json({ error: `Clé de média inconnue : ${key}.` }, { status: 400 });
    }
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
    if (!isAllowedImageUrl(value)) {
      return NextResponse.json({ error: `URL invalide pour ${key}.` }, { status: 400 });
    }

    if (!value) {
      delete next[key];
    } else {
      next[key] = String(value);
    }
  }

  await saveSiteImages(next);
  return NextResponse.json(next);
}

export async function POST(req: NextRequest) {
  if (!isAdminMutationRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (!Number.isFinite(contentLength) || contentLength <= 0 || contentLength > 51 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop volumineux ou taille inconnue." }, { status: 413 });
  }

  const formData = await req.formData().catch(() => null);
  const key = formData?.get("key");
  const file = formData?.get("file");

  if (typeof key !== "string" || !allowedImageKeys.has(key) || !(file instanceof File)) {
    return NextResponse.json({ error: "Fichier ou emplacement invalide." }, { status: 400 });
  }

  const rules = allowedFiles[file.type];
  if (!rules || file.size <= 0 || file.size > rules.maxBytes) {
    return NextResponse.json({ error: "Format non autorisé ou fichier trop volumineux." }, { status: 400 });
  }
  if (rules.kind === "video" && key !== "formationPricingBanner") {
    return NextResponse.json({ error: "La vidéo est autorisée uniquement pour la bannière Formation IA." }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasExpectedSignature(bytes, file.type)) {
    return NextResponse.json({ error: "Le contenu du fichier ne correspond pas à son format." }, { status: 400 });
  }

  const images = await getSiteImages();
  if (!hasRemoteMediaStorage()) {
    return NextResponse.json(
      { error: "Supabase Storage n'est pas configuré sur ce serveur." },
      { status: 503 },
    );
  }

  const uploaded = await uploadRemoteSiteMedia(key, bytes, file.type, rules.extension);
  if (!uploaded) {
    return NextResponse.json({ error: "Téléversement Supabase indisponible." }, { status: 503 });
  }

  const previousUrl = images[key];
  const url = uploaded.url;
  const next = { ...images, [key]: url };
  try {
    await saveSiteImages(next);
  } catch (error) {
    await removeRemoteSiteMedia(url);
    throw error;
  }
  if (previousUrl && previousUrl !== url) await removeRemoteSiteMedia(previousUrl);

  return NextResponse.json({ ok: true, url, images: next });
}
