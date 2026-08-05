"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { Destination } from "@/types";
import { useQuoteModal } from "@/context/QuoteModalContext";

interface DestinationCardProps {
  destination: Destination;
  onOpenQuoteModal?: (destinationId: string) => void;
}

export default function DestinationCard({ destination, onOpenQuoteModal }: DestinationCardProps) {
  const { openQuoteModal } = useQuoteModal();
  const handleQuote = () => {
    if (onOpenQuoteModal) onOpenQuoteModal(destination.id);
    else openQuoteModal(destination.id);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Banner */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
        <Image
          src={destination.images[0]}
          alt={destination.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {destination.isFeatured && (
            <span className="bg-nomad-terracotta text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Phare
            </span>
          )}
          <span className="bg-nomad-navy/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            {destination.country}
          </span>
        </div>

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
          <Star className="w-3.5 h-3.5 fill-nomad-gold text-nomad-gold" />
          <span>{destination.rating}</span>
          <span className="text-stone-400 font-normal text-[10px]">({destination.reviewsCount})</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-xl font-bold font-sans drop-shadow-sm leading-tight">
            {destination.name}
          </h3>
          {destination.region && (
            <p className="text-xs text-stone-200 flex items-center gap-1 mt-0.5 font-light">
              <MapPin className="w-3 h-3 text-nomad-gold shrink-0" />
              {destination.region}
            </p>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        {/* Highlights Tags */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Points forts :
          </span>
          <div className="flex flex-wrap gap-1">
            {destination.highlights.slice(0, 2).map((h, i) => (
              <span
                key={i}
                className="bg-stone-100 text-stone-700 text-[11px] px-2 py-0.5 rounded-md border border-stone-200 line-clamp-1"
              >
                ✓ {h}
              </span>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1 border-t border-stone-100">
          <Calendar className="w-3.5 h-3.5 text-nomad-terracotta shrink-0" />
          <span>Période idéale : <strong>{destination.bestPeriod}</strong></span>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-semibold">À partir de</span>
            <span className="text-base font-extrabold text-nomad-navy">
              {destination.startingPriceXOF.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuote}
              className="bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white text-xs font-semibold px-2.5 py-2 rounded-xl transition"
            >
              Devis
            </button>
            <Link
              href={`/destinations/${destination.slug}`}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
            >
              Détails <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
