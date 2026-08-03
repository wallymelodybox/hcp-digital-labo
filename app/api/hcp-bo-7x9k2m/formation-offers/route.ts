import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getFormationOffers, saveFormationOffers } from "@/lib/site-storage";
import type { FormationLevel, FormationOffer } from "@/lib/formation-offers";

const allowedLevels: FormationLevel[] = ["basique", "intermediaire", "complete"];

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOffer(raw: unknown, index: number): FormationOffer | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const title = cleanText(item.title);
  const tagline = cleanText(item.tagline);
  const price = Number(item.price);
  const duration = cleanText(item.duration);
  const ctaLabel = cleanText(item.ctaLabel);

  if (!title || !tagline || !Number.isFinite(price) || price < 0 || !duration || !ctaLabel) return null;

  const level = allowedLevels.includes(item.level as FormationLevel)
    ? (item.level as FormationLevel)
    : "basique";

  const features = Array.isArray(item.features)
    ? item.features.map(cleanText).filter(Boolean).slice(0, 20)
    : [];

  const originalPrice = Number(item.originalPrice);

  return {
    id: cleanText(item.id) || `formule-${index + 1}`,
    level,
    title,
    tagline,
    price,
    originalPrice: Number.isFinite(originalPrice) && originalPrice > 0 ? originalPrice : undefined,
    duration,
    badge: cleanText(item.badge) || undefined,
    features,
    ctaLabel,
  };
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return NextResponse.json(await getFormationOffers());
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "La liste des formules est invalide." }, { status: 400 });
  }

  const offers = body.map(cleanOffer).filter(Boolean) as FormationOffer[];
  if (!offers.length) {
    return NextResponse.json({ error: "Au moins une formule complète est nécessaire." }, { status: 400 });
  }

  await saveFormationOffers(offers);
  return NextResponse.json(offers);
}
