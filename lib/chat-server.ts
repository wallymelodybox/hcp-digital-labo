import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender: "visitor" | "agent";
  body: string;
  created_at: string;
};

export function getChatClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function newVisitorToken() {
  return randomBytes(32).toString("base64url");
}

export function hashVisitorToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function safeApiKey(value: string | null) {
  const expected = process.env.CHAT_MOBILE_API_KEY;
  if (!expected || !value) return false;
  const supplied = value.startsWith("Bearer ") ? value.slice(7) : "";
  const left = Buffer.from(supplied);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function cleanMessage(value: unknown) {
  if (typeof value !== "string") return null;
  const text = value.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  return text.length >= 1 && text.length <= 2000 ? text : null;
}

export function chatUnavailable() {
  return Response.json({ error: "Service de chat non configuré." }, { status: 503 });
}

const attempts = new Map<string, { count: number; resetAt: number }>();

export function allowChatRequest(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
