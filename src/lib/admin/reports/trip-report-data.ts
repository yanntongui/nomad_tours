import type { TripRow } from "@/lib/server/trips";
import type { BookingRow } from "@/lib/server/bookings";

export interface ItineraryDayInfo {
  id: string;
  day: number;
  title: string;
}

export function getTripGeneralInfo(trip: TripRow) {
  return {
    circuitName: trip.bookings?.reference_label ?? "Voyage",
    startDate: trip.start_date,
    endDate: trip.end_date,
    participantCount: trip.trip_participants.length,
    guideName: trip.admin_profiles?.name ?? null,
  };
}

export function getRegistrationStats(trip: TripRow, booking: BookingRow | null) {
  const payments = (booking?.payments ?? []).filter((p) => p.status === "PAID");
  return {
    inscrits: trip.trip_participants.length,
    historiquePaiements: payments,
    totalPaid: payments.reduce((sum, p) => sum + p.amount_xof, 0),
  };
}

export function getPreDepartureTasksSummary(trip: TripRow) {
  const tasks = trip.trip_tasks.filter((t) => t.phase === "AVANT");
  const done = tasks.filter((t) => t.status === "FAIT").length;
  return {
    tasks,
    total: tasks.length,
    done,
    completionRate: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0,
  };
}

/** No supplier-type classification in the real schema (suppliers domain not migrated yet) — returns distinct free-text tags instead. */
export function getTripSupplierTags(trip: TripRow): string[] {
  const tags = new Set<string>();
  trip.trip_tasks.forEach((t) => {
    if (t.supplier_tag) tags.add(t.supplier_tag);
  });
  return Array.from(tags);
}

export function getItineraryVsActual(trip: TripRow, itineraryDays: ItineraryDayInfo[]) {
  return { prevu: itineraryDays, reel: trip.trip_updates };
}

export function getGuideEngagementStats(trip: TripRow) {
  return { guideName: trip.admin_profiles?.name ?? null, updatesCount: trip.trip_updates.length };
}

export function getFeedbackAggregation(trip: TripRow) {
  const feedbacks = trip.trip_feedbacks;
  const avg = feedbacks.length > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length : 0;
  const distribution = [1, 2, 3, 4, 5].map((star) => ({ star, count: feedbacks.filter((f) => f.rating === star).length }));
  return { feedbacks, avg, distribution };
}

export function getFinancialSummary(booking: BookingRow | null) {
  const budgetPrevu = booking?.total_price_xof ?? 0;
  const encaisse = booking?.paid_xof ?? 0;
  return { budgetPrevu, encaisse, impaye: Math.max(budgetPrevu - encaisse, 0) };
}
