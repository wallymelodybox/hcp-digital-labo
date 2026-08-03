import { NextResponse } from "next/server";
import { getFormationSessionsWithAvailability } from "@/lib/site-storage";

export async function GET() {
  const sessions = await getFormationSessionsWithAvailability();
  const open = sessions.filter((session) => session.status === "ouverte" || session.status === "prevue");
  return NextResponse.json(open);
}
