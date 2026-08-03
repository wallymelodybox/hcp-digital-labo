import { NextRequest, NextResponse } from "next/server";
import { verifyKadevSignature } from "@/lib/kadev-pay";
import { confirmFormationRegistrationPayment, getFormationRegistrationById } from "@/lib/site-storage";
import { enforceRateLimit } from "@/lib/request-security";

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "kadev-webhook", 120, 60_000);
  if (rateLimited) return rateLimited;
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > 32_768) {
    return NextResponse.json({ error: "Payload trop volumineux." }, { status: 413 });
  }
  const rawBody = await req.text();
  if (Buffer.byteLength(rawBody, "utf8") > 32_768) {
    return NextResponse.json({ error: "Payload trop volumineux." }, { status: 413 });
  }
  const signature = req.headers.get("x_kadevpay_signature") || req.headers.get("X-KadevPay-Signature");

  if (!verifyKadevSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }
  const event = payload as Record<string, unknown>;
  const data = event.data && typeof event.data === "object"
    ? event.data as Record<string, unknown>
    : null;

  if (event.event !== "payment.success" || data?.status !== "paid") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const metadata = data.metadata && typeof data.metadata === "object" ? data.metadata as Record<string, unknown> : null;
  const registrationId = metadata?.registrationId;
  const reference = typeof data.reference === "string" ? data.reference.trim() : "";
  const amount = Number(data.amount ?? 0);

  if (!registrationId || !reference) {
    return NextResponse.json({ error: "Payload incomplet." }, { status: 400 });
  }

  const registration = await getFormationRegistrationById(String(registrationId));
  if (!registration) {
    return NextResponse.json({ error: "Inscription introuvable." }, { status: 404 });
  }

  const confirmation = await confirmFormationRegistrationPayment(registration.id, {
    montantPaye: amount,
    referencePaiement: reference,
  });

  if (!confirmation.ok) {
    return NextResponse.json({ error: "Paiement incohérent avec l'inscription." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
