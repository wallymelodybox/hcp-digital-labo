import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getFormationPromoCodes, saveFormationPromoCodes } from "@/lib/site-storage";
import type { FormationPromoCode, PromoDiscountType } from "@/lib/formation-promo-codes";

const allowedDiscountTypes: PromoDiscountType[] = ["fixed", "percent"];

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanCode(raw: unknown, index: number): FormationPromoCode | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;

  const code = cleanText(item.code).toUpperCase();
  const discountValue = Number(item.discountValue);

  if (!code || !Number.isFinite(discountValue) || discountValue < 0) return null;

  const discountType = allowedDiscountTypes.includes(item.discountType as PromoDiscountType)
    ? (item.discountType as PromoDiscountType)
    : "fixed";

  const maxUses = Number(item.maxUses);

  return {
    id: cleanText(item.id) || `promo-${index + 1}`,
    code,
    discountType,
    discountValue,
    formuleId: cleanText(item.formuleId) || undefined,
    maxUses: Number.isFinite(maxUses) && maxUses > 0 ? maxUses : undefined,
    startDate: cleanText(item.startDate) || undefined,
    endDate: cleanText(item.endDate) || undefined,
    active: Boolean(item.active),
  };
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return NextResponse.json(await getFormationPromoCodes());
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "La liste des codes est invalide." }, { status: 400 });
  }

  const codes = body.map(cleanCode).filter(Boolean) as FormationPromoCode[];
  if (codes.length !== body.length) {
    return NextResponse.json({ error: "Un ou plusieurs codes sont invalides." }, { status: 400 });
  }

  const seen = new Set<string>();
  for (const code of codes) {
    if (seen.has(code.code)) {
      return NextResponse.json({ error: `Le code "${code.code}" est en double.` }, { status: 400 });
    }
    seen.add(code.code);
  }

  await saveFormationPromoCodes(codes);
  return NextResponse.json(codes);
}
