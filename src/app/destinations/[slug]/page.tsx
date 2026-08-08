import React from "react";
import Link from "next/link";
import { getDestinationBySlug } from "@/lib/server/destinations";
import { listCircuitsByDestination } from "@/lib/server/circuits";
import { DestinationDetailClient } from "./DestinationDetailClient";

interface DestinationDetailPageProps {
  params: { slug: string };
}

export default async function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const destination = await getDestinationBySlug(params.slug);

  if (!destination) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-nomad-navy">Destination introuvable</h2>
        <p className="text-sm text-stone-600">La destination demandée n&apos;existe pas ou a été déplacée.</p>
        <Link href="/destinations" className="inline-block bg-nomad-terracotta text-white font-bold px-6 py-2.5 rounded-xl">
          Retour aux destinations
        </Link>
      </div>
    );
  }

  const circuits = await listCircuitsByDestination(destination.id);
  const associatedCircuits = circuits.map((circuit) => ({
    ...circuit,
    destinationName: destination.name,
  }));

  return <DestinationDetailClient destination={destination} associatedCircuits={associatedCircuits} />;
}
