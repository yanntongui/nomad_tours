"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DestinationForm } from "@/components/admin/DestinationForm";
import { useDestinations } from "@/lib/admin/store/destinations-store";

export default function EditDestinationPage({ params }: { params: { id: string } }) {
  const destinations = useDestinations();
  const destination = destinations.find((d) => d.id === params.id);

  if (!destination) {
    return (
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center">
        <p className="text-stone-500 dark:text-stone-400">Destination introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/destinations"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  return <DestinationForm initial={destination} mode="edit" key={destination.id} />;
}
