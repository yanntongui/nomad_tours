import { Banner } from "@/lib/admin/types";

export const BANNERS: Banner[] = [
  {
    id: "banner-soldes-ete",
    title: "Soldes d'été",
    subtitle: "-15% sur tous les circuits Bénin réservés avant le 30 juin",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    ctaLabel: "Voir les circuits",
    ctaHref: "/circuits",
    placement: "HOMEPAGE_TOP",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    active: true,
    createdAt: new Date(2026, 4, 15).toISOString(),
  },
  {
    id: "banner-nouveaux-visas",
    title: "Nouveau : e-Visa express",
    subtitle: "Traitement accéléré pour vos démarches visa vers 8 nouvelles destinations",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80",
    ctaLabel: "Découvrir",
    ctaHref: "/visas",
    placement: "DESTINATIONS",
    startDate: null,
    endDate: null,
    active: false,
    createdAt: new Date(2026, 3, 2).toISOString(),
  },
];
