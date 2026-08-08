import { listTripsSummary } from "@/lib/server/trips";
import { VoyagesClient } from "./VoyagesClient";

export default async function VoyagesPage() {
  const trips = await listTripsSummary();
  return <VoyagesClient trips={trips} />;
}
