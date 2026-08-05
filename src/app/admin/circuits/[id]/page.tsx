"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CircuitForm } from "@/components/admin/CircuitForm";
import { useCircuits } from "@/lib/admin/store/circuits-store";

export default function EditCircuitPage({ params }: { params: { id: string } }) {
  const circuits = useCircuits();
  const circuit = circuits.find((c) => c.id === params.id);

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

  return <CircuitForm initial={circuit} mode="edit" key={circuit.id} />;
}
