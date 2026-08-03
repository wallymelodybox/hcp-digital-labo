import { NextRequest, NextResponse } from "next/server";

type RateBucket = { count: number; resetAt: number };
const buckets = new Map<string, RateBucket>();

function clientAddress(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
}

export function enforceRateLimit(
  req: NextRequest,
  scope: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
    if (buckets.size > 10_000) buckets.clear();
  }
  const key = `${scope}:${clientAddress(req)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  current.count += 1;
  if (current.count <= limit) return null;

  return NextResponse.json(
    { error: "Trop de tentatives. Merci de réessayer plus tard." },
    {
      status: 429,
      headers: { "Retry-After": String(Math.max(1, Math.ceil((current.resetAt - now) / 1000))) },
    },
  );
}

export async function readLimitedJson(req: NextRequest, maxBytes = 16_384) {
  const declaredLength = Number(req.headers.get("content-length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) return null;

  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > maxBytes) return null;

  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}
