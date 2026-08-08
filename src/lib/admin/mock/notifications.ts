import { AdminNotification } from "@/lib/admin/types";

export const NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-seed-1",
    title: "Nouvelle réservation",
    description: "Trésors du Sud-Bénin — Jean-Paul & Valérie M.",
    href: "/admin/reservations",
    read: true,
    createdAt: new Date(2026, 6, 20).toISOString(),
  },
  {
    id: "notif-seed-2",
    title: "Paiement en retard",
    description: "Une relance est recommandée sur une réservation active",
    href: "/admin/reservations",
    read: false,
    createdAt: new Date(2026, 7, 1).toISOString(),
  },
];
