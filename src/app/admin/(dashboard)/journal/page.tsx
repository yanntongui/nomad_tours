import { RequireSuperAdmin } from "@/components/admin/RequireSuperAdmin";
import { getAuditLog } from "@/lib/admin/audit-log";
import { JournalClient } from "./JournalClient";

export default async function JournalPage() {
  const entries = await getAuditLog();
  return (
    <RequireSuperAdmin>
      <JournalClient entries={entries} />
    </RequireSuperAdmin>
  );
}
