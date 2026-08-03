import { NextRequest, NextResponse } from "next/server";
import { addFormationRegistration, getFormationOffers, getFormationSessionsWithAvailability, resolvePromoCode } from "@/lib/site-storage";
import { computeDiscountedPrice } from "@/lib/formation-promo-codes";
import { enforceRateLimit, readLimitedJson } from "@/lib/request-security";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "formation-registration", 8, 10 * 60_000);
  if (rateLimited) return rateLimited;
  const body = await readLimitedJson(req);

  if (!body) {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const nom = clean(input.nom);
  const prenoms = clean(input.prenoms);
  const whatsapp = clean(input.whatsapp);
  const email = clean(input.email);
  const pays = clean(input.pays);
  const ville = clean(input.ville);
  const profession = clean(input.profession);
  const formuleId = clean(input.formuleId);
  const modeParticipation = clean(input.modeParticipation) === "presentiel" ? "presentiel" : "en_ligne";
  const modePaiement = clean(input.modePaiement);
  const sessionId = clean(input.sessionId);
  const niveauInformatique = clean(input.niveauInformatique);

  const allowedPaymentModes = new Set(["orange_money", "mtn_momo", "wave", "moov_money", "carte", "virement", "especes"]);
  const textFields = [nom, prenoms, whatsapp, email, pays, ville, profession, niveauInformatique];
  if (textFields.some((value) => value.length > 200) || !allowedPaymentModes.has(modePaiement)) {
    return NextResponse.json({ error: "Données d'inscription invalides." }, { status: 400 });
  }

  if (!nom || !prenoms || !whatsapp || !formuleId || !modePaiement) {
    return NextResponse.json(
      { error: "Nom, prénoms, WhatsApp, formule et mode de paiement sont obligatoires." },
      { status: 400 },
    );
  }

  const offers = await getFormationOffers();
  const offer = offers.find((item) => item.id === formuleId);

  if (!offer) {
    return NextResponse.json({ error: "Formule sélectionnée introuvable." }, { status: 400 });
  }

  if (sessionId) {
    const sessions = await getFormationSessionsWithAvailability();
    const session = sessions.find((item) => item.id === sessionId);

    if (!session || session.formuleId !== formuleId) {
      return NextResponse.json({ error: "Session sélectionnée introuvable." }, { status: 400 });
    }

    if (session.remaining <= 0) {
      return NextResponse.json({ error: "Cette session est complète. Merci de choisir une autre session." }, { status: 400 });
    }
  }

  const codePromo = clean(input.codePromo);
  if (codePromo.length > 64) return NextResponse.json({ error: "Code promotionnel invalide." }, { status: 400 });
  let prix = offer.price;
  let prixOriginal: number | undefined;

  if (codePromo) {
    const resolution = await resolvePromoCode(codePromo, formuleId);
    if (!resolution.ok) {
      return NextResponse.json({ error: resolution.error }, { status: 400 });
    }
    prix = computeDiscountedPrice(offer.price, resolution.promo);
    prixOriginal = offer.price;
  }

  const registration = await addFormationRegistration({
    nom,
    prenoms,
    whatsapp,
    email,
    pays,
    ville,
    profession,
    entreprise: clean(input.entreprise).slice(0, 200),
    niveauInformatique,
    formuleId: offer.id,
    formuleTitle: offer.title,
    prix,
    prixOriginal,
    modeParticipation,
    sessionId: sessionId || undefined,
    modePaiement,
    codePromo: codePromo || undefined,
    source: (clean(input.source) || "site").slice(0, 50),
  });

  return NextResponse.json({ ok: true, id: registration.id });
}
