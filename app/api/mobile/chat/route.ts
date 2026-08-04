import { NextRequest } from "next/server";
import { getChatClient, safeApiKey, chatUnavailable } from "@/lib/chat-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!safeApiKey(request.headers.get("authorization"))) return Response.json({ error: "Non autorisé." }, { status: 401 });
  const client = getChatClient();
  if (!client) return chatUnavailable();
  const status = request.nextUrl.searchParams.get("status") || "open";
  let query = client.from("chat_conversations").select("id,visitor_name,visitor_email,page_url,status,agent_last_read_at,created_at,updated_at");
  if (status !== "all") query = query.eq("status", status);
  const { data, error } = await query.order("updated_at", { ascending: false }).limit(100);
  if (error) return Response.json({ error: "Conversations indisponibles." }, { status: 500 });
  const conversations = await Promise.all((data || []).map(async (conversation) => {
    const [{ data: latest }, { count }] = await Promise.all([
      client.from("chat_messages").select("body,sender,created_at").eq("conversation_id", conversation.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      client.from("chat_messages").select("id", { count: "exact", head: true }).eq("conversation_id", conversation.id).eq("sender", "visitor").gt("created_at", conversation.agent_last_read_at || "1970-01-01T00:00:00.000Z"),
    ]);
    return {
      ...conversation,
      last_message: latest || null,
      unread_count: count || 0,
    };
  }));
  return Response.json({ conversations }, { headers: { "Cache-Control": "no-store" } });
}
