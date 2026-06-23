import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getContactRequests, markContactRequestRead } from "@/lib/site-storage";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return NextResponse.json(await getContactRequests());
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.id) {
    return NextResponse.json({ error: "ID manquant." }, { status: 400 });
  }

  await markContactRequestRead(String(body.id));
  return NextResponse.json({ ok: true });
}
