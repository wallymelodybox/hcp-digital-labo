import { NextRequest, NextResponse } from "next/server";
import { getFormationOffers, resolvePromoCode } from "@/lib/site-storage";
import { computeDiscountedPrice } from "@/lib/formation-promo-codes";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const code = clean(body?.code);
  const formuleId = clean(body?.formuleId);

  if (!code || !formuleId) {
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
