import { NextRequest, NextResponse } from "next/server";
import { isAdminMutationRequest, isAdminRequest } from "@/lib/admin-auth";
import { getFormationOffers, getFormationSessionsWithAvailability, saveFormationSessions } from "@/lib/site-storage";
import type { FormationSession, FormationSessionFormat, FormationSessionStatus } from "@/lib/formation-sessions";

const allowedFormats: FormationSessionFormat[] = ["en_ligne", "presentiel", "hybride"];
const allowedStatuses: FormationSessionStatus[] = [
  "prevue",
  "ouverte",
  "complete",
  "en_cours",
  "terminee",
  "annulee",
];

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function cleanSession(raw: unknown, index: number, validFormuleIds: Set<string>): Promise<FormationSession | null> {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;

  const name = cleanText(item.name);
  const formuleId = cleanText(item.formuleId);
  const startDate = cleanText(item.startDate);
  const capacity = Number(item.capacity);

  if (!name || !formuleId || !validFormuleIds.has(formuleId) || !startDate || !Number.isFinite(capacity) || capacity < 0) {
    return null;
  }

  const format = allowedFormats.includes(item.format as FormationSessionFormat)
    ? (item.format as FormationSessionFormat)
    : "en_ligne";

  const status = allowedStatuses.includes(item.status as FormationSessionStatus)
    ? (item.status as FormationSessionStatus)
    : "prevue";

  return {
    id: cleanText(item.id) || `session-${index + 1}`,
    name,
    formuleId,
    startDate,
    endDate: cleanText(item.endDate),
    startTime: cleanText(item.startTime),
    endTime: cleanText(item.endTime),
    timezone: cleanText(item.timezone) || "GMT",
    format,
    location: cleanText(item.location),
    capacity,
    formateur: cleanText(item.formateur),
    status,
  };
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return NextResponse.json(await getFormationSessionsWithAvailability());
}

export async function PUT(req: NextRequest) {
  if (!isAdminMutationRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "La liste des sessions est invalide." }, { status: 400 });
  }

  const offers = await getFormationOffers();
  const validFormuleIds = new Set(offers.map((offer) => offer.id));

  const sessions: FormationSession[] = [];
  for (let i = 0; i < body.length; i++) {
    const session = await cleanSession(body[i], i, validFormuleIds);
    if (session) sessions.push(session);
  }

  if (sessions.length !== body.length) {
    return NextResponse.json({ error: "Une ou plusieurs sessions sont incomplètes ou invalides." }, { status: 400 });
  }

  await saveFormationSessions(sessions);
  return NextResponse.json(await getFormationSessionsWithAvailability());
}
