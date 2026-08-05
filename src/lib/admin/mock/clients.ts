import { Client, ClientNote } from "@/lib/admin/types";

const TODAY = new Date(2026, 7, 2);
function daysFromToday(offset: number) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

export const CLIENTS: Client[] = [
  { id: "cl-1", name: "Awa Mensah", email: "awa.mensah@gmail.com", phone: "+229 97 12 34 56", tags: ["Fidèle"], preferredContact: "WHATSAPP", loyaltyNote: "Cliente depuis 2024, toujours ponctuelle sur les paiements.", vipTier: "SILVER", createdAt: daysFromToday(-400) },
  { id: "cl-2", name: "Julien Dossou", email: "j.dossou@gmail.com", phone: "+229 96 45 12 78", tags: [], preferredContact: "EMAIL", vipTier: "STANDARD", createdAt: daysFromToday(-120) },
  { id: "cl-3", name: "Fatou Diallo", email: "fatou.diallo@yahoo.fr", phone: "+229 95 88 20 10", tags: ["VIP"], preferredContact: "PHONE", vipTier: "GOLD", createdAt: daysFromToday(-260) },
  { id: "cl-4", name: "Marc Lefèvre", email: "marc.lefevre@outlook.com", phone: "+33 6 12 45 78 90", tags: ["International"], preferredContact: "EMAIL", vipTier: "STANDARD", createdAt: daysFromToday(-95) },
  { id: "cl-5", name: "Chidinma Okafor", email: "chidinma.okafor@gmail.com", phone: "+234 803 555 2211", tags: ["International"], preferredContact: "WHATSAPP", vipTier: "STANDARD", createdAt: daysFromToday(-70) },
  { id: "cl-6", name: "Groupe Entreprise SOBEBRA", email: "events@sobebra.bj", phone: "+229 21 30 40 50", tags: ["Entreprise", "Événementiel"], preferredContact: "EMAIL", loyaltyNote: "Compte entreprise, facturation via service achat.", vipTier: "PLATINUM", createdAt: daysFromToday(-500) },
  { id: "cl-7", name: "Pauline Gbaguidi", email: "p.gbaguidi@gmail.com", phone: "+229 94 61 77 02", tags: [], preferredContact: "WHATSAPP", vipTier: "STANDARD", createdAt: daysFromToday(-40) },
  { id: "cl-8", name: "Kossi Amégan", email: "kossi.amegan@gmail.com", phone: "+228 90 22 14 63", tags: ["Fidèle"], preferredContact: "PHONE", vipTier: "SILVER", createdAt: daysFromToday(-310) },
];

export const CLIENT_NOTES: ClientNote[] = [
  { id: "cn-1", clientId: "cl-1", author: "Sandra Houngbédji", content: "Préfère les circuits culturels, à recontacter pour la saison prochaine.", createdAt: daysFromToday(-15) },
  { id: "cn-2", clientId: "cl-6", author: "Roméo Agbodjan", content: "Contact principal : DRH. Toujours passer par le service achat pour les devis.", createdAt: daysFromToday(-30) },
];
