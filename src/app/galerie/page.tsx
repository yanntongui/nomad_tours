"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Camera, MapPin } from "lucide-react";
import { GALLERY_PHOTOS } from "@/lib/data/gallery";
import GalleryModal from "@/components/GalleryModal";
import { useQuoteModal } from "@/context/QuoteModalContext";

const TRIPS = Array.from(new Set(GALLERY_PHOTOS.map((p) => p.tripTitle)));

export default function GaleriePage() {
  const { openQuoteModal } = useQuoteModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrip, setSelectedTrip] = useState("ALL");
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const filteredPhotos = useMemo(() => {
    return GALLERY_PHOTOS.filter((photo) => {
      const matchesSearch =
        !searchQuery ||
        photo.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTrip = selectedTrip === "ALL" || photo.tripTitle === selectedTrip;
      return matchesSearch && matchesTrip;
    });
  }, [searchQuery, selectedTrip]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-nomad-navy to-nomad-navy-light text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-nomad-terracotta text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
            Instants Nomades
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Nos voyageurs, en images</h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Un aperçu des moments capturés lors de nos circuits passés — de vraies photos, de vrais souvenirs partagés par nos voyageurs.
          </p>
        </div>
        <Camera className="absolute -right-6 -bottom-6 w-40 h-40 text-white/10" />
      </div>

      {/* Search & Trip filter */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un lieu, un instant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3.5 py-2 text-xs text-stone-800 outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", ...TRIPS].map((trip) => (
            <button
              key={trip}
              onClick={() => setSelectedTrip(trip)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                selectedTrip === trip
                  ? "bg-nomad-terracotta text-white shadow"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {trip === "ALL" ? "Tous les circuits" : trip}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-stone-400">
        {filteredPhotos.length} photo{filteredPhotos.length > 1 ? "s" : ""} sur {GALLERY_PHOTOS.length}
      </p>

      {/* Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-20 text-sm text-stone-400">Aucune photo ne correspond à votre recherche.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setModalIndex(idx)}
              className="group relative overflow-hidden rounded-2xl h-[220px] text-left"
            >
              <Image
                src={photo.image}
                alt={photo.caption}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 p-3.5 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <span className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase text-nomad-gold font-semibold mb-1">
                  <MapPin className="w-3 h-3" />
                  {photo.location}
                </span>
                <p className="text-white text-xs font-medium leading-snug">{photo.caption}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-nomad-terracotta to-nomad-gold text-white rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-black">Envie de vivre votre propre aventure ?</h2>
        <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto">
          Demandez un devis personnalisé et laissez nos guides transformer votre voyage en souvenirs à partager.
        </p>
        <button
          onClick={() => openQuoteModal()}
          className="bg-white text-nomad-terracotta text-xs sm:text-sm font-bold px-6 py-3 rounded-full hover:shadow-lg transition-all"
        >
          Demander un devis
        </button>
      </div>

      <GalleryModal
        isOpen={modalIndex !== null}
        images={filteredPhotos.map((p) => p.image)}
        initialIndex={modalIndex ?? 0}
        onClose={() => setModalIndex(null)}
        title="Instants Nomades"
      />
    </div>
  );
}
