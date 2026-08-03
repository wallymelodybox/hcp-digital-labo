import { NextRequest, NextResponse } from "next/server";
import { isAdminMutationRequest, isAdminRequest } from "@/lib/admin-auth";
import {
  getFormationAttendance,
  getFormationAttendanceForSession,
  getFormationRegistrationById,
  setFormationAttendance,
} from "@/lib/site-storage";
import type { AttendanceStatus } from "@/lib/formation-attendance";

const allowedStatuses: AttendanceStatus[] = ["present", "absent", "retard", "excuse"];

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const sessionId = req.nextUrl.searchParams.get("sessionId");
  const attendance = sessionId ? await getFormationAttendanceForSession(sessionId) : await getFormationAttendance();
  return NextResponse.json(attendance);
}

export async function PATCH(req: NextRequest) {
  if (!isAdminMutationRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const registrationId = typeof body?.registrationId === "string" ? body.registrationId : "";
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
  const status = body?.status as AttendanceStatus;

  if (!registrationId || !sessionId || !allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "Données de présence invalides." }, { status: 400 });
  }

  const registration = await getFormationRegistrationById(registrationId);
  if (!registration || registration.sessionId !== sessionId) {
    return NextResponse.json({ error: "Inscription ou session introuvable." }, { status: 404 });
  }

  await setFormationAttendance(registrationId, sessionId, status);
  return NextResponse.json({ ok: true });
}
