import { listAllLoyaltyOffers } from "@/lib/server/loyalty";
import { RequireRole } from "@/components/admin/RequireRole";
import { FideliteClient } from "./FideliteClient";

export default async function FidelitePage() {
  const offers = await listAllLoyaltyOffers();

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <FideliteClient offers={offers} />
    </RequireRole>
  );
}
