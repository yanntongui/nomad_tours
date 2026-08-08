import { listCircuits } from "@/lib/server/circuits";
import { listDestinations } from "@/lib/server/destinations";
import { CircuitsListClient } from "./CircuitsListClient";

export default async function CircuitsPage() {
  const [circuits, destinations] = await Promise.all([listCircuits(), listDestinations()]);
  const destinationNameById = new Map(destinations.map((d) => [d.id, d.name]));

  const circuitsWithDestination = circuits.map((circuit) => ({
    ...circuit,
    destinationName: destinationNameById.get(circuit.destination_id) ?? "",
  }));

  return <CircuitsListClient circuits={circuitsWithDestination} />;
}
