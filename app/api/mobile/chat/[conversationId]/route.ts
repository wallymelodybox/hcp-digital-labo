import { NextRequest } from "next/server";
import { chatUnavailable, cleanMessage, getChatClient, safeApiKey } from "@/lib/chat-server";

export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  return safeApiKey(request.headers.get("authorization"));
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  if (!authorized(request)) return Response.json({ error: "Non autorisé." }, { status: 401 });
  const client = getChatClient();
  if (!client) return chatUnavailable();
  const { conversationId } = await params;
  const { data, error } = await client.from("chat_messages").select("id,conversation_id,sender,body,created_at").eq("conversation_id", conversationId).order("created_at");
  if (error) return Response.json({ error: "Messages indisponibles." }, { status: 500 });
  return Response.json({ messages: data || [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  if (!authorized(request)) return Response.json({ error: "Non autorisé." }, { status: 401 });
  const client = getChatClient();
  if (!client) return chatUnavailable();
  const { conversationId } = await params;
  const payload = await request.json().catch(() => null);
  const body = cleanMessage(payload?.body);
  if (!body) return Response.json({ error: "Message invalide." }, { status: 400 });
  const { data, error } = await client.from("chat_messages").insert({ conversation_id: conversationId, sender: "agent", body }).select("*").single();
  if (error) return Response.json({ error: "Réponse non envoyée." }, { status: 500 });
  await client.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
  return Response.json({ message: data }, { status: 201 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  if (!authorized(request)) return Response.json({ error: "Non autorisé." }, { status: 401 });
  const client = getChatClient();
  if (!client) return chatUnavailable();
  const { conversationId } = await params;
  const payload = await request.json().catch(() => null);
  const status = ['open', 'closed'].includes(payload?.status) ? payload.status : null;
  const markRead = payload?.markRead === true;
  if (!status && !markRead) return Response.json({ error: "Mise à jour invalide." }, { status: 400 });
  const now = new Date().toISOString();
  const { error } = await client.from("chat_conversations").update({
    ...(status ? { status } : {}),
    ...(markRead ? { agent_last_read_at: now } : {}),
    updated_at: status ? now : undefined,
  }).eq("id", conversationId);
  if (error) return Response.json({ error: "Mise à jour impossible." }, { status: 500 });
  return Response.json({ ok: true });
}
