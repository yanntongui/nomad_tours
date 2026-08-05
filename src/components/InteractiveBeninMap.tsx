"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Sparkles, Star, Send, ChevronRight, Info } from "lucide-react";
import { Destination } from "@/types";

interface InteractiveBeninMapProps {
  destinations: Destination[];
  onOpenQuoteModal?: (destinationId: string) => void;
}

export default function InteractiveBeninMap({ destinations, onOpenQuoteModal }: InteractiveBeninMapProps) {
  const beninDestinations = destinations.filter((d) => !d.isInternational);
  const [selectedDest, setSelectedDest] = useState<Destination>(beninDestinations[0] || destinations[0]);

  return (
    <div className="bg-gradient-to-br from-stone-900 to-nomad-navy rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden border border-stone-800">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Map Visualization & Pins */}
        <div className="lg:w-1/2 w-full flex flex-col items-center justify-center relative min-h-[420px] bg-stone-950/40 rounded-2xl p-4 border border-white/10">
          <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-nomad-gold" />
            Carte Interactive des Destinations Bénin
          </div>

          {/* Benin Map Schematic */}
          <div className="relative w-full max-w-[340px] h-[380px] my-4 flex items-center justify-center">
            {/* Map Background SVG Outline of Benin */}
            <svg viewBox="0 0 200 350" className="w-full h-full opacity-30 drop-shadow">
              <path
                d="M 90,20 L 140,50 L 160,110 L 130,170 L 120,230 L 130,290 L 110,330 L 60,330 L 70,270 L 60,200 L 50,140 L 70,80 Z"
                fill="#E05A47"
                stroke="#FAF6F0"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            </svg>

            {/* Interactive Pins */}
            {beninDestinations.map((dest) => {
              const isSelected = selectedDest?.id === dest.id;
              // Approximate relative positions for Benin destinations
              let pinPos = { top: "50%", left: "50%" };
              if (dest.id.includes("pendjari")) pinPos = { top: "15%", left: "45%" };
              else if (dest.id.includes("natitingou")) pinPos = { top: "28%", left: "35%" };
              else if (dest.id.includes("dassa")) pinPos = { top: "52%", left: "55%" };
              else if (dest.id.includes("abomey")) pinPos = { top: "68%", left: "48%" };
              else if (dest.id.includes("ganvie")) pinPos = { top: "82%", left: "58%" };
              else if (dest.id.includes("porto-novo")) pinPos = { top: "84%", left: "70%" };
              else if (dest.id.includes("ouidah")) pinPos = { top: "86%", left: "42%" };
              else if (dest.id.includes("grand-popo")) pinPos = { top: "88%", left: "28%" };

              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDest(dest)}
                  style={{ top: pinPos.top, left: pinPos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 transition-all duration-300 ${
                    isSelected ? "scale-125 z-30" : "hover:scale-110"
                  }`}
                >
                  <div
                    className={`relative flex items-center justify-center rounded-full p-2 shadow-lg transition-all ${
                      isSelected
                        ? "bg-nomad-terracotta text-white ring-4 ring-nomad-gold/50"
                        : "bg-white/90 text-nomad-navy hover:bg-white"
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur border border-white/10 shadow">
                      {dest.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-stone-400 text-xs flex items-center gap-1 mt-2">
            <Info className="w-3.5 h-3.5 text-nomad-gold" />
            Cliquez sur un marqueur pour explorer la destination
          </p>
        </div>

        {/* Selected Destination Preview Card */}
        {selectedDest && (
          <div className="lg:w-1/2 w-full bg-stone-900/80 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-4">
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image
                src={selectedDest.images[0]}
                alt={selectedDest.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div>
                  <span className="bg-nomad-terracotta text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {selectedDest.region || "Bénin"}
                  </span>
                  <h3 className="text-2xl font-black text-white">{selectedDest.name}</h3>
                </div>
                <div className="bg-white/20 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-nomad-gold text-nomad-gold" />
                  {selectedDest.rating}
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {selectedDest.description}
            </p>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-nomad-gold">
                À ne pas manquer :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {selectedDest.highlights.slice(0, 4).map((h, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-lg p-2 text-[11px] text-stone-200 flex items-center gap-1.5"
                  >
                    <span className="text-nomad-terracotta font-bold">✓</span>
                    <span className="line-clamp-1">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">À partir de</span>
                <span className="text-xl font-black text-nomad-gold">
                  {selectedDest.startingPriceXOF.toLocaleString("fr-FR")} FCFA
                </span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Link
                  href={`/destinations/${selectedDest.slug}`}
                  className="flex-1 sm:flex-none text-center bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition"
                >
                  Voir la fiche
                </Link>
                <button
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal(selectedDest.id)}
                  className="flex-1 sm:flex-none bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center justify-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Devis Express
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
