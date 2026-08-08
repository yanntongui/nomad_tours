"use client";
import * as React from "react";
import { useBookingsStore } from "@/lib/admin/store/bookings-store";
import { useVisasStore } from "@/lib/admin/store/visas-store";
import { useEventsStore } from "@/lib/admin/store/events-store";
import { useSupportStore } from "@/lib/admin/store/support-store";
import { useTripsStore } from "@/lib/admin/store/trips-store";

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

export function useAuditLog(): AuditLogEntry[] {
  const bookings = useBookingsStore();
  const visas = useVisasStore();
  const events = useEventsStore();
  const support = useSupportStore();
  const trips = useTripsStore();

  return React.useMemo(() => {
    const entries: AuditLogEntry[] = [];

    for (const t of bookings.timeline) {
      const booking = bookings.bookings.find((b) => b.id === t.bookingId);
      entries.push({
        id: t.id,
        source: "RESERVATION",
        label: t.label,
        detail: t.detail,
        actor: t.actor,
        entityLabel: booking ? `${booking.bookingNumber} — ${booking.referenceLabel}` : t.bookingId,
        href: `/admin/reservations/${t.bookingId}`,
        createdAt: t.createdAt,
      });
    }

    for (const t of visas.timeline) {
      const visa = visas.requests.find((v) => v.id === t.visaRequestId);
      entries.push({
        id: t.id,
        source: "VISA",
        label: t.label,
        detail: t.detail,
        actor: t.actor,
        entityLabel: visa ? `${visa.client.name} — ${visa.country}` : t.visaRequestId,
        href: `/admin/visas/${t.visaRequestId}`,
        createdAt: t.createdAt,
      });
    }

    for (const t of events.timeline) {
      const event = events.requests.find((e) => e.id === t.eventRequestId);
      entries.push({
        id: t.id,
        source: "EVENEMENT",
        label: t.label,
        detail: t.detail,
        actor: t.actor,
        entityLabel: event ? `${event.client.name} — ${event.type}` : t.eventRequestId,
        href: `/admin/evenementiel/${t.eventRequestId}`,
        createdAt: t.createdAt,
      });
    }

    for (const t of support.timeline) {
      const ticket = support.tickets.find((tk) => tk.id === t.ticketId);
      entries.push({
        id: t.id,
        source: "SUPPORT",
        label: t.label,
        detail: t.detail,
        actor: t.actor ?? "Système",
        entityLabel: ticket ? ticket.subject : t.ticketId,
        href: `/admin/support/${t.ticketId}`,
        createdAt: t.createdAt,
      });
    }

    for (const t of trips.tripTimeline) {
      const trip = trips.trips.find((tr) => tr.id === t.tripId);
      entries.push({
        id: t.id,
        source: "VOYAGE",
        label: t.label,
        detail: t.detail,
        actor: t.actor ?? "Système",
        entityLabel: trip ? trip.title : t.tripId,
        href: `/admin/voyages/${t.tripId}`,
        createdAt: t.date,
      });
    }

    return entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings, visas, events, support, trips]);
}
