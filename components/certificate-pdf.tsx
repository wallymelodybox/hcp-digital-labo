import { Document, Page, Text, View, Image, StyleSheet, Font } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 56,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  border: {
    borderWidth: 2,
    borderColor: "#10B981",
    padding: 40,
    height: "100%",
    justifyContent: "space-between",
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 3,
    color: "#10B981",
    textTransform: "uppercase",
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    textAlign: "center",
    marginTop: 12,
    color: "#0A0A0A",
  },
  body: {
    marginTop: 40,
    alignItems: "center",
  },
  intro: {
    fontSize: 12,
    color: "#444444",
    textAlign: "center",
  },
  participant: {
    fontSize: 22,
    fontWeight: 700,
    marginTop: 10,
    color: "#0A0A0A",
    textAlign: "center",
  },
  formule: {
    fontSize: 14,
    color: "#0A0A0A",
    marginTop: 14,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  meta: {
    fontSize: 9,
    color: "#666666",
  },
  qr: {
    width: 64,
    height: 64,
  },
});

export function CertificatePdf({
  participantName,
  formuleTitle,
  certificateNumber,
  issuedAt,
  qrDataUrl,
}: {
  participantName: string;
  formuleTitle: string;
  certificateNumber: string;
  issuedAt: string;
  qrDataUrl: string;
}) {
  const formattedDate = new Date(issuedAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View>
            <Text style={styles.kicker}>HCP Digital Labo — Attestation de participation</Text>
            <Text style={styles.title}>Attestation de participation</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.intro}>Ce document certifie que</Text>
            <Text style={styles.participant}>{participantName}</Text>
            <Text style={styles.intro}>a suivi avec assiduité la formation</Text>
            <Text style={styles.formule}>{formuleTitle}</Text>
          </View>

          <View style={styles.footer}>
            <View>
              <Text style={styles.meta}>Délivrée le {formattedDate}</Text>
              <Text style={styles.meta}>Numéro d&apos;attestation : {certificateNumber}</Text>
            </View>
            <Image src={qrDataUrl} style={styles.qr} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
