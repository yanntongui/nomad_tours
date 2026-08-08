import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequireRole } from "@/components/admin/RequireRole";
import { getSupportTicket } from "@/lib/server/support";
import { TicketDetailClient } from "./TicketDetailClient";

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticket = await getSupportTicket(params.id);

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      {ticket ? (
        <TicketDetailClient ticket={ticket} />
      ) : (
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-500 dark:text-stone-400">Ticket introuvable.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/admin/support"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
          </Button>
        </div>
      )}
    </RequireRole>
  );
}
