import { NextRequest, NextResponse } from "next/server";
import { addFormationRegistration, getFormationOffers, getFormationSessionsWithAvailability, resolvePromoCode } from "@/lib/site-storage";
import { computeDiscountedPrice } from "@/lib/formation-promo-codes";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }

  const nom = clean(body.nom);
  const prenoms = clean(body.prenoms);
  const whatsapp = clean(body.whatsapp);
  const email = clean(body.email);
  const pays = clean(body.pays);
  const ville = clean(body.ville);
  const profession = clean(body.profession);
  const formuleId = clean(body.formuleId);
  const modeParticipation = clean(body.modeParticipation) === "presentiel" ? "presentiel" : "en_ligne";
  const modePaiement = clean(body.modePaiement);
  const sessionId = clean(body.sessionId);
  const niveauInformatique = clean(body.niveauInformatique);

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

  const codePromo = clean(body.codePromo);
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
    entreprise: clean(body.entreprise),
    niveauInformatique,
    formuleId: offer.id,
    formuleTitle: offer.title,
    prix,
    prixOriginal,
    modeParticipation,
    sessionId: sessionId || undefined,
    modePaiement,
    codePromo: codePromo || undefined,
    source: clean(body.source) || "site",
  });

  return NextResponse.json({ ok: true, id: registration.id });
}
