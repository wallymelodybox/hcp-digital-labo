import { NextResponse } from "next/server";
import { getStrategyOffers } from "@/lib/site-storage";

export async function GET() {
  return NextResponse.json(await getStrategyOffers());
}
