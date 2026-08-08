import { listCircuits } from "@/lib/server/circuits";
import { listDestinations } from "@/lib/server/destinations";
import { Circuit } from "@/lib/admin/types";
import { ProgrammeAnnuelClient } from "./ProgrammeAnnuelClient";

export default async function ProgrammeAnnuelPage() {
  const [circuitRows, destinations] = await Promise.all([
    listCircuits(),
    listDestinations(),
  ]);

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

  return <ProgrammeAnnuelClient circuits={circuits} />;
}
