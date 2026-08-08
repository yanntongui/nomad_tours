import { listDestinations } from "@/lib/server/destinations";
import { createClient } from "@/lib/supabase/server";
import { RequireRole } from "@/components/admin/RequireRole";
import { DestinationsListClient } from "./DestinationsListClient";

export default async function DestinationsPage() {
  const supabase = await createClient();
  const [destinations, circuitsResult] = await Promise.all([
    listDestinations(),
    supabase.from("circuits").select("id, destination_id"),
  ]);

  const circuitCounts: Record<string, number> = {};
  for (const circuit of circuitsResult.data ?? []) {
    circuitCounts[circuit.destination_id] = (circuitCounts[circuit.destination_id] ?? 0) + 1;
  }

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <DestinationsListClient destinations={destinations} circuitCounts={circuitCounts} />
    </RequireRole>
  );
}
