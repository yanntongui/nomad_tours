import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CircuitForm } from "@/components/admin/CircuitForm";
import { CircuitStatsTab } from "@/components/admin/CircuitStatsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCircuit, listCircuits } from "@/lib/server/circuits";
import { listDestinations } from "@/lib/server/destinations";
import { listTripFeedbacksForCircuit } from "@/lib/server/trips";
import { listBookingsForCircuit } from "@/lib/server/bookings";
import { createClient } from "@/lib/supabase/server";

export default async function EditCircuitPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const [circuit, destinations, allCircuits, guidesResult, feedbacks, circuitBookings] = await Promise.all([
    getCircuit(params.id),
    listDestinations(),
    listCircuits(),
    supabase.from("admin_profiles").select("id, name").eq("role", "GUIDE").order("name"),
    listTripFeedbacksForCircuit(params.id),
    listBookingsForCircuit(params.id),
  ]);

  const avgRating =
    feedbacks.length > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length : null;

  if (!circuit) {
    return (
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center">
        <p className="text-stone-500 dark:text-stone-400">Circuit introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/circuits"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="details" key={circuit.id}>
      <TabsList>
        <TabsTrigger value="details">Détails</TabsTrigger>
        <TabsTrigger value="stats">Statistiques</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <CircuitForm
          initial={circuit}
          mode="edit"
          destinations={destinations}
          allCircuits={allCircuits}
          guides={guidesResult.data ?? []}
        />
      </TabsContent>
      <TabsContent value="stats">
        <CircuitStatsTab circuit={circuit} avgRating={avgRating} bookings={circuitBookings} />
      </TabsContent>
    </Tabs>
  );
}
