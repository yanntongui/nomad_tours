import { listDestinations } from "@/lib/server/destinations";
import { DestinationsListClient } from "./DestinationsListClient";

export default async function DestinationsPage() {
  const destinations = await listDestinations();
  return <DestinationsListClient destinations={destinations} />;
}
