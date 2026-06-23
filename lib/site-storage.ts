import { readJsonFile, writeJsonFile } from "@/lib/json-store";
import { defaultStrategyOffers, type StrategyOffer } from "@/lib/strategy-offers";

export type SiteImages = Record<string, string>;

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
