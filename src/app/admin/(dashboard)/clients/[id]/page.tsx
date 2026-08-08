import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClient } from "@/lib/server/clients";
import { listActiveLoyaltyOffers } from "@/lib/server/loyalty";
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

  const loyaltyOffers = await listActiveLoyaltyOffers();

  return <ClientDetailClient client={client} loyaltyOffers={loyaltyOffers} key={client.id} />;
}
