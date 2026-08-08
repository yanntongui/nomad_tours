import { TRIPS } from "@/lib/admin/mock/trips";
import { TripReport } from "@/lib/admin/types";

const completedTrips = TRIPS.filter((t) => t.status === "COMPLETED");

export const TRIP_REPORTS: TripReport[] = completedTrips.slice(0, 2).map((trip, i) => ({
  id: `report-${trip.id}`,
  tripId: trip.id,
  status: i === 0 ? "FINALIZED" : "DRAFT",
  manual:
    i === 0
      ? {
          redacteur: "Aïcha Koffi",
          dateRedaction: trip.endDate,
          recommandations: "Prévoir un guide supplémentaire pour les groupes de plus de 8 personnes.",
        }
      : {},
  generatedAt: trip.endDate,
  generatedBy: "Système",
  finalizedAt: i === 0 ? trip.endDate : undefined,
  finalizedBy: i === 0 ? "Aïcha Koffi" : undefined,
  updatedAt: trip.endDate,
}));
