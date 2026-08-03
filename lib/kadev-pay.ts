import { createHmac, timingSafeEqual } from "crypto";

export type KadevVerifyResult = {
  status: string;
  reference: string;
  amount: number;
};

export function verifyKadevSignature(rawBody: string, signature: string | null) {
  const secret = process.env.KADEV_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const signatureBuffer = Buffer.from(signature, "hex");

  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export async function verifyKadevTransaction(reference: string): Promise<KadevVerifyResult | null> {
  const secretKey = process.env.KADEV_SECRET_KEY;
  if (!secretKey) throw new Error("KADEV_SECRET_KEY manquant.");

  const response = await fetch(`https://pay.kadev.ci/api/v1/transactions/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  if (!response.ok) return null;

  const payload = await response.json().catch(() => null);
  if (!payload) return null;

  return {
    status: String(payload.status ?? ""),
    reference: String(payload.reference ?? reference),
    amount: Number(payload.amount ?? 0),
  };
}
