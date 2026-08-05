import { Badge } from "@/components/ui/badge";

type StatusVariant = "default" | "emerald" | "amber" | "red" | "blue" | "terracotta";

const STATUS_MAP: Record<string, { label: string; variant: StatusVariant }> = {
  // Booking / general
  PENDING: { label: "En attente", variant: "amber" },
  CONFIRMED: { label: "Confirmée", variant: "emerald" },
  CANCELLED: { label: "Annulée", variant: "red" },
  COMPLETED: { label: "Terminée", variant: "blue" },
  // Payment
  PARTIAL: { label: "Partiel", variant: "amber" },
  PAID: { label: "Payé", variant: "emerald" },
  FAILED: { label: "Échoué", variant: "red" },
  REFUNDED: { label: "Remboursé", variant: "blue" },
  // Trip
  UPCOMING: { label: "À venir", variant: "blue" },
  ONGOING: { label: "En cours", variant: "emerald" },
  // Schedule
  LATE: { label: "En retard", variant: "red" },
  // Visa
  SUBMITTED: { label: "Soumis", variant: "amber" },
  PROCESSING: { label: "En traitement", variant: "blue" },
  APPROVED: { label: "Approuvé", variant: "emerald" },
  REJECTED: { label: "Rejeté", variant: "red" },
  // Event
  DRAFT: { label: "Brouillon", variant: "default" },
  PUBLISHED: { label: "Publié", variant: "emerald" },
  REQUESTED: { label: "Demandé", variant: "amber" },
  QUOTED: { label: "Devis envoyé", variant: "blue" },
  IN_PROGRESS: { label: "En cours", variant: "emerald" },
  // Circuit departures
  OPEN: { label: "Ouvert", variant: "emerald" },
  COMPLET: { label: "Complet", variant: "amber" },
  ANNULE: { label: "Annulé", variant: "red" },
  // Roles
  SUPER_ADMIN: { label: "Super Admin", variant: "terracotta" },
  AGENT: { label: "Agent commercial", variant: "blue" },
  GUIDE: { label: "Guide", variant: "emerald" },
  // Trip tasks
  A_FAIRE: { label: "À faire", variant: "default" },
  EN_COURS: { label: "En cours", variant: "blue" },
  FAIT: { label: "Fait", variant: "emerald" },
  BLOQUE: { label: "Bloqué", variant: "red" },
  EN_RETARD: { label: "En retard", variant: "red" },
  // Trip communications
  PROGRAMMEE: { label: "Programmée", variant: "blue" },
  EN_ATTENTE_VALIDATION: { label: "En attente de validation", variant: "amber" },
  ENVOYEE: { label: "Envoyée", variant: "emerald" },
  ANNULEE: { label: "Annulée", variant: "red" },
  // Task phase / category / priority
  AVANT: { label: "Avant", variant: "blue" },
  PENDANT: { label: "Pendant", variant: "amber" },
  APRES: { label: "Après", variant: "emerald" },
  URGENTE: { label: "Urgente", variant: "red" },
  NORMALE: { label: "Normale", variant: "default" },
  LOGISTIQUE: { label: "Logistique", variant: "default" },
  FOURNISSEURS: { label: "Fournisseurs", variant: "default" },
  DOCUMENTS_CLIENT: { label: "Documents client", variant: "default" },
  COMMUNICATION: { label: "Communication", variant: "default" },
  FINANCE: { label: "Finance", variant: "default" },
  // Support tickets
  OUVERT: { label: "Ouvert", variant: "amber" },
  RESOLU: { label: "Résolu", variant: "emerald" },
  FERME: { label: "Fermé", variant: "default" },
  REJETE: { label: "Rejeté", variant: "red" },
  SUPPORT: { label: "Support", variant: "blue" },
  RECLAMATION: { label: "Réclamation", variant: "terracotta" },
  CHAT: { label: "Chat", variant: "default" },
  EMAIL: { label: "Email", variant: "default" },
  TELEPHONE: { label: "Téléphone", variant: "default" },
  // Fidélité / VIP
  STANDARD: { label: "Standard", variant: "default" },
  SILVER: { label: "Argent", variant: "blue" },
  GOLD: { label: "Or", variant: "amber" },
  PLATINUM: { label: "Platine", variant: "terracotta" },
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const entry = STATUS_MAP[status] ?? { label: label ?? status, variant: "default" as StatusVariant };
  return <Badge variant={entry.variant}>{label ?? entry.label}</Badge>;
}
