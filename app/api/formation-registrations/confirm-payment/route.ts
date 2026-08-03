import { NextRequest, NextResponse } from "next/server";
import { verifyKadevTransaction } from "@/lib/kadev-pay";
import { confirmFormationRegistrationPayment, getFormationRegistrationById } from "@/lib/site-storage";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const registrationId = clean(body?.registrationId);
  const reference = clean(body?.reference);

  if (!registrationId || !reference) {
    return NextResponse.json({ error: "Inscription et référence de transaction requises." }, { status: 400 });
  }

  const registration = await getFormationRegistrationById(registrationId);
  if (!registration) {
    return NextResponse.json({ error: "Inscription introuvable." }, { status: 404 });
  }

  const transaction = await verifyKadevTransaction(reference);
  if (!transaction || transaction.status !== "paid") {
    return NextResponse.json({ error: "Paiement non confirmé pour cette référence." }, { status: 400 });
  }

  await confirmFormationRegistrationPayment(registration.id, {
    montantPaye: transaction.amount,
    referencePaiement: transaction.reference,
  });

  return NextResponse.json({ ok: true });
}
