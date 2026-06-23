import { NextResponse } from "next/server";
import { getSiteImages } from "@/lib/site-storage";

export async function GET() {
  return NextResponse.json(await getSiteImages());
}
