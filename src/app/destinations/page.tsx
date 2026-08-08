"use client";
import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Search, Filter, Compass, LayoutGrid, Map as MapIcon, Sparkles } from "lucide-react";
import { DESTINATIONS } from "@/lib/data/destinations";
import DestinationCard from "@/components/DestinationCard";
import InteractiveBeninMap from "@/components/InteractiveBeninMap";
import { useQuoteModal } from "@/context/QuoteModalContext";

export default function DestinationsPage() {
  const { openQuoteModal: onOpenQuoteModal } = useQuoteModal();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialBudget = searchParams.get("budget") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [selectedBudget, setSelectedBudget] = useState(initialBudget);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((dest) => {
      // Search query filter
      const matchesSearch =
        !searchQuery ||
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Country filter
      const matchesCountry =
        selectedCountry === "ALL" ||
        (selectedCountry === "BENIN" && !dest.isInternational) ||
        (selectedCountry === "INTL" && dest.isInternational);

      // Budget filter
      let matchesBudget = true;
      if (selectedBudget === "eco") matchesBudget = dest.startingPriceXOF <= 100000;
      if (selectedBudget === "mid") matchesBudget = dest.startingPriceXOF > 100000 && dest.startingPriceXOF <= 300000;
      if (selectedBudget === "prestige") matchesBudget = dest.startingPriceXOF > 300000;

      return matchesSearch && matchesCountry && matchesBudget;
    });
  }, [searchQuery, selectedCountry, selectedBudget]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-nomad-navy to-nomad-navy-light text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-nomad-terracotta text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
            Catalogue Général
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Destinations d'Exception Bénin & International</h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Explorez nos 8 joyaux du Bénin et nos extensions internationales. Filtrez selon vos envies de voyage.
          </p>
        </div>
      </div>

      {/* Filters & View Switcher Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          {/* Text Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher Ganvié, Ouidah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
            />
          </div>

          {/* Country Selector */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 font-medium focus:ring-2 focus:ring-nomad-terracotta outline-none"
          >
            <option value="ALL">Toutes les destinations (Bénin + International)</option>
            <option value="BENIN">Uniquement Bénin (8 Destinations)</option>
            <option value="INTL">International (Afrique du Sud, Ghana...)</option>
          </select>

          {/* Budget Filter */}
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 font-medium focus:ring-2 focus:ring-nomad-terracotta outline-none"
          >
            <option value="">Tous les budgets</option>
            <option value="eco">Économique (&lt; 100 000 FCFA)</option>
            <option value="mid">Moyen (100 000 - 300 000 FCFA)</option>
            <option value="prestige">Prestige (&gt; 300 000 FCFA)</option>
          </select>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                viewMode === "grid"
                  ? "bg-white text-nomad-navy shadow-sm"
                  : "text-stone-600 hover:text-nomad-navy"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grille
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                viewMode === "map"
                  ? "bg-white text-nomad-navy shadow-sm"
                  : "text-stone-600 hover:text-nomad-navy"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Carte Bénin
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>
            Affichage de <strong>{filteredDestinations.length}</strong> destination(s)
          </span>
          {(searchQuery || selectedCountry !== "ALL" || selectedBudget) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCountry("ALL");
                setSelectedBudget("");
              }}
              className="text-nomad-terracotta hover:underline font-semibold"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* View Rendering */}
      {viewMode === "map" ? (
        <InteractiveBeninMap destinations={filteredDestinations} onOpenQuoteModal={onOpenQuoteModal} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onOpenQuoteModal={onOpenQuoteModal}
              />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center text-stone-500 space-y-3 border border-stone-200">
              <Compass className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-lg font-bold text-nomad-navy">Aucune destination trouvée</h3>
              <p className="text-xs">Essayez d'assouplir vos filtres de recherche.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
