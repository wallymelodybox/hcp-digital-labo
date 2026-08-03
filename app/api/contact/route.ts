import { NextRequest, NextResponse } from "next/server";
import { addContactRequest } from "@/lib/site-storage";
import { enforceRateLimit, readLimitedJson } from "@/lib/request-security";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "contact", 5, 10 * 60_000);
  if (rateLimited) return rateLimited;
  const body = await readLimitedJson(req);

  if (!body) {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = clean(input.name);
  const message = clean(input.message);
  const email = clean(input.email);
  const phone = clean(input.phone);

  if (!name || !message || (!email && !phone)) {
    return NextResponse.json(
      { error: "Nom, message et au moins un contact sont obligatoires." },
      { status: 400 },
    );
  }

  if (name.length > 120 || message.length > 4_000 || email.length > 254 || phone.length > 40) {
    return NextResponse.json({ error: "Données de contact invalides." }, { status: 400 });
  }

  const contact = await addContactRequest({
    name,
    company: clean(input.company).slice(0, 160),
    email,
    phone,
    pole: clean(input.pole).slice(0, 100),
    message,
    source: (clean(input.source) || "site").slice(0, 50),
  });

  return NextResponse.json({ ok: true, id: contact.id });
}
