import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClient } from "@/lib/server/clients";
import { listActiveLoyaltyOffers } from "@/lib/server/loyalty";
import { listTripFeedbacksForClient } from "@/lib/server/trips";
import { listBookingsForClient } from "@/lib/server/bookings";
import { listSupportTicketsForClient } from "@/lib/server/support";
import { ClientDetailClient } from "./ClientDetailClient";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await getClient(params.id);

  if (!client) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-500 dark:text-stone-400">Client introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/clients"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const [loyaltyOffers, feedbacks, bookings, tickets] = await Promise.all([
    listActiveLoyaltyOffers(),
    listTripFeedbacksForClient(client.id),
    listBookingsForClient(client.id),
    listSupportTicketsForClient(client.id),
  ]);

  return (
    <ClientDetailClient
      client={client}
      loyaltyOffers={loyaltyOffers}
      feedbacks={feedbacks}
      bookings={bookings}
      tickets={tickets}
      key={client.id}
    />
  );
}
