import { NextRequest, NextResponse } from "next/server";
import { verifyKadevSignature } from "@/lib/kadev-pay";
import { confirmFormationRegistrationPayment, getFormationRegistrationById } from "@/lib/site-storage";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x_kadevpay_signature") || req.headers.get("X-KadevPay-Signature");

  if (!verifyKadevSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  if (payload.event !== "payment.success" || payload.status !== "paid") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const registrationId = payload.metadata?.registrationId;
  const reference = String(payload.reference ?? "");
  const amount = Number(payload.amount ?? 0);

  if (!registrationId || !reference) {
    return NextResponse.json({ error: "Payload incomplet." }, { status: 400 });
  }

  const registration = await getFormationRegistrationById(String(registrationId));
  if (!registration) {
    return NextResponse.json({ error: "Inscription introuvable." }, { status: 404 });
  }

  await confirmFormationRegistrationPayment(registration.id, {
    montantPaye: amount,
    referencePaiement: reference,
  });

  return NextResponse.json({ ok: true });
}
