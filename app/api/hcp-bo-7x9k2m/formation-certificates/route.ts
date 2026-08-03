import { NextRequest, NextResponse } from "next/server";
import { isAdminMutationRequest, isAdminRequest } from "@/lib/admin-auth";
import { getFormationCertificates, issueFormationCertificate } from "@/lib/site-storage";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return NextResponse.json(await getFormationCertificates());
}

export async function POST(req: NextRequest) {
  if (!isAdminMutationRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const registrationId = typeof body?.registrationId === "string" ? body.registrationId : "";

  if (!registrationId) {
    return NextResponse.json({ error: "Inscription requise." }, { status: 400 });
  }

  const result = await issueFormationCertificate(registrationId);
  if (!result.ok) {
    const message = result.reason === "not_eligible"
      ? "Cette inscription n'est pas encore éligible (paiement confirmé et présence requis)."
      : "Inscription introuvable.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json(result.certificate);
}
