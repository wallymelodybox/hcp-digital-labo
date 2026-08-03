import { getFormationCertificateByNumber } from "@/lib/site-storage";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ certificateNumber: string }>;
}) {
  const { certificateNumber } = await params;
  const certificate = await getFormationCertificateByNumber(certificateNumber);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06090A] px-5 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/3 p-8 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        {certificate ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-xl font-bold text-white">Attestation authentique</h1>
            <p className="mt-4 text-lg font-semibold text-emerald-300">{certificate.participantName}</p>
            <p className="mt-1 text-sm text-white/70">{certificate.formuleTitle}</p>
            <p className="mt-4 text-xs text-white/40">
              Délivrée le {new Date(certificate.issuedAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="mt-1 text-xs text-white/30">N° {certificate.certificateNumber}</p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/15 text-red-300">
              <XCircle className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-xl font-bold text-white">Attestation introuvable</h1>
            <p className="mt-4 text-sm text-white/60">
              Ce numéro d&apos;attestation ne correspond à aucun enregistrement valide.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
