import { readJsonFile, writeJsonFile } from "@/lib/json-store";
import { defaultStrategyOffers, type StrategyOffer } from "@/lib/strategy-offers";
import { defaultFormationOffers, type FormationOffer } from "@/lib/formation-offers";
import { defaultFormationSessions, type FormationSession } from "@/lib/formation-sessions";
import { defaultFormationPromoCodes, type FormationPromoCode } from "@/lib/formation-promo-codes";

export type SiteImages = Record<string, string>;

export type FormationRegistrationStatus =
  | "nouvelle"
  | "en_attente_paiement"
  | "paiement_confirme"
  | "validee"
  | "annulee";

export type FormationRegistration = {
  id: string;
  nom: string;
  prenoms: string;
  whatsapp: string;
  email: string;
  pays: string;
  ville: string;
  profession: string;
  entreprise?: string;
  niveauInformatique: string;
  formuleId: string;
  formuleTitle: string;
  prix: number;
  prixOriginal?: number;
  modeParticipation: "en_ligne" | "presentiel";
  sessionId?: string;
  modePaiement: string;
  codePromo?: string;
  source: string;
  status: FormationRegistrationStatus;
  notes?: string;
  createdAt: string;
  montantPaye?: number;
  referencePaiement?: string;
  paiementConfirmeAt?: string;
};

export type ContactRequest = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  pole?: string;
  message: string;
  source: string;
  createdAt: string;
  status: "new" | "read";
};

const imagesFile = "site-images.json";
const contactsFile = "contact-requests.json";
const strategyOffersFile = "strategy-offers.json";
const formationOffersFile = "formation-offers.json";
const formationRegistrationsFile = "formation-registrations.json";
const formationSessionsFile = "formation-sessions.json";
const formationPromoCodesFile = "formation-promo-codes.json";

export async function getSiteImages() {
  return readJsonFile<SiteImages>(imagesFile, {});
}

export async function saveSiteImages(images: SiteImages) {
  await writeJsonFile(imagesFile, images);
}

export async function getContactRequests() {
  const contacts = await readJsonFile<ContactRequest[]>(contactsFile, []);
  return contacts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addContactRequest(input: Omit<ContactRequest, "id" | "createdAt" | "status">) {
  const contacts = await getContactRequests();
  const contact: ContactRequest = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
  };

  await writeJsonFile(contactsFile, [contact, ...contacts]);
  return contact;
}

export async function markContactRequestRead(id: string) {
  const contacts = await getContactRequests();
  const updated = contacts.map((contact) =>
    contact.id === id ? { ...contact, status: "read" as const } : contact,
  );
  await writeJsonFile(contactsFile, updated);
}

export async function getStrategyOffers() {
  return readJsonFile<StrategyOffer[]>(strategyOffersFile, defaultStrategyOffers);
}

export async function saveStrategyOffers(offers: StrategyOffer[]) {
  await writeJsonFile(strategyOffersFile, offers);
}

export async function getFormationOffers() {
  return readJsonFile<FormationOffer[]>(formationOffersFile, defaultFormationOffers);
}

export async function saveFormationOffers(offers: FormationOffer[]) {
  await writeJsonFile(formationOffersFile, offers);
}

export async function getFormationRegistrations() {
  const registrations = await readJsonFile<FormationRegistration[]>(formationRegistrationsFile, []);
  return registrations.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addFormationRegistration(
  input: Omit<FormationRegistration, "id" | "createdAt" | "status">,
) {
  const registrations = await getFormationRegistrations();
  const registration: FormationRegistration = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "nouvelle",
  };

  await writeJsonFile(formationRegistrationsFile, [registration, ...registrations]);
  return registration;
}

export async function updateFormationRegistrationStatus(id: string, status: FormationRegistrationStatus) {
  const registrations = await getFormationRegistrations();
  const updated = registrations.map((registration) =>
    registration.id === id ? { ...registration, status } : registration,
  );
  await writeJsonFile(formationRegistrationsFile, updated);
}

export async function getFormationRegistrationById(id: string) {
  const registrations = await getFormationRegistrations();
  return registrations.find((registration) => registration.id === id) ?? null;
}

export async function confirmFormationRegistrationPayment(
  id: string,
  input: { montantPaye: number; referencePaiement: string },
) {
  const registrations = await getFormationRegistrations();
  const updated = registrations.map((registration) =>
    registration.id === id
      ? {
          ...registration,
          status: "paiement_confirme" as const,
          montantPaye: input.montantPaye,
          referencePaiement: input.referencePaiement,
          paiementConfirmeAt: new Date().toISOString(),
        }
      : registration,
  );
  await writeJsonFile(formationRegistrationsFile, updated);
}

export async function getFormationSessions() {
  return readJsonFile<FormationSession[]>(formationSessionsFile, defaultFormationSessions);
}

export async function saveFormationSessions(sessions: FormationSession[]) {
  await writeJsonFile(formationSessionsFile, sessions);
}

export async function getFormationSessionsWithAvailability() {
  const [sessions, registrations] = await Promise.all([
    getFormationSessions(),
    getFormationRegistrations(),
  ]);

  const activeCounts = new Map<string, number>();
  for (const registration of registrations) {
    if (registration.status === "annulee" || !registration.sessionId) continue;
    activeCounts.set(registration.sessionId, (activeCounts.get(registration.sessionId) ?? 0) + 1);
  }

  return sessions.map((session) => {
    const enrolled = activeCounts.get(session.id) ?? 0;
    return {
      ...session,
      enrolled,
      remaining: Math.max(session.capacity - enrolled, 0),
    };
  });
}

export async function getFormationPromoCodes() {
  return readJsonFile<FormationPromoCode[]>(formationPromoCodesFile, defaultFormationPromoCodes);
}

export async function saveFormationPromoCodes(codes: FormationPromoCode[]) {
  await writeJsonFile(formationPromoCodesFile, codes);
}

export type PromoCodeResolution =
  | { ok: true; promo: FormationPromoCode }
  | { ok: false; error: string };

export async function resolvePromoCode(rawCode: string, formuleId: string): Promise<PromoCodeResolution> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Aucun code fourni." };

  const [codes, registrations] = await Promise.all([
    getFormationPromoCodes(),
    getFormationRegistrations(),
  ]);

  const promo = codes.find((item) => item.code.toUpperCase() === code);
  if (!promo || !promo.active) {
    return { ok: false, error: "Code promotionnel invalide." };
  }

  if (promo.formuleId && promo.formuleId !== formuleId) {
    return { ok: false, error: "Ce code ne s'applique pas à cette formule." };
  }

  const now = new Date();
  if (promo.startDate && now < new Date(promo.startDate)) {
    return { ok: false, error: "Ce code n'est pas encore actif." };
  }
  if (promo.endDate && now > new Date(promo.endDate)) {
    return { ok: false, error: "Ce code a expiré." };
  }

  if (promo.maxUses) {
    const uses = registrations.filter(
      (registration) => registration.status !== "annulee" && registration.codePromo?.toUpperCase() === code,
    ).length;
    if (uses >= promo.maxUses) {
      return { ok: false, error: "Ce code a atteint son nombre maximum d'utilisations." };
    }
  }

  return { ok: true, promo };
}
