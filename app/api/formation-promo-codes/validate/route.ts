import { NextRequest, NextResponse } from "next/server";
import { getFormationOffers, resolvePromoCode } from "@/lib/site-storage";
import { computeDiscountedPrice } from "@/lib/formation-promo-codes";
import { enforceRateLimit, readLimitedJson } from "@/lib/request-security";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "promo-validation", 20, 10 * 60_000);
  if (rateLimited) return rateLimited;
  const body = await readLimitedJson(req, 2_048) as Record<string, unknown> | null;
  const code = clean(body?.code);
  const formuleId = clean(body?.formuleId);

  if (!code || code.length > 64 || !formuleId || formuleId.length > 100) {
    return NextResponse.json({ error: "Code et formule requis." }, { status: 400 });
  }

  const offers = await getFormationOffers();
  const offer = offers.find((item) => item.id === formuleId);
  if (!offer) {
    return NextResponse.json({ error: "Formule introuvable." }, { status: 400 });
  }

  const resolution = await resolvePromoCode(code, formuleId);
  if (!resolution.ok) {
    return NextResponse.json({ error: resolution.error }, { status: 400 });
  }

  const discountedPrice = computeDiscountedPrice(offer.price, resolution.promo);

  return NextResponse.json({
    ok: true,
    originalPrice: offer.price,
    discountedPrice,
  });
}
