import { NextResponse } from "next/server";
import { getFormationOffers } from "@/lib/site-storage";

export async function GET() {
  return NextResponse.json(await getFormationOffers());
}
