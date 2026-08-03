import { NextRequest, NextResponse } from "next/server";
import { getFormationCertificateByNumber } from "@/lib/site-storage";
import { enforceRateLimit } from "@/lib/request-security";

export async function GET(req: NextRequest, { params }: { params: Promise<{ certificateNumber: string }> }) {
  const rateLimited = enforceRateLimit(req, "verify-certificate", 30, 60_000);
  if (rateLimited) return rateLimited;

  const { certificateNumber } = await params;
  const certificate = await getFormationCertificateByNumber(certificateNumber);

  if (!certificate) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    participantName: certificate.participantName,
    formuleTitle: certificate.formuleTitle,
    issuedAt: certificate.issuedAt,
    certificateNumber: certificate.certificateNumber,
  });
}
