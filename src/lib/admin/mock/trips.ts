import { BOOKINGS } from "@/lib/admin/mock/bookings";
import { GUIDES } from "@/lib/admin/mock/users";
import { Trip, TripStatus } from "@/lib/admin/types";

const TODAY = new Date(2026, 7, 2);

function statusFor(departDate: string, durationDays: number, cancelled: boolean): TripStatus {
  if (cancelled) return "CANCELLED";
  const start = new Date(departDate);
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays);
  if (end < TODAY) return "COMPLETED";
  if (start <= TODAY && TODAY <= end) return "ONGOING";
  return "UPCOMING";
}

const eligible = BOOKINGS.filter((b) => b.type === "CIRCUIT" && b.status !== "PENDING");

export const TRIPS: Trip[] = eligible.map((b, i) => {
  const duration = 3 + (i % 5);
  const status = statusFor(b.departDate, duration, b.status === "CANCELLED");
  const start = new Date(b.departDate);
  const end = new Date(start);
  end.setDate(end.getDate() + duration);
  const guide = GUIDES[i % GUIDES.length];

  return {
    id: `trip-${b.id}`,
    bookingId: b.id,
    bookingNumber: b.bookingNumber,
    title: b.referenceLabel,
    clientName: b.client.name,
    type: b.passengers > 1 ? "GROUP" : "INDIVIDUAL",
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    guideId: guide?.id,
    guideName: guide?.name,
    status,
    participants: Array.from({ length: b.passengers }).map((_, p) => ({
      id: `${b.id}-part-${p}`,
      tripId: `trip-${b.id}`,
      name: p === 0 ? b.client.name : `Accompagnant ${p}`,
      emergencyContact: p === 0 ? b.client.phone : undefined,
      checklist: [
        { label: "Passeport / pièce d'identité vérifiée", done: status !== "UPCOMING" },
        { label: "Paiement soldé", done: b.paymentStatus === "PAID" },
        { label: "Assurance voyage confirmée", done: status === "ONGOING" || status === "COMPLETED" },
      ],
    })),
    updates:
      status === "ONGOING" || status === "COMPLETED"
        ? [
            {
              id: `${b.id}-update-1`,
              tripId: `trip-${b.id}`,
              author: guide?.name ?? "Guide",
              message: "Groupe arrivé à bon port, installation à l'hébergement terminée.",
              mediaUrls: [],
              createdAt: start.toISOString(),
            },
          ]
        : [],
    feedbacks:
      status === "COMPLETED"
        ? [
            {
              id: `${b.id}-fb-1`,
              tripId: `trip-${b.id}`,
              author: b.client.name,
              rating: 5,
              comment: "Voyage magnifique, guide très professionnel !",
              submittedAt: end.toISOString(),
            },
          ]
        : [],
  };
});
