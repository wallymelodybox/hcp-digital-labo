import { NextRequest } from "next/server";
import { allowChatRequest, cleanMessage, getChatClient, hashVisitorToken, newVisitorToken, chatUnavailable } from "@/lib/chat-server";

export const dynamic = "force-dynamic";

function noStore(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowChatRequest(ip)) return noStore({ error: "Trop de messages. Réessayez dans une minute." }, 429);
  const client = getChatClient();
  if (!client) return chatUnavailable();
  const payload = await request.json().catch(() => null);
  const body = cleanMessage(payload?.body);
  if (!body) return noStore({ error: "Message invalide (2000 caractères maximum)." }, 400);

  let conversationId = typeof payload?.conversationId === "string" ? payload.conversationId : "";
  let visitorToken = request.headers.get("x-chat-token") || "";

  if (!conversationId) {
    visitorToken = newVisitorToken();
    const { data, error } = await client.from("chat_conversations").insert({
      visitor_token_hash: hashVisitorToken(visitorToken),
      visitor_name: typeof payload?.name === "string" ? payload.name.trim().slice(0, 100) : null,
      visitor_email: typeof payload?.email === "string" ? payload.email.trim().slice(0, 254) : null,
      page_url: typeof payload?.pageUrl === "string" ? payload.pageUrl.slice(0, 500) : null,
      status: "open",
    }).select("id,status,created_at").single();
    if (error || !data) return noStore({ error: "Conversation impossible à créer." }, 500);
    conversationId = data.id;
  } else {
    const { data } = await client.from("chat_conversations").select("id").eq("id", conversationId).eq("visitor_token_hash", hashVisitorToken(visitorToken)).maybeSingle();
    if (!data) return noStore({ error: "Conversation non autorisée." }, 403);
  }

  const { data: message, error } = await client.from("chat_messages").insert({ conversation_id: conversationId, sender: "visitor", body }).select("*").single();
  if (error) return noStore({ error: "Message non envoyé." }, 500);
  await client.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
  return noStore({ conversationId, visitorToken, message }, 201);
}

export async function GET(request: NextRequest) {
  const client = getChatClient();
  if (!client) return chatUnavailable();
  const conversationId = request.nextUrl.searchParams.get("conversationId");
  const visitorToken = request.headers.get("x-chat-token") || "";
  if (!conversationId || !visitorToken) return noStore({ error: "Identifiants manquants." }, 400);
  const { data: conversation } = await client.from("chat_conversations").select("id,status").eq("id", conversationId).eq("visitor_token_hash", hashVisitorToken(visitorToken)).maybeSingle();
  if (!conversation) return noStore({ error: "Conversation non autorisée." }, 403);
  const { data, error } = await client.from("chat_messages").select("id,conversation_id,sender,body,created_at").eq("conversation_id", conversationId).order("created_at");
  if (error) return noStore({ error: "Messages indisponibles." }, 500);
  return noStore({ conversation, messages: data || [] });
}
