"use client";
import React, { Suspense, useMemo, useState } from "react";
import { Search, MapPin, Grid3x3, Map as MapIcon } from "lucide-react";
import DestinationCard from "@/components/DestinationCard";
import InteractiveBeninMap from "@/components/InteractiveBeninMap";
import { useQuoteModal } from "@/context/QuoteModalContext";
import type { DestinationRow } from "@/lib/server/destinations";

interface DestinationsListClientProps {
  destinations: DestinationRow[];
}

function DestinationsListContent({ destinations }: DestinationsListClientProps) {
  const { openQuoteModal } = useQuoteModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<"ALL" | "BENIN" | "INTERNATIONAL">("ALL");
  const [budgetFilter, setBudgetFilter] = useState<"ALL" | "eco" | "mid" | "prestige">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesSearch =
        !searchQuery ||
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCountry =
        countryFilter === "ALL" ||
        (countryFilter === "BENIN" && !dest.is_international) ||
        (countryFilter === "INTERNATIONAL" && dest.is_international);

      let matchesBudget = true;
      if (budgetFilter === "eco") matchesBudget = dest.starting_price_xof <= 100000;
      if (budgetFilter === "mid") matchesBudget = dest.starting_price_xof > 100000 && dest.starting_price_xof <= 300000;
      if (budgetFilter === "prestige") matchesBudget = dest.starting_price_xof > 300000;

      return matchesSearch && matchesCountry && matchesBudget;
    });
  }, [destinations, searchQuery, countryFilter, budgetFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-nomad-navy to-nomad-navy-light text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-3">
        <span className="bg-nomad-terracotta text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
          Explorer
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">Nos Destinations Bénin & International</h1>
        <p className="text-xs sm:text-sm text-stone-300">
          Du Bénin authentique aux évasions panafricaines, trouvez la destination qui vous ressemble.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
            />
          </div>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value as typeof countryFilter)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 font-medium focus:ring-2 focus:ring-nomad-terracotta outline-none"
          >
            <option value="ALL">Bénin & International</option>
            <option value="BENIN">Bénin uniquement</option>
            <option value="INTERNATIONAL">International uniquement</option>
          </select>

          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value as typeof budgetFilter)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 font-medium focus:ring-2 focus:ring-nomad-terracotta outline-none"
          >
            <option value="ALL">Tous les budgets</option>
            <option value="eco">Éco (≤ 100 000 FCFA)</option>
            <option value="mid">Confort (100k - 300k FCFA)</option>
            <option value="prestige">Prestige (&gt; 300 000 FCFA)</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-400">
            {filteredDestinations.length} destination{filteredDestinations.length > 1 ? "s" : ""} trouvée{filteredDestinations.length > 1 ? "s" : ""}
          </p>
          <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "grid" ? "bg-white shadow text-nomad-navy" : "text-stone-500"
              }`}
            >
              <Grid3x3 className="w-3.5 h-3.5" /> Grille
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "map" ? "bg-white shadow text-nomad-navy" : "text-stone-500"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Carte
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        filteredDestinations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-stone-500 space-y-3 border border-stone-200">
            <MapPin className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-nomad-navy">Aucune destination correspondante</h3>
            <p className="text-xs">Modifiez vos critères pour afficher d&apos;autres offres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} onOpenQuoteModal={(id) => openQuoteModal(id)} />
            ))}
          </div>
        )
      ) : (
        <InteractiveBeninMap destinations={filteredDestinations} onOpenQuoteModal={(id) => openQuoteModal(id)} />
      )}
    </div>
  );
}

export function DestinationsListClient(props: DestinationsListClientProps) {
  return (
    <Suspense>
      <DestinationsListContent {...props} />
    </Suspense>
  );
}
