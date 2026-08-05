import { DESTINATIONS as PUBLIC_DESTINATIONS } from "@/lib/data/destinations";
import { CIRCUITS as PUBLIC_CIRCUITS } from "@/lib/data/circuits";
import { Destination } from "@/lib/admin/types";

export const ADMIN_DESTINATIONS: Destination[] = PUBLIC_DESTINATIONS.map((d, i) => ({
  id: d.id,
  slug: d.slug,
  name: d.name,
  country: d.country,
  region: d.region,
  description: d.description,
  highlights: d.highlights,
  images: d.images,
  climate: d.climate,
  bestPeriod: d.bestPeriod,
  isInternational: d.isInternational,
  isFeatured: !!d.isFeatured,
  latitude: d.latitude,
  longitude: d.longitude,
  pointsOfInterest: d.highlights.slice(0, 2).map((h, j) => ({
    id: `${d.id}-poi-${j}`,
    name: h.split(" ").slice(0, 3).join(" "),
    description: h,
  })),
  seoTitle: `${d.name} | Nomad Tours`,
  seoDescription: d.description.slice(0, 150),
  circuitsCount: PUBLIC_CIRCUITS.filter((c) => c.destinationId === d.id).length,
  createdAt: new Date(2025, (i * 2) % 12, 5).toISOString(),
  updatedAt: new Date(2026, i % 7, 12).toISOString(),
}));
