import { LoyaltyOffer } from "@/lib/admin/types";

const TODAY = new Date(2026, 7, 2);
function daysFromToday(offset: number) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

export const LOYALTY_OFFERS: LoyaltyOffer[] = [
  {
    id: "lo-1",
    title: "Bienvenue fidélité",
    description: "5% de réduction sur votre prochain circuit, dès votre première réservation.",
    tierRequired: "STANDARD",
    discountPercent: 5,
    active: true,
    createdAt: daysFromToday(-180),
    updatedAt: daysFromToday(-180),
  },
  {
    id: "lo-2",
    title: "Surclassement hébergement",
    description: "Chambre supérieure offerte selon disponibilité sur les circuits Culture et Plage.",
    tierRequired: "SILVER",
    active: true,
    createdAt: daysFromToday(-150),
    updatedAt: daysFromToday(-90),
  },
  {
    id: "lo-3",
    title: "Réduction Argent",
    description: "10% de réduction sur tout circuit réservé plus de 60 jours à l'avance.",
    tierRequired: "SILVER",
    discountPercent: 10,
    active: true,
    createdAt: daysFromToday(-150),
    updatedAt: daysFromToday(-150),
  },
  {
    id: "lo-4",
    title: "Accès prioritaire événementiel",
    description: "Places garanties sur les événements à capacité limitée, sans liste d'attente.",
    tierRequired: "GOLD",
    active: true,
    createdAt: daysFromToday(-120),
    updatedAt: daysFromToday(-120),
  },
  {
    id: "lo-5",
    title: "Réduction Or",
    description: "15% de réduction sur tous les circuits et vols réservés dans l'année.",
    tierRequired: "GOLD",
    discountPercent: 15,
    validUntil: daysFromToday(150),
    active: true,
    createdAt: daysFromToday(-100),
    updatedAt: daysFromToday(-20),
  },
  {
    id: "lo-6",
    title: "Conciergerie Platine",
    description: "Chargé de compte dédié, transferts aéroport offerts, assistance 24/7 pendant le voyage.",
    tierRequired: "PLATINUM",
    active: true,
    createdAt: daysFromToday(-60),
    updatedAt: daysFromToday(-60),
  },
  {
    id: "lo-7",
    title: "Offre anniversaire Nomad (archivée)",
    description: "Réduction spéciale 10 ans de Nomad Tours — offre expirée.",
    tierRequired: "STANDARD",
    discountPercent: 10,
    validUntil: daysFromToday(-30),
    active: false,
    createdAt: daysFromToday(-200),
    updatedAt: daysFromToday(-30),
  },
];
