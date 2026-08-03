import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getFormationRegistrations, updateFormationRegistrationStatus } from "@/lib/site-storage";
import type { FormationRegistrationStatus } from "@/lib/site-storage";

const allowedStatuses: FormationRegistrationStatus[] = [
  "nouvelle",
  "en_attente_paiement",
  "paiement_confirme",
  "validee",
  "annulee",
];

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return NextResponse.json(await getFormationRegistrations());
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const status = body?.status as FormationRegistrationStatus;

  if (!id || !allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "ID ou statut invalide." }, { status: 400 });
  }

  await updateFormationRegistrationStatus(id, status);
  return NextResponse.json({ ok: true });
}
