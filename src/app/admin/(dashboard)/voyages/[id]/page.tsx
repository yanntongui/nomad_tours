import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTrip, getTripReport } from "@/lib/server/trips";
import { listAdminProfiles } from "@/lib/server/users";
import { listTaskTemplates } from "@/lib/server/task-templates";
import { TripDetailClient } from "./TripDetailClient";

export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const [trip, profiles, templates] = await Promise.all([
    getTrip(params.id),
    listAdminProfiles(),
    listTaskTemplates(),
  ]);

  if (!trip) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-500 dark:text-stone-400">Voyage introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/voyages">
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Link>
        </Button>
      </div>
    );
  }

  const report = await getTripReport(trip.id);

  return <TripDetailClient trip={trip} profiles={profiles} templates={templates} report={report} />;
}
