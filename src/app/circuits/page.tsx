"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Compass, Filter, Clock, CheckCircle, Send, ArrowRight } from "lucide-react";
import { CIRCUITS } from "@/lib/data/circuits";
import CircuitCard from "@/components/CircuitCard";
import { useQuoteModal } from "@/context/QuoteModalContext";

export default function CircuitsPage() {
  const { openQuoteModal: onOpenQuoteModal } = useQuoteModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("ALL");
  const [maxDuration, setMaxDuration] = useState("ALL");

  const filteredCircuits = useMemo(() => {
    return CIRCUITS.filter((circuit) => {
      const matchesSearch =
        !searchQuery ||
        circuit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circuit.destinationName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTheme = selectedTheme === "ALL" || circuit.theme === selectedTheme;

      let matchesDuration = true;
      if (maxDuration === "SHORT") matchesDuration = circuit.durationDays <= 3;
      if (maxDuration === "MEDIUM") matchesDuration = circuit.durationDays > 3 && circuit.durationDays <= 6;
      if (maxDuration === "LONG") matchesDuration = circuit.durationDays > 6;

      return matchesSearch && matchesTheme && matchesDuration;
    });
  }, [searchQuery, selectedTheme, maxDuration]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-nomad-terracotta to-nomad-gold text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full backdrop-blur-sm">
            Séjours Clés en Main
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Circuits Touristiques au Bénin & International</h1>
          <p className="text-xs sm:text-sm text-stone-100">
            Itinéraires optimisés avec hébergements de charme, guides professionnels et transport privé inclus.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher Safari, Culture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
            />
          </div>

          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 font-medium focus:ring-2 focus:ring-nomad-terracotta outline-none"
          >
            <option value="ALL">Tous les thèmes (Culture, Safari, Plage...)</option>
            <option value="Culture">Culture & Histoire</option>
            <option value="Safari">Safari & Faune Sauvage</option>
            <option value="Plage">Plage & Détente</option>
            <option value="Aventure">Aventure & Nature</option>
          </select>

          <select
            value={maxDuration}
            onChange={(e) => setMaxDuration(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 font-medium focus:ring-2 focus:ring-nomad-terracotta outline-none"
          >
            <option value="ALL">Toutes les durées</option>
            <option value="SHORT">Court séjour (1 à 3 jours)</option>
            <option value="MEDIUM">Moyen séjour (4 à 6 jours)</option>
            <option value="LONG">Grand circuit (7 jours et +)</option>
          </select>
        </div>
      </div>

      {/* Circuits List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCircuits.length > 0 ? (
          filteredCircuits.map((circuit) => (
            <CircuitCard
              key={circuit.id}
              circuit={circuit}
              onOpenQuoteModal={onOpenQuoteModal}
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center text-stone-500 space-y-3 border border-stone-200">
            <Compass className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-nomad-navy">Aucun circuit correspondant</h3>
            <p className="text-xs">Modifiez vos critères pour afficher d'autres offres.</p>
          </div>
        )}
      </div>
    </div>
  );
}
