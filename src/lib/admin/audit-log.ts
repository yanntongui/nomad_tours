import { createClient } from "@/lib/supabase/server";
import type { AuditLogEntry } from "./audit-log-types";

export type { AuditLogSource, AuditLogEntry } from "./audit-log-types";
export { AUDIT_SOURCE_LABELS } from "./audit-log-types";

export async function getAuditLog(): Promise<AuditLogEntry[]> {
  const supabase = await createClient();

  const [bookingTimeline, visaTimeline, eventTimeline, ticketTimeline, tripTimeline] = await Promise.all([
    supabase
      .from("booking_timeline")
      .select("*, bookings(booking_number, reference_label)")
      .order("created_at", { ascending: false }),
    supabase
      .from("visa_timeline")
      .select("*, visa_requests(country, clients(name))")
      .order("created_at", { ascending: false }),
    supabase
      .from("event_timeline")
      .select("*, event_requests(type, clients(name))")
      .order("created_at", { ascending: false }),
    supabase
      .from("ticket_timeline")
      .select("*, support_tickets(subject)")
      .order("created_at", { ascending: false }),
    supabase
      .from("trip_timeline")
      .select("*, trips(bookings(reference_label))")
      .order("date", { ascending: false }),
  ]);

  if (bookingTimeline.error) throw bookingTimeline.error;
  if (visaTimeline.error) throw visaTimeline.error;
  if (eventTimeline.error) throw eventTimeline.error;
  if (ticketTimeline.error) throw ticketTimeline.error;
  if (tripTimeline.error) throw tripTimeline.error;

  const entries: AuditLogEntry[] = [];

  for (const t of bookingTimeline.data) {
    entries.push({
      id: t.id,
      source: "RESERVATION",
      label: t.label,
      detail: t.detail ?? undefined,
      actor: t.actor,
      entityLabel: t.bookings ? `${t.bookings.booking_number} — ${t.bookings.reference_label}` : t.booking_id,
      href: `/admin/reservations/${t.booking_id}`,
      createdAt: t.created_at,
    });
  }

  for (const t of visaTimeline.data) {
    entries.push({
      id: t.id,
      source: "VISA",
      label: t.label,
      detail: t.detail ?? undefined,
      actor: t.actor,
      entityLabel: t.visa_requests ? `${t.visa_requests.clients?.name ?? "—"} — ${t.visa_requests.country}` : t.visa_request_id,
      href: `/admin/visas/${t.visa_request_id}`,
      createdAt: t.created_at,
    });
  }

  for (const t of eventTimeline.data) {
    entries.push({
      id: t.id,
      source: "EVENEMENT",
      label: t.label,
      detail: t.detail ?? undefined,
      actor: t.actor,
      entityLabel: t.event_requests ? `${t.event_requests.clients?.name ?? "—"} — ${t.event_requests.type}` : t.event_request_id,
      href: `/admin/evenementiel/${t.event_request_id}`,
      createdAt: t.created_at,
    });
  }

  for (const t of ticketTimeline.data) {
    entries.push({
      id: t.id,
      source: "SUPPORT",
      label: t.label,
      detail: t.detail ?? undefined,
      actor: t.actor ?? "Système",
      entityLabel: t.support_tickets ? t.support_tickets.subject : t.ticket_id,
      href: `/admin/support/${t.ticket_id}`,
      createdAt: t.created_at,
    });
  }

  for (const t of tripTimeline.data) {
    entries.push({
      id: t.id,
      source: "VOYAGE",
      label: t.label,
      detail: t.detail ?? undefined,
      actor: t.actor ?? "Système",
      entityLabel: t.trips?.bookings?.reference_label ?? "Voyage",
      href: `/admin/voyages/${t.trip_id}`,
      createdAt: t.date,
    });
  }

  return entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
