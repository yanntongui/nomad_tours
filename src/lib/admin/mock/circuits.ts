import { CIRCUITS as PUBLIC_CIRCUITS } from "@/lib/data/circuits";
import { GUIDES } from "@/lib/admin/mock/users";
import { Circuit } from "@/lib/admin/types";

function departuresFor(circuitIndex: number): Circuit["departures"] {
  const base = [
    { offsetDays: 12, seatsTotal: 14, seatsBooked: 11 },
    { offsetDays: 33, seatsTotal: 14, seatsBooked: 6 },
    { offsetDays: 61, seatsTotal: 16, seatsBooked: 16 },
    { offsetDays: 90, seatsTotal: 14, seatsBooked: 2 },
  ];
  const today = new Date(2026, 7, 2);
  return base.map((b, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + b.offsetDays + circuitIndex * 3);
    const status: Circuit["departures"][number]["status"] =
      b.seatsBooked >= b.seatsTotal ? "COMPLET" : "OPEN";
    return {
      id: `circ-${circuitIndex}-dep-${i}`,
      date: date.toISOString(),
      seatsTotal: b.seatsTotal,
      seatsBooked: b.seatsBooked,
      status,
    };
  });
}

export const ADMIN_CIRCUITS: Circuit[] = PUBLIC_CIRCUITS.map((c, i) => ({
  id: c.id,
  slug: c.slug,
  title: c.title,
  destinationId: c.destinationId,
  destinationName: c.destinationName,
  durationDays: c.durationDays,
  priceXOF: c.priceXOF,
  priceEUR: c.priceEUR,
  theme: c.theme,
  isFeatured: !!c.isFeatured,
  images: c.images,
  itinerary: c.itinerary.map((day, j) => ({
    id: `${c.id}-day-${j}`,
    day: day.day,
    title: day.title,
    description: day.description,
    accommodation: day.accommodation,
    meals: day.meals,
  })),
  included: c.included,
  excluded: c.excluded,
  priceTiers: [
    { id: `${c.id}-tier-1`, label: "1-2 personnes", minPax: 1, maxPax: 2, priceXOF: c.priceXOF },
    { id: `${c.id}-tier-2`, label: "3-5 personnes", minPax: 3, maxPax: 5, priceXOF: Math.round(c.priceXOF * 0.9) },
    { id: `${c.id}-tier-3`, label: "6+ personnes", minPax: 6, priceXOF: Math.round(c.priceXOF * 0.8) },
  ],
  options: [
    { id: `${c.id}-opt-1`, label: "Chambre single (supplément)", priceXOF: 35000 },
    { id: `${c.id}-opt-2`, label: "Transfert aéroport privé", priceXOF: 20000 },
  ],
  departures: departuresFor(i),
  guide: GUIDES[i % GUIDES.length]
    ? { guideId: GUIDES[i % GUIDES.length].id, guideName: GUIDES[i % GUIDES.length].name }
    : undefined,
  seoTitle: `${c.title} | Nomad Tours`,
  seoDescription: c.included[0] ?? c.title,
  bookingsCount: 8 + i * 5,
  createdAt: new Date(2025, i % 12, 8).toISOString(),
  updatedAt: new Date(2026, (i + 3) % 7, 15).toISOString(),
}));
