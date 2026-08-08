import { listCircuits } from "@/lib/server/circuits";
import { listDestinations } from "@/lib/server/destinations";
import { listOngoingTripsForRisk } from "@/lib/server/trips";
import { Circuit } from "@/lib/admin/types";
import { ActiveTripInfo, ProgrammeAnnuelClient } from "./ProgrammeAnnuelClient";

export default async function ProgrammeAnnuelPage() {
  const [circuitRows, destinations, ongoingTrips] = await Promise.all([
    listCircuits(),
    listDestinations(),
    listOngoingTripsForRisk(),
  ]);

  const activeTrips: ActiveTripInfo[] = ongoingTrips
    .filter((t) => t.bookings !== null)
    .map((t) => ({
      id: t.id,
      circuitId: t.bookings!.reference_id,
      hasIncompleteChecklist: t.trip_participants.some((p) =>
        ((p.checklist as { label: string; done: boolean }[] | null) ?? []).some((c) => !c.done)
      ),
      tasks: t.trip_tasks.map((task) => ({ category: task.category, status: task.status, dueDate: task.due_date })),
    }));

  const destinationNames: Record<string, string> = {};
  for (const destination of destinations) {
    destinationNames[destination.id] = destination.name;
  }

  const circuits: Circuit[] = circuitRows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    destinationId: row.destination_id,
    destinationName: destinationNames[row.destination_id] ?? "",
    durationDays: row.duration_days,
    priceXOF: row.price_xof,
    theme: row.theme as Circuit["theme"],
    category: row.category as Circuit["category"],
    isFeatured: row.is_featured,
    images: row.images ?? [],
    itinerary: [],
    included: row.included ?? [],
    excluded: row.excluded ?? [],
    priceTiers: [],
    options: [],
    departures: row.circuit_departures.map((departure) => ({
      id: departure.id,
      date: `${departure.departure_date}T00:00:00`,
      seatsTotal: departure.seats_total,
      seatsBooked: departure.seats_booked,
      status: departure.status as Circuit["departures"][number]["status"],
    })),
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    bookingsCount: 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return <ProgrammeAnnuelClient circuits={circuits} activeTrips={activeTrips} />;
}
