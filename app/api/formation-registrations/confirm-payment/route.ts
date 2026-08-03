import { NextRequest, NextResponse } from "next/server";
import { verifyKadevTransaction } from "@/lib/kadev-pay";
import { confirmFormationRegistrationPayment, getFormationRegistrationById } from "@/lib/site-storage";
import { enforceRateLimit, readLimitedJson } from "@/lib/request-security";
import { isAdminMutationRequest } from "@/lib/admin-auth";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  // Manual verification is an administrative fallback; public clients rely on the signed webhook.
  if (!isAdminMutationRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const rateLimited = enforceRateLimit(req, "payment-confirmation", 10, 10 * 60_000);
  if (rateLimited) return rateLimited;
  const body = await readLimitedJson(req, 4_096) as Record<string, unknown> | null;
  const registrationId = clean(body?.registrationId);
  const reference = clean(body?.reference);

  if (!/^[0-9a-f-]{36}$/i.test(registrationId) || !/^[A-Za-z0-9._-]{1,160}$/.test(reference)) {
    return NextResponse.json({ error: "Inscription et référence de transaction requises." }, { status: 400 });
  }

  const registration = await getFormationRegistrationById(registrationId);
  if (!registration) {
    return NextResponse.json({ error: "Inscription introuvable." }, { status: 404 });
  }

  const transaction = await verifyKadevTransaction(reference);
  if (!transaction || transaction.status !== "paid" || transaction.reference !== reference) {
    return NextResponse.json({ error: "Paiement non confirmé pour cette référence." }, { status: 400 });
  }

  const confirmation = await confirmFormationRegistrationPayment(registration.id, {
    montantPaye: transaction.amount,
    referencePaiement: transaction.reference,
  });

  if (!confirmation.ok) {
    const message = confirmation.reason === "amount_mismatch"
      ? "Le montant payé ne correspond pas au montant de l'inscription."
      : "Cette référence de paiement ne peut pas être utilisée.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
