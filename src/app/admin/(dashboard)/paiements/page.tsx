import { listPayments, listPaymentSchedules } from "@/lib/server/bookings";
import { RequireSuperAdmin } from "@/components/admin/RequireSuperAdmin";
import { PaiementsClient } from "./PaiementsClient";

export default async function PaiementsPage() {
  const [payments, schedules] = await Promise.all([listPayments(), listPaymentSchedules()]);

  return (
    <RequireSuperAdmin>
      <PaiementsClient payments={payments} schedules={schedules} />
    </RequireSuperAdmin>
  );
}
