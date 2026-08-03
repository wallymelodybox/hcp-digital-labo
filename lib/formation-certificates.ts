export type FormationCertificate = {
  id: string;
  certificateNumber: string;
  registrationId: string;
  participantName: string;
  formuleTitle: string;
  issuedAt: string;
};

export function generateCertificateNumber(issuedAt: Date, sequence: number) {
  const year = issuedAt.getUTCFullYear();
  const seq = String(sequence).padStart(5, "0");
  return `HCP-${year}-${seq}`;
}
