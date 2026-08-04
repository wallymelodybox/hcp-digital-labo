"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type Message = { id: string; sender: "visitor" | "agent"; body: string; created_at: string };
const storageKey = "hcp-chat-session-v1";

export function VisitorChat() {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const session = readSession();
    if (!session) return;
    const load = async () => {
      const response = await fetch(`/api/chat?conversationId=${encodeURIComponent(session.conversationId)}`, {
        headers: { "x-chat-token": session.visitorToken }, cache: "no-store",
      });
      if (response.ok) setMessages((await response.json()).messages || []);
    };
    void load();
    const interval = window.setInterval(load, 4000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, open]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const text = body.trim();
    if (!text || sending) return;
    setSending(true); setError("");
    const session = readSession();
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(session ? { "x-chat-token": session.visitorToken } : {}) },
      body: JSON.stringify({ body: text, conversationId: session?.conversationId, pageUrl: window.location.href }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) setError(payload.error || "Message non envoyé.");
    else {
      if (!session) localStorage.setItem(storageKey, JSON.stringify({ conversationId: payload.conversationId, visitorToken: payload.visitorToken }));
      setMessages((current) => [...current, payload.message]);
      setBody("");
    }
    setSending(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open ? (
        <section className="flex h-[min(520px,calc(100dvh-32px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl" aria-label="Discussion avec HCP Digital Lab">
          <header className="flex items-center justify-between bg-blue-700 px-5 py-4 text-white">
            <div><div className="font-semibold">HCP Digital Lab</div><div className="text-xs text-blue-100">Réponse directe depuis notre mobile</div></div>
            <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label="Fermer le chat"><X className="h-5 w-5" /></button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
            <div className="max-w-[86%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">Bonjour 👋 Comment pouvons-nous vous aider aujourd’hui ?</div>
            {messages.map((message) => <div key={message.id} className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm ${message.sender === "visitor" ? "ml-auto rounded-br-sm bg-blue-700 text-white" : "rounded-tl-sm bg-white text-slate-700 shadow-sm"}`}>{message.body}</div>)}
            <div ref={endRef} />
          </div>
          <form onSubmit={submit} className="border-t border-slate-200 bg-white p-3">
            {error ? <p className="mb-2 text-xs text-red-600">{error}</p> : null}
            <div className="flex items-end gap-2 rounded-2xl border border-slate-300 p-2 focus-within:border-blue-500">
              <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={1} maxLength={2000} placeholder="Écrivez votre message…" className="max-h-28 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-900 outline-none" />
              <button disabled={sending || !body.trim()} className="rounded-xl bg-blue-700 p-2.5 text-white disabled:opacity-40" aria-label="Envoyer"><Send className="h-4 w-4" /></button>
            </div>
          </form>
        </section>
      ) : <button onClick={() => setOpen(true)} className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-xl hover:bg-blue-800" aria-label="Ouvrir le chat"><MessageCircle className="h-6 w-6" /></button>}
    </div>
  );
}

function readSession(): { conversationId: string; visitorToken: string } | null {
  try { const value = JSON.parse(localStorage.getItem(storageKey) || "null"); return value?.conversationId && value?.visitorToken ? value : null; } catch { return null; }
}
