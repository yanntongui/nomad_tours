import { RequireRole } from "@/components/admin/RequireRole";
import { listTripReports } from "@/lib/server/trips";
import { RapportsClient } from "./RapportsClient";

export default async function RapportsPage() {
  const reports = await listTripReports();
  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <RapportsClient reports={reports} />
    </RequireRole>
  );
}
