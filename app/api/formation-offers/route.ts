import { NextResponse } from "next/server";
import { getFormationOffers } from "@/lib/site-storage";

export async function GET() {
  const offers = await getFormationOffers();
  return NextResponse.json(offers.filter((offer) => offer.visible));
}
