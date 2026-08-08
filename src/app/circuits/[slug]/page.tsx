import React from "react";
import Link from "next/link";
import { getCircuitBySlug } from "@/lib/server/circuits";
import { getDestination } from "@/lib/server/destinations";
import { CircuitDetailClient } from "./CircuitDetailClient";

interface CircuitDetailPageProps {
  params: { slug: string };
}

export default async function CircuitDetailPage({ params }: CircuitDetailPageProps) {
  const circuit = await getCircuitBySlug(params.slug);

  if (!circuit) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-nomad-navy">Circuit introuvable</h2>
        <Link href="/circuits" className="inline-block bg-nomad-terracotta text-white font-bold px-6 py-2.5 rounded-xl">
          Retour aux circuits
        </Link>
      </div>
    );
  }

  const destination = await getDestination(circuit.destination_id);

  return <CircuitDetailClient circuit={circuit} destinationName={destination?.name ?? ""} />;
}
