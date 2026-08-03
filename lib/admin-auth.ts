import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function parseBasicCredentials(header: string) {
  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 1) return null;
    return { user: decoded.slice(0, separator), password: decoded.slice(separator + 1) };
  } catch {
    return null;
  }
}

export function isAdminRequest(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  if (!basicAuth?.startsWith("Basic ")) {
    return false;
  }

  const validUser = process.env.ADMIN_USER;
  const validPass = process.env.ADMIN_PASSWORD;
  const credentials = parseBasicCredentials(basicAuth);

  // Fail closed: production must never silently fall back to known credentials.
  if (!validUser || !validPass || !credentials) return false;
  return safeEqual(credentials.user, validUser) && safeEqual(credentials.password, validPass);
}

export function isTrustedMutationOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin || origin === "null") return false;

  try {
    const originUrl = new URL(origin);
    const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const requestHost = forwardedHost || req.headers.get("host");
    return Boolean(requestHost) && originUrl.host === requestHost;
  } catch {
    return false;
  }
}

export function isAdminMutationRequest(req: NextRequest) {
  return isAdminRequest(req) && isTrustedMutationOrigin(req);
}
