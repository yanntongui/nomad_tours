import { CircuitForm } from "@/components/admin/CircuitForm";
import { listCircuits } from "@/lib/server/circuits";
import { listDestinations } from "@/lib/server/destinations";
import { createClient } from "@/lib/supabase/server";

export default async function NewCircuitPage() {
  const supabase = await createClient();
  const [destinations, allCircuits, guidesResult] = await Promise.all([
    listDestinations(),
    listCircuits(),
    supabase.from("admin_profiles").select("id, name").eq("role", "GUIDE").order("name"),
  ]);

  return (
    <CircuitForm
      initial={null}
      mode="create"
      destinations={destinations}
      allCircuits={allCircuits}
      guides={guidesResult.data ?? []}
    />
  );
}
