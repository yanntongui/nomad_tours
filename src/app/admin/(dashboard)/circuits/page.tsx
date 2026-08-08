import { listCircuits } from "@/lib/server/circuits";
import { listDestinations } from "@/lib/server/destinations";
import { RequireRole } from "@/components/admin/RequireRole";
import { CircuitsListClient } from "./CircuitsListClient";

export default async function CircuitsPage() {
  const [circuits, destinations] = await Promise.all([listCircuits(), listDestinations()]);

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <CircuitsListClient circuits={circuits} destinations={destinations} />
    </RequireRole>
  );
}
