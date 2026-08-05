import { TESTIMONIALS } from "@/lib/data/testimonials";
import { AdminTestimonial } from "@/lib/admin/types";

export const ADMIN_TESTIMONIALS: AdminTestimonial[] = [
  ...TESTIMONIALS.map((t) => ({ ...t, status: "APPROVED" as const })),
  {
    id: "test-4",
    userName: "Chloé Fontaine",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    tripTitle: "Découverte Culture Vaudou (3 Jours)",
    rating: 4,
    content: "Très belle immersion culturelle à Ouidah, guide passionné. Léger retard au départ mais rien de grave.",
    date: "Juillet 2026",
    status: "PENDING",
  },
  {
    id: "test-5",
    userName: "Bertrand Kouassi",
    tripTitle: "Circuit Nord Atacora (6 Jours)",
    rating: 5,
    content: "Organisation parfaite du début à la fin, je recommande vivement pour découvrir le Nord-Bénin.",
    date: "Juillet 2026",
    status: "PENDING",
  },
  {
    id: "test-6",
    userName: "Utilisateur anonyme",
    tripTitle: "Excursion Ganvié (1 Jour)",
    rating: 2,
    content: "Avis à caractère promotionnel non lié à un voyage réel, signalé par l'équipe modération.",
    date: "Juin 2026",
    status: "REJECTED",
  },
];
