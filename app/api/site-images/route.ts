import { NextResponse } from "next/server";
import { getSiteImages } from "@/lib/site-storage";

export async function GET() {
  return NextResponse.json(await getSiteImages(), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
