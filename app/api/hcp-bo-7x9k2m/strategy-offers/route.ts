import { NextRequest, NextResponse } from "next/server";
import { isAdminMutationRequest, isAdminRequest } from "@/lib/admin-auth";
import { getStrategyOffers, saveStrategyOffers } from "@/lib/site-storage";
import type { StrategyOffer, StrategyOfferIcon } from "@/lib/strategy-offers";

const allowedIcons: StrategyOfferIcon[] = ["target", "pen", "chart", "file"];

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOffer(raw: unknown, index: number): StrategyOffer | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const title = cleanText(item.title);
  const desc = cleanText(item.desc);

  if (!title || !desc) return null;

  const icon = allowedIcons.includes(item.icon as StrategyOfferIcon)
    ? (item.icon as StrategyOfferIcon)
    : "target";

  const bullets = Array.isArray(item.bullets)
    ? item.bullets.map(cleanText).filter(Boolean).slice(0, 6)
    : [];

  return {
    id: cleanText(item.id) || `offre-${index + 1}`,
    icon,
    title,
    desc,
    bullets,
  };
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return NextResponse.json(await getStrategyOffers());
}

export async function PUT(req: NextRequest) {
  if (!isAdminMutationRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "La liste des offres est invalide." }, { status: 400 });
  }

  const offers = body.map(cleanOffer).filter(Boolean) as StrategyOffer[];
  if (!offers.length) {
    return NextResponse.json({ error: "Au moins une offre complète est nécessaire." }, { status: 400 });
  }

  await saveStrategyOffers(offers);
  return NextResponse.json(offers);
}
