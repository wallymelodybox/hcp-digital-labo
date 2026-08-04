import { NextRequest } from "next/server";
import { getChatClient, safeApiKey, chatUnavailable } from "@/lib/chat-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!safeApiKey(request.headers.get("authorization"))) return Response.json({ error: "Non autorisé." }, { status: 401 });
  const client = getChatClient();
  if (!client) return chatUnavailable();
  const status = request.nextUrl.searchParams.get("status") || "open";
  const { data, error } = await client.from("chat_conversations").select("id,visitor_name,visitor_email,page_url,status,created_at,updated_at").eq("status", status).order("updated_at", { ascending: false }).limit(100);
  if (error) return Response.json({ error: "Conversations indisponibles." }, { status: 500 });
  return Response.json({ conversations: data || [] }, { headers: { "Cache-Control": "no-store" } });
}
