"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Send,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  BedDouble,
  Utensils,
} from "lucide-react";
import GalleryModal from "@/components/GalleryModal";
import { useQuoteModal } from "@/context/QuoteModalContext";
import type { CircuitRow } from "@/lib/server/circuits";

interface CircuitDetailClientProps {
  circuit: CircuitRow;
  destinationName: string;
}

export function CircuitDetailClient({ circuit, destinationName }: CircuitDetailClientProps) {
  const { openQuoteModal: onOpenQuoteModal } = useQuoteModal();
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const itinerary = [...circuit.circuit_itinerary_days].sort((a, b) => a.position - b.position);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-nomad-terracotta">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/circuits" className="hover:text-nomad-terracotta">Circuits</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-nomad-navy font-bold">{circuit.title}</span>
      </div>

      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-nomad-terracotta text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
              {circuit.theme}
            </span>
            <span className="bg-nomad-navy text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3 text-nomad-gold" /> {circuit.duration_days} Jours / {circuit.duration_days - 1} Nuits
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-nomad-navy tracking-tight max-w-3xl">
            {circuit.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 flex items-center gap-1.5 mt-2">
            <MapPin className="w-4 h-4 text-nomad-gold" /> {destinationName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-5 py-2.5 rounded-2xl border border-stone-200 shadow-sm text-right">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Prix par personne</span>
            <span className="text-2xl font-black text-nomad-navy">
              {circuit.price_xof.toLocaleString("fr-FR")} FCFA
            </span>
            {circuit.price_eur != null && (
              <span className="text-xs text-stone-400 block font-normal">(~{circuit.price_eur} €)</span>
            )}
          </div>
          <button
            onClick={() => onOpenQuoteModal && onOpenQuoteModal(circuit.destination_id, circuit.id)}
            className="bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Réserver le Circuit
          </button>
        </div>
      </div>

      {/* Main Cover Image */}
      <div
        onClick={() => setIsGalleryOpen(true)}
        className="relative h-[360px] rounded-3xl overflow-hidden shadow-lg cursor-pointer group bg-stone-900"
      >
        <Image
          src={circuit.images[0]}
          alt={circuit.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold px-4 py-2 rounded-xl shadow">
          Voir les photos ({circuit.images.length})
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Day-by-Day Accordion Itinerary */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-nomad-navy border-b border-stone-100 pb-4">
              Programme Jour par Jour
            </h2>

            <div className="space-y-3">
              {itinerary.map((dayItem) => {
                const isOpen = expandedDay === dayItem.day_number;
                return (
                  <div
                    key={dayItem.id}
                    className="border border-stone-200 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => setExpandedDay(isOpen ? null : dayItem.day_number)}
                      className="w-full bg-stone-50 p-4 text-left font-bold text-nomad-navy flex items-center justify-between hover:bg-stone-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="bg-nomad-terracotta text-white text-xs font-black px-3 py-1 rounded-xl">
                          Jour {dayItem.day_number}
                        </span>
                        <span className="text-sm sm:text-base">{dayItem.title}</span>
                      </div>
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {isOpen && (
                      <div className="p-5 bg-white space-y-3 border-t border-stone-100 text-xs sm:text-sm text-stone-700 leading-relaxed">
                        <p>{dayItem.description}</p>
                        <div className="flex flex-wrap gap-4 pt-2 border-t border-stone-100 text-xs font-medium text-stone-600">
                          {dayItem.accommodation && (
                            <span className="flex items-center gap-1.5 text-nomad-navy">
                              <BedDouble className="w-4 h-4 text-nomad-terracotta" />
                              Hébergement : <strong>{dayItem.accommodation}</strong>
                            </span>
                          )}
                          {dayItem.meals && (
                            <span className="flex items-center gap-1.5 text-nomad-navy">
                              <Utensils className="w-4 h-4 text-nomad-gold" />
                              Repas : <strong>{dayItem.meals}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Included / Excluded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-emerald-700 flex items-center gap-2 border-b border-stone-100 pb-3">
                <CheckCircle className="w-5 h-5" /> Ce qui est Inclus
              </h3>
              <ul className="space-y-2 text-xs text-stone-700">
                {circuit.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-rose-700 flex items-center gap-2 border-b border-stone-100 pb-3">
                <XCircle className="w-5 h-5" /> Ce qui n&apos;est pas Inclus
              </h3>
              <ul className="space-y-2 text-xs text-stone-700">
                {circuit.excluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg space-y-5 sticky top-28">
            <h3 className="text-xl font-black text-nomad-navy border-b border-stone-100 pb-3">
              Réserver ce Circuit
            </h3>
            <p className="text-xs text-stone-500">
              Sélectionnez vos dates souhaitées et obtenez votre devis personnalisé immédiat.
            </p>
            <button
              onClick={() => onOpenQuoteModal && onOpenQuoteModal(circuit.destination_id, circuit.id)}
              className="w-full bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Réserver maintenant
            </button>
          </div>
        </div>
      </div>

      <GalleryModal
        isOpen={isGalleryOpen}
        images={circuit.images}
        onClose={() => setIsGalleryOpen(false)}
        title={circuit.title}
      />
    </div>
  );
}
