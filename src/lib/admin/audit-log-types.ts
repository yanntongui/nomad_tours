export type AuditLogSource = "RESERVATION" | "VISA" | "EVENEMENT" | "SUPPORT" | "VOYAGE";

export interface AuditLogEntry {
  id: string;
  source: AuditLogSource;
  label: string;
  detail?: string;
  actor: string;
  entityLabel: string;
  href: string;
  createdAt: string;
}

export const AUDIT_SOURCE_LABELS: Record<AuditLogSource, string> = {
  RESERVATION: "Réservation",
  VISA: "Visa",
  EVENEMENT: "Événementiel",
  SUPPORT: "Support",
  VOYAGE: "Voyage",
};
