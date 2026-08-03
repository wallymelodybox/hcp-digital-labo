import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { isAdminRequest } from "@/lib/admin-auth";
import { getFormationCertificateByNumber } from "@/lib/site-storage";
import { CertificatePdf } from "@/components/certificate-pdf";

export async function GET(req: NextRequest, { params }: { params: Promise<{ certificateNumber: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { certificateNumber } = await params;
  const certificate = await getFormationCertificateByNumber(certificateNumber);

  if (!certificate) {
    return NextResponse.json({ error: "Attestation introuvable." }, { status: 404 });
  }

  const verifyUrl = new URL(`/verify/${certificate.certificateNumber}`, req.nextUrl.origin).toString();
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 256 });

  const buffer = await renderToBuffer(
    <CertificatePdf
      participantName={certificate.participantName}
      formuleTitle={certificate.formuleTitle}
      certificateNumber={certificate.certificateNumber}
      issuedAt={certificate.issuedAt}
      qrDataUrl={qrDataUrl}
    />,
  );

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${certificate.certificateNumber}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
