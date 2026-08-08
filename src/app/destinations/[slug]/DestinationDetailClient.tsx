"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  CloudSun,
  CheckCircle,
  Send,
  Camera,
  ChevronRight,
  PhoneCall,
} from "lucide-react";
import CircuitCard, { type PublicCircuit } from "@/components/CircuitCard";
import GalleryModal from "@/components/GalleryModal";
import { useQuoteModal } from "@/context/QuoteModalContext";
import type { DestinationRow } from "@/lib/server/destinations";

interface DestinationDetailClientProps {
  destination: DestinationRow;
  associatedCircuits: PublicCircuit[];
}

export function DestinationDetailClient({ destination, associatedCircuits }: DestinationDetailClientProps) {
  const { openQuoteModal } = useQuoteModal();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-nomad-terracotta">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/destinations" className="hover:text-nomad-terracotta">Destinations</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-nomad-navy font-bold">{destination.name}</span>
      </div>

      {/* Title & Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-nomad-terracotta text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
              {destination.country}
            </span>
            {destination.region && (
              <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-nomad-gold" /> {destination.region}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-nomad-navy tracking-tight">
            {destination.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-stone-200 shadow-sm text-right">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">À partir de</span>
            <span className="text-2xl font-black text-nomad-navy">
              {destination.starting_price_xof.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
          <button
            onClick={() => openQuoteModal(destination.id)}
            className="bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Devis Sur-Mesure
          </button>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[420px] rounded-3xl overflow-hidden shadow-lg relative bg-stone-900">
        <div
          onClick={() => {
            setSelectedImageIndex(0);
            setIsGalleryOpen(true);
          }}
          className="md:col-span-2 relative h-full cursor-pointer group overflow-hidden"
        >
          <Image
            src={destination.images[0]}
            alt={destination.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
        </div>

        <div className="hidden md:grid grid-rows-2 gap-4 h-full">
          {destination.images.slice(1, 3).map((img, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedImageIndex(idx + 1);
                setIsGalleryOpen(true);
              }}
              className="relative h-full cursor-pointer group overflow-hidden"
            >
              <Image
                src={img}
                alt={`${destination.name} ${idx + 2}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setSelectedImageIndex(0);
            setIsGalleryOpen(true);
          }}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white text-stone-900 text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-white/20 transition"
        >
          <Camera className="w-4 h-4 text-nomad-terracotta" />
          Voir toutes les photos ({destination.images.length})
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Content) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-nomad-navy border-b border-stone-100 pb-3">
              Présentation de la Destination
            </h2>
            <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
              {destination.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-xs font-bold text-nomad-terracotta flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4" /> Climat & Température
                </span>
                <p className="text-xs text-stone-700 font-medium">{destination.climate}</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-xs font-bold text-nomad-gold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Meilleure Période
                </span>
                <p className="text-xs text-stone-700 font-medium">{destination.best_period}</p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-nomad-navy border-b border-stone-100 pb-3">
              Points Forts & Incontournables
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {destination.highlights.map((h, i) => (
                <div
                  key={i}
                  className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-nomad-terracotta shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-stone-800 font-medium leading-snug">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Circuits */}
          {associatedCircuits.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-nomad-navy">Circuits Disponibles pour {destination.name}</h2>
              <div className="grid grid-cols-1 gap-4">
                {associatedCircuits.map((circuit) => (
                  <CircuitCard key={circuit.id} circuit={circuit} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg space-y-5 sticky top-28">
            <div className="space-y-1 border-b border-stone-100 pb-4">
              <span className="text-xs font-bold text-nomad-terracotta uppercase tracking-wider block">
                Nomad Tours • Cotonou
              </span>
              <h3 className="text-xl font-black text-nomad-navy">Demande de Devis pour {destination.name}</h3>
              <p className="text-xs text-stone-500">
                Obtenez une proposition détaillée sous 24h ouvrées.
              </p>
            </div>

            <button
              onClick={() => openQuoteModal(destination.id)}
              className="w-full bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white font-bold text-sm py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Demander mon devis
            </button>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2 text-nomad-navy font-bold">
                <PhoneCall className="w-4 h-4 text-nomad-gold" /> Besoin d&apos;une assistance immédiate ?
              </div>
              <p>Contactez nos conseillers voyage à Cotonou par WhatsApp :</p>
              <p className="font-mono text-xs font-bold text-nomad-navy">+229 01 97 00 00 00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryOpen}
        images={destination.images}
        initialIndex={selectedImageIndex}
        onClose={() => setIsGalleryOpen(false)}
        title={`Galerie - ${destination.name}`}
      />
    </div>
  );
}
