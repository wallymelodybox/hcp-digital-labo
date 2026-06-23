import { NextRequest, NextResponse } from "next/server";
import { addContactRequest } from "@/lib/site-storage";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }

  const name = clean(body.name);
  const message = clean(body.message);
  const email = clean(body.email);
  const phone = clean(body.phone);

  if (!name || !message || (!email && !phone)) {
    return NextResponse.json(
      { error: "Nom, message et au moins un contact sont obligatoires." },
      { status: 400 },
    );
  }

  const contact = await addContactRequest({
    name,
    company: clean(body.company),
    email,
    phone,
    pole: clean(body.pole),
    message,
    source: clean(body.source) || "site",
  });

  return NextResponse.json({ ok: true, id: contact.id });
}
