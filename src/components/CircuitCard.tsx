"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, CheckCircle, Send, ArrowRight } from "lucide-react";
import { Circuit } from "@/types";
import { useQuoteModal } from "@/context/QuoteModalContext";

interface CircuitCardProps {
  circuit: Circuit;
  onOpenQuoteModal?: (destinationId?: string, circuitId?: string) => void;
}

export default function CircuitCard({ circuit, onOpenQuoteModal }: CircuitCardProps) {
  const { openQuoteModal } = useQuoteModal();
  const handleQuote = () => {
    if (onOpenQuoteModal) onOpenQuoteModal(circuit.destinationId, circuit.id);
    else openQuoteModal(circuit.destinationId, circuit.id);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row h-full">
      {/* Circuit Image */}
      <div className="relative md:w-2/5 h-56 md:h-auto bg-stone-100 shrink-0 overflow-hidden">
        <Image
          src={circuit.images[0]}
          alt={circuit.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-nomad-navy text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
          <Clock className="w-3 h-3 text-nomad-gold" />
          <span>{circuit.durationDays} Jours / {circuit.durationDays - 1} Nuits</span>
        </div>
        <div className="absolute top-3 right-3 bg-nomad-terracotta text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow">
          {circuit.theme}
        </div>
      </div>

      {/* Details */}
      <div className="p-5 md:w-3/5 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1 text-xs text-nomad-terracotta font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{circuit.destinationName}</span>
          </div>
          <Link href={`/circuits/${circuit.slug}`}>
            <h3 className="text-lg font-bold text-nomad-navy leading-tight hover:text-nomad-terracotta transition-colors">
              {circuit.title}
            </h3>
          </Link>
        </div>

        {/* Included List */}
        <div className="space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
            Inclus dans le circuit :
          </span>
          <ul className="space-y-1 text-xs text-stone-600">
            {circuit.included.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                <CheckCircle className="w-3.5 h-3.5 text-nomad-green shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & Booking */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-semibold">Prix par personne</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-nomad-navy">
                {circuit.priceXOF.toLocaleString("fr-FR")} FCFA
              </span>
              <span className="text-xs text-stone-400 font-normal">
                (~{circuit.priceEUR} €)
              </span>
            </div>
          </div>

          <button
            onClick={handleQuote}
            className="bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Réserver / Devis
          </button>
        </div>
      </div>
    </div>
  );
}
