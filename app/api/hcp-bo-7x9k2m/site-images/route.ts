import { NextRequest, NextResponse } from "next/server";
import { isAdminMutationRequest, isAdminRequest } from "@/lib/admin-auth";
import { getSiteImages, saveSiteImages } from "@/lib/site-storage";

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
